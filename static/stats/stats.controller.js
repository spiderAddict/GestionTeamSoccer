import { getPlayers} from "../players/players.api.js";
import { getGames} from "../games/games.api.js";
import { getPayments} from "../payments/payments.api.js";
import { statsTemplate } from "./stats.template.js";
import { displayPlayerName } from '../helpers.js';

// Main render function
export async function renderStatsPage(container) {
  const [games, players, payments] = await Promise.all([getGames(), getPlayers(), getPayments()]);
  // Trier les matchs du plus récent au plus ancien
  games.sort((a, b) => new Date(a.date) - new Date(b.date));
  // Trier les joueurs (ou surnom) par ordre alphabétique
  players.sort((a, b) => displayPlayerName(a).localeCompare(displayPlayerName(b)));
  container.innerHTML = statsTemplate(games, players, payments);
}