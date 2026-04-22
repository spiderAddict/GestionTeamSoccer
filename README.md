# Codespace 

Le conteneur Codespace démarre avec :
- Python 3.11
- .venv créé automatiquement
- Dépendances Python installées
- Débogage Python prêt
- Git autofetch activé
- Extensions VS Code installées (Python)

Lors du démarrage de l'application, la migration Alembic est effectuée, l'api est créé

# Logs

## Uvicorn 
Uvicorn propose 2 loggers par défaut

- logs requêtes (uvicorn.access => logs automatiques
- logs serveur (uvicorn.error) => coder les levées d'exceptions

## Résumé

| Besoin                 | Solution              |
| ---------------------- | --------------------- |
| Voir les requêtes HTTP | `--access-log`        |
| Voir les erreurs       | `--log-level debug`   |
| Logs métier            | logger custom (`app`) |
| Logs détaillés POST    | middleware            |


# Alembic
## générer une migration vide
alembic revision -m "Rendre email nullable sur player"

## Appliquer la migration manuellement
alembic upgrade head

## Vérifier l'état de la DB
alembic current

## Historique des versions
alembic history

## Forcer alembic a se considérer à jour
alembic stamp head