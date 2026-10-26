# --- Étape 1 : image de base Python ---
FROM python:3.12-slim

# --- Variables d'environnement pour éviter les prompts ---
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    LOG_LEVEL=info \
    APP_ENV=prod \
    PORT=5000

# --- Créer le répertoire de travail ---
WORKDIR /app

# Version de l'application
ARG APP_VERSION=0.0.0-dev
ENV APP_VERSION=$APP_VERSION

# --- Copier requirements et installer ---
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# --- Créer un utilisateur non-root ---
RUN useradd -m appuser

# --- Copier uniquement ce qui sert à l'exécution ---
# Le code reste propriété de root : l'application ne peut pas le modifier
COPY main.py database.py alembic.ini ./
COPY alembic ./alembic
COPY models ./models
COPY routes ./routes
COPY static ./static

# Seul le dossier de la base SQLite doit être accessible en écriture
RUN mkdir -p /app/database && chown appuser:appuser /app/database

# Passer à l'utilisateur non-root
USER appuser

# --- Exposer le port utilisé par FastAPI ---
EXPOSE ${PORT}

# curl n'est pas dans l'image slim : la sonde utilise Python
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:5000/api/version', timeout=4)" || exit 1

# --- Commande de lancement ---
CMD ["python", "main.py"]
