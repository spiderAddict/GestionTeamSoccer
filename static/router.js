// router.js

import { renderPlayersPage } from "./players/players.controller.js";
import { renderGamesPage } from "./games/games.controller.js";
import { renderPaymentsPage } from "./payments/payments.controller.js";
import { renderHomePage } from "./homepage.js";
import { renderStatsPage } from "./stats/stats.controller.js";

const appDiv = document.getElementById("app");

const routeGroups = [
  {
    paths: ["/version", "/infos" , "acceuil"],
    handler: () => renderHomePage(appDiv),
  },
  {
    paths: ["/", "/home", "/matchs"],
    handler: () => renderGamesPage(appDiv),
  },
  {
    paths: ["/joueurs"],
    handler: () => renderPlayersPage(appDiv),
  },
  {
    paths: ["/paiements"],
    handler: () => renderPaymentsPage(appDiv),
  },
  {
    paths: ["/stats"],
    handler: () => renderStatsPage(appDiv),
  },
];

export function navigateTo(url) {
  history.pushState(null, null, url);
  render();
}

export function render() {
  const path = window.location.pathname;

  const route = routeGroups.find(group =>
    group.paths.includes(path)
  );

  if (route) {
    route.handler();
  } else {
    appDiv.innerHTML = "<h1>404</h1>";
  }
}