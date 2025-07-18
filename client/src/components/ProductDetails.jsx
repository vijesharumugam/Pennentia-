import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { 
  ArrowLeftIcon,
  ShoppingCartIcon,
  HeartIcon,
  StarIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import Checkout from './Checkout';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        // For development, we'll use the mock data
        // In production, uncomment the following line:
        // const response = await axios.get(`${process.env.REACT_APP_API_URL}/products/${id}`);
        
        // Mock data fetch simulation
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockProduct = {
          id: parseInt(id),
          name: "Premium Wireless Headphones",
          price: 24999,
          description: "Experience unparalleled sound quality with our premium wireless headphones. Featuring advanced noise cancellation technology, these headphones deliver crystal-clear audio and exceptional comfort for extended listening sessions.",
          images: [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
            "https://images.unsplash.com/photo-1583394838336-acd977736f90",
            "https://images.unsplash.com/photo-1487215078519-e21cc028cb29"
          ],
          rating: 4.5,
          reviews: 128,
          stock: 50,
          specifications: {
            brand: "SoundMaster",
            model: "WH-1000XM4",
            color: "Matte Black",
            batteryLife: "30 hours",
            connectivity: "Bluetooth 5.0",
            weight: "250g",
            warranty: "1 year"
          },
          features: [
            "Active Noise Cancellation",
            "Touch Controls",
            "Voice Assistant Support",
            "Multipoint Connection",
            "Adaptive Sound Control"
          ]
        };
        setProduct(mockProduct);
      } catch (err) {
        setError('Failed to fetch product details. Please try again later.');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product?.stock) {
      setQuantity(newQuantity);
    }
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= Math.floor(rating) ? (
          <StarSolidIcon key={i} className="h-5 w-5 text-yellow-400" />
        ) : (
          <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
        )
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ArrowPathIcon className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Product Not Found</h2>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back
        </button>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-w-1 aspect-h-1 w-full">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-w-1 aspect-h-1 rounded-lg overflow-hidden ${
                    selectedImage === index ? 'ring-2 ring-blue-600' : ''
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex mr-2">
                {renderStars(product.rating)}
              </div>
              <span className="text-gray-600">({product.reviews} reviews)</span>
            </div>

            <p className="text-gray-600 mb-6">{product.description}</p>

            <div className="flex items-center justify-between mb-6">
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              <button
                onClick={toggleWishlist}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                {isWishlisted ? (
                  <HeartSolidIcon className="h-6 w-6 text-red-500" />
                ) : (
                  <HeartIcon className="h-6 w-6 text-gray-600" />
                )}
              </button>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="p-2 border rounded-md"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="text-lg font-medium">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="p-2 border rounded-md"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
                <span className="text-sm text-gray-500">
                  {product.stock} units available
                </span>
              </div>
            </div>

                          {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <button 
                  onClick={() => {
                    addToCart(product, quantity);
                  }}
                  className="px-6 py-3 bg-gray-100 text-gray-900 rounded-lg font-semibold hover:bg-gray-200 flex items-center justify-center"
                >
                  <ShoppingCartIcon className="h-5 w-5 mr-2" />
                  Add to Cart
                </button>
                <button 
                  onClick={() => setShowCheckout(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                >
                  Buy Now
                </button>
              </div>

              {/* Checkout Modal */}
              {showCheckout && (
                <Checkout
                  onClose={() => setShowCheckout(false)}
                  buyNowItem={{ ...product, quantity }}
                />
              )}

            {/* Delivery Info */}
            <div className="border-t border-b py-6 mb-6">
              <div className="flex items-start space-x-4 mb-4">
                <TruckIcon className="h-6 w-6 text-gray-400" />
                <div>
                  <h3 className="font-medium">Free Delivery</h3>
                  <p className="text-sm text-gray-600">Enter your postal code for delivery availability</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <ShieldCheckIcon className="h-6 w-6 text-gray-400" />
                <div>
                  <h3 className="font-medium">1 Year Warranty</h3>
                  <p className="text-sm text-gray-600">Brand warranty for 1 year</p>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Specifications</h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <span className="text-sm text-gray-600 capitalize">{key}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Key Features</h2>
              <ul className="list-disc list-inside space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="text-gray-600">{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails; 