import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [savedForLater, setSavedForLater] = useState(() => {
    const saved = localStorage.getItem('savedForLater');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedShipping, setSelectedShipping] = useState('free');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Shipping options
  const SHIPPING_OPTIONS = [
    { id: 'free', label: 'Free Shipping', price: 0, time: '7-10 business days' },
    { id: 'standard', label: 'Standard', price: 99, time: '3-5 business days' },
    { id: 'express', label: 'Express', price: 199, time: '1-2 business days' },
  ];

  // Available coupons
  const AVAILABLE_COUPONS = [
    { code: 'WELCOME10', discount: 10, type: 'percentage', minAmount: 1000 },
    { code: 'FLAT500', discount: 500, type: 'fixed', minAmount: 2000 },
    { code: 'SUPER20', discount: 20, type: 'percentage', minAmount: 5000 },
  ];

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('savedForLater', JSON.stringify(savedForLater));
  }, [cart, savedForLater]);

  const addToCart = (product, quantity = 1, buyNow = false) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
          toast.error(`Only ${product.stock} units available`);
          return prevCart;
        }
        
        const updatedCart = prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        );
        
        if (buyNow) {
          localStorage.setItem('cart', JSON.stringify(updatedCart));
        }
        return updatedCart;
      }

      if (quantity > product.stock) {
        toast.error(`Only ${product.stock} units available`);
        return prevCart;
      }

      const updatedCart = [...prevCart, { ...product, quantity }];
      if (buyNow) {
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      }
      return updatedCart;
    });

    toast.success(`${product.name} added to cart!`);
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
    toast.success('Item removed from cart');
  };

  const updateQuantity = (productId, newQuantity) => {
    setCart(prevCart => {
      const product = prevCart.find(item => item.id === productId);
      if (!product) return prevCart;

      if (newQuantity > product.stock) {
        toast.error(`Only ${product.stock} units available`);
        return prevCart;
      }

      if (newQuantity < 1) {
        return prevCart.filter(item => item.id !== productId);
      }

      return prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      );
    });
  };

  const moveToSavedForLater = (productId) => {
    const item = cart.find(item => item.id === productId);
    if (item) {
      setSavedForLater(prev => [...prev, item]);
      removeFromCart(productId);
      toast.success('Item saved for later');
    }
  };

  const moveToCart = (productId) => {
    const item = savedForLater.find(item => item.id === productId);
    if (item) {
      addToCart(item, item.quantity);
      setSavedForLater(prev => prev.filter(i => i.id !== productId));
    }
  };

  const applyCoupon = (code) => {
    const coupon = AVAILABLE_COUPONS.find(c => c.code === code.toUpperCase());
    const subtotal = calculateSubtotal();

    if (!coupon) {
      toast.error('Invalid coupon code');
      return false;
    }

    if (subtotal < coupon.minAmount) {
      toast.error(`Minimum order amount for this coupon is ₹${coupon.minAmount}`);
      return false;
    }

    setAppliedCoupon(coupon);
    toast.success('Coupon applied successfully!');
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast.success('Coupon removed');
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    const subtotal = calculateSubtotal();
    
    if (appliedCoupon.type === 'percentage') {
      return (subtotal * appliedCoupon.discount) / 100;
    }
    return appliedCoupon.discount;
  };

  const getShippingCost = () => {
    const option = SHIPPING_OPTIONS.find(opt => opt.id === selectedShipping);
    return option ? option.price : 0;
  };

  const getFinalTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const shipping = getShippingCost();
    return subtotal - discount + shipping;
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    localStorage.removeItem('cart');
    toast.success('Cart cleared');
  };

  const initiateCheckout = async (buyNowItem = null) => {
    // This would typically integrate with a payment gateway
    try {
      toast.loading('Processing your order...');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Clear cart after successful checkout
      if (!buyNowItem) {
        clearCart();
      }

      toast.success('Order placed successfully!');
      return true;
    } catch (error) {
      toast.error('Failed to process order. Please try again.');
      return false;
    }
  };

  const value = {
    cart,
    savedForLater,
    selectedShipping,
    setSelectedShipping,
    appliedCoupon,
    SHIPPING_OPTIONS,
    AVAILABLE_COUPONS,
    addToCart,
    removeFromCart,
    updateQuantity,
    moveToSavedForLater,
    moveToCart,
    applyCoupon,
    removeCoupon,
    calculateSubtotal,
    calculateDiscount,
    getShippingCost,
    getFinalTotal,
    clearCart,
    initiateCheckout
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext; 