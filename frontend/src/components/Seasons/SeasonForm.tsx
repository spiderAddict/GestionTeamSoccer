import React, { useState } from 'react';

const SeasonForm = ({ onSubmit, initialData }) => {
    const [name, setName] = useState(initialData ? initialData.name : '');
    const [startDate, setStartDate] = useState(initialData ? initialData.startDate : '');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name, startDate });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name">Nom de la saison:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="startDate">Date de début:</label>
                <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Enregistrer</button>
        </form>
    );
};

export default SeasonForm;