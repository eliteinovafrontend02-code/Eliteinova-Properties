import React, { useState, useEffect, useRef } from "react";
import { User, Menu, ChevronDown, X, Sparkles, Settings, LogOut, Home, Building, Landmark, Warehouse, TrendingUp, Shield, DollarSign, Wrench, PaintBucket, Droplets, Heart, Star, Zap, CheckCircle, Award, MapPin, Globe, Phone, Mail, Calendar, Clock, Briefcase, Users, Briefcase as OfficeIcon, Menu as MenuIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo1.png";

// Import Individual Forms (Owner)
import { IndRentForm, IndSellForm, IndLeaseForm } from "../Forms/Owner/Index.js";

// Import Apartment Forms (Owner)
import { ApartRentForm, ApartSellForm, ApartLeaseForm } from "../Forms/Owner/Index.js";

// Import Agent Forms
import { RentAgentIndForm, SellAgentIndForm, LeaseAgentIndForm } from "../Forms/Agent/Index.js";

// Import Agent Apartment Forms
import { RentAgentApartForm, SellAgentApartForm, LeaseAgentApartForm } from "../Forms/Agent/Index.js";

// Import Builder Forms
import { RentBuilderIndForm, SellBuilderIndForm, LeaseBuilderIndForm } from "../Forms/Builder/Index.js";

// Import Builder Apartment Forms
import { RentBuilderApartForm, SellBuilderApartForm, LeaseBuilderApartForm } from "../Forms/Builder/Index.js";

// Import Property Management Forms
import { RentPMIndForm, SellPMIndForm, LeasePMIndForm } from "../Forms/PropertyManagement/Index.js";

// Import Property Management Apartment Forms
import { RentPMApartForm, SellPMApartForm, LeasePMApartForm } from "../Forms/PropertyManagement/Index.js";

const Header = ({ onPostPropertyClick }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  
  // State for Role Selection (only for Individual)
  const [showRoleSelectionPopup, setShowRoleSelectionPopup] = useState(false);
  
  // State for Owner forms
  const [showOwnerActionPopup, setShowOwnerActionPopup] = useState(false);
  const [showOwnerRentForm, setShowOwnerRentForm] = useState(false);
  const [showOwnerSellForm, setShowOwnerSellForm] = useState(false);
  const [showOwnerLeaseForm, setShowOwnerLeaseForm] = useState(false);

  // State for Apartment forms (Owner)
  const [showApartActionPopup, setShowApartActionPopup] = useState(false);
  const [showApartRentForm, setShowApartRentForm] = useState(false);
  const [showApartSellForm, setShowApartSellForm] = useState(false);
  const [showApartLeaseForm, setShowApartLeaseForm] = useState(false);

  // State for Agent forms
  const [showAgentActionPopup, setShowAgentActionPopup] = useState(false);
  const [showAgentRentForm, setShowAgentRentForm] = useState(false);
  const [showAgentSellForm, setShowAgentSellForm] = useState(false);
  const [showAgentLeaseForm, setShowAgentLeaseForm] = useState(false);

  // State for Agent Apartment forms
  const [showAgentApartActionPopup, setShowAgentApartActionPopup] = useState(false);
  const [showAgentApartRentForm, setShowAgentApartRentForm] = useState(false);
  const [showAgentApartSellForm, setShowAgentApartSellForm] = useState(false);
  const [showAgentApartLeaseForm, setShowAgentApartLeaseForm] = useState(false);

  // State for Builder forms
  const [showBuilderActionPopup, setShowBuilderActionPopup] = useState(false);
  const [showBuilderRentForm, setShowBuilderRentForm] = useState(false);
  const [showBuilderSellForm, setShowBuilderSellForm] = useState(false);
  const [showBuilderLeaseForm, setShowBuilderLeaseForm] = useState(false);

  // State for Builder Apartment forms
  const [showBuilderApartActionPopup, setShowBuilderApartActionPopup] = useState(false);
  const [showBuilderApartRentForm, setShowBuilderApartRentForm] = useState(false);
  const [showBuilderApartSellForm, setShowBuilderApartSellForm] = useState(false);
  const [showBuilderApartLeaseForm, setShowBuilderApartLeaseForm] = useState(false);

  // State for Property Management forms
  const [showPMActionPopup, setShowPMActionPopup] = useState(false);
  const [showPMRentForm, setShowPMRentForm] = useState(false);
  const [showPMSellForm, setShowPMSellForm] = useState(false);
  const [showPMLeaseForm, setShowPMLeaseForm] = useState(false);

  // State for Property Management Apartment forms
  const [showPMApartActionPopup, setShowPMApartActionPopup] = useState(false);
  const [showPMApartRentForm, setShowPMApartRentForm] = useState(false);
  const [showPMApartSellForm, setShowPMApartSellForm] = useState(false);
  const [showPMApartLeaseForm, setShowPMApartLeaseForm] = useState(false);

  const [selectedRole, setSelectedRole] = useState("");
  const [selectedPropertyType, setSelectedPropertyType] = useState("");

  const [mobileDropdowns, setMobileDropdowns] = useState({
    customer: false,
    post: false,
    loan: false,
    services: false,
    profile: false,
    admin: false,
    customerSub: {},
    postSub: {}
  });
  
  // Refs for dropdown containers
  const dropdownRefs = {
    admin: useRef(null),
    profile: useRef(null),
    customer: useRef(null),
    post: useRef(null),
    loan: useRef(null),
    services: useRef(null)
  };
  
  // Timer refs for hover delay
  const hoverTimerRef = useRef(null);
  
  const navigate = useNavigate();

  const customerPortalMenu = {
    "Individual": ["Rent", "Buy", "Lease", "Sell"],
    "Apartment": ["Rent", "Buy", "Lease", "Sell"],
    "Commercial": ["Rent", "Buy", "Lease", "Sell"],
    "Land & Plots": ["Rent", "Buy", "Lease", "Sell"],
    "Hostel": ["Rent", "Buy", "Lease", "Sell"],
  };

  const postPropertyMenu = {
    "Owner": ["Individual", "Apartment", "Commercial", "Land & Plots", "Hostel"],
    "Agent": ["Individual", "Apartment", "Commercial", "Land & Plots", "Hostel"],
    "Builder": ["Individual", "Apartment", "Commercial", "Land & Plots", "Hostel"],
    "Property Management": ["Individual", "Apartment", "Commercial", "Land & Plots", "Hostel"],
  };

  const loanMenu = [
    "Home Loan",
    "Property Loan",
    "Construction Loan",
    "Plot Loan",
    "Commercial Loan"
  ];

  const servicesMenu = [
    "Construction",
    "Interior",
    "Painting",
    "Plumbing",
    "Cleaning"
  ];

  const profileMenu = [
    { label: "Owner", icon: "👤", path: "/profile/owner" },
    { label: "Agent", icon: "🏢", path: "/profile/agent" },
    { label: "Builder", icon: "🏗️", path: "/profile/builder" },
    { label: "Property Management", icon: "🏢", path: "/profile/property-management" }
  ];

  const adminMenu = [
    { 
      label: "Admin", 
      icon: <Users className="w-4 h-4" />, 
      path: "/admin",
      description: "Admin Panel"
    },
    { 
      label: "Office", 
      icon: <OfficeIcon className="w-4 h-4" />, 
      path: "/office",
      description: "Office Dashboard"
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside all dropdown containers
      const isOutsideAll = Object.values(dropdownRefs).every(ref => 
        ref.current && !ref.current.contains(event.target)
      );
      
      if (isOutsideAll && activeDropdown) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown]);

  // Clean up hover timer
  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

  // Handle profile navigation
  const handleProfileNavigation = (path) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    navigate(path);
  };

  // Handle admin navigation
  const handleAdminNavigation = (path) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    navigate(path);
  };

  // Handle Post Property submenu click
  const handlePostSubmenuClick = (role, propertyType) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    setSelectedRole(role);
    setSelectedPropertyType(propertyType);

    if (propertyType === "Individual" || propertyType === "Apartment") {
      if (role === "Agent") {
        if (propertyType === "Apartment") {
          setShowAgentApartActionPopup(true);
        } else {
          setShowAgentActionPopup(true);
        }
      } else if (role === "Owner") {
        if (propertyType === "Apartment") {
          setShowApartActionPopup(true);
        } else {
          setShowOwnerActionPopup(true);
        }
      } else if (role === "Builder") {
        if (propertyType === "Apartment") {
          setShowBuilderApartActionPopup(true);
        } else {
          setShowBuilderActionPopup(true);
        }
      } else if (role === "Property Management") {
        if (propertyType === "Apartment") {
          setShowPMApartActionPopup(true);
        } else {
          setShowPMActionPopup(true);
        }
      } else {
        setShowRoleSelectionPopup(true);
      }
    } else {
      if (onPostPropertyClick) {
        onPostPropertyClick(role, propertyType);
      }
    }
  };

  const handleRoleSelect = (role) => {
    setShowRoleSelectionPopup(false);
    setSelectedRole(role);
    
    if (role === "Owner") {
      if (selectedPropertyType === "Apartment") {
        setShowApartActionPopup(true);
      } else {
        setShowOwnerActionPopup(true);
      }
    } else if (role === "Agent") {
      if (selectedPropertyType === "Apartment") {
        setShowAgentApartActionPopup(true);
      } else {
        setShowAgentActionPopup(true);
      }
    } else if (role === "Builder") {
      if (selectedPropertyType === "Apartment") {
        setShowBuilderApartActionPopup(true);
      } else {
        setShowBuilderActionPopup(true);
      }
    } else if (role === "Property Management") {
      if (selectedPropertyType === "Apartment") {
        setShowPMApartActionPopup(true);
      } else {
        setShowPMActionPopup(true);
      }
    }
  };

  // Handle Owner action button clicks (Rent, Sell, Lease)
  const handleOwnerActionClick = (action) => {
    setShowOwnerActionPopup(false);
    switch(action) {
      case "Rent":
        setShowOwnerRentForm(true);
        break;
      case "Sell":
        setShowOwnerSellForm(true);
        break;
      case "Lease":
        setShowOwnerLeaseForm(true);
        break;
      default:
        break;
    }
  };

  // Handle Apartment action button clicks (Rent, Sell, Lease)
  const handleApartActionClick = (action) => {
    setShowApartActionPopup(false);
    switch(action) {
      case "Rent":
        setShowApartRentForm(true);
        break;
      case "Sell":
        setShowApartSellForm(true);
        break;
      case "Lease":
        setShowApartLeaseForm(true);
        break;
      default:
        break;
    }
  };

  // Handle Agent action button clicks (Rent, Sell, Lease)
  const handleAgentActionClick = (action) => {
    setShowAgentActionPopup(false);
    switch(action) {
      case "Rent":
        setShowAgentRentForm(true);
        break;
      case "Sell":
        setShowAgentSellForm(true);
        break;
      case "Lease":
        setShowAgentLeaseForm(true);
        break;
      default:
        break;
    }
  };

  // Handle Agent Apartment action button clicks (Rent, Sell, Lease)
  const handleAgentApartActionClick = (action) => {
    setShowAgentApartActionPopup(false);
    switch(action) {
      case "Rent":
        setShowAgentApartRentForm(true);
        break;
      case "Sell":
        setShowAgentApartSellForm(true);
        break;
      case "Lease":
        setShowAgentApartLeaseForm(true);
        break;
      default:
        break;
    }
  };

  // Handle Builder action button clicks (Rent, Sell, Lease)
  const handleBuilderActionClick = (action) => {
    setShowBuilderActionPopup(false);
    switch(action) {
      case "Rent":
        setShowBuilderRentForm(true);
        break;
      case "Sell":
        setShowBuilderSellForm(true);
        break;
      case "Lease":
        setShowBuilderLeaseForm(true);
        break;
      default:
        break;
    }
  };

  // Handle Builder Apartment action button clicks (Rent, Sell, Lease)
  const handleBuilderApartActionClick = (action) => {
    setShowBuilderApartActionPopup(false);
    switch(action) {
      case "Rent":
        setShowBuilderApartRentForm(true);
        break;
      case "Sell":
        setShowBuilderApartSellForm(true);
        break;
      case "Lease":
        setShowBuilderApartLeaseForm(true);
        break;
      default:
        break;
    }
  };

  // Handle Property Management action button clicks (Rent, Sell, Lease)
  const handlePMActionClick = (action) => {
    setShowPMActionPopup(false);
    switch(action) {
      case "Rent":
        setShowPMRentForm(true);
        break;
      case "Sell":
        setShowPMSellForm(true);
        break;
      case "Lease":
        setShowPMLeaseForm(true);
        break;
      default:
        break;
    }
  };

  // Handle Property Management Apartment action button clicks (Rent, Sell, Lease)
  const handlePMApartActionClick = (action) => {
    setShowPMApartActionPopup(false);
    switch(action) {
      case "Rent":
        setShowPMApartRentForm(true);
        break;
      case "Sell":
        setShowPMApartSellForm(true);
        break;
      case "Lease":
        setShowPMApartLeaseForm(true);
        break;
      default:
        break;
    }
  };

  const handleCustomerPortalClick = (type) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    
    const typeKey = type.toLowerCase().replace(/\s+/g, '-');
    
    if (typeKey === "individual") {
      navigate("/individual");
    } else if (typeKey === "rent") {
      navigate("/rent");
    } else if (typeKey === "buy") {
      navigate("/buy");
    } else if (typeKey === "lease") {
      navigate("/lease");
    } else if (typeKey === "sell") {
      navigate("/sell");
    } else if (typeKey === "apartment") {
      navigate("/apartment");
    } else if (typeKey === "commercial") {
      navigate("/commercial");
    } else if (typeKey === "land-&-plots") {
      navigate("/land-plots");
    } else if (typeKey === "hostel") {
      navigate("/hostel");
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (!mobileMenuOpen) {
      setMobileDropdowns({
        customer: false,
        post: false,
        loan: false,
        services: false,
        profile: false,
        admin: false,
        customerSub: {},
        postSub: {}
      });
    }
  };

  const toggleMobileDropdown = (key) => {
    setMobileDropdowns(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleCustomerSub = (key) => {
    setMobileDropdowns(prev => ({
      ...prev,
      customerSub: {
        ...prev.customerSub,
        [key]: !prev.customerSub[key]
      }
    }));
  };

  const togglePostSub = (key) => {
    setMobileDropdowns(prev => ({
      ...prev,
      postSub: {
        ...prev.postSub,
        [key]: !prev.postSub[key]
      }
    }));
  };

  // Dropdown handlers with improved logic
  const handleDropdownToggle = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleDropdownEnter = (dropdown) => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setActiveDropdown(dropdown);
  };

  const handleDropdownLeave = (e, dropdown) => {
    // Check if the mouse is moving to the dropdown content
    const relatedTarget = e.relatedTarget;
    const currentRef = dropdownRefs[dropdown];
    
    if (currentRef && currentRef.current && relatedTarget) {
      if (currentRef.current.contains(relatedTarget)) {
        return;
      }
    }
    
    // Use a small delay to prevent accidental closing
    hoverTimerRef.current = setTimeout(() => {
      setActiveDropdown(null);
      hoverTimerRef.current = null;
    }, 100);
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-gradient-to-r from-[#00695C]/95 via-[#26A69A]/95 to-[#00695C]/95 backdrop-blur-xl shadow-2xl shadow-[#00695C]/20' 
          : 'bg-gradient-to-r from-[#00695C] via-[#26A69A] to-[#00695C]'
      }`}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-float-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                background: 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 70%)',
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${6 + Math.random() * 12}s`,
              }}
            />
          ))}
          
          <div className="absolute bottom-0 left-0 right-0 h-8">
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/5 to-transparent animate-wave-slow" />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />

        <div className="h-[72px] md:h-[84px] w-full px-3 md:px-6 flex items-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-white/[0.03] via-transparent to-white/[0.03] animate-sweep" />
          
          <div className="flex items-center justify-between w-full relative z-10">
            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-1.5 rounded-lg hover:bg-white/20 transition-all duration-300 group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <Menu className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300 relative z-10" />
              </button>

              <div
                onClick={() => navigate("/")}
                className="cursor-pointer group relative"
              >
                <div className="absolute -inset-2 bg-gradient-to-r from-white/10 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="relative w-13 h-13 md:w-[76px] md:h-[76px] rounded-full overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#004D40] to-[#00695C] opacity-80" />
                  <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-[#26A69A]/20 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#00E5FF]/20 via-transparent to-[#00FF88]/20 animate-spin-slow rounded-full" />
                  
                  <img
                    src={logo}
                    alt="Eliteinova Properties Logo"
                    className="w-11 h-11 md:w-[60px] md:h-[60px] object-contain relative z-10 group-hover:scale-110 transition-transform duration-500"
                    style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}
                  />
                </div>
              </div>

              <div 
                onClick={() => navigate("/")} 
                className="cursor-pointer group relative"
              >
                <div className="absolute -inset-2 bg-gradient-to-r from-[#00E5FF]/10 via-transparent to-[#00FF88]/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <h1
                  className="text-lg md:text-2xl lg:text-3xl font-light leading-tight relative tracking-wide"
                  style={{
                    fontFamily: "Pacifico, cursive",
                    color: "#E8F5E9",
                    textShadow: '0 2px 16px rgba(0, 229, 255, 0.2)',
                    fontWeight: 150,
                  }}
                >
                  <span className="relative inline-block group-hover:scale-105 transition-transform duration-500">
                    Eliteinova <span className="text-[0.75em]">Properties</span>
                    <span className="absolute -inset-1 rounded-lg bg-gradient-to-r from-[#00E5FF]/20 via-[#00FF88]/20 to-[#00E5FF]/20 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-700" />
                  </span>
                </h1>
                
                <p 
                  className="text-[11px] md:text-sm lg:text-base font-light leading-tight mt-0 flex items-center gap-2"
                  style={{
                    fontFamily: "Pacifico, cursive",
                    color: "#C8E6C9",
                    fontWeight: 300,
                  }}
                >
                  <span className="relative whitespace-nowrap">
                    No Brokerage
                    <Sparkles className="absolute -right-5 -top-0.5 w-3 h-3 text-yellow-300 animate-sparkle-glow" />
                  </span>
                  <span className="text-[8px] md:text-[10px] bg-gradient-to-r from-[#00FF88]/20 to-[#00E5FF]/20 px-2 py-0.5 rounded-full border border-white/15 backdrop-blur-sm">
                    ⭐ Trusted
                  </span>
                </p>
              </div>
            </div>

            {/* Profile Section - Desktop */}
            <div className="hidden md:flex items-center gap-3">
              {/* Admin Hamburger Dropdown */}
              <div
                ref={dropdownRefs.admin}
                className="relative"
                onMouseEnter={() => handleDropdownEnter("admin")}
                onMouseLeave={(e) => handleDropdownLeave(e, "admin")}
              >
                <button 
                  className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-[#26A69A]/30 backdrop-blur-sm hover:bg-[#26A69A]/50 transition-all duration-300 border border-white/20 hover:border-white/40"
                  onClick={() => handleDropdownToggle("admin")}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center shadow-lg shadow-[#00695C]/30 group-hover:scale-110 transition-transform duration-300">
                    <MenuIcon className="w-4 h-4 text-white" />
                  </div>
                </button>

                {activeDropdown === "admin" && (
                  <div className="absolute top-full right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#00695C]/20 z-50 min-w-[200px] border border-white/30 animate-dropdown overflow-hidden">
                    <div className="p-2">
                      {adminMenu.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => handleAdminNavigation(item.path)}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 transition-all duration-300 group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00695C]/10 to-[#26A69A]/10 flex items-center justify-center text-[#00695C] group-hover:scale-110 transition-transform duration-300">
                            {item.icon}
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="text-sm font-semibold text-gray-800 group-hover:text-[#00695C] transition-colors">
                              {item.label}
                            </span>
                            <span className="text-[10px] text-gray-500">{item.description}</span>
                          </div>
                          <ChevronDown className="w-3.5 h-3.5 ml-auto text-gray-400 group-hover:text-[#00695C] transition-colors -rotate-90" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div
                ref={dropdownRefs.profile}
                className="relative"
                onMouseEnter={() => handleDropdownEnter("profile")}
                onMouseLeave={(e) => handleDropdownLeave(e, "profile")}
              >
                <button 
                  className="group relative flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40"
                  onClick={() => handleDropdownToggle("profile")}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/30">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white font-medium text-sm">Profile</span>
                  <ChevronDown className={`w-4 h-4 text-white transition-transform duration-300 ${activeDropdown === "profile" ? 'rotate-180' : ''}`} />
                </button>

                {activeDropdown === "profile" && (
                  <div className="absolute top-full right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#00695C]/20 z-50 min-w-[220px] border border-white/30 animate-dropdown overflow-hidden">
                    <div className="p-2">
                      {profileMenu.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => handleProfileNavigation(item.path)}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 transition-all duration-300 group"
                        >
                          <span className="text-xl">{item.icon}</span>
                          <span className="text-sm font-semibold text-gray-800 group-hover:text-[#00695C] transition-colors">
                            {item.label}
                          </span>
                          <ChevronDown className="w-3.5 h-3.5 ml-auto text-gray-400 group-hover:text-[#00695C] transition-colors -rotate-90" />
                        </button>
                      ))}
                      
                      <div className="border-t border-gray-200/50 my-1"></div>
                      
                      <button
                        onClick={() => {
                          setActiveDropdown(null);
                          navigate("/logout");
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gradient-to-r from-red-50 to-pink-50 transition-all duration-300 group"
                      >
                        <LogOut className="w-5 h-5 text-red-500" />
                        <span className="text-sm font-semibold text-red-600">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <nav className="hidden md:flex h-12 items-center relative bg-gradient-to-r from-[#004D40]/90 via-[#00796B]/90 to-[#004D40]/90 backdrop-blur-sm border-t border-white/5">
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer-slow" />
          </div>
          
          <div className="flex items-center h-full relative z-10">
            <button
              onClick={() => {
                navigate("/");
                setActiveTab("home");
              }}
              className={`group relative px-5 h-full text-white font-medium text-sm tracking-wide transition-all duration-300 overflow-hidden ${
                activeTab === "home" 
                  ? 'bg-gradient-to-r from-white/10 to-transparent' 
                  : 'hover:bg-white/5'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              
              <span className="flex items-center gap-2 relative z-10">
                <Home className="w-4 h-4" />
                Home
              </span>
              
              {activeTab === "home" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-300 to-amber-400 animate-pulse-glow" />
              )}
            </button>

            <div
              ref={dropdownRefs.customer}
              className="relative h-full"
              onMouseEnter={() => handleDropdownEnter("customer")}
              onMouseLeave={(e) => handleDropdownLeave(e, "customer")}
            >
              <button 
                onClick={() => navigate("/customer-portal")}
                className="group relative px-5 h-full text-white font-medium text-sm tracking-wide hover:bg-white/5 flex items-center gap-2 transition-all duration-300"
              >
                <Building className="w-4 h-4" />
                <span>Customer Portal</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === "customer" ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === "customer" && (
                <div className="absolute top-full left-0 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#00695C]/20 z-50 min-w-[180px] border border-white/30 animate-dropdown">
                  {Object.entries(customerPortalMenu).map(([key, submenu]) => (
                    <div key={key} className="relative group/item">
                      <button 
                        onClick={() => handleCustomerPortalClick(key)}
                        className="w-full px-5 py-2.5 text-left text-sm font-semibold text-gray-800 hover:bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 transition-all duration-300 capitalize"
                      >
                        {key}
                      </button>
                      <div className="absolute left-full top-0 hidden group-hover/item:block bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#00695C]/20 min-w-[160px] z-50 border border-white/30 animate-dropdown-nested">
                        {submenu.map((item) => (
                          <button
                            key={item}
                            onClick={() => handleCustomerPortalClick(item.toLowerCase())}
                            className="w-full px-5 py-2.5 text-left text-sm text-gray-700 hover:bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 transition-all duration-300"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div
              ref={dropdownRefs.post}
              className="relative h-full"
              onMouseEnter={() => handleDropdownEnter("post")}
              onMouseLeave={(e) => handleDropdownLeave(e, "post")}
            >
              <button
                onClick={() => navigate("/post-property")}
                className="group relative px-5 h-full text-white font-medium text-sm tracking-wide hover:bg-white/5 flex items-center gap-2 transition-all duration-300"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Post Property</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === "post" ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === "post" && (
                <div className="absolute top-full left-0 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#00695C]/20 z-50 min-w-[190px] border border-white/30 animate-dropdown">
                  {Object.entries(postPropertyMenu).map(([role, submenu]) => (
                    <div key={role} className="relative group/item">
                      <button
                        className="w-full px-5 py-2.5 text-left text-sm font-semibold text-gray-800 hover:bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 transition-all duration-300 flex items-center justify-between gap-3"
                      >
                        {role}
                        <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-gray-400" />
                      </button>
                      <div className="absolute left-full top-0 hidden group-hover/item:block bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#00695C]/20 min-w-[170px] z-50 border border-white/30 animate-dropdown-nested">
                        {submenu.map((propertyType) => (
                          <button
                            key={propertyType}
                            onClick={() => handlePostSubmenuClick(role, propertyType)}
                            className="w-full px-5 py-2.5 text-left text-sm text-gray-700 hover:bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 transition-all duration-300"
                          >
                            {propertyType}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div
              ref={dropdownRefs.loan}
              className="relative h-full"
              onMouseEnter={() => handleDropdownEnter("loan")}
              onMouseLeave={(e) => handleDropdownLeave(e, "loan")}
            >
              <button className="group relative px-5 h-full text-white font-medium text-sm tracking-wide hover:bg-white/5 flex items-center gap-2 transition-all duration-300">
                <Landmark className="w-4 h-4" />
                <span>Find Loan</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === "loan" ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === "loan" && (
                <div className="absolute top-full left-0 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#00695C]/20 z-50 min-w-[180px] border border-white/30 animate-dropdown">
                  {loanMenu.map((item) => (
                    <button
                      key={item}
                      className="w-full px-5 py-2.5 text-left text-sm font-semibold text-gray-800 hover:bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 transition-all duration-300"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div
              ref={dropdownRefs.services}
              className="relative h-full"
              onMouseEnter={() => handleDropdownEnter("services")}
              onMouseLeave={(e) => handleDropdownLeave(e, "services")}
            >
              <button className="group relative px-5 h-full text-white font-medium text-sm tracking-wide hover:bg-white/5 flex items-center gap-2 transition-all duration-300">
                <Settings className="w-4 h-4" />
                <span>Services</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === "services" ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === "services" && (
                <div className="absolute top-full left-0 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-[#00695C]/20 z-50 min-w-[160px] border border-white/30 animate-dropdown">
                  {servicesMenu.map((item) => (
                    <button
                      key={item}
                      className="w-full px-5 py-2.5 text-left text-sm font-semibold text-gray-800 hover:bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 transition-all duration-300"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div> 
        </nav>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-50 animate-fade"
          onClick={toggleMobileMenu}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#00695C]/95 via-[#26A69A]/95 to-[#00695C]/95 backdrop-blur-xl animate-backdrop" />
          
          <div 
            className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-gradient-to-b from-[#00695C] to-[#26A69A] shadow-2xl shadow-[#00695C]/50 overflow-y-auto animate-slide"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-white/10 backdrop-blur-sm">
                  <Menu className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-sm">Menu</h2>
                  <p className="text-white/50 text-[10px]">Welcome back!</p>
                </div>
              </div>
              <button 
                onClick={toggleMobileMenu} 
                className="p-1.5 rounded-lg hover:bg-white/10 transition-all duration-300 group"
              >
                <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-500" />
              </button>
            </div>
            
            {/* Admin Section in Mobile */}
            <div className="px-4 py-3 border-b border-white/10 animate-slide-item" style={{ animationDelay: '0ms' }}>
              <div 
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => toggleMobileDropdown('admin')}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center shadow-lg shadow-[#00695C]/30">
                  <MenuIcon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">Admin Panel</p>
                  <p className="text-white/60 text-xs">Manage admin & office</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-white transition-transform duration-300 ${mobileDropdowns.admin ? 'rotate-180' : ''}`} />
              </div>
              
              {mobileDropdowns.admin && (
                <div className="mt-2 space-y-1 pl-3">
                  {adminMenu.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        handleAdminNavigation(item.path);
                        toggleMobileMenu();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#00695C]/20 to-[#26A69A]/20 flex items-center justify-center text-[#00695C]">
                        {item.icon}
                      </div>
                      <div className="flex flex-col items-start flex-1">
                        <span className="text-white text-sm font-medium">{item.label}</span>
                        <span className="text-white/50 text-[10px]">{item.description}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Profile Section in Mobile */}
            <div className="px-4 py-3 border-b border-white/10 animate-slide-item" style={{ animationDelay: '50ms' }}>
              <div 
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => toggleMobileDropdown('profile')}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/30">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">Profile</p>
                  <p className="text-white/60 text-xs">Select your role</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-white transition-transform duration-300 ${mobileDropdowns.profile ? 'rotate-180' : ''}`} />
              </div>
              
              {mobileDropdowns.profile && (
                <div className="mt-2 space-y-1 pl-3">
                  {profileMenu.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        handleProfileNavigation(item.path);
                        toggleMobileMenu();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300"
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-white text-sm font-medium">{item.label}</span>
                    </button>
                  ))}
                  
                  <button
                    onClick={() => {
                      navigate("/logout");
                      toggleMobileMenu();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-all duration-300 mt-1"
                  >
                    <LogOut className="w-4 h-4 text-red-400" />
                    <span className="text-red-400 text-sm font-medium">Logout</span>
                  </button>
                </div>
              )}
            </div>
            
            <div className="px-4 pb-32">
              <button 
                onClick={() => {
                  navigate('/');
                  toggleMobileMenu();
                }}
                className="w-full text-left text-white font-medium py-3 border-b border-white/5 text-sm animate-slide-item"
                style={{ animationDelay: '100ms' }}
              >
                🏠 Home
              </button>
              
              <div className="border-b border-white/5 animate-slide-item" style={{ animationDelay: '150ms' }}>
                <div 
                  className="flex items-center justify-between py-3 cursor-pointer"
                  onClick={() => toggleMobileDropdown('customer')}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium text-sm">🏢 Customer Portal</span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-white transition-transform duration-300 ${mobileDropdowns.customer ? 'rotate-180' : ''}`} />
                </div>
                
                {mobileDropdowns.customer && (
                  <div className="pl-4 pb-2 space-y-1">
                    {Object.entries(customerPortalMenu).map(([key, submenu]) => (
                      <div key={key} className="border-l border-white/10 pl-3">
                        <div 
                          className="flex items-center justify-between py-2 cursor-pointer"
                          onClick={() => toggleCustomerSub(key)}
                        >
                          <span className="text-white/90 text-sm capitalize">{key}</span>
                          <ChevronDown className={`w-3 h-3 text-white/70 transition-transform duration-300 ${mobileDropdowns.customerSub[key] ? 'rotate-180' : ''}`} />
                        </div>
                        
                        {mobileDropdowns.customerSub[key] && (
                          <div className="pl-3 pb-1 space-y-1">
                            {submenu.map((item) => (
                              <button 
                                key={item} 
                                onClick={() => {
                                  handleCustomerPortalClick(item.toLowerCase());
                                  toggleMobileMenu();
                                }}
                                className="block text-white/70 text-xs py-1.5 w-full text-left hover:text-white transition-colors"
                              >
                                {item}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="border-b border-white/5 animate-slide-item" style={{ animationDelay: '200ms' }}>
                <div 
                  className="flex items-center justify-between py-3 cursor-pointer"
                  onClick={() => toggleMobileDropdown('post')}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium text-sm">📊 Post Property</span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-white transition-transform duration-300 ${mobileDropdowns.post ? 'rotate-180' : ''}`} />
                </div>
                
                {mobileDropdowns.post && (
                  <div className="pl-4 pb-2 space-y-1">
                    {Object.entries(postPropertyMenu).map(([role, submenu]) => (
                      <div key={role} className="border-l border-white/10 pl-3">
                        <div
                          className="flex items-center justify-between py-2 cursor-pointer"
                          onClick={() => togglePostSub(role)}
                        >
                          <span className="text-white/90 text-sm">{role}</span>
                          <ChevronDown className={`w-3.5 h-3.5 text-white/70 transition-transform duration-300 ${mobileDropdowns.postSub[role] ? 'rotate-180' : ''}`} />
                        </div>

                        {mobileDropdowns.postSub[role] && (
                          <div className="pl-3 pb-1 space-y-1">
                            {submenu.map((propertyType) => (
                              <button
                                key={propertyType}
                                onClick={() => {
                                  handlePostSubmenuClick(role, propertyType);
                                  toggleMobileMenu();
                                }}
                                className="block text-white/70 text-xs py-1.5 w-full text-left hover:text-white transition-colors"
                              >
                                {propertyType}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-b border-white/5 animate-slide-item" style={{ animationDelay: '250ms' }}>
                <div 
                  className="flex items-center justify-between py-3 cursor-pointer"
                  onClick={() => toggleMobileDropdown('loan')}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium text-sm">💰 Find Loan</span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-white transition-transform duration-300 ${mobileDropdowns.loan ? 'rotate-180' : ''}`} />
                </div>
                
                {mobileDropdowns.loan && (
                  <div className="pl-4 pb-2 space-y-1">
                    {loanMenu.map((item) => (
                      <button 
                        key={item} 
                        onClick={() => {
                          toggleMobileMenu();
                        }}
                        className="block text-white/90 text-xs py-2 w-full text-left hover:text-white transition-colors"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="border-b border-white/5 animate-slide-item" style={{ animationDelay: '300ms' }}>
                <div 
                  className="flex items-center justify-between py-3 cursor-pointer"
                  onClick={() => toggleMobileDropdown('services')}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium text-sm">🛠️ Services</span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-white transition-transform duration-300 ${mobileDropdowns.services ? 'rotate-180' : ''}`} />
                </div>
                
                {mobileDropdowns.services && (
                  <div className="pl-4 pb-2 space-y-1">
                    {servicesMenu.map((item) => (
                      <button 
                        key={item} 
                        onClick={() => {
                          toggleMobileMenu();
                        }}
                        className="block text-white/90 text-xs py-2 w-full text-left hover:text-white transition-colors"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Popup Modals and Forms remain the same */}
      {showRoleSelectionPopup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowRoleSelectionPopup(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
                <Building className="w-5 h-5" />
                Select Role
              </h2>
              <button 
                onClick={() => setShowRoleSelectionPopup(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              {selectedRole} → {selectedPropertyType} Property: Who is listing this property?
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleRoleSelect("Owner")}
                className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border-2 border-emerald-200 hover:border-emerald-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">👤</div>
                <div className="font-bold text-emerald-700 group-hover:text-emerald-900">Owner</div>
                <div className="text-[10px] text-gray-500">Individual owner</div>
              </button>

              <button
                onClick={() => handleRoleSelect("Agent")}
                className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">🏢</div>
                <div className="font-bold text-blue-700 group-hover:text-blue-900">Agent</div>
                <div className="text-[10px] text-gray-500">Professional agent</div>
              </button>

              <button
                onClick={() => handleRoleSelect("Builder")}
                className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 hover:border-amber-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">🏗️</div>
                <div className="font-bold text-amber-700 group-hover:text-amber-900">Builder</div>
                <div className="text-[10px] text-gray-500">Builder/Developer</div>
              </button>

              <button
                onClick={() => handleRoleSelect("Property Management")}
                className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">🏢</div>
                <div className="font-bold text-purple-700 group-hover:text-purple-900">Property Management</div>
                <div className="text-[10px] text-gray-500">Property management company</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {showOwnerActionPopup && (
        <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowOwnerActionPopup(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
                <User className="w-5 h-5" />
                Owner - Choose Action
              </h2>
              <button 
                onClick={() => setShowOwnerActionPopup(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              {selectedRole} → Individual Property: How would you like to proceed?
            </p>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleOwnerActionClick("Rent")}
                className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">🏠</div>
                <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
              </button>

              <button
                onClick={() => handleOwnerActionClick("Sell")}
                className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">💰</div>
                <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
              </button>

              <button
                onClick={() => handleOwnerActionClick("Lease")}
                className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">📄</div>
                <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {showApartActionPopup && (
        <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowApartActionPopup(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
                <Building className="w-5 h-5" />
                Apartment - Choose Action
              </h2>
              <button 
                onClick={() => setShowApartActionPopup(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              {selectedRole} → Apartment: How would you like to proceed?
            </p>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleApartActionClick("Rent")}
                className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">🏠</div>
                <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
              </button>

              <button
                onClick={() => handleApartActionClick("Sell")}
                className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">💰</div>
                <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
              </button>

              <button
                onClick={() => handleApartActionClick("Lease")}
                className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">📄</div>
                <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {showAgentActionPopup && (
        <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowAgentActionPopup(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
                <Building className="w-5 h-5" />
                Agent - Choose Action
              </h2>
              <button 
                onClick={() => setShowAgentActionPopup(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              {selectedRole} → Individual Property: How would you like to proceed?
            </p>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleAgentActionClick("Rent")}
                className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">🏠</div>
                <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
              </button>

              <button
                onClick={() => handleAgentActionClick("Sell")}
                className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">💰</div>
                <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
              </button>

              <button
                onClick={() => handleAgentActionClick("Lease")}
                className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">📄</div>
                <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {showAgentApartActionPopup && (
        <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowAgentApartActionPopup(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
                <Building className="w-5 h-5" />
                Agent - Apartment Action
              </h2>
              <button 
                onClick={() => setShowAgentApartActionPopup(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              {selectedRole} → Apartment: How would you like to proceed?
            </p>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleAgentApartActionClick("Rent")}
                className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">🏠</div>
                <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
              </button>

              <button
                onClick={() => handleAgentApartActionClick("Sell")}
                className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">💰</div>
                <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
              </button>

              <button
                onClick={() => handleAgentApartActionClick("Lease")}
                className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">📄</div>
                <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {showBuilderActionPopup && (
        <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowBuilderActionPopup(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
                <Building className="w-5 h-5" />
                Builder - Choose Action
              </h2>
              <button 
                onClick={() => setShowBuilderActionPopup(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              {selectedRole} → Individual Property: How would you like to proceed?
            </p>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleBuilderActionClick("Rent")}
                className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">🏠</div>
                <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
              </button>

              <button
                onClick={() => handleBuilderActionClick("Sell")}
                className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">💰</div>
                <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
              </button>

              <button
                onClick={() => handleBuilderActionClick("Lease")}
                className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">📄</div>
                <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {showBuilderApartActionPopup && (
        <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowBuilderApartActionPopup(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
                <Building className="w-5 h-5" />
                Builder - Apartment Action
              </h2>
              <button 
                onClick={() => setShowBuilderApartActionPopup(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              {selectedRole} → Apartment: How would you like to proceed?
            </p>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleBuilderApartActionClick("Rent")}
                className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">🏠</div>
                <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
              </button>

              <button
                onClick={() => handleBuilderApartActionClick("Sell")}
                className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">💰</div>
                <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
              </button>

              <button
                onClick={() => handleBuilderApartActionClick("Lease")}
                className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">📄</div>
                <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {showPMActionPopup && (
        <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowPMActionPopup(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
                <Building className="w-5 h-5" />
                Property Management - Choose Action
              </h2>
              <button 
                onClick={() => setShowPMActionPopup(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              {selectedRole} → Individual Property: How would you like to proceed?
            </p>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handlePMActionClick("Rent")}
                className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">🏠</div>
                <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
              </button>

              <button
                onClick={() => handlePMActionClick("Sell")}
                className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">💰</div>
                <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
              </button>

              <button
                onClick={() => handlePMActionClick("Lease")}
                className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">📄</div>
                <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {showPMApartActionPopup && (
        <div className="fixed inset-0 z-[61] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade" onClick={() => setShowPMApartActionPopup(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-dropdown" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#00695C] flex items-center gap-2">
                <Building className="w-5 h-5" />
                Property Management - Apartment Action
              </h2>
              <button 
                onClick={() => setShowPMApartActionPopup(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              {selectedRole} → Apartment: How would you like to proceed?
            </p>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handlePMApartActionClick("Rent")}
                className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">🏠</div>
                <div className="font-bold text-blue-700 group-hover:text-blue-900">Rent</div>
              </button>

              <button
                onClick={() => handlePMApartActionClick("Sell")}
                className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">💰</div>
                <div className="font-bold text-purple-700 group-hover:text-purple-900">Sell</div>
              </button>

              <button
                onClick={() => handlePMApartActionClick("Lease")}
                className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:border-orange-500 transition-all duration-300 group"
              >
                <div className="text-2xl mb-1">📄</div>
                <div className="font-bold text-orange-700 group-hover:text-orange-900">Lease</div>
              </button>
            </div>
          </div>
        </div>
      )}

      <IndRentForm isOpen={showOwnerRentForm} onClose={() => setShowOwnerRentForm(false)} />
      <IndSellForm isOpen={showOwnerSellForm} onClose={() => setShowOwnerSellForm(false)} />
      <IndLeaseForm isOpen={showOwnerLeaseForm} onClose={() => setShowOwnerLeaseForm(false)} />

      <ApartRentForm isOpen={showApartRentForm} onClose={() => setShowApartRentForm(false)} />
      <ApartSellForm isOpen={showApartSellForm} onClose={() => setShowApartSellForm(false)} />
      <ApartLeaseForm isOpen={showApartLeaseForm} onClose={() => setShowApartLeaseForm(false)} />

      <RentAgentIndForm isOpen={showAgentRentForm} onClose={() => setShowAgentRentForm(false)} />
      <SellAgentIndForm isOpen={showAgentSellForm} onClose={() => setShowAgentSellForm(false)} />
      <LeaseAgentIndForm isOpen={showAgentLeaseForm} onClose={() => setShowAgentLeaseForm(false)} />

      <RentAgentApartForm isOpen={showAgentApartRentForm} onClose={() => setShowAgentApartRentForm(false)} />
      <SellAgentApartForm isOpen={showAgentApartSellForm} onClose={() => setShowAgentApartSellForm(false)} />
      <LeaseAgentApartForm isOpen={showAgentApartLeaseForm} onClose={() => setShowAgentApartLeaseForm(false)} />

      <RentBuilderIndForm isOpen={showBuilderRentForm} onClose={() => setShowBuilderRentForm(false)} />
      <SellBuilderIndForm isOpen={showBuilderSellForm} onClose={() => setShowBuilderSellForm(false)} />
      <LeaseBuilderIndForm isOpen={showBuilderLeaseForm} onClose={() => setShowBuilderLeaseForm(false)} />

      <RentBuilderApartForm isOpen={showBuilderApartRentForm} onClose={() => setShowBuilderApartRentForm(false)} />
      <SellBuilderApartForm isOpen={showBuilderApartSellForm} onClose={() => setShowBuilderApartSellForm(false)} />
      <LeaseBuilderApartForm isOpen={showBuilderApartLeaseForm} onClose={() => setShowBuilderApartLeaseForm(false)} />

      <RentPMIndForm isOpen={showPMRentForm} onClose={() => setShowPMRentForm(false)} />
      <SellPMIndForm isOpen={showPMSellForm} onClose={() => setShowPMSellForm(false)} />
      <LeasePMIndForm isOpen={showPMLeaseForm} onClose={() => setShowPMLeaseForm(false)} />

      <RentPMApartForm isOpen={showPMApartRentForm} onClose={() => setShowPMApartRentForm(false)} />
      <SellPMApartForm isOpen={showPMApartSellForm} onClose={() => setShowPMApartSellForm(false)} />
      <LeasePMApartForm isOpen={showPMApartLeaseForm} onClose={() => setShowPMApartLeaseForm(false)} />

      <style>{`
        @keyframes float-particle {
          0%, 100% { 
            transform: translateY(0) translateX(0) rotate(0deg); 
            opacity: 0.2;
          }
          25% { 
            transform: translateY(-20px) translateX(15px) rotate(90deg); 
            opacity: 0.5;
          }
          50% { 
            transform: translateY(-12px) translateX(-12px) rotate(180deg); 
            opacity: 0.7;
          }
          75% { 
            transform: translateY(12px) translateX(18px) rotate(270deg); 
            opacity: 0.3;
          }
        }
        .animate-float-particle {
          animation: float-particle 10s ease-in-out infinite;
        }

        @keyframes wave-slow {
          0% { transform: translateX(0) scaleY(1); }
          50% { transform: translateX(40px) scaleY(1.2); }
          100% { transform: translateX(80px) scaleY(1); }
        }
        .animate-wave-slow {
          animation: wave-slow 8s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 3s linear infinite;
        }

        @keyframes shimmer-slow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer-slow {
          animation: shimmer-slow 8s linear infinite;
        }

        @keyframes sweep {
          0%, 100% { 
            background-position: 0% 50%; 
            opacity: 0.3;
          }
          50% { 
            background-position: 100% 50%; 
            opacity: 0.6;
          }
        }
        .animate-sweep {
          background-size: 200% 200%;
          animation: sweep 4s ease infinite;
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 6s linear infinite;
        }

        @keyframes sparkle-glow {
          0%, 100% { 
            opacity: 0.3;
            transform: scale(0.8) rotate(0deg);
          }
          50% { 
            opacity: 1;
            transform: scale(1.2) rotate(180deg);
          }
        }
        .animate-sparkle-glow {
          animation: sparkle-glow 2s ease-in-out infinite;
        }

        @keyframes pulse-ring {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
          }
          50% {
            transform: scale(1.1);
            box-shadow: 0 0 0 4px rgba(239, 68, 68, 0);
          }
        }
        .animate-pulse-ring {
          animation: pulse-ring 1.5s ease-out infinite;
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-pulse-glow {
          animation: pulse-glow 1.5s ease-in-out infinite;
        }

        @keyframes dropdown {
          from {
            opacity: 0;
            transform: translateY(-6px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-dropdown {
          animation: dropdown 0.2s ease-out forwards;
        }

        @keyframes dropdown-nested {
          from {
            opacity: 0;
            transform: translateX(-6px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-dropdown-nested {
          animation: dropdown-nested 0.15s ease-out forwards;
        }

        @keyframes slide-item {
          from {
            opacity: 0;
            transform: translateX(12px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-item {
          animation: slide-item 0.3s ease-out forwards;
        }

        @keyframes fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade {
          animation: fade 0.25s ease-out forwards;
        }

        @keyframes backdrop {
          from {
            backdrop-filter: blur(0);
            opacity: 0;
          }
          to {
            backdrop-filter: blur(10px);
            opacity: 1;
          }
        }
        .animate-backdrop {
          animation: backdrop 0.25s ease-out forwards;
        }

        @keyframes slide {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide {
          animation: slide 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </>
  );
};

export default Header;