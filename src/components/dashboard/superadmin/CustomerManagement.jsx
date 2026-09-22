// src/components/dashboard/admin/superadmin/CustomerManagement.jsx

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUsers, FiUser, FiUserPlus, FiUserCheck, FiUserX, FiSearch,
  FiChevronDown, FiChevronLeft, FiChevronRight, FiEye,
  FiTrash2, FiLock, FiUnlock, FiCheckCircle, FiXCircle, FiClock,
  FiMail, FiPhone, FiMapPin, FiCalendar, FiShield, FiActivity,
  FiRefreshCw, FiDownload, FiInfo, FiAlertTriangle, FiPlus,
  FiExternalLink, FiGrid, FiList, FiX, FiAward, FiBriefcase,
  FiHome, FiDollarSign, FiSquare, FiMinimize, FiTrendingUp,
  FiArrowUp, FiArrowDown, FiPercent, FiLayers, FiMap, FiPieChart,
  FiBarChart2, FiGlobe, FiZap, FiBox, FiClipboard, FiFileText,
  FiPackage, FiCreditCard, FiSave, FiTool, FiRotateCcw,
  FiCheckSquare, FiPlayCircle, FiEdit3, FiDatabase, FiFilter,
  FiHeart, FiBookmark, FiMessageSquare, FiUserPlus as FiUserPlusSolid,
  FiEdit, FiSliders, FiHome as FiHomeIcon,
  FiTag 
} from 'react-icons/fi';
import {
  FaHome, FaHardHat, FaCheck, FaStar as FaStarSolid, FaCrown,
  FaGem, FaHotel, FaBriefcase, FaIdCard, FaFileAlt, FaCertificate, FaShieldAlt,
  FaUserTie, FaUserGraduate
} from 'react-icons/fa';
import { MdOutlineRealEstateAgent, MdApartment, MdOutlineBusiness, MdOutlinePerson } from 'react-icons/md';

// ============================================================
// CONSTANTS
// ============================================================
const UNIQUE_COLORS = [
  '#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899',
  '#06B6D4', '#EF4444', '#84CC16', '#F97316', '#6366F1',
  '#14B8A6', '#A855F7', '#EAB308', '#0EA5E9', '#F43F5E'
];

const PLAN_COLORS = {
  'Free': { bg: '#F3F4F6', text: '#374151', border: '#D1D5DB', icon: FiPackage },
  'Silver': { bg: '#F1F5F9', text: '#334155', border: '#CBD5E1', icon: FiAward },
  'Gold': { bg: '#FEF3C7', text: '#B45309', border: '#FCD34D', icon: FaCrown },
  'Platinum': { bg: '#EDE9FE', text: '#6D28D9', border: '#C4B5FD', icon: FaGem },
  'Basic': { bg: '#DBEAFE', text: '#1D4ED8', border: '#93C5FD', icon: FiPackage },
  'Professional': { bg: '#E0E7FF', text: '#4338CA', border: '#A5B4FC', icon: FiAward },
  'Enterprise': { bg: '#FCE7F3', text: '#BE185D', border: '#F9A8D4', icon: FaGem },
  'Premium': { bg: '#FFEDD5', text: '#C2410C', border: '#FDBA74', icon: FaCrown },
  'Standard': { bg: '#CCFBF1', text: '#0F766E', border: '#5EEAD4', icon: FiPackage },
  'Business': { bg: '#CFFAFE', text: '#0E7490', border: '#67E8F9', icon: FiAward }
};

const getPlanStyle = (planName) => {
  return PLAN_COLORS[planName] || {
    bg: '#F3F4F6', text: '#374151', border: '#D1D5DB', icon: FiPackage
  };
};

const USER_TYPE_CONFIG = {
  'Buyer': {
    icon: FiUser,
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    gradient: 'from-blue-600 via-blue-500 to-indigo-400',
    color: '#3B82F6',
    description: 'Property buyers looking to purchase real estate'
  },
  'Tenant': {
    icon: FiHome,
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    gradient: 'from-purple-600 via-purple-500 to-violet-400',
    color: '#8B5CF6',
    description: 'Tenants looking for rental properties'
  },
  'Buyers & Tenants': {
    icon: FiUsers,
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    gradient: 'from-emerald-600 via-emerald-500 to-teal-400',
    color: '#10B981',
    description: 'Both buyers and tenants combined'
  }
};
const ALL_USER_TYPES = Object.keys(USER_TYPE_CONFIG);

const ALL_PROPERTY_TYPES = ['Individual', 'Apartment', 'Commercial', 'Land & Plots', 'Hostel'];

const STATUS_BORDER = {
  pending: 'border-l-amber-500',
  active: 'border-l-emerald-500',
  approved: 'border-l-emerald-500',
  blocked: 'border-l-red-500',
  rejected: 'border-l-red-500',
  suspended: 'border-l-gray-500'
};

// ============================================================
// DATE RANGE PRESETS
// ============================================================
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
const formatCompact = (amount) => {
  const num = Number(amount || 0);
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
};
const formatCurrency = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;
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
    case 'week':
      return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    case 'month':
      return ['W1', 'W2', 'W3', 'W4'];
    case 'quarter':
      return ['Month 1', 'Month 2', 'Month 3'];
    case 'year':
      return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    case 'custom':
      return ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8'];
    case 'all':
    default:
      return ['2020', '2021', '2022', '2023', '2024', '2025'];
  }
};

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

const generateGrowthSeries = (labels, seed = 1) => {
  const rand = seededRandom(seed);
  let base = Math.floor(rand() * 40) + 30;
  return labels.map((label) => {
    base += Math.floor(rand() * 20) - 5;
    return { label, value: Math.max(base, 15) };
  });
};

// ============================================================
// DATA GENERATORS
// ============================================================
const generateMockCustomers = (type, count = 20, dateRange = 'month', customStart, customEnd) => {
  const firstNames = ['Rajesh', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Ananya', 'Deepak', 'Meera', 'Ravi', 'Kavya', 'Suresh', 'Pooja', 'Arjun', 'Lakshmi', 'Kiran', 'Mohan', 'Ritu', 'Gautam', 'Nisha', 'Tarun'];
  const lastNames = ['Kumar', 'Sharma', 'Singh', 'Patel', 'Reddy', 'Gupta', 'Verma', 'Joshi', 'Malhotra', 'Mehta', 'Nair', 'Pillai', 'Rao', 'Shetty', 'Agarwal', 'Khanna', 'Chopra', 'Saxena', 'Tiwari', 'Desai'];
  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Nagpur', 'Kolkata', 'Surat', 'Indore'];
  const states = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Gujarat', 'Rajasthan', 'West Bengal', 'Kerala'];
  const statuses = ['pending', 'active', 'blocked'];
  const kycStatuses = ['pending', 'verified', 'rejected'];
  const requirements = ['Buy', 'Rent', 'Both'];
  const occupations = ['Software Engineer', 'Doctor', 'Business Owner', 'Bank Manager', 'Architect', 'Government Employee', 'Consultant'];
  const employmentTypes = ['Salaried', 'Self-Employed', 'Business Owner', 'Retired'];
  const budgetPairs = [['20L', '50L'], ['50L', '1Cr'], ['1Cr', '2Cr'], ['2Cr', '5Cr']];
  const localities = ['Anna Nagar', 'T Nagar', 'Velachery', 'Adyar', 'Whitefield', 'Koramangala', 'Bandra', 'Andheri', 'Gachibowli', 'Banjara Hills'];

  let maxDaysBack = 180;
  if (dateRange === 'today' || dateRange === 'yesterday') maxDaysBack = 1;
  else if (dateRange === 'week') maxDaysBack = 7;
  else if (dateRange === 'month') maxDaysBack = 30;
  else if (dateRange === 'quarter') maxDaysBack = 90;
  else if (dateRange === 'year') maxDaysBack = 365;
  else if (dateRange === 'all') maxDaysBack = 730;
  else if (dateRange === 'custom' && customStart) {
    const diffTime = Math.abs(new Date() - new Date(customStart));
    maxDaysBack = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  return Array.from({ length: count }, (_, i) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const kycStatus = kycStatuses[Math.floor(Math.random() * kycStatuses.length)];
    const requirement = requirements[Math.floor(Math.random() * requirements.length)];
    const budgetPair = budgetPairs[Math.floor(Math.random() * budgetPairs.length)];
    const date = new Date();

    if (dateRange === 'today') {
      date.setHours(Math.floor(Math.random() * 24));
    } else if (dateRange === 'yesterday') {
      date.setDate(date.getDate() - 1);
      date.setHours(Math.floor(Math.random() * 24));
    } else {
      date.setDate(date.getDate() - Math.floor(Math.random() * maxDaysBack));
    }

    const dob = new Date(1975 + Math.floor(Math.random() * 25), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    const propertyTypeCount = 1 + Math.floor(Math.random() * 3);
    const shuffledTypes = [...ALL_PROPERTY_TYPES].sort(() => Math.random() - 0.5).slice(0, propertyTypeCount);
    const localityCount = 1 + Math.floor(Math.random() * 2);
    const shuffledLocalities = [...localities].sort(() => Math.random() - 0.5).slice(0, localityCount);

    const activity = {
      viewedProperties: Math.floor(Math.random() * 50) + 5,
      savedProperties: Math.floor(Math.random() * 25) + 2,
      wishlist: Math.floor(Math.random() * 20) + 1,
      enquiries: Math.floor(Math.random() * 15) + 1,
      siteVisits: Math.floor(Math.random() * 10) + 1,
      purchaseRequests: Math.floor(Math.random() * 8) + 1,
      offersSubmitted: Math.floor(Math.random() * 12) + 1,
      recentlyContacted: Math.floor(Math.random() * 20) + 1,
      leadHistory: Math.floor(Math.random() * 30) + 1,
    };

    // For "Buyers & Tenants" type, randomly assign as buyer or tenant or both
    let customerType = type;
    if (type === 'Buyers & Tenants') {
      customerType = Math.random() > 0.5 ? 'Buyer' : 'Tenant';
    }

    return {
      id: `customer_${i + 1}_${Date.now()}`,
      avatar: firstName[0] + lastName[0],
      status,
      kycStatus,
      customerType,
      requirement,
      kyc: {
        aadhaar: Math.random() > 0.3,
        pan: Math.random() > 0.35,
        gst: Math.random() > 0.7,
        rera: Math.random() > 0.6,
      },
      registrationDate: date.toISOString(),
      personal: {
        name: `${firstName} ${lastName}`,
        dob: dob.toISOString().split('T')[0],
        gender: Math.random() > 0.5 ? 'Male' : 'Female',
        maritalStatus: Math.random() > 0.5 ? 'Married' : 'Single',
      },
      contact: {
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@email.com`,
        phone: `+91 ${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
        altPhone: `+91 ${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
        verification: { email: Math.random() > 0.25, phone: Math.random() > 0.3 },
      },
      location: {
        city,
        state: states[Math.floor(Math.random() * states.length)],
        address: `${Math.floor(Math.random() * 200) + 1}, ${shuffledLocalities[0]} Main Road`,
        pincode: `${600000 + Math.floor(Math.random() * 99999)}`,
      },
      budget: { min: budgetPair[0], max: budgetPair[1], label: `₹${budgetPair[0]} - ₹${budgetPair[1]}` },
      preferredPropertyType: shuffledTypes,
      preferredLocation: shuffledLocalities,
      employment: {
        occupation: occupations[Math.floor(Math.random() * occupations.length)],
        employmentType: employmentTypes[Math.floor(Math.random() * employmentTypes.length)],
        companyName: `${lastName} ${['Technologies', 'Enterprises', 'Solutions', 'Industries'][Math.floor(Math.random() * 4)]}`,
        designation: ['Manager', 'Senior Executive', 'Director', 'Team Lead', 'Consultant'][Math.floor(Math.random() * 5)],
        annualIncome: `${(Math.floor(Math.random() * 30) + 5)},00,000`,
      },
      communicationPreferences: {
        preferredChannel: ['Email', 'Phone Call', 'WhatsApp', 'SMS'][Math.floor(Math.random() * 4)],
        preferredTime: ['Morning', 'Afternoon', 'Evening'][Math.floor(Math.random() * 3)],
        language: ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam'][Math.floor(Math.random() * 6)],
        newsletter: Math.random() > 0.5,
      },
      activity,
      savedProperties: activity.savedProperties,
      viewedProperties: activity.viewedProperties,
      inquiries: activity.enquiries,
      // Keep original name fields for compatibility
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@email.com`,
      phone: `+91 ${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
      city,
      state: states[Math.floor(Math.random() * states.length)],
      verification: { email: Math.random() > 0.25, phone: Math.random() > 0.3 },
      interestedIn: requirement,
      budgetLabel: `₹${budgetPair[0]} - ₹${budgetPair[1]}`,
    };
  });
};

const buildCustomerStats = (type, customerList, datePreset = 'month') => {
  const growthLabels = generateTimeSeriesLabels(datePreset);
  const growthSeed = seedFromString(`${type}_${datePreset}_growth`);
  const monthlyGrowth = generateGrowthSeries(growthLabels, growthSeed);

  const active = customerList.filter(u => u.status === 'active').length;
  const pending = customerList.filter(u => u.status === 'pending').length;
  const blocked = customerList.filter(u => u.status === 'blocked').length;
  const verified = customerList.filter(u => u.kycStatus === 'verified').length;
  const buy = customerList.filter(u => u.requirement === 'Buy').length;
  const rent = customerList.filter(u => u.requirement === 'Rent').length;
  const both = customerList.filter(u => u.requirement === 'Both').length;

  return {
    total: customerList.length,
    active,
    pending,
    blocked,
    approved: active,
    rejected: 0,
    verified,
    pendingKyc: customerList.filter(u => u.kycStatus === 'pending').length,
    approvedAndVerified: customerList.filter(u => u.status === 'active' && u.kycStatus === 'verified').length,
    totalRevenue: customerList.reduce((sum, u) => sum + (u.activity?.offersSubmitted || 0) * 100000, 0),
    totalCommission: customerList.reduce((sum, u) => sum + (u.activity?.offersSubmitted || 0) * 50000, 0),
    totalTransactions: customerList.reduce((sum, u) => sum + (u.activity?.offersSubmitted || 0), 0),
    totalProperties: customerList.reduce((sum, u) => sum + (u.activity?.viewedProperties || 0), 0),
    totalLeads: customerList.reduce((sum, u) => sum + (u.activity?.leadHistory || 0), 0),
    avgRating: customerList.length > 0
      ? (customerList.reduce((sum, u) => sum + parseFloat(u.rating || 4), 0) / customerList.length).toFixed(1)
      : '0.0',
    buy,
    rent,
    both,
    statusDistribution: [
      { label: 'Active', value: active, color: '#10B981' },
      { label: 'Pending', value: pending, color: '#F59E0B' },
      { label: 'Blocked', value: blocked, color: '#EF4444' }
    ],
    requirementDistribution: [
      { label: 'Buy', value: buy, color: '#3B82F6' },
      { label: 'Rent', value: rent, color: '#8B5CF6' },
      { label: 'Both', value: both, color: '#10B981' }
    ],
    planDistribution: [
      { label: 'Buy', value: buy, color: '#3B82F6' },
      { label: 'Rent', value: rent, color: '#8B5CF6' },
      { label: 'Both', value: both, color: '#10B981' }
    ],
    revenueByPlan: [
      { label: 'Buy', value: customerList.filter(u => u.requirement === 'Buy').length * 150000, color: '#3B82F6' },
      { label: 'Rent', value: customerList.filter(u => u.requirement === 'Rent').length * 80000, color: '#8B5CF6' },
      { label: 'Both', value: customerList.filter(u => u.requirement === 'Both').length * 200000, color: '#10B981' }
    ],
    monthlyGrowth
  };
};

const DOC_TYPES_BY_TYPE = {
  'Buyer': [
    { key: 'aadhaar', label: 'Aadhaar Card' },
    { key: 'pan', label: 'PAN Card' },
    { key: 'gst', label: 'GST Certificate' },
    { key: 'rera', label: 'RERA Certificate' }
  ],
  'Tenant': [
    { key: 'aadhaar', label: 'Aadhaar Card' },
    { key: 'pan', label: 'PAN Card' },
    { key: 'gst', label: 'GST Certificate' },
    { key: 'rera', label: 'RERA Certificate' }
  ]
};

const generateVerificationDocs = (user) => {
  const docTypes = DOC_TYPES_BY_TYPE[user.customerType || user.type] || DOC_TYPES_BY_TYPE['Buyer'];
  const rand = seededRandom(seedFromString(user.id + '_docs'));
  return docTypes.map((doc, idx) => {
    let status;
    if (user.kyc && typeof user.kyc[doc.key] === 'boolean') {
      status = user.kyc[doc.key] ? 'approved' : ['pending', 'rejected'][Math.floor(rand() * 2)];
    } else {
      status = ['pending', 'approved', 'rejected'][Math.floor(rand() * 3)];
    }
    return {
      id: `${user.id}_${doc.key}`,
      key: doc.key,
      label: doc.label,
      number: doc.key === 'rera' ? `RERA/${(user.state || 'XX').slice(0, 2).toUpperCase()}/${2020 + idx}/${10000 + idx}`
        : doc.key === 'gst' ? `22ABCDE${1000 + idx}1Z5`
        : doc.key === 'pan' ? `ABCDE${1000 + idx}F`
        : doc.key === 'aadhaar' ? `XXXX XXXX ${1000 + idx}`
        : `${doc.key.toUpperCase()}-${100000 + idx}`,
      url: `https://picsum.photos/seed/${user.id}_${doc.key}/700/500`,
      status
    };
  });
};

const generatePropertiesForCustomer = (user) => {
  const rand = seededRandom(seedFromString(user.id));
  const count = Math.min(Math.max(user.propertiesCount || 4, 1), 12);
  const titles = ['Luxury Apartment', 'Modern Family Home', 'Spacious Villa', 'Penthouse Suite', 'Cozy Studio', 'Commercial Office', 'Garden House', 'Lake View Apartment'];
  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune'];

  return Array.from({ length: count }, (_, idx) => {
    const type = ALL_PROPERTY_TYPES[Math.floor(rand() * ALL_PROPERTY_TYPES.length)];
    const status = ['pending', 'approved', 'rejected', 'suspended'][Math.floor(rand() * 4)];
    const city = cities[Math.floor(rand() * cities.length)];
    return {
      id: `${user.id}_prop_${idx + 1}`,
      title: `${titles[Math.floor(rand() * titles.length)]} ${idx + 1}`,
      type,
      location: `${city}, India`,
      price: Math.floor(rand() * 45000000) + 5000000,
      status,
      bedrooms: type === 'Land & Plots' ? 0 : Math.floor(rand() * 4) + 1,
      bathrooms: type === 'Land & Plots' ? 0 : Math.floor(rand() * 3) + 1,
      area: Math.floor(rand() * 3000) + 400,
      areaUnit: 'sq ft',
      isFeatured: rand() > 0.75,
      isVerified: rand() > 0.6,
      views: Math.floor(rand() * 400),
      inquiries: Math.floor(rand() * 30),
      ownerName: user.name || user.personal?.name,
      description: `${type} managed by ${user.name || user.personal?.name} in ${city}.`,
      amenities: ['WiFi', 'Parking', 'Security', 'AC'].filter(() => rand() > 0.4),
      listedDate: new Date(Date.now() - Math.floor(rand() * 90) * 24 * 60 * 60 * 1000).toISOString()
    };
  });
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
    danger: {
      gradient: 'from-red-500 to-rose-400',
      btn: 'bg-gradient-to-r from-red-500 to-rose-400 hover:shadow-red-500/40',
      ring: 'bg-red-50',
      iconColor: 'text-red-600'
    },
    success: {
      gradient: 'from-emerald-500 to-teal-400',
      btn: 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:shadow-emerald-500/40',
      ring: 'bg-emerald-50',
      iconColor: 'text-emerald-600'
    },
    warning: {
      gradient: 'from-amber-500 to-orange-400',
      btn: 'bg-gradient-to-r from-amber-500 to-orange-400 hover:shadow-amber-500/40',
      ring: 'bg-amber-50',
      iconColor: 'text-amber-600'
    }
  }[type] || {
    gradient: 'from-[#00695C] to-[#26A69A]',
    btn: 'bg-gradient-to-r from-[#00695C] to-[#26A69A] hover:shadow-[#00695C]/40',
    ring: 'bg-[#E8F4F2]',
    iconColor: 'text-[#00695C]'
  };

  const ModalIcon = Icon || FiAlertTriangle;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
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
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl text-sm font-bold hover:bg-[#E8F0EE] hover:scale-[1.02] transition-all"
            >
              {cancelText || 'Cancel'}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2.5 text-white rounded-xl text-sm font-bold shadow-lg hover:scale-[1.02] transition-all ${theme.btn}`}
            >
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
      className="bg-white rounded-2xl p-3 shadow-sm hover:shadow-2xl transition-all duration-500 border border-[#E8F0EE] group cursor-pointer relative overflow-hidden animate-card-in"
      style={{ animationDelay: `${delay}ms`, transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)' }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
      <div className="relative flex items-start justify-between mb-3">
        <div className={`w-11 h-11 rounded-2xl ${color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all flex-shrink-0`}>
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

const StatusBadge = ({ status }) => {
  const styles = {
    pending: 'bg-amber-100 text-amber-700',
    active: 'bg-emerald-100 text-emerald-700',
    approved: 'bg-emerald-100 text-emerald-700',
    blocked: 'bg-gray-100 text-gray-700',
    rejected: 'bg-red-100 text-red-700',
    suspended: 'bg-gray-100 text-gray-700',
    not_submitted: 'bg-gray-100 text-gray-600'
  };
  const labels = {
    pending: 'Pending', active: 'Active', approved: 'Approved', blocked: 'Blocked',
    rejected: 'Rejected', suspended: 'Suspended', not_submitted: 'Not Submitted'
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[9px] ${styles[status] || styles.not_submitted}`}>
      {labels[status] || 'Unknown'}
    </span>
  );
};

const PlanBadge = ({ plan, size = 'sm' }) => {
  const style = getPlanStyle(plan);
  const Icon = style.icon;
  const sizeClasses = size === 'lg'
    ? 'px-4 py-2 text-sm gap-2'
    : size === 'md'
    ? 'px-3 py-1.5 text-xs gap-1.5'
    : 'px-2.5 py-1 text-[10px] gap-1';

  return (
    <span
      className={`inline-flex items-center rounded-full font-black border ${sizeClasses}`}
      style={{
        backgroundColor: style.bg,
        color: style.text,
        borderColor: style.border
      }}
    >
      <Icon className={size === 'lg' ? 'text-base' : size === 'md' ? 'text-sm' : 'text-[11px]'} />
      {plan}
    </span>
  );
};

// ============================================================
// CHARTS
// ============================================================
const FlowChart = ({ data = [], height = 280 }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnimationProgress(1), 100);
    return () => clearTimeout(t);
  }, []);

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center bg-[#F5F9F8] rounded-xl border border-dashed border-[#B5C9C5]" style={{ height }}>
        <FiBarChart2 className="text-2xl text-[#8FA8A4] mb-2" />
        <p className="text-xs font-bold text-[#3D5A55]">No data available</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value), 1);
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="w-full">
      <div className="space-y-4">
        {data.map((item, index) => {
          const percentage = total > 0 ? (item.value / total) * 100 : 0;
          const widthPercent = animationProgress * (item.value / maxValue) * 100;
          const isHovered = hoveredIndex === index;
          const Icon = item.icon;
          return (
            <div key={index} className="relative" onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg transition-all"
                    style={{ background: `linear-gradient(135deg, ${item.color} 0%, ${item.color}CC 100%)`, transform: isHovered ? 'scale(1.15) rotate(5deg)' : 'scale(1)' }}>
                    {Icon && <Icon className="text-sm" />}
                  </div>
                  <div>
                    <p className={`text-sm font-black ${isHovered ? 'text-[#00695C]' : 'text-[#0F1A18]'}`}>{item.label}</p>
                    <p className="text-[10px] text-[#3D5A55] font-medium">{item.subtitle || `${percentage.toFixed(1)}% of total`}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black" style={{ color: item.color }}>{item.value.toLocaleString()}</p>
                  <p className="text-[10px] text-[#3D5A55] font-bold">{item.count?.toLocaleString() || 0} users</p>
                </div>
              </div>
              <div className="relative h-8 bg-[#F5F9F8] rounded-xl overflow-hidden">
                <div className="h-full rounded-xl transition-all duration-1000 ease-out relative overflow-hidden"
                  style={{ width: `${widthPercent}%`, background: `linear-gradient(90deg, ${item.color} 0%, ${item.color}DD 100%)`, boxShadow: isHovered ? `0 0 20px ${item.color}80` : `0 0 10px ${item.color}40`, transitionDelay: `${index * 100}ms` }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  <div className="absolute inset-0 flex items-center justify-end pr-3">
                    <span className="text-[10px] font-black text-white drop-shadow-md">{percentage.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 pt-4 border-t border-[#E8F0EE] flex items-center justify-between">
        <span className="text-xs font-bold text-[#3D5A55] uppercase tracking-wider">Total</span>
        <span className="text-xl font-black text-[#00695C]">{total.toLocaleString()}</span>
      </div>
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
                    {d.value.toLocaleString()}
                  </div>
                </div>
              )}
              <div className={`text-[9px] font-black px-1.5 py-0.5 rounded-md mb-1 ${isHovered ? 'opacity-100' : 'opacity-60'}`}
                style={{ color: d.color, backgroundColor: `${d.color}15` }}>
                {d.value.toLocaleString()}
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
                <text x={p.x} y={p.y - 22} textAnchor="middle" fill="#fff" fontSize="14" fontWeight="900">{data[i].value.toLocaleString()}</text>
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
                  {selected === preset.id && <FiCheckCircle className="ml-auto text-[#00695C] text-sm animate-scale-in" />}
                </button>
              );
            })}
          </div>
          <div className="border-t border-[#E8F0EE] px-3 py-2">
            <button
              onClick={() => setShowCustom(!showCustom)}
              className="w-full flex items-center justify-between text-xs font-bold text-[#00695C] px-2 py-1.5 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300"
            >
              <span className="flex items-center gap-2"><FiEdit3 className="text-sm" /> Custom Range</span>
              <FiChevronDown className={`transition-transform duration-300 ${showCustom ? 'rotate-180' : ''}`} />
            </button>
            {showCustom && (
              <div className="mt-2 space-y-2 p-2 bg-[#F5F9F8] rounded-xl animate-slide-down">
                <div>
                  <label className="block text-[10px] font-bold text-[#3D5A55] mb-1">From</label>
                  <input
                    type="date"
                    value={customStart ? customStart.toISOString().split('T')[0] : ''}
                    onChange={(e) => onCustomChange(new Date(e.target.value), customEnd)}
                    className="w-full px-2 py-1.5 bg-white rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/10 text-xs text-[#0F1A18] font-medium outline-none transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#3D5A55] mb-1">To</label>
                  <input
                    type="date"
                    value={customEnd ? customEnd.toISOString().split('T')[0] : ''}
                    onChange={(e) => onCustomChange(customStart, new Date(e.target.value))}
                    className="w-full px-2 py-1.5 bg-white rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/10 text-xs text-[#0F1A18] font-medium outline-none transition-all duration-300"
                  />
                </div>
                <button
                  onClick={() => { onSelect('custom'); setIsOpen(false); setShowCustom(false); }}
                  disabled={!customStart || !customEnd}
                  className="w-full px-3 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg text-xs font-bold hover:shadow-lg transition-all duration-300 disabled:opacity-50 hover:scale-105"
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
// CUSTOMER DETAILS MODAL
// ============================================================
const CustomerDetailsModal = ({ customer, config, onClose, onToggleBlock, onViewFullProfile }) => {
  const Icon = config.icon;
  const isBlocked = customer.status === 'blocked' || customer.status === 'rejected';
  const [activeTab, setActiveTab] = useState('personal');
  const docs = useMemo(() => generateVerificationDocs(customer), [customer]);

  useEffect(() => {
    setActiveTab('personal');
  }, [customer?.id]);

  if (!customer) return null;

  const name = customer.personal?.name || customer.name;
  const email = customer.contact?.email || customer.email;
  const phone = customer.contact?.phone || customer.phone;
  const city = customer.location?.city || customer.city;
  const state = customer.location?.state || customer.state;

  const tabs = [
    { id: 'personal', label: 'Personal' },
    { id: 'contact', label: 'Contact' },
    { id: 'activity', label: 'Activity' },
    { id: 'kyc', label: 'KYC' },
  ];

  const Row = ({ icon, label, value, verified }) => (
    <div className="flex items-center justify-between gap-4 py-3 border-b" style={{ borderColor: 'var(--cdm-border)' }}>
      <span className="flex items-center gap-2 text-xs" style={{ color: 'var(--cdm-muted)' }}>
        <span style={{ color: 'var(--cdm-accent)' }}>{icon}</span>{label}
      </span>
      <span className="text-sm font-medium text-right flex items-center gap-1.5">
        {value || 'N/A'}
        {verified !== undefined && (
          verified
            ? <FiCheckCircle style={{ color: 'var(--cdm-success)' }} className="text-xs" />
            : <FiXCircle style={{ color: 'var(--cdm-muted)' }} className="text-xs" />
        )}
      </span>
    </div>
  );

  const ActivityRow = ({ icon, label, value }) => (
    <div className="flex items-center justify-between gap-4 py-2 border-b" style={{ borderColor: 'var(--cdm-border)' }}>
      <span className="flex items-center gap-2 text-xs" style={{ color: 'var(--cdm-muted)' }}>
        <span style={{ color: 'var(--cdm-accent)' }}>{icon}</span>{label}
      </span>
      <span className="text-sm font-semibold" style={{ color: 'var(--cdm-accent)' }}>{value}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div
        className="customer-details-modal w-full max-w-lg max-h-[92vh] overflow-hidden rounded-[28px] shadow-2xl animate-slide-up flex flex-col"
        style={{ background: 'var(--cdm-bg)', color: 'var(--cdm-text)', border: '1px solid var(--cdm-border)' }}
      >
        {/* Hero */}
        <div className="relative px-6 pt-6 pb-14 shrink-0" style={{ background: 'linear-gradient(135deg, var(--cdm-accent), var(--cdm-accent-2))' }}>
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/70">
              {customer.customerType || customer.type || 'Customer'} Profile
            </span>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 transition-colors flex items-center justify-center text-white">
              <FiX className="text-base" />
            </button>
          </div>
          <div className="mt-3">
            <h2 className="text-xl font-bold text-white leading-tight">{name}</h2>
            <p className="text-white/70 text-xs mt-0.5">{city}, {state}</p>
          </div>
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${
              customer.status === 'active' ? 'bg-white text-emerald-700' :
              customer.status === 'blocked' ? 'bg-white/20 text-white' : 'bg-white text-amber-700'
            }`}>
              {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
            </span>
            {customer.kycStatus === 'verified' && (
              <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold bg-white/15 text-white flex items-center gap-1">
                <FaCheck className="text-[10px]" /> KYC Verified
              </span>
            )}
            <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold bg-white/15 text-white">
              {customer.requirement || customer.interestedIn || 'N/A'}
            </span>
          </div>
        </div>

        {/* Avatar */}
        <div className="relative flex justify-center shrink-0" style={{ marginTop: '-44px' }}>
          <div className="relative w-[88px] h-[88px]">
            <div
              className="absolute rounded-full flex items-center justify-center font-bold text-2xl"
              style={{ inset: '4px', background: 'var(--cdm-surface)', color: 'var(--cdm-accent)', border: '3px solid var(--cdm-bg)' }}
            >
              {customer.avatar || name.charAt(0)}
            </div>
          </div>
        </div>

        {/* View Full Profile Button */}
        <div className="px-6 mt-3 shrink-0">
          <button
            onClick={() => onViewFullProfile && onViewFullProfile(customer)}
            className="w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02]"
            style={{ background: 'var(--cdm-accent)', color: 'var(--cdm-on-accent)', boxShadow: '0 4px 12px rgba(15, 107, 92, 0.3)' }}
          >
            <FiExternalLink className="text-sm" /> View Full Profile
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-center gap-1 px-6 mt-4 shrink-0 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 py-2 rounded-xl text-[11px] font-semibold transition-all duration-200 whitespace-nowrap px-2"
              style={{
                background: activeTab === tab.id ? 'var(--cdm-accent)' : 'transparent',
                color: activeTab === tab.id ? 'var(--cdm-on-accent)' : 'var(--cdm-muted)'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {activeTab === 'personal' && (
            <div className="space-y-1">
              <Row icon={<FiUser />} label="Full Name" value={name} />
              <Row icon={<FiCalendar />} label="Date of Birth" value={customer.personal?.dob} />
              <Row icon={<FiUsers />} label="Gender" value={customer.personal?.gender} />
              <Row icon={<FiUser />} label="Marital Status" value={customer.personal?.maritalStatus} />
              <div className="mt-4">
                <p className="text-[10px] uppercase tracking-widest font-semibold mb-2" style={{ color: 'var(--cdm-muted)' }}>Location</p>
                <Row icon={<FiMapPin />} label="City" value={city} />
                <Row icon={<FiMapPin />} label="State" value={state} />
                <Row icon={<FiHome />} label="Address" value={customer.location?.address} />
                <Row icon={<FiTag />} label="Pincode" value={customer.location?.pincode} />
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-1">
              <Row icon={<FiMail />} label="Email" value={email} verified={customer.contact?.verification?.email || customer.verification?.email} />
              <Row icon={<FiPhone />} label="Phone" value={phone} verified={customer.contact?.verification?.phone || customer.verification?.phone} />
              <Row icon={<FiPhone />} label="Alternate Phone" value={customer.contact?.altPhone} />
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-1">
              <ActivityRow icon={<FiEye />} label="Viewed Properties" value={customer.activity?.viewedProperties || customer.viewedProperties || 0} />
              <ActivityRow icon={<FiBookmark />} label="Saved Properties" value={customer.activity?.savedProperties || customer.savedProperties || 0} />
              <ActivityRow icon={<FiHeart />} label="Wishlist" value={customer.activity?.wishlist || 0} />
              <ActivityRow icon={<FiMessageSquare />} label="Enquiries" value={customer.activity?.enquiries || customer.inquiries || 0} />
              <ActivityRow icon={<FiMapPin />} label="Site Visits" value={customer.activity?.siteVisits || 0} />
              <ActivityRow icon={<FiHome />} label="Purchase Requests" value={customer.activity?.purchaseRequests || 0} />
              <ActivityRow icon={<FiDollarSign />} label="Offers Submitted" value={customer.activity?.offersSubmitted || 0} />
              <ActivityRow icon={<FiUsers />} label="Recently Contacted" value={customer.activity?.recentlyContacted || 0} />
              <ActivityRow icon={<FiClock />} label="Lead History" value={customer.activity?.leadHistory || 0} />
            </div>
          )}

          {activeTab === 'kyc' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--cdm-muted)' }}>KYC Status</p>
                <StatusBadge status={customer.kycStatus} />
              </div>
              <div className="space-y-2">
                {docs.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between px-3 py-2.5 bg-[#F5F9F8] rounded-xl">
                    <span className="flex items-center gap-2 text-xs font-bold text-[#1A2E2A] truncate">
                      <FiFileText className="text-[#00695C] text-sm flex-shrink-0" />
                      <span className="truncate">{doc.label}</span>
                    </span>
                    <StatusBadge status={doc.status} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t flex items-center gap-2 shrink-0" style={{ borderColor: 'var(--cdm-border)', background: 'var(--cdm-surface)' }}>
          <button
            onClick={() => { onToggleBlock(customer); onClose(); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 ${
              isBlocked ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
            }`}
          >
            {isBlocked ? <><FiUnlock className="text-xs" /> Unblock</> : <><FiLock className="text-xs" /> Block</>}
          </button>
          <button onClick={onClose} className="flex-1 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl text-xs font-bold hover:bg-[#E8F0EE]">
            Close
          </button>
        </div>
      </div>

      <style>{`
        .customer-details-modal {
          --cdm-bg: #FFFFFF;
          --cdm-surface: #F5F9F8;
          --cdm-border: #E5EEEB;
          --cdm-text: #12211D;
          --cdm-text-soft: #3E5C56;
          --cdm-muted: #6B8983;
          --cdm-accent: #0F6B5C;
          --cdm-accent-2: #2FAE9A;
          --cdm-on-accent: #FFFFFF;
          --cdm-success: #167A54;
          --cdm-success-bg: #E7F6EF;
          --cdm-success-border: #BEE4D2;
          --cdm-danger: #C0392B;
          --cdm-danger-bg: #FCEBE9;
          --cdm-warning-text: #92620C;
          --cdm-warning-bg: #FDF3DE;
          --cdm-warning-border: #F2DBA3;
        }
      `}</style>
    </div>
  );
};

// ============================================================
// TAB: OVERVIEW
// ============================================================
const OverviewTab = ({ activeUserType, stats, config, dateRangeLabel, datePreset }) => {
  const Icon = config.icon;

  const growthTitle = {
    today: 'Hourly Growth',
    yesterday: 'Hourly Growth',
    week: 'Daily Growth',
    month: 'Weekly Growth',
    quarter: 'Monthly Growth',
    year: 'Monthly Growth',
    all: 'Yearly Growth',
    custom: 'Period Growth'
  }[datePreset] || 'Growth Trend';

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#E8F4F2] to-[#D5F0EA] rounded-2xl p-3 border border-[#C5EDE5] flex items-center gap-2">
        <FiCalendar className="text-[#00695C] text-sm" />
        <span className="text-xs font-bold text-[#00695C]">Showing data for: {dateRangeLabel}</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<FiUsers className="text-white text-base" />} title={`Total ${activeUserType}`} value={stats.total || 0} trend={12.5} subtitle="All registered" color={`bg-gradient-to-br ${config.gradient}`} delay={0} />
        <StatCard icon={<FiUserCheck className="text-white text-base" />} title="Active" value={stats.active || 0} trend={8.3} subtitle="Active users" color="bg-gradient-to-br from-emerald-600 to-teal-400" delay={100} />
        <StatCard icon={<FiClock className="text-white text-base" />} title="Pending" value={stats.pending || 0} trend={-3.2} subtitle="Awaiting approval" color="bg-gradient-to-br from-amber-600 to-yellow-400" delay={200} />
        <StatCard icon={<FiXCircle className="text-white text-base" />} title="Blocked" value={stats.blocked || 0} trend={-1.5} subtitle="Blocked users" color="bg-gradient-to-br from-red-600 to-rose-400" delay={300} />
      </div>

      {activeUserType === 'Buyers & Tenants' && (
        <div className="grid grid-cols-3 gap-4">
          <StatCard icon={<FiHome className="text-white text-base" />} title="Buy" value={stats.buy || 0} subtitle="Interested in buying" color="bg-gradient-to-br from-blue-600 to-cyan-400" delay={0} />
          <StatCard icon={<FiTag className="text-white text-base" />} title="Rent" value={stats.rent || 0} subtitle="Interested in renting" color="bg-gradient-to-br from-purple-600 to-violet-400" delay={100} />
          <StatCard icon={<FiUsers className="text-white text-base" />} title="Both" value={stats.both || 0} subtitle="Buy & Rent" color="bg-gradient-to-br from-indigo-600 to-blue-400" delay={200} />
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-black text-[#0F1A18] flex items-center gap-2">
                <Icon className="animate-icon-float" style={{ color: config.color }} />
                {activeUserType} Distribution Flow
              </h3>
              <p className="text-xs text-[#3D5A55] font-semibold">User distribution across requirements</p>
            </div>
          </div>
          <FlowChart
            data={[
              { label: 'Active', value: stats.active || 0, color: '#10B981', icon: FiUserCheck, subtitle: `${(((stats.active || 0) / (stats.total || 1)) * 100).toFixed(1)}% of users`, count: stats.active || 0 },
              { label: 'Pending', value: stats.pending || 0, color: '#F59E0B', icon: FiClock, subtitle: `${(((stats.pending || 0) / (stats.total || 1)) * 100).toFixed(1)}% of users`, count: stats.pending || 0 },
              { label: 'Blocked', value: stats.blocked || 0, color: '#EF4444', icon: FiXCircle, subtitle: `${(((stats.blocked || 0) / (stats.total || 1)) * 100).toFixed(1)}% of users`, count: stats.blocked || 0 }
            ]}
            height={320}
          />
        </div>
        <div className="bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm">
          <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
            <FiActivity className="text-[#00695C]" /> Status Distribution
          </h3>
          <DonutChart data={stats.statusDistribution || []} size={220} thickness={48} centerLabel="Total" centerValue={stats.total || 0} />
        </div>
      </div>

      {activeUserType === 'Buyers & Tenants' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm">
            <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
              <FiDollarSign className="text-[#00695C]" /> Revenue by Requirement
            </h3>
            <BarChart data={stats.revenueByPlan || []} height={280} />
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h3 className="text-lg font-black text-[#0F1A18] flex items-center gap-2">
                <FiTrendingUp className="text-[#00695C]" /> {growthTitle}
              </h3>
              <span className="px-3 py-1 bg-[#E8F4F2] text-[#00695C] text-[10px] font-black rounded-full flex items-center gap-1">
                <FiCalendar className="text-[10px]" /> {dateRangeLabel}
              </span>
            </div>
            <AreaChart data={stats.monthlyGrowth || []} height={280} color={config.color} />
          </div>
        </div>
      )}

      {activeUserType !== 'Buyers & Tenants' && (
        <div className="bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="text-lg font-black text-[#0F1A18] flex items-center gap-2">
              <FiTrendingUp className="text-[#00695C]" /> {growthTitle}
            </h3>
            <span className="px-3 py-1 bg-[#E8F4F2] text-[#00695C] text-[10px] font-black rounded-full flex items-center gap-1">
              <FiCalendar className="text-[10px]" /> {dateRangeLabel}
            </span>
          </div>
          <AreaChart data={stats.monthlyGrowth || []} height={280} color={config.color} />
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm">
        <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
          <FiPercent className="text-[#00695C]" /> Requirement-wise User Distribution
        </h3>
        <div className="space-y-3">
          {(stats.requirementDistribution || []).map((plan, i) => (
            <ProgressBar key={i} label={plan.label} value={plan.value} max={stats.total || 1} color={plan.color}
              icon={i === 0 ? FiHome : i === 1 ? FiTag : FiUsers} delay={i * 100} />
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// TAB: REGISTRATIONS
// ============================================================
const RegistrationsTab = ({
  userType, users, onToggleBlock,
  actionLoading, searchQuery, setSearchQuery, selectedStatus, setSelectedStatus,
  viewMode, setViewMode, dateRangeLabel, onViewFullProfile
}) => {
  const [viewingCustomer, setViewingCustomer] = useState(null);
  const config = USER_TYPE_CONFIG[userType];

  const filtered = useMemo(() => {
    let result = [...users];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(u => {
        const name = u.personal?.name || u.name || '';
        const email = u.contact?.email || u.email || '';
        const city = u.location?.city || u.city || '';
        return name.toLowerCase().includes(q) ||
          email.toLowerCase().includes(q) ||
          city.toLowerCase().includes(q);
      });
    }
    if (selectedStatus !== 'all') result = result.filter(u => u.status === selectedStatus);
    return result;
  }, [users, searchQuery, selectedStatus]);

  useEffect(() => { setViewingCustomer(null); }, [userType]);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 border border-[#E8F0EE] shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          <div className="flex-1 w-full relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A7D78] text-sm" />
            <input type="text" placeholder={`Search ${userType.toLowerCase()}...`} value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] text-sm text-[#0F1A18] placeholder:text-[#5A7D78] outline-none" />
          </div>
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] text-sm text-[#0F1A18] outline-none cursor-pointer font-medium">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>

          <div className="flex items-center bg-[#F5F9F8] rounded-xl p-1 border border-[#E8F0EE]">
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#00695C]' : 'text-[#3D5A55]'}`} title="Grid View">
              <FiGrid className="text-sm" />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-white shadow-sm text-[#00695C]' : 'text-[#3D5A55]'}`} title="List View">
              <FiList className="text-sm" />
            </button>
          </div>

          <span className="px-3 py-2 bg-[#E8F4F2] text-[#00695C] text-xs font-black rounded-xl">{filtered.length} users</span>
        </div>
        <div className="mt-2 flex items-center gap-2 text-[10px] text-[#3D5A55] font-semibold">
          <FiCalendar className="text-[#00695C]" /> Showing registrations from: {dateRangeLabel}
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {filtered.map((user, index) => (
            <CustomerCard key={user.id} user={user} config={config} index={index}
              onView={setViewingCustomer} onToggleBlock={onToggleBlock}
              actionLoading={actionLoading} onViewFullProfile={onViewFullProfile} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((user, index) => (
            <CustomerListCard key={user.id} user={user} config={config} index={index}
              onView={setViewingCustomer} onToggleBlock={onToggleBlock}
              actionLoading={actionLoading} onViewFullProfile={onViewFullProfile} />
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E8F0EE]">
          <div className="w-24 h-24 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4 animate-float">
            <FiUsers className="text-4xl text-[#8FA8A4]" />
          </div>
          <h3 className="text-xl font-black text-[#0F1A18]">No {userType.toLowerCase()} found</h3>
          <p className="text-sm text-[#3D5A55] mt-1 font-medium">Try adjusting your filters or date range</p>
        </div>
      )}

      {viewingCustomer && (
        <CustomerDetailsModal
          customer={viewingCustomer}
          config={config}
          onClose={() => setViewingCustomer(null)}
          onToggleBlock={onToggleBlock}
          onViewFullProfile={onViewFullProfile}
        />
      )}
    </div>
  );
};

// Grid Card
const CustomerCard = ({ user, config, index, onView, onToggleBlock, actionLoading, onViewFullProfile }) => {
  const isBlocked = user.status === 'blocked' || user.status === 'rejected';
  const name = user.personal?.name || user.name;
  const email = user.contact?.email || user.email;
  const phone = user.contact?.phone || user.phone;
  const city = user.location?.city || user.city;
  const state = user.location?.state || user.state;
  const requirement = user.requirement || user.interestedIn || 'N/A';
  const budget = user.budget?.label || user.budgetLabel || 'N/A';
  const activity = user.activity || {};
  const viewedProps = activity.viewedProperties || user.viewedProperties || 0;
  const savedProps = activity.savedProperties || user.savedProperties || 0;

  return (
    <div className={`bg-white rounded-2xl border border-[#E8F0EE] p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 animate-card-in ${STATUS_BORDER[user.status] ? `border-l-4 ${STATUS_BORDER[user.status]}` : ''}`}
      style={{ animationDelay: `${index * 40}ms` }}>

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${config.color} 0%, ${config.color}CC 100%)` }}>
            {user.avatar || name.charAt(0)}
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-[#0F1A18] text-sm truncate">{name}</h4>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              <StatusBadge status={user.status} />
              <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold bg-indigo-100 text-indigo-700">{requirement}</span>
              {user.kycStatus === 'verified' && <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold bg-blue-100 text-blue-700">KYC ✓</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-1 text-[11px] text-[#3D5A55]">
        <div className="flex items-center gap-2"><FiMail /> <span className="truncate">{email}</span></div>
        <div className="flex items-center gap-2"><FiPhone /> <span>{phone}</span></div>
        <div className="flex items-center gap-2"><FiMapPin /> <span className="truncate">{city}, {state}</span></div>
        <div className="flex items-center gap-2"><FiDollarSign /> <span>{budget}</span></div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#E8F0EE]">
        <div className="text-center">
          <p className="text-sm font-black text-[#0F1A18]">{viewedProps}</p>
          <p className="text-[8px] text-[#3D5A55] uppercase tracking-wider font-bold">Viewed</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-black text-[#0F1A18]">{savedProps}</p>
          <p className="text-[8px] text-[#3D5A55] uppercase tracking-wider font-bold">Saved</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-black flex items-center justify-center gap-0.5" style={{ color: config.color }}>
            <FiHeart className="text-[10px]" />{activity.wishlist || 0}
          </p>
          <p className="text-[8px] text-[#3D5A55] uppercase tracking-wider font-bold">Wishlist</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-[#E8F0EE]">
        <button onClick={() => onView(user)} className="flex-1 py-1.5 text-xs font-bold text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] flex items-center justify-center gap-1">
          <FiEye className="text-[10px]" /> View
        </button>
        <button onClick={() => onToggleBlock(user)} className={`flex-1 py-1.5 text-xs font-bold rounded-xl flex items-center justify-center gap-1 ${isBlocked ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
          {isBlocked ? <FiUnlock className="text-[10px]" /> : <FiLock className="text-[10px]" />}
          {isBlocked ? 'Unblock' : 'Block'}
        </button>
      </div>

      <div className="mt-1.5">
        <button
          type="button"
          onClick={() => onViewFullProfile(user)}
          className="w-full py-1.5 text-xs font-bold text-[#167A54] bg-[#E7F6EF] border border-[#BEE4D2] rounded-xl hover:bg-[#D5EFE0] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-[1.02]"
        >
          <FiExternalLink className="text-[10px]" /> View Full Profile
        </button>
      </div>
    </div>
  );
};

// List View Card
const CustomerListCard = ({ user, config, index, onView, onToggleBlock, actionLoading, onViewFullProfile }) => {
  const isBlocked = user.status === 'blocked' || user.status === 'rejected';
  const name = user.personal?.name || user.name;
  const email = user.contact?.email || user.email;
  const phone = user.contact?.phone || user.phone;
  const city = user.location?.city || user.city;
  const state = user.location?.state || user.state;
  const requirement = user.requirement || user.interestedIn || 'N/A';
  const budget = user.budget?.label || user.budgetLabel || 'N/A';
  const occupation = user.employment?.occupation || 'N/A';
  const annualIncome = user.employment?.annualIncome || 'N/A';
  const registeredDate = user.registrationDate ? formatDate(user.registrationDate) : 'N/A';
  const experience = user.experience || user.experience === 0 ? user.experience : 'N/A';
  const activity = user.activity || {};

  return (
    <div
      className={`bg-white rounded-2xl border border-[#94e9d4] hover:shadow-lg transition-all duration-300 animate-card-in overflow-hidden ${
        STATUS_BORDER[user.status] ? `border-l-4 ${STATUS_BORDER[user.status]}` : ''
      }`}
      style={{ animationDelay: `${index * 30}ms` }}
    >
      {/* ROW 1: HEADER */}
      <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-[#E8F0EE]">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-md flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${config.color} 0%, ${config.color}CC 100%)` }}
          >
            {user.avatar || name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-[15px] text-[#0F1A18] truncate">{name}</h4>
              <StatusBadge status={user.status} />
              <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold bg-indigo-100 text-indigo-700">{requirement}</span>
              {user.kycStatus === 'verified' && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-100 text-blue-700">KYC ✓</span>
              )}
            </div>
            <p className="text-[12px] text-[#3D5A55] font-medium mt-0.5 truncate">{occupation}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => onView(user)}
            className="px-4 py-2 text-xs font-bold text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] flex items-center gap-1.5 transition"
          >
            <FiEye className="text-sm" /> View
          </button>
          <button
            onClick={() => onToggleBlock(user)}
            className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition ${
              isBlocked
                ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                : 'text-red-600 bg-red-50 hover:bg-red-100'
            }`}
          >
            {isBlocked ? <FiUnlock className="text-sm" /> : <FiLock className="text-sm" />}
            {isBlocked ? 'Unblock' : 'Block'}
          </button>
        </div>
      </div>

      {/* ROW 2: DETAILS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-5 py-4">
        <div className="min-w-0">
          <p className="text-[11px] font-black text-[#185d53] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <FiMail className="text-[13px] text-[#185d53]" /> Contact
          </p>
          <p className="text-[13px] font-semibold text-[#1A2E2A] truncate">{email}</p>
          <p className="text-[12px] text-[#3D5A55] font-medium mt-0.5">{phone}</p>
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-black text-[#185d53] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <FiMapPin className="text-[13px] text-[#185d53]" /> Location
          </p>
          <p className="text-[13px] font-semibold text-[#1A2E2A] truncate">{city}</p>
          <p className="text-[12px] text-[#3D5A55] font-medium mt-0.5 truncate">{state}</p>
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-black text-[#185d53] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <FiCalendar className="text-[13px] text-[#185d53]" /> Registered
          </p>
          <p className="text-[13px] font-semibold text-[#1A2E2A]">{registeredDate}</p>
          <p className="text-[12px] text-[#3D5A55] font-medium mt-0.5">
            {experience !== 'N/A' ? `${experience} yrs exp` : '—'}
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-black text-[#185d53] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <FiTrendingUp className="text-[13px] text-[#185d53]" /> Budget
          </p>
          <p className="text-[15px] font-black text-[#00695C]">{budget}</p>
          <p className="text-[12px] text-[#3D5A55] font-medium mt-0.5">
            {activity.offersSubmitted || 0} transactions
          </p>
        </div>
      </div>

      {/* ROW 3: STATS STRIP */}
      <div className="grid grid-cols-4 gap-3 px-5 pb-4">
        <div className="flex items-center gap-2.5 px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE]">
          <FiEye className="text-[#00695C] text-base flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-[15px] font-black text-[#0F1A18] leading-none">{activity.viewedProperties || 0}</p>
            <p className="text-[10px] text-[#3D5A55] uppercase tracking-wider font-bold mt-1">Viewed</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE]">
          <FiBookmark className="text-[#3B82F6] text-base flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-[15px] font-black text-[#0F1A18] leading-none">{activity.savedProperties || 0}</p>
            <p className="text-[10px] text-[#3D5A55] uppercase tracking-wider font-bold mt-1">Saved</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE]">
          <FiHeart className="text-[#EF4444] text-base flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-[15px] font-black text-[#0F1A18] leading-none">{activity.wishlist || 0}</p>
            <p className="text-[10px] text-[#3D5A55] uppercase tracking-wider font-bold mt-1">Wishlist</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE]">
          <FiMessageSquare className="text-[#8B5CF6] text-base flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-[15px] font-black text-[#0F1A18] leading-none">{activity.enquiries || 0}</p>
            <p className="text-[10px] text-[#3D5A55] uppercase tracking-wider font-bold mt-1">Enquiries</p>
          </div>
        </div>
      </div>

      {/* ROW 4: VIEW FULL PROFILE */}
      <div className="px-5 pb-4">
        <button
          type="button"
          onClick={() => onViewFullProfile(user)}
          className="w-full py-2 text-xs font-bold text-[#167A54] bg-[#E7F6EF] border border-[#BEE4D2] rounded-xl hover:bg-[#D5EFE0] transition-all duration-300 flex items-center justify-center gap-1.5 hover:scale-[1.01]"
        >
          <FiExternalLink className="text-[10px]" /> View Full Profile
        </button>
      </div>
    </div>
  );
};

// ============================================================
// TAB: VERIFICATION
// ============================================================
const VerificationTab = ({ userType, users, showToast, viewMode, setViewMode, dateRangeLabel }) => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [userDocs, setUserDocs] = useState([]);

  useEffect(() => {
    setUserDocs(users.map(u => ({ ...u, docs: generateVerificationDocs(u) })));
    setSelectedUserId(null);
  }, [users, userType]);

  const selectedUser = useMemo(
    () => userDocs.find(u => u.id === selectedUserId) || null,
    [userDocs, selectedUserId]
  );

  const handleUpdateDoc = (userId, docId, newStatus) => {
    setUserDocs(prev => prev.map(u => {
      if (u.id !== userId) return u;
      return { ...u, docs: u.docs.map(d => d.id === docId ? { ...d, status: newStatus } : d) };
    }));
    setActionLoading(`${newStatus}_${docId}`);
    setTimeout(() => {
      setActionLoading(null);
      showToast(`Document ${newStatus} successfully`, newStatus === 'approved' ? 'success' : newStatus === 'rejected' ? 'warning' : 'info');
    }, 400);
  };

  const overallStatus = (user) => {
    if (!user.docs || user.docs.length === 0) return 'pending';
    if (user.docs.every(d => d.status === 'approved')) return 'approved';
    if (user.docs.some(d => d.status === 'rejected')) return 'rejected';
    return 'pending';
  };

  const config = USER_TYPE_CONFIG[userType];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-3 border border-[#E8F0EE] shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 bg-[#E8F4F2] text-[#00695C] text-xs font-black rounded-xl">
            {userDocs.length} users to verify
          </span>
          <span className="text-[10px] text-[#3D5A55] font-semibold flex items-center gap-1">
            <FiCalendar className="text-[#00695C]" /> {dateRangeLabel}
          </span>
        </div>
        <div className="flex items-center bg-[#F5F9F8] rounded-xl p-1 border border-[#E8F0EE]">
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#00695C]' : 'text-[#3D5A55]'}`} title="Grid View">
            <FiGrid className="text-sm" />
          </button>
          <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-white shadow-sm text-[#00695C]' : 'text-[#3D5A55]'}`} title="List View">
            <FiList className="text-sm" />
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {userDocs.map((user, index) => {
            const status = overallStatus(user);
            const name = user.personal?.name || user.name;
            const email = user.contact?.email || user.email;
            return (
              <div key={user.id} className={`bg-white rounded-2xl border border-[#E8F0EE] p-4 hover:shadow-xl transition animate-card-in ${STATUS_BORDER[status] ? `border-l-4 ${STATUS_BORDER[status]}` : ''}`}
                style={{ animationDelay: `${index * 30}ms` }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: config.color }}>
                      {user.avatar || name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-[#0F1A18] truncate">{name}</h4>
                      <p className="text-[10px] text-[#3D5A55] truncate">{email}</p>
                    </div>
                  </div>
                  <StatusBadge status={status} />
                </div>

                <div className="space-y-1.5 mb-3">
                  {user.docs.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between px-2.5 py-1.5 bg-[#F5F9F8] rounded-lg">
                      <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#1A2E2A] truncate">
                        <FiFileText className="text-[#00695C] text-xs flex-shrink-0" /> <span className="truncate">{doc.label}</span>
                      </span>
                      <StatusBadge status={doc.status} />
                    </div>
                  ))}
                </div>

                <button onClick={() => setSelectedUserId(user.id)}
                  className="w-full py-2 text-xs font-bold text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] flex items-center justify-center gap-1.5">
                  <FiShield className="text-[10px]" /> Review Verification
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E8F0EE] shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 gap-2 items-center px-4 py-3 bg-[#F5F9F8] border-b border-[#E8F0EE] text-xs font-bold text-[#3D5A55] uppercase tracking-wider">
            <div className="col-span-4">User</div>
            <div className="col-span-5">Documents</div>
            <div className="col-span-1 text-center">Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>
          {userDocs.map((user) => {
            const status = overallStatus(user);
            const name = user.personal?.name || user.name;
            const email = user.contact?.email || user.email;
            return (
              <div key={user.id} className="grid grid-cols-12 gap-2 items-center py-3 px-4 border-b border-[#E8F0EE] hover:bg-[#F5F9F8] transition">
                <div className="col-span-4 flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: config.color }}>
                    {user.avatar || name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-[#1A2E2A] truncate">{name}</p>
                    <p className="text-[10px] text-[#3D5A55] truncate">{email}</p>
                  </div>
                </div>
                <div className="col-span-5 flex flex-wrap gap-1">
                  {user.docs.map((doc) => (
                    <span key={doc.id} className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${doc.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : doc.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                      {doc.label}
                    </span>
                  ))}
                </div>
                <div className="col-span-1 text-center"><StatusBadge status={status} /></div>
                <div className="col-span-2 flex justify-end">
                  <button onClick={() => setSelectedUserId(user.id)} className="px-3 py-1.5 rounded-lg text-[10px] font-bold text-[#00695C] bg-[#E8F4F2] hover:bg-[#C5EDE5] flex items-center gap-1">
                    <FiShield className="text-[10px]" /> Review
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {userDocs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E8F0EE]">
          <FiShield className="text-4xl text-[#8FA8A4] mb-3" />
          <h3 className="text-lg font-black text-[#0F1A18]">No users to verify</h3>
        </div>
      )}

      {selectedUser && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl animate-slide-up flex flex-col">
            <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 rounded-t-3xl z-10 shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white"><FiShield className="text-sm" /></div>
                <div>
                  <h2 className="text-base font-bold text-white">{selectedUser.personal?.name || selectedUser.name}'s Verification</h2>
                  <p className="text-white/90 text-[10px]">{selectedUser.docs.length} documents</p>
                </div>
              </div>
              <button onClick={() => setSelectedUserId(null)} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white">
                <FiX className="text-sm" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-[#F8FAF9]">
              {selectedUser.docs.map((doc) => (
                <div key={doc.id} className="border border-[#E8F0EE] rounded-2xl p-4 bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-sm font-bold text-[#1A2E2A]">{doc.label}</h4>
                      <p className="text-[11px] text-[#3D5A55]">{doc.number}</p>
                    </div>
                    <StatusBadge status={doc.status} />
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-[#E8F0EE]">
                      <img src={doc.url} alt={doc.label} className="w-full h-full object-cover" />
                    </div>
                    <button onClick={() => window.open(doc.url, '_blank')} className="w-8 h-8 rounded-lg hover:bg-[#F5F9F8] flex items-center justify-center text-[#00695C]">
                      <FiEye className="text-sm" />
                    </button>
                    <button onClick={() => window.open(doc.url, '_blank')} className="w-8 h-8 rounded-lg hover:bg-[#F5F9F8] flex items-center justify-center text-[#00695C]">
                      <FiDownload className="text-sm" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    {doc.status !== 'rejected' && (
                      <button onClick={() => handleUpdateDoc(selectedUser.id, doc.id, 'rejected')} disabled={!!actionLoading}
                        className="flex-1 py-2 rounded-xl text-xs font-bold bg-red-50 text-red-700 hover:bg-red-100 flex items-center justify-center gap-1 disabled:opacity-50">
                        <FiXCircle className="text-xs" /> Reject
                      </button>
                    )}
                    {doc.status !== 'pending' && (
                      <button onClick={() => handleUpdateDoc(selectedUser.id, doc.id, 'pending')} disabled={!!actionLoading}
                        className="flex-1 py-2 rounded-xl text-xs font-bold bg-amber-50 text-amber-700 hover:bg-amber-100 flex items-center justify-center gap-1 disabled:opacity-50">
                        <FiClock className="text-xs" /> Pending
                      </button>
                    )}
                    {doc.status !== 'approved' && (
                      <button onClick={() => handleUpdateDoc(selectedUser.id, doc.id, 'approved')} disabled={!!actionLoading}
                        className="flex-1 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center gap-1 disabled:opacity-50">
                        <FiCheckCircle className="text-xs" /> Approve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// TAB: PROPERTIES
// ============================================================
const PropertiesTab = ({ userType, users, showToast, dateRangeLabel }) => {
  const [viewingUserId, setViewingUserId] = useState(null);
  const [properties, setProperties] = useState([]);

  const viewingUser = useMemo(
    () => users.find(u => u.id === viewingUserId) || null,
    [users, viewingUserId]
  );

  useEffect(() => {
    setViewingUserId(null);
    setProperties([]);
  }, [users, userType]);

  useEffect(() => {
    if (viewingUser) {
      setProperties(generatePropertiesForCustomer(viewingUser));
    }
  }, [viewingUser]);

  const handlePropertyAction = (propertyId, action) => {
    setProperties(prev => prev.map(p => {
      if (p.id !== propertyId) return p;
      if (action === 'approve') return { ...p, status: 'approved' };
      if (action === 'reject') return { ...p, status: 'rejected' };
      if (action === 'suspend') return { ...p, status: p.status === 'suspended' ? 'approved' : 'suspended' };
      if (action === 'verify') return { ...p, isVerified: !p.isVerified };
      if (action === 'feature') return { ...p, isFeatured: !p.isFeatured };
      return p;
    }));
    showToast(`Property ${action}${action === 'feature' || action === 'verify' ? ' toggled' : 'ed'} successfully`, 'success');
  };

  const config = USER_TYPE_CONFIG[userType];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-3 border border-[#E8F0EE] shadow-sm flex items-center gap-3">
        <span className="px-3 py-1.5 bg-[#E8F4F2] text-[#00695C] text-xs font-black rounded-xl">
          {users.length} users
        </span>
        <span className="text-[10px] text-[#3D5A55] font-semibold flex items-center gap-1">
          <FiCalendar className="text-[#00695C]" /> {dateRangeLabel}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {users.map((user, index) => {
          const name = user.personal?.name || user.name;
          const company = user.company || user.employment?.companyName || 'N/A';
          const email = user.contact?.email || user.email;
          const phone = user.contact?.phone || user.phone;
          const propertiesCount = user.propertiesCount || user.activity?.viewedProperties || 0;
          return (
            <div key={user.id} className="bg-white rounded-2xl border border-[#E8F0EE] p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 animate-card-in"
              style={{ animationDelay: `${index * 30}ms` }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold flex-shrink-0" style={{ background: config.color }}>
                  {user.avatar || name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-[#0F1A18] truncate">{name}</h4>
                  <p className="text-[10px] text-[#3D5A55] truncate">{company}</p>
                </div>
              </div>
              <div className="space-y-1 text-[11px] text-[#3D5A55]">
                <div className="flex items-center gap-2"><FiMail /> <span className="truncate">{email}</span></div>
                <div className="flex items-center gap-2"><FiPhone /> <span>{phone}</span></div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#E8F0EE]">
                <div className="text-center">
                  <p className="text-sm font-black text-[#0F1A18]">{propertiesCount}</p>
                  <p className="text-[8px] text-[#3D5A55] uppercase tracking-wider font-bold">Props</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-black text-[#0F1A18]">{user.leadsCount || user.activity?.leadHistory || 0}</p>
                  <p className="text-[8px] text-[#3D5A55] uppercase tracking-wider font-bold">Leads</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-black" style={{ color: config.color }}>{user.rating || '4.5'}</p>
                  <p className="text-[8px] text-[#3D5A55] uppercase tracking-wider font-bold">Rating</p>
                </div>
              </div>
              <button onClick={() => setViewingUserId(user.id)}
                className="w-full mt-3 py-2 text-xs font-bold text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] flex items-center justify-center gap-1.5">
                <FiEye className="text-[10px]" /> Manage Properties ({propertiesCount})
              </button>
            </div>
          );
        })}
      </div>

      {users.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E8F0EE]">
          <FiHome className="text-4xl text-[#8FA8A4] mb-3" />
          <h3 className="text-lg font-black text-[#0F1A18]">No users to manage</h3>
        </div>
      )}

      {viewingUser && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl animate-slide-up flex flex-col">
            <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 rounded-t-3xl z-10 shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white"><FiHome className="text-sm" /></div>
                <div>
                  <h2 className="text-base font-bold text-white">{viewingUser.personal?.name || viewingUser.name}'s Properties</h2>
                  <p className="text-white/90 text-[10px]">{properties.length} properties</p>
                </div>
              </div>
              <button onClick={() => { setViewingUserId(null); setProperties([]); }} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white">
                <FiX className="text-sm" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-[#F8FAF9]">
              {properties.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <FiHome className="text-4xl text-[#8FA8A4] mb-3" />
                  <p className="text-sm font-bold text-[#3D5A55]">No properties found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {properties.map((property) => (
                    <div key={property.id} className="bg-white rounded-2xl border border-[#E8F0EE] p-4 hover:shadow-lg transition">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0">
                          <h4 className="font-bold text-sm text-[#1A2E2A] truncate">{property.title}</h4>
                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F5F9F8] text-[#3D5A55]">{property.type}</span>
                            <StatusBadge status={property.status} />
                            {property.isFeatured && <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">★ Featured</span>}
                            {property.isVerified && <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">✓ Verified</span>}
                          </div>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                          ₹{Math.floor(property.price / 100000)}L
                        </div>
                      </div>
                      <div className="space-y-1 text-xs text-[#3D5A55]">
                        <div className="flex items-center gap-2"><FiMapPin className="text-[#00695C]" /> <span className="truncate">{property.location}</span></div>
                        <div className="flex items-center gap-2"><FiDollarSign className="text-[#00695C]" /> <span className="font-semibold text-[#1A2E2A]">{formatCurrency(property.price)}</span></div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#E8F0EE]">
                        <div className="text-center"><p className="text-xs font-bold">{property.bedrooms}</p><p className="text-[8px] text-[#3D5A55] uppercase">Beds</p></div>
                        <div className="text-center"><p className="text-xs font-bold">{property.bathrooms}</p><p className="text-[8px] text-[#3D5A55] uppercase">Baths</p></div>
                        <div className="text-center"><p className="text-xs font-bold">{property.area}</p><p className="text-[8px] text-[#3D5A55] uppercase">Sqft</p></div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-[#E8F0EE]">
                        {property.status === 'pending' ? (
                          <>
                            <button onClick={() => handlePropertyAction(property.id, 'approve')} className="flex-1 py-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100">Approve</button>
                            <button onClick={() => handlePropertyAction(property.id, 'reject')} className="flex-1 py-1.5 text-[10px] font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100">Reject</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => handlePropertyAction(property.id, 'feature')} className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg ${property.isFeatured ? 'text-purple-700 bg-purple-50' : 'text-amber-700 bg-amber-50'}`}>
                              {property.isFeatured ? 'Unfeature' : 'Feature'}
                            </button>
                            <button onClick={() => handlePropertyAction(property.id, 'verify')} className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg ${property.isVerified ? 'text-blue-700 bg-blue-50' : 'text-emerald-700 bg-emerald-50'}`}>
                              {property.isVerified ? 'Unverify' : 'Verify'}
                            </button>
                            <button onClick={() => handlePropertyAction(property.id, 'suspend')} className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg ${property.status === 'suspended' ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'}`}>
                              {property.status === 'suspended' ? 'Unsuspend' : 'Suspend'}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// TAB: LEADS & PERFORMANCE
// ============================================================
const LeadsTab = ({ userType, users, showToast, dateRangeLabel }) => {
  const [viewingUserId, setViewingUserId] = useState(null);
  const viewingUser = useMemo(() => users.find(u => u.id === viewingUserId) || null, [users, viewingUserId]);

  useEffect(() => { setViewingUserId(null); }, [users, userType]);

  const config = USER_TYPE_CONFIG[userType];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-3 border border-[#E8F0EE] shadow-sm flex items-center gap-3">
        <span className="px-3 py-1.5 bg-[#E8F4F2] text-[#00695C] text-xs font-black rounded-xl">
          {users.length} users
        </span>
        <span className="text-[10px] text-[#3D5A55] font-semibold flex items-center gap-1">
          <FiCalendar className="text-[#00695C]" /> {dateRangeLabel}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {users.map((user, index) => {
          const name = user.personal?.name || user.name;
          const city = user.location?.city || user.city;
          const activity = user.activity || {};
          const commission = (activity.offersSubmitted || 0) * 50000;
          return (
            <div key={user.id} className="bg-white rounded-2xl border border-[#E8F0EE] p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 animate-card-in"
              style={{ animationDelay: `${index * 30}ms` }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold flex-shrink-0" style={{ background: config.color }}>
                  {user.avatar || name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-[#0F1A18] truncate">{name}</h4>
                  <p className="text-[10px] text-[#3D5A55] truncate">{city}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center p-2 bg-[#F5F9F8] rounded-lg">
                  <p className="text-sm font-black text-[#00695C]">{formatCompact(commission)}</p>
                  <p className="text-[8px] text-[#3D5A55] uppercase tracking-wider font-bold">Value</p>
                </div>
                <div className="text-center p-2 bg-[#F5F9F8] rounded-lg">
                  <p className="text-sm font-black text-[#0F1A18]">{activity.leadHistory || 0}</p>
                  <p className="text-[8px] text-[#3D5A55] uppercase tracking-wider font-bold">Leads</p>
                </div>
                <div className="text-center p-2 bg-[#F5F9F8] rounded-lg">
                  <p className="text-sm font-black text-[#0F1A18]">{user.rating || '4.5'}</p>
                  <p className="text-[8px] text-[#3D5A55] uppercase tracking-wider font-bold">Rating</p>
                </div>
              </div>
              <button onClick={() => setViewingUserId(user.id)}
                className="w-full py-2 text-xs font-bold text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] flex items-center justify-center gap-1.5">
                <FiBarChart2 className="text-[10px]" /> View Performance
              </button>
            </div>
          );
        })}
      </div>

      {users.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E8F0EE]">
          <FiBarChart2 className="text-4xl text-[#8FA8A4] mb-3" />
          <h3 className="text-lg font-black text-[#0F1A18]">No users to show</h3>
        </div>
      )}

      {viewingUser && (
        <PerformanceModal user={viewingUser} onClose={() => setViewingUserId(null)} />
      )}
    </div>
  );
};

const PerformanceModal = ({ user, onClose }) => {
  const name = user.personal?.name || user.name;
  const activity = user.activity || {};
  const performanceData = {
    totalViewed: activity.viewedProperties || 0,
    totalSaved: activity.savedProperties || 0,
    conversionRate: 68,
    avgResponseTime: '2.4 hrs',
    monthlyPerformance: [
      { month: 'Aug', viewed: 3, saved: 2 },
      { month: 'Sep', viewed: 2, saved: 1 },
      { month: 'Oct', viewed: 4, saved: 3 },
      { month: 'Nov', viewed: 2, saved: 1 },
      { month: 'Dec', viewed: 5, saved: 4 },
      { month: 'Jan', viewed: 3, saved: 2 }
    ]
  };
  const maxValue = Math.max(...performanceData.monthlyPerformance.map(m => m.viewed));

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-2xl animate-slide-up flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 rounded-t-3xl z-10 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white"><FiBarChart2 className="text-sm" /></div>
            <div>
              <h2 className="text-base font-bold text-white">Performance Report</h2>
              <p className="text-white/90 text-[10px]">{name}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white">
            <FiX className="text-sm" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-3 bg-[#F5F9F8] rounded-xl border-l-4 border-l-[#00695C]">
              <p className="text-lg font-bold text-[#1A2E2A]">{performanceData.totalViewed}</p>
              <p className="text-[9px] uppercase tracking-wider text-[#3D5A55] font-bold">Viewed</p>
            </div>
            <div className="text-center p-3 bg-[#F5F9F8] rounded-xl border-l-4 border-l-blue-500">
              <p className="text-lg font-bold text-[#1A2E2A]">{performanceData.totalSaved}</p>
              <p className="text-[9px] uppercase tracking-wider text-[#3D5A55] font-bold">Saved</p>
            </div>
            <div className="text-center p-3 bg-[#F5F9F8] rounded-xl border-l-4 border-l-emerald-500">
              <p className="text-lg font-bold text-[#00695C]">{performanceData.conversionRate}%</p>
              <p className="text-[9px] uppercase tracking-wider text-[#3D5A55] font-bold">Conversion</p>
            </div>
            <div className="text-center p-3 bg-[#F5F9F8] rounded-xl border-l-4 border-l-purple-500">
              <p className="text-lg font-bold text-[#00695C]">{performanceData.avgResponseTime}</p>
              <p className="text-[9px] uppercase tracking-wider text-[#3D5A55] font-bold">Avg Response</p>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#3D5A55] uppercase tracking-wider mb-3">Monthly Performance</h4>
            <div className="bg-[#F5F9F8] rounded-xl p-4">
              <div className="flex items-end justify-between h-32 gap-2">
                {performanceData.monthlyPerformance.map((item) => (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex flex-col items-center gap-0.5">
                      <div className="w-full rounded-t-lg bg-gradient-to-t from-[#00695C] to-[#26A69A]" style={{ height: `${(item.viewed / maxValue) * 80}px`, minHeight: '8px' }} />
                      <span className="text-[9px] font-bold text-[#1A2E2A]">{item.viewed}</span>
                    </div>
                    <span className="text-[8px] text-[#3D5A55] font-bold">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================
const CustomerManagement = () => {
  const [activeUserType, setActiveUserType] = useState('Buyer');
  const [activeView, setActiveView] = useState('overview');
  const [activeTab, setActiveTab] = useState('registrations');
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const navigate = useNavigate();

  const [confirmAction, setConfirmAction] = useState(null);

  const [datePreset, setDatePreset] = useState('month');
  const [customStart, setCustomStart] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [customEnd, setCustomEnd] = useState(new Date());

  const [users, setUsers] = useState({
    'Buyer': [], 'Tenant': [], 'Buyers & Tenants': []
  });
  const [userTypeStats, setUserTypeStats] = useState({});

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  }, []);

  useEffect(() => {
    const newUsers = {};
    const newStats = {};
    ALL_USER_TYPES.forEach(type => {
      const userList = generateMockCustomers(type, Math.floor(Math.random() * 20) + 15, datePreset, customStart, customEnd);
      newUsers[type] = userList;
      newStats[type] = buildCustomerStats(type, userList, datePreset);
    });
    setUsers(newUsers);
    setUserTypeStats(newStats);
  }, [datePreset, customStart, customEnd]);

  useEffect(() => {
    setSearchQuery('');
    setSelectedStatus('all');
    setActiveTab('registrations');
  }, [activeUserType]);

  const currentUsers = users[activeUserType] || [];
  const currentStats = userTypeStats[activeUserType] || {};
  const currentConfig = USER_TYPE_CONFIG[activeUserType];
  const dateRangeLabel = getDateRangeLabel(datePreset, customStart, customEnd);

  const handleViewFullProfile = useCallback(() => {
    navigate('/profile/customer');
    showToast('Opening full customer profile...', 'info');
  }, [navigate, showToast]);

  const requestToggleBlock = useCallback((customer) => {
    const isBlocked = customer.status === 'blocked' || customer.status === 'rejected';
    setConfirmAction({
      customer,
      isBlocked,
      title: isBlocked ? 'Unblock Customer?' : 'Block Customer?',
      message: isBlocked
        ? `Are you sure you want to unblock ${customer.personal?.name || customer.name}? They will regain access to the platform.`
        : `Are you sure you want to block ${customer.personal?.name || customer.name}? They will lose access to the platform immediately.`,
      confirmText: isBlocked ? 'Yes, Unblock' : 'Yes, Block',
      cancelText: 'No, Cancel',
      type: isBlocked ? 'success' : 'danger',
      icon: isBlocked ? FiUnlock : FiLock
    });
  }, []);

  const executeToggleBlock = useCallback(() => {
    if (!confirmAction) return;
    const { customer, isBlocked } = confirmAction;

    setUsers(prev => {
      const updatedList = prev[activeUserType].map(u =>
        u.id === customer.id ? { ...u, status: isBlocked ? 'active' : 'blocked' } : u
      );
      const updated = { ...prev, [activeUserType]: updatedList };
      setUserTypeStats(prevStats => ({
        ...prevStats,
        [activeUserType]: buildCustomerStats(activeUserType, updatedList, datePreset)
      }));
      return updated;
    });

    showToast(`${customer.personal?.name || customer.name} ${isBlocked ? 'unblocked' : 'blocked'}`, isBlocked ? 'success' : 'warning');
    setConfirmAction(null);
  }, [confirmAction, activeUserType, datePreset, showToast]);

  const handleRefresh = useCallback(() => {
    setActionLoading('refresh');
    setTimeout(() => {
      const newUsers = generateMockCustomers(activeUserType, Math.floor(Math.random() * 20) + 15, datePreset, customStart, customEnd);
      setUsers(prev => ({ ...prev, [activeUserType]: newUsers }));
      setUserTypeStats(prev => ({ ...prev, [activeUserType]: buildCustomerStats(activeUserType, newUsers, datePreset) }));
      setActionLoading(null);
      showToast('Data refreshed', 'success');
    }, 800);
  }, [activeUserType, datePreset, customStart, customEnd, showToast]);

  const tabs = [
    { id: 'registrations', label: 'Registrations', icon: FiUserPlus },
    { id: 'verification', label: 'Verification', icon: FiShield },
    { id: 'properties', label: 'Properties', icon: FiHome },
    { id: 'leads', label: 'Leads & Performance', icon: FiBarChart2 }
  ];

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
        onConfirm={executeToggleBlock}
        onCancel={() => setConfirmAction(null)}
      />

      {/* Header */}
      <div className="relative z-50">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-[#00695C] via-[#26A69A] to-[#4DB6AC] bg-clip-text text-transparent">
                Customer Management
              </h1>
              <span className="px-3 py-1.5 bg-gradient-to-r from-[#E8F4F2] to-[#D5F0EA] text-[#00695C] text-xs font-black rounded-full flex items-center gap-1.5">
                <FiActivity className="text-[10px]" /> Super Admin
              </span>
            </div>
            <p className="text-sm text-[#3D5A55] font-semibold flex items-center gap-2 flex-wrap">
              <span>Manage buyers & tenants across the platform</span>
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
              <FiUsers className="text-sm" /><span>Manage</span>
            </button>

            <button onClick={handleRefresh} disabled={actionLoading === 'refresh'} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E8F0EE] rounded-xl text-sm font-black text-[#0F1A18] hover:scale-105 transition-all disabled:opacity-50">
              <FiRefreshCw className={`text-sm ${actionLoading === 'refresh' ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{actionLoading === 'refresh' ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* User Type Selector */}
      <div className="relative z-0">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {ALL_USER_TYPES.map((type, idx) => {
            const config = USER_TYPE_CONFIG[type];
            const Icon = config.icon;
            const isActive = activeUserType === type;
            return (
              <div key={type} onClick={() => setActiveUserType(type)}
                className={`rounded-2xl p-4 cursor-pointer transition-all duration-500 border-2 hover:shadow-xl group relative overflow-hidden animate-card-in ${isActive ? `bg-gradient-to-br ${config.gradient} border-transparent shadow-xl scale-105` : `bg-white ${config.border} hover:-translate-y-2 hover:shadow-lg`}`}
                style={{ animationDelay: `${idx * 50}ms` }}>
                <div className="relative flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isActive ? 'bg-white/20' : config.bg} group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                    <Icon className={`text-xl ${isActive ? 'text-white' : config.text}`} />
                  </div>
                  {isActive && <FiCheckCircle className="text-white text-sm" />}
                </div>
                <h4 className={`text-md font-bold mb-1 ${isActive ? 'text-white' : 'text-[#0F1A18]'}`}>{type}</h4>
                <p className={`text-[11px] font-medium mb-2 ${isActive ? 'text-white/90' : 'text-[#3D5A55]'}`}>{config.description}</p>
                <div className={`flex items-center gap-2 pt-2 border-t ${isActive ? 'border-white/20' : 'border-[#E8F0EE]'}`}>
                  <FiUsers className={`text-sm ${isActive ? 'text-white/90' : 'text-[#3D5A55]'}`} />
                  <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-[#0F1A18]'}`}>{users[type]?.length || 0} users</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {activeView === 'overview' ? (
        <OverviewTab
          key={`overview-${activeUserType}-${datePreset}`}
          activeUserType={activeUserType}
          stats={currentStats}
          config={currentConfig}
          dateRangeLabel={dateRangeLabel}
          datePreset={datePreset}
        />
      ) : (
        <>
          <div className="relative z-0 bg-white rounded-2xl p-2 border border-[#E8F0EE] shadow-sm flex items-center gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${isActive ? `bg-gradient-to-r ${currentConfig.gradient} text-white shadow-md` : 'text-[#3D5A55] hover:bg-[#F5F9F8]'}`}>
                  <TabIcon className="text-sm" /> {tab.label}
                </button>
              );
            })}
          </div>

          <div key={`tab-content-${activeUserType}-${activeTab}-${datePreset}`}>
            {activeTab === 'registrations' && (
              <RegistrationsTab
                userType={activeUserType}
                users={currentUsers}
                onToggleBlock={requestToggleBlock}
                actionLoading={actionLoading}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                viewMode={viewMode}
                setViewMode={setViewMode}
                dateRangeLabel={dateRangeLabel}
                onViewFullProfile={handleViewFullProfile}
              />
            )}
            {activeTab === 'verification' && (
              <VerificationTab
                userType={activeUserType}
                users={currentUsers}
                showToast={showToast}
                viewMode={viewMode}
                setViewMode={setViewMode}
                dateRangeLabel={dateRangeLabel}
              />
            )}
            {activeTab === 'properties' && (
              <PropertiesTab
                userType={activeUserType}
                users={currentUsers}
                showToast={showToast}
                dateRangeLabel={dateRangeLabel}
              />
            )}
            {activeTab === 'leads' && (
              <LeadsTab
                userType={activeUserType}
                users={currentUsers}
                showToast={showToast}
                dateRangeLabel={dateRangeLabel}
              />
            )}
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
        @keyframes bounce-subtle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
        @keyframes pulse-slow { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
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
        .animate-bounce-subtle { animation: bounce-subtle 2s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 2s ease-in-out infinite; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #F1F5F4; border-radius: 4px; }
        ::-webkit-scrollbar-thumb { background: #8FA8A4; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #00695C; }
        button, select, input, [role="button"] { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
      `}</style>
    </div>
  );
};

export default CustomerManagement;