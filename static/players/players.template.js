// players.template.js

export function playersTemplate(players) {
  return `
    <h1 class="title">Joueurs</h1>

    <div class="field has-addons mb-4">
      <div class="control">
        <input class="input" type="text" placeholder="Prénom" id="new-player-first">
      </div>
      <div class="control">
        <input class="input" type="text" placeholder="Nom" id="new-player-last">
      </div>
      <div class="control">
        <button class="button is-success" id="add-player-btn">
          <span class="icon"><i class="fas fa-plus"></i></span>
          <span>Ajouter</span>
        </button>
      </div>
    </div>

    <ul id="players-list">
      ${players.map(p => `
        <li class="mb-2" id="player-li-${p.id}">
          <input type="text" value="${p.first_name}" id="player-first-${p.id}" class="input is-small">
          <input type="text" value="${p.last_name}" id="player-last-${p.id}" class="input is-small ml-1">
          <button class="button is-small is-info ml-2" data-id="${p.id}" data-action="save">💾</button>
          <button class="button is-small is-danger ml-1" data-id="${p.id}" data-action="delete">🗑️</button>
        </li>
      `).join("")}
    </ul>
  `;
}