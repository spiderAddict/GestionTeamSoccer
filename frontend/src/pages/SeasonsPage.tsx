import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSeasons } from '../services/api';
import { Season } from '../types';

const SeasonsPage: React.FC = () => {
    const [seasons, setSeasons] = useState<Season[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchSeasons = async () => {
            try {
                const data = await getSeasons();
                setSeasons(data);
            } catch (error) {
                console.error('Error fetching seasons:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSeasons();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Gestion des Saisons</h1>
            <Link to="/seasons/new">Créer une nouvelle saison</Link>
            <ul>
                {seasons.map((season) => (
                    <li key={season.id}>
                        {season.name} - {new Date(season.startDate).toLocaleDateString()}
                        <Link to={`/seasons/${season.id}/edit`}>Modifier</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SeasonsPage;