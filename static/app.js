async function loadItems() {
    const res = await fetch("/api/items");
    const items = await res.json();

    const table = document.getElementById("itemsTable");
    table.innerHTML = "";

    items.forEach(item => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                <input class="input is-small"
                       value="${item.name}"
                       onchange="updateItem(${item.id}, this.value)">
            </td>
            <td>
                <button class="button is-danger is-small"
                        onclick="deleteItem(${item.id})">
                    Delete
                </button>
            </td>
        `;

        table.appendChild(row);
    });
}

async function addItem() {
    const input = document.getElementById("newItem");
    if (!input.value) return;

    await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: input.value })
    });

    input.value = "";
    loadItems();
}

async function updateItem(id, name) {
    await fetch(`/api/items/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
    });
}

async function deleteItem(id) {
    await fetch(`/api/items/${id}`, {
        method: "DELETE"
    });

    loadItems();
}

loadItems();