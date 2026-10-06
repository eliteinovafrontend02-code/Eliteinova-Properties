// src/components/admin/LeadManagement/LeadDashboardAndList.jsx

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiSearch, FiChevronDown, FiChevronLeft, FiChevronRight, FiEye, FiEdit,
  FiTrash2, FiRefreshCw, FiDownload, FiAlertTriangle, FiInfo, FiX, FiList,
  FiGrid as FiGridIcon, FiTag, FiSave, FiFileText, FiHash,
  FiChevronUp, FiCheckCircle, FiXCircle, FiBriefcase,
  FiActivity, FiUser, FiMail, FiPhone, FiClock,
  FiRotateCcw, FiDollarSign, FiTrendingUp, FiCalendar, FiHome,
  FiClipboard, FiShoppingBag, FiKey, FiMap, FiLayers, FiPackage,
  FiPercent, FiServer, FiGlobe, FiShield, FiAward, FiTarget,
  FiUsers, FiHome as FiHomeIcon, FiCheck, FiMoreVertical, FiPlus,
  FiThumbsUp, FiSend, FiLock, FiUnlock, FiExternalLink, FiArrowLeft,
  FiUserPlus, FiUserCheck, FiUserX, FiStar, FiFlag, FiMessageSquare,
  FiNavigation, FiCheckSquare, FiCopy, FiSlash, FiEdit2
} from 'react-icons/fi';
import { FaHome, FaHotel, FaHardHat, FaCheckDouble } from 'react-icons/fa';

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
  const seed = `${lead.propertyName || ''}::${lead.location || ''}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return `PROP-${String(hash % 100000).padStart(5, '0')}`;
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
        className="flex items-center  gap-2 px-4 py-2 bg-white border border-[#E8F0EE] rounded-xl hover:border-[#00695C]/30 hover:shadow-md transition-all duration-300 text-sm font-medium text-[#1A2E2A] hover:scale-105"
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
// ASSIGN LEAD MODAL
// ============================================================
const AssignLeadModal = ({ lead, show, onClose, onAssign }) => {
  const [selectedAgent, setSelectedAgent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setSelectedAgent('');
      setSearchQuery('');
    }
  }, [show]);

  if (!lead || !show) return null;

  const filteredAgents = AVAILABLE_AGENTS.filter(a =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAssign = () => {
    if (!selectedAgent) return;
    setLoading(true);
    setTimeout(() => {
      const agent = AVAILABLE_AGENTS.find(a => a.id === selectedAgent);
      onAssign(lead.id, agent);
      setLoading(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white">
              <FiUserPlus className="text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Assign Lead</h2>
              <p className="text-white/80 text-sm">{lead.leadId} • {lead.customerName}</p>
            </div>
          </div>
        </div>

        {lead.assignedTo && (
          <div className="px-6 pt-4 shrink-0">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center gap-2">
              <FiInfo className="text-blue-600 flex-shrink-0" />
              <p className="text-xs text-blue-700">
                Currently assigned to <span className="font-bold">{lead.assignedTo}</span>. Pick a new agent below.
              </p>
            </div>
          </div>
        )}

        <div className="px-6 pt-4 shrink-0">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5A7D78] text-sm" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search agents by name, email, or role..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {filteredAgents.length === 0 ? (
            <div className="text-center py-12">
              <FiUsers className="text-4xl text-[#B5C9C5] mx-auto mb-3" />
              <p className="text-sm text-[#5A7D78]">No agents match your search.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredAgents.map((agent) => {
                const isSelected = selectedAgent === agent.id;
                return (
                  <button
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition-all duration-300 hover:scale-[1.01] text-left ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20'
                        : 'border-[#E8F0EE] bg-white hover:border-blue-300 hover:bg-blue-50/40'
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-[#E8F4F2] text-[#00695C]'
                    }`}>
                      {agent.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold truncate ${isSelected ? 'text-blue-700' : 'text-[#1A2E2A]'}`}>
                        {agent.name}
                      </p>
                      <p className="text-[11px] text-[#5A7D78] truncate">{agent.email}</p>
                      <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-semibold bg-[#F5F9F8] text-[#5A7D78] border border-[#E8F0EE]">
                        {agent.role}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white flex-shrink-0">
                        <FiCheck className="text-xs" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-[#F8FAF9] border-t border-[#E8F0EE] flex items-center gap-3 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-white text-[#1A2E2A] rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 text-sm font-medium border border-[#E8F0EE]"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedAgent || loading}
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 text-sm font-medium shadow-lg shadow-blue-600/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <FiRefreshCw className="animate-spin" /> : <FiUserPlus />}
            {loading ? 'Assigning...' : 'Assign Lead'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// SCHEDULE SITE VISIT MODAL
// ============================================================
const ScheduleSiteVisitModal = ({ lead, show, onClose, onSave }) => {
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('11:00');
  const [visitNotes, setVisitNotes] = useState('');
  const [assignedAgent, setAssignedAgent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 2);
      const iso = tomorrow.toISOString().split('T')[0];
      setVisitDate(lead?.siteVisitDate ? lead.siteVisitDate.split('T')[0] : iso);
      setVisitTime('11:00');
      setVisitNotes('');
      setAssignedAgent(lead?.assignedTo || '');
    }
  }, [show, lead]);

  if (!lead || !show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!visitDate || !visitTime) return;
    setLoading(true);
    setTimeout(() => {
      const isoDateTime = new Date(`${visitDate}T${visitTime}:00`).toISOString();
      onSave(lead.id, {
        siteVisitDate: isoDateTime,
        siteVisitNotes: visitNotes.trim(),
        assignedAgent: assignedAgent.trim()
      });
      setLoading(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-purple-400 p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white">
              <FiNavigation className="text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Schedule Site Visit</h2>
              <p className="text-white/80 text-sm">{lead.leadId} • {lead.customerName}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-3 flex items-start gap-2">
            <FiHomeIcon className="text-purple-600 flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-purple-900 truncate">{lead.propertyName}</p>
              <p className="text-[11px] text-purple-700 truncate">{lead.location}</p>
            </div>
          </div>

          <div className="bg-[#F5F9F8] rounded-2xl p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">
                  Visit Date *
                </label>
                <input
                  type="date"
                  value={visitDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setVisitDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">
                  Visit Time *
                </label>
                <input
                  type="time"
                  value={visitTime}
                  onChange={(e) => setVisitTime(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#F5F9F8] rounded-2xl p-4">
            <label className="block text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">
              Assigned Agent
            </label>
            <input
              type="text"
              value={assignedAgent}
              onChange={(e) => setAssignedAgent(e.target.value)}
              placeholder="Who will accompany the customer?"
              className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
            />
          </div>

          <div className="bg-[#F5F9F8] rounded-2xl p-4">
            <label className="block text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">
              Notes (Optional)
            </label>
            <textarea
              value={visitNotes}
              onChange={(e) => setVisitNotes(e.target.value)}
              rows="3"
              placeholder="Any special instructions, meeting point, etc."
              className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none resize-none"
            />
          </div>
        </form>

        <div className="px-6 py-4 bg-[#F8FAF9] border-t border-[#E8F0EE] flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-white text-[#1A2E2A] rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 text-sm font-medium border border-[#E8F0EE]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!visitDate || loading}
            className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-300 text-sm font-medium shadow-lg shadow-purple-600/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <FiRefreshCw className="animate-spin" /> : <FiNavigation />}
            {loading ? 'Scheduling...' : 'Schedule Visit'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// SCHEDULE FOLLOW-UP MODAL
// ============================================================
const ScheduleFollowUpModal = ({ lead, show, onClose, onSave }) => {
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpTime, setFollowUpTime] = useState('10:00');
  const [followUpNote, setFollowUpNote] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const iso = tomorrow.toISOString().split('T')[0];
      setFollowUpDate(lead?.nextFollowUp ? lead.nextFollowUp.split('T')[0] : iso);
      setFollowUpTime('10:00');
      setFollowUpNote('');
    }
  }, [show, lead]);

  if (!lead || !show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!followUpDate) return;
    setLoading(true);
    setTimeout(() => {
      const isoDateTime = new Date(`${followUpDate}T${followUpTime}:00`).toISOString();
      onSave(lead.id, isoDateTime, followUpNote.trim());
      setLoading(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl animate-slide-up border border-[#E8F0EE] overflow-hidden">
        <div className="bg-gradient-to-r from-amber-600 to-amber-400 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white">
              <FiCalendar className="text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Schedule Follow-Up</h2>
              <p className="text-white/80 text-sm">{lead.leadId} • {lead.customerName}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-[#F5F9F8] rounded-2xl p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">
                  Follow-Up Date *
                </label>
                <input
                  type="date"
                  value={followUpDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={followUpTime}
                  onChange={(e) => setFollowUpTime(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#F5F9F8] rounded-2xl p-4">
            <label className="block text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">
              Note (Optional)
            </label>
            <textarea
              value={followUpNote}
              onChange={(e) => setFollowUpNote(e.target.value)}
              rows="3"
              placeholder="Add a reminder note for this follow-up..."
              className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none resize-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!followUpDate || loading}
              className="flex-1 px-4 py-2.5 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-all duration-300 text-sm font-medium shadow-lg shadow-amber-600/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <FiRefreshCw className="animate-spin" /> : <FiCalendar />}
              {loading ? 'Scheduling...' : 'Schedule Follow-Up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================
// VIEW CUSTOMER MODAL
// ============================================================
const ViewCustomerModal = ({ lead, show, onClose, onNavigateToProfile }) => {
  if (!lead || !show) return null;

  const resolvedCustomerId = resolveCustomerId(lead);

  const handleViewProfile = () => {
    if (onNavigateToProfile) {
      onNavigateToProfile(resolvedCustomerId);
    }
  };

  const displayEmail =
    lead.customerEmail ||
    `${String(lead.customerName || '')
      .toLowerCase()
      .replace(/\s+/g, '.')}@example.com`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl animate-slide-up border border-[#E8F0EE] overflow-hidden">
        <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
          <h2 className="text-xl font-bold text-white">Customer Details</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white text-2xl shadow-lg">
              <FiUser />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1A2E2A]">{lead.customerName}</h3>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-[#E8F4F2] text-[#00695C] border border-[#00695C]/20">
                Lead Customer
              </span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-[#F5F9F8] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiMail className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Email</h4>
              </div>
              <p className="text-sm font-medium text-[#1A2E2A]">{displayEmail}</p>
            </div>
            <div className="bg-[#F5F9F8] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiPhone className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Phone</h4>
              </div>
              <p className="text-sm font-medium text-[#1A2E2A]">{lead.mobileNumber}</p>
            </div>
            <div className="bg-[#F5F9F8] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiHash className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Customer ID</h4>
              </div>
              <p className="text-sm font-medium text-[#1A2E2A]">{resolvedCustomerId}</p>
            </div>
            <div className="bg-[#F5F9F8] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiCalendar className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Lead Date</h4>
              </div>
              <p className="text-sm font-medium text-[#1A2E2A]">
                {new Date(lead.leadDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-[#F8FAF9] border-t border-[#E8F0EE] flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-white text-[#1A2E2A] rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 text-sm font-medium border border-[#E8F0EE]"
          >
            Close
          </button>
          <button
            onClick={handleViewProfile}
            className="flex-1 px-4 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#00695C]/30 flex items-center justify-center gap-2"
          >
            <FiExternalLink className="text-sm" /> View Full Profile
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// VIEW USER PROPERTIES MODAL
// ============================================================
const UserPropertiesModal = ({ customerName, customerId, show, onClose, allLeads, onNavigateToProperty }) => {
  if (!show) return null;

  const userProperties = useMemo(() => {
    const map = new Map();

    allLeads
      .filter((l) => l.customerName === customerName)
      .forEach((l) => {
        const propertyId = resolvePropertyId(l);
        if (!map.has(propertyId)) {
          map.set(propertyId, {
            propertyId,
            propertyName: l.propertyName,
            propertyType: l.propertyType,
            location: l.location,
            leadStatus: l.leadStatus,
            priority: l.priority,
            leadDate: l.leadDate,
            purpose: l.purpose
          });
        }
      });

    return Array.from(map.values());
  }, [allLeads, customerName]);

  const handleViewProperty = (propertyId) => {
    if (onNavigateToProperty) {
      onNavigateToProperty(propertyId);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white">
              <FiHomeIcon className="text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{customerName}'s Properties</h2>
              <p className="text-white/80 text-sm">
                {userProperties.length} propert{userProperties.length === 1 ? 'y' : 'ies'} enquired
                {customerId ? ` • ${customerId}` : ''}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-[#F8FAF9]">
          {userProperties.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-24 h-24 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4">
                <FiHomeIcon className="text-4xl text-[#B5C9C5]" />
              </div>
              <h3 className="text-xl font-bold text-[#1A2E2A]">No properties found</h3>
              <p className="text-sm text-[#5A7D78] mt-1">This customer has no property enquiries yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {userProperties.map((prop, index) => {
                const propTypeConfig = PROPERTY_TYPE_CONFIG[prop.propertyType] || PROPERTY_TYPE_CONFIG['Individual'];
                const PropTypeIcon = propTypeConfig.icon;
                const statusConfig = LEAD_STATUS_TYPES[prop.leadStatus] || LEAD_STATUS_TYPES['New'];
                const StatusIcon = statusConfig.icon;
                const priorityConfig = LEAD_PRIORITY_TYPES[prop.priority] || LEAD_PRIORITY_TYPES['Medium'];
                const PriorityIcon = priorityConfig.icon;
                const purposeConfig = PURPOSE_CONFIG[prop.purpose] || PURPOSE_CONFIG['Buy'];
                const PurposeIcon = purposeConfig.icon;

                return (
                  <div
                    key={prop.propertyId}
                    className="bg-white rounded-2xl border border-[#E8F0EE] p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 animate-slide-in"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`w-10 h-10 rounded-2xl ${propTypeConfig.bg} flex items-center justify-center ${propTypeConfig.text} border ${propTypeConfig.border} flex-shrink-0`}>
                          <PropTypeIcon className="text-sm" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-sm text-[#1A2E2A] truncate">{prop.propertyName}</h3>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${propTypeConfig.bg} ${propTypeConfig.text} border ${propTypeConfig.border}`}>
                            {prop.propertyType}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#5A7D78] mb-2">
                      <FiMap className="text-[#00695C] flex-shrink-0" />
                      <span className="font-medium">{prop.location}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#5A7D78] mb-3">
                      <FiHash className="text-[#00695C] flex-shrink-0" />
                      <span className="font-medium">{prop.propertyId}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-3 bg-[#F5F9F8] rounded-xl p-2">
                      <div className="text-center">
                        <p className="text-xs font-bold text-[#1A2E2A]">3</p>
                        <p className="text-[9px] text-[#5A7D78] uppercase">Beds</p>
                      </div>
                      <div className="text-center border-x border-[#E8F0EE]">
                        <p className="text-xs font-bold text-[#1A2E2A]">2</p>
                        <p className="text-[9px] text-[#5A7D78] uppercase">Baths</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-bold text-[#1A2E2A]">1200</p>
                        <p className="text-[9px] text-[#5A7D78] uppercase">Sq Ft</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-3 flex-wrap gap-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                        <StatusIcon className="text-[8px]" /> {statusConfig.label}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 ${priorityConfig.bg} ${priorityConfig.text} border ${priorityConfig.border}`}>
                        <PriorityIcon className="text-[8px]" /> {priorityConfig.label}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 ${purposeConfig.bg} ${purposeConfig.text} border ${purposeConfig.border}`}>
                        <PurposeIcon className="text-[8px]" /> {purposeConfig.label}
                      </span>
                    </div>

                    <button
                      onClick={() => handleViewProperty(prop.propertyId)}
                      className="w-full py-2 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-xs font-bold flex items-center justify-center gap-2 hover:scale-[1.02] shadow-lg shadow-[#00695C]/20"
                    >
                      <FiEye className="text-xs" /> View Property Details
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-white border-t border-[#E8F0EE] shrink-0 flex items-center justify-between">
          <span className="text-xs text-[#5A7D78]">
            Total: <span className="font-bold text-[#00695C]">{userProperties.length}</span> propert{userProperties.length === 1 ? 'y' : 'ies'}
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#00695C]/30"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// LEAD HISTORY MODAL
// ============================================================
const LeadHistoryModal = ({ lead, show, onClose, allLeads }) => {
  if (!lead || !show) return null;

  const history = useMemo(() => {
    return allLeads
      .filter(l => l.customerName === lead.customerName)
      .sort((a, b) => new Date(b.leadDate) - new Date(a.leadDate));
  }, [allLeads, lead.customerName]);

  const totalLeads = history.length;
  const activeLeads = history.filter(l =>
    l.leadStatus !== 'Lost' && l.leadStatus !== 'Invalid Lead' && l.leadStatus !== 'Duplicate Lead'
  ).length;
  const convertedLeads = history.filter(l => l.leadStatus === 'Negotiation' || l.leadStatus === 'Site Visit Completed').length;
  const lostLeads = history.filter(l => l.leadStatus === 'Lost').length;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white">
              <FiClock className="text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Lead History</h2>
              <p className="text-white/80 text-sm">{lead.customerName} • {history.length} leads</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-[#F8FAF9] border-b border-[#E8F0EE]">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-2xl p-3 border border-[#E8F0EE] shadow-sm">
              <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider">Total Leads</p>
              <p className="text-lg font-bold text-[#00695C]">{totalLeads}</p>
            </div>
            <div className="bg-white rounded-2xl p-3 border border-[#E8F0EE] shadow-sm">
              <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider">Active</p>
              <p className="text-lg font-bold text-emerald-600">{activeLeads}</p>
            </div>
            <div className="bg-white rounded-2xl p-3 border border-[#E8F0EE] shadow-sm">
              <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider">In Progress</p>
              <p className="text-lg font-bold text-indigo-600">{convertedLeads}</p>
            </div>
            <div className="bg-white rounded-2xl p-3 border border-[#E8F0EE] shadow-sm">
              <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider">Lost</p>
              <p className="text-lg font-bold text-red-600">{lostLeads}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-24 h-24 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4">
                <FiClock className="text-4xl text-[#B5C9C5]" />
              </div>
              <h3 className="text-xl font-bold text-[#1A2E2A]">No leads found</h3>
              <p className="text-sm text-[#5A7D78] mt-1">This customer has no lead history yet.</p>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-[22px] top-0 bottom-0 w-0.5 bg-[#E8F0EE] hidden sm:block" />
              <div className="space-y-4">
                {history.map((item, index) => {
                  const statusConfig = LEAD_STATUS_TYPES[item.leadStatus] || LEAD_STATUS_TYPES['New'];
                  const StatusIcon = statusConfig.icon;
                  const priorityConfig = LEAD_PRIORITY_TYPES[item.priority] || LEAD_PRIORITY_TYPES['Medium'];
                  const PriorityIcon = priorityConfig.icon;
                  const leadTypeConfig = LEAD_TYPE_CONFIG[item.leadType] || LEAD_TYPE_CONFIG['Buy Enquiry'];
                  const LeadTypeIcon = leadTypeConfig.icon;

                  return (
                    <div
                      key={item.id}
                      className="relative flex gap-4 animate-slide-in"
                      style={{ animationDelay: `${index * 60}ms` }}
                    >
                      <div className="hidden sm:flex flex-col items-center">
                        <div className={`w-11 h-11 rounded-full ${statusConfig.bg} border-2 ${statusConfig.border} flex items-center justify-center ${statusConfig.text} z-10 bg-white`}>
                          <StatusIcon className="text-sm" />
                        </div>
                      </div>
                      <div className="flex-1 bg-white rounded-2xl border border-[#E8F0EE] p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:border-[#00695C]/30">
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={`sm:hidden w-8 h-8 rounded-full ${statusConfig.bg} border ${statusConfig.border} flex items-center justify-center ${statusConfig.text} flex-shrink-0`}>
                              <StatusIcon className="text-xs" />
                            </span>
                            <div>
                              <p className="text-sm font-bold text-[#1A2E2A]">{item.leadId}</p>
                              <p className="text-[10px] text-[#5A7D78]">{item.leadType}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-[#00695C]">{item.propertyName}</p>
                            <p className="text-[10px] text-[#5A7D78]">
                              {new Date(item.leadDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                            <StatusIcon className="text-[8px]" /> {statusConfig.label}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 ${priorityConfig.bg} ${priorityConfig.text} border ${priorityConfig.border}`}>
                            <PriorityIcon className="text-[8px]" /> {priorityConfig.label}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 ${leadTypeConfig.bg} ${leadTypeConfig.text} border ${leadTypeConfig.border}`}>
                            <LeadTypeIcon className="text-[8px]" /> {item.leadType}
                          </span>
                        </div>
                        <div className="text-xs text-[#5A7D78] space-y-1">
                          <p className="flex items-center gap-1">
                            <FiMap className="text-[#00695C] text-[10px]" />
                            <span className="font-medium">{item.location}</span>
                          </p>
                          <p className="flex items-center gap-1">
                            <FiUserCheck className="text-[#00695C] text-[10px]" />
                            <span className="font-medium">{item.assignedTo || 'Unassigned'}</span>
                          </p>
                          {item.nextFollowUp && (
                            <p className="flex items-center gap-1">
                              <FiCalendar className="text-[#00695C] text-[10px]" />
                              <span className="font-medium">
                                Follow-up: {new Date(item.nextFollowUp).toLocaleString('en-IN', {
                                  day: 'numeric', month: 'short', year: 'numeric',
                                  hour: '2-digit', minute: '2-digit'
                                })}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-white border-t border-[#E8F0EE] shrink-0 flex items-center justify-between">
          <span className="text-xs text-[#5A7D78]">
            Showing <span className="font-bold text-[#00695C]">{history.length}</span> leads
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#00695C]/30"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// ADD NOTE MODAL
// ============================================================
const AddNoteModal = ({ lead, show, onClose, onSave }) => {
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) setNote('');
  }, [show]);

  if (!lead || !show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!note.trim()) return;
    setLoading(true);
    setTimeout(() => {
      onSave(lead.id, note.trim());
      setLoading(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl animate-slide-up border border-[#E8F0EE] overflow-hidden">
        <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
          <h2 className="text-xl font-bold text-white">Add Lead Note</h2>
          <p className="text-white/80 text-sm">{lead.leadId} • {lead.customerName}</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows="4"
            placeholder="Enter your note about this lead..."
            className="w-full px-4 py-3 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none resize-none"
            autoFocus
          />
          <div className="flex items-center gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!note.trim() || loading}
              className="flex-1 px-4 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#00695C]/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <FiRefreshCw className="animate-spin" /> : <FiSave />}
              {loading ? 'Saving...' : 'Save Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================
// LEAD ACTIONS MODAL
// ============================================================
const LeadActionsModal = ({ lead, show, onClose, onAction }) => {
  if (!lead || !show) return null;

  const statusConfig = LEAD_STATUS_TYPES[lead.leadStatus] || LEAD_STATUS_TYPES['New'];
  const StatusIcon = statusConfig.icon;
  const priorityConfig = LEAD_PRIORITY_TYPES[lead.priority] || LEAD_PRIORITY_TYPES['Medium'];
  const PriorityIcon = priorityConfig.icon;

  const getAvailableActions = () => {
    const actions = [];

    actions.push({ id: 'view-lead', label: 'View Lead', icon: FiEye, color: 'text-[#00695C]', bg: 'bg-[#E8F4F2]', hoverBg: 'hover:bg-[#C5EDE5]', description: 'View full lead details' });
    actions.push({ id: 'view-customer', label: 'View Customer', icon: FiUser, color: 'text-pink-700', bg: 'bg-pink-50', hoverBg: 'hover:bg-pink-100', description: 'View customer details' });
    actions.push({ id: 'view-property', label: 'View Properties', icon: FiHomeIcon, color: 'text-teal-700', bg: 'bg-teal-50', hoverBg: 'hover:bg-teal-100', description: 'View property enquiries' });
    actions.push({ id: 'view-history', label: 'View Lead History', icon: FiClock, color: 'text-slate-700', bg: 'bg-slate-50', hoverBg: 'hover:bg-slate-100', description: 'View all leads for this customer' });
    actions.push({ id: 'edit-lead', label: 'Edit Lead', icon: FiEdit, color: 'text-[#26A69A]', bg: 'bg-[#E8F4F2]', hoverBg: 'hover:bg-[#C5EDE5]', description: 'Edit lead information' });

    if (lead.leadStatus === 'New') {
      actions.push({ id: 'mark-contacted', label: 'Mark Contacted', icon: FiPhone, color: 'text-cyan-700', bg: 'bg-cyan-50', hoverBg: 'hover:bg-cyan-100', description: 'Mark lead as contacted' });
    }
    if (lead.leadStatus === 'Contacted' || lead.leadStatus === 'New') {
      actions.push({ id: 'mark-interested', label: 'Mark Interested', icon: FiThumbsUp, color: 'text-emerald-700', bg: 'bg-emerald-50', hoverBg: 'hover:bg-emerald-100', description: 'Mark lead as interested' });
    }
    if (lead.leadStatus !== 'Lost' && lead.leadStatus !== 'Invalid Lead' && lead.leadStatus !== 'Duplicate Lead') {
      actions.push({ id: 'schedule-followup', label: 'Schedule Follow-Up', icon: FiCalendar, color: 'text-amber-700', bg: 'bg-amber-50', hoverBg: 'hover:bg-amber-100', description: 'Pick a date & time for follow-up' });
    }
    if (lead.leadStatus === 'Interested' || lead.leadStatus === 'Follow-Up') {
      actions.push({ id: 'schedule-site-visit', label: 'Schedule Site Visit', icon: FiNavigation, color: 'text-purple-700', bg: 'bg-purple-50', hoverBg: 'hover:bg-purple-100', description: 'Schedule a site visit with date & time' });
    }
    if (lead.leadStatus === 'Site Visit Scheduled') {
      actions.push({ id: 'complete-site-visit', label: 'Complete Site Visit', icon: FiCheckCircle, color: 'text-indigo-700', bg: 'bg-indigo-50', hoverBg: 'hover:bg-indigo-100', description: 'Mark site visit as completed' });
    }
    if (lead.leadStatus === 'Site Visit Completed' || lead.leadStatus === 'Interested') {
      actions.push({ id: 'mark-negotiation', label: 'Move to Negotiation', icon: FiDollarSign, color: 'text-orange-700', bg: 'bg-orange-50', hoverBg: 'hover:bg-orange-100', description: 'Move lead to negotiation stage' });
    }

    actions.push({ id: 'assign-lead', label: 'Assign Lead', icon: FiUserPlus, color: 'text-blue-700', bg: 'bg-blue-50', hoverBg: 'hover:bg-blue-100', description: 'Assign this lead to an agent' });
    actions.push({ id: 'add-note', label: 'Add Note', icon: FiPlus, color: 'text-teal-700', bg: 'bg-teal-50', hoverBg: 'hover:bg-teal-100', description: 'Add a note to this lead' });
    actions.push({ id: 'mark-lost', label: 'Mark as Lost', icon: FiXCircle, color: 'text-red-700', bg: 'bg-red-50', hoverBg: 'hover:bg-red-100', description: 'Mark lead as lost' });
    actions.push({ id: 'mark-invalid', label: 'Mark Invalid', icon: FiSlash, color: 'text-slate-700', bg: 'bg-slate-50', hoverBg: 'hover:bg-slate-100', description: 'Mark lead as invalid' });
    actions.push({ id: 'mark-duplicate', label: 'Mark Duplicate', icon: FiCopy, color: 'text-pink-700', bg: 'bg-pink-50', hoverBg: 'hover:bg-pink-100', description: 'Mark lead as duplicate' });

    return actions;
  };

  const actions = getAvailableActions();

  const handleAction = (actionId) => {
    onAction(actionId, lead);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 rounded-t-3xl z-10 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white shadow-lg`}>
              <StatusIcon className="text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Lead Actions</h2>
              <p className="text-white/80 text-sm">{lead.leadId} • {lead.customerName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
              <StatusIcon className="text-xs" /> {statusConfig.label}
            </span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${priorityConfig.bg} ${priorityConfig.text} border ${priorityConfig.border}`}>
              <PriorityIcon className="text-xs" /> {priorityConfig.label} Priority
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/30">
              {lead.leadType}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {actions.map((action, index) => {
              const ActionIcon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => handleAction(action.id)}
                  className={`flex items-center gap-3 p-4 rounded-2xl border border-[#E8F0EE] ${action.bg} ${action.hoverBg} transition-all duration-300 hover:scale-[1.02] hover:shadow-md text-left group animate-slide-in`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={`w-10 h-10 rounded-xl ${action.bg} flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform duration-300 border border-[#E8F0EE]`}>
                    <ActionIcon className="text-lg" />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-bold ${action.color}`}>{action.label}</p>
                    <p className="text-[11px] text-[#5A7D78] truncate">{action.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="sticky bottom-0 px-6 py-4 bg-white border-t border-[#E8F0EE] rounded-b-3xl shrink-0">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// VIEW LEAD DETAIL MODAL
// ============================================================
const ViewLeadDetailModal = ({ lead, show, onClose, onEdit, onDelete, onAction }) => {
  if (!lead || !show) return null;

  const statusConfig = LEAD_STATUS_TYPES[lead.leadStatus] || LEAD_STATUS_TYPES['New'];
  const StatusIcon = statusConfig.icon;
  const priorityConfig = LEAD_PRIORITY_TYPES[lead.priority] || LEAD_PRIORITY_TYPES['Medium'];
  const PriorityIcon = priorityConfig.icon;
  const leadTypeConfig = LEAD_TYPE_CONFIG[lead.leadType] || LEAD_TYPE_CONFIG['Buy Enquiry'];
  const LeadTypeIcon = leadTypeConfig.icon;
  const leadSourceConfig = LEAD_SOURCE_CONFIG[lead.leadSource] || LEAD_SOURCE_CONFIG['Website'];
  const LeadSourceIcon = leadSourceConfig.icon;
  const purposeConfig = PURPOSE_CONFIG[lead.purpose] || PURPOSE_CONFIG['Buy'];
  const PurposeIcon = purposeConfig.icon;
  const propTypeConfig = PROPERTY_TYPE_CONFIG[lead.propertyType] || PROPERTY_TYPE_CONFIG['Individual'];
  const PropTypeIcon = propTypeConfig.icon;

  const getAvailableActions = () => {
    const actions = [];
    actions.push({ id: 'view-customer', label: 'View Customer', icon: FiUser, color: 'text-pink-700', bg: 'bg-pink-50', hoverBg: 'hover:bg-pink-100', border: 'border-pink-200' });
    actions.push({ id: 'view-property', label: 'View Properties', icon: FiHomeIcon, color: 'text-teal-700', bg: 'bg-teal-50', hoverBg: 'hover:bg-teal-100', border: 'border-teal-200' });
    actions.push({ id: 'view-history', label: 'View Lead History', icon: FiClock, color: 'text-slate-700', bg: 'bg-slate-50', hoverBg: 'hover:bg-slate-100', border: 'border-slate-200' });

    if (lead.leadStatus === 'New') {
      actions.push({ id: 'mark-contacted', label: 'Mark Contacted', icon: FiPhone, color: 'text-cyan-700', bg: 'bg-cyan-50', hoverBg: 'hover:bg-cyan-100', border: 'border-cyan-200' });
    }
    if (lead.leadStatus === 'Contacted' || lead.leadStatus === 'New') {
      actions.push({ id: 'mark-interested', label: 'Mark Interested', icon: FiThumbsUp, color: 'text-emerald-700', bg: 'bg-emerald-50', hoverBg: 'hover:bg-emerald-100', border: 'border-emerald-200' });
    }
    if (lead.leadStatus !== 'Lost' && lead.leadStatus !== 'Invalid Lead' && lead.leadStatus !== 'Duplicate Lead') {
      actions.push({ id: 'schedule-followup', label: 'Schedule Follow-Up', icon: FiCalendar, color: 'text-amber-700', bg: 'bg-amber-50', hoverBg: 'hover:bg-amber-100', border: 'border-amber-200' });
    }
    if (lead.leadStatus === 'Interested' || lead.leadStatus === 'Follow-Up') {
      actions.push({ id: 'schedule-site-visit', label: 'Schedule Site Visit', icon: FiNavigation, color: 'text-purple-700', bg: 'bg-purple-50', hoverBg: 'hover:bg-purple-100', border: 'border-purple-200' });
    }
    if (lead.leadStatus === 'Site Visit Scheduled') {
      actions.push({ id: 'complete-site-visit', label: 'Complete Site Visit', icon: FiCheckCircle, color: 'text-indigo-700', bg: 'bg-indigo-50', hoverBg: 'hover:bg-indigo-100', border: 'border-indigo-200' });
    }
    if (lead.leadStatus === 'Site Visit Completed' || lead.leadStatus === 'Interested') {
      actions.push({ id: 'mark-negotiation', label: 'Move to Negotiation', icon: FiDollarSign, color: 'text-orange-700', bg: 'bg-orange-50', hoverBg: 'hover:bg-orange-100', border: 'border-orange-200' });
    }
    actions.push({ id: 'assign-lead', label: 'Assign Lead', icon: FiUserPlus, color: 'text-blue-700', bg: 'bg-blue-50', hoverBg: 'hover:bg-blue-100', border: 'border-blue-200' });
    actions.push({ id: 'add-note', label: 'Add Note', icon: FiPlus, color: 'text-teal-700', bg: 'bg-teal-50', hoverBg: 'hover:bg-teal-100', border: 'border-teal-200' });

    return actions;
  };

  const availableActions = getAvailableActions();

  const handleActionClick = (actionId) => {
    if (onAction) {
      onAction(actionId, lead);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
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

        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Existing fields */}
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiHash className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Lead ID</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{lead.leadId}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiCalendar className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Lead Date</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">
                {new Date(lead.leadDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiUser className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Customer Name</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{lead.customerName}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiPhone className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Mobile Number</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{lead.mobileNumber}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiHomeIcon className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Property Name</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{lead.propertyName}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <PropTypeIcon className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Property Type</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{lead.propertyType}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiMap className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Location</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{lead.location}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiUserCheck className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Assigned To</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{lead.assignedTo || 'Unassigned'}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <StatusIcon className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Lead Status</h4>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                {statusConfig.label}
              </span>
            </div>

            {/* Existing Priority field */}
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <PriorityIcon className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Priority</h4>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${priorityConfig.bg} ${priorityConfig.text} border ${priorityConfig.border}`}>
                {priorityConfig.label}
              </span>
            </div>

            {/* ⭐ NEW FIELDS: Lead Type, Source, and Purpose */}
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <LeadTypeIcon className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Lead Type</h4>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${leadTypeConfig.bg} ${leadTypeConfig.text} border ${leadTypeConfig.border}`}>
                {lead.leadType || 'Buy Enquiry'}
              </span>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <LeadSourceIcon className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Lead Source</h4>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${leadSourceConfig.bg} ${leadSourceConfig.text} border ${leadSourceConfig.border}`}>
                {lead.leadSource || 'Website'}
              </span>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <PurposeIcon className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Purpose</h4>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${purposeConfig.bg} ${purposeConfig.text} border ${purposeConfig.border}`}>
                {lead.purpose || 'Buy'}
              </span>
            </div>
            {/* End of new fields */}

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiCalendar className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Next Follow-Up</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">
                {lead.nextFollowUp
                  ? new Date(lead.nextFollowUp).toLocaleString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })
                  : 'Not scheduled'}
              </p>
            </div>

            {lead.siteVisitDate && (
              <div className="bg-purple-50 rounded-2xl p-4 border border-purple-200 md:col-span-2">
                <div className="flex items-center gap-2 mb-1">
                  <FiNavigation className="text-purple-600 text-sm" />
                  <h4 className="text-xs font-semibold text-purple-700 uppercase tracking-wider">Site Visit Scheduled</h4>
                </div>
                <p className="text-sm font-bold text-purple-900">
                  {new Date(lead.siteVisitDate).toLocaleString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  })}
                </p>
                {lead.siteVisitNotes && (
                  <p className="text-xs text-purple-700 mt-1">📝 {lead.siteVisitNotes}</p>
                )}
              </div>
            )}

            <div className="bg-[#F5F9F8] rounded-2xl p-4 md:col-span-2">
              <div className="flex items-center gap-2 mb-1">
                <FiFileText className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Description</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{lead.description || 'No description available'}</p>
            </div>

            {lead.notes && lead.notes.length > 0 && (
              <div className="bg-[#F5F9F8] rounded-2xl p-4 md:col-span-2">
                <div className="flex items-center gap-2 mb-1">
                  <FiClipboard className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Lead Notes</h4>
                </div>
                <div className="space-y-2">
                  {lead.notes.map((note, idx) => (
                    <div key={idx} className="text-sm text-[#1A2E2A] bg-white rounded-lg p-2 border border-[#E8F0EE]">
                      <p>{note.text}</p>
                      <p className="text-[10px] text-[#5A7D78] mt-1">{note.addedBy} • {new Date(note.addedAt).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-[#E8F0EE] pt-5">
            <div className="flex items-center gap-2 mb-4">
              <FiActivity className="text-[#00695C] text-lg" />
              <h3 className="text-sm font-bold text-[#1A2E2A] uppercase tracking-wider">Available Actions</h3>
              <span className="px-2 py-0.5 bg-[#E8F4F2] text-[#00695C] text-[10px] font-semibold rounded-full">
                {availableActions.length} actions
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {availableActions.map((action, index) => {
                const ActionIcon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => handleActionClick(action.id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl border ${action.border} ${action.bg} ${action.hoverBg} transition-all duration-300 hover:scale-[1.03] hover:shadow-md group animate-slide-in`}
                    style={{ animationDelay: `${index * 40}ms` }}
                  >
                    <div className={`w-10 h-10 rounded-xl ${action.bg} flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform duration-300 border ${action.border}`}>
                      <ActionIcon className="text-lg" />
                    </div>
                    <span className={`text-[11px] font-bold ${action.color} text-center leading-tight`}>
                      {action.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

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
// EDIT LEAD MODAL
// ============================================================
const EditLeadModal = ({ lead, show, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    leadId: '', leadDate: '', customerName: '', mobileNumber: '',
    propertyName: '', propertyType: '', location: '',
    assignedTo: '', leadStatus: '', priority: '', nextFollowUp: '',
    leadType: '', leadSource: '', purpose: '', description: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lead) {
      setFormData({
        leadId: lead.leadId || '',
        leadDate: lead.leadDate ? lead.leadDate.split('T')[0] : '',
        customerName: lead.customerName || '',
        mobileNumber: lead.mobileNumber || '',
        propertyName: lead.propertyName || '',
        propertyType: lead.propertyType || '',
        location: lead.location || '',
        assignedTo: lead.assignedTo || '',
        leadStatus: lead.leadStatus || 'New',
        priority: lead.priority || 'Medium',
        nextFollowUp: lead.nextFollowUp ? lead.nextFollowUp.split('T')[0] : '',
        leadType: lead.leadType || '',
        leadSource: lead.leadSource || '',
        purpose: lead.purpose || '',
        description: lead.description || ''
      });
    }
  }, [lead]);

  if (!lead || !show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 rounded-t-3xl z-10 shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
          <h2 className="text-2xl font-bold text-white">Edit Lead</h2>
          <p className="text-white/80 text-sm">Update lead information</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiHash className="text-[#00695C]" />
                Lead Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Lead ID</label>
                  <input
                    type="text" name="leadId" value={formData.leadId} onChange={handleChange} readOnly
                    className="w-full px-3 py-2 bg-[#F0F5F4] rounded-xl border border-[#E8F0EE] text-sm text-[#1A2E2A] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Lead Date</label>
                  <input
                    type="date" name="leadDate" value={formData.leadDate} onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiUser className="text-[#00695C]" />
                Customer Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Customer Name *</label>
                  <input
                    type="text" name="customerName" value={formData.customerName} onChange={handleChange} required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Mobile Number *</label>
                  <input
                    type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiHomeIcon className="text-[#00695C]" />
                Property Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Property Name *</label>
                  <input
                    type="text" name="propertyName" value={formData.propertyName} onChange={handleChange} required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Property Type *</label>
                  <select
                    name="propertyType" value={formData.propertyType} onChange={handleChange} required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  >
                    <option value="">Select Property Type</option>
                    {ALL_PROPERTY_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Location *</label>
                  <input
                    type="text" name="location" value={formData.location} onChange={handleChange} required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiActivity className="text-[#00695C]" />
                Lead Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Lead Type *</label>
                  <select
                    name="leadType" value={formData.leadType} onChange={handleChange} required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  >
                    <option value="">Select Lead Type</option>
                    {ALL_LEAD_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Lead Source *</label>
                  <select
                    name="leadSource" value={formData.leadSource} onChange={handleChange} required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  >
                    <option value="">Select Lead Source</option>
                    {ALL_LEAD_SOURCES.map(source => <option key={source} value={source}>{source}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Purpose *</label>
                  <select
                    name="purpose" value={formData.purpose} onChange={handleChange} required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  >
                    <option value="">Select Purpose</option>
                    {ALL_PURPOSES.map(purpose => <option key={purpose} value={purpose}>{purpose}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Assigned To</label>
                  <input
                    type="text" name="assignedTo" value={formData.assignedTo} onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Lead Status *</label>
                  <select
                    name="leadStatus" value={formData.leadStatus} onChange={handleChange} required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  >
                    {ALL_LEAD_STATUSES.map(status => <option key={status} value={status}>{LEAD_STATUS_TYPES[status].label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Priority *</label>
                  <select
                    name="priority" value={formData.priority} onChange={handleChange} required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  >
                    {ALL_LEAD_PRIORITIES.map(priority => <option key={priority} value={priority}>{priority}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Next Follow-Up</label>
                  <input
                    type="date" name="nextFollowUp" value={formData.nextFollowUp} onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Description</label>
                  <textarea
                    name="description" value={formData.description} onChange={handleChange} rows="2"
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

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
// STAT CARD COMPONENT
// ============================================================
const StatCard = ({ icon, title, value, color, delay = 0, isActive, onClick }) => (
  <div
    className={`bg-white rounded-2xl p-1 shadow-sm hover:shadow-lg transition-all duration-500 border group cursor-pointer transform hover:-translate-y-1 animate-slide-in ${isActive ? 'ring-2 ring-[#00695C] shadow-lg bg-[#F5F9F8]' : 'border-[#E8F0EE]'}`}
    style={{ animationDelay: `${delay}ms` }}
    onClick={() => onClick && onClick()}
  >
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider truncate">{title}</p>
        <p className={`text-lg font-bold text-[#1A2E2A] group-hover:text-[#00695C] transition-colors duration-300 ${isActive ? 'text-[#00695C]' : ''}`}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
      </div>
    </div>
    {isActive && (
      <div className="mt-1 flex items-center gap-1">
        <span className="text-[7px] text-[#00695C] font-medium bg-[#E8F4F2] px-2 py-0.5 rounded-full">Active Filter</span>
      </div>
    )}
  </div>
);

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
// MAIN COMPONENT
// ============================================================
const LeadDashboardAndList = () => {
  const navigate = useNavigate();
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
  const [showStats, setShowStats] = useState(true);

  // ⭐ DATE RANGE STATE
  const [dateRange, setDateRange] = useState('this_month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // MODAL STATES
  const [actionsModal, setActionsModal] = useState({ show: false, lead: null });
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [noteLead, setNoteLead] = useState(null);
  const [showViewCustomerModal, setShowViewCustomerModal] = useState(false);
  const [customerLead, setCustomerLead] = useState(null);
  const [showUserPropertiesModal, setShowUserPropertiesModal] = useState(false);
  const [userPropertiesData, setUserPropertiesData] = useState({ customerName: '', customerId: '' });
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyLead, setHistoryLead] = useState(null);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [followUpLead, setFollowUpLead] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignLead, setAssignLead] = useState(null);
  const [showSiteVisitModal, setShowSiteVisitModal] = useState(false);
  const [siteVisitLead, setSiteVisitLead] = useState(null);

  // CONFIRMATION
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false, title: '', message: '', confirmText: 'Confirm', cancelText: 'Cancel', type: 'danger', onConfirm: null, onCancel: null
  });

  // STATS
  const [stats, setStats] = useState({
    total: 0, New: 0, Contacted: 0, Interested: 0, 'Follow-Up': 0,
    'Site Visit Scheduled': 0, 'Site Visit Completed': 0, Negotiation: 0,
    Lost: 0, 'Invalid Lead': 0, 'Duplicate Lead': 0,
    unassigned: 0, assigned: 0, todayLeads: 0, monthLeads: 0
  });

  const computeStats = useCallback((list) => {
    if (!list || list.length === 0) {
      setStats({
        total: 0, New: 0, Contacted: 0, Interested: 0, 'Follow-Up': 0,
        'Site Visit Scheduled': 0, 'Site Visit Completed': 0, Negotiation: 0,
        Lost: 0, 'Invalid Lead': 0, 'Duplicate Lead': 0,
        unassigned: 0, assigned: 0, todayLeads: 0, monthLeads: 0
      });
      return;
    }

    const counts = { total: list.length };
    ALL_LEAD_STATUSES.forEach(status => {
      counts[status] = list.filter(l => l.leadStatus === status).length;
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayLeads = list.filter(l => {
      const d = new Date(l.leadDate);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === today.getTime();
    }).length;

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthLeads = list.filter(l => new Date(l.leadDate) >= monthStart).length;

    const assigned = list.filter(l => l.assignedTo && l.assignedTo.trim() !== '').length;
    const unassigned = list.length - assigned;

    setStats({ ...counts, unassigned, assigned, todayLeads, monthLeads });
  }, []);

  // GENERATE MOCK DATA
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

      // ⭐ Spread dates across 365 days for better date-range filtering
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

      list.push({
        id: `lead_${i}`,
        leadId: `LEAD-${String(i).padStart(5, '0')}`,
        leadDate: leadDate.toISOString(),
        customerName,
        customerId: `CUST-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}`,
        customerEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        mobileNumber: mobileNum,
        propertyName,
        propertyType,
        location,
        assignedTo,
        leadStatus,
        priority,
        nextFollowUp: nextFollowUp ? nextFollowUp.toISOString() : null,
        leadType,
        leadSource,
        purpose,
        description: `${leadType} for ${propertyName} in ${location}.`,
        siteVisitDate: null,
        siteVisitNotes: '',
        notes: Math.random() > 0.7 ? [
          {
            text: 'Follow-up call scheduled with customer.',
            addedBy: 'Admin',
            addedAt: new Date(now.getTime() - Math.random() * 86400000 * 7).toISOString()
          }
        ] : []
      });
    }

    computeStats(list);
    return list;
  }, [computeStats]);

  // INIT
  useEffect(() => {
    try {
      const mockLeads = generateMockLeads();
      setLeads(mockLeads);
      setFilteredLeads(mockLeads);
    } catch (error) {
      console.error('Error generating mock leads:', error);
    }
  }, [generateMockLeads]);

  // FILTER (with DATE RANGE)
  const filterLeads = useCallback(() => {
    try {
      let filtered = [...leads];

      // ⭐ DATE RANGE FILTER
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
          (l.purpose && l.purpose.toLowerCase().includes(query))
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
      computeStats(updated);
      return updated;
    });
    setToast({ message: `Lead "${updatedLead.leadId}" updated successfully`, type: 'success' });
  }, [computeStats]);

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
            computeStats(updated);
            return updated;
          });
          setActionLoading(null);
          setShowViewModal(false);
          setToast({ message: `Deleted lead "${lead.leadId}"`, type: 'warning' });
        }, 700);
      },
      onCancel: () => setConfirmationModal(prev => ({ ...prev, isOpen: false }))
    });
  }, [leads, computeStats]);

  const handleAddNote = useCallback((leadId, noteText) => {
    setLeads(prev => {
      const updated = prev.map(l =>
        l.id === leadId
          ? {
              ...l,
              notes: [
                ...(l.notes || []),
                { text: noteText, addedBy: 'Admin', addedAt: new Date().toISOString() }
              ]
            }
          : l
      );
      computeStats(updated);
      return updated;
    });
    setToast({ message: 'Note added successfully', type: 'success' });
  }, [computeStats]);

  const handleScheduleFollowUp = useCallback((leadId, isoDateTime, noteText) => {
    setLeads(prev => {
      const updated = prev.map(l =>
        l.id === leadId
          ? {
              ...l,
              nextFollowUp: isoDateTime,
              leadStatus: 'Follow-Up',
              notes: noteText
                ? [
                    ...(l.notes || []),
                    {
                      text: `Follow-up scheduled: ${noteText}`,
                      addedBy: 'Admin',
                      addedAt: new Date().toISOString()
                    }
                  ]
                : (l.notes || [])
            }
          : l
      );
      computeStats(updated);
      return updated;
    });
    setToast({
      message: `Follow-up scheduled for ${new Date(isoDateTime).toLocaleString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      })}`,
      type: 'success'
    });
  }, [computeStats]);

  const handleScheduleSiteVisit = useCallback((leadId, { siteVisitDate, siteVisitNotes, assignedAgent }) => {
    setLeads(prev => {
      const updated = prev.map(l =>
        l.id === leadId
          ? {
              ...l,
              leadStatus: 'Site Visit Scheduled',
              siteVisitDate,
              siteVisitNotes: siteVisitNotes || '',
              assignedTo: assignedAgent || l.assignedTo,
              nextFollowUp: siteVisitDate,
              notes: siteVisitNotes
                ? [
                    ...(l.notes || []),
                    {
                      text: `Site visit scheduled for ${new Date(siteVisitDate).toLocaleString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}. ${siteVisitNotes}`,
                      addedBy: 'Admin',
                      addedAt: new Date().toISOString()
                    }
                  ]
                : (l.notes || [])
            }
          : l
      );
      computeStats(updated);
      return updated;
    });
    setToast({
      message: `Site visit scheduled for ${new Date(siteVisitDate).toLocaleString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      })}`,
      type: 'success'
    });
  }, [computeStats]);

  const handleAssignAgent = useCallback((leadId, agent) => {
    setLeads(prev => {
      const updated = prev.map(l =>
        l.id === leadId ? { ...l, assignedTo: agent.name } : l
      );
      computeStats(updated);
      return updated;
    });
    setToast({ message: `Lead assigned to ${agent.name} (${agent.role})`, type: 'success' });
  }, [computeStats]);

  const handleNavigateToProfile = useCallback((customerId) => {
    setShowViewCustomerModal(false);
    setCustomerLead(null);
    setActionsModal({ show: false, lead: null });
    setShowViewModal(false);
    setViewingLead(null);
    navigate(`/admin/customers/${customerId}`);
  }, [navigate]);

  const handleNavigateToProperty = useCallback((propertyId) => {
    setShowUserPropertiesModal(false);
    setUserPropertiesData({ customerName: '', customerId: '' });
    setActionsModal({ show: false, lead: null });
    setShowViewModal(false);
    setViewingLead(null);
    navigate(`/admin/properties/${propertyId}`);
  }, [navigate]);

  const handleLeadAction = useCallback((actionId, lead) => {
    const updateLeadStatus = (newStatus, message) => {
      setLeads(prev => {
        const updated = prev.map(l =>
          l.id === lead.id ? { ...l, leadStatus: newStatus } : l
        );
        computeStats(updated);
        return updated;
      });
      setToast({ message: message || `Lead status updated to "${newStatus}"`, type: 'success' });
    };

    switch (actionId) {
      case 'actions':
        setActionsModal({ show: true, lead });
        break;

      case 'view-lead':
        handleViewLead(lead);
        break;

      case 'view-customer': {
        const resolvedId = resolveCustomerId(lead);
        setCustomerLead({ ...lead, customerId: resolvedId });
        setShowViewCustomerModal(true);
        break;
      }

      case 'view-property': {
        const resolvedId = resolveCustomerId(lead);
        setUserPropertiesData({ customerName: lead.customerName, customerId: resolvedId });
        setShowUserPropertiesModal(true);
        break;
      }

      case 'view-history':
        setHistoryLead(lead);
        setShowHistoryModal(true);
        break;

      case 'edit-lead':
        handleEditLead(lead);
        break;

      case 'mark-contacted':
        setConfirmationModal({
          isOpen: true,
          title: 'Mark as Contacted',
          message: `Mark lead "${lead.leadId}" as contacted?`,
          confirmText: 'Mark Contacted',
          cancelText: 'Cancel',
          type: 'info',
          onConfirm: () => updateLeadStatus('Contacted', `Lead "${lead.leadId}" marked as contacted`)
        });
        break;

      case 'mark-interested':
        setConfirmationModal({
          isOpen: true,
          title: 'Mark as Interested',
          message: `Mark lead "${lead.leadId}" as interested?`,
          confirmText: 'Mark Interested',
          cancelText: 'Cancel',
          type: 'success',
          onConfirm: () => updateLeadStatus('Interested', `Lead "${lead.leadId}" marked as interested`)
        });
        break;

      case 'schedule-followup':
        setFollowUpLead(lead);
        setShowFollowUpModal(true);
        break;

      case 'schedule-site-visit':
        setSiteVisitLead(lead);
        setShowSiteVisitModal(true);
        break;

      case 'complete-site-visit':
        setConfirmationModal({
          isOpen: true,
          title: 'Complete Site Visit',
          message: `Mark site visit as completed for lead "${lead.leadId}"?`,
          confirmText: 'Complete',
          cancelText: 'Cancel',
          type: 'success',
          onConfirm: () => updateLeadStatus('Site Visit Completed', `Site visit completed for lead "${lead.leadId}"`)
        });
        break;

      case 'mark-negotiation':
        setConfirmationModal({
          isOpen: true,
          title: 'Move to Negotiation',
          message: `Move lead "${lead.leadId}" to negotiation stage?`,
          confirmText: 'Move to Negotiation',
          cancelText: 'Cancel',
          type: 'info',
          onConfirm: () => updateLeadStatus('Negotiation', `Lead "${lead.leadId}" moved to negotiation`)
        });
        break;

      case 'assign-lead':
        setAssignLead(lead);
        setShowAssignModal(true);
        break;

      case 'add-note':
        setNoteLead(lead);
        setShowAddNoteModal(true);
        break;

      case 'mark-lost':
        setConfirmationModal({
          isOpen: true,
          title: 'Mark as Lost',
          message: `Mark lead "${lead.leadId}" as lost?`,
          confirmText: 'Mark Lost',
          cancelText: 'Cancel',
          type: 'danger',
          onConfirm: () => updateLeadStatus('Lost', `Lead "${lead.leadId}" marked as lost`)
        });
        break;

      case 'mark-invalid':
        setConfirmationModal({
          isOpen: true,
          title: 'Mark as Invalid',
          message: `Mark lead "${lead.leadId}" as invalid?`,
          confirmText: 'Mark Invalid',
          cancelText: 'Cancel',
          type: 'warning',
          onConfirm: () => updateLeadStatus('Invalid Lead', `Lead "${lead.leadId}" marked as invalid`)
        });
        break;

      case 'mark-duplicate':
        setConfirmationModal({
          isOpen: true,
          title: 'Mark as Duplicate',
          message: `Mark lead "${lead.leadId}" as duplicate?`,
          confirmText: 'Mark Duplicate',
          cancelText: 'Cancel',
          type: 'warning',
          onConfirm: () => updateLeadStatus('Duplicate Lead', `Lead "${lead.leadId}" marked as duplicate`)
        });
        break;

      default:
        break;
    }
  }, [handleViewLead, handleEditLead, computeStats]);

  const handleStatusClick = useCallback((status) => {
    setActiveStatus(prev => (prev === status ? 'all' : status));
    if (searchInputRef.current) searchInputRef.current.focus();
  }, []);

  const handleTotalClick = useCallback(() => {
    setActiveStatus('all');
    setActivePriority('all');
    setActiveLeadType('all');
    setActiveLeadSource('all');
    setActivePropertyType('all');
    setActivePurpose('all');
    setSearchQuery('');
    setDateRange('all'); // ⭐ Reset date
    setCustomStartDate('');
    setCustomEndDate('');
    if (searchInputRef.current) searchInputRef.current.focus();
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setActiveStatus('all');
    setActivePriority('all');
    setActiveLeadType('all');
    setActiveLeadSource('all');
    setActivePropertyType('all');
    setActivePurpose('all');
    setDateRange('all'); // ⭐ Reset date
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
        'Lead Date': l.leadDate ? new Date(l.leadDate).toLocaleDateString('en-IN') : '',
        'Customer Name': l.customerName || '',
        'Mobile Number': l.mobileNumber || '',
        'Property Name': l.propertyName || '',
        'Property Type': l.propertyType || '',
        'Location': l.location || '',
        'Assigned To': l.assignedTo || 'Unassigned',
        'Lead Status': l.leadStatus || '',
        'Priority': l.priority || '',
        'Next Follow-Up': l.nextFollowUp ? new Date(l.nextFollowUp).toLocaleString('en-IN') : '',
        'Site Visit Date': l.siteVisitDate ? new Date(l.siteVisitDate).toLocaleString('en-IN') : '',
        'Lead Type': l.leadType || '',
        'Lead Source': l.leadSource || '',
        'Purpose': l.purpose || '',
        'Description': l.description || ''
      }));

      const csv = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).map(v => `"${v}"`).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
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
          computeStats(updated);
          setSelectedLeads([]);
          setActionLoading(null);
          setToast({ message: `${count} lead(s) deleted`, type: 'warning' });
        }, 800);
      },
      onCancel: () => setConfirmationModal(prev => ({ ...prev, isOpen: false }))
    });
  }, [selectedLeads, leads, computeStats]);

  const statusOptions = ALL_LEAD_STATUSES.map(status => ({ value: status, label: LEAD_STATUS_TYPES[status].label }));
  const priorityOptions = ALL_LEAD_PRIORITIES.map(priority => ({ value: priority, label: priority }));
  const leadTypeOptions = ALL_LEAD_TYPES.map(type => ({ value: type, label: type }));
  const leadSourceOptions = ALL_LEAD_SOURCES.map(source => ({ value: source, label: source }));
  const propertyTypeOptions = ALL_PROPERTY_TYPES.map(type => ({ value: type, label: type }));
  const purposeOptions = ALL_PURPOSES.map(purpose => ({ value: purpose, label: purpose }));

  const LIST_COLUMNS = [
    { key: 'leadId', label: 'Lead ID', sortable: true },
    { key: 'leadDate', label: 'Lead Date', sortable: true },
    { key: 'customerName', label: 'Customer Name', sortable: true },
    { key: 'mobileNumber', label: 'Mobile', sortable: false },
    { key: 'propertyName', label: 'Property', sortable: true },
    { key: 'propertyType', label: 'Prop Type', sortable: true },
    { key: 'location', label: 'Location', sortable: true },
    { key: 'assignedTo', label: 'Assigned To', sortable: true },
    { key: 'leadStatus', label: 'Status', sortable: true },
    { key: 'priority', label: 'Priority', sortable: true },
    { key: 'nextFollowUp', label: 'Next Follow-Up', sortable: true },
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

      <LeadActionsModal
        lead={actionsModal.lead}
        show={actionsModal.show}
        onClose={() => setActionsModal({ show: false, lead: null })}
        onAction={handleLeadAction}
      />

      <AddNoteModal
        lead={noteLead}
        show={showAddNoteModal}
        onClose={() => { setShowAddNoteModal(false); setNoteLead(null); }}
        onSave={handleAddNote}
      />

      <ScheduleFollowUpModal
        lead={followUpLead}
        show={showFollowUpModal}
        onClose={() => { setShowFollowUpModal(false); setFollowUpLead(null); }}
        onSave={handleScheduleFollowUp}
      />

      <ScheduleSiteVisitModal
        lead={siteVisitLead}
        show={showSiteVisitModal}
        onClose={() => { setShowSiteVisitModal(false); setSiteVisitLead(null); }}
        onSave={handleScheduleSiteVisit}
      />

      <AssignLeadModal
        lead={assignLead}
        show={showAssignModal}
        onClose={() => { setShowAssignModal(false); setAssignLead(null); }}
        onAssign={handleAssignAgent}
      />

      <ViewCustomerModal
        lead={customerLead}
        show={showViewCustomerModal}
        onClose={() => { setShowViewCustomerModal(false); setCustomerLead(null); }}
        onNavigateToProfile={handleNavigateToProfile}
      />

      <UserPropertiesModal
        customerName={userPropertiesData.customerName}
        customerId={userPropertiesData.customerId}
        show={showUserPropertiesModal}
        onClose={() => { setShowUserPropertiesModal(false); setUserPropertiesData({ customerName: '', customerId: '' }); }}
        allLeads={leads}
        onNavigateToProperty={handleNavigateToProperty}
      />

      <LeadHistoryModal
        lead={historyLead}
        show={showHistoryModal}
        onClose={() => { setShowHistoryModal(false); setHistoryLead(null); }}
        allLeads={leads}
      />

      {showViewModal && viewingLead && (
        <ViewLeadDetailModal
          lead={viewingLead}
          show={showViewModal}
          onClose={() => { setShowViewModal(false); setViewingLead(null); }}
          onEdit={handleEditLead}
          onDelete={handleDeleteLead}
          onAction={handleLeadAction}
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
                Lead Dashboard & List
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
              <span>Track and manage all leads across properties, sources, and agents</span>
              <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
              <span className="text-[#00695C] font-medium flex items-center gap-1">
                <FiCalendar className="text-xs" />
                {getDateRangeLabel(dateRange, customStartDate, customEndDate)}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2 w-full lg:w-auto flex-wrap">
            {/* ⭐ DATE RANGE PICKER */}
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
              onClick={() => setShowStats(!showStats)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8F0EE] rounded-xl hover:border-[#00695C]/30 hover:shadow-md transition-all duration-300 text-sm font-medium text-[#1A2E2A] hover:scale-105"
            >
              {showStats ? <FiChevronUp className="text-sm" /> : <FiChevronDown className="text-sm" />}
              <span className="hidden sm:inline">{showStats ? 'Hide Stats' : 'Show Stats'}</span>
            </button>
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

      {/* Stats */}
      {showStats && (
        <div className="relative animate-slide-in">
          <div className="bg-white rounded-2xl p-4 border border-[#E8F0EE] shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              <StatCard icon={<FiUsers className="text-white text-sm" />} title="Total Leads" value={stats.total} color="bg-gradient-to-br from-[#00695C] to-[#26A69A]" delay={0} isActive={filterCount === 0} onClick={handleTotalClick} />
              <StatCard icon={<FiStar className="text-white text-sm" />} title="New Leads" value={stats.New} color="bg-gradient-to-br from-blue-600 to-blue-400" delay={40} isActive={activeStatus === 'New'} onClick={() => handleStatusClick('New')} />
              <StatCard icon={<FiPhone className="text-white text-sm" />} title="Contacted" value={stats.Contacted} color="bg-gradient-to-br from-cyan-600 to-cyan-400" delay={80} isActive={activeStatus === 'Contacted'} onClick={() => handleStatusClick('Contacted')} />
              <StatCard icon={<FiThumbsUp className="text-white text-sm" />} title="Interested" value={stats.Interested} color="bg-gradient-to-br from-emerald-600 to-emerald-400" delay={120} isActive={activeStatus === 'Interested'} onClick={() => handleStatusClick('Interested')} />
              <StatCard icon={<FiRefreshCw className="text-white text-sm" />} title="Follow-Up" value={stats['Follow-Up']} color="bg-gradient-to-br from-amber-600 to-amber-400" delay={160} isActive={activeStatus === 'Follow-Up'} onClick={() => handleStatusClick('Follow-Up')} />
              <StatCard icon={<FiCalendar className="text-white text-sm" />} title="Site Visit Scheduled" value={stats['Site Visit Scheduled']} color="bg-gradient-to-br from-purple-600 to-purple-400" delay={200} isActive={activeStatus === 'Site Visit Scheduled'} onClick={() => handleStatusClick('Site Visit Scheduled')} />
              <StatCard icon={<FiCheckCircle className="text-white text-sm" />} title="Site Visit Completed" value={stats['Site Visit Completed']} color="bg-gradient-to-br from-indigo-600 to-indigo-400" delay={240} isActive={activeStatus === 'Site Visit Completed'} onClick={() => handleStatusClick('Site Visit Completed')} />
              <StatCard icon={<FiDollarSign className="text-white text-sm" />} title="Negotiation" value={stats.Negotiation} color="bg-gradient-to-br from-orange-600 to-orange-400" delay={280} isActive={activeStatus === 'Negotiation'} onClick={() => handleStatusClick('Negotiation')} />
              <StatCard icon={<FiXCircle className="text-white text-sm" />} title="Lost Leads" value={stats.Lost} color="bg-gradient-to-br from-red-600 to-red-400" delay={320} isActive={activeStatus === 'Lost'} onClick={() => handleStatusClick('Lost')} />
              <StatCard icon={<FiSlash className="text-white text-sm" />} title="Invalid Lead" value={stats['Invalid Lead']} color="bg-gradient-to-br from-slate-600 to-slate-400" delay={360} isActive={activeStatus === 'Invalid Lead'} onClick={() => handleStatusClick('Invalid Lead')} />
              <StatCard icon={<FiCopy className="text-white text-sm" />} title="Duplicate Lead" value={stats['Duplicate Lead']} color="bg-gradient-to-br from-pink-600 to-pink-400" delay={400} isActive={activeStatus === 'Duplicate Lead'} onClick={() => handleStatusClick('Duplicate Lead')} />
              <StatCard icon={<FiUserX className="text-white text-sm" />} title="Unassigned" value={stats.unassigned} color="bg-gradient-to-br from-rose-600 to-rose-400" delay={440} isActive={false} onClick={() => {}} />
              <StatCard icon={<FiUserCheck className="text-white text-sm" />} title="Assigned" value={stats.assigned} color="bg-gradient-to-br from-teal-600 to-teal-400" delay={480} isActive={false} onClick={() => {}} />
              <StatCard icon={<FiClock className="text-white text-sm" />} title="Today's Leads" value={stats.todayLeads} color="bg-gradient-to-br from-lime-600 to-lime-400" delay={520} isActive={false} onClick={() => {}} />
              <StatCard icon={<FiCalendar className="text-white text-sm" />} title="This Month's Leads" value={stats.monthLeads} color="bg-gradient-to-br from-sky-600 to-sky-400" delay={560} isActive={false} onClick={() => {}} />
            </div>
          </div>
        </div>
      )}

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
                      <FiMap className="text-[#00695C] flex-shrink-0" />
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
                    {lead.siteVisitDate && (
                      <div className="flex items-center gap-2 text-xs text-purple-700 bg-purple-50 rounded-lg px-2 py-1">
                        <FiNavigation className="flex-shrink-0" />
                        <span className="font-medium truncate">
                          Visit: {new Date(lead.siteVisitDate).toLocaleString('en-IN', {
                            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                          })}
                        </span>
                      </div>
                    )}
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
                      onClick={() => setActionsModal({ show: true, lead })}
                      className="flex-1 py-1.5 text-xs font-semibold text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiActivity className="text-[10px]" /> Actions
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
                <col style={{ width: '8%' }} />
                <col style={{ width: '8%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '9%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '7%' }} />
                <col style={{ width: '8%' }} />
                <col style={{ width: '7%' }} />
                <col style={{ width: '8%' }} />
                <col style={{ width: '8%' }} />
                <col style={{ width: '6%' }} />
                <col style={{ width: '8%' }} />
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
                  const propTypeConfig = PROPERTY_TYPE_CONFIG[lead.propertyType] || PROPERTY_TYPE_CONFIG['Individual'];

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
                        {new Date(lead.leadDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                      </td>
                      <td className="px-2 py-2.5 text-sm font-bold text-[#1A2E2A] truncate" title={lead.customerName}>{lead.customerName}</td>
                      <td className="px-2 py-2.5 text-xs font-medium text-[#5A7D78] truncate">{lead.mobileNumber}</td>
                      <td className="px-2 py-2.5 text-xs font-medium text-[#5A7D78] truncate" title={lead.propertyName}>{lead.propertyName}</td>
                      <td className="px-2 py-2.5 overflow-hidden">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold whitespace-nowrap ${propTypeConfig.bg} ${propTypeConfig.text} border ${propTypeConfig.border}`}>
                          {lead.propertyType}
                        </span>
                      </td>
                      <td className="px-2 py-2.5 text-xs font-medium text-[#5A7D78] truncate" title={lead.location}>{lead.location}</td>
                      <td className="px-2 py-2.5 text-xs font-medium text-[#5A7D78] truncate">{lead.assignedTo || 'Unassigned'}</td>
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
                          <button type="button" onClick={() => setActionsModal({ show: true, lead })} className="w-7 h-7 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 flex items-center justify-center text-[#00695C] hover:scale-110" title="Actions">
                            <FiActivity className="text-sm" />
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

export default LeadDashboardAndList;