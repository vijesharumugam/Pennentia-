import React, { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { 
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  HeartIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  ShoppingCartIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  HeartIcon as HeartOutlineIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import ProductCard from '../components/ProductCard';
import ProfileSettings from '../components/ProfileSettings';
import Wishlist from '../components/Wishlist';

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home & Living', 'Books', 'Sports'];
const SORT_OPTIONS = [
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest First', value: 'newest' },
  { label: 'Popular', value: 'popular' }
];

const FEATURED_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
    title: 'Summer Sale',
    description: 'Up to 50% off on selected items'
  },
  {
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04',
    title: 'New Arrivals',
    description: 'Check out our latest collection'
  },
  {
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
    title: 'Special Offers',
    description: 'Limited time deals on premium products'
  }
];

const SHIPPING_OPTIONS = [
  { id: 'free', label: 'Free Shipping', price: 0, time: '7-10 business days' },
  { id: 'standard', label: 'Standard', price: 99, time: '3-5 business days' },
  { id: 'express', label: 'Express', price: 199, time: '1-2 business days' },
];

const AVAILABLE_COUPONS = [
  { code: 'WELCOME10', discount: 10, type: 'percentage' },
  { code: 'FLAT500', discount: 500, type: 'fixed' },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState('');
  const [wishlist, setWishlist] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showQuickView, setShowQuickView] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [savedForLater, setSavedForLater] = useState([]);
  const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'signup'
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState('free');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        let data = await response.json();
        // Map _id to id for frontend compatibility
        data = data.map(product => ({
          ...product,
          id: product._id,
        }));
        setProducts(data);
      } catch (err) {
        setError('Failed to fetch products. Please try again later.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    // Auto-advance carousel
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % FEATURED_SLIDES.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handleAddToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }

    toast.success(`${product.name} added to cart!`, {
      position: 'bottom-right',
      duration: 2000,
    });
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(cart.map(item =>
      item.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const toggleWishlist = (productId) => {
    setWishlist(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
    
    const action = wishlist.includes(productId) ? 'removed from' : 'added to';
    toast.success(`Product ${action} wishlist!`, {
      position: 'bottom-right',
      duration: 2000,
    });
  };

  const handleQuickView = (product) => {
    setShowQuickView(product);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % FEATURED_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + FEATURED_SLIDES.length) % FEATURED_SLIDES.length);
  };

  const filteredAndSortedProducts = products
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'popular':
          return b.popularity - a.popularity;
        default:
          return 0;
      }
    });

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setShowProfileMenu(false);
    toast.success('Successfully signed out!');
  };

  const moveToSavedForLater = (item) => {
    setSavedForLater([...savedForLater, item]);
    removeFromCart(item.id);
    toast.success(`${item.name} saved for later!`);
  };

  const moveToCart = (item) => {
    handleAddToCart(item);
    setSavedForLater(savedForLater.filter(i => i.id !== item.id));
  };

  const handleApplyCoupon = () => {
    const coupon = AVAILABLE_COUPONS.find(c => c.code === couponCode.toUpperCase());
    if (coupon) {
      setAppliedCoupon(coupon);
      setCouponCode('');
      toast.success('Coupon applied successfully!');
    } else {
      toast.error('Invalid coupon code');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast.success('Coupon removed');
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    
    if (appliedCoupon.type === 'percentage') {
      return (cartTotal * appliedCoupon.discount) / 100;
    }
    return appliedCoupon.discount;
  };

  const getShippingCost = () => {
    const option = SHIPPING_OPTIONS.find(opt => opt.id === selectedShipping);
    return option ? option.price : 0;
  };

  const getFinalTotal = () => {
    const subtotal = cartTotal;
    const discount = calculateDiscount();
    const shipping = getShippingCost();
    return subtotal - discount + shipping;
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const renderProfileSection = () => (
    <div className="relative">
      <button
        onClick={() => isLoggedIn ? setShowProfileMenu(!showProfileMenu) : setShowAuth(true)}
        className="p-2 text-gray-600 hover:text-blue-600"
      >
        <UserCircleIcon className="h-6 w-6" />
      </button>

      {showProfileMenu && isLoggedIn && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          <button
            onClick={() => {
              setShowProfileMenu(false);
              setShowProfileSettings(true);
            }}
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
          >
            <UserCircleIcon className="h-5 w-5 mr-2" />
            Profile
          </button>
          <button
            onClick={() => {
              setShowProfileMenu(false);
              setShowWishlist(true);
            }}
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
          >
            <HeartIcon className="h-5 w-5 mr-2" />
            Wishlist
          </button>
          <button
            onClick={handleSignOut}
            className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );

  const renderCartContent = () => (
    <>
      {cart.length === 0 && savedForLater.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Your cart is empty</p>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          {/* Cart Items */}
          {cart.length > 0 && (
            <div className="mb-8">
              <h3 className="font-medium mb-4">Cart Items</h3>
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-gray-500">
                        {new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: 'INR',
                          maximumFractionDigits: 0,
                        }).format(item.price)}
                      </p>
                      <div className="flex items-center mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 border rounded-l"
                        >
                          -
                        </button>
                        <span className="px-4 py-1 border-t border-b">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 border rounded-r"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => moveToSavedForLater(item)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Save for Later
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Saved for Later */}
          {savedForLater.length > 0 && (
            <div className="border-t pt-6 mb-8">
              <h3 className="font-medium mb-4">Saved for Later</h3>
              <div className="space-y-4">
                {savedForLater.map(item => (
                  <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-gray-500">
                        {new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: 'INR',
                          maximumFractionDigits: 0,
                        }).format(item.price)}
                      </p>
                      <button
                        onClick={() => moveToCart(item)}
                        className="text-blue-600 hover:text-blue-800 text-sm mt-2"
                      >
                        Move to Cart
                      </button>
                    </div>
                    <button
                      onClick={() => setSavedForLater(saved => saved.filter(i => i.id !== item.id))}
                      className="text-red-500 hover:text-red-700"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cart Summary */}
          {cart.length > 0 && (
            <div className="border-t pt-4 space-y-4 sticky bottom-0 bg-white">
              {/* Coupon Code */}
              <div>
                <h4 className="font-medium mb-2">Apply Coupon</h4>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-blue-50 p-2 rounded">
                    <div>
                      <span className="font-medium text-blue-700">{appliedCoupon.code}</span>
                      <span className="text-sm text-blue-600 ml-2">
                        ({appliedCoupon.type === 'percentage' ? `${appliedCoupon.discount}% off` : `₹${appliedCoupon.discount} off`})
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-blue-700 hover:text-blue-800"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              {/* Shipping Options */}
              <div>
                <h4 className="font-medium mb-2">Shipping Method</h4>
                <div className="space-y-2">
                  {SHIPPING_OPTIONS.map((option) => (
                    <label
                      key={option.id}
                      className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="shipping"
                          value={option.id}
                          checked={selectedShipping === option.id}
                          onChange={(e) => setSelectedShipping(e.target.value)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="ml-3">
                          <span className="font-medium">{option.label}</span>
                          <p className="text-sm text-gray-500">{option.time}</p>
                        </div>
                      </div>
                      <span className="font-medium">
                        {option.price === 0 ? 'Free' : `₹${option.price}`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      maximumFractionDigits: 0,
                    }).format(cartTotal)}
                  </span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>
                      -{new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        maximumFractionDigits: 0,
                      }).format(calculateDiscount())}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      maximumFractionDigits: 0,
                    }).format(getShippingCost())}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                  <span>Total</span>
                  <span>
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      maximumFractionDigits: 0,
                    }).format(getFinalTotal())}
                  </span>
                </div>
              </div>

              <button
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
                onClick={() => {
                  // TODO: Implement checkout
                  toast.success('Checkout functionality coming soon!');
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Company Name */}
            <div className="flex items-center">
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-blue-600 transition-all duration-300 cursor-pointer">
                Pennentia
              </h1>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products, brands, and more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            {/* Cart and Profile */}
            <div className="flex items-center space-x-4">
              {isLoggedIn && (
                <button
                  onClick={() => setShowFilters(true)}
                  className="relative p-2 text-gray-600 hover:text-blue-600"
                >
                  <HeartOutlineIcon className="h-6 w-6" />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </button>
              )}

              <button
                onClick={() => setShowCart(true)}
                className="relative p-2 text-gray-600 hover:text-blue-600"
              >
                <ShoppingCartIcon className="h-6 w-6" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
              </button>

              {renderProfileSection()}
            </div>
          </div>
        </div>
      </nav>

      {/* Profile Settings Modal */}
      {showProfileSettings && (
        <ProfileSettings onClose={() => setShowProfileSettings(false)} />
      )}

      {/* Wishlist Modal */}
      {showWishlist && (
        <Wishlist
          items={products.filter(product => wishlist.includes(product.id))}
          onClose={() => setShowWishlist(false)}
          onRemove={(id) => toggleWishlist(id)}
          onMoveToCart={(item) => {
            handleAddToCart(item);
            toggleWishlist(item.id);
          }}
        />
      )}

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl flex flex-col">
            <div className="p-6 flex-none">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Shopping Cart</h2>
                <button onClick={() => setShowCart(false)}>
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6">
              {renderCartContent()}
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {authMode === 'signin' ? 'Sign In' : 'Create Account'}
              </h2>
              <button onClick={() => setShowAuth(false)}>
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              // TODO: Implement actual authentication
              setIsLoggedIn(true);
              setShowAuth(false);
              toast.success(`Successfully ${authMode === 'signin' ? 'signed in' : 'created account'}!`);
            }}>
              <div className="space-y-4">
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {authMode === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      required
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
                >
                  {authMode === 'signin' ? 'Sign In' : 'Create Account'}
                </button>
              </div>
            </form>

            <div className="mt-4 text-center">
              <button
                className="text-blue-600 hover:text-blue-800"
                onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
              >
                {authMode === 'signin' 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Carousel Section */}
      <div className="relative h-[500px] overflow-hidden">
        {FEATURED_SLIDES.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-black opacity-40"></div>
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center text-center text-white">
              <div>
                <h1 className="text-6xl font-bold mb-4">{slide.title}</h1>
                <p className="text-xl">{slide.description}</p>
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full"
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter and Sort Bar */}
        <div className="flex justify-end gap-4 mb-8">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Sort by</option>
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-2"
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5" />
            Filters
          </button>
        </div>

        {/* Categories */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Filters Sidebar */}
        {showFilters && (
          <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-xl p-6 transform transition-transform z-50">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button onClick={() => setShowFilters(false)}>
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">Price Range</h4>
                <div className="flex gap-4">
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                    placeholder="Min"
                    className="w-full px-3 py-2 border rounded"
                  />
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                    placeholder="Max"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>
              
              {/* Add more filters here */}
            </div>
          </div>
        )}

        {loading ? (
          // Enhanced Loading Skeleton
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="animate-pulse bg-white rounded-xl p-4">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-10 bg-gray-200 rounded mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No products found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    image={product.image}
                    name={product.name}
                    price={product.price}
                    badge={product.isNew ? 'New' : null}
                    onAddToCart={() => handleAddToCart(product)}
                    onQuickView={() => handleQuickView(product)}
                    onWishlist={() => toggleWishlist(product.id)}
                    isWishlisted={wishlist.includes(product.id)}
                    rating={product.rating}
                    reviews={product.reviews}
                    stock={product.stock}
                    description={product.description}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Quick View Modal */}
      {showQuickView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{showQuickView.name}</h2>
                <button
                  onClick={() => setShowQuickView(null)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={showQuickView.image}
                    alt={showQuickView.name}
                    className="w-full h-auto rounded-lg"
                  />
                </div>
                
                <div>
                  <p className="text-2xl font-bold mb-4">
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      maximumFractionDigits: 0,
                    }).format(showQuickView.price)}
                  </p>
                  
                  <p className="text-gray-600 mb-6">{showQuickView.description}</p>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => {
                          handleAddToCart(showQuickView);
                          setShowQuickView(null);
                        }}
                        className="w-full bg-gray-100 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-200"
                      >
                        Add to Cart
                      </button>
                      
                      <button
                        onClick={() => {
                          handleAddToCart(showQuickView);
                          setShowQuickView(null);
                          setShowCart(true);
                        }}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
                      >
                        Buy Now
                      </button>
                    </div>
                    
                    <button
                      onClick={() => toggleWishlist(showQuickView.id)}
                      className="w-full border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 flex items-center justify-center gap-2"
                    >
                      {wishlist.includes(showQuickView.id) ? (
                        <>
                          <HeartSolidIcon className="h-5 w-5 text-red-500" />
                          Remove from Wishlist
                        </>
                      ) : (
                        <>
                          <HeartIcon className="h-5 w-5" />
                          Add to Wishlist
                        </>
                      )}
                    </button>

                    {/* Product Specifications */}
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Specifications</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.entries(showQuickView.specifications).map(([key, value]) => (
                          <div key={key} className="flex flex-col">
                            <span className="text-gray-600 capitalize">{key}</span>
                            <span className="font-medium">
                              {Array.isArray(value) ? value.join(', ') : value.toString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Promotional Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-2">Free Shipping on Orders Over ₹999</h2>
          <p className="text-blue-100 text-lg">Limited time offer. Don't miss out!</p>
        </div>
      </div>
    </div>
  );
};

export default Home; 