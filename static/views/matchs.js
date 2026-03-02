let matchs = [
  { id: 1, name: "Match A" },
  { id: 2, name: "Match B" }
];

export function renderMatchs() {
  return `
    <h1 class="title">Matchs</h1>

    <div class="field has-addons mb-4">
      <div class="control">
        <input class="input" type="text" placeholder="Nouveau match" id="new-match-name">
      </div>
      <div class="control">
        <button class="button is-success" id="add-match-btn">Ajouter</button>
      </div>
    </div>

    <ul id="matchs-list">
      ${matchs.map(m => `
        <li class="mb-2">
          <input type="text" value="${m.name}" id="match-${m.id}" class="input is-small">
          <button class="button is-small is-info ml-2" data-id="${m.id}" data-action="save">💾</button>
          <button class="button is-small is-danger ml-1" data-id="${m.id}" data-action="delete">🗑️</button>
        </li>
      `).join("")}
    </ul>
  `;
}

export function attachMatchEvents() {
  document.querySelectorAll("button[data-id]").forEach(btn => {
    btn.onclick = () => {
      const id = Number(btn.dataset.id);
      if (btn.dataset.action === "save") {
        const input = document.getElementById(`match-${id}`);
        const match = matchs.find(m => m.id === id);
        if (match) match.name = input.value;
      } else if (btn.dataset.action === "delete") {
        matchs = matchs.filter(m => m.id !== id);
        renderAndAttach();
      }
    }
  });

  const addBtn = document.getElementById("add-match-btn");
  const newInput = document.getElementById("new-match-name");
  addBtn.onclick = () => {
    const name = newInput.value.trim();
    if (!name) return;
    const newId = matchs.length ? Math.max(...matchs.map(m=>m.id))+1 : 1;
    matchs.push({id: newId, name});
    newInput.value = "";
    renderAndAttach();
  }
}

function renderAndAttach() {
  document.getElementById("app").innerHTML = renderMatchs();
  attachMatchEvents();
}