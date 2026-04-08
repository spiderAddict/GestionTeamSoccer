const API_PAYMENTS_URL = "/api/payments";

export async function getPayments() {
  const res = await fetch(API_PAYMENTS_URL);
  return res.json();
}

export async function createPayment(data) {
  await fetch(API_PAYMENTS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

export async function deletePayment(id) {
  await fetch(`${API_PAYMENTS_URL}/${id}`, {
    method: "DELETE"
  });
}