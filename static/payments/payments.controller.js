import { getPayments, createPayment, deletePayment } from "./payments.api.js";
import { getPlayers } from "../players/players.api.js";
import { paymentsTemplate } from "./payments.template.js";
import { showError, hideError } from "../helpers.js";

// Main render function
export async function renderPaymentsPage(container) {
  const [payments, players] = await Promise.all([getPayments(), getPlayers()]);
  container.innerHTML = paymentsTemplate(payments, players);
  attachEvents(container, payments, players);
}

// Attach all events (FAB, modal, delete)
function attachEvents(container, payments, players) {
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

  // ---------- Save payment ----------
  saveBtn.onclick = async () => {
    const payerSelect = document.getElementById("new-payment-payer");
    const payerId = payerSelect.value;
    const receiverSelect = container.querySelector("#new-payment-receiver");
    const receiverId = receiverSelect.value;
    const numberOfMatches = parseInt(container.querySelector("#new-payment-matches").value) || 1;

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

    await createPayment({
      payer_id: payerId,
      receiver_id: receiverId,
      number_of_matches_paid: numberOfMatches,
      match_ids: [] // Pour l'instant vide
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
  const pierre = players.find(p => p.first_name.toLowerCase() === 'pierre');
  if (pierre) {
    container.querySelector("#new-payment-receiver").value = pierre.id;
  }
  container.querySelector("#new-payment-matches").value = "1";
}

// Reset modal inputs
function resetModal(container) {
  container.querySelector("#new-payment-payer").value = "";
  container.querySelector("#new-payment-receiver").value = "";
  container.querySelector("#new-payment-matches").value = "1";
}