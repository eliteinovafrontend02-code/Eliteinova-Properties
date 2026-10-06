// src/components/admin/LeadManagement/LeadDetails.jsx

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FiSearch, FiChevronDown, FiChevronLeft, FiChevronRight, FiEye, FiEdit,
  FiTrash2, FiRefreshCw, FiDownload, FiAlertTriangle, FiInfo, FiX, FiList,
  FiGrid as FiGridIcon, FiTag, FiSave, FiFileText, FiHash,
  FiCheckCircle, FiXCircle, FiBriefcase,
  FiActivity, FiUser, FiMail, FiPhone, FiClock,
  FiDollarSign, FiTrendingUp, FiCalendar, FiHome,
  FiClipboard, FiShoppingBag, FiKey, FiMap, FiLayers, FiPackage,
  FiPercent, FiServer, FiGlobe, FiShield, FiAward, FiTarget,
  FiUsers, FiHome as FiHomeIcon, FiCheck, FiMoreVertical, FiPlus,
  FiThumbsUp, FiSend, FiLock, FiUnlock, FiExternalLink, FiArrowLeft,
  FiUserPlus, FiUserCheck, FiUserX, FiStar, FiFlag, FiMessageSquare,
  FiNavigation, FiCheckSquare, FiCopy, FiSlash, FiEdit2, FiCreditCard,
  FiPieChart, FiBarChart2, FiUserMinus, FiMessageCircle, FiAtSign,
  FiMapPin, FiMaximize, FiMinimize
} from 'react-icons/fi';
import { FaHome, FaHotel, FaHardHat, FaCheckDouble, FaRupeeSign } from 'react-icons/fa';

// ============================================================
// LEAD STATUS CONFIG
// ============================================================
const LEAD_STATUS_TYPES = {
  'New': { icon: FiStar, color: 'from-blue-600 to-blue-400', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', label: 'New' },
  'Contacted': { icon: FiPhone, color: 'from-cyan-600 to-cyan-400', bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', label: 'Contacted' },
  'Interested': { icon: FiThumbsUp, color: 'from-emerald-600 to-emerald-400', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Interested' },
  'Follow-Up': { icon: FiRefreshCw, color: 'from-amber-600 to-amber-400', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Follow-Up' },
  'Site Visit Scheduled': { icon: FiCalendar, color: 'from-purple-600 to-purple-400', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', label: 'Site Visit Scheduled' },
  'Site Visit Completed': { icon: FiCheckCircle, color: 'from-indigo-600 to-indigo-400', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', label: 'Site Visit Completed' },
  'Negotiation': { icon: FiDollarSign, color: 'from-orange-600 to-orange-400', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', label: 'Negotiation' },
  'Lost': { icon: FiXCircle, color: 'from-red-600 to-red-400', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'Lost' },
  'Invalid Lead': { icon: FiSlash, color: 'from-slate-600 to-slate-400', bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', label: 'Invalid Lead' },
  'Duplicate Lead': { icon: FiCopy, color: 'from-pink-600 to-pink-400', bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200', label: 'Duplicate Lead' }
};

const ALL_LEAD_STATUSES = Object.keys(LEAD_STATUS_TYPES);

// ============================================================
// LEAD PRIORITY CONFIG
// ============================================================
const LEAD_PRIORITY_TYPES = {
  'High': { icon: FiFlag, color: 'from-red-600 to-red-400', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'High' },
  'Medium': { icon: FiFlag, color: 'from-amber-600 to-amber-400', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Medium' },
  'Low': { icon: FiFlag, color: 'from-emerald-600 to-emerald-400', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Low' }
};

const ALL_LEAD_PRIORITIES = Object.keys(LEAD_PRIORITY_TYPES);

// ============================================================
// LEAD TYPE CONFIG
// ============================================================
const LEAD_TYPE_CONFIG = {
  'Buy Enquiry': { icon: FiShoppingBag, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Rent Enquiry': { icon: FiKey, bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'Lease Enquiry': { icon: FiFileText, bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  'Property Listing Enquiry': { icon: FiHomeIcon, bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  'Property Contact Request': { icon: FiPhone, bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  'Site Visit Request': { icon: FiCalendar, bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  'Property Information Request': { icon: FiInfo, bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
  'Price Enquiry': { icon: FiDollarSign, bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  'Home Construction Enquiry': { icon: FaHardHat, bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  'Land Purchase Enquiry': { icon: FiMap, bg: 'bg-lime-50', text: 'text-lime-700', border: 'border-lime-200' },
  'Property Management Enquiry': { icon: FiClipboard, bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  'Service Enquiry': { icon: FiBriefcase, bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
  'Other Enquiry': { icon: FiMoreVertical, bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' }
};

const ALL_LEAD_TYPES = Object.keys(LEAD_TYPE_CONFIG);

// ============================================================
// LEAD SOURCE CONFIG
// ============================================================
const LEAD_SOURCE_CONFIG = {
  'Website': { icon: FiGlobe, bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'Advertisement': { icon: FiTarget, bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  'Social Media': { icon: FiUsers, bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
  'Referral': { icon: FiAward, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Direct Enquiry': { icon: FiSend, bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  'Others': { icon: FiMoreVertical, bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' }
};

const ALL_LEAD_SOURCES = Object.keys(LEAD_SOURCE_CONFIG);

// ============================================================
// PROPERTY TYPE CONFIG
// ============================================================
const PROPERTY_TYPE_CONFIG = {
  'Individual': { icon: FiUser, bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
  'Apartment': { icon: FaHome, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Commercial': { icon: FiBriefcase, bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'Land & Plots': { icon: FiMap, bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  'Hostel': { icon: FaHotel, bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' }
};

const ALL_PROPERTY_TYPES = ['Individual', 'Apartment', 'Commercial', 'Land & Plots', 'Hostel'];

// ============================================================
// PURPOSE CONFIG
// ============================================================
const PURPOSE_CONFIG = {
  'Buy': { icon: FiShoppingBag, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Rent': { icon: FiKey, bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'Lease': { icon: FiFileText, bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' }
};

const ALL_PURPOSES = ['Buy', 'Rent', 'Lease'];

// ============================================================
// TRANSACTION TYPE CONFIG
// ============================================================
const TRANSACTION_TYPES = ['Sale', 'Rent', 'Lease', 'Joint Venture', 'Other'];

// ============================================================
// PAYMENT STATUS CONFIG
// ============================================================
const PAYMENT_STATUS_TYPES = {
  'Pending': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: FiClock },
  'Partial': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: FiPieChart },
  'Completed': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: FiCheckCircle },
  'Overdue': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: FiAlertTriangle }
};

const ALL_PAYMENT_STATUSES = Object.keys(PAYMENT_STATUS_TYPES);

// ============================================================
// AGREEMENT STATUS CONFIG
// ============================================================
const AGREEMENT_STATUS_TYPES = {
  'Not Started': { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', icon: FiFileText },
  'Draft': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: FiEdit },
  'Under Review': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: FiEye },
  'Signed': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: FiCheckCircle },
  'Cancelled': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: FiXCircle }
};

const ALL_AGREEMENT_STATUSES = Object.keys(AGREEMENT_STATUS_TYPES);

// ============================================================
// USER TYPE CONFIG
// ============================================================
const USER_TYPES = ['Owner', 'Agent', 'Builder', 'Property Manager'];

// ============================================================
// PREFERRED CONTACT METHODS
// ============================================================
const CONTACT_METHODS = ['Phone', 'Email', 'WhatsApp', 'SMS', 'Any'];

// ============================================================
// FURNISHING TYPES
// ============================================================
const FURNISHING_TYPES = ['Unfurnished', 'Semi-Furnished', 'Fully Furnished'];

// ============================================================
// FACING DIRECTIONS
// ============================================================
const FACING_DIRECTIONS = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'];

// ============================================================
// BUDGET TYPES
// ============================================================
const BUDGET_TYPES = ['Total Budget', 'Per Sq.Ft', 'Monthly Rent', 'Yearly Lease'];

// ============================================================
// AVAILABLE AGENTS
// ============================================================
const AVAILABLE_AGENTS = [
  { id: 'agent_1', name: 'Rajesh Kumar', email: 'rajesh.kumar@company.com', role: 'Senior Agent', avatar: 'RK' },
  { id: 'agent_2', name: 'Priya Sharma', email: 'priya.sharma@company.com', role: 'Sales Manager', avatar: 'PS' },
  { id: 'agent_3', name: 'Amit Patel', email: 'amit.patel@company.com', role: 'Field Agent', avatar: 'AP' },
  { id: 'agent_4', name: 'Sneha Reddy', email: 'sneha.reddy@company.com', role: 'Lease Specialist', avatar: 'SR' },
  { id: 'agent_5', name: 'Vikram Singh', email: 'vikram.singh@company.com', role: 'Senior Agent', avatar: 'VS' },
  { id: 'agent_6', name: 'Anjali Desai', email: 'anjali.desai@company.com', role: 'Junior Agent', avatar: 'AD' },
];

// ============================================================
// HELPERS
// ============================================================
const resolveCustomerId = (lead) => {
  if (!lead) return '';
  if (lead.customerId && String(lead.customerId).trim() !== '') {
    return lead.customerId;
  }
  return `CUST-${String(lead.id || '').replace('lead_', '').padStart(4, '0')}`;
};

const resolvePropertyId = (lead) => {
  if (!lead) return '';
  if (lead.propertyId && String(lead.propertyId).trim() !== '') {
    return lead.propertyId;
  }
  const seed = `${lead.propertyName || ''}::${lead.location || ''}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return `PROP-${String(hash % 100000).padStart(5, '0')}`;
};

const formatCurrency = (value) => {
  if (!value && value !== 0) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// ============================================================
// DATE RANGE HELPERS
// ============================================================
const getDateRangeBounds = (range, customStart, customEnd) => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let start = null;
  let end = null;

  switch (range) {
    case 'today':
      start = startOfToday;
      end = new Date(startOfToday);
      end.setHours(23, 59, 59, 999);
      break;

    case 'yesterday': {
      const y = new Date(startOfToday);
      y.setDate(y.getDate() - 1);
      start = y;
      end = new Date(y);
      end.setHours(23, 59, 59, 999);
      break;
    }

    case 'this_week': {
      const day = startOfToday.getDay();
      const diffToMonday = day === 0 ? -6 : 1 - day;
      start = new Date(startOfToday);
      start.setDate(start.getDate() + diffToMonday);
      end = new Date(startOfToday);
      end.setDate(end.getDate() + (7 + diffToMonday));
      end.setHours(23, 59, 59, 999);
      break;
    }

    case 'this_month':
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      break;

    case 'this_quarter': {
      const q = Math.floor(now.getMonth() / 3);
      start = new Date(now.getFullYear(), q * 3, 1);
      end = new Date(now.getFullYear(), q * 3 + 3, 0);
      end.setHours(23, 59, 59, 999);
      break;
    }

    case 'this_year':
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31);
      end.setHours(23, 59, 59, 999);
      break;

    case 'custom':
      if (customStart) {
        start = new Date(customStart);
        start.setHours(0, 0, 0, 0);
      }
      if (customEnd) {
        end = new Date(customEnd);
        end.setHours(23, 59, 59, 999);
      }
      break;

    case 'all':
    default:
      return { start: null, end: null };
  }

  return { start, end };
};

const getDateRangeLabel = (range, customStart, customEnd) => {
  switch (range) {
    case 'today': return 'Today';
    case 'yesterday': return 'Yesterday';
    case 'this_week': return 'This Week';
    case 'this_month': return 'This Month';
    case 'this_quarter': return 'This Quarter';
    case 'this_year': return 'This Year';
    case 'custom':
      if (customStart && customEnd) {
        const s = new Date(customStart).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
        const e = new Date(customEnd).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
        return `${s} – ${e}`;
      }
      return 'Custom Range';
    case 'all': return 'All Time';
    default: return 'This Month';
  }
};

// ============================================================
// TOAST
// ============================================================
const Toast = ({ toast, setToast }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, setToast]);

  if (!toast) return null;

  const colors = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-500'
  };

  return (
    <div className={`fixed bottom-6 right-6 z-[100] px-6 py-4 rounded-2xl text-white shadow-2xl flex items-center gap-3 animate-slide-up ${colors[toast.type] || colors.success}`}>
      {toast.type === 'success' && <FiCheckCircle className="text-lg" />}
      {toast.type === 'error' && <FiXCircle className="text-lg" />}
      {toast.type === 'warning' && <FiAlertTriangle className="text-lg" />}
      {toast.type === 'info' && <FiInfo className="text-lg" />}
      <span className="text-sm font-medium">{toast.message}</span>
    </div>
  );
};

// ============================================================
// CONFIRMATION MODAL
// ============================================================
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText, type = 'danger' }) => {
  if (!isOpen) return null;

  const typeStyles = {
    danger: { icon: 'text-red-600', bg: 'bg-red-50', button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500', border: 'border-red-200' },
    warning: { icon: 'text-amber-600', bg: 'bg-amber-50', button: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500', border: 'border-amber-200' },
    info: { icon: 'text-blue-600', bg: 'bg-blue-50', button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500', border: 'border-blue-200' },
    success: { icon: 'text-emerald-600', bg: 'bg-emerald-50', button: 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500', border: 'border-emerald-200' }
  };

  const style = typeStyles[type] || typeStyles.danger;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
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
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-white text-[#1A2E2A] rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 text-sm font-medium border border-[#E8F0EE] hover:scale-[1.02]"
          >
            {cancelText || 'Cancel'}
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={`flex-1 px-4 py-2.5 text-white rounded-xl transition-all duration-300 text-sm font-medium shadow-lg hover:scale-[1.02] ${style.button}`}
          >
            {confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// DATE RANGE DROPDOWN COMPONENT
// ============================================================
const DateRangeDropdown = ({ value, onChange, customStart, customEnd, onCustomChange, label }) => {
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

  const options = [
    { id: 'today', label: 'Today', icon: FiCalendar },
    { id: 'yesterday', label: 'Yesterday', icon: FiClock },
    { id: 'this_week', label: 'This Week', icon: FiCalendar },
    { id: 'this_month', label: 'This Month', icon: FiCalendar },
    { id: 'this_quarter', label: 'This Quarter', icon: FiTrendingUp },
    { id: 'this_year', label: 'This Year', icon: FiTrendingUp },
  ];

  const handleSelect = (id) => {
    onChange(id);
    setIsOpen(false);
    setShowCustom(false);
  };

  const handleCustomApply = () => {
    if (customStart && customEnd) {
      onChange('custom');
      setIsOpen(false);
      setShowCustom(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8F0EE] rounded-xl hover:border-[#00695C]/30 hover:shadow-md transition-all duration-300 text-sm font-medium text-[#1A2E2A] hover:scale-105"
      >
        <FiCalendar className="text-sm text-[#00695C]" />
        <span className="font-semibold text-[#00695C] whitespace-nowrap">{label}</span>
        <FiChevronDown className={`text-sm text-[#5A7D78] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#E8F0EE] py-2 z-50 animate-slide-down max-h-[500px] overflow-y-auto">
          <div className="px-4 py-2">
            <p className="text-[10px] font-bold text-[#5A7D78] uppercase tracking-wider">Quick Ranges</p>
          </div>

          {options.map((opt) => {
            const Icon = opt.icon;
            const isSelected = value === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                className={`w-full px-4 py-2.5 text-left text-sm transition-all duration-200 flex items-center gap-3 hover:bg-[#F5F9F8] ${
                  isSelected ? 'bg-[#E8F4F2] text-[#00695C] font-semibold' : 'text-[#1A2E2A]'
                }`}
              >
                <Icon className={`text-sm ${isSelected ? 'text-[#00695C]' : 'text-[#5A7D78]'}`} />
                <span className="flex-1">{opt.label}</span>
                {isSelected && <FiCheckCircle className="text-[#00695C] text-sm" />}
              </button>
            );
          })}

          <div className="my-2 border-t border-[#E8F0EE]" />

          <button
            onClick={() => setShowCustom(!showCustom)}
            className={`w-full px-4 py-2.5 text-left text-sm transition-all duration-200 flex items-center gap-3 hover:bg-[#F5F9F8] ${
              value === 'custom' ? 'bg-[#E8F4F2] text-[#00695C] font-semibold' : 'text-[#1A2E2A]'
            }`}
          >
            <FiEdit className={`text-sm ${value === 'custom' ? 'text-[#00695C]' : 'text-[#5A7D78]'}`} />
            <span className="flex-1">Custom Range</span>
            {value === 'custom' && <FiCheckCircle className="text-[#00695C] text-sm" />}
            <FiChevronDown className={`text-sm text-[#5A7D78] transition-transform duration-300 ${showCustom ? 'rotate-180' : ''}`} />
          </button>

          {showCustom && (
            <div className="px-4 py-3 bg-[#F5F9F8] mx-2 rounded-xl space-y-3 animate-slide-down">
              <div>
                <label className="block text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => onCustomChange(e.target.value, customEnd)}
                  className="w-full px-3 py-2 bg-white rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={customEnd}
                  min={customStart}
                  onChange={(e) => onCustomChange(customStart, e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                />
              </div>
              <button
                onClick={handleCustomApply}
                disabled={!customStart || !customEnd}
                className="w-full px-4 py-2 bg-[#00695C] text-white rounded-lg hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#00695C]/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Apply Custom Range
              </button>
            </div>
          )}

          <div className="my-2 border-t border-[#E8F0EE]" />

          <button
            onClick={() => handleSelect('all')}
            className={`w-full px-4 py-2.5 text-left text-sm transition-all duration-200 flex items-center gap-3 hover:bg-[#F5F9F8] ${
              value === 'all' ? 'bg-[#E8F4F2] text-[#00695C] font-semibold' : 'text-[#1A2E2A]'
            }`}
          >
            <FiUsers className={`text-sm ${value === 'all' ? 'text-[#00695C]' : 'text-[#5A7D78]'}`} />
            <span className="flex-1">All Time</span>
            {value === 'all' && <FiCheckCircle className="text-[#00695C] text-sm" />}
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================================
// FILTER DROPDOWN COMPONENT
// ============================================================
const FilterDropdown = ({ label, options, value, onChange, icon: Icon, allLabel = 'All', disabled = false }) => {
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
        onClick={() => { if (!disabled) setIsOpen(!isOpen); }}
        disabled={disabled}
        className={`flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border transition-all duration-300 text-sm font-medium text-[#1A2E2A] hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
          value !== 'all' ? 'border-[#00695C] ring-2 ring-[#00695C]/20 bg-[#F5F9F8]' : 'border-[#E8F0EE] hover:border-[#00695C]/30'
        }`}
      >
        {Icon && <Icon className="text-sm text-[#5A7D78]" />}
        <span className="whitespace-nowrap">{label}:</span>
        <span className="font-semibold text-[#00695C]">{displayLabel}</span>
        <FiChevronDown className={`text-sm text-[#5A7D78] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && !disabled && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E8F0EE] py-2 z-50 max-h-80 overflow-y-auto animate-slide-down">
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
// VIEW LEAD DETAIL MODAL - COMPREHENSIVE
// ============================================================
const ViewLeadDetailModal = ({ lead, show, onClose, onEdit, onDelete }) => {
  const [activeSection, setActiveSection] = useState('all');

  if (!lead || !show) return null;

  const statusConfig = LEAD_STATUS_TYPES[lead.leadStatus] || LEAD_STATUS_TYPES['New'];
  const StatusIcon = statusConfig.icon;
  const priorityConfig = LEAD_PRIORITY_TYPES[lead.priority] || LEAD_PRIORITY_TYPES['Medium'];
  const PriorityIcon = priorityConfig.icon;
  const leadTypeConfig = LEAD_TYPE_CONFIG[lead.leadType] || LEAD_TYPE_CONFIG['Buy Enquiry'];
  const LeadTypeIcon = leadTypeConfig.icon;
  const leadSourceConfig = LEAD_SOURCE_CONFIG[lead.leadSource] || LEAD_SOURCE_CONFIG['Website'];
  const LeadSourceIcon = leadSourceConfig.icon;
  const propTypeConfig = PROPERTY_TYPE_CONFIG[lead.propertyType] || PROPERTY_TYPE_CONFIG['Individual'];
  const PropTypeIcon = propTypeConfig.icon;
  const purposeConfig = PURPOSE_CONFIG[lead.purpose] || PURPOSE_CONFIG['Buy'];
  const PurposeIcon = purposeConfig.icon;

  const sections = [
    { id: 'all', label: 'All Details', icon: FiLayers },
    { id: 'lead-info', label: 'Lead Info', icon: FiInfo },
    { id: 'customer-info', label: 'Customer', icon: FiUser },
    { id: 'property-info', label: 'Property', icon: FiHomeIcon },
    { id: 'assignment', label: 'Assignment', icon: FiUserCheck },
    { id: 'communication', label: 'Communication', icon: FiPhone },
    { id: 'follow-up', label: 'Follow-Up', icon: FiCalendar },
    { id: 'site-visit', label: 'Site Visit', icon: FiNavigation },
    { id: 'notes', label: 'Notes', icon: FiClipboard },
    { id: 'conversion', label: 'Conversion', icon: FiTrendingUp },
  ];

  const renderSection = (sectionId) => {
    switch (sectionId) {
      case 'lead-info':
        return (
          <div className="bg-white rounded-2xl border border-[#E8F0EE] p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white">
                <FiInfo className="text-sm" />
              </div>
              <h3 className="text-sm font-bold text-[#1A2E2A] uppercase tracking-wider">Lead Information</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Lead ID</p>
                <p className="text-sm font-bold text-[#1A2E2A] flex items-center gap-2">
                  <FiHash className="text-[#00695C]" />{lead.leadId}
                </p>
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Created Date</p>
                <p className="text-sm font-bold text-[#1A2E2A] flex items-center gap-2">
                  <FiCalendar className="text-[#00695C]" />{formatDate(lead.leadDate)}
                </p>
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Lead Status</p>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold inline-flex items-center gap-1 ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                  <StatusIcon className="text-[10px]" />{statusConfig.label}
                </span>
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Lead Priority</p>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold inline-flex items-center gap-1 ${priorityConfig.bg} ${priorityConfig.text} border ${priorityConfig.border}`}>
                  <PriorityIcon className="text-[10px]" />{priorityConfig.label}
                </span>
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Lead Type</p>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold inline-flex items-center gap-1 ${leadTypeConfig.bg} ${leadTypeConfig.text} border ${leadTypeConfig.border}`}>
                  <LeadTypeIcon className="text-[10px]" />{lead.leadType}
                </span>
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Lead Source</p>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold inline-flex items-center gap-1 ${leadSourceConfig.bg} ${leadSourceConfig.text} border ${leadSourceConfig.border}`}>
                  <LeadSourceIcon className="text-[10px]" />{lead.leadSource}
                </span>
              </div>
            </div>
          </div>
        );

      case 'customer-info':
        return (
          <div className="bg-white rounded-2xl border border-[#E8F0EE] p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-600 to-pink-400 flex items-center justify-center text-white">
                <FiUser className="text-sm" />
              </div>
              <h3 className="text-sm font-bold text-[#1A2E2A] uppercase tracking-wider">Customer Information & Requirements</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Customer Name</p>
                <p className="text-sm font-bold text-[#1A2E2A]">{lead.customerName}</p>
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Mobile Number</p>
                <p className="text-sm font-bold text-[#1A2E2A] flex items-center gap-2">
                  <FiPhone className="text-[#00695C]" />{lead.mobileNumber}
                </p>
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Email Address</p>
                <p className="text-sm font-bold text-[#1A2E2A] flex items-center gap-2">
                  <FiMail className="text-[#00695C]" />{lead.customerEmail || 'N/A'}
                </p>
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">User Type</p>
                <p className="text-sm font-bold text-[#1A2E2A]">{lead.userType || 'Owner'}</p>
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Preferred Contact Method</p>
                <p className="text-sm font-bold text-[#1A2E2A]">{lead.preferredContactMethod || 'Phone'}</p>
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Customer Requirement</p>
                <p className="text-sm font-bold text-[#1A2E2A]">{lead.customerRequirement || 'N/A'}</p>
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Budget</p>
                <p className="text-sm font-bold text-[#1A2E2A] flex items-center gap-2">
                  <FaRupeeSign className="text-[#00695C]" />{formatCurrency(lead.budget)}
                </p>
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Preferred Location</p>
                <p className="text-sm font-bold text-[#1A2E2A] flex items-center gap-2">
                  <FiMapPin className="text-[#00695C]" />{lead.preferredLocation || lead.location || 'N/A'}
                </p>
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Property Type</p>
                <p className="text-sm font-bold text-[#1A2E2A]">{lead.propertyType || 'N/A'}</p>
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Purpose</p>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold inline-flex items-center gap-1.5 ${purposeConfig.bg} ${purposeConfig.text} border ${purposeConfig.border}`}>
                  <PurposeIcon className="text-xs shrink-0" />
                  <span>{lead.purpose}</span>
                </span>
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Minimum Budget</p>
                <p className="text-sm font-bold text-[#1A2E2A] flex items-center gap-2">
                  <FaRupeeSign className="text-[#00695C]" />{formatCurrency(lead.minimumBudget)}
                </p>
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Maximum Budget</p>
                <p className="text-sm font-bold text-[#1A2E2A] flex items-center gap-2">
                  <FaRupeeSign className="text-[#00695C]" />{formatCurrency(lead.maximumBudget)}
                </p>
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Budget Type</p>
                <p className="text-sm font-bold text-[#1A2E2A]">{lead.budgetType || 'Total Budget'}</p>
              </div>
            </div>
          </div>
        );

      case 'property-info':
        return (
          <div className="bg-white rounded-2xl border border-[#E8F0EE] p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-600 to-teal-400 flex items-center justify-center text-white">
                <FiHomeIcon className="text-sm" />
              </div>
              <h3 className="text-sm font-bold text-[#1A2E2A] uppercase tracking-wider">Property Information & Requirements</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Property ID</p>
                <p className="text-sm font-bold text-[#1A2E2A] flex items-center gap-2">
                  <FiHash className="text-[#00695C]" />{resolvePropertyId(lead)}
                </p>
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Property Name</p>
                <p className="text-sm font-bold text-[#1A2E2A]">{lead.propertyName}</p>
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Property Type</p>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold inline-flex items-center gap-1 ${propTypeConfig.bg} ${propTypeConfig.text} border ${propTypeConfig.border}`}>
                  <PropTypeIcon className="text-[10px]" />{lead.propertyType}
                </span>
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Purpose</p>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold inline-flex items-center gap-1.5 ${purposeConfig.bg} ${purposeConfig.text} border ${purposeConfig.border}`}>
                  <PurposeIcon className="text-xs shrink-0" />
                  <span>{lead.purpose}</span>
                </span>
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Property Owner Details</p>
                <p className="text-sm font-bold text-[#1A2E2A]">{lead.propertyOwnerDetails || 'N/A'}</p>
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Property Location</p>
                <p className="text-sm font-bold text-[#1A2E2A] flex items-center gap-2">
                  <FiMapPin className="text-[#00695C]" />{lead.location}
                </p>
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Preferred State</p>
                <p className="text-sm font-bold text-[#1A2E2A]">{lead.preferredState || 'N/A'}</p>
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Preferred City</p>
                <p className="text-sm font-bold text-[#1A2E2A]">{lead.preferredCity || 'N/A'}</p>
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Preferred Area</p>
                <p className="text-sm font-bold text-[#1A2E2A]">{lead.preferredArea || 'N/A'}</p>
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Minimum Area</p>
                <p className="text-sm font-bold text-[#1A2E2A]">{lead.minimumArea ? `${lead.minimumArea} sq.ft` : 'N/A'}</p>
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Maximum Area</p>
                <p className="text-sm font-bold text-[#1A2E2A]">{lead.maximumArea ? `${lead.maximumArea} sq.ft` : 'N/A'}</p>
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Bedrooms</p>
                <p className="text-sm font-bold text-[#1A2E2A]">{lead.bedrooms || 'N/A'}</p>
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Bathrooms</p>
                <p className="text-sm font-bold text-[#1A2E2A]">{lead.bathrooms || 'N/A'}</p>
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Furnishing</p>
                <p className="text-sm font-bold text-[#1A2E2A]">{lead.furnishing || 'N/A'}</p>
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Preferred Facing</p>
                <p className="text-sm font-bold text-[#1A2E2A]">{lead.preferredFacing || 'N/A'}</p>
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3 sm:col-span-2 lg:col-span-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Required Amenities</p>
                <div className="flex flex-wrap gap-1.5">
                  {(lead.requiredAmenities || []).length > 0 ? (
                    lead.requiredAmenities.map((amenity, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-1 rounded-full font-semibold bg-[#E8F4F2] text-[#00695C] border border-[#00695C]/20">
                        {amenity}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm font-bold text-[#1A2E2A]">None specified</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'assignment':
        return (
          <div className="bg-white rounded-2xl border border-[#E8F0EE] p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white">
                <FiUserCheck className="text-sm" />
              </div>
              <h3 className="text-sm font-bold text-[#1A2E2A] uppercase tracking-wider">Assignment</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Assigned To</p>
                <p className="text-sm font-bold text-[#1A2E2A] flex items-center gap-2">
                  <FiUserCheck className="text-[#00695C]" />{lead.assignedTo || 'Unassigned'}
                </p>
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Assigned Date</p>
                <p className="text-sm font-bold text-[#1A2E2A]">{formatDate(lead.assignedDate)}</p>
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Assignment Status</p>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${lead.assignedTo ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                  {lead.assignedTo ? 'Assigned' : 'Pending'}
                </span>
              </div>
            </div>
          </div>
        );

      case 'communication':
        return (
          <div className="bg-white rounded-2xl border border-[#E8F0EE] p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-600 to-cyan-400 flex items-center justify-center text-white">
                <FiPhone className="text-sm" />
              </div>
              <h3 className="text-sm font-bold text-[#1A2E2A] uppercase tracking-wider">Communication</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Last Contacted</p>
                <p className="text-sm font-bold text-[#1A2E2A] flex items-center gap-2">
                  <FiClock className="text-[#00695C]" />{formatDateTime(lead.lastContactedAt)}
                </p>
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Contact Method</p>
                <p className="text-sm font-bold text-[#1A2E2A]">{lead.preferredContactMethod || 'Phone'}</p>
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Total Communications</p>
                <p className="text-sm font-bold text-[#1A2E2A]">{lead.communicationCount || 0}</p>
              </div>
            </div>
          </div>
        );

      case 'follow-up':
        return (
          <div className="bg-white rounded-2xl border border-[#E8F0EE] p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-600 to-amber-400 flex items-center justify-center text-white">
                <FiCalendar className="text-sm" />
              </div>
              <h3 className="text-sm font-bold text-[#1A2E2A] uppercase tracking-wider">Follow-Up</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Next Follow-Up</p>
                <p className="text-sm font-bold text-[#1A2E2A] flex items-center gap-2">
                  <FiCalendar className="text-[#00695C]" />{formatDateTime(lead.nextFollowUp)}
                </p>
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Follow-Up Count</p>
                <p className="text-sm font-bold text-[#1A2E2A]">{lead.followUpCount || 0}</p>
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Follow-Up Status</p>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${lead.nextFollowUp ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-50 text-slate-700 border border-slate-200'}`}>
                  {lead.nextFollowUp ? 'Scheduled' : 'Not Scheduled'}
                </span>
              </div>
            </div>
          </div>
        );

      case 'site-visit':
        return (
          <div className="bg-white rounded-2xl border border-[#E8F0EE] p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center text-white">
                <FiNavigation className="text-sm" />
              </div>
              <h3 className="text-sm font-bold text-[#1A2E2A] uppercase tracking-wider">Site Visit</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Site Visit Date</p>
                <p className="text-sm font-bold text-[#1A2E2A] flex items-center gap-2">
                  <FiNavigation className="text-purple-600" />{formatDateTime(lead.siteVisitDate)}
                </p>
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Site Visit Status</p>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${lead.siteVisitDate ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-slate-50 text-slate-700 border border-slate-200'}`}>
                  {lead.siteVisitDate ? 'Scheduled' : 'Not Scheduled'}
                </span>
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Assigned Agent</p>
                <p className="text-sm font-bold text-[#1A2E2A]">{lead.assignedTo || 'N/A'}</p>
              </div>
              {lead.siteVisitNotes && (
                <div className="bg-[#F5F9F8] rounded-xl p-3 sm:col-span-2 lg:col-span-3">
                  <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Site Visit Notes</p>
                  <p className="text-sm text-[#1A2E2A]">📝 {lead.siteVisitNotes}</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'notes':
        return (
          <div className="bg-white rounded-2xl border border-[#E8F0EE] p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-600 to-teal-400 flex items-center justify-center text-white">
                <FiClipboard className="text-sm" />
              </div>
              <h3 className="text-sm font-bold text-[#1A2E2A] uppercase tracking-wider">Notes</h3>
            </div>
            {(lead.notes || []).length > 0 ? (
              <div className="space-y-3">
                {lead.notes.map((note, idx) => (
                  <div key={idx} className="bg-[#F5F9F8] rounded-xl p-3 border border-[#E8F0EE]">
                    <p className="text-sm text-[#1A2E2A]">{note.text}</p>
                    <p className="text-[10px] text-[#5A7D78] mt-1">{note.addedBy} • {formatDateTime(note.addedAt)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#5A7D78] text-center py-6">No notes added yet</p>
            )}
          </div>
        );

      case 'conversion':
        return (
          <div className="bg-white rounded-2xl border border-[#E8F0EE] p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-400 flex items-center justify-center text-white">
                <FiTrendingUp className="text-sm" />
              </div>
              <h3 className="text-sm font-bold text-[#1A2E2A] uppercase tracking-wider">Lead Conversion</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Lead ID</p>
                <p className="text-sm font-bold text-[#1A2E2A] flex items-center gap-2">
                  <FiHash className="text-[#00695C]" />{lead.leadId}
                </p>
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Customer Name</p>
                <p className="text-sm font-bold text-[#1A2E2A]">{lead.customerName}</p>
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Property ID</p>
                <p className="text-sm font-bold text-[#1A2E2A] flex items-center gap-2">
                  <FiHash className="text-[#00695C]" />{resolvePropertyId(lead)}
                </p>
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Property Name</p>
                <p className="text-sm font-bold text-[#1A2E2A]">{lead.propertyName}</p>
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Transaction Type</p>
                <p className="text-sm font-bold text-[#1A2E2A]">{lead.transactionType || 'Sale'}</p>
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Converted By</p>
                <p className="text-sm font-bold text-[#1A2E2A]">{lead.convertedBy || 'N/A'}</p>
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Conversion Date</p>
                <p className="text-sm font-bold text-[#1A2E2A]">{formatDate(lead.conversionDate)}</p>
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Final Deal Value</p>
                <p className="text-sm font-bold text-[#1A2E2A] flex items-center gap-2">
                  <FaRupeeSign className="text-[#00695C]" />{formatCurrency(lead.finalDealValue)}
                </p>
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Commission</p>
                <p className="text-sm font-bold text-[#1A2E2A] flex items-center gap-2">
                  <FiPercent className="text-[#00695C]" />{lead.commission || 0}%
                </p>
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Payment Status</p>
                {(() => {
                  const psConfig = PAYMENT_STATUS_TYPES[lead.paymentStatus] || PAYMENT_STATUS_TYPES['Pending'];
                  const PSIcon = psConfig.icon;
                  return (
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold inline-flex items-center gap-1 ${psConfig.bg} ${psConfig.text} border ${psConfig.border}`}>
                      <PSIcon className="text-[10px]" />{lead.paymentStatus || 'Pending'}
                    </span>
                  );
                })()}
              </div>
              <div className="bg-[#F5F9F8] rounded-xl p-3">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Agreement Status</p>
                {(() => {
                  const asConfig = AGREEMENT_STATUS_TYPES[lead.agreementStatus] || AGREEMENT_STATUS_TYPES['Not Started'];
                  const ASIcon = asConfig.icon;
                  return (
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold inline-flex items-center gap-1 ${asConfig.bg} ${asConfig.text} border ${asConfig.border}`}>
                      <ASIcon className="text-[10px]" />{lead.agreementStatus || 'Not Started'}
                    </span>
                  );
                })()}
              </div>
            </div>
          </div>
        );

      case 'all':
      default:
        return (
          <div className="space-y-5">
            {renderSection('lead-info')}
            {renderSection('customer-info')}
            {renderSection('property-info')}
            {renderSection('assignment')}
            {renderSection('communication')}
            {renderSection('follow-up')}
            {renderSection('site-visit')}
            {renderSection('notes')}
            {renderSection('conversion')}
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 rounded-t-3xl z-10 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-14 h-14 rounded-2xl ${statusConfig.bg} border-2 border-white/30 flex items-center justify-center text-2xl ${statusConfig.text} shadow-lg`}>
              <StatusIcon />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{lead.customerName}</h2>
              <p className="text-white/80 text-sm flex items-center gap-2 flex-wrap">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                  {statusConfig.label}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityConfig.bg} ${priorityConfig.text} border ${priorityConfig.border}`}>
                  <PriorityIcon className="inline text-xs mr-1" />{priorityConfig.label}
                </span>
                <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                <span>Lead ID: {lead.leadId}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-white/20 text-white border border-white/30">
              <LeadTypeIcon className="text-xs" /> {lead.leadType}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-white/20 text-white border border-white/30">
              <LeadSourceIcon className="text-xs" /> {lead.leadSource}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-white/20 text-white border border-white/30">
              <PurposeIcon className="text-xs" /> {lead.purpose}
            </span>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="bg-white border-b border-[#E8F0EE] px-4 py-3 shrink-0">
          <div className="flex flex-wrap items-center gap-1.5">
            {sections.map((section) => {
              const SectionIcon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-300 whitespace-nowrap hover:scale-105 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white shadow-lg shadow-[#00695C]/30'
                      : 'bg-[#F5F9F8] text-[#5A7D78] hover:bg-[#E8F0EE] hover:text-[#1A2E2A] border border-[#E8F0EE]'
                  }`}
                >
                  <SectionIcon className="text-[10px]" />
                  {section.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#F8FAF9]">
          <div className="animate-fade-in">
            {renderSection(activeSection)}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 px-6 py-4 bg-white border-t border-[#E8F0EE] rounded-b-3xl shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium min-w-[100px]"
            >
              Close
            </button>
            <button
              onClick={() => { if (onEdit) { onEdit(lead); onClose(); } }}
              className="flex-1 px-4 py-2.5 bg-[#26A69A] text-white rounded-xl hover:bg-[#1A8A7A] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#26A69A]/30 hover:scale-[1.02] min-w-[100px]"
            >
              <FiEdit className="inline mr-2" /> Edit
            </button>
            <button
              onClick={() => { if (onDelete) { onDelete(lead.id); } }}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 text-sm font-medium shadow-lg shadow-red-600/30 hover:scale-[1.02] min-w-[100px]"
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
// EDIT LEAD MODAL - COMPREHENSIVE
// ============================================================
const EditLeadModal = ({ lead, show, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    // Lead Info
    leadId: '', leadDate: '', leadStatus: 'New', priority: 'Medium',
    leadType: '', leadSource: '',
    // Customer Info
    customerName: '', mobileNumber: '', customerEmail: '', userType: 'Owner',
    preferredContactMethod: 'Phone', customerRequirement: '', budget: '',
    preferredLocation: '', propertyType: '', purpose: '',
    minimumBudget: '', maximumBudget: '', budgetType: 'Total Budget',
    // Property Info
    propertyId: '', propertyName: '', propertyOwnerDetails: '',
    location: '', preferredState: '', preferredCity: '', preferredArea: '',
    minimumArea: '', maximumArea: '', bedrooms: '', bathrooms: '',
    furnishing: '', preferredFacing: '', requiredAmenities: [],
    // Assignment
    assignedTo: '', assignedDate: '',
    // Communication
    lastContactedAt: '', communicationCount: 0,
    // Follow-Up
    nextFollowUp: '', followUpCount: 0,
    // Site Visit
    siteVisitDate: '', siteVisitNotes: '',
    // Conversion
    transactionType: 'Sale', convertedBy: '', conversionDate: '',
    finalDealValue: '', commission: '', paymentStatus: 'Pending', agreementStatus: 'Not Started',
    // Description
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('lead-info');
  const [amenityInput, setAmenityInput] = useState('');

  useEffect(() => {
    if (lead) {
      setFormData({
        leadId: lead.leadId || '',
        leadDate: lead.leadDate ? lead.leadDate.split('T')[0] : '',
        leadStatus: lead.leadStatus || 'New',
        priority: lead.priority || 'Medium',
        leadType: lead.leadType || '',
        leadSource: lead.leadSource || '',
        customerName: lead.customerName || '',
        mobileNumber: lead.mobileNumber || '',
        customerEmail: lead.customerEmail || '',
        userType: lead.userType || 'Owner',
        preferredContactMethod: lead.preferredContactMethod || 'Phone',
        customerRequirement: lead.customerRequirement || '',
        budget: lead.budget || '',
        preferredLocation: lead.preferredLocation || '',
        propertyType: lead.propertyType || '',
        purpose: lead.purpose || '',
        minimumBudget: lead.minimumBudget || '',
        maximumBudget: lead.maximumBudget || '',
        budgetType: lead.budgetType || 'Total Budget',
        propertyId: lead.propertyId || '',
        propertyName: lead.propertyName || '',
        propertyOwnerDetails: lead.propertyOwnerDetails || '',
        location: lead.location || '',
        preferredState: lead.preferredState || '',
        preferredCity: lead.preferredCity || '',
        preferredArea: lead.preferredArea || '',
        minimumArea: lead.minimumArea || '',
        maximumArea: lead.maximumArea || '',
        bedrooms: lead.bedrooms || '',
        bathrooms: lead.bathrooms || '',
        furnishing: lead.furnishing || '',
        preferredFacing: lead.preferredFacing || '',
        requiredAmenities: lead.requiredAmenities || [],
        assignedTo: lead.assignedTo || '',
        assignedDate: lead.assignedDate ? lead.assignedDate.split('T')[0] : '',
        lastContactedAt: lead.lastContactedAt ? lead.lastContactedAt.split('T')[0] : '',
        communicationCount: lead.communicationCount || 0,
        nextFollowUp: lead.nextFollowUp ? lead.nextFollowUp.split('T')[0] : '',
        followUpCount: lead.followUpCount || 0,
        siteVisitDate: lead.siteVisitDate ? lead.siteVisitDate.split('T')[0] : '',
        siteVisitNotes: lead.siteVisitNotes || '',
        transactionType: lead.transactionType || 'Sale',
        convertedBy: lead.convertedBy || '',
        conversionDate: lead.conversionDate ? lead.conversionDate.split('T')[0] : '',
        finalDealValue: lead.finalDealValue || '',
        commission: lead.commission || '',
        paymentStatus: lead.paymentStatus || 'Pending',
        agreementStatus: lead.agreementStatus || 'Not Started',
        description: lead.description || ''
      });
    }
  }, [lead]);

  if (!lead || !show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAmenity = () => {
    if (amenityInput.trim() && !formData.requiredAmenities.includes(amenityInput.trim())) {
      setFormData(prev => ({
        ...prev,
        requiredAmenities: [...prev.requiredAmenities, amenityInput.trim()]
      }));
      setAmenityInput('');
    }
  };

  const handleRemoveAmenity = (amenity) => {
    setFormData(prev => ({
      ...prev,
      requiredAmenities: prev.requiredAmenities.filter(a => a !== amenity)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onSave({ ...lead, ...formData });
      setLoading(false);
      onClose();
    }, 700);
  };

  const tabs = [
    { id: 'lead-info', label: 'Lead Info', icon: FiInfo },
    { id: 'customer-info', label: 'Customer', icon: FiUser },
    { id: 'property-info', label: 'Property', icon: FiHomeIcon },
    { id: 'assignment', label: 'Assignment', icon: FiUserCheck },
    { id: 'communication', label: 'Communication', icon: FiPhone },
    { id: 'follow-up', label: 'Follow-Up', icon: FiCalendar },
    { id: 'site-visit', label: 'Site Visit', icon: FiNavigation },
    { id: 'conversion', label: 'Conversion', icon: FiTrendingUp },
  ];

  const inputClass = "w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none";
  const selectClass = "w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none appearance-none";
  const labelClass = "block text-xs font-medium text-[#5A7D78] mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 rounded-t-3xl z-10 shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
          <h2 className="text-2xl font-bold text-white">Edit Lead</h2>
          <p className="text-white/80 text-sm">{lead.leadId} • {lead.customerName}</p>
        </div>

       {/* Tabs */}
<div className="bg-white border-b border-[#E8F0EE] px-4 py-3 shrink-0">
  <div className="flex flex-wrap items-center gap-1.5">
    {tabs.map((tab) => {
      const TabIcon = tab.icon;
      const isActive = activeTab === tab.id;
      return (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-300 whitespace-nowrap hover:scale-105 ${
            isActive
              ? 'bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white shadow-lg shadow-[#00695C]/30'
              : 'bg-[#F5F9F8] text-[#5A7D78] hover:bg-[#E8F0EE] hover:text-[#1A2E2A] border border-[#E8F0EE]'
          }`}
        >
          <TabIcon className="text-[10px]" />
          {tab.label}
        </button>
      );
    })}
  </div>
</div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#F8FAF9]">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Lead Info */}
            {activeTab === 'lead-info' && (
              <div className="bg-white rounded-2xl border border-[#E8F0EE] p-5 animate-fade-in">
                <div className="flex items-center gap-2 mb-4">
                  <FiInfo className="text-[#00695C]" />
                  <h3 className="text-sm font-bold text-[#1A2E2A] uppercase tracking-wider">Lead Information</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Lead ID</label>
                    <input type="text" name="leadId" value={formData.leadId} readOnly className={`${inputClass} bg-[#F0F5F4]`} />
                  </div>
                  <div>
                    <label className={labelClass}>Created Date</label>
                    <input type="date" name="leadDate" value={formData.leadDate} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Lead Status *</label>
                    <select name="leadStatus" value={formData.leadStatus} onChange={handleChange} required className={selectClass}>
                      {ALL_LEAD_STATUSES.map(s => <option key={s} value={s}>{LEAD_STATUS_TYPES[s].label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Lead Priority *</label>
                    <select name="priority" value={formData.priority} onChange={handleChange} required className={selectClass}>
                      {ALL_LEAD_PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Lead Type *</label>
                    <select name="leadType" value={formData.leadType} onChange={handleChange} required className={selectClass}>
                      <option value="">Select Lead Type</option>
                      {ALL_LEAD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Lead Source *</label>
                    <select name="leadSource" value={formData.leadSource} onChange={handleChange} required className={selectClass}>
                      <option value="">Select Lead Source</option>
                      {ALL_LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Customer Info */}
            {activeTab === 'customer-info' && (
              <div className="bg-white rounded-2xl border border-[#E8F0EE] p-5 animate-fade-in">
                <div className="flex items-center gap-2 mb-4">
                  <FiUser className="text-[#00695C]" />
                  <h3 className="text-sm font-bold text-[#1A2E2A] uppercase tracking-wider">Customer Information & Requirements</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Customer Name *</label>
                    <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} required className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Mobile Number *</label>
                    <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Email Address</label>
                    <input type="email" name="customerEmail" value={formData.customerEmail} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>User Type</label>
                    <select name="userType" value={formData.userType} onChange={handleChange} className={selectClass}>
                      {USER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Preferred Contact Method</label>
                    <select name="preferredContactMethod" value={formData.preferredContactMethod} onChange={handleChange} className={selectClass}>
                      {CONTACT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Customer Requirement</label>
                    <input type="text" name="customerRequirement" value={formData.customerRequirement} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Budget</label>
                    <input type="number" name="budget" value={formData.budget} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Preferred Location</label>
                    <input type="text" name="preferredLocation" value={formData.preferredLocation} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Property Type</label>
                    <select name="propertyType" value={formData.propertyType} onChange={handleChange} className={selectClass}>
                      <option value="">Select Property Type</option>
                      {ALL_PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Purpose</label>
                    <select name="purpose" value={formData.purpose} onChange={handleChange} className={selectClass}>
                      <option value="">Select Purpose</option>
                      {ALL_PURPOSES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Minimum Budget</label>
                    <input type="number" name="minimumBudget" value={formData.minimumBudget} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Maximum Budget</label>
                    <input type="number" name="maximumBudget" value={formData.maximumBudget} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Budget Type</label>
                    <select name="budgetType" value={formData.budgetType} onChange={handleChange} className={selectClass}>
                      {BUDGET_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Property Info */}
            {activeTab === 'property-info' && (
              <div className="bg-white rounded-2xl border border-[#E8F0EE] p-5 animate-fade-in">
                <div className="flex items-center gap-2 mb-4">
                  <FiHomeIcon className="text-[#00695C]" />
                  <h3 className="text-sm font-bold text-[#1A2E2A] uppercase tracking-wider">Property Information & Requirements</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Property ID</label>
                    <input type="text" name="propertyId" value={formData.propertyId} onChange={handleChange} className={inputClass} placeholder="Auto-generated if empty" />
                  </div>
                  <div>
                    <label className={labelClass}>Property Name</label>
                    <input type="text" name="propertyName" value={formData.propertyName} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Property Owner Details</label>
                    <input type="text" name="propertyOwnerDetails" value={formData.propertyOwnerDetails} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Property Location</label>
                    <input type="text" name="location" value={formData.location} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Preferred State</label>
                    <input type="text" name="preferredState" value={formData.preferredState} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Preferred City</label>
                    <input type="text" name="preferredCity" value={formData.preferredCity} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Preferred Area</label>
                    <input type="text" name="preferredArea" value={formData.preferredArea} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Minimum Area (sq.ft)</label>
                    <input type="number" name="minimumArea" value={formData.minimumArea} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Maximum Area (sq.ft)</label>
                    <input type="number" name="maximumArea" value={formData.maximumArea} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Bedrooms</label>
                    <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Bathrooms</label>
                    <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Furnishing</label>
                    <select name="furnishing" value={formData.furnishing} onChange={handleChange} className={selectClass}>
                      <option value="">Select Furnishing</option>
                      {FURNISHING_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Preferred Facing</label>
                    <select name="preferredFacing" value={formData.preferredFacing} onChange={handleChange} className={selectClass}>
                      <option value="">Select Facing</option>
                      {FACING_DIRECTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className={labelClass}>Required Amenities</label>
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={amenityInput}
                        onChange={(e) => setAmenityInput(e.target.value)}
                        placeholder="Add amenity..."
                        className={inputClass}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAmenity())}
                      />
                      <button type="button" onClick={handleAddAmenity} className="px-3 py-2 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium whitespace-nowrap">
                        <FiPlus />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {formData.requiredAmenities.map((amenity, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-1 rounded-full font-semibold bg-[#E8F4F2] text-[#00695C] border border-[#00695C]/20 flex items-center gap-1">
                          {amenity}
                          <button type="button" onClick={() => handleRemoveAmenity(amenity)} className="hover:text-red-600">
                            <FiX className="text-[8px]" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Assignment */}
            {activeTab === 'assignment' && (
              <div className="bg-white rounded-2xl border border-[#E8F0EE] p-5 animate-fade-in">
                <div className="flex items-center gap-2 mb-4">
                  <FiUserCheck className="text-[#00695C]" />
                  <h3 className="text-sm font-bold text-[#1A2E2A] uppercase tracking-wider">Assignment</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Assigned To</label>
                    <input type="text" name="assignedTo" value={formData.assignedTo} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Assigned Date</label>
                    <input type="date" name="assignedDate" value={formData.assignedDate} onChange={handleChange} className={inputClass} />
                  </div>
                </div>
              </div>
            )}

            {/* Communication */}
            {activeTab === 'communication' && (
              <div className="bg-white rounded-2xl border border-[#E8F0EE] p-5 animate-fade-in">
                <div className="flex items-center gap-2 mb-4">
                  <FiPhone className="text-[#00695C]" />
                  <h3 className="text-sm font-bold text-[#1A2E2A] uppercase tracking-wider">Communication</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Last Contacted Date</label>
                    <input type="date" name="lastContactedAt" value={formData.lastContactedAt} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Communication Count</label>
                    <input type="number" name="communicationCount" value={formData.communicationCount} onChange={handleChange} className={inputClass} />
                  </div>
                </div>
              </div>
            )}

            {/* Follow-Up */}
            {activeTab === 'follow-up' && (
              <div className="bg-white rounded-2xl border border-[#E8F0EE] p-5 animate-fade-in">
                <div className="flex items-center gap-2 mb-4">
                  <FiCalendar className="text-[#00695C]" />
                  <h3 className="text-sm font-bold text-[#1A2E2A] uppercase tracking-wider">Follow-Up</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Next Follow-Up Date</label>
                    <input type="date" name="nextFollowUp" value={formData.nextFollowUp} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Follow-Up Count</label>
                    <input type="number" name="followUpCount" value={formData.followUpCount} onChange={handleChange} className={inputClass} />
                  </div>
                </div>
              </div>
            )}

            {/* Site Visit */}
            {activeTab === 'site-visit' && (
              <div className="bg-white rounded-2xl border border-[#E8F0EE] p-5 animate-fade-in">
                <div className="flex items-center gap-2 mb-4">
                  <FiNavigation className="text-[#00695C]" />
                  <h3 className="text-sm font-bold text-[#1A2E2A] uppercase tracking-wider">Site Visit</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Site Visit Date</label>
                    <input type="date" name="siteVisitDate" value={formData.siteVisitDate} onChange={handleChange} className={inputClass} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Site Visit Notes</label>
                    <textarea name="siteVisitNotes" value={formData.siteVisitNotes} onChange={handleChange} rows="3" className={`${inputClass} resize-none`} />
                  </div>
                </div>
              </div>
            )}

            {/* Conversion */}
            {activeTab === 'conversion' && (
              <div className="bg-white rounded-2xl border border-[#E8F0EE] p-5 animate-fade-in">
                <div className="flex items-center gap-2 mb-4">
                  <FiTrendingUp className="text-[#00695C]" />
                  <h3 className="text-sm font-bold text-[#1A2E2A] uppercase tracking-wider">Lead Conversion</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Transaction Type</label>
                    <select name="transactionType" value={formData.transactionType} onChange={handleChange} className={selectClass}>
                      {TRANSACTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Converted By</label>
                    <input type="text" name="convertedBy" value={formData.convertedBy} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Conversion Date</label>
                    <input type="date" name="conversionDate" value={formData.conversionDate} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Final Deal Value</label>
                    <input type="number" name="finalDealValue" value={formData.finalDealValue} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Commission (%)</label>
                    <input type="number" name="commission" value={formData.commission} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Payment Status</label>
                    <select name="paymentStatus" value={formData.paymentStatus} onChange={handleChange} className={selectClass}>
                      {ALL_PAYMENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Agreement Status</label>
                    <select name="agreementStatus" value={formData.agreementStatus} onChange={handleChange} className={selectClass}>
                      {ALL_AGREEMENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Description (always shown) */}
            <div className="bg-white rounded-2xl border border-[#E8F0EE] p-5">
              <div className="flex items-center gap-2 mb-4">
                <FiFileText className="text-[#00695C]" />
                <h3 className="text-sm font-bold text-[#1A2E2A] uppercase tracking-wider">Description</h3>
              </div>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className={`${inputClass} resize-none`} />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 px-6 py-4 bg-white border-t border-[#E8F0EE] rounded-b-3xl shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#00695C]/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <FiRefreshCw className="animate-spin" /> : <FiSave className="inline" />}
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================
const LeadDetails = () => {
  const navigate = useNavigate();
  const { id: routeLeadId } = useParams();
  const searchInputRef = useRef(null);

  // STATE
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('leadDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [viewingLead, setViewingLead] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [filterCount, setFilterCount] = useState(0);
  const [activeStatus, setActiveStatus] = useState('all');
  const [activePriority, setActivePriority] = useState('all');
  const [activeLeadType, setActiveLeadType] = useState('all');
  const [activeLeadSource, setActiveLeadSource] = useState('all');
  const [activePropertyType, setActivePropertyType] = useState('all');
  const [activePurpose, setActivePurpose] = useState('all');

  // DATE RANGE STATE
  const [dateRange, setDateRange] = useState('this_month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // CONFIRMATION
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false, title: '', message: '', confirmText: 'Confirm', cancelText: 'Cancel', type: 'danger', onConfirm: null, onCancel: null
  });

  // GENERATE MOCK DATA WITH ALL NEW FIELDS
  const generateMockLeads = useCallback(() => {
    const firstNames = ['Arun', 'Priya', 'Karthik', 'Divya', 'Suresh', 'Meena', 'Ravi', 'Anitha', 'Vijay', 'Lakshmi', 'Prakash', 'Deepa', 'Manoj', 'Kavya', 'Sanjay', 'Roopa', 'Amit', 'Neha', 'Rahul', 'Pooja'];
    const lastNames = ['Kumar', 'Sharma', 'Reddy', 'Iyer', 'Nair', 'Menon', 'Rao', 'Pillai', 'Gupta', 'Patel', 'Singh', 'Verma', 'Joshi', 'Desai', 'Chopra'];
    const propertyNames = [
      'Green Valley Apartments', 'Sunrise Villas', 'Lake View Residency', 'Palm Grove',
      'Royal Heights', 'Golden Meadows', 'Silver Springs', 'Emerald Enclave',
      'Paradise Homes', 'Harmony Towers', 'Serenity Gardens', 'Crystal Palace',
      'Blue Bells', 'Rose Wood', 'Lavender Fields', 'Orchid Park'
    ];
    const locations = [
      'Mumbai, Maharashtra', 'Pune, Maharashtra', 'Bangalore, Karnataka', 'Delhi NCR',
      'Hyderabad, Telangana', 'Chennai, Tamil Nadu', 'Kolkata, West Bengal', 'Ahmedabad, Gujarat',
      'Jaipur, Rajasthan', 'Lucknow, Uttar Pradesh'
    ];
    const states = ['Maharashtra', 'Karnataka', 'Delhi', 'Telangana', 'Tamil Nadu', 'West Bengal', 'Gujarat', 'Rajasthan', 'Uttar Pradesh'];
    const cities = ['Mumbai', 'Pune', 'Bangalore', 'Delhi', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow'];
    const areas = ['Andheri', 'Koramangala', 'Whitefield', 'Gurgaon', 'Hitech City', 'OMR', 'Salt Lake', 'SG Highway', 'Malviya Nagar', 'Gomti Nagar'];
    const amenitiesList = ['Swimming Pool', 'Gym', 'Parking', 'Security', 'Power Backup', 'Lift', 'Garden', 'Clubhouse', 'Playground', 'Water Supply'];
    const agents = ['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Reddy', 'Vikram Singh', 'Anjali Desai', '', '', ''];

    const list = [];
    const now = new Date();

    for (let i = 1; i <= 150; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const customerName = `${firstName} ${lastName}`;
      const leadStatus = ALL_LEAD_STATUSES[Math.floor(Math.random() * ALL_LEAD_STATUSES.length)];
      const priority = ALL_LEAD_PRIORITIES[Math.floor(Math.random() * ALL_LEAD_PRIORITIES.length)];
      const leadType = ALL_LEAD_TYPES[Math.floor(Math.random() * ALL_LEAD_TYPES.length)];
      const leadSource = ALL_LEAD_SOURCES[Math.floor(Math.random() * ALL_LEAD_SOURCES.length)];
      const propertyType = ALL_PROPERTY_TYPES[Math.floor(Math.random() * ALL_PROPERTY_TYPES.length)];
      const purpose = ALL_PURPOSES[Math.floor(Math.random() * ALL_PURPOSES.length)];
      const assignedTo = agents[Math.floor(Math.random() * agents.length)];
      const propertyName = propertyNames[Math.floor(Math.random() * propertyNames.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];

      // Spread dates
      let leadDate;
      const rand = Math.random();
      if (rand < 0.15) {
        leadDate = new Date(now);
        leadDate.setHours(Math.floor(Math.random() * 12) + 8);
      } else if (rand < 0.30) {
        leadDate = new Date(now);
        leadDate.setDate(leadDate.getDate() - Math.floor(Math.random() * 7));
      } else if (rand < 0.55) {
        leadDate = new Date(now);
        leadDate.setDate(leadDate.getDate() - Math.floor(Math.random() * 30));
      } else if (rand < 0.80) {
        leadDate = new Date(now);
        leadDate.setDate(leadDate.getDate() - Math.floor(Math.random() * 90));
      } else {
        leadDate = new Date(now);
        leadDate.setDate(leadDate.getDate() - Math.floor(Math.random() * 365));
      }

      let nextFollowUp = null;
      if (leadStatus !== 'Lost' && leadStatus !== 'Invalid Lead' && leadStatus !== 'Duplicate Lead') {
        nextFollowUp = new Date(now);
        nextFollowUp.setDate(nextFollowUp.getDate() + Math.floor(Math.random() * 14) + 1);
      }

      const mobileNum = `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`;
      const budget = Math.floor(Math.random() * 5000000) + 500000;
      const minBudget = Math.floor(budget * 0.8);
      const maxBudget = Math.floor(budget * 1.2);
      const isConverted = ['Negotiation', 'Site Visit Completed'].includes(leadStatus);

      list.push({
        id: `lead_${i}`,
        // Lead Info
        leadId: `LEAD-${String(i).padStart(5, '0')}`,
        leadDate: leadDate.toISOString(),
        leadStatus,
        priority,
        leadType,
        leadSource,
        // Customer Info
        customerName,
        customerId: `CUST-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}`,
        customerEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        mobileNumber: mobileNum,
        userType: USER_TYPES[Math.floor(Math.random() * USER_TYPES.length)],
        preferredContactMethod: CONTACT_METHODS[Math.floor(Math.random() * CONTACT_METHODS.length)],
        customerRequirement: `Looking for ${propertyType} in ${location}`,
        budget,
        preferredLocation: location,
        propertyType,
        purpose,
        minimumBudget: minBudget,
        maximumBudget: maxBudget,
        budgetType: BUDGET_TYPES[Math.floor(Math.random() * BUDGET_TYPES.length)],
        // Property Info
        propertyId: `PROP-${String(Math.floor(Math.random() * 90000) + 10000).padStart(5, '0')}`,
        propertyName,
        propertyOwnerDetails: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
        location,
        preferredState: states[Math.floor(Math.random() * states.length)],
        preferredCity: cities[Math.floor(Math.random() * cities.length)],
        preferredArea: areas[Math.floor(Math.random() * areas.length)],
        minimumArea: Math.floor(Math.random() * 800) + 400,
        maximumArea: Math.floor(Math.random() * 1500) + 1000,
        bedrooms: Math.floor(Math.random() * 4) + 1,
        bathrooms: Math.floor(Math.random() * 3) + 1,
        furnishing: FURNISHING_TYPES[Math.floor(Math.random() * FURNISHING_TYPES.length)],
        preferredFacing: FACING_DIRECTIONS[Math.floor(Math.random() * FACING_DIRECTIONS.length)],
        requiredAmenities: amenitiesList.filter(() => Math.random() > 0.6).slice(0, 4),
        // Assignment
        assignedTo,
        assignedDate: assignedTo ? leadDate.toISOString() : null,
        // Communication
        lastContactedAt: new Date(leadDate.getTime() + Math.random() * 86400000 * 3).toISOString(),
        communicationCount: Math.floor(Math.random() * 10) + 1,
        // Follow-Up
        nextFollowUp: nextFollowUp ? nextFollowUp.toISOString() : null,
        followUpCount: Math.floor(Math.random() * 5),
        // Site Visit
        siteVisitDate: leadStatus === 'Site Visit Scheduled' || leadStatus === 'Site Visit Completed'
          ? new Date(leadDate.getTime() + Math.random() * 86400000 * 7).toISOString()
          : null,
        siteVisitNotes: leadStatus === 'Site Visit Completed' ? 'Customer liked the property. Interested in negotiation.' : '',
        // Conversion
        transactionType: TRANSACTION_TYPES[Math.floor(Math.random() * TRANSACTION_TYPES.length)],
        convertedBy: isConverted ? agents[Math.floor(Math.random() * 6)] : '',
        conversionDate: isConverted ? new Date(leadDate.getTime() + Math.random() * 86400000 * 30).toISOString() : null,
        finalDealValue: isConverted ? Math.floor(Math.random() * 10000000) + 1000000 : null,
        commission: isConverted ? Math.floor(Math.random() * 5) + 1 : null,
        paymentStatus: isConverted ? ALL_PAYMENT_STATUSES[Math.floor(Math.random() * ALL_PAYMENT_STATUSES.length)] : 'Pending',
        agreementStatus: isConverted ? ALL_AGREEMENT_STATUSES[Math.floor(Math.random() * ALL_AGREEMENT_STATUSES.length)] : 'Not Started',
        // Description
        description: `${leadType} for ${propertyName} in ${location}.`,
        notes: Math.random() > 0.7 ? [
          {
            text: 'Follow-up call scheduled with customer.',
            addedBy: 'Admin',
            addedAt: new Date(now.getTime() - Math.random() * 86400000 * 7).toISOString()
          }
        ] : []
      });
    }

    return list;
  }, []);

  // INIT
  useEffect(() => {
    try {
      const mockLeads = generateMockLeads();
      setLeads(mockLeads);
      setFilteredLeads(mockLeads);

      // If route has a lead ID, open that lead's view
      if (routeLeadId) {
        const lead = mockLeads.find(l => l.id === routeLeadId || l.leadId === routeLeadId);
        if (lead) {
          setViewingLead(lead);
          setShowViewModal(true);
        }
      }
    } catch (error) {
      console.error('Error generating mock leads:', error);
    }
  }, [generateMockLeads, routeLeadId]);

  // FILTER
  const filterLeads = useCallback(() => {
    try {
      let filtered = [...leads];

      if (dateRange !== 'all') {
        const { start, end } = getDateRangeBounds(dateRange, customStartDate, customEndDate);
        if (start && end) {
          filtered = filtered.filter(l => {
            const d = new Date(l.leadDate);
            return d >= start && d <= end;
          });
        }
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(l =>
          (l.leadId && l.leadId.toLowerCase().includes(query)) ||
          (l.customerName && l.customerName.toLowerCase().includes(query)) ||
          (l.mobileNumber && l.mobileNumber.toLowerCase().includes(query)) ||
          (l.propertyName && l.propertyName.toLowerCase().includes(query)) ||
          (l.location && l.location.toLowerCase().includes(query)) ||
          (l.assignedTo && l.assignedTo.toLowerCase().includes(query)) ||
          (l.leadType && l.leadType.toLowerCase().includes(query)) ||
          (l.leadSource && l.leadSource.toLowerCase().includes(query)) ||
          (l.leadStatus && l.leadStatus.toLowerCase().includes(query)) ||
          (l.propertyType && l.propertyType.toLowerCase().includes(query)) ||
          (l.purpose && l.purpose.toLowerCase().includes(query)) ||
          (l.userType && l.userType.toLowerCase().includes(query))
        );
      }

      if (activeStatus !== 'all') filtered = filtered.filter(l => l.leadStatus === activeStatus);
      if (activePriority !== 'all') filtered = filtered.filter(l => l.priority === activePriority);
      if (activeLeadType !== 'all') filtered = filtered.filter(l => l.leadType === activeLeadType);
      if (activeLeadSource !== 'all') filtered = filtered.filter(l => l.leadSource === activeLeadSource);
      if (activePropertyType !== 'all') filtered = filtered.filter(l => l.propertyType === activePropertyType);
      if (activePurpose !== 'all') filtered = filtered.filter(l => l.purpose === activePurpose);

      let count = 0;
      if (dateRange !== 'all') count++;
      if (activeStatus !== 'all') count++;
      if (activePriority !== 'all') count++;
      if (activeLeadType !== 'all') count++;
      if (activeLeadSource !== 'all') count++;
      if (activePropertyType !== 'all') count++;
      if (activePurpose !== 'all') count++;
      if (searchQuery) count++;
      setFilterCount(count);

      filtered.sort((a, b) => {
        let aVal = a[sortField] || '';
        let bVal = b[sortField] || '';
        if (sortField === 'leadDate' || sortField === 'nextFollowUp') {
          aVal = aVal ? new Date(aVal).getTime() : 0;
          bVal = bVal ? new Date(bVal).getTime() : 0;
        } else if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase(); bVal = bVal.toLowerCase();
        }
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });

      setFilteredLeads(filtered);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error filtering leads:', error);
    }
  }, [leads, searchQuery, activeStatus, activePriority, activeLeadType, activeLeadSource, activePropertyType, activePurpose, sortField, sortDirection, dateRange, customStartDate, customEndDate]);

  useEffect(() => { filterLeads(); }, [filterLeads]);

  // PAGINATION
  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / pageSize));
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLeads.slice(start, start + pageSize);
  }, [filteredLeads, currentPage, pageSize]);

  const handleSort = useCallback((field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);

  const handleSelectAll = useCallback(() => {
    if (selectedLeads.length === paginatedLeads.length && paginatedLeads.length > 0) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(paginatedLeads.map(l => l.id));
    }
  }, [selectedLeads, paginatedLeads]);

  const handleSelectLead = useCallback((leadId) => {
    setSelectedLeads(prev => prev.includes(leadId) ? prev.filter(id => id !== leadId) : [...prev, leadId]);
  }, []);

  const handleViewLead = useCallback((lead) => {
    setViewingLead(lead);
    setShowViewModal(true);
  }, []);

  const handleEditLead = useCallback((lead) => {
    setEditingLead(lead);
    setShowEditModal(true);
  }, []);

  const handleSaveLead = useCallback((updatedLead) => {
    setLeads(prev => {
      const updated = prev.map(l => l.id === updatedLead.id ? updatedLead : l);
      return updated;
    });
    setToast({ message: `Lead "${updatedLead.leadId}" updated successfully`, type: 'success' });
  }, []);

  const handleDeleteLead = useCallback((leadId) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    setConfirmationModal({
      isOpen: true,
      title: 'Delete Lead',
      message: `Are you sure you want to delete lead "${lead.leadId}" for ${lead.customerName}?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: () => {
        setActionLoading(leadId);
        setTimeout(() => {
          setLeads(prev => {
            const updated = prev.filter(l => l.id !== leadId);
            return updated;
          });
          setActionLoading(null);
          setShowViewModal(false);
          setToast({ message: `Deleted lead "${lead.leadId}"`, type: 'warning' });
        }, 700);
      },
      onCancel: () => setConfirmationModal(prev => ({ ...prev, isOpen: false }))
    });
  }, [leads]);

  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setActiveStatus('all');
    setActivePriority('all');
    setActiveLeadType('all');
    setActiveLeadSource('all');
    setActivePropertyType('all');
    setActivePurpose('all');
    setDateRange('all');
    setCustomStartDate('');
    setCustomEndDate('');
    if (searchInputRef.current) searchInputRef.current.focus();
    setToast({ message: 'All filters cleared', type: 'info' });
  }, []);

  const handleRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      try {
        const mockLeads = generateMockLeads();
        setLeads(mockLeads);
        setFilteredLeads(mockLeads);
        setToast({ message: 'Data refreshed successfully', type: 'success' });
      } catch (error) {
        console.error('Error refreshing data:', error);
        setToast({ message: 'Error refreshing data', type: 'error' });
      }
      setLoading(false);
    }, 1000);
  }, [generateMockLeads]);

  const handleExport = useCallback(() => {
    if (filteredLeads.length === 0) {
      setToast({ message: 'No data to export', type: 'warning' });
      return;
    }
    try {
      const data = filteredLeads.map(l => ({
        'Lead ID': l.leadId || '',
        'Created Date': l.leadDate ? new Date(l.leadDate).toLocaleDateString('en-IN') : '',
        'Lead Status': l.leadStatus || '',
        'Priority': l.priority || '',
        'Lead Type': l.leadType || '',
        'Lead Source': l.leadSource || '',
        'Customer Name': l.customerName || '',
        'Mobile Number': l.mobileNumber || '',
        'Email Address': l.customerEmail || '',
        'User Type': l.userType || '',
        'Property Name': l.propertyName || '',
        'Property Type': l.propertyType || '',
        'Location': l.location || '',
        'Purpose': l.purpose || '',
        'Budget': l.budget || '',
        'Assigned To': l.assignedTo || 'Unassigned',
        'Next Follow-Up': l.nextFollowUp ? new Date(l.nextFollowUp).toLocaleString('en-IN') : '',
        'Site Visit Date': l.siteVisitDate ? new Date(l.siteVisitDate).toLocaleString('en-IN') : '',
        'Transaction Type': l.transactionType || '',
        'Final Deal Value': l.finalDealValue || '',
        'Payment Status': l.paymentStatus || '',
        'Agreement Status': l.agreementStatus || ''
      }));

      const csv = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).map(v => `"${v}"`).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lead_details_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      setToast({ message: `${filteredLeads.length} leads exported successfully`, type: 'success' });
    } catch (error) {
      console.error('Error exporting data:', error);
      setToast({ message: 'Error exporting data', type: 'error' });
    }
  }, [filteredLeads]);

  const handleBulkDelete = useCallback(() => {
    if (selectedLeads.length === 0) {
      setToast({ message: 'Please select leads first', type: 'warning' });
      return;
    }
    setConfirmationModal({
      isOpen: true,
      title: 'Delete Selected Leads',
      message: `Are you sure you want to delete ${selectedLeads.length} selected lead(s)?`,
      confirmText: 'Delete All',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: () => {
        setActionLoading('bulk-delete');
        setTimeout(() => {
          const selectedIds = new Set(selectedLeads);
          const count = leads.filter(l => selectedIds.has(l.id)).length;
          const updated = leads.filter(l => !selectedIds.has(l.id));
          setLeads(updated);
          setSelectedLeads([]);
          setActionLoading(null);
          setToast({ message: `${count} lead(s) deleted`, type: 'warning' });
        }, 800);
      },
      onCancel: () => setConfirmationModal(prev => ({ ...prev, isOpen: false }))
    });
  }, [selectedLeads, leads]);

  const statusOptions = ALL_LEAD_STATUSES.map(status => ({ value: status, label: LEAD_STATUS_TYPES[status].label }));
  const priorityOptions = ALL_LEAD_PRIORITIES.map(priority => ({ value: priority, label: priority }));
  const leadTypeOptions = ALL_LEAD_TYPES.map(type => ({ value: type, label: type }));
  const leadSourceOptions = ALL_LEAD_SOURCES.map(source => ({ value: source, label: source }));
  const propertyTypeOptions = ALL_PROPERTY_TYPES.map(type => ({ value: type, label: type }));
  const purposeOptions = ALL_PURPOSES.map(purpose => ({ value: purpose, label: purpose }));

  const LIST_COLUMNS = [
    { key: 'leadId', label: 'Lead ID', sortable: true },
    { key: 'leadDate', label: 'Created', sortable: true },
    { key: 'customerName', label: 'Customer', sortable: true },
    { key: 'mobileNumber', label: 'Mobile', sortable: false },
    { key: 'propertyName', label: 'Property', sortable: true },
    { key: 'leadStatus', label: 'Status', sortable: true },
    { key: 'priority', label: 'Priority', sortable: true },
    { key: 'assignedTo', label: 'Assigned', sortable: true },
    { key: 'nextFollowUp', label: 'Follow-Up', sortable: true },
  ];

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="space-y-6 p-4 lg:p-6 bg-[#F8FAF9] min-h-screen">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-[#00695C]/5 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-[#26A69A]/5 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <Toast toast={toast} setToast={setToast} />

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => {
          if (confirmationModal.onCancel) confirmationModal.onCancel();
          setConfirmationModal(prev => ({ ...prev, isOpen: false }));
        }}
        onConfirm={() => { if (confirmationModal.onConfirm) confirmationModal.onConfirm(); }}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText={confirmationModal.confirmText}
        cancelText={confirmationModal.cancelText}
        type={confirmationModal.type}
      />

      {showViewModal && viewingLead && (
        <ViewLeadDetailModal
          lead={viewingLead}
          show={showViewModal}
          onClose={() => { setShowViewModal(false); setViewingLead(null); }}
          onEdit={handleEditLead}
          onDelete={handleDeleteLead}
        />
      )}

      {showEditModal && editingLead && (
        <EditLeadModal
          lead={editingLead}
          show={showEditModal}
          onClose={() => { setShowEditModal(false); setEditingLead(null); }}
          onSave={handleSaveLead}
        />
      )}

      {/* Header */}
      <div className="relative z-[30] animate-fade-in">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                Lead Details
              </h1>
              <span className="px-3 py-1 bg-[#E8F4F2] text-[#00695C] text-xs font-semibold rounded-full animate-pulse">
                {filteredLeads.length} Leads
              </span>
              {filterCount > 0 && (
                <span className="px-3 py-1 bg-[#FEF3E2] text-amber-700 text-xs font-semibold rounded-full">
                  {filterCount} filters
                </span>
              )}
            </div>
            <p className="text-sm text-[#5A7D78] flex items-center gap-2 flex-wrap">
              <span>Comprehensive lead information with customer, property, and conversion details</span>
              <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
              <span className="text-[#00695C] font-medium flex items-center gap-1">
                <FiCalendar className="text-xs" />
                {getDateRangeLabel(dateRange, customStartDate, customEndDate)}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2 w-full lg:w-auto flex-wrap">
            <DateRangeDropdown
              value={dateRange}
              onChange={setDateRange}
              customStart={customStartDate}
              customEnd={customEndDate}
              onCustomChange={(start, end) => {
                setCustomStartDate(start);
                setCustomEndDate(end);
              }}
              label={getDateRangeLabel(dateRange, customStartDate, customEndDate)}
            />

            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8F0EE] rounded-xl hover:border-[#00695C]/30 hover:shadow-md transition-all duration-300 text-sm font-medium text-[#1A2E2A] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
            >
              <FiRefreshCw className={`text-sm ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{loading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8F0EE] rounded-xl hover:border-[#00695C]/30 hover:shadow-md transition-all duration-300 text-sm font-medium text-[#1A2E2A] hover:scale-105"
            >
              <FiDownload className="text-sm" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="relative bg-white rounded-2xl p-4 shadow-sm border border-[#E8F0EE] hover:shadow-md transition-all duration-300">
        <div className="flex flex-col gap-4">
          <div className="flex-1 w-full relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by lead ID, customer name, mobile, property, location, agent..."
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

          <div className="flex items-center gap-2 w-full lg:w-auto flex-wrap">
            <FilterDropdown label="Status" options={statusOptions} value={activeStatus} onChange={setActiveStatus} icon={FiActivity} allLabel="All Statuses" />
            <FilterDropdown label="Priority" options={priorityOptions} value={activePriority} onChange={setActivePriority} icon={FiFlag} allLabel="All Priorities" />
            <FilterDropdown label="Type" options={leadTypeOptions} value={activeLeadType} onChange={setActiveLeadType} icon={FiTag} allLabel="All Lead Types" />
            <FilterDropdown label="Source" options={leadSourceOptions} value={activeLeadSource} onChange={setActiveLeadSource} icon={FiGlobe} allLabel="All Sources" />
            <FilterDropdown label="Property" options={propertyTypeOptions} value={activePropertyType} onChange={setActivePropertyType} icon={FiHomeIcon} allLabel="All Property Types" />
            <FilterDropdown label="Purpose" options={purposeOptions} value={activePurpose} onChange={setActivePurpose} icon={FiTarget} allLabel="All Purposes" />

            {filterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="px-4 py-2.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-300 text-sm font-medium flex items-center gap-1 hover:scale-105"
              >
                <FiX className="text-sm" /> Clear
              </button>
            )}

            <div className="flex items-center bg-[#F5F9F8] rounded-xl p-1 border border-[#E8F0EE]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#00695C]' : 'text-[#5A7D78] hover:text-[#1A2E2A]'}`}
                title="Grid View"
              >
                <FiGridIcon className="text-sm" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${viewMode === 'list' ? 'bg-white shadow-sm text-[#00695C]' : 'text-[#5A7D78] hover:text-[#1A2E2A]'}`}
                title="List View"
              >
                <FiList className="text-sm" />
              </button>
            </div>
          </div>
        </div>

        {selectedLeads.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#E8F0EE] flex flex-wrap items-center justify-between gap-3 animate-slide-in">
            <span className="text-sm text-[#5A7D78]">
              <span className="font-semibold text-[#00695C]">{selectedLeads.length}</span> lead(s) selected
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleBulkDelete}
                disabled={actionLoading === 'bulk-delete'}
                className="px-4 py-1.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50"
              >
                {actionLoading === 'bulk-delete' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiTrash2 className="text-[10px]" />}
                Delete All
              </button>
              <button
                onClick={() => setSelectedLeads([])}
                className="px-4 py-1.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-xs font-medium hover:scale-105"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Grid/List */}
      <div className="relative">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00695C]/20 border-t-[#00695C] rounded-full animate-spin" />
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {paginatedLeads.map((lead, index) => {
              const isSelected = selectedLeads.includes(lead.id);
              const statusConfig = LEAD_STATUS_TYPES[lead.leadStatus] || LEAD_STATUS_TYPES['New'];
              const StatusIcon = statusConfig.icon;
              const priorityConfig = LEAD_PRIORITY_TYPES[lead.priority] || LEAD_PRIORITY_TYPES['Medium'];
              const PriorityIcon = priorityConfig.icon;
              const leadTypeConfig = LEAD_TYPE_CONFIG[lead.leadType] || LEAD_TYPE_CONFIG['Buy Enquiry'];
              const LeadTypeIcon = leadTypeConfig.icon;
              const leadSourceConfig = LEAD_SOURCE_CONFIG[lead.leadSource] || LEAD_SOURCE_CONFIG['Website'];
              const LeadSourceIcon = leadSourceConfig.icon;
              const propTypeConfig = PROPERTY_TYPE_CONFIG[lead.propertyType] || PROPERTY_TYPE_CONFIG['Individual'];

              return (
                <div
                  key={lead.id}
                  className={`bg-white rounded-2xl border border-[#E8F0EE] p-3.5 hover:shadow-xl hover:-translate-y-1 group animate-slide-in transition-all duration-500 ${isSelected ? 'ring-2 ring-[#00695C] shadow-lg' : ''}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-2 gap-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectLead(lead.id)}
                        className="w-4 h-4 shrink-0 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                      />
                      <div className={`w-9 h-9 rounded-2xl bg-gradient-to-br ${statusConfig.color} flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
                        <StatusIcon className="text-sm" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm text-[#1A2E2A] truncate">{lead.customerName}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <p className="text-[10px] font-medium text-[#5A7D78]">{lead.leadId}</p>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold leading-none ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                            {statusConfig.label}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold leading-none flex items-center gap-0.5 ${priorityConfig.bg} ${priorityConfig.text} border ${priorityConfig.border}`}>
                            <PriorityIcon className="text-[8px]" />
                            {priorityConfig.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-[#5A7D78]">
                      <FiPhone className="text-[#00695C] flex-shrink-0" />
                      <span className="font-medium break-words">{lead.mobileNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#5A7D78] flex-wrap">
                      <FiHomeIcon className="text-[#00695C] flex-shrink-0" />
                      <span className="font-medium break-words">{lead.propertyName}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold leading-none ${propTypeConfig.bg} ${propTypeConfig.text} border ${propTypeConfig.border}`}>
                        {lead.propertyType}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#5A7D78] flex-wrap">
                      <FiMapPin className="text-[#00695C] flex-shrink-0" />
                      <span className="font-medium break-words">{lead.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#5A7D78] flex-wrap">
                      <FiUserCheck className="text-[#00695C] flex-shrink-0" />
                      <span className="font-medium">{lead.assignedTo || 'Unassigned'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#5A7D78] flex-wrap">
                      <LeadTypeIcon className="text-[#00695C] flex-shrink-0" />
                      <span className="font-medium">{lead.leadType}</span>
                      <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
                      <LeadSourceIcon className="text-[#00695C] flex-shrink-0" />
                      <span className="font-medium">{lead.leadSource}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#5A7D78]">
                      <FaRupeeSign className="text-[#00695C] flex-shrink-0 text-[10px]" />
                      <span className="font-medium">Budget: {formatCurrency(lead.budget)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#5A7D78]">
                      <FiCalendar className="text-[#00695C] flex-shrink-0" />
                      <span className="font-medium">
                        {lead.nextFollowUp
                          ? new Date(lead.nextFollowUp).toLocaleString('en-IN', {
                              day: 'numeric', month: 'short', year: 'numeric',
                              hour: '2-digit', minute: '2-digit'
                            })
                          : 'No follow-up scheduled'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2.5 pt-2.5 border-t border-[#E8F0EE]">
                    <button
                      type="button"
                      onClick={() => handleViewLead(lead)}
                      className="flex-1 py-1.5 text-xs font-semibold text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiEye className="text-[10px]" /> View
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditLead(lead)}
                      className="flex-1 py-1.5 text-xs font-semibold text-[#26A69A] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiEdit className="text-[10px]" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteLead(lead.id)}
                      disabled={actionLoading === lead.id}
                      className="flex-1 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50"
                    >
                      {actionLoading === lead.id ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiTrash2 className="text-[10px]" />}
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E8F0EE] shadow-sm overflow-hidden">
            <table className="w-full table-fixed border-collapse">
              <colgroup>
                <col style={{ width: '3%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '9%' }} />
                <col style={{ width: '12%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '12%' }} />
                <col style={{ width: '8%' }} />
                <col style={{ width: '8%' }} />
                <col style={{ width: '9%' }} />
                <col style={{ width: '9%' }} />
                <col style={{ width: '10%' }} />
              </colgroup>
              <thead>
                <tr className="bg-[#F5F9F8] border-b border-[#E8F0EE]">
                  <th className="px-2 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedLeads.length === paginatedLeads.length && paginatedLeads.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                    />
                  </th>
                  {LIST_COLUMNS.map(col => (
                    <th
                      key={col.key}
                      onClick={() => col.sortable && handleSort(col.key)}
                      className="px-2 py-3 text-left text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider cursor-pointer hover:text-[#00695C] transition-colors select-none truncate"
                      title={col.label}
                    >
                      {col.label} {sortField === col.key && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                    </th>
                  ))}
                  <th className="px-2 py-3 text-right text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedLeads.map((lead) => {
                  const isSelected = selectedLeads.includes(lead.id);
                  const statusConfig = LEAD_STATUS_TYPES[lead.leadStatus] || LEAD_STATUS_TYPES['New'];
                  const StatusIcon = statusConfig.icon;
                  const priorityConfig = LEAD_PRIORITY_TYPES[lead.priority] || LEAD_PRIORITY_TYPES['Medium'];
                  const PriorityIcon = priorityConfig.icon;

                  return (
                    <tr
                      key={lead.id}
                      className={`border-b border-[#E8F0EE] hover:bg-[#F5F9F8] transition-colors duration-200 ${isSelected ? 'bg-[#E8F4F2]' : ''}`}
                    >
                      <td className="px-2 py-2.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectLead(lead.id)}
                          className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                        />
                      </td>
                      <td className="px-2 py-2.5 overflow-hidden" title={lead.leadId}>
                        <span className="flex items-center gap-1.5 text-xs font-bold text-[#00695C]">
                          <span className={`w-4 h-4 rounded-full bg-gradient-to-br ${statusConfig.color} flex items-center justify-center text-white flex-shrink-0`}>
                            <StatusIcon className="text-[8px]" />
                          </span>
                          <span className="truncate">{lead.leadId}</span>
                        </span>
                      </td>
                      <td className="px-2 py-2.5 text-xs font-medium text-[#5A7D78] truncate">
                        {formatDate(lead.leadDate)}
                      </td>
                      <td className="px-2 py-2.5 text-sm font-bold text-[#1A2E2A] truncate" title={lead.customerName}>{lead.customerName}</td>
                      <td className="px-2 py-2.5 text-xs font-medium text-[#5A7D78] truncate">{lead.mobileNumber}</td>
                      <td className="px-2 py-2.5 text-xs font-medium text-[#5A7D78] truncate" title={lead.propertyName}>{lead.propertyName}</td>
                      <td className="px-2 py-2.5 overflow-hidden">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold whitespace-nowrap ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-2 py-2.5 overflow-hidden">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold whitespace-nowrap flex items-center gap-0.5 ${priorityConfig.bg} ${priorityConfig.text} border ${priorityConfig.border}`}>
                          <PriorityIcon className="text-[8px]" />
                          {priorityConfig.label}
                        </span>
                      </td>
                      <td className="px-2 py-2.5 text-xs font-medium text-[#5A7D78] truncate">{lead.assignedTo || 'Unassigned'}</td>
                      <td className="px-2 py-2.5 text-xs font-medium text-[#5A7D78] truncate">
                        {lead.nextFollowUp
                          ? new Date(lead.nextFollowUp).toLocaleString('en-IN', {
                              day: 'numeric', month: 'short', year: '2-digit',
                              hour: '2-digit', minute: '2-digit'
                            })
                          : '-'}
                      </td>
                      <td className="px-2 py-2.5">
                        <div className="flex items-center justify-end gap-1.5">
                          <button type="button" onClick={() => handleViewLead(lead)} className="w-7 h-7 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 flex items-center justify-center text-[#00695C] hover:scale-110" title="View">
                            <FiEye className="text-sm" />
                          </button>
                          <button type="button" onClick={() => handleEditLead(lead)} className="w-7 h-7 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 flex items-center justify-center text-[#26A69A] hover:scale-110" title="Edit">
                            <FiEdit className="text-sm" />
                          </button>
                          <button type="button" onClick={() => handleDeleteLead(lead.id)} disabled={actionLoading === lead.id} className="w-7 h-7 rounded-lg hover:bg-red-50 transition-all duration-300 flex items-center justify-center text-red-600 hover:scale-110 disabled:opacity-50" title="Delete">
                            {actionLoading === lead.id ? <FiRefreshCw className="text-xs animate-spin" /> : <FiTrash2 className="text-sm" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {paginatedLeads.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E8F0EE]">
            <div className="w-24 h-24 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4 animate-float">
              <FiUsers className="text-4xl text-[#B5C9C5]" />
            </div>
            <h3 className="text-xl font-bold text-[#1A2E2A]">No leads found</h3>
            <p className="text-sm text-[#5A7D78] mt-1">
              {filterCount > 0 ? 'Try adjusting your search or filter criteria' : 'No lead records have been added yet'}
            </p>
            {filterCount > 0 && (
              <button onClick={clearAllFilters} className="mt-4 px-6 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-bold shadow-lg shadow-[#00695C]/30 hover:scale-105">
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between bg-white rounded-2xl px-4 py-3 border border-[#E8F0EE] shadow-sm gap-3">
          <div className="flex items-center gap-2 text-sm text-[#5A7D78] flex-wrap">
            <span className="font-medium">
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, filteredLeads.length)} of{' '}
              {filteredLeads.length} leads
            </span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="ml-2 px-2 py-1 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] text-sm text-[#1A2E2A] outline-none focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 font-medium"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 flex items-center justify-center text-[#1A2E2A] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110"
            >
              <FiChevronLeft className="text-sm" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) pageNum = i + 1;
              else if (currentPage <= 3) pageNum = i + 1;
              else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = currentPage - 2 + i;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-9 h-9 rounded-xl transition-all duration-300 text-sm font-bold hover:scale-110 ${
                    currentPage === pageNum
                      ? 'bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white shadow-lg shadow-[#00695C]/30'
                      : 'text-[#1A2E2A] hover:bg-[#F5F9F8]'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="w-9 h-9 rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 flex items-center justify-center text-[#1A2E2A] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110"
            >
              <FiChevronRight className="text-sm" />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(50px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(10px); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-slide-in { animation: slide-in 0.4s ease-out forwards; opacity: 0; }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
        .animate-slide-down { animation: slide-down 0.3s ease-out forwards; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default LeadDetails;