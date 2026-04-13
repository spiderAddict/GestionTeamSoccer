import { createPayment, deletePayment } from "./payments.api.js";
import { showError, hideError } from "../helpers.js";
import { validatePayment, buildPaymentData, getUnpaidMatchesForPlayer, getDefaultReceiverId } from "./payments.logic.js";
import { renderPaymentsPage } from "./payments.view.js";

/**
 * Attache tous les événements pour la page des paiements
 * @param {HTMLElement} container - Conteneur de la page
 * @param {import('./payments.logic.js').Payment[]} payments - Liste des paiements
 * @param {import('./payments.logic.js').Player[]} players - Liste des joueurs
 * @param {import('./payments.logic.js').Game[]} games - Liste des matchs
 */
export function attachEvents(container, payments, players, games) {
  const fab = container.querySelector("#add-payment-btn");
  const closeBtn = container.querySelector("#close-modal");
  const cancelBtn = container.querySelector("#cancel-new-payment");
  const saveBtn = container.querySelector("#save-new-payment");

  // ---------- Open modal for new payment ----------
  fab.onclick = () => openModal(container, players);

  // ---------- Close modal ----------
  closeBtn.onclick = cancelBtn.onclick = () => closeModal(container);

  // ---------- Gestion de sélection de payeur/receveur
  const payerSelect = container.querySelector('#new-payment-payer');
  const receiverSelect = container.querySelector('#new-payment-receiver');
  payerSelect.addEventListener('change', () => handlePayerChange(container, games, payments));
  receiverSelect.addEventListener('change', () => displaySelectionBlock(container));

  // ---------- Gestion du mode de sélection de matchs ----------
  const radios = container.querySelectorAll('input[name="match-mode"]');
  radios.forEach(radio => {
    radio.addEventListener("change", (e) => {
      activateMode(container, e.target.value);
    });
  });

  // ---------- Save payment ----------
  saveBtn.onclick = async () => {
    await savePayment(container);
  };

  // ---------- Delete buttons ----------
  container.querySelectorAll("button[data-action='delete']").forEach(btn => {
    btn.onclick = async () => {
      const id = btn.dataset.id;
      // Show confirmation dialog
      const confirmed = confirm("Êtes-vous sûr(e) de vouloir supprimer ce paiement ? Cette action ne peut pas être annulée.");
      if (confirmed) {
        await deletePayment(id);
        await renderPaymentsPage(container);
      }
    };
  });
}

/**
 * Ouvre la modal d'ajout de paiement
 * @param {HTMLElement} container - Conteneur de la page
 * @param {import('./payments.logic.js').Player[]} players - Liste des joueurs
 */
function openModal(container, players) {
  const modal = container.querySelector("#add-payment-modal");
  modal.classList.add("is-active");

  // Set defaults
  const defaultReceiverId = getDefaultReceiverId(players);
  if (defaultReceiverId) {
    container.querySelector("#new-payment-receiver").value = defaultReceiverId;
  }
  container.querySelector("#nb-matches-paid").value = "1";
}

/**
 * Ferme la modal d'ajout de paiement
 * @param {HTMLElement} container - Conteneur de la page
 */
function closeModal(container) {
  const modal = container.querySelector("#add-payment-modal");
  modal.classList.remove("is-active");
  // Reset
  container.querySelector("#new-payment-payer").value = "";
  container.querySelector("#new-payment-receiver").value = "";
  container.querySelector("#nb-matches-paid").value = "1";
  const checkboxes = container.querySelectorAll(".payment-match-checkbox");
  checkboxes.forEach(cb => cb.checked = false);
  const payerSelect = container.querySelector('#new-payment-payer');
  const receiverSelect = container.querySelector('#new-payment-receiver');  
  hideError(payerSelect);
  hideError(receiverSelect);
}

/**
 * Gère le changement de payeur
 * @param {HTMLElement} container - Conteneur de la page
 * @param {import('./payments.logic.js').Game[]} games - Liste des matchs
 * @param {import('./payments.logic.js').Payment[]} payments - Liste des paiements
 */
async function handlePayerChange(container, games, payments) {
  // Charger les matchs correspondants au payeur
  const payer = container.querySelector('#new-payment-payer').value;
  if (payer) {
    await loadMatchesForPayer(container, games, payments, payer);
  }

  // Affichage du block de séléction
  displaySelectionBlock(container);
}

/**
 * Affiche ou cache le bloc de sélection selon les valeurs
 * @param {HTMLElement} container - Conteneur de la page
 */
function displaySelectionBlock(container) {
  const payerSelect = container.querySelector('#new-payment-payer');
  const payer = payerSelect.value;
  const receiver = container.querySelector('#new-payment-receiver').value;
  const blockSelection = container.querySelector('#block-selection');

  if (payer && receiver) {
    blockSelection.classList.remove('is-hidden');
  } else {
    blockSelection.classList.add('is-hidden');
  }
}

/**
 * Charge les matchs pour un payeur
 * @param {HTMLElement} container - Conteneur de la page
 * @param {import('./payments.logic.js').Game[]} games - Liste des matchs
 * @param {import('./payments.logic.js').Payment[]} payments - Liste des paiements
 * @param {string} payerId - ID du payeur
 */
async function loadMatchesForPayer(container, games, payments, payerId) {
  // Récupérer les matchs impayés pour ce payeur
  const matches = getUnpaidMatchesForPlayer(games, payments, payerId);

  const html = matches.length === 0
  ? `<div class="notification is-success is-light">
       🎉 Aucun match en attente de paiement
     </div>`
  : matches.map(m => `
      <label class="checkbox">
        <input type="checkbox" value="${m.id}" class="payment-match-checkbox">
        ${m.date}${m.versus_team ? ' - ' + m.versus_team : ''}
      </label>
    `)
    .join("");
    
  const blockListDatas = container.querySelector('#block-list-datas');
  blockListDatas.innerHTML = html;
}

/**
 * Active un mode de sélection de matchs
 * @param {HTMLElement} container - Conteneur de la page
 * @param {string} mode - Mode ('count' ou 'list')
 */
function activateMode(container, mode) {
  const blockCount = container.querySelector("#block-count");
  const blockList = container.querySelector("#block-list");

  const inputCount = container.querySelector("#nb-matches-paid");
  const checkboxes = container.querySelectorAll(".payment-match-checkbox");

  if (mode === "count") {
    // activer count
    inputCount.disabled = false;
    blockCount.classList.remove("is-hidden");

    // désactiver list
    checkboxes.forEach(cb => cb.disabled = true);
    blockList.classList.add("is-hidden");
  }

  if (mode === "list") {
    // activer list
    checkboxes.forEach(cb => cb.disabled = false);
    blockList.classList.remove("is-hidden");

    // désactiver count
    inputCount.disabled = true;
    blockCount.classList.add("is-hidden");
  }
}

/**
 * Sauvegarde un paiement
 * @param {HTMLElement} container - Conteneur de la page
 */
async function savePayment(container) {

  const payerSelect = container.querySelector("#new-payment-payer");
  const payerId = payerSelect.value;
  const receiverSelect = container.querySelector("#new-payment-receiver");
  const receiverId = receiverSelect.value;
  const numberOfMatches = parseInt(container.querySelector("#nb-matches-paid").value) || 1;
  const selectedMatches = Array.from(container.querySelectorAll(".payment-match-checkbox:checked"))
    .map(cb => cb.value);
  const allMatches = Array.from(container.querySelectorAll(".payment-match-checkbox"))
    .map(cb => cb.value);
  const modeSelected = container.querySelector('input[name="match-mode"]:checked')?.value;

  // Validation
  const validation = validatePayment(payerId, receiverId, modeSelected, selectedMatches, numberOfMatches);

  if (!validation.valid) {
    if (validation.error === 'payer_receiver_missing') {
      if (!payerId) showError(payerSelect);
      if (!receiverId) showError(receiverSelect);
    }
    else if (validation.error === 'payer_receiver_same') {
      alert("Le payeur et le receveur ne peuvent pas être la même personne !");
    }
    else if (validation.error === 'no_matches_selected') {
      alert("Au moins un match doit être sélectionné !");
    }
    return;
  }

  hideError(payerSelect);
  hideError(receiverSelect);

  const paymentData = buildPaymentData(payerId, receiverId, modeSelected, selectedMatches, numberOfMatches, allMatches);

  await createPayment(paymentData);

  closeModal(container);
  await renderPaymentsPage(container);
}