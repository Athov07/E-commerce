import React, { useState, useEffect } from "react";
import addressService from "../../services/address.service";
import AddressForm from "../../components/address/AddressForm";
import AddressView from "../../components/address/AddressView";
import { Loader2, MapPinned, Plus, X } from "lucide-react";

const Address = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showForm, setShowForm] = useState(false); // Controls form visibility

  const fetchAddresses = async () => {
    try {
      const res = await addressService.getAddresses();
      setAddresses(res.data || res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSubmit = async (data) => {
    setBtnLoading(true);
    try {
      if (editingAddress) {
        await addressService.updateAddress(editingAddress._id, data);
        setEditingAddress(null);
      } else {
        await addressService.addAddress(data);
      }
      setShowForm(false); // Close form after success
      fetchAddresses();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    } finally {
      setBtnLoading(false);
    }
  };

  const handleEdit = (addr) => {
    setEditingAddress(addr);
    setShowForm(true); // Open form to edit
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setEditingAddress(null);
    setShowForm(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <MapPinned size={32} className="text-blue-600" />
          <h1 className="text-3xl font-black text-gray-900">Delivery Addresses</h1>
        </div>

        {/* Toggle Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            <Plus size={20} /> Add New Address
          </button>
        )}
      </div>

      {/* Conditional Form Rendering */}
      {showForm && (
        <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-700">
              {editingAddress ? "Edit Address" : "Enter Address Details"}
            </h2>
            <button 
              onClick={handleCancel}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <AddressForm
            onSubmit={handleSubmit}
            loading={btnLoading}
            initialData={editingAddress}
            onCancel={handleCancel}
          />
        </div>
      )}

      <hr className="border-gray-100 mb-8" />

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
      ) : addresses.length > 0 ? (
        <AddressView
          addresses={addresses}
          onDelete={(id) => addressService.deleteAddress(id).then(fetchAddresses)}
          onEdit={handleEdit}
        />
      ) : (
        <div className="text-center py-20 text-gray-400 border-2 border-dashed border-gray-100 rounded-3xl mt-8">
          No addresses saved yet. Click the button above to add one.
        </div>
      )}
    </div>
  );
};

export default Address;