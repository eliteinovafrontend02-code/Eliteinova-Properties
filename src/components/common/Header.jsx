import React, { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo1.png";

const Header = ({ onPostPropertyClick }) => {
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeMenu, setActiveMenu] = useState("Home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(null);

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
    setIsMobileMenuOpen(false);
  };

  const handleOtherMenuClick = (itemName, subItem) => {
    setActiveDropdown(null);
    setMobileDropdown(null);
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
  };

  return (
    <header className="w-full fixed top-0 left-0 z-50">
      {/* Top Branding Section - Responsive */}
      <div className="bg-[#d8e8e1] py-3 px-4 sm:py-4 md:px-6 lg:px-7 flex items-center justify-center relative overflow-hidden shadow-md">
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

        <div 
          onClick={() => {
            navigate("/");
            setIsMobileMenuOpen(false);
            setActiveMenu("Home");
          }} 
          className="cursor-pointer flex items-center gap-2 sm:gap-3 relative z-10"
        >
          {/* Logo with multiple animations */}
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#1E3A36] via-[#9f7c31] to-[#1E3A36] opacity-10 animate-pulse-glow"></div>
            
            {/* Animated border - infinite rotating gradient */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#1E3A36] via-[#9f7c31] to-[#1E3A36] animate-spin-slow"></div>
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#1E3A36] via-[#9f7c31] to-[#1E3A36] animate-spin-slow-reverse opacity-70"></div>
            
            {/* Shimmer effect overlay */}
            <div className="absolute -inset-1 rounded-full overflow-hidden">
              <div className="shimmer"></div>
            </div>
            
            {/* Image container with jumping animation */}
            <div className="relative animate-jump">
              <img 
                src={logo} 
                alt="Eliteinova Properties" 
                className="h-10 w-auto sm:h-12 lg:h-15 rounded-full border-4 border-[#d8e8e1] relative z-10" 
              />
            </div>
          </div>

          <div className="flex flex-col relative">
            <span 
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl h-13 font-bold bg-gradient-to-r from-[#1E3A36] via-[#9f7c31] to-[#1E3A36] bg-clip-text text-transparent animate-shimmer-text"
              style={{ fontFamily: "Pacifico, cursive" }}
            >
              Eliteinova Properties
            </span>
            <span 
              className="text-xs sm:text-sm lg:text-lg font-semibold text-[#82621e] tracking-wider -mt-1 sm:-mt-2 md:-mt-3 animate-pulse-text"
              style={{ fontFamily: "Pacifico, cursive" }}
            >
              No Brokerage
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-[#1E3A36] w-full px-2 sm:px-4 md:px-6 lg:px-8 relative shadow-lg">
        <div className="flex items-center justify-between h-12">
          {/* Desktop Navigation - Shows on md and above */}
          <div className="hidden md:flex items-center h-full space-x-1 lg:space-x-2">
            {/* Home */}
            <button 
              onClick={() => handleNavigation("/", "Home")} 
              className={`h-full px-3 lg:px-4 font-medium text-sm transition-colors duration-200 whitespace-nowrap ${
                isActive("Home") 
                  ? "bg-[#D4A84B] text-white hover:bg-[#C49A3F]" 
                  : "text-white hover:bg-[#2A4F4A]"
              }`}
            >
              Home
            </button>

            {/* Customer Portal */}
            <div 
              className={`relative h-full flex items-center px-3 lg:px-4 cursor-pointer font-medium text-sm transition-colors duration-200 whitespace-nowrap ${
                isActive("Customer Portal") 
                  ? "bg-[#D4A84B] text-white" 
                  : "text-white hover:bg-[#2A4F4A]"
              }`}
              onMouseEnter={() => setActiveDropdown("cp")} 
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <span className="flex items-center gap-1 lg:gap-2">
                Customer Portal 
                <ChevronDown className="w-3 h-3" />
              </span>
              
              {activeDropdown === "cp" && (
                <div className="absolute top-full left-0 bg-[#2A4F4A] shadow-lg border border-[#3A5F5A] min-w-[160px] lg:min-w-[180px] z-50 rounded-b">
                  {Object.entries(customerPortalMenu).map(([key, sub]) => (
                    <div key={key} className="group relative border-b border-[#3A5F5A] last:border-0">
                      <button 
                        onClick={() => {
                          handleCustomerPortalClick(key);
                          setActiveMenu("Customer Portal");
                        }} 
                        className="w-full px-4 py-2 hover:bg-[#E8F0EF] hover:text-[#1E3A36] text-left font-bold capitalize text-white text-sm transition-colors duration-150"
                      >
                        {key}
                      </button>
                      <div className="absolute left-full top-0 hidden group-hover:block bg-[#2A4F4A] shadow-lg min-w-[150px] border border-[#3A5F5A] rounded">
                        {sub.map(s => (
                          <button 
                            key={s} 
                            onClick={() => {
                              handleCustomerPortalClick(s);
                              setActiveMenu("Customer Portal");
                            }} 
                            className="block w-full px-4 py-2 hover:bg-[#E8F0EF] hover:text-[#1E3A36] text-left text-white text-sm transition-colors duration-150 border-b border-[#3A5F5A] last:border-0"
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

            {/* Other Menus */}
            {otherMenus.map((item) => (
              <div 
                key={item.name} 
                className={`relative h-full flex items-center px-3 lg:px-4 cursor-pointer font-medium text-sm transition-colors duration-200 whitespace-nowrap ${
                  isActive(item.name) 
                    ? "bg-[#D4A84B] text-white" 
                    : "text-white hover:bg-[#2A4F4A]"
                }`}
                onMouseEnter={() => setActiveDropdown(item.name)} 
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <span className="flex items-center gap-1 lg:gap-2">
                  {item.name} 
                  <ChevronDown className="w-3 h-3" />
                </span>
                
                {activeDropdown === item.name && (
                  <div className="absolute top-full left-0 bg-[#2A4F4A] shadow-lg border border-[#3A5F5A] min-w-[160px] lg:min-w-[180px] z-50 rounded-b">
                    {item.items.map(m => (
                      <button 
                        key={m} 
                        onClick={() => {
                          handleOtherMenuClick(item.name, m);
                        }} 
                        className="block w-full px-4 py-2 hover:bg-[#E8F0EF] hover:text-[#1E3A36] text-left text-white text-sm transition-colors duration-150 border-b border-[#3A5F5A] last:border-0"
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Menu Toggle Button - Shows only on sm screens */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white hover:text-[#D4A84B] transition-colors duration-200 p-2"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Spacer for desktop to maintain layout */}
          <div className="hidden md:block"></div>
        </div>

        {/* Mobile Menu - Shows only on sm screens */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#1E3A36] shadow-xl z-50 max-h-[80vh] overflow-y-auto">
            <div className="flex flex-col py-2">
              {/* Home */}
              <button 
                onClick={() => handleNavigation("/", "Home")} 
                className={`w-full text-left px-4 py-3 font-medium text-sm transition-colors duration-200 border-b border-[#2A4F4A] ${
                  isActive("Home") 
                    ? "bg-[#D4A84B] text-white" 
                    : "text-white hover:bg-[#2A4F4A]"
                }`}
              >
                Home
              </button>

              {/* Customer Portal Mobile */}
              <div className="border-b border-[#2A4F4A]">
                <button 
                  onClick={() => toggleMobileDropdown("cp")}
                  className={`w-full text-left px-4 py-3 font-medium text-sm transition-colors duration-200 flex items-center justify-between ${
                    isActive("Customer Portal") 
                      ? "bg-[#D4A84B] text-white" 
                      : "text-white hover:bg-[#2A4F4A]"
                  }`}
                >
                  <span>Customer Portal</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileDropdown === "cp" ? "rotate-180" : ""}`} />
                </button>
                
                {mobileDropdown === "cp" && (
                  <div className="bg-[#2A4F4A]">
                    {Object.entries(customerPortalMenu).map(([key, sub]) => (
                      <div key={key} className="border-b border-[#3A5F5A] last:border-0">
                        <button 
                          onClick={() => {
                            handleCustomerPortalClick(key);
                            setActiveMenu("Customer Portal");
                          }} 
                          className="w-full text-left px-6 py-2.5 font-bold capitalize text-white text-sm hover:bg-[#3A5F5A] transition-colors duration-150"
                        >
                          {key}
                        </button>
                        <div className="pl-6">
                          {sub.map(s => (
                            <button 
                              key={s} 
                              onClick={() => {
                                handleCustomerPortalClick(s);
                                setActiveMenu("Customer Portal");
                              }} 
                              className="block w-full text-left px-4 py-2 hover:bg-[#3A5F5A] text-white text-sm transition-colors duration-150 border-t border-[#3A5F5A]"
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

              {/* Other Menus Mobile */}
              {otherMenus.map((item) => (
                <div key={item.name} className="border-b border-[#2A4F4A]">
                  <button 
                    onClick={() => toggleMobileDropdown(item.name)}
                    className={`w-full text-left px-4 py-3 font-medium text-sm transition-colors duration-200 flex items-center justify-between ${
                      isActive(item.name) 
                        ? "bg-[#D4A84B] text-white" 
                        : "text-white hover:bg-[#2A4F4A]"
                    }`}
                  >
                    <span>{item.name}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileDropdown === item.name ? "rotate-180" : ""}`} />
                  </button>
                  
                  {mobileDropdown === item.name && (
                    <div className="bg-[#2A4F4A]">
                      {item.items.map(m => (
                        <button 
                          key={m} 
                          onClick={() => {
                            handleOtherMenuClick(item.name, m);
                          }} 
                          className="block w-full text-left px-6 py-2.5 hover:bg-[#3A5F5A] text-white text-sm transition-colors duration-150 border-t border-[#3A5F5A]"
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Custom Animations */}
      <style jsx>{`
        /* Bubble Animations */
        .bubble {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(157, 124, 49, 0.15), rgba(30, 58, 54, 0.1));
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
            opacity: 1;
          }
          80% {
            opacity: 1;
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
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1);
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
            rgba(255, 255, 255, 0.2),
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
        
        /* Text Shimmer */
        @keyframes shimmer-text {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        
        .animate-shimmer-text {
          background-size: 200% auto;
          animation: shimmer-text 3s linear infinite;
        }
        
        /* Text Pulse */
        @keyframes pulse-text {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        
        .animate-pulse-text {
          animation: pulse-text 2s ease-in-out infinite;
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