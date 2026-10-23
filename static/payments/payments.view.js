// Rendering functions for payments
import { getPayments } from "./payments.api.js";
import { getPlayers } from "../players/players.api.js";
import { getGames } from "../games/games.api.js";
import { paymentsTemplate } from "./payments.template.js";
import { attachEvents } from "./payments.events.js";
import { loadSeasons, getSelectedSeason } from "../season.js";
import { attachSeasonSelector } from "../season.selector.js";

/**
 * Rend la page des paiements
 * @param {HTMLElement} container - Conteneur de la page
 */
export async function renderPaymentsPage(container) {
  await loadSeasons();
  const seasonId = getSelectedSeason().id;
  const [payments, players, games] = await Promise.all([getPayments(seasonId), getPlayers(), getGames(seasonId)]);

  // Trier les matchs du plus ancien au plus récent
  games.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));

  container.innerHTML = paymentsTemplate(payments, players, games);
  attachSeasonSelector(container, () => renderPaymentsPage(container));
  attachEvents(container, payments, players, games);
}