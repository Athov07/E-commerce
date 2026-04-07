import React from "react";
import {
  Search,
  Filter,
  Trash2,
  UserPlus,
  ShieldCheck,
  Loader2,
  Users,
} from "lucide-react";
import UserLogic from "../../components/auth/UserLogic";

const UserManager = () => {
  return (
    <UserLogic>
      {({
        users,
        filteredUsers,
        loading,
        error,
        searchTerm,
        setSearchTerm,
        roleFilter,
        setRoleFilter,
        handleDelete,
      }) => {
        if (loading)
          return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
              <Loader2 className="animate-spin mb-2" size={32} />
              <p>Loading user database...</p>
            </div>
          );

        return (
          <div className="space-y-6">
            {/* PAGE HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                  <Users size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    User Management
                  </h1>
                  <p className="text-lg text-gray-600 mt-1">
                    Total users: {users.length}
                  </p>
                </div>
              </div>
              <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all shadow-sm">
                <UserPlus size={18} />
                <span>Add New User</span>
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* FILTERS & SEARCH */}
            <div className="flex flex-col md:flex-row gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="relative flex-grow">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search by phone number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
              </div>
              <div className="relative">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 border border-gray-200 rounded-lg bg-white outline-none cursor-pointer"
                >
                  <option value="">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="seller">Seller</option>
                  <option value="user">User</option>
                </select>
                <Filter
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={16}
                />
              </div>
            </div>

            {/* USER TABLE */}
            <div className="overflow-x-auto border border-gray-100 rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold border-b">
                      Phone Number
                    </th>
                    <th className="px-6 py-4 font-semibold border-b">Role</th>
                    <th className="px-6 py-4 font-semibold border-b">Status</th>
                    <th className="px-6 py-4 font-semibold border-b">
                      Joined Date
                    </th>
                    <th className="px-6 py-4 font-semibold border-b text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr
                        key={user._id}
                        className="hover:bg-blue-50/30 transition-colors"
                      >
                        <td className="px-6 py-4 text-gray-900 font-medium">
                          {user.phone}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-700"
                                : user.role === "seller"
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {user.role === "admin" && <ShieldCheck size={12} />}
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${user.is_verified ? "text-green-600 bg-green-50" : "text-gray-500 bg-gray-50"}`}
                          >
                            {user.is_verified ? "Verified" : "Pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-sm">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="p-1.5 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-10 text-center text-gray-400"
                      >
                        No users found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-2 text-sm text-gray-500">
              Showing {filteredUsers.length} of {users.length} users
            </div>
          </div>
        );
      }}
    </UserLogic>
  );
};

export default UserManager;
