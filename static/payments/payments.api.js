import { fetchJson } from "../helpers.js";

const API_PAYMENTS_URL = "/api/payments";

/** @param {number} seasonId */
export async function getPayments(seasonId) {
  return fetchJson(`${API_PAYMENTS_URL}?season_id=${seasonId}`);
}

/**
 * @param {number} seasonId
 * @param {object} data
 */
export async function createPayment(seasonId, data) {
  await fetchJson(`${API_PAYMENTS_URL}?season_id=${seasonId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

export async function deletePayment(id) {
  await fetchJson(`${API_PAYMENTS_URL}/${id}`, {
    method: "DELETE"
  });
}
