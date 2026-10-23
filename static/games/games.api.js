import { fetchJson } from "../helpers.js";

const API_GAMES_URL = "/api/matchs";

/** @param {number} seasonId */
export async function getGames(seasonId) {
  return fetchJson(`${API_GAMES_URL}?season_id=${seasonId}`);
}

export async function createGame(match) {
  await fetchJson(API_GAMES_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(match)
  });
}

export async function updateGame(id, match) {
  await fetchJson(`${API_GAMES_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(match)
  });
}

export async function deleteGame(id) {
  await fetchJson(`${API_GAMES_URL}/${id}`, { method: "DELETE" });
}
