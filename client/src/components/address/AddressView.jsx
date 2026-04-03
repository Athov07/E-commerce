import React from "react";
import { MapPin, Trash2, Edit3, CheckCircle2 } from "lucide-react";

const AddressView = ({ addresses, onDelete, onEdit }) => {
  return (
    <div className="grid grid-cols-1 gap-4 mt-8">
      {addresses.map((addr) => (
        <div key={addr._id} className={`p-5 border ${addr.isDefault ? 'border-blue-200 bg-blue-50/30' : 'border-gray-100 bg-white'} rounded-2xl shadow-sm hover:shadow-md transition-all flex justify-between items-center`}>
          <div className="flex gap-4">
            <div className={`p-3 rounded-xl ${addr.isDefault ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
              <MapPin size={20}/>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-gray-900">{addr.full_name}</p>
                {addr.isDefault && <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full uppercase font-bold">Default</span>}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {addr.address_line_1}, {addr.address_line_2 && `${addr.address_line_2}, `}
                {addr.city}, {addr.state} - <span className="font-semibold">{addr.pin_code}</span>
              </p>
              <p className="text-sm text-gray-500 font-medium">Phone: {addr.phone}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onEdit(addr)} 
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              title="Edit Address"
            >
              <Edit3 size={18} />
            </button>
            <button 
              onClick={() => onDelete(addr._id)} 
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              title="Delete Address"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AddressView;