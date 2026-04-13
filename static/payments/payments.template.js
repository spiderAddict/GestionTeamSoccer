import { selectField, displayPlayerName, pluralize } from '../helpers.js';
import { getDefaultReceiverId } from './payments.logic.js';

export function paymentsTemplate(payments, players, games) {
  const defaultReceiverId = getDefaultReceiverId(players);

  return `
  <div class="mobile-app">

    <header class="mobile-header">
      <h1>💸 Paiements</h1>
    </header>

    <div class="payments-list">
      ${payments.map(p => `
        <div class="card payment-card">
          <div>
            <div class="tag is-info has-text-weight-bold">
              ${players.find(pl => pl.id === p.payer_id).name} ➟ ${players.find(pl => pl.id === p.receiver_id).name}
            </div>
            <div class="tag is-info is-light">
              📅 ${new Date(p.created_at).toLocaleDateString('fr-FR')}              
            </div>
            <span class="tag is-success">
                ${pluralize(p.number_of_matches_paid, "match payé")}
              </span>
            <div class="payment-games-list">
              ${p.match_ids
                .map(match_id => games.find(game => game.id === match_id))
                .filter(Boolean)
                .map(game => `
                  <span class="tag game-badge">
                    ${game.date}${game.versus_team ? " - " + game.versus_team : ""}
                  </span>
                `)
                .join("")}
            </div>
          </div>
          <div class="actions">
            <button class="action-btn danger" data-id="${p.id}" data-action="delete">🗑️</button>
          </div>
        </div>
      `).join("")}
    </div>
    <button id="add-payment-btn" class="fab">+</button>
  </div>

  <div id="add-payment-modal" class="modal">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Ajouter un paiement</p>
        <button class="delete" aria-label="close" id="close-modal"></button>
      </header>
      <section class="modal-card-body">
        ${selectField("Payeur *", "new-payment-payer", players.map(p => ({ value: p.id, label: displayPlayerName(p) })), true, "Le payeur est obligatoire")}
        ${selectField("Receveur *", "new-payment-receiver", players.map(p => ({ value: p.id, label: displayPlayerName(p) })), true, "Le receveur est obligatoire", defaultReceiverId)}
        <div class="is-hidden" id="block-selection">
          <div class="field">
            <label class="label">Mode de sélection</label>
            <label class="radio">
              <input type="radio" name="match-mode" value="list" checked>
              Matchs
            </label>
            <label class="radio">
              <input type="radio" name="match-mode" value="count">
              Nombre de matchs
            </label>
          </div>

          <!-- 🟦 OPTION 1 : Nombre -->
          <div class="is-hidden" id="block-count">
            <div class="field">
              <div class="control">
                <input class="input" type="number" id="nb-matches-paid">
              </div>
            </div>
          </div>

          <!-- 🟩 OPTION 2 : Liste -->
          <div id="block-list">
            <div class="field">
              <div class="control payment-matchs" id="block-list-datas">
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success" id="save-new-payment">Ajouter</button>
        <button class="button" id="cancel-new-payment">Annuler</button>
      </footer>
    </div>
  </div>
  `;
}