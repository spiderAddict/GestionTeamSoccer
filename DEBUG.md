# Guide de Debug Local

Ce document explique comment configurer et déboguer l'application localement.

## Debug Backend (Flask)

### Configuration de l'environnement

```bash
cd backend
```

#### 1. Créer un fichier `.env` pour le développement

```bash
# filepath: /workspaces/GestionTeamSoccer/backend/.env
FLASK_APP=run.py
FLASK_ENV=development
FLASK_DEBUG=1
DATABASE_URL=sqlite:///instance/gestion_team.db
```

#### 2. Installer les dépendances avec outils de debug

```bash
pip install -r requirements.txt
pip install flask-debugtoolbar  # Barre d'outils de debug Flask
pip install python-dotenv       # Charger les variables d'environnement
```

#### 3. Lancer le serveur en mode debug

```bash
# Mode développement avec rechargement automatique
python run.py

# Ou explicitement avec Flask CLI
flask run --debug
```

Le serveur démarre sur `http://localhost:5000` avec :
- ✅ Rechargement automatique du code
- ✅ Debugger interactif en cas d'erreur
- ✅ Barre d'outils de debug en bas de la page

### Utiliser le debugger Python (pdb)

Ajouter des points d'arrêt dans le code :

```python
# filepath: /workspaces/GestionTeamSoccer/backend/app/routes/players.py
import pdb

@app.route('/players', methods=['GET'])
def get_players():
    pdb.set_trace()  # Le programme s'arrête ici
    # Vous pouvez maintenant inspecter les variables
    return jsonify(players)
```

Commandes utiles dans le debugger :
- `l` : Lister le code actuel
- `n` : Prochaine ligne
- `s` : Entrer dans une fonction
- `c` : Continuer jusqu'au prochain breakpoint
- `p variable` : Afficher la valeur d'une variable
- `h` : Afficher l'aide

### Logs Flask

Modifier `run.py` pour avoir des logs détaillés :

```python
# filepath: /workspaces/GestionTeamSoccer/backend/run.py
import logging

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
```

## Debug Frontend (React + Vite)

### Configuration de l'environnement

```bash
cd frontend
```

#### 1. Créer un fichier `.env.local`

```bash
# filepath: /workspaces/GestionTeamSoccer/frontend/.env.local
VITE_API_URL=http://localhost:5000
VITE_DEBUG=true
```

#### 2. Lancer le serveur de développement Vite

```bash
npm run dev
```

L'application sera disponible sur `http://localhost:5173` avec :
- ✅ Hot Module Replacement (HMR)
- ✅ Rechargement instantané du code

### Utiliser les DevTools du navigateur

#### Chrome/Edge DevTools

1. Ouvrir : `F12` ou `Ctrl+Shift+I`
2. Onglet **Sources** : Ajouter des breakpoints
3. Onglet **Console** : Exécuter du code JavaScript
4. Onglet **Network** : Inspecter les requêtes API

#### React DevTools (Extension navigateur)

Installer l'extension :
- [React DevTools pour Chrome](https://chrome.google.com/webstore/detail/react-developer-tools)
- [React DevTools pour Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

Fonctionnalités :
- Inspecter l'arbre des composants
- Modifier les props/state en temps réel
- Tracer les rendus

### Console TypeScript

Ajouter des logs détaillés dans le code :

```typescript
// filepath: /workspaces/GestionTeamSoccer/frontend/src/services/api.ts
const api = {
  getPlayers: async () => {
    console.log('[API] Fetching players...');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/players`);
      const data = await response.json();
      console.log('[API] Players fetched:', data);
      return data;
    } catch (error) {
      console.error('[API] Error fetching players:', error);
      throw error;
    }
  }
};
```

## Debug avec VS Code

### Configuration de debug pour Flask

Créer un fichier `launch.json` :

```json
# filepath: /workspaces/GestionTeamSoccer/.vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Flask Backend",
      "type": "python",
      "request": "launch",
      "module": "flask",
      "env": {
        "FLASK_APP": "backend/run.py",
        "FLASK_ENV": "development"
      },
      "args": ["run", "--host=0.0.0.0"],
      "jinja": true,
      "cwd": "${workspaceFolder}"
    },
    {
      "name": "Chrome Frontend",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/frontend",
      "sourceMaps": true
    }
  ],
  "compounds": [
    {
      "name": "Full Stack Debug",
      "configurations": ["Flask Backend", "Chrome Frontend"]
    }
  ]
}
```

#### Démarrer le debug Full Stack

1. Appuyer sur `F5` ou aller dans **Run → Start Debugging**
2. Sélectionner **Full Stack Debug**
3. Les deux serveurs se lancent et le navigateur s'ouvre

### Configuration VS Code pour Python

Installer l'extension **Python** (Microsoft) et ajouter au `settings.json` :

```json
# filepath: /workspaces/GestionTeamSoccer/.vscode/settings.json
{
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": true,
  "python.formatting.provider": "black",
  "editor.formatOnSave": true,
  "[python]": {
    "editor.defaultFormatter": "ms-python.python"
  }
}
```

## Debug en Docker

### Build avec variables de debug

```bash
# Passer en mode debug
docker build -t gestion-team-soccer:debug .

# Lancer avec logs verbeux
docker run -it \
  -p 5000:5000 \
  -p 5173:5173 \
  -e FLASK_DEBUG=1 \
  -v $(pwd)/backend:/app/backend \
  -v $(pwd)/frontend:/app/frontend \
  gestion-team-soccer:debug
```

### Debug avec Docker Compose

Créer `docker-compose.dev.yml` :

```yaml
# filepath: /workspaces/GestionTeamSoccer/docker-compose.dev.yml
version: '3.8'

services:
  backend:
    build: .
    command: python backend/run.py
    ports:
      - "5000:5000"
    volumes:
      - ./backend:/app/backend
      - ./instance:/app/instance
    environment:
      FLASK_ENV: development
      FLASK_DEBUG: 1
    stdin_open: true
    tty: true

  frontend:
    image: node:20-slim
    working_dir: /app
    command: npm run dev
    ports:
      - "5173:5173"
    volumes:
      - ./frontend:/app
    environment:
      VITE_API_URL: http://localhost:5000
```

Lancer avec :

```bash
docker-compose -f docker-compose.dev.yml up
```

## Checklist de Debug

- [ ] Vérifier que les deux serveurs (backend + frontend) sont en cours d'exécution
- [ ] Ouvrir la console du navigateur pour les erreurs JavaScript
- [ ] Vérifier les logs Flask dans le terminal
- [ ] Utiliser les DevTools React pour inspecter l'état
- [ ] Vérifier l'onglet **Network** pour les requêtes API
- [ ] S'assurer que les bases de données SQLite existent et sont accessibles
- [ ] Vérifier les variables d'environnement (`.env`, `.env.local`)

## Commandes utiles

```bash
# Backend
flask shell              # Shell interactif Flask
flask db init            # Initialiser les migrations
flask db migrate         # Créer une migration
flask db upgrade         # Appliquer les migrations

# Frontend
npm run build           # Build pour la production
npm run preview         # Aperçu du build
npm test                # Lancer les tests

# Général
curl http://localhost:5000/players  # Tester l'API
"$BROWSER" http://localhost:5173    # Ouvrir dans le navigateur
```

## Ressources

- [Flask Debugging](https://flask.palletsprojects.com/en/latest/debugging/)
- [Vite Guide](https://vitejs.dev/guide/)
- [React DevTools](https://react-devtools-tutorial.vercel.app/)
- [VS Code Python Debug](https://code.visualstudio.com/docs/python/debugging)