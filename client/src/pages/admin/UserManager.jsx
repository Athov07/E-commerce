import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Edit, Trash2, UserPlus, ShieldCheck } from 'lucide-react';

const UserManager = () => {
  const [users, setUsers] = useState([
    // Temporary mock data until your service is connected
    { _id: '1', phone: '9876543210', role: 'admin', is_verified: true, createdAt: '2023-10-01' },
    { _id: '2', phone: '1234567890', role: 'user', is_verified: true, createdAt: '2023-11-15' },
    { _id: '3', phone: '5556667777', role: 'seller', is_verified: false, createdAt: '2024-01-20' },
  ]);

  return (
    <div className="space-y-6">
      {/* --- PAGE HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500">View, edit, and manage platform permissions.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm">
          <UserPlus size={18} />
          <span>Add New User</span>
        </button>
      </div>

      {/* --- FILTERS & SEARCH --- */}
      <div className="flex flex-col md:flex-row gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by phone number..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <select className="appearance-none pl-4 pr-10 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer">
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="seller">Seller</option>
              <option value="user">User</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      {/* --- USER TABLE --- */}
      <div className="overflow-x-auto border border-gray-100 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold border-b">Phone Number</th>
              <th className="px-6 py-4 font-semibold border-b">Role</th>
              <th className="px-6 py-4 font-semibold border-b">Status</th>
              <th className="px-6 py-4 font-semibold border-b">Joined Date</th>
              <th className="px-6 py-4 font-semibold border-b text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-6 py-4 text-gray-900 font-medium">
                  {user.phone}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                    user.role === 'seller' ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role === 'admin' && <ShieldCheck size={12} />}
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    user.is_verified ? 'text-green-600 bg-green-50' : 'text-gray-500 bg-gray-50'
                  }`}>
                    {user.is_verified ? 'Verified' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 text-sm">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md" title="Edit">
                      <Edit size={18} />
                    </button>
                    <button className="p-1.5 text-red-600 hover:bg-red-100 rounded-md" title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- PAGINATION (Footer) --- */}
      <div className="flex items-center justify-between px-2 text-sm text-gray-500">
        <p>Showing {users.length} users</p>
        <div className="flex gap-2">
          <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
          <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">Next</button>
        </div>
      </div>
    </div>
  );
};

export default UserManager;