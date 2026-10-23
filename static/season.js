// État partagé de la saison sélectionnée (en mémoire : un rechargement revient à la saison en cours)
import { fetchJson } from "./helpers.js";

const API_SEASONS_URL = "/api/seasons";

/** @typedef {{id: number, name: string, is_current: boolean, closed_at: string | null}} Season */

/** @type {Season[]} */
let seasons = [];
/** @type {number | null} */
let selectedSeasonId = null;

export async function loadSeasons() {
  seasons = await fetchJson(API_SEASONS_URL);
  if (selectedSeasonId === null || !seasons.some(s => s.id === selectedSeasonId)) {
    selectCurrentSeason();
  }
}

export function getSeasons() {
  return seasons;
}

/** @returns {Season | undefined} */
export function getSelectedSeason() {
  return seasons.find(s => s.id === selectedSeasonId);
}

/** @returns {Season | undefined} */
export function getCurrentSeason() {
  return seasons.find(s => s.is_current);
}

export function isSelectedSeasonClosed() {
  return !getSelectedSeason()?.is_current;
}

/** @param {number} id */
export function selectSeason(id) {
  selectedSeasonId = id;
}

export function selectCurrentSeason() {
  selectedSeasonId = getCurrentSeason()?.id ?? null;
}

/**
 * Crée une saison (l'API clôture la saison en cours) et la sélectionne
 * @param {string} name
 * @returns {Promise<Season>}
 */
export async function createSeason(name) {
  const season = await fetchJson(API_SEASONS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name })
  });
  selectedSeasonId = season.id;
  await loadSeasons();
  return season;
}
