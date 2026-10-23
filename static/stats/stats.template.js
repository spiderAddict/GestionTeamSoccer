import { displayPlayerName } from '../helpers.js';
import { seasonSelectorTemplate, seasonModalTemplate } from '../season.selector.js';

export function statsTemplate(games, players, playerMatchState) {
  return `
  <div class="mobile-app">

    <header class="mobile-header has-season">
      <h1>📈 Statistiques</h1>
      ${seasonSelectorTemplate()}
    </header>
    ${seasonModalTemplate()}

    <div>
      <table class="stats-table">
        <thead>
          <tr>
            <th class="entete">Nom</th>
            ${games.map(m => `<th class="vertical">${m.date}${m.versus_team ? `<br><span class="match-opponent-label">${m.versus_team}</span>` : ""}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${players.map(player => `
            <tr>
              <td>${displayPlayerName(player)}</td>
              ${games.map(match => {
                const statut = playerMatchState.get(match.id)?.get(player.id) || "absent";
                const statusCss = statut === "paid" ? "green" : statut === "played" ? "yellow" : "grey";
                return `<td><span class="cell ${statusCss}" /></td>`;
              }).join("")}
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  </div>`;
}