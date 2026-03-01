# Gestion Team Soccer

Application de gestion d'équipe de football avec suivi des joueurs, saisons, matchs et paiements.

## Architecture

- **Frontend** : React + TypeScript + Vite
- **Backend** : Python + Flask
- **Base de données** : SQLite
- **Déploiement** : Docker

## Prérequis

- Docker & Docker Compose (optionnel)
- Node.js 20+
- Python 3.11+

## Installation locale

### Backend

```bash
cd backend
pip install -r requirements.txt
python run.py
```

L'API sera disponible à `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

L'application sera disponible à `http://localhost:5173`

## Déploiement avec Docker

### Build l'image Docker

```bash
docker build -t gestion-team-soccer:latest .
```

### Lancer le conteneur

```bash
docker run -p 5000:5000 \
  -v $(pwd)/instance:/app/instance \
  gestion-team-soccer:latest
```

L'application sera disponible à `http://localhost:5000`

## CI/CD avec GitHub Actions

Chaque commit sur la branche `main` déclenche automatiquement :

1. **Validation commitlint** : Vérifie que le message de commit respecte les conventions
2. **Build Docker** : Construit une nouvelle image Docker avec le tag de version

### Format des commits

Utilisez le format Conventional Commits :

```
type(scope): description

feat: ajouter nouvelle fonctionnalité
fix: corriger un bug
docs: mettre à jour la documentation
test: ajouter des tests
chore: mise à jour des dépendances
```

Exemples valides :
```
feat(player): ajouter la suppression de joueur
fix(match): corriger le calcul de la date
docs: mettre à jour le README
```

## Modèle de données

### Joueur
- `id` : Identifiant unique (PK)
- `nom` : Nom (obligatoire)
- `prenom` : Prénom (obligatoire)
- `email` : Email (optionnel)
- `telephone` : Téléphone (optionnel)
- `infos` : Informations supplémentaires (optionnel)

### Saison
- `id` : Identifiant unique (PK)
- `nom` : Nom (obligatoire)
- `date_debut` : Date de début (obligatoire)

### Match
- `id` : Identifiant unique (PK)
- `date` : Date du match (obligatoire)
- `saison_id` : Référence à une saison (FK)
- `joueurs` : Liste des joueurs présents (M2M)

### Paiement
- `id` : Identifiant unique (PK)
- `joueur_payeur_id` : Joueur qui paie (FK)
- `joueur_paye_id` : Joueur qui est payé (FK)
- `date_paiement` : Date du paiement (obligatoire)
- `match_id` : Match associé (FK)
- `montant` : Montant du paiement

## Fonctionnalités

- ✅ Créer/modifier/supprimer des joueurs
- ✅ Créer/modifier/supprimer des saisons
- ✅ Créer/modifier/supprimer des matchs
- ✅ Créer/modifier/supprimer des paiements
- ✅ Déploiement automatique via Docker
- ✅ Validation des commits avec commitlint

## Structure du projet

```
GestionTeamSoccer/
├── frontend/           # Application React
├── backend/            # API Flask
├── Dockerfile          # Configuration Docker
├── .github/workflows/  # GitHub Actions
└── README.md          # Ce fichier
```
## Structure du projet

Le projet est organisé comme suit :

```
GestionTeamSoccer
├── frontend
│   ├── src
│   │   ├── components
│   │   │   ├── Players
│   │   │   │   └── PlayerForm.tsx
│   │   │   ├── Seasons
│   │   │   │   └── SeasonForm.tsx
│   │   │   ├── Matches
│   │   │   │   └── MatchForm.tsx
│   │   │   └── Payments
│   │   │       └── PaymentForm.tsx
│   │   ├── pages
│   │   │   ├── HomePage.tsx
│   │   │   ├── PlayersPage.tsx
│   │   │   ├── SeasonsPage.tsx
│   │   │   ├── MatchesPage.tsx
│   │   │   └── PaymentsPage.tsx
│   │   ├── services
│   │   │   └── api.ts
│   │   ├── types
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── backend
│   ├── app
│   │   ├── __init__.py
│   │   ├── models.py
│   │   ├── routes
│   │   │   ├── __init__.py
│   │   │   ├── players.py
│   │   │   ├── seasons.py
│   │   │   ├── matches.py
│   │   │   └── payments.py
│   │   └── config.py
│   ├── instance
│   │   └── gestion_team.db
│   ├── requirements.txt
│   └── run.py
└── README.md
```

## Utilisation

1. **Cloner le repository**
   ```bash
   git clone https://github.com/spiderAddict/GestionTeamSoccer.git
   cd GestionTeamSoccer
   ```

2. **Suivre les instructions d'installation locale** (voir ci-dessus)

3. **Ou déployer avec Docker** (voir ci-dessus)

4. **Accéder à l'application** et commencer à gérer votre équipe !

## Contributeurs

- spiderAddict

Les contributions sont les bienvenues ! N'hésitez pas à soumettre des demandes de tirage ou à ouvrir des problèmes pour discuter des améliorations.

## License

Ce projet est sous licence MIT.