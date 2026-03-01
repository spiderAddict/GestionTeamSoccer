import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMatches } from '../services/api';
import { Match } from '../types';

const MatchesPage: React.FC = () => {
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchMatches = async () => {
            const data = await getMatches();
            setMatches(data);
            setLoading(false);
        };

        fetchMatches();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Gestion des Matchs</h1>
            <Link to="/matches/new">Créer un Match</Link>
            <ul>
                {matches.map((match) => (
                    <li key={match.id}>
                        {match.date} - Saison: {match.seasonId}
                        <Link to={`/matches/${match.id}`}>Modifier</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MatchesPage;