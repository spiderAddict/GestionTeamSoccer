import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
    return (
        <div>
            <h1>Bienvenue sur l'application de gestion de l'équipe de soccer</h1>
            <nav>
                <ul>
                    <li>
                        <Link to="/players">Gérer les Joueurs</Link>
                    </li>
                    <li>
                        <Link to="/seasons">Gérer les Saisons</Link>
                    </li>
                    <li>
                        <Link to="/matches">Gérer les Matchs</Link>
                    </li>
                    <li>
                        <Link to="/payments">Gérer les Paiements</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default HomePage;