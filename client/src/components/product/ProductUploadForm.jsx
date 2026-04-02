import React, { useState, useEffect } from "react";
import productService from "../../services/product.service";
import { Loader2, Upload, Plus, Image as ImageIcon, Trash2 } from "lucide-react";

const ProductUploadForm = ({ isEdit, initialData, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    category: initialData?.category?._id || initialData?.category || "",
    stock: initialData?.stock || "",
  });

  // Transform initial attributes object {key: val} into an array [{key, val}] for easy mapping
  const [attributes, setAttributes] = useState(
    initialData?.attributes 
      ? Object.entries(initialData.attributes).map(([k, v]) => ({ key: k, value: v }))
      : [{ key: "", value: "" }]
  );

  const [mainImage, setMainImage] = useState(null);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await productService.getAllCategories();
        const catData = res.data?.data || res.data || res;
        setCategories(Array.isArray(catData) ? catData : []);
      } catch (err) {
        console.error("Failed to load categories");
      }
    };
    fetchCats();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Dynamic Attribute Handlers ---
  const addAttributeField = () => {
    setAttributes([...attributes, { key: "", value: "" }]);
  };

  const removeAttributeField = (index) => {
    const updated = attributes.filter((_, i) => i !== index);
    setAttributes(updated);
  };

  const updateAttribute = (index, field, val) => {
    const updated = [...attributes];
    updated[index][field] = val;
    setAttributes(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      
      // Convert array [{key, value}] back to object {key: value} for Backend
      const attributesObj = attributes.reduce((acc, curr) => {
        if (curr.key.trim()) acc[curr.key.trim()] = curr.value;
        return acc;
      }, {});
      
      data.append("attributes", JSON.stringify(attributesObj));

      if (mainImage) data.append("main_image", mainImage);
      if (gallery.length > 0) {
        Array.from(gallery).forEach((file) => data.append("gallery", file));
      }

      if (isEdit) {
        await productService.updateProduct(initialData._id, data);
      } else {
        await productService.addProduct(data);
      }
      
      onSuccess();
    } catch (err) {
      console.error("Upload Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Operation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-2xl border shadow-sm max-w-2xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input 
          type="text" name="name" placeholder="Product Name" required 
          value={formData.name} onChange={handleInputChange}
          className="p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" 
        />

        <select 
          name="category" value={formData.category} onChange={handleInputChange} required
          className="p-2.5 border rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-gray-600"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>

        <input 
          type="number" name="price" placeholder="Price" required 
          value={formData.price} onChange={handleInputChange}
          className="p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20" 
        />

        <input 
          type="number" name="stock" placeholder="Stock Quantity" required 
          value={formData.stock} onChange={handleInputChange}
          className="p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20" 
        />
      </div>

      <textarea 
        name="description" placeholder="Product Description" rows="3" required
        value={formData.description} onChange={handleInputChange}
        className="w-full p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
      />

      {/* --- DYNAMIC ATTRIBUTES SECTION --- */}
      <div className="space-y-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-bold text-gray-700">Specifications / Attributes</label>
          <button 
            type="button" onClick={addAttributeField}
            className="text-xs flex items-center gap-1 text-blue-600 font-bold hover:underline"
          >
            <Plus size={14} /> Add Field
          </button>
        </div>
        
        {attributes.map((attr, index) => (
          <div key={index} className="flex gap-2 items-center">
            <input 
              type="text" placeholder="Key (e.g. Size)" 
              value={attr.key} onChange={(e) => updateAttribute(index, "key", e.target.value)}
              className="flex-1 p-2 border rounded-lg text-sm outline-none focus:bg-white"
            />
            <input 
              type="text" placeholder="Value (e.g. XL)" 
              value={attr.value} onChange={(e) => updateAttribute(index, "value", e.target.value)}
              className="flex-1 p-2 border rounded-lg text-sm outline-none focus:bg-white"
            />
            {attributes.length > 1 && (
              <button 
                type="button" onClick={() => removeAttributeField(index)}
                className="p-2 text-red-400 hover:text-red-600 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Image Upload Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors">
          <input type="file" id="mainImg" hidden onChange={(e) => setMainImage(e.target.files[0])} />
          <label htmlFor="mainImg" className="cursor-pointer flex flex-col items-center gap-1">
            <Upload size={20} className="text-blue-500" />
            <span className="text-xs font-medium text-gray-600">
              {mainImage ? mainImage.name : "Main Image"}
            </span>
          </label>
        </div>

        <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors">
          <input type="file" id="galleryImg" multiple hidden onChange={(e) => setGallery(e.target.files)} />
          <label htmlFor="galleryImg" className="cursor-pointer flex flex-col items-center gap-1">
            <ImageIcon size={20} className="text-purple-500" />
            <span className="text-xs font-medium text-gray-600">
              {gallery.length > 0 ? `${gallery.length} Images Selected` : "Gallery Images"}
            </span>
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-70"
      >
        {loading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
        {isEdit ? "Update Product" : "Publish Product"}
      </button>
    </form>
  );
};

export default ProductUploadForm;