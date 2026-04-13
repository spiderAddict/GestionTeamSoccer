// Business logic for payments

export function validatePayment(payerId, receiverId, modeSelected, selectedMatches, numberOfMatches) {
  if (!payerId || !receiverId) {
    return { valid: false, error: 'payer_receiver_missing' };
  }
  if ((modeSelected === "list" && selectedMatches.length <= 0) ||
    (modeSelected === "count" && numberOfMatches <= 0)) {
    return { valid: false, error: 'no_matches_selected' };
  }
  return { valid: true };
}

export function buildPaymentData(payerId, receiverId, modeSelected, selectedMatches, numberOfMatches, allMatches) {
  return {
    payer_id: payerId,
    receiver_id: receiverId,
    number_of_matches_paid: modeSelected === "list" ? selectedMatches.length : numberOfMatches,
    match_ids: modeSelected === "list" ? selectedMatches : allMatches.slice(0, numberOfMatches),
  };
}

export function getMatchesForPayer(games, payerId) {
  return games.filter(g => g.players.includes(payerId));
}

export function getDefaultReceiverId(players) {
  const pierre = players.find(p => p.name.toLowerCase() === 'pierre');
  return pierre ? pierre.id : '';
}