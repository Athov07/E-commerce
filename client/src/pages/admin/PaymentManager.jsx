import React, { useState, useEffect } from "react";
import {
  Search,
  RefreshCcw,
  IndianRupee,
  CreditCard,
  XCircle,
  Hash,
  ShieldCheck,
  Filter,
} from "lucide-react";
import paymentService from "../../services/payment.service"; 

const PaymentManager = () => {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    successCount: 0,
    failedCount: 0,
  });
  const [loading, setLoading] = useState(true);
  
  // --- Filter States ---
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchPayments = async () => {
    try {
      setLoading(true);
      // Logic: Using the service you already defined
      const res = await paymentService.getAllPayments(statusFilter);
      setPayments(res.data || []);
      setStats(res.stats || { totalRevenue: 0, successCount: 0, failedCount: 0 });
    } catch (err) {
      console.error("Payment sync failed", err);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when the dropdown filter changes
  useEffect(() => {
    fetchPayments();
  }, [statusFilter]);

  // --- Search Logic (Client-side) ---
  const filtered = payments.filter((p) => {
    return (
      p.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.order_id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Transaction Ledger</h2>
          <p className="text-sm text-gray-500 mt-1">
            Total Success Revenue:{" "}
            <span className="text-green-600 font-bold">Rs. {stats.totalRevenue}</span>
          </p>
        </div>

        <button
          onClick={fetchPayments}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
        >
          <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
          {loading ? "Updating..." : "Refresh Ledger"}
        </button>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-green-50 p-3 rounded-xl text-green-600">
            <IndianRupee size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Successful</p>
            <p className="text-xl font-black text-gray-900">{stats.successCount}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-red-50 p-3 rounded-xl text-red-600">
            <XCircle size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Failed</p>
            <p className="text-xl font-black text-gray-900">{stats.failedCount}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Total Logged</p>
            <p className="text-xl font-black text-gray-900">{payments.length}</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search by Order ID or User ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm text-sm"
          />
        </div>

        <div className="relative group">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none text-gray-500 text-sm"
          >
            <option value="">All Statuses</option>
            <option value="SUCCESS">Success</option>
            <option value="FAILED">Failed</option>
            <option value="CREATED">Created</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Identity</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Amount</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Method</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-center">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length > 0 ? (
              filtered.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <CreditCard size={14} className="text-gray-400" /> 
                      Order: {p.order_id.slice(-6)}
                    </div>
                    <div className="text-[10px] font-mono text-gray-400 mt-1 flex items-center gap-1 uppercase">
                      <Hash size={10} /> User: {p.user_id}
                    </div>
                  </td>
                  <td className="px-6 py-5 font-bold text-gray-700 text-sm">
                    {p.currency} {p.amount}
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-xs font-bold text-gray-700 uppercase tracking-tighter">
                      {p.provider} • {p.payment_method || "N/A"}
                    </div>
                    {p.card && (
                      <div className="text-[10px] text-blue-500 font-bold mt-0.5">
                        {p.card_network} **** {p.card}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border ${
                      p.status === "SUCCESS" ? "bg-green-50 text-green-600 border-green-100" : 
                      p.status === "FAILED" ? "bg-red-50 text-red-700 border-red-100" : "bg-gray-50 text-gray-500 border-gray-100"
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right text-xs font-bold text-gray-500">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-gray-500 italic">
                  No records found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentManager;