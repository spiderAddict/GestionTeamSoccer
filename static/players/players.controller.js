import { getPlayers, createPlayer, updatePlayer, deletePlayer } from "./players.api.js";
import { playersTemplate } from "./players.template.js";

let players = [];

export async function renderPlayersPage(container) {
  players = await getPlayers();
  container.innerHTML = playersTemplate(players);
  attachEvents(container);
}

function attachEvents(container) {

  // SAVE / DELETE
  container.querySelectorAll("button[data-id]").forEach(btn => {
    btn.onclick = async () => {
      const id = btn.dataset.id;

      if (btn.dataset.action === "save") {
        const first = container.querySelector(`#player-first-${id}`).value;
        const last = container.querySelector(`#player-last-${id}`).value;

        await updatePlayer(id, { first_name: first, last_name: last });
      }

      if (btn.dataset.action === "delete") {
        await deletePlayer(id);
      }

      await renderPlayersPage(container);
    };
  });

  // ADD
  container.querySelector("#add-player-btn").onclick = async () => {
    const first = container.querySelector("#new-player-first").value.trim();
    const last = container.querySelector("#new-player-last").value.trim();
    if (!first || !last) return;

    await createPlayer({ first_name: first, last_name: last });
    await renderPlayersPage(container);
  };
}