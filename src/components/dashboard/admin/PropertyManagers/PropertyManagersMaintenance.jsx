// src/components/dashboard/admin/PropertyManagers/PropertyManagersMaintenance.jsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  FiPlus, FiEdit, FiTrash2, FiCheckCircle, FiXCircle,
  FiClock, FiSearch, FiChevronLeft, FiChevronRight, FiEye,
  FiRefreshCw, FiGrid, FiList, FiX, FiAlertTriangle, FiInfo,
  FiMapPin, FiCalendar, FiUser, FiTag, FiDollarSign,
  FiActivity, FiUserCheck, FiSave, FiFileText, FiPhone, FiMail,
  FiClipboard, FiFile, FiCheck, FiRotateCcw, FiSend, FiDownload,
  FiPlayCircle, FiPauseCircle, FiTool, FiPaperclip, FiLink, FiImage
} from 'react-icons/fi';
import {
  FaWater, FaBolt, FaThermometerHalf, FaBug, FaHammer,
  FaPaintRoller, FaPlug, FaTools, FaReceipt, FaMoneyBillWave
} from 'react-icons/fa';
import {
  MdOutlineBuild, MdOutlineHomeRepairService, MdOutlineReceipt
} from 'react-icons/md';

/* ============================================================
   UTILITIES
============================================================ */
const todayISO = () => new Date().toISOString().split('T')[0];

const fmtCurrency = (n) =>
  `₹${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

const fmtDate = (d) => {
  if (!d) return '—';
  const dt = new Date(d);
  if (isNaN(dt)) return d;
  return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const daysBetween = (from, to) => {
  const a = new Date(from); const b = new Date(to);
  return Math.ceil((b - a) / (24 * 60 * 60 * 1000));
};

const uid = (prefix, existing) => {
  let n = existing.length + 1;
  let id = `${prefix}-${String(n).padStart(4, '0')}`;
  while (existing.some((x) => x.id === id)) {
    n += 1;
    id = `${prefix}-${String(n).padStart(4, '0')}`;
  }
  return id;
};

const leaseDaysLeft = (leaseEnd) => {
  const diff = daysBetween(todayISO(), leaseEnd);
  return diff;
};

/* ============================================================
   LOADING SPINNER
============================================================ */
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center w-full h-[400px]">
    <div className="w-12 h-12 border-4 border-[#E8F0EE] border-t-[#00695C] rounded-full animate-spin"></div>
  </div>
);

/* ============================================================
   TOAST
============================================================ */
const Toast = ({ toast }) => {
  if (!toast) return null;
  const colors = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-500',
  };
  const icons = {
    success: <FiCheckCircle className="text-lg" />,
    error: <FiXCircle className="text-lg" />,
    warning: <FiAlertTriangle className="text-lg" />,
    info: <FiInfo className="text-lg" />,
  };
  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] px-6 py-4 rounded-2xl text-white shadow-2xl flex items-center gap-3 animate-slide-up ${colors[toast.type] || colors.success}`}
    >
      {icons[toast.type] || icons.success}
      <span className="text-sm font-medium">{toast.message}</span>
    </div>
  );
};

/* ============================================================
   CONFIRMATION MODAL
============================================================ */
const ConfirmationModal = ({
  isOpen, onClose, onConfirm, title, message,
  confirmText = 'Confirm', cancelText = 'Cancel',
  confirmColor = 'bg-red-500', loading = false,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl animate-slide-up border border-[#E8F0EE]">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-3">
            <FiAlertTriangle className="text-3xl text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-[#1A2E2A] mb-1.5">{title}</h3>
          <p className="text-sm text-[#5A7D78] mb-4 leading-relaxed">{message}</p>
          <div className="flex items-center gap-3 w-full">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all text-sm font-medium"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`flex-1 px-4 py-2 text-white rounded-xl hover:shadow-xl transition-all text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 ${confirmColor}`}
            >
              {loading ? <><FiRefreshCw className="animate-spin text-sm" /> Processing...</> : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   TAB BUTTON
============================================================ */
const TabButton = ({ icon, label, isActive, onClick, count, color }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 text-sm font-medium whitespace-nowrap ${
      isActive
        ? 'bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white shadow-lg shadow-[#00695C]/30'
        : 'bg-white text-[#5A7D78] hover:bg-[#F5F9F8] hover:text-[#1A2E2A] border border-[#E8F0EE]'
    } hover:scale-105`}
  >
    <span className={`text-base ${isActive ? 'text-white' : color}`}>{icon}</span>
    <span>{label}</span>
    {count !== undefined && (
      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
        isActive ? 'bg-white/20 text-white' : 'bg-[#F5F9F8] text-[#5A7D78]'
      }`}>{count}</span>
    )}
  </button>
);

/* ============================================================
   VIEW MODAL (generic field renderer)
============================================================ */
const ViewItemModal = ({ item, show, onClose, title, renderSections }) => {
  if (!item || !show) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[88vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 rounded-t-2xl z-10 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
              <FiEye className="text-sm" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{title}</h2>
              <p className="text-white/70 text-[10px]">{item.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white">
            <FiX className="text-sm" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
          {renderSections(item)}
        </div>
        <div className="sticky bottom-0 bg-white pt-3 px-4 pb-4 border-t border-[#E8F0EE] flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg hover:shadow-xl text-sm font-medium">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, value }) => (
  <div className="bg-[#F5F9F8] rounded-xl p-3">
    <p className="text-[9px] uppercase tracking-wider text-[#5A7D78]">{label}</p>
    <p className="text-sm font-medium text-[#1A2E2A] break-words">{value ?? '—'}</p>
  </div>
);

const SectionTitle = ({ children }) => (
  <h4 className="text-xs font-bold text-[#00695C] uppercase tracking-wider border-b border-[#E8F0EE] pb-1 mt-2">
    {children}
  </h4>
);

/* ============================================================
   IMAGE PREVIEW MODAL (LIGHTBOX)
============================================================ */
const ImagePreviewModal = ({ image, show, onClose }) => {
  if (!show || !image) return null;
  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div className="relative max-w-4xl w-full flex flex-col items-center">
        <button 
          onClick={onClose} 
          className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        >
          <FiX className="text-xl" />
        </button>
        <img 
          src={image} 
          alt="Attachment Preview" 
          className="max-h-[80vh] w-auto rounded-xl shadow-2xl object-contain bg-white/5"
          onClick={(e) => e.stopPropagation()} 
        />
        <p className="text-white/70 text-sm mt-4 font-medium">Click anywhere outside to close</p>
      </div>
    </div>
  );
};

/* ============================================================
   REUSABLE STATUS / PRIORITY STYLES
============================================================ */
const statusColors = {
  pending: 'bg-amber-100 text-amber-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  resolved: 'bg-emerald-100 text-emerald-700',
  closed: 'bg-gray-100 text-gray-700',
  'needs-review': 'bg-purple-100 text-purple-700',
  rejected: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-700',
  scheduled: 'bg-purple-100 text-purple-700',
  completed: 'bg-emerald-100 text-emerald-700',
  'on-hold': 'bg-orange-100 text-orange-700',
  paid: 'bg-emerald-100 text-emerald-700',
  partial: 'bg-blue-100 text-blue-700',
  overdue: 'bg-red-100 text-red-700',
  failed: 'bg-red-100 text-red-700',
  active: 'bg-emerald-100 text-emerald-700',
  expired: 'bg-red-100 text-red-700',
  renewed: 'bg-blue-100 text-blue-700',
  'not-renewed': 'bg-gray-100 text-gray-700',
};

const priorityColors = {
  urgent: 'border-l-red-500',
  high: 'border-l-orange-500',
  medium: 'border-l-amber-500',
  low: 'border-l-blue-500',
};

const priorityBadge = {
  urgent: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-blue-100 text-blue-700',
};

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' ') : '');

/* ============================================================
   COMPLAINT ICONS
============================================================ */
const complaintIcons = {
  plumbing: <FaWater className="text-blue-500" />,
  electrical: <FaBolt className="text-yellow-500" />,
  hvac: <FaThermometerHalf className="text-orange-500" />,
  pest: <FaBug className="text-red-500" />,
  structural: <FaHammer className="text-gray-600" />,
  painting: <FaPaintRoller className="text-purple-500" />,
  appliance: <FaPlug className="text-green-500" />,
  other: <FaTools className="text-gray-500" />,
};

/* ============================================================
   PAGINATION + TOOLBAR HELPERS
============================================================ */
const Pagination = ({ total, currentPage, pageSize, onPage }) => {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-[#5A7D78]">
        Showing {Math.min(total, (currentPage - 1) * pageSize + 1)} to{' '}
        {Math.min(currentPage * pageSize, total)} of {total}
      </span>
      <div className="flex gap-1">
        <button
          onClick={() => onPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-xl hover:bg-[#F5F9F8] disabled:opacity-50"
        >
          <FiChevronLeft className="text-sm" />
        </button>
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let page = i + 1;
          if (totalPages > 5 && currentPage > 3) page = currentPage - 2 + i;
          if (totalPages > 5 && currentPage > totalPages - 3) page = totalPages - 4 + i;
          if (page > totalPages) return null;
          return (
            <button
              key={page}
              onClick={() => onPage(page)}
              className={`w-8 h-8 rounded-xl text-sm font-medium transition-all ${
                currentPage === page ? 'bg-[#00695C] text-white' : 'hover:bg-[#F5F9F8]'
              }`}
            >
              {page}
            </button>
          );
        })}
        <button
          onClick={() => onPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-xl hover:bg-[#F5F9F8] disabled:opacity-50"
        >
          <FiChevronRight className="text-sm" />
        </button>
      </div>
    </div>
  );
};

const SearchAndViewToggle = ({ searchQuery, setSearchQuery, placeholder, viewMode, setViewMode, children }) => (
  <div className="flex flex-wrap items-center gap-3">
    <div className="flex-1 min-w-[200px] relative">
      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5A7D78] text-sm" />
      <input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-9 pr-3 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 text-sm outline-none"
      />
    </div>
    {children}
    <div className="flex items-center bg-[#F5F9F8] rounded-xl p-1 border border-[#E8F0EE]">
      <button
        onClick={() => setViewMode('grid')}
        className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#00695C]' : 'text-[#5A7D78]'}`}
      >
        <FiGrid className="text-sm" />
      </button>
      <button
        onClick={() => setViewMode('list')}
        className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-[#00695C]' : 'text-[#5A7D78]'}`}
      >
        <FiList className="text-sm" />
      </button>
    </div>
  </div>
);

const EmptyState = ({ icon, title, subtitle }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-20 h-20 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-[#1A2E2A]">{title}</h3>
    <p className="text-sm text-[#5A7D78] mt-1">{subtitle}</p>
  </div>
);

/* ============================================================
   GENERIC FORM FIELD
============================================================ */
const FormField = ({ label, name, value, onChange, type = 'text', options, required, textarea, colSpan = 1 }) => {
  const cls = 'w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 text-sm outline-none';
  return (
    <div className={colSpan === 2 ? 'md:col-span-2' : ''}>
      <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {options ? (
        <select name={name} value={value ?? ''} onChange={onChange} className={cls}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ) : textarea ? (
        <textarea name={name} value={value ?? ''} onChange={onChange} rows={3} className={`${cls} resize-none`} />
      ) : (
        <input type={type} name={name} value={value ?? ''} onChange={onChange} className={cls} />
      )}
    </div>
  );
};

/* ============================================================
   PAYMENT MODAL (Rent)
============================================================ */
const PaymentModal = ({ record, show, onClose, onSubmit, loading }) => {
  const [form, setForm] = useState({ amount: 0, method: 'UPI', reference: '', date: todayISO() });
  const [error, setError] = useState('');

  useEffect(() => {
    if (record && show) {
      setForm({
        amount: record.outstanding,
        method: 'UPI',
        reference: '',
        date: todayISO(),
      });
      setError('');
    }
  }, [record, show]);

  if (!record || !show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const amt = Number(form.amount);
    if (!amt || amt <= 0) return setError('Enter a valid amount.');
    if (amt > record.outstanding) return setError(`Amount cannot exceed outstanding ${fmtCurrency(record.outstanding)}.`);
    if (!form.reference.trim()) return setError('Transaction reference is required.');
    if (!form.date) return setError('Payment date is required.');
    onSubmit({ ...form, amount: amt });
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-[#E8F0EE] flex flex-col">
        <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 rounded-t-2xl flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Record Payment</h2>
            <p className="text-white/70 text-[10px]">{record.id} — {record.tenant}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white">
            <FiX className="text-sm" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div className="bg-[#F5F9F8] rounded-xl p-3 text-sm space-y-1">
            <div className="flex justify-between"><span className="text-[#5A7D78]">Total Due</span><span className="font-semibold">{fmtCurrency(record.totalDue)}</span></div>
            <div className="flex justify-between"><span className="text-[#5A7D78]">Already Paid</span><span className="font-semibold">{fmtCurrency(record.amountPaid)}</span></div>
            <div className="flex justify-between"><span className="text-[#5A7D78]">Outstanding</span><span className="font-semibold text-red-600">{fmtCurrency(record.outstanding)}</span></div>
          </div>
          <FormField label="Payment Amount" name="amount" type="number" value={form.amount} onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))} required />
          <FormField
            label="Payment Method"
            name="method"
            value={form.method}
            onChange={(e) => setForm((p) => ({ ...p, method: e.target.value }))}
            options={[
              { value: 'UPI', label: 'UPI' },
              { value: 'Card', label: 'Card' },
              { value: 'Bank Transfer', label: 'Bank Transfer' },
              { value: 'Cash', label: 'Cash' },
              { value: 'Cheque', label: 'Cheque' },
            ]}
            required
          />
          <FormField label="Transaction / Reference ID" name="reference" value={form.reference} onChange={(e) => setForm((p) => ({ ...p, reference: e.target.value }))} required />
          <FormField label="Payment Date" name="date" type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} required />
          {error && <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-[#F5F9F8] rounded-lg text-sm font-medium">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <><FiRefreshCw className="animate-spin text-sm" /> Saving...</> : <><FiSave className="text-sm" /> Confirm Payment</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ============================================================
   RENEWAL MODAL (Lease)
============================================================ */
const RenewalModal = ({ lease, show, onClose, onSubmit, loading }) => {
  const [form, setForm] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    if (lease && show) {
      const newStart = new Date(lease.leaseEnd);
      newStart.setDate(newStart.getDate() + 1);
      const newEnd = new Date(newStart);
      newEnd.setFullYear(newEnd.getFullYear() + 1);
      setForm({
        newStart: newStart.toISOString().split('T')[0],
        newEnd: newEnd.toISOString().split('T')[0],
        proposedRent: lease.rent,
        terms: 'Standard renewal terms — 11 month lock-in, 1 month notice.',
        requestDate: todayISO(),
      });
      setError('');
    }
  }, [lease, show]);

  if (!lease || !show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.newStart || !form.newEnd) return setError('New lease dates are required.');
    if (new Date(form.newEnd) <= new Date(form.newStart)) return setError('New end date must be after start date.');
    if (!form.proposedRent || Number(form.proposedRent) <= 0) return setError('Proposed rent must be greater than zero.');
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-[#E8F0EE] flex flex-col">
        <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 rounded-t-2xl flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Renew Lease</h2>
            <p className="text-white/70 text-[10px]">{lease.id} — {lease.tenant}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white">
            <FiX className="text-sm" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div className="bg-[#F5F9F8] rounded-xl p-3 text-sm space-y-1">
            <div className="flex justify-between"><span className="text-[#5A7D78]">Current Period</span><span className="font-medium">{fmtDate(lease.leaseStart)} → {fmtDate(lease.leaseEnd)}</span></div>
            <div className="flex justify-between"><span className="text-[#5A7D78]">Current Rent</span><span className="font-semibold">{fmtCurrency(lease.rent)}</span></div>
          </div>
          <FormField label="New Start Date" name="newStart" type="date" value={form.newStart} onChange={(e) => setForm((p) => ({ ...p, newStart: e.target.value }))} required />
          <FormField label="New End Date" name="newEnd" type="date" value={form.newEnd} onChange={(e) => setForm((p) => ({ ...p, newEnd: e.target.value }))} required />
          <FormField label="Proposed Rent (₹)" name="proposedRent" type="number" value={form.proposedRent} onChange={(e) => setForm((p) => ({ ...p, proposedRent: e.target.value }))} required />
          <FormField label="Renewal Request Date" name="requestDate" type="date" value={form.requestDate} onChange={(e) => setForm((p) => ({ ...p, requestDate: e.target.value }))} required />
          <FormField label="Renewal Terms" name="terms" value={form.terms} onChange={(e) => setForm((p) => ({ ...p, terms: e.target.value }))} textarea colSpan={2} />
          {error && <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-[#F5F9F8] rounded-lg text-sm font-medium">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <><FiRefreshCw className="animate-spin text-sm" /> Renewing...</> : <><FiRotateCcw className="text-sm" /> Confirm Renewal</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ============================================================
   COMPLETE MODAL (Service)
============================================================ */
const CompleteServiceModal = ({ request, show, onClose, onSubmit, loading }) => {
  const [form, setForm] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    if (request && show) {
      setForm({
        completionDate: todayISO(),
        actualCost: request.estimatedCost || 0,
        labourCost: request.labourCost || 0,
        materialsCost: request.materialsCost || 0,
        workNotes: request.workNotes || '',
      });
      setError('');
    }
  }, [request, show]);

  if (!request || !show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.completionDate) return setError('Completion date is required.');
    if (!form.workNotes.trim()) return setError('Work / resolution notes are required.');
    if (Number(form.actualCost) < 0) return setError('Actual cost cannot be negative.');
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-[#E8F0EE] flex flex-col">
        <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 rounded-t-2xl flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Complete Service Request</h2>
            <p className="text-white/70 text-[10px]">{request.id} — {request.title}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white">
            <FiX className="text-sm" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <FormField label="Completion Date" name="completionDate" type="date" value={form.completionDate} onChange={(e) => setForm((p) => ({ ...p, completionDate: e.target.value }))} required />
          <FormField label="Labour Cost (₹)" name="labourCost" type="number" value={form.labourCost} onChange={(e) => setForm((p) => ({ ...p, labourCost: e.target.value }))} />
          <FormField label="Materials Cost (₹)" name="materialsCost" type="number" value={form.materialsCost} onChange={(e) => setForm((p) => ({ ...p, materialsCost: e.target.value }))} />
          <FormField label="Actual Cost (₹)" name="actualCost" type="number" value={form.actualCost} onChange={(e) => setForm((p) => ({ ...p, actualCost: e.target.value }))} required />
          <FormField label="Work / Resolution Notes" name="workNotes" value={form.workNotes} onChange={(e) => setForm((p) => ({ ...p, workNotes: e.target.value }))} textarea colSpan={2} required />
          {error && <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-[#F5F9F8] rounded-lg text-sm font-medium">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <><FiRefreshCw className="animate-spin text-sm" /> Completing...</> : <><FiCheck className="text-sm" /> Mark Complete</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ============================================================
   COMPLAINT EDIT MODAL
============================================================ */
const ComplaintEditModal = ({ item, show, onClose, onSave, loading }) => {
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (item && show) { setForm({ ...item }); setError(''); }
  }, [item, show]);

  if (!item || !show || !form) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title?.trim()) return setError('Title is required.');
    if (!form.tenant?.trim()) return setError('Tenant name is required.');
    if (!form.unit?.trim()) return setError('Unit is required.');
    if (form.status === 'rejected' && !form.reason?.trim())
      return setError('A reason is required when rejecting a complaint.');
    if (form.status === 'needs-review' && !form.reason?.trim())
      return setError('A reason is required when marking as needs review.');
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[88vh] overflow-hidden shadow-2xl border border-[#E8F0EE] flex flex-col">
        <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 rounded-t-2xl flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Edit Complaint</h2>
            <p className="text-white/70 text-[10px]">{item.id}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white">
            <FiX className="text-sm" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormField label="Title" name="title" value={form.title} onChange={handleChange} required />
            <FormField
              label="Category"
              name="type"
              value={form.type}
              onChange={handleChange}
              options={[
                { value: 'plumbing', label: 'Plumbing' },
                { value: 'electrical', label: 'Electrical' },
                { value: 'hvac', label: 'HVAC' },
                { value: 'pest', label: 'Pest Control' },
                { value: 'structural', label: 'Structural' },
                { value: 'painting', label: 'Painting' },
                { value: 'appliance', label: 'Appliance' },
                { value: 'other', label: 'Other' },
              ]}
              required
            />
            <FormField
              label="Priority"
              name="priority"
              value={form.priority}
              onChange={handleChange}
              options={[
                { value: 'urgent', label: 'Urgent' },
                { value: 'high', label: 'High' },
                { value: 'medium', label: 'Medium' },
                { value: 'low', label: 'Low' },
              ]}
              required
            />
            <FormField
              label="Status"
              name="status"
              value={form.status}
              onChange={handleChange}
              options={[
                { value: 'pending', label: 'Pending' },
                { value: 'in-progress', label: 'In Progress' },
                { value: 'resolved', label: 'Resolved' },
                { value: 'closed', label: 'Closed' },
                { value: 'needs-review', label: 'Needs Review' },
                { value: 'rejected', label: 'Rejected' },
              ]}
              required
            />
            <FormField label="Tenant Name" name="tenant" value={form.tenant} onChange={handleChange} required />
            <FormField label="Unit" name="unit" value={form.unit} onChange={handleChange} required />
            <FormField label="Property Name" name="propertyName" value={form.propertyName} onChange={handleChange} />
            <FormField label="Contact Phone" name="tenantPhone" value={form.tenantPhone} onChange={handleChange} />
            <FormField label="Contact Email" name="tenantEmail" value={form.tenantEmail} onChange={handleChange} />
            <FormField label="Assigned Staff" name="assignedTo" value={form.assignedTo} onChange={handleChange} />
            <FormField label="Reported Date" name="reportedDate" type="date" value={form.reportedDate} onChange={handleChange} />
            <FormField label="Resolution Date" name="resolvedDate" type="date" value={form.resolvedDate} onChange={handleChange} />
            <FormField label="Description" name="description" value={form.description} onChange={handleChange} textarea colSpan={2} />
            {(form.status === 'rejected' || form.status === 'needs-review') && (
              <FormField label="Reason" name="reason" value={form.reason || ''} onChange={handleChange} textarea colSpan={2} required />
            )}
            <FormField label="Resolution Notes" name="resolutionNotes" value={form.resolutionNotes || ''} onChange={handleChange} textarea colSpan={2} />
          </div>
          {error && <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
          <div className="sticky bottom-0 bg-white pt-3 border-t border-[#E8F0EE] flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-[#F5F9F8] rounded-lg text-sm font-medium">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <><FiRefreshCw className="animate-spin text-sm" /> Saving...</> : <><FiSave className="text-sm" /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ============================================================
   RENT EDIT MODAL
============================================================ */
const RentEditModal = ({ item, show, onClose, onSave, loading }) => {
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (item && show) {
      setForm({
        ...item,
        additionalCharges: item.additionalCharges ?? 0,
        lateFee: item.lateFee ?? 0,
        discount: item.discount ?? 0,
        amountPaid: item.amountPaid ?? 0,
        month: item.month?.split('-')[1] ?? '01',
        year: item.month?.split('-')[0] ?? String(new Date().getFullYear()),
      });
      setError('');
    }
  }, [item, show]);

  if (!item || !show || !form) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.tenant?.trim()) return setError('Tenant is required.');
    if (!form.unit?.trim()) return setError('Unit is required.');
    if (Number(form.monthlyRent) <= 0) return setError('Monthly rent must be greater than zero.');
    if (Number(form.amountPaid) < 0) return setError('Amount paid cannot be negative.');
    if (!form.dueDate) return setError('Due date is required.');
    const total = Number(form.monthlyRent) + Number(form.additionalCharges) + Number(form.lateFee) - Number(form.discount);
    if (Number(form.amountPaid) > total) return setError('Amount paid cannot exceed total due.');
    onSave({ ...form, month: `${form.year}-${form.month}` });
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[88vh] overflow-hidden shadow-2xl border border-[#E8F0EE] flex flex-col">
        <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 rounded-t-2xl flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Edit Rent Record</h2>
            <p className="text-white/70 text-[10px]">{item.id}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white">
            <FiX className="text-sm" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormField label="Tenant" name="tenant" value={form.tenant} onChange={handleChange} required />
            <FormField label="Unit" name="unit" value={form.unit} onChange={handleChange} required />
            <FormField label="Property Name" name="propertyName" value={form.propertyName} onChange={handleChange} />
            <FormField label="Owner Name" name="ownerName" value={form.ownerName} onChange={handleChange} />
            <FormField label="Rent Month (MM)" name="month" type="number" value={form.month} onChange={handleChange} />
            <FormField label="Rent Year (YYYY)" name="year" type="number" value={form.year} onChange={handleChange} />
            <FormField label="Monthly Rent (₹)" name="monthlyRent" type="number" value={form.monthlyRent} onChange={handleChange} required />
            <FormField label="Additional Charges (₹)" name="additionalCharges" type="number" value={form.additionalCharges} onChange={handleChange} />
            <FormField label="Late Fee (₹)" name="lateFee" type="number" value={form.lateFee} onChange={handleChange} />
            <FormField label="Discount (₹)" name="discount" type="number" value={form.discount} onChange={handleChange} />
            <FormField label="Amount Paid (₹)" name="amountPaid" type="number" value={form.amountPaid} onChange={handleChange} />
            <FormField label="Due Date" name="dueDate" type="date" value={form.dueDate} onChange={handleChange} required />
            <FormField label="Payment Date" name="paymentDate" type="date" value={form.paymentDate} onChange={handleChange} />
            <FormField
              label="Payment Method"
              name="paymentMethod"
              value={form.paymentMethod}
              onChange={handleChange}
              options={[
                { value: '', label: '—' },
                { value: 'UPI', label: 'UPI' },
                { value: 'Card', label: 'Card' },
                { value: 'Bank Transfer', label: 'Bank Transfer' },
                { value: 'Cash', label: 'Cash' },
                { value: 'Cheque', label: 'Cheque' },
              ]}
            />
            <FormField label="Transaction / Reference ID" name="reference" value={form.reference} onChange={handleChange} />
            <FormField
              label="Status"
              name="status"
              value={form.status}
              onChange={handleChange}
              options={[
                { value: 'pending', label: 'Pending' },
                { value: 'paid', label: 'Paid' },
                { value: 'partial', label: 'Partial' },
                { value: 'overdue', label: 'Overdue' },
                { value: 'failed', label: 'Failed' },
              ]}
              required
            />
          </div>
          {error && <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
          <div className="sticky bottom-0 bg-white pt-3 border-t border-[#E8F0EE] flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-[#F5F9F8] rounded-lg text-sm font-medium">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <><FiRefreshCw className="animate-spin text-sm" /> Saving...</> : <><FiSave className="text-sm" /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ============================================================
   LEASE EDIT MODAL
============================================================ */
const LeaseEditModal = ({ item, show, onClose, onSave, loading }) => {
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (item && show) { setForm({ ...item }); setError(''); }
  }, [item, show]);

  if (!item || !show || !form) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.tenant?.trim()) return setError('Tenant is required.');
    if (!form.unit?.trim()) return setError('Unit is required.');
    if (new Date(form.leaseEnd) <= new Date(form.leaseStart))
      return setError('Lease end must be after start date.');
    if (Number(form.rent) <= 0) return setError('Monthly rent must be greater than zero.');
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[88vh] overflow-hidden shadow-2xl border border-[#E8F0EE] flex flex-col">
        <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 rounded-t-2xl flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Edit Lease</h2>
            <p className="text-white/70 text-[10px]">{item.id}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white">
            <FiX className="text-sm" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormField label="Tenant" name="tenant" value={form.tenant} onChange={handleChange} required />
            <FormField label="Unit" name="unit" value={form.unit} onChange={handleChange} required />
            <FormField label="Property Name" name="propertyName" value={form.propertyName} onChange={handleChange} />
            <FormField label="Owner Name" name="ownerName" value={form.ownerName} onChange={handleChange} />
            <FormField label="Lease Start" name="leaseStart" type="date" value={form.leaseStart} onChange={handleChange} required />
            <FormField label="Lease End" name="leaseEnd" type="date" value={form.leaseEnd} onChange={handleChange} required />
            <FormField label="Monthly Rent (₹)" name="rent" type="number" value={form.rent} onChange={handleChange} required />
            <FormField label="Security Deposit (₹)" name="securityDeposit" type="number" value={form.securityDeposit} onChange={handleChange} />
            <FormField
              label="Status"
              name="status"
              value={form.status}
              onChange={handleChange}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'pending', label: 'Pending' },
                { value: 'renewed', label: 'Renewed' },
                { value: 'expired', label: 'Expired' },
                { value: 'not-renewed', label: 'Not Renewed' },
              ]}
              required
            />
          </div>
          {error && <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
          <div className="sticky bottom-0 bg-white pt-3 border-t border-[#E8F0EE] flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-[#F5F9F8] rounded-lg text-sm font-medium">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <><FiRefreshCw className="animate-spin text-sm" /> Saving...</> : <><FiSave className="text-sm" /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ============================================================
   SERVICE EDIT MODAL
============================================================ */
const ServiceEditModal = ({ item, show, onClose, onSave, loading, complaints }) => {
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (item && show) { setForm({ ...item }); setError(''); }
  }, [item, show]);

  if (!item || !show || !form) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title?.trim()) return setError('Title is required.');
    if (!form.tenant?.trim()) return setError('Tenant is required.');
    if (!form.unit?.trim()) return setError('Unit is required.');
    if (!form.requestedDate) return setError('Request date is required.');
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[88vh] overflow-hidden shadow-2xl border border-[#E8F0EE] flex flex-col">
        <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 rounded-t-2xl flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Edit Service Request</h2>
            <p className="text-white/70 text-[10px]">{item.id}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white">
            <FiX className="text-sm" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormField label="Title" name="title" value={form.title} onChange={handleChange} required />
            <FormField
              label="Service Type"
              name="type"
              value={form.type}
              onChange={handleChange}
              options={[
                { value: 'plumbing', label: 'Plumbing' },
                { value: 'electrical', label: 'Electrical' },
                { value: 'ac-repair', label: 'AC Repair' },
                { value: 'cleaning', label: 'Cleaning' },
                { value: 'pest', label: 'Pest Control' },
                { value: 'painting', label: 'Painting' },
                { value: 'security', label: 'Security' },
                { value: 'landscaping', label: 'Landscaping' },
                { value: 'general', label: 'General Maintenance' },
              ]}
              required
            />
            <FormField
              label="Priority"
              name="priority"
              value={form.priority}
              onChange={handleChange}
              options={[
                { value: 'urgent', label: 'Urgent' },
                { value: 'high', label: 'High' },
                { value: 'medium', label: 'Medium' },
                { value: 'low', label: 'Low' },
              ]}
              required
            />
            <FormField
              label="Status"
              name="status"
              value={form.status}
              onChange={handleChange}
              options={[
                { value: 'pending', label: 'Pending' },
                { value: 'scheduled', label: 'Scheduled' },
                { value: 'in-progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' },
                { value: 'on-hold', label: 'On Hold' },
                { value: 'cancelled', label: 'Cancelled' },
              ]}
              required
            />
            <FormField label="Tenant" name="tenant" value={form.tenant} onChange={handleChange} required />
            <FormField label="Unit" name="unit" value={form.unit} onChange={handleChange} required />
            <FormField label="Property Name" name="propertyName" value={form.propertyName} onChange={handleChange} />
            <FormField label="Assigned Technician" name="assignedTo" value={form.assignedTo} onChange={handleChange} />
            <FormField label="Requested Date" name="requestedDate" type="date" value={form.requestedDate} onChange={handleChange} required />
            <FormField label="Scheduled Date" name="scheduledDate" type="date" value={form.scheduledDate} onChange={handleChange} />
            <FormField
              label="Related Complaint"
              name="relatedComplaintId"
              value={form.relatedComplaintId || ''}
              onChange={handleChange}
              options={[{ value: '', label: '— None —' }, ...complaints.map((c) => ({ value: c.id, label: `${c.id} — ${c.title}` }))]}
            />
            <FormField label="Estimated Cost (₹)" name="estimatedCost" type="number" value={form.estimatedCost} onChange={handleChange} />
            <FormField label="Labour Cost (₹)" name="labourCost" type="number" value={form.labourCost} onChange={handleChange} />
            <FormField label="Materials Cost (₹)" name="materialsCost" type="number" value={form.materialsCost} onChange={handleChange} />
            <FormField label="Actual Cost (₹)" name="actualCost" type="number" value={form.actualCost} onChange={handleChange} />
            <FormField label="Completion Date" name="completionDate" type="date" value={form.completionDate} onChange={handleChange} />
            <FormField label="Description" name="description" value={form.description} onChange={handleChange} textarea colSpan={2} />
            <FormField label="Work / Resolution Notes" name="workNotes" value={form.workNotes || ''} onChange={handleChange} textarea colSpan={2} />
          </div>
          {error && <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
          <div className="sticky bottom-0 bg-white pt-3 border-t border-[#E8F0EE] flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-[#F5F9F8] rounded-lg text-sm font-medium">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <><FiRefreshCw className="animate-spin text-sm" /> Saving...</> : <><FiSave className="text-sm" /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ============================================================
   COMPLAINT MANAGEMENT
============================================================ */
const ComplaintManagement = ({ data, onView, onEdit, onResolve, onStart, onDelete, onCreateService, actionLoading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(9);
  const [viewMode, setViewMode] = useState('grid');

  const filteredData = useMemo(() => {
    let f = [...data];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      f = f.filter((it) =>
        it.id.toLowerCase().includes(q) ||
        it.title.toLowerCase().includes(q) ||
        it.tenant.toLowerCase().includes(q) ||
        it.unit.toLowerCase().includes(q) ||
        (it.propertyName || '').toLowerCase().includes(q)
      );
    }
    if (selectedStatus !== 'all') f = f.filter((it) => it.status === selectedStatus);
    if (selectedPriority !== 'all') f = f.filter((it) => it.priority === selectedPriority);
    return f;
  }, [data, searchQuery, selectedStatus, selectedPriority]);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, selectedStatus, selectedPriority]);

  const paginated = useMemo(() => {
    const s = (currentPage - 1) * pageSize;
    return filteredData.slice(s, s + pageSize);
  }, [filteredData, currentPage, pageSize]);

  if (filteredData.length === 0) {
    return <EmptyState icon={<FiTool className="text-3xl text-[#B5C9C5]" />} title="No complaints found" subtitle="Try adjusting your search or filter criteria" />;
  }

  return (
    <div className="space-y-4">
      <SearchAndViewToggle
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder="Search by ID, title, tenant, unit, property..."
        viewMode={viewMode}
        setViewMode={setViewMode}
      >
        <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="px-3 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] text-sm outline-none">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
          <option value="needs-review">Needs Review</option>
          <option value="rejected">Rejected</option>
        </select>
        <select value={selectedPriority} onChange={(e) => setSelectedPriority(e.target.value)} className="px-3 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] text-sm outline-none">
          <option value="all">All Priority</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </SearchAndViewToggle>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.map((item) => (
            <div key={item.id} className={`bg-white rounded-2xl border border-[#E8F0EE] border-l-4 ${priorityColors[item.priority]} p-4 hover:shadow-xl transition-all`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white">
                    {complaintIcons[item.type] || <FaTools className="text-sm" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-[#1A2E2A] truncate max-w-[150px]">{item.title}</h4>
                    <p className="text-[9px] text-[#5A7D78]">{item.id}</p>
                  </div>
                </div>
                <button onClick={() => onView(item)} className="p-1 hover:bg-[#F5F9F8] rounded-lg text-[#5A7D78] hover:text-[#00695C]">
                  <FiEye className="text-sm" />
                </button>
              </div>
              <div className="flex items-center gap-1 flex-wrap mb-2">
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${statusColors[item.status]}`}>{cap(item.status)}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${priorityBadge[item.priority]}`}>{cap(item.priority)}</span>
              </div>
              <div className="space-y-1 text-xs text-[#5A7D78]">
                <div className="flex items-center gap-2"><FiUser className="text-[#00695C]" /> {item.tenant}</div>
                <div className="flex items-center gap-2"><FiMapPin className="text-[#00695C]" /> Unit {item.unit}</div>
                <div className="flex items-center gap-2"><FiCalendar className="text-[#00695C]" /> {fmtDate(item.reportedDate)}</div>
                {item.assignedTo && <div className="flex items-center gap-2"><FiUserCheck className="text-[#00695C]" /> {item.assignedTo}</div>}
                {item.relatedServiceId && (
                  <div className="flex items-center gap-2 text-[#00695C]"><FiLink className="text-[#00695C]" /> SR: {item.relatedServiceId}</div>
                )}
              </div>
              <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-[#E8F0EE]">
                <button onClick={() => onView(item)} className="flex-1 py-1.5 text-[10px] font-medium text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100"><FiEye className="inline text-[10px] mr-1" />View</button>
                <button onClick={() => onEdit(item)} className="flex-1 py-1.5 text-[10px] font-medium text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5]"><FiEdit className="inline text-[10px] mr-1" />Edit</button>
                {item.status === 'pending' && (
                  <button onClick={() => onStart(item)} disabled={actionLoading === 'start'} className="flex-1 py-1.5 text-[10px] font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 disabled:opacity-50"><FiPlayCircle className="inline text-[10px] mr-1" />Start</button>
                )}
                {(item.status === 'pending' || item.status === 'in-progress') && (
                  <button onClick={() => onResolve(item)} disabled={actionLoading === 'resolve'} className="flex-1 py-1.5 text-[10px] font-medium text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 disabled:opacity-50"><FiCheckCircle className="inline text-[10px] mr-1" />Resolve</button>
                )}
                {!item.relatedServiceId && (
                  <button onClick={() => onCreateService(item)} className="flex-1 py-1.5 text-[10px] font-medium text-purple-600 bg-purple-50 rounded-xl hover:bg-purple-100"><FiPlus className="inline text-[10px] mr-1" />Service</button>
                )}
                <button onClick={() => onDelete(item.id)} disabled={actionLoading === 'delete'} className="flex-1 py-1.5 text-[10px] font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 disabled:opacity-50"><FiTrash2 className="inline text-[10px] mr-1" />Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E8F0EE] overflow-hidden">
          <div className="grid grid-cols-12 gap-2 px-4 py-2.5 bg-[#F5F9F8] text-[10px] font-bold text-[#5A7D78] uppercase tracking-wider border-b border-[#E8F0EE] items-center">
            <div className="col-span-3">Title / ID</div>
            <div className="col-span-1">Type</div>
            <div className="col-span-1">Priority</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-2">Tenant</div>
            <div className="col-span-1">Reported</div>
            <div className="col-span-3 text-right">Actions</div>
          </div>
          {paginated.map((item) => (
            <div key={item.id} className={`grid grid-cols-12 gap-2 items-center px-4 py-2.5 border-b border-[#E8F0EE] border-l-4 ${priorityColors[item.priority]} hover:bg-[#F5F9F8] transition-colors`}>
              <div className="col-span-3 flex items-center gap-2 pr-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white shrink-0">
                  {complaintIcons[item.type] || <FaTools className="text-[10px]" />}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#1A2E2A] truncate">{item.title}</p>
                  <p className="text-[9px] text-[#5A7D78]">{item.id}</p>
                </div>
              </div>
              <div className="col-span-1 text-xs text-[#5A7D78] truncate">{cap(item.type)}</div>
              <div className="col-span-1"><span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap ${priorityBadge[item.priority]}`}>{cap(item.priority)}</span></div>
              <div className="col-span-1"><span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap ${statusColors[item.status]}`}>{cap(item.status)}</span></div>
              <div className="col-span-2 text-xs text-[#5A7D78] truncate pr-2">{item.tenant}</div>
              <div className="col-span-1 text-xs text-[#5A7D78] whitespace-nowrap">{fmtDate(item.reportedDate)}</div>
              <div className="col-span-3 flex items-center justify-end gap-1">
                <button onClick={() => onView(item)} title="View" className="p-1.5 rounded-lg text-emerald-600 bg-emerald-50 hover:bg-emerald-100"><FiEye className="text-xs" /></button>
                <button onClick={() => onEdit(item)} title="Edit" className="p-1.5 rounded-lg text-[#00695C] bg-[#E8F4F2] hover:bg-[#C5EDE5]"><FiEdit className="text-xs" /></button>
                {item.status === 'pending' && (
                  <button onClick={() => onStart(item)} disabled={actionLoading === 'start'} title="Start" className="p-1.5 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 disabled:opacity-50"><FiPlayCircle className="text-xs" /></button>
                )}
                {(item.status === 'pending' || item.status === 'in-progress') && (
                  <button onClick={() => onResolve(item)} disabled={actionLoading === 'resolve'} title="Resolve" className="p-1.5 rounded-lg text-emerald-600 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-50"><FiCheckCircle className="text-xs" /></button>
                )}
                {!item.relatedServiceId && (
                  <button onClick={() => onCreateService(item)} title="Create Service" className="p-1.5 rounded-lg text-purple-600 bg-purple-50 hover:bg-purple-100"><FiPlus className="text-xs" /></button>
                )}
                <button onClick={() => onDelete(item.id)} disabled={actionLoading === 'delete'} title="Delete" className="p-1.5 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 disabled:opacity-50"><FiTrash2 className="text-xs" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination total={filteredData.length} currentPage={currentPage} pageSize={pageSize} onPage={setCurrentPage} />
    </div>
  );
};

/* ============================================================
   RENT COLLECTION
============================================================ */
const RentCollection = ({ data, onView, onEdit, onPay, onViewHistory, onDelete, actionLoading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(9);
  const [viewMode, setViewMode] = useState('grid');

  const months = useMemo(() => {
    const set = new Set(data.map((r) => r.month));
    return ['all', ...Array.from(set).sort().reverse()];
  }, [data]);

  const filteredData = useMemo(() => {
    let f = [...data];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      f = f.filter((it) =>
        it.id.toLowerCase().includes(q) ||
        it.tenant.toLowerCase().includes(q) ||
        it.unit.toLowerCase().includes(q) ||
        (it.propertyName || '').toLowerCase().includes(q)
      );
    }
    if (selectedStatus !== 'all') f = f.filter((it) => it.status === selectedStatus);
    if (selectedMonth !== 'all') f = f.filter((it) => it.month === selectedMonth);
    return f;
  }, [data, searchQuery, selectedStatus, selectedMonth]);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, selectedStatus, selectedMonth]);

  const paginated = useMemo(() => {
    const s = (currentPage - 1) * pageSize;
    return filteredData.slice(s, s + pageSize);
  }, [filteredData, currentPage, pageSize]);

  if (filteredData.length === 0) {
    return <EmptyState icon={<FiDollarSign className="text-3xl text-[#B5C9C5]" />} title="No rent records found" subtitle="Try adjusting your search or filter criteria" />;
  }

  return (
    <div className="space-y-4">
      <SearchAndViewToggle
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder="Search by ID, tenant, unit, property..."
        viewMode={viewMode}
        setViewMode={setViewMode}
      >
        <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="px-3 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] text-sm outline-none">
          <option value="all">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="partial">Partial</option>
          <option value="overdue">Overdue</option>
          <option value="failed">Failed</option>
        </select>
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="px-3 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] text-sm outline-none">
          {months.map((m) => <option key={m} value={m}>{m === 'all' ? 'All Months' : m}</option>)}
        </select>
      </SearchAndViewToggle>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-[#E8F0EE] p-4 hover:shadow-xl transition-all">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white">
                    <FiDollarSign />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-[#1A2E2A]">{item.tenant}</h4>
                    <p className="text-[9px] text-[#5A7D78]">{item.id}</p>
                  </div>
                </div>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${statusColors[item.status]}`}>{cap(item.status)}</span>
              </div>
              <div className="space-y-1 text-xs text-[#5A7D78]">
                <div className="flex items-center gap-2"><FiMapPin className="text-[#00695C]" /> Unit {item.unit} · {item.month}</div>
                <div className="flex items-center gap-2"><FiDollarSign className="text-[#00695C]" /> Due: {fmtCurrency(item.totalDue)}</div>
                <div className="flex items-center gap-2"><FiCheckCircle className="text-[#00695C]" /> Paid: {fmtCurrency(item.amountPaid)}</div>
                <div className="flex items-center gap-2 text-red-600"><FiAlertTriangle className="text-red-600" /> Outstanding: {fmtCurrency(item.outstanding)}</div>
                <div className="flex items-center gap-2"><FiCalendar className="text-[#00695C]" /> Due: {fmtDate(item.dueDate)}</div>
                {item.paymentDate && <div className="flex items-center gap-2"><FiCalendar className="text-[#00695C]" /> Paid: {fmtDate(item.paymentDate)}</div>}
              </div>
              <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-[#E8F0EE]">
                <button onClick={() => onView(item)} className="flex-1 py-1.5 text-[10px] font-medium text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100">View</button>
                <button onClick={() => onEdit(item)} className="flex-1 py-1.5 text-[10px] font-medium text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5]">Edit</button>
                {item.status !== 'paid' && item.outstanding > 0 && (
                  <button onClick={() => onPay(item)} disabled={actionLoading === 'pay'} className="flex-1 py-1.5 text-[10px] font-medium text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 disabled:opacity-50">Pay</button>
                )}
                {item.status !== 'paid' && (
                  <button onClick={() => onDelete(item.id)} disabled={actionLoading === 'delete'} className="flex-1 py-1.5 text-[10px] font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 disabled:opacity-50">Cancel</button>
                )}
                <button onClick={() => onViewHistory(item)} className="flex-1 py-1.5 text-[10px] font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100">History</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E8F0EE] overflow-hidden">
          <div className="grid grid-cols-12 gap-2 px-4 py-2.5 bg-[#F5F9F8] text-[10px] font-bold text-[#5A7D78] uppercase tracking-wider border-b border-[#E8F0EE] items-center">
            <div className="col-span-3">Tenant / ID</div>
            <div className="col-span-1">Month</div>
            <div className="col-span-2">Total Due</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-2">Outstanding</div>
            <div className="col-span-3 text-right">Actions</div>
          </div>
          {paginated.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-2 items-center px-4 py-2.5 border-b border-[#E8F0EE] hover:bg-[#F5F9F8] transition-colors">
              <div className="col-span-3 pr-2">
                <p className="text-xs font-semibold text-[#1A2E2A] truncate">{item.tenant}</p>
                <p className="text-[9px] text-[#5A7D78]">{item.id}</p>
              </div>
              <div className="col-span-1 text-xs text-[#5A7D78]">{item.month}</div>
              <div className="col-span-2 text-xs font-semibold text-[#1A2E2A]">{fmtCurrency(item.totalDue)}</div>
              <div className="col-span-1"><span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap ${statusColors[item.status]}`}>{cap(item.status)}</span></div>
              <div className="col-span-2 text-xs text-red-600 font-medium">{fmtCurrency(item.outstanding)}</div>
              <div className="col-span-3 flex items-center justify-end gap-1">
                <button onClick={() => onView(item)} title="View" className="p-1.5 rounded-lg text-emerald-600 bg-emerald-50 hover:bg-emerald-100"><FiEye className="text-xs" /></button>
                <button onClick={() => onEdit(item)} title="Edit" className="p-1.5 rounded-lg text-[#00695C] bg-[#E8F4F2] hover:bg-[#C5EDE5]"><FiEdit className="text-xs" /></button>
                {item.status !== 'paid' && item.outstanding > 0 && (
                  <button onClick={() => onPay(item)} disabled={actionLoading === 'pay'} title="Pay" className="p-1.5 rounded-lg text-emerald-600 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-50"><FiDollarSign className="text-xs" /></button>
                )}
                <button onClick={() => onViewHistory(item)} title="History" className="p-1.5 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100"><FiClock className="text-xs" /></button>
                {item.status !== 'paid' && (
                  <button onClick={() => onDelete(item.id)} disabled={actionLoading === 'delete'} title="Cancel" className="p-1.5 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 disabled:opacity-50"><FiX className="text-xs" /></button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination total={filteredData.length} currentPage={currentPage} pageSize={pageSize} onPage={setCurrentPage} />
    </div>
  );
};

/* ============================================================
   LEASE RENEWAL
============================================================ */
const LeaseRenewal = ({ data, onView, onEdit, onRenew, onDelete, actionLoading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedExpiry, setSelectedExpiry] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(9);
  const [viewMode, setViewMode] = useState('grid');

  const filteredData = useMemo(() => {
    let f = [...data];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      f = f.filter((it) =>
        it.id.toLowerCase().includes(q) ||
        it.tenant.toLowerCase().includes(q) ||
        it.unit.toLowerCase().includes(q) ||
        (it.propertyName || '').toLowerCase().includes(q)
      );
    }
    if (selectedStatus !== 'all') f = f.filter((it) => it.status === selectedStatus);
    if (selectedExpiry !== 'all') {
      f = f.filter((it) => {
        const d = leaseDaysLeft(it.leaseEnd);
        if (selectedExpiry === 'expired') return d < 0 || it.status === 'expired';
        if (selectedExpiry === 'soon') return d >= 0 && d <= 30;
        if (selectedExpiry === 'active') return d > 30;
        return true;
      });
    }
    return f;
  }, [data, searchQuery, selectedStatus, selectedExpiry]);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, selectedStatus, selectedExpiry]);

  const paginated = useMemo(() => {
    const s = (currentPage - 1) * pageSize;
    return filteredData.slice(s, s + pageSize);
  }, [filteredData, currentPage, pageSize]);

  if (filteredData.length === 0) {
    return <EmptyState icon={<FiFile className="text-3xl text-[#B5C9C5]" />} title="No lease records found" subtitle="Try adjusting your search or filter criteria" />;
  }

  return (
    <div className="space-y-4">
      <SearchAndViewToggle
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder="Search by ID, tenant, unit, property..."
        viewMode={viewMode}
        setViewMode={setViewMode}
      >
        <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="px-3 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] text-sm outline-none">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="renewed">Renewed</option>
          <option value="expired">Expired</option>
          <option value="not-renewed">Not Renewed</option>
        </select>
        <select value={selectedExpiry} onChange={(e) => setSelectedExpiry(e.target.value)} className="px-3 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] text-sm outline-none">
          <option value="all">All Expiry</option>
          <option value="expired">Expired</option>
          <option value="soon">Expiring in 30 days</option>
          <option value="active">30+ days remaining</option>
        </select>
      </SearchAndViewToggle>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.map((item) => {
            const dLeft = leaseDaysLeft(item.leaseEnd);
            const isExpired = dLeft < 0;
            return (
              <div key={item.id} className="bg-white rounded-2xl border border-[#E8F0EE] p-4 hover:shadow-xl transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white">
                      <FiFile />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-[#1A2E2A]">{item.tenant}</h4>
                      <p className="text-[9px] text-[#5A7D78]">{item.id}</p>
                    </div>
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${statusColors[item.status]}`}>{cap(item.status)}</span>
                </div>
                <div className="space-y-1 text-xs text-[#5A7D78]">
                  <div className="flex items-center gap-2"><FiMapPin className="text-[#00695C]" /> Unit {item.unit} · {item.propertyName}</div>
                  <div className="flex items-center gap-2"><FiCalendar className="text-[#00695C]" /> {fmtDate(item.leaseStart)} → {fmtDate(item.leaseEnd)}</div>
                  <div className="flex items-center gap-2"><FiDollarSign className="text-[#00695C]" /> {fmtCurrency(item.rent)}/month</div>
                  <div className={`flex items-center gap-2 ${isExpired ? 'text-red-600' : dLeft <= 30 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    <FiClock /> {isExpired ? 'Expired' : `${dLeft} days left`}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-[#E8F0EE]">
                  <button onClick={() => onView(item)} className="flex-1 py-1.5 text-[10px] font-medium text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100">View</button>
                  <button onClick={() => onEdit(item)} className="flex-1 py-1.5 text-[10px] font-medium text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5]">Edit</button>
                  {(isExpired || item.status === 'pending' || dLeft <= 60) && (
                    <button onClick={() => onRenew(item)} disabled={actionLoading === 'renew'} className="flex-1 py-1.5 text-[10px] font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 disabled:opacity-50">Renew</button>
                  )}
                  <button onClick={() => onDelete(item.id)} disabled={actionLoading === 'delete'} className="flex-1 py-1.5 text-[10px] font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 disabled:opacity-50">Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E8F0EE] overflow-hidden">
          <div className="grid grid-cols-12 gap-2 px-4 py-2.5 bg-[#F5F9F8] text-[10px] font-bold text-[#5A7D78] uppercase tracking-wider border-b border-[#E8F0EE] items-center">
            <div className="col-span-3">Tenant / ID</div>
            <div className="col-span-3">Period</div>
            <div className="col-span-2">Rent</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-3 text-right">Actions</div>
          </div>
          {paginated.map((item) => {
            const dLeft = leaseDaysLeft(item.leaseEnd);
            const isExpired = dLeft < 0;
            return (
              <div key={item.id} className="grid grid-cols-12 gap-2 items-center px-4 py-2.5 border-b border-[#E8F0EE] hover:bg-[#F5F9F8] transition-colors">
                <div className="col-span-3 pr-2">
                  <p className="text-xs font-semibold text-[#1A2E2A] truncate">{item.tenant}</p>
                  <p className="text-[9px] text-[#5A7D78]">{item.id}</p>
                </div>
                <div className="col-span-3 text-xs text-[#5A7D78] truncate">
                  {fmtDate(item.leaseStart)} → {fmtDate(item.leaseEnd)}
                </div>
                <div className="col-span-2 text-xs font-semibold text-[#1A2E2A]">{fmtCurrency(item.rent)}</div>
                <div className="col-span-1"><span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap ${statusColors[item.status]}`}>{cap(item.status)}</span></div>
                <div className="col-span-3 flex items-center justify-end gap-1">
                  <button onClick={() => onView(item)} title="View" className="p-1.5 rounded-lg text-emerald-600 bg-emerald-50 hover:bg-emerald-100"><FiEye className="text-xs" /></button>
                  <button onClick={() => onEdit(item)} title="Edit" className="p-1.5 rounded-lg text-[#00695C] bg-[#E8F4F2] hover:bg-[#C5EDE5]"><FiEdit className="text-xs" /></button>
                  {(isExpired || item.status === 'pending' || dLeft <= 60) && (
                    <button onClick={() => onRenew(item)} disabled={actionLoading === 'renew'} title="Renew" className="p-1.5 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 disabled:opacity-50"><FiRotateCcw className="text-xs" /></button>
                  )}
                  <button onClick={() => onDelete(item.id)} disabled={actionLoading === 'delete'} title="Delete" className="p-1.5 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 disabled:opacity-50"><FiTrash2 className="text-xs" /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Pagination total={filteredData.length} currentPage={currentPage} pageSize={pageSize} onPage={setCurrentPage} />
    </div>
  );
};

/* ============================================================
   SERVICE REQUESTS
============================================================ */
const ServiceRequests = ({ data, onView, onEdit, onComplete, onDelete, actionLoading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(9);
  const [viewMode, setViewMode] = useState('grid');

  const serviceTypeLabels = {
    plumbing: 'Plumbing',
    electrical: 'Electrical',
    'ac-repair': 'AC Repair',
    cleaning: 'Cleaning',
    pest: 'Pest Control',
    painting: 'Painting',
    security: 'Security',
    landscaping: 'Landscaping',
    general: 'General Maintenance',
  };

  const filteredData = useMemo(() => {
    let f = [...data];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      f = f.filter((it) =>
        it.id.toLowerCase().includes(q) ||
        it.title.toLowerCase().includes(q) ||
        it.tenant.toLowerCase().includes(q) ||
        it.unit.toLowerCase().includes(q) ||
        (it.propertyName || '').toLowerCase().includes(q)
      );
    }
    if (selectedStatus !== 'all') f = f.filter((it) => it.status === selectedStatus);
    if (selectedType !== 'all') f = f.filter((it) => it.type === selectedType);
    if (selectedPriority !== 'all') f = f.filter((it) => it.priority === selectedPriority);
    return f;
  }, [data, searchQuery, selectedStatus, selectedType, selectedPriority]);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, selectedStatus, selectedType, selectedPriority]);

  const paginated = useMemo(() => {
    const s = (currentPage - 1) * pageSize;
    return filteredData.slice(s, s + pageSize);
  }, [filteredData, currentPage, pageSize]);

  if (filteredData.length === 0) {
    return <EmptyState icon={<FiClipboard className="text-3xl text-[#B5C9C5]" />} title="No service requests found" subtitle="Try adjusting your search or filter criteria" />;
  }

  return (
    <div className="space-y-4">
      <SearchAndViewToggle
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder="Search by ID, title, tenant, unit, property..."
        viewMode={viewMode}
        setViewMode={setViewMode}
      >
        <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="px-3 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] text-sm outline-none">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="scheduled">Scheduled</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="on-hold">On Hold</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="px-3 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] text-sm outline-none">
          <option value="all">All Types</option>
          {Object.entries(serviceTypeLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <select value={selectedPriority} onChange={(e) => setSelectedPriority(e.target.value)} className="px-3 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] text-sm outline-none">
          <option value="all">All Priority</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </SearchAndViewToggle>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.map((item) => (
            <div key={item.id} className={`bg-white rounded-2xl border border-[#E8F0EE] border-l-4 ${priorityColors[item.priority]} p-4 hover:shadow-xl transition-all`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center text-white">
                    <FiClipboard />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-[#1A2E2A] truncate max-w-[150px]">{item.title}</h4>
                    <p className="text-[9px] text-[#5A7D78]">{item.id}</p>
                  </div>
                </div>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${statusColors[item.status]}`}>{cap(item.status)}</span>
              </div>
              <div className="space-y-1 text-xs text-[#5A7D78]">
                <div className="flex items-center gap-2"><FiTag className="text-[#00695C]" /> {serviceTypeLabels[item.type] || item.type}</div>
                <div className="flex items-center gap-2"><FiUser className="text-[#00695C]" /> {item.tenant}</div>
                <div className="flex items-center gap-2"><FiMapPin className="text-[#00695C]" /> Unit {item.unit}</div>
                <div className="flex items-center gap-2"><FiCalendar className="text-[#00695C]" /> {fmtDate(item.requestedDate)}</div>
                {item.scheduledDate && <div className="flex items-center gap-2"><FiClock className="text-[#00695C]" /> {fmtDate(item.scheduledDate)}</div>}
                {item.assignedTo && <div className="flex items-center gap-2"><FiUserCheck className="text-[#00695C]" /> {item.assignedTo}</div>}
                {item.relatedComplaintId && <div className="flex items-center gap-2 text-[#00695C]"><FiLink /> CMP: {item.relatedComplaintId}</div>}
              </div>
              <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-[#E8F0EE]">
                <button onClick={() => onView(item)} className="flex-1 py-1.5 text-[10px] font-medium text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100">View</button>
                <button onClick={() => onEdit(item)} className="flex-1 py-1.5 text-[10px] font-medium text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5]">Edit</button>
                {item.status !== 'completed' && item.status !== 'cancelled' && (
                  <button onClick={() => onComplete(item)} disabled={actionLoading === 'complete'} className="flex-1 py-1.5 text-[10px] font-medium text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 disabled:opacity-50">Complete</button>
                )}
                <button onClick={() => onDelete(item.id)} disabled={actionLoading === 'delete'} className="flex-1 py-1.5 text-[10px] font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 disabled:opacity-50">Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E8F0EE] overflow-hidden">
          <div className="grid grid-cols-12 gap-2 px-4 py-2.5 bg-[#F5F9F8] text-[10px] font-bold text-[#5A7D78] uppercase tracking-wider border-b border-[#E8F0EE] items-center">
            <div className="col-span-3">Title / ID</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-2">Tenant</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-4 text-right">Actions</div>
          </div>
          {paginated.map((item) => (
            <div key={item.id} className={`grid grid-cols-12 gap-2 items-center px-4 py-2.5 border-b border-[#E8F0EE] border-l-4 ${priorityColors[item.priority]} hover:bg-[#F5F9F8] transition-colors`}>
              <div className="col-span-3 pr-2">
                <p className="text-xs font-semibold text-[#1A2E2A] truncate">{item.title}</p>
                <p className="text-[9px] text-[#5A7D78]">{item.id}</p>
              </div>
              <div className="col-span-2 text-xs text-[#5A7D78] truncate pr-2">{serviceTypeLabels[item.type] || item.type}</div>
              <div className="col-span-2 text-xs text-[#5A7D78] truncate pr-2">{item.tenant}</div>
              <div className="col-span-1"><span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap ${statusColors[item.status]}`}>{cap(item.status)}</span></div>
              <div className="col-span-4 flex items-center justify-end gap-1">
                <button onClick={() => onView(item)} title="View" className="p-1.5 rounded-lg text-emerald-600 bg-emerald-50 hover:bg-emerald-100"><FiEye className="text-xs" /></button>
                <button onClick={() => onEdit(item)} title="Edit" className="p-1.5 rounded-lg text-[#00695C] bg-[#E8F4F2] hover:bg-[#C5EDE5]"><FiEdit className="text-xs" /></button>
                {item.status !== 'completed' && item.status !== 'cancelled' && (
                  <button onClick={() => onComplete(item)} disabled={actionLoading === 'complete'} title="Complete" className="p-1.5 rounded-lg text-emerald-600 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-50"><FiCheckCircle className="text-xs" /></button>
                )}
                <button onClick={() => onDelete(item.id)} disabled={actionLoading === 'delete'} title="Delete" className="p-1.5 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 disabled:opacity-50"><FiTrash2 className="text-xs" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination total={filteredData.length} currentPage={currentPage} pageSize={pageSize} onPage={setCurrentPage} />
    </div>
  );
};

/* ============================================================
   MAIN COMPONENT
============================================================ */
const PropertyManagersMaintenance = () => {
  const [activeTab, setActiveTab] = useState('complaints');
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false); // New state for refresh loading

  const [viewingItem, setViewingItem] = useState(null);
  const [viewType, setViewType] = useState('complaint');
  const [showViewModal, setShowViewModal] = useState(false);

  const [editingItem, setEditingItem] = useState(null);
  const [editType, setEditType] = useState('complaint');
  const [showEditModal, setShowEditModal] = useState(false);

  const [payRecord, setPayRecord] = useState(null);
  const [showPayModal, setShowPayModal] = useState(false);

  const [renewLease, setRenewLease] = useState(null);
  const [showRenewModal, setShowRenewModal] = useState(false);

  const [completeRequest, setCompleteRequest] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const [confirmState, setConfirmState] = useState({ open: false, title: '', message: '', onConfirm: null, confirmColor: 'bg-red-500' });

  const [historyRecord, setHistoryRecord] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  const [previewImage, setPreviewImage] = useState(null);

  /* ---------------- DATA ---------------- */
  const [complaints, setComplaints] = useState([]);
  const [rentRecords, setRentRecords] = useState([]);
  const [leaseRecords, setLeaseRecords] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  }, []);

  /* ---------------- SEED MOCK DATA ---------------- */
  const generateMockData = useCallback(() => {
    const tenants = [
      { name: 'John Doe', phone: '+91 98765 43210', email: 'john@example.com' },
      { name: 'Jane Smith', phone: '+91 91234 56789', email: 'jane@example.com' },
      { name: 'Robert Johnson', phone: '+91 99887 76655', email: 'robert@example.com' },
      { name: 'Maria Garcia', phone: '+91 90909 80808', email: 'maria@example.com' },
      { name: 'David Lee', phone: '+91 98181 71717', email: 'david@example.com' },
      { name: 'Sarah Wilson', phone: '+91 97070 60606', email: 'sarah@example.com' },
    ];
    const units = ['A101', 'B202', 'C303', 'D404', 'A205', 'B306'];
    const properties = ['Palm Grove Residency', 'Emerald Heights', 'Sunrise Apartments', 'Green Valley Villas'];
    const owners = ['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Neha Verma'];

    const complaintTitles = [
      'Leaking bathroom faucet', 'AC not cooling', 'Electrical short in kitchen',
      'Pest control required', 'Broken window glass', 'Painting required in living room',
      'Refrigerator not working', 'Water heater issue', 'Clogged drainage',
      'Flickering lights in hallway', 'Heating system malfunction', 'Door lock broken',
    ];
    const complaintTypes = ['plumbing', 'electrical', 'hvac', 'pest', 'structural', 'painting', 'appliance', 'other'];
    const priorities = ['urgent', 'high', 'medium', 'low'];
    const cStatuses = ['pending', 'in-progress', 'resolved', 'closed', 'needs-review', 'rejected'];

    const newComplaints = Array.from({ length: 14 }, (_, i) => {
      const t = tenants[i % tenants.length];
      const status = cStatuses[i % cStatuses.length];
      return {
        id: `CMP-${String(i + 1).padStart(4, '0')}`,
        title: complaintTitles[i % complaintTitles.length],
        type: complaintTypes[i % complaintTypes.length],
        priority: priorities[i % priorities.length],
        status,
        description: `Detailed description for ${complaintTitles[i % complaintTitles.length].toLowerCase()}. Reported by tenant.`,
        tenant: t.name,
        tenantPhone: t.phone,
        tenantEmail: t.email,
        propertyName: properties[i % properties.length],
        unit: units[i % units.length],
        assignedTo: Math.random() > 0.4 ? 'Mike Wilson' : '',
        reportedDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString().split('T')[0],
        resolvedDate: status === 'resolved' ? todayISO() : '',
        resolutionNotes: status === 'resolved' ? 'Issue fixed and verified with tenant.' : '',
        reason: status === 'rejected' || status === 'needs-review' ? 'Duplicate or insufficient information.' : '',
        attachments: Math.random() > 0.5 ? ['photo-1.jpg', 'photo-2.jpg'] : [],
        relatedServiceId: '',
        lastUpdated: todayISO(),
      };
    });

    const rentStatuses = ['paid', 'pending', 'overdue', 'partial'];
    const months = ['2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06'];
    const newRent = Array.from({ length: 18 }, (_, i) => {
      const t = tenants[i % tenants.length];
      const monthlyRent = 15000 + (i % 4) * 5000;
      const additional = i % 3 === 0 ? 1500 : 0;
      const lateFee = i % 5 === 0 ? 500 : 0;
      const discount = i % 4 === 0 ? 1000 : 0;
      const totalDue = monthlyRent + additional + lateFee - discount;
      const status = rentStatuses[i % rentStatuses.length];
      const amountPaid = status === 'paid' ? totalDue : status === 'partial' ? Math.floor(totalDue / 2) : 0;
      const outstanding = totalDue - amountPaid;
      return {
        id: `RNT-${String(i + 1).padStart(4, '0')}`,
        propertyName: properties[i % properties.length],
        propertyId: `PRP-${String((i % 4) + 1).padStart(3, '0')}`,
        unit: units[i % units.length],
        tenant: t.name,
        ownerName: owners[i % owners.length],
        month: months[i % months.length],
        monthlyRent,
        additionalCharges: additional,
        lateFee,
        discount,
        totalDue,
        amountPaid,
        outstanding,
        dueDate: new Date(Date.now() - (i % 5) * 86400000).toISOString().split('T')[0],
        paymentDate: amountPaid > 0 ? new Date(Date.now() - (i % 3) * 86400000).toISOString().split('T')[0] : '',
        paymentMethod: amountPaid > 0 ? ['UPI', 'Card', 'Bank Transfer'][i % 3] : '',
        reference: amountPaid > 0 ? `TXN${100000 + i}` : '',
        status: outstanding === 0 ? 'paid' : status,
        paymentHistory: amountPaid > 0
          ? [{ date: new Date(Date.now() - (i % 3) * 86400000).toISOString().split('T')[0], amount: amountPaid, method: 'UPI', reference: `TXN${100000 + i}`, recordedAt: todayISO() }]
          : [],
      };
    });

    const leaseStatuses = ['active', 'pending', 'expired', 'renewed', 'not-renewed'];
    const newLeases = Array.from({ length: 12 }, (_, i) => {
      const t = tenants[i % tenants.length];
      const start = new Date(Date.now() - (i % 6) * 30 * 86400000);
      const end = new Date(start.getTime() + 365 * 86400000);
      return {
        id: `LSE-${String(i + 1).padStart(4, '0')}`,
        propertyName: properties[i % properties.length],
        unit: units[i % units.length],
        tenant: t.name,
        ownerName: owners[i % owners.length],
        leaseStart: start.toISOString().split('T')[0],
        leaseEnd: end.toISOString().split('T')[0],
        rent: 12000 + (i % 5) * 4000,
        securityDeposit: 50000,
        status: leaseStatuses[i % leaseStatuses.length],
        renewalRequestDate: '',
        proposedRent: '',
        renewalDecision: '',
        newStart: '',
        newEnd: '',
        renewalTerms: '',
        documents: [],
        previousLeases: i % 3 === 0
          ? [{
              leaseStart: new Date(start.getTime() - 365 * 86400000).toISOString().split('T')[0],
              leaseEnd: start.toISOString().split('T')[0],
              rent: 11000 + (i % 5) * 4000,
              status: 'expired',
            }]
          : [],
      };
    });

    const serviceTitles = [
      'Deep cleaning required', 'AC repair', 'Plumbing inspection',
      'Garden maintenance', 'Security system check', 'Pest control',
      'Carpet cleaning', 'Window washing', 'Elevator maintenance',
    ];
    const serviceTypes = ['cleaning', 'ac-repair', 'plumbing', 'landscaping', 'security', 'pest', 'general'];
    const serviceStatuses = ['pending', 'scheduled', 'in-progress', 'completed', 'on-hold', 'cancelled'];
    const newServices = Array.from({ length: 10 }, (_, i) => {
      const t = tenants[i % tenants.length];
      const status = serviceStatuses[i % serviceStatuses.length];
      const relatedCmp = i % 2 === 0 ? newComplaints[i % newComplaints.length].id : '';
      if (relatedCmp) {
        const c = newComplaints.find((x) => x.id === relatedCmp);
        if (c) c.relatedServiceId = `SRV-${String(i + 1).padStart(4, '0')}`;
      }

      const baseEstimate = 2000 + (i % 5) * 1000;
      const isDone = status === 'completed';
      const labour = isDone ? Math.floor(baseEstimate * 0.4) : 0; 
      const materials = isDone ? Math.floor(baseEstimate * 0.6) : 0;
      const actual = isDone ? (labour + materials) : 0;

      return {
        id: `SRV-${String(i + 1).padStart(4, '0')}`,
        title: serviceTitles[i % serviceTitles.length],
        type: serviceTypes[i % serviceTypes.length],
        status,
        priority: priorities[i % priorities.length],
        tenant: t.name,
        unit: units[i % units.length],
        propertyName: properties[i % properties.length],
        relatedComplaintId: relatedCmp,
        assignedTo: i % 3 === 0 ? 'Tech Team A' : i % 3 === 1 ? 'Tech Team B' : '',
        requestedDate: new Date(Date.now() - (i % 10) * 86400000).toISOString().split('T')[0],
        scheduledDate: status !== 'pending' ? new Date(Date.now() + (i % 5) * 86400000).toISOString().split('T')[0] : '',
        description: `Service request for ${serviceTitles[i % serviceTitles.length].toLowerCase()}.`,
        estimatedCost: baseEstimate,
        labourCost: labour,
        materialsCost: materials,
        actualCost: actual,
        completionDate: isDone ? todayISO() : '',
        workNotes: isDone ? 'Work completed and verified.' : '',
        attachments: [],
      };
    });

    setComplaints(newComplaints);
    setRentRecords(newRent);
    setLeaseRecords(newLeases);
    setServiceRequests(newServices);
  }, []);

  useEffect(() => {
    generateMockData();
  }, [generateMockData]);

  /* ---------------- EXPORT & REFRESH ---------------- */
  const handleExport = () => {
    let dataToExport = [];
    let filename = '';

    switch (activeTab) {
      case 'complaints':
        dataToExport = complaints;
        filename = 'Complaints_Export';
        break;
      case 'rent':
        dataToExport = rentRecords;
        filename = 'Rent_Collection_Export';
        break;
      case 'lease':
        dataToExport = leaseRecords;
        filename = 'Lease_Renewal_Export';
        break;
      case 'service':
        dataToExport = serviceRequests;
        filename = 'Service_Requests_Export';
        break;
      default:
        return;
    }

    if (!dataToExport.length) {
      showToast('No data to export.', 'warning');
      return;
    }

    // Extract headers from the first object
    const headers = Object.keys(dataToExport[0]);
    
    // Convert to CSV
    const csvRows = [];
    csvRows.push(headers.join(','));

    for (const row of dataToExport) {
      const values = headers.map(header => {
        let val = row[header];
        // Handle arrays/objects by converting to JSON string, and escape quotes
        if (Array.isArray(val) || (typeof val === 'object' && val !== null)) {
          val = JSON.stringify(val);
        }
        if (val === null || val === undefined) val = '';
        // Escape double quotes
        val = String(val).replace(/"/g, '""');
        return `"${val}"`;
      });
      csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}_${todayISO()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showToast('Data exported successfully!', 'success');
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate network request delay for the visual spinner
    setTimeout(() => {
      generateMockData();
      setIsRefreshing(false);
      showToast('Data refreshed successfully!', 'success');
    }, 1000); // 1 second delay
  };

  /* ---------------- VIEW ---------------- */
  const openView = (item, type) => {
    setViewingItem(item);
    setViewType(type);
    setShowViewModal(true);
  };

  const renderComplaintView = (c) => (
    <>
      <SectionTitle>Complaint Info</SectionTitle>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Title" value={c.title} />
        <Field label="Category" value={cap(c.type)} />
        <Field label="Priority" value={cap(c.priority)} />
        <Field label="Status" value={cap(c.status)} />
        <Field label="Reported Date" value={fmtDate(c.reportedDate)} />
        <Field label="Resolved Date" value={fmtDate(c.resolvedDate)} />
        <Field label="Last Updated" value={fmtDate(c.lastUpdated)} />
        <Field label="Assigned Staff" value={c.assignedTo} />
      </div>
      <SectionTitle>Tenant & Property</SectionTitle>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Tenant" value={c.tenant} />
        <Field label="Phone" value={c.tenantPhone} />
        <Field label="Email" value={c.tenantEmail} />
        <Field label="Property" value={c.propertyName} />
        <Field label="Unit" value={c.unit} />
        <Field label="Related Service Request" value={c.relatedServiceId} />
      </div>
      <SectionTitle>Description</SectionTitle>
      <div className="bg-[#F5F9F8] rounded-xl p-3">
        <p className="text-sm text-[#1A2E2A] whitespace-pre-line">{c.description}</p>
      </div>
      {c.attachments?.length > 0 && (
        <>
          <SectionTitle>Attachments</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {c.attachments.map((a, i) => {
              const imageUrl = a.startsWith('http') || a.startsWith('data:') || a.startsWith('blob:') 
                ? a 
                : `https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600&h=400`;

              return (
                <button 
                  key={i} 
                  onClick={() => setPreviewImage(imageUrl)}
                  className="text-xs bg-[#E8F4F2] hover:bg-[#C5EDE5] transition-colors text-[#00695C] rounded-lg px-3 py-1.5 flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <FiImage /> {a}
                </button>
              );
            })}
          </div>
        </>
      )}
      {(c.resolutionNotes || c.reason) && (
        <>
          <SectionTitle>Notes</SectionTitle>
          {c.resolutionNotes && <Field label="Resolution Notes" value={c.resolutionNotes} />}
          {c.reason && <Field label="Reason (Reject / Review)" value={c.reason} />}
        </>
      )}
    </>
  );

  const renderRentView = (r) => (
    <>
      <SectionTitle>Record Info</SectionTitle>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Property" value={r.propertyName} />
        <Field label="Property ID" value={r.propertyId} />
        <Field label="Unit" value={r.unit} />
        <Field label="Rent Month" value={r.month} />
        <Field label="Tenant" value={r.tenant} />
        <Field label="Owner" value={r.ownerName} />
      </div>
      <SectionTitle>Amount Breakdown</SectionTitle>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Monthly Rent" value={fmtCurrency(r.monthlyRent)} />
        <Field label="Additional Charges" value={fmtCurrency(r.additionalCharges)} />
        <Field label="Late Fee" value={fmtCurrency(r.lateFee)} />
        <Field label="Discount" value={fmtCurrency(r.discount)} />
        <Field label="Total Due" value={fmtCurrency(r.totalDue)} />
        <Field label="Amount Paid" value={fmtCurrency(r.amountPaid)} />
        <Field label="Outstanding" value={fmtCurrency(r.outstanding)} />
        <Field label="Status" value={cap(r.status)} />
      </div>
      <SectionTitle>Payment</SectionTitle>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Due Date" value={fmtDate(r.dueDate)} />
        <Field label="Payment Date" value={fmtDate(r.paymentDate)} />
        <Field label="Payment Method" value={r.paymentMethod} />
        <Field label="Transaction / Reference" value={r.reference} />
      </div>
      <SectionTitle>Payment History</SectionTitle>
      {r.paymentHistory?.length ? (
        <div className="space-y-2">
          {r.paymentHistory.map((p, i) => (
            <div key={i} className="bg-[#F5F9F8] rounded-xl p-3 flex justify-between text-xs">
              <span>{fmtDate(p.date)} · {p.method} · {p.reference}</span>
              <span className="font-semibold text-emerald-600">{fmtCurrency(p.amount)}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-[#5A7D78]">No payments recorded yet.</p>
      )}
    </>
  );

  const renderLeaseView = (l) => {
    const dLeft = leaseDaysLeft(l.leaseEnd);
    return (
      <>
        <SectionTitle>Lease Info</SectionTitle>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Property" value={l.propertyName} />
          <Field label="Unit" value={l.unit} />
          <Field label="Tenant" value={l.tenant} />
          <Field label="Owner" value={l.ownerName} />
          <Field label="Lease Start" value={fmtDate(l.leaseStart)} />
          <Field label="Lease End" value={fmtDate(l.leaseEnd)} />
          <Field label="Monthly Rent" value={fmtCurrency(l.rent)} />
          <Field label="Security Deposit" value={fmtCurrency(l.securityDeposit)} />
          <Field label="Status" value={cap(l.status)} />
          <Field label="Remaining Days" value={dLeft < 0 ? 'Expired' : `${dLeft} days`} />
        </div>
        {(l.renewalRequestDate || l.proposedRent || l.newStart) && (
          <>
            <SectionTitle>Renewal</SectionTitle>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Request Date" value={fmtDate(l.renewalRequestDate)} />
              <Field label="Proposed Rent" value={fmtCurrency(l.proposedRent)} />
              <Field label="New Start" value={fmtDate(l.newStart)} />
              <Field label="New End" value={fmtDate(l.newEnd)} />
              <Field label="Terms" value={l.renewalTerms} />
              <Field label="Decision" value={l.renewalDecision} />
            </div>
          </>
        )}
        {l.previousLeases?.length > 0 && (
          <>
            <SectionTitle>Previous Leases</SectionTitle>
            {l.previousLeases.map((p, i) => (
              <div key={i} className="bg-[#F5F9F8] rounded-xl p-3 text-xs flex justify-between">
                <span>{fmtDate(p.leaseStart)} → {fmtDate(p.leaseEnd)}</span>
                <span className="font-semibold">{fmtCurrency(p.rent)}</span>
              </div>
            ))}
          </>
        )}
      </>
    );
  };

  const renderServiceView = (s) => (
    <>
      <SectionTitle>Request Info</SectionTitle>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Title" value={s.title} />
        <Field label="Service Type" value={cap(s.type)} />
        <Field label="Priority" value={cap(s.priority)} />
        <Field label="Status" value={cap(s.status)} />
        <Field label="Property" value={s.propertyName} />
        <Field label="Unit" value={s.unit} />
        <Field label="Tenant" value={s.tenant} />
        <Field label="Related Complaint" value={s.relatedComplaintId} />
        <Field label="Assigned Technician" value={s.assignedTo} />
        <Field label="Requested Date" value={fmtDate(s.requestedDate)} />
        <Field label="Scheduled Date" value={fmtDate(s.scheduledDate)} />
        <Field label="Completion Date" value={fmtDate(s.completionDate)} />
      </div>
      <SectionTitle>Cost Breakdown</SectionTitle>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Estimated Cost" value={fmtCurrency(s.estimatedCost)} />
        <Field label="Labour Cost" value={fmtCurrency(s.labourCost)} />
        <Field label="Materials Cost" value={fmtCurrency(s.materialsCost)} />
        <Field label="Actual Cost" value={fmtCurrency(s.actualCost)} />
      </div>
      <SectionTitle>Description</SectionTitle>
      <div className="bg-[#F5F9F8] rounded-xl p-3">
        <p className="text-sm text-[#1A2E2A] whitespace-pre-line">{s.description}</p>
      </div>
      {s.workNotes && (
        <>
          <SectionTitle>Work / Resolution Notes</SectionTitle>
          <div className="bg-[#F5F9F8] rounded-xl p-3">
            <p className="text-sm text-[#1A2E2A] whitespace-pre-line">{s.workNotes}</p>
          </div>
        </>
      )}
    </>
  );

  const viewTitleMap = { complaint: 'Complaint Details', rent: 'Rent Record Details', lease: 'Lease Details', service: 'Service Request Details' };
  const renderViewFn = () => {
    if (!viewingItem) return null;
    if (viewType === 'complaint') return renderComplaintView(viewingItem);
    if (viewType === 'rent') return renderRentView(viewingItem);
    if (viewType === 'lease') return renderLeaseView(viewingItem);
    return renderServiceView(viewingItem);
  };

  /* ---------------- EDIT ---------------- */
  const openEdit = (item, type) => { setEditingItem(item); setEditType(type); setShowEditModal(true); };

  const handleSaveComplaint = (data) => {
    setActionLoading('edit');
    setTimeout(() => {
      setComplaints((prev) => prev.map((c) => (c.id === data.id ? { ...data, lastUpdated: todayISO() } : c)));
      setShowEditModal(false);
      setEditingItem(null);
      setActionLoading(null);
      showToast('Complaint updated.', 'success');
    }, 500);
  };

  const handleSaveRent = (data) => {
    setActionLoading('edit');
    setTimeout(() => {
      const totalDue = Number(data.monthlyRent) + Number(data.additionalCharges) + Number(data.lateFee) - Number(data.discount);
      const amountPaid = Number(data.amountPaid);
      const outstanding = totalDue - amountPaid;
      let status = data.status;
      if (outstanding <= 0) status = 'paid';
      else if (amountPaid > 0) status = 'partial';
      setRentRecords((prev) =>
        prev.map((r) => (r.id === data.id ? { ...r, ...data, totalDue, amountPaid, outstanding, status } : r))
      );
      setShowEditModal(false);
      setEditingItem(null);
      setActionLoading(null);
      showToast('Rent record updated.', 'success');
    }, 500);
  };

  const handleSaveLease = (data) => {
    setActionLoading('edit');
    setTimeout(() => {
      setLeaseRecords((prev) => prev.map((l) => (l.id === data.id ? { ...data } : l)));
      setShowEditModal(false);
      setEditingItem(null);
      setActionLoading(null);
      showToast('Lease updated.', 'success');
    }, 500);
  };

  const handleSaveService = (data) => {
    setActionLoading('edit');
    setTimeout(() => {
      const updatedActual = Number(data.actualCost) === 0 
        ? Number(data.labourCost) + Number(data.materialsCost) 
        : Number(data.actualCost);

      const finalData = { ...data, actualCost: updatedActual };

      setServiceRequests((prev) => prev.map((s) => (s.id === data.id ? { ...finalData } : s)));
      
      setComplaints((prev) =>
        prev.map((c) => {
          if (c.id === data.relatedComplaintId) return { ...c, relatedServiceId: data.id };
          if (c.relatedServiceId === data.id && c.id !== data.relatedComplaintId) return { ...c, relatedServiceId: '' };
          return c;
        })
      );
      setShowEditModal(false);
      setEditingItem(null);
      setActionLoading(null);
      showToast('Service request updated.', 'success');
    }, 500);
  };

  /* ---------------- COMPLAINT ACTIONS ---------------- */
  const handleStart = (item) => {
    setActionLoading('start');
    setTimeout(() => {
      setComplaints((prev) => prev.map((c) => (c.id === item.id ? { ...c, status: 'in-progress', lastUpdated: todayISO() } : c)));
      setActionLoading(null);
      showToast(`Complaint ${item.id} moved to In Progress.`, 'info');
    }, 400);
  };

  const handleResolveClick = (item) => {
    setConfirmState({
      open: true,
      title: 'Resolve Complaint',
      message: `Provide resolution notes for ${item.id}?`,
      confirmColor: 'bg-emerald-500',
      onConfirm: () => {
        setComplaints((prev) =>
          prev.map((c) =>
            c.id === item.id
              ? { ...c, status: 'resolved', resolvedDate: todayISO(), lastUpdated: todayISO(), resolutionNotes: c.resolutionNotes || 'Resolved after inspection.' }
              : c
          )
        );
        setConfirmState((s) => ({ ...s, open: false }));
        showToast(`Complaint ${item.id} resolved.`, 'success');
      },
    });
  };

  const handleCreateServiceFromComplaint = (complaint) => {
    const id = uid('SRV', serviceRequests);
    const newService = {
      id,
      title: `Service for ${complaint.title}`,
      type: complaint.type === 'other' ? 'general' : complaint.type,
      status: 'pending',
      priority: complaint.priority,
      tenant: complaint.tenant,
      unit: complaint.unit,
      propertyName: complaint.propertyName,
      relatedComplaintId: complaint.id,
      assignedTo: '',
      requestedDate: todayISO(),
      scheduledDate: '',
      description: `Auto-created from complaint ${complaint.id}: ${complaint.description}`,
      estimatedCost: 0,
      labourCost: 0,
      materialsCost: 0,
      actualCost: 0,
      completionDate: '',
      workNotes: '',
      attachments: [],
    };
    setServiceRequests((prev) => [newService, ...prev]);
    setComplaints((prev) => prev.map((c) => (c.id === complaint.id ? { ...c, relatedServiceId: id } : c)));
    showToast(`Service request ${id} created from ${complaint.id}.`, 'success');
  };

  /* ---------------- RENT ACTIONS ---------------- */
  const openPay = (record) => { setPayRecord(record); setShowPayModal(true); };

  const handlePaySubmit = ({ amount, method, reference, date }) => {
    setActionLoading('pay');
    setTimeout(() => {
      setRentRecords((prev) =>
        prev.map((r) => {
          if (r.id !== payRecord.id) return r;
          const newPaid = r.amountPaid + Number(amount);
          const newOutstanding = r.totalDue - newPaid;
          const historyEntry = { date, amount: Number(amount), method, reference, recordedAt: todayISO() };
          let status = 'partial';
          if (newOutstanding <= 0) status = 'paid';
          else if (newPaid === 0) status = 'pending';
          return {
            ...r,
            amountPaid: newPaid,
            outstanding: Math.max(0, newOutstanding),
            status,
            paymentDate: newOutstanding <= 0 ? date : r.paymentDate,
            paymentMethod: method,
            reference,
            paymentHistory: [...(r.paymentHistory || []), historyEntry],
          };
        })
      );
      setShowPayModal(false);
      setPayRecord(null);
      setActionLoading(null);
      showToast(`Payment of ${fmtCurrency(amount)} recorded.`, 'success');
    }, 500);
  };

  const openHistory = (record) => { setHistoryRecord(record); setShowHistory(true); };

  /* ---------------- LEASE ACTIONS ---------------- */
  const openRenew = (lease) => { setRenewLease(lease); setShowRenewModal(true); };

  const handleRenewSubmit = (form) => {
    setActionLoading('renew');
    setTimeout(() => {
      setLeaseRecords((prev) =>
        prev.map((l) => {
          if (l.id !== renewLease.id) return l;
          const prevEntry = {
            leaseStart: l.leaseStart,
            leaseEnd: l.leaseEnd,
            rent: l.rent,
            status: l.status,
          };
          return {
            ...l,
            previousLeases: [...(l.previousLeases || []), prevEntry],
            leaseStart: form.newStart,
            leaseEnd: form.newEnd,
            rent: Number(form.proposedRent),
            status: 'renewed',
            renewalRequestDate: form.requestDate,
            proposedRent: form.proposedRent,
            renewalTerms: form.terms,
            renewalDecision: 'Approved',
            newStart: form.newStart,
            newEnd: form.newEnd,
          };
        })
      );
      setShowRenewModal(false);
      setRenewLease(null);
      setActionLoading(null);
      showToast(`Lease renewed.`, 'success');
    }, 500);
  };

  /* ---------------- SERVICE ACTIONS ---------------- */
  const openComplete = (req) => { setCompleteRequest(req); setShowCompleteModal(true); };

  const handleCompleteSubmit = (form) => {
    setActionLoading('complete');
    setTimeout(() => {
      setServiceRequests((prev) =>
        prev.map((s) => {
          if (s.id === completeRequest.id) {
            const newActual = Number(form.actualCost) === 0 
              ? Number(form.labourCost) + Number(form.materialsCost) 
              : Number(form.actualCost);
            return {
              ...s,
              status: 'completed',
              completionDate: form.completionDate,
              labourCost: Number(form.labourCost),
              materialsCost: Number(form.materialsCost),
              actualCost: newActual,
              workNotes: form.workNotes,
            };
          }
          return s;
        })
      );
      setShowCompleteModal(false);
      setCompleteRequest(null);
      setActionLoading(null);
      showToast(`Service request ${completeRequest.id} completed.`, 'success');
    }, 500);
  };

  /* ---------------- DELETE ---------------- */
  const askDelete = (id, type) => {
    const labels = { complaint: 'complaint', rent: 'rent record', lease: 'lease', service: 'service request' };
    setConfirmState({
      open: true,
      title: 'Confirm Delete',
      message: `Are you sure you want to delete this ${labels[type]} (${id})? This action cannot be undone.`,
      confirmColor: 'bg-red-500',
      onConfirm: () => {
        setActionLoading('delete');
        setTimeout(() => {
          if (type === 'complaint') setComplaints((p) => p.filter((x) => x.id !== id));
          if (type === 'rent') setRentRecords((p) => p.filter((x) => x.id !== id));
          if (type === 'lease') setLeaseRecords((p) => p.filter((x) => x.id !== id));
          if (type === 'service') {
            setServiceRequests((p) => p.filter((x) => x.id !== id));
            setComplaints((p) => p.map((c) => (c.relatedServiceId === id ? { ...c, relatedServiceId: '' } : c)));
          }
          setActionLoading(null);
          setConfirmState((s) => ({ ...s, open: false }));
          showToast(`${labels[type]} deleted.`, 'error');
        }, 400);
      },
    });
  };

  /* ---------------- TABS ---------------- */
  const tabs = [
    { id: 'complaints', label: 'Complaints', icon: <FiAlertTriangle className="text-red-500" />, count: complaints.length },
    { id: 'rent', label: 'Rent Collection', icon: <FiDollarSign className="text-emerald-500" />, count: rentRecords.length },
    { id: 'lease', label: 'Lease Renewal', icon: <FiFile className="text-blue-500" />, count: leaseRecords.length },
    { id: 'service', label: 'Service Requests', icon: <FiClipboard className="text-purple-500" />, count: serviceRequests.length },
  ];

  const totalRecords = complaints.length + rentRecords.length + leaseRecords.length + serviceRequests.length;

  /* ---------------- RENDER ---------------- */
  return (
    <div className="space-y-6 p-4 lg:p-6 pb-24 bg-[#F8FAF9] min-h-full h-full overflow-y-auto custom-page-scroll relative">
      <Toast toast={toast} />

      <ImagePreviewModal 
        image={previewImage} 
        show={!!previewImage} 
        onClose={() => setPreviewImage(null)} 
      />

      <ViewItemModal
        item={viewingItem}
        show={showViewModal}
        onClose={() => { setShowViewModal(false); setViewingItem(null); }}
        title={viewTitleMap[viewType]}
        renderSections={renderViewFn}
      />

      {editType === 'complaint' && (
        <ComplaintEditModal item={editingItem} show={showEditModal} onClose={() => setShowEditModal(false)} onSave={handleSaveComplaint} loading={actionLoading === 'edit'} />
      )}
      {editType === 'rent' && (
        <RentEditModal item={editingItem} show={showEditModal} onClose={() => setShowEditModal(false)} onSave={handleSaveRent} loading={actionLoading === 'edit'} />
      )}
      {editType === 'lease' && (
        <LeaseEditModal item={editingItem} show={showEditModal} onClose={() => setShowEditModal(false)} onSave={handleSaveLease} loading={actionLoading === 'edit'} />
      )}
      {editType === 'service' && (
        <ServiceEditModal item={editingItem} show={showEditModal} onClose={() => setShowEditModal(false)} onSave={handleSaveService} loading={actionLoading === 'edit'} complaints={complaints} />
      )}

      <PaymentModal record={payRecord} show={showPayModal} onClose={() => { setShowPayModal(false); setPayRecord(null); }} onSubmit={handlePaySubmit} loading={actionLoading === 'pay'} />
      <RenewalModal lease={renewLease} show={showRenewModal} onClose={() => { setShowRenewModal(false); setRenewLease(null); }} onSubmit={handleRenewSubmit} loading={actionLoading === 'renew'} />
      <CompleteServiceModal request={completeRequest} show={showCompleteModal} onClose={() => { setShowCompleteModal(false); setCompleteRequest(null); }} onSubmit={handleCompleteSubmit} loading={actionLoading === 'complete'} />

      <ConfirmationModal
        isOpen={confirmState.open}
        onClose={() => setConfirmState((s) => ({ ...s, open: false }))}
        onConfirm={confirmState.onConfirm}
        title={confirmState.title}
        message={confirmState.message}
        confirmColor={confirmState.confirmColor}
        loading={actionLoading === 'delete'}
      />

      {/* Payment History Modal */}
      {showHistory && historyRecord && (
        <div className="fixed inset-0 z-[75] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-[#E8F0EE] flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-4 rounded-t-2xl flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <MdOutlineReceipt className="text-lg" /> Payment History
                </h2>
                <p className="text-white/80 text-[11px] mt-0.5">{historyRecord.id} — {historyRecord.tenant}</p>
              </div>
              <button onClick={() => { setShowHistory(false); setHistoryRecord(null); }} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all">
                <FiX className="text-sm" />
              </button>
            </div>

            {/* Summary Card */}
            <div className="p-4 bg-[#F5F9F8] border-b border-[#E8F0EE] shrink-0">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-white rounded-xl p-3 shadow-sm border border-[#E8F0EE]">
                  <p className="text-[10px] text-[#5A7D78] uppercase tracking-wider mb-1">Total Due</p>
                  <p className="font-bold text-[#1A2E2A]">{fmtCurrency(historyRecord.totalDue)}</p>
                </div>
                <div className="bg-white rounded-xl p-3 shadow-sm border border-[#E8F0EE]">
                  <p className="text-[10px] text-[#5A7D78] uppercase tracking-wider mb-1">Total Paid</p>
                  <p className="font-bold text-emerald-600">{fmtCurrency(historyRecord.amountPaid)}</p>
                </div>
                <div className="bg-white rounded-xl p-3 shadow-sm border border-[#E8F0EE]">
                  <p className="text-[10px] text-[#5A7D78] uppercase tracking-wider mb-1">Balance</p>
                  <p className={`font-bold ${historyRecord.outstanding > 0 ? 'text-red-600' : 'text-[#1A2E2A]'}`}>
                    {fmtCurrency(historyRecord.outstanding)}
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline / History List */}
            <div className="p-4 overflow-y-auto space-y-4 flex-1">
              <h3 className="text-xs font-bold text-[#00695C] uppercase tracking-wider border-b border-[#E8F0EE] pb-1 mb-2">
                Transaction Log
              </h3>
              
              {historyRecord.paymentHistory?.length ? (
                <div className="relative border-l-2 border-[#E8F0EE] ml-3 space-y-5">
                  {historyRecord.paymentHistory.map((p, i) => (
                    <div key={i} className="relative pl-6">
                      {/* Timeline Dot */}
                      <span className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center">
                        <FiCheck className="text-[8px] text-emerald-600" />
                      </span>
                      
                      {/* Transaction Card */}
                      <div className="bg-white rounded-xl border border-[#E8F0EE] p-3 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-sm font-bold text-emerald-600">{fmtCurrency(p.amount)}</p>
                            <p className="text-[10px] text-[#5A7D78] flex items-center gap-1 mt-0.5">
                              <FiCalendar className="text-[10px]" /> {fmtDate(p.date)}
                            </p>
                          </div>
                          <span className="text-[9px] font-semibold px-2 py-1 rounded-md bg-[#F5F9F8] text-[#00695C] border border-[#E8F0EE]">
                            {p.method || 'UPI'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-dashed border-[#E8F0EE] mt-1 text-[10px] text-[#5A7D78]">
                          <span className="flex items-center gap-1"><FiFileText /> Ref: <span className="font-medium text-[#1A2E2A]">{p.reference || 'N/A'}</span></span>
                          <span className="italic">Recorded: {fmtDate(p.recordedAt || todayISO())}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center bg-[#F5F9F8] rounded-xl border border-dashed border-[#E8F0EE]">
                  <FiDollarSign className="text-3xl text-[#B5C9C5] mb-2" />
                  <p className="text-sm font-medium text-[#1A2E2A]">No payments yet</p>
                  <p className="text-xs text-[#5A7D78]">Payments will appear here once recorded.</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#E8F0EE] flex justify-between items-center shrink-0 bg-white rounded-b-2xl">
              {historyRecord.outstanding > 0 ? (
                <button 
                  onClick={() => { setShowHistory(false); openPay(historyRecord); }} 
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors shadow-md"
                >
                  Make Payment
                </button>
              ) : (
                <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                  <FiCheckCircle /> Fully Paid
                </span>
              )}
              <button onClick={() => { setShowHistory(false); setHistoryRecord(null); }} className="px-5 py-2 bg-[#F5F9F8] text-[#1A2E2A] rounded-lg text-sm font-medium hover:bg-[#E8F0EE] transition-colors">
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Header */}
      <div className="relative">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                Property Management
              </h1>
              <span className="px-3 py-1 bg-[#E8F4F2] text-[#00695C] text-xs font-semibold rounded-full">{totalRecords} Total</span>
            </div>
            <p className="text-sm text-[#5A7D78] flex items-center gap-2 flex-wrap">
              <span>Manage complaints, rent collection, lease renewals & service requests</span>
              <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
              <span className="text-[#00695C] font-medium">{fmtDate(todayISO())}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8F0EE] text-[#00695C] rounded-xl hover:shadow-md transition-all text-sm font-medium shadow-sm hover:scale-105"
            >
              <FiDownload className="text-sm" /> Export
            </button>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-xl hover:shadow-xl transition-all text-sm font-medium shadow-md hover:scale-105 disabled:opacity-75 disabled:hover:scale-100"
            >
              <FiRefreshCw className={`text-sm ${isRefreshing ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="relative bg-white rounded-2xl p-4 shadow-sm border border-[#E8F0EE]">
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <TabButton key={t.id} icon={t.icon} label={t.label} isActive={activeTab === t.id} onClick={() => setActiveTab(t.id)} count={t.count} />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative bg-white rounded-2xl p-4 shadow-sm border border-[#E8F0EE] min-h-[400px]">
        {isRefreshing ? (
          <LoadingSpinner />
        ) : (
          <>
            {activeTab === 'complaints' && (
              <ComplaintManagement
                data={complaints}
                onView={(i) => openView(i, 'complaint')}
                onEdit={(i) => openEdit(i, 'complaint')}
                onResolve={handleResolveClick}
                onStart={handleStart}
                onDelete={(id) => askDelete(id, 'complaint')}
                onCreateService={handleCreateServiceFromComplaint}
                actionLoading={actionLoading}
              />
            )}
            {activeTab === 'rent' && (
              <RentCollection
                data={rentRecords}
                onView={(i) => openView(i, 'rent')}
                onEdit={(i) => openEdit(i, 'rent')}
                onPay={openPay}
                onViewHistory={openHistory}
                onDelete={(id) => askDelete(id, 'rent')}
                actionLoading={actionLoading}
              />
            )}
            {activeTab === 'lease' && (
              <LeaseRenewal
                data={leaseRecords}
                onView={(i) => openView(i, 'lease')}
                onEdit={(i) => openEdit(i, 'lease')}
                onRenew={openRenew}
                onDelete={(id) => askDelete(id, 'lease')}
                actionLoading={actionLoading}
              />
            )}
            {activeTab === 'service' && (
              <ServiceRequests
                data={serviceRequests}
                onView={(i) => openView(i, 'service')}
                onEdit={(i) => openEdit(i, 'service')}
                onComplete={openComplete}
                onDelete={(id) => askDelete(id, 'service')}
                actionLoading={actionLoading}
              />
            )}
          </>
        )}
      </div>

      <div className="pb-5"/>

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(50px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default PropertyManagersMaintenance;