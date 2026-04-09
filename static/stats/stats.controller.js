import { getPlayers} from "../players/players.api.js";
import { getGames} from "../games/games.api.js";
import { getPayments} from "../payments/payments.api.js";
import { statsTemplate } from "./stats.template.js";

// Main render function
export async function renderStatsPage(container) {
  const [games, players, payments] = await Promise.all([getGames(), getPlayers(), getPayments()]);
  container.innerHTML = statsTemplate(games, players, payments);
}