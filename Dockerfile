# --- Étape 1 : image de base Python ---
FROM python:3.12-slim

# --- Variables d'environnement pour éviter les prompts ---
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# --- Créer le répertoire de travail ---
WORKDIR /app

# Version de l'application
ARG APP_VERSION=0.0.0-dev
ENV APP_VERSION=$APP_VERSION

# --- Copier requirements et installer ---
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# --- Copier le reste de l'application ---
COPY . /app

# dossier database existe (utile si volume vide)
RUN mkdir -p /app/database

# --- Créer un utilisateur non-root ---
RUN useradd -m appuser
# Changer le propriétaire du répertoire de travail
RUN chown -R appuser:appuser /app
# Passer à l'utilisateur non-root
USER appuser

# --- Exposer le port utilisé par FastAPI ---
EXPOSE 5000

# --- Commande par défaut pour démarrer l'application ---
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000", "--reload"]
