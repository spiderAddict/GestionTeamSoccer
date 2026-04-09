import { getPlayers, createPlayer, updatePlayer, deletePlayer } from "./players.api.js";
import { playersTemplate } from "./players.template.js";
import { showError, hideError } from "../helpers.js";

// Main render function
export async function renderPlayersPage(container) {
  const players = await getPlayers();
  container.innerHTML = playersTemplate(players);
  attachEvents(container, players);
}

// Attach all events (FAB, modal, edit/delete)
function attachEvents(container, players) {
  const modal = container.querySelector("#add-player-modal");
  const fab = container.querySelector("#add-player-btn");
  const closeBtn = container.querySelector("#close-modal");
  const cancelBtn = container.querySelector("#cancel-new-player");
  const saveBtn = container.querySelector("#save-new-player");

  // ---------- Open modal for new player ----------
  fab.onclick = () => openModal(container);

  // ---------- Close modal ----------
  const closeModal = () => {
    modal.classList.remove("is-active");
    resetModal(container);
  };
  closeBtn.onclick = cancelBtn.onclick = closeModal;

  // ---------- Save player (add or edit) ----------
  saveBtn.onclick = async () => {
    const id = container.querySelector("#modal-player-id").value;
    const firstNameElement = document.getElementById("new-player-first");
    const first = firstNameElement.value.trim();
    const surname = container.querySelector("#new-player-surname").value.trim() || null;
    const email = container.querySelector("#new-player-email").value.trim() || null;
    const phone_number = container.querySelector("#new-player-phone").value.trim() || null;
    const info = container.querySelector("#new-player-info").value.trim() || null;

    // Validation des données
    if (!first) {
      showError(firstNameElement);
      return;
    } else {
      hideError(firstNameElement);
    }

    // Update/Create
    if (id) {
      await updatePlayer(id, { name: first, surname, email, phone_number, additional_info: info });
    } else {
      await createPlayer({ name: first, surname, email, phone_number, additional_info: info });
    }

    closeModal();
    await renderPlayersPage(container);
  };

  // ---------- Edit buttons ----------
  container.querySelectorAll("button[data-action='edit']").forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      const player = players.find(p => p.id === id);
      if (!player) return;
      openModal(container, player);
    };
  });

  // ---------- Delete buttons ----------
  container.querySelectorAll("button[data-action='delete']").forEach(btn => {
    btn.onclick = async () => {
      const id = btn.dataset.id;
      // Show confirmation dialog
      const confirmed = confirm("Êtes-vous sûr(e) de vouloir supprimer ce joueur ? Cette action ne peut pas être annulée.");
      if (confirmed) {
        await deletePlayer(id);
        await renderPlayersPage(container);
      }
    };
  });
}

// Open modal (optionally with player to edit)
function openModal(container, player = null) {
  const modal = container.querySelector("#add-player-modal");
  modal.classList.add("is-active");

  if (player) {
    // Pre-fill for edit
    container.querySelector("#modal-player-id").value = player.id;
    container.querySelector("#new-player-first").value = player.name;
    container.querySelector("#new-player-surname").value = player.surname;
    container.querySelector("#new-player-email").value = player.email || "";
    container.querySelector("#new-player-phone").value = player.phone_number || "";
    container.querySelector("#new-player-info").value = player.additional_info || "";
  } else {
    resetModal(container);
  }
}

// Reset modal inputs
function resetModal(container) {
  container.querySelector("#modal-player-id").value = "";
  container.querySelector("#new-player-first").value = "";
  container.querySelector("#new-player-surname").value = "";
  container.querySelector("#new-player-email").value = "";
  container.querySelector("#new-player-phone").value = "";
  container.querySelector("#new-player-info").value = "";
}