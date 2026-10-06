// src/components/admin/LeadManagement/FollowUpManagement.jsx

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
  FiNavigation, FiCheckSquare, FiCopy, FiSlash, FiEdit2, FiMessageCircle,
  FiVideo, FiHeadphones
} from 'react-icons/fi';
import { FaHome, FaHotel, FaHardHat, FaWhatsapp } from 'react-icons/fa';

// ============================================================
// FOLLOW-UP TYPE CONFIG
// ============================================================
const FOLLOWUP_TYPE_CONFIG = {
  'Call': { icon: FiPhone, color: 'from-blue-600 to-blue-400', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', label: 'Call' },
  'WhatsApp': { icon: FiMessageCircle, color: 'from-emerald-600 to-emerald-400', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'WhatsApp' },
  'SMS': { icon: FiMessageSquare, color: 'from-cyan-600 to-cyan-400', bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', label: 'SMS' },
  'Email': { icon: FiMail, color: 'from-purple-600 to-purple-400', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', label: 'Email' },
  'Meeting': { icon: FiUsers, color: 'from-amber-600 to-amber-400', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Meeting' },
  'Site Visit': { icon: FiNavigation, color: 'from-indigo-600 to-indigo-400', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', label: 'Site Visit' }
};

const ALL_FOLLOWUP_TYPES = Object.keys(FOLLOWUP_TYPE_CONFIG);

// ============================================================
// FOLLOW-UP STATUS CONFIG
// ============================================================
const FOLLOWUP_STATUS_CONFIG = {
  'Pending': { icon: FiClock, color: 'from-amber-600 to-amber-400', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Pending' },
  'Completed': { icon: FiCheckCircle, color: 'from-emerald-600 to-emerald-400', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Completed' },
  'Rescheduled': { icon: FiRotateCcw, color: 'from-blue-600 to-blue-400', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', label: 'Rescheduled' },
  'Cancelled': { icon: FiXCircle, color: 'from-red-600 to-red-400', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'Cancelled' }
};

const ALL_FOLLOWUP_STATUSES = Object.keys(FOLLOWUP_STATUS_CONFIG);

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
// PRIORITY CONFIG
// ============================================================
const LEAD_PRIORITY_TYPES = {
  'High': { icon: FiFlag, color: 'from-red-600 to-red-400', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'High' },
  'Medium': { icon: FiFlag, color: 'from-amber-600 to-amber-400', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Medium' },
  'Low': { icon: FiFlag, color: 'from-emerald-600 to-emerald-400', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Low' }
};

const ALL_LEAD_PRIORITIES = Object.keys(LEAD_PRIORITY_TYPES);

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
                <label className="block text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Start Date</label>
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => onCustomChange(e.target.value, customEnd)}
                  className="w-full px-3 py-2 bg-white rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">End Date</label>
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
// COMPLETE FOLLOW-UP MODAL
// ============================================================
const CompleteFollowUpModal = ({ followUp, show, onClose, onSave }) => {
  const [notes, setNotes] = useState('');
  const [outcome, setOutcome] = useState('Positive');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setNotes('');
      setOutcome('Positive');
    }
  }, [show]);

  if (!followUp || !show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onSave(followUp.id, { status: 'Completed', notes: notes.trim(), outcome });
      setLoading(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl animate-slide-up border border-[#E8F0EE] overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white">
              <FiCheckCircle className="text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Complete Follow-Up</h2>
              <p className="text-white/80 text-sm">{followUp.leadId} • {followUp.customerName}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-[#F5F9F8] rounded-2xl p-4">
            <label className="block text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-2">Outcome</label>
            <div className="grid grid-cols-3 gap-2">
              {['Positive', 'Neutral', 'Negative'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setOutcome(opt)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    outcome === opt
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                      : 'bg-white text-[#1A2E2A] border border-[#E8F0EE] hover:border-emerald-300'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#F5F9F8] rounded-2xl p-4">
            <label className="block text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="3"
              placeholder="Add completion notes..."
              className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none resize-none"
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
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all duration-300 text-sm font-medium shadow-lg shadow-emerald-600/30 hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <FiRefreshCw className="animate-spin" /> : <FiCheckCircle />}
              {loading ? 'Completing...' : 'Complete Follow-Up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================
// RESCHEDULE FOLLOW-UP MODAL
// ============================================================
const RescheduleFollowUpModal = ({ followUp, show, onClose, onSave }) => {
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('10:00');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setNewDate(tomorrow.toISOString().split('T')[0]);
      setNewTime('10:00');
      setReason('');
    }
  }, [show]);

  if (!followUp || !show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newDate) return;
    setLoading(true);
    setTimeout(() => {
      const isoDateTime = new Date(`${newDate}T${newTime}:00`).toISOString();
      onSave(followUp.id, { followUpDate: isoDateTime, status: 'Rescheduled', reason: reason.trim() });
      setLoading(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl animate-slide-up border border-[#E8F0EE] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white">
              <FiRotateCcw className="text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Reschedule Follow-Up</h2>
              <p className="text-white/80 text-sm">{followUp.leadId} • {followUp.customerName}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-[#F5F9F8] rounded-2xl p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">New Date *</label>
                <input
                  type="date"
                  value={newDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setNewDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">New Time *</label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#F5F9F8] rounded-2xl p-4">
            <label className="block text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Reason (Optional)</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows="3"
              placeholder="Reason for rescheduling..."
              className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none resize-none"
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
              disabled={!newDate || loading}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 text-sm font-medium shadow-lg shadow-blue-600/30 hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <FiRefreshCw className="animate-spin" /> : <FiRotateCcw />}
              {loading ? 'Rescheduling...' : 'Reschedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================
// ADD NOTE MODAL
// ============================================================
const AddNoteModal = ({ followUp, show, onClose, onSave }) => {
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) setNote('');
  }, [show]);

  if (!followUp || !show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!note.trim()) return;
    setLoading(true);
    setTimeout(() => {
      onSave(followUp.id, note.trim());
      setLoading(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl animate-slide-up border border-[#E8F0EE] overflow-hidden">
        <div className="bg-gradient-to-r from-teal-600 to-teal-400 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white">
              <FiClipboard className="text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Add Note</h2>
              <p className="text-white/80 text-sm">{followUp.leadId} • {followUp.customerName}</p>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows="4"
            placeholder="Enter your note..."
            className="w-full px-4 py-3 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none resize-none"
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
              className="flex-1 px-4 py-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all duration-300 text-sm font-medium shadow-lg shadow-teal-600/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
// CONTACT ACTION MODAL (Call / WhatsApp / Email)
// ============================================================
const ContactActionModal = ({ followUp, show, actionType, onClose }) => {
  if (!followUp || !show || !actionType) return null;

  const actionConfig = {
    call: {
      title: 'Make a Call',
      icon: FiPhone,
      gradient: 'from-cyan-600 to-cyan-400',
      buttonColor: 'bg-gradient-to-r from-cyan-600 to-cyan-400 hover:from-cyan-700 hover:to-cyan-500 shadow-cyan-50',
      bg: 'bg-cyan-50',
      text: 'text-cyan-700',
      border: 'border-cyan-200',
      message: 'You are about to initiate a phone call.',
      detailLabel: 'Phone Number',
      detailValue: followUp.mobileNumber,
      warningText: 'Your device will open the dialer app to place the call.',
      confirmLabel: 'Call Now',
    },
    whatsapp: {
      title: 'Open WhatsApp',
      icon: FiMessageCircle,
      gradient: 'from-emerald-600 to-emerald-400',
      buttonColor: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      message: 'You are about to open WhatsApp chat.',
      detailLabel: 'WhatsApp Number',
      detailValue: followUp.mobileNumber,
      warningText: 'WhatsApp Web or App will open in a new tab/window.',
      confirmLabel: 'Open WhatsApp',
    },
    email: {
      title: 'Send Email',
      icon: FiMail,
      gradient: 'from-purple-600 to-purple-400',
      buttonColor: 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/30',
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
      message: 'You are about to compose an email.',
      detailLabel: 'Email Address',
      detailValue: followUp.customerEmail || `${String(followUp.customerName || '').toLowerCase().replace(/\s+/g, '.')}@example.com`,
      warningText: 'Your default email client will open with a pre-filled draft.',
      confirmLabel: 'Compose Email',
    },
  };

  const config = actionConfig[actionType];
  if (!config) return null;

  const Icon = config.icon;

  const handleProceed = () => {
    try {
      if (actionType === 'call') {
        const cleanedNumber = String(followUp.mobileNumber || '').replace(/\D/g, '');
        window.location.href = `tel:${cleanedNumber}`;
      } else if (actionType === 'whatsapp') {
        const cleanedNumber = String(followUp.mobileNumber || '').replace(/\D/g, '');
        const message = encodeURIComponent(
          `Hello ${followUp.customerName}, regarding your enquiry for ${followUp.propertyName} at ${followUp.location}...`
        );
        window.open(`https://wa.me/${cleanedNumber}?text=${message}`, '_blank');
      } else if (actionType === 'email') {
        const emailAddr = followUp.customerEmail || `${String(followUp.customerName || '').toLowerCase().replace(/\s+/g, '.')}@example.com`;
        const subject = encodeURIComponent(`Regarding your enquiry - ${followUp.propertyName}`);
        const body = encodeURIComponent(
          `Dear ${followUp.customerName},\n\nThank you for your interest in ${followUp.propertyName} located at ${followUp.location}.\n\nBest regards,\n${followUp.assignedTo || 'Team'}`
        );
        window.location.href = `mailto:${emailAddr}?subject=${subject}&body=${body}`;
      }
    } catch (err) {
      console.error('Action failed:', err);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl animate-slide-up border border-[#E8F0EE] overflow-hidden">
        <div className={`bg-gradient-to-r ${config.gradient} p-6 relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white">
              <Icon className="text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{config.title}</h2>
              <p className="text-white/80 text-sm">{followUp.leadId} • {followUp.customerName}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-[#5A7D78] leading-relaxed">{config.message}</p>

          <div className={`${config.bg} border ${config.border} rounded-2xl p-4 flex items-center gap-3`}>
            <div className={`w-10 h-10 rounded-xl ${config.bg} border ${config.border} flex items-center justify-center ${config.text}`}>
              <Icon className="text-lg" />
            </div>
            <div className="min-w-0">
              <p className={`text-[10px] font-semibold uppercase tracking-wider ${config.text}`}>
                {config.detailLabel}
              </p>
              <p className="text-sm font-bold text-[#1A2E2A] truncate">{config.detailValue}</p>
            </div>
          </div>

          <div className="flex items-start gap-2 bg-[#F5F9F8] rounded-xl p-3 border border-[#E8F0EE]">
            <FiInfo className="text-[#00695C] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[#5A7D78]">{config.warningText}</p>
          </div>
        </div>

        <div className="px-6 py-4 bg-[#F8FAF9] border-t border-[#E8F0EE] flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-white text-[#1A2E2A] rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 text-sm font-medium border border-[#E8F0EE] hover:scale-[1.02]"
          >
            Cancel
          </button>
          <button
            onClick={handleProceed}
            className={`flex-1 px-4 py-2.5 text-white rounded-xl transition-all duration-300 text-sm font-medium shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2 ${config.buttonColor}`}
          >
            <Icon className="text-sm" />
            {config.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// EDIT FOLLOW-UP MODAL
// ============================================================
const EditFollowUpModal = ({ followUp, show, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    followUpDate: '',
    followUpTime: '',
    followUpType: '',
    followUpStatus: '',
    priority: '',
    assignedTo: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (followUp) {
      const dateObj = new Date(followUp.followUpDate);
      setFormData({
        followUpDate: dateObj.toISOString().split('T')[0],
        followUpTime: dateObj.toTimeString().slice(0, 5),
        followUpType: followUp.followUpType || 'Call',
        followUpStatus: followUp.followUpStatus || 'Pending',
        priority: followUp.priority || 'Medium',
        assignedTo: followUp.assignedTo || '',
        notes: followUp.notes || ''
      });
    }
  }, [followUp]);

  if (!followUp || !show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const isoDateTime = new Date(`${formData.followUpDate}T${formData.followUpTime}:00`).toISOString();
      onSave({ ...followUp, ...formData, followUpDate: isoDateTime });
      setLoading(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 rounded-t-3xl z-10 shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
          <h2 className="text-2xl font-bold text-white">Edit Follow-Up</h2>
          <p className="text-white/80 text-sm">Update follow-up information</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiCalendar className="text-[#00695C]" />
                Follow-Up Schedule
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Follow-Up Date *</label>
                  <input
                    type="date"
                    name="followUpDate"
                    value={formData.followUpDate}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Follow-Up Time *</label>
                  <input
                    type="time"
                    name="followUpTime"
                    value={formData.followUpTime}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiTag className="text-[#00695C]" />
                Follow-Up Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Follow-Up Type *</label>
                  <select
                    name="followUpType"
                    value={formData.followUpType}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  >
                    {ALL_FOLLOWUP_TYPES.map(type => (
                      <option key={type} value={type}>{FOLLOWUP_TYPE_CONFIG[type].label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Status *</label>
                  <select
                    name="followUpStatus"
                    value={formData.followUpStatus}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  >
                    {ALL_FOLLOWUP_STATUSES.map(status => (
                      <option key={status} value={status}>{FOLLOWUP_STATUS_CONFIG[status].label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Priority *</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  >
                    {ALL_LEAD_PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Assigned To</label>
                  <input
                    type="text"
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="2"
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
              {loading ? <FiRefreshCw className="animate-spin" /> : <FiSave />}
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// VIEW FOLLOW-UP DETAIL MODAL
// ============================================================
const ViewFollowUpDetailModal = ({ followUp, show, onClose, onEdit, onDelete, onAction }) => {
  if (!followUp || !show) return null;

  const typeConfig = FOLLOWUP_TYPE_CONFIG[followUp.followUpType] || FOLLOWUP_TYPE_CONFIG['Call'];
  const TypeIcon = typeConfig.icon;
  const statusConfig = FOLLOWUP_STATUS_CONFIG[followUp.followUpStatus] || FOLLOWUP_STATUS_CONFIG['Pending'];
  const StatusIcon = statusConfig.icon;
  const priorityConfig = LEAD_PRIORITY_TYPES[followUp.priority] || LEAD_PRIORITY_TYPES['Medium'];
  const PriorityIcon = priorityConfig.icon;
  const propTypeConfig = PROPERTY_TYPE_CONFIG[followUp.propertyType] || PROPERTY_TYPE_CONFIG['Individual'];
  const PropTypeIcon = propTypeConfig.icon;

  const getAvailableActions = () => {
    const actions = [];
    if (followUp.followUpStatus === 'Pending') {
      actions.push({ id: 'complete', label: 'Complete', icon: FiCheckCircle, color: 'text-emerald-700', bg: 'bg-emerald-50', hoverBg: 'hover:bg-emerald-100', border: 'border-emerald-200' });
      actions.push({ id: 'reschedule', label: 'Reschedule', icon: FiRotateCcw, color: 'text-blue-700', bg: 'bg-blue-50', hoverBg: 'hover:bg-blue-100', border: 'border-blue-200' });
      actions.push({ id: 'cancel', label: 'Cancel', icon: FiXCircle, color: 'text-red-700', bg: 'bg-red-50', hoverBg: 'hover:bg-red-100', border: 'border-red-200' });
    }
    actions.push({ id: 'add-note', label: 'Add Note', icon: FiPlus, color: 'text-teal-700', bg: 'bg-teal-50', hoverBg: 'hover:bg-teal-100', border: 'border-teal-200' });
    actions.push({ id: 'call', label: 'Call', icon: FiPhone, color: 'text-cyan-700', bg: 'bg-cyan-50', hoverBg: 'hover:bg-cyan-100', border: 'border-cyan-200' });
    actions.push({ id: 'whatsapp', label: 'WhatsApp', icon: FiMessageCircle, color: 'text-emerald-700', bg: 'bg-emerald-50', hoverBg: 'hover:bg-emerald-100', border: 'border-emerald-200' });
    actions.push({ id: 'email', label: 'Email', icon: FiMail, color: 'text-purple-700', bg: 'bg-purple-50', hoverBg: 'hover:bg-purple-100', border: 'border-purple-200' });
    return actions;
  };

  const availableActions = getAvailableActions();

  const handleActionClick = (actionId) => {
    if (onAction) {
      onAction(actionId, followUp);
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
              <h2 className="text-2xl font-bold text-white">{followUp.customerName}</h2>
              <p className="text-white/80 text-sm flex items-center gap-2 flex-wrap">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                  {statusConfig.label}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityConfig.bg} ${priorityConfig.text} border ${priorityConfig.border}`}>
                  <PriorityIcon className="inline text-xs mr-1" />{priorityConfig.label}
                </span>
                <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                <span>Lead ID: {followUp.leadId}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-white/20 text-white border border-white/30">
              <TypeIcon className="text-xs" /> {followUp.followUpType}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-white/20 text-white border border-white/30">
              <FiCalendar className="text-xs" /> {new Date(followUp.followUpDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiHash className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Lead ID</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{followUp.leadId}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiUser className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Customer Name</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{followUp.customerName}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiPhone className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Mobile Number</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{followUp.mobileNumber}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <PropTypeIcon className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Property</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{followUp.propertyName}</p>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${propTypeConfig.bg} ${propTypeConfig.text} border ${propTypeConfig.border} inline-block mt-1`}>
                {followUp.propertyType}
              </span>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiMap className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Location</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{followUp.location}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiUserCheck className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Assigned To</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{followUp.assignedTo || 'Unassigned'}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiCalendar className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Follow-Up Date</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">
                {new Date(followUp.followUpDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiClock className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Follow-Up Time</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">
                {new Date(followUp.followUpDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <TypeIcon className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Follow-Up Type</h4>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${typeConfig.bg} ${typeConfig.text} border ${typeConfig.border}`}>
                {typeConfig.label}
              </span>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <StatusIcon className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Follow-Up Status</h4>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                {statusConfig.label}
              </span>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiCalendar className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Next Follow-Up</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">
                {followUp.nextFollowUp
                  ? new Date(followUp.nextFollowUp).toLocaleString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })
                  : 'Not scheduled'}
              </p>
            </div>

            {followUp.notes && (
              <div className="bg-[#F5F9F8] rounded-2xl p-4 md:col-span-2">
                <div className="flex items-center gap-2 mb-1">
                  <FiClipboard className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Notes</h4>
                </div>
                <p className="text-sm text-[#1A2E2A] whitespace-pre-line">{followUp.notes}</p>
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
              onClick={() => { if (onEdit) { onEdit(followUp); onClose(); } }}
              className="flex-1 px-4 py-2.5 bg-[#26A69A] text-white rounded-xl hover:bg-[#1A8A7A] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#26A69A]/30 hover:scale-[1.02] min-w-[100px]"
            >
              <FiEdit className="inline mr-2" /> Edit
            </button>
            <button
              onClick={() => { if (onDelete) { onDelete(followUp.id); } }}
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
const FollowUpManagement = () => {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  // STATE
  const [followUps, setFollowUps] = useState([]);
  const [filteredFollowUps, setFilteredFollowUps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('followUpDate');
  const [sortDirection, setSortDirection] = useState('asc');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedFollowUps, setSelectedFollowUps] = useState([]);
  const [viewingFollowUp, setViewingFollowUp] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingFollowUp, setEditingFollowUp] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [filterCount, setFilterCount] = useState(0);

  // ACTIVE FILTERS
  const [activeFollowUpType, setActiveFollowUpType] = useState('all');
  const [activeFollowUpStatus, setActiveFollowUpStatus] = useState('all');
  const [activePriority, setActivePriority] = useState('all');
  const [activeLeadStatus, setActiveLeadStatus] = useState('all');
  const [showStats, setShowStats] = useState(true);

  // DATE RANGE STATE
  const [dateRange, setDateRange] = useState('this_month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // MODAL STATES
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completeFollowUp, setCompleteFollowUp] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleFollowUp, setRescheduleFollowUp] = useState(null);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [noteFollowUp, setNoteFollowUp] = useState(null);
  const [contactActionModal, setContactActionModal] = useState({ show: false, followUp: null, actionType: null });

  // CONFIRMATION
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false, title: '', message: '', confirmText: 'Confirm', cancelText: 'Cancel', type: 'danger', onConfirm: null, onCancel: null
  });

  // STATS
  const [stats, setStats] = useState({
    total: 0, Pending: 0, Completed: 0, Rescheduled: 0, Cancelled: 0
  });

  const computeStats = useCallback((list) => {
    if (!list || list.length === 0) {
      setStats({
        total: 0, Pending: 0, Completed: 0, Rescheduled: 0, Cancelled: 0
      });
      return;
    }

    const counts = { total: list.length };
    ALL_FOLLOWUP_STATUSES.forEach(status => {
      counts[status] = list.filter(f => f.followUpStatus === status).length;
    });

    setStats(counts);
  }, []);

  // GENERATE MOCK DATA
  const generateMockFollowUps = useCallback(() => {
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
    const agents = ['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Reddy', 'Vikram Singh', 'Anjali Desai', '', ''];

    const list = [];
    const now = new Date();

    for (let i = 1; i <= 120; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const customerName = `${firstName} ${lastName}`;
      const followUpType = ALL_FOLLOWUP_TYPES[Math.floor(Math.random() * ALL_FOLLOWUP_TYPES.length)];
      const followUpStatus = ALL_FOLLOWUP_STATUSES[Math.floor(Math.random() * ALL_FOLLOWUP_STATUSES.length)];
      const priority = ALL_LEAD_PRIORITIES[Math.floor(Math.random() * ALL_LEAD_PRIORITIES.length)];
      const leadStatus = ALL_LEAD_STATUSES[Math.floor(Math.random() * ALL_LEAD_STATUSES.length)];
      const propertyType = ALL_PROPERTY_TYPES[Math.floor(Math.random() * ALL_PROPERTY_TYPES.length)];
      const assignedTo = agents[Math.floor(Math.random() * agents.length)];
      const propertyName = propertyNames[Math.floor(Math.random() * propertyNames.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];

      let followUpDate;
      const rand = Math.random();
      if (rand < 0.2) {
        followUpDate = new Date(now);
        followUpDate.setDate(followUpDate.getDate() - Math.floor(Math.random() * 7) - 1);
        followUpDate.setHours(10 + Math.floor(Math.random() * 6));
      } else if (rand < 0.4) {
        followUpDate = new Date(now);
        followUpDate.setHours(9 + Math.floor(Math.random() * 9));
      } else if (rand < 0.7) {
        followUpDate = new Date(now);
        followUpDate.setDate(followUpDate.getDate() + Math.floor(Math.random() * 14) + 1);
        followUpDate.setHours(10 + Math.floor(Math.random() * 6));
      } else {
        followUpDate = new Date(now);
        followUpDate.setDate(followUpDate.getDate() + Math.floor(Math.random() * 30) + 15);
        followUpDate.setHours(10 + Math.floor(Math.random() * 6));
      }

      let nextFollowUp = null;
      if (followUpStatus === 'Pending' || followUpStatus === 'Rescheduled') {
        nextFollowUp = new Date(now);
        nextFollowUp.setDate(nextFollowUp.getDate() + Math.floor(Math.random() * 14) + 1);
      }

      const mobileNum = `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`;

      list.push({
        id: `followup_${i}`,
        leadId: `LEAD-${String(Math.floor(Math.random() * 90000) + 10000).padStart(5, '0')}`,
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
        followUpDate: followUpDate.toISOString(),
        followUpType,
        followUpStatus,
        nextFollowUp: nextFollowUp ? nextFollowUp.toISOString() : null,
        notes: Math.random() > 0.5 ? 'Customer requested callback regarding property details.' : '',
        createdAt: new Date(now.getTime() - Math.random() * 86400000 * 30).toISOString()
      });
    }

    computeStats(list);
    return list;
  }, [computeStats]);

  // INIT
  useEffect(() => {
    try {
      const mockFollowUps = generateMockFollowUps();
      setFollowUps(mockFollowUps);
      setFilteredFollowUps(mockFollowUps);
    } catch (error) {
      console.error('Error generating mock follow-ups:', error);
    }
  }, [generateMockFollowUps]);

  // FILTER
  const filterFollowUps = useCallback(() => {
    try {
      let filtered = [...followUps];

      if (dateRange !== 'all') {
        const { start, end } = getDateRangeBounds(dateRange, customStartDate, customEndDate);
        if (start && end) {
          filtered = filtered.filter(f => {
            const d = new Date(f.followUpDate);
            return d >= start && d <= end;
          });
        }
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(f =>
          (f.leadId && f.leadId.toLowerCase().includes(query)) ||
          (f.customerName && f.customerName.toLowerCase().includes(query)) ||
          (f.mobileNumber && f.mobileNumber.toLowerCase().includes(query)) ||
          (f.propertyName && f.propertyName.toLowerCase().includes(query)) ||
          (f.location && f.location.toLowerCase().includes(query)) ||
          (f.assignedTo && f.assignedTo.toLowerCase().includes(query)) ||
          (f.followUpType && f.followUpType.toLowerCase().includes(query)) ||
          (f.followUpStatus && f.followUpStatus.toLowerCase().includes(query)) ||
          (f.propertyType && f.propertyType.toLowerCase().includes(query))
        );
      }

      if (activeFollowUpType !== 'all') filtered = filtered.filter(f => f.followUpType === activeFollowUpType);
      if (activeFollowUpStatus !== 'all') filtered = filtered.filter(f => f.followUpStatus === activeFollowUpStatus);
      if (activePriority !== 'all') filtered = filtered.filter(f => f.priority === activePriority);
      if (activeLeadStatus !== 'all') filtered = filtered.filter(f => f.leadStatus === activeLeadStatus);

      let count = 0;
      if (dateRange !== 'all') count++;
      if (activeFollowUpType !== 'all') count++;
      if (activeFollowUpStatus !== 'all') count++;
      if (activePriority !== 'all') count++;
      if (activeLeadStatus !== 'all') count++;
      if (searchQuery) count++;
      setFilterCount(count);

      filtered.sort((a, b) => {
        let aVal = a[sortField] || '';
        let bVal = b[sortField] || '';
        if (sortField === 'followUpDate' || sortField === 'nextFollowUp' || sortField === 'createdAt') {
          aVal = aVal ? new Date(aVal).getTime() : 0;
          bVal = bVal ? new Date(bVal).getTime() : 0;
        } else if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase(); bVal = bVal.toLowerCase();
        }
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });

      setFilteredFollowUps(filtered);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error filtering follow-ups:', error);
    }
  }, [followUps, searchQuery, activeFollowUpType, activeFollowUpStatus, activePriority, activeLeadStatus, sortField, sortDirection, dateRange, customStartDate, customEndDate]);

  useEffect(() => { filterFollowUps(); }, [filterFollowUps]);

  // PAGINATION
  const totalPages = Math.max(1, Math.ceil(filteredFollowUps.length / pageSize));
  const paginatedFollowUps = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredFollowUps.slice(start, start + pageSize);
  }, [filteredFollowUps, currentPage, pageSize]);

  const handleSort = useCallback((field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);

  const handleSelectAll = useCallback(() => {
    if (selectedFollowUps.length === paginatedFollowUps.length && paginatedFollowUps.length > 0) {
      setSelectedFollowUps([]);
    } else {
      setSelectedFollowUps(paginatedFollowUps.map(f => f.id));
    }
  }, [selectedFollowUps, paginatedFollowUps]);

  const handleSelectFollowUp = useCallback((followUpId) => {
    setSelectedFollowUps(prev => prev.includes(followUpId) ? prev.filter(id => id !== followUpId) : [...prev, followUpId]);
  }, []);

  const handleViewFollowUp = useCallback((followUp) => {
    setViewingFollowUp(followUp);
    setShowViewModal(true);
  }, []);

  const handleEditFollowUp = useCallback((followUp) => {
    setEditingFollowUp(followUp);
    setShowEditModal(true);
  }, []);

  const handleSaveFollowUp = useCallback((updatedFollowUp) => {
    setFollowUps(prev => {
      const updated = prev.map(f => f.id === updatedFollowUp.id ? updatedFollowUp : f);
      computeStats(updated);
      return updated;
    });
    setToast({ message: `Follow-up "${updatedFollowUp.leadId}" updated successfully`, type: 'success' });
  }, [computeStats]);

  const handleDeleteFollowUp = useCallback((followUpId) => {
    const followUp = followUps.find(f => f.id === followUpId);
    if (!followUp) return;

    setConfirmationModal({
      isOpen: true,
      title: 'Delete Follow-Up',
      message: `Are you sure you want to delete follow-up for "${followUp.leadId}" (${followUp.customerName})?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: () => {
        setActionLoading(followUpId);
        setTimeout(() => {
          setFollowUps(prev => {
            const updated = prev.filter(f => f.id !== followUpId);
            computeStats(updated);
            return updated;
          });
          setActionLoading(null);
          setShowViewModal(false);
          setToast({ message: `Deleted follow-up for "${followUp.leadId}"`, type: 'warning' });
        }, 700);
      },
      onCancel: () => setConfirmationModal(prev => ({ ...prev, isOpen: false }))
    });
  }, [followUps, computeStats]);

  const handleCompleteFollowUp = useCallback((followUpId, { notes, outcome }) => {
    setFollowUps(prev => {
      const updated = prev.map(f =>
        f.id === followUpId
          ? {
              ...f,
              followUpStatus: 'Completed',
              notes: notes || f.notes,
              completedAt: new Date().toISOString(),
              outcome
            }
          : f
      );
      computeStats(updated);
      return updated;
    });
    setToast({ message: `Follow-up completed successfully`, type: 'success' });
  }, [computeStats]);

  const handleRescheduleFollowUp = useCallback((followUpId, { followUpDate, reason }) => {
    setFollowUps(prev => {
      const updated = prev.map(f =>
        f.id === followUpId
          ? {
              ...f,
              followUpDate,
              followUpStatus: 'Rescheduled',
              notes: reason ? `${f.notes || ''}\nRescheduled: ${reason}`.trim() : f.notes,
              rescheduledAt: new Date().toISOString()
            }
          : f
      );
      computeStats(updated);
      return updated;
    });
    setToast({ message: `Follow-up rescheduled to ${new Date(followUpDate).toLocaleString('en-IN')}`, type: 'success' });
  }, [computeStats]);

  const handleAddNote = useCallback((followUpId, noteText) => {
    setFollowUps(prev => {
      const updated = prev.map(f =>
        f.id === followUpId
          ? {
              ...f,
              notes: f.notes ? `${f.notes}\n\n${noteText}` : noteText
            }
          : f
      );
      computeStats(updated);
      return updated;
    });
    setToast({ message: 'Note added successfully', type: 'success' });
  }, [computeStats]);

  const handleCancelFollowUp = useCallback((followUpId) => {
    setFollowUps(prev => {
      const updated = prev.map(f =>
        f.id === followUpId
          ? { ...f, followUpStatus: 'Cancelled', cancelledAt: new Date().toISOString() }
          : f
      );
      computeStats(updated);
      return updated;
    });
    setToast({ message: 'Follow-up cancelled', type: 'info' });
  }, [computeStats]);

  const handleFollowUpAction = useCallback((actionId, followUp) => {
    switch (actionId) {
      case 'view':
        handleViewFollowUp(followUp);
        break;
      case 'edit':
        handleEditFollowUp(followUp);
        break;
      case 'delete':
        handleDeleteFollowUp(followUp.id);
        break;
      case 'complete':
        setCompleteFollowUp(followUp);
        setShowCompleteModal(true);
        break;
      case 'reschedule':
        setRescheduleFollowUp(followUp);
        setShowRescheduleModal(true);
        break;
      case 'cancel':
        setConfirmationModal({
          isOpen: true,
          title: 'Cancel Follow-Up',
          message: `Cancel this follow-up for "${followUp.leadId}"?`,
          confirmText: 'Cancel Follow-Up',
          cancelText: 'Go Back',
          type: 'warning',
          onConfirm: () => handleCancelFollowUp(followUp.id)
        });
        break;
      case 'add-note':
        setNoteFollowUp(followUp);
        setShowAddNoteModal(true);
        break;
      case 'call':
        setContactActionModal({ show: true, followUp, actionType: 'call' });
        break;
      case 'whatsapp':
        setContactActionModal({ show: true, followUp, actionType: 'whatsapp' });
        break;
      case 'email':
        setContactActionModal({ show: true, followUp, actionType: 'email' });
        break;
      default:
        break;
    }
  }, [handleViewFollowUp, handleEditFollowUp, handleDeleteFollowUp, handleCancelFollowUp]);

  const handleStatusClick = useCallback((status) => {
    setActiveFollowUpStatus(prev => (prev === status ? 'all' : status));
    if (searchInputRef.current) searchInputRef.current.focus();
  }, []);

  const handleTotalClick = useCallback(() => {
    setActiveFollowUpType('all');
    setActiveFollowUpStatus('all');
    setActivePriority('all');
    setActiveLeadStatus('all');
    setSearchQuery('');
    setDateRange('all');
    setCustomStartDate('');
    setCustomEndDate('');
    if (searchInputRef.current) searchInputRef.current.focus();
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setActiveFollowUpType('all');
    setActiveFollowUpStatus('all');
    setActivePriority('all');
    setActiveLeadStatus('all');
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
        const mockFollowUps = generateMockFollowUps();
        setFollowUps(mockFollowUps);
        setFilteredFollowUps(mockFollowUps);
        setToast({ message: 'Data refreshed successfully', type: 'success' });
      } catch (error) {
        console.error('Error refreshing data:', error);
        setToast({ message: 'Error refreshing data', type: 'error' });
      }
      setLoading(false);
    }, 1000);
  }, [generateMockFollowUps]);

  const handleExport = useCallback(() => {
    if (filteredFollowUps.length === 0) {
      setToast({ message: 'No data to export', type: 'warning' });
      return;
    }
    try {
      const data = filteredFollowUps.map(f => ({
        'Lead ID': f.leadId || '',
        'Customer Name': f.customerName || '',
        'Mobile Number': f.mobileNumber || '',
        'Property Name': f.propertyName || '',
        'Property Type': f.propertyType || '',
        'Location': f.location || '',
        'Assigned To': f.assignedTo || 'Unassigned',
        'Lead Status': f.leadStatus || '',
        'Priority': f.priority || '',
        'Follow-Up Date': f.followUpDate ? new Date(f.followUpDate).toLocaleDateString('en-IN') : '',
        'Follow-Up Time': f.followUpDate ? new Date(f.followUpDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '',
        'Follow-Up Type': f.followUpType || '',
        'Follow-Up Status': f.followUpStatus || '',
        'Next Follow-Up': f.nextFollowUp ? new Date(f.nextFollowUp).toLocaleString('en-IN') : '',
        'Notes': f.notes || ''
      }));

      const csv = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).map(v => `"${v}"`).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `followups_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      setToast({ message: `${filteredFollowUps.length} follow-ups exported successfully`, type: 'success' });
    } catch (error) {
      console.error('Error exporting data:', error);
      setToast({ message: 'Error exporting data', type: 'error' });
    }
  }, [filteredFollowUps]);

  const handleBulkDelete = useCallback(() => {
    if (selectedFollowUps.length === 0) {
      setToast({ message: 'Please select follow-ups first', type: 'warning' });
      return;
    }
    setConfirmationModal({
      isOpen: true,
      title: 'Delete Selected Follow-Ups',
      message: `Are you sure you want to delete ${selectedFollowUps.length} selected follow-up(s)?`,
      confirmText: 'Delete All',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: () => {
        setActionLoading('bulk-delete');
        setTimeout(() => {
          const selectedIds = new Set(selectedFollowUps);
          const count = followUps.filter(f => selectedIds.has(f.id)).length;
          const updated = followUps.filter(f => !selectedIds.has(f.id));
          setFollowUps(updated);
          computeStats(updated);
          setSelectedFollowUps([]);
          setActionLoading(null);
          setToast({ message: `${count} follow-up(s) deleted`, type: 'warning' });
        }, 800);
      },
      onCancel: () => setConfirmationModal(prev => ({ ...prev, isOpen: false }))
    });
  }, [selectedFollowUps, followUps, computeStats]);

  const followUpTypeOptions = ALL_FOLLOWUP_TYPES.map(type => ({ value: type, label: FOLLOWUP_TYPE_CONFIG[type].label }));
  const followUpStatusOptions = ALL_FOLLOWUP_STATUSES.map(status => ({ value: status, label: FOLLOWUP_STATUS_CONFIG[status].label }));
  const priorityOptions = ALL_LEAD_PRIORITIES.map(priority => ({ value: priority, label: priority }));
  const leadStatusOptions = ALL_LEAD_STATUSES.map(status => ({ value: status, label: LEAD_STATUS_TYPES[status].label }));

  const LIST_COLUMNS = [
    { key: 'leadId', label: 'Lead ID', sortable: true },
    { key: 'customerName', label: 'Customer', sortable: true },
    { key: 'mobileNumber', label: 'Mobile', sortable: false },
    { key: 'propertyName', label: 'Property', sortable: true },
    { key: 'assignedTo', label: 'Assigned', sortable: true },
    { key: 'followUpDate', label: 'Follow-Up Date', sortable: true },
    { key: 'followUpType', label: 'Type', sortable: true },
    { key: 'followUpStatus', label: 'Status', sortable: true },
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

      <CompleteFollowUpModal
        followUp={completeFollowUp}
        show={showCompleteModal}
        onClose={() => { setShowCompleteModal(false); setCompleteFollowUp(null); }}
        onSave={handleCompleteFollowUp}
      />

      <RescheduleFollowUpModal
        followUp={rescheduleFollowUp}
        show={showRescheduleModal}
        onClose={() => { setShowRescheduleModal(false); setRescheduleFollowUp(null); }}
        onSave={handleRescheduleFollowUp}
      />

      <AddNoteModal
        followUp={noteFollowUp}
        show={showAddNoteModal}
        onClose={() => { setShowAddNoteModal(false); setNoteFollowUp(null); }}
        onSave={handleAddNote}
      />

      <ContactActionModal
        followUp={contactActionModal.followUp}
        show={contactActionModal.show}
        actionType={contactActionModal.actionType}
        onClose={() => setContactActionModal({ show: false, followUp: null, actionType: null })}
      />

      {showViewModal && viewingFollowUp && (
        <ViewFollowUpDetailModal
          followUp={viewingFollowUp}
          show={showViewModal}
          onClose={() => { setShowViewModal(false); setViewingFollowUp(null); }}
          onEdit={handleEditFollowUp}
          onDelete={handleDeleteFollowUp}
          onAction={handleFollowUpAction}
        />
      )}

      {showEditModal && editingFollowUp && (
        <EditFollowUpModal
          followUp={editingFollowUp}
          show={showEditModal}
          onClose={() => { setShowEditModal(false); setEditingFollowUp(null); }}
          onSave={handleSaveFollowUp}
        />
      )}

      {/* Header */}
      <div className="relative z-[30] animate-fade-in">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                Follow-Up Management
              </h1>
              <span className="px-3 py-1 bg-[#E8F4F2] text-[#00695C] text-xs font-semibold rounded-full animate-pulse">
                {filteredFollowUps.length} Follow-Ups
              </span>
              {filterCount > 0 && (
                <span className="px-3 py-1 bg-[#FEF3E2] text-amber-700 text-xs font-semibold rounded-full">
                  {filterCount} filters
                </span>
              )}
            </div>
            <p className="text-sm text-[#5A7D78] flex items-center gap-2 flex-wrap">
              <span>Track and manage all customer follow-ups across channels</span>
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
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              <StatCard icon={<FiUsers className="text-white text-sm" />} title="Total Follow-Ups" value={stats.total} color="bg-gradient-to-br from-[#00695C] to-[#26A69A]" delay={0} isActive={filterCount === 0} onClick={handleTotalClick} />
              <StatCard icon={<FiClock className="text-white text-sm" />} title="Pending" value={stats.Pending} color="bg-gradient-to-br from-amber-600 to-amber-400" delay={40} isActive={activeFollowUpStatus === 'Pending'} onClick={() => handleStatusClick('Pending')} />
              <StatCard icon={<FiCheckCircle className="text-white text-sm" />} title="Completed" value={stats.Completed} color="bg-gradient-to-br from-emerald-600 to-emerald-400" delay={80} isActive={activeFollowUpStatus === 'Completed'} onClick={() => handleStatusClick('Completed')} />
              <StatCard icon={<FiRotateCcw className="text-white text-sm" />} title="Rescheduled" value={stats.Rescheduled} color="bg-gradient-to-br from-blue-600 to-blue-400" delay={120} isActive={activeFollowUpStatus === 'Rescheduled'} onClick={() => handleStatusClick('Rescheduled')} />
              <StatCard icon={<FiXCircle className="text-white text-sm" />} title="Cancelled" value={stats.Cancelled} color="bg-gradient-to-br from-red-600 to-red-400" delay={160} isActive={activeFollowUpStatus === 'Cancelled'} onClick={() => handleStatusClick('Cancelled')} />
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
              placeholder="Search by lead ID, customer name, mobile, property, assigned agent..."
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
            <FilterDropdown label="Type" options={followUpTypeOptions} value={activeFollowUpType} onChange={setActiveFollowUpType} icon={FiTag} allLabel="All Types" />
            <FilterDropdown label="Status" options={followUpStatusOptions} value={activeFollowUpStatus} onChange={setActiveFollowUpStatus} icon={FiActivity} allLabel="All Statuses" />
            <FilterDropdown label="Priority" options={priorityOptions} value={activePriority} onChange={setActivePriority} icon={FiFlag} allLabel="All Priorities" />
            <FilterDropdown label="Lead Status" options={leadStatusOptions} value={activeLeadStatus} onChange={setActiveLeadStatus} icon={FiStar} allLabel="All Lead Statuses" />

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

        {selectedFollowUps.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#E8F0EE] flex flex-wrap items-center justify-between gap-3 animate-slide-in">
            <span className="text-sm text-[#5A7D78]">
              <span className="font-semibold text-[#00695C]">{selectedFollowUps.length}</span> follow-up(s) selected
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
                onClick={() => setSelectedFollowUps([])}
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
            {paginatedFollowUps.map((followUp, index) => {
              const isSelected = selectedFollowUps.includes(followUp.id);
              const typeConfig = FOLLOWUP_TYPE_CONFIG[followUp.followUpType] || FOLLOWUP_TYPE_CONFIG['Call'];
              const TypeIcon = typeConfig.icon;
              const statusConfig = FOLLOWUP_STATUS_CONFIG[followUp.followUpStatus] || FOLLOWUP_STATUS_CONFIG['Pending'];
              const StatusIcon = statusConfig.icon;
              const priorityConfig = LEAD_PRIORITY_TYPES[followUp.priority] || LEAD_PRIORITY_TYPES['Medium'];
              const PriorityIcon = priorityConfig.icon;
              const leadStatusConfig = LEAD_STATUS_TYPES[followUp.leadStatus] || LEAD_STATUS_TYPES['New'];
              const propTypeConfig = PROPERTY_TYPE_CONFIG[followUp.propertyType] || PROPERTY_TYPE_CONFIG['Individual'];

              const isOverdue = new Date(followUp.followUpDate) < new Date() && followUp.followUpStatus === 'Pending';
              const isToday = new Date(followUp.followUpDate).toDateString() === new Date().toDateString();

              return (
                <div
                  key={followUp.id}
                  className={`bg-white rounded-2xl border p-3.5 hover:shadow-xl hover:-translate-y-1 group animate-slide-in transition-all duration-500 ${isSelected ? 'ring-2 ring-[#00695C] shadow-lg' : 'border-[#E8F0EE]'} ${isOverdue ? 'border-l-4 border-l-red-500' : ''} ${isToday && !isOverdue ? 'border-l-4 border-l-amber-500' : ''}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-2 gap-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectFollowUp(followUp.id)}
                        className="w-4 h-4 shrink-0 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                      />
                      <div className={`w-9 h-9 rounded-2xl bg-gradient-to-br ${typeConfig.color} flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
                        <TypeIcon className="text-sm" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm text-[#1A2E2A] truncate">{followUp.customerName}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <p className="text-[10px] font-medium text-[#5A7D78]">{followUp.leadId}</p>
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
                      <span className="font-medium break-words">{followUp.mobileNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#5A7D78] flex-wrap">
                      <FiHomeIcon className="text-[#00695C] flex-shrink-0" />
                      <span className="font-medium break-words">{followUp.propertyName}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold leading-none ${propTypeConfig.bg} ${propTypeConfig.text} border ${propTypeConfig.border}`}>
                        {followUp.propertyType}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#5A7D78] flex-wrap">
                      <FiMap className="text-[#00695C] flex-shrink-0" />
                      <span className="font-medium break-words">{followUp.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#5A7D78] flex-wrap">
                      <FiUserCheck className="text-[#00695C] flex-shrink-0" />
                      <span className="font-medium">{followUp.assignedTo || 'Unassigned'}</span>
                    </div>

                    <div className={`flex items-center gap-2 text-xs rounded-lg px-2 py-1 ${isOverdue ? 'bg-red-50 text-red-700' : isToday ? 'bg-amber-50 text-amber-700' : 'bg-[#F5F9F8] text-[#5A7D78]'}`}>
                      <FiCalendar className="flex-shrink-0" />
                      <span className="font-semibold">
                        {new Date(followUp.followUpDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <FiClock className="flex-shrink-0" />
                      <span className="font-semibold">
                        {new Date(followUp.followUpDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isOverdue && <span className="text-[9px] font-bold uppercase">Overdue</span>}
                      {isToday && !isOverdue && <span className="text-[9px] font-bold uppercase">Today</span>}
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <TypeIcon className="text-[#00695C] flex-shrink-0" />
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${typeConfig.bg} ${typeConfig.text} border ${typeConfig.border}`}>
                        {typeConfig.label}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${leadStatusConfig.bg} ${leadStatusConfig.text} border ${leadStatusConfig.border}`}>
                        Lead: {leadStatusConfig.label}
                      </span>
                    </div>

                    {followUp.nextFollowUp && (
                      <div className="flex items-center gap-2 text-xs text-[#5A7D78]">
                        <FiCalendar className="text-[#00695C] flex-shrink-0" />
                        <span className="font-medium">
                          Next: {new Date(followUp.nextFollowUp).toLocaleString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2.5 pt-2.5 border-t border-[#E8F0EE]">
                    <button
                      type="button"
                      onClick={() => handleViewFollowUp(followUp)}
                      className="flex-1 py-1.5 text-xs font-semibold text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiEye className="text-[10px]" /> View
                    </button>
                    {followUp.followUpStatus === 'Pending' && (
                      <button
                        type="button"
                        onClick={() => { setCompleteFollowUp(followUp); setShowCompleteModal(true); }}
                        className="flex-1 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                      >
                        <FiCheckCircle className="text-[10px]" /> Complete
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleEditFollowUp(followUp)}
                      className="flex-1 py-1.5 text-xs font-semibold text-[#26A69A] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiEdit className="text-[10px]" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteFollowUp(followUp.id)}
                      disabled={actionLoading === followUp.id}
                      className="flex-1 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50"
                    >
                      {actionLoading === followUp.id ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiTrash2 className="text-[10px]" />}
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
  <col style={{ width: '3%' }} />   {/* Checkbox */}
  <col style={{ width: '9%' }} />  {/* Lead ID */}
  <col style={{ width: '9%' }} />  {/* Customer */}
  <col style={{ width: '8%' }} />  {/* Mobile */}
  <col style={{ width: '9%' }} />  {/* Property */}
  <col style={{ width: '7%' }} />   {/* Assigned */}
  <col style={{ width: '7%' }} />   {/* Follow-Up Date */}
  <col style={{ width: '7%' }} />   {/* Type */}
  <col style={{ width: '7%' }} />   {/* Status */}
  <col style={{ width: '7%' }} />  {/* Next Follow-Up */}
  <col style={{ width: '9%' }} />   {/* Actions */}
</colgroup>
    <thead>
      <tr className="bg-[#F5F9F8] border-b border-[#E8F0EE]">
        <th className="px-2 py-3 text-left">
          <input
            type="checkbox"
            checked={selectedFollowUps.length === paginatedFollowUps.length && paginatedFollowUps.length > 0}
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
      {paginatedFollowUps.map((followUp) => {
        const isSelected = selectedFollowUps.includes(followUp.id);
        const typeConfig = FOLLOWUP_TYPE_CONFIG[followUp.followUpType] || FOLLOWUP_TYPE_CONFIG['Call'];
        const TypeIcon = typeConfig.icon;
        const statusConfig = FOLLOWUP_STATUS_CONFIG[followUp.followUpStatus] || FOLLOWUP_STATUS_CONFIG['Pending'];

        const isOverdue = new Date(followUp.followUpDate) < new Date() && followUp.followUpStatus === 'Pending';
        const isToday = new Date(followUp.followUpDate).toDateString() === new Date().toDateString();

        return (
          <tr
            key={followUp.id}
            className={`border-b border-[#E8F0EE] hover:bg-[#F5F9F8] transition-colors duration-200 ${isSelected ? 'bg-[#E8F4F2]' : ''} ${isOverdue ? 'bg-red-50/50' : ''}`}
          >
            <td className="px-2 py-2.5 align-middle">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleSelectFollowUp(followUp.id)}
                className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
              />
            </td>

            {/* Lead ID */}
            <td className="px-2 py-2.5 align-middle overflow-hidden">
              <span className="flex items-center gap-1.5 text-xs font-bold text-[#00695C] min-w-0">
                <span className={`w-5 h-5 rounded-full bg-gradient-to-br ${typeConfig.color} flex items-center justify-center text-white flex-shrink-0`}>
                  <TypeIcon className="text-[9px]" />
                </span>
                <span className="truncate" title={followUp.leadId}>{followUp.leadId}</span>
              </span>
            </td>

            {/* Customer */}
            <td className="px-2 py-2.5 align-middle overflow-hidden">
              <span className="block text-sm font-bold text-[#1A2E2A] truncate" title={followUp.customerName}>
                {followUp.customerName}
              </span>
            </td>

            {/* Mobile */}
            <td className="px-2 py-2.5 align-middle overflow-hidden">
              <span className="block text-xs font-medium text-[#5A7D78] truncate" title={followUp.mobileNumber}>
                {followUp.mobileNumber}
              </span>
            </td>

            {/* Property */}
            <td className="px-2 py-2.5 align-middle overflow-hidden">
              <span className="block text-xs font-medium text-[#5A7D78] truncate" title={followUp.propertyName}>
                {followUp.propertyName}
              </span>
            </td>

            {/* Assigned */}
            <td className="px-2 py-2.5 align-middle overflow-hidden">
              <span className="block text-xs font-medium text-[#5A7D78] truncate" title={followUp.assignedTo || 'Unassigned'}>
                {followUp.assignedTo || 'Unassigned'}
              </span>
            </td>

            {/* Follow-Up Date + Time */}
            <td className="px-2 py-2.5 align-middle overflow-hidden">
              <div className={`text-xs font-medium leading-tight truncate ${isOverdue ? 'text-red-700' : isToday ? 'text-amber-700' : 'text-[#5A7D78]'}`}>
                <div className="font-semibold truncate">
                  {new Date(followUp.followUpDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                </div>
                <div className="text-[10px] truncate">
                  {new Date(followUp.followUpDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </td>

            {/* Follow-Up Type */}
            <td className="px-2 py-2.5 align-middle overflow-hidden">
              <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold whitespace-nowrap ${typeConfig.bg} ${typeConfig.text} border ${typeConfig.border}`}>
                <TypeIcon className="text-[9px] flex-shrink-0" />
                <span className="truncate">{typeConfig.label}</span>
              </span>
            </td>

            {/* Follow-Up Status */}
            <td className="px-2 py-2.5 align-middle overflow-hidden">
              <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold whitespace-nowrap ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                <span className="truncate">{statusConfig.label}</span>
              </span>
            </td>

            {/* Next Follow-Up */}
            <td className="px-2 py-2.5 align-middle overflow-hidden">
              <span className="block text-xs font-medium text-[#5A7D78] truncate">
                {followUp.nextFollowUp
                  ? new Date(followUp.nextFollowUp).toLocaleString('en-IN', {
                      day: 'numeric', month: 'short', year: '2-digit',
                      hour: '2-digit', minute: '2-digit'
                    })
                  : '—'}
              </span>
            </td>

            {/* Actions */}
            <td className=" align-middle">
              <div className="flex items-center justify-end ">
                <button
                  type="button"
                  onClick={() => handleViewFollowUp(followUp)}
                  className="w-7 h-7 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 flex items-center justify-center text-[#00695C] hover:scale-110 flex-shrink-0"
                  title="View"
                >
                  <FiEye className="text-sm" />
                </button>
                {followUp.followUpStatus === 'Pending' && (
                  <button
                    type="button"
                    onClick={() => { setCompleteFollowUp(followUp); setShowCompleteModal(true); }}
                    className="w-7 h-7 rounded-lg hover:bg-emerald-50 transition-all duration-300 flex items-center justify-center text-emerald-600 hover:scale-110 flex-shrink-0"
                    title="Complete"
                  >
                    <FiCheckCircle className="text-sm" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleEditFollowUp(followUp)}
                  className="w-7 h-7 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 flex items-center justify-center text-[#26A69A] hover:scale-110 flex-shrink-0"
                  title="Edit"
                >
                  <FiEdit className="text-sm" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteFollowUp(followUp.id)}
                  disabled={actionLoading === followUp.id}
                  className="w-7 h-7 rounded-lg hover:bg-red-50 transition-all duration-300 flex items-center justify-center text-red-600 hover:scale-110 disabled:opacity-50 flex-shrink-0"
                  title="Delete"
                >
                  {actionLoading === followUp.id ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiTrash2 className="text-sm" />}
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

        {paginatedFollowUps.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E8F0EE]">
            <div className="w-24 h-24 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4 animate-float">
              <FiClock className="text-4xl text-[#B5C9C5]" />
            </div>
            <h3 className="text-xl font-bold text-[#1A2E2A]">No follow-ups found</h3>
            <p className="text-sm text-[#5A7D78] mt-1">
              {filterCount > 0 ? 'Try adjusting your search or filter criteria' : 'No follow-up records have been added yet'}
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
              {Math.min(currentPage * pageSize, filteredFollowUps.length)} of{' '}
              {filteredFollowUps.length} follow-ups
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

export default FollowUpManagement;