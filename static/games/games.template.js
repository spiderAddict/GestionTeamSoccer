import { displayPlayerName } from '../helpers.js';

export function gamesTemplate(games, players) {
  return `
  <div class="mobile-app">

    <header class="mobile-header">
      <h1>⚽ Matchs</h1>
    </header>

    <div class="games-list">
      ${games
        .sort((a, b) => new Date(b.date) - new Date(a.date)) // tri décroissant sur la date du match
        .map(m => {
          const matchPlayers = m.players.map(id => {
            const p = players.find(pl => pl.id === id);
            return p ? `${p.name} ${p.surname || ''}`.trim() : '';
          })
        .join(", ");

        // Travailler résultats
        let butsPour = null
        let butsContre = null
        const match = m.result.match(/^(\d{1,2})-(\d{1,2})$/)
        if (match) {
          butsPour = parseInt(match[1])
          butsContre = parseInt(match[2])}

        return `
          <div class="card match-card">
              <div>
                <div class="match-info">
                  <div class="match-date">📅 ${m.date}</div>
                  ${m.versus_team ? `<div class="match-versus-team">${m.versus_team}</div>` : ''}
                  ${butsPour
                    ? butsPour == butsContre 
                      ? `<div class="score"><div class="score-part">${butsPour}</div><div class="score-versus-sign">VS</div><div class="score-part">${butsContre}</div></div>`
                      : butsPour > butsContre
                        ? `<div class="score"><div class="score-part winning">${butsPour}</div><div class="score-versus-sign">VS</div><div class="score-part">${butsContre}</div></div>`
                        : `<div class="score"><div class="score-part">${butsPour}</div><div class="score-versus-sign">VS</div><div class="score-part winning">${butsContre}</div></div>`
                    : ''}
                </div>
                <div class="match-players-list">
                  ${matchPlayers.split(", ").map(p => `<span class="player-badge">${displayPlayerName(p)}</span>`).join("")}
                </div>
              </div>
              <div class="actions match-actions">
                <button class="action-btn" data-id="${m.id}" data-action="edit">✏️</button>
                <button class="action-btn danger" data-id="${m.id}" data-action="delete">🗑️</button>
              </div>
          </div>`;
      }).join("")}
    </div>

    <!-- FAB pour ajout -->
    <button id="add-match-btn" class="fab">+</button>

    <!-- Modal pour ajout/édition -->
    <div id="add-match-modal" class="modal">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Ajouter un match</p>
          <button class="delete" aria-label="close" id="close-modal"></button>
        </header>
        <section class="modal-card-body">
          <input type="hidden" id="modal-match-id">          

          <div class="field">
            <label class="label">📅 Date *</label>
            <div class="control">
              <input class="input" type="date" id="match-date" required>
            </div>
          </div>   

          <div class="field">
            <label class="label">Résultat</label>
            <div class="control">
              <input class="input" type="text" placeholder="ex: 2-1" id="match-result">
            </div>
          </div>

          <div class="field">
            <label class="label">Équipe adverse</label>
            <div class="control">
              <input class="input" type="text" placeholder="Nom de l'adversaire" id="match-opponent">
            </div>
          </div>

          <div class="field">
            <label class="label">Joueurs (3 à 8)</label>
            <div class="control match-players">
              ${players.map(p => `
                <label class="checkbox">
                  <input type="checkbox" value="${p.id}" class="match-player-checkbox">
                  ${p.name} ${p.surname || ''}
                </label>
              `).join("")}
            </div>
          </div>

        </section>
        <footer class="modal-card-foot">
          <button class="button is-success" id="save-match">Sauvegarder</button>
          <button class="button" id="cancel-match">Annuler</button>
        </footer>
      </div>
    </div>

  </div>
  `;
}