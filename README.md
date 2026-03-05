# Alembic
## générer une migration
alembic revision --autogenerate -m "make last_name nullable"

## Appliquer la migration manuellement
alembic upgrade head