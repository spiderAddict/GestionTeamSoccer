import { inputField, selectField } from '../helpers.js';

export function paymentsTemplate(payments, players) {
  const pierre = players.find(p => p.name.toLowerCase() === 'pierre');
  const defaultReceiverId = pierre ? pierre.id : '';

  return `
  <div class="mobile-app">

    <header class="mobile-header">
      <h1>💸 Paiements</h1>
    </header>

    <div class="payments-list">
      ${payments.map(p => `
        <div class="card payment-card">
          <div class="payment-info">
            <div class="payment-date">${new Date(p.created_at).toLocaleDateString('fr-FR')}</div>
            <div class="payment-parties">${players.find(pl => pl.id === p.payer_id).name} ⇒ ${players.find(pl => pl.id === p.receiver_id).name}</div>
            ${p.number_of_matches_paid > 1 ? `<div class="payment-matches">${p.number_of_matches_paid} matchs</div>` : ''}
          </div>
          <div class="actions payment-actions">
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
        ${selectField("Payeur *", "new-payment-payer", players.map(p => ({ value: p.id, label: `${p.name} ${p.surname || ''}`.trim() })), true, "Le payeur est obligatoire")}
        ${selectField("Receveur *", "new-payment-receiver", players.map(p => ({ value: p.id, label: `${p.name} ${p.surname || ''}`.trim() })), true, "Le receveur est obligatoire", defaultReceiverId)}
        ${inputField("Nombre de matchs", "number", "new-payment-matches", false, "", "1")}
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success" id="save-new-payment">Ajouter</button>
        <button class="button" id="cancel-new-payment">Annuler</button>
      </footer>
    </div>
  </div>
  `;
}