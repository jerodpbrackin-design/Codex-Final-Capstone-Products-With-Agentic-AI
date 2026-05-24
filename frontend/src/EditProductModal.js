import React, { useState } from 'react';
import styles from './styles';


function EditProductModal({ product, onClose, onUpdate }) {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [quantity, setQuantity] = useState(product.quantity);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(
      `http://localhost:5000/products/${product.id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price, quantity }),
      }
    );

    const data = await res.json();

    onUpdate({ id: product.id, ...data });
    onClose();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>Edit Product</h3>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input value={name} onChange={(e) => setName(e.target.value)} />
          <input value={price} onChange={(e) => setPrice(e.target.value)} />
          <input
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

          <div style={{ display: 'flex', gap: 10 }}>
            <button style={styles.button}>Save</button>
            <button type="button" onClick={onClose} style={styles.grayBtn}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProductModal;