// src/components/dashboard/admin/superadmin/CustomerManagement.jsx

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
  FiHeart, FiBookmark, FiMessageSquare, FiSliders, FiUserMinus,
  FiMoreVertical, FiCopy, FiShare, FiSettings, FiMaximize,
  FiTag, FiStar, FiImage, FiVideo, FiCamera, FiLink, FiServer,
  FiDownloadCloud, FiUploadCloud, FiCloud, FiWifi, FiKey
} from 'react-icons/fi';
import {
  FaHome, FaHardHat, FaCheck, FaStar as FaStarSolid, FaCrown,
  FaGem, FaHotel, FaBriefcase, FaUserCircle, FaUserTie,
  FaIdCard, FaFileAlt, FaCertificate, FaShieldAlt, FaBuilding,
  FaStore, FaUserGraduate, FaUsers, FaUserFriends, FaMedal,
  FaRocket, FaHandshake, FaRegBuilding
} from 'react-icons/fa';
import {
  MdOutlineRealEstateAgent, MdApartment, MdOutlineBusiness,
  MdOutlinePerson, MdOutlineLeaderboard, MdOutlineConstruction,
  MdOutlineManageAccounts, MdOutlinePeople, MdOutlineHomeWork,
  MdOutlineBusinessCenter, MdOutlineAccountCircle, MdOutlineVerified
} from 'react-icons/md';

// ============================================================
// CONSTANTS
// ============================================================
const UNIQUE_COLORS = [
  '#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899',
  '#06B6D4', '#EF4444', '#84CC16', '#F97316', '#6366F1',
  '#14B8A6', '#A855F7', '#EAB308', '#0EA5E9', '#F43F5E'
];

// Customer type colors
const CUSTOMER_TYPE_CONFIG = {
  'Buyer': {
    icon: MdOutlineHomeWork,
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    gradient: 'from-emerald-800 to-teal-600',
    color: '#10B981',
    description: 'Property buyers looking to purchase real estate',
    accentLight: '#E8F8F5',
    accentBorder: '#A8D5CD'
  },
  'Tenant': {
    icon: MdOutlinePeople,
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    gradient: 'from-blue-600 via-blue-500 to-indigo-400',
    color: '#3B82F6',
    description: 'Tenants looking to rent properties',
    accentLight: '#E8F0FE',
    accentBorder: '#A8C5F0'
  },
  'Buyer & Tenant': {
    icon: MdOutlineManageAccounts,
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    gradient: 'from-purple-600 via-purple-500 to-violet-400',
    color: '#8B5CF6',
    description: 'Customers who are both buyers and tenants',
    accentLight: '#F0EBFE',
    accentBorder: '#C5B5F0'
  }
};
const ALL_CUSTOMER_TYPES = Object.keys(CUSTOMER_TYPE_CONFIG);

const ALL_PROPERTY_TYPES = ['Individual', 'Apartment', 'Commercial', 'Land & Plots', 'Hostel'];
const PROPERTY_TYPES = ['Apartment', 'Villa', 'Independent House', 'Plot', 'Commercial', 'Farmhouse'];
const CHANNELS = ['Email', 'Phone Call', 'WhatsApp', 'SMS'];
const LANGUAGES = ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam'];

const STATUS_BORDER = {
  pending: 'border-l-amber-500',
  active: 'border-l-emerald-500',
  blocked: 'border-l-gray-500',
  inactive: 'border-l-gray-400'
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

// ============================================================
// TIME SERIES LABEL GENERATOR
// ============================================================
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

// Seeded random
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


// ============================================================
// PROPERTY-WISE CUSTOMER ACTIVITY GENERATOR
// ============================================================
const PROPERTY_ACTIVITY_TYPES = [
  { type: 'Individual', color: '#10B981', icon: FaHome },
  { type: 'Apartment', color: '#3B82F6', icon: MdApartment },
  { type: 'Commercial', color: '#F59E0B', icon: FaBuilding },
  { type: 'Land & Plots', color: '#8B5CF6', icon: FiMap },
  { type: 'Hostel', color: '#EC4899', icon: FaHotel }
];

const generatePropertyActivity = (seed) => {
  const rand = seededRandom(seed);

  return PROPERTY_ACTIVITY_TYPES.map((property) => ({
    type: property.type,
    views: Math.floor(rand() * 450) + 50,
    wishlist: Math.floor(rand() * 90) + 5,
    saved: Math.floor(rand() * 120) + 10,
    enquiries: Math.floor(rand() * 45) + 2,
    siteVisits: Math.floor(rand() * 30) + 1
  }));
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
    const shuffledTypes = [...PROPERTY_TYPES].sort(() => Math.random() - 0.5).slice(0, propertyTypeCount);
    const localityCount = 1 + Math.floor(Math.random() * 2);
    const shuffledLocalities = [...localities].sort(() => Math.random() - 0.5).slice(0, localityCount);

    

    return {
      id: `${type.toLowerCase().replace(/\s+/g, '_')}_${i + 1}_${Date.now()}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@email.com`,
      phone: `+91 ${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
      altPhone: `+91 ${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
      city,
      state: states[Math.floor(Math.random() * states.length)],
      address: `${Math.floor(Math.random() * 200) + 1}, ${shuffledLocalities[0]} Main Road`,
      pincode: `${600000 + Math.floor(Math.random() * 99999)}`,
      status,
      kycStatus,
      avatar: firstName[0] + lastName[0],
      type,
      registrationDate: date.toISOString(),
      requirement: ['Buy', 'Rent', 'Both'][Math.floor(Math.random() * 3)],
      budget: { min: budgetPair[0], max: budgetPair[1], label: `₹${budgetPair[0]} - ₹${budgetPair[1]}` },
      preferredPropertyType: shuffledTypes,
      preferredLocation: shuffledLocalities,
      personal: {
        name: `${firstName} ${lastName}`,
        dob: dob.toISOString().split('T')[0],
        gender: Math.random() > 0.5 ? 'Male' : 'Female',
        maritalStatus: Math.random() > 0.5 ? 'Married' : 'Single'
      },
      contact: {
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@email.com`,
        phone: `+91 ${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
        altPhone: `+91 ${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
        verification: { email: Math.random() > 0.25, phone: Math.random() > 0.3 }
      },
      location: {
        city,
        state: states[Math.floor(Math.random() * states.length)],
        address: `${Math.floor(Math.random() * 200) + 1}, ${shuffledLocalities[0]} Main Road`,
        pincode: `${600000 + Math.floor(Math.random() * 99999)}`
      },
      employment: {
        occupation: occupations[Math.floor(Math.random() * occupations.length)],
        employmentType: employmentTypes[Math.floor(Math.random() * employmentTypes.length)],
        companyName: `${lastName} ${['Technologies', 'Enterprises', 'Solutions', 'Industries'][Math.floor(Math.random() * 4)]}`,
        designation: ['Manager', 'Senior Executive', 'Director', 'Team Lead', 'Consultant'][Math.floor(Math.random() * 5)],
        annualIncome: `${(Math.floor(Math.random() * 30) + 5)},00,000`
      },
      communicationPreferences: {
        preferredChannel: CHANNELS[Math.floor(Math.random() * CHANNELS.length)],
        preferredTime: ['Morning', 'Afternoon', 'Evening'][Math.floor(Math.random() * 3)],
        language: LANGUAGES[Math.floor(Math.random() * LANGUAGES.length)],
        newsletter: Math.random() > 0.5
      },
      kyc: {
        aadhaar: Math.random() > 0.3,
        pan: Math.random() > 0.35,
        gst: Math.random() > 0.7,
        rera: Math.random() > 0.6
      },
      verification: {
        email: Math.random() > 0.25,
        phone: Math.random() > 0.3
      },
      activity: {
        viewedProperties: Math.floor(Math.random() * 50) + 5,
        savedProperties: Math.floor(Math.random() * 25) + 2,
        wishlist: Math.floor(Math.random() * 20) + 1,
        enquiries: Math.floor(Math.random() * 15) + 1,
        siteVisits: Math.floor(Math.random() * 10) + 1,
        purchaseRequests: Math.floor(Math.random() * 8) + 1,
        offersSubmitted: Math.floor(Math.random() * 12) + 1,
        recentlyContacted: Math.floor(Math.random() * 20) + 1,
        leadHistory: Math.floor(Math.random() * 30) + 1,
        rentalApplications: type === 'Tenant' || type === 'Buyer & Tenant' ? Math.floor(Math.random() * 10) + 1 : 0,
        activeLeases: type === 'Tenant' || type === 'Buyer & Tenant' ? Math.floor(Math.random() * 3) + 1 : 0
      },
  
      propertyActivity: generatePropertyActivity(seedFromString(`${type}_${i}_${firstName}_${lastName}_property_activity`)),
      savedProperties: Math.floor(Math.random() * 25) + 2,
      viewedProperties: Math.floor(Math.random() * 50) + 5,
      inquiries: Math.floor(Math.random() * 15) + 1
    };
  });
};

const generatePropertiesForCustomer = (customer) => {
  const rand = seededRandom(seedFromString(customer.id));
  const count = Math.min(Math.max(customer.activity?.savedProperties || 4, 1), 12);
  const titles = ['Luxury Apartment', 'Modern Family Home', 'Spacious Villa', 'Penthouse Suite', 'Cozy Studio', 'Commercial Office', 'Garden House', 'Lake View Apartment'];
  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune'];

  return Array.from({ length: count }, (_, idx) => {
    const type = ALL_PROPERTY_TYPES[Math.floor(rand() * ALL_PROPERTY_TYPES.length)];
    const status = ['pending', 'approved', 'rejected', 'suspended'][Math.floor(rand() * 4)];
    const city = cities[Math.floor(rand() * cities.length)];
    return {
      id: `${customer.id}_prop_${idx + 1}`,
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
      ownerName: customer.name,
      description: `${type} managed by ${customer.name} in ${city}.`,
      amenities: ['WiFi', 'Parking', 'Security', 'AC'].filter(() => rand() > 0.4),
      listedDate: new Date(Date.now() - Math.floor(rand() * 90) * 24 * 60 * 60 * 1000).toISOString()
    };
  });
};

const DOC_TYPES_BY_CUSTOMER_TYPE = {
  'Buyer': [
    { key: 'aadhaar', label: 'Aadhaar Card' },
    { key: 'pan', label: 'PAN Card' },
    { key: 'gst', label: 'GST Certificate' },
    { key: 'rera', label: 'RERA Certificate' }
  ],
  'Tenant': [
    { key: 'aadhaar', label: 'Aadhaar Card' },
    { key: 'pan', label: 'PAN Card' },
    { key: 'rentalHistory', label: 'Rental History' },
    { key: 'employmentProof', label: 'Employment Proof' }
  ],
  'Buyer & Tenant': [
    { key: 'aadhaar', label: 'Aadhaar Card' },
    { key: 'pan', label: 'PAN Card' },
    { key: 'gst', label: 'GST Certificate' },
    { key: 'rera', label: 'RERA Certificate' },
    { key: 'rentalHistory', label: 'Rental History' },
    { key: 'employmentProof', label: 'Employment Proof' }
  ]
};

const generateVerificationDocs = (customer) => {
  const docTypes = DOC_TYPES_BY_CUSTOMER_TYPE[customer.type] || [];
  const rand = seededRandom(seedFromString(customer.id + '_docs'));
  return docTypes.map((doc, idx) => {
    let status;
    if (customer.kyc && typeof customer.kyc[doc.key] === 'boolean') {
      status = customer.kyc[doc.key] ? 'approved' : ['pending', 'rejected'][Math.floor(rand() * 2)];
    } else {
      status = ['pending', 'approved', 'rejected'][Math.floor(rand() * 3)];
    }
    return {
      id: `${customer.id}_${doc.key}`,
      key: doc.key,
      label: doc.label,
      number: doc.key === 'rera' ? `RERA/${(customer.state || 'XX').slice(0, 2).toUpperCase()}/${2020 + idx}/${10000 + idx}`
        : doc.key === 'gst' ? `22ABCDE${1000 + idx}1Z5`
        : doc.key === 'pan' ? `ABCDE${1000 + idx}F`
        : doc.key === 'aadhaar' ? `XXXX XXXX ${1000 + idx}`
        : `${doc.key.toUpperCase()}-${100000 + idx}`,
      url: `https://picsum.photos/seed/${customer.id}_${doc.key}/700/500`,
      status
    };
  });
};

// ============================================================
// BUILD CUSTOMER TYPE STATS
// ============================================================
const buildCustomerTypeStats = (type, customerList, datePreset = 'month') => {
  const growthLabels = generateTimeSeriesLabels(datePreset);
  const growthSeed = seedFromString(`${type}_${datePreset}_growth`);
  const monthlyGrowth = generateGrowthSeries(growthLabels, growthSeed);

  const propertyActivityDistribution = PROPERTY_ACTIVITY_TYPES.map((property) => {
    const propertyCustomers = customerList
      .map(customer => customer.propertyActivity || [])
      .flat()
      .filter(item => item.type === property.type);

    return {
      ...property,
      activities: [
        {
          label: 'Views',
          value: propertyCustomers.reduce((sum, item) => sum + (item.views || 0), 0),
          color: '#3B82F6'
        },
        {
          label: 'Wishlist',
          value: propertyCustomers.reduce((sum, item) => sum + (item.wishlist || 0), 0),
          color: '#EC4899'
        },
        {
          label: 'Saved',
          value: propertyCustomers.reduce((sum, item) => sum + (item.saved || 0), 0),
          color: '#8B5CF6'
        },
        {
          label: 'Enquiries',
          value: propertyCustomers.reduce((sum, item) => sum + (item.enquiries || 0), 0),
          color: '#06B6D4'
        },
        {
          label: 'Site Visits',
          value: propertyCustomers.reduce((sum, item) => sum + (item.siteVisits || 0), 0),
          color: '#F59E0B'
        }
      ]
    };
  });

  return {
    total: customerList.length,
    active: customerList.filter(c => c.status === 'active').length,
    pending: customerList.filter(c => c.status === 'pending').length,
    blocked: customerList.filter(c => c.status === 'blocked').length,
    verified: customerList.filter(c => c.kycStatus === 'verified').length,
    pendingKyc: customerList.filter(c => c.kycStatus === 'pending').length,
    rejectedKyc: customerList.filter(c => c.kycStatus === 'rejected').length,
    activeAndVerified: customerList.filter(c => c.status === 'active' && c.kycStatus === 'verified').length,
    totalSaved: customerList.reduce((sum, c) => sum + (c.activity?.savedProperties || 0), 0),
    totalViewed: customerList.reduce((sum, c) => sum + (c.activity?.viewedProperties || 0), 0),
    totalEnquiries: customerList.reduce((sum, c) => sum + (c.activity?.enquiries || 0), 0),
    totalSiteVisits: customerList.reduce((sum, c) => sum + (c.activity?.siteVisits || 0), 0),
    avgRating: customerList.length > 0
      ? (customerList.reduce((sum, c) => sum + parseFloat(c.rating || 4), 0) / customerList.length).toFixed(1)
      : '0.0',
    verificationDistribution: [
      {
        label: 'Approved',
        value: customerList.filter(c => c.kycStatus === 'verified').length,
        color: '#10B981',
        icon: FiCheckCircle
      },
      {
        label: 'Pending',
        value: customerList.filter(c => c.kycStatus === 'pending').length,
        color: '#F59E0B',
        icon: FiClock
      },
      {
        label: 'Rejected',
        value: customerList.filter(c => c.kycStatus === 'rejected').length,
        color: '#EF4444',
        icon: FiXCircle
      }
    ],
    statusDistribution: [
      { label: 'Active', value: customerList.filter(c => c.status === 'active').length, color: '#10B981' },
      { label: 'Pending', value: customerList.filter(c => c.status === 'pending').length, color: '#F59E0B' },
      { label: 'Blocked', value: customerList.filter(c => c.status === 'blocked').length, color: '#6B7280' }
    ],
    activityDistribution: [
      { label: 'Viewed', value: customerList.reduce((sum, c) => sum + (c.activity?.viewedProperties || 0), 0), color: '#3B82F6' },
      { label: 'Saved', value: customerList.reduce((sum, c) => sum + (c.activity?.savedProperties || 0), 0), color: '#8B5CF6' },
      { label: 'Wishlist', value: customerList.reduce((sum, c) => sum + (c.activity?.wishlist || 0), 0), color: '#EC4899' },
      { label: 'Enquiries', value: customerList.reduce((sum, c) => sum + (c.activity?.enquiries || 0), 0), color: '#06B6D4' },
      { label: 'Visits', value: customerList.reduce((sum, c) => sum + (c.activity?.siteVisits || 0), 0), color: '#F59E0B' }
    ],
    propertyActivityDistribution,
    monthlyGrowth
  };
};

// ============================================================
// DATE RANGE PICKER COMPONENT
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
// SHARED UI
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

// ============================================================
// CONFIRM MODAL
// ============================================================
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

const StatCard = ({ icon, title, value, trend, subtitle, color, delay = 0, isActive, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`bg-white rounded-2xl p-2 shadow-sm hover:shadow-2xl transition-all duration-500 border group cursor-pointer relative overflow-hidden animate-card-in ${isActive ? 'ring-2 ring-[#00695C] shadow-lg bg-[#F5F9F8]' : 'border-[#E8F0EE]'}`}
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
                  <p className="text-lg font-black" style={{ color: item.color }}>{typeof item.value === 'number' ? item.value.toLocaleString() : item.value}</p>
                  <p className="text-[10px] text-[#3D5A55] font-bold">{item.count?.toLocaleString() || 0} customers</p>
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
                <span className="text-xs font-black text-[#0F1A18] min-w-[60px] text-right">{d.value.toLocaleString()}</span>
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
                <text x={p.x} y={p.y - 22} textAnchor="middle" fill="#fff" fontSize="14" fontWeight="900">{data[i].value}</text>
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
  const styles = {
    pending: 'bg-amber-100 text-amber-700',
    active: 'bg-emerald-100 text-emerald-700',
    approved: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-red-100 text-red-700',
    blocked: 'bg-gray-100 text-gray-700',
    inactive: 'bg-gray-100 text-gray-600',
    suspended: 'bg-gray-100 text-gray-700'
  };
  const labels = {
    pending: 'Pending', active: 'Active', approved: 'Approved', rejected: 'Rejected',
    blocked: 'Blocked', inactive: 'Inactive', suspended: 'Suspended'
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[9px] ${styles[status] || styles.pending}`}>
      {labels[status] || 'Unknown'}
    </span>
  );
};

// ============================================================
// INFO ROW & MINI STAT HELPERS
// ============================================================
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center justify-between gap-2">
    <span className="flex items-center gap-2 text-[11px] font-bold text-[#3D5A55]">
      <span className="text-[#00695C]">{icon}</span> {label}
    </span>
    <span className="text-xs font-bold text-[#1A2E2A] truncate text-right max-w-[60%]">{value}</span>
  </div>
);

const MiniStat = ({ label, value, color }) => (
  <div className="text-center p-3 rounded-xl border-l-4" style={{ backgroundColor: '#F5F9F8', borderLeftColor: color }}>
    <p className="text-lg font-black" style={{ color }}>{value}</p>
    <p className="text-[9px] uppercase tracking-wider text-[#3D5A55] font-bold mt-0.5">{label}</p>
  </div>
);

// ============================================================
// CUSTOMER DETAILS MODAL
// ============================================================
const CustomerDetailsModal = ({ customer, config, onClose, onToggleBlock }) => {
  const Icon = config.icon;
  const isBlocked = customer.status === 'blocked';
  const docs = useMemo(() => generateVerificationDocs(customer), [customer]);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up flex flex-col">
        {/* Header */}
        <div className={`sticky top-0 px-6 py-5 rounded-t-3xl z-10 shrink-0 bg-gradient-to-r ${config.gradient}`}>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white">
            <FiX className="text-lg" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center text-white font-black text-2xl shadow-xl">
              {customer.avatar || customer.name?.charAt(0)}
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-white truncate">{customer.name}</h2>
              <p className="text-white/90 text-xs font-medium truncate">{customer.email}</p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-bold flex items-center gap-1">
                  <Icon className="text-[10px]" /> {customer.type}
                </span>
                <StatusBadge status={customer.status} />
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#F8FAF9]">
          {/* Contact + Account Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-[#E8F0EE] p-5">
              <h3 className="text-xs font-black text-[#3D5A55] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiUser className="text-[#00695C]" /> Contact Info
              </h3>
              <div className="space-y-3">
                <InfoRow icon={<FiMail />} label="Email" value={customer.email} />
                <InfoRow icon={<FiPhone />} label="Phone" value={customer.phone} />
                <InfoRow icon={<FiMapPin />} label="Location" value={`${customer.city}, ${customer.state}`} />
                <InfoRow icon={<FiHome />} label="Address" value={customer.address} />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8F0EE] p-5">
              <h3 className="text-xs font-black text-[#3D5A55] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiInfo className="text-[#00695C]" /> Account Info
              </h3>
              <div className="space-y-3">
                <InfoRow icon={<FiCalendar />} label="Registered" value={formatDate(customer.registrationDate)} />
                <InfoRow icon={<FiTag />} label="Requirement" value={customer.requirement} />
                <InfoRow icon={<FiDollarSign />} label="Budget" value={customer.budget?.label || 'N/A'} />
              </div>
            </div>
          </div>

          {/* Activity Stats */}
          <div className="bg-white rounded-2xl border border-[#E8F0EE] p-5">
            <h3 className="text-xs font-black text-[#3D5A55] uppercase tracking-wider mb-3 flex items-center gap-2">
              <FiActivity className="text-[#00695C]" /> Activity Stats
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MiniStat label="Viewed" value={customer.activity?.viewedProperties || 0} color={config.color} />
              <MiniStat label="Saved" value={customer.activity?.savedProperties || 0} color="#3B82F6" />
              <MiniStat label="Wishlist" value={customer.activity?.wishlist || 0} color="#EC4899" />
              <MiniStat label="Enquiries" value={customer.activity?.enquiries || 0} color="#8B5CF6" />
              <MiniStat label="Site Visits" value={customer.activity?.siteVisits || 0} color="#F59E0B" />
              <MiniStat label="Purchases" value={customer.activity?.purchaseRequests || 0} color="#10B981" />
              <MiniStat label="Offers" value={customer.activity?.offersSubmitted || 0} color="#06B6D4" />
              <MiniStat label="Leads" value={customer.activity?.leadHistory || 0} color="#F97316" />
            </div>
          </div>

          {/* Verification Documents */}
          {docs.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#E8F0EE] p-5">
              <h3 className="text-xs font-black text-[#3D5A55] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiFileText className="text-[#00695C]" /> Verification Documents
              </h3>
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

        {/* Footer */}
        <div className="sticky bottom-0 px-6 py-4 bg-white border-t border-[#E8F0EE] flex items-center gap-3">
          <button onClick={() => { onToggleBlock(customer); onClose(); }}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 ${isBlocked ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}>
            {isBlocked ? <><FiUnlock className="text-sm" /> Unblock</> : <><FiLock className="text-sm" /> Block</>}
          </button>
          <button onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl text-sm font-bold hover:bg-[#E8F0EE]">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// OVERVIEW TAB
// ============================================================
const DEFAULT_VERIFICATION_DISTRIBUTION = [
  { label: 'Approved', value: 18, color: '#10B981', icon: FiCheckCircle },
  { label: 'Pending', value: 7, color: '#F59E0B', icon: FiClock },
  { label: 'Rejected', value: 3, color: '#EF4444', icon: FiXCircle }
];

const DEFAULT_PROPERTY_ACTIVITY = [
  {
    type: 'Individual', color: '#10B981', icon: FaHome,
    activities: [
      { label: 'Views', value: 428, color: '#3B82F6' },
      { label: 'Wishlist', value: 96, color: '#EC4899' },
      { label: 'Saved', value: 148, color: '#8B5CF6' },
      { label: 'Enquiries', value: 52, color: '#06B6D4' },
      { label: 'Site Visits', value: 31, color: '#F59E0B' }
    ]
  },
  {
    type: 'Apartment', color: '#3B82F6', icon: MdApartment,
    activities: [
      { label: 'Views', value: 612, color: '#3B82F6' },
      { label: 'Wishlist', value: 132, color: '#EC4899' },
      { label: 'Saved', value: 205, color: '#8B5CF6' },
      { label: 'Enquiries', value: 74, color: '#06B6D4' },
      { label: 'Site Visits', value: 45, color: '#F59E0B' }
    ]
  },
  {
    type: 'Commercial', color: '#F59E0B', icon: FaBuilding,
    activities: [
      { label: 'Views', value: 356, color: '#3B82F6' },
      { label: 'Wishlist', value: 68, color: '#EC4899' },
      { label: 'Saved', value: 119, color: '#8B5CF6' },
      { label: 'Enquiries', value: 43, color: '#06B6D4' },
      { label: 'Site Visits', value: 27, color: '#F59E0B' }
    ]
  },
  {
    type: 'Land & Plots', color: '#8B5CF6', icon: FiMap,
    activities: [
      { label: 'Views', value: 489, color: '#3B82F6' },
      { label: 'Wishlist', value: 104, color: '#EC4899' },
      { label: 'Saved', value: 173, color: '#8B5CF6' },
      { label: 'Enquiries', value: 61, color: '#06B6D4' },
      { label: 'Site Visits', value: 38, color: '#F59E0B' }
    ]
  },
  {
    type: 'Hostel', color: '#EC4899', icon: FaHotel,
    activities: [
      { label: 'Views', value: 274, color: '#3B82F6' },
      { label: 'Wishlist', value: 57, color: '#EC4899' },
      { label: 'Saved', value: 91, color: '#8B5CF6' },
      { label: 'Enquiries', value: 36, color: '#06B6D4' },
      { label: 'Site Visits', value: 22, color: '#F59E0B' }
    ]
  }
];

const OverviewTab = ({ activeCustomerType, stats, config, dateRangeLabel, datePreset }) => {
  const verificationData = stats.verificationDistribution?.length
    ? stats.verificationDistribution
    : DEFAULT_VERIFICATION_DISTRIBUTION;

  const propertyActivityData = stats.propertyActivityDistribution?.length
    ? stats.propertyActivityDistribution
    : DEFAULT_PROPERTY_ACTIVITY;

  const verificationTotal = verificationData.reduce((sum, item) => sum + Number(item.value || 0), 0) || 1;

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
        <StatCard icon={<FiUsers className="text-white text-base" />} title={`Total ${activeCustomerType}s`} value={stats.total || 0} trend={12.5} subtitle="All registered" color={`bg-gradient-to-br ${config.gradient}`} delay={0} />
        <StatCard icon={<FiUserCheck className="text-white text-base" />} title="Active" value={stats.active || 0} trend={8.3} subtitle="Active customers" color="bg-gradient-to-br from-emerald-600 to-teal-400" delay={100} />
        <StatCard icon={<FiClock className="text-white text-base" />} title="Pending" value={stats.pending || 0} trend={-3.2} subtitle="Awaiting approval" color="bg-gradient-to-br from-amber-600 to-yellow-400" delay={200} />
        <StatCard icon={<FiHeart className="text-white text-base" />} title="Total Saved" value={stats.totalSaved || 0} trend={15.2} subtitle="Properties saved" color="bg-gradient-to-br from-pink-600 to-rose-400" delay={300} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-black text-[#0F1A18] flex items-center gap-2">
                <FiShield className="text-[#00695C] animate-icon-float" />
                Verification Status
              </h3>
              <p className="text-xs text-[#3D5A55] font-semibold">
                Customer Documents verification status
              </p>
            </div>
            <span className="px-3 py-1.5 rounded-full bg-[#E8F4F2] text-[#00695C] text-[10px] font-black">
              Documents Verification
            </span>
          </div>
          <FlowChart
            data={verificationData.map((item) => ({
              ...item,
              subtitle: `${((item.value / verificationTotal) * 100).toFixed(1)}% of customers`,
              count: item.value
            }))}
            height={300}
          />
        </div>
        <div className="bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm">
          <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
            <FiActivity className="text-[#00695C]" /> Status Distribution
          </h3>
          <DonutChart
            data={stats.statusDistribution?.length ? stats.statusDistribution : [
              { label: 'Active', value: 14, color: '#10B981' },
              { label: 'Pending', value: 9, color: '#F59E0B' },
              { label: 'Blocked', value: 5, color: '#6B7280' }
            ]}
            size={220}
            thickness={48}
            centerLabel="Total"
            centerValue={stats.total || 28}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm">
          <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
            <FiBarChart2 className="text-[#00695C]" /> Activity Distribution
          </h3>
          <BarChart data={stats.activityDistribution?.length ? stats.activityDistribution : [
            { label: 'Viewed', value: 1077, color: '#3B82F6' },
            { label: 'Saved', value: 736, color: '#8B5CF6' },
            { label: 'Wishlist', value: 457, color: '#EC4899' },
            { label: 'Enquiries', value: 238, color: '#06B6D4' },
            { label: 'Site Visits', value: 163, color: '#F59E0B' }
          ]} height={280} />
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
          <AreaChart data={stats.monthlyGrowth?.length ? stats.monthlyGrowth : generateGrowthSeries(generateTimeSeriesLabels(datePreset), seedFromString(`fallback_${datePreset}`))} height={280} color={config.color} />
        </div>
      </div>

      {/* ============================================================
          PROPERTY-WISE DISTRIBUTION
      ============================================================ */}
      <div className="bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-black text-[#0F1A18] flex items-center gap-2">
              <FiHome className="text-[#00695C]" /> Property-wise Distribution
            </h3>
            <p className="text-xs text-[#3D5A55] font-semibold">
              Views, wishlist, saved, enquiries and site visits by property type
            </p>
          </div>
          <span className="px-3 py-1.5 rounded-full bg-[#E8F4F2] text-[#00695C] text-[10px] font-black">
            5 Property Types
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {propertyActivityData.map((property) => {
            const PropertyIcon = property.icon;
            const maxActivity = Math.max(...property.activities.map(a => a.value), 1);

            return (
              <div
                key={property.type}
                className="rounded-2xl border border-[#E8F0EE] bg-[#FBFDFC] p-5 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${property.color}18` }}
                    >
                      <PropertyIcon className="text-lg" style={{ color: property.color }} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-[#0F1A18]">{property.type}</h4>
                      <p className="text-[10px] text-[#3D5A55] font-semibold">Property activity overview</p>
                    </div>
                  </div>
                  <span
                    className="text-[10px] font-black px-2.5 py-1 rounded-full text-white"
                    style={{ backgroundColor: property.color }}
                  >
                    {property.type}
                  </span>
                </div>

                <div className="space-y-3">
                  {property.activities.map((activity, activityIndex) => {
                    const width = (activity.value / maxActivity) * 100;
                    return (
                      <div key={activity.label}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: activity.color }}
                            />
                            <span className="text-[11px] font-bold text-[#3D5A55]">
                              {activity.label}
                            </span>
                          </div>
                          <span className="text-xs font-black" style={{ color: activity.color }}>
                            {activity.value.toLocaleString()}
                          </span>
                        </div>
                        <div className="h-3 bg-[#EEF4F2] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-1000 ease-out"
                            style={{
                              width: `${width}%`,
                              background: `linear-gradient(90deg, ${activity.color}, ${activity.color}AA)`,
                              transitionDelay: `${activityIndex * 100}ms`
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-5 gap-1 mt-5 pt-4 border-t border-[#E8F0EE]">
                  {property.activities.map((activity) => (
                    <div key={activity.label} className="text-center">
                      <p className="text-sm font-black" style={{ color: activity.color }}>
                        {activity.value.toLocaleString()}
                      </p>
                      <p className="text-[8px] text-[#3D5A55] font-bold uppercase tracking-wide">
                        {activity.label === 'Site Visits' ? 'Visits' : activity.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// REGISTRATIONS TAB
// ============================================================
const RegistrationsTab = ({
  customerType, customers, onToggleBlock,
  actionLoading, searchQuery, setSearchQuery, selectedStatus, setSelectedStatus,
  viewMode, setViewMode, dateRangeLabel
}) => {
  const [viewingCustomer, setViewingCustomer] = useState(null);
  const config = CUSTOMER_TYPE_CONFIG[customerType];

  const filtered = useMemo(() => {
    let result = [...customers];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c =>
        c.name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.phone?.includes(q) ||
        c.city?.toLowerCase().includes(q)
      );
    }
    if (selectedStatus !== 'all') result = result.filter(c => c.status === selectedStatus);
    return result;
  }, [customers, searchQuery, selectedStatus]);

  useEffect(() => { setViewingCustomer(null); }, [customerType]);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 border border-[#E8F0EE] shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          <div className="flex-1 w-full relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A7D78] text-sm" />
            <input type="text" placeholder={`Search ${customerType.toLowerCase()}s...`} value={searchQuery}
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

          <span className="px-3 py-2 bg-[#E8F4F2] text-[#00695C] text-xs font-black rounded-xl">{filtered.length} customers</span>
        </div>
        <div className="mt-2 flex items-center gap-2 text-[10px] text-[#3D5A55] font-semibold">
          <FiCalendar className="text-[#00695C]" /> Showing registrations from: {dateRangeLabel}
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {filtered.map((customer, index) => (
            <CustomerRegistrationCard key={customer.id} customer={customer} config={config} index={index}
              onView={setViewingCustomer} onToggleBlock={onToggleBlock}
              actionLoading={actionLoading} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((customer, index) => (
            <CustomerRegistrationListCard key={customer.id} customer={customer} config={config} index={index}
              onView={setViewingCustomer} onToggleBlock={onToggleBlock}
              actionLoading={actionLoading} />
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E8F0EE]">
          <div className="w-24 h-24 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4 animate-float">
            <FiUsers className="text-4xl text-[#8FA8A4]" />
          </div>
          <h3 className="text-xl font-black text-[#0F1A18]">No {customerType.toLowerCase()}s found</h3>
          <p className="text-sm text-[#3D5A55] mt-1 font-medium">Try adjusting your filters or date range</p>
        </div>
      )}

      {viewingCustomer && (
        <CustomerDetailsModal
          customer={viewingCustomer}
          config={config}
          onClose={() => setViewingCustomer(null)}
          onToggleBlock={onToggleBlock}
        />
      )}
    </div>
  );
};

// Grid Card
const CustomerRegistrationCard = ({ customer, config, index, onView, onToggleBlock, actionLoading }) => {
  const isBlocked = customer.status === 'blocked';

  return (
    <div className={`bg-white rounded-2xl border border-[#E8F0EE] p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 animate-card-in ${STATUS_BORDER[customer.status] ? `border-l-4 ${STATUS_BORDER[customer.status]}` : ''}`}
      style={{ animationDelay: `${index * 40}ms` }}>

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${config.color} 0%, ${config.color}CC 100%)` }}>
            {customer.avatar || customer.name?.charAt(0)}
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-[#0F1A18] text-sm truncate">{customer.name}</h4>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              <StatusBadge status={customer.status} />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-1 text-[11px] text-[#3D5A55]">
        <div className="flex items-center gap-2"><FiMail /> <span className="truncate">{customer.email}</span></div>
        <div className="flex items-center gap-2"><FiPhone /> <span>{customer.phone}</span></div>
        <div className="flex items-center gap-2"><FiMapPin /> <span className="truncate">{customer.city}, {customer.state}</span></div>
        <div className="flex items-center gap-2"><FiCalendar /> <span>{formatDate(customer.registrationDate)}</span></div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#E8F0EE]">
        <div className="text-center">
          <p className="text-sm font-black text-[#0F1A18]">{customer.activity?.viewedProperties || 0}</p>
          <p className="text-[8px] text-[#3D5A55] uppercase tracking-wider font-bold">Viewed</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-black text-[#0F1A18]">{customer.activity?.savedProperties || 0}</p>
          <p className="text-[8px] text-[#3D5A55] uppercase tracking-wider font-bold">Saved</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-black" style={{ color: config.color }}>{customer.activity?.enquiries || 0}</p>
          <p className="text-[8px] text-[#3D5A55] uppercase tracking-wider font-bold">Enquiries</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-[#E8F0EE]">
        <button onClick={() => onView(customer)} className="flex-1 py-1.5 text-xs font-bold text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] flex items-center justify-center gap-1">
          <FiEye className="text-[10px]" /> View
        </button>
        <button onClick={() => onToggleBlock(customer)} className={`flex-1 py-1.5 text-xs font-bold rounded-xl flex items-center justify-center gap-1 ${isBlocked ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
          {isBlocked ? <FiUnlock className="text-[10px]" /> : <FiLock className="text-[10px]" />}
          {isBlocked ? 'Unblock' : 'Block'}
        </button>
      </div>
    </div>
  );
};

// List View Card
const CustomerRegistrationListCard = ({ customer, config, index, onView, onToggleBlock, actionLoading }) => {
  const isBlocked = customer.status === 'blocked';

  return (
    <div
      className={`bg-white rounded-2xl border border-[#94e9d4] hover:shadow-lg transition-all duration-300 animate-card-in overflow-hidden ${
        STATUS_BORDER[customer.status] ? `border-l-4 ${STATUS_BORDER[customer.status]}` : ''
      }`}
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-[#E8F0EE]">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-md flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${config.color} 0%, ${config.color}CC 100%)` }}
          >
            {customer.avatar || customer.name?.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-[15px] text-[#0F1A18] truncate">{customer.name}</h4>
              <StatusBadge status={customer.status} />
            </div>
            <p className="text-[12px] text-[#3D5A55] font-medium mt-0.5 truncate">{customer.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={() => onView(customer)}
            className="px-4 py-2 text-xs font-bold text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] flex items-center gap-1.5 transition">
            <FiEye className="text-sm" /> View
          </button>
          <button onClick={() => onToggleBlock(customer)}
            className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition ${
              isBlocked ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' : 'text-red-600 bg-red-50 hover:bg-red-100'
            }`}>
            {isBlocked ? <FiUnlock className="text-sm" /> : <FiLock className="text-sm" />}
            {isBlocked ? 'Unblock' : 'Block'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-5 py-4">
        <div className="min-w-0">
          <p className="text-[11px] font-black text-[#185d53] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <FiPhone className="text-[13px] text-[#185d53]" /> Contact
          </p>
          <p className="text-[13px] font-semibold text-[#1A2E2A] truncate">{customer.phone}</p>
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-black text-[#185d53] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <FiMapPin className="text-[13px] text-[#185d53]" /> Location
          </p>
          <p className="text-[13px] font-semibold text-[#1A2E2A] truncate">{customer.city}</p>
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-black text-[#185d53] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <FiCalendar className="text-[13px] text-[#185d53]" /> Registered
          </p>
          <p className="text-[13px] font-semibold text-[#1A2E2A]">{formatDate(customer.registrationDate)}</p>
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-black text-[#185d53] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <FiActivity className="text-[13px] text-[#185d53]" /> Activity
          </p>
          <p className="text-[15px] font-black text-[#00695C]">{customer.activity?.viewedProperties || 0} viewed</p>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// VERIFICATION TAB
// ============================================================
const VerificationTab = ({ customerType, customers, showToast, viewMode, setViewMode, dateRangeLabel }) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [customerDocs, setCustomerDocs] = useState([]);

  useEffect(() => {
    setCustomerDocs(customers.map(c => ({ ...c, docs: generateVerificationDocs(c) })));
    setSelectedCustomerId(null);
  }, [customers, customerType]);

  const selectedCustomer = useMemo(
    () => customerDocs.find(c => c.id === selectedCustomerId) || null,
    [customerDocs, selectedCustomerId]
  );

  const overallStatus = (customer) => {
    if (!customer.docs || customer.docs.length === 0) return 'pending';
    if (customer.docs.every(d => d.status === 'approved')) return 'approved';
    if (customer.docs.some(d => d.status === 'rejected')) return 'rejected';
    return 'pending';
  };

  const config = CUSTOMER_TYPE_CONFIG[customerType];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-3 border border-[#E8F0EE] shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 bg-[#E8F4F2] text-[#00695C] text-xs font-black rounded-xl">
            {customerDocs.length} customers to verify
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
          {customerDocs.map((customer, index) => {
            const status = overallStatus(customer);
            return (
              <div key={customer.id} className={`bg-white rounded-2xl border border-[#E8F0EE] p-4 hover:shadow-xl transition animate-card-in ${STATUS_BORDER[status] ? `border-l-4 ${STATUS_BORDER[status]}` : ''}`}
                style={{ animationDelay: `${index * 30}ms` }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: config.color }}>
                      {customer.avatar}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-[#0F1A18] truncate">{customer.name}</h4>
                      <p className="text-[10px] text-[#3D5A55] truncate">{customer.email}</p>
                    </div>
                  </div>
                  <StatusBadge status={status} />
                </div>

                <div className="space-y-1.5 mb-3">
                  {customer.docs.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between px-2.5 py-1.5 bg-[#F5F9F8] rounded-lg">
                      <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#1A2E2A] truncate">
                        <FiFileText className="text-[#00695C] text-xs flex-shrink-0" /> <span className="truncate">{doc.label}</span>
                      </span>
                      <StatusBadge status={doc.status} />
                    </div>
                  ))}
                </div>

                <button onClick={() => setSelectedCustomerId(customer.id)}
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
            <div className="col-span-4">Customer</div>
            <div className="col-span-5">Documents</div>
            <div className="col-span-1 text-center">Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>
          {customerDocs.map((customer) => {
            const status = overallStatus(customer);
            return (
              <div key={customer.id} className="grid grid-cols-12 gap-2 items-center py-3 px-4 border-b border-[#E8F0EE] hover:bg-[#F5F9F8] transition">
                <div className="col-span-4 flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: config.color }}>
                    {customer.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-[#1A2E2A] truncate">{customer.name}</p>
                    <p className="text-[10px] text-[#3D5A55] truncate">{customer.email}</p>
                  </div>
                </div>
                <div className="col-span-5 flex flex-wrap gap-1">
                  {customer.docs.map((doc) => (
                    <span key={doc.id} className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${doc.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : doc.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                      {doc.label}
                    </span>
                  ))}
                </div>
                <div className="col-span-1 text-center"><StatusBadge status={status} /></div>
                <div className="col-span-2 flex justify-end">
                  <button onClick={() => setSelectedCustomerId(customer.id)} className="px-3 py-1.5 rounded-lg text-[10px] font-bold text-[#00695C] bg-[#E8F4F2] hover:bg-[#C5EDE5] flex items-center gap-1">
                    <FiShield className="text-[10px]" /> Review
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {customerDocs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E8F0EE]">
          <FiShield className="text-4xl text-[#8FA8A4] mb-3" />
          <h3 className="text-lg font-black text-[#0F1A18]">No customers to verify</h3>
        </div>
      )}

      {/* ============================================================
          REVIEW VERIFICATION MODAL — 2-column grid, NO action buttons
      ============================================================ */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl animate-slide-up flex flex-col">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 rounded-t-3xl z-10 shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
                  <FiShield className="text-sm" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    {selectedCustomer.name}'s Verification
                  </h2>
                  <p className="text-white/90 text-[10px]">
                    {selectedCustomer.docs.length} documents
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomerId(null)}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
              >
                <FiX className="text-sm" />
              </button>
            </div>

            {/* Body — 2-column grid */}
            <div className="flex-1 overflow-y-auto p-6 bg-[#F8FAF9]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedCustomer.docs.map((doc) => (
                  <div key={doc.id} className="border border-[#E8F0EE] rounded-2xl p-4 bg-white">
                    {/* Doc header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-[#1A2E2A] truncate">{doc.label}</h4>
                        <p className="text-[11px] text-[#3D5A55] truncate">{doc.number}</p>
                      </div>
                      <StatusBadge status={doc.status} />
                    </div>

                    {/* Preview + view/download */}
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-[#E8F0EE] flex-shrink-0">
                        <img src={doc.url} alt={doc.label} className="w-full h-full object-cover" />
                      </div>
                      <button
                        onClick={() => window.open(doc.url, '_blank')}
                        className="w-8 h-8 rounded-lg hover:bg-[#F5F9F8] flex items-center justify-center text-[#00695C]"
                      >
                        <FiEye className="text-sm" />
                      </button>
                      <button
                        onClick={() => window.open(doc.url, '_blank')}
                        className="w-8 h-8 rounded-lg hover:bg-[#F5F9F8] flex items-center justify-center text-[#00695C]"
                      >
                        <FiDownload className="text-sm" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// ACTIVITY TAB
// ============================================================
const ActivityTab = ({ customerType, customers, showToast, dateRangeLabel }) => {
  const [viewingCustomerId, setViewingCustomerId] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('saved');

  const viewingCustomer = useMemo(
    () => customers.find(c => c.id === viewingCustomerId) || null,
    [customers, viewingCustomerId]
  );

  useEffect(() => {
    setViewingCustomerId(null);
  }, [customers, customerType]);

  const config = CUSTOMER_TYPE_CONFIG[customerType];

  // ✅ FiKey is now properly imported at the top
  const subTabs = [
    { id: 'saved', label: 'Saved', icon: FiBookmark, color: '#8B5CF6' },
    { id: 'wishlist', label: 'Wishlist', icon: FiHeart, color: '#EC4899' },
    { id: 'purchases', label: 'Purchases', icon: FiHome, color: '#10B981' },
    { id: 'rentals', label: 'Rentals', icon: FiKey, color: '#3B82F6' },
    { id: 'enquiries', label: 'Enquiries', icon: FiMessageSquare, color: '#06B6D4' }
  ];

  const getSubTabValue = (customer, subTab) => {
    switch (subTab) {
      case 'saved': return customer.activity?.savedProperties || 0;
      case 'wishlist': return customer.activity?.wishlist || 0;
      case 'purchases': return customer.activity?.purchaseRequests || 0;
      case 'rentals': return customer.activity?.rentalApplications || 0;
      case 'enquiries': return customer.activity?.enquiries || 0;
      default: return 0;
    }
  };

  const totalValue = (subTab) => customers.reduce((sum, c) => sum + getSubTabValue(c, subTab), 0);

  return (
    <div className="space-y-4">
      {/* Sub Tabs */}
      <div className="bg-white rounded-2xl p-2 border border-[#E8F0EE] shadow-sm flex items-center gap-1 overflow-x-auto">
        {subTabs.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeSubTab === tab.id;
          const count = totalValue(tab.id);
          return (
            <button key={tab.id} onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${isActive ? `bg-gradient-to-r ${config.gradient} text-white shadow-md` : 'text-[#3D5A55] hover:bg-[#F5F9F8]'}`}>
              <TabIcon className="text-sm" /> {tab.label}
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-[#F5F9F8] text-[#3D5A55]'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl p-3 border border-[#E8F0EE] shadow-sm flex items-center gap-3">
        <span className="px-3 py-1.5 bg-[#E8F4F2] text-[#00695C] text-xs font-black rounded-xl">
          {customers.length} {customerType}s
        </span>
        <span className="text-[10px] text-[#3D5A55] font-semibold flex items-center gap-1">
          <FiCalendar className="text-[#00695C]" /> {dateRangeLabel}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {customers.map((customer, index) => {
          const value = getSubTabValue(customer, activeSubTab);
          return (
            <div key={customer.id} className="bg-white rounded-2xl border border-[#E8F0EE] p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 animate-card-in"
              style={{ animationDelay: `${index * 30}ms` }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold flex-shrink-0" style={{ background: config.color }}>
                  {customer.avatar}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-[#0F1A18] truncate">{customer.name}</h4>
                  <p className="text-[10px] text-[#3D5A55] truncate">{customer.city}</p>
                </div>
              </div>

              <div className="text-center p-3 bg-[#F5F9F8] rounded-xl mb-3">
                <p className="text-2xl font-black" style={{ color: config.color }}>{value}</p>
                <p className="text-[9px] text-[#3D5A55] uppercase tracking-wider font-bold mt-1">
                  {subTabs.find(t => t.id === activeSubTab)?.label}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center">
                  <p className="text-sm font-black text-[#0F1A18]">{customer.activity?.viewedProperties || 0}</p>
                  <p className="text-[8px] text-[#3D5A55] uppercase tracking-wider font-bold">Viewed</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-black text-[#0F1A18]">{customer.activity?.siteVisits || 0}</p>
                  <p className="text-[8px] text-[#3D5A55] uppercase tracking-wider font-bold">Visits</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-black text-[#0F1A18]">{customer.activity?.offersSubmitted || 0}</p>
                  <p className="text-[8px] text-[#3D5A55] uppercase tracking-wider font-bold">Offers</p>
                </div>
              </div>

              <button onClick={() => setViewingCustomerId(customer.id)}
                className="w-full py-2 text-xs font-bold text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] flex items-center justify-center gap-1.5">
                <FiEye className="text-[10px]" /> View Activity Details
              </button>
            </div>
          );
        })}
      </div>

      {customers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E8F0EE]">
          <FiActivity className="text-4xl text-[#8FA8A4] mb-3" />
          <h3 className="text-lg font-black text-[#0F1A18]">No activity data</h3>
        </div>
      )}

      {viewingCustomer && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl animate-slide-up flex flex-col">
            <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 rounded-t-3xl z-10 shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white"><FiActivity className="text-sm" /></div>
                <div>
                  <h2 className="text-base font-bold text-white">{viewingCustomer.name}'s Activity</h2>
                  <p className="text-white/90 text-[10px]">Complete activity breakdown</p>
                </div>
              </div>
              <button onClick={() => setViewingCustomerId(null)} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white">
                <FiX className="text-sm" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#F8FAF9]">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <MiniStat label="Viewed" value={viewingCustomer.activity?.viewedProperties || 0} color="#3B82F6" />
                <MiniStat label="Saved" value={viewingCustomer.activity?.savedProperties || 0} color="#8B5CF6" />
                <MiniStat label="Wishlist" value={viewingCustomer.activity?.wishlist || 0} color="#EC4899" />
                <MiniStat label="Enquiries" value={viewingCustomer.activity?.enquiries || 0} color="#06B6D4" />
                <MiniStat label="Site Visits" value={viewingCustomer.activity?.siteVisits || 0} color="#F59E0B" />
                <MiniStat label="Purchases" value={viewingCustomer.activity?.purchaseRequests || 0} color="#10B981" />
                <MiniStat label="Offers" value={viewingCustomer.activity?.offersSubmitted || 0} color="#6366F1" />
                <MiniStat label="Leads" value={viewingCustomer.activity?.leadHistory || 0} color="#F97316" />
                {(customerType === 'Tenant' || customerType === 'Buyer & Tenant') && (
                  <>
                    <MiniStat label="Rentals" value={viewingCustomer.activity?.rentalApplications || 0} color="#14B8A6" />
                    <MiniStat label="Active Leases" value={viewingCustomer.activity?.activeLeases || 0} color="#84CC16" />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================
const CustomerManagement = () => {
  const [activeCustomerType, setActiveCustomerType] = useState('Buyer');
  const [activeView, setActiveView] = useState('overview');
  const [activeTab, setActiveTab] = useState('registrations');
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  // Confirmation modal state
  const [confirmAction, setConfirmAction] = useState(null);

  // Date range state
  const [datePreset, setDatePreset] = useState('month');
  const [customStart, setCustomStart] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [customEnd, setCustomEnd] = useState(new Date());

  const [customers, setCustomers] = useState({
    'Buyer': [], 'Tenant': [], 'Buyer & Tenant': []
  });
  const [customerTypeStats, setCustomerTypeStats] = useState({});

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  }, []);

  useEffect(() => {
    const newCustomers = {};
    const newStats = {};
    ALL_CUSTOMER_TYPES.forEach(type => {
      const customerList = generateMockCustomers(type, Math.floor(Math.random() * 20) + 15, datePreset, customStart, customEnd);
      newCustomers[type] = customerList;
      newStats[type] = buildCustomerTypeStats(type, customerList, datePreset);
    });
    setCustomers(newCustomers);
    setCustomerTypeStats(newStats);
  }, [datePreset, customStart, customEnd]);

  useEffect(() => {
    setSearchQuery('');
    setSelectedStatus('all');
    setActiveTab('registrations');
  }, [activeCustomerType]);

  const currentCustomers = customers[activeCustomerType] || [];
  const currentStats = customerTypeStats[activeCustomerType] || {};
  const currentConfig = CUSTOMER_TYPE_CONFIG[activeCustomerType];
  const dateRangeLabel = getDateRangeLabel(datePreset, customStart, customEnd);

  const requestToggleBlock = useCallback((customer) => {
    const isBlocked = customer.status === 'blocked';
    setConfirmAction({
      customer,
      isBlocked,
      title: isBlocked ? 'Unblock Customer?' : 'Block Customer?',
      message: isBlocked
        ? `Are you sure you want to unblock ${customer.name}? They will regain access to the platform.`
        : `Are you sure you want to block ${customer.name}? They will lose access to the platform immediately.`,
      confirmText: isBlocked ? 'Yes, Unblock' : 'Yes, Block',
      cancelText: 'No, Cancel',
      type: isBlocked ? 'success' : 'danger',
      icon: isBlocked ? FiUnlock : FiLock
    });
  }, []);

  const executeToggleBlock = useCallback(() => {
    if (!confirmAction) return;
    const { customer, isBlocked } = confirmAction;

    setCustomers(prev => {
      const updatedList = prev[activeCustomerType].map(c =>
        c.id === customer.id ? { ...c, status: isBlocked ? 'active' : 'blocked' } : c
      );
      const updated = { ...prev, [activeCustomerType]: updatedList };
      setCustomerTypeStats(prevStats => ({
        ...prevStats,
        [activeCustomerType]: buildCustomerTypeStats(activeCustomerType, updatedList, datePreset)
      }));
      return updated;
    });

    showToast(`${customer.name} ${isBlocked ? 'unblocked' : 'blocked'}`, isBlocked ? 'success' : 'warning');
    setConfirmAction(null);
  }, [confirmAction, activeCustomerType, datePreset, showToast]);

  const handleRefresh = useCallback(() => {
    setActionLoading('refresh');
    setTimeout(() => {
      const newCustomers = generateMockCustomers(activeCustomerType, Math.floor(Math.random() * 20) + 15, datePreset, customStart, customEnd);
      setCustomers(prev => ({ ...prev, [activeCustomerType]: newCustomers }));
      setCustomerTypeStats(prev => ({ ...prev, [activeCustomerType]: buildCustomerTypeStats(activeCustomerType, newCustomers, datePreset) }));
      setActionLoading(null);
      showToast('Data refreshed', 'success');
    }, 800);
  }, [activeCustomerType, datePreset, customStart, customEnd, showToast]);

  const tabs = [
    { id: 'registrations', label: 'Registrations', icon: FiUserPlus },
    { id: 'verification', label: 'Verification', icon: FiShield },
    { id: 'activity', label: 'Activity', icon: FiActivity }
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
              <span>Manage buyers, tenants, and combined customer profiles</span>
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

      {/* Customer Type Selector */}
      <div className="relative z-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ALL_CUSTOMER_TYPES.map((type, idx) => {
            const config = CUSTOMER_TYPE_CONFIG[type];
            const Icon = config.icon;
            const isActive = activeCustomerType === type;
            return (
              <div key={type} onClick={() => setActiveCustomerType(type)}
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
                  <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-[#0F1A18]'}`}>{customers[type]?.length || 0} customers</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {activeView === 'overview' ? (
        <OverviewTab
          key={`overview-${activeCustomerType}-${datePreset}`}
          activeCustomerType={activeCustomerType}
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

          <div key={`tab-content-${activeCustomerType}-${activeTab}-${datePreset}`}>
            {activeTab === 'registrations' && (
              <RegistrationsTab
                customerType={activeCustomerType}
                customers={currentCustomers}
                onToggleBlock={requestToggleBlock}
                actionLoading={actionLoading}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                viewMode={viewMode}
                setViewMode={setViewMode}
                dateRangeLabel={dateRangeLabel}
              />
            )}
            {activeTab === 'verification' && (
              <VerificationTab
                customerType={activeCustomerType}
                customers={currentCustomers}
                showToast={showToast}
                viewMode={viewMode}
                setViewMode={setViewMode}
                dateRangeLabel={dateRangeLabel}
              />
            )}
            {activeTab === 'activity' && (
              <ActivityTab
                customerType={activeCustomerType}
                customers={currentCustomers}
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