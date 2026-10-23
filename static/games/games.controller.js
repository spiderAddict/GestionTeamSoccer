import { getGames, createGame, updateGame, deleteGame } from "./games.api.js";
import { getPlayers } from "../players/players.api.js";
import { gamesTemplate } from "./games.template.js";
import { loadSeasons, getSelectedSeason, isSelectedSeasonClosed } from "../season.js";
import { attachSeasonSelector } from "../season.selector.js";

// Render page
export async function renderGamesPage(container) {
  await loadSeasons();
  const [games, players] = await Promise.all([getGames(getSelectedSeason().id), getPlayers()]);
  // Trier les matchs du plus récent au plus ancien
  games.sort((a, b) => new Date(b.date) - new Date(a.date));
  container.innerHTML = gamesTemplate(games, players, isSelectedSeasonClosed());
  attachSeasonSelector(container, () => renderGamesPage(container));
  attachEvents(container, games, players);
}

// Attach events
function attachEvents(container, games, players) {
  const modal = container.querySelector("#add-match-modal");
  const fab = container.querySelector("#add-match-btn");
  const closeBtn = container.querySelector("#close-modal");
  const cancelBtn = container.querySelector("#cancel-match");
  const saveBtn = container.querySelector("#save-match");

  const closeModal = () => {
    modal.classList.remove("is-active");
    resetModal(container);
  };
  closeBtn.onclick = cancelBtn.onclick = closeModal;

  // Pas de bouton d'ajout sur une saison clôturée
  if (fab) fab.onclick = () => openModal(container, players);

  // Save match
  saveBtn.onclick = async () => {
    const id = container.querySelector("#modal-match-id").value;
    const date = container.querySelector("#match-date").value;
    const result = container.querySelector("#match-result").value.trim() || null;
    const versus_team = container.querySelector("#match-opponent").value.trim() || null;
    const selectedPlayers = Array.from(container.querySelectorAll(".match-player-checkbox:checked"))
      .map(cb => cb.value);

    if (!date) {
      alert("La date est obligatoire !");
      return;
    }

    if (selectedPlayers.length < 3 || selectedPlayers.length > 8) {
      alert("Sélectionnez entre 3 et 8 joueurs !");
      return;
    }

    const matchData = { date, result, versus_team, players: selectedPlayers };

    try {
      if (id) {
        await updateGame(id, matchData);
      } else {
        await createGame(matchData);
      }
    } catch (err) {
      alert(err.message);
      return;
    }

    closeModal();
    await renderGamesPage(container);
  };

  // Edit buttons
  container.querySelectorAll("button[data-action='edit']").forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      const match = games.find(m => m.id === id);
      if (!match) return;
      openModal(container, players, match);
    };
  });

  // Delete buttons
  container.querySelectorAll("button[data-action='delete']").forEach(btn => {
    btn.onclick = async () => {
      const id = btn.dataset.id;// Show confirmation dialog
      const confirmed = confirm("Êtes-vous sûr(e) de vouloir supprimer ce match ? Cette action ne peut pas être annulée.");
      if (confirmed) {
        try {
          await deleteGame(id);
        } catch (err) {
          alert(err.message);
          return;
        }
        await renderGamesPage(container);
      }
    };
  });
}

function openModal(container, players, match = null) {
  const modal = container.querySelector("#add-match-modal");
  modal.classList.add("is-active");

  const idInput = container.querySelector("#modal-match-id");
  const dateInput = container.querySelector("#match-date");
  const resultInput = container.querySelector("#match-result");
  const versusTeamInput = container.querySelector("#match-opponent");
  const checkboxes = container.querySelectorAll(".match-player-checkbox");

  if (match) {
    idInput.value = match.id;
    dateInput.value = match.date;
    resultInput.value = match.result || "";
    versusTeamInput.value = match.versus_team || "";
    checkboxes.forEach(cb => cb.checked = match.players.includes(cb.value));
  } else {
    resetModal(container);
  }
}

function resetModal(container) {
  container.querySelector("#modal-match-id").value = "";
  container.querySelector("#match-date").value = "";
  container.querySelector("#match-result").value = "";
  container.querySelector("#match-opponent").value = "";
  container.querySelectorAll(".match-player-checkbox").forEach(cb => cb.checked = false);
}