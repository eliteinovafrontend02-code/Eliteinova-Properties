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
    { name: "Apartment", path: "/apartment", icon: <Building className="w-4 h-4" /> },
    { name: "Commercial", path: "/commercial", icon: <Landmark className="w-4 h-4" /> },
    { name: "Land & Plots", path: "/land-plots", icon: <Warehouse className="w-4 h-4" /> },
    { name: "Hostel", path: "/hostel", icon: <Building2 className="w-4 h-4" /> }
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

  const RentBuyDropdown = ({ isMobile = false }) => (
    <div className="relative w-full">
      <button
        onClick={() => setOpenDropdown(openDropdown === "toggle" ? null : "toggle")}
        className="group relative px-4 py-2.5 rounded-xl text-white font-semibold text-sm flex items-center gap-2 shadow-xl w-full transition-all duration-300 hover:shadow-2xl"
        style={{ 
          background: "linear-gradient(135deg, #00695C, #26A69A, #4DB6AC)",
          backgroundSize: "200% 200%"
        }}
      >
        <div className="absolute inset-0 animate-gradient-shift-slow rounded-xl"></div>
        <Home className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
        <span className="relative z-10">{activeButton}</span>
        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openDropdown === "toggle" ? "rotate-180" : ""} relative z-10 ml-auto`} />
      </button>

      {openDropdown === "toggle" && (
        <div className="absolute top-full left-0 mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden z-50 min-w-[180px] w-full border border-teal-200/30 animate-slide-down-fast">
          {["Buy", "Rent", "Lease", "Sell"].map((item, idx, arr) => (
            <React.Fragment key={item}>
              <button
                onClick={() => { handleNavigation(`/${item.toLowerCase()}`); setActiveButton(item); setOpenDropdown(null); }}
                className="w-full px-5 py-3.5 text-left text-base hover:bg-gradient-to-r hover:from-teal-50 hover:to-emerald-50 transition-all duration-300 text-gray-700 font-medium group"
                style={activeButton === item ? { color: "#00695C", backgroundColor: "#e0f2f1", fontWeight: 600 } : {}}
              >
                <div className="flex items-center gap-3 group-hover:gap-4 transition-all">
                  <div className={`w-2.5 h-2.5 rounded-full ${activeButton === item ? 'bg-gradient-to-r from-teal-500 to-emerald-500' : 'bg-gray-300 group-hover:bg-teal-400'} transition-all duration-300`}></div>
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
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 px-2 w-full max-w-4xl mx-auto animate-fade-in-up delay-200">
      {propertyCategories.map((category, index) => (
        <button
          key={category.name}
          onClick={() => handlePropertyCategoryNavigation(category.path)}
          className="group relative px-3 sm:px-4 py-2.5 rounded-xl text-white font-semibold text-xs sm:text-sm shadow-2xl hover:shadow-[0_0_40px_rgba(0,105,92,0.5)] transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 overflow-hidden animate-slide-up w-full"
          style={{
            animationDelay: `${index * 100}ms`,
            background: "linear-gradient(135deg, #00695C, #26A69A, #4DB6AC)",
            backgroundSize: "200% 200%"
          }}
        >
          <div className="absolute inset-0 animate-gradient-shift"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <div className="relative z-10 flex items-center justify-center gap-1 sm:gap-2">
            <span className="group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">{category.icon}</span>
            <span className="truncate">{category.name}</span>
          </div>
        </button>
      ))}
    </div>
  );

  const HouseTypeIcons = () => (
    <div className="flex items-start justify-start sm:justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 mb-8 px-2 sm:px-4 overflow-x-auto scrollbar-hide py-2">
      {houseTypes.map((type) => {
        const isActive = activeHouseType === type.name;
        const words = type.name.split(' ');
        
        return (
          <div 
            key={type.name} 
            className="flex flex-col items-center gap-1 sm:gap-2 cursor-pointer group flex-shrink-0 transition-all duration-300" 
            onClick={() => handleNavigation(type.path, type.name)}
          >
            <div className={`
              w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full border-3 p-0.5 overflow-hidden 
              group-hover:scale-110 transition-all duration-300
              ${isActive ? 'border-teal-600 shadow-2xl shadow-teal-200/70 ring-4 ring-teal-100/50' : 'border-teal-800 group-hover:border-teal-500'}
            `}>
              <img 
                src={type.img} 
                alt={type.name} 
                className="w-full h-full rounded-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className={`
              text-[10px] sm:text-xs md:text-sm font-semibold text-center transition-all duration-300 flex flex-col items-center
              ${isActive ? 'text-teal-700 bg-teal-50 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-md' : 'text-gray-700 group-hover:text-teal-600'}
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

        {/* HERO SECTION - FULL WIDTH */}
        <section className="w-full relative flex items-center justify-center group py-4 sm:py-6 md:py-8 lg:py-10">
          <div className="absolute inset-0 bg-gradient-to-b animate-gradient-slow"></div>
          <div className="w-full px-3 sm:px-4 md:px-6 relative z-10 text-center flex flex-col items-center justify-center gap-2 sm:gap-3">
            <div className="hidden sm:inline-flex mb-2 items-center gap-3 px-4 py-1.5 rounded-full bg-gradient-to-r from-teal-600/30 to-emerald-600/30 backdrop-blur-lg border border-teal-300/30 animate-float-glow shadow-[0_0_40px_rgba(0,105,92,0.4)]">
              <Star className="w-4 h-4 text-yellow-300 animate-spin-slow" fill="currentColor" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-300 text-sm font-medium">
                Premium Independent House Properties
              </span>
              <Shield className="w-4 h-4 text-teal-300" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white animate-slide-up drop-shadow-[0_0_40px_rgba(0,105,92,0.6)]">
              Find Your Dream{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-300 to-teal-300 animate-gradient-text">
                Independent House
              </span>
            </h1>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/90 max-w-3xl mx-auto leading-relaxed px-2">
              Discover luxurious independent homes with world-class amenities in the most sought-after locations
            </p>
            <div className="flex items-center gap-2 text-white/70 text-[10px] sm:text-xs mt-1">
              <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>500+ Properties Available</span>
              <span className="w-1 h-1 bg-white/30 rounded-full"></span>
              <Award className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Verified Listings</span>
            </div>
            <PropertyCategoryButtons />
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            GRAND SEARCH & FILTER SECTION - DESKTOP (FULL WIDTH)
        ══════════════════════════════════════════════ */}
        <div className="hidden lg:block bg-gradient-to-r from-white/95 via-teal-50/95 to-white/95 backdrop-blur-xl shadow-2xl sticky top-0 z-40 border-b border-teal-200/30 transition-all duration-500 animate-slide-down">
          <div className="w-full px-4 xl:px-8 py-4">
            {/* Premium Search Bar - Full Width */}
            <div className="flex flex-wrap items-center gap-3 bg-white rounded-2xl shadow-2xl p-2 border border-teal-200/50 w-full">
              {/* Rent/Buy Dropdown */}
              <div className="w-[130px] flex-shrink-0">
                <RentBuyDropdown />
              </div>

              <div className="w-px h-10 bg-gradient-to-b from-transparent via-teal-300 to-transparent"></div>

              {/* Location Input */}
              <div className="relative flex-1 min-w-[140px] group">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-400 group-hover:text-teal-600 transition-all duration-300" />
                <input
                  type="text"
                  placeholder="Enter Location"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-teal-50/50 border-2 border-transparent text-sm focus:outline-none focus:border-teal-400 focus:bg-white transition-all duration-300 hover:bg-white/80"
                />
              </div>

              <div className="w-px h-10 bg-gradient-to-b from-transparent via-teal-300 to-transparent"></div>

              {/* Property Type Dropdown */}
              <div className="relative flex-shrink-0 min-w-[140px] group">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-400 group-hover:text-teal-600 transition-all duration-300" />
                <select 
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-teal-50/50 border-2 border-transparent text-sm focus:outline-none focus:border-teal-400 focus:bg-white transition-all duration-300 appearance-none cursor-pointer hover:bg-white/80"
                >
                  <option value="">Property Type</option>
                  <option>Independent House</option>
                  <option>Independent Villa</option>
                  <option>Residential Apartment</option>
                  <option>Duplex</option>
                  <option>Row House</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-teal-400 pointer-events-none group-hover:text-teal-600 transition-all duration-300" />
              </div>

              <div className="w-px h-10 bg-gradient-to-b from-transparent via-teal-300 to-transparent"></div>

              {/* Price Range Input */}
              <div className="relative flex-1 min-w-[140px] group">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-400 group-hover:text-teal-600 transition-all duration-300 font-semibold">$</span>
                <input
                  type="text"
                  placeholder="Price Range"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-teal-50/50 border-2 border-transparent text-sm focus:outline-none focus:border-teal-400 focus:bg-white transition-all duration-300 hover:bg-white/80"
                />
              </div>

              <div className="w-px h-10 bg-gradient-to-b from-transparent via-teal-300 to-transparent"></div>

              {/* Search Button */}
              <button 
                onClick={handleSearch}
                className="group relative px-6 py-2.5 rounded-xl text-white font-semibold shadow-xl hover:shadow-[0_0_40px_rgba(0,105,92,0.5)] transition-all duration-500 hover:scale-105 overflow-hidden flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #00695C, #26A69A, #4DB6AC)", backgroundSize: "200% 200%" }}
              >
                <div className="absolute inset-0 animate-gradient-shift-slow rounded-xl"></div>
                <div className="relative z-10 flex items-center gap-2">
                  <Search className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  <span className="hidden xl:inline">Search</span>
                </div>
              </button>

              <div className="w-px h-10 bg-gradient-to-b from-transparent via-teal-300 to-transparent"></div>

              {/* Advanced Filter Button */}
              <button 
                onClick={() => setShowFilterModal(true)}
                className="group relative px-4 py-2.5 rounded-xl text-white font-semibold shadow-xl hover:shadow-[0_0_40px_rgba(0,105,92,0.5)] transition-all duration-500 hover:scale-105 overflow-hidden flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #00897B, #26A69A)", backgroundSize: "200% 200%" }}
              >
                <div className="absolute inset-0 animate-gradient-shift-slow rounded-xl"></div>
                <div className="relative z-10 flex items-center gap-2">
                  <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                  <span className="hidden xl:inline">Advanced Filters</span>
                  <span className="xl:hidden">Filters</span>
                  {appliedFilters && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></span>
                  )}
                </div>
              </button>
            </div>

            {/* House Type Icons - Full Width */}
            <div className="mt-4 w-full">
              <HouseTypeIcons />
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            GRAND SEARCH & FILTER SECTION - TABLET
        ══════════════════════════════════════════════ */}
        <div className="hidden md:block lg:hidden bg-gradient-to-r from-white/95 via-teal-50/95 to-white/95 backdrop-blur-xl shadow-2xl sticky top-0 z-40 border-b border-teal-200/30 animate-slide-down">
          <div className="w-full px-4 py-3 space-y-3">
            {/* Row 1: Rent/Buy dropdown + Search inputs */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="w-[130px] flex-shrink-0">
                <RentBuyDropdown />
              </div>
              <div className="flex-1 min-w-[120px] relative group">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-teal-400" />
                <input
                  type="text"
                  placeholder="Location"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border-2 border-teal-200/50 text-sm focus:outline-none focus:border-teal-400 transition-all duration-300"
                />
              </div>
              <div className="flex-1 min-w-[120px] relative group">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-400 font-semibold text-sm">$</span>
                <input
                  type="text"
                  placeholder="Price"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border-2 border-teal-200/50 text-sm focus:outline-none focus:border-teal-400 transition-all duration-300"
                />
              </div>
            </div>

            {/* Row 2: Property Type + Search + Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex-1 min-w-[120px] relative group">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-teal-400" />
                <select 
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 rounded-xl bg-white border-2 border-teal-200/50 text-sm focus:outline-none focus:border-teal-400 transition-all duration-300 appearance-none cursor-pointer"
                >
                  <option value="">Property Type</option>
                  <option>Independent House</option>
                  <option>Independent Villa</option>
                  <option>Residential Apartment</option>
                  <option>Duplex</option>
                  <option>Row House</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-teal-400 pointer-events-none" />
              </div>
              <button 
                onClick={handleSearch}
                className="group relative px-5 py-2 rounded-xl text-white font-semibold shadow-xl hover:shadow-[0_0_30px_rgba(0,105,92,0.4)] transition-all duration-500 hover:scale-105 overflow-hidden flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #00695C, #26A69A, #4DB6AC)", backgroundSize: "200% 200%" }}
              >
                <div className="absolute inset-0 animate-gradient-shift-slow rounded-xl"></div>
                <div className="relative z-10 flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </div>
              </button>
              <button 
                onClick={() => setShowFilterModal(true)}
                className="group relative px-4 py-2 rounded-xl text-white font-semibold shadow-xl hover:shadow-[0_0_30px_rgba(0,105,92,0.4)] transition-all duration-500 hover:scale-105 overflow-hidden flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #00897B, #26A69A)", backgroundSize: "200% 200%" }}
              >
                <div className="absolute inset-0 animate-gradient-shift-slow rounded-xl"></div>
                <div className="relative z-10 flex items-center gap-1">
                  <Settings className="w-4 h-4" />
                  <span>Filters</span>
                </div>
              </button>
            </div>

            {/* Row 3: House Type Icons */}
            <HouseTypeIcons />
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            GRAND SEARCH & FILTER SECTION - MOBILE
        ══════════════════════════════════════════════ */}
        <div className="md:hidden bg-gradient-to-r from-white/95 via-teal-50/95 to-white/95 backdrop-blur-xl shadow-2xl sticky top-0 z-40 border-b border-teal-200/30 animate-slide-down">
          <div className="w-full px-3 py-3 space-y-3">
            {/* Row 1: Rent/Buy dropdown + Search */}
            <div className="flex gap-2 items-center w-full">
              <div className="w-[120px] flex-shrink-0">
                <RentBuyDropdown isMobile />
              </div>
              <div className="flex-1 relative group">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-teal-400" />
                <input
                  type="text"
                  placeholder="Location"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border-2 border-teal-200/50 text-sm focus:outline-none focus:border-teal-400 transition-all duration-300"
                />
              </div>
            </div>

            {/* Row 2: Property Type + Price + Search */}
            <div className="grid grid-cols-3 gap-2 w-full">
              <div className="col-span-1 relative group">
                <Building className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-teal-400" />
                <select 
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full pl-8 pr-6 py-2 rounded-xl bg-white border-2 border-teal-200/50 text-sm focus:outline-none focus:border-teal-400 transition-all duration-300 appearance-none cursor-pointer"
                >
                  <option value="">Type</option>
                  <option>House</option>
                  <option>Villa</option>
                  <option>Apartment</option>
                  <option>Duplex</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-teal-400 pointer-events-none" />
              </div>
              <div className="col-span-1 relative group">
                <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-teal-400 font-semibold text-sm">$</span>
                <input
                  type="text"
                  placeholder="Price"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full pl-6 pr-2 py-2 rounded-xl bg-white border-2 border-teal-200/50 text-sm focus:outline-none focus:border-teal-400 transition-all duration-300"
                />
              </div>
              <button 
                onClick={handleSearch}
                className="col-span-1 group relative px-2 py-2 rounded-xl text-white font-semibold shadow-xl hover:shadow-[0_0_30px_rgba(0,105,92,0.4)] transition-all duration-500 hover:scale-105 overflow-hidden"
                style={{ background: "linear-gradient(135deg, #00695C, #26A69A, #4DB6AC)", backgroundSize: "200% 200%" }}
              >
                <div className="absolute inset-0 animate-gradient-shift-slow rounded-xl"></div>
                <div className="relative z-10 flex items-center justify-center">
                  <Search className="w-5 h-5" />
                </div>
              </button>
            </div>

            {/* Row 3: Filter + Icons row */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowFilterModal(true)}
                className="group relative px-3 py-1.5 rounded-xl text-white font-semibold text-xs shadow-xl hover:shadow-[0_0_30px_rgba(0,105,92,0.4)] transition-all duration-500 hover:scale-105 overflow-hidden flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #00897B, #26A69A)", backgroundSize: "200% 200%" }}
              >
                <div className="absolute inset-0 animate-gradient-shift-slow rounded-xl"></div>
                <div className="relative z-10 flex items-center gap-1">
                  <Settings className="w-3 h-3" />
                  <span>Advanced Filters</span>
                  {appliedFilters && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                  )}
                </div>
              </button>
              <div className="flex-1 overflow-x-auto scrollbar-hide">
                <div className="flex items-center gap-2 min-w-max">
                  {houseTypes.slice(0, 4).map((type) => {
                    const isActive = activeHouseType === type.name;
                    return (
                      <div 
                        key={type.name} 
                        className="flex flex-col items-center gap-0.5 cursor-pointer group flex-shrink-0 transition-all duration-300" 
                        onClick={() => handleNavigation(type.path, type.name)}
                      >
                        <div className={`
                          w-10 h-10 rounded-full border-2 p-0.5 overflow-hidden 
                          group-hover:scale-110 transition-all duration-300
                          ${isActive ? 'border-teal-600 shadow-lg ring-2 ring-teal-100/50' : 'border-teal-800 group-hover:border-teal-500'}
                        `}>
                          <img 
                            src={type.img} 
                            alt={type.name} 
                            className="w-full h-full rounded-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <span className={`text-[8px] font-semibold text-center transition-all duration-300 ${isActive ? 'text-teal-700' : 'text-gray-700'}`}>
                          {type.name.split(' ').slice(0, 2).join(' ')}
                        </span>
                      </div>
                    );
                  })}
                  <button className="flex-shrink-0 text-teal-600 text-xs font-semibold px-2 py-1 rounded-full bg-teal-50">
                    +{houseTypes.length - 4}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            FILTER MODAL
        ══════════════════════════════════════════════ */}
        {showFilterModal && (
          <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-8 sm:pt-[100px] px-3 sm:px-4 pb-4 bg-black/60 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto animate-slide-up">
              <IndependentHouseFilter
                activeTab={activeButton}
                onFilterChange={handleFilterChange}
                onClose={() => setShowFilterModal(false)}
              />
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════
            MAIN CONTENT - FULL WIDTH
        ══════════════════════════════════════════════ */}
        <div className="w-full px-3 sm:px-4 lg:px-8 py-6 sm:py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 w-full">

            {/* ── Property Cards ── */}
            <div className="w-full lg:w-2/3">
              <section className="w-full">
                <IndependentHouse />
              </section>
            </div>

            {/* ── Sidebar Filter (desktop only) ── */}
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

        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }

        .lg\:scrollbar-hide::-webkit-scrollbar { width: 6px; }
        .lg\:scrollbar-hide::-webkit-scrollbar-track {
          background: linear-gradient(to bottom, transparent, rgba(0,105,92,0.1), transparent);
          border-radius: 10px;
        }
        .lg\:scrollbar-hide::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #00695C, #26A69A);
          border-radius: 10px;
        }
        .lg\:scrollbar-hide::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #004D40, #00796B);
          box-shadow: 0 0 10px rgba(0,105,92,0.5);
        }
      `}</style>
    </div>
  );
};

export default IndependentHousePage;