import { getPlayers} from "../players/players.api.js";
import { getGames} from "../games/games.api.js";
import { getPayments} from "../payments/payments.api.js";
import { statsTemplate } from "./stats.template.js";
import { displayPlayerName } from '../helpers.js';
import { loadSeasons, getSelectedSeason } from "../season.js";
import { attachSeasonSelector } from "../season.selector.js";

// Main render function
export async function renderStatsPage(container) {
  await loadSeasons();
  const seasonId = getSelectedSeason().id;
  const [games, players, payments] = await Promise.all([getGames(seasonId), getPlayers(), getPayments(seasonId)]);

  // Trier les matchs du plus ancien au plus récent
  games.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));

  // Trier les joueurs (ou surnom) par ordre alphabétique
  players.sort((a, b) => displayPlayerName(a).localeCompare(displayPlayerName(b)));

  // Créer un tableau pour chaque joueur et pour chauque match
  // Indiquer s'il était présent ou non, et si il a payé ou non
 const playerMatchState = new Map();
  games.forEach(g => {
    players.forEach(p => {

      // Est-ce que le joueur a joué ce match ?
      const played = g.players.includes(p.id);
      
      // Est-ce que le joueur a payé ce match ?
      let payment = false;
      if (played) {
        payment = payments.find(payment => payment.payer_id === p.id && payment.match_ids.includes(g.id));
      }
      const status = played ? (payment ? "paid" : "played") : "absent";

      // Créer la clé si elle n'existe pas
      if (!playerMatchState.has(g.id)) {
        playerMatchState.set(g.id, new Map());
      }
      // Ajouter le statut du joueur pour ce match
      playerMatchState.get(g.id).set(p.id, status);
    });
  });

  container.innerHTML = statsTemplate(games, players, playerMatchState);
  attachSeasonSelector(container, () => renderStatsPage(container));
}
