export async function getPlayers() {
  const res = await fetch("/api/players");
  return res.json();
}

export async function createPlayer(data) {
  await fetch("/api/players", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

export async function updatePlayer(id, data) {
  await fetch(`/api/players/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

export async function deletePlayer(id) {
  await fetch(`/api/players/${id}`, {
    method: "DELETE"
  });
}