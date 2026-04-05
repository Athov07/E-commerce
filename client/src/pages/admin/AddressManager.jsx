import React, { useState, useEffect } from "react";
import { Search, RefreshCcw, User, Phone, MapPin, Globe, Hash, Filter } from "lucide-react";
import addressService from "../../services/address.service";

const AddressManager = () => {
  const [userSummaries, setUserSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stateFilter, setStateFilter] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await addressService.getAllUserAddresses();
      setUserSummaries(res.data || []);
    } catch (err) {
      console.error("Failed to load address summary", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Filtering Logic ---
  const filteredData = userSummaries.filter((item) => {
    const name = item.name?.toLowerCase() || "";
    const userId = item.user_id?.toLowerCase() || "";
    const state = item.state?.toLowerCase() || "";
    
    const matchesSearch = name.includes(searchTerm.toLowerCase()) || userId.includes(searchTerm.toLowerCase());
    const matchesState = stateFilter === "" || state.includes(stateFilter.toLowerCase());
    
    return matchesSearch && matchesState;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Address Management</h2>
          <p className="text-sm text-gray-500 mt-1">Total Users with Addresses: {userSummaries.length}</p>
        </div>
        
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
        >
          <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
          {loading ? "Syncing..." : "Sync Database"}
        </button>
      </div>

      {/* --- Filter Bar (Matching ProductManager Style) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Search by name or User ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
          />
        </div>

        <div className="relative group">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Filter by State..."
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">User Info</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Contact</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Default Location</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Region & ZIP</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">Total saved</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredData.length > 0 ? (
              filteredData.map((user) => (
                <tr key={user.user_id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                        <User size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 capitalize">{user.name || "Unknown User"}</p>
                        <p className="text-[10px] font-mono text-gray-400 flex items-center gap-1 mt-0.5">
                          <Hash size={10} /> {user.user_id}
                        </p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                      <Phone size={14} className="text-gray-300" />
                      {user.phone || "No Phone"}
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-start gap-2">
                      <MapPin size={14} className="text-gray-300 mt-0.5" />
                      <p className="text-sm font-medium text-gray-800 leading-tight">
                        {user.city || "N/A"}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="text-sm font-bold text-gray-900">{user.state || "---"}</div>
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-1 font-bold uppercase tracking-tighter">
                      <Globe size={12} className="text-blue-400" /> {user.country} • {user.pin_code}
                    </div>
                  </td>

                  <td className="px-6 py-5 text-right">
                    <span className="inline-flex items-center justify-center bg-gray-900 text-white text-[10px] font-black h-7 w-12 rounded-full shadow-inner">
                      {user.totalAddresses}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center">
                    <MapPin size={48} className="text-gray-200 mb-4" />
                    <h3 className="text-lg font-bold text-gray-400">No records found</h3>
                    <p className="text-sm text-gray-300">Try adjusting your filters or sync the database.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddressManager;