// src/components/admin/Payments/PaymentReconciliation.jsx

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  FiSearch, FiChevronDown, FiChevronLeft, FiChevronRight, FiEye, FiEdit,
  FiTrash2, FiRefreshCw, FiDownload, FiAlertTriangle, FiInfo, FiX, FiList,
  FiGrid as FiGridIcon, FiTag, FiSave, FiHash,
  FiChevronUp, FiCheckCircle, FiXCircle, FiBriefcase,
  FiActivity, FiUser, FiCreditCard, FiClock,
  FiDollarSign, FiCalendar, FiHome, FiPercent,
  FiClipboard, FiLayers, FiMapPin, FiMail, FiPhone,
  FiTrendingUp, FiTrendingDown, FiShield, FiPackage, FiAward
} from 'react-icons/fi';
import { FaHome, FaHotel, FaHardHat } from 'react-icons/fa';

// ============================================================
// PERSON ROLE CONFIG (Owner / Agent / Builder / Property Manager)
// ============================================================
const PERSON_ROLE_CONFIG = {
  'Owner':            { icon: FaHome,      bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', gradient: 'from-emerald-600 to-emerald-400' },
  'Agent':            { icon: FiBriefcase, bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200',    gradient: 'from-blue-600 to-blue-400' },
  'Builder':          { icon: FaHardHat,   bg: 'bg-orange-50',  text: 'text-orange-700',  border: 'border-orange-200',  gradient: 'from-orange-600 to-orange-400' },
  'Property Manager': { icon: FiClipboard, bg: 'bg-purple-50',  text: 'text-purple-700',  border: 'border-purple-200',  gradient: 'from-purple-600 to-purple-400' }
};
const ALL_PERSON_ROLES = Object.keys(PERSON_ROLE_CONFIG);

// ============================================================
// PROPERTY TYPE CONFIG (for a person's uploaded properties)
// ============================================================
const PROPERTY_TYPE_CONFIG = {
  'Individual':   { icon: FiUser,      bg: 'bg-slate-50',   text: 'text-slate-700',   border: 'border-slate-200' },
  'Apartment':    { icon: FaHome,      bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Commercial':   { icon: FiBriefcase, bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200' },
  'Land & Plots': { icon: FiClipboard, bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200' },
  'Hostel':       { icon: FaHotel,     bg: 'bg-pink-50',    text: 'text-pink-700',    border: 'border-pink-200' }
};
const ALL_PROPERTY_TYPES = Object.keys(PROPERTY_TYPE_CONFIG);

// ============================================================
// PROPERTY LISTING STATUS CONFIG (status of each uploaded property)
// ============================================================
const PROPERTY_STATUS_CONFIG = {
  'Active':   { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Inactive': { bg: 'bg-slate-50',   text: 'text-slate-700',   border: 'border-slate-200' },
  'Sold':     { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200' },
  'Rented':   { bg: 'bg-purple-50',  text: 'text-purple-700',  border: 'border-purple-200' }
};
const ALL_PROPERTY_STATUSES = Object.keys(PROPERTY_STATUS_CONFIG);

// ============================================================
// SUBSCRIPTION PLANS — different plan ladder per person role
// ============================================================
const SUBSCRIPTION_PLANS_BY_ROLE = {
  'Owner':            ['Free', 'Silver', 'Gold', 'Platinum'],
  'Agent':            ['Basic', 'Professional', 'Enterprise'],
  'Builder':          ['Builder Basic', 'Builder Premium', 'Enterprise Builder'],
  'Property Manager': ['Standard', 'Business', 'Enterprise']
};

// Tier styling by position in that role's plan ladder (entry -> top)
const SUBSCRIPTION_TIER_STYLES = [
  { bg: 'bg-slate-50',  text: 'text-slate-700',  border: 'border-slate-200' },
  { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200' },
  { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200' }
];

const getSubscriptionStyle = (role, plan) => {
  const ladder = SUBSCRIPTION_PLANS_BY_ROLE[role] || [];
  const idx = ladder.indexOf(plan);
  return SUBSCRIPTION_TIER_STYLES[idx] || SUBSCRIPTION_TIER_STYLES[0];
};

// Summarize the distinct property types a person has uploaded, e.g.
// "Apartment, Commercial +2 more" — used in the person basic-details card.
const getPropertyTypesSummary = (properties) => {
  const types = [...new Set((properties || []).map(p => p.type))];
  if (types.length === 0) return '—';
  if (types.length <= 2) return types.join(', ');
  return `${types.slice(0, 2).join(', ')} +${types.length - 2} more`;
};

// ============================================================
// SETTLEMENT STATUS CONFIG
// ============================================================
const SETTLEMENT_STATUS_TYPES = {
  'Settled':    { icon: FiCheckCircle, color: 'from-emerald-600 to-emerald-400', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Settled' },
  'Pending':    { icon: FiClock,       color: 'from-amber-600 to-amber-400',     bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   label: 'Pending' },
  'Processing': { icon: FiRefreshCw,   color: 'from-blue-600 to-blue-400',       bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200',    label: 'Processing' },
  'Failed':     { icon: FiXCircle,     color: 'from-red-600 to-red-400',         bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200',     label: 'Failed' }
};
const ALL_SETTLEMENT_STATUSES = Object.keys(SETTLEMENT_STATUS_TYPES);

// ============================================================
// CURRENCY FORMAT HELPER
// ============================================================
const formatCurrency = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;

// ============================================================
// NET SETTLEMENT HELPER
// ------------------------------------------------------------
// Net Settlement = Gross Gateway Collections
//                  - Gateway Charges
//                  - GST / Tax
//                  - Refunds
//                  - Discounts
//                  - Platform Revenue (platform's own commission)
// This is the single source of truth used everywhere (grid, list,
// view modal, edit modal live-total, export) so every screen always
// agrees on the settlement figure.
// ============================================================
const computeNetSettlement = (rec) => {
  const gross = Number(rec?.grossCollections || 0);
  const gatewayCharges = Number(rec?.gatewayCharges || 0);
  const gstTax = Number(rec?.gstTax || 0);
  const refunds = Number(rec?.refunds || 0);
  const discounts = Number(rec?.discounts || 0);
  const platformRevenue = Number(rec?.platformRevenue || 0);
  const net = gross - gatewayCharges - gstTax - refunds - discounts - platformRevenue;
  return { gross, gatewayCharges, gstTax, refunds, discounts, platformRevenue, net: Math.max(0, net) };
};

// ============================================================
// TOAST COMPONENT
// ============================================================
const Toast = ({ toast, setToast }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
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
    danger:  { icon: 'text-red-600',   bg: 'bg-red-50',   button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',     border: 'border-red-200' },
    warning: { icon: 'text-amber-600', bg: 'bg-amber-50', button: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500', border: 'border-amber-200' },
    info:    { icon: 'text-blue-600',  bg: 'bg-blue-50',  button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',   border: 'border-blue-200' }
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
        className={`flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border transition-all duration-300 text-sm font-medium text-[#1A2E2A] hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap ${
          value !== 'all' ? 'border-[#00695C] ring-2 ring-[#00695C]/20 bg-[#F5F9F8]' : 'border-[#E8F0EE] hover:border-[#00695C]/30'
        }`}
      >
        {Icon && <Icon className="text-sm text-[#5A7D78]" />}
        <span className="whitespace-nowrap">{label}:</span>
        <span className="font-semibold text-[#00695C]">{displayLabel}</span>
        <FiChevronDown className={`text-sm text-[#5A7D78] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && !disabled && (
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
// LINE ITEM ROW (for the financial breakdown list)
// ============================================================
const LineItem = ({ icon: Icon, label, value, tone = 'default', sub }) => {
  const toneCls = {
    default: 'text-[#1A2E2A]',
    negative: 'text-red-600',
    positive: 'text-emerald-700'
  }[tone];
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-[#E8F0EE] last:border-b-0">
      <div className="flex items-center gap-2 min-w-0">
        <Icon className="text-[#00695C] text-sm flex-shrink-0" />
        <div className="min-w-0">
          <p className="text-sm text-[#1A2E2A] font-medium truncate">{label}</p>
          {sub && <p className="text-[11px] text-[#5A7D78] truncate">{sub}</p>}
        </div>
      </div>
      <span className={`text-sm font-bold whitespace-nowrap ${toneCls}`}>{value}</span>
    </div>
  );
};

// ============================================================
// VIEW RECONCILIATION DETAIL MODAL
// ============================================================
const ViewReconciliationModal = ({ record, person, show, onClose, onEdit, onDelete, onOpenProperties }) => {
  if (!record || !person || !show) return null;

  const roleConfig = PERSON_ROLE_CONFIG[person.role] || PERSON_ROLE_CONFIG['Owner'];
  const RoleIcon = roleConfig.icon;
  const statusConfig = SETTLEMENT_STATUS_TYPES[record.settlementStatus] || SETTLEMENT_STATUS_TYPES['Pending'];
  const StatusIcon = statusConfig.icon;
  const fin = computeNetSettlement(record);
  const subStyle = getSubscriptionStyle(person.role, person.subscriptionPlan);

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
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${roleConfig.gradient} border-2 border-white/30 flex items-center justify-center text-2xl text-white shadow-lg`}>
              <RoleIcon />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{record.settlementId}</h2>
              <p className="text-white/80 text-sm flex items-center gap-2 flex-wrap mt-1">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                  {statusConfig.label}
                </span>
                <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                <span>Rec ID: {record.id}</span>
                <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                <span className="font-semibold">Net: {formatCurrency(fin.net)}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-white/20 text-white border border-white/30">
              <RoleIcon className="text-xs" /> {person.role}: {person.name}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-white/20 text-white border border-white/30">
              <FiCalendar className="text-xs" /> {new Date(record.settlementDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-white/20 text-white border border-white/30">
              <FiPackage className="text-xs" /> {person.properties.length} Properties
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white space-y-5">
          {/* Person basic details */}
          <div className="bg-[#F5F9F8] rounded-2xl p-4">
            <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
              <FiUser className="text-[#00695C]" /> Person Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-3 border border-[#E8F0EE]">
                <div className="flex items-center gap-2 mb-1">
                  <FiHash className="text-[#00695C] text-sm" />
                  <h4 className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider">ID</h4>
                </div>
                <p className="text-sm font-bold text-[#1A2E2A]">{person.id}</p>
              </div>
              <div className="bg-white rounded-xl p-3 border border-[#E8F0EE]">
                <div className="flex items-center gap-2 mb-1">
                  <FiUser className="text-[#00695C] text-sm" />
                  <h4 className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider">Name</h4>
                </div>
                <p className="text-sm font-bold text-[#1A2E2A]">{person.name}</p>
              </div>
              <div className="bg-white rounded-xl p-3 border border-[#E8F0EE]">
                <div className="flex items-center gap-2 mb-1">
                  <RoleIcon className="text-[#00695C] text-sm" />
                  <h4 className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider">User Role</h4>
                </div>
                <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-semibold ${roleConfig.bg} ${roleConfig.text} border ${roleConfig.border}`}>
                  {person.role}
                </span>
              </div>
              <div className="bg-white rounded-xl p-3 border border-[#E8F0EE]">
                <div className="flex items-center gap-2 mb-1">
                  <FiHome className="text-[#00695C] text-sm" />
                  <h4 className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider">Property Type(s)</h4>
                </div>
                <p className="text-sm font-bold text-[#1A2E2A] truncate">{getPropertyTypesSummary(person.properties)}</p>
              </div>
              <div className="bg-white rounded-xl p-3 border border-[#E8F0EE]">
                <div className="flex items-center gap-2 mb-1">
                  <FiPhone className="text-[#00695C] text-sm" />
                  <h4 className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider">Contact</h4>
                </div>
                <p className="text-sm font-bold text-[#1A2E2A]">{person.phone}</p>
              </div>
              <div className="bg-white rounded-xl p-3 border border-[#E8F0EE]">
                <div className="flex items-center gap-2 mb-1">
                  <FiMail className="text-[#00695C] text-sm" />
                  <h4 className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider">Email</h4>
                </div>
                <p className="text-sm font-bold text-[#1A2E2A] truncate">{person.email}</p>
              </div>
              <div className="bg-white rounded-xl p-3 border border-[#E8F0EE] md:col-span-2">
                <div className="flex items-center gap-2 mb-1">
                  <FiAward className="text-[#00695C] text-sm" />
                  <h4 className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider">Subscription Plan</h4>
                </div>
                <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-bold ${subStyle.bg} ${subStyle.text} border ${subStyle.border}`}>
                  {person.subscriptionPlan}
                </span>
              </div>
            </div>

            {/* Properties — a separate button that navigates to that person's own properties page */}
            <button
              type="button"
              onClick={() => { if (onOpenProperties) onOpenProperties(person.id); }}
              className="w-full mt-3 px-4 py-3 bg-white hover:bg-[#E8F4F2] border border-[#E8F0EE] hover:border-[#00695C]/30 rounded-xl transition-all duration-300 flex items-center justify-between gap-3 group"
            >
              <span className="flex items-center gap-2.5 min-w-0">
                <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white flex-shrink-0">
                  <FiPackage className="text-sm" />
                </span>
                <span className="text-left min-w-0">
                  <span className="block text-sm font-bold text-[#1A2E2A]">Properties</span>
                  <span className="block text-[11px] text-[#5A7D78] truncate">{person.properties.length} uploaded — view each one separately</span>
                </span>
              </span>
              <FiChevronRight className="text-[#5A7D78] group-hover:text-[#00695C] group-hover:translate-x-0.5 transition-all duration-300 flex-shrink-0" />
            </button>
          </div>

          {/* Financial breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-1 flex items-center gap-2">
                <FiCreditCard className="text-[#00695C]" /> Collections & Transactions
              </h3>
              <LineItem icon={FiTrendingUp} label="Total Gateway Collections" value={formatCurrency(fin.gross)} />
              <LineItem icon={FiCheckCircle} label="Total Successful Transactions" value={record.successfulTransactionsCount} sub={`Avg ticket ${formatCurrency(record.avgTicketSize)}`} />
              <LineItem icon={FiXCircle} label="Failed Transactions" value={record.failedTransactionsCount} />
            </div>
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-1 flex items-center gap-2">
                <FiDollarSign className="text-[#00695C]" /> Deductions
              </h3>
              <LineItem icon={FiCreditCard} label="Gateway Charges" value={`- ${formatCurrency(fin.gatewayCharges)}`} tone="negative" />
              <LineItem icon={FiPercent} label="GST / Tax" value={`- ${formatCurrency(fin.gstTax)}`} tone="negative" />
              <LineItem icon={FiTrendingDown} label="Refunds" value={`- ${formatCurrency(fin.refunds)}`} tone="negative" />
              <LineItem icon={FiTag} label="Discounts" value={`- ${formatCurrency(fin.discounts)}`} tone="negative" />
              <LineItem icon={FiShield} label="Platform Revenue" value={`- ${formatCurrency(fin.platformRevenue)}`} tone="negative" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] rounded-2xl p-5 flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-white/80 text-xs font-semibold uppercase tracking-wider">Net Settlement Amount</p>
              <p className="text-white text-2xl font-bold">{formatCurrency(fin.net)}</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <div className="bg-white/15 rounded-xl px-3 py-2 text-right">
                <p className="text-[10px] text-white/70 uppercase tracking-wider">Settlement ID</p>
                <p className="text-sm font-bold text-white">{record.settlementId}</p>
              </div>
              <div className="bg-white/15 rounded-xl px-3 py-2 text-right">
                <p className="text-[10px] text-white/70 uppercase tracking-wider">Settlement Date</p>
                <p className="text-sm font-bold text-white">
                  {new Date(record.settlementDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <div className="bg-white/15 rounded-xl px-3 py-2 text-right">
                <p className="text-[10px] text-white/70 uppercase tracking-wider">Status</p>
                <p className="text-sm font-bold text-white flex items-center gap-1 justify-end"><StatusIcon className="text-xs" />{statusConfig.label}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 px-6 py-4 bg-white border-t border-[#E8F0EE] rounded-b-3xl shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium"
            >
              Close
            </button>
            <button
              onClick={() => { if (onEdit) { onEdit(record); onClose(); } }}
              className="flex-1 px-4 py-2.5 bg-[#26A69A] text-white rounded-xl hover:bg-[#1A8A7A] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#26A69A]/30 hover:scale-[1.02]"
            >
              <FiEdit className="inline mr-2" /> Edit
            </button>
            <button
              onClick={() => { if (onDelete) { onDelete(record.id); } }}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 text-sm font-medium shadow-lg shadow-red-600/30 hover:scale-[1.02]"
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
// EDIT RECONCILIATION MODAL
// ============================================================
const EditReconciliationModal = ({ record, person, show, onClose, onSave }) => {
  if (!record || !show) return null;

  const [formData, setFormData] = useState({
    settlementDate: '', settlementStatus: '', grossCollections: '',
    successfulTransactionsCount: '', failedTransactionsCount: '',
    gatewayCharges: '', gstTax: '', refunds: '', discounts: '', platformRevenue: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (record) {
      setFormData({
        settlementDate: record.settlementDate ? record.settlementDate.split('T')[0] : '',
        settlementStatus: record.settlementStatus || 'Pending',
        grossCollections: record.grossCollections ?? '',
        successfulTransactionsCount: record.successfulTransactionsCount ?? '',
        failedTransactionsCount: record.failedTransactionsCount ?? '',
        gatewayCharges: record.gatewayCharges ?? '',
        gstTax: record.gstTax ?? '',
        refunds: record.refunds ?? '',
        discounts: record.discounts ?? '',
        platformRevenue: record.platformRevenue ?? ''
      });
    }
  }, [record]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Live net settlement preview — always Gross - (all deductions), read-only
  const liveNet = Math.max(0,
    (Number(formData.grossCollections) || 0)
    - (Number(formData.gatewayCharges) || 0)
    - (Number(formData.gstTax) || 0)
    - (Number(formData.refunds) || 0)
    - (Number(formData.discounts) || 0)
    - (Number(formData.platformRevenue) || 0)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onSave({
        ...record,
        settlementDate: formData.settlementDate,
        settlementStatus: formData.settlementStatus,
        grossCollections: Number(formData.grossCollections) || 0,
        successfulTransactionsCount: Number(formData.successfulTransactionsCount) || 0,
        failedTransactionsCount: Number(formData.failedTransactionsCount) || 0,
        gatewayCharges: Number(formData.gatewayCharges) || 0,
        gstTax: Number(formData.gstTax) || 0,
        refunds: Number(formData.refunds) || 0,
        discounts: Number(formData.discounts) || 0,
        platformRevenue: Number(formData.platformRevenue) || 0,
        netSettlementAmount: liveNet
      });
      setLoading(false);
      onClose();
    }, 700);
  };

  const inputCls = "w-full px-3 py-2 bg-white rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none";
  const readOnlyInputCls = "w-full px-3 py-2 bg-[#EDF3F1] rounded-xl border border-[#E8F0EE] text-sm font-bold text-[#1A2E2A] outline-none cursor-not-allowed";
  const labelCls = "block text-xs font-medium text-[#5A7D78] mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 rounded-t-3xl z-10 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
          <h2 className="text-2xl font-bold text-white">Edit Settlement Reconciliation</h2>
          <p className="text-white/80 text-sm">{record.settlementId} · {person?.name}</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiCalendar className="text-[#00695C]" /> Settlement Info
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Settlement Date *</label>
                  <input type="date" name="settlementDate" value={formData.settlementDate} onChange={handleChange} required className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Settlement Status *</label>
                  <select name="settlementStatus" value={formData.settlementStatus} onChange={handleChange} required className={inputCls}>
                    {ALL_SETTLEMENT_STATUSES.map(s => <option key={s} value={s}>{SETTLEMENT_STATUS_TYPES[s].label}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiCreditCard className="text-[#00695C]" /> Collections & Transactions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className={labelCls}>Total Gateway Collections (₹) *</label>
                  <input type="number" name="grossCollections" value={formData.grossCollections} onChange={handleChange} required min="0" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Successful Transactions *</label>
                  <input type="number" name="successfulTransactionsCount" value={formData.successfulTransactionsCount} onChange={handleChange} required min="0" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Failed Transactions</label>
                  <input type="number" name="failedTransactionsCount" value={formData.failedTransactionsCount} onChange={handleChange} min="0" className={inputCls} />
                </div>
              </div>
            </div>

            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiDollarSign className="text-[#00695C]" /> Deductions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Gateway Charges (₹) *</label>
                  <input type="number" name="gatewayCharges" value={formData.gatewayCharges} onChange={handleChange} required min="0" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>GST / Tax (₹) *</label>
                  <input type="number" name="gstTax" value={formData.gstTax} onChange={handleChange} required min="0" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Refunds (₹)</label>
                  <input type="number" name="refunds" value={formData.refunds} onChange={handleChange} min="0" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Discounts (₹)</label>
                  <input type="number" name="discounts" value={formData.discounts} onChange={handleChange} min="0" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Platform Revenue (₹) *</label>
                  <input type="number" name="platformRevenue" value={formData.platformRevenue} onChange={handleChange} required min="0" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Net Settlement Amount (₹)</label>
                  <input type="text" value={formatCurrency(liveNet).replace('₹', '')} readOnly disabled className={readOnlyInputCls} />
                </div>
              </div>
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
// PERSON PROPERTIES MODAL
// ------------------------------------------------------------
// Reached only via the dedicated "Properties" button — a separate
// page listing every property that person uploaded, one row each,
// with its own View / Delete actions.
// ============================================================
const PersonPropertiesModal = ({ person, show, onClose, onViewProperty, onDeleteProperty, actionLoading }) => {
  if (!person || !show) return null;

  const roleConfig = PERSON_ROLE_CONFIG[person.role] || PERSON_ROLE_CONFIG['Owner'];
  const RoleIcon = roleConfig.icon;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 rounded-t-3xl z-10 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${roleConfig.gradient} border-2 border-white/30 flex items-center justify-center text-xl text-white shadow-lg`}>
              <RoleIcon />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-white truncate">{person.name}'s Properties</h2>
              <p className="text-white/80 text-xs">{person.role} · {person.id} · {person.properties.length} uploaded</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white space-y-2.5">
          {person.properties.length === 0 && (
            <div className="text-center py-16">
              <FiHome className="text-4xl text-[#B5C9C5] mx-auto mb-3" />
              <p className="text-sm text-[#5A7D78]">No properties uploaded yet</p>
            </div>
          )}
          {person.properties.map((prop) => {
            const typeConfig = PROPERTY_TYPE_CONFIG[prop.type] || PROPERTY_TYPE_CONFIG['Individual'];
            const TypeIcon = typeConfig.icon;
            const statusCfg = PROPERTY_STATUS_CONFIG[prop.status] || PROPERTY_STATUS_CONFIG['Active'];
            return (
              <div key={prop.id} className="bg-[#F5F9F8] rounded-2xl p-3.5 border border-[#E8F0EE] flex items-center justify-between gap-3 flex-wrap hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl ${typeConfig.bg} border ${typeConfig.border} flex items-center justify-center flex-shrink-0`}>
                    <TypeIcon className={`text-base ${typeConfig.text}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#1A2E2A] truncate">{prop.name}</p>
                    <p className="text-[11px] text-[#5A7D78] truncate flex items-center gap-1 flex-wrap">
                      <FiHash className="text-[9px]" />{prop.id}
                      <span className="w-1 h-1 bg-[#B5C9C5] rounded-full mx-0.5" />
                      <FiMapPin className="text-[9px]" />{prop.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${typeConfig.bg} ${typeConfig.text} border ${typeConfig.border}`}>
                    {prop.type}
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${statusCfg.bg} ${statusCfg.text} border ${statusCfg.border}`}>
                    {prop.status}
                  </span>
                  <span className="text-xs font-bold text-[#00695C] whitespace-nowrap">{formatCurrency(prop.price)}</span>
                  <button
                    type="button"
                    onClick={() => onViewProperty(prop)}
                    className="w-8 h-8 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 flex items-center justify-center text-[#00695C] hover:scale-110"
                    title="View property"
                  >
                    <FiEye className="text-sm" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteProperty(prop.id)}
                    disabled={actionLoading === prop.id}
                    className="w-8 h-8 rounded-lg hover:bg-red-50 transition-all duration-300 flex items-center justify-center text-red-600 hover:scale-110 disabled:opacity-50"
                    title="Delete property"
                  >
                    {actionLoading === prop.id ? <FiRefreshCw className="text-sm animate-spin" /> : <FiTrash2 className="text-sm" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 px-6 py-4 bg-white border-t border-[#E8F0EE] rounded-b-3xl shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2"
          >
            <FiChevronLeft /> Back
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// PROPERTY DETAIL MODAL
// ------------------------------------------------------------
// The "page" a single property navigates to when its View button
// is clicked from the Person Properties list. Has its own Delete.
// ============================================================
const PropertyDetailModal = ({ property, person, show, onClose, onDelete, actionLoading }) => {
  if (!property || !show) return null;

  const typeConfig = PROPERTY_TYPE_CONFIG[property.type] || PROPERTY_TYPE_CONFIG['Individual'];
  const TypeIcon = typeConfig.icon;
  const statusCfg = PROPERTY_STATUS_CONFIG[property.status] || PROPERTY_STATUS_CONFIG['Active'];
  const roleConfig = PERSON_ROLE_CONFIG[person?.role] || PERSON_ROLE_CONFIG['Owner'];
  const RoleIcon = roleConfig.icon;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 rounded-t-3xl z-10 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-lg" />
          </button>
          <div className="flex items-center gap-3">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${roleConfig.gradient} border-2 border-white/30 flex items-center justify-center text-2xl text-white shadow-lg`}>
              <TypeIcon />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-white truncate">{property.name}</h2>
              <p className="text-white/80 text-xs flex items-center gap-2 flex-wrap mt-1">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusCfg.bg} ${statusCfg.text} border ${statusCfg.border}`}>
                  {property.status}
                </span>
                <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                <span>{property.id}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1"><FiHash className="text-[#00695C] text-sm" /><h4 className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider">Property ID</h4></div>
              <p className="text-sm font-bold text-[#1A2E2A]">{property.id}</p>
            </div>
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1"><FiHome className="text-[#00695C] text-sm" /><h4 className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider">Property Name</h4></div>
              <p className="text-sm font-bold text-[#1A2E2A]">{property.name}</p>
            </div>
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1"><TypeIcon className="text-[#00695C] text-sm" /><h4 className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider">Property Type</h4></div>
              <p className="text-sm font-bold text-[#1A2E2A]">{property.type}</p>
            </div>
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1"><FiActivity className="text-[#00695C] text-sm" /><h4 className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider">Status</h4></div>
              <p className="text-sm font-bold text-[#1A2E2A]">{property.status}</p>
            </div>
            <div className="bg-[#F5F9F8] rounded-2xl p-4 md:col-span-2">
              <div className="flex items-center gap-2 mb-1"><FiMapPin className="text-[#00695C] text-sm" /><h4 className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider">Location</h4></div>
              <p className="text-sm font-bold text-[#1A2E2A]">{property.location}</p>
            </div>
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1"><FiCalendar className="text-[#00695C] text-sm" /><h4 className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider">Listed Date</h4></div>
              <p className="text-sm font-bold text-[#1A2E2A]">
                {new Date(property.listedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1"><FiDollarSign className="text-[#00695C] text-sm" /><h4 className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider">Price</h4></div>
              <p className="text-sm font-bold text-[#00695C]">{formatCurrency(property.price)}</p>
            </div>
          </div>

          {person && (
            <div className="bg-[#F5F9F8] rounded-2xl p-4">
              <h3 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-2 flex items-center gap-2">
                <FiUser className="text-[#00695C]" /> Uploaded By
              </h3>
              <div className="flex items-center gap-3 bg-white rounded-xl p-3 border border-[#E8F0EE]">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${roleConfig.gradient} flex items-center justify-center text-white flex-shrink-0`}>
                  <RoleIcon className="text-sm" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#1A2E2A] truncate">{person.name}</p>
                  <p className="text-[11px] text-[#5A7D78] truncate">{person.role} · {person.id}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 px-6 py-4 bg-white border-t border-[#E8F0EE] rounded-b-3xl shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2"
            >
              <FiChevronLeft /> Back
            </button>
            <button
              onClick={onDelete}
              disabled={actionLoading === property.id}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 text-sm font-medium shadow-lg shadow-red-600/30 hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {actionLoading === property.id ? <FiRefreshCw className="animate-spin" /> : <FiTrash2 />} Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// MAIN COMPONENT — Payment Reconciliation
// ============================================================
const PaymentReconciliation = () => {
  const searchInputRef = useRef(null);

  // ============ STATE ============
  // `persons` is the single source of truth for owners/agents/builders/
  // property managers and the properties they've uploaded. `records`
  // (settlement reconciliations) only ever reference a person by
  // `personId`, so editing/deleting a property is instantly reflected
  // everywhere that person appears, with no stale duplicated copies.
  const [persons, setPersons] = useState([]);
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('settlementDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [viewingRecord, setViewingRecord] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  // Properties navigation ("pages"): a person's property list, and a
  // single property's own detail page, each reached via a dedicated
  // Properties button — never nested inline inside the settlement view.
  const [viewingPersonId, setViewingPersonId] = useState(null);
  const [showPersonPropertiesModal, setShowPersonPropertiesModal] = useState(false);
  const [viewingPropertyRef, setViewingPropertyRef] = useState(null); // { personId, propertyId }
  const [showPropertyDetailModal, setShowPropertyDetailModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [filterCount, setFilterCount] = useState(0);
  const [activeStatus, setActiveStatus] = useState('all');
  const [activeRole, setActiveRole] = useState('all');
  const [showStats, setShowStats] = useState(true);

  // ============ PERSON LOOKUP ============
  const personsById = useMemo(() => {
    const map = {};
    persons.forEach(p => { map[p.id] = p; });
    return map;
  }, [persons]);

  // ============ CONFIRMATION MODAL STATE ============
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false, title: '', message: '', confirmText: 'Confirm', cancelText: 'Cancel', type: 'danger', onConfirm: null, onCancel: null
  });

  // ============ STATS ============
  const [stats, setStats] = useState({
    total: 0, Settled: 0, Pending: 0, Processing: 0, Failed: 0
  });

  const computeStats = useCallback((list) => {
    if (!list || list.length === 0) {
      setStats({ total: 0, Settled: 0, Pending: 0, Processing: 0, Failed: 0 });
      return;
    }
    const counts = { total: list.length };
    ALL_SETTLEMENT_STATUSES.forEach(status => {
      counts[status] = list.filter(r => r.settlementStatus === status).length;
    });
    setStats(counts);
  }, []);

  // ============ GENERATE MOCK DATA ============
  const generateMockData = useCallback(() => {
    const firstNames = ['Arun', 'Priya', 'Karthik', 'Divya', 'Suresh', 'Meena', 'Ravi', 'Anitha', 'Vikram', 'Lakshmi', 'Naveen', 'Deepa', 'Sanjay', 'Kavitha', 'Manoj', 'Sridevi'];
    const lastNames = ['Kumar', 'Sharma', 'Reddy', 'Iyer', 'Nair', 'Menon', 'Rao', 'Pillai', 'Krishnan', 'Varma'];
    const propertyNames = [
      'Sunrise Apartments', 'Green Valley Villa', 'Lake View Residency', 'Palm Grove Complex',
      'Silver Oak Towers', 'Royal Heights', 'Emerald Enclave', 'Maple Street Duplex',
      'Skyline Business Park', 'Golden Gate Plaza', 'Harmony Homes', 'Orchid Residency',
      'Blue Bell Hostel', 'City Center Mall', 'Hilltop Bungalow', 'Riverside Plots'
    ];
    const locations = [
      'Mumbai, Maharashtra', 'Bangalore, Karnataka', 'Chennai, Tamil Nadu', 'Hyderabad, Telangana',
      'Pune, Maharashtra', 'Delhi, NCR', 'Kochi, Kerala', 'Coimbatore, Tamil Nadu',
      'Ahmedabad, Gujarat', 'Jaipur, Rajasthan'
    ];
    const now = new Date();

    // -------- Step 1: build a pool of persons (Owner/Agent/Builder/Property Manager) --------
    const persons = [];
    const personCount = 18;
    for (let p = 1; p <= personCount; p++) {
      const role = ALL_PERSON_ROLES[Math.floor(Math.random() * ALL_PERSON_ROLES.length)];
      const name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
      const joinedDaysAgo = 60 + Math.floor(Math.random() * 500);
      const joinedDate = new Date(now);
      joinedDate.setDate(joinedDate.getDate() - joinedDaysAgo);

      // properties uploaded by this person
      const propCount = 1 + Math.floor(Math.random() * 12);
      const properties = [];
      for (let k = 1; k <= propCount; k++) {
        const type = ALL_PROPERTY_TYPES[Math.floor(Math.random() * ALL_PROPERTY_TYPES.length)];
        const status = ALL_PROPERTY_STATUSES[Math.floor(Math.random() * ALL_PROPERTY_STATUSES.length)];
        const listedDaysAgo = Math.floor(Math.random() * 300);
        const listedDate = new Date(now);
        listedDate.setDate(listedDate.getDate() - listedDaysAgo);
        properties.push({
          id: `PROP-${String(p).padStart(3, '0')}${String(k).padStart(2, '0')}`,
          name: propertyNames[Math.floor(Math.random() * propertyNames.length)],
          type,
          location: locations[Math.floor(Math.random() * locations.length)],
          status,
          listedDate: listedDate.toISOString(),
          price: (10 + Math.floor(Math.random() * 90)) * 100000
        });
      }

      const planLadder = SUBSCRIPTION_PLANS_BY_ROLE[role] || SUBSCRIPTION_PLANS_BY_ROLE['Owner'];
      const subscriptionPlan = planLadder[Math.floor(Math.random() * planLadder.length)];

      persons.push({
        id: `USR-${String(p).padStart(4, '0')}`,
        name,
        role,
        email: `${name.toLowerCase().replace(' ', '.')}${p}@mail.com`,
        phone: `+91 9${Math.floor(100000000 + Math.random() * 899999999)}`,
        joinedDate: joinedDate.toISOString(),
        subscriptionPlan,
        properties
      });
    }

    // -------- Step 2: build settlement reconciliation records against those persons --------
    const list = [];
    let recIndex = 1;
    persons.forEach((person) => {
      const settlementsForPerson = 1 + Math.floor(Math.random() * 4);
      for (let s = 0; s < settlementsForPerson; s++) {
        const status = ALL_SETTLEMENT_STATUSES[Math.floor(Math.random() * ALL_SETTLEMENT_STATUSES.length)];
        const successfulTransactionsCount = 5 + Math.floor(Math.random() * 55);
        const failedTransactionsCount = Math.floor(Math.random() * 6);
        const avgTicketSize = 300 + Math.floor(Math.random() * 2700);
        const grossCollections = successfulTransactionsCount * avgTicketSize;

        const gatewayChargeRate = 0.02; // 2% gateway processing fee
        const gatewayCharges = Math.round(grossCollections * gatewayChargeRate);

        const platformFeeRate = 0.05; // 5% platform commission
        const platformRevenue = Math.round(grossCollections * platformFeeRate);

        const gstTax = Math.round((gatewayCharges + platformRevenue) * 0.18); // 18% GST on fees charged

        const discounts = Math.random() < 0.5 ? Math.round(grossCollections * (Math.random() * 0.03)) : 0;
        const refunds = status === 'Failed' ? Math.round(grossCollections * (0.05 + Math.random() * 0.1)) : Math.round(grossCollections * (Math.random() * 0.02));

        const daysAgo = Math.floor(Math.random() * 90);
        const settlementDate = new Date(now);
        settlementDate.setDate(settlementDate.getDate() - daysAgo);

        const settlementId = `STL-${settlementDate.getFullYear()}${String(settlementDate.getMonth() + 1).padStart(2, '0')}${String(settlementDate.getDate()).padStart(2, '0')}-${String(recIndex).padStart(4, '0')}`;

        list.push({
          id: `REC-${String(recIndex).padStart(4, '0')}`,
          settlementId,
          settlementDate: settlementDate.toISOString(),
          settlementStatus: status,
          personId: person.id,
          grossCollections,
          successfulTransactionsCount,
          failedTransactionsCount,
          avgTicketSize,
          gatewayCharges,
          gstTax,
          refunds,
          discounts,
          platformRevenue
        });
        recIndex++;
      }
    });

    computeStats(list);
    return { persons, records: list };
  }, [computeStats]);

  // ============ INITIALIZE DATA ============
  useEffect(() => {
    try {
      const { persons: mockPersons, records: mockRecords } = generateMockData();
      setPersons(mockPersons);
      setRecords(mockRecords);
      setFilteredRecords(mockRecords);
    } catch (error) {
      console.error('Error generating mock reconciliation data:', error);
    }
  }, [generateMockData]);

  // ============ FILTER RECORDS ============
  const filterRecords = useCallback(() => {
    try {
      let filtered = [...records];

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(r => {
          const person = personsById[r.personId];
          return (
            (r.settlementId && r.settlementId.toLowerCase().includes(query)) ||
            (r.id && r.id.toLowerCase().includes(query)) ||
            (person?.name && person.name.toLowerCase().includes(query)) ||
            (person?.id && person.id.toLowerCase().includes(query)) ||
            (person?.role && person.role.toLowerCase().includes(query)) ||
            (person?.email && person.email.toLowerCase().includes(query)) ||
            (person?.subscriptionPlan && person.subscriptionPlan.toLowerCase().includes(query)) ||
            (r.settlementStatus && r.settlementStatus.toLowerCase().includes(query)) ||
            (person?.properties || []).some(p => p.name.toLowerCase().includes(query)) ||
            (String(r.grossCollections).includes(query))
          );
        });
      }

      if (activeStatus !== 'all') filtered = filtered.filter(r => r.settlementStatus === activeStatus);
      if (activeRole !== 'all')   filtered = filtered.filter(r => personsById[r.personId]?.role === activeRole);

      let count = 0;
      if (activeStatus !== 'all') count++;
      if (activeRole !== 'all') count++;
      if (searchQuery) count++;
      setFilterCount(count);

      filtered.sort((a, b) => {
        let aVal, bVal;
        if (sortField === 'netSettlementAmount') {
          aVal = computeNetSettlement(a).net; bVal = computeNetSettlement(b).net;
        } else if (sortField === 'grossCollections') {
          aVal = Number(a.grossCollections); bVal = Number(b.grossCollections);
        } else if (sortField === 'settlementDate') {
          aVal = new Date(a.settlementDate).getTime(); bVal = new Date(b.settlementDate).getTime();
        } else if (sortField === 'personName') {
          aVal = (personsById[a.personId]?.name || '').toLowerCase(); bVal = (personsById[b.personId]?.name || '').toLowerCase();
        } else if (sortField === 'propertiesUploaded') {
          aVal = personsById[a.personId]?.properties.length || 0; bVal = personsById[b.personId]?.properties.length || 0;
        } else {
          aVal = a[sortField] || ''; bVal = b[sortField] || '';
          if (typeof aVal === 'string') { aVal = aVal.toLowerCase(); bVal = bVal.toLowerCase(); }
        }
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });

      setFilteredRecords(filtered);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error filtering reconciliation records:', error);
    }
  }, [records, personsById, searchQuery, activeStatus, activeRole, sortField, sortDirection]);

  useEffect(() => { filterRecords(); }, [filterRecords]);

  // ============ PAGINATION ============
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredRecords.slice(start, end);
  }, [filteredRecords, currentPage, pageSize]);

  // ============ HANDLE SORT ============
  const handleSort = useCallback((field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);

  // ============ HANDLE SELECT ALL ============
  const handleSelectAll = useCallback(() => {
    if (selectedRecords.length === paginatedRecords.length && paginatedRecords.length > 0) {
      setSelectedRecords([]);
    } else {
      setSelectedRecords(paginatedRecords.map(r => r.id));
    }
  }, [selectedRecords, paginatedRecords]);

  const handleSelectRecord = useCallback((recordId) => {
    setSelectedRecords(prev => prev.includes(recordId) ? prev.filter(id => id !== recordId) : [...prev, recordId]);
  }, []);

  // ============ VIEW / EDIT ============
  const handleViewRecord = useCallback((record) => {
    setViewingRecord(record);
    setShowViewModal(true);
  }, []);

  const handleEditRecord = useCallback((record) => {
    setEditingRecord(record);
    setShowEditModal(true);
  }, []);

  const handleSaveRecord = useCallback((updatedRecord) => {
    setRecords(prev => {
      const updated = prev.map(r => r.id === updatedRecord.id ? updatedRecord : r);
      computeStats(updated);
      return updated;
    });
    setToast({ message: `Settlement "${updatedRecord.settlementId}" updated successfully`, type: 'success' });
  }, [computeStats]);

  // ============ PROPERTIES NAVIGATION ============
  const handleOpenPersonProperties = useCallback((personId) => {
    setViewingPersonId(personId);
    setShowPersonPropertiesModal(true);
  }, []);

  const handleViewProperty = useCallback((personId, propertyId) => {
    setViewingPropertyRef({ personId, propertyId });
    setShowPropertyDetailModal(true);
  }, []);

  const handleDeleteProperty = useCallback((personId, propertyId) => {
    const person = persons.find(p => p.id === personId);
    const property = person?.properties.find(pr => pr.id === propertyId);
    if (!person || !property) return;

    setConfirmationModal({
      isOpen: true,
      title: 'Delete Property',
      message: `Are you sure you want to delete "${property.name}" (${property.id}) from ${person.name}'s uploaded properties?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: () => {
        setActionLoading(propertyId);
        setTimeout(() => {
          setPersons(prev => prev.map(p => p.id === personId
            ? { ...p, properties: p.properties.filter(pr => pr.id !== propertyId) }
            : p));
          setActionLoading(null);
          setShowPropertyDetailModal(false);
          setViewingPropertyRef(null);
          setToast({ message: `Deleted property "${property.name}"`, type: 'warning' });
        }, 600);
      },
      onCancel: () => setConfirmationModal(prev => ({ ...prev, isOpen: false }))
    });
  }, [persons]);

  // ============ DELETE ============
  const handleDeleteRecord = useCallback((recordId) => {
    const record = records.find(r => r.id === recordId);
    if (!record) return;

    setConfirmationModal({
      isOpen: true,
      title: 'Delete Settlement Record',
      message: `Are you sure you want to delete settlement "${record.settlementId}" for ${personsById[record.personId]?.name || 'this person'}?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: () => {
        setActionLoading(recordId);
        setTimeout(() => {
          setRecords(prev => {
            const updated = prev.filter(r => r.id !== recordId);
            computeStats(updated);
            return updated;
          });
          setActionLoading(null);
          setShowViewModal(false);
          setToast({ message: `Deleted settlement "${record.settlementId}"`, type: 'warning' });
        }, 700);
      },
      onCancel: () => setConfirmationModal(prev => ({ ...prev, isOpen: false }))
    });
  }, [records, computeStats, personsById]);

  // ============ STAT CLICK HANDLERS ============
  const handleStatusClick = useCallback((status) => {
    setActiveStatus(prev => (prev === status ? 'all' : status));
    if (searchInputRef.current) searchInputRef.current.focus();
  }, []);

  const handleTotalClick = useCallback(() => {
    setActiveStatus('all');
    setActiveRole('all');
    setSearchQuery('');
    if (searchInputRef.current) searchInputRef.current.focus();
  }, []);

  // ============ CLEAR ALL FILTERS ============
  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setActiveStatus('all');
    setActiveRole('all');
    if (searchInputRef.current) searchInputRef.current.focus();
    setToast({ message: 'All filters cleared', type: 'info' });
  }, []);

  // ============ REFRESH ============
  const handleRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      try {
        const { persons: mockPersons, records: mockRecords } = generateMockData();
        setPersons(mockPersons);
        setRecords(mockRecords);
        setFilteredRecords(mockRecords);
        setToast({ message: 'Data refreshed successfully', type: 'success' });
      } catch (error) {
        console.error('Error refreshing data:', error);
        setToast({ message: 'Error refreshing data', type: 'error' });
      }
      setLoading(false);
    }, 1000);
  }, [generateMockData]);

  // ============ EXPORT ============
  const handleExport = useCallback(() => {
    if (filteredRecords.length === 0) {
      setToast({ message: 'No data to export', type: 'warning' });
      return;
    }
    try {
      const data = filteredRecords.map(r => {
        const fin = computeNetSettlement(r);
        const person = personsById[r.personId];
        return {
          'Reconciliation ID': r.id,
          'Settlement ID': r.settlementId,
          'Settlement Date': r.settlementDate ? new Date(r.settlementDate).toLocaleDateString('en-IN') : '',
          'Settlement Status': r.settlementStatus,
          'Person ID': person?.id || '',
          'Person Name': person?.name || '',
          'Person Role': person?.role || '',
          'Contact': person?.phone || '',
          'Email': person?.email || '',
          'Subscription Plan': person?.subscriptionPlan || '',
          'Property Type(s)': getPropertyTypesSummary(person?.properties),
          'Properties Uploaded': person?.properties.length || 0,
          'Total Gateway Collections': fin.gross,
          'Successful Transactions': r.successfulTransactionsCount,
          'Failed Transactions': r.failedTransactionsCount,
          'Gateway Charges': fin.gatewayCharges,
          'GST / Tax': fin.gstTax,
          'Refunds': fin.refunds,
          'Discounts': fin.discounts,
          'Platform Revenue': fin.platformRevenue,
          'Net Settlement Amount': fin.net
        };
      });

      const csv = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payment_reconciliation_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      setToast({ message: `${filteredRecords.length} records exported successfully`, type: 'success' });
    } catch (error) {
      console.error('Error exporting data:', error);
      setToast({ message: 'Error exporting data', type: 'error' });
    }
  }, [filteredRecords, personsById]);

  // ============ BULK DELETE ============
  const handleBulkDelete = useCallback(() => {
    if (selectedRecords.length === 0) {
      setToast({ message: 'Please select settlements first', type: 'warning' });
      return;
    }
    setConfirmationModal({
      isOpen: true,
      title: 'Delete Selected Settlements',
      message: `Are you sure you want to delete ${selectedRecords.length} selected settlement(s)?`,
      confirmText: 'Delete All',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: () => {
        setActionLoading('bulk-delete');
        setTimeout(() => {
          const selectedIds = new Set(selectedRecords);
          const count = records.filter(r => selectedIds.has(r.id)).length;
          const updated = records.filter(r => !selectedIds.has(r.id));
          setRecords(updated);
          computeStats(updated);
          setSelectedRecords([]);
          setActionLoading(null);
          setToast({ message: `${count} settlement(s) deleted`, type: 'warning' });
        }, 800);
      },
      onCancel: () => setConfirmationModal(prev => ({ ...prev, isOpen: false }))
    });
  }, [selectedRecords, records, computeStats]);

  // ============ FILTER OPTIONS ============
  const statusOptions = ALL_SETTLEMENT_STATUSES.map(s => ({ value: s, label: SETTLEMENT_STATUS_TYPES[s].label }));
  const roleOptions = ALL_PERSON_ROLES.map(r => ({ value: r, label: r }));

  // ============ AGGREGATE TOTALS (for the header ribbon) ============
  const aggregateTotals = useMemo(() => {
    return filteredRecords.reduce((acc, r) => {
      const fin = computeNetSettlement(r);
      acc.gross += fin.gross;
      acc.net += fin.net;
      acc.platformRevenue += fin.platformRevenue;
      return acc;
    }, { gross: 0, net: 0, platformRevenue: 0 });
  }, [filteredRecords]);

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="space-y-6 p-4 lg:p-6 bg-[#F8FAF9] min-h-screen">
      {/* Animated Background */}
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

      {showViewModal && viewingRecord && (
        <ViewReconciliationModal
          record={viewingRecord}
          person={personsById[viewingRecord.personId]}
          show={showViewModal}
          onClose={() => { setShowViewModal(false); setViewingRecord(null); }}
          onEdit={handleEditRecord}
          onDelete={handleDeleteRecord}
          onOpenProperties={handleOpenPersonProperties}
        />
      )}

      {showEditModal && editingRecord && (
        <EditReconciliationModal
          record={editingRecord}
          person={personsById[editingRecord.personId]}
          show={showEditModal}
          onClose={() => { setShowEditModal(false); setEditingRecord(null); }}
          onSave={handleSaveRecord}
        />
      )}

      {/* Properties navigation — a separate "page" for a person's properties,
          and a further "page" for a single property's own detail/delete */}
      {showPersonPropertiesModal && viewingPersonId && personsById[viewingPersonId] && (
        <PersonPropertiesModal
          person={personsById[viewingPersonId]}
          show={showPersonPropertiesModal}
          onClose={() => { setShowPersonPropertiesModal(false); setViewingPersonId(null); }}
          onViewProperty={(property) => handleViewProperty(viewingPersonId, property.id)}
          onDeleteProperty={(propertyId) => handleDeleteProperty(viewingPersonId, propertyId)}
          actionLoading={actionLoading}
        />
      )}

      {showPropertyDetailModal && viewingPropertyRef && personsById[viewingPropertyRef.personId] && (
        <PropertyDetailModal
          property={personsById[viewingPropertyRef.personId]?.properties.find(p => p.id === viewingPropertyRef.propertyId)}
          person={personsById[viewingPropertyRef.personId]}
          show={showPropertyDetailModal}
          onClose={() => { setShowPropertyDetailModal(false); setViewingPropertyRef(null); }}
          onDelete={() => handleDeleteProperty(viewingPropertyRef.personId, viewingPropertyRef.propertyId)}
          actionLoading={actionLoading}
        />
      )}

      {/* Header */}
      <div className="relative animate-fade-in">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                Payment Reconciliation
              </h1>
              <span className="px-3 py-1 bg-[#E8F4F2] text-[#00695C] text-xs font-semibold rounded-full animate-pulse">
                {filteredRecords.length} Settlements
              </span>
              {filterCount > 0 && (
                <span className="px-3 py-1 bg-[#FEF3E2] text-amber-700 text-xs font-semibold rounded-full">
                  {filterCount} filters
                </span>
              )}
            </div>
            <p className="text-sm text-[#5A7D78] flex items-center gap-2 flex-wrap">
              <span>Reconcile gateway collections against settlements, per owner, agent, builder and property manager</span>
              <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
              <span className="text-[#00695C] font-medium">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2 w-full lg:w-auto flex-wrap">
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

      {/* Aggregate ribbon — gross / net / platform revenue across the current filtered set */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 animate-slide-in">
        <div className="bg-white rounded-2xl p-4 border border-[#E8F0EE] shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center shadow-lg flex-shrink-0">
            <FiTrendingUp className="text-white text-sm" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider">Gross Gateway Collections</p>
            <p className="text-lg font-bold text-[#1A2E2A] truncate">{formatCurrency(aggregateTotals.gross)}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[#E8F0EE] shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-lg flex-shrink-0">
            <FiShield className="text-white text-sm" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider">Platform Revenue</p>
            <p className="text-lg font-bold text-[#1A2E2A] truncate">{formatCurrency(aggregateTotals.platformRevenue)}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[#E8F0EE] shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-400 flex items-center justify-center shadow-lg flex-shrink-0">
            <FiDollarSign className="text-white text-sm" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider">Net Settlement (Payable)</p>
            <p className="text-lg font-bold text-[#1A2E2A] truncate">{formatCurrency(aggregateTotals.net)}</p>
          </div>
        </div>
      </div>

      {/* Stats Section — Total, Settled, Pending, Processing, Failed */}
      {showStats && (
        <div className="relative animate-slide-in">
          <div className="bg-white rounded-2xl p-4 border border-[#E8F0EE] shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              <StatCard
                icon={<FiLayers className="text-white text-sm" />}
                title="Total Settlements"
                value={stats.total}
                color="bg-gradient-to-br from-[#00695C] to-[#26A69A]"
                delay={0}
                isActive={filterCount === 0}
                onClick={handleTotalClick}
              />
              <StatCard
                icon={<FiCheckCircle className="text-white text-sm" />}
                title="Settled"
                value={stats.Settled}
                color="bg-gradient-to-br from-emerald-600 to-emerald-400"
                delay={60}
                isActive={activeStatus === 'Settled'}
                onClick={() => handleStatusClick('Settled')}
              />
              <StatCard
                icon={<FiClock className="text-white text-sm" />}
                title="Pending"
                value={stats.Pending}
                color="bg-gradient-to-br from-amber-600 to-amber-400"
                delay={120}
                isActive={activeStatus === 'Pending'}
                onClick={() => handleStatusClick('Pending')}
              />
              <StatCard
                icon={<FiRefreshCw className="text-white text-sm" />}
                title="Processing"
                value={stats.Processing}
                color="bg-gradient-to-br from-blue-600 to-blue-400"
                delay={180}
                isActive={activeStatus === 'Processing'}
                onClick={() => handleStatusClick('Processing')}
              />
              <StatCard
                icon={<FiXCircle className="text-white text-sm" />}
                title="Failed"
                value={stats.Failed}
                color="bg-gradient-to-br from-red-600 to-red-400"
                delay={240}
                isActive={activeStatus === 'Failed'}
                onClick={() => handleStatusClick('Failed')}
              />
            </div>
          </div>
        </div>
      )}

      {/* Search bar — one line */}
      <div className="relative bg-white rounded-2xl p-4 shadow-sm border border-[#E8F0EE] hover:shadow-md transition-all duration-300">
        <div className="relative w-full ">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search by settlement ID, person name, role, email, property name..."
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

        {/* Filters — next line */}
        <div className="flex items-center gap-2 flex-wrap mt-5">
          <FilterDropdown
            label="Role"
            options={roleOptions}
            value={activeRole}
            onChange={setActiveRole}
            icon={FiUser}
            allLabel="All Roles"
          />
          <FilterDropdown
            label="Status"
            options={statusOptions}
            value={activeStatus}
            onChange={setActiveStatus}
            icon={FiActivity}
            allLabel="All Statuses"
          />

          {filterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="px-4 py-2.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-300 text-sm font-medium flex items-center gap-1 hover:scale-105 whitespace-nowrap"
            >
              <FiX className="text-sm" /> Clear
            </button>
          )}

          <div className="ml-auto flex items-center bg-[#F5F9F8] rounded-xl p-1 border border-[#E8F0EE] flex-shrink-0">
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

        {selectedRecords.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#E8F0EE] flex flex-wrap items-center justify-between gap-3 animate-slide-in">
            <span className="text-sm text-[#5A7D78]">
              <span className="font-semibold text-[#00695C]">{selectedRecords.length}</span> settlement(s) selected
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
                onClick={() => setSelectedRecords([])}
                className="px-4 py-1.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-xs font-medium hover:scale-105"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Records Grid/List */}
      <div className="relative">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00695C]/20 border-t-[#00695C] rounded-full animate-spin" />
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {paginatedRecords.map((record, index) => {
              const isSelected = selectedRecords.includes(record.id);
              const person = personsById[record.personId];
              const roleConfig = PERSON_ROLE_CONFIG[person?.role] || PERSON_ROLE_CONFIG['Owner'];
              const RoleIcon = roleConfig.icon;
              const statusConfig = SETTLEMENT_STATUS_TYPES[record.settlementStatus] || SETTLEMENT_STATUS_TYPES['Pending'];
              const StatusIcon = statusConfig.icon;
              const fin = computeNetSettlement(record);

              return (
                <div
                  key={record.id}
                  className={`bg-white rounded-2xl border border-[#E8F0EE] p-3.5 hover:shadow-xl hover:-translate-y-1 group animate-slide-in transition-all duration-500 ${isSelected ? 'ring-2 ring-[#00695C] shadow-lg' : ''}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-2 gap-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRecord(record.id)}
                        className="w-4 h-4 shrink-0 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                      />
                      <div className={`w-9 h-9 rounded-2xl bg-gradient-to-br ${roleConfig.gradient} flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
                        <RoleIcon className="text-sm" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm text-[#1A2E2A] truncate">{person?.name}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <p className="text-[11px] font-medium text-[#5A7D78]">{record.settlementId}</p>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold leading-none ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                            {statusConfig.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiHash className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate font-bold text-[#1A2E2A]">{record.id}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78] flex-wrap">
                      <RoleIcon className="text-[#00695C] flex-shrink-0" />
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold leading-none ${roleConfig.bg} ${roleConfig.text} border ${roleConfig.border}`}>
                        {person?.role}
                      </span>
                      <span className="truncate font-medium">{person?.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiPackage className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate font-medium">{person?.properties.length || 0} properties uploaded</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiTrendingUp className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate font-medium">Gross: {formatCurrency(fin.gross)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiTag className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate font-medium">Discounts: {formatCurrency(fin.discounts)}</span>
                    </div>
                    <div className="flex items-start gap-2 text-[11px] text-[#5A7D78]">
                      <FiDollarSign className="text-[#00695C] flex-shrink-0 mt-[1px]" />
                      <div className="flex items-baseline gap-1.5 min-w-0 flex-wrap">
                        <span className="truncate font-bold text-[#1A2E2A] text-xs">Net: {formatCurrency(fin.net)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiCalendar className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate font-medium">
                        {new Date(record.settlementDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2.5 pt-2.5 border-t border-[#E8F0EE]">
                    <button
                      type="button"
                      onClick={() => handleViewRecord(record)}
                      className="flex-1 py-1.5 text-xs font-semibold text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiEye className="text-[10px]" /> View
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditRecord(record)}
                      className="flex-1 py-1.5 text-xs font-semibold text-[#26A69A] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiEdit className="text-[10px]" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteRecord(record.id)}
                      disabled={actionLoading === record.id}
                      className="flex-1 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50"
                    >
                      {actionLoading === record.id ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiTrash2 className="text-[10px]" />}
                      Delete
                    </button>
                  </div>
                  {/* Separate Properties button — jumps straight to that person's own properties page */}
                  <button
                    type="button"
                    onClick={() => handleOpenPersonProperties(record.personId)}
                    className="w-full mt-1.5 py-1.5 text-xs font-semibold text-[#00695C] bg-white border border-[#E8F0EE] hover:border-[#00695C]/30 hover:bg-[#F5F9F8] rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 hover:scale-[1.02]"
                  >
                    <FiPackage className="text-[10px]" /> Properties ({person?.properties.length || 0})
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E8F0EE] shadow-sm overflow-hidden">
            <div className="grid grid-cols-12 gap-1 items-center px-4 py-3 bg-[#F5F9F8] border-b border-[#E8F0EE] text-xs font-semibold text-[#5A7D78] uppercase tracking-wider">
              <div className="col-span-2 flex items-center gap-2 min-w-0">
                <input
                  type="checkbox"
                  checked={selectedRecords.length === paginatedRecords.length && paginatedRecords.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300 flex-shrink-0"
                />
                <span className="truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('settlementId')}>
                  Settlement {sortField === 'settlementId' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                </span>
              </div>
              <div className="col-span-2 min-w-0 cursor-pointer hover:text-[#00695C] transition-colors truncate" onClick={() => handleSort('personName')}>
                Person {sortField === 'personName' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate">Role</div>
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('propertiesUploaded')}>
                Props {sortField === 'propertiesUploaded' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('grossCollections')}>
                Gross {sortField === 'grossCollections' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate">Discounts</div>
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('netSettlementAmount')}>
                Net {sortField === 'netSettlementAmount' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('settlementStatus')}>
                Status {sortField === 'settlementStatus' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 truncate cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('settlementDate')}>
                Date {sortField === 'settlementDate' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 min-w-0 text-right">Actions</div>
            </div>

            {paginatedRecords.map((record, index) => {
              const isSelected = selectedRecords.includes(record.id);
              const person = personsById[record.personId];
              const roleConfig = PERSON_ROLE_CONFIG[person?.role] || PERSON_ROLE_CONFIG['Owner'];
              const RoleIcon = roleConfig.icon;
              const statusConfig = SETTLEMENT_STATUS_TYPES[record.settlementStatus] || SETTLEMENT_STATUS_TYPES['Pending'];
              const fin = computeNetSettlement(record);

              return (
                <div
                  key={record.id}
                  className={`grid grid-cols-12 gap-1 items-center py-3 px-4 border-b border-[#E8F0EE] hover:bg-[#F5F9F8] transition-all duration-300 group ${isSelected ? 'bg-[#E8F4F2]' : ''}`}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="col-span-2 flex items-center gap-2 min-w-0">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectRecord(record.id)}
                      className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300 flex-shrink-0"
                    />
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${roleConfig.gradient} flex items-center justify-center text-white shadow-md flex-shrink-0`}>
                      <RoleIcon className="text-[8px]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#00695C] truncate">{record.settlementId}</p>
                      <p className="text-[10px] text-[#5A7D78] truncate">{record.id}</p>
                    </div>
                  </div>

                  <div className="col-span-2 min-w-0">
                    <p className="font-bold text-sm text-[#1A2E2A] truncate">{person?.name}</p>
                    <p className="text-[10px] text-[#5A7D78] truncate">{person?.id}</p>
                  </div>

                  <div className="col-span-1 min-w-0 text-xs font-medium text-[#5A7D78] truncate">
                    {person?.role}
                  </div>

                  <div className="col-span-1 min-w-0 text-xs font-bold text-[#1A2E2A] truncate">
                    {person?.properties.length || 0}
                  </div>

                  <div className="col-span-1 min-w-0 text-xs font-medium text-[#5A7D78] truncate">
                    {formatCurrency(fin.gross)}
                  </div>

                  <div className="col-span-1 min-w-0 text-xs font-medium text-[#5A7D78] truncate">
                    {formatCurrency(fin.discounts)}
                  </div>

                  <div className="col-span-1 min-w-0 text-xs font-bold text-[#1A2E2A] truncate">
                    {formatCurrency(fin.net)}
                  </div>

                  <div className="col-span-1 min-w-0">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border} truncate inline-block max-w-full`}>
                      {statusConfig.label}
                    </span>
                  </div>

                  <div className="col-span-1 min-w-0 text-[10px] font-medium text-[#5A7D78] truncate">
                    {new Date(record.settlementDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </div>

                  <div className="col-span-1 min-w-0 flex items-center justify-end gap-1 flex-nowrap">
                    <button
                      type="button"
                      onClick={() => handleOpenPersonProperties(record.personId)}
                      className="w-5 h-5 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 flex items-center justify-center text-[#00695C] hover:scale-110 flex-shrink-0"
                      title="Properties"
                    >
                      <FiPackage className="text-[15px]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleViewRecord(record)}
                      className="w-5 h-5 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 flex items-center justify-center text-[#00695C] hover:scale-110 flex-shrink-0"
                      title="View"
                    >
                      <FiEye className="text-[15px]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditRecord(record)}
                      className="w-5 h-5 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 flex items-center justify-center text-[#26A69A] hover:scale-110 flex-shrink-0"
                      title="Edit"
                    >
                      <FiEdit className="text-[15px]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteRecord(record.id)}
                      disabled={actionLoading === record.id}
                      className="w-5 h-5 rounded-lg hover:bg-red-50 transition-all duration-300 flex items-center justify-center text-red-600 hover:scale-110 disabled:opacity-50 flex-shrink-0"
                      title="Delete"
                    >
                      {actionLoading === record.id ? <FiRefreshCw className="text-[9px] animate-spin" /> : <FiTrash2 className="text-[15px]" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {paginatedRecords.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E8F0EE]">
            <div className="w-24 h-24 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4 animate-float">
              <FiCreditCard className="text-4xl text-[#B5C9C5]" />
            </div>
            <h3 className="text-xl font-bold text-[#1A2E2A]">No settlement records found</h3>
            <p className="text-sm text-[#5A7D78] mt-1">
              {filterCount > 0 ? 'Try adjusting your search or filter criteria' : 'No reconciliation records have been generated yet'}
            </p>
            {filterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="mt-4 px-6 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-bold shadow-lg shadow-[#00695C]/30 hover:scale-105"
              >
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
              {Math.min(currentPage * pageSize, filteredRecords.length)} of{' '}
              {filteredRecords.length} settlements
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

      {/* CSS Animations */}
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

export default PaymentReconciliation;