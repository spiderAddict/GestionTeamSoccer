# --- Étape 1 : image de base Python ---
FROM python:3.12-slim

# --- Variables d'environnement pour éviter les prompts ---
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# --- Créer le répertoire de travail ---
WORKDIR /app

# --- Copier requirements et installer ---
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# --- Copier le reste de l'application ---
COPY . .

# --- Exposer le port utilisé par FastAPI ---
EXPOSE 5000

# --- Commande par défaut pour démarrer l'application ---
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000", "--reload"]