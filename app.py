from flask import Flask, request, jsonify
from database import init_db, get_connection

app = Flask(__name__)

init_db()

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
        {"id": r[0], "name": r[1], "price": r[2], "quantity": r[3]}
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


if __name__ == '__main__':
    app.run(debug=True)
