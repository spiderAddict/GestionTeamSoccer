import { fetchJson } from "../helpers.js";

const API_PLAYERS_URL = "/api/players";

export async function getPlayers() {
  const res = await fetch(API_PLAYERS_URL);
  return res.json();
}

export async function createPlayer(data) {
  await fetch(API_PLAYERS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

export async function updatePlayer(id, data) {
  await fetch(`${API_PLAYERS_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

export async function deletePlayer(id) {
  await fetchJson(`${API_PLAYERS_URL}/${id}`, {
    method: "DELETE"
  });
}