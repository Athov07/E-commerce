import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, Filter, Package } from "lucide-react";
import productService from "../../services/product.service";
import ProductUploadForm from "../../components/product/ProductUploadForm";

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Filter States ---
  const [searchTerm, setSearchTerm] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productService.getAllProducts();
      setProducts(res.data || []);
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --- Filtering Logic ---
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesPrice = maxPrice === "" || p.price <= parseFloat(maxPrice);
    return matchesSearch && matchesPrice;
  });

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete this product?",
      )
    ) {
      try {
        await productService.deleteProduct(id);
        setProducts(products.filter((p) => p._id !== id));
      } catch (err) {
        alert("Deletion failed. Check console for details.");
      }
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleSuccess = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
    fetchProducts();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
            <Package size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Inventory Management
            </h2>
            <p className="text-lg text-gray-600 mt-1">
              Total items: {products.length}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-200"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* --- Filter Bar --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative group">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="relative group">
          <Filter
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"
            size={18}
          />
          <input
            type="number"
            placeholder="Filter by max price (Rs)..."
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold">
                {editingProduct ? "Edit Product" : "Create New Product"}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-gray-400 hover:text-gray-900 text-2xl font-light"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <ProductUploadForm
                isEdit={!!editingProduct}
                initialData={editingProduct}
                onSuccess={handleSuccess}
              />
            </div>
          </div>
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white rounded-3xl border border-gray-300 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold border-b">Product</th>
              <th className="px-6 py-4 font-semibold border-b">Category</th>
              <th className="px-6 py-4 font-semibold border-b">Price</th>
              <th className="px-6 py-4 font-semibold border-b">Stock</th>
              <th className="px-6 py-4 font-semibold border-b text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((p) => (
                <tr
                  key={p._id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4 flex items-center gap-4">
                    <img
                      src={p.main_image}
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                    />
                    <span className="font-bold text-gray-900 truncate max-w-[200px]">
                      {p.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-800">
                    {p.category?.name || "Uncategorized"}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">
                    Rs.{p.price}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-bold ${p.stock < 10 ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}
                    >
                      {p.stock} units
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEditClick(p)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-10 text-center text-gray-500 italic"
                >
                  No products found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManager;
