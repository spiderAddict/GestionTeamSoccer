import { displayPlayerName } from '../helpers.js';

export function statsTemplate(games, players, payments) {
  return `
  <div class="mobile-app">

    <header class="mobile-header">
      <h1>📈 Statistiques</h1>
    </header>

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
                const present = match.players.includes(player.id);
                return `<td><span class="cell ${present ? "yellow" : "grey"}" /></td>`;
              }).join("")}
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  </div>`;
}