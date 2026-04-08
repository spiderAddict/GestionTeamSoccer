import { inputField, textareaField } from '../helpers.js';

export function playersTemplate(players) {
  return `
  <div class="mobile-app">

    <header class="mobile-header">
      <h1>👥 Joueurs</h1>
    </header>

    <div class="players-list">
      ${players.map(p => `
        <div class="card player-card" title="${p.name || ''}">
          <div class="player-info">
            <div class="player-name">
              <strong>${p.name}</strong>
              <span>${p.surname}</span>
              <i>${p.additional_info}</i>              
            </div>
            <span class="player-contact">${p.email ? '📧 ' + p.email : ''}</span>
            <span class="player-contact">${p.phone_number ? '📞 ' + p.phone_number : ''}</span>
          </div>
          <div class="actions player-actions">
            <button class="action-btn" data-id="${p.id}" data-action="edit">✏️</button>
            <button class="action-btn danger" data-id="${p.id}" data-action="delete">🗑️</button>
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
        ${inputField("Nom *", "text", "new-player-first", true, "Le prénom est obligatoire")}
        ${inputField("Surnom (remplace le nom à l'affichage)", "text", "new-player-last")}
        ${inputField("Email", "email", "new-player-email")}
        ${inputField("Téléphone", "tel", "new-player-phone")}
        ${textareaField("Informations supplémentaires", "new-player-info")}
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success" id="save-new-player">Ajouter</button>
        <button class="button" id="cancel-new-player">Annuler</button>
      </footer>
    </div>
  </div>
  `;
}