# Codespace 

Le conteneur Codespace démarre avec :
- Python 3.11
- .venv créé automatiquement
- Dépendances Python installées
- Débogage Python prêt
- Git autofetch activé
- Extensions VS Code installées (Python)

Lors du démarrage de l'application, la migration Alembic est effectuée, l'api est créé

# Alembic
## générer une migration vide
alembic revision -m "Rendre email nullable sur player"

## Appliquer la migration manuellement
alembic upgrade head

# Vérifier l'état de la DB
alembic current
alembic history