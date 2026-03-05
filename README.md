# Alembic
## générer une migration vide
alembic revision -m "Rendre email nullable sur player"

## Appliquer la migration manuellement
alembic upgrade head

# Vérifier l'état de la DB
alembic current
alembic history