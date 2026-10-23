// src/components/dashboard/admin/superadmin/PaymentsManagement.jsx

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  FiUsers, FiUser, FiSearch, FiChevronDown, FiChevronLeft, FiChevronRight,
  FiEye, FiTrash2, FiCheckCircle, FiXCircle, FiClock, FiMail, FiPhone,
  FiMapPin, FiCalendar, FiShield, FiActivity, FiRefreshCw, FiInfo,
  FiAlertTriangle, FiGrid, FiList, FiX, FiAward, FiBriefcase, FiHome,
  FiDollarSign, FiTrendingUp, FiArrowUp, FiArrowDown, FiPercent, FiMap,
  FiPieChart, FiBarChart2, FiTag, FiHash, FiServer, FiTarget,
  FiThumbsUp, FiMoreVertical, FiShoppingBag, FiKey, FiRotateCcw,
  FiCreditCard, FiEdit3, FiDatabase, FiChevronUp, FiClipboard, FiGlobe,
  FiZap, FiBox, FiLayers, FiPackage, FiTool
} from 'react-icons/fi';
import {
  FaHome, FaHardHat, FaHotel, FaCheck, FaStar as FaStarSolid, FaCrown,
  FaGem, FaBriefcase, FaCheckDouble, FaRupeeSign
} from 'react-icons/fa';

// ===============================
// CONSTANTS
// ===============================
const UNIQUE_COLORS = [
  '#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899',
  '#06B6D4', '#EF4444', '#84CC16', '#F97316', '#6366F1',
  '#14B8A6', '#A855F7', '#EAB308', '#0EA5E9', '#F43F5E'
];

const PAYMENT_STATUS_CONFIG = {
  'Successful': { icon: FiCheckCircle, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', gradient: 'from-emerald-600 to-emerald-400', color: '#10B981', label: 'Successful' },
  'Pending': { icon: FiClock, bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', gradient: 'from-amber-600 to-amber-400', color: '#F59E0B', label: 'Pending' },
  'Failed': { icon: FiXCircle, bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', gradient: 'from-red-600 to-red-400', color: '#EF4444', label: 'Failed' },
  'Cancelled': { icon: FiXCircle, bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', gradient: 'from-slate-600 to-slate-400', color: '#64748B', label: 'Cancelled' },
  'Refunded': { icon: FiRotateCcw, bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', gradient: 'from-blue-600 to-blue-400', color: '#3B82F6', label: 'Refunded' },
  'Partially Refunded': { icon: FiRotateCcw, bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', gradient: 'from-indigo-600 to-indigo-400', color: '#6366F1', label: 'Partially Refunded' },
  'Payment Initiated': { icon: FiClock, bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', gradient: 'from-cyan-600 to-cyan-400', color: '#06B6D4', label: 'Payment Initiated' },
  'Under Verification': { icon: FiShield, bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', gradient: 'from-purple-600 to-purple-400', color: '#8B5CF6', label: 'Under Verification' }
};

const ALL_PAYMENT_STATUSES = Object.keys(PAYMENT_STATUS_CONFIG);

const REFUND_STATUS_CONFIG = {
  'Requested': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Requested', color: '#F59E0B' },
  'Under Review': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', label: 'Under Review', color: '#8B5CF6' },
  'Approved': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', label: 'Approved', color: '#3B82F6' },
  'Processing': { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', label: 'Processing', color: '#06B6D4' },
  'Completed': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Completed', color: '#10B981' },
  'Rejected': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'Rejected', color: '#EF4444' },
  'Not Applicable': { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200', label: 'Not Applicable', color: '#64748B' }
};

const ACTIVE_REFUND_STATUSES = ['Requested', 'Under Review', 'Approved', 'Processing', 'Completed', 'Rejected'];
const ALL_REFUND_STATUSES = Object.keys(REFUND_STATUS_CONFIG);

// UPDATED: Removed Buyer and Tenant
const USER_TYPE_CONFIG = {
  'Owner': { icon: FaHome, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', gradient: 'from-emerald-800 to-teal-600', color: '#10B981', description: 'Property owners who list and manage their properties' },
  'Agent': { icon: FiBriefcase, bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', gradient: 'from-blue-600 via-blue-500 to-indigo-400', color: '#3B82F6', description: 'Real estate agents who connect buyers and sellers' },
  'Builder': { icon: FaHardHat, bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', gradient: 'from-orange-600 via-orange-500 to-amber-400', color: '#F97316', description: 'Builders who construct and sell new properties' },
  'Property Manager': { icon: FiClipboard, bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', gradient: 'from-purple-600 via-purple-500 to-violet-400', color: '#8B5CF6', description: 'Managers who handle property management services' }
};
const ALL_USER_TYPES = Object.keys(USER_TYPE_CONFIG);

const PROPERTY_TYPE_CONFIG = {
  'Individual': { icon: FiUser, bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', color: '#64748B' },
  'Apartment': { icon: FaHome, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', color: '#10B981' },
  'Commercial': { icon: FiBriefcase, bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', color: '#3B82F6' },
  'Land & Plots': { icon: FiMap, bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', color: '#F59E0B' },
  'Hostel': { icon: FaHotel, bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200', color: '#EC4899' }
};
const ALL_PROPERTY_TYPES = Object.keys(PROPERTY_TYPE_CONFIG);

const PAYMENT_PURPOSE_CONFIG = {
  'Property Listing Fee': { icon: FiHome, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', color: '#10B981' },
  'Property Promotion': { icon: FiTrendingUp, bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', color: '#3B82F6' },
  'Featured Listing': { icon: FiAward, bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', color: '#F59E0B' },
  'Subscription': { icon: FiTag, bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', color: '#8B5CF6' },
  'Lead Purchase': { icon: FiTarget, bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200', color: '#EC4899' },
  'Contact Access': { icon: FiPhone, bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', color: '#06B6D4' },
  'Agent Subscription': { icon: FiBriefcase, bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', color: '#3B82F6' },
  'Builder Subscription': { icon: FaHardHat, bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', color: '#F97316' },
  'Owner Subscription': { icon: FaHome, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', color: '#10B981' },
  'Property Management Service': { icon: FiClipboard, bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', color: '#8B5CF6' },
  'Loan Service': { icon: FiDollarSign, bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', color: '#6366F1' }
};
const ALL_PAYMENT_PURPOSES = Object.keys(PAYMENT_PURPOSE_CONFIG);

const ALL_PAYMENT_METHODS = ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallet', 'Bank Transfer', 'Cash', 'Payment Link', 'Other'];
const ALL_PAYMENT_GATEWAYS = ['Razorpay', 'Stripe', 'Cashfree', 'Bank Transfer', 'Manual Payment'];

const VERIFICATION_STATUS_CONFIG = {
  'Unverified': { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200', icon: FiShield, label: 'Unverified' },
  'Verified': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: FiCheckCircle, label: 'Verified' }
};

// ============================================================
// PLAN DATA
// ============================================================
// UPDATED: Removed Buyer and Tenant
const PLANS_BY_USER_TYPE = {
  'Owner': ['Free', 'Silver', 'Gold', 'Platinum'],
  'Agent': ['Basic', 'Professional', 'Enterprise'],
  'Builder': ['Basic', 'Premium', 'Enterprise'],
  'Property Manager': ['Standard', 'Business', 'Enterprise']
};
const getPlansForUserType = (userType) => PLANS_BY_USER_TYPE[userType] || [];

// UPDATED: Removed Buyer and Tenant
const PLAN_AMOUNTS = {
  'Owner': { 'Free': 0, 'Silver': 999, 'Gold': 2999, 'Platinum': 6999 },
  'Agent': { 'Basic': 499, 'Professional': 1999, 'Enterprise': 4999 },
  'Builder': { 'Basic': 999, 'Premium': 3999, 'Enterprise': 7999 },
  'Property Manager': { 'Standard': 799, 'Business': 2499, 'Enterprise': 5999 }
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
const formatCurrency = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;
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

const generateGrowthSeries = (labels, seed = 1) => {
  const rand = seededRandom(seed);
  let base = Math.floor(rand() * 40) + 30;
  return labels.map((label) => {
    base += Math.floor(rand() * 20) - 5;
    return { label, value: Math.max(base, 15) };
  });
};

// ============================================================
// MOCK DATA GENERATOR
// ============================================================
const generateMockPayments = (count = 60, datePreset = 'month', customStart, customEnd) => {
  const firstNames = ['Arun', 'Priya', 'Karthik', 'Divya', 'Suresh', 'Meena', 'Ravi', 'Anitha', 'Vijay', 'Lakshmi', 'Prakash', 'Deepa', 'Manoj', 'Kavya', 'Sanjay', 'Roopa', 'Arjun', 'Nisha'];
  const lastNames = ['Kumar', 'Sharma', 'Reddy', 'Iyer', 'Nair', 'Menon', 'Rao', 'Pillai', 'Gupta', 'Patel', 'Singh', 'Verma'];
  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur'];
  const propertyNames = ['Green Valley', 'Lake View', 'Royal Palm', 'City Heights', 'Garden Villa', 'Sunset Bay', 'Emerald City', 'Palm Grove', 'Cedar Woods', 'Riverside Homes'];

  let maxDaysBack = 180;
  if (datePreset === 'today' || datePreset === 'yesterday') maxDaysBack = 1;
  else if (datePreset === 'week') maxDaysBack = 7;
  else if (datePreset === 'month') maxDaysBack = 30;
  else if (datePreset === 'quarter') maxDaysBack = 90;
  else if (datePreset === 'year') maxDaysBack = 365;
  else if (datePreset === 'all') maxDaysBack = 730;
  else if (datePreset === 'custom' && customStart) {
    const diffTime = Math.abs(new Date() - new Date(customStart));
    maxDaysBack = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  const list = [];
  const now = new Date();

  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    // UPDATED: ALL_USER_TYPES now excludes Buyer and Tenant
    const userType = ALL_USER_TYPES[Math.floor(Math.random() * ALL_USER_TYPES.length)];
    const plansForType = getPlansForUserType(userType);
    const plan = plansForType[Math.floor(Math.random() * plansForType.length)];
    const baseAmount = (PLAN_AMOUNTS[userType] && PLAN_AMOUNTS[userType][plan] !== undefined) ? PLAN_AMOUNTS[userType][plan] : 499;
    const amount = baseAmount === 0 ? 0 : baseAmount + Math.floor(Math.random() * 3) * 100;
    const tax = Math.floor(amount * 0.18);
    const totalAmount = amount + tax;
    const propertyType = ALL_PROPERTY_TYPES[Math.floor(Math.random() * ALL_PROPERTY_TYPES.length)];
    const paymentPurpose = ALL_PAYMENT_PURPOSES[Math.floor(Math.random() * ALL_PAYMENT_PURPOSES.length)];
    const status = ALL_PAYMENT_STATUSES[Math.floor(Math.random() * ALL_PAYMENT_STATUSES.length)];
    const paymentMethod = ALL_PAYMENT_METHODS[Math.floor(Math.random() * ALL_PAYMENT_METHODS.length)];
    const paymentGateway = ALL_PAYMENT_GATEWAYS[Math.floor(Math.random() * ALL_PAYMENT_GATEWAYS.length)];
    const refundStatus = ACTIVE_REFUND_STATUSES[Math.floor(Math.random() * ACTIVE_REFUND_STATUSES.length)];
    const verificationStatus = ['Unverified', 'Verified'][Math.floor(Math.random() * 2)];
    const propertyName = propertyNames[Math.floor(Math.random() * propertyNames.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];

    let txDate;
    if (datePreset === 'today') {
      txDate = new Date(now);
      txDate.setHours(Math.floor(Math.random() * 24));
    } else if (datePreset === 'yesterday') {
      txDate = new Date(now);
      txDate.setDate(txDate.getDate() - 1);
      txDate.setHours(Math.floor(Math.random() * 24));
    } else {
      txDate = new Date(now);
      txDate.setDate(txDate.getDate() - Math.floor(Math.random() * maxDaysBack));
    }

    list.push({
      id: `txn_${i}_${Date.now()}`,
      transactionId: `TXN-${String(i).padStart(5, '0')}`,
      paymentId: `PAY-${String(i).padStart(5, '0')}`,
      userId: `user_${i}`,
      userName: `${firstName} ${lastName}`,
      userEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
      userPhone: `+91 ${String(9000000000 + Math.floor(Math.random() * 999999999)).slice(0, 10)}`,
      userType,
      plan,
      propertyId: `PROP-${String(1000 + i).padStart(4, '0')}`,
      propertyName,
      propertyType,
      propertyLocation: `${city}, India`,
      paymentPurpose,
      amount,
      tax,
      totalAmount,
      paymentMethod,
      paymentGateway,
      paymentStatus: status,
      refundStatus,
      verificationStatus,
      paymentDate: txDate.toISOString(),
      description: `${userType} - ${paymentPurpose} via ${paymentMethod}.`,
      notes: []
    });
  }

  return list;
};

// ============================================================
// BUILD PAYMENT STATS
// ============================================================
const buildPaymentStats = (transactions, datePreset = 'month') => {
  const growthLabels = generateTimeSeriesLabels(datePreset);
  const growthSeed = seedFromString(`payments_${datePreset}_growth`);
  const revenueGrowth = generateGrowthSeries(growthLabels, growthSeed);

  const successful = transactions.filter(t => t.paymentStatus === 'Successful');
  const totalRevenue = successful.reduce((sum, t) => sum + (Number(t.totalAmount) || 0), 0);

  const now = new Date();
  const todayStr = now.toDateString();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const todayRevenue = successful
    .filter(t => new Date(t.paymentDate).toDateString() === todayStr)
    .reduce((sum, t) => sum + (Number(t.totalAmount) || 0), 0);

  const monthRevenue = successful
    .filter(t => {
      const d = new Date(t.paymentDate);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + (Number(t.totalAmount) || 0), 0);

  const statusDistribution = ALL_PAYMENT_STATUSES.map((status, idx) => ({
    label: status,
    value: transactions.filter(t => t.paymentStatus === status).length,
    color: UNIQUE_COLORS[idx % UNIQUE_COLORS.length]
  })).filter(s => s.value > 0);

  const methodDistribution = ALL_PAYMENT_METHODS.map((method, idx) => ({
    label: method,
    value: transactions.filter(t => t.paymentMethod === method).length,
    color: UNIQUE_COLORS[idx % UNIQUE_COLORS.length]
  })).filter(m => m.value > 0);

  const gatewayDistribution = ALL_PAYMENT_GATEWAYS.map((gateway, idx) => ({
    label: gateway,
    value: transactions.filter(t => t.paymentGateway === gateway).reduce((sum, t) => sum + (Number(t.totalAmount) || 0), 0),
    color: UNIQUE_COLORS[idx % UNIQUE_COLORS.length]
  })).filter(g => g.value > 0);

  const userTypeDistribution = ALL_USER_TYPES.map((type, idx) => ({
    label: type,
    value: transactions.filter(t => t.userType === type).reduce((sum, t) => sum + (Number(t.totalAmount) || 0), 0),
    color: UNIQUE_COLORS[idx % UNIQUE_COLORS.length]
  })).filter(u => u.value > 0);

  const refundStatusDistribution = ACTIVE_REFUND_STATUSES.map((status, idx) => ({
    label: status,
    value: transactions.filter(t => t.refundStatus === status).length,
    color: UNIQUE_COLORS[idx % UNIQUE_COLORS.length]
  })).filter(s => s.value > 0);

  return {
    total: transactions.length,
    successful: transactions.filter(t => t.paymentStatus === 'Successful').length,
    pending: transactions.filter(t => t.paymentStatus === 'Pending').length,
    failed: transactions.filter(t => t.paymentStatus === 'Failed').length,
    refunded: transactions.filter(t => t.paymentStatus === 'Refunded').length,
    totalRevenue,
    todayRevenue,
    monthRevenue,
    avgTransaction: transactions.length > 0 ? Math.floor(totalRevenue / Math.max(successful.length, 1)) : 0,
    successRate: transactions.length > 0 ? ((successful.length / transactions.length) * 100).toFixed(1) : '0.0',
    statusDistribution,
    methodDistribution,
    gatewayDistribution,
    userTypeDistribution,
    refundStatusDistribution,
    revenueGrowth
  };
};

// ============================================================
// TOAST
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
    danger: { gradient: 'from-red-500 to-rose-400', btn: 'bg-gradient-to-r from-red-500 to-rose-400 hover:shadow-red-500/40', ring: 'bg-red-50', iconColor: 'text-red-600' },
    success: { gradient: 'from-emerald-500 to-teal-400', btn: 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:shadow-emerald-500/40', ring: 'bg-emerald-50', iconColor: 'text-emerald-600' },
    warning: { gradient: 'from-amber-500 to-orange-400', btn: 'bg-gradient-to-r from-amber-500 to-orange-400 hover:shadow-amber-500/40', ring: 'bg-amber-50', iconColor: 'text-amber-600' },
    info: { gradient: 'from-blue-500 to-cyan-400', btn: 'bg-gradient-to-r from-blue-500 to-cyan-400 hover:shadow-blue-500/40', ring: 'bg-blue-50', iconColor: 'text-blue-600' }
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

// ============================================================
// STAT CARD
// ============================================================
const StatCard = ({ icon, title, value, trend, subtitle, color, delay = 0, isActive, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`bg-white rounded-2xl p-3 shadow-sm hover:shadow-2xl transition-all duration-500 border group cursor-pointer relative overflow-hidden animate-card-in ${isActive ? 'ring-2 ring-[#00695C] shadow-lg bg-[#F5F9F8]' : 'border-[#E8F0EE]'}`}
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
      {isActive && (
        <div className="mt-2 flex items-center gap-1">
          <span className="text-[8px] text-[#00695C] font-bold bg-[#E8F4F2] px-2 py-0.5 rounded-full">Active Filter</span>
        </div>
      )}
      <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${color} transition-all duration-500 ${isHovered ? 'w-full' : 'w-0'}`} />
    </div>
  );
};

// ============================================================
// FLOW CHART
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
                  <p className="text-lg font-black" style={{ color: item.color }}>{formatCompact(item.value)}</p>
                  <p className="text-[10px] text-[#3D5A55] font-bold">{item.count?.toLocaleString() || 0} transactions</p>
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
        <span className="text-xl font-black text-[#00695C]">{formatCompact(total)}</span>
      </div>
    </div>
  );
};

// ============================================================
// DONUT CHART
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
                <span className="font-bold text-xs text-[#1A2E2A] leading-tight break-words">{d.label}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full whitespace-nowrap" style={{ color: '#fff', backgroundColor: d.color }}>{pct}%</span>
                <span className="text-xs font-black text-[#0F1A18] min-w-[36px] text-right">{d.value}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================
// REFUND STATUS MODAL
// ============================================================
const RefundStatusModal = ({ isOpen, onClose }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const refundData = useMemo(() => [
    { label: 'Requested', value: 8, color: '#F59E0B' },
    { label: 'Under Review', value: 6, color: '#8B5CF6' },
    { label: 'Approved', value: 5, color: '#3B82F6' },
    { label: 'Processing', value: 4, color: '#06B6D4' },
    { label: 'Completed', value: 9, color: '#10B981' },
    { label: 'Rejected', value: 3, color: '#EC4899' }
  ], []);

  const total = refundData.reduce((sum, d) => sum + d.value, 0) || 1;

  if (!isOpen) return null;

  const size = 260;
  const thickness = 55;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  let cumulative = 0;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl animate-slide-up overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-white">
              <FiRotateCcw className="text-lg" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Refund Status Distribution</h3>
              <p className="text-[11px] text-white/80 font-semibold">Breakdown of all refund cases</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        <div className="p-6 bg-white overflow-y-auto">
          <div className="flex flex-col items-center">
            <div className="relative" style={{ width: size, height: size }}>
              <svg width={size} height={size} className="transform -rotate-90">
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#EEF4F2" strokeWidth={thickness} />
                {refundData.map((d, i) => {
                  const segmentLength = (d.value / total) * circumference;
                  const offset = cumulative;
                  cumulative += segmentLength;
                  const isHovered = hoveredIndex === i;
                  return (
                    <circle key={i} cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={d.color}
                      strokeWidth={isHovered ? thickness + 10 : thickness}
                      strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                      strokeDashoffset={-offset} strokeLinecap="butt"
                      className="transition-all duration-300 cursor-pointer"
                      style={{ filter: isHovered ? `drop-shadow(0 0 12px ${d.color})` : 'none', opacity: hoveredIndex !== null && !isHovered ? 0.35 : 1 }}
                      onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-[10px] font-bold text-[#3D5A55] uppercase tracking-[0.15em] mb-1">TOTAL</p>
                <p className="text-[28px] font-black text-[#0F1A18] leading-none">{total}</p>
                {hoveredIndex !== null ? (
                  <div className="mt-2 flex flex-col items-center">
                    <span className="text-[13px] font-black px-2 py-0.5 rounded-md" style={{ color: '#fff', backgroundColor: refundData[hoveredIndex].color }}>
                      {((refundData[hoveredIndex].value / total) * 100).toFixed(1)}%
                    </span>
                    <span className="text-[10px] font-bold text-[#1A2E2A] mt-1">{refundData[hoveredIndex].label}</span>
                  </div>
                ) : (
                  <p className="text-[10px] font-bold text-[#3D5A55] mt-1">{refundData.length} categories</p>
                )}
              </div>
            </div>

            <div className="mt-6 w-full space-y-2">
              {refundData.map((d, i) => {
                const pct = ((d.value / total) * 100).toFixed(1);
                const isHovered = hoveredIndex === i;
                return (
                  <div key={i}
                    className={`flex items-center justify-between text-xs p-3 rounded-xl transition-all cursor-pointer border ${isHovered ? 'bg-white shadow-md border-transparent' : 'border-transparent hover:bg-[#F5F9F8]'}`}
                    style={{ borderLeftWidth: '4px', borderLeftColor: d.color }}
                    onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                      <span className="font-bold truncate text-[#1A2E2A]">{d.label}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ color: '#fff', backgroundColor: d.color }}>{pct}%</span>
                      <span className="text-xs font-black text-[#0F1A18] min-w-[40px] text-right">{d.value}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-[#F8FAF9] border-t border-[#E8F0EE] flex items-center justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-5 py-2.5 bg-white border border-[#E8F0EE] text-[#1A2E2A] rounded-xl text-sm font-bold hover:bg-[#E8F0EE] transition-all">
            Close
          </button>
          <button onClick={onClose} className="px-5 py-2.5 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-xl text-sm font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2">
            <FiCheckCircle className="text-sm" /> Done
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// BAR CHART
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
          <div key={i} className="flex-1 text-center min-w-0 px-0.5">
            <span
              className={`text-sm font-black block leading-tight break-words ${hoveredIndex === i ? 'text-[#00695C]' : 'text-[#3D5A55]'}`}
              title={d.label}
            >
              {d.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================
// AREA CHART
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
// PROGRESS BAR
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
          <span className="text-[11px] font-black text-[#0F1A18]">{formatCompact(value)}</span>
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
// STATUS BADGE
// ============================================================
const StatusBadge = ({ status, config = PAYMENT_STATUS_CONFIG }) => {
  const c = config[status] || { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', label: status || 'Unknown' };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[9px] border ${c.bg} ${c.text} ${c.border}`}>
      {c.label}
    </span>
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
// PAYMENT DETAILS MODAL (WITH HISTORY)
// ============================================================
const PaymentDetailsModal = ({ payment, onClose, onToggleBlock }) => {
  if (!payment) return null;

  const statusConfig = PAYMENT_STATUS_CONFIG[payment.paymentStatus] || PAYMENT_STATUS_CONFIG['Pending'];
  const StatusIcon = statusConfig.icon;
  const verificationConfig = VERIFICATION_STATUS_CONFIG[payment.verificationStatus || 'Unverified'] || VERIFICATION_STATUS_CONFIG['Unverified'];
  const VerificationIcon = verificationConfig.icon;
  const userTypeConfig = USER_TYPE_CONFIG[payment.userType] || USER_TYPE_CONFIG['Owner'];
  const UserTypeIcon = userTypeConfig.icon;

  // ============================================================
  // GENERATE TRANSACTION HISTORY
  // ============================================================
  const transactionHistory = useMemo(() => {
    const history = [];
    const baseDate = new Date(payment.paymentDate);
    
    // 1. Payment Initiated
    history.push({
      id: 1,
      title: 'Payment Initiated',
      description: `Payment of ${formatCurrency(payment.totalAmount)} initiated via ${payment.paymentMethod}`,
      date: new Date(baseDate.getTime() - 5 * 60 * 1000), // 5 mins before
      icon: FiClock,
      color: '#06B6D4',
      bg: 'bg-cyan-50',
      text: 'text-cyan-700',
      border: 'border-cyan-200',
      status: 'completed'
    });

    // 2. Payment Processing
    history.push({
      id: 2,
      title: 'Payment Processing',
      description: `Payment sent to ${payment.paymentGateway} for processing`,
      date: new Date(baseDate.getTime() - 3 * 60 * 1000), // 3 mins before
      icon: FiRefreshCw,
      color: '#F59E0B',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      status: 'completed'
    });

    // 3. Payment Success/Failure based on status
    if (payment.paymentStatus === 'Successful') {
      history.push({
        id: 3,
        title: 'Payment Successful',
        description: `Payment of ${formatCurrency(payment.totalAmount)} completed successfully. Transaction ID: ${payment.transactionId}`,
        date: baseDate,
        icon: FiCheckCircle,
        color: '#10B981',
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        status: 'completed'
      });
    } else if (payment.paymentStatus === 'Failed') {
      history.push({
        id: 3,
        title: 'Payment Failed',
        description: `Payment of ${formatCurrency(payment.totalAmount)} failed. Please try again.`,
        date: baseDate,
        icon: FiXCircle,
        color: '#EF4444',
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
        status: 'failed'
      });
    } else if (payment.paymentStatus === 'Pending') {
      history.push({
        id: 3,
        title: 'Payment Pending',
        description: `Payment of ${formatCurrency(payment.totalAmount)} is pending confirmation`,
        date: baseDate,
        icon: FiClock,
        color: '#F59E0B',
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        status: 'pending'
      });
    } else if (payment.paymentStatus === 'Refunded') {
      history.push({
        id: 3,
        title: 'Payment Refunded',
        description: `Payment of ${formatCurrency(payment.totalAmount)} was refunded`,
        date: baseDate,
        icon: FiRotateCcw,
        color: '#3B82F6',
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        status: 'refunded'
      });
    } else if (payment.paymentStatus === 'Cancelled') {
      history.push({
        id: 3,
        title: 'Payment Cancelled',
        description: `Payment of ${formatCurrency(payment.totalAmount)} was cancelled`,
        date: baseDate,
        icon: FiXCircle,
        color: '#64748B',
        bg: 'bg-slate-50',
        text: 'text-slate-700',
        border: 'border-slate-200',
        status: 'cancelled'
      });
    }

    // 4. Verification Status (if verified)
    if (payment.verificationStatus === 'Verified') {
      history.push({
        id: 4,
        title: 'Payment Verified',
        description: `Payment verified by super admin`,
        date: new Date(baseDate.getTime() + 10 * 60 * 1000), // 10 mins after
        icon: FiShield,
        color: '#8B5CF6',
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        border: 'border-purple-200',
        status: 'completed'
      });
    }

    // 5. Refund Status (if applicable)
    if (payment.refundStatus && payment.refundStatus !== 'Not Applicable') {
      const refundDate = new Date(baseDate.getTime() + 60 * 60 * 1000); // 1 hour after
      history.push({
        id: 5,
        title: `Refund ${payment.refundStatus}`,
        description: `Refund request ${payment.refundStatus.toLowerCase()} for ${formatCurrency(payment.totalAmount)}`,
        date: refundDate,
        icon: FiRotateCcw,
        color: '#EC4899',
        bg: 'bg-pink-50',
        text: 'text-pink-700',
        border: 'border-pink-200',
        status: payment.refundStatus.toLowerCase()
      });
    }

    // Sort by date (newest first)
    return history.sort((a, b) => b.date - a.date);
  }, [payment]);

  const formatHistoryDate = (date) => {
    return new Date(date).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 rounded-t-3xl z-10 shrink-0">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white">
            <FiX className="text-lg" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-14 h-14 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center text-2xl text-white shadow-lg">
              <StatusIcon />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{payment.userName}</h2>
              <p className="text-white/80 text-sm flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white border border-white/30">
                  {statusConfig.label}
                </span>
                <span className="w-1 h-1 bg-white/40 rounded-full" />
                <span>ID: {payment.transactionId}</span>
                <span className="w-1 h-1 bg-white/40 rounded-full" />
                <span className="font-semibold">{formatCurrency(payment.totalAmount)}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-white/20 text-white border border-white/30">
              <UserTypeIcon className="text-xs" /> {payment.userType}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-white/20 text-white border border-white/30">
              <FiCreditCard className="text-xs" /> {payment.paymentMethod}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-white/20 text-white border border-white/30">
              <VerificationIcon className="text-xs" /> {verificationConfig.label}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#F8FAF9]">
          {/* Existing Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-[#E8F0EE] p-4">
              <h3 className="text-xs font-black text-[#3D5A55] uppercase tracking-wider mb-3 flex items-center gap-2"><FiHash className="text-[#00695C]" /> Transaction Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-[#5A7D78]">Transaction ID</span><span className="font-bold">{payment.transactionId}</span></div>
                <div className="flex justify-between"><span className="text-[#5A7D78]">Payment ID</span><span className="font-bold">{payment.paymentId}</span></div>
                <div className="flex justify-between"><span className="text-[#5A7D78]">Payment Date</span><span className="font-bold">{formatDate(payment.paymentDate)}</span></div>
                <div className="flex justify-between"><span className="text-[#5A7D78]">Purpose</span><span className="font-bold truncate">{payment.paymentPurpose}</span></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8F0EE] p-4">
              <h3 className="text-xs font-black text-[#3D5A55] uppercase tracking-wider mb-3 flex items-center gap-2"><FiDollarSign className="text-[#00695C]" /> Payment Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-[#5A7D78]">Amount</span><span className="font-bold">{formatCurrency(payment.amount)}</span></div>
                <div className="flex justify-between"><span className="text-[#5A7D78]">Tax</span><span className="font-bold">{formatCurrency(payment.tax)}</span></div>
                <div className="flex justify-between"><span className="text-[#5A7D78]">Total</span><span className="font-bold text-[#00695C]">{formatCurrency(payment.totalAmount)}</span></div>
                <div className="flex justify-between"><span className="text-[#5A7D78]">Payment Method</span><span className="font-bold">{payment.paymentMethod}</span></div>
                <div className="flex justify-between"><span className="text-[#5A7D78]">Gateway</span><span className="font-bold">{payment.paymentGateway}</span></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8F0EE] p-4">
              <h3 className="text-xs font-black text-[#3D5A55] uppercase tracking-wider mb-3 flex items-center gap-2"><FiUser className="text-[#00695C]" /> User Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-[#5A7D78]">Name</span><span className="font-bold">{payment.userName}</span></div>
                <div className="flex justify-between"><span className="text-[#5A7D78]">Email</span><span className="font-bold truncate">{payment.userEmail}</span></div>
                <div className="flex justify-between"><span className="text-[#5A7D78]">Phone</span><span className="font-bold">{payment.userPhone}</span></div>
                <div className="flex justify-between"><span className="text-[#5A7D78]">Type</span><span className="font-bold">{payment.userType}</span></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8F0EE] p-4">
              <h3 className="text-xs font-black text-[#3D5A55] uppercase tracking-wider mb-3 flex items-center gap-2"><FiHome className="text-[#00695C]" /> Property Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-[#5A7D78]">Property</span><span className="font-bold truncate">{payment.propertyName}</span></div>
                <div className="flex justify-between"><span className="text-[#5A7D78]">ID</span><span className="font-bold">{payment.propertyId}</span></div>
                <div className="flex justify-between"><span className="text-[#5A7D78]">Type</span><span className="font-bold">{payment.propertyType}</span></div>
                <div className="flex justify-between"><span className="text-[#5A7D78]">Location</span><span className="font-bold truncate">{payment.propertyLocation}</span></div>
              </div>
            </div>
          </div>

          {/* Status Overview */}
          <div className="bg-white rounded-2xl border border-[#E8F0EE] p-4">
            <h3 className="text-xs font-black text-[#3D5A55] uppercase tracking-wider mb-3">Status Overview</h3>
            <div className="flex flex-wrap items-center gap-x-10 gap-y-5">
              <div className="flex items-center gap-2">
                <FiCreditCard className="text-[#00695C] text-sm" />
                <span className="text-xs font-bold text-[#3D5A55]">Payment Status:</span>
                <StatusBadge status={payment.paymentStatus} config={PAYMENT_STATUS_CONFIG} />
              </div>
              <div className="flex items-center gap-2">
                <FiShield className="text-[#00695C] text-sm" />
                <span className="text-xs font-bold text-[#3D5A55]">Verification status:</span>
                <StatusBadge status={payment.verificationStatus} config={VERIFICATION_STATUS_CONFIG} />
              </div>
              <div className="flex items-center gap-2">
                <FiRotateCcw className="text-[#00695C] text-sm" />
                <span className="text-xs font-bold text-[#3D5A55]">Refund status:</span>
                <StatusBadge status={payment.refundStatus} config={REFUND_STATUS_CONFIG} />
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* TRANSACTION HISTORY TIMELINE - NEW SECTION */}
          {/* ============================================================ */}
          <div className="bg-white rounded-2xl border border-[#E8F0EE] p-4">
            <h3 className="text-xs font-black text-[#3D5A55] uppercase tracking-wider mb-4 flex items-center gap-2">
              <FiClock className="text-[#00695C]" /> Transaction History
            </h3>
            
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-[#00695C] via-[#26A69A] to-[#E8F0EE]" />
              
              <div className="space-y-4">
                {transactionHistory.map((item, index) => {
                  const ItemIcon = item.icon;
                  return (
                    <div key={item.id} className="relative flex items-start gap-4 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                      {/* Icon Circle */}
                      <div className={`relative z-10 w-10 h-10 rounded-full ${item.bg} ${item.border} border-2 flex items-center justify-center flex-shrink-0 shadow-sm`}>
                        <ItemIcon className={`text-sm ${item.text}`} />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0 bg-[#F8FAF9] rounded-xl p-3 border border-[#E8F0EE] hover:shadow-md transition-all">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div className="min-w-0 flex-1">
                            <h4 className={`text-sm font-black ${item.text}`}>{item.title}</h4>
                            <p className="text-[11px] text-[#3D5A55] font-medium mt-0.5 leading-relaxed">{item.description}</p>
                          </div>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${item.bg} ${item.text} ${item.border} border whitespace-nowrap flex-shrink-0`}>
                            {item.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-2 text-[10px] text-[#5A7D78] font-semibold">
                          <FiCalendar className="text-[9px]" />
                          {formatHistoryDate(item.date)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 px-6 py-4 bg-white border-t border-[#E8F0EE] flex items-center gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl text-sm font-bold hover:bg-[#E8F0EE]">Close</button>
          <button onClick={() => { onToggleBlock(payment); onClose(); }} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 flex items-center justify-center gap-2">
            <FiTrash2 className="text-sm" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// TAB: OVERVIEW
// ============================================================
const OverviewTab = ({ stats, config, dateRangeLabel, datePreset }) => {
  const [showRefundModal, setShowRefundModal] = useState(false);

  const growthTitle = {
    today: 'Hourly Revenue Growth',
    yesterday: 'Hourly Revenue Growth',
    week: 'Daily Revenue Growth',
    month: 'Weekly Revenue Growth',
    quarter: 'Monthly Revenue Growth',
    year: 'Monthly Revenue Growth',
    all: 'Yearly Revenue Growth',
    custom: 'Period Revenue Growth'
  }[datePreset] || 'Revenue Growth Trend';

  const totalRefunds = (stats.refundStatusDistribution || []).reduce((sum, r) => sum + r.value, 0);

  // Fixed dummy data for Revenue by Property
  const propertyTypeDistribution = [
    { label: 'Individual',    value: 28700, color: '#10B981' },
    { label: 'Apartment',     value: 45200, color: '#3B82F6' },
    { label: 'Commercial',    value: 38600, color: '#F59E0B' },
    { label: 'Land & Plots',  value: 29400, color: '#8B5CF6' },
    { label: 'Hostel',        value: 40100, color: '#EC4899' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#E8F4F2] to-[#D5F0EA] rounded-2xl p-3 border border-[#C5EDE5] flex items-center gap-2">
        <FiCalendar className="text-[#00695C] text-sm" />
        <span className="text-xs font-bold text-[#00695C]">Showing data for: {dateRangeLabel}</span>
      </div>

      {/* Stats Cards (First row only) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<FiCreditCard className="text-white text-base" />}
          title="Total Payments"
          value={stats.total || 0}
          trend={12.5}
          subtitle="All transactions"
          color="bg-gradient-to-br from-[#00695C] to-[#26A69A]"
          delay={0}
        />
        <StatCard
          icon={<FiCheckCircle className="text-white text-base" />}
          title="Successful"
          value={stats.successful || 0}
          trend={8.3}
          subtitle="Completed payments"
          color="bg-gradient-to-br from-emerald-600 to-teal-400"
          delay={100}
        />
        <StatCard
          icon={<FiClock className="text-white text-base" />}
          title="Pending"
          value={stats.pending || 0}
          trend={-3.2}
          subtitle="Awaiting confirmation"
          color="bg-gradient-to-br from-amber-600 to-yellow-400"
          delay={200}
        />
        <StatCard
          icon={<FiDollarSign className="text-white text-base" />}
          title="Total Revenue"
          value={formatCompact(stats.totalRevenue || 0)}
          trend={15.2}
          subtitle="From successful payments"
          color="bg-gradient-to-br from-purple-600 to-violet-400"
          delay={300}
        />
      </div>

      {/* Charts Row 1 - Revenue Growth (AreaChart) now in prominent position */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <div>
              <h3 className="text-lg font-black text-[#0F1A18] flex items-center gap-2">
                <FiTrendingUp className="text-[#00695C] animate-icon-float" />
                {growthTitle}
              </h3>
              <p className="text-xs text-[#3D5A55] font-semibold">Revenue trend over time</p>
            </div>
            <span className="px-3 py-1 bg-[#E8F4F2] text-[#00695C] text-[10px] font-black rounded-full flex items-center gap-1">
              <FiCalendar className="text-[10px]" /> {dateRangeLabel}
            </span>
          </div>
          <AreaChart data={stats.revenueGrowth || []} height={300} color="#00695C" />
        </div>
        <div className="bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm">
          <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
            <FiActivity className="text-[#00695C]" /> Payment Status Distribution
          </h3>
          <DonutChart
            data={(stats.statusDistribution || []).filter(s =>
              ['Successful', 'Pending', 'Failed', 'Refunded'].includes(s.label)
            )}
            size={220}
            thickness={48}
            centerLabel="Total"
            centerValue={stats.total || 0}
          />
        </div>
      </div>

      {/* Charts Row 2 - Refund Status Distribution  +  Revenue by Gateway */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-black text-[#0F1A18] flex items-center gap-2">
              <FiRotateCcw className="text-[#00695C]" /> Refund Status Distribution
            </h3>
            
          </div>
          <DonutChart
            data={stats.refundStatusDistribution || []}
            size={200}
            thickness={42}
            centerLabel="Total"
            centerValue={totalRefunds}
          />
        </div>
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm">
          <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
            <FiServer className="text-[#00695C]" /> Revenue by Gateway
          </h3>
          <BarChart data={stats.gatewayDistribution || []} height={280} />
        </div>
      </div>

           {/* Distribution Sections - Revenue by Property now first, Revenue by User Type second */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm">
          <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
            <FiHome className="text-[#00695C]" /> Revenue by Property
          </h3>
          <BarChart data={propertyTypeDistribution} height={280} />
        </div>
        <div className="bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm">
          <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
            <FiUsers className="text-[#00695C]" /> Revenue by User Type
          </h3>
          {/* UPDATED: Removed filter for Buyer and Tenant since they no longer exist */}
          <DonutChart
            data={stats.userTypeDistribution || []}
            size={200}
            thickness={42}
            centerLabel="Total"
            centerValue={formatCompact(stats.totalRevenue || 0)}
          />
        </div>
      </div>

      {/* Bottom Section - Payment Method Distribution (FlowChart) */}
      <div className="bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm">
        <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
          <FiCreditCard className="text-[#00695C]" /> Payment Method Distribution
        </h3>
        <FlowChart
          data={(stats.methodDistribution || []).map((item) => ({
            ...item,
            icon: FiCreditCard,
            subtitle: `${item.value} transactions`,
            count: item.value
          }))}
          height={320}
        />
      </div>

      {/* Refund Status Modal */}
      <RefundStatusModal
        isOpen={showRefundModal}
        onClose={() => setShowRefundModal(false)}
      />
    </div>
  );
};

// ============================================================
// TAB: TRANSACTIONS
// ============================================================
const TransactionsTab = ({ payments, onDelete, showToast, dateRangeLabel, searchQuery, setSearchQuery, selectedStatus, setSelectedStatus, selectedUserType, setSelectedUserType, viewMode, setViewMode, actionLoading }) => {
  const [viewingPayment, setViewingPayment] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = useMemo(() => {
    let result = [...payments];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.userName.toLowerCase().includes(q) ||
        p.transactionId.toLowerCase().includes(q) ||
        p.userEmail.toLowerCase().includes(q) ||
        p.paymentMethod.toLowerCase().includes(q)
      );
    }
    if (selectedStatus !== 'all') result = result.filter(p => p.paymentStatus === selectedStatus);
    if (selectedUserType !== 'all') result = result.filter(p => p.userType === selectedUserType);
    return result;
  }, [payments, searchQuery, selectedStatus, selectedUserType]);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 border border-[#E8F0EE] shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          <div className="flex-1 w-full relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A7D78] text-sm" />
            <input type="text" placeholder="Search transactions..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] text-sm text-[#0F1A18] placeholder:text-[#5A7D78] outline-none" />
          </div>
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] text-sm text-[#0F1A18] outline-none cursor-pointer font-medium">
            <option value="all">All Status</option>
            {ALL_PAYMENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={selectedUserType} onChange={(e) => setSelectedUserType(e.target.value)}
            className="px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] text-sm text-[#0F1A18] outline-none cursor-pointer font-medium">
            <option value="all">All User Types</option>
            {ALL_USER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <div className="flex items-center bg-[#F5F9F8] rounded-xl p-1 border border-[#E8F0EE]">
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#00695C]' : 'text-[#3D5A55]'}`} title="Grid View"><FiGrid className="text-sm" /></button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-white shadow-sm text-[#00695C]' : 'text-[#3D5A55]'}`} title="List View"><FiList className="text-sm" /></button>
          </div>
          <span className="px-3 py-2 bg-[#E8F4F2] text-[#00695C] text-xs font-black rounded-xl">{filtered.length} transactions</span>
        </div>
        <div className="mt-2 flex items-center gap-2 text-[10px] text-[#3D5A55] font-semibold">
          <FiCalendar className="text-[#00695C]" /> Showing payments from: {dateRangeLabel}
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {filtered.map((payment, index) => {
            const statusConfig = PAYMENT_STATUS_CONFIG[payment.paymentStatus] || PAYMENT_STATUS_CONFIG['Pending'];
            const StatusIcon = statusConfig.icon;
            const userTypeConfig = USER_TYPE_CONFIG[payment.userType] || USER_TYPE_CONFIG['Owner'];
            const UserTypeIcon = userTypeConfig.icon;
            return (
              <div key={payment.id} className={`bg-white rounded-2xl border border-[#E8F0EE] p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 animate-card-in`} style={{ animationDelay: `${index * 40}ms` }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0 bg-gradient-to-br ${statusConfig.gradient}`}>
                      <StatusIcon />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-[#0F1A18] text-sm truncate">{payment.userName}</h4>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <StatusBadge status={payment.paymentStatus} config={PAYMENT_STATUS_CONFIG} />
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold bg-[#F5F9F8] text-[#5A7D78]">{payment.transactionId}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1 text-[11px] text-[#3D5A55]">
                  <div className="flex items-center gap-2"><FiDollarSign className="text-[#00695C]" /> <span className="font-bold text-[#1A2E2A]">{formatCurrency(payment.totalAmount)}</span></div>
                  <div className="flex items-center gap-2"><UserTypeIcon className="text-[#00695C]" /> <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${userTypeConfig.bg} ${userTypeConfig.text} border ${userTypeConfig.border}`}>{payment.userType}</span></div>
                  <div className="flex items-center gap-2"><FiCreditCard className="text-[#00695C]" /> <span>{payment.paymentMethod}</span></div>
                  <div className="flex items-center gap-2"><FiCalendar className="text-[#00695C]" /> <span>{formatDate(payment.paymentDate)}</span></div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#E8F0EE]">
                  <div className="text-center">
                    <p className="text-sm font-black text-[#0F1A18]">{formatCompact(payment.amount)}</p>
                    <p className="text-[8px] text-[#3D5A55] uppercase tracking-wider font-bold">Amount</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-black text-[#0F1A18]">{formatCompact(payment.tax)}</p>
                    <p className="text-[8px] text-[#3D5A55] uppercase tracking-wider font-bold">Tax</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-black text-[#00695C]">{payment.paymentGateway}</p>
                    <p className="text-[8px] text-[#3D5A55] uppercase tracking-wider font-bold">Gateway</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-[#E8F0EE]">
                  <button onClick={() => setViewingPayment(payment)} className="flex-1 py-1.5 text-xs font-bold text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] flex items-center justify-center gap-1"><FiEye className="text-[10px]" /> View</button>
                  <button onClick={() => setConfirmDelete(payment)} disabled={actionLoading === payment.id} className="flex-1 py-1.5 text-xs font-bold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 flex items-center justify-center gap-1 disabled:opacity-50">
                    {actionLoading === payment.id ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiTrash2 className="text-[10px]" />}
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E8F0EE] shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 gap-2 items-center px-4 py-3 bg-[#F5F9F8] border-b border-[#E8F0EE] text-xs font-bold text-[#3D5A55] uppercase tracking-wider">
            <div className="col-span-3">User</div>
            <div className="col-span-2">Transaction ID</div>
            <div className="col-span-1">Type</div>
            <div className="col-span-1">Amount</div>
            <div className="col-span-1">Method</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1">Date</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>
          {filtered.map((payment) => {
            const statusConfig = PAYMENT_STATUS_CONFIG[payment.paymentStatus] || PAYMENT_STATUS_CONFIG['Pending'];
            return (
              <div key={payment.id} className="grid grid-cols-12 gap-2 items-center py-3 px-4 border-b border-[#E8F0EE] hover:bg-[#F5F9F8] transition">
                <div className="col-span-3 flex items-center gap-2 min-w-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-xs bg-gradient-to-br ${statusConfig.gradient} flex-shrink-0`}>
                    {payment.userName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-[#1A2E2A] truncate">{payment.userName}</p>
                    <p className="text-[10px] text-[#3D5A55] truncate">{payment.userEmail}</p>
                  </div>
                </div>
                <div className="col-span-2 text-xs font-bold text-[#00695C] truncate">{payment.transactionId}</div>
                <div className="col-span-1 text-xs text-[#3D5A55] truncate">{payment.userType}</div>
                <div className="col-span-1 text-xs font-bold text-[#0F1A18] truncate">{formatCompact(payment.totalAmount)}</div>
                <div className="col-span-1 text-xs text-[#3D5A55] truncate">{payment.paymentMethod}</div>
                <div className="col-span-1"><StatusBadge status={payment.paymentStatus} config={PAYMENT_STATUS_CONFIG} /></div>
                <div className="col-span-1 text-[10px] text-[#3D5A55]">{formatDate(payment.paymentDate)}</div>
                <div className="col-span-2 flex items-center justify-end gap-1">
                  <button onClick={() => setViewingPayment(payment)} className="px-3 py-1.5 rounded-lg text-[10px] font-bold text-[#00695C] bg-[#E8F4F2] hover:bg-[#C5EDE5] flex items-center gap-1"><FiEye className="text-[10px]" /> View</button>
                  <button onClick={() => setConfirmDelete(payment)} className="px-3 py-1.5 rounded-lg text-[10px] font-bold text-red-600 bg-red-50 hover:bg-red-100 flex items-center gap-1"><FiTrash2 className="text-[10px]" /> Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E8F0EE]">
          <div className="w-24 h-24 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4 animate-float">
            <FiCreditCard className="text-4xl text-[#8FA8A4]" />
          </div>
          <h3 className="text-xl font-black text-[#0F1A18]">No transactions found</h3>
          <p className="text-sm text-[#3D5A55] mt-1 font-medium">Try adjusting your filters or date range</p>
        </div>
      )}

      {viewingPayment && (
        <PaymentDetailsModal payment={viewingPayment} onClose={() => setViewingPayment(null)} onToggleBlock={(p) => setConfirmDelete(p)} />
      )}

      <ConfirmModal
        isOpen={!!confirmDelete}
        title="Delete Transaction"
        message={confirmDelete ? `Are you sure you want to delete "${confirmDelete.transactionId}" (${formatCurrency(confirmDelete.totalAmount)})?` : ''}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={() => { onDelete(confirmDelete.id); setConfirmDelete(null); }}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

// ============================================================
// TAB: PROPERTIES
// ============================================================
const PropertiesTab = ({ payments, dateRangeLabel }) => {
  const [viewingPayment, setViewingPayment] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const propertyData = useMemo(() => {
    const map = {};
    payments.forEach(p => {
      if (!map[p.propertyId]) {
        map[p.propertyId] = { ...p, totalPaid: 0, transactions: 0 };
      }
      map[p.propertyId].totalPaid += p.totalAmount;
      map[p.propertyId].transactions += 1;
    });
    return Object.values(map);
  }, [payments]);

  const filteredProperties = useMemo(() => {
    if (!searchQuery.trim()) return propertyData;
    const q = searchQuery.toLowerCase();
    return propertyData.filter(prop =>
      prop.propertyName?.toLowerCase().includes(q) ||
      prop.propertyId?.toLowerCase().includes(q) ||
      prop.propertyType?.toLowerCase().includes(q) ||
      prop.propertyLocation?.toLowerCase().includes(q)
    );
  }, [propertyData, searchQuery]);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-3 border border-[#E8F0EE] shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex-1 w-full relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A7D78] text-sm" />
          <input
            type="text"
            placeholder="Search properties by name, ID, type or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] text-sm text-[#0F1A18] placeholder:text-[#5A7D78] outline-none"
          />
        </div>
        <span className="px-3 py-1.5 bg-[#E8F4F2] text-[#00695C] text-xs font-black rounded-xl whitespace-nowrap">
          {filteredProperties.length} of {propertyData.length} properties
        </span>
        <span className="text-[10px] text-[#3D5A55] font-semibold flex items-center gap-1 whitespace-nowrap">
          <FiCalendar className="text-[#00695C]" /> {dateRangeLabel}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {filteredProperties.map((prop, index) => {
          const propConfig = PROPERTY_TYPE_CONFIG[prop.propertyType] || PROPERTY_TYPE_CONFIG['Individual'];
          const PropIcon = propConfig.icon;
          return (
            <div key={prop.propertyId} className="bg-white rounded-2xl border border-[#E8F0EE] p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 animate-card-in" style={{ animationDelay: `${index * 30}ms` }}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 rounded-2xl ${propConfig.bg} flex items-center justify-center ${propConfig.text} border ${propConfig.border} flex-shrink-0`}>
                  <PropIcon className="text-xl" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-[#0F1A18] truncate">{prop.propertyName}</h4>
                  <p className="text-[10px] text-[#3D5A55] truncate">{prop.propertyId}</p>
                </div>
              </div>
              <div className="space-y-1 text-[11px] text-[#3D5A55]">
                <div className="flex items-center gap-2"><FiTag className="text-[#00695C]" /> <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${propConfig.bg} ${propConfig.text} border ${propConfig.border}`}>{prop.propertyType}</span></div>
                <div className="flex items-center gap-2"><FiMapPin className="text-[#00695C]" /> <span className="truncate">{prop.propertyLocation}</span></div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#E8F0EE]">
                <div className="text-center">
                  <p className="text-sm font-black text-[#00695C]">{formatCompact(prop.totalPaid)}</p>
                  <p className="text-[8px] text-[#3D5A55] uppercase tracking-wider font-bold">Total Paid</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-black text-[#0F1A18]">{prop.transactions}</p>
                  <p className="text-[8px] text-[#3D5A55] uppercase tracking-wider font-bold">Transactions</p>
                </div>
              </div>
              <button onClick={() => setViewingPayment(prop)} className="w-full mt-3 py-2 text-xs font-bold text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] flex items-center justify-center gap-1.5">
                <FiEye className="text-[10px]" /> View Details
              </button>
            </div>
          );
        })}
      </div>

      {filteredProperties.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E8F0EE]">
          <div className="w-24 h-24 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4 animate-float">
            <FiHome className="text-4xl text-[#8FA8A4]" />
          </div>
          <h3 className="text-lg font-black text-[#0F1A18]">
            {searchQuery ? 'No matching properties' : 'No properties found'}
          </h3>
          <p className="text-sm text-[#3D5A55] mt-1 font-medium">
            {searchQuery ? 'Try a different search term' : 'No properties available for this date range'}
          </p>
        </div>
      )}

      {viewingPayment && (
        <PaymentDetailsModal payment={viewingPayment} onClose={() => setViewingPayment(null)} onToggleBlock={() => {}} />
      )}
    </div>
  );
};



// ============================================================
// MAIN COMPONENT
// ============================================================
const PaymentsManagement = () => {
  const [activeView, setActiveView] = useState('overview');
  const [activeTab, setActiveTab] = useState('transactions');
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedUserType, setSelectedUserType] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  const [confirmAction, setConfirmAction] = useState(null);

  const [datePreset, setDatePreset] = useState('month');
  const [customStart, setCustomStart] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [customEnd, setCustomEnd] = useState(new Date());

  const [payments, setPayments] = useState([]);
  const [paymentStats, setPaymentStats] = useState({});

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  }, []);

  useEffect(() => {
    const newPayments = generateMockPayments(60, datePreset, customStart, customEnd);
    setPayments(newPayments);
    setPaymentStats(buildPaymentStats(newPayments, datePreset));
  }, [datePreset, customStart, customEnd]);

  useEffect(() => {
    setSearchQuery('');
    setSelectedStatus('all');
    setSelectedUserType('all');
    setActiveTab('transactions');
  }, [activeView]);

  const dateRangeLabel = getDateRangeLabel(datePreset, customStart, customEnd);

  const handleDeletePayment = useCallback((paymentId) => {
  const target = payments.find(p => p.id === paymentId);   
  setActionLoading(paymentId);

  setTimeout(() => {
    setPayments(prev => {
      const updated = prev.filter(p => p.id !== paymentId);
      setPaymentStats(buildPaymentStats(updated, datePreset));
      return updated;
    });
    setActionLoading(null);

    //  ID + Name 
    showToast(
      target
        ? `Payment ${target.transactionId} from ${target.userName} deleted`
        : 'Payment deleted successfully',
      'success'
    );
  }, 600);
}, [payments, datePreset, showToast]);

  const handleRefresh = useCallback(() => {
    setActionLoading('refresh');
    setTimeout(() => {
      const newPayments = generateMockPayments(60, datePreset, customStart, customEnd);
      setPayments(newPayments);
      setPaymentStats(buildPaymentStats(newPayments, datePreset));
      setActionLoading(null);
      showToast('Data refreshed successfully', 'success');
    }, 800);
  }, [datePreset, customStart, customEnd, showToast]);

  const tabs = [
    { id: 'transactions', label: 'Transactions', icon: FiCreditCard },
    { id: 'properties', label: 'Properties', icon: FiHome },
    
  ];

  return (
    <div className="space-y-6 p-4 lg:p-6 pb-24 h-[calc(100vh-64px)] overflow-y-auto custom-page-scroll bg-[#F8FAF9] relative">
      
      {/* Animated Background Elements (Keep as absolute) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
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
        onConfirm={() => { if (confirmAction?.onConfirm) confirmAction.onConfirm(); setConfirmAction(null); }}
        onCancel={() => setConfirmAction(null)}
      />

      {/* Header */}
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-[#00695C] via-[#26A69A] to-[#4DB6AC] bg-clip-text text-transparent">
                Payments Management
              </h1>
              <span className="px-3 py-1.5 bg-gradient-to-r from-[#E8F4F2] to-[#D5F0EA] text-[#00695C] text-xs font-black rounded-full flex items-center gap-1.5">
                <FiCreditCard className="text-[10px]" /> Super Admin
              </span>
            </div>
            <p className="text-sm text-[#3D5A55] font-semibold flex items-center gap-2 flex-wrap">
              <span>Manage all payment transactions across the platform</span>
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
              <FiCreditCard className="text-sm" /><span>Manage</span>
            </button>
            <button onClick={handleRefresh} disabled={actionLoading === 'refresh'} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E8F0EE] rounded-xl text-sm font-black text-[#0F1A18] hover:scale-105 transition-all disabled:opacity-50">
              <FiRefreshCw className={`text-sm ${actionLoading === 'refresh' ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{actionLoading === 'refresh' ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>
      </div>

      {activeView === 'overview' ? (
        <OverviewTab
          key={`payments-overview-${datePreset}`}
          stats={paymentStats}
          config={USER_TYPE_CONFIG['Owner']}
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
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${isActive ? 'bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white shadow-md' : 'text-[#3D5A55] hover:bg-[#F5F9F8]'}`}>
                  <TabIcon className="text-sm" /> {tab.label}
                </button>
              );
            })}
          </div>

          <div key={`payments-tab-${activeTab}-${datePreset}`}>
            {activeTab === 'transactions' && (
              <TransactionsTab
                payments={payments}
                onDelete={handleDeletePayment}
                showToast={showToast}
                dateRangeLabel={dateRangeLabel}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                selectedUserType={selectedUserType}
                setSelectedUserType={setSelectedUserType}
                viewMode={viewMode}
                setViewMode={setViewMode}
                actionLoading={actionLoading}
              />
            )}
            
            {activeTab === 'properties' && (
              <PropertiesTab
                payments={payments}
                dateRangeLabel={dateRangeLabel}
              />
            )}
           
          </div>
        </>
      )}

      <div className="pb-30"/>

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

export default PaymentsManagement;