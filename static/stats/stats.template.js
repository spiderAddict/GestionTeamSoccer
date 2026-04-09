import { displayPlayerName } from '../helpers.js';

export function statsTemplate(games, players, payments) {
  return `
  <div class="mobile-app">

    <header class="mobile-header">
      <h1>📈 Statistiques</h1>
    </header>

    <style>
  body { font-size: 14px; }
  table { table-layout: fixed; width: 100%; border-collapse: collapse; }
  th, td { border: 1px solid #ccc; padding: 4px; text-align: center; }
  
  /* Dates verticales */
  th.vertical {
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    white-space: nowrap;
    padding: 2px 5px;
    font-size: 12px;
  }

  /* petites cases colorées */
  .cell {
    width: 24px;
    height: 24px;
    margin: auto;
    border-radius: 4px;
    display: inline-block;
    cursor: pointer;
    transition: 0.2s;
  }
  .cell:hover { transform: scale(1.2); }

  .green { background-color: #6de982; }
  .red { background-color: #c6c8c9; }
  .yellow { background-color: #ffc13b; }
  .grey { background-color: #c6c8c9; }
</style>
  <div class="table-wrapper">
    <table>
      <thead>
        <tr>
          <th>Nom</th>
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
  `;
}