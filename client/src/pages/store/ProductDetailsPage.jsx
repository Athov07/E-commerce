import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import productService from "../../services/product.service";
import ProductSlider from "../../components/product/ProductSlider";
import ProductDetails from "../../components/product/ProductDetails";
import ProductCard from "../../components/product/ProductCard";
import { Loader2 } from "lucide-react";

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // 1. Fetch main product
        const res = await productService.getProductById(productId);
        setProduct(res.data);

        // 2. Fetch related products (Simulated by getting all and filtering by category)
        const allRes = await productService.getAllProducts();
        const matches = allRes.data.filter(
          (p) => p.category?._id === res.data.category?._id && p._id !== productId
        );
        setRelated(matches.slice(0, 4)); // Show top 4
      } catch (err) {
        console.error("Error loading product details:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    window.scrollTo(0, 0); // Reset scroll on entry
  }, [productId]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  if (!product) return <p className="text-center py-20">Product not found.</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* --- Main Product Section --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        <ProductSlider 
          mainImage={product.main_image} 
          gallery={product.gallery} 
        />
        <ProductDetails product={product} />
      </div>

      {/* --- Related Products Section --- */}
      {related.length > 0 && (
        <div className="border-t pt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage;