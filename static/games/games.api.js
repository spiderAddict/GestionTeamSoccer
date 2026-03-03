
export async function getGames() {
  const res = await fetch("/api/games");
  return await res.json();
}

export async function createGame(match) {
  await fetch("/api/games", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(match)
  });
}

export async function updateGame(id, match) {
  await fetch(`/api/games/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(match)
  });
}

export async function deleteGame(id) {
  await fetch(`/api/games/${id}`, { method: "DELETE" });
}