// router.js

import { renderPlayersPage } from "./players/players.controller.js";
import { renderGamesPage } from "./games/games.controller.js";
import { renderPaymentsPage } from "./payments/payments.controller.js";
import { renderHomePage } from "./homepage.js";

const appDiv = document.getElementById("app");

const routes = {
  "/": () => renderHomePage(appDiv),
  "/joueurs": () => renderPlayersPage(appDiv),
  "/matchs": () => renderGamesPage(appDiv),
  "/paiements": () => renderPaymentsPage(appDiv)
};

export function navigateTo(url) {
  history.pushState(null, null, url);
  render();
}

export function render() {
  const path = window.location.pathname;
  const route = routes[path];
  route ? route() : appDiv.innerHTML = "<h1>404</h1>";
}