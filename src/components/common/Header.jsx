import React, { useState } from "react";
import { ChevronDown, Menu, X, ChevronLeft, Home, Building2, PlusCircle, Search, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo1.png";

const Header = ({ onPostPropertyClick }) => {
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeMenu, setActiveMenu] = useState("Home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const [customerPortalSubDropdown, setCustomerPortalSubDropdown] = useState(null);

  const customerPortalMenu = {
    "Individual": ["Rent", "Buy", "Lease", "Sell"],
    "Apartment": ["Rent", "Buy", "Lease", "Sell"],
    "Commercial": ["Rent", "Buy", "Lease", "Sell"],
    "Land & Plots": ["Rent", "Buy", "Lease", "Sell"],
    "Hostel": ["Rent", "Buy", "Lease", "Sell"],
  };

  const otherMenus = [
    { name: "Post Property", items: ["Owner", "Agent", "Builder", "Hostel", "Property Management"] },
    { name: "Find the Loan", items: ["Home Loan", "Property Loan", "Construction Loan", "Plot Loan", "Commercial Loan"] },
    { name: "Services", items: ["Construction", "Interior", "Painting", "Plumbing", "Cleaning"] }
  ];

  const handleCustomerPortalClick = (type) => {
    setActiveDropdown(null);
    setMobileDropdown(null);
    setCustomerPortalSubDropdown(null);
    setIsMobileMenuOpen(false);
    const typeKey = type.toLowerCase().replace(/\s+/g, '-');
    
    const pathMap = {
      "individual": "/individual",
      "rent": "/rent",
      "buy": "/buy",
      "lease": "/lease",
      "sell": "/sell",
      "apartment": "/apartment",
      "commercial": "/commercial",
      "land-&-plots": "/land-plots",
      "hostel": "/hostel"
    };
    
    navigate(pathMap[typeKey] || `/${typeKey}`);
    setActiveMenu("Customer Portal");
  };

  const handleNavigation = (path, menuName) => {
    navigate(path);
    setActiveMenu(menuName);
    setActiveDropdown(null);
    setMobileDropdown(null);
    setCustomerPortalSubDropdown(null);
    setIsMobileMenuOpen(false);
  };

  const handleOtherMenuClick = (itemName, subItem) => {
    setActiveDropdown(null);
    setMobileDropdown(null);
    setCustomerPortalSubDropdown(null);
    setIsMobileMenuOpen(false);
    setActiveMenu(itemName);
    if (onPostPropertyClick) {
      onPostPropertyClick(subItem);
    }
  };

  const isActive = (menuName) => {
    return activeMenu === menuName;
  };

  const toggleMobileDropdown = (menuName) => {
    setMobileDropdown(mobileDropdown === menuName ? null : menuName);
    setCustomerPortalSubDropdown(null);
  };

  const toggleCustomerPortalSubDropdown = (key) => {
    setCustomerPortalSubDropdown(customerPortalSubDropdown === key ? null : key);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <header className="w-full fixed top-0 left-0 z-50">
      {/* Top Branding Section - Responsive */}
      <div className="bg-[#E8F5F3] py-2 sm:py-3 md:py-4 px-3 sm:px-4 md:px-6 lg:px-7 flex items-center justify-between relative overflow-hidden shadow-md">
        {/* Animated background bubbles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="bubble bubble-1"></div>
          <div className="bubble bubble-2"></div>
          <div className="bubble bubble-3"></div>
          <div className="bubble bubble-4"></div>
          <div className="bubble bubble-5"></div>
          <div className="bubble bubble-6"></div>
          <div className="bubble bubble-7"></div>
          <div className="bubble bubble-8"></div>
        </div>

        {/* Back Button - Left side */}
        <button 
          onClick={handleGoBack}
          className="relative z-10 flex items-center gap-1 sm:gap-2 p-1 sm:p-2 rounded-full hover:bg-[#4DB6AC]/20 transition-colors duration-200 group"
          aria-label="Go back"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-[#00796B] group-hover:text-[#00695C] transition-colors duration-200" />
          <span className="hidden sm:inline text-sm font-medium text-[#00796B] group-hover:text-[#00695C] transition-colors duration-200">
            Back
          </span>
        </button>

        {/* Logo and Text - Centered */}
        <div 
          onClick={() => {
            navigate("/");
            setIsMobileMenuOpen(false);
            setActiveMenu("Home");
          }} 
          className="cursor-pointer flex items-center gap-1.5 sm:gap-2 md:gap-3 relative z-10 flex-1 justify-center"
        >
          {/* Logo with multiple animations */}
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#03413a] via-[#26A69A] to-[#0a635a] opacity-10 animate-pulse-glow"></div>
            
            {/* Animated border - infinite rotating gradient */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#80CBC4] via-[#26A69A] to-[#80CBC4] animate-spin-slow"></div>
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#80CBC4] via-[#26A69A] to-[#80CBC4] animate-spin-slow-reverse opacity-70"></div>
            
            {/* Shimmer effect overlay */}
            <div className="absolute -inset-1 rounded-full overflow-hidden">
              <div className="shimmer"></div>
            </div>
            
            {/* Image container with jumping animation */}
            <div className="relative animate-jump">
              <img 
                src={logo} 
                alt="Eliteinova Properties" 
                className="h-8 w-auto sm:h-10 md:h-12 lg:h-15 rounded-full border-4 border-[#4DB6AC] relative z-10" 
              />
            </div>
          </div>

          <div className="flex flex-col relative leading-tight">
            <span 
              className="text-base sm:text-xl md:text-2xl lg:text-4xl"
              style={{ fontFamily: "Pacifico, cursive" }}
            >
              <span className="bg-gradient-to-r from-[#069c8a] via-[#358c83] to-[#0f7e71] bg-clip-text text-transparent font-bold">
                Eliteinova
              </span>
              <span className="bg-gradient-to-r from-[#069c8a] via-[#358c83] to-[#0f7e71] bg-clip-text text-transparent text-xs sm:text-base md:text-xl lg:text-2xl ml-0.5 sm:ml-1 font-bold">
                Properties
              </span>
            </span>
            <span 
              className="text-[10px] xs:text-xs sm:text-sm lg:text-sm font-semibold text-[#00796B] tracking-wider -mt-0.5 sm:-mt-1 md:-mt-2 font-normal"
            >
              Eliteinova Tech Pvt Ltd
            </span>
          </div>
        </div>

        {/* Mobile Menu Toggle Button - Right side */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="relative z-10 md:hidden p-1.5 sm:p-2 rounded-full hover:bg-[#4DB6AC]/20 transition-colors duration-200"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6 text-[#00796B]" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-[#00796B]" />}
        </button>

        {/* Desktop Back Button placeholder - to maintain spacing */}
        <div className="hidden sm:block w-24"></div>
      </div>

      {/* Navigation Bar - Desktop Only */}
      <nav className="hidden md:block bg-[#108f82] w-full px-2 sm:px-4 md:px-6 lg:px-8 relative shadow-lg">
        <div className="flex items-center h-12 space-x-1 lg:space-x-2">
          <button 
            onClick={() => handleNavigation("/", "Home")} 
            className={`h-full px-3 lg:px-4 font-medium text-sm transition-colors duration-200 whitespace-nowrap ${
              isActive("Home") 
                ? "bg-[#4DB6AC] text-white hover:bg-[#26A69A]" 
                : "text-white hover:bg-[#00796B]"
            }`}
          >
            Home
          </button>

          <div 
            className={`relative h-full flex items-center px-3 lg:px-4 cursor-pointer font-medium text-sm transition-colors duration-200 whitespace-nowrap ${
              isActive("Customer Portal") 
                ? "bg-[#4DB6AC] text-white" 
                : "text-white hover:bg-[#00796B]"
            }`}
            onMouseEnter={() => setActiveDropdown("cp")} 
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <span className="flex items-center gap-1 lg:gap-2">
              Customer Portal 
              <ChevronDown className="w-3 h-3" />
            </span>
            
            {activeDropdown === "cp" && (
              <div className="absolute top-full left-0 bg-[#00796B] shadow-lg border border-[#4DB6AC] min-w-[160px] lg:min-w-[180px] z-50 rounded-b">
                {Object.entries(customerPortalMenu).map(([key, sub]) => (
                  <div key={key} className="group relative border-b border-[#4DB6AC] last:border-0">
                    <button 
                      onClick={() => {
                        handleCustomerPortalClick(key);
                        setActiveMenu("Customer Portal");
                      }} 
                      className="w-full px-4 py-2 hover:bg-[#F0F8F7] hover:text-[#00695C] text-left font-bold capitalize text-white text-sm transition-colors duration-150"
                    >
                      {key}
                    </button>
                    <div className="absolute left-full top-0 hidden group-hover:block bg-[#00796B] shadow-lg min-w-[150px] border border-[#4DB6AC] rounded">
                      {sub.map(s => (
                        <button 
                          key={s} 
                          onClick={() => {
                            handleCustomerPortalClick(s);
                            setActiveMenu("Customer Portal");
                          }} 
                          className="block w-full px-4 py-2 hover:bg-[#F0F8F7] hover:text-[#00695C] text-left text-white text-sm transition-colors duration-150 border-b border-[#4DB6AC] last:border-0"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {otherMenus.map((item) => (
            <div 
              key={item.name} 
              className={`relative h-full flex items-center px-3 lg:px-4 cursor-pointer font-medium text-sm transition-colors duration-200 whitespace-nowrap ${
                isActive(item.name) 
                  ? "bg-[#4DB6AC] text-white" 
                  : "text-white hover:bg-[#00796B]"
              }`}
              onMouseEnter={() => setActiveDropdown(item.name)} 
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <span className="flex items-center gap-1 lg:gap-2">
                {item.name} 
                <ChevronDown className="w-3 h-3" />
              </span>
              
              {activeDropdown === item.name && (
                <div className="absolute top-full left-0 bg-[#00796B] shadow-lg border border-[#4DB6AC] min-w-[160px] lg:min-w-[180px] z-50 rounded-b">
                  {item.items.map(m => (
                    <button 
                      key={m} 
                      onClick={() => {
                        handleOtherMenuClick(item.name, m);
                      }} 
                      className="block w-full px-4 py-2 hover:bg-[#F0F8F7] hover:text-[#00695C] text-left text-white text-sm transition-colors duration-150 border-b border-[#4DB6AC] last:border-0"
                    >
                      {m}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden fixed inset-0 top-[60px] sm:top-[68px] bg-[#E8F5F3] z-[100] transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="h-full overflow-y-auto bg-[#E8F5F3]">
          <div className="flex flex-col min-h-full">
            {/* Home */}
            <button 
              onClick={() => handleNavigation("/", "Home")} 
              className={`w-full text-left px-6 py-4 font-medium text-base transition-colors duration-200 border-b border-[#B2DFDB] flex items-center gap-3 ${
                isActive("Home") 
                  ? "bg-[#4DB6AC] text-white" 
                  : "text-[#00695C] hover:bg-[#D5F0EC]"
              }`}
            >
              <Home className={`w-5 h-5 ${isActive("Home") ? "text-white" : "text-[#00796B]"}`} />
              <span>Home</span>
            </button>

            {/* Customer Portal Mobile */}
            <div className="border-b border-[#B2DFDB]">
              <button 
                onClick={() => toggleMobileDropdown("cp")}
                className={`w-full text-left px-6 py-4 font-medium text-base transition-colors duration-200 flex items-center justify-between ${
                  isActive("Customer Portal") 
                    ? "bg-[#4DB6AC] text-white" 
                    : "text-[#00695C] hover:bg-[#D5F0EC]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Building2 className={`w-5 h-5 ${isActive("Customer Portal") ? "text-white" : "text-[#00796B]"}`} />
                  <span>Customer Portal</span>
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${mobileDropdown === "cp" ? "rotate-180" : ""} ${isActive("Customer Portal") ? "text-white" : "text-[#00796B]"}`} />
              </button>
              
              {mobileDropdown === "cp" && (
                <div className="bg-[#D5F0EC]">
                  {Object.entries(customerPortalMenu).map(([key, sub]) => (
                    <div key={key} className="border-b border-[#B2DFDB] last:border-0">
                      <div className="flex items-center justify-between w-full">
                        <button 
                          onClick={() => {
                            handleCustomerPortalClick(key);
                            setActiveMenu("Customer Portal");
                          }}
                          className="flex-1 text-left px-8 py-3 font-bold capitalize text-[#00695C] text-sm hover:bg-[#C5E8E3] transition-colors duration-150 flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#4DB6AC]"></span>
                          {key}
                        </button>
                        <button 
                          onClick={() => toggleCustomerPortalSubDropdown(key)}
                          className="px-4 py-3 hover:bg-[#C5E8E3] transition-colors duration-150"
                        >
                          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${customerPortalSubDropdown === key ? "rotate-180" : ""} text-[#00796B]`} />
                        </button>
                      </div>
                      
                      {customerPortalSubDropdown === key && (
                        <div className="pl-8 bg-[#E8F5F3]">
                          {sub.map(s => (
                            <button 
                              key={s} 
                              onClick={() => {
                                handleCustomerPortalClick(s);
                                setActiveMenu("Customer Portal");
                              }} 
                              className="block w-full text-left px-4 py-2.5 hover:bg-[#C5E8E3] text-[#00695C] text-sm transition-colors duration-150 border-t border-[#B2DFDB] flex items-center gap-2"
                            >
                              <span className="w-1 h-1 rounded-full bg-[#80CBC4]"></span>
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Other Menus Mobile */}
            {otherMenus.map((item) => {
              const getIcon = (name) => {
                switch(name) {
                  case 'Post Property': return <PlusCircle className="w-5 h-5" />;
                  case 'Find the Loan': return <Search className="w-5 h-5" />;
                  case 'Services': return <Wrench className="w-5 h-5" />;
                  default: return <Building2 className="w-5 h-5" />;
                }
              };

              return (
                <div key={item.name} className="border-b border-[#B2DFDB]">
                  <button 
                    onClick={() => toggleMobileDropdown(item.name)}
                    className={`w-full text-left px-6 py-4 font-medium text-base transition-colors duration-200 flex items-center justify-between ${
                      isActive(item.name) 
                        ? "bg-[#4DB6AC] text-white" 
                        : "text-[#00695C] hover:bg-[#D5F0EC]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {React.cloneElement(getIcon(item.name), { 
                        className: `w-5 h-5 ${isActive(item.name) ? "text-white" : "text-[#00796B]"}`
                      })}
                      <span>{item.name}</span>
                    </div>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${mobileDropdown === item.name ? "rotate-180" : ""} ${isActive(item.name) ? "text-white" : "text-[#00796B]"}`} />
                  </button>
                  
                  {mobileDropdown === item.name && (
                    <div className="bg-[#D5F0EC]">
                      {item.items.map(m => (
                        <button 
                          key={m} 
                          onClick={() => {
                            handleOtherMenuClick(item.name, m);
                          }} 
                          className="block w-full text-left px-8 py-3 hover:bg-[#C5E8E3] text-[#00695C] text-sm transition-colors duration-150 border-t border-[#B2DFDB] flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#4DB6AC]"></span>
                          {m}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Footer with Line - Always at bottom */}
            <div className="mt-auto">
              <div className="border-t border-[#B2DFDB]"></div>
              <div className="px-6 py-4 bg-[#E8F5F3]">
                <p className="text-[#00695C] text-xs text-center font-medium">
                  © 2024 Eliteinova Properties
                </p>
                <p className="text-[#4DB6AC] text-xs text-center mt-1">
                  Eliteinova Tech Pvt Ltd
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        /* Bubble Animations */
        .bubble {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(38, 166, 154, 0.1), rgba(0, 105, 92, 0.05));
          animation: float-bubble linear infinite;
        }
        
        .bubble-1 {
          width: 60px;
          height: 60px;
          left: 5%;
          animation-duration: 10s;
          animation-delay: 0s;
        }
        
        .bubble-2 {
          width: 40px;
          height: 40px;
          left: 15%;
          top: 20%;
          animation-duration: 12s;
          animation-delay: 1s;
        }
        
        .bubble-3 {
          width: 80px;
          height: 80px;
          right: 10%;
          top: -10%;
          animation-duration: 14s;
          animation-delay: 2s;
        }
        
        .bubble-4 {
          width: 50px;
          height: 50px;
          right: 25%;
          top: 60%;
          animation-duration: 10s;
          animation-delay: 3s;
        }
        
        .bubble-5 {
          width: 35px;
          height: 35px;
          left: 45%;
          top: 70%;
          animation-duration: 14s;
          animation-delay: 0.5s;
        }
        
        .bubble-6 {
          width: 70px;
          height: 70px;
          left: 70%;
          top: 20%;
          animation-duration: 13s;
          animation-delay: 1.5s;
        }
        
        .bubble-7 {
          width: 45px;
          height: 45px;
          left: 30%;
          top: -5%;
          animation-duration: 7s;
          animation-delay: 2.5s;
        }
        
        .bubble-8 {
          width: 55px;
          height: 55px;
          right: 40%;
          top: 40%;
          animation-duration: 10s;
          animation-delay: 3.5s;
        }
        
        @keyframes float-bubble {
          0% {
            transform: translateY(100%) scale(0);
            opacity: 0;
          }
          20% {
            opacity: 0.8;
          }
          80% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-100vh) scale(1);
            opacity: 0;
          }
        }
        
        /* Rotating Border Animations */
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes spin-slow-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
        
        /* Jump Animation */
        @keyframes jump {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        /* Pulse Glow */
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.1;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.05);
          }
        }
        
        /* Shimmer Effect */
        .shimmer {
          position: absolute;
          top: 0;
          left: -100%;
          width: 200%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.15),
            transparent
          );
          animation: shimmer-slide 3s ease-in-out infinite;
        }
        
        @keyframes shimmer-slide {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(50%);
          }
        }
        
        /* Animation Classes */
        .animate-spin-slow {
          animation: spin-slow 7s linear infinite;
        }
        
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 7s linear infinite;
        }
        
        .animate-jump {
          animation: jump 3s ease-in-out infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
    </header>
  );
};

export default Header;