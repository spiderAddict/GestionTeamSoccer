FROM python:3.12-slim

WORKDIR /app

# Installer les dépendances Python
COPY backend/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Créer les répertoires nécessaires avec permissions
RUN mkdir -p /app/instance && chown -R appuser:appuser /app

USER appuser

EXPOSE 5000

CMD ["python", "run.py"]