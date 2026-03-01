import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Change this to your Flask API URL

// Players
export const getPlayers = async () => {
    const response = await axios.get(`${API_URL}/players`);
    return response.data;
};

export const createPlayer = async (player) => {
    const response = await axios.post(`${API_URL}/players`, player);
    return response.data;
};

export const updatePlayer = async (id, player) => {
    const response = await axios.put(`${API_URL}/players/${id}`, player);
    return response.data;
};

export const deletePlayer = async (id) => {
    await axios.delete(`${API_URL}/players/${id}`);
};

// Seasons
export const getSeasons = async () => {
    const response = await axios.get(`${API_URL}/seasons`);
    return response.data;
};

export const createSeason = async (season) => {
    const response = await axios.post(`${API_URL}/seasons`, season);
    return response.data;
};

export const updateSeason = async (id, season) => {
    const response = await axios.put(`${API_URL}/seasons/${id}`, season);
    return response.data;
};

export const deleteSeason = async (id) => {
    await axios.delete(`${API_URL}/seasons/${id}`);
};

// Matches
export const getMatches = async () => {
    const response = await axios.get(`${API_URL}/matches`);
    return response.data;
};

export const createMatch = async (match) => {
    const response = await axios.post(`${API_URL}/matches`, match);
    return response.data;
};

export const updateMatch = async (id, match) => {
    const response = await axios.put(`${API_URL}/matches/${id}`, match);
    return response.data;
};

export const deleteMatch = async (id) => {
    await axios.delete(`${API_URL}/matches/${id}`);
};

// Payments
export const getPayments = async () => {
    const response = await axios.get(`${API_URL}/payments`);
    return response.data;
};

export const createPayment = async (payment) => {
    const response = await axios.post(`${API_URL}/payments`, payment);
    return response.data;
};

export const updatePayment = async (id, payment) => {
    const response = await axios.put(`${API_URL}/payments/${id}`, payment);
    return response.data;
};

export const deletePayment = async (id) => {
    await axios.delete(`${API_URL}/payments/${id}`);
};