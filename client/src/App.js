import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import ProductDetails from './components/ProductDetails';
import OrderConfirmation from './components/OrderConfirmation';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './components/admin/Dashboard';
import Products from './components/admin/Products';
import './App.css';

// Mock authentication - replace with actual auth logic
const isAdmin = () => {
  // TODO: Implement proper authentication check
  return localStorage.getItem('isAdmin') === 'true';
};

const ProtectedAdminRoute = ({ children }) => {
  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <CartProvider>
      <Router>
        <Toaster position="bottom-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            {/* Add more admin routes here */}
          </Route>
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
