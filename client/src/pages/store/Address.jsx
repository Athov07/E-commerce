import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import addressService from "../../services/address.service";
import AddressForm from "../../components/address/AddressForm";
import AddressView from "../../components/address/AddressView";
import { Loader2, MapPinned, Plus, X } from "lucide-react";

const Address = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showForm, setShowForm] = useState(false);

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
      setShowForm(false);
      fetchAddresses();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    } finally {
      setBtnLoading(false);
    }
  };

  const handleSelectAddress = (address) => {
    // Pass address object to Order page via React Router state
    navigate("/order", { state: { selectedAddress: address } });
  };

  const handleEdit = (addr) => {
    setEditingAddress(addr);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <MapPinned size={32} className="text-blue-600" />
          <h1 className="text-3xl font-black text-gray-900">Choose Address</h1>
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-white border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-2xl font-bold hover:bg-blue-50 transition-all"
          >
            <Plus size={20} /> Add New
          </button>
        )}
      </div>

      {showForm && (
        <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-700">Address Details</h2>
            <button onClick={() => { setShowForm(false); setEditingAddress(null); }} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
              <X size={20} />
            </button>
          </div>
          <AddressForm
            onSubmit={handleSubmit}
            loading={btnLoading}
            initialData={editingAddress}
            onCancel={() => { setShowForm(false); setEditingAddress(null); }}
          />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
      ) : addresses.length > 0 ? (
        <AddressView
          addresses={addresses}
          onDelete={(id) => addressService.deleteAddress(id).then(fetchAddresses)}
          onEdit={handleEdit}
          onSelect={handleSelectAddress}
        />
      ) : (
        <div className="text-center py-24 text-gray-400 border-2 border-dashed border-gray-200 rounded-3xl">
          <MapPinned className="mx-auto mb-4 opacity-20" size={64} />
          <p>No addresses found. Please add a delivery address to proceed.</p>
        </div>
      )}
    </div>
  );
};

export default Address;