import React, { useState, useEffect } from 'react';
import { getPlayers, getMatches, createPayment } from '../../services/api';
import { Player, Match, Payment } from '../../types';

const PaymentForm: React.FC = () => {
    const [players, setPlayers] = useState<Player[]>([]);
    const [matches, setMatches] = useState<Match[]>([]);
    const [payerId, setPayerId] = useState<number | undefined>(undefined);
    const [payeeId, setPayeeId] = useState<number | undefined>(undefined);
    const [matchId, setMatchId] = useState<number | undefined>(undefined);
    const [paymentDate, setPaymentDate] = useState<string>('');
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchPlayers = async () => {
            const playersData = await getPlayers();
            setPlayers(playersData);
        };

        const fetchMatches = async () => {
            const matchesData = await getMatches();
            setMatches(matchesData);
        };

        fetchPlayers();
        fetchMatches();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!payerId || !payeeId || !matchId || !paymentDate) {
            setError('Tous les champs sont obligatoires.');
            return;
        }

        const payment: Payment = {
            payerId,
            payeeId,
            matchId,
            paymentDate,
        };

        try {
            await createPayment(payment);
            // Reset form or handle success
        } catch (err) {
            setError('Erreur lors de la création du paiement.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Créer un Paiement</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <label>Payer:</label>
                <select value={payerId} onChange={(e) => setPayerId(Number(e.target.value))}>
                    <option value="">Sélectionner un joueur</option>
                    {players.map(player => (
                        <option key={player.id} value={player.id}>{player.firstName} {player.lastName}</option>
                    ))}
                </select>
            </div>
            <div>
                <label>Payé:</label>
                <select value={payeeId} onChange={(e) => setPayeeId(Number(e.target.value))}>
                    <option value="">Sélectionner un joueur</option>
                    {players.map(player => (
                        <option key={player.id} value={player.id}>{player.firstName} {player.lastName}</option>
                    ))}
                </select>
            </div>
            <div>
                <label>Date de Paiement:</label>
                <input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} required />
            </div>
            <div>
                <label>Match Associé:</label>
                <select value={matchId} onChange={(e) => setMatchId(Number(e.target.value))}>
                    <option value="">Sélectionner un match</option>
                    {matches.map(match => (
                        <option key={match.id} value={match.id}>{match.date}</option>
                    ))}
                </select>
            </div>
            <button type="submit">Créer Paiement</button>
        </form>
    );
};

export default PaymentForm;