import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <Link to={`/product/${product._id}`}>
        <img 
          src={product.main_image} 
          alt={product.name} 
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-4">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
          {product.category?.name}
        </span>
        <h3 className="text-lg font-bold text-gray-900 mt-1 truncate">{product.name}</h3>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-gray-900">Rs.{product.price}</span>
          <button className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;