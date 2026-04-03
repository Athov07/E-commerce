import React, { useState, useEffect } from "react";
import { Plus, Loader2, Save } from "lucide-react";

const AddressForm = ({ onSubmit, loading, initialData, onCancel }) => {
  const emptyForm = {
    full_name: "",
    phone: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    pin_code: "",
    isDefault: false
  };

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(emptyForm);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    if (!initialData) {
      setFormData({ full_name: "", phone: "", address_line_1: "", address_line_2: "", city: "", state: "", pin_code: "", isDefault: false });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-2xl space-y-4 border border-gray-100 shadow-inner">
      <h3 className="font-bold text-gray-700">{initialData ? "Edit Address" : "Add New Address"}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input 
          type="text" placeholder="Full Name" required
          className="p-3 rounded-xl border border-gray-200 outline-blue-600 bg-white"
          value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})}
        />
        <input 
          type="text" placeholder="Phone Number" required
          className="p-3 rounded-xl border border-gray-200 outline-blue-600 bg-white"
          value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
        />
        <input 
          type="text" placeholder="Address Line 1 (House No, Building)" required
          className="p-3 rounded-xl border border-gray-200 outline-blue-600 bg-white md:col-span-2"
          value={formData.address_line_1} onChange={(e) => setFormData({...formData, address_line_1: e.target.value})}
        />
        <input 
          type="text" placeholder="Address Line 2 (Area, Landmark)"
          className="p-3 rounded-xl border border-gray-200 outline-blue-600 bg-white md:col-span-2"
          value={formData.address_line_2} onChange={(e) => setFormData({...formData, address_line_2: e.target.value})}
        />
        <input 
          type="text" placeholder="City" required
          className="p-3 rounded-xl border border-gray-200 outline-blue-600 bg-white"
          value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})}
        />
        <input 
          type="text" placeholder="State" required
          className="p-3 rounded-xl border border-gray-200 outline-blue-600 bg-white"
          value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})}
        />
        <input 
          type="number" placeholder="Pin Code" required
          className="p-3 rounded-xl border border-gray-200 outline-blue-600 bg-white"
          value={formData.pin_code} onChange={(e) => setFormData({...formData, pin_code: e.target.value})}
        />
        <div className="flex items-center gap-2 px-2">
          <input 
            type="checkbox" id="isDefault"
            checked={formData.isDefault} onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
          />
          <label htmlFor="isDefault" className="text-sm text-gray-600">Set as default address</label>
        </div>
      </div>
      
      <div className="flex gap-3">
        <button 
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all"
        >
          {loading ? <Loader2 className="animate-spin" /> : initialData ? <><Save size={20}/> Update</> : <><Plus size={20}/> Save Address</>}
        </button>
        {initialData && (
          <button type="button" onClick={onCancel} className="px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-500">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default AddressForm;