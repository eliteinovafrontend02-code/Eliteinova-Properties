// src/components/admin/LeadManagement/SiteVisitManagement.jsx

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
  FiThumbsDown, FiMinusCircle, FiPlayCircle, FiStopCircle
} from 'react-icons/fi';
import { FaHome, FaHotel, FaHardHat, FaCheckDouble } from 'react-icons/fa';

// ============================================================
// SITE VISIT STATUS CONFIG
// ============================================================
const SITE_VISIT_STATUS_TYPES = {
  'Requested': {
    icon: FiSend,
    color: 'from-amber-600 to-amber-400',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    label: 'Requested'
  },
  'Scheduled': {
    icon: FiCalendar,
    color: 'from-blue-600 to-blue-400',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    label: 'Scheduled'
  },
  'Completed': {
    icon: FiCheckCircle,
    color: 'from-emerald-600 to-emerald-400',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    label: 'Completed'
  },
  'Cancelled': {
    icon: FiXCircle,
    color: 'from-red-600 to-red-400',
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    label: 'Cancelled'
  }
};

const ALL_SITE_VISIT_STATUSES = Object.keys(SITE_VISIT_STATUS_TYPES);

// ============================================================
// CUSTOMER ATTENDANCE CONFIG
// ============================================================
const ATTENDANCE_TYPES = {
  'Attended': {
    icon: FiUserCheck,
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    label: 'Attended'
  },
  'Not Attended': {
    icon: FiUserX,
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    label: 'Not Attended'
  },
  'Pending': {
    icon: FiClock,
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    label: 'Pending'
  },
  'Rescheduled': {
    icon: FiRotateCcw,
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    label: 'Rescheduled'
  }
};

const ALL_ATTENDANCE_TYPES = Object.keys(ATTENDANCE_TYPES);

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
// AVAILABLE EXECUTIVES
// ============================================================
const AVAILABLE_EXECUTIVES = [
  { id: 'exec_1', name: 'Rajesh Kumar', email: 'rajesh.kumar@company.com', role: 'Senior Executive', avatar: 'RK' },
  { id: 'exec_2', name: 'Priya Sharma', email: 'priya.sharma@company.com', role: 'Site Manager', avatar: 'PS' },
  { id: 'exec_3', name: 'Amit Patel', email: 'amit.patel@company.com', role: 'Field Executive', avatar: 'AP' },
  { id: 'exec_4', name: 'Sneha Reddy', email: 'sneha.reddy@company.com', role: 'Visit Coordinator', avatar: 'SR' },
  { id: 'exec_5', name: 'Vikram Singh', email: 'vikram.singh@company.com', role: 'Senior Executive', avatar: 'VS' },
  { id: 'exec_6', name: 'Anjali Desai', email: 'anjali.desai@company.com', role: 'Junior Executive', avatar: 'AD' },
];

// ============================================================
// HELPERS
// ============================================================
const resolveCustomerId = (visit) => {
  if (!visit) return '';
  if (visit.customerId && String(visit.customerId).trim() !== '') {
    return visit.customerId;
  }
  return `CUST-${String(visit.id || '').replace('visit_', '').padStart(4, '0')}`;
};

const resolvePropertyId = (visit) => {
  if (!visit) return '';
  // Direct ID mapping for property navigation
  if (visit.propertyId) return visit.propertyId;
  // Fallback generation
  const seed = `${visit.propertyName || ''}::${visit.propertyLocation || ''}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return `PROP-${String(hash % 100000).padStart(5, '0')}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const formatTime = (timeStr) => {
  if (!timeStr) return '-';
  // If it's a full ISO date, extract time
  if (timeStr.includes('T')) {
    return new Date(timeStr).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  return timeStr;
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
// RESCHEDULE VISIT MODAL
// ============================================================
const RescheduleVisitModal = ({ visit, show, onClose, onSave }) => {
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('11:00');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 2);
      const iso = tomorrow.toISOString().split('T')[0];
      setVisitDate(visit?.visitDate ? visit.visitDate.split('T')[0] : iso);
      setVisitTime(visit?.visitTime || '11:00');
      setReason('');
    }
  }, [show, visit]);

  if (!visit || !show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!visitDate || !visitTime) return;
    setLoading(true);
    setTimeout(() => {
      onSave(visit.id, {
        visitDate,
        visitTime,
        reason: reason.trim(),
        status: 'Scheduled'
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
              <FiRotateCcw className="text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Reschedule Visit</h2>
              <p className="text-white/80 text-sm">{visit.visitId} • {visit.customerName}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-3 flex items-start gap-2">
            <FiHomeIcon className="text-purple-600 flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-purple-900 truncate">{visit.propertyName}</p>
              <p className="text-[11px] text-purple-700 truncate">{visit.propertyLocation}</p>
            </div>
          </div>

          <div className="bg-[#F5F9F8] rounded-2xl p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">
                  New Visit Date *
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
                  New Visit Time *
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
              Reason for Reschedule (Optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows="3"
              placeholder="Why is this visit being rescheduled?"
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
            onClick={handleSubmit}
            disabled={!visitDate || loading}
            className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-300 text-sm font-medium shadow-lg shadow-purple-600/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <FiRefreshCw className="animate-spin" /> : <FiRotateCcw />}
            {loading ? 'Rescheduling...' : 'Reschedule Visit'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// CANCEL VISIT MODAL
// ============================================================
const CancelVisitModal = ({ visit, show, onClose, onSave }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) setReason('');
  }, [show]);

  if (!visit || !show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onSave(visit.id, { reason: reason.trim(), status: 'Cancelled' });
      setLoading(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl animate-slide-up border border-[#E8F0EE] overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-red-400 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white">
              <FiXCircle className="text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Cancel Site Visit</h2>
              <p className="text-white/80 text-sm">{visit.visitId} • {visit.customerName}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-3 mb-4 flex items-start gap-2">
            <FiAlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-700">
              This will mark the site visit as <strong>Cancelled</strong>. The customer will need to be notified separately.
            </p>
          </div>

          <div className="bg-[#F5F9F8] rounded-2xl p-4">
            <label className="block text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">
              Reason for Cancellation *
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows="4"
              placeholder="Why is this visit being cancelled?"
              required
              className="w-full px-4 py-3 bg-white rounded-xl border border-[#E8F0EE] focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none resize-none"
            />
          </div>

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
              disabled={!reason.trim() || loading}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 text-sm font-medium shadow-lg shadow-red-600/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <FiRefreshCw className="animate-spin" /> : <FiXCircle />}
              {loading ? 'Cancelling...' : 'Cancel Visit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================
// MARK COMPLETED MODAL
// ============================================================
const MarkCompletedModal = ({ visit, show, onClose, onSave }) => {
  const [attendance, setAttendance] = useState('Attended');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setAttendance('Attended');
      setNotes('');
    }
  }, [show]);

  if (!visit || !show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onSave(visit.id, {
        customerAttendance: attendance,
        completionNotes: notes.trim(),
        status: 'Completed'
      });
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
              <h2 className="text-xl font-bold text-white">Mark as Completed</h2>
              <p className="text-white/80 text-sm">{visit.visitId} • {visit.customerName}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-[#F5F9F8] rounded-2xl p-4">
            <label className="block text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-2">
              Customer Attendance *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ALL_ATTENDANCE_TYPES.map((att) => {
                const config = ATTENDANCE_TYPES[att];
                const Icon = config.icon;
                const isSelected = attendance === att;
                return (
                  <button
                    key={att}
                    type="button"
                    onClick={() => setAttendance(att)}
                    className={`flex items-center gap-2 p-3 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
                      isSelected
                        ? `${config.bg} ${config.border} ring-2 ring-emerald-500/20`
                        : 'bg-white border-[#E8F0EE] hover:border-emerald-300'
                    }`}
                  >
                    <Icon className={`text-sm ${isSelected ? config.text : 'text-[#5A7D78]'}`} />
                    <span className={`text-xs font-medium ${isSelected ? config.text : 'text-[#1A2E2A]'}`}>
                      {config.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-[#F5F9F8] rounded-2xl p-4">
            <label className="block text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">
              Completion Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="3"
              placeholder="Any notes about the completed visit..."
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
              className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all duration-300 text-sm font-medium shadow-lg shadow-emerald-600/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <FiRefreshCw className="animate-spin" /> : <FiCheckCircle />}
              {loading ? 'Completing...' : 'Mark Completed'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================
// ADD FEEDBACK MODAL
// ============================================================
const AddFeedbackModal = ({ visit, show, onClose, onSave }) => {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(4);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setFeedback(visit?.customerFeedback || '');
      setRating(visit?.feedbackRating || 4);
    }
  }, [show, visit]);

  if (!visit || !show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    setLoading(true);
    setTimeout(() => {
      onSave(visit.id, { customerFeedback: feedback.trim(), feedbackRating: rating });
      setLoading(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl animate-slide-up border border-[#E8F0EE] overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-600 to-cyan-400 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white">
              <FiMessageCircle className="text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Add Customer Feedback</h2>
              <p className="text-white/80 text-sm">{visit.visitId} • {visit.customerName}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-[#F5F9F8] rounded-2xl p-4">
            <label className="block text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-2">
              Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-all duration-300 hover:scale-125"
                >
                  <FiStar
                    className={`text-2xl ${star <= rating ? 'text-amber-500 fill-amber-500' : 'text-[#B5C9C5]'}`}
                    style={star <= rating ? { fill: 'currentColor' } : {}}
                  />
                </button>
              ))}
              <span className="text-sm font-medium text-[#5A7D78] ml-2">{rating}/5</span>
            </div>
          </div>

          <div className="bg-[#F5F9F8] rounded-2xl p-4">
            <label className="block text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">
              Feedback *
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows="4"
              placeholder="What did the customer say about the visit?"
              required
              className="w-full px-4 py-3 bg-white rounded-xl border border-[#E8F0EE] focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none resize-none"
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
              disabled={!feedback.trim() || loading}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-cyan-400  text-white rounded-xl hover:from-cyan-700 hover:to-cyan-500 transition-all duration-300 text-sm font-medium shadow-lg shadow-cyan-50 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <FiRefreshCw className="animate-spin" /> : <FiMessageCircle />}
              {loading ? 'Saving...' : 'Save Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================
// ADD FOLLOW-UP MODAL
// ============================================================
const AddFollowUpModal = ({ visit, show, onClose, onSave }) => {
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpTime, setFollowUpTime] = useState('10:00');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const iso = tomorrow.toISOString().split('T')[0];
      setFollowUpDate(iso);
      setFollowUpTime('10:00');
      setNote('');
    }
  }, [show]);

  if (!visit || !show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!followUpDate) return;
    setLoading(true);
    setTimeout(() => {
      onSave(visit.id, {
        nextFollowUp: `${followUpDate}T${followUpTime}:00`,
        followUpNote: note.trim()
      });
      setLoading(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl animate-slide-up border border-[#E8F0EE] overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-400 p-6 relative">
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
              <h2 className="text-xl font-bold text-white">Add Follow-Up</h2>
              <p className="text-white/80 text-sm">{visit.visitId} • {visit.customerName}</p>
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
                  className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
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
                  className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#F5F9F8] rounded-2xl p-4">
            <label className="block text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">
              Note (Optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows="3"
              placeholder="Add a reminder note for this follow-up..."
              className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none resize-none"
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
              disabled={!followUpDate || loading}
              className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-300 text-sm font-medium shadow-lg shadow-indigo-600/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <FiRefreshCw className="animate-spin" /> : <FiCalendar />}
              {loading ? 'Scheduling...' : 'Add Follow-Up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================
// ASSIGN EXECUTIVE MODAL
// ============================================================
const AssignExecutiveModal = ({ visit, show, onClose, onAssign }) => {
  const [selectedExecutive, setSelectedExecutive] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setSelectedExecutive('');
      setSearchQuery('');
    }
  }, [show]);

  if (!visit || !show) return null;

  const filteredExecutives = AVAILABLE_EXECUTIVES.filter(e =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAssign = () => {
    if (!selectedExecutive) return;
    setLoading(true);
    setTimeout(() => {
      const executive = AVAILABLE_EXECUTIVES.find(e => e.id === selectedExecutive);
      onAssign(visit.id, executive);
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
              <h2 className="text-xl font-bold text-white">Assign Executive</h2>
              <p className="text-white/80 text-sm">{visit.visitId} • {visit.customerName}</p>
            </div>
          </div>
        </div>

        {visit.assignedExecutive && (
          <div className="px-6 pt-4 shrink-0">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center gap-2">
              <FiInfo className="text-blue-600 flex-shrink-0" />
              <p className="text-xs text-blue-700">
                Currently assigned to <span className="font-bold">{visit.assignedExecutive}</span>. Pick a new executive below.
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
              placeholder="Search executives..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {filteredExecutives.length === 0 ? (
            <div className="text-center py-12">
              <FiUsers className="text-4xl text-[#B5C9C5] mx-auto mb-3" />
              <p className="text-sm text-[#5A7D78]">No executives match your search.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredExecutives.map((exec) => {
                const isSelected = selectedExecutive === exec.id;
                return (
                  <button
                    key={exec.id}
                    onClick={() => setSelectedExecutive(exec.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition-all duration-300 hover:scale-[1.01] text-left ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20'
                        : 'border-[#E8F0EE] bg-white hover:border-blue-300 hover:bg-blue-50/40'
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-[#E8F4F2] text-[#00695C]'
                    }`}>
                      {exec.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold truncate ${isSelected ? 'text-blue-700' : 'text-[#1A2E2A]'}`}>
                        {exec.name}
                      </p>
                      <p className="text-[11px] text-[#5A7D78] truncate">{exec.email}</p>
                      <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-semibold bg-[#F5F9F8] text-[#5A7D78] border border-[#E8F0EE]">
                        {exec.role}
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
            disabled={!selectedExecutive || loading}
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 text-sm font-medium shadow-lg shadow-blue-600/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <FiRefreshCw className="animate-spin" /> : <FiUserPlus />}
            {loading ? 'Assigning...' : 'Assign Executive'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// VIEW SITE VISIT DETAIL MODAL
// ============================================================
const ViewVisitDetailModal = ({ visit, show, onClose, onEdit, onDelete, onAction }) => {
  if (!visit || !show) return null;

  const statusConfig = SITE_VISIT_STATUS_TYPES[visit.status] || SITE_VISIT_STATUS_TYPES['Requested'];
  const StatusIcon = statusConfig.icon;
  const attendanceConfig = ATTENDANCE_TYPES[visit.customerAttendance] || ATTENDANCE_TYPES['Pending'];
  const AttendanceIcon = attendanceConfig.icon;
  const propTypeConfig = PROPERTY_TYPE_CONFIG[visit.propertyType] || PROPERTY_TYPE_CONFIG['Individual'];

  const getAvailableActions = () => {
    const actions = [];
    actions.push({ id: 'view-property', label: 'View Property', icon: FiHomeIcon, color: 'text-teal-700', bg: 'bg-teal-50', hoverBg: 'hover:bg-teal-100', border: 'border-teal-200' });

    if (visit.status === 'Requested' || visit.status === 'Scheduled') {
      actions.push({ id: 'reschedule', label: 'Reschedule', icon: FiRotateCcw, color: 'text-purple-700', bg: 'bg-purple-50', hoverBg: 'hover:bg-purple-100', border: 'border-purple-200' });
      actions.push({ id: 'cancel', label: 'Cancel', icon: FiXCircle, color: 'text-red-700', bg: 'bg-red-50', hoverBg: 'hover:bg-red-100', border: 'border-red-200' });
    }

    if (visit.status === 'Requested' || visit.status === 'Scheduled') {
      actions.push({ id: 'mark-completed', label: 'Mark Completed', icon: FiCheckCircle, color: 'text-emerald-700', bg: 'bg-emerald-50', hoverBg: 'hover:bg-emerald-100', border: 'border-emerald-200' });
    }

    actions.push({ id: 'add-feedback', label: 'Add Feedback', icon: FiMessageCircle, color: 'text-cyan-700', bg: 'bg-cyan-50', hoverBg: 'hover:bg-cyan-100', border: 'border-cyan-200' });
    actions.push({ id: 'add-followup', label: 'Add Follow-Up', icon: FiCalendar, color: 'text-indigo-700', bg: 'bg-indigo-50', hoverBg: 'hover:bg-indigo-100', border: 'border-indigo-200' });
    actions.push({ id: 'assign-executive', label: 'Assign Executive', icon: FiUserPlus, color: 'text-blue-700', bg: 'bg-blue-50', hoverBg: 'hover:bg-blue-100', border: 'border-blue-200' });

    return actions;
  };

  const availableActions = getAvailableActions();

  const handleActionClick = (actionId) => {
    if (onAction) {
      onAction(actionId, visit);
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
              <h2 className="text-2xl font-bold text-white">{visit.customerName}</h2>
              <p className="text-white/80 text-sm flex items-center gap-2 flex-wrap">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                  {statusConfig.label}
                </span>
                <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                <span>Visit ID: {visit.visitId}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-white/20 text-white border border-white/30">
              <FiHomeIcon className="text-xs" /> {visit.propertyName}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-white/20 text-white border border-white/30">
              <FiMap className="text-xs" /> {visit.propertyLocation}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiHash className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Visit ID</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{visit.visitId}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiUser className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Customer Name</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{visit.customerName}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiPhone className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Mobile Number</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{visit.mobileNumber}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiHomeIcon className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Property Name</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{visit.propertyName}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiMap className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Property Location</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{visit.propertyLocation}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiLayers className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Property Type</h4>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${propTypeConfig.bg} ${propTypeConfig.text} border ${propTypeConfig.border}`}>
                {visit.propertyType}
              </span>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiCalendar className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Site Visit Requested</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{formatDate(visit.requestedDate)}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiCalendar className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Site Visit Scheduled</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{formatDate(visit.scheduledDate)}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiCalendar className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Site Visit Date</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{formatDate(visit.visitDate)}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiClock className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Site Visit Time</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{formatTime(visit.visitTime)}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FiUserCheck className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Assigned Executive</h4>
              </div>
              <p className="text-sm font-bold text-[#1A2E2A]">{visit.assignedExecutive || 'Unassigned'}</p>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <AttendanceIcon className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Customer Attendance</h4>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${attendanceConfig.bg} ${attendanceConfig.text} border ${attendanceConfig.border}`}>
                {attendanceConfig.label}
              </span>
            </div>

            {/* REPLACED COMPLETED DATE WITH STATUS */}
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <StatusIcon className="text-[#00695C] text-sm" />
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Site Visit Status</h4>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                {statusConfig.label}
              </span>
            </div>

            {visit.customerFeedback && (
              <div className="bg-cyan-50 rounded-2xl p-4 border border-cyan-200 md:col-span-2">
                <div className="flex items-center gap-2 mb-1">
                  <FiMessageCircle className="text-cyan-600 text-sm" />
                  <h4 className="text-xs font-semibold text-cyan-700 uppercase tracking-wider">Customer Feedback</h4>
                  {visit.feedbackRating && (
                    <span className="ml-2 flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={`text-xs ${i < visit.feedbackRating ? 'text-amber-500 fill-amber-500' : 'text-[#B5C9C5]'}`}
                          style={i < visit.feedbackRating ? { fill: 'currentColor' } : {}}
                        />
                      ))}
                    </span>
                  )}
                </div>
                <p className="text-sm text-cyan-900">{visit.customerFeedback}</p>
              </div>
            )}

            {visit.nextFollowUp && (
              <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-200 md:col-span-2">
                <div className="flex items-center gap-2 mb-1">
                  <FiCalendar className="text-indigo-600 text-sm" />
                  <h4 className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">Next Follow-Up</h4>
                </div>
                <p className="text-sm font-bold text-indigo-900">
                  {new Date(visit.nextFollowUp).toLocaleString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              </div>
            )}

            {visit.notes && (
              <div className="bg-[#F5F9F8] rounded-2xl p-4 md:col-span-2">
                <div className="flex items-center gap-2 mb-1">
                  <FiFileText className="text-[#00695C] text-sm" />
                  <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">Notes</h4>
                </div>
                <p className="text-sm font-bold text-[#1A2E2A]">{visit.notes}</p>
              </div>
            )}
          </div>

          <div className="border-t border-[#E8F0EE] pt-5">
            <div className="flex items-center gap-2 mb-4">
              <FiActivity className="text-[#00695C] text-lg" />
              <h3 className="text-sm font-bold text-[#1A2E2A] uppercase tracking-wider">Site Visit Actions</h3>
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
              onClick={() => { if (onEdit) { onEdit(visit); onClose(); } }}
              className="flex-1 px-4 py-2.5 bg-[#26A69A] text-white rounded-xl hover:bg-[#1A8A7A] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#26A69A]/30 hover:scale-[1.02] min-w-[100px]"
            >
              <FiEdit className="inline mr-2" /> Edit
            </button>
            <button
              onClick={() => { if (onDelete) { onDelete(visit.id); } }}
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
// EDIT SITE VISIT MODAL
// ============================================================
const EditVisitModal = ({ visit, show, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    visitId: '', customerName: '', mobileNumber: '',
    propertyName: '', propertyType: '', propertyLocation: '',
    visitDate: '', visitTime: '', assignedExecutive: '',
    status: '', customerAttendance: '', customerFeedback: '',
    nextFollowUp: '', notes: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visit) {
      setFormData({
        visitId: visit.visitId || '',
        customerName: visit.customerName || '',
        mobileNumber: visit.mobileNumber || '',
        propertyName: visit.propertyName || '',
        propertyType: visit.propertyType || '',
        propertyLocation: visit.propertyLocation || '',
        visitDate: visit.visitDate ? visit.visitDate.split('T')[0] : '',
        visitTime: visit.visitTime || '',
        assignedExecutive: visit.assignedExecutive || '',
        status: visit.status || 'Requested',
        customerAttendance: visit.customerAttendance || 'Pending',
        customerFeedback: visit.customerFeedback || '',
        nextFollowUp: visit.nextFollowUp ? visit.nextFollowUp.split('T')[0] : '',
        notes: visit.notes || ''
      });
    }
  }, [visit]);

  if (!visit || !show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onSave({ ...visit, ...formData });
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
          <h2 className="text-2xl font-bold text-white">Edit Site Visit</h2>
          <p className="text-white/80 text-sm">Update site visit information</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiHash className="text-[#00695C]" />
                Visit Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Visit ID</label>
                  <input
                    type="text" name="visitId" value={formData.visitId} onChange={handleChange} readOnly
                    className="w-full px-3 py-2 bg-[#F0F5F4] rounded-xl border border-[#E8F0EE] text-sm text-[#1A2E2A] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Visit Date *</label>
                  <input
                    type="date" name="visitDate" value={formData.visitDate} onChange={handleChange} required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Visit Time *</label>
                  <input
                    type="time" name="visitTime" value={formData.visitTime} onChange={handleChange} required
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
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Property Location *</label>
                  <input
                    type="text" name="propertyLocation" value={formData.propertyLocation} onChange={handleChange} required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiActivity className="text-[#00695C]" />
                Visit Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Assigned Executive</label>
                  <input
                    type="text" name="assignedExecutive" value={formData.assignedExecutive} onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Visit Status *</label>
                  <select
                    name="status" value={formData.status} onChange={handleChange} required
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  >
                    {ALL_SITE_VISIT_STATUSES.map(status => (
                      <option key={status} value={status}>{SITE_VISIT_STATUS_TYPES[status].label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Customer Attendance</label>
                  <select
                    name="customerAttendance" value={formData.customerAttendance} onChange={handleChange}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none"
                  >
                    {ALL_ATTENDANCE_TYPES.map(att => (
                      <option key={att} value={att}>{ATTENDANCE_TYPES[att].label}</option>
                    ))}
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
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Customer Feedback</label>
                  <textarea
                    name="customerFeedback" value={formData.customerFeedback} onChange={handleChange} rows="2"
                    className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none resize-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-[#5A7D78] mb-1">Notes</label>
                  <textarea
                    name="notes" value={formData.notes} onChange={handleChange} rows="2"
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
const SiteVisitManagement = () => {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  // STATE
  const [visits, setVisits] = useState([]);
  const [filteredVisits, setFilteredVisits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('visitDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedVisits, setSelectedVisits] = useState([]);
  const [viewingVisit, setViewingVisit] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingVisit, setEditingVisit] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [filterCount, setFilterCount] = useState(0);
  const [activeStatus, setActiveStatus] = useState('all');
  const [activeAttendance, setActiveAttendance] = useState('all');
  const [activePropertyType, setActivePropertyType] = useState('all');
  const [showStats, setShowStats] = useState(true);

  // DATE RANGE STATE
  const [dateRange, setDateRange] = useState('this_month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // MODAL STATES
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleVisit, setRescheduleVisit] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelVisit, setCancelVisit] = useState(null);
  const [showCompletedModal, setShowCompletedModal] = useState(false);
  const [completedVisit, setCompletedVisit] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackVisit, setFeedbackVisit] = useState(null);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [followUpVisit, setFollowUpVisit] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignVisit, setAssignVisit] = useState(null);

  // CONFIRMATION
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false, title: '', message: '', confirmText: 'Confirm', cancelText: 'Cancel', type: 'danger', onConfirm: null, onCancel: null
  });

  // STATS
  const [stats, setStats] = useState({
    total: 0, Requested: 0, Scheduled: 0, Completed: 0, Cancelled: 0,
    attended: 0, notAttended: 0, pendingAttendance: 0,
    todayVisits: 0, monthVisits: 0
  });

  const computeStats = useCallback((list) => {
    if (!list || list.length === 0) {
      setStats({
        total: 0, Requested: 0, Scheduled: 0, Completed: 0, Cancelled: 0,
        attended: 0, notAttended: 0, pendingAttendance: 0,
        todayVisits: 0, monthVisits: 0
      });
      return;
    }

    const counts = { total: list.length };
    ALL_SITE_VISIT_STATUSES.forEach(status => {
      counts[status] = list.filter(v => v.status === status).length;
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayVisits = list.filter(v => {
      const d = new Date(v.visitDate);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === today.getTime();
    }).length;

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthVisits = list.filter(v => new Date(v.visitDate) >= monthStart).length;

    const attended = list.filter(v => v.customerAttendance === 'Attended').length;
    const notAttended = list.filter(v => v.customerAttendance === 'Not Attended').length;
    const pendingAttendance = list.filter(v => v.customerAttendance === 'Pending').length;

    setStats({ ...counts, attended, notAttended, pendingAttendance, todayVisits, monthVisits });
  }, []);

  // GENERATE MOCK DATA
  const generateMockVisits = useCallback(() => {
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
    const executives = ['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Reddy', 'Vikram Singh', 'Anjali Desai', '', ''];
    const feedbacks = [
      'Very nice property, customer liked the location.',
      'Customer is interested but wants to negotiate price.',
      'Customer found the property too small for their needs.',
      'Excellent visit, customer is ready to proceed.',
      'Customer wants to bring family for second visit.',
      'Property needs some renovation work.',
      'Customer is comparing with other options.',
      'Good visit overall, follow-up needed.'
    ];

    const list = [];
    const now = new Date();

    for (let i = 1; i <= 100; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const customerName = `${firstName} ${lastName}`;
      const status = ALL_SITE_VISIT_STATUSES[Math.floor(Math.random() * ALL_SITE_VISIT_STATUSES.length)];
      const propertyType = ALL_PROPERTY_TYPES[Math.floor(Math.random() * ALL_PROPERTY_TYPES.length)];
      const assignedExecutive = executives[Math.floor(Math.random() * executives.length)];
      const propertyName = propertyNames[Math.floor(Math.random() * propertyNames.length)];
      const propertyLocation = locations[Math.floor(Math.random() * locations.length)];

      // Generate dates
      let visitDate;
      const rand = Math.random();
      if (rand < 0.2) {
        visitDate = new Date(now);
        visitDate.setDate(visitDate.getDate() + Math.floor(Math.random() * 7));
      } else if (rand < 0.5) {
        visitDate = new Date(now);
        visitDate.setDate(visitDate.getDate() - Math.floor(Math.random() * 7));
      } else if (rand < 0.8) {
        visitDate = new Date(now);
        visitDate.setDate(visitDate.getDate() - Math.floor(Math.random() * 30));
      } else {
        visitDate = new Date(now);
        visitDate.setDate(visitDate.getDate() - Math.floor(Math.random() * 90));
      }

      const requestedDate = new Date(visitDate);
      requestedDate.setDate(requestedDate.getDate() - Math.floor(Math.random() * 5) - 1);

      const scheduledDate = new Date(requestedDate);
      scheduledDate.setDate(scheduledDate.getDate() + 1);

      let customerAttendance = 'Pending';
      let customerFeedback = '';
      let completedDate = null;
      let nextFollowUp = null;

      if (status === 'Completed') {
        customerAttendance = Math.random() > 0.3 ? 'Attended' : 'Not Attended';
        customerFeedback = feedbacks[Math.floor(Math.random() * feedbacks.length)];
        completedDate = new Date(visitDate);
        completedDate.setDate(completedDate.getDate() + 1);
        if (Math.random() > 0.5) {
          nextFollowUp = new Date(now);
          nextFollowUp.setDate(nextFollowUp.getDate() + Math.floor(Math.random() * 14) + 1);
        }
      } else if (status === 'Cancelled') {
        customerAttendance = 'Pending';
      } else if (status === 'Scheduled') {
        customerAttendance = Math.random() > 0.5 ? 'Pending' : 'Rescheduled';
      }

      const mobileNum = `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`;
      const visitTime = `${String(Math.floor(Math.random() * 8) + 9).padStart(2, '0')}:${Math.random() > 0.5 ? '00' : '30'}`;

      list.push({
        id: `visit_${i}`,
        visitId: `VISIT-${String(i).padStart(5, '0')}`,
        leadId: `LEAD-${String(Math.floor(Math.random() * 9000) + 1000).padStart(5, '0')}`,
        customerName,
        customerId: `CUST-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}`,
        mobileNumber: mobileNum,
        propertyName,
        propertyType,
        propertyLocation,
        propertyId: `PROP-${String(Math.floor(Math.random() * 9000) + 1000).padStart(5, '0')}`, // Added Property ID
        requestedDate: requestedDate.toISOString(),
        scheduledDate: scheduledDate.toISOString(),
        visitDate: visitDate.toISOString(),
        visitTime,
        assignedExecutive,
        status,
        customerAttendance,
        customerFeedback,
        feedbackRating: status === 'Completed' ? Math.floor(Math.random() * 3) + 3 : 0,
        completedDate: completedDate ? completedDate.toISOString() : null,
        nextFollowUp: nextFollowUp ? nextFollowUp.toISOString() : null,
        notes: Math.random() > 0.7 ? 'Customer requested morning slot.' : ''
      });
    }

    computeStats(list);
    return list;
  }, [computeStats]);

  // INIT
  useEffect(() => {
    try {
      const mockVisits = generateMockVisits();
      setVisits(mockVisits);
      setFilteredVisits(mockVisits);
    } catch (error) {
      console.error('Error generating mock visits:', error);
    }
  }, [generateMockVisits]);

  // FILTER
  const filterVisits = useCallback(() => {
    try {
      let filtered = [...visits];

      // DATE RANGE FILTER
      if (dateRange !== 'all') {
        const { start, end } = getDateRangeBounds(dateRange, customStartDate, customEndDate);
        if (start && end) {
          filtered = filtered.filter(v => {
            const d = new Date(v.visitDate);
            return d >= start && d <= end;
          });
        }
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(v =>
          (v.visitId && v.visitId.toLowerCase().includes(query)) ||
          (v.customerName && v.customerName.toLowerCase().includes(query)) ||
          (v.mobileNumber && v.mobileNumber.toLowerCase().includes(query)) ||
          (v.propertyName && v.propertyName.toLowerCase().includes(query)) ||
          (v.propertyLocation && v.propertyLocation.toLowerCase().includes(query)) ||
          (v.assignedExecutive && v.assignedExecutive.toLowerCase().includes(query)) ||
          (v.status && v.status.toLowerCase().includes(query)) ||
          (v.propertyType && v.propertyType.toLowerCase().includes(query))
        );
      }

      if (activeStatus !== 'all') filtered = filtered.filter(v => v.status === activeStatus);
      if (activeAttendance !== 'all') filtered = filtered.filter(v => v.customerAttendance === activeAttendance);
      if (activePropertyType !== 'all') filtered = filtered.filter(v => v.propertyType === activePropertyType);

      let count = 0;
      if (dateRange !== 'all') count++;
      if (activeStatus !== 'all') count++;
      if (activeAttendance !== 'all') count++;
      if (activePropertyType !== 'all') count++;
      if (searchQuery) count++;
      setFilterCount(count);

      filtered.sort((a, b) => {
        let aVal = a[sortField] || '';
        let bVal = b[sortField] || '';
        if (sortField === 'visitDate' || sortField === 'requestedDate' || sortField === 'scheduledDate' || sortField === 'nextFollowUp') {
          aVal = aVal ? new Date(aVal).getTime() : 0;
          bVal = bVal ? new Date(bVal).getTime() : 0;
        } else if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase(); bVal = bVal.toLowerCase();
        }
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });

      setFilteredVisits(filtered);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error filtering visits:', error);
    }
  }, [visits, searchQuery, activeStatus, activeAttendance, activePropertyType, sortField, sortDirection, dateRange, customStartDate, customEndDate]);

  useEffect(() => { filterVisits(); }, [filterVisits]);

  // PAGINATION
  const totalPages = Math.max(1, Math.ceil(filteredVisits.length / pageSize));
  const paginatedVisits = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredVisits.slice(start, start + pageSize);
  }, [filteredVisits, currentPage, pageSize]);

  const handleSort = useCallback((field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);

  const handleSelectAll = useCallback(() => {
    if (selectedVisits.length === paginatedVisits.length && paginatedVisits.length > 0) {
      setSelectedVisits([]);
    } else {
      setSelectedVisits(paginatedVisits.map(v => v.id));
    }
  }, [selectedVisits, paginatedVisits]);

  const handleSelectVisit = useCallback((visitId) => {
    setSelectedVisits(prev => prev.includes(visitId) ? prev.filter(id => id !== visitId) : [...prev, visitId]);
  }, []);

  const handleViewVisit = useCallback((visit) => {
    setViewingVisit(visit);
    setShowViewModal(true);
  }, []);

  const handleEditVisit = useCallback((visit) => {
    setEditingVisit(visit);
    setShowEditModal(true);
  }, []);

  const handleSaveVisit = useCallback((updatedVisit) => {
    setVisits(prev => {
      const updated = prev.map(v => v.id === updatedVisit.id ? updatedVisit : v);
      computeStats(updated);
      return updated;
    });
    setToast({ message: `Visit "${updatedVisit.visitId}" updated successfully`, type: 'success' });
  }, [computeStats]);

  const handleDeleteVisit = useCallback((visitId) => {
    const visit = visits.find(v => v.id === visitId);
    if (!visit) return;

    setConfirmationModal({
      isOpen: true,
      title: 'Delete Site Visit',
      message: `Are you sure you want to delete visit "${visit.visitId}" for ${visit.customerName}?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: () => {
        setActionLoading(visitId);
        setTimeout(() => {
          setVisits(prev => {
            const updated = prev.filter(v => v.id !== visitId);
            computeStats(updated);
            return updated;
          });
          setActionLoading(null);
          setShowViewModal(false);
          setToast({ message: `Deleted visit "${visit.visitId}"`, type: 'warning' });
        }, 700);
      },
      onCancel: () => setConfirmationModal(prev => ({ ...prev, isOpen: false }))
    });
  }, [visits, computeStats]);

  const handleRescheduleVisit = useCallback((visitId, { visitDate, visitTime, reason, status }) => {
    setVisits(prev => {
      const updated = prev.map(v =>
        v.id === visitId
          ? {
              ...v,
              visitDate: `${visitDate}T00:00:00`,
              visitTime,
              status,
              customerAttendance: 'Rescheduled',
              notes: reason ? `Rescheduled: ${reason}` : v.notes
            }
          : v
      );
      computeStats(updated);
      return updated;
    });
    setToast({ message: `Visit rescheduled to ${formatDate(visitDate)}`, type: 'success' });
  }, [computeStats]);

  const handleCancelVisit = useCallback((visitId, { reason, status }) => {
    setVisits(prev => {
      const updated = prev.map(v =>
        v.id === visitId
          ? {
              ...v,
              status,
              notes: reason ? `Cancelled: ${reason}` : v.notes
            }
          : v
      );
      computeStats(updated);
      return updated;
    });
    setToast({ message: 'Visit cancelled successfully', type: 'warning' });
  }, [computeStats]);

  const handleMarkCompleted = useCallback((visitId, { customerAttendance, completionNotes, status }) => {
    setVisits(prev => {
      const updated = prev.map(v =>
        v.id === visitId
          ? {
              ...v,
              status,
              customerAttendance,
              completedDate: new Date().toISOString(),
              notes: completionNotes ? `${v.notes || ''} ${completionNotes}`.trim() : v.notes
            }
          : v
      );
      computeStats(updated);
      return updated;
    });
    setToast({ message: 'Visit marked as completed', type: 'success' });
  }, [computeStats]);

  const handleAddFeedback = useCallback((visitId, { customerFeedback, feedbackRating }) => {
    setVisits(prev => {
      const updated = prev.map(v =>
        v.id === visitId
          ? { ...v, customerFeedback, feedbackRating }
          : v
      );
      computeStats(updated);
      return updated;
    });
    setToast({ message: 'Feedback added successfully', type: 'success' });
  }, [computeStats]);

  const handleAddFollowUp = useCallback((visitId, { nextFollowUp, followUpNote }) => {
    setVisits(prev => {
      const updated = prev.map(v =>
        v.id === visitId
          ? {
              ...v,
              nextFollowUp,
              notes: followUpNote ? `Follow-up: ${followUpNote}` : v.notes
            }
          : v
      );
      computeStats(updated);
      return updated;
    });
    setToast({ message: 'Follow-up added successfully', type: 'success' });
  }, [computeStats]);

  const handleAssignExecutive = useCallback((visitId, executive) => {
    setVisits(prev => {
      const updated = prev.map(v =>
        v.id === visitId ? { ...v, assignedExecutive: executive.name } : v
      );
      computeStats(updated);
      return updated;
    });
    setToast({ message: `Executive assigned: ${executive.name} (${executive.role})`, type: 'success' });
  }, [computeStats]);

  const handleNavigateToProperty = useCallback((propertyId) => {
    setShowViewModal(false);
    setViewingVisit(null);
    navigate(`/properties/${propertyId}`);
  }, [navigate]);

  const handleVisitAction = useCallback((actionId, visit) => {
    switch (actionId) {
      case 'view-property':
        // Use the Property ID from visit object
        handleNavigateToProperty(visit.propertyId);
        break;

      case 'reschedule':
        setRescheduleVisit(visit);
        setShowRescheduleModal(true);
        break;

      case 'cancel':
        setCancelVisit(visit);
        setShowCancelModal(true);
        break;

      case 'mark-completed':
        setCompletedVisit(visit);
        setShowCompletedModal(true);
        break;

      case 'add-feedback':
        setFeedbackVisit(visit);
        setShowFeedbackModal(true);
        break;

      case 'add-followup':
        setFollowUpVisit(visit);
        setShowFollowUpModal(true);
        break;

      case 'assign-executive':
        setAssignVisit(visit);
        setShowAssignModal(true);
        break;

      default:
        break;
    }
  }, [handleNavigateToProperty]);

  const handleStatusClick = useCallback((status) => {
    setActiveStatus(prev => (prev === status ? 'all' : status));
    if (searchInputRef.current) searchInputRef.current.focus();
  }, []);

  const handleTotalClick = useCallback(() => {
    setActiveStatus('all');
    setActiveAttendance('all');
    setActivePropertyType('all');
    setSearchQuery('');
    setDateRange('all');
    setCustomStartDate('');
    setCustomEndDate('');
    if (searchInputRef.current) searchInputRef.current.focus();
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setActiveStatus('all');
    setActiveAttendance('all');
    setActivePropertyType('all');
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
        const mockVisits = generateMockVisits();
        setVisits(mockVisits);
        setFilteredVisits(mockVisits);
        setToast({ message: 'Data refreshed successfully', type: 'success' });
      } catch (error) {
        console.error('Error refreshing data:', error);
        setToast({ message: 'Error refreshing data', type: 'error' });
      }
      setLoading(false);
    }, 1000);
  }, [generateMockVisits]);

  const handleExport = useCallback(() => {
    if (filteredVisits.length === 0) {
      setToast({ message: 'No data to export', type: 'warning' });
      return;
    }
    try {
      const data = filteredVisits.map(v => ({
        'Visit ID': v.visitId || '',
        'Customer': v.customerName || '',
        'Mobile': v.mobileNumber || '',
        'Property': v.propertyName || '',
        'Property Location': v.propertyLocation || '',
        'Property Type': v.propertyType || '',
        'Visit Date': v.visitDate ? formatDate(v.visitDate) : '',
        'Visit Time': v.visitTime || '',
        'Assigned Executive': v.assignedExecutive || 'Unassigned',
        'Customer Attendance': v.customerAttendance || '',
        'Visit Status': v.status || '',
        'Customer Feedback': v.customerFeedback || '',
        'Next Follow-Up': v.nextFollowUp ? new Date(v.nextFollowUp).toLocaleString('en-IN') : ''
      }));

      const csv = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).map(val => `"${val}"`).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `site_visits_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      setToast({ message: `${filteredVisits.length} visits exported successfully`, type: 'success' });
    } catch (error) {
      console.error('Error exporting data:', error);
      setToast({ message: 'Error exporting data', type: 'error' });
    }
  }, [filteredVisits]);

  const handleBulkDelete = useCallback(() => {
    if (selectedVisits.length === 0) {
      setToast({ message: 'Please select visits first', type: 'warning' });
      return;
    }
    setConfirmationModal({
      isOpen: true,
      title: 'Delete Selected Visits',
      message: `Are you sure you want to delete ${selectedVisits.length} selected visit(s)?`,
      confirmText: 'Delete All',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: () => {
        setActionLoading('bulk-delete');
        setTimeout(() => {
          const selectedIds = new Set(selectedVisits);
          const count = visits.filter(v => selectedIds.has(v.id)).length;
          const updated = visits.filter(v => !selectedIds.has(v.id));
          setVisits(updated);
          computeStats(updated);
          setSelectedVisits([]);
          setActionLoading(null);
          setToast({ message: `${count} visit(s) deleted`, type: 'warning' });
        }, 800);
      },
      onCancel: () => setConfirmationModal(prev => ({ ...prev, isOpen: false }))
    });
  }, [selectedVisits, visits, computeStats]);

  const statusOptions = ALL_SITE_VISIT_STATUSES.map(status => ({ value: status, label: SITE_VISIT_STATUS_TYPES[status].label }));
  const attendanceOptions = ALL_ATTENDANCE_TYPES.map(att => ({ value: att, label: ATTENDANCE_TYPES[att].label }));
  const propertyTypeOptions = ALL_PROPERTY_TYPES.map(type => ({ value: type, label: type }));

  const LIST_COLUMNS = [
    { key: 'visitId', label: 'Visit ID', sortable: true },
    { key: 'customerName', label: 'Customer', sortable: true },
    { key: 'propertyName', label: 'Property', sortable: true },
    { key: 'propertyLocation', label: 'Location', sortable: true },
    { key: 'visitDate', label: 'Visit Date', sortable: true },
    { key: 'visitTime', label: 'Visit Time', sortable: true },
    { key: 'assignedExecutive', label: 'Executive', sortable: true },
    { key: 'customerAttendance', label: 'Attendance', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
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

      <RescheduleVisitModal
        visit={rescheduleVisit}
        show={showRescheduleModal}
        onClose={() => { setShowRescheduleModal(false); setRescheduleVisit(null); }}
        onSave={handleRescheduleVisit}
      />

      <CancelVisitModal
        visit={cancelVisit}
        show={showCancelModal}
        onClose={() => { setShowCancelModal(false); setCancelVisit(null); }}
        onSave={handleCancelVisit}
      />

      <MarkCompletedModal
        visit={completedVisit}
        show={showCompletedModal}
        onClose={() => { setShowCompletedModal(false); setCompletedVisit(null); }}
        onSave={handleMarkCompleted}
      />

      <AddFeedbackModal
        visit={feedbackVisit}
        show={showFeedbackModal}
        onClose={() => { setShowFeedbackModal(false); setFeedbackVisit(null); }}
        onSave={handleAddFeedback}
      />

      <AddFollowUpModal
        visit={followUpVisit}
        show={showFollowUpModal}
        onClose={() => { setShowFollowUpModal(false); setFollowUpVisit(null); }}
        onSave={handleAddFollowUp}
      />

      <AssignExecutiveModal
        visit={assignVisit}
        show={showAssignModal}
        onClose={() => { setShowAssignModal(false); setAssignVisit(null); }}
        onAssign={handleAssignExecutive}
      />

      {showViewModal && viewingVisit && (
        <ViewVisitDetailModal
          visit={viewingVisit}
          show={showViewModal}
          onClose={() => { setShowViewModal(false); setViewingVisit(null); }}
          onEdit={handleEditVisit}
          onDelete={handleDeleteVisit}
          onAction={handleVisitAction}
        />
      )}

      {showEditModal && editingVisit && (
        <EditVisitModal
          visit={editingVisit}
          show={showEditModal}
          onClose={() => { setShowEditModal(false); setEditingVisit(null); }}
          onSave={handleSaveVisit}
        />
      )}

      {/* Header */}
      <div className="relative z-[30] animate-fade-in">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                Site Visit Management
              </h1>
              <span className="px-3 py-1 bg-[#E8F4F2] text-[#00695C] text-xs font-semibold rounded-full animate-pulse">
                {filteredVisits.length} Visits
              </span>
              {filterCount > 0 && (
                <span className="px-3 py-1 bg-[#FEF3E2] text-amber-700 text-xs font-semibold rounded-full">
                  {filterCount} filters
                </span>
              )}
            </div>
            <p className="text-sm text-[#5A7D78] flex items-center gap-2 flex-wrap">
              <span>Track and manage all property site visits</span>
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
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              <StatCard icon={<FiNavigation className="text-white text-sm" />} title="Total Visits" value={stats.total} color="bg-gradient-to-br from-[#00695C] to-[#26A69A]" delay={0} isActive={filterCount === 0} onClick={handleTotalClick} />
              <StatCard icon={<FiSend className="text-white text-sm" />} title="Requested" value={stats.Requested} color="bg-gradient-to-br from-amber-600 to-amber-400" delay={40} isActive={activeStatus === 'Requested'} onClick={() => handleStatusClick('Requested')} />
              <StatCard icon={<FiCalendar className="text-white text-sm" />} title="Scheduled" value={stats.Scheduled} color="bg-gradient-to-br from-blue-600 to-blue-400" delay={80} isActive={activeStatus === 'Scheduled'} onClick={() => handleStatusClick('Scheduled')} />
              <StatCard icon={<FiCheckCircle className="text-white text-sm" />} title="Completed" value={stats.Completed} color="bg-gradient-to-br from-emerald-600 to-emerald-400" delay={120} isActive={activeStatus === 'Completed'} onClick={() => handleStatusClick('Completed')} />
              <StatCard icon={<FiXCircle className="text-white text-sm" />} title="Cancelled" value={stats.Cancelled} color="bg-gradient-to-br from-red-600 to-red-400" delay={160} isActive={activeStatus === 'Cancelled'} onClick={() => handleStatusClick('Cancelled')} />
              
              {/* REMOVED ATTENDED, NOT ATTENDED, PENDING ATTENDANCE CARDS HERE */}

              <StatCard icon={<FiCalendar className="text-white text-sm" />} title="Today's Visits" value={stats.todayVisits} color="bg-gradient-to-br from-lime-600 to-lime-400" delay={320} isActive={false} onClick={() => {}} />
              <StatCard icon={<FiTrendingUp className="text-white text-sm" />} title="This Month's Visits" value={stats.monthVisits} color="bg-gradient-to-br from-sky-600 to-sky-400" delay={360} isActive={false} onClick={() => {}} />
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
              placeholder="Search by visit ID, customer, property, location, executive..."
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
            <FilterDropdown label="Attendance" options={attendanceOptions} value={activeAttendance} onChange={setActiveAttendance} icon={FiUserCheck} allLabel="All Attendance" />
            <FilterDropdown label="Property" options={propertyTypeOptions} value={activePropertyType} onChange={setActivePropertyType} icon={FiHomeIcon} allLabel="All Property Types" />

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

        {selectedVisits.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#E8F0EE] flex flex-wrap items-center justify-between gap-3 animate-slide-in">
            <span className="text-sm text-[#5A7D78]">
              <span className="font-semibold text-[#00695C]">{selectedVisits.length}</span> visit(s) selected
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
                onClick={() => setSelectedVisits([])}
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
            {paginatedVisits.map((visit, index) => {
              const isSelected = selectedVisits.includes(visit.id);
              const statusConfig = SITE_VISIT_STATUS_TYPES[visit.status] || SITE_VISIT_STATUS_TYPES['Requested'];
              const StatusIcon = statusConfig.icon;
              const attendanceConfig = ATTENDANCE_TYPES[visit.customerAttendance] || ATTENDANCE_TYPES['Pending'];
              const AttendanceIcon = attendanceConfig.icon;
              const propTypeConfig = PROPERTY_TYPE_CONFIG[visit.propertyType] || PROPERTY_TYPE_CONFIG['Individual'];

              return (
                <div
                  key={visit.id}
                  className={`bg-white rounded-2xl border border-[#E8F0EE] p-3.5 hover:shadow-xl hover:-translate-y-1 group animate-slide-in transition-all duration-500 ${isSelected ? 'ring-2 ring-[#00695C] shadow-lg' : ''}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-2 gap-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectVisit(visit.id)}
                        className="w-4 h-4 shrink-0 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                      />
                      <div className={`w-9 h-9 rounded-2xl bg-gradient-to-br ${statusConfig.color} flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
                        <StatusIcon className="text-sm" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm text-[#1A2E2A] truncate">{visit.customerName}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <p className="text-[10px] font-medium text-[#5A7D78]">{visit.visitId}</p>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold leading-none ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                            {statusConfig.label}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold leading-none flex items-center gap-0.5 ${attendanceConfig.bg} ${attendanceConfig.text} border ${attendanceConfig.border}`}>
                            <AttendanceIcon className="text-[8px]" />
                            {attendanceConfig.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-[#5A7D78]">
                      <FiPhone className="text-[#00695C] flex-shrink-0" />
                      <span className="font-medium break-words">{visit.mobileNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#5A7D78] flex-wrap">
                      <FiHomeIcon className="text-[#00695C] flex-shrink-0" />
                      <span className="font-medium break-words">{visit.propertyName}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold leading-none ${propTypeConfig.bg} ${propTypeConfig.text} border ${propTypeConfig.border}`}>
                        {visit.propertyType}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#5A7D78] flex-wrap">
                      <FiMap className="text-[#00695C] flex-shrink-0" />
                      <span className="font-medium break-words">{visit.propertyLocation}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#5A7D78] flex-wrap">
                      <FiCalendar className="text-[#00695C] flex-shrink-0" />
                      <span className="font-medium">{formatDate(visit.visitDate)}</span>
                      <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
                      <FiClock className="text-[#00695C] flex-shrink-0" />
                      <span className="font-medium">{formatTime(visit.visitTime)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#5A7D78] flex-wrap">
                      <FiUserCheck className="text-[#00695C] flex-shrink-0" />
                      <span className="font-medium">{visit.assignedExecutive || 'Unassigned'}</span>
                    </div>
                    {visit.nextFollowUp && (
                      <div className="flex items-center gap-2 text-xs text-indigo-700 bg-indigo-50 rounded-lg px-2 py-1">
                        <FiCalendar className="flex-shrink-0" />
                        <span className="font-medium truncate">
                          Follow-up: {formatDate(visit.nextFollowUp)}
                        </span>
                      </div>
                    )}
                    {visit.customerFeedback && (
                      <div className="flex items-start gap-2 text-xs text-cyan-700 bg-cyan-50 rounded-lg px-2 py-1">
                        <FiMessageCircle className="flex-shrink-0 mt-0.5" />
                        <span className="font-medium line-clamp-2">{visit.customerFeedback}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2.5 pt-2.5 border-t border-[#E8F0EE]">
                    <button
                      type="button"
                      onClick={() => handleViewVisit(visit)}
                      className="flex-1 py-1.5 text-xs font-semibold text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiEye className="text-[10px]" /> View
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditVisit(visit)}
                      className="flex-1 py-1.5 text-xs font-semibold text-[#26A69A] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiEdit className="text-[10px]" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteVisit(visit.id)}
                      disabled={actionLoading === visit.id}
                      className="flex-1 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50"
                    >
                      {actionLoading === visit.id ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiTrash2 className="text-[10px]" />}
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
                <col style={{ width: '10%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '8%' }} />
                <col style={{ width: '7%' }} />
                <col style={{ width: '9%' }} />
                <col style={{ width: '8%' }} />
                <col style={{ width: '8%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '9%' }} />
              </colgroup>
              <thead>
                <tr className="bg-[#F5F9F8] border-b border-[#E8F0EE]">
                  <th className="px-2 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedVisits.length === paginatedVisits.length && paginatedVisits.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                    />
                  </th>
                  {LIST_COLUMNS.map(col => (
                    <th
                      key={col.key}
                      onClick={() => col.sortable && handleSort(col.key)}
                      className="px-2 py-3 text-left text-[12px] font-semibold text-[#5A7D78] uppercase tracking-wider cursor-pointer hover:text-[#00695C] transition-colors select-none truncate"
                      title={col.label}
                    >
                      {col.label} {sortField === col.key && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                    </th>
                  ))}
                  <th className="px-2 py-3  text-[12px] font-semibold text-[#5A7D78] uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedVisits.map((visit) => {
                  const isSelected = selectedVisits.includes(visit.id);
                  const statusConfig = SITE_VISIT_STATUS_TYPES[visit.status] || SITE_VISIT_STATUS_TYPES['Requested'];
                  const StatusIcon = statusConfig.icon;
                  const attendanceConfig = ATTENDANCE_TYPES[visit.customerAttendance] || ATTENDANCE_TYPES['Pending'];
                  const AttendanceIcon = attendanceConfig.icon;
                  const propTypeConfig = PROPERTY_TYPE_CONFIG[visit.propertyType] || PROPERTY_TYPE_CONFIG['Individual'];

                  return (
                    <tr
                      key={visit.id}
                      className={`border-b border-[#E8F0EE] hover:bg-[#F5F9F8] transition-colors duration-200 ${isSelected ? 'bg-[#E8F4F2]' : ''}`}
                    >
                      <td className="px-2 py-2.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectVisit(visit.id)}
                          className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                        />
                      </td>
                      <td className="px-2 py-2.5 overflow-hidden" title={visit.visitId}>
                        <span className="flex items-center gap-1.5 text-xs font-bold text-[#00695C]">
                          <span className={`w-4 h-4 rounded-full bg-gradient-to-br ${statusConfig.color} flex items-center justify-center text-white flex-shrink-0`}>
                            <StatusIcon className="text-[8px]" />
                          </span>
                          <span className="truncate">{visit.visitId}</span>
                        </span>
                      </td>
                      <td className="px-2 py-2.5 text-sm font-bold text-[#1A2E2A] truncate" title={visit.customerName}>{visit.customerName}</td>
                      <td className="px-2 py-2.5 text-xs font-medium text-[#5A7D78] truncate" title={visit.propertyName}>{visit.propertyName}</td>
                      <td className="px-2 py-2.5 text-xs font-medium text-[#5A7D78] truncate" title={visit.propertyLocation}>{visit.propertyLocation}</td>
                      <td className="px-2 py-2.5 text-xs font-medium text-[#5A7D78] truncate">{formatDate(visit.visitDate)}</td>
                      <td className="px-2 py-2.5 text-xs font-medium text-[#5A7D78] truncate">{formatTime(visit.visitTime)}</td>
                      <td className="px-2 py-2.5 text-xs font-medium text-[#5A7D78] truncate">{visit.assignedExecutive || 'Unassigned'}</td>
                      <td className="px-2 py-2.5 overflow-hidden">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold whitespace-nowrap flex items-center gap-0.5 ${attendanceConfig.bg} ${attendanceConfig.text} border ${attendanceConfig.border}`}>
                          <AttendanceIcon className="text-[8px]" />
                          {attendanceConfig.label}
                        </span>
                      </td>
                      <td className="px-2 py-2.5 overflow-hidden">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold whitespace-nowrap ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-2 py-2.5 overflow-hidden">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold whitespace-nowrap ${propTypeConfig.bg} ${propTypeConfig.text} border ${propTypeConfig.border}`}>
                          {visit.propertyType}
                        </span>
                      </td>
                      <td className="px-2 py-2.5">
                        <div className="flex items-center justify-end gap-1.5">
                          <button type="button" onClick={() => handleViewVisit(visit)} className="w-7 h-7 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 flex items-center justify-center text-[#00695C] hover:scale-110" title="View">
                            <FiEye className="text-sm" />
                          </button>
                          <button type="button" onClick={() => handleEditVisit(visit)} className="w-7 h-7 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 flex items-center justify-center text-[#26A69A] hover:scale-110" title="Edit">
                            <FiEdit className="text-sm" />
                          </button>
                          <button type="button" onClick={() => handleDeleteVisit(visit.id)} disabled={actionLoading === visit.id} className="w-7 h-7 rounded-lg hover:bg-red-50 transition-all duration-300 flex items-center justify-center text-red-600 hover:scale-110 disabled:opacity-50" title="Delete">
                            {actionLoading === visit.id ? <FiRefreshCw className="text-xs animate-spin" /> : <FiTrash2 className="text-sm" />}
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

        {paginatedVisits.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E8F0EE]">
            <div className="w-24 h-24 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4 animate-float">
              <FiNavigation className="text-4xl text-[#B5C9C5]" />
            </div>
            <h3 className="text-xl font-bold text-[#1A2E2A]">No site visits found</h3>
            <p className="text-sm text-[#5A7D78] mt-1">
              {filterCount > 0 ? 'Try adjusting your search or filter criteria' : 'No site visit records have been added yet'}
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
              {Math.min(currentPage * pageSize, filteredVisits.length)} of{' '}
              {filteredVisits.length} visits
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

export default SiteVisitManagement;