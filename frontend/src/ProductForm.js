import React, { useState } from 'react';
import styles from './styles';

function ProductForm({ onProductAdded }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          price,
          quantity: 1,
        }),
      });

      const data = await res.json();

      setName('');
      setPrice('');

      if (onProductAdded) onProductAdded(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>➕ Add Product</h3>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={styles.input}
        />

        <button style={styles.button}>Add</button>
      </form>
    </div>
  );
} 

export default ProductForm;