// app.js
import { renderPlayers, attachPlayerEvents } from "./views/players.js";

const appDiv = document.getElementById("app");

async function renderPlayersPage() {
  // 1️⃣ Générer le HTML
  const html = renderPlayers();  
  // 2️⃣ Insérer dans le DOM
  appDiv.innerHTML = html;  
  // 3️⃣ Attacher les events
  attachPlayerEvents();
}

// Initial render pour test
renderPlayersPage();