import React, { useState, useEffect } from 'react';

function ProductTable() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Add code to fetch the products data from the backend
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td>{product.name}</td>
            <td>{product.price}</td>
            <td>
              {/* Add code to render the edit button or modal */}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ProductTable;
