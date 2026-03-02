let players = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" }
];

export function renderPlayers() {
  return `
    <h1 class="title">Joueurs</h1>

    <!-- Formulaire ajout -->
    <div class="field has-addons mb-4">
      <div class="control">
        <input class="input" type="text" placeholder="Nouveau joueur" id="new-player-name">
      </div>
      <div class="control">
        <button class="button is-success" id="add-player-btn">
          <span class="icon"><i class="fas fa-plus"></i></span>
          <span>Ajouter</span>
        </button>
      </div>
    </div>

    <!-- Liste -->
    <ul id="players-list">
      ${players.map(p => `
        <li class="mb-2">
          <input type="text" value="${p.name}" id="player-${p.id}" class="input is-small">
          <button class="button is-small is-info ml-2" data-id="${p.id}" data-action="save">
            <span class="icon"><i class="fas fa-save"></i></span>
          </button>
          <button class="button is-small is-danger ml-1" data-id="${p.id}" data-action="delete">
            <span class="icon"><i class="fas fa-trash"></i></span>
          </button>
        </li>
      `).join("")}
    </ul>
  `;
}

export function attachPlayerEvents() {
  document.querySelectorAll("button[data-id]").forEach(btn => {
    btn.onclick = () => {
      const id = Number(btn.dataset.id);
      if (btn.dataset.action === "save") {
        const input = document.getElementById(`player-${id}`);
        const player = players.find(p => p.id === id);
        if (player) player.name = input.value;
      } else if (btn.dataset.action === "delete") {
        players = players.filter(p => p.id !== id);
        renderAndAttach();
      }
    }
  });

  const addBtn = document.getElementById("add-player-btn");
  const newInput = document.getElementById("new-player-name");
  addBtn.onclick = () => {
    const name = newInput.value.trim();
    if (!name) return;
    const newId = players.length ? Math.max(...players.map(p=>p.id))+1 : 1;
    players.push({id: newId, name});
    newInput.value = "";
    renderAndAttach();
  }
}

// Pour re-render après modification/suppression
function renderAndAttach() {
  document.getElementById("app").innerHTML = renderPlayers();
  attachPlayerEvents();
}