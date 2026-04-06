import React, { useState, useEffect } from "react";
import { Camera, Save, Lock, Loader2 } from "lucide-react";

const ProfileForm = ({ profile, onCancel, onSave, isLoading }) => {
  const [formData, setFormData] = useState({
    fullName: profile?.fullName ?? "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(profile?.avatar_url || "/default-avatar.png");

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("fullName", formData.fullName);
    if (file) data.append("avatar", file);
    onSave(data);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      {/* Main Form Container 
          - max-h-[85vh]: Limits form height so it doesn't exceed screen
          - overflow-y-auto: Makes the internal content scrollable
          - scrollbar-hide: Using standard CSS classes to hide bar
      */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header - Fixed at top of form */}
        <div className="p-6 border-b bg-white rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
          <p className="text-sm text-secondary">Update your account details</p>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          
          {/* Avatar Section */}
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative group">
              <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-background shadow-md bg-gray-50">
                <img
                  src={preview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target.src = "/default-avatar.png")}
                />
              </div>
              <label className="absolute -bottom-2 -right-2 p-2 bg-primary text-white rounded-xl shadow-lg cursor-pointer hover:bg-blue-700 transition-all active:scale-90">
                <Camera size={20} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
            <span className="mt-4 text-[11px] font-bold text-secondary uppercase tracking-widest">
              Profile Picture
            </span>
          </div>

          {/* Full Name Field */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              required
              placeholder="John Doe"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-800"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
            />
          </div>

          {/* Locked Phone Field */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              Phone Number <Lock size={14} className="text-secondary" />
            </label>
            <div className="relative">
              <input
                type="text"
                disabled
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-secondary font-medium cursor-not-allowed"
                value={profile?.phone ?? ""}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-success"></div>
                <span className="text-[10px] font-bold text-success uppercase">Verified</span>
              </div>
            </div>
          </div>

          {/* Placeholder for more content to test scrolling */}
          <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
            <p className="text-[11px] text-primary font-medium leading-relaxed">
              Note: Your phone number is verified and linked to your secure login. 
              To change your primary contact, please reach out to support.
            </p>
          </div>
        </div>

        {/* Footer - Fixed at bottom of form */}
        <div className="p-6 border-t bg-gray-50/50 rounded-b-2xl flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 border bg-white rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-all active:scale-[0.98]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-primary text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Save size={20} />
            )}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;