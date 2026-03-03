// router.js

import { renderPlayersPage } from "./players/players.controller.js";

const appDiv = document.getElementById("app");

const routes = {
  "/": () => {
    appDiv.innerHTML = `
      <h1 class="title">Accueil</h1>
      <p>Bienvenue</p>
    `;
  },
  "/joueurs": () => renderPlayersPage(appDiv)
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