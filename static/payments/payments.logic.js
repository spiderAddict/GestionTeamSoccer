/**
 * Valide les données de paiement
 * @param {string} payerId - ID du payeur
 * @param {string} receiverId - ID du receveur
 * @param {string} modeSelected - Mode de sélection ('list' ou 'count')
 * @param {string[]} selectedMatches - Liste des IDs de matchs sélectionnés
 * @param {number} numberOfMatches - Nombre de matchs à payer
 * @returns {ValidationResult}
 */
export function validatePayment(payerId, receiverId, modeSelected, selectedMatches, numberOfMatches) {
  if (!payerId || !receiverId) {
    return { valid: false, error: 'payer_receiver_missing' };
  }

  if (payerId === receiverId) {
    return { valid: false, error: 'payer_receiver_same' };
  }

  if ((modeSelected === "list" && selectedMatches.length <= 0) ||
    (modeSelected === "count" && numberOfMatches <= 0)) {
    return { valid: false, error: 'no_matches_selected' };
  }
  return { valid: true };
}

/**
 * Construit les données de paiement à envoyer à l'API
 * @param {string} payerId - ID du payeur
 * @param {string} receiverId - ID du receveur
 * @param {string} modeSelected - Mode de sélection
 * @param {string[]} selectedMatches - Matchs sélectionnés
 * @param {number} numberOfMatches - Nombre de matchs
 * @param {string[]} allMatches - Tous les matchs disponibles
 * @returns {PaymentData}
 */
export function buildPaymentData(payerId, receiverId, modeSelected, selectedMatches, numberOfMatches, allMatches) {
  return {
    payer_id: payerId,
    receiver_id: receiverId,
    number_of_matches_paid: modeSelected === "list" ? selectedMatches.length : numberOfMatches,
    match_ids: modeSelected === "list" ? selectedMatches : allMatches.slice(0, numberOfMatches),
  };
}

/**
 * Récupère les matchs impayés pour un joueur
 * @param {Game[]} games - Liste des matchs
 * @param {Payment[]} payments - Liste des paiements
 * @param {string} payerId - ID du joueur
 * @returns {Game[]}
 */
export function getUnpaidMatchesForPlayer(games, payments, payerId) {
  return games
    .filter(g => g.players.includes(payerId))
    .filter(g => !payments.find(payment => payment.payer_id === payerId && payment.match_ids.includes(g.id)));
}

/**
 * Récupère l'ID du receveur par défaut (Pierre)
 * @param {Player[]} players - Liste des joueurs
 * @returns {string}
 */
export function getDefaultReceiverId(players) {
  const pierre = players.find(p => p.name.toLowerCase() === 'pierre');
  return pierre ? pierre.id : '';
}