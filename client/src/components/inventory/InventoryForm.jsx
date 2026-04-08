import React, { useState } from "react";
import { Package, X } from "lucide-react";

const InventoryForm = ({ onSubmit, onClose, isLoading, initialData = null }) => {
  const [data, setData] = useState({
    product_id: initialData?.product_id || "",
    product_name: initialData?.product_name || "",
    stock: initialData?.stock || 0,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!data.product_id || data.product_id.length < 10) {
      alert("Please enter a valid Product ID.");
      return;
    }

    if (data.stock < 0) {
      alert("Stock cannot be negative.");
      return;
    }

    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Package size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {initialData ? "Update Stock" : "Add Inventory"}
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form className="p-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product ID (Database ID)
            </label>
            <input
              type="text"
              placeholder="Enter Product ID"
              required
              disabled={!!initialData}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-gray-50"
              onChange={(e) => setData({ ...data, product_id: e.target.value })}
              value={data.product_id}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              placeholder="Product Name"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              onChange={(e) => setData({ ...data, product_name: e.target.value })}
              value={data.product_name}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock Quantity
            </label>
            <input
              type="number"
              placeholder="0"
              required
              min="0"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              onChange={(e) => setData({ ...data, stock: parseInt(e.target.value) })}
              value={data.stock}
            />
          </div>

          <button
            disabled={isLoading}
            className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md disabled:bg-blue-300 mt-4"
          >
            {isLoading ? "Saving..." : initialData ? "Update Inventory" : "Add to Inventory"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InventoryForm;