import { getPayments, createPayment, deletePayment } from "./payments.api.js";
import { getPlayers } from "../players/players.api.js";
import { getGames } from "../games/games.api.js";
import { paymentsTemplate } from "./payments.template.js";
import { showError, hideError } from "../helpers.js";

// Main render function
export async function renderPaymentsPage(container) {
  const [payments, players, games] = await Promise.all([getPayments(), getPlayers(), getGames()]);
  container.innerHTML = paymentsTemplate(payments, players, games);
  attachEvents(container, players);
}

// Attach all events (FAB, modal, delete)
function attachEvents(container, players) {
  const modal = container.querySelector("#add-payment-modal");
  const fab = container.querySelector("#add-payment-btn");
  const closeBtn = container.querySelector("#close-modal");
  const cancelBtn = container.querySelector("#cancel-new-payment");
  const saveBtn = container.querySelector("#save-new-payment");

  // ---------- Open modal for new payment ----------
  fab.onclick = () => openModal(container, players);

  // ---------- Close modal ----------
  const closeModal = () => {
    modal.classList.remove("is-active");
    resetModal(container);
  };
  closeBtn.onclick = cancelBtn.onclick = closeModal;

  // ---------- Gestion du mode de sélection de matchs ----------
  const radios = document.querySelectorAll('input[name="match-mode"]');
  radios.forEach(radio => {
    radio.addEventListener("change", (e) => {
      activateMode(e.target.value);
    });
  });

  // ---------- Save payment ----------
  saveBtn.onclick = async () => {
    const payerSelect = document.getElementById("new-payment-payer");
    const payerId = payerSelect.value;
    const receiverSelect = container.querySelector("#new-payment-receiver");
    const receiverId = receiverSelect.value;
    const numberOfMatches = parseInt(container.querySelector("#nb-matches-paid").value) || 1;
    const selectedMatches = Array.from(container.querySelectorAll(".payment-match-checkbox:checked"))
      .map(cb => cb.value);
    const allMatches = Array.from(container.querySelectorAll(".payment-match-checkbox"))
      .map(cb => cb.value);
    const modeSelected = document.querySelector('input[name="match-mode"]:checked')?.value;

    // Validation
    if (!payerId) {
      showError(payerSelect);
      return;
    } else {
      hideError(payerSelect);
    }
    if (!receiverId) {
      showError(receiverSelect);
      return;
    } else {
      hideError(receiverSelect);
    }    

    if ((modeSelected === "list" && selectedMatches.length <=0 ) || 
      (modeSelected === "count" && numberOfMatches <=0 )) {
      alert("Au moins un match doit être sélectionné !");
      return;
    }

    await createPayment({
      payer_id: payerId,
      receiver_id: receiverId,
      number_of_matches_paid: modeSelected === "list" ? selectedMatches.length : numberOfMatches,
      match_ids: modeSelected === "list" ? selectedMatches : allMatches.slice(0, numberOfMatches),
    });

    closeModal();
    await renderPaymentsPage(container);
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

// Open modal
function openModal(container, players) {
  const modal = container.querySelector("#add-payment-modal");
  modal.classList.add("is-active");

  // Set defaults
  const pierre = players.find(p => p.name.toLowerCase() === 'pierre');
  if (pierre) {
    container.querySelector("#new-payment-receiver").value = pierre.id;
  }
  container.querySelector("#nb-matches-paid").value = "1";
}

// Reset modal inputs
function resetModal(container) {
  container.querySelector("#new-payment-payer").value = "";
  container.querySelector("#new-payment-receiver").value = "";
  container.querySelector("#nb-matches-paid").value = "1";
  const checkboxes = document.querySelectorAll(".payment-match-checkbox");
  checkboxes.forEach(cb => cb.checked = false);
}

function activateMode(mode) {

  const blockCount = document.getElementById("block-count");
  const blockList = document.getElementById("block-list");

  const inputCount = document.getElementById("nb-matches-paid");
  const checkboxes = document.querySelectorAll(".payment-match-checkbox");

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