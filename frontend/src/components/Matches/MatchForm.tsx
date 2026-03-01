import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { fetchSeasons, createMatch, updateMatch } from '../../services/api';
import { Match } from '../../types';

interface MatchFormProps {
  matchData?: Match;
  onSuccess: () => void;
}

const MatchForm: React.FC<MatchFormProps> = ({ matchData, onSuccess }) => {
  const { register, handleSubmit, setValue } = useForm();
  const [seasons, setSeasons] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const loadSeasons = async () => {
      const seasonsData = await fetchSeasons();
      setSeasons(seasonsData);
    };
    loadSeasons();

    if (matchData) {
      setValue('date', matchData.date);
      setValue('seasonId', matchData.seasonId);
    }
  }, [matchData, setValue]);

  const onSubmit = async (data: any) => {
    if (matchData) {
      await updateMatch(matchData.id, data);
    } else {
      await createMatch(data);
    }
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Date du Match:</label>
        <input type="date" {...register('date', { required: true })} />
      </div>
      <div>
        <label>Saison Associée:</label>
        <select {...register('seasonId', { required: true })}>
          {seasons.map(season => (
            <option key={season.id} value={season.id}>
              {season.name}
            </option>
          ))}
        </select>
      </div>
      <button type="submit">{matchData ? 'Modifier' : 'Créer'} le Match</button>
    </form>
  );
};

export default MatchForm;