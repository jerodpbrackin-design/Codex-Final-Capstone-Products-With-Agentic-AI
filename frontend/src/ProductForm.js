import React, { useState } from 'react';

function ProductForm() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Add code to send the product data to the backend
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <br />
      <label>
        Price:
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
      </label>
      <br />
      <button type="submit">Add Product</button>
    </form>
  );
}

export default ProductForm;
