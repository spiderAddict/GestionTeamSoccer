const API_GAMES_URL = "/api/matchs";

export async function getGames() {
  const res = await fetch(API_GAMES_URL);
  return await res.json();
}

export async function createGame(match) {
  await fetch(API_GAMES_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(match)
  });
}

export async function updateGame(id, match) {
  await fetch(`${API_GAMES_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(match)
  });
}

export async function deleteGame(id) {
  await fetch(`${API_GAMES_URL}/${id}`, { method: "DELETE" });
}