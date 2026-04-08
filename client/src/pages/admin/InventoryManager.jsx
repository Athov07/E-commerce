import React, { useState, useEffect } from "react";
import {
  Search,
  Package,
  Plus,
  RefreshCcw,
  AlertTriangle,
  Edit3,
  Trash2
} from "lucide-react";
import inventoryService from "../../services/inventory.service";
import InventoryForm from "../../components/inventory/InventoryForm";

const InventoryManager = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await inventoryService.getAllInventory(); // Now this works!
      setInventory(res.data || []);
    } catch (err) {
      console.error("Failed to load inventory", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleFormSubmit = async (formData) => {
    try {
      setLoading(true);
      await inventoryService.manageStock(formData);
      setIsModalOpen(false);
      setSelectedItem(null);
      fetchInventory(); // Refresh list
      alert("Inventory updated successfully!");
    } catch (err) {
      alert("Failed to update inventory");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (
      window.confirm(
        "Are you sure you want to remove this item from inventory?",
      )
    ) {
      try {
        setLoading(true);
        await inventoryService.deleteInventory(productId);
        fetchInventory();
      } catch (err) {
        alert("Failed to delete item");
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredInventory = inventory.filter(
    (item) =>
      item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product_id.includes(searchTerm),
  );

  return (
    <div className="p-6 max-w-7xl mx-auto bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
            <Package size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Inventory Management
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Monitor and adjust stock levels
            </p>
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={() => {
              setSelectedItem(null);
              setIsModalOpen(true);
            }}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md"
          >
            <Plus size={18} /> Add Stock
          </button>
          <button
            onClick={fetchInventory}
            className="p-2.5 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
          >
            <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by Product Name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-gray-300 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-gray-600 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Product Details</th>
                <th className="px-6 py-4 font-semibold">Product ID</th>
                <th className="px-6 py-4 font-semibold text-center">
                  Current Stock
                </th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInventory.map((item) => (
                <tr
                  key={item.product_id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-800">
                      {item.product_name}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">
                    {item.product_id}
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-gray-900">
                    {item.stock}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {item.stock <= 10 ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
                        <AlertTriangle size={12} /> Low Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold bg-green-50 text-green-600 border border-green-200">
                        In Stock
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-all"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.product_id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <InventoryForm
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleFormSubmit}
          isLoading={loading}
          initialData={selectedItem}
        />
      )}
    </div>
  );
};

export default InventoryManager;
