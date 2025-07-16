import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import ProductDetails from './components/ProductDetails';
import OrderConfirmation from './components/OrderConfirmation';
import './App.css';

function App() {
  return (
    <CartProvider>
      <Router>
        <Toaster position="bottom-right" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
