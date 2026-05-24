import React, { useState, useEffect } from 'react';
import EditProductModal from './EditProductModal';
import styles from './styles';

function ProductTable() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch(`/products`);
    const data = await res.json();
    setProducts(data);
  };

  const deleteProduct = async (id) => {
    await fetch(`/products/${id}`, {
      method: 'DELETE',
    });

    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>📦 Product Catalog</h3>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Qty</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>${p.price}</td>
              <td>{p.quantity}</td>

              <td style={{ display: 'flex', gap: 6 }}>
                <button
                  style={styles.smallBtn}
                  onClick={() => setEditingProduct(p)}
                >
                  Edit
                </button>

                <button
                  style={{ ...styles.smallBtn, background: '#ef4444' }}
                  onClick={() => deleteProduct(p.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onUpdate={(updated) => {
            setProducts((prev) =>
              prev.map((p) => (p.id === updated.id ? updated : p))
            );
          }}
        />
      )}
    </div>
  );
}

export default ProductTable;