export function gamesTemplate(games, players) {
  return `
  <div class="mobile-app">

    <header class="mobile-header">
      <h1>⚽ Matchs</h1>
    </header>

    <div class="games-list">
      ${games.map(m => {
        const matchPlayers = m.players.map(id => {
          const p = players.find(pl => pl.id === id);
          return p ? `${p.first_name} ${p.last_name}` : '';
        }).join(", ");

        return `
        <div class="match-card">
          <div class="match-card-header">
            <div class="match-info">
              <strong>${m.date}</strong>
              ${m.versus_team ? `<span>Adversaire: ${m.versus_team}</span>` : ''}
              ${m.result ? `<span>Résultat: ${m.result}</span>` : ''}
            </div>
            <div class="match-actions">
              <button data-id="${m.id}" data-action="edit">✏️</button>
              <button data-id="${m.id}" data-action="delete">🗑️</button>
            </div>
          </div>
          <div class="match-players-list">
            ${matchPlayers.split(", ").map(name => `<span class="player-badge">${name}</span>`).join("")}
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
            <label class="label">Date *</label>
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
                  ${p.first_name} ${p.last_name}
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