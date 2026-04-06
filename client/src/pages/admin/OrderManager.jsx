import React, { useState, useEffect } from "react";
import { Search, Filter, Eye, RefreshCcw, PackageCheck } from "lucide-react";
import orderService from "../../services/order.service";

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const statusOptions = [
    "CREATED",
    "CONFIRMED",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const res = await orderService.getAllOrders();
      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      // Update local state to reflect change
      setOrders(
        orders.map((o) =>
          o._id === orderId ? { ...o, status: newStatus } : o,
        ),
      );
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.shipping_phone.includes(searchTerm) || o._id.includes(searchTerm);
    const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
            Order Management
          </h2>
          <p className="text-sm text-secondary mt-1">
            Manage customer fulfillment and statuses
          </p>
        </div>
        <button
          onClick={fetchAllOrders}
          className="flex items-center gap-2 text-white bg-primary hover:bg-primary/20 px-4 py-2 rounded-lg font-bold transition-all"
        >
          <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
          Refresh List
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by Order ID or Phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <div className="relative">
          <Filter
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none font-medium"
          >
            <option value="ALL">All Statuses</option>
            {statusOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-wider text-right">
                Update Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredOrders.map((order) => (
              <tr
                key={order._id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <span className="font-bold text-gray-900 text-sm">
                    #{order._id.slice(-8).toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-gray-800">
                    {order.shipping_name}
                  </div>
                  <div className="text-xs text-secondary">
                    {order.shipping_phone}
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-primary text-sm">
                  Rs.{order.final_amount}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                      order.status === "DELIVERED"
                        ? "bg-success/10 text-success border-success/20"
                        : "bg-accent/10 text-accent border-accent/20"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className="text-xs font-bold border border-gray-200 rounded-md p-1.5 focus:border-primary outline-none"
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManager;
