import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import banner1 from "../assets/banner1.jpg";
import banner2 from "../assets/banner2.jpg";
import banner6 from "../assets/banner6.jpg";
import banner4 from "../assets/banner4.jpg";
import banner5 from "../assets/banner5.jpg";

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const bannerImages = [
    { img: banner1, title: "Apartments", subtitle: "Where Comfort Meets Convenience" },
    { img: banner2, title: "Commercial Buildings", subtitle: "Elevate Your Business Address" },
    { img: banner6, title: "Hostels", subtitle: "Your Home Away From Home" },
    { img: banner4, title: "Individual Villas", subtitle: "Your Space. Your Sanctuary." },
    { img: banner5, title: "Land and Plots", subtitle: "Build Your Dream Home" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
  };

  return (
    <>
      {/* Animation */}
      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      <div className="w-full bg-white">
        {/* Banner Slider */}
        <div className="relative w-full mt-2 md:mt-3 overflow-hidden h-[300px] md:h-[400px] bg-gray-300">
          {bannerImages.map((banner, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={banner.img}
                alt={banner.title}
                className="w-full h-full object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30 flex flex-col items-center justify-end pb-16 md:pb-24 text-white px-4">
                <h2
                  className="text-3xl md:text-5xl font-bold mb-2 text-center"
                  style={{
                    textShadow: "2px 2px 8px rgba(0,0,0,0.8)",
                    animation: index === currentSlide ? "slideDown 1s ease-out" : "none",
                  }}
                >
                  {banner.title}
                </h2>
                <p
                  className="text-lg md:text-2xl font-semibold text-center"
                  style={{
                    textShadow: "2px 2px 6px rgba(0,0,0,0.8)",
                    animation:
                      index === currentSlide
                        ? "slideDown 1s ease-out 0.2s both"
                        : "none",
                  }}
                >
                  {banner.subtitle}
                </p>
              </div>
            </div>
          ))}

          {/* Controls */}
          <button
            onClick={handlePrevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow z-20"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={handleNextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow z-20"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {bannerImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2.5 h-2.5 rounded-full ${
                  index === currentSlide ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 md:px-6 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {["Customer Portal", "Post Your Property", "Find Your Loan", "Services"].map(
            (label) => (
              <button
                key={label}
                className="text-white font-bold py-3 rounded-full text-sm hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #00695C, #26A69A)" }}
              >
                {label}
              </button>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;
