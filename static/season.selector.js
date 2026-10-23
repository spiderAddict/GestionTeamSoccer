import { getSeasons, getSelectedSeason, getCurrentSeason, isSelectedSeasonClosed, selectSeason, selectCurrentSeason, createSeason } from "./season.js";

/**
 * Pastille de saison + liste déroulante + modale de création
 * @returns {string}
 */
export function seasonSelectorTemplate() {
  const selected = getSelectedSeason();
  const current = getCurrentSeason();
  const closed = isSelectedSeasonClosed();

  return `
    <div class="season-selector">
      <button class="season-chip ${closed ? "is-closed" : ""}" id="season-chip">
        ${selected?.name ?? "Saison"}${closed ? " 🔒" : ""} ▾
      </button>
      <div class="season-menu is-hidden" id="season-menu">
        ${getSeasons().map(s => `
          <button class="season-menu-item ${s.id === selected?.id ? "is-selected" : ""}" data-season-id="${s.id}">
            ${s.id === selected?.id ? "✔ " : ""}${s.name}
            ${s.is_current ? `<span class="season-menu-hint">en cours</span>` : " 🔒"}
          </button>
        `).join("")}
        <button class="season-menu-item season-menu-new" id="season-new">
          + Nouvelle saison… <span class="season-menu-hint">(clôture ${current?.name ?? ""})</span>
        </button>
      </div>
    </div>

    <div id="season-modal" class="modal">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Nouvelle saison</p>
          <button class="delete" aria-label="close" id="season-modal-close"></button>
        </header>
        <section class="modal-card-body">
          <div class="field">
            <label class="label">Nom *</label>
            <div class="control">
              <input class="input" type="text" id="season-name" maxlength="50" placeholder="ex: Printemps 2027">
            </div>
            <p class="help is-danger is-hidden" id="season-error"></p>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success" id="season-save">Créer</button>
          <button class="button" id="season-cancel">Annuler</button>
        </footer>
      </div>
    </div>
  `;
}

/**
 * Bandeau affiché sur une saison clôturée
 * @returns {string}
 */
export function closedSeasonBannerTemplate() {
  if (!isSelectedSeasonClosed()) return "";
  return `
    <div class="notification is-warning is-light season-banner">
      🔒 Saison clôturée : matchs en lecture seule.
      <a href="#" data-action="season-current">Revenir à la saison en cours</a>
    </div>
  `;
}

/**
 * Attache les événements du sélecteur de saison
 * @param {HTMLElement} container - Conteneur de la page
 * @param {() => Promise<void>} onChange - Re-rendu de la page après changement de saison
 */
export function attachSeasonSelector(container, onChange) {
  const chip = container.querySelector("#season-chip");
  const menu = container.querySelector("#season-menu");
  const modal = container.querySelector("#season-modal");
  const nameInput = container.querySelector("#season-name");
  const error = container.querySelector("#season-error");

  chip.onclick = () => menu.classList.toggle("is-hidden");

  container.querySelectorAll("[data-season-id]").forEach(item => {
    item.onclick = async () => {
      selectSeason(Number(item.dataset.seasonId));
      await onChange();
    };
  });

  container.querySelectorAll("[data-action='season-current']").forEach(link => {
    link.onclick = async (e) => {
      e.preventDefault();
      selectCurrentSeason();
      await onChange();
    };
  });

  const closeModal = () => {
    modal.classList.remove("is-active");
    nameInput.value = "";
    error.classList.add("is-hidden");
  };
  container.querySelector("#season-modal-close").onclick = closeModal;
  container.querySelector("#season-cancel").onclick = closeModal;

  container.querySelector("#season-new").onclick = () => {
    menu.classList.add("is-hidden");
    modal.classList.add("is-active");
    nameInput.focus();
  };

  container.querySelector("#season-save").onclick = async () => {
    const name = nameInput.value.trim();
    if (!name) {
      error.textContent = "Le nom de la saison est obligatoire";
      error.classList.remove("is-hidden");
      return;
    }

    const currentName = getCurrentSeason()?.name;
    const confirmed = confirm(`${currentName} sera clôturée : ses matchs ne seront plus modifiables. Les paiements restent possibles.`);
    if (!confirmed) return;

    try {
      await createSeason(name);
    } catch (err) {
      error.textContent = err.message;
      error.classList.remove("is-hidden");
      return;
    }
    closeModal();
    await onChange();
  };
}
