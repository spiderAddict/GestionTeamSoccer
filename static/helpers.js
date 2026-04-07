export function inputField(label, type, id, required = false, errorMsg = "") {
  return `
    <div class="field">
      <label class="label">${label}</label>
      <div class="control">
        <input class="input" type="${type}" id="${id}" ${required ? "required" : ""}>
      </div>
      ${errorMsg ? `<p class="help is-danger" style="display:none;">${errorMsg}</p>` : ''}
    </div>
  `;
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