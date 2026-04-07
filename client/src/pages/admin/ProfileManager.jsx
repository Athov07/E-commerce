import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  RefreshCcw,
  UserCheck,
  ShieldAlert,
  Phone,
  Calendar,
  UserCircle,
} from "lucide-react";
import profileService from "../../services/profile.service";

const ProfileManager = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const res = await profileService.getAllProfiles();

      // If your backend wraps data in a 'data' field, use res.data
      // If it returns the array directly, use res
      const data = res.data || res;
      setProfiles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Admin Profile Sync Failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  // --- Search Logic ---
  const filteredProfiles = profiles.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.fullName?.toLowerCase().includes(term) ||
      p.phone?.includes(term) ||
      (p.userId?.$oid || p.userId || "").toString().includes(term)
    );
  });

  // --- Quick Stats ---
  const totalUsers = profiles.length;
  const completedProfiles = profiles.filter(
    (p) => p.avatar_url && p.fullName,
  ).length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
            <UserCircle size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              User Administration
            </h2>
            <p className="text-lg text-gray-600 mt-1">
              Total profiles: {profiles.length}
            </p>
          </div>
        </div>

        <button
          onClick={fetchProfiles}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
        >
          <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
          {loading ? "Fetching..." : "Refresh Data"}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
              <Users size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Total Users
              </p>
              <p className="text-2xl font-black text-gray-900">{totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-green-50 p-3 rounded-xl text-green-600">
              <UserCheck size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Completed Profiles
              </p>
              <p className="text-2xl font-black text-gray-900">
                {completedProfiles}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative mb-6 group">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"
          size={20}
        />
        <input
          type="text"
          placeholder="Search by name, phone number, or User ID..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold border-b">
                  User Profile
                </th>
                <th className="px-6 py-4 font-semibold border-b">
                  Contact Details
                </th>
                <th className="px-6 py-4 font-semibold border-b">
                  Database Identity
                </th>
                <th className="px-6 py-4 font-semibold border-b">
                  Registration Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProfiles.length > 0 ? (
                filteredProfiles.map((profile) => (
                  <tr
                    key={profile._id?.$oid || profile._id}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl overflow-hidden border-2 border-white shadow-sm bg-gray-100 flex-shrink-0">
                          <img
                            src={profile.avatar_url || "/default-avatar.png"}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) =>
                              (e.target.src = "/default-avatar.png")
                            }
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {profile.fullName || "Unset Name"}
                          </p>
                          <p className="text-[10px] text-gray-400 font-medium">
                            Standard Account
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm text-gray-900 font-semibold">
                        <Phone size={14} className="text-blue-500" />
                        {profile.phone || "No Phone Provided"}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-[12px] text-gray-900 bg-gray-50 px-2 py-0.5 rounded border border-gray-100 w-fit">
                          UID: {profile.userId?.$oid || profile.userId || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-900">
                          <Calendar size={12} className="text-gray-600" />
                          {profile.createdAt?.$date
                            ? new Date(
                                profile.createdAt.$date,
                              ).toLocaleDateString()
                            : profile.createdAt
                              ? new Date(profile.createdAt).toLocaleDateString()
                              : "2026"}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="bg-gray-50 p-4 rounded-full text-gray-300">
                        <Users size={40} />
                      </div>
                      <p className="text-gray-500 font-medium">
                        No matching profiles found in the system.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProfileManager;
