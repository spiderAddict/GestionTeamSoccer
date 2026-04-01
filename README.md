# Codespace 

Le conteneur Codespace démarre avec :
- Extension Python installée par défaut ✅
- Débogage Python fonctionnel ✅
- Virtualenv prêt et dépendances installées ✅


Lors du démarrage de l'application, la migration Alembic est effectuée, l'api est créé

# Alembic
## générer une migration vide
alembic revision -m "Rendre email nullable sur player"

## Appliquer la migration manuellement
alembic upgrade head

# Vérifier l'état de la DB
alembic current
alembic history