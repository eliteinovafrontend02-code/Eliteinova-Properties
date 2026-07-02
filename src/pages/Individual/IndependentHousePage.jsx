import React, { useState, useEffect } from "react";
import { ChevronDown, Search, Home, MapPin, Star, Filter, X, Building, Landmark, Warehouse, Building2, Phone, Mail, MessageCircle, Clock, Settings, Globe, Shield, Award } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import backgroundImage from "../../assets/house3.png";
import IndependentHouseFilter from "../../components/filters/Individual/IndependentHouseFilter";
import IndependentHouse from "../../components/propertycard/Individual/IndependentHouse";

const IndependentHousePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeButton, setActiveButton] = useState("Rent");
  const [activeHouseType, setActiveHouseType] = useState("Independent House");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [searchLocation, setSearchLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const propertyCategories = [
    { name: "Apartment", path: "/apartment", icon: <Building className="w-3 h-3 lg:w-4 lg:h-4 xl:w-5 xl:h-5" /> },
    { name: "Commercial", path: "/commercial", icon: <Landmark className="w-3 h-3 lg:w-4 lg:h-4 xl:w-5 xl:h-5" /> },
    { name: "Land & Plots", path: "/land-plots", icon: <Warehouse className="w-3 h-3 lg:w-4 lg:h-4 xl:w-5 xl:h-5" /> },
    { name: "Hostel", path: "/hostel", icon: <Building2 className="w-3 h-3 lg:w-4 lg:h-4 xl:w-5 xl:h-5" /> }
  ];

  const houseTypes = [
    { name: "All", path: "/individual", img: backgroundImage },
    { name: "Independent House", path: "/individual/independent-house", img: backgroundImage },
    { name: "Independent Villa", path: "/individual/independent-villa", img: backgroundImage },
    { name: "Residential Apartment", path: "/individual/residential-apartment", img: backgroundImage },
    { name: "Duplex Residential Unit", path: "/individual/duplex-residential-unit", img: backgroundImage },
    { name: "Row House", path: "/individual/row-house", img: backgroundImage }
  ];

  useEffect(() => {
    const currentPath = location.pathname;
    const activeType = houseTypes.find(type => type.path === currentPath);
    if (activeType) {
      setActiveHouseType(activeType.name);
    }
  }, [location.pathname]);

  const handleNavigation = (path, typeName = null) => {
    if (typeName) setActiveHouseType(typeName);
    navigate(path);
  };

  const handlePropertyCategoryNavigation = (path) => navigate(path);

  const handleFilterChange = (filters) => {
    setAppliedFilters(filters);
    console.log("Applied Filters:", filters);
  };

  const handleSearch = () => {
    console.log("Searching with:", { searchLocation, propertyType, priceRange });
  };

  /* ─── Shared sub-components ─────────────────────────────────────────── */

  const RentBuyDropdown = () => (
    <div className="relative w-full max-w-[80px] sm:max-w-[90px] lg:max-w-[100px] xl:max-w-[150px]">
      <button
        onClick={() => setOpenDropdown(openDropdown === "toggle" ? null : "toggle")}
        className="group relative px-1.5 sm:px-2 lg:px-2.5 xl:px-3 py-1 sm:py-1.5 lg:py-2 xl:py-2.5 rounded-lg lg:rounded-xl text-white font-semibold text-[10px] sm:text-xs lg:text-sm xl:text-base flex items-center gap-0.5 sm:gap-1 lg:gap-1.5 xl:gap-2 shadow-xl w-full transition-all duration-300 hover:shadow-2xl"
        style={{ 
          background: "linear-gradient(135deg, #00695C, #26A69A, #4DB6AC)",
          backgroundSize: "200% 200%"
        }}
      >
        <div className="absolute inset-0 animate-gradient-shift-slow rounded-lg lg:rounded-xl"></div>
        <Home className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
        <span className="relative z-10 text-[9px] sm:text-[10px] lg:text-xs xl:text-sm truncate">{activeButton}</span>
        <ChevronDown className={`w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 transition-transform duration-300 ${openDropdown === "toggle" ? "rotate-180" : ""} relative z-10 ml-auto flex-shrink-0`} />
      </button>

      {openDropdown === "toggle" && (
        <div className="absolute top-full left-0 mt-1 bg-white/95 backdrop-blur-xl rounded-lg lg:rounded-xl shadow-2xl overflow-hidden z-50 min-w-[80px] sm:min-w-[100px] lg:min-w-[110px] xl:min-w-[130px] w-full border border-teal-200/30 animate-slide-down-fast">
          {["Buy", "Rent", "Lease", "Sell"].map((item, idx, arr) => (
            <React.Fragment key={item}>
              <button
                onClick={() => { handleNavigation(`/${item.toLowerCase()}`); setActiveButton(item); setOpenDropdown(null); }}
                className="w-full px-2 sm:px-2.5 lg:px-3 xl:px-4 py-1.5 sm:py-2 lg:py-2.5 xl:py-3 text-left text-[9px] sm:text-xs lg:text-sm xl:text-base hover:bg-gradient-to-r hover:from-teal-50 hover:to-emerald-50 transition-all duration-300 text-gray-700 font-medium group"
                style={activeButton === item ? { color: "#00695C", backgroundColor: "#e0f2f1", fontWeight: 600 } : {}}
              >
                <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-2.5 xl:gap-3 group-hover:gap-2 sm:group-hover:gap-2.5 lg:group-hover:gap-3 xl:group-hover:gap-4 transition-all">
                  <div className={`w-1 h-1 sm:w-1.5 sm:h-1.5 lg:w-2 lg:h-2 xl:w-2.5 xl:h-2.5 rounded-full ${activeButton === item ? 'bg-gradient-to-r from-teal-500 to-emerald-500' : 'bg-gray-300 group-hover:bg-teal-400'} transition-all duration-300`}></div>
                  {item}
                </div>
              </button>
              {idx < arr.length - 1 && <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );

  const PropertyCategoryButtons = () => (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-1.5 lg:gap-2 xl:gap-3 px-0.5 sm:px-1 lg:px-2 xl:px-3 w-full max-w-2xl sm:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto animate-fade-in-up delay-200">
      {propertyCategories.map((category, index) => (
        <button
          key={category.name}
          onClick={() => handlePropertyCategoryNavigation(category.path)}
          className="group relative px-1.5 sm:px-2 lg:px-3 xl:px-4 py-1 sm:py-1.5 lg:py-2 xl:py-2.5 rounded-lg lg:rounded-xl xl:rounded-2xl text-white font-semibold text-[8px] sm:text-[10px] lg:text-xs xl:text-sm shadow-2xl hover:shadow-[0_0_30px_rgba(0,105,92,0.4)] lg:hover:shadow-[0_0_40px_rgba(0,105,92,0.5)] transition-all duration-500 transform hover:-translate-y-1 lg:hover:-translate-y-2 hover:scale-105 overflow-hidden animate-slide-up w-full"
          style={{
            animationDelay: `${index * 100}ms`,
            background: "linear-gradient(135deg, #00695C, #26A69A, #4DB6AC)",
            backgroundSize: "200% 200%"
          }}
        >
          <div className="absolute inset-0 animate-gradient-shift"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <div className="relative z-10 flex items-center justify-center gap-0.5 sm:gap-1 lg:gap-1.5 xl:gap-2">
            <span className="group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">{category.icon}</span>
            <span className="truncate text-[7px] sm:text-[9px] lg:text-[11px] xl:text-sm">{category.name}</span>
          </div>
        </button>
      ))}
    </div>
  );

  const HouseTypeIcons = () => (
    <div className="flex items-start justify-start sm:justify-center gap-3 sm:gap-1.5 lg:gap-2 xl:gap-5 2xl:gap-4 mb-1.5 sm:mb-2 lg:mb-3 xl:mb-1 px-0.5 sm:px-1 lg:px-2 xl:px-3 overflow-x-auto scrollbar-hide py-1 sm:py-1.5 lg:py-2 xl:py-2.5">
      {houseTypes.map((type) => {
        const isActive = activeHouseType === type.name;
        const words = type.name.split(' ');
        
        return (
          <div 
            key={type.name} 
            className="flex flex-col items-center gap-0.5 sm:gap-0.5 lg:gap-1 xl:gap-1.5 cursor-pointer group flex-shrink-0 transition-all duration-300" 
            onClick={() => handleNavigation(type.path, type.name)}
          >
            <div className={`
              w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14 xl:w-16 xl:h-16 2xl:w-20 2xl:h-20
              rounded-full border-2 lg:border-3 p-0.5 overflow-hidden 
              group-hover:scale-110 transition-all duration-300
              ${isActive ? 'border-teal-600 shadow-2xl shadow-teal-200/70 ring-2 lg:ring-4 ring-teal-100/50' : 'border-teal-800 group-hover:border-teal-500'}
            `}>
              <img 
                src={type.img} 
                alt={type.name} 
                className="w-full h-full rounded-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className={`
              text-[6px] sm:text-[7px] lg:text-[10px] xl:text-xs 2xl:text-sm font-semibold text-center transition-all duration-300 flex flex-col items-center leading-tight
              ${isActive ? 'text-teal-700 bg-teal-50 px-1 sm:px-1 lg:px-2 xl:px-3 py-0.5 rounded-full shadow-md' : 'text-gray-700 group-hover:text-teal-600'}
            `}>
              {words.map((word, index) => (
                <span key={index} className="leading-tight">{word}</span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  /* ─── Render ─────────────────────────────────────────────────────────── */

  return (
    <div className="w-full min-h-screen relative">

      {/* ── Background ── */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/40 via-emerald-900/30 to-teal-900/40 animate-gradient-flow"></div>
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-particle-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${8 + Math.random() * 8}s`,
                width: `${2 + Math.random() * 4}px`,
                height: `${2 + Math.random() * 4}px`,
                background: `radial-gradient(circle, rgba(38,166,154,0.4) 0%, rgba(0,105,92,0.2) 70%, transparent 100%)`,
                borderRadius: "50%",
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="relative z-10">

        {/* ── HERO SECTION ── */}
        <section className="w-full relative flex items-center justify-center group py-1.5 sm:py-2 lg:py-3 xl:py-4 2xl:py-6">
          <div className="absolute inset-0 bg-gradient-to-b animate-gradient-slow"></div>
          <div className="w-full px-1.5 sm:px-2 lg:px-4 xl:px-6 2xl:px-8 relative z-10 text-center flex flex-col items-center justify-center gap-0.5 sm:gap-1 lg:gap-1.5 xl:gap-2 2xl:gap-3">
            
            {/* Badge - Hidden on mobile */}
            <div className="hidden sm:inline-flex mb-0.5 sm:mb-0.5 lg:mb-1 xl:mb-1.5 items-center gap-1.5 sm:gap-2 lg:gap-2.5 xl:gap-3 px-2 sm:px-2.5 lg:px-3 xl:px-4 py-0.5 sm:py-0.5 lg:py-1 xl:py-1.5 rounded-full bg-gradient-to-r from-teal-600/30 to-emerald-600/30 backdrop-blur-lg border border-teal-300/30 animate-float-glow shadow-[0_0_30px_rgba(0,105,92,0.4)] lg:shadow-[0_0_40px_rgba(0,105,92,0.5)]">
              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 text-yellow-300 animate-spin-slow" fill="currentColor" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-300 text-[8px] sm:text-[9px] lg:text-xs xl:text-sm font-medium">
                Premium Independent House Properties
              </span>
              <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 text-teal-300" />
            </div>

            {/* Title */}
            <h1 className="text-lg sm:text-xl lg:text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl font-bold text-white animate-slide-up drop-shadow-[0_0_30px_rgba(0,105,92,0.6)] lg:drop-shadow-[0_0_40px_rgba(0,105,92,0.7)]">
              Find Your Dream{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-300 to-teal-300 animate-gradient-text">
                Independent House
              </span>
            </h1>

            {/* Description */}
            <p className="text-[8px] sm:text-[9px] lg:text-sm xl:text-base 2xl:text-lg text-white/90 max-w-xl sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto leading-relaxed px-1">
              Discover luxurious independent homes with world-class amenities in the most sought-after locations
            </p>

            {/* Stats */}
            <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-2 xl:gap-2.5 text-white/70 text-[6px] sm:text-[8px] lg:text-[10px] xl:text-xs 2xl:text-sm mt-0.5 sm:mt-0.5 lg:mt-1 xl:mt-1.5">
              <Globe className="w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5" />
              <span>500+ Properties Available</span>
              <span className="w-0.5 h-0.5 sm:w-0.5 sm:h-0.5 lg:w-1 lg:h-1 bg-white/30 rounded-full"></span>
              <Award className="w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5" />
              <span>Verified Listings</span>
            </div>

            {/* Category Buttons */}
            <div className="mt-0.5 sm:mt-0.5 lg:mt-1 xl:mt-1.5 w-full max-w-2xl sm:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto">
              <PropertyCategoryButtons />
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            SEARCH & FILTER - OPTIMIZED VERSION
        ══════════════════════════════════════════════ */}
        <div className="bg-gradient-to-r from-white/95 via-teal-50/95 to-white/95 backdrop-blur-xl shadow-2xl sticky top-0 z-40 border-b border-teal-200/30 transition-all duration-500 animate-slide-down">
          <div className="w-full px-1.5 sm:px-2 lg:px-3 xl:px-4 2xl:px-6 py-1.5 sm:py-1.5 lg:py-2 xl:py-2.5 2xl:py-3">
            
            {/* Search Bar - Responsive Grid Layout */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 sm:gap-1 lg:gap-1.5 xl:gap-2 2xl:gap-2.5 bg-white rounded-lg lg:rounded-xl xl:rounded-2xl shadow-2xl p-1 sm:p-1 lg:p-1.5 xl:p-2 2xl:p-2.5 border border-teal-200/50">
              
              {/* Rent/Buy Dropdown - Decreased Width */}
              <div className="col-span-1 flex justify-start">
                <RentBuyDropdown />
              </div>

              {/* Location Input */}
              <div className="col-span-1 relative group">
                <MapPin className="absolute left-1.5 sm:left-2 lg:left-2.5 xl:left-3 top-1/2 transform -translate-y-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 text-teal-400 group-hover:text-teal-600 transition-all duration-300" />
                <input
                  type="text"
                  placeholder="Location"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full pl-5 sm:pl-6 lg:pl-7 xl:pl-9 pr-1.5 sm:pr-2 lg:pr-3 xl:pr-4 py-1 sm:py-1 lg:py-1.5 xl:py-2 2xl:py-2.5 rounded-lg lg:rounded-xl bg-teal-50/50 border-2 border-transparent text-[10px] sm:text-[10px] lg:text-xs xl:text-sm 2xl:text-base focus:outline-none focus:border-teal-400 focus:bg-white transition-all duration-300 hover:border-teal-300 hover:bg-white/80 hover:shadow-[0_0_15px_rgba(0,105,92,0.1)]"
                />
              </div>

              {/* Property Type Custom Dropdown with Theme Colors - Improved */}
              <div className="col-span-1 relative group">
                <Building className="absolute left-1.5 sm:left-2 lg:left-2.5 xl:left-3 top-1/2 transform -translate-y-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 text-teal-400 group-hover:text-teal-600 transition-all duration-300 z-10" />
                <button
                  onClick={() => setOpenDropdown(openDropdown === "propertyType" ? null : "propertyType")}
                  className="w-full pl-5 sm:pl-6 lg:pl-7 xl:pl-9 pr-4 sm:pr-5 lg:pr-6 xl:pr-8 py-1 sm:py-1 lg:py-1.5 xl:py-2 2xl:py-2.5 rounded-lg lg:rounded-xl bg-teal-50/50 border-2 border-transparent text-[10px] sm:text-[10px] lg:text-xs xl:text-sm 2xl:text-base focus:outline-none focus:border-teal-400 focus:bg-white transition-all duration-300 hover:border-teal-300 hover:bg-white/80 hover:shadow-[0_0_15px_rgba(0,105,92,0.1)] text-left flex items-center justify-between"
                >
                  <span className={propertyType ? 'text-gray-800 truncate' : 'text-gray-500 truncate'}>
                    {propertyType || 'Property Type'}
                  </span>
                  <ChevronDown className={`w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 text-teal-400 transition-transform duration-300 flex-shrink-0 ${openDropdown === "propertyType" ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Improved Property Type Dropdown */}
                {openDropdown === "propertyType" && (
                  <div className="absolute top-full left-0 mt-1 w-full min-w-[180px] sm:min-w-[200px] lg:min-w-[220px] xl:min-w-[250px] rounded-lg lg:rounded-xl shadow-2xl border border-teal-100 overflow-hidden z-50 animate-slide-down-fast">
                    <div className="bg-gradient-to-b from-teal-600 to-emerald-600 p-1 lg:p-1.5">
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-0.5">
                        {['Independent House', 'Independent Villa', 'Residential Apartment', 'Duplex', 'Row House'].map((type, index) => (
                          <button
                            key={type}
                            onClick={() => {
                              setPropertyType(type);
                              setOpenDropdown(null);
                            }}
                            className={`w-full px-3 sm:px-4 lg:px-5 xl:px-6 py-2 sm:py-2.5 lg:py-3 xl:py-3.5 text-left text-[10px] sm:text-xs lg:text-sm xl:text-base transition-all duration-300 flex items-center gap-2 sm:gap-2.5 lg:gap-3 xl:gap-4 rounded-lg mb-0.5 last:mb-0 group
                              ${propertyType === type 
                                ? 'bg-white text-teal-600 font-semibold shadow-lg scale-[1.02]' 
                                : 'text-white/90 hover:bg-white/20 hover:text-white hover:scale-[1.01]'
                              }`}
                          >
                            <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-2.5 lg:h-2.5 rounded-full transition-all duration-300 flex-shrink-0 ${
                              propertyType === type 
                                ? 'bg-gradient-to-r from-teal-500 to-emerald-500 shadow-lg shadow-teal-500/50' 
                                : 'bg-white/30 group-hover:bg-white/60'
                            }`}></div>
                            <span className="flex-1">{type}</span>
                            {propertyType === type && (
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Price Range Input */}
              <div className="col-span-1 relative group">
                <span className="absolute left-1.5 sm:left-2 lg:left-2.5 xl:left-3 top-1/2 transform -translate-y-1/2 text-teal-400 group-hover:text-teal-600 transition-all duration-300 font-semibold text-[9px] sm:text-[9px] lg:text-xs xl:text-sm">$</span>
                <input
                  type="text"
                  placeholder="Price"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full pl-4 sm:pl-5 lg:pl-6 xl:pl-8 pr-1.5 sm:pr-2 lg:pr-3 xl:pr-4 py-1 sm:py-1 lg:py-1.5 xl:py-2 2xl:py-2.5 rounded-lg lg:rounded-xl bg-teal-50/50 border-2 border-transparent text-[10px] sm:text-[10px] lg:text-xs xl:text-sm 2xl:text-base focus:outline-none focus:border-teal-400 focus:bg-white transition-all duration-300 hover:border-teal-300 hover:bg-white/80 hover:shadow-[0_0_15px_rgba(0,105,92,0.1)]"
                />
              </div>

              {/* Search Button */}
              <button 
                onClick={handleSearch}
                className="col-span-1 group relative px-1.5 sm:px-2 lg:px-2.5 xl:px-3 2xl:px-4 py-1 sm:py-1 lg:py-1.5 xl:py-2 2xl:py-2.5 rounded-lg lg:rounded-xl text-white font-semibold shadow-xl hover:shadow-[0_0_30px_rgba(0,105,92,0.5)] lg:hover:shadow-[0_0_40px_rgba(0,105,92,0.5)] transition-all duration-500 hover:scale-105 overflow-hidden"
                style={{ background: "linear-gradient(135deg, #00695C, #26A69A, #4DB6AC)", backgroundSize: "200% 200%" }}
              >
                <div className="absolute inset-0 animate-gradient-shift-slow rounded-lg lg:rounded-xl"></div>
                <div className="relative z-10 flex items-center justify-center gap-0.5 sm:gap-1 lg:gap-1.5 xl:gap-2">
                  <Search className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 2xl:w-5 2xl:h-5 group-hover:scale-110 transition-transform duration-300" />
                  <span className="hidden sm:inline text-[10px] sm:text-[10px] lg:text-xs xl:text-sm 2xl:text-base">Search</span>
                </div>
              </button>

              {/* Advanced Filter Button */}
              <button 
                onClick={() => setShowFilterModal(true)}
                className="col-span-1 group relative px-1.5 sm:px-2 lg:px-2.5 xl:px-3 2xl:px-4 py-1 sm:py-1 lg:py-1.5 xl:py-2 2xl:py-2.5 rounded-lg lg:rounded-xl text-white font-semibold shadow-xl hover:shadow-[0_0_30px_rgba(0,105,92,0.5)] lg:hover:shadow-[0_0_40px_rgba(0,105,92,0.5)] transition-all duration-500 hover:scale-105 overflow-hidden"
                style={{ background: "linear-gradient(135deg, #00897B, #26A69A)", backgroundSize: "200% 200%" }}
              >
                <div className="absolute inset-0 animate-gradient-shift-slow rounded-lg lg:rounded-xl"></div>
                <div className="relative z-10 flex items-center justify-center gap-0.5 sm:gap-1 lg:gap-1.5 xl:gap-2">
                  <Settings className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 2xl:w-5 2xl:h-5 group-hover:rotate-90 transition-transform duration-500" />
                  <span className="hidden sm:inline text-[10px] sm:text-[10px] lg:text-xs xl:text-sm 2xl:text-base">Filters</span>
                  {appliedFilters && (
                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 sm:w-1.5 sm:h-1.5 lg:w-2 lg:h-2 xl:w-2.5 xl:h-2.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  )}
                </div>
              </button>
            </div>

            {/* House Type Icons */}
            <div className="mt-1.5 sm:mt-1.5 lg:mt-2 xl:mt-2.5 2xl:mt-3 w-full">
              <HouseTypeIcons />
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            FILTER MODAL
        ══════════════════════════════════════════════ */}
        {showFilterModal && (
          <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-8 sm:pt-12 lg:pt-16 xl:pt-[100px] px-3 sm:px-4 lg:px-6 xl:px-8 pb-4 bg-black/60 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-xl sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl max-h-[80vh] overflow-y-auto animate-slide-up">
              <IndependentHouseFilter
                activeTab={activeButton}
                onFilterChange={handleFilterChange}
                onClose={() => setShowFilterModal(false)}
              />
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════
            MAIN CONTENT
        ══════════════════════════════════════════════ */}
        <div className="w-full px-1.5 sm:px-2 lg:px-3 xl:px-4 2xl:px-6 py-2 sm:py-3 lg:py-4 xl:py-6 2xl:py-8">
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-3 lg:gap-4 xl:gap-6 2xl:gap-8 w-full">

            {/* Property Cards */}
            <div className="w-full lg:w-2/3 xl:w-2/3 2xl:w-7/12">
              <section className="w-full">
                <IndependentHouse />
              </section>
            </div>

            {/* Sidebar Filter - Desktop Only */}
            <div className="hidden lg:block lg:w-1/3 xl:w-1/3 2xl:w-5/12 lg:relative">
              <div className="lg:sticky lg:top-[110px] xl:top-[120px] 2xl:top-[130px] lg:max-h-[calc(100vh-160px)] xl:max-h-[calc(100vh-170px)] 2xl:max-h-[calc(100vh-180px)] lg:overflow-y-auto lg:scrollbar-hide animate-slide-in-right">
                <IndependentHouseFilter
                  activeTab={activeButton}
                  onFilterChange={handleFilterChange}
                />
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* ══════════════════════════════════════════════
          STYLES
      ══════════════════════════════════════════════ */}
      <style jsx>{`
        @keyframes gradient-flow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-flow { background-size: 200% 200%; animation: gradient-flow 20s ease infinite; }
        .animate-gradient-slow { background-size: 300% 300%; animation: gradient-flow 15s ease infinite; }
        .animate-gradient-shift { background-size: 200% 200%; animation: gradient-flow 2s linear infinite; }
        .animate-gradient-shift-slow { background-size: 200% 200%; animation: gradient-flow 4s linear infinite; }
        .animate-gradient-text { background-size: 300% 300%; animation: gradient-flow 3s ease infinite; }

        @keyframes particle-float {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-40px) translateX(20px) rotate(180deg); opacity: 0.8; }
        }
        .animate-particle-float { animation: particle-float 12s ease-in-out infinite; }

        @keyframes float-glow {
          0%, 100% { transform: translateY(0px); box-shadow: 0 0 30px rgba(0,105,92,0.3); }
          50% { transform: translateY(-5px); box-shadow: 0 0 50px rgba(0,105,92,0.5); }
        }
        .animate-float-glow { animation: float-glow 3s ease-in-out infinite; }

        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }

        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }

        @keyframes slide-up { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-up { animation: slide-up 0.5s ease-out forwards; }

        @keyframes slide-down { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-down { animation: slide-down 0.4s ease-out forwards; }
        .animate-slide-down-fast { animation: slide-down 0.2s ease-out forwards; }

        @keyframes slide-in-right { from { transform: translateX(30px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-slide-in-right { animation: slide-in-right 0.5s ease-out forwards; }

        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }

        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }

        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }

        .lg\\:scrollbar-hide::-webkit-scrollbar { width: 6px; }
        .lg\\:scrollbar-hide::-webkit-scrollbar-track {
          background: linear-gradient(to bottom, transparent, rgba(0,105,92,0.1), transparent);
          border-radius: 10px;
        }
        .lg\\:scrollbar-hide::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #00695C, #26A69A);
          border-radius: 10px;
        }
        .lg\\:scrollbar-hide::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #004D40, #00796B);
          box-shadow: 0 0 10px rgba(0,105,92,0.5);
        }
      `}</style>
    </div>
  );
};

export default IndependentHousePage;