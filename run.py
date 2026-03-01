from flask import Flask, send_from_directory
from flask_restx import Api, Resource, fields
import os

app = Flask(__name__, static_folder="static")

# Swagger disponible sur /api/docs
api = Api(
    app,
    version="1.0",
    title="My API",
    description="Simple Editable List API",
    doc="/api/docs"   # IMPORTANT pour éviter conflit avec frontend
)

ns = api.namespace("items", path="/api/items")

items = [
    {"id": 1, "name": "Item 1"},
    {"id": 2, "name": "Item 2"}
]

item_model = api.model("Item", {
    "id": fields.Integer(readonly=True),
    "name": fields.String(required=True)
})


@ns.route("")
class ItemList(Resource):

    @ns.marshal_list_with(item_model)
    def get(self):
        return items

    @ns.expect(item_model)
    @ns.marshal_with(item_model)
    def post(self):
        new_id = max([i["id"] for i in items], default=0) + 1
        item = {"id": new_id, "name": api.payload["name"]}
        items.append(item)
        return item, 201


@ns.route("/<int:item_id>")
class Item(Resource):

    @ns.expect(item_model)
    @ns.marshal_with(item_model)
    def put(self, item_id):
        for item in items:
            if item["id"] == item_id:
                item["name"] = api.payload["name"]
                return item
        api.abort(404)

    def delete(self, item_id):
        global items
        items = [i for i in items if i["id"] != item_id]
        return {"status": "deleted"}


# -------- FRONTEND --------

@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")


@app.route("/<path:path>")
def serve_static(path):

    # IMPORTANT : ne pas intercepter les routes API
    if path.startswith("api/"):
        return {"error": "Not found"}, 404

    file_path = os.path.join(app.static_folder, path)

    if os.path.exists(file_path):
        return send_from_directory(app.static_folder, path)

    # fallback SPA (si un jour tu ajoutes React)
    return send_from_directory(app.static_folder, "index.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)