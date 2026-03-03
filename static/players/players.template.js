export function playersTemplate(players) {
  return `
  <div class="mobile-app">

    <header class="mobile-header">
      <h1>👥 Joueurs</h1>
    </header>

    <div class="players-list">
      ${players.map(p => `
        <div class="player-card" title="${p.additional_info || ''}">
          <div class="player-info">
            <strong>${p.first_name}</strong>
            <span>${p.last_name}</span>
            <span class="player-contact">${p.email ? '📧 ' + p.email : ''}</span>
            <span class="player-contact">${p.phone ? '📞 ' + p.phone : ''}</span>
          </div>

          <div class="player-actions">
            <button data-id="${p.id}" data-action="edit">✏️</button>
            <button data-id="${p.id}" data-action="delete">🗑</button>
          </div>
        </div>
      `).join("")}
    </div>
    <button id="add-player-btn" class="fab">+</button>
  </div>

  <div id="add-player-modal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Ajouter un joueur</p>
        <button class="delete" aria-label="close" id="close-modal"></button>
      </header>
      <section class="modal-card-body">
        <input type="hidden" id="modal-player-id">
        <div class="field">
          <label class="label">Prénom</label>
          <div class="control">
            <input class="input" type="text" id="new-player-first">
          </div>
        </div>
        <div class="field">
          <label class="label">Nom</label>
          <div class="control">
            <input class="input" type="text" id="new-player-last">
          </div>
        </div>
        <div class="field">
          <label class="label">Email</label>
          <div class="control">
            <input class="input" type="email" id="new-player-email">
          </div>
        </div>
        <div class="field">
          <label class="label">Téléphone</label>
          <div class="control">
            <input class="input" type="tel" id="new-player-phone">
          </div>
        </div>
        <div class="field">
          <label class="label">Additional info</label>
          <div class="control">
            <textarea class="textarea" id="new-player-info"></textarea>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success" id="save-new-player">Ajouter</button>
        <button class="button" id="cancel-new-player">Annuler</button>
      </footer>
    </div>
  </div>
  `;
}