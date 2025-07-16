import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StarIcon, HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

const ProductCard = ({
  id,
  image,
  name,
  price,
  badge,
  onAddToCart,
  onQuickView,
  onWishlist,
  isWishlisted,
  rating,
  reviews,
  stock,
  description
}) => {
  const navigate = useNavigate();
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
          <StarSolidIcon key={i} className="h-4 w-4 text-yellow-400" />
        ) : (
          <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
        )
      );
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div 
        className="relative group cursor-pointer"
        onClick={() => navigate(`/product/${id}`)}
      >
        <img
          src={image}
          alt={name}
          className="w-full h-64 object-cover group-hover:opacity-90 transition-opacity"
        />
        
        {/* Badge */}
        {badge && (
          <span className="absolute top-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
            {badge}
          </span>
        )}

        {/* Quick actions */}
        <div className="absolute top-2 right-2">
          <button
            onClick={onWishlist}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
          >
            {isWishlisted ? (
              <HeartSolidIcon className="h-5 w-5 text-red-500" />
            ) : (
              <HeartOutlineIcon className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Stock status */}
        {stock < 10 && (
          <div className="absolute bottom-2 left-2 px-2 py-1 bg-red-600 text-white text-xs rounded-full">
            Only {stock} left!
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-medium text-lg mb-1 line-clamp-2">{name}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{description}</p>
        
        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex mr-1">
            {renderStars(rating)}
          </div>
          <span className="text-sm text-gray-600">({reviews})</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-bold text-gray-900">
            {formatPrice(price)}
          </span>
          {stock === 0 ? (
            <span className="text-red-600 text-sm font-medium">Out of Stock</span>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onAddToCart}
            disabled={stock === 0}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Add to Cart
          </button>
          <button
            onClick={onQuickView}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 