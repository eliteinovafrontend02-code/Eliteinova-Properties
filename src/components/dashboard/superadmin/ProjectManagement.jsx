// src/components/dashboard/admin/superadmin/ProjectManagement.jsx

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  FiUsers, FiHome, FiMapPin, FiDollarSign, FiCalendar,
  FiClock, FiUser, FiCheckCircle, FiXCircle, FiSearch,
  FiChevronDown, FiChevronLeft, FiChevronRight, FiEye, FiEdit,
  FiTrash2, FiRefreshCw, FiDownload, FiAlertTriangle,
  FiInfo, FiX, FiList, FiGrid as FiGridIcon, FiActivity,
  FiMail, FiPhone, FiExternalLink, FiTag, FiGrid, FiSave,
  FiUserCheck, FiBriefcase, FiFileText, FiStar, FiShield,
  FiTool, FiTrendingUp, FiUserPlus, FiTarget, FiGlobe,
  FiFilter, FiCheck, FiPlus, FiAward, FiBarChart2, FiMap,
  FiChevronUp, FiCheckSquare, FiPercent, FiPieChart,
  FiArrowUp, FiArrowDown, FiLayers, FiBox, FiClipboard,
  FiPackage, FiCreditCard, FiRotateCcw, FiPlayCircle, FiEdit3,
  FiDatabase, FiFlag, FiSquare, FiKey, FiHash, FiImage, FiGift
} from 'react-icons/fi';
import {
  FaBuilding, FaCheck, FaTimes, FaStar as FaStarSolid,
  FaUserTie, FaHome as FaHomeSolid, FaCity, FaHardHat,
  FaCrown, FaGem, FaRulerCombined, FaWarehouse, FaStore,
  FaHotel, FaTree, FaBuilding as FaBuildingSolid
} from 'react-icons/fa';
import {
  MdOutlineConstruction, MdApartment, MdOutlineBusiness,
  MdOutlineApartment
} from 'react-icons/md';

// ============================================================
// PROJECT CATEGORY CONFIG  (colors match PropertyManagement)
// ============================================================
const PROJECT_CATEGORIES = {
  'Individual': {
    icon: FaHomeSolid,
    color: 'from-blue-600 to-blue-400',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    label: 'Individual',
    description: 'Independent houses, villas and duplex residential units',
    gradient: 'from-blue-600 via-blue-500 to-indigo-400',
    hex: '#3B82F6'
  },
  'Apartment': {
    icon: FaBuildingSolid,
    color: 'from-purple-600 to-purple-400',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    label: 'Apartment',
    description: 'Rental, serviced and luxury apartments across communities',
    gradient: 'from-purple-600 via-purple-500 to-violet-400',
    hex: '#8B5CF6'
  },
  'Commercial': {
    icon: FaStore,
    color: 'from-emerald-600 to-emerald-400',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    label: 'Commercial',
    description: 'Offices, retail shops, showrooms and industrial spaces',
    gradient: 'from-emerald-600 via-emerald-500 to-teal-400',
    hex: '#10B981'
  },
  'Land & Plots': {
    icon: FaTree,
    color: 'from-amber-600 to-amber-400',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    label: 'Land & Plots',
    description: 'Residential, commercial, agricultural and industrial land',
    gradient: 'from-amber-600 via-amber-500 to-orange-400',
    hex: '#F59E0B'
  },
  'Hostel': {
    icon: FaHotel,
    color: 'from-rose-600 to-rose-400',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    label: 'Hostel',
    description: 'Girls, boys, co-living and working professional hostels',
    gradient: 'from-rose-600 via-rose-500 to-pink-400',
    hex: '#EC4899'
  }
};
const ALL_CATEGORIES = Object.keys(PROJECT_CATEGORIES);

// ============================================================
// STATUS CONFIG
// ============================================================
const STATUS_CONFIG = {
  'ongoing': { color: 'bg-blue-500', text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', label: 'Ongoing' },
  'completed': { color: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', label: 'Completed' },
  'upcoming': { color: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Upcoming' },
  'new-launch': { color: 'bg-purple-600', text: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200', label: 'New Launch' },
  'onHold': { color: 'bg-gray-500', text: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-200', label: 'On Hold' },
  'cancelled': { color: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', label: 'Cancelled' }
};

const VERIFICATION_STATUS = {
  'Verified': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Not Verified': { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' }
};

const SUB_CATEGORIES = {
  'Individual': ['Independent House', 'Independent Villa', 'Duplex Residential Unit'],
  'Apartment': ['Rental Apartment', 'Serviced Apartment', 'Lease Apartment', 'Residential Apartment',
    'Gated Community Apartment', 'Studio Apartment', 'Duplex Apartment', 'Luxury Apartment',
    'Condominium Apartment', 'Penthouse Apartment'],
  'Commercial': ['Office Space', 'Retail Shop', 'Showroom', 'Commercial Land/Plot', 'Warehouse / Godown',
    'Industrial Property / Factory', 'Co-Working Space', 'Business Center'],
  'Land & Plots': ['Residential Land / Plots', 'Commercial Land / Plots', 'Agricultural Land / Plots',
    'Industrial Land', 'Institutional Land', 'Investment & Special Purpose Land'],
  'Hostel': ['Girls Hostel', 'Boys Hostel', 'Co-Living Space', 'Working Professional Hostel']
};

const DATE_RANGE_PRESETS = [
  { id: 'today', label: 'Today', icon: FiCalendar, days: 1 },
  { id: 'yesterday', label: 'Yesterday', icon: FiClock, days: 1 },
  { id: 'week', label: 'This Week', icon: FiCalendar, days: 7 },
  { id: 'month', label: 'This Month', icon: FiCalendar, days: 30 },
  { id: 'quarter', label: 'This Quarter', icon: FiBarChart2, days: 90 },
  { id: 'year', label: 'This Year', icon: FiTrendingUp, days: 365 },
  { id: 'all', label: 'All Time', icon: FiDatabase, days: 0 }
];

// ============================================================
// HELPERS
// ============================================================
const UNIQUE_COLORS = [
  '#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899',
  '#06B6D4', '#EF4444', '#84CC16', '#F97316', '#6366F1',
  '#14B8A6', '#A855F7', '#EAB308', '#0EA5E9', '#F43F5E'
];

const seededRandom = (seed) => {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
};
const seedFromString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) % 2147483647;
  return hash || 1;
};

const formatCompact = (amount) => {
  const num = Number(amount || 0);
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
};

const formatDate = (date) => {
  try { return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
  catch { return 'N/A'; }
};

const getDateRangeLabel = (preset, customStart, customEnd) => {
  if (preset === 'custom') return `${formatDate(customStart)} - ${formatDate(customEnd)}`;
  return DATE_RANGE_PRESETS.find(p => p.id === preset)?.label || 'Select Range';
};

const generateTimeSeriesLabels = (datePreset) => {
  switch (datePreset) {
    case 'today':
    case 'yesterday':
      return Array.from({ length: 12 }, (_, i) => `${i * 2}:00`);
    case 'week': return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    case 'month': return ['W1', 'W2', 'W3', 'W4'];
    case 'quarter': return ['Month 1', 'Month 2', 'Month 3'];
    case 'year': return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    case 'custom': return ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8'];
    case 'all':
    default: return ['2020', '2021', '2022', '2023', '2024', '2025'];
  }
};

const generateGrowthSeries = (labels, seed = 1) => {
  const rand = seededRandom(seed);
  let base = Math.floor(rand() * 40) + 30;
  return labels.map((label) => {
    base += Math.floor(rand() * 20) - 5;
    return { label, value: Math.max(base, 15) };
  });
};

// ============================================================
// DATA GENERATOR
// ============================================================
const generateMockProjects = (category, count = 25, dateRange = 'month', customStart, customEnd) => {
  const subcats = SUB_CATEGORIES[category] || ['Standard'];
  const baseNames = ['Green Valley', 'Lake View', 'Sunrise Heights', 'Royal Palm', 'Silver Oak',
    'Golden Meadows', 'Cedar Woods', 'Maple Leaf', 'Orchid Garden', 'Tulip Tower',
    'Lotus Heights', 'Jasmine Villa', 'Emerald Greens', 'Pearl Residency',
    'Ruby Enclave', 'Sapphire Heights', 'Diamond Ridge', 'Platinum Park'];
  const suffixes = ['Residences', 'Apartments', 'Estate', 'Tower', 'Enclave', 'Park', 'Township', 'Heights'];
  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Kolkata', 'Kochi'];
  const states = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Maharashtra', 'Gujarat', 'Rajasthan', 'West Bengal', 'Kerala'];
  const districts = ['Mumbai Suburban', 'New Delhi', 'Bengaluru Urban', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Kolkata', 'Ernakulam'];
  const areas = ['Bandra', 'Connaught Place', 'Koramangala', 'T Nagar', 'Jubilee Hills', 'Koregaon Park', 'Vastrapur', 'Malviya Nagar', 'Salt Lake', 'Kakkanad'];
  const builders = ['Shriram Properties', 'Prestige Group', 'Sobha Ltd', 'Godrej Properties', 'DLF Ltd', 'Brigade Group', 'Lodha Group', 'Puravankara'];
  const priceRanges = ['₹20L - ₹35L', '₹35L - ₹50L', '₹50L - ₹75L', '₹75L - ₹1Cr', '₹1Cr - ₹1.5Cr', '₹1.5Cr - ₹2Cr', '₹2Cr+'];
  const statuses = ['ongoing', 'completed', 'upcoming', 'new-launch', 'onHold'];
  const verificationStatuses = ['Verified', 'Not Verified'];

  let maxDaysBack = 180;
  if (dateRange === 'today' || dateRange === 'yesterday') maxDaysBack = 1;
  else if (dateRange === 'week') maxDaysBack = 7;
  else if (dateRange === 'month') maxDaysBack = 30;
  else if (dateRange === 'quarter') maxDaysBack = 90;
  else if (dateRange === 'year') maxDaysBack = 365;
  else if (dateRange === 'all') maxDaysBack = 730;
  else if (dateRange === 'custom' && customStart) {
    const diffTime = Math.abs(new Date() - customStart);
    maxDaysBack = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  return Array.from({ length: count }, (_, i) => {
    const daysAgo = Math.floor(Math.random() * maxDaysBack);
    const postedDate = new Date();
    postedDate.setDate(postedDate.getDate() - daysAgo);

    const base = baseNames[Math.floor(Math.random() * baseNames.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const cityIdx = Math.floor(Math.random() * cities.length);

    return {
      id: `proj_${category.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${i + 1}_${Date.now()}`,
      projectId: `PRJ-${String(i + 1).padStart(4, '0')}`,
      projectName: `${base} ${suffix} ${i + 1}`,
      category,
      subcategory: subcats[Math.floor(Math.random() * subcats.length)],
      location: areas[cityIdx],
      district: districts[cityIdx],
      city: cities[cityIdx],
      state: states[cityIdx],
      pincode: String(400000 + Math.floor(Math.random() * 99999)),
      builderName: builders[Math.floor(Math.random() * builders.length)],
      priceRange: priceRanges[Math.floor(Math.random() * priceRanges.length)],
      price: Math.floor(Math.random() * 45000000) + 5000000,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      verificationStatus: verificationStatuses[Math.floor(Math.random() * verificationStatuses.length)],
      featured: Math.random() > 0.7,
      totalUnits: Math.floor(Math.random() * 200) + 50,
      availableUnits: 0,
      bookedUnits: 0,
      areaSqft: Math.floor(Math.random() * 3000) + 400,
      pricePerSqft: Math.floor(Math.random() * 8000) + 3000,
      views: Math.floor(Math.random() * 500) + 50,
      inquiries: Math.floor(Math.random() * 40) + 5,
      revenue: Math.floor(Math.random() * 50000000) + 5000000,
      bookings: Math.floor(Math.random() * 80) + 5,
      description: `Premium ${category.toLowerCase()} project with modern amenities and prime location in ${cities[cityIdx]}.`,
      amenities: ['Club House', 'Swimming Pool', 'Gymnasium', "Children's Play Area", 'Landscaped Gardens', 'Security Systems'],
      launchDate: postedDate.toISOString().split('T')[0],
      expectedCompletion: new Date(Date.now() + Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      postedDate: postedDate.toISOString().split('T')[0]
    };
  }).map(p => {
    p.availableUnits = Math.floor(p.totalUnits * (Math.random() * 0.6 + 0.1));
    p.bookedUnits = p.totalUnits - p.availableUnits;
    return p;
  });
};

// ============================================================
// BUILD CATEGORY STATS
// ============================================================
const buildCategoryStats = (category, list, datePreset = 'month') => {
  const growthLabels = generateTimeSeriesLabels(datePreset);
  const growthSeed = seedFromString(`${category}_${datePreset}_growth`);
  const monthlyGrowth = generateGrowthSeries(growthLabels, growthSeed);
  const totalValue = list.reduce((sum, p) => sum + (p.price || 0), 0);

  return {
    total: list.length,
    ongoing: list.filter(p => p.status === 'ongoing').length,
    completed: list.filter(p => p.status === 'completed').length,
    upcoming: list.filter(p => p.status === 'upcoming').length,
    newLaunches: list.filter(p => p.status === 'new-launch').length,
    onHold: list.filter(p => p.status === 'onHold').length,
    cancelled: list.filter(p => p.status === 'cancelled').length,
    featured: list.filter(p => p.featured).length,
    verified: list.filter(p => p.verificationStatus === 'Verified').length,
    notVerified: list.filter(p => p.verificationStatus === 'Not Verified').length,
    totalValue,
    totalUnits: list.reduce((sum, p) => sum + (p.totalUnits || 0), 0),
    availableUnits: list.reduce((sum, p) => sum + (p.availableUnits || 0), 0),
    bookedUnits: list.reduce((sum, p) => sum + (p.bookedUnits || 0), 0),
    totalViews: list.reduce((sum, p) => sum + (p.views || 0), 0),
    totalInquiries: list.reduce((sum, p) => sum + (p.inquiries || 0), 0),
    totalRevenue: list.reduce((sum, p) => sum + (p.revenue || 0), 0),
    avgPrice: list.length > 0 ? Math.floor(totalValue / list.length) : 0,
    statusDistribution: [
      { label: 'Ongoing', value: list.filter(p => p.status === 'ongoing').length, color: '#3B82F6' },
      { label: 'Completed', value: list.filter(p => p.status === 'completed').length, color: '#10B981' },
      { label: 'Upcoming', value: list.filter(p => p.status === 'upcoming').length, color: '#F59E0B' },
      { label: 'New Launch', value: list.filter(p => p.status === 'new-launch').length, color: '#8B5CF6' },
      { label: 'On Hold', value: list.filter(p => p.status === 'onHold').length, color: '#6B7280' },
      { label: 'Cancelled', value: list.filter(p => p.status === 'cancelled').length, color: '#EF4444' }
    ].filter(d => d.value > 0),
    revenueByStatus: [
      { label: 'Ongoing', value: list.filter(p => p.status === 'ongoing').reduce((s, p) => s + (p.revenue || 0), 0), color: '#3B82F6' },
      { label: 'Completed', value: list.filter(p => p.status === 'completed').reduce((s, p) => s + (p.revenue || 0), 0), color: '#10B981' },
      { label: 'Upcoming', value: list.filter(p => p.status === 'upcoming').reduce((s, p) => s + (p.revenue || 0), 0), color: '#F59E0B' },
      { label: 'New Launch', value: list.filter(p => p.status === 'new-launch').reduce((s, p) => s + (p.revenue || 0), 0), color: '#8B5CF6' }
    ].filter(d => d.value > 0),
    monthlyGrowth
  };
};

// ============================================================
// DATE RANGE PICKER
// ============================================================
const DateRangePicker = ({ selected, onSelect, customStart, customEnd, onCustomChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowCustom(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLabel = getDateRangeLabel(selected, customStart, customEnd);
  const CurrentIcon = selected === 'custom' ? FiEdit3 : (DATE_RANGE_PRESETS.find(p => p.id === selected)?.icon || FiCalendar);

  return (
    <div className="relative z-[80]" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 text-sm font-bold hover:scale-105 ${
          isOpen
            ? 'bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white shadow-lg shadow-[#00695C]/30'
            : 'bg-white border border-[#E8F0EE] text-[#0F1A18] hover:border-[#00695C]/30 hover:shadow-md'
        }`}
      >
        <CurrentIcon className={`text-sm ${isOpen ? 'text-white' : 'text-[#00695C]'}`} />
        <span className="hidden sm:inline whitespace-nowrap">{currentLabel}</span>
        <FiChevronDown className={`text-sm transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-[#E8F0EE] py-2 z-[90] animate-dropdown-in">
          <div className="px-3 py-2 border-b border-[#E8F0EE]">
            <p className="text-[10px] font-bold text-[#3D5A55] uppercase tracking-wider">Quick Ranges</p>
          </div>
          <div className="max-h-64 overflow-y-auto py-1">
            {DATE_RANGE_PRESETS.map((preset) => {
              const Icon = preset.icon;
              return (
                <button
                  key={preset.id}
                  onClick={() => { onSelect(preset.id); setIsOpen(false); }}
                  className={`w-full px-4 py-2.5 text-left text-sm transition-all duration-200 flex items-center gap-2 hover:bg-[#F5F9F8] hover:pl-5 ${
                    selected === preset.id ? 'bg-[#E8F4F2] text-[#00695C] font-bold' : 'text-[#0F1A18] font-medium'
                  }`}
                >
                  <Icon className={`text-sm ${selected === preset.id ? 'text-[#00695C]' : 'text-[#5A7D78]'}`} />
                  <span>{preset.label}</span>
                  {selected === preset.id && <FiCheckCircle className="ml-auto text-[#00695C] text-sm" />}
                </button>
              );
            })}
          </div>
          <div className="border-t border-[#E8F0EE] px-3 py-2">
            <button
              onClick={() => setShowCustom(!showCustom)}
              className="w-full flex items-center justify-between text-xs font-bold text-[#00695C] px-2 py-1.5 rounded-lg hover:bg-[#E8F4F2] transition-all"
            >
              <span className="flex items-center gap-2"><FiEdit3 className="text-sm" /> Custom Range</span>
              <FiChevronDown className={`transition-transform duration-300 ${showCustom ? 'rotate-180' : ''}`} />
            </button>
            {showCustom && (
              <div className="mt-2 space-y-2 p-2 bg-[#F5F9F8] rounded-xl">
                <div>
                  <label className="block text-[10px] font-bold text-[#3D5A55] mb-1">From</label>
                  <input
                    type="date"
                    value={customStart ? customStart.toISOString().split('T')[0] : ''}
                    onChange={(e) => onCustomChange(new Date(e.target.value), customEnd)}
                    className="w-full px-2 py-1.5 bg-white rounded-lg border border-[#E8F0EE] focus:border-[#00695C] text-xs text-[#0F1A18] font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#3D5A55] mb-1">To</label>
                  <input
                    type="date"
                    value={customEnd ? customEnd.toISOString().split('T')[0] : ''}
                    onChange={(e) => onCustomChange(customStart, new Date(e.target.value))}
                    className="w-full px-2 py-1.5 bg-white rounded-lg border border-[#E8F0EE] focus:border-[#00695C] text-xs text-[#0F1A18] font-medium outline-none"
                  />
                </div>
                <button
                  onClick={() => { onSelect('custom'); setIsOpen(false); setShowCustom(false); }}
                  disabled={!customStart || !customEnd}
                  className="w-full px-3 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg text-xs font-bold hover:shadow-lg transition-all disabled:opacity-50 hover:scale-105"
                >
                  Apply Custom Range
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// SHARED UI COMPONENTS
// ============================================================
const Toast = ({ toast, setToast }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast, setToast]);

  if (!toast) return null;
  const colors = {
    success: 'bg-gradient-to-r from-emerald-500 to-teal-400',
    error: 'bg-gradient-to-r from-red-500 to-rose-400',
    warning: 'bg-gradient-to-r from-amber-500 to-orange-400',
    info: 'bg-gradient-to-r from-blue-500 to-cyan-400'
  };
  return (
    <div className={`fixed bottom-6 right-6 z-[100] px-6 py-4 rounded-2xl text-white shadow-2xl flex items-center gap-3 animate-toast-in ${colors[toast.type] || colors.success}`}>
      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
        {toast.type === 'success' && <FiCheckCircle className="text-lg" />}
        {toast.type === 'error' && <FiXCircle className="text-lg" />}
        {toast.type === 'warning' && <FiAlertTriangle className="text-lg" />}
        {toast.type === 'info' && <FiInfo className="text-lg" />}
      </div>
      <span className="text-sm font-bold">{toast.message}</span>
      <button onClick={() => setToast(null)} className="ml-2 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30">
        <FiX className="text-xs" />
      </button>
    </div>
  );
};

const ConfirmModal = ({ isOpen, title, message, confirmText, cancelText, type, icon: Icon, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  const theme = {
    danger: { gradient: 'from-red-500 to-rose-400', btn: 'bg-gradient-to-r from-red-500 to-rose-400', ring: 'bg-red-50', iconColor: 'text-red-600' },
    success: { gradient: 'from-emerald-500 to-teal-400', btn: 'bg-gradient-to-r from-emerald-500 to-teal-400', ring: 'bg-emerald-50', iconColor: 'text-emerald-600' },
    warning: { gradient: 'from-amber-500 to-orange-400', btn: 'bg-gradient-to-r from-amber-500 to-orange-400', ring: 'bg-amber-50', iconColor: 'text-amber-600' }
  }[type] || { gradient: 'from-[#00695C] to-[#26A69A]', btn: 'bg-gradient-to-r from-[#00695C] to-[#26A69A]', ring: 'bg-[#E8F4F2]', iconColor: 'text-[#00695C]' };
  const ModalIcon = Icon || FiAlertTriangle;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl animate-slide-up overflow-hidden">
        <div className={`h-1.5 bg-gradient-to-r ${theme.gradient}`} />
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl ${theme.ring} flex items-center justify-center flex-shrink-0`}>
              <ModalIcon className={`text-2xl ${theme.iconColor}`} />
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <h3 className="text-lg font-black text-[#0F1A18] leading-tight">{title}</h3>
              <p className="text-sm text-[#3D5A55] font-medium mt-2 leading-relaxed">{message}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-6">
            <button onClick={onCancel} className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl text-sm font-bold hover:bg-[#E8F0EE] hover:scale-[1.02] transition-all">
              {cancelText || 'Cancel'}
            </button>
            <button onClick={onConfirm} className={`flex-1 px-4 py-2.5 text-white rounded-xl text-sm font-bold shadow-lg hover:scale-[1.02] transition-all ${theme.btn}`}>
              {confirmText || 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, trend, subtitle, color, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white rounded-2xl p-2 shadow-sm hover:shadow-2xl transition-all duration-500 border border-[#E8F0EE] group cursor-pointer relative overflow-hidden animate-card-in"
      style={{ animationDelay: `${delay}ms`, transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)' }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
      <div className="relative flex items-start justify-between mb-3">
        <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all flex-shrink-0`}>
          <div className="animate-icon-float">{icon}</div>
        </div>
        {trend !== undefined && (
          <span className={`text-[10px] font-bold px-2.5 py-1.5 rounded-full flex items-center gap-1 ${trend >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
            {trend >= 0 ? <FiArrowUp className="text-[9px]" /> : <FiArrowDown className="text-[9px]" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-[11px] font-bold text-[#3D5A55] uppercase tracking-wider truncate mb-1">{title}</p>
      <p className="text-2xl font-black text-[#0F1A18] group-hover:text-[#00695C] transition-colors truncate">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      {subtitle && <p className="text-[12px] text-[#4a6c67] mt-1.5 truncate font-medium">{subtitle}</p>}
      <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${color} transition-all duration-500 ${isHovered ? 'w-full' : 'w-0'}`} />
    </div>
  );
};

const DonutChart = ({ data = [], size = 220, thickness = 48, centerLabel = 'TOTAL', centerValue }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  let cumulative = 0;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  const uniqueData = useMemo(() => {
    const usedColors = new Set();
    let paletteIdx = 0;
    return data.map((d) => {
      let color = d.color;
      if (!color || usedColors.has(color)) {
        while (usedColors.has(UNIQUE_COLORS[paletteIdx % UNIQUE_COLORS.length])) paletteIdx++;
        color = UNIQUE_COLORS[paletteIdx % UNIQUE_COLORS.length];
        paletteIdx++;
      }
      usedColors.add(color);
      return { ...d, color };
    });
  }, [data]);

  useEffect(() => {
    const t = setTimeout(() => setAnimationProgress(1), 100);
    return () => clearTimeout(t);
  }, []);

  if (!Array.isArray(uniqueData) || uniqueData.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center bg-[#F5F9F8] rounded-xl border border-dashed border-[#B5C9C5]" style={{ height: size }}>
        <FiPieChart className="text-2xl text-[#8FA8A4] mb-2" />
        <p className="text-xs font-bold text-[#3D5A55]">No data</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#EEF4F2" strokeWidth={thickness} />
          {uniqueData.map((d, i) => {
            const segmentLength = (d.value / total) * circumference;
            const offset = cumulative;
            cumulative += segmentLength;
            const isHovered = hoveredIndex === i;
            return (
              <circle key={i} cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={d.color}
                strokeWidth={isHovered ? thickness + 10 : thickness}
                strokeDasharray={`${segmentLength * animationProgress} ${circumference - segmentLength * animationProgress}`}
                strokeDashoffset={-offset} strokeLinecap="butt"
                className="transition-all duration-500 cursor-pointer"
                style={{ filter: isHovered ? `drop-shadow(0 0 12px ${d.color})` : 'none', opacity: hoveredIndex !== null && !isHovered ? 0.35 : 1 }}
                onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}
        </svg>
        {centerValue !== undefined && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-[10px] font-bold text-[#3D5A55] uppercase tracking-[0.15em] mb-1">{centerLabel}</p>
            <p className="text-[26px] font-black text-[#0F1A18] leading-none">{centerValue}</p>
            {hoveredIndex !== null ? (
              <div className="mt-2 flex flex-col items-center">
                <span className="text-[13px] font-black px-2 py-0.5 rounded-md" style={{ color: '#fff', backgroundColor: uniqueData[hoveredIndex].color }}>
                  {((uniqueData[hoveredIndex].value / total) * 100).toFixed(1)}%
                </span>
                <span className="text-[10px] font-bold text-[#1A2E2A] mt-1 truncate max-w-[120px]">{uniqueData[hoveredIndex].label}</span>
              </div>
            ) : (
              <p className="text-[10px] font-bold text-[#3D5A55] mt-1">{uniqueData.length} categories</p>
            )}
          </div>
        )}
      </div>
      <div className="mt-5 space-y-2 w-full max-h-[280px] overflow-y-auto pr-1">
        {uniqueData.map((d, i) => {
          const pct = ((d.value / total) * 100).toFixed(1);
          const isHovered = hoveredIndex === i;
          return (
            <div key={i} className={`flex items-center justify-between text-xs p-2.5 rounded-xl transition-all cursor-pointer border ${isHovered ? 'bg-white shadow-md border-transparent' : 'border-transparent hover:bg-[#F5F9F8]'}`}
              style={{ borderLeftWidth: '4px', borderLeftColor: d.color }}
              onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}>
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                <span className="font-bold truncate text-[#1A2E2A]">{d.label}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ color: '#fff', backgroundColor: d.color }}>{pct}%</span>
                <span className="text-xs font-black text-[#0F1A18] min-w-[40px] text-right">{d.value.toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const BarChart = ({ data = [], height = 260 }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const max = Math.max(...data.map(d => d.value), 1);
  const barAreaHeight = height - 55;

  useEffect(() => {
    const t = setTimeout(() => setAnimationProgress(1), 100);
    return () => clearTimeout(t);
  }, []);

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center bg-[#F5F9F8] rounded-xl border border-dashed border-[#B5C9C5]" style={{ height }}>
        <FiBarChart2 className="text-2xl text-[#8FA8A4] mb-2" />
        <p className="text-xs font-bold text-[#3D5A55]">No data</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-end justify-between gap-2 w-full" style={{ height: barAreaHeight }}>
        {data.map((d, i) => {
          const barHeight = Math.max((d.value / max) * barAreaHeight * animationProgress, 8);
          const isHovered = hoveredIndex === i;
          return (
            <div key={i} className="flex-1 flex flex-col items-center justify-end group relative cursor-pointer" style={{ height: '100%' }}
              onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}>
              {isHovered && (
                <div className="absolute -top-12 z-20 pointer-events-none">
                  <div className="bg-[#0F1A18] text-white text-[11px] font-black px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl">
                    <div className="text-[9px] font-bold text-white/70 mb-0.5">{d.label}</div>
                    {formatCompact(d.value)}
                  </div>
                </div>
              )}
              <div className={`text-[9px] font-black px-1.5 py-0.5 rounded-md mb-1 ${isHovered ? 'opacity-100' : 'opacity-60'}`}
                style={{ color: d.color, backgroundColor: `${d.color}15` }}>
                {formatCompact(d.value)}
              </div>
              <div className="w-full rounded-t-lg transition-all duration-300"
                style={{
                  height: `${barHeight}px`,
                  background: `linear-gradient(180deg, ${d.color} 0%, ${d.color}80 100%)`,
                  transform: isHovered ? 'scaleX(1.08)' : 'scaleX(1)',
                  opacity: hoveredIndex !== null && !isHovered ? 0.4 : 1
                }} />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-3 gap-2 pt-2 border-t border-[#F1F5F4]">
        {data.map((d, i) => (
          <div key={i} className="flex-1 text-center min-w-0">
            <span className={`text-[10px] font-black truncate block ${hoveredIndex === i ? 'text-[#00695C]' : 'text-[#3D5A55]'}`}>{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AreaChart = ({ data = [], height = 260, color = '#00695C' }) => {
  const [animationProgress, setAnimationProgress] = useState(0);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setAnimationProgress(1), 100);
    return () => clearTimeout(t);
  }, []);

  if (!Array.isArray(data) || data.length < 2) {
    return (
      <div className="w-full flex flex-col items-center justify-center bg-[#F5F9F8] rounded-xl border border-dashed border-[#B5C9C5]" style={{ height }}>
        <FiBarChart2 className="text-2xl text-[#8FA8A4] mb-2" />
        <p className="text-xs font-bold text-[#3D5A55]">Not enough data</p>
      </div>
    );
  }

  const max = Math.max(...data.map(d => d.value), 1);
  const min = Math.min(...data.map(d => d.value), 0);
  const range = max - min || 1;
  const chartHeight = height - 40;
  const chartWidth = 1000;
  const stepX = chartWidth / Math.max(data.length - 1, 1);

  const points = data.map((d, i) => ({ x: i * stepX, y: 20 + (1 - (d.value - min) / range) * chartHeight * animationProgress }));
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = linePath ? `${linePath} L ${chartWidth} ${height} L 0 ${height} Z` : '';
  const gradId = `area-${color.replace('#', '')}`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${chartWidth} ${height}`} style={{ width: '100%', height }} className="overflow-visible">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.45" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((r, i) => (
          <line key={i} x1="0" y1={20 + (1 - r) * chartHeight} x2={chartWidth} y2={20 + (1 - r) * chartHeight} stroke="#EEF4F2" strokeWidth="1" strokeDasharray="4 6" />
        ))}
        {areaPath && <path d={areaPath} fill={`url(#${gradId})`} />}
        {linePath && <path d={linePath} fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />}
        {points.map((p, i) => (
          <g key={i} onMouseEnter={() => setHoveredPoint(i)} onMouseLeave={() => setHoveredPoint(null)} className="cursor-pointer">
            <circle cx={p.x} cy={p.y} r={hoveredPoint === i ? 9 : 6} fill="white" stroke={color} strokeWidth="3" className="transition-all" />
            <circle cx={p.x} cy={p.y} r="3" fill={color} />
            {hoveredPoint === i && (
              <g>
                <rect x={p.x - 55} y={p.y - 55} width="110" height="42" rx="8" fill="#0F1A18" />
                <text x={p.x} y={p.y - 38} textAnchor="middle" fill="#D9E6E3" fontSize="9" fontWeight="700">{data[i].label}</text>
                <text x={p.x} y={p.y - 22} textAnchor="middle" fill="#fff" fontSize="14" fontWeight="900">{formatCompact(data[i].value)}</text>
              </g>
            )}
          </g>
        ))}
      </svg>
      <div className="flex justify-between mt-3">
        {data.map((d, i) => (
          <span key={i} className={`text-[10px] font-black flex-1 text-center truncate ${hoveredPoint === i ? 'text-[#00695C]' : 'text-[#3D5A55]'}`}>{d.label}</span>
        ))}
      </div>
    </div>
  );
};

const ProgressBar = ({ label, value, max, color, icon: Icon, delay = 0 }) => {
  const [animationProgress, setAnimationProgress] = useState(0);
  const pct = max > 0 ? (value / max) * 100 : 0;

  useEffect(() => {
    const t = setTimeout(() => setAnimationProgress(1), 100 + delay);
    return () => clearTimeout(t);
  }, [delay]);

  const animatedPct = Math.min(pct * animationProgress, 100);

  return (
    <div className="space-y-2 p-3 rounded-xl border border-transparent hover:bg-[#F5F9F8] transition-all">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {Icon && (
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}20` }}>
              <Icon className="text-sm" style={{ color }} />
            </div>
          )}
          <span className="text-xs font-bold truncate text-[#1A2E2A]">{label}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[11px] font-black text-[#0F1A18]">{value.toLocaleString()}</span>
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: color }}>{pct.toFixed(1)}%</span>
        </div>
      </div>
      <div className="h-3.5 bg-[#EEF4F2] rounded-full overflow-hidden relative">
        <div className="h-full rounded-full transition-all duration-1000 relative overflow-hidden" style={{ width: `${animatedPct}%`, background: `linear-gradient(90deg, ${color}, ${color}DD)` }}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['ongoing'];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[9px] ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.color}`} /> {cfg.label}
    </span>
  );
};

const VerificationBadge = ({ status }) => {
  const isVerified = status === 'Verified';
  const v = VERIFICATION_STATUS[status] || VERIFICATION_STATUS['Not Verified'];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[9px] border ${v.bg} ${v.text} ${v.border}`}>
      {isVerified ? <FiCheckCircle className="text-[8px]" /> : <FiXCircle className="text-[8px]" />}
      {status}
    </span>
  );
};

// ============================================================
// FILTER DROPDOWN
// ============================================================
const FilterDropdown = ({ id, label, icon: Icon, value, options, onChange, isOpen, setOpenDropdown }) => {
  const isActive = value !== 'All';
  const open = isOpen === id;
  return (
    <div className="relative">
      <button
        type="button"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => { e.stopPropagation(); setOpenDropdown(open ? null : id); }}
        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
          isActive || open
            ? 'bg-[#E8F4F2] text-[#00695C] border border-[#B5C9C5]'
            : 'bg-white text-[#0F1A18] border border-[#E8F0EE] hover:border-[#00695C]/30'
        }`}
      >
        <Icon className="text-sm" />
        <span>
          <span className="text-[#5A7D78] font-semibold">{label}: </span>
          <span className="text-[#00695C] font-bold">{value}</span>
        </span>
        <FiChevronDown className={`text-xs transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className="absolute top-full left-0 mt-2 min-w-[180px] w-max max-w-[260px] bg-white rounded-2xl shadow-2xl border border-[#E8F0EE] py-2 z-[120] animate-dropdown-in max-h-72 overflow-y-auto"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 py-1.5 border-b border-[#E8F0EE]">
            <p className="text-[10px] font-bold text-[#3D5A55] uppercase tracking-wider">{label}</p>
          </div>
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(opt); setOpenDropdown(null); }}
              className={`w-full px-4 py-2 text-left text-xs transition-all flex items-center justify-between gap-3 hover:bg-[#F5F9F8] ${
                value === opt ? 'bg-[#E8F4F2] text-[#00695C] font-bold' : 'text-[#0F1A18] font-medium'
              }`}
            >
              <span className="whitespace-nowrap">{opt}</span>
              {value === opt && <FiCheck className="text-[#00695C] text-sm flex-shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================
// OVERVIEW TAB
// ============================================================
const CategoryOverviewTab = ({ activeCategory, stats, config, dateRangeLabel, datePreset }) => {
  const growthTitle = {
    today: 'Hourly Growth', yesterday: 'Hourly Growth', week: 'Daily Growth',
    month: 'Weekly Growth', quarter: 'Monthly Growth', year: 'Monthly Growth',
    all: 'Yearly Growth', custom: 'Period Growth'
  }[datePreset] || 'Growth Trend';

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#E8F4F2] to-[#D5F0EA] rounded-2xl p-3 border border-[#C5EDE5] flex items-center gap-2">
        <FiCalendar className="text-[#00695C] text-sm" />
        <span className="text-xs font-bold text-[#00695C]">Showing data for: {dateRangeLabel}</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<FiHome className="text-white text-base" />} title={`Total ${activeCategory} Projects`} value={stats.total || 0} trend={12.5} subtitle="All projects" color={`bg-gradient-to-br ${config.gradient}`} delay={0} />
        <StatCard icon={<FiPlayCircle className="text-white text-base" />} title="Ongoing" value={stats.ongoing || 0} trend={8.3} subtitle="Under construction" color="bg-gradient-to-br from-blue-600 to-cyan-400" delay={100} />
        <StatCard icon={<FiCheckCircle className="text-white text-base" />} title="Completed" value={stats.completed || 0} trend={15.2} subtitle="Handed over" color="bg-gradient-to-br from-emerald-600 to-teal-400" delay={200} />
        <StatCard icon={<FiDollarSign className="text-white text-base" />} title="Total Value" value={formatCompact(stats.totalValue || 0)} trend={10.5} subtitle="Combined price" color="bg-gradient-to-br from-purple-600 to-violet-400" delay={300} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm">
          <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
            <FiActivity className="text-[#00695C]" /> Status Distribution
          </h3>
          <DonutChart data={stats.statusDistribution || []} size={240} thickness={52} centerLabel="Total" centerValue={stats.total || 0} />
        </div>
        <div className="bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm">
          <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
            <FiDollarSign className="text-[#00695C]" /> Revenue by Status
          </h3>
          <BarChart data={stats.revenueByStatus || []} height={280} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="text-lg font-black text-[#0F1A18] flex items-center gap-2">
              <FiTrendingUp className="text-[#00695C]" /> {growthTitle}
            </h3>
            <span className="px-3 py-1 bg-[#E8F4F2] text-[#00695C] text-[10px] font-black rounded-full flex items-center gap-1">
              <FiCalendar className="text-[10px]" /> {dateRangeLabel}
            </span>
          </div>
          <AreaChart data={stats.monthlyGrowth || []} height={280} color={config.hex} />
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm">
          <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
            <FiPercent className="text-[#00695C]" /> Status-wise Distribution
          </h3>
          <div className="space-y-3">
            {(stats.statusDistribution || []).map((item, i) => (
              <ProgressBar key={i} label={item.label} value={item.value} max={stats.total || 1} color={item.color}
                icon={FiLayers} delay={i * 100} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// VIEW PROJECT DETAIL MODAL
// ============================================================
const ViewProjectDetailModal = ({ project, show, onClose, onDelete }) => {
  if (!project || !show) return null;

  const categoryConfig = PROJECT_CATEGORIES[project.category] || PROJECT_CATEGORIES['Individual'];
  const CategoryIcon = categoryConfig.icon;
  const statusConfig = STATUS_CONFIG[project.status] || STATUS_CONFIG['ongoing'];
  const isVerified = project.verificationStatus === 'Verified';

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 rounded-t-3xl z-10 shrink-0">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white">
            <FiX className="text-lg" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-14 h-14 rounded-2xl ${categoryConfig.bg} border-2 border-white/30 flex items-center justify-center text-2xl ${categoryConfig.text} shadow-lg`}>
              <CategoryIcon />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white truncate">{project.projectName}</h2>
              <p className="text-white/80 text-sm flex items-center gap-2 flex-wrap">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryConfig.bg} ${categoryConfig.text} border ${categoryConfig.border}`}>
                  {categoryConfig.label}
                </span>
                <span>ID: {project.projectId}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
              {statusConfig.label}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border ${isVerified ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>
              {isVerified ? <FiCheckCircle className="text-xs" /> : <FiXCircle className="text-xs" />}
              {isVerified ? 'Verified' : 'Not Verified'}
            </span>
            {project.featured && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200">
                <FiStar className="text-xs" /> Featured
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: <FiHash />, label: 'Project ID', value: project.projectId },
              { icon: <FaHomeSolid />, label: 'Project Name', value: project.projectName },
              { icon: <FiTag />, label: 'Category', value: project.category },
              { icon: <FiBriefcase />, label: 'Subcategory', value: project.subcategory },
              { icon: <FiMapPin />, label: 'Location', value: project.location },
              { icon: <FaCity />, label: 'District', value: project.district },
              { icon: <FaCity />, label: 'City', value: project.city },
              { icon: <FiMap />, label: 'State', value: project.state },
              { icon: <FiDollarSign />, label: 'Price Range', value: project.priceRange },
              { icon: <FiLayers />, label: 'Total Units', value: project.totalUnits },
              { icon: <FiCheckSquare />, label: 'Available Units', value: project.availableUnits },
              { icon: <FiSquare />, label: 'Booked Units', value: project.bookedUnits },
              { icon: <FaRulerCombined />, label: 'Area', value: `${project.areaSqft} sq ft` },
              { icon: <FiCalendar />, label: 'Launch Date', value: formatDate(project.launchDate) },
              { icon: <FiCalendar />, label: 'Expected Completion', value: formatDate(project.expectedCompletion) }
            ].map((item, i) => (
              <div key={i} className="bg-[#F5F9F8] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[#00695C] text-sm">{item.icon}</span>
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">{item.label}</h4>
                </div>
                <p className="text-sm font-bold text-[#1A2E2A] truncate">{item.value}</p>
              </div>
            ))}

            <div className="bg-[#F5F9F8] rounded-2xl p-4 md:col-span-2">
              <div className="flex items-center gap-2 mb-1">
                <FaUserTie className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Builder / Developer</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{project.builderName}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4 md:col-span-2">
              <div className="flex items-center gap-2 mb-1">
                <FiFileText className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Description</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{project.description || 'No description available'}</p>
            </div>

            {project.amenities && project.amenities.length > 0 && (
              <div className="bg-[#F5F9F8] rounded-2xl p-4 md:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <FiLayers className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Amenities</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.amenities.map((item, i) => (
                    <span key={i} className="px-3 py-1 bg-white rounded-lg text-xs text-[#1A2E2A] font-semibold border border-[#E8F0EE]">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 px-6 py-4 bg-white border-t border-[#E8F0EE] rounded-b-3xl shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] text-sm font-medium">
              Close
            </button>
            <button onClick={() => { if (onDelete) { onDelete(project.id); } }} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 text-sm font-medium shadow-lg">
              <FiTrash2 className="inline mr-2" /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// CATEGORY MANAGE TAB
// ============================================================
const CategoryManageTab = ({
  activeCategory, projects, onView, onDelete,
  actionLoading, searchQuery, setSearchQuery,
  viewMode, setViewMode, dateRangeLabel
}) => {
  const [statusFilter, setStatusFilter] = useState('All');
  const [projectTypeFilter, setProjectTypeFilter] = useState('All');
  const [openDropdown, setOpenDropdown] = useState(null);
  const filterBarRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (filterBarRef.current && !filterBarRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    setStatusFilter('All');
    setProjectTypeFilter('All');
    setOpenDropdown(null);
  }, [activeCategory]);

  const statusOptions = ['All', ...Object.values(STATUS_CONFIG).map(s => s.label)];
  const projectTypeOptions = ['All', ...(SUB_CATEGORIES[activeCategory] || [])];

  const filtered = useMemo(() => {
    let result = [...projects];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        (p.projectName && p.projectName.toLowerCase().includes(q)) ||
        (p.projectId && p.projectId.toLowerCase().includes(q)) ||
        (p.subcategory && p.subcategory.toLowerCase().includes(q)) ||
        (p.city && p.city.toLowerCase().includes(q)) ||
        (p.builderName && p.builderName.toLowerCase().includes(q))
      );
    }
    if (statusFilter !== 'All') {
      const matchKey = Object.keys(STATUS_CONFIG).find(k => STATUS_CONFIG[k].label === statusFilter);
      if (matchKey) result = result.filter(p => p.status === matchKey);
    }
    if (projectTypeFilter !== 'All') result = result.filter(p => p.subcategory === projectTypeFilter);
    return result;
  }, [projects, searchQuery, statusFilter, projectTypeFilter]);

  const hasActiveFilter = statusFilter !== 'All' || projectTypeFilter !== 'All';

  const clearFilters = () => {
    setStatusFilter('All');
    setProjectTypeFilter('All');
  };

  const config = PROJECT_CATEGORIES[activeCategory];

  return (
    <div className="space-y-4">
      <div ref={filterBarRef} className="relative z-[100] bg-white rounded-2xl p-4 border border-[#E8F0EE] shadow-sm">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          <div className="flex-1 relative min-w-0">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A7D78] text-sm pointer-events-none" />
            <input
              type="text"
              placeholder={`Search by project ID, name, subcategory, city, builder...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:bg-white text-sm text-[#0F1A18] placeholder:text-[#8FA8A4] outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <FilterDropdown
              id="status"
              label="Status"
              icon={FiActivity}
              value={statusFilter}
              options={statusOptions}
              onChange={setStatusFilter}
              isOpen={openDropdown}
              setOpenDropdown={setOpenDropdown}
            />
            <FilterDropdown
              id="projectType"
              label="Project Type"
              icon={FiTag}
              value={projectTypeFilter}
              options={projectTypeOptions}
              onChange={setProjectTypeFilter}
              isOpen={openDropdown}
              setOpenDropdown={setOpenDropdown}
            />

            {hasActiveFilter && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-all"
              >
                <FiX className="text-sm" /> Clear
              </button>
            )}
          </div>

          <div className="flex items-center bg-[#F5F9F8] rounded-xl p-1 border border-[#E8F0EE] lg:ml-auto">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#00695C]' : 'text-[#3D5A55]'}`}
              title="Grid View"
            >
              <FiGridIcon className="text-sm" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-white shadow-sm text-[#00695C]' : 'text-[#3D5A55]'}`}
              title="List View"
            >
              <FiList className="text-sm" />
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-[10px] text-[#3D5A55] font-semibold">
            <FiCalendar className="text-[#00695C]" /> Showing projects from: {dateRangeLabel}
          </div>
          <span className="px-3 py-1.5 bg-[#E8F4F2] text-[#00695C] text-xs font-black rounded-xl">
            {filtered.length} {filtered.length === 1 ? 'project' : 'projects'}
          </span>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {filtered.map((project, index) => (
            <ProjectGridCard
              key={project.id}
              project={project}
              config={config}
              index={index}
              onView={onView}
              onDelete={onDelete}
              actionLoading={actionLoading}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((project, index) => (
            <ProjectListCard
              key={project.id}
              project={project}
              config={config}
              index={index}
              onView={onView}
              onDelete={onDelete}
              actionLoading={actionLoading}
            />
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E8F0EE]">
          <div className="w-24 h-24 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4 animate-float">
            <MdOutlineConstruction className="text-4xl text-[#8FA8A4]" />
          </div>
          <h3 className="text-xl font-black text-[#0F1A18]">No projects found</h3>
          <p className="text-sm text-[#3D5A55] mt-1 font-medium">Try adjusting your search or filters</p>
          {hasActiveFilter && (
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white text-xs font-bold rounded-xl hover:scale-105 transition-all"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================
// GRID CARD  — Units | Available | Sqft
// ============================================================
const ProjectGridCard = ({ project, config, index, onView, onDelete, actionLoading }) => {
  const CategoryIcon = config.icon;
  const statusConfig = STATUS_CONFIG[project.status] || STATUS_CONFIG['ongoing'];
  const isVerified = project.verificationStatus === 'Verified';

  return (
    <div
      className="bg-white rounded-2xl border border-[#E8F0EE] p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 animate-card-in flex flex-col"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${config.color} flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
          <CategoryIcon className="text-lg" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-[#0F1A18] text-sm leading-tight line-clamp-2" title={project.projectName}>
            {project.projectName}
          </h4>
          <p className="text-[10px] text-[#5A7D78] font-bold mt-0.5 truncate">{project.projectId}</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mb-3 flex-wrap">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[9px] ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.color}`} /> {statusConfig.label}
        </span>
        {isVerified ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[9px] border bg-emerald-50 text-emerald-700 border-emerald-200">
            <FiCheckCircle className="text-[8px]" /> Verified
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[9px] border bg-gray-50 text-gray-700 border-gray-200">
            <FiXCircle className="text-[8px]" /> Not Verified
          </span>
        )}
        {project.featured && (
          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full font-bold text-[9px] bg-amber-100 text-amber-700">
            <FiStar className="text-[8px]" /> Featured
          </span>
        )}
      </div>

      <div className="space-y-1.5 text-[11px] text-[#3D5A55] flex-1">
        <div className="flex items-center gap-2"><FiTag className="flex-shrink-0" /> <span className="truncate">{project.subcategory}</span></div>
        <div className="flex items-center gap-2"><FiMapPin className="flex-shrink-0" /> <span className="truncate">{project.location}, {project.city}</span></div>
        <div className="flex items-center gap-2"><FiDollarSign className="flex-shrink-0" /> <span className="font-semibold text-[#1A2E2A]">{project.priceRange}</span></div>
        <div className="flex items-center gap-2"><FaHardHat className="flex-shrink-0" /> <span className="truncate">{project.builderName}</span></div>
        <div className="flex items-center gap-2"><FiCalendar className="flex-shrink-0" /> <span>Completion: {formatDate(project.expectedCompletion)}</span></div>
      </div>

      {/* Units | Available | Sqft */}
      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#E8F0EE]">
        <div className="text-center">
          <p className="text-sm font-black text-[#0F1A18]">{project.totalUnits}</p>
          <p className="text-[8px] text-[#3D5A55] uppercase tracking-wider font-bold">Units</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-black text-[#00695C]">{project.availableUnits}</p>
          <p className="text-[8px] text-[#3D5A55] uppercase tracking-wider font-bold">Available</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-black" style={{ color: config.hex }}>{project.areaSqft}</p>
          <p className="text-[8px] text-[#3D5A55] uppercase tracking-wider font-bold">Sqft</p>
        </div>
      </div>

      <div className="flex gap-2 mt-3 pt-3 border-t border-[#E8F0EE]">
        <button
          onClick={() => onView(project)}
          className="flex-1 py-2 text-xs font-bold text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] flex items-center justify-center gap-1.5 transition-all"
        >
          <FiEye className="text-xs" /> View
        </button>
        <button
          onClick={() => onDelete(project.id)}
          disabled={actionLoading === project.id}
          className="flex-1 py-2 text-xs font-bold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 flex items-center justify-center gap-1.5 disabled:opacity-50 transition-all"
        >
          {actionLoading === project.id
            ? <FiRefreshCw className="text-xs animate-spin" />
            : <FiTrash2 className="text-xs" />}
          Delete
        </button>
      </div>
    </div>
  );
};

// ============================================================
// LIST CARD  — Units | Available | Sqft
// ============================================================
const ProjectListCard = ({ project, config, index, onView, onDelete, actionLoading }) => {
  const CategoryIcon = config.icon;

  return (
    <div
      className="bg-white rounded-2xl border border-[#94e9d4] hover:shadow-lg transition-all duration-300 animate-card-in overflow-hidden"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-[#E8F0EE]">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center text-white shadow-md flex-shrink-0`}>
            <CategoryIcon className="text-base" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-[15px] text-[#0F1A18] truncate">{project.projectName}</h4>
              <StatusBadge status={project.status} />
              <VerificationBadge status={project.verificationStatus} />
              {project.featured && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-700">★ Featured</span>
              )}
            </div>
            <p className="text-[12px] text-[#3D5A55] font-medium mt-0.5 truncate">
              {project.projectId} • {project.subcategory}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => onView(project)}
            className="px-4 py-2 text-xs font-bold text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] flex items-center gap-1.5"
          >
            <FiEye className="text-sm" /> View
          </button>
          <button
            onClick={() => onDelete(project.id)}
            disabled={actionLoading === project.id}
            className="px-4 py-2 text-xs font-bold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 flex items-center gap-1.5 disabled:opacity-50"
          >
            {actionLoading === project.id
              ? <FiRefreshCw className="text-sm animate-spin" />
              : <FiTrash2 className="text-sm" />}
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-5 py-4">
        <div className="min-w-0">
          <p className="text-[11px] font-black text-[#185d53] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <FiMapPin className="text-[13px]" /> Location
          </p>
          <p className="text-[13px] font-semibold text-[#1A2E2A] truncate">{project.city}</p>
          <p className="text-[12px] text-[#3D5A55] font-medium mt-0.5 truncate">{project.state}</p>
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-black text-[#185d53] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <FiDollarSign className="text-[13px]" /> Price
          </p>
          <p className="text-[15px] font-black text-[#00695C]">{project.priceRange}</p>
          <p className="text-[12px] text-[#3D5A55] font-medium mt-0.5">{formatCompact(project.price)}</p>
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-black text-[#185d53] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <FaHardHat className="text-[13px]" /> Builder
          </p>
          <p className="text-[13px] font-semibold text-[#1A2E2A] truncate">{project.builderName}</p>
          <p className="text-[12px] text-[#3D5A55] font-medium mt-0.5">Launch: {formatDate(project.launchDate)}</p>
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-black text-[#185d53] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <FiLayers className="text-[13px]" /> Units
          </p>
          <p className="text-[13px] font-semibold text-[#1A2E2A]">{project.totalUnits} total</p>
          <p className="text-[12px] text-[#00695C] font-bold mt-0.5">{project.availableUnits} available</p>
        </div>
      </div>

      {/* Units | Available | Sqft */}
      <div className="grid grid-cols-3 gap-3 px-5 pb-4">
        <div className="flex items-center gap-2.5 px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE]">
          <FiLayers className="text-[#00695C] text-base flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-[15px] font-black text-[#0F1A18] leading-none">{project.totalUnits}</p>
            <p className="text-[10px] text-[#3D5A55] uppercase tracking-wider font-bold mt-1">Units</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE]">
          <FiCheckSquare className="text-[#10B981] text-base flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-[15px] font-black text-[#00695C] leading-none">{project.availableUnits}</p>
            <p className="text-[10px] text-[#3D5A55] uppercase tracking-wider font-bold mt-1">Available</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE]">
          <FaRulerCombined className="text-amber-500 text-sm flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-[15px] font-black text-[#0F1A18] leading-none">{project.areaSqft}</p>
            <p className="text-[10px] text-[#3D5A55] uppercase tracking-wider font-bold mt-1">Sqft</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================
const ProjectManagement = () => {
  const [activeCategory, setActiveCategory] = useState('Individual');
  const [activeView, setActiveView] = useState('overview');
  const [activeTab, setActiveTab] = useState('Individual');
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  const [confirmAction, setConfirmAction] = useState(null);

  const [datePreset, setDatePreset] = useState('month');
  const [customStart, setCustomStart] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [customEnd, setCustomEnd] = useState(new Date());

  const [projects, setProjects] = useState({
    'Individual': [], 'Apartment': [], 'Commercial': [], 'Land & Plots': [], 'Hostel': []
  });
  const [categoryStats, setCategoryStats] = useState({});

  const [viewingProject, setViewingProject] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  }, []);

  useEffect(() => {
    const newProjects = {};
    const newStats = {};
    ALL_CATEGORIES.forEach(cat => {
      const list = generateMockProjects(cat, Math.floor(Math.random() * 20) + 20, datePreset, customStart, customEnd);
      newProjects[cat] = list;
      newStats[cat] = buildCategoryStats(cat, list, datePreset);
    });
    setProjects(newProjects);
    setCategoryStats(newStats);
  }, [datePreset, customStart, customEnd]);

  useEffect(() => {
    setSearchQuery('');
    setViewingProject(null);
  }, [activeCategory]);

  const currentProjects = projects[activeCategory] || [];
  const currentStats = categoryStats[activeCategory] || {};
  const currentConfig = PROJECT_CATEGORIES[activeCategory];
  const dateRangeLabel = getDateRangeLabel(datePreset, customStart, customEnd);

  const handleViewProject = useCallback((project) => {
    setViewingProject(project);
    setShowViewModal(true);
  }, []);

  const requestDeleteProject = useCallback((projectId) => {
    const project = currentProjects.find(p => p.id === projectId);
    if (!project) return;
    setConfirmAction({
      title: 'Delete Project?',
      message: `Are you sure you want to delete "${project.projectName}" (${project.projectId})? This action cannot be undone.`,
      confirmText: 'Yes, Delete',
      cancelText: 'No, Cancel',
      type: 'danger',
      icon: FiTrash2,
      onConfirm: () => {
        setProjects(prev => {
          const updatedList = prev[activeCategory].filter(p => p.id !== projectId);
          const updated = { ...prev, [activeCategory]: updatedList };
          setCategoryStats(prevStats => ({
            ...prevStats,
            [activeCategory]: buildCategoryStats(activeCategory, updatedList, datePreset)
          }));
          return updated;
        });
        setShowViewModal(false);
        setViewingProject(null);
        showToast(`Project "${project.projectName}" deleted`, 'warning');
      }
    });
  }, [currentProjects, activeCategory, datePreset, showToast]);

  const executeConfirmAction = useCallback(() => {
    if (!confirmAction) return;
    if (confirmAction.onConfirm) confirmAction.onConfirm();
    setConfirmAction(null);
  }, [confirmAction]);

  const handleRefresh = useCallback(() => {
    setActionLoading('refresh');
    setTimeout(() => {
      const list = generateMockProjects(activeCategory, Math.floor(Math.random() * 20) + 20, datePreset, customStart, customEnd);
      setProjects(prev => ({ ...prev, [activeCategory]: list }));
      setCategoryStats(prev => ({ ...prev, [activeCategory]: buildCategoryStats(activeCategory, list, datePreset) }));
      setActionLoading(null);
      showToast('Data refreshed', 'success');
    }, 800);
  }, [activeCategory, datePreset, customStart, customEnd, showToast]);

  return (
    <div className="space-y-6 p-4 lg:p-6 min-h-screen bg-[#F8FAF9]">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-[500px] h-[500px] rounded-full blur-3xl animate-float bg-[#00695C]/5" />
        <div className="absolute -bottom-1/2 -left-1/2 w-[500px] h-[500px] rounded-full blur-3xl animate-float-delayed bg-[#26A69A]/5" />
      </div>

      <Toast toast={toast} setToast={setToast} />

      <ConfirmModal
        isOpen={!!confirmAction}
        title={confirmAction?.title}
        message={confirmAction?.message}
        confirmText={confirmAction?.confirmText}
        cancelText={confirmAction?.cancelText}
        type={confirmAction?.type}
        icon={confirmAction?.icon}
        onConfirm={executeConfirmAction}
        onCancel={() => setConfirmAction(null)}
      />

      {showViewModal && viewingProject && (
        <ViewProjectDetailModal
          project={viewingProject}
          show={showViewModal}
          onClose={() => { setShowViewModal(false); setViewingProject(null); }}
          onDelete={requestDeleteProject}
        />
      )}

      {/* Header */}
      <div className="relative z-50">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-[#00695C] via-[#26A69A] to-[#4DB6AC] bg-clip-text text-transparent">
                Project Management
              </h1>
              <span className="px-3 py-1.5 bg-gradient-to-r from-[#E8F4F2] to-[#D5F0EA] text-[#00695C] text-xs font-black rounded-full flex items-center gap-1.5">
                <FiActivity className="text-[10px]" /> Super Admin
              </span>
            </div>
            <p className="text-sm text-[#3D5A55] font-semibold flex items-center gap-2 flex-wrap">
              <span>Manage all project categories across the platform</span>
              <span className="w-1.5 h-1.5 bg-[#8FA8A4] rounded-full" />
              <span className="text-[#00695C] font-black flex items-center gap-1">
                <FiCalendar className="text-xs" /> {dateRangeLabel}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2 w-full lg:w-auto flex-wrap">
            <DateRangePicker
              selected={datePreset}
              onSelect={setDatePreset}
              customStart={customStart}
              customEnd={customEnd}
              onCustomChange={(start, end) => { setCustomStart(start); setCustomEnd(end); }}
            />

            <button onClick={() => setActiveView('overview')} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black hover:scale-105 transition-all ${activeView === 'overview' ? 'bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white shadow-lg' : 'bg-white border border-[#E8F0EE] text-[#0F1A18]'}`}>
              <FiPieChart className="text-sm" /><span>Overview</span>
            </button>
            <button onClick={() => setActiveView('manage')} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black hover:scale-105 transition-all ${activeView === 'manage' ? 'bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white shadow-lg' : 'bg-white border border-[#E8F0EE] text-[#0F1A18]'}`}>
              <FiGrid className="text-sm" /><span>Manage</span>
            </button>

            <button onClick={handleRefresh} disabled={actionLoading === 'refresh'} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E8F0EE] rounded-xl text-sm font-black text-[#0F1A18] hover:scale-105 transition-all disabled:opacity-50">
              <FiRefreshCw className={`text-sm ${actionLoading === 'refresh' ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{actionLoading === 'refresh' ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Selector (Overview only) */}
      {activeView === 'overview' && (
        <div className="relative z-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {ALL_CATEGORIES.map((cat, idx) => {
              const config = PROJECT_CATEGORIES[cat];
              const Icon = config.icon;
              const isActive = activeCategory === cat;
              const count = projects[cat]?.length || 0;
              return (
                <div
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-2xl p-4 cursor-pointer transition-all duration-500 border-2 hover:shadow-xl group relative overflow-hidden animate-card-in ${
                    isActive
                      ? `bg-gradient-to-br ${config.gradient} border-transparent shadow-xl scale-105`
                      : `bg-white ${config.border} hover:-translate-y-2 hover:shadow-lg`
                  }`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="relative flex items-start justify-between mb-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isActive ? 'bg-white/20' : config.bg} group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                      <Icon className={`text-xl ${isActive ? 'text-white' : config.text}`} />
                    </div>
                    {isActive && <FiCheckCircle className="text-white text-sm" />}
                  </div>
                  <h4 className={`text-md font-bold mb-1 ${isActive ? 'text-white' : 'text-[#0F1A18]'}`}>{cat}</h4>
                  <p className={`text-[11px] font-medium mb-2 line-clamp-2 ${isActive ? 'text-white/90' : 'text-[#3D5A55]'}`}>{config.description}</p>
                  <div className={`flex items-center gap-2 pt-2 border-t ${isActive ? 'border-white/20' : 'border-[#E8F0EE]'}`}>
                    <MdOutlineConstruction className={`text-sm ${isActive ? 'text-white/90' : 'text-[#3D5A55]'}`} />
                    <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-[#0F1A18]'}`}>{count} projects</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeView === 'overview' ? (
        <CategoryOverviewTab
          key={`overview-${activeCategory}-${datePreset}`}
          activeCategory={activeCategory}
          stats={currentStats}
          config={currentConfig}
          dateRangeLabel={dateRangeLabel}
          datePreset={datePreset}
        />
      ) : (
        <>
          <div className="relative z-0 bg-white rounded-2xl p-2 border border-[#E8F0EE] shadow-sm flex items-center gap-1 overflow-x-auto">
            {ALL_CATEGORIES.map((cat) => {
              const Icon = PROJECT_CATEGORIES[cat].icon;
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setActiveTab(cat); }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? `bg-gradient-to-r ${PROJECT_CATEGORIES[cat].gradient} text-white shadow-md`
                      : 'text-[#3D5A55] hover:bg-[#F5F9F8]'
                  }`}
                >
                  <Icon className="text-sm" /> {cat}
                </button>
              );
            })}
          </div>

          <div key={`tab-content-${activeCategory}-${datePreset}`}>
            <CategoryManageTab
              activeCategory={activeCategory}
              projects={currentProjects}
              onView={handleViewProject}
              onDelete={requestDeleteProject}
              actionLoading={actionLoading}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              viewMode={viewMode}
              setViewMode={setViewMode}
              dateRangeLabel={dateRangeLabel}
            />
          </div>
        </>
      )}

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(50px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes slide-down { from { opacity: 0; transform: translateY(-10px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes dropdown-in { from { opacity: 0; transform: translateY(-10px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes toast-in { from { opacity: 0; transform: translateY(50px) scale(0.9); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes card-in { from { opacity: 0; transform: translateY(30px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes scale-in { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        @keyframes float-delayed { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(15px); } }
        @keyframes icon-float { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-3px) rotate(5deg); } }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
        .animate-slide-in { animation: slide-in 0.5s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
        .animate-slide-down { animation: slide-down 0.3s ease-out forwards; }
        .animate-dropdown-in { animation: dropdown-in 0.3s ease-out forwards; }
        .animate-toast-in { animation: toast-in 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards; }
        .animate-card-in { animation: card-in 0.5s ease-out forwards; opacity: 0; }
        .animate-scale-in { animation: scale-in 0.3s ease-out forwards; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .animate-icon-float { animation: icon-float 3s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 2s ease-in-out infinite; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #F1F5F4; border-radius: 4px; }
        ::-webkit-scrollbar-thumb { background: #8FA8A4; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #00695C; }
        button, select, input, [role="button"] { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
      `}</style>
    </div>
  );
};

export default ProjectManagement;