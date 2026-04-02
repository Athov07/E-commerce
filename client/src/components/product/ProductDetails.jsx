import React from "react";
import { ShoppingCart, CheckCircle, AlertCircle } from "lucide-react";

const ProductDetails = ({ product }) => {
  return (
    <div className="space-y-6">
      <div>
        <span className="text-blue-600 text-sm font-bold uppercase tracking-widest">
          {product.category?.name}
        </span>
        <h1 className="text-3xl font-bold text-gray-900 mt-2">{product.name}</h1>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-4xl font-black text-gray-900">Rs. {product.price}</span>
        {product.stock > 0 ? (
          <span className="flex items-center gap-1 text-green-600 text-sm font-medium bg-green-50 px-3 py-1 rounded-full">
            <CheckCircle size={14} /> In Stock ({product.stock})
          </span>
        ) : (
          <span className="flex items-center gap-1 text-red-600 text-sm font-medium bg-red-50 px-3 py-1 rounded-full">
            <AlertCircle size={14} /> Out of Stock
          </span>
        )}
      </div>

      <p className="text-gray-600 leading-relaxed">{product.description}</p>

      {/* Dynamic Attributes Mapping */}
      {product.attributes && Object.keys(product.attributes).length > 0 && (
        <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-100">
          {Object.entries(product.attributes).map(([key, value]) => (
            <div key={key}>
              <span className="text-xs text-gray-400 uppercase font-bold">{key}</span>
              <p className="text-gray-900 font-medium">{value}</p>
            </div>
          ))}
        </div>
      )}

      <button 
        disabled={product.stock === 0}
        className="w-full md:w-auto flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-xl font-bold transition-all shadow-lg shadow-blue-200"
      >
        <ShoppingCart size={20} />
        Add to Cart
      </button>
    </div>
  );
};

export default ProductDetails;