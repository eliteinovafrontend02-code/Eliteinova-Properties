import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Import images from assets
import apartment1 from "../assets/Apartmenthomeban1.jpg";
import apartment2 from "../assets/Apartmenthomeban2.jpg";
import apartment3 from "../assets/Apartmenthomeban3.jpg";
import apartment4 from "../assets/Apartmenthomeban4.jpg";
import apartment5 from "../assets/Apartmenthomeban5.jpg";

import commercial1 from "../assets/Commercialhomeban1.jpg";
import commercial2 from "../assets/Commercialhomeban2.jpg";
import commercial3 from "../assets/Commercialhomeban3.jpg";
import commercial4 from "../assets/Commercialhomeban4.jpg";
import commercial5 from "../assets/Commercialhomeban5.jpg";

import hostel1 from "../assets/hostelhomeban1.jpg";
import hostel2 from "../assets/hostelhomeban2.jpg";
import hostel3 from "../assets/hostelhomeban3.jpg";
import hostel4 from "../assets/hostelhomeban4.jpg";
import hostel5 from "../assets/hostelhomeban5.jpg";

import villa1 from "../assets/Individualhomeban1.jpg";
import villa2 from "../assets/Individualhomeban2.jpg";
import villa3 from "../assets/Individualhomeban3.jpg";
import villa4 from "../assets/Individualhomeban4.jpg";
import villa5 from "../assets/Individualhomeban5.jpg";

import land1 from "../assets/landhomeban1.jpg";
import land2 from "../assets/landhomeban2.jpg";
import land3 from "../assets/landhomeban3.jpg";
import land4 from "../assets/landhomeban4.jpg";
import land5 from "../assets/landhomeban5.jpg";

const slidesData = [
  {
    title: "Apartments",
    subtitle: "Where Comfort Meets Convenience",
    images: [apartment1, apartment2, apartment3, apartment4, apartment5]
  },
  {
    title: "Commercial Buildings",
    subtitle: "Elevate Your Business Address",
    images: [commercial1, commercial2, commercial3, commercial4, commercial5]
  },
  {
    title: "Hostels",
    subtitle: "Your Home Away From Home",
    images: [hostel1, hostel2, hostel3, hostel4, hostel5]
  },
  {
    title: "Individual Villas",
    subtitle: "Your Space. Your Sanctuary.",
    images: [villa1, villa2, villa3, villa4, villa5]
  },
  {
    title: "Land and Plots",
    subtitle: "Build Your Dream Home",
    images: [land1, land2, land3, land4, land5]
  }
];

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesData.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slidesData.length) % slidesData.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slidesData.length);
  };

  return (
    <div className="w-full bg-[#F4F7F6] font-sans antialiased mt-0 pt-0">

      {/* Main Banner Housing Container */}
      <div className="relative w-full overflow-hidden h-[260px] xs:h-[300px] sm:h-[360px] md:h-[420px] lg:h-[480px] bg-[#D1E2DB] top-0 mt-0">

        {/* Render Slides Loop */}
        {slidesData.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.title}
              className={`absolute inset-0 w-full h-full flex flex-row transition-all duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
              }`}
            >

              {/* Left Text Block - Rich Geometric Accent Settings */}
              <div
                className="w-[40%] sm:w-[40%] md:w-[40%] lg:w-[36%] h-full bg-[#D1E2DB] text-[#2C3E35] relative flex flex-col justify-center px-3 xs:px-4 sm:px-8 md:pl-12 lg:pl-16 pr-3 sm:pr-8 shrink-0 z-30 overflow-hidden [clip-path:polygon(0_0,100%_0,78%_100%,0_100%)] sm:[clip-path:polygon(0_0,100%_0,85%_100%,0_100%)] md:[clip-path:polygon(0_0,100%_0,90%_100%,0_100%)]"
              >
                {/* BACKGROUND DIAMOND GEOMETRY GRAPHICS */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.25] z-0">
                  <div className="absolute top-4 left-6 w-12 h-12 border border-[#1E7A6E] transform rotate-45" />
                  <div className="hidden sm:block absolute top-12 left-20 w-6 h-6 border border-[#1E7A6E] bg-[#1E7A6E]/10 transform rotate-45" />
                  <div className="absolute top-24 -left-8 w-24 h-24 border-2 border-dashed border-[#1E7A6E] transform rotate-45" />
                  <div className="hidden sm:block absolute top-1/3 right-8 w-12 h-12 border border-[#1E7A6E] transform rotate-45" />
                  <div className="absolute top-[45%] left-1/4 w-10 h-10 border border-[#1E7A6E] bg-[#1E7A6E]/20 transform rotate-45" />
                  <div className="absolute bottom-8 left-16 w-20 h-20 border border-[#1E7A6E]/60 transform rotate-45" />
                  <div className="hidden sm:block absolute bottom-2 right-16 w-14 h-14 border-2 border-[#1E7A6E] transform rotate-45" />
                  <div className="hidden sm:block absolute bottom-24 -right-10 w-28 h-28 border border-dashed border-[#1E7A6E]/40 transform rotate-45" />
                </div>

                {/* Content Container */}
                <div className={`relative z-10 transition-all duration-500 transform ${isActive ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"}`}>
                  <span className="text-[8px] xs:text-[9px] sm:text-[11px] lg:text-[14px] font-black tracking-[2px] sm:tracking-[4px] lg:tracking-[5px] text-[#1E7A6E] block mb-1">
                    LUXURY
                  </span>

                  <h2 className="text-base xs:text-lg sm:text-2xl lg:text-[46px] font-black tracking-tight leading-[0.95] uppercase text-[#1C2D24]">
                    {slide.title.split(" ")[0]}
                    <span className="block text-[#556B60] font-light text-xs xs:text-sm sm:text-base lg:text-[34px] tracking-tight mt-1 lowercase first-letter:uppercase">
                      {slide.title.split(" ").slice(1).join(" ")}
                    </span>
                  </h2>

                  <div className="w-6 sm:w-10 lg:w-14 h-[2px] sm:h-[3px] bg-[#1E7A6E] my-2 sm:my-4" />

                  <p className="text-[#4A5D54] text-[8px] xs:text-[9px] sm:text-xs lg:text-[16px] font-bold leading-snug mb-2 sm:mb-6 max-w-[130px] sm:max-w-none">
                    {slide.subtitle}
                  </p>

                  <button className="w-[70px] xs:w-[85px] sm:w-[120px] lg:w-[155px] h-[24px] xs:h-[28px] sm:h-[38px] lg:h-[48px] bg-[#1E7A6E] text-white font-extrabold text-[7px] xs:text-[8px] sm:text-[10px] lg:text-xs rounded-sm tracking-widest hover:bg-[#14534B] transition-colors shadow-md">
                    EXPLORE NOW
                  </button>
                </div>
              </div>

              {/* Right Side Photo Grid Matrix */}
              <div className="w-[60%] sm:w-[60%] md:w-[60%] lg:w-[64%] h-full relative z-10 grid grid-cols-2 grid-rows-2 gap-0.5 sm:gap-1 p-0.5 sm:p-1 bg-[#D1E2DB]">

                <div className="relative w-full h-full overflow-hidden">
                  <img src={slide.images[0]} alt="Property Highlight 1" className="w-full h-full object-cover" />
                </div>

                <div className="relative w-full h-full overflow-hidden">
                  <img src={slide.images[1]} alt="Property Highlight 2" className="w-full h-full object-cover" />
                </div>

                <div className="relative w-full h-full overflow-hidden">
                  <img src={slide.images[2]} alt="Property Highlight 3" className="w-full h-full object-cover" />
                </div>

                <div className="relative w-full h-full overflow-hidden">
                  <img src={slide.images[3]} alt="Property Highlight 4" className="w-full h-full object-cover" />
                </div>

                {/* Central Intersecting Diamond Windows Frame */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
                  <div className="w-[70px] h-[70px] xs:w-[85px] xs:h-[85px] sm:w-[130px] sm:h-[130px] md:w-[180px] md:h-[180px] lg:w-[220px] lg:h-[220px] transform rotate-45 shadow-2xl border-[3px] xs:border-[4px] md:border-[6px] border-[#D1E2DB] overflow-hidden bg-[#D1E2DB]">
                    <div className="w-full h-full transform -rotate-45 scale-[1.42]">
                      <img
                        src={slide.images[4]}
                        alt="Featured Central Highlight"
                        className="w-full h-full object-cover pointer-events-auto"
                      />
                    </div>
                  </div>
                </div>

              </div>

            </div>
          );
        })}

        {/* Slide Carousel Arrow Overlays */}
        <button
          onClick={handlePrevSlide}
          className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-[#1E7A6E] text-[#1C2D24] hover:text-white p-1 sm:p-2 rounded-full shadow-md backdrop-blur-sm transition-all duration-300 z-40"
          aria-label="Previous Banner Slide"
        >
          <ChevronLeft className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
        </button>

        <button
          onClick={handleNextSlide}
          className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-[#1E7A6E] text-[#1C2D24] hover:text-white p-1 sm:p-2 rounded-full shadow-md backdrop-blur-sm transition-all duration-300 z-40"
          aria-label="Next Banner Slide"
        >
          <ChevronRight className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
        </button>

        {/* Indicator Pagination Strip */}
        <div className="absolute bottom-2 sm:bottom-4 right-3 sm:left-auto sm:right-8 flex gap-1 sm:gap-2 z-40">
          {slidesData.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? "w-4 sm:w-6 bg-[#1E7A6E]" : "w-1.5 sm:w-2 bg-[#1C2D24]/30 hover:bg-[#1C2D24]/60"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Quick Access Categories Navigation Grid - Parallelogram Buttons */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {["Customer Portal", "Post Your Property", "Find Your Loan", "Services"].map(
          (label) => (
            <button
              key={label}
              className="text-white font-bold py-3 rounded-none text-sm tracking-wider shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 relative"
              style={{
                background: "linear-gradient(135deg, #14534B, #1E7A6E)",
                clipPath: "polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)",
                padding: "12px 24px",
              }}
            >
              {label}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default HomePage;