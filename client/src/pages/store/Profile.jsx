import React, { useState, useEffect } from "react";
import profileService from "../../services/profile.service";
import addressService from "../../services/address.service"; // Ensure this service exists
import ProfileCard from "../../components/profile/ProfileCard";
import ProfileForm from "../../components/profile/ProfileForm";
import AddressView from "../../components/address/AddressView";
import AddressForm from "../../components/address/AddressForm";
import { Loader2, UserCircle, MapPin, Plus } from "lucide-react";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addressLoading, setAddressLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [profileRes, addressRes] = await Promise.all([
        profileService.getProfile(),
        addressService.getAddresses()
      ]);
      setProfile(profileRes?.data || profileRes);
      setAddresses(addressRes?.data || addressRes || []);
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Profile Logic ---
  const handleUpdateProfile = async (formData) => {
    try {
      setLoading(true);
      const updated = await profileService.updateProfile(formData);
      setProfile(updated?.data || updated);
      setIsEditingProfile(false);
    } catch (err) {
      alert("Update failed.");
    } finally {
      setLoading(false);
    }
  };

  // --- Address Logic ---
  const handleAddressSubmit = async (data) => {
    setAddressLoading(true);
    try {
      if (editingAddress) {
        await addressService.updateAddress(editingAddress._id, data);
      } else {
        await addressService.addAddress(data);
      }
      const freshAddresses = await addressService.getAddresses();
      setAddresses(freshAddresses?.data || freshAddresses);
      setIsAddingAddress(false);
      setEditingAddress(null);
    } catch (err) {
      alert("Address action failed.");
    } finally {
      setAddressLoading(false);
    }
  };

  const handleEditAddress = (addr) => {
    setEditingAddress(addr);
    setIsAddingAddress(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Delete this address?")) return;
    try {
      await addressService.deleteAddress(id);
      setAddresses(addresses.filter(a => a._id !== id));
    } catch (err) {
      alert("Delete failed.");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40 bg-background min-h-screen">
      <Loader2 className="animate-spin text-primary mb-4" size={40} />
      <p className="text-secondary font-medium tracking-tight">Loading your dashboard...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary rounded-lg text-white shadow-md">
            <UserCircle size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Account Dashboard</h1>
            <p className="text-sm text-secondary font-medium">Manage your identity and shipping addresses</p>
          </div>
        </div>

        {/* Profile Card Section */}
        <ProfileCard 
          profile={profile} 
          onEditClick={() => setIsEditingProfile(true)}
          onAddAddressClick={() => setIsAddingAddress(!isAddingAddress)} 
        />

        {/* Address Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2">
              <MapPin className="text-primary" size={20} />
              <h2 className="text-xl font-bold text-gray-800">Saved Addresses</h2>
            </div>
          </div>

          {isAddingAddress && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-300">
              <AddressForm 
                onSubmit={handleAddressSubmit} 
                loading={addressLoading}
                initialData={editingAddress}
                onCancel={() => { setIsAddingAddress(false); setEditingAddress(null); }}
              />
            </div>
          )}

          <AddressView 
            addresses={addresses} 
            onEdit={handleEditAddress}
            onDelete={handleDeleteAddress}
            onSelect={() => {}} // Not needed on Profile page
          />
        </div>

        {/* Modals */}
        {isEditingProfile && (
          <ProfileForm 
            profile={profile} 
            onCancel={() => setIsEditingProfile(false)} 
            onSave={handleUpdateProfile} 
          />
        )}
      </div>
    </div>
  );
};

export default Profile;