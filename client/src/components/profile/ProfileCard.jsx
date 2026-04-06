import React from "react";
import { Phone, Edit3, Plus } from "lucide-react";

const ProfileCard = ({ profile, onEditClick, onAddAddressClick }) => {
  const defaultAvatar = "/default-avatar.png";

  // Handle both nested Mongo $date objects or standard ISO strings
  const rawDate = profile?.createdAt?.$date || profile?.createdAt;
  const joinedDate = rawDate 
    ? new Date(rawDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) 
    : "2026";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative">
      {/* Top Accent Strip */}
      <div className="h-1.5 w-full bg-primary" />

      {/* Created At - Top Right Corner */}
      <div className="absolute top-6 right-8 text-right hidden sm:block">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Joined</p>
        <p className="text-xs font-bold text-secondary">{joinedDate}</p>
      </div>

      <div className="p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-10">
        
        <div className="relative flex-shrink-0">
          <div className="w-40 h-40 rounded-2xl overflow-hidden border-4 border-background shadow-md bg-gray-50">
            <img
              src={profile.avatar_url || defaultAvatar}
              alt="Avatar"
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = defaultAvatar; }}
            />
          </div>
        </div>

        <div className="flex-1 w-full space-y-6 text-center md:text-left">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 tracking-tight">
              {profile.fullName || "User Name"}
            </h3>
            {/* Mobile-only date view */}
            <p className="text-secondary font-medium text-sm sm:hidden">Member since {joinedDate}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-50">
            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-widest text-gray-400 font-bold">Contact</p>
              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-700 font-bold">
                <Phone size={16} className="text-primary" />
                <span>{profile.phone || "N/A"}</span>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row gap-4">
            <button
              onClick={onEditClick}
              className="flex-1 bg-primary text-white py-2 px-2 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-blue-100 font-bold"
            >
              <Edit3 size={18} /> EDIT PROFILE
            </button>
            <button 
              onClick={onAddAddressClick}
              className="flex-1 bg-primary text-white rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-blue-100 font-bold"
            >
              <Plus size={18} className="text-white" /> ADD ADDRESS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;