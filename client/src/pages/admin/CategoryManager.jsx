import React, { useState, useEffect } from "react";
import productService from "../../services/product.service";
import { Loader2, Tag, Trash2, AlertCircle, Search } from "lucide-react";

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Search State ---
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await productService.getAllCategories();
      const data = res.data?.data || res.data || res;
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // --- Filter Logic ---
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    setIsSubmitting(true);
    try {
      await productService.createCategory({ name: categoryName.trim() });
      setCategoryName("");
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    try {
      await productService.deleteCategory(id);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete category");
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto h-auto overflow-visible">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
          <Tag size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Category Manager</h1>
          <p className="text-lg text-gray-600 mt-1">
            Total categories: {categories.length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Form Section */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-300 shadow-lg h-auto overflow-visible">
          <h2 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">
            Create New
          </h2>
          <form onSubmit={handleAddCategory} className="space-y-4">
            <input
              type="text"
              placeholder="e.g. Organic Millets"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting || !categoryName.trim()}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-blue-700 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Plus size={20} />
              )}
              Add Category
            </button>
          </form>
        </div>

        {/* Table Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative group">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>

          <div className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-300 bg-gray-50/50">
              <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">
                Available Categories
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-xs uppercase font-bold">
                    <th className="p-4 border-b border-gray-300">Category Name</th>
                    <th className="p-4 border-b border-gray-300 text-center w-24">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan="2" className="p-10 text-center">
                        <Loader2 className="animate-spin mx-auto text-blue-500" />
                      </td>
                    </tr>
                  ) : filteredCategories.length > 0 ? (
                    filteredCategories.map((cat) => (
                      <tr
                        key={cat._id}
                        className="hover:bg-blue-50/30 transition-colors"
                      >
                        <td className="p-4 text-gray-700 font-medium">
                          {cat.name}
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleDelete(cat._id)}
                            className="p-2 text-red-600 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="2"
                        className="p-10 text-center text-gray-400"
                      >
                        <AlertCircle
                          className="mx-auto mb-2 opacity-20"
                          size={40}
                        />
                        {searchTerm
                          ? "No matching categories found."
                          : "No categories found."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Plus = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export default CategoryManager;
