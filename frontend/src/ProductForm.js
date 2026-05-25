import React, { useState } from 'react';

function ProductForm({ onProductAdded }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await fetch(`/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          price: parseFloat(price),
          quantity: parseInt(quantity) || 0,
        }),
      });

      if (res.ok) {
        onProductAdded();
        setName('');
        setPrice('');
        setQuantity('');
      } else {
        console.error('Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div className="ProductForm">
      <h3>➕ Add New Product</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Product Name</label>
        <input
          type="text"
          id="name"
          placeholder="Enter product name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label htmlFor="price">Price</label>
        <input
          type="number"
          id="price"
          placeholder="Enter price..."
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <label htmlFor="quantity">Quantity</label>
        <input
          type="number"
          id="quantity"
          placeholder="Enter quantity..."
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}

export default ProductForm;
