import React from "react";
import { MapPin, Trash2, Edit3, Navigation } from "lucide-react";

const AddressView = ({ addresses, onDelete, onEdit, onSelect }) => {
  return (
    <div className="grid grid-cols-1 gap-4 mt-8">
      {addresses.map((addr) => (
        <div 
          key={addr._id} 
          className={`p-5 border ${addr.isDefault ? 'border-blue-200 bg-blue-50/30' : 'border-gray-100 bg-white'} rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4`}
        >
          <div className="flex gap-4">
            <div className={`p-4 rounded-2xl h-fit ${addr.isDefault ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
              <MapPin size={24}/>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-gray-900 text-lg">{addr.full_name}</p>
                {addr.isDefault && (
                  <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full uppercase font-black">Default</span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                {addr.address_line_1}, {addr.address_line_2 && `${addr.address_line_2}, `}
                <br />
                {addr.city}, {addr.state} - <span className="font-bold text-gray-900">{addr.pin_code}</span>
              </p>
              <p className="text-sm text-blue-600 font-bold mt-2">Phone: {addr.phone}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0">
            {/* Selection Button */}
            <button 
              onClick={() => onSelect(addr)}
              className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
            >
              <Navigation size={16} /> Deliver Here
            </button>
            
            <div className="flex gap-1">
              <button 
                onClick={() => onEdit(addr)} 
                className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                title="Edit Address"
              >
                <Edit3 size={20} />
              </button>
              <button 
                onClick={() => onDelete(addr._id)} 
                className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                title="Delete Address"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AddressView;