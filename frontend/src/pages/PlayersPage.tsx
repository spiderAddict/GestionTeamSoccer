import React, { useEffect, useState } from 'react';
import { Player } from '../types';
import { fetchPlayers } from '../services/api';
import PlayerForm from '../components/Players/PlayerForm';

const PlayersPage: React.FC = () => {
    const [players, setPlayers] = useState<Player[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

    useEffect(() => {
        const loadPlayers = async () => {
            const playersData = await fetchPlayers();
            setPlayers(playersData);
        };
        loadPlayers();
    }, []);

    const handleEdit = (player: Player) => {
        setSelectedPlayer(player);
        setIsEditing(true);
    };

    const handleCloseForm = () => {
        setIsEditing(false);
        setSelectedPlayer(null);
    };

    return (
        <div>
            <h1>Gestion des Joueurs</h1>
            <button onClick={() => { setIsEditing(true); setSelectedPlayer(null); }}>
                Ajouter un Joueur
            </button>
            <ul>
                {players.map(player => (
                    <li key={player.id}>
                        {player.firstName} {player.lastName}
                        <button onClick={() => handleEdit(player)}>Modifier</button>
                    </li>
                ))}
            </ul>
            {isEditing && (
                <PlayerForm player={selectedPlayer} onClose={handleCloseForm} />
            )}
        </div>
    );
};

export default PlayersPage;