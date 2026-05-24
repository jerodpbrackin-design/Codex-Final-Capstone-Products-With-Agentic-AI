import requests
from flask import Flask, request, jsonify, render_template

try:
    from backend.database import init_db, get_connection
except ModuleNotFoundError:
    from database import init_db, get_connection
from decimal import Decimal
from flask_cors import CORS

app = Flask(
    __name__,     
    static_folder='static',
    template_folder='templates'
)
CORS(app)  

N8N_WEBHOOK="https://jrod7.app.n8n.cloud/webhook/1c29803a-be0e-4edc-8b5c-6da9de4fc5fb/chat" # replace if different

init_db()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/products', methods=['POST'])
def create_product():
    data = request.json

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO Products (name, price, quantity)
        VALUES (%s, %s, %s)
        RETURNING id
    """, (data['name'], data['price'], data['quantity']))

    product_id = cursor.fetchone()[0]

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"id": product_id}), 201


@app.route('/products', methods=['GET'])
def get_products():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM Products")
    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify([
        {
            "id": r[0],
            "name": r[1],
            "price": float(r[2]) if isinstance(r[2], Decimal) else r[2],
            "quantity": r[3]
        }
        for r in rows
    ])


@app.route('/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    data = request.json

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE Products
        SET name = %s, price = %s, quantity = %s
        WHERE id = %s
    """, (data['name'], data['price'], data['quantity'], product_id))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Updated"})


@app.route('/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM Products WHERE id = %s", (product_id,))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Deleted"})

@app.route('/products/count', methods=['GET'])
def count_products():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM Products")

    count = cursor.fetchone()[0]

    cursor.close()
    conn.close()

    return jsonify({
        "count": count
    })

@app.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM Products WHERE id = %s",
        (product_id,)
    )

    row = cursor.fetchone()

    cursor.close()
    conn.close()

    if not row:
        return jsonify({"error": "Product not found"}), 404

    return jsonify({
        "id": row[0],
        "name": row[1],
        "price": float(row[2]),
        "quantity": row[3]
    })

@app.route("/send-to-n8n", methods=["POST"])
def send_to_n8n():
    raw = request.get_data(as_text=True)
    app.logger.info("RAW BODY: %s", raw)
    try:
        payload = request.get_json(force=True)
    except Exception as e:
        app.logger.exception("JSON parse error")
        return jsonify({"error":"invalid json","detail": str(e), "raw": raw}), 400
    try:
        r = requests.post(N8N_WEBHOOK, json=payload, timeout=10)
        return (r.text, r.status_code)
    except requests.RequestException as e:
        app.logger.exception("Forward error")
        return jsonify({"error":"forward failed","detail": str(e)}), 502



if __name__ == '__main__':
    app.run(debug=True)
