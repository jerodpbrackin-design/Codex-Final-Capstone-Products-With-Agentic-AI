import React, { useState, useEffect } from 'react';
import EditProductModal from './EditProductModal';

function ProductTable() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`/products`);
      const text = await res.text();

      if (!res.ok) {
        console.error('HTTP error! status:', res.status, 'body:', text);
        setProducts([]);
        return;
      }

      if (!text) {
        console.error('Empty response from server');
        setProducts([]);
        return;
      }

      const data = JSON.parse(text);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };

  const deleteProduct = async (id) => {
    await fetch(`/products/${id}`, {
      method: 'DELETE',
    });

    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="ProductTable">
      <h3>📦 Product Catalog</h3>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>${p.price}</td>
              <td>{p.quantity}</td>

              <td style={{ display: 'flex', gap: 10 }}>
                <button
                  className="edit-btn"
                  onClick={() => setEditingProduct(p)}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
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
