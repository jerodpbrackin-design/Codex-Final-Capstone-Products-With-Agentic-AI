import React from 'react';
import './cyberpunk.css';
import ProductForm from './ProductForm';
import ProductTable from './ProductTable';
import ChatBox from './ChatBox';

function App() {
  return (
    <div className="App">
      <h1>Inventory Dashboard</h1>
      <ProductForm />
      <ProductTable />
      <ChatBox />
    </div>
  );
}

export default App;
