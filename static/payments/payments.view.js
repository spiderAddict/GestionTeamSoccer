// Rendering functions for payments
import { getPayments } from "./payments.api.js";
import { getPlayers } from "../players/players.api.js";
import { getGames } from "../games/games.api.js";
import { paymentsTemplate } from "./payments.template.js";
import { attachEvents } from "./payments.events.js";

export async function renderPaymentsPage(container) {
  const [payments, players, games] = await Promise.all([getPayments(), getPlayers(), getGames()]);
  container.innerHTML = paymentsTemplate(payments, players, games);
  attachEvents(container, players, games);
}