// Rendering functions for payments
import { getPayments } from "./payments.api.js";
import { getPlayers } from "../players/players.api.js";
import { getGames } from "../games/games.api.js";
import { paymentsTemplate } from "./payments.template.js";
import { attachEvents } from "./payments.events.js";

export async function renderPaymentsPage(container) {
  const [payments, players, games] = await Promise.all([getPayments(), getPlayers(), getGames()]);

  // Trier les matchs du plus ancien au plus récent
  games.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));

  container.innerHTML = paymentsTemplate(payments, players, games);
  attachEvents(container, players, games);
}