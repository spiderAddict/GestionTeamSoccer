/**
 * @param {string} label
 * @param {string} type
 * @param {string} id
 * @param {boolean} [required=false]
 * @param {string} [errorMsg=""]
 * @returns {string}
 */
export function inputField(label, type, id, required = false, errorMsg = "") {
  return `
    <div class="field">
      <label class="label">${label}</label>
      <div class="control">
        <input class="input" type="${type}" id="${id}" ${required ? "required" : ""}>
      </div>
      ${errorMsg ? `<p class="help is-danger is-hidden">${errorMsg}</p>` : ''}
    </div>
  `;
}

/**
 * @param {HTMLInputElement | HTMLSelectElement} input
 * @returns {Element | null}
 */
function getErrorElement(input) {
  return input.closest(".field").querySelector(".help");
}

/**
 * @param {HTMLInputElement | HTMLSelectElement} input
 */
export function showError(input) {
  const error = getErrorElement(input);
  error?.classList.remove("is-hidden");
  input.classList.add("is-danger");
}

/**
 * @param {HTMLInputElement | HTMLSelectElement} input
 */
export function hideError(input) {
  const error = getErrorElement(input);
  error?.classList.add("is-hidden");
  input.classList.remove("is-danger");
}

/**
 * @param {string} label
 * @param {string} id
 * @returns {string}
 */
export function textareaField(label, id) {
  return `
    <div class="field">
      <label class="label">${label}</label>
      <div class="control">
        <textarea class="textarea" id="${id}"></textarea>
      </div>
    </div>
  `;
}

/**
 * @typedef {Object} Option
 * @property {string} value
 * @property {string} label
 */

/**
 * @param {string} label
 * @param {string} id
 * @param {Option[]} options
 * @param {boolean} [required=false]
 * @param {string} [errorMsg=""]
 * @param {string} [defaultValue=""]
 * @returns {string}
 */
export function selectField(label, id, options, required = false, errorMsg = "", defaultValue = "") {
  return `
    <div class="field">
      <label class="label">${label}</label>
      <div class="control">
        <div class="select">
          <select id="${id}" ${required ? "required" : ""}>
            <option value="">-- Sélectionner --</option>
            ${options.map(opt => `<option value="${opt.value}" ${opt.value === defaultValue ? 'selected' : ''}>${opt.label}</option>`).join('')}
          </select>
        </div>
      </div>
      ${errorMsg ? `<p class="help is-danger is-hidden">${errorMsg}</p>` : ''}
    </div>
  `;
}

/**
 * @typedef {Object} Player
 * @property {string} name
 * @property {string} [surname]
 */

/**
 * @param {Player | null | undefined} player
 * @returns {string}
 */
export function displayPlayerName(player) {
  if (!player) return '';
  return player.surname ?? player.name;
}

/**
 * @param {number} count
 * @param {string} singular
 * @param {string} plural
 * @returns {string}
 */
export function pluralize(count, singular, plural) {
  return count === 1
    ? `${count} ${singular}`
    : `${count} ${plural}`;
}