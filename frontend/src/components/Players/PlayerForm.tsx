import React, { useState } from 'react';

const PlayerForm = ({ onSubmit, initialData }) => {
    const [firstName, setFirstName] = useState(initialData ? initialData.firstName : '');
    const [lastName, setLastName] = useState(initialData ? initialData.lastName : '');
    const [email, setEmail] = useState(initialData ? initialData.email : '');
    const [phone, setPhone] = useState(initialData ? initialData.phone : '');
    const [additionalInfo, setAdditionalInfo] = useState(initialData ? initialData.additionalInfo : '');

    const handleSubmit = (e) => {
        e.preventDefault();
        const playerData = {
            firstName,
            lastName,
            email,
            phone,
            additionalInfo,
        };
        onSubmit(playerData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Prénom:</label>
                <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Nom:</label>
                <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <label>Téléphone:</label>
                <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
            </div>
            <div>
                <label>Infos supplémentaires:</label>
                <textarea
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                />
            </div>
            <button type="submit">Soumettre</button>
        </form>
    );
};

export default PlayerForm;