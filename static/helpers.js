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

function getErrorElement(input) {
  return input.closest(".field").querySelector(".help");
}

export function showError(input) {
  const error = getErrorElement(input);
  error?.classList.remove("is-hidden");
  input.classList.add("is-danger");
}

export function hideError(input) {
  const error = getErrorElement(input);
  error?.classList.add("is-hidden");
  input.classList.remove("is-danger");
}

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