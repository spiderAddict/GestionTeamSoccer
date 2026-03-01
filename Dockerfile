FROM python:3.11-slim as backend-builder

WORKDIR /app

# Installer les dépendances Python
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

FROM node:20-slim as frontend-builder

WORKDIR /app

# Construire le frontend React
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

FROM python:3.11-slim

# Créer un utilisateur non-root
RUN useradd -m -u 1000 appuser

WORKDIR /app

# Copier les dépendances Python depuis le builder
COPY --from=backend-builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=backend-builder /usr/local/bin /usr/local/bin

# Copier le backend
COPY backend/ ./backend/

# Copier le frontend construit
COPY --from=frontend-builder /app/dist ./frontend/dist

# Créer les répertoires nécessaires avec permissions
RUN mkdir -p /app/instance && chown -R appuser:appuser /app

USER appuser

EXPOSE 5000

CMD ["python", "backend/run.py"]