import React, { useState } from 'react';
import './cyberpunk.css';
import ProductForm from './ProductForm';
import ProductTable from './ProductTable';
import ChatBox from './ChatBox';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="App">
      <h1>Inventory Dashboard</h1>
      <ProductForm onProductAdded={() => setRefreshKey((prev) => prev + 1)} />

      <ProductTable refreshKey={refreshKey} />
      <ChatBox />
    </div>
  );
}

export default App;
