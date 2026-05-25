import React, { useState } from 'react';

function EditProductModal({ product, onClose, onUpdate }) {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [quantity, setQuantity] = useState(product.quantity);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          price: parseFloat(price),
          quantity: parseInt(quantity),
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      onUpdate({
        id: product.id,
        name,
        price: parseFloat(price),
        quantity: parseInt(quantity),
      });
      onClose();
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>⚙️ Edit Product #{product.id}</h3>

        <form onSubmit={handleSubmit}>
          <label>Product Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Price</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          <label>Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />

          <div className="modal-buttons">
            <button type="submit" className="save-btn">
              Save
            </button>
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProductModal;
