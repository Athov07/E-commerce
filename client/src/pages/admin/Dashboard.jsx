import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  Package,
  ShoppingCart,
  CreditCard,
  MapPin,
  Layers,
  TrendingUp,
  Activity,
  LayoutDashboard,
  RefreshCcw, // Added missing import
} from "lucide-react";

// Import your services
import adminService from "../../services/admin.service";
import productService from "../../services/product.service";
import orderService from "../../services/order.service";
import paymentService from "../../services/payment.service";
import addressService from "../../services/address.service";
import profileService from "../../services/profile.service";

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    payments: 0,
    addresses: 0,
    profiles: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  // 1. Move function outside of useEffect so it is globally available in the component
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      const [
        usersRes,
        productsRes,
        ordersRes,
        paymentsRes,
        addressRes,
        profileRes,
      ] = await Promise.all([
        adminService.getAllUsers(),
        productService.getAllProducts(),
        orderService.getAllOrders(),
        paymentService.getAllPayments(),
        addressService.getAllUserAddresses(),
        profileService.getAllProfiles(),
      ]);

      const getData = (res) => res?.data?.data || res?.data || res || [];

      const orders = getData(ordersRes);
      const payments = getData(paymentsRes);

      const totalRevenue = Array.isArray(payments)
        ? payments.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0)
        : 0;

      setStats({
        users: getData(usersRes).length,
        products: getData(productsRes).length,
        orders: orders.length,
        payments: payments.length,
        addresses: getData(addressRes).length,
        profiles: getData(profileRes).length,
        revenue: totalRevenue,
      });
    } catch (error) {
      console.error("Dashboard Data Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Call the function once on mount
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const statCards = [
    {
      label: "Total Users",
      value: stats.users,
      icon: <Users />,
      color: "bg-blue-500",
    },
    {
      label: "Active Profiles",
      value: stats.profiles,
      icon: <Activity />,
      color: "bg-indigo-500",
    },
    {
      label: "Products",
      value: stats.products,
      icon: <Package />,
      color: "bg-purple-500",
    },
    {
      label: "Total Orders",
      value: stats.orders,
      icon: <ShoppingCart />,
      color: "bg-orange-500",
    },
    {
      label: "Revenue (Rs)",
      value: `${stats.revenue.toLocaleString()}`,
      icon: <TrendingUp />,
      color: "bg-green-500",
    },
    {
      label: "Payments",
      value: stats.payments,
      icon: <CreditCard />,
      color: "bg-emerald-500",
    },
    {
      label: "Saved Addresses",
      value: stats.addresses,
      icon: <MapPin />,
      color: "bg-pink-500",
    },
  ];

  if (loading && stats.users === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
            <LayoutDashboard size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              System Overview
            </h2>
            <p className="text-gray-500">
              Real-time statistics across all microservices.
            </p>
          </div>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
        >
          <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
          {loading ? "Syncing..." : "Sync Database"}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="text-3xl font-black text-gray-900 mt-1">
                  {stat.value}
                </p>
              </div>
              <div
                className={`${stat.color} p-3 rounded-xl text-white shadow-lg shadow-gray-200`}
              >
                {React.cloneElement(stat.icon, { size: 24 })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions / Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Service Health</h3>
            <p className="text-slate-400 text-sm mb-6">
              All systems are currently operational.
            </p>
            <div className="space-y-4">
              {[
                "Auth-Service",
                "Product-Service",
                "Order-Service",
                "Profile-Sync",
              ].map((service) => (
                <div key={service} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="text-sm font-medium text-slate-200">
                    {service}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <Layers
            className="absolute -right-8 -bottom-8 text-slate-800"
            size={200}
          />
        </div>

        <div className="bg-blue-600 text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Platform Growth</h3>
            <p className="text-blue-100 text-sm">
              You have {stats.users} registered customers.
            </p>
          </div>
          <button className="mt-8 bg-white text-blue-600 px-6 py-3 rounded-xl font-bold text-sm w-fit hover:bg-blue-50 transition-colors">
            View Analytics Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;