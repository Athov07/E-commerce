import React, { useState, useRef } from "react";

const ProductSlider = ({ mainImage, gallery = [] }) => {
  // Combine main image and gallery into one array
  const images = [mainImage, ...gallery];
  const [selected, setSelected] = useState(images[0]);
  const [zoomData, setZoomData] = useState({
    backgroundPosition: "0% 0%",
    show: false,
  });

  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;

    setZoomData({
      backgroundPosition: `${x}% ${y}%`,
      show: true,
    });
  };

  const handleMouseLeave = () => {
    setZoomData((prev) => ({ ...prev, show: false }));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* --- THUMBNAILS: Grid layout with no scroll --- */}
      <div className="flex flex-wrap lg:flex-col gap-3 order-2 lg:order-1 content-start">
        {images.map((img, i) => (
          <div
            key={i}
            onMouseEnter={() => setSelected(img)} // Hover to swap
            className={`w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 cursor-pointer transition-all duration-200 shadow-sm ${
              selected === img 
                ? "border-blue-600 ring-2 ring-blue-50 scale-105" 
                : "border-gray-100 opacity-70 hover:opacity-100 hover:border-gray-300"
            }`}
          >
            <img 
              src={img} 
              alt={`thumb-${i}`} 
              className="w-full h-full object-cover" 
              loading="lazy"
            />
          </div>
        ))}
      </div>

      <div className="flex-grow order-1 lg:order-2">
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative aspect-square w-full rounded-3xl border border-gray-100 bg-white overflow-hidden cursor-zoom-in shadow-sm group"
        >
          {/* Base Image */}
          <img
            src={selected}
            alt="Product"
            className={`w-full h-full object-contain transition-opacity duration-300 ${
              zoomData.show ? "opacity-0" : "opacity-100"
            }`}
          />

          {/* Zoom Overlay */}
          {zoomData.show && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `url(${selected})`,
                backgroundPosition: zoomData.backgroundPosition,
                backgroundSize: "250%", 
                backgroundRepeat: "no-repeat",
              }}
            />
          )}
        </div>
        
        <p className="mt-4 text-center text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold hidden lg:block animate-pulse">
          Roll over image to zoom
        </p>
      </div>
    </div>
  );
};

export default ProductSlider;