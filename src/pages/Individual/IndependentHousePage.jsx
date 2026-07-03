import React, { useState, useEffect } from "react";
import { ChevronDown, Search, Home, MapPin, Star, Building, Landmark, Warehouse, Building2, Settings, Globe, Shield, Award } from "lucide-react";
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
    { name: "Apartment", path: "/apartment", icon: <Building className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" /> },
    { name: "Commercial", path: "/commercial", icon: <Landmark className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" /> },
    { name: "Land & Plots", path: "/land-plots", icon: <Warehouse className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" /> },
    { name: "Hostel", path: "/hostel", icon: <Building2 className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" /> }
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

  
  // scroll from fighting with the modal's own internal scroll on mobile)
  useEffect(() => {
    if (showFilterModal) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [showFilterModal]);

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
    <div className="relative w-full max-w-[80px] md:max-w-none">
      <button
        onClick={() => setOpenDropdown(openDropdown === "toggle" ? null : "toggle")}
        className="group relative px-1 md:px-3 lg:px-4 py-0.5 md:py-2 lg:py-2.5 rounded-lg md:rounded-xl text-white font-semibold text-[9px] md:text-sm lg:text-base flex items-center gap-0.5 md:gap-2 lg:gap-2.5 shadow-xl w-full transition-all duration-300 hover:shadow-2xl"
        style={{ 
          background: "linear-gradient(135deg, #00695C, #26A69A, #4DB6AC)",
          backgroundSize: "200% 200%"
        }}
      >
        <div className="absolute inset-0 animate-gradient-shift-slow rounded-lg md:rounded-xl"></div>
        <Home className="w-2 h-2 md:w-4 md:h-4 lg:w-5 lg:h-5 group-hover:rotate-12 transition-transform duration-300 relative z-10 flex-shrink-0" />
        <span className="relative z-10 text-[7px] md:text-sm lg:text-base whitespace-nowrap">{activeButton}</span>
        <ChevronDown className={`w-1.5 h-1.5 md:w-4 md:h-4 lg:w-5 lg:h-5 transition-transform duration-300 ${openDropdown === "toggle" ? "rotate-180" : ""} relative z-10 ml-auto flex-shrink-0`} />
      </button>

      {openDropdown === "toggle" && (
        <div className="absolute top-full left-0 mt-1 bg-white/95 backdrop-blur-xl rounded-lg md:rounded-xl shadow-2xl overflow-hidden z-50 min-w-[80px] md:min-w-[140px] lg:min-w-[160px] w-full border border-teal-200/30 animate-slide-down-fast">
          {["Buy", "Rent", "Lease", "Sell"].map((item, idx, arr) => (
            <React.Fragment key={item}>
              <button
                onClick={() => { handleNavigation(`/${item.toLowerCase()}`); setActiveButton(item); setOpenDropdown(null); }}
                className="w-full px-2 md:px-4 lg:px-5 py-1.5 md:py-2.5 lg:py-3 text-left text-[9px] md:text-sm lg:text-base hover:bg-gradient-to-r hover:from-teal-50 hover:to-emerald-50 transition-all duration-300 text-gray-700 font-medium group"
                style={activeButton === item ? { color: "#00695C", backgroundColor: "#e0f2f1", fontWeight: 600 } : {}}
              >
                <div className="flex items-center gap-1 md:gap-2.5 lg:gap-3 group-hover:gap-2 md:group-hover:gap-3 lg:group-hover:gap-4 transition-all">
                  <div className={`w-1 h-1 md:w-2 md:h-2 lg:w-2.5 lg:h-2.5 rounded-full ${activeButton === item ? 'bg-gradient-to-r from-teal-500 to-emerald-500' : 'bg-gray-300 group-hover:bg-teal-400'} transition-all duration-300`}></div>
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
    <div className="flex items-center justify-center gap-1.5 md:gap-2 lg:gap-3 px-0.5 md:px-2 lg:px-3 w-full max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto animate-fade-in-up delay-200 overflow-x-auto scrollbar-theme py-1 md:py-0">
      {propertyCategories.map((category, index) => (
        <button
          key={category.name}
          onClick={() => handlePropertyCategoryNavigation(category.path)}
          className="group relative flex-shrink-0 px-2.5 md:px-3 lg:px-4 py-1.5 md:py-2 lg:py-2.5 rounded-lg md:rounded-xl lg:rounded-2xl text-white font-semibold text-[9px] md:text-xs lg:text-sm shadow-2xl hover:shadow-[0_0_30px_rgba(0,105,92,0.4)] md:hover:shadow-[0_0_40px_rgba(0,105,92,0.5)] transition-all duration-500 transform hover:-translate-y-1 md:hover:-translate-y-2 hover:scale-105 overflow-hidden animate-slide-up"
          style={{
            animationDelay: `${index * 100}ms`,
            background: "linear-gradient(135deg, #00695C, #26A69A, #4DB6AC)",
            backgroundSize: "200% 200%",
            minWidth: "70px"
          }}
        >
          <div className="absolute inset-0 animate-gradient-shift"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <div className="relative z-10 flex items-center justify-center gap-0.5 md:gap-1.5 lg:gap-2 whitespace-nowrap">
            <span className="group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">{category.icon}</span>
            <span className="truncate text-[7px] md:text-[10px] lg:text-sm">{category.name}</span>
          </div>
        </button>
      ))}
    </div>
  );

 const HouseTypeIcons = () => (
  // FIXED: Removed side indicator, added scroll hint below
  <div className="w-full">
    <div className="w-full overflow-x-auto overflow-y-hidden scrollbar-theme scroll-smooth pb-0.5 md:pb-2">
      <div className="flex items-center justify-start md:justify-center gap-3 md:gap-4 lg:gap-14 min-w-max px-0.5 md:px-2 lg:px-3 py-1 md:py-2 lg:py-2.5">
        {houseTypes.map((type) => {
          const isActive = activeHouseType === type.name;
          const words = type.name.split(' ');
          
          return (
            <div 
              key={type.name} 
              className="flex flex-col items-center gap-0.5 md:gap-1 lg:gap-1.5 cursor-pointer group flex-shrink-0 min-w-[58px] md:min-w-0 transition-all duration-300" 
              onClick={() => handleNavigation(type.path, type.name)}
            >
              <div className={`
                w-11 h-11 md:w-12 md:h-12 lg:w-16 lg:h-16
                rounded-full border-2 md:border-3 p-0.5 overflow-hidden 
                group-hover:scale-110 transition-all duration-300
                ${isActive ? 'border-teal-600 shadow-2xl shadow-teal-200/70 ring-2 md:ring-4 ring-teal-100/50' : 'border-teal-800 group-hover:border-teal-500'}
              `}>
                <img 
                  src={type.img} 
                  alt={type.name} 
                  className="w-full h-full rounded-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className={`
                text-[9px] md:text-[9px] lg:text-xs font-semibold text-center transition-all duration-300 flex flex-col items-center leading-tight
                ${isActive ? 'text-teal-700 bg-teal-50 px-1 md:px-2 lg:px-3 py-0.5 rounded-full shadow-md' : 'text-gray-700 group-hover:text-teal-600'}
              `}>
                {words.map((word, index) => (
                  <span key={index} className="leading-tight">{word}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
    
    {/* SCROLL INDICATOR - Shows below the icons */}
    <div className="flex items-center justify-center gap-2 mt-1 md:mt-1.5 lg:mt-2 md:hidden">
      <div className="flex items-center gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-teal-300 animate-pulse"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse delay-75"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse delay-150"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-pulse delay-200"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse delay-150"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse delay-75"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-teal-300 animate-pulse"></div>
      </div>
      <span className="text-[10px] text-teal-600/70 font-medium animate-bounce">← Scroll →</span>
    </div>
    
    
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
        <section className="w-full relative flex items-center justify-center group py-0.5 md:py-4 lg:py-6 md:mt-8">
          <div className="absolute inset-0 bg-gradient-to-b animate-gradient-slow"></div>
          <div className="w-full px-2 md:px-4 lg:px-6 relative z-10 text-center flex flex-col items-center justify-center gap-0.5 md:gap-1.5 lg:gap-2">
            
           {/* Badge - Visible on all screen sizes */}
<div className="inline-flex mb-1 items-center gap-1.5 md:gap-2.5 lg:gap-3 px-2 md:px-4 lg:px-5 py-0.5 md:py-1.5 lg:py-2 rounded-full bg-gradient-to-r from-teal-600/30 to-emerald-600/30 backdrop-blur-lg border border-teal-300/30 animate-float-glow shadow-[0_0_20px_rgba(0,105,92,0.3)] md:shadow-[0_0_40px_rgba(0,105,92,0.5)]">
  <Star className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 text-yellow-300 animate-spin-slow" fill="currentColor" />
  <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-300 text-[9px] md:text-xs lg:text-sm font-medium whitespace-nowrap">
    Premium Independent House Properties
  </span>
  <Shield className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 text-teal-300" />
</div>

            {/* Title */}
            <h1 className="text-xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white animate-slide-up drop-shadow-[0_0_30px_rgba(0,105,92,0.6)] md:drop-shadow-[0_0_40px_rgba(0,105,92,0.7)]">
              Find Your Dream{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-300 to-teal-300 animate-gradient-text">
                Independent House
              </span>
            </h1>

            {/* Description */}
            <p className="text-[10px] md:text-sm lg:text-base text-white/90 max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-1">
              Discover luxurious independent homes with world-class amenities in the most sought-after locations
            </p>

            {/* Stats */}
            <div className="flex items-center gap-1 md:gap-2 lg:gap-2.5 text-white/70 text-[9px] md:text-[10px] lg:text-xs mt-0.5 md:mt-1">
              <Globe className="w-2 h-2 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5" />
              <span>500+ Properties Available</span>
              <span className="w-0.5 h-0.5 md:w-1 md:h-1 bg-white/30 rounded-full"></span>
              <Award className="w-2 h-2 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5" />
              <span>Verified Listings</span>
            </div>

            {/* Category Buttons - with horizontal scroll on mobile */}
            <div className="mt-1 md:mt-1.5 lg:mt-2 w-full max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto">
              <PropertyCategoryButtons />
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            SEARCH & FILTER - MOBILE OPTIMIZED
        ══════════════════════════════════════════════ */}
        <div className="bg-gradient-to-r from-white/95 via-teal-50/95 to-white/95 backdrop-blur-xl shadow-2xl sticky top-0 z-40 border-b border-teal-200/30 transition-all duration-500 animate-slide-down">
          <div className="w-full px-2 md:px-4 lg:px-6 py-1.5 md:py-2 lg:py-2.5">
            
            {/* Search Bar - Mobile: 2 rows, Desktop: 1 row */}
            <div className="bg-white rounded-lg md:rounded-xl lg:rounded-2xl shadow-2xl p-1.5 md:p-1.5 lg:p-2 border border-teal-200/50">
              
              {/* Mobile View (2 rows) - Hidden on md and above */}
              <div className="block md:hidden">
                {/* Row 1: Rent, Type, Price, Location - 4 columns */}
                <div className="grid grid-cols-4 gap-1">
                  {/* Rent/Buy Dropdown - Decreased width */}
                  <div className="col-span-1">
                    <RentBuyDropdown />
                  </div>

                  {/* Property Type */}
                  <div className="col-span-1 relative group">
                    <Building className="absolute left-1.5 top-1/2 transform -translate-y-1/2 w-2.5 h-2.5 text-teal-400 group-hover:text-teal-600 transition-all duration-300 z-10" />
                    <button
                      onClick={() => setOpenDropdown(openDropdown === "propertyType" ? null : "propertyType")}
                      className="w-full pl-5 pr-1.5 py-0.5 rounded-lg bg-teal-50/50 border-2 border-transparent text-[9px] focus:outline-none focus:border-teal-400 focus:bg-white transition-all duration-300 hover:border-teal-300 hover:bg-white/80 hover:shadow-[0_0_15px_rgba(0,105,92,0.1)] text-left flex items-center justify-between"
                    >
                      <span className={propertyType ? 'text-gray-800 truncate text-[9px]' : 'text-gray-500 truncate text-[9px]'}>
                        {propertyType || 'Type'}
                      </span>
                      <ChevronDown className={`w-2 h-2 text-teal-400 transition-transform duration-300 flex-shrink-0 ${openDropdown === "propertyType" ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {openDropdown === "propertyType" && (
                      <div className="absolute top-full left-0  w-full min-w-[110px] rounded-lg shadow-2xl overflow-hidden z-50 animate-slide-down-fast">
                        <div className="bg-teal-600 ">
                          {/* <div className="bg-white/10 backdrop-blur-sm rounded-lg p-0.5"> */}
                            {['Independent House', 'Independent Villa', 'Residential Apartment', 'Duplex', 'Row House'].map((type) => (
                              <button
                                key={type}
                                onClick={() => {
                                  setPropertyType(type);
                                  setOpenDropdown(null);
                                }}
                                className={`w-full px-2 py-1.5 text-left text-[9px] transition-all duration-300 flex items-center gap-1.5 rounded-lg mb-0.5 last:mb-0 group
                                  ${propertyType === type 
                                  ? 'bg-white text-teal-600 font-semibold shadow-lg scale-[1.02]' 
                                  : 'text-white hover:bg-white/90 hover:text-teal-600 font-medium  hover:scale-[1.01]'
                                }`}
                              >
                                
                                <span className="flex-1 text-[9px]">{type}</span>
                                {propertyType === type && (
                                  <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></div>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      // </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="col-span-1 relative group">
                    <span className="absolute left-1.5 top-1/2 transform -translate-y-1/2 text-teal-400 group-hover:text-teal-600 transition-all duration-300 font-semibold text-[7px]">$</span>
                    <input
                      type="text"
                      placeholder="Price"
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="w-full pl-4 pr-1 py-0.5 rounded-lg bg-teal-50/50 border-2 border-transparent text-[9px] focus:outline-none focus:border-teal-400 focus:bg-white transition-all duration-300 hover:border-teal-300 hover:bg-white/80 hover:shadow-[0_0_15px_rgba(0,105,92,0.1)]"
                    />
                  </div>

                  {/* Location */}
                  <div className="col-span-1 relative group">
                    <MapPin className="absolute left-1.5 top-1/2 transform -translate-y-1/2 w-2.5 h-2.5 text-teal-400 group-hover:text-teal-600 transition-all duration-300" />
                    <input
                      type="text"
                      placeholder="Location"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="w-full pl-5 pr-1 py-0.5 rounded-lg bg-teal-50/50 border-2 border-transparent text-[9px] focus:outline-none focus:border-teal-400 focus:bg-white transition-all duration-300 hover:border-teal-300 hover:bg-white/80 hover:shadow-[0_0_15px_rgba(0,105,92,0.1)]"
                    />
                  </div>
                </div>

                {/* Row 2: Search + Filter - 2 columns */}
                <div className="grid grid-cols-2 gap-1 mt-1">
                  {/* Search Button */}
                  <button 
                    onClick={handleSearch}
                    className="group relative px-2 py-0.5 rounded-lg text-white font-semibold shadow-xl hover:shadow-[0_0_30px_rgba(0,105,92,0.5)] transition-all duration-500 hover:scale-105 overflow-hidden w-full"
                    style={{ background: "linear-gradient(135deg, #00695C, #26A69A, #4DB6AC)", backgroundSize: "200% 200%" }}
                  >
                    <div className="absolute inset-0 animate-gradient-shift-slow rounded-lg"></div>
                    <div className="relative z-10 flex items-center justify-center gap-1">
                      <Search className="w-3 h-3 group-hover:scale-110 transition-transform duration-300" />
                      <span className="text-[9px]">Search</span>
                    </div>
                  </button>

                  {/* Filter Button */}
                  <button 
                    onClick={() => setShowFilterModal(true)}
                    className="group relative px-2 py-0.5 rounded-lg text-white font-semibold shadow-xl hover:shadow-[0_0_30px_rgba(0,105,92,0.5)] transition-all duration-500 hover:scale-105 overflow-hidden w-full"
                    style={{ background: "linear-gradient(135deg, #00897B, #26A69A)", backgroundSize: "200% 200%" }}
                  >
                    <div className="absolute inset-0 animate-gradient-shift-slow rounded-lg"></div>
                    <div className="relative z-10 flex items-center justify-center gap-1">
                      <Settings className="w-3 h-3 group-hover:rotate-90 transition-transform duration-500" />
                      <span className="text-[9px]">Filters</span>
                      {appliedFilters && (
                        <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                      )}
                    </div>
                  </button>
                </div>
              </div>

              {/* Desktop View (1 row with 6 columns) - Hidden on mobile, shown on md and above */}
              <div className="hidden md:grid md:grid-cols-6 gap-1.5 lg:gap-2">
                {/* Rent/Buy Dropdown */}
                <div className="col-span-1">
                  <RentBuyDropdown />
                </div>

                {/* Location Input */}
                <div className="col-span-1 relative group">
                  <MapPin className="absolute left-2.5 lg:left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 lg:w-4 lg:h-4 text-teal-400 group-hover:text-teal-600 transition-all duration-300" />
                  <input
                    type="text"
                    placeholder="Location"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full pl-8 lg:pl-9 pr-3 lg:pr-4 py-1.5 lg:py-2 rounded-xl bg-teal-50/50 border-2 border-transparent text-sm lg:text-base focus:outline-none focus:border-teal-400 focus:bg-white transition-all duration-300 hover:border-teal-300 hover:bg-white/80 hover:shadow-[0_0_15px_rgba(0,105,92,0.1)]"
                  />
                </div>

                {/* Property Type */}
                <div className="col-span-1 relative group">
                  <Building className="absolute left-2.5 lg:left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 lg:w-4 lg:h-4 text-teal-400 group-hover:text-teal-600 transition-all duration-300 z-10" />
                  <button
                    onClick={() => setOpenDropdown(openDropdown === "propertyType" ? null : "propertyType")}
                    className="w-full pl-8 lg:pl-9 pr-6 lg:pr-8 py-1.5 lg:py-2 rounded-xl bg-teal-50/50 border-2 border-transparent text-sm lg:text-base focus:outline-none focus:border-teal-400 focus:bg-white transition-all duration-300 hover:border-teal-300 hover:bg-white/80 hover:shadow-[0_0_15px_rgba(0,105,92,0.1)] text-left flex items-center justify-between"
                  >
                    <span className={propertyType ? 'text-gray-800 truncate text-sm lg:text-base' : 'text-gray-500 truncate text-sm lg:text-base'}>
                      {propertyType || 'Property Type'}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 lg:w-4 lg:h-4 text-teal-400 transition-transform duration-300 flex-shrink-0 ${openDropdown === "propertyType" ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {openDropdown === "propertyType" && (
                    <div className="absolute top-full left-0 mt-1 w-full min-w-[150px] lg:min-w-[200px] rounded-xl shadow-2xl border border-teal-100 overflow-hidden z-50 animate-slide-down-fast">
                      <div className="bg-teal-600 p-1.5 lg:p-2">
                        {/* <div className="bg-white/10 backdrop-blur-sm rounded-lg p-0.5"> */}
                          {['Independent House', 'Independent Villa', 'Residential Apartment', 'Duplex', 'Row House'].map((type) => (
                            <button
                              key={type}
                              onClick={() => {
                                setPropertyType(type);
                                setOpenDropdown(null);
                              }}
                              className={`w-full px-5 lg:px-2 py-1 lg:py-3 text-left text-sm lg:text-base transition-all duration-300 flex items-center gap-2.5 lg:gap-3 rounded-lg mb-0.5 last:mb-0 group
                                ${propertyType === type 
                                  ? 'bg-white text-teal-600 font-semibold shadow-lg scale-[1.02]' 
                                  : 'text-white hover:bg-white/90 hover:text-teal-600 font-medium  hover:scale-[1.01]'
                                }`}
                            >
                              
                              <span className="flex-1">{type}</span>
                              {propertyType === type && (
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    // </div>
                  )}
                </div>

                {/* Price Input */}
                <div className="col-span-1 relative group">
                  <span className="absolute left-2.5 lg:left-3 top-1/2 transform -translate-y-1/2 text-teal-400 group-hover:text-teal-600 transition-all duration-300 font-semibold text-xs lg:text-sm">$</span>
                  <input
                    type="text"
                    placeholder="Price"
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full pl-7 lg:pl-8 pr-3 lg:pr-4 py-1.5 lg:py-2 rounded-xl bg-teal-50/50 border-2 border-transparent text-sm lg:text-base focus:outline-none focus:border-teal-400 focus:bg-white transition-all duration-300 hover:border-teal-300 hover:bg-white/80 hover:shadow-[0_0_15px_rgba(0,105,92,0.1)]"
                  />
                </div>

                {/* Search Button */}
                <button 
                  onClick={handleSearch}
                  className="col-span-1 group relative px-3 lg:px-4 py-1.5 lg:py-2 rounded-xl text-white font-semibold shadow-xl hover:shadow-[0_0_30px_rgba(0,105,92,0.5)] md:hover:shadow-[0_0_40px_rgba(0,105,92,0.5)] transition-all duration-500 hover:scale-105 overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #00695C, #26A69A, #4DB6AC)", backgroundSize: "200% 200%" }}
                >
                  <div className="absolute inset-0 animate-gradient-shift-slow rounded-xl"></div>
                  <div className="relative z-10 flex items-center justify-center gap-1.5 lg:gap-2">
                    <Search className="w-3.5 h-3.5 lg:w-4 lg:h-4 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-sm lg:text-base">Search</span>
                  </div>
                </button>

                {/* Advanced Filter Button */}
                <button 
                  onClick={() => setShowFilterModal(true)}
                  className="col-span-1 group relative px-3 lg:px-4 py-1.5 lg:py-2 rounded-xl text-white font-semibold shadow-xl hover:shadow-[0_0_30px_rgba(0,105,92,0.5)] md:hover:shadow-[0_0_40px_rgba(0,105,92,0.5)] transition-all duration-500 hover:scale-105 overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #00897B, #26A69A)", backgroundSize: "200% 200%" }}
                >
                  <div className="absolute inset-0 animate-gradient-shift-slow rounded-xl"></div>
                  <div className="relative z-10 flex items-center justify-center gap-1.5 lg:gap-2">
                    <Settings className="w-3.5 h-3.5 lg:w-4 lg:h-4 group-hover:rotate-90 transition-transform duration-500" />
                    <span className="text-sm lg:text-base">Advanced Filter</span>
                    {appliedFilters && (
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 lg:w-2.5 lg:h-2.5 bg-emerald-400 rounded-full animate-pulse"></span>
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* House Type Icons - with visible scrollbar below */}
            <div className="mt-1.5 md:mt-2 lg:mt-2.5 w-full">
              <HouseTypeIcons />
            </div>
          </div>
        </div>

{/* ══════════════════════════════════════════════
    FILTER MODAL
══════════════════════════════════════════════ */}
{showFilterModal && (
  <div
    className="fixed inset-0 z-[99999] flex items-center justify-center p-3 md:p-6 lg:p-8 mt-15 md:mt-20 lg:mt-30 bg-black/60 backdrop-blur-md animate-fade-in"
    onClick={() => setShowFilterModal(false)}
  >
    <div
      className="relative w-full max-w-xl md:max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-slide-up bg-white"
      onClick={(e) => e.stopPropagation()}
    >
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
        <div className="w-full px-2 md:px-4 lg:px-6 py-3 md:py-6 lg:py-8">
          <div className="flex flex-col lg:flex-row gap-3 md:gap-4 lg:gap-6 w-full">

            {/* Property Cards */}
            <div className="w-full lg:w-2/3">
              <section className="w-full">
                <IndependentHouse />
              </section>
            </div>

            {/* Sidebar Filter - Desktop Only */}
            <div className="hidden lg:block lg:w-1/3 lg:relative">
              <div className="lg:sticky lg:top-[120px] lg:max-h-[calc(100vh-160px)] lg:overflow-y-auto lg:scrollbar-hide animate-slide-in-right">
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



   /* Custom scrollbar with theme colors - ALWAYS VISIBLE with blink effect */
  .scrollbar-theme {
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: thin;
    scrollbar-color: #26A69A #e0f2f1;
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
  }
  
  .scrollbar-theme::-webkit-scrollbar {
    height: 8px; /* Thicker on mobile for better touch */
    width: 8px;
  }
  
  .scrollbar-theme::-webkit-scrollbar-track {
    background: #e0f2f1;
    border-radius: 10px;
    margin: 0 10px;
    border: 1px solid rgba(0,105,92,0.1);
  }
  
  .scrollbar-theme::-webkit-scrollbar-thumb {
    background: linear-gradient(90deg, #00695C, #26A69A, #4DB6AC);
    border-radius: 10px;
    border: 1px solid rgba(0,105,92,0.2);
    min-height: 30px;
    /* BLINKING EFFECT */
    animation: scrollbar-blink 1.5s ease-in-out infinite;
  }
  
  .scrollbar-theme::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(90deg, #004D40, #00695C, #00897B);
    transform: scale(1.1);
    box-shadow: 0 0 20px rgba(0,105,92,0.5);
    animation-play-state: paused;
  }

  /* BLINKING ANIMATION - subtle glow effect */
  @keyframes scrollbar-blink {
    0%, 100% {
      opacity: 0.7;
      box-shadow: 0 0 5px rgba(38,166,154,0.3);
    }
    50% {
      opacity: 1;
      box-shadow: 0 0 15px rgba(38,166,154,0.8), 0 0 30px rgba(0,105,92,0.4);
    }
  }

  /* Always show scrollbar on mobile (prevents hiding) */
  .scrollbar-theme {
    scrollbar-width: thin !important;
  }
  
  .scrollbar-theme::-webkit-scrollbar {
    display: block !important;
    -webkit-appearance: none !important;
  }

  /* For Firefox - always show */
  .scrollbar-theme {
    scrollbar-color: #26A69A #e0f2f1 !important;
  }
  
  /* On tablet/desktop, make the scrollbar thinner but still visible */
  @media (min-width: 768px) {
    .scrollbar-theme::-webkit-scrollbar {
      height: 5px;
      width: 5px;
    }
    .scrollbar-theme::-webkit-scrollbar-thumb {
      min-height: 20px;
      animation: scrollbar-blink 2s ease-in-out infinite;
    }
  }
      `}</style>
    </div>
  );
};

export default IndependentHousePage;