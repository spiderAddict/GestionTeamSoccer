const API_VERSION_URL = "/api/version";

async function getVersion() {
  const res = await fetch(API_VERSION_URL);
  return await res.json();
}

// Main render function
export async function renderHomePage(container) {
  const version = await getVersion();
  container.innerHTML = `
    <h1 class="title">Redfish</h1>
    <p>version ${version.version}</p>
  `;
}