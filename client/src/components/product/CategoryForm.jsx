import React, { useState } from "react";
import productService from "../../services/product.service";
import { Loader2, Plus, Tag } from "lucide-react";

const CategoryForm = ({ onSuccess }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError("");

    try {
      // Reusing your existing logic from the controller we built earlier
      await productService.createCategory({ name: name.trim() });
      setName("");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Category Error:", err);
      setError(err.response?.data?.message || "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border shadow-sm max-w-md mx-auto h-auto overflow-visible">
      <div className="flex items-center gap-2 mb-4 text-gray-800">
        <Tag size={20} className="text-blue-600" />
        <h2 className="text-lg font-bold">New Category</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Category Name (e.g. Millets, Grains)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
          {error && <p className="text-red-500 text-xs mt-2 ml-1">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
          Add Category
        </button>
      </form>
    </div>
  );
};

export default CategoryForm;