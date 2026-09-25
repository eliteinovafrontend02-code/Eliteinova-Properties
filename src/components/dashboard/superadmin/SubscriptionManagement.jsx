// src/components/dashboard/admin/superadmin/SubscriptionManagement.jsx

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  FiUsers, FiUser, FiUserPlus, FiUserCheck, FiUserX, FiSearch,
  FiChevronDown, FiChevronUp, FiChevronLeft, FiChevronRight, FiEye,
  FiEdit, FiEdit3, FiTrash2, FiLock, FiUnlock, FiCheckCircle, FiXCircle, FiClock,
  FiMail, FiPhone, FiMapPin, FiCalendar, FiShield, FiActivity,
  FiRefreshCw, FiDownload, FiInfo, FiAlertTriangle, FiPlus,
  FiExternalLink, FiGrid, FiList, FiX, FiAward, FiBriefcase,
  FiHome, FiDollarSign, FiSquare, FiMinimize, FiTrendingUp,
  FiArrowUp, FiArrowDown, FiPercent, FiLayers, FiMap, FiPieChart,
  FiBarChart2, FiGlobe, FiZap, FiBox, FiClipboard, FiFileText,
  FiPackage, FiCreditCard, FiSave, FiTool, FiRotateCcw,
  FiCheckSquare, FiPlayCircle, FiDatabase, FiFilter,
  FiStar, FiGift, FiSettings, FiMinus, FiHash, FiTag, FiCheck
} from 'react-icons/fi';
import {
  FaHome, FaHardHat, FaCheck, FaStar as FaStarSolid, FaCrown,
  FaGem, FaHotel, FaBriefcase, FaBuilding, FaUserTie, FaCity
} from 'react-icons/fa';
import { MdOutlineManageAccounts, MdOutlineBusiness } from 'react-icons/md';

// ============================================================
// CONSTANTS
// ============================================================
const UNIQUE_COLORS = [
  '#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899',
  '#06B6D4', '#EF4444', '#84CC16', '#F97316', '#6366F1',
  '#14B8A6', '#A855F7', '#EAB308', '#0EA5E9', '#F43F5E'
];

const PLAN_COLORS = {
  'Free': { bg: '#F3F4F6', text: '#374151', border: '#D1D5DB', icon: FiGift },
  'Silver': { bg: '#F1F5F9', text: '#334155', border: '#CBD5E1', icon: FiAward },
  'Gold': { bg: '#FEF3C7', text: '#B45309', border: '#FCD34D', icon: FaCrown },
  'Platinum': { bg: '#EDE9FE', text: '#6D28D9', border: '#C4B5FD', icon: FaGem },
  'Basic': { bg: '#DBEAFE', text: '#1D4ED8', border: '#93C5FD', icon: FiGift },
  'Professional': { bg: '#E0E7FF', text: '#4338CA', border: '#A5B4FC', icon: FiAward },
  'Enterprise': { bg: '#FCE7F3', text: '#BE185D', border: '#F9A8D4', icon: FaGem },
  'Premium': { bg: '#FFEDD5', text: '#C2410C', border: '#FDBA74', icon: FaCrown },
  'Standard': { bg: '#CCFBF1', text: '#0F766E', border: '#5EEAD4', icon: FiGift },
  'Business': { bg: '#CFFAFE', text: '#0E7490', border: '#67E8F9', icon: FiAward }
};

const getPlanStyle = (planName) => {
  return PLAN_COLORS[planName] || {
    bg: '#F3F4F6', text: '#374151', border: '#D1D5DB', icon: FiPackage
  };
};

const SUBSCRIPTION_TYPE_CONFIG = {
  'Owner': {
    icon: FaHome,
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    gradient: 'from-emerald-800 to-teal-600',
    color: '#10B981',
    description: 'Manage subscription plans for property owners',
    planKey: 'owner'
  },
  'Agent': {
    icon: FiBriefcase,
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    gradient: 'from-blue-600 via-blue-500 to-indigo-400',
    color: '#3B82F6',
    description: 'Manage subscription plans for real estate agents',
    planKey: 'agent'
  },
  'Builder': {
    icon: FaHardHat,
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    gradient: 'from-orange-600 via-orange-500 to-amber-400',
    color: '#F97316',
    description: 'Manage subscription plans for property builders',
    planKey: 'builder'
  },
  'Property Manager': {
    icon: FiClipboard,
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    gradient: 'from-purple-600 via-purple-500 to-violet-400',
    color: '#8B5CF6',
    description: 'Manage subscription plans for property managers',
    planKey: 'pm'
  }
};
const ALL_SUBSCRIPTION_TYPES = Object.keys(SUBSCRIPTION_TYPE_CONFIG);

const ALL_PROPERTY_TYPES = ['Individual', 'Apartment', 'Commercial', 'Land & Plots', 'Hostel'];

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
  try {
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return 'N/A';
  }
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

const seededRandom = (seed) => {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

const seedFromString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 2147483647;
  }
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
// PLAN GENERATORS BY TYPE
// ============================================================
const OWNER_PLANS = {
  'Free': {
    id: 'plan_free', name: 'Free', icon: FiGift, colorHex: '#7FAF9E', label: 'Free',
    price: 0, billingCycle: 'monthly',
    description: 'Basic starter plan for individual property owners to get started',
    features: ['List up to 2 properties', 'Basic search visibility', 'Email support', '30-day listing duration'],
    isActive: true, createdAt: '2024-01-01'
  },
  'Silver': {
    id: 'plan_silver', name: 'Silver', icon: FiAward, colorHex: '#475569', label: 'Silver',
    price: 499, billingCycle: 'monthly',
    description: 'Great for small property owners and independent agents',
    features: ['List up to 10 properties', 'Standard search visibility', 'Priority email support', '90-day listing duration', '5 featured listings per month', 'Basic analytics dashboard'],
    isActive: true, createdAt: '2024-01-01'
  },
  'Gold': {
    id: 'plan_gold', name: 'Gold', icon: FaCrown, colorHex: '#D97706', label: 'Gold',
    price: 1499, billingCycle: 'monthly',
    description: 'Best for growing real estate businesses and agencies',
    features: ['List up to 50 properties', 'High search visibility', 'Phone & email support', '180-day listing duration', '20 featured listings per month', 'Advanced analytics dashboard', 'Verified badge', 'Priority customer support'],
    isActive: true, createdAt: '2024-01-01'
  },
  'Platinum': {
    id: 'plan_platinum', name: 'Platinum', icon: FaGem, colorHex: '#9333EA', label: 'Platinum',
    price: 2999, billingCycle: 'monthly',
    description: 'Premium plan for large agencies and enterprise clients',
    features: ['Unlimited property listings', 'Top search visibility & ranking', '24/7 dedicated support', '365-day listing duration', 'Unlimited featured listings', 'Premium analytics & reports', 'Verified business badge', 'Dedicated account manager', 'API access', 'Custom branding options'],
    isActive: true, createdAt: '2024-01-01'
  }
};

const AGENT_PLANS = {
  'Basic': {
    id: 'plan_basic', name: 'Basic', icon: FiGift, colorHex: '#64748B', label: 'Basic',
    price: 0, billingCycle: 'monthly',
    description: 'Basic starter plan for individual agents to get started with property listings',
    features: ['List up to 5 properties', 'Basic search visibility', 'Email support', '30-day listing duration', 'Basic analytics dashboard'],
    isActive: true, createdAt: '2024-01-01'
  },
  'Professional': {
    id: 'plan_professional', name: 'Professional', icon: FiAward, colorHex: '#2563EB', label: 'Professional',
    price: 999, billingCycle: 'monthly',
    description: 'Best for professional agents and growing real estate businesses',
    features: ['List up to 25 properties', 'High search visibility', 'Phone & email support', '90-day listing duration', '10 featured listings per month', 'Advanced analytics dashboard', 'Verified badge', 'Priority customer support', 'Lead management tools'],
    isActive: true, createdAt: '2024-01-01'
  },
  'Enterprise': {
    id: 'plan_enterprise', name: 'Enterprise', icon: FaCrown, colorHex: '#9333EA', label: 'Enterprise',
    price: 2999, billingCycle: 'monthly',
    description: 'Premium plan for large agencies and enterprise clients with unlimited access',
    features: ['Unlimited property listings', 'Top search visibility & ranking', '24/7 dedicated support', '365-day listing duration', 'Unlimited featured listings', 'Premium analytics & reports', 'Verified business badge', 'Dedicated account manager', 'API access', 'Custom branding options', 'Team collaboration tools', 'White-label solutions'],
    isActive: true, createdAt: '2024-01-01'
  }
};

const BUILDER_PLANS = {
  'Basic': {
    id: 'plan_basic', name: 'Basic', icon: FiAward, colorHex: '#64748B', label: 'Basic',
    price: 0, billingCycle: 'monthly',
    description: 'Basic starter plan for individual builders to list projects and get started',
    features: ['List up to 3 projects', 'Basic search visibility', 'Email support', '60-day listing duration', 'Basic project analytics'],
    isActive: true, createdAt: '2024-01-01'
  },
  'Premium': {
    id: 'plan_premium', name: 'Premium', icon: FaCrown, colorHex: '#D97706', label: 'Premium',
    price: 2499, billingCycle: 'monthly',
    description: 'Best for growing builders and construction companies with multiple projects',
    features: ['List up to 15 projects', 'High search visibility', 'Phone & email support', '180-day listing duration', '10 featured projects per month', 'Advanced analytics dashboard', 'Verified builder badge', 'Priority customer support', 'Lead management tools', 'Project showcase page'],
    isActive: true, createdAt: '2024-01-01'
  },
  'Enterprise': {
    id: 'plan_enterprise', name: 'Enterprise', icon: FaGem, colorHex: '#9333EA', label: 'Enterprise',
    price: 5999, billingCycle: 'monthly',
    description: 'Premium plan for large construction firms and enterprise builders with unlimited access',
    features: ['Unlimited project listings', 'Top search visibility & ranking', '24/7 dedicated support', '365-day listing duration', 'Unlimited featured projects', 'Premium analytics & reports', 'Verified business badge', 'Dedicated account manager', 'API access', 'Custom branding options', 'Team collaboration tools', 'White-label solutions', 'Virtual tour integration', 'CRM integration'],
    isActive: true, createdAt: '2024-01-01'
  }
};

const PM_PLANS = {
  'Standard': {
    id: 'plan_standard', name: 'Standard', icon: FiAward, colorHex: '#64748B', label: 'Standard',
    price: 0, billingCycle: 'monthly',
    description: 'Standard starter plan for individual property managers to manage properties efficiently',
    features: ['Manage up to 5 properties', 'Basic tenant management', 'Email support', 'Rent tracking', 'Maintenance requests', 'Basic reports'],
    isActive: true, createdAt: '2024-01-01'
  },
  'Business': {
    id: 'plan_business', name: 'Business', icon: FaCrown, colorHex: '#D97706', label: 'Business',
    price: 1999, billingCycle: 'monthly',
    description: 'Best for growing property management businesses handling multiple properties',
    features: ['Manage up to 25 properties', 'Advanced tenant management', 'Phone & email support', 'Automated rent collection', 'Maintenance tracking & scheduling', 'Advanced analytics dashboard', 'Document management', 'Priority customer support', 'Tenant screening tools', 'Lease management'],
    isActive: true, createdAt: '2024-01-01'
  },
  'Enterprise': {
    id: 'plan_enterprise', name: 'Enterprise', icon: FaGem, colorHex: '#9333EA', label: 'Enterprise',
    price: 4999, billingCycle: 'monthly',
    description: 'Premium plan for large property management firms with unlimited properties and advanced features',
    features: ['Unlimited property management', 'Enterprise-grade tenant management', '24/7 dedicated support', 'Automated rent collection & invoicing', 'Predictive maintenance scheduling', 'Premium analytics & custom reports', 'Document management with e-signatures', 'Dedicated account manager', 'API access', 'Custom branding options', 'Team collaboration tools', 'White-label solutions', 'Owner portal access', 'Multi-property portfolio dashboard'],
    isActive: true, createdAt: '2024-01-01'
  }
};

const PLANS_BY_TYPE = {
  'Owner': OWNER_PLANS,
  'Agent': AGENT_PLANS,
  'Builder': BUILDER_PLANS,
  'Property Manager': PM_PLANS
};

// ============================================================
// SUBSCRIBER DATA GENERATOR
// ============================================================
const generateMockSubscribers = (type, planNames, count = 20, dateRange = 'month', customStart, customEnd) => {
  const firstNames = ['Arun', 'Priya', 'Karthik', 'Divya', 'Suresh', 'Meena', 'Ravi', 'Anitha', 'Vijay', 'Lakshmi', 'Prakash', 'Deepa', 'Manoj', 'Kavya', 'Sanjay', 'Roopa', 'Arjun', 'Nisha'];
  const lastNames = ['Kumar', 'Sharma', 'Reddy', 'Iyer', 'Nair', 'Menon', 'Rao', 'Pillai', 'Gupta', 'Patel', 'Singh', 'Verma'];
  const states = ['Tamil Nadu', 'Karnataka', 'Telangana', 'Maharashtra', 'Delhi', 'West Bengal', 'Gujarat', 'Kerala'];
  const districts = ['Chennai', 'Bengaluru Urban', 'Hyderabad', 'Mumbai Suburban', 'New Delhi', 'Kolkata', 'Ahmedabad', 'Ernakulam'];
  const cities = ['Chennai', 'Bangalore', 'Hyderabad', 'Mumbai', 'Delhi', 'Kolkata', 'Ahmedabad', 'Kochi'];
  const areas = ['Adyar', 'Koramangala', 'Jubilee Hills', 'Bandra', 'Connaught Place', 'Salt Lake', 'Vastrapur', 'Kakkanad'];
  const streets = ['1st Cross Street', 'MG Road', 'Lake View Lane', 'Garden Street', 'Park Avenue', 'Hill Road', 'Church Street', 'Palm Grove Road'];
  const country = 'India';
  const propertyTypes = ALL_PROPERTY_TYPES;

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

  const list = [];
  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const subscriptionPlan = planNames[Math.floor(Math.random() * planNames.length)];
    const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
    const pincode = String(600000 + Math.floor(Math.random() * 99999));
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * maxDaysBack));

    list.push({
      id: `${type.toLowerCase().replace(/\s+/g, '_')}_${i}_${Date.now()}`,
      ownerId: `${type.slice(0, 3).toUpperCase()}-${String(i).padStart(4, '0')}`,
      name,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
      phone: `+91 ${String(9000000000 + Math.floor(Math.random() * 999999999)).slice(0, 10)}`,
      propertyType,
      subscriptionPlan,
      street: streets[Math.floor(Math.random() * streets.length)],
      area: areas[Math.floor(Math.random() * areas.length)],
      city: cities[Math.floor(Math.random() * cities.length)],
      district: districts[Math.floor(Math.random() * districts.length)],
      state: states[Math.floor(Math.random() * states.length)],
      country,
      pincode,
      revenue: Math.floor(Math.random() * 5000000) + 100000,
      commission: Math.floor(Math.random() * 3000000) + 200000,
      registrationDate: date.toISOString(),
      type
    });
  }
  return list;
};

// ============================================================
// BUILD STATS FOR TYPE
// ============================================================
const buildSubscriptionStats = (type, subscriberList, planTypes, datePreset = 'month') => {
  const planNames = Object.keys(planTypes);
  const growthLabels = generateTimeSeriesLabels(datePreset);
  const growthSeed = seedFromString(`${type}_${datePreset}_growth`);
  const monthlyGrowth = generateGrowthSeries(growthLabels, growthSeed);

  const totalRevenue = subscriberList.reduce((sum, s) => sum + s.revenue, 0);
  const totalCommission = subscriberList.reduce((sum, s) => sum + s.commission, 0);

  return {
    total: subscriberList.length,
    totalRevenue,
    totalCommission,
    avgRevenue: subscriberList.length > 0 ? Math.floor(totalRevenue / subscriberList.length) : 0,
    planDistribution: planNames.map((plan, idx) => ({
      label: plan,
      value: subscriberList.filter(s => s.subscriptionPlan === plan).length,
      color: UNIQUE_COLORS[idx % UNIQUE_COLORS.length]
    })),
    revenueByPlan: planNames.map((plan, idx) => ({
      label: plan,
      value: subscriberList.filter(s => s.subscriptionPlan === plan).reduce((sum, s) => sum + s.revenue, 0),
      color: UNIQUE_COLORS[idx % UNIQUE_COLORS.length]
    })),
    monthlyGrowth
  };
};

// ============================================================
// TOAST COMPONENT
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
// CONFIRMATION MODAL
// ============================================================
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText, type = 'danger' }) => {
  if (!isOpen) return null;

  const typeStyles = {
    danger: { icon: 'text-red-600', bg: 'bg-red-50', button: 'bg-red-600 hover:bg-red-700', border: 'border-red-200' },
    warning: { icon: 'text-amber-600', bg: 'bg-amber-50', button: 'bg-amber-600 hover:bg-amber-700', border: 'border-amber-200' },
    info: { icon: 'text-blue-600', bg: 'bg-blue-50', button: 'bg-blue-600 hover:bg-blue-700', border: 'border-blue-200' }
  };

  const style = typeStyles[type] || typeStyles.danger;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl animate-slide-up border border-[#E8F0EE] overflow-hidden">
        <div className={`p-6 ${style.bg} border-b ${style.border}`}>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full ${style.bg} flex items-center justify-center border ${style.border}`}>
              <FiAlertTriangle className={`text-2xl ${style.icon}`} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1A2E2A]">{title || 'Confirm Action'}</h3>
              <p className="text-sm text-[#5A7D78]">{message || 'Are you sure you want to proceed?'}</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <p className="text-sm text-[#5A7D78] leading-relaxed">This action cannot be undone. Please confirm your decision.</p>
        </div>
        <div className="px-6 py-4 bg-[#F8FAF9] border-t border-[#E8F0EE] flex items-center gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-white text-[#1A2E2A] rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 text-sm font-medium border border-[#E8F0EE] hover:scale-[1.02]">
            {cancelText || 'Cancel'}
          </button>
          <button onClick={() => { onConfirm(); onClose(); }} className={`flex-1 px-4 py-2.5 text-white rounded-xl transition-all duration-300 text-sm font-medium shadow-lg hover:scale-[1.02] ${style.button}`}>
            {confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// STAT CARD COMPONENT
// ============================================================
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

// ============================================================
// DONUT CHART COMPONENT
// ============================================================
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
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={d.color}
                strokeWidth={isHovered ? thickness + 10 : thickness}
                strokeDasharray={`${segmentLength * animationProgress} ${circumference - segmentLength * animationProgress}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
                className="transition-all duration-500 cursor-pointer"
                style={{ filter: isHovered ? `drop-shadow(0 0 12px ${d.color})` : 'none', opacity: hoveredIndex !== null && !isHovered ? 0.35 : 1 }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
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
            <div
              key={i}
              className={`flex items-center justify-between text-xs p-2.5 rounded-xl transition-all cursor-pointer border ${isHovered ? 'bg-white shadow-md border-transparent' : 'border-transparent hover:bg-[#F5F9F8]'}`}
              style={{ borderLeftWidth: '4px', borderLeftColor: d.color }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                <span className="font-bold truncate text-[#1A2E2A]">{d.label}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ color: '#fff', backgroundColor: d.color }}>{pct}%</span>
                <span className="text-xs font-black text-[#0F1A18] min-w-[60px] text-right">{formatCompact(d.value)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================
// BAR CHART COMPONENT
// ============================================================
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
            <div
              key={i}
              className="flex-1 flex flex-col items-center justify-end group relative cursor-pointer"
              style={{ height: '100%' }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {isHovered && (
                <div className="absolute -top-12 z-20 pointer-events-none">
                  <div className="bg-[#0F1A18] text-white text-[11px] font-black px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl">
                    <div className="text-[9px] font-bold text-white/70 mb-0.5">{d.label}</div>
                    {formatCompact(d.value)}
                  </div>
                </div>
              )}
              <div
                className={`text-[9px] font-black px-1.5 py-0.5 rounded-md mb-1 ${isHovered ? 'opacity-100' : 'opacity-60'}`}
                style={{ color: d.color, backgroundColor: `${d.color}15` }}
              >
                {formatCompact(d.value)}
              </div>
              <div
                className="w-full rounded-t-lg transition-all duration-300"
                style={{
                  height: `${barHeight}px`,
                  background: `linear-gradient(180deg, ${d.color} 0%, ${d.color}80 100%)`,
                  transform: isHovered ? 'scaleX(1.08)' : 'scaleX(1)',
                  opacity: hoveredIndex !== null && !isHovered ? 0.4 : 1
                }}
              />
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

// ============================================================
// AREA CHART COMPONENT
// ============================================================
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

// ============================================================
// PROGRESS BAR COMPONENT
// ============================================================
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
        <div
          className="h-full rounded-full transition-all duration-1000 relative overflow-hidden"
          style={{ width: `${animatedPct}%`, background: `linear-gradient(90deg, ${color}, ${color}DD)` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  );
};

// ============================================================
// PLAN BADGE COMPONENT
// ============================================================
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
// FILTER DROPDOWN COMPONENT
// ============================================================
const FilterDropdown = ({ label, options, value, onChange, icon: Icon, allLabel = 'All' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : allLabel;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border transition-all duration-300 text-sm font-medium text-[#1A2E2A] hover:shadow-md ${
          value !== 'all' ? 'border-[#00695C] ring-2 ring-[#00695C]/20 bg-[#F5F9F8]' : 'border-[#E8F0EE] hover:border-[#00695C]/30'
        }`}
      >
        {Icon && <Icon className="text-sm text-[#5A7D78]" />}
        <span className="whitespace-nowrap">{label}:</span>
        <span className="font-semibold text-[#00695C]">{displayLabel}</span>
        <FiChevronDown className={`text-sm text-[#5A7D78] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E8F0EE] py-2 z-50 max-h-80 overflow-y-auto animate-slide-down">
          <button
            onClick={() => { onChange('all'); setIsOpen(false); }}
            className={`w-full px-4 py-2.5 text-left text-sm transition-all duration-200 flex items-center gap-2 hover:bg-[#F5F9F8] ${
              value === 'all' ? 'bg-[#E8F4F2] text-[#00695C] font-semibold' : 'text-[#1A2E2A]'
            }`}
          >
            <span className="w-4">{value === 'all' && <FiCheckCircle className="text-[#00695C] text-sm" />}</span>
            <span>{allLabel}</span>
          </button>
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => { onChange(option.value); setIsOpen(false); }}
              className={`w-full px-4 py-2.5 text-left text-sm transition-all duration-200 flex items-center gap-2 hover:bg-[#F5F9F8] ${
                value === option.value ? 'bg-[#E8F4F2] text-[#00695C] font-semibold' : 'text-[#1A2E2A]'
              }`}
            >
              <span className="w-4">{value === option.value && <FiCheckCircle className="text-[#00695C] text-sm" />}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
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
// VIEW SUBSCRIBER DETAIL MODAL  (REDESIGNED)
// ============================================================
const ViewSubscriberDetailModal = ({ subscriber, show, onClose, onDelete, planTypes }) => {
  if (!subscriber || !show) return null;

  const planConfig = planTypes[subscriber.subscriptionPlan] || { label: subscriber.subscriptionPlan, icon: FiPackage };
  const PlanIcon = planConfig.icon || FiPackage;
  const planStyle = getPlanStyle(subscriber.subscriptionPlan);
  const initial = (subscriber.name || '?').charAt(0).toUpperCase();

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">

        {/* Header */}
        <div className="relative p-6 shrink-0" style={{ background: `linear-gradient(135deg, ${planStyle.text} 0%, ${planStyle.border} 100%)` }}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl border-2 border-white/30"
              style={{ background: 'rgba(255,255,255,0.22)' }}
            >
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-black text-white truncate">{subscriber.name}</h2>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black border border-white/40"
                  style={{ background: 'rgba(255,255,255,0.25)', color: '#fff' }}
                >
                  <PlanIcon className="text-[11px]" />
                  {subscriber.subscriptionPlan}
                </span>
                <span className="text-white/80 text-xs font-bold">{subscriber.ownerId}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-white space-y-5">

          {/* Contact Information */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-[#00695C]" />
              <h4 className="text-[11px] font-black text-[#00695C] uppercase tracking-wider">Contact Information</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE]">
                <div className="w-9 h-9 rounded-lg bg-[#00695C]/10 flex items-center justify-center flex-shrink-0">
                  <FiMail className="text-[#00695C] text-base" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-[#5A7D78] uppercase tracking-wider">Email</p>
                  <p className="text-sm font-bold text-[#1A2E2A] truncate">{subscriber.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE]">
                <div className="w-9 h-9 rounded-lg bg-[#00695C]/10 flex items-center justify-center flex-shrink-0">
                  <FiPhone className="text-[#00695C] text-base" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-[#5A7D78] uppercase tracking-wider">Phone</p>
                  <p className="text-sm font-bold text-[#1A2E2A] truncate">{subscriber.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-[#F97316]" />
              <h4 className="text-[11px] font-black text-[#F97316] uppercase tracking-wider">Location</h4>
            </div>
            <div className="flex items-center gap-3 p-3.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE]">
              <div className="w-9 h-9 rounded-lg bg-[#F97316]/10 flex items-center justify-center flex-shrink-0">
                <FiMapPin className="text-[#F97316] text-base" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-[#5A7D78] uppercase tracking-wider">Full Address</p>
                <p className="text-sm font-bold text-[#1A2E2A]">
                  {[subscriber.street, subscriber.area, subscriber.city, subscriber.district, subscriber.state, subscriber.pincode, subscriber.country]
                    .filter(Boolean)
                    .join(', ')}
                </p>
              </div>
            </div>
          </div>

          {/* Subscription Details */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-[#8B5CF6]" />
              <h4 className="text-[11px] font-black text-[#8B5CF6] uppercase tracking-wider">Subscription Details</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE]">
                <div className="w-9 h-9 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center flex-shrink-0">
                  <PlanIcon className="text-[#8B5CF6] text-base" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-[#5A7D78] uppercase tracking-wider">Plan</p>
                  <p className="text-sm font-bold text-[#1A2E2A] truncate">{subscriber.subscriptionPlan}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE]">
                <div className="w-9 h-9 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center flex-shrink-0">
                  <FiPackage className="text-[#8B5CF6] text-base" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-[#5A7D78] uppercase tracking-wider">Property Type</p>
                  <p className="text-sm font-bold text-[#1A2E2A] truncate">{subscriber.propertyType}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-[#10B981]" />
              <h4 className="text-[11px] font-black text-[#10B981] uppercase tracking-wider">Revenue</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3.5 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl border border-emerald-200">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                  <FiTrendingUp className="text-emerald-600 text-base" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Total Revenue</p>
                  <p className="text-base font-black text-emerald-700">{formatCompact(subscriber.revenue)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3.5 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl border border-amber-200">
                <div className="w-9 h-9 rounded-lg bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                  <FiAward className="text-amber-600 text-base" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Commission</p>
                  <p className="text-base font-black text-amber-700">{formatCompact(subscriber.commission)}</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="sticky bottom-0 px-6 py-4 bg-white border-t border-[#E8F0EE] rounded-b-3xl shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-bold"
            >
              Close
            </button>
            <button
              onClick={() => { if (onDelete) { onDelete(subscriber.id); } }}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 text-sm font-bold shadow-lg shadow-red-600/30 hover:scale-[1.02]"
            >
              <FiTrash2 className="inline mr-2" /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// SUBSCRIBER GRID CARD
// ============================================================
const SubscriberCard = ({ subscriber, index, onView, onDelete, actionLoading }) => {
  const planStyle = getPlanStyle(subscriber.subscriptionPlan);
  const PlanIcon = planStyle.icon;

  return (
    <div
      className="bg-white rounded-2xl border border-[#E8F0EE] p-3.5 hover:shadow-xl hover:-translate-y-1 group animate-slide-in transition-all duration-500"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between mb-2 gap-1">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-9 h-9 rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${planStyle.text} 0%, ${planStyle.border} 100%)` }}
          >
            <PlanIcon className="text-sm" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-sm text-[#1A2E2A] truncate">{subscriber.name}</h3>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              <p className="text-[10px] font-medium text-[#5A7D78]">{subscriber.ownerId}</p>
              <span
                className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold leading-none border"
                style={{ background: planStyle.bg, color: planStyle.text, borderColor: planStyle.border }}
              >
                {subscriber.subscriptionPlan}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
          <FiMail className="text-[#00695C] flex-shrink-0" />
          <span className="truncate font-medium">{subscriber.email}</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
          <FiPhone className="text-[#00695C] flex-shrink-0" />
          <span className="truncate font-medium">{subscriber.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
          <FiMapPin className="text-[#00695C] flex-shrink-0" />
          <span className="truncate font-medium">{subscriber.area}, {subscriber.city}</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
          <FiTrendingUp className="text-[#00695C] flex-shrink-0" />
          <span className="truncate font-medium">Revenue: {formatCompact(subscriber.revenue)}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mt-2.5 pt-2.5 border-t border-[#E8F0EE]">
        <button
          type="button"
          onClick={() => onView(subscriber)}
          className="flex-1 py-1.5 text-xs font-semibold text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
        >
          <FiEye className="text-[10px]" /> View
        </button>
        <button
          type="button"
          onClick={() => onDelete(subscriber.id)}
          disabled={actionLoading === subscriber.id}
          className="flex-1 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50"
        >
          {actionLoading === subscriber.id ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiTrash2 className="text-[10px]" />}
          Delete
        </button>
      </div>
    </div>
  );
};

// ============================================================
// SUBSCRIBER LIST CARD
// ============================================================
const SubscriberListCard = ({ subscriber, index, onView, onDelete, actionLoading }) => {
  const planStyle = getPlanStyle(subscriber.subscriptionPlan);
  const PlanIcon = planStyle.icon;

  return (
    <div
      className="bg-white rounded-2xl border border-[#94e9d4] hover:shadow-lg transition-all duration-300 animate-card-in overflow-hidden"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-[#E8F0EE]">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-md flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${planStyle.text} 0%, ${planStyle.border} 100%)` }}
          >
            <PlanIcon className="text-lg" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-[15px] text-[#0F1A18] truncate">{subscriber.name}</h4>
              <PlanBadge plan={subscriber.subscriptionPlan} size="sm" />
            </div>
            <p className="text-[12px] text-[#3D5A55] font-medium mt-0.5 truncate">{subscriber.ownerId}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => onView(subscriber)}
            className="px-4 py-2 text-xs font-bold text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] flex items-center gap-1.5 transition"
          >
            <FiEye className="text-sm" /> View
          </button>
          <button
            onClick={() => onDelete(subscriber.id)}
            disabled={actionLoading === subscriber.id}
            className="px-4 py-2 text-xs font-bold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 flex items-center gap-1.5 transition disabled:opacity-50"
          >
            {actionLoading === subscriber.id ? <FiRefreshCw className="text-sm animate-spin" /> : <FiTrash2 className="text-sm" />}
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-5 py-4">
        <div className="min-w-0">
          <p className="text-[11px] font-black text-[#185d53] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <FiMail className="text-[13px] text-[#185d53]" /> Contact
          </p>
          <p className="text-[13px] font-semibold text-[#1A2E2A] truncate">{subscriber.email}</p>
          <p className="text-[12px] text-[#3D5A55] font-medium mt-0.5">{subscriber.phone}</p>
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-black text-[#185d53] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <FiMapPin className="text-[13px] text-[#185d53]" /> Location
          </p>
          <p className="text-[13px] font-semibold text-[#1A2E2A] truncate">{subscriber.city}</p>
          <p className="text-[12px] text-[#3D5A55] font-medium mt-0.5 truncate">{subscriber.state}</p>
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-black text-[#185d53] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <FiPackage className="text-[13px] text-[#185d53]" /> Property Type
          </p>
          <p className="text-[13px] font-semibold text-[#1A2E2A]">{subscriber.propertyType}</p>
          <p className="text-[12px] text-[#3D5A55] font-medium mt-0.5">{subscriber.district}</p>
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-black text-[#185d53] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <FiTrendingUp className="text-[13px] text-[#185d53]" /> Revenue
          </p>
          <p className="text-[15px] font-black text-[#00695C]">{formatCompact(subscriber.revenue)}</p>
          <p className="text-[12px] text-[#3D5A55] font-medium mt-0.5">Commission: {formatCompact(subscriber.commission)}</p>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// OVERVIEW TAB FOR SUBSCRIPTIONS
// ============================================================
const SubscriptionOverviewTab = ({ activeType, stats, config, dateRangeLabel, datePreset }) => {
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
        <StatCard
          icon={<FiUsers className="text-white text-base" />}
          title={`Total ${activeType}s`}
          value={stats.total || 0}
          trend={12.5}
          subtitle="All subscribers"
          color={`bg-gradient-to-br ${config.gradient}`}
          delay={0}
        />
        <StatCard
          icon={<FiDollarSign className="text-white text-base" />}
          title="Total Revenue"
          value={formatCompact(stats.totalRevenue || 0)}
          trend={15.2}
          subtitle="From subscriptions"
          color="bg-gradient-to-br from-emerald-600 to-teal-400"
          delay={100}
        />
        <StatCard
          icon={<FiTrendingUp className="text-white text-base" />}
          title="Avg Revenue"
          value={formatCompact(stats.avgRevenue || 0)}
          trend={8.3}
          subtitle="Per subscriber"
          color="bg-gradient-to-br from-amber-600 to-yellow-400"
          delay={200}
        />
        <StatCard
          icon={<FiAward className="text-white text-base" />}
          title="Commission"
          value={formatCompact(stats.totalCommission || 0)}
          trend={5.7}
          subtitle="Total earned"
          color="bg-gradient-to-br from-purple-600 to-violet-400"
          delay={300}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-black text-[#0F1A18] flex items-center gap-2">
                <Icon className="animate-icon-float" style={{ color: config.color }} />
                {activeType} Plan Distribution
              </h3>
              <p className="text-xs text-[#3D5A55] font-semibold">Subscriber distribution across plans</p>
            </div>
          </div>
          <DonutChart
            data={stats.planDistribution || []}
            size={240}
            thickness={52}
            centerLabel="Total"
            centerValue={stats.total || 0}
          />
        </div>
        <div className="bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm">
          <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
            <FiDollarSign className="text-[#00695C]" /> Revenue by Plan
          </h3>
          <BarChart data={stats.revenueByPlan || []} height={280} />
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
          <AreaChart data={stats.monthlyGrowth || []} height={280} color={config.color} />
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm">
          <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
            <FiPercent className="text-[#00695C]" /> Plan-wise Distribution
          </h3>
          <div className="space-y-3">
            {(stats.planDistribution || []).map((plan, i) => (
              <ProgressBar
                key={i}
                label={plan.label}
                value={plan.value}
                max={stats.total || 1}
                color={plan.color}
                icon={getPlanStyle(plan.label).icon}
                delay={i * 100}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================
const SubscriptionManagement = () => {
  const [activeType, setActiveType] = useState('Owner');
  const [activeView, setActiveView] = useState('overview');
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlanFilter, setSelectedPlanFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  const [datePreset, setDatePreset] = useState('month');
  const [customStart, setCustomStart] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [customEnd, setCustomEnd] = useState(new Date());

  const [plansByType, setPlansByType] = useState({
    'Owner': OWNER_PLANS,
    'Agent': AGENT_PLANS,
    'Builder': BUILDER_PLANS,
    'Property Manager': PM_PLANS
  });

  const [subscribersByType, setSubscribersByType] = useState({
    'Owner': [], 'Agent': [], 'Builder': [], 'Property Manager': []
  });

  const [statsByType, setStatsByType] = useState({});

  const [viewingSubscriber, setViewingSubscriber] = useState(null);
  const [showViewSubscriberModal, setShowViewSubscriberModal] = useState(false);

  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false, title: '', message: '', confirmText: 'Confirm', cancelText: 'Cancel', type: 'danger', onConfirm: null
  });

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  }, []);

  useEffect(() => {
    const newSubscribers = {};
    const newStats = {};

    ALL_SUBSCRIPTION_TYPES.forEach(type => {
      const planNames = Object.keys(plansByType[type]);
      const subscriberList = generateMockSubscribers(
        type,
        planNames,
        Math.floor(Math.random() * 20) + 15,
        datePreset,
        customStart,
        customEnd
      );
      newSubscribers[type] = subscriberList;
      newStats[type] = buildSubscriptionStats(type, subscriberList, plansByType[type], datePreset);
    });

    setSubscribersByType(newSubscribers);
    setStatsByType(newStats);
  }, [datePreset, customStart, customEnd, plansByType]);

  useEffect(() => {
    setSearchQuery('');
    setSelectedPlanFilter('all');
    setActiveView('overview');
  }, [activeType]);

  const currentPlans = plansByType[activeType] || {};
  const currentSubscribers = subscribersByType[activeType] || [];
  const currentStats = statsByType[activeType] || {};
  const currentConfig = SUBSCRIPTION_TYPE_CONFIG[activeType];
  const dateRangeLabel = getDateRangeLabel(datePreset, customStart, customEnd);

  // Build plan filter options from current plans
  const planFilterOptions = useMemo(() => {
    return Object.keys(currentPlans).map(planKey => ({
      value: planKey,
      label: currentPlans[planKey].label || planKey
    }));
  }, [currentPlans]);

  const filteredSubscribers = useMemo(() => {
    let filtered = [...currentSubscribers];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.phone.includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.subscriptionPlan.toLowerCase().includes(q)
      );
    }
    if (selectedPlanFilter && selectedPlanFilter !== 'all') {
      filtered = filtered.filter(s => s.subscriptionPlan === selectedPlanFilter);
    }
    return filtered;
  }, [currentSubscribers, searchQuery, selectedPlanFilter]);

  const handleViewSubscriber = useCallback((subscriber) => {
    setViewingSubscriber(subscriber);
    setShowViewSubscriberModal(true);
  }, []);

  const handleDeleteSubscriber = useCallback((subscriberId) => {
    const subscriber = currentSubscribers.find(s => s.id === subscriberId);
    if (!subscriber) return;

    setConfirmationModal({
      isOpen: true,
      title: 'Delete Subscriber',
      message: `Are you sure you want to delete subscriber "${subscriber.name}"?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: () => {
        setActionLoading(subscriberId);
        setTimeout(() => {
          setSubscribersByType(prev => ({
            ...prev,
            [activeType]: prev[activeType].filter(s => s.id !== subscriberId)
          }));
          setActionLoading(null);
          setShowViewSubscriberModal(false);
          showToast(`Deleted subscriber "${subscriber.name}"`, 'warning');
        }, 700);
      }
    });
  }, [currentSubscribers, activeType, showToast]);

  const handleRefresh = useCallback(() => {
    setActionLoading('refresh');
    setTimeout(() => {
      const planNames = Object.keys(currentPlans);
      const newSubscribers = generateMockSubscribers(
        activeType,
        planNames,
        Math.floor(Math.random() * 20) + 15,
        datePreset,
        customStart,
        customEnd
      );
      setSubscribersByType(prev => ({ ...prev, [activeType]: newSubscribers }));
      setStatsByType(prev => ({
        ...prev,
        [activeType]: buildSubscriptionStats(activeType, newSubscribers, currentPlans, datePreset)
      }));
      setActionLoading(null);
      showToast('Data refreshed', 'success');
    }, 800);
  }, [activeType, currentPlans, datePreset, customStart, customEnd, showToast]);

  const views = [
    { id: 'overview', label: 'Overview', icon: FiPieChart },
    { id: 'subscribers', label: 'Subscribers', icon: FiUsers }
  ];

  return (
    <div className="space-y-6 p-4 lg:p-6 min-h-screen bg-[#F8FAF9]">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-[500px] h-[500px] rounded-full blur-3xl animate-float bg-[#00695C]/5" />
        <div className="absolute -bottom-1/2 -left-1/2 w-[500px] h-[500px] rounded-full blur-3xl animate-float-delayed bg-[#26A69A]/5" />
      </div>

      <Toast toast={toast} setToast={setToast} />

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={() => { if (confirmationModal.onConfirm) confirmationModal.onConfirm(); }}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText={confirmationModal.confirmText}
        cancelText={confirmationModal.cancelText}
        type={confirmationModal.type}
      />

      {showViewSubscriberModal && viewingSubscriber && (
        <ViewSubscriberDetailModal
          subscriber={viewingSubscriber}
          show={showViewSubscriberModal}
          onClose={() => { setShowViewSubscriberModal(false); setViewingSubscriber(null); }}
          onDelete={handleDeleteSubscriber}
          planTypes={currentPlans}
        />
      )}

      {/* ============ HEADER (with Date Picker + View Tabs + Refresh) ============ */}
      <div className="relative z-50">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-[#00695C] via-[#26A69A] to-[#4DB6AC] bg-clip-text text-transparent">
                Subscription Management
              </h1>
              <span className="px-3 py-1.5 bg-gradient-to-r from-[#E8F4F2] to-[#D5F0EA] text-[#00695C] text-xs font-black rounded-full flex items-center gap-1.5">
                <FiActivity className="text-[10px]" /> Super Admin
              </span>
            </div>
            <p className="text-sm text-[#3D5A55] font-semibold flex items-center gap-2 flex-wrap">
              <span>Manage subscription plans and subscribers across all user types</span>
              <span className="w-1.5 h-1.5 bg-[#8FA8A4] rounded-full" />
              <span className="text-[#00695C] font-black flex items-center gap-1">
                <FiCalendar className="text-xs" /> {dateRangeLabel}
              </span>
            </p>
          </div>

          {/* Right side: Date Picker + View Tabs + Refresh */}
          <div className="flex items-center gap-2 w-full lg:w-auto flex-wrap justify-start lg:justify-end">

            {/* Date Range Picker */}
            <DateRangePicker
              selected={datePreset}
              onSelect={setDatePreset}
              customStart={customStart}
              customEnd={customEnd}
              onCustomChange={(start, end) => { setCustomStart(start); setCustomEnd(end); }}
            />

            {/* View Tabs (moved from below) */}
            <div className="flex items-center bg-white rounded-xl p-1 border border-[#E8F0EE] shadow-sm">
              {views.map((view) => {
                const ViewIcon = view.icon;
                const isActive = activeView === view.id;
                return (
                  <button
                    key={view.id}
                    onClick={() => setActiveView(view.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                      isActive
                        ? `bg-gradient-to-r ${currentConfig.gradient} text-white shadow-md`
                        : 'text-[#3D5A55] hover:bg-[#F5F9F8]'
                    }`}
                  >
                    <ViewIcon className="text-sm" /> {view.label}
                  </button>
                );
              })}
            </div>

            {/* Refresh */}
            <button
              onClick={handleRefresh}
              disabled={actionLoading === 'refresh'}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E8F0EE] rounded-xl text-sm font-black text-[#0F1A18] hover:scale-105 transition-all disabled:opacity-50"
            >
              <FiRefreshCw className={`text-sm ${actionLoading === 'refresh' ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{actionLoading === 'refresh' ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* User Type Selector */}
      <div className="relative z-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ALL_SUBSCRIPTION_TYPES.map((type, idx) => {
            const config = SUBSCRIPTION_TYPE_CONFIG[type];
            const Icon = config.icon;
            const isActive = activeType === type;
            const subscriberCount = subscribersByType[type]?.length || 0;
            const planCount = Object.keys(plansByType[type] || {}).length;

            return (
              <div
                key={type}
                onClick={() => setActiveType(type)}
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
                <h4 className={`text-md font-bold mb-1 ${isActive ? 'text-white' : 'text-[#0F1A18]'}`}>{type}</h4>
                <p className={`text-[11px] font-medium mb-2 ${isActive ? 'text-white/90' : 'text-[#3D5A55]'}`}>{config.description}</p>
                <div className={`flex items-center justify-between pt-2 border-t ${isActive ? 'border-white/20' : 'border-[#E8F0EE]'}`}>
                  <div className="flex items-center gap-1">
                    <FiPackage className={`text-xs ${isActive ? 'text-white/90' : 'text-[#3D5A55]'}`} />
                    <span className={`text-[10px] font-bold ${isActive ? 'text-white' : 'text-[#0F1A18]'}`}>{planCount} plans</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiUsers className={`text-xs ${isActive ? 'text-white/90' : 'text-[#3D5A55]'}`} />
                    <span className={`text-[10px] font-bold ${isActive ? 'text-white' : 'text-[#0F1A18]'}`}>{subscriberCount} subs</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Overview View */}
      {activeView === 'overview' && (
        <SubscriptionOverviewTab
          key={`overview-${activeType}-${datePreset}`}
          activeType={activeType}
          stats={currentStats}
          config={currentConfig}
          dateRangeLabel={dateRangeLabel}
          datePreset={datePreset}
        />
      )}

      {/* Subscribers View */}
      {activeView === 'subscribers' && (
        <div className="space-y-4">
          <div className="relative bg-white rounded-2xl p-4 shadow-sm border border-[#E8F0EE]">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
              {/* Search input */}
              <div className="flex-1 w-full relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm" />
                <input
                  type="text"
                  placeholder={`Search ${activeType.toLowerCase()}s...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none placeholder:text-[#B5C9C5]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#5A7D78] hover:text-[#1A2E2A] transition-colors hover:scale-110"
                  >
                    <FiX className="text-sm" />
                  </button>
                )}
              </div>

              {/* Plan filter dropdown */}
              <FilterDropdown
                label="Plan"
                options={planFilterOptions}
                value={selectedPlanFilter}
                onChange={setSelectedPlanFilter}
                icon={FiPackage}
                allLabel="All Plans"
              />

              <div className="flex items-center gap-2">
                <span className="px-3 py-2 bg-[#E8F4F2] text-[#00695C] text-xs font-black rounded-xl whitespace-nowrap">
                  {filteredSubscribers.length} subscribers
                </span>
                <div className="flex items-center bg-[#F5F9F8] rounded-xl p-1 border border-[#E8F0EE]">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#00695C]' : 'text-[#5A7D78]'}`}
                  >
                    <FiGrid className="text-sm" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${viewMode === 'list' ? 'bg-white shadow-sm text-[#00695C]' : 'text-[#5A7D78]'}`}
                  >
                    <FiList className="text-sm" />
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2 text-[10px] text-[#3D5A55] font-semibold">
              <FiCalendar className="text-[#00695C]" /> Showing subscribers from: {dateRangeLabel}
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
              {filteredSubscribers.map((subscriber, index) => (
                <SubscriberCard
                  key={subscriber.id}
                  subscriber={subscriber}
                  index={index}
                  onView={handleViewSubscriber}
                  onDelete={handleDeleteSubscriber}
                  actionLoading={actionLoading}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSubscribers.map((subscriber, index) => (
                <SubscriberListCard
                  key={subscriber.id}
                  subscriber={subscriber}
                  index={index}
                  onView={handleViewSubscriber}
                  onDelete={handleDeleteSubscriber}
                  actionLoading={actionLoading}
                />
              ))}
            </div>
          )}

          {filteredSubscribers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E8F0EE]">
              <div className="w-24 h-24 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4 animate-float">
                <FiUsers className="text-4xl text-[#8FA8A4]" />
              </div>
              <h3 className="text-xl font-black text-[#0F1A18]">No subscribers found</h3>
              <p className="text-sm text-[#3D5A55] mt-1 font-medium">Try adjusting your search, plan filter, or date range</p>
            </div>
          )}
        </div>
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

export default SubscriptionManagement;