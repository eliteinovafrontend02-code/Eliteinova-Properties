// src/components/dashboard/admin/PropertyManagers/PropertyManagersCompanyManagement.jsx

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiHome, FiPlus, FiEdit, FiTrash2, FiCheckCircle, FiXCircle,
  FiClock, FiSearch, FiFilter, FiChevronDown, FiChevronLeft,
  FiChevronRight, FiEye, FiStar, FiShield, FiRefreshCw,
  FiGrid, FiList, FiX, FiDownload, FiUpload, FiMoreVertical,
  FiAlertTriangle, FiInfo, FiMapPin, FiCalendar, FiUser,
  FiTag, FiDollarSign, FiSquare, FiMaximize, FiMinimize,
  FiActivity, FiExternalLink, FiUserCheck, FiUserX, FiSave,
  FiImage, FiFileText, FiPhone, FiMail, FiGlobe, FiSettings,
  FiVideo, FiCamera, FiUsers, FiBarChart2, FiTrendingUp,
  FiAward, FiBriefcase, FiTarget, FiPieChart, FiLayers,
  FiCheckSquare, FiPlayCircle, FiFlag, FiUserPlus,
  FiUserMinus, FiBookOpen, FiClipboard, FiServer, FiDatabase, FiLink
} from 'react-icons/fi';
import {
  FaStar as FaStarSolid,
  FaCheck, FaTimes, FaBuilding,
  FaHome, FaBed, FaBath, FaRulerCombined,
  FaParking, FaWifi, FaSwimmingPool, FaSnowflake,
  FaFire, FaShieldAlt, FaCrown, FaMedal,
  FaUserCircle, FaStore, FaUserTie, FaUserGraduate,
  FaCity, FaHammer, FaHardHat, FaClipboardList,
  FaUsers, FaUserFriends, FaUserPlus as FaUserPlusSolid
} from 'react-icons/fa';
import { MdOutlineRealEstateAgent, MdApartment, MdOutlineBusiness, MdOutlineLeaderboard, MdOutlineConstruction, MdOutlineApartment, MdOutlineManageAccounts, MdOutlinePeople } from 'react-icons/md';

// ============================================================
// ⭐ DUMMY DATA COUNTS — CHANGE THESE NUMBERS ANYTIME ⭐
// This controls how many rows appear inside each modal.
// ============================================================
const DUMMY_COUNTS = {
  staffCount: 1,
  ownerCount: 2,
  tenantCount: 3,
  propertiesCount: 2,
  perCompany: {
    'Prestige Property Management': { staffCount: 1, ownerCount: 2, tenantCount: 3, propertiesCount: 2 },
    'Golden Gate Realty':           { staffCount: 3, ownerCount: 4, tenantCount: 6, propertiesCount: 3 },
    'Urban Nest Solutions':         { staffCount: 2, ownerCount: 1, tenantCount: 4, propertiesCount: 1 },
    'Elite Estate Managers':        { staffCount: 5, ownerCount: 3, tenantCount: 8, propertiesCount: 4 },
    'Cityscape Properties':         { staffCount: 1, ownerCount: 1, tenantCount: 2, propertiesCount: 1 },
    'Royal Oak Management':         { staffCount: 4, ownerCount: 5, tenantCount: 10, propertiesCount: 5 },
    'Silverline Real Estate':       { staffCount: 2, ownerCount: 2, tenantCount: 5, propertiesCount: 2 },
    'Heritage Property Services':   { staffCount: 1, ownerCount: 3, tenantCount: 3, propertiesCount: 2 },
    'Crestview Management':         { staffCount: 6, ownerCount: 4, tenantCount: 12, propertiesCount: 6 },
    'Park Avenue Realty':           { staffCount: 2, ownerCount: 1, tenantCount: 4, propertiesCount: 1 },
    'Harbor Property Group':        { staffCount: 3, ownerCount: 2, tenantCount: 7, propertiesCount: 3 },
    'Skyline Management':           { staffCount: 1, ownerCount: 2, tenantCount: 3, propertiesCount: 2 },
  },
};

const getCountsForCompany = (name) => {
  return DUMMY_COUNTS.perCompany[name] || {
    staffCount: DUMMY_COUNTS.staffCount,
    ownerCount: DUMMY_COUNTS.ownerCount,
    tenantCount: DUMMY_COUNTS.tenantCount,
    propertiesCount: DUMMY_COUNTS.propertiesCount,
  };
};

// ========== COMPANY TYPE COLOR MAP ==========
const COMPANY_TYPE_STYLES = {
  'Individual': {
    badge: 'bg-teal-100 text-teal-700 ring-teal-200',
    iconBg: 'from-teal-600 to-teal-400',
    accent: 'border-l-teal-500',
    icon: <FiUser className="text-white text-sm" />,
  },
  'Apartment': {
    badge: 'bg-blue-100 text-blue-700 ring-blue-200',
    iconBg: 'from-blue-600 to-blue-400',
    accent: 'border-l-blue-500',
    icon: <MdApartment className="text-white text-sm" />,
  },
  'Commercial': {
    badge: 'bg-amber-100 text-amber-700 ring-amber-200',
    iconBg: 'from-amber-500 to-orange-400',
    accent: 'border-l-amber-500',
    icon: <FaStore className="text-white text-sm" />,
  },
  'Land & Plots': {
    badge: 'bg-lime-100 text-lime-700 ring-lime-200',
    iconBg: 'from-lime-600 to-green-400',
    accent: 'border-l-lime-500',
    icon: <FiMapPin className="text-white text-sm" />,
  },
  'Hostel': {
    badge: 'bg-purple-100 text-purple-700 ring-purple-200',
    iconBg: 'from-purple-600 to-fuchsia-400',
    accent: 'border-l-purple-500',
    icon: <FaBed className="text-white text-sm" />,
  },
};

const DEFAULT_TYPE_STYLE = {
  badge: 'bg-[#E8F4F2] text-[#00695C] ring-[#B5C9C5]',
  iconBg: 'from-[#00695C] to-[#26A69A]',
  accent: 'border-l-[#00695C]',
  icon: <MdOutlineBusiness className="text-white text-sm" />,
};

const getTypeStyle = (type) => COMPANY_TYPE_STYLES[type] || DEFAULT_TYPE_STYLE;

// ========== TOAST COMPONENT ==========
const Toast = ({ toast }) => {
  if (!toast) return null;
  const colors = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-500'
  };
  return (
    <div className={`fixed bottom-6 right-6 z-[200] px-6 py-4 rounded-2xl text-white shadow-2xl flex items-center gap-3 animate-slide-up ${colors[toast.type] || colors.success}`}>
      {toast.type === 'success' && <FiCheckCircle className="text-lg" />}
      {toast.type === 'error' && <FiXCircle className="text-lg" />}
      {toast.type === 'warning' && <FiAlertTriangle className="text-lg" />}
      {toast.type === 'info' && <FiInfo className="text-lg" />}
      <span className="text-sm font-medium">{toast.message}</span>
    </div>
  );
};

// ============ CONFIRMATION MODAL ============
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Yes',
  cancelText = 'No',
  confirmColor = 'bg-red-500',
  icon = <FiAlertTriangle className="text-3xl text-red-500" />,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl animate-slide-up border border-[#E8F0EE]">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-3">
            {icon}
          </div>
          <h3 className="text-lg font-bold text-[#1A2E2A] mb-1.5">{title}</h3>
          <p className="text-sm text-[#5A7D78] mb-4 leading-relaxed">{message}</p>
          <div className="flex items-center gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium"
              disabled={loading}
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`flex-1 px-4 py-2 text-white rounded-xl hover:shadow-xl transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed ${confirmColor}`}
            >
              {loading ? (
                <>
                  <FiRefreshCw className="animate-spin text-sm" />
                  Processing...
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ STAT CARD COMPONENT ============
const StatCard = ({ icon, title, value, color, delay = 0, isActive, onClick }) => {
  return (
    <div
      className={`bg-white rounded-2xl p-2 shadow-sm hover:shadow-lg transition-all duration-500 border group cursor-pointer transform hover:-translate-y-1 ${isActive ? 'ring-2 ring-[#00695C] shadow-lg bg-[#F5F9F8]' : 'border-[#E8F0EE]'}`}
      style={{ animationDelay: `${delay}ms` }}
      onClick={() => onClick && onClick()}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-medium text-[#5A7D78] uppercase tracking-wider">{title}</p>
          <p className={`text-xl font-bold text-[#1A2E2A] group-hover:text-[#00695C] transition-colors duration-300 ${isActive ? 'text-[#00695C]' : ''}`}>
            {value.toLocaleString()}
          </p>
        </div>
      </div>
      {isActive && (
        <div className="mt-2 flex items-center gap-1">
          <span className="text-[8px] text-[#00695C] font-medium bg-[#E8F4F2] px-2 py-0.5 rounded-full">Active Filter</span>
        </div>
      )}
    </div>
  );
};

// ============ VIEW COMPANY DETAILS MODAL ============
const ViewCompanyModal = ({ company, show, onClose, onEdit }) => {
  if (!company || !show) return null;

  // Distinct status badges
  const statusBadge = {
    active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    inactive: 'bg-gray-100 text-gray-700 border-gray-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
  };

  const verificationBadge = company.isVerified
    ? 'bg-blue-100 text-blue-700 border-blue-200'
    : 'bg-amber-100 text-amber-700 border-amber-200';

  const typeStyle = getTypeStyle(company.type);

  // Fallback realistic dummy data for new fields if not present in the state object
  const contactPerson = company.contactPerson || ['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Reddy'][company.name.length % 4];
  const registrationDate = company.registeredDate || new Date(Date.now() - (company.name.length * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
  const businessRegDetails = company.businessRegDetails || {
    regNumber: `REG-${company.id ? company.id.replace(/\D/g, '').padStart(5, '0') : '10245'}`,
  };
  const fullAddress = company.fullAddress || `${company.location} - 400001, India`;

  // Dynamic counts based on the array lengths if available, else fallback to numbers
  const staffCount = Array.isArray(company.staff) ? company.staff.length : (company.staffCount || 0);
  const ownerCount = Array.isArray(company.owners) ? company.owners.length : (company.ownerCount || 0);
  const tenantCount = Array.isArray(company.tenants) ? company.tenants.length : (company.tenantCount || 0);
  const propsCount = Array.isArray(company.properties) ? company.properties.length : (company.propertiesCount || 0);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 rounded-t-2xl z-10 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
              <FiEye className="text-lg" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">Company Details</h2>
              <p className="text-white/80 text-[11px] tracking-wide mt-0.5">ID: {company.id || 'CMP-00001'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-base" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-white">
          {/* Top Overview Block */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${typeStyle.iconBg} flex items-center justify-center text-white text-2xl font-bold shadow-lg shrink-0`}>
                {React.cloneElement(typeStyle.icon, { className: 'text-white text-3xl' })}
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1A2E2A] leading-tight">{company.name}</h3>
                <p className="text-sm text-[#5A7D78] mt-0.5">{company.type}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`text-[11px] px-3 py-1 rounded-full font-semibold border ${statusBadge[company.status || 'active']}`}>
                Account: {(company.status || 'active').toUpperCase()}
              </span>
              <span className={`text-[11px] px-3 py-1 rounded-full font-semibold border flex items-center gap-1 ${verificationBadge}`}>
                <FiShield className="text-xs" /> {company.isVerified ? 'Verified' : 'Unverified'}
              </span>
            </div>
          </div>

          {/* Dynamic Counts Grid */}
          <div>
            <h4 className="text-[11px] font-bold text-[#5A7D78] uppercase tracking-wider mb-2">Managed Records</h4>
            <div className="grid grid-cols-4 gap-2">
              <div className="text-center p-3 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE]">
                <p className="text-lg font-bold text-[#1A2E2A]">{staffCount}</p>
                <p className="text-[9px] uppercase tracking-wider text-[#5A7D78]">Staff</p>
              </div>
              <div className="text-center p-3 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE]">
                <p className="text-lg font-bold text-[#1A2E2A]">{ownerCount}</p>
                <p className="text-[9px] uppercase tracking-wider text-[#5A7D78]">Owners</p>
              </div>
              <div className="text-center p-3 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE]">
                <p className="text-lg font-bold text-[#00695C]">{tenantCount}</p>
                <p className="text-[9px] uppercase tracking-wider text-[#5A7D78]">Tenants</p>
              </div>
              <div className="text-center p-3 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE]">
                <p className="text-lg font-bold text-[#1A2E2A]">{propsCount}</p>
                <p className="text-[9px] uppercase tracking-wider text-[#5A7D78]">Properties</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-[11px] font-bold text-[#5A7D78] uppercase tracking-wider mb-2">Contact Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 bg-[#F5F9F8] rounded-xl p-4 border border-[#E8F0EE]">
              <div>
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Contact Person</p>
                <div className="flex items-center gap-2 text-sm text-[#1A2E2A]">
                  <FiUser className="text-[#00695C] shrink-0" />
                  <span className="truncate">{contactPerson}</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Email</p>
                <div className="flex items-center gap-2 text-sm text-[#1A2E2A]">
                  <FiMail className="text-[#00695C] shrink-0" />
                  <span className="truncate">{company.email}</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Phone</p>
                <div className="flex items-center gap-2 text-sm text-[#1A2E2A]">
                  <FiPhone className="text-[#00695C] shrink-0" />
                  <span className="truncate">{company.phone}</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Website</p>
                <div className="flex items-center gap-2 text-sm text-[#1A2E2A]">
                  <FiGlobe className="text-[#00695C] shrink-0" />
                  {company.website ? (
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="truncate text-[#00695C] hover:underline hover:text-[#004D40]">
                      {company.website.replace(/^https?:\/\//, '')}
                    </a>
                  ) : (
                    <span className="text-[#B5C9C5]">N/A</span>
                  )}
                </div>
              </div>
              <div className="sm:col-span-2">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Full Address</p>
                <div className="flex items-center gap-2 text-sm text-[#1A2E2A]">
                  <FiMapPin className="text-[#00695C] shrink-0" />
                  <span>{fullAddress}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Business Details */}
          <div>
            <h4 className="text-[11px] font-bold text-[#5A7D78] uppercase tracking-wider mb-2">Business Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 bg-white rounded-xl p-4 border border-[#E8F0EE]">
              <div>
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Registration Date</p>
                <div className="flex items-center gap-2 text-sm text-[#1A2E2A]">
                  <FiCalendar className="text-[#00695C] shrink-0" />
                  <span>{registrationDate}</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Registration No.</p>
                <div className="flex items-center gap-2 text-sm text-[#1A2E2A]">
                  <FiFileText className="text-[#00695C] shrink-0" />
                  <span>{businessRegDetails.regNumber}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-[11px] font-bold text-[#5A7D78] uppercase tracking-wider mb-2">Company Description</h4>
            <p className="text-sm text-[#5A7D78] leading-relaxed bg-[#F5F9F8] rounded-xl p-4 border border-[#E8F0EE]">
              {company.description || 'No description available for this company.'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white pt-3 px-5 pb-4 border-t border-[#E8F0EE] flex items-center justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium"
          >
            Close
          </button>
          <button
            onClick={() => onEdit && onEdit(company)}
            className="px-6 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-xl hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md shadow-[#00695C]/30 hover:scale-[1.02] flex items-center gap-2"
          >
            <FiEdit className="text-sm" /> Edit
          </button>
        </div>
      </div>
    </div>
  );
};

// ============ EDIT/REGISTER COMPANY MODAL ============
const CompanyFormModal = ({ company, show, onClose, onSave, loading, mode = 'edit' }) => {
  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (show) {
      if (company && mode === 'edit') {
        setFormData({
          name: company.name || '',
          type: company.type || 'Individual',
          location: company.location || '',
          fullAddress: company.fullAddress || '',
          contactPerson: company.contactPerson || '',
          email: company.email || '',
          phone: company.phone || '',
          website: company.website || '',
          description: company.description || '',
          isVerified: company.isVerified || false,
          status: company.status || 'active',
          staffCount: company.staffCount || 0,
          ownerCount: company.ownerCount || 0,
          tenantCount: company.tenantCount || 0,
          propertiesCount: company.propertiesCount || 0,
          registeredDate: company.registeredDate || new Date().toISOString().split('T')[0],
          businessRegNumber: company.businessRegDetails?.regNumber || '',
        });
      } else {
        setFormData({
          name: '',
          type: 'Individual',
          location: '',
          fullAddress: '',
          contactPerson: '',
          email: '',
          phone: '',
          website: '',
          description: '',
          isVerified: false,
          status: 'active',
          staffCount: DUMMY_COUNTS.staffCount,
          ownerCount: DUMMY_COUNTS.ownerCount,
          tenantCount: DUMMY_COUNTS.tenantCount,
          propertiesCount: DUMMY_COUNTS.propertiesCount,
          registeredDate: new Date().toISOString().split('T')[0],
          businessRegNumber: '',
        });
      }
      setErrors({});
    }
  }, [company, show, mode]);

  if (!show || !formData) return null;

  const companyTypes = ['Individual', 'Apartment', 'Commercial', 'Land & Plots', 'Hostel'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Company name is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Structure the payload with the new business details
    const updatedData = {
      ...formData,
      staffCount: Number(formData.staffCount),
      ownerCount: Number(formData.ownerCount),
      tenantCount: Number(formData.tenantCount),
      propertiesCount: Number(formData.propertiesCount),
      businessRegDetails: {
        regNumber: formData.businessRegNumber
      }
    };

    setTimeout(() => {
      onSave(updatedData);
      setIsSubmitting(false);
    }, 600);
  };

  const typeStyle = getTypeStyle(formData.type);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 rounded-t-2xl z-10 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
              {mode === 'edit' ? <FiEdit className="text-sm" /> : <FiPlus className="text-sm" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{mode === 'edit' ? 'Edit Company' : 'Register Company'}</h2>
              <p className="text-white/70 text-[10px]">{mode === 'edit' ? 'Update company details' : 'Add a new property management company'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-sm" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
            
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="md:col-span-2">
                <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Company Name <span className="text-red-500">*</span></label>
                <input type="text" name="name" value={formData.name} onChange={handleChange}
                  className={`w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border ${errors.name ? 'border-red-400' : 'border-[#E8F0EE]'} focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none`} />
                {errors.name && <p className="text-[10px] text-red-500 mt-0.5">{errors.name}</p>}
              </div>
              <div>
                <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Company Type</label>
                <div className="relative">
                  <select name="type" value={formData.type} onChange={handleChange}
                    className="w-full pl-9 pr-8 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none appearance-none">
                    {companyTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <div className={`absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-md bg-gradient-to-br ${typeStyle.iconBg} flex items-center justify-center`}>
                    {React.cloneElement(typeStyle.icon, { className: 'text-white text-[10px]' })}
                  </div>
                  <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Contact Person</label>
                <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange}
                  className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none" />
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Email <span className="text-red-500">*</span></label>
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  className={`w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border ${errors.email ? 'border-red-400' : 'border-[#E8F0EE]'} focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none`} />
                {errors.email && <p className="text-[10px] text-red-500 mt-0.5">{errors.email}</p>}
              </div>
              <div>
                <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Phone <span className="text-red-500">*</span></label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                  className={`w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border ${errors.phone ? 'border-red-400' : 'border-[#E8F0EE]'} focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none`} />
                {errors.phone && <p className="text-[10px] text-red-500 mt-0.5">{errors.phone}</p>}
              </div>
              <div>
                <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Website</label>
                <input type="url" name="website" value={formData.website} onChange={handleChange}
                  className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none" placeholder="https://example.com" />
              </div>
              <div>
                <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Business Reg No.</label>
                <input type="text" name="businessRegNumber" value={formData.businessRegNumber} onChange={handleChange}
                  className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none" />
              </div>
            </div>

            {/* Address Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Location / City <span className="text-red-500">*</span></label>
                <input type="text" name="location" value={formData.location} onChange={handleChange}
                  className={`w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border ${errors.location ? 'border-red-400' : 'border-[#E8F0EE]'} focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none`} />
                {errors.location && <p className="text-[10px] text-red-500 mt-0.5">{errors.location}</p>}
              </div>
              <div>
                <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Full Address</label>
                <input type="text" name="fullAddress" value={formData.fullAddress} onChange={handleChange}
                  className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none" />
              </div>
            </div>

            {/* Counts */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Staff Count</label>
                <input type="number" name="staffCount" value={formData.staffCount} onChange={handleChange}
                  className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none" min="0" />
              </div>
              <div>
                <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Owner Count</label>
                <input type="number" name="ownerCount" value={formData.ownerCount} onChange={handleChange}
                  className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none" min="0" />
              </div>
              <div>
                <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Tenant Count</label>
                <input type="number" name="tenantCount" value={formData.tenantCount} onChange={handleChange}
                  className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none" min="0" />
              </div>
              <div>
                <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Properties Count</label>
                <input type="number" name="propertiesCount" value={formData.propertiesCount} onChange={handleChange}
                  className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none" min="0" />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange}
                rows="2" className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none resize-none" />
            </div>

            {/* Status (Edit Only) */}
            {mode === 'edit' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
                <div>
                  <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Company Status</label>
                  <select name="status" value={formData.status} onChange={handleChange}
                    className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <label className="flex items-center gap-2 text-xs font-medium text-[#1A2E2A] pb-2">
                  <input type="checkbox" name="isVerified" checked={formData.isVerified} onChange={handleChange}
                    className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C]" />
                  Verified Company
                </label>
              </div>
            )}
          </div>

          <div className="bg-white pt-3 px-4 pb-4 border-t border-[#E8F0EE] flex items-center gap-3 shrink-0">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2 bg-[#F5F9F8] text-[#1A2E2A] rounded-lg hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">Cancel</button>
            <button type="submit" disabled={isSubmitting || loading}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md shadow-[#00695C]/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isSubmitting || loading ? <><FiRefreshCw className="animate-spin text-sm" /> {mode === 'edit' ? 'Saving...' : 'Registering...'}</> : <><FiSave className="text-sm" /> {mode === 'edit' ? 'Save Changes' : 'Register Company'}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============ STAFF MANAGEMENT MODAL ============
const StaffManagementModal = ({ company, show, onClose }) => {
  if (!show || !company) return null;

  const STAFF_NAMES = ['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Reddy', 'Vikram Singh', 'Ananya Iyer', 'Rahul Verma', 'Neha Gupta'];
  const STAFF_ROLES = ['Property Manager', 'Assistant Manager', 'Leasing Agent', 'Maintenance Coordinator', 'Administrator'];
  const STAFF_PROPS = [
    ['Green Valley', 'Lake View'],
    ['Royal Palm'],
    ['City Heights', 'Garden Villa'],
    ['Sunset Bay'],
    ['Green Valley', 'Royal Palm', 'City Heights']
  ];

  const [staff, setStaff] = useState(() => {
    const count = Number(company.staffCount) || 0; 
    return Array.from({ length: count }).map((_, i) => ({
      id: i + 1,
      staffId: `STF-${1001 + i}`,
      name: STAFF_NAMES[i % STAFF_NAMES.length],
      role: STAFF_ROLES[i % STAFF_ROLES.length],
      email: `staff${i + 1}@${(company.name || 'company').toLowerCase().replace(/\s/g, '')}.in`,
      phone: `+91 98765 432${String(i).padStart(2, '0')}`,
      assignedProperties: STAFF_PROPS[i % STAFF_PROPS.length],
      joiningDate: `202${i % 4}-0${(i % 9) + 1}-1${i % 9}`,
      status: i % 5 === 0 && i !== 0 ? 'inactive' : 'active',
    }));
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStaff, setFilteredStaff] = useState(staff);
  const [toast, setToast] = useState(null);
  const [editingStaff, setEditingStaff] = useState(null);
  const [viewingStaff, setViewingStaff] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Yes',
    cancelText: 'No',
    confirmColor: 'bg-red-500',
    icon: null,
    onConfirm: null,
  });

  useEffect(() => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) {
      setFilteredStaff(staff);
      return;
    }
    setFilteredStaff(
      staff.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.staffId.toLowerCase().includes(q) ||
          s.role.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.phone.toLowerCase().includes(q) ||
          s.assignedProperties.some((p) => p.toLowerCase().includes(q))
      )
    );
  }, [searchTerm, staff]);

  const showToastMessage = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const closeConfirm = () =>
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));

  const askToggleStatus = (member) => {
    const willActivate = member.status !== 'active';
    setConfirmModal({
      isOpen: true,
      title: willActivate ? 'Activate Staff Member' : 'Deactivate Staff Member',
      message: `Are you sure you want to ${willActivate ? 'activate' : 'deactivate'} "${member.name}" (${member.staffId})?`,
      confirmText: willActivate ? 'Yes, Activate' : 'Yes, Deactivate',
      cancelText: 'No',
      confirmColor: willActivate ? 'bg-emerald-500' : 'bg-amber-500',
      icon: willActivate ? <FiUserCheck className="text-3xl text-emerald-500" /> : <FiUserX className="text-3xl text-amber-500" />,
      onConfirm: () => {
        setStaff((prev) => prev.map((s) =>
          s.id === member.id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s
        ));
        showToastMessage(`Staff ${willActivate ? 'activated' : 'deactivated'} successfully`, willActivate ? 'success' : 'warning');
        closeConfirm();
      },
    });
  };

  const askDeleteStaff = (member) => {
    setConfirmModal({
      isOpen: true,
      title: 'Remove Staff Member',
      message: `Are you sure you want to remove "${member.name}" (${member.staffId}) from staff? This action cannot be undone.`,
      confirmText: 'Yes, Remove',
      cancelText: 'No',
      confirmColor: 'bg-red-500',
      icon: <FiTrash2 className="text-3xl text-red-500" />,
      onConfirm: () => {
        setStaff((prev) => prev.filter((s) => s.id !== member.id));
        showToastMessage('Staff removed successfully', 'error');
        closeConfirm();
      },
    });
  };

  const handleEditStaff = (updatedStaff) => {
    setStaff((prev) => prev.map((s) => (s.id === updatedStaff.id ? updatedStaff : s)));
    setEditingStaff(null);
    showToastMessage('Staff updated successfully', 'success');
  };

  const totalStaff = staff.length;
  const activeCount = staff.filter((s) => s.status === 'active').length;
  const inactiveCount = totalStaff - activeCount;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <Toast toast={toast} />
      
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[88vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 rounded-t-2xl z-10 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
              <FiUsers className="text-sm" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Staff Management</h2>
              <p className="text-white/70 text-[10px]">{company.name} · {totalStaff} staff members</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110">
            <FiX className="text-sm" />
          </button>
        </div>

        <div className="px-4 pt-3 shrink-0">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#F5F9F8] rounded-xl px-3 py-2 border border-[#E8F0EE]">
              <p className="text-[9px] uppercase tracking-wider text-[#5A7D78]">Total</p>
              <p className="text-sm font-bold text-[#1A2E2A]">{totalStaff}</p>
            </div>
            <div className="bg-emerald-50 rounded-xl px-3 py-2 border border-emerald-100">
              <p className="text-[9px] uppercase tracking-wider text-emerald-700">Active</p>
              <p className="text-sm font-bold text-emerald-700">{activeCount}</p>
            </div>
            <div className="bg-gray-50 rounded-xl px-3 py-2 border border-gray-200">
              <p className="text-[9px] uppercase tracking-wider text-gray-600">Inactive</p>
              <p className="text-sm font-bold text-gray-700">{inactiveCount}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Search only — Add Staff button removed */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm" />
              <input
                type="text"
                placeholder="Search by name, staff ID, role, email, phone, or property..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-9 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] hover:text-[#1A2E2A] transition-colors hover:scale-110">
                  <FiX className="text-sm" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            {filteredStaff.map((staffMember) => (
              <div
                key={staffMember.id}
                className="flex items-center justify-between p-3 bg-[#F5F9F8] rounded-xl border-l-4 border-l-[#00695C] hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {staffMember.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm text-[#1A2E2A]">{staffMember.name}</p>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#E8F4F2] text-[#00695C] font-medium">
                        {staffMember.staffId}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#5A7D78] mt-0.5">
                      <span className="font-medium text-[#00695C]">{staffMember.role}</span>
                      <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
                      <span className="truncate">{staffMember.email}</span>
                      <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
                      <span>{staffMember.phone}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#5A7D78] mt-0.5">
                      <span className="flex items-center gap-1">
                        <FiMapPin className="text-[10px] text-[#00695C]" />
                        {staffMember.assignedProperties.join(', ') || 'None'}
                      </span>
                      <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
                      <span className="flex items-center gap-1">
                        <FiCalendar className="text-[10px] text-[#00695C]" />
                        Joined {staffMember.joiningDate}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${staffMember.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
                    {staffMember.status.charAt(0).toUpperCase() + staffMember.status.slice(1)}
                  </span>
                  <button onClick={() => setViewingStaff(staffMember)} className="p-1.5 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 text-[#00695C] hover:scale-110" title="View Staff">
                    <FiEye className="text-sm" />
                  </button>
                  <button onClick={() => setEditingStaff(staffMember)} className="p-1.5 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 text-[#00695C] hover:scale-110" title="Edit Staff">
                    <FiEdit className="text-sm" />
                  </button>
                  <button
                    onClick={() => askToggleStatus(staffMember)}
                    className={`p-1.5 rounded-lg transition-all duration-300 hover:scale-110 ${staffMember.status === 'active' ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
                    title={staffMember.status === 'active' ? 'Deactivate' : 'Activate'}
                  >
                    {staffMember.status === 'active' ? <FiUserX className="text-sm" /> : <FiUserCheck className="text-sm" />}
                  </button>
                  <button onClick={() => askDeleteStaff(staffMember)} className="p-1.5 rounded-lg hover:bg-red-50 transition-all duration-300 text-red-500 hover:scale-110" title="Remove Staff">
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              </div>
            ))}
            {filteredStaff.length === 0 && (
              <div className="text-center py-8 text-[#5A7D78]">
                {searchTerm ? 'No staff members match your search' : 'No staff members found'}
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white pt-3 px-4 pb-4 border-t border-[#E8F0EE] flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 bg-[#F5F9F8] text-[#1A2E2A] rounded-lg hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">
            Close
          </button>
        </div>
      </div>

      {/* Modals rendered outside the parent container to prevent clipping */}
      <StaffFormModal
        show={!!editingStaff}
        onClose={() => setEditingStaff(null)}
        onSave={handleEditStaff}
        staff={editingStaff}
        mode="edit"
      />

      <StaffViewModal
        staff={viewingStaff}
        show={!!viewingStaff}
        onClose={() => setViewingStaff(null)}
        onEdit={(s) => { setViewingStaff(null); setEditingStaff(s); }}
      />

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirm}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        confirmColor={confirmModal.confirmColor}
        icon={confirmModal.icon}
      />
    </div>
  );
};

// ============ STAFF FORM MODAL ============
const StaffFormModal = ({ show, onClose, onSave, staff, mode = 'edit' }) => {
  const emptyForm = {
    name: '',
    role: '',
    email: '',
    phone: '',
    assignedProperties: '',
    joiningDate: new Date().toISOString().split('T')[0],
    status: 'active',
  };

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (show && staff && mode === 'edit') {
      setFormData({
        name: staff.name || '',
        role: staff.role || '',
        email: staff.email || '',
        phone: staff.phone || '',
        assignedProperties: staff.assignedProperties ? staff.assignedProperties.join(', ') : '',
        joiningDate: staff.joiningDate || '',
        status: staff.status || 'active',
      });
    } else if (show) {
      setFormData(emptyForm);
    }
    setErrors({});
  }, [show, staff, mode]);

  if (!show) return null;

  const roles = ['Property Manager', 'Assistant Manager', 'Leasing Agent', 'Maintenance Coordinator', 'Administrator'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.role) newErrors.role = 'Role is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^[\d\s+\-()]{7,20}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Invalid phone number';
    }
    const props = formData.assignedProperties.split(',').map((p) => p.trim()).filter(Boolean);
    if (props.length === 0) newErrors.assignedProperties = 'At least one property is required';
    if (!formData.joiningDate) {
      newErrors.joiningDate = 'Joining date is required';
    } else if (new Date(formData.joiningDate) > new Date()) {
      newErrors.joiningDate = 'Joining date cannot be in the future';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    const assignedProperties = formData.assignedProperties.split(',').map((p) => p.trim()).filter(Boolean);
    const payload = {
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      assignedProperties,
      ...(mode === 'edit' && staff ? { id: staff.id, staffId: staff.staffId } : {}),
    };

    setTimeout(() => {
      onSave(payload);
      setIsSubmitting(false);
    }, 400);
  };

  const inputClass = (field) =>
    `w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border ${errors[field] ? 'border-red-400' : 'border-[#E8F0EE]'} focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[88vh] shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-4 pb-2 shrink-0 border-b border-[#E8F0EE]">
          <h3 className="text-base font-bold text-[#1A2E2A]">{mode === 'edit' ? 'Edit Staff' : 'Add Staff'}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#F5F9F8] transition-all duration-300 text-[#5A7D78] hover:scale-110">
            <FiX className="text-sm" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-5 pb-3 space-y-3">
            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Full Name <span className="text-red-500">*</span></label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass('name')} placeholder="e.g. Rajesh Kumar" />
              {errors.name && <p className="text-[10px] text-red-500 mt-0.5">{errors.name}</p>}
            </div>
            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Role <span className="text-red-500">*</span></label>
              <select name="role" value={formData.role} onChange={handleChange} className={inputClass('role')}>
                <option value="">Select Role</option>
                {roles.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              {errors.role && <p className="text-[10px] text-red-500 mt-0.5">{errors.role}</p>}
            </div>
            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Email <span className="text-red-500">*</span></label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass('email')} placeholder="name@company.com" />
              {errors.email && <p className="text-[10px] text-red-500 mt-0.5">{errors.email}</p>}
            </div>
            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Phone <span className="text-red-500">*</span></label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputClass('phone')} placeholder="+91 98765 43210" />
              {errors.phone && <p className="text-[10px] text-red-500 mt-0.5">{errors.phone}</p>}
            </div>
            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">
                Assigned Properties <span className="text-[#B5C9C5]">(comma separated)</span> <span className="text-red-500">*</span>
              </label>
              <input type="text" name="assignedProperties" value={formData.assignedProperties} onChange={handleChange} className={inputClass('assignedProperties')} placeholder="Green Valley, Lake View" />
              {errors.assignedProperties && <p className="text-[10px] text-red-500 mt-0.5">{errors.assignedProperties}</p>}
            </div>
            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Joining Date <span className="text-red-500">*</span></label>
              <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} max={new Date().toISOString().split('T')[0]} className={inputClass('joiningDate')} />
              {errors.joiningDate && <p className="text-[10px] text-red-500 mt-0.5">{errors.joiningDate}</p>}
            </div>
            {mode === 'edit' && (
              <div>
                <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Status</label>
                <select name="status" value={formData.status} onChange={handleChange}
                  className="w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            )}
          </div>

          <div className="px-5 py-3 border-t border-[#E8F0EE] flex items-center gap-3 shrink-0 bg-white">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-[#F5F9F8] text-[#1A2E2A] rounded-lg hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">Cancel</button>
            <button type="submit" disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md shadow-[#00695C]/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isSubmitting ? <><FiRefreshCw className="animate-spin text-sm" /> Saving...</> : <><FiSave className="text-sm" /> {mode === 'edit' ? 'Update' : 'Add'}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============ STAFF VIEW MODAL ============
const StaffViewModal = ({ staff, show, onClose, onEdit }) => {
  if (!staff || !show) return null;

  const statusBadge = staff.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col overflow-hidden">
        
        <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
              <FiEye className="text-lg" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">Staff Details</h2>
              <p className="text-white/80 text-[11px] tracking-wide mt-0.5">ID: {staff.staffId}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110">
            <FiX className="text-base" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-white">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white text-2xl font-bold shadow-lg shrink-0">
              {staff.name.charAt(0)}
            </div>
            <div className="pt-1">
              <h3 className="text-xl font-bold text-[#1A2E2A] leading-tight">{staff.name}</h3>
              <p className="text-sm text-[#5A7D78] mt-0.5">{staff.role}</p>
              <span className={`inline-block mt-2 text-[11px] px-3 py-1 rounded-full font-semibold tracking-wide ${statusBadge}`}>
                {staff.status.charAt(0).toUpperCase() + staff.status.slice(1)}
              </span>
            </div>
          </div>

          <div className="bg-[#F5F9F8] rounded-xl p-4 border border-[#E8F0EE]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-2">
              <div>
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Email ID</p>
                <div className="flex items-center gap-2 text-sm text-[#1A2E2A]">
                  <FiMail className="text-[#00695C] shrink-0" />
                  <span className="truncate">{staff.email}</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Phone</p>
                <div className="flex items-center gap-2 text-sm text-[#1A2E2A]">
                  <FiPhone className="text-[#00695C] shrink-0" />
                  <span className="truncate">{staff.phone}</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Joined</p>
                <div className="flex items-center gap-2 text-sm text-[#1A2E2A]">
                  <FiCalendar className="text-[#00695C] shrink-0" />
                  <span>{staff.joiningDate}</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Staff ID</p>
                <div className="flex items-center gap-2 text-sm text-[#1A2E2A]">
                  <FiTag className="text-[#00695C] shrink-0" />
                  <span>{staff.staffId}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-bold text-[#5A7D78] uppercase tracking-wider mb-2">Assigned Properties</h4>
            <div className="flex flex-wrap gap-2">
              {staff.assignedProperties?.length > 0 ? (
                staff.assignedProperties.map((p, i) => (
                  <span key={i} className="px-3 py-1.5 bg-[#E8F4F2] text-[#00695C] rounded-lg text-xs font-semibold border border-[#B5C9C5]/30">{p}</span>
                ))
              ) : (
                <p className="text-sm text-[#5A7D78]">No properties assigned</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white pt-3 px-5 pb-4 border-t border-[#E8F0EE] flex items-center justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-6 py-2 bg-[#F5F9F8] text-[#1A2E2A] rounded-lg hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">Close</button>
          <button onClick={() => onEdit && onEdit(staff)} className="px-6 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md shadow-[#00695C]/30 hover:scale-[1.02] flex items-center gap-2">
            <FiEdit className="text-sm" /> Edit
          </button>
        </div>
      </div>
    </div>
  );
};

// ============ OWNER MANAGEMENT MODAL ============
const OwnerManagementModal = ({ company, show, onClose }) => {
  if (!show || !company) return null;

  const OWNER_NAMES = ['Michael Chen', 'Sarah Patel', 'James Wilson', 'Lisa Johnson', 'David Lee', 'Emma Watson', 'Robert Downey', 'Scarlett Johansson'];
  const OWNER_TYPES = ['Individual', 'Corporate', 'Trust/LLP', 'Joint Ownership'];
  const OWNER_PROPS = [['Green Valley', 'Lake View'], ['Royal Palm'], ['City Heights'], ['Garden Villa', 'Sunset Bay']];
  const AGREEMENT_STATUSES = ['Active', 'Expiring Soon', 'Expired', 'Active'];

  const [owners, setOwners] = useState(() => {
    const count = Number(company.ownerCount) || 0;
    return Array.from({ length: count }).map((_, i) => ({
      id: i + 1,
      ownerId: `OWN-${1001 + i}`,
      name: OWNER_NAMES[i % OWNER_NAMES.length],
      email: `owner${i + 1}@example.com`,
      phone: `+91 99887 766${String(i).padStart(2, '0')}`,
      address: `${i + 1} Palm Grove, Bandra West, Mumbai`,
      ownerType: OWNER_TYPES[i % OWNER_TYPES.length],
      properties: OWNER_PROPS[i % OWNER_PROPS.length],
      agreementStatus: AGREEMENT_STATUSES[i % AGREEMENT_STATUSES.length],
      agreementStartDate: '2023-01-15',
      agreementEndDate: '2024-01-14',
      accountStatus: i % 6 === 0 && i !== 0 ? 'inactive' : 'active',
      verificationStatus: i % 3 === 0 ? 'Verified' : 'Pending',
    }));
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOwners, setFilteredOwners] = useState(owners);
  const [toast, setToast] = useState(null);
  const [editingOwner, setEditingOwner] = useState(null);
  const [viewingOwner, setViewingOwner] = useState(null);

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false, title: '', message: '', confirmText: 'Yes', cancelText: 'No',
    confirmColor: 'bg-red-500', icon: null, onConfirm: null
  });

  useEffect(() => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) {
      setFilteredOwners(owners);
      return;
    }
    setFilteredOwners(
      owners.filter(o =>
        o.name.toLowerCase().includes(q) ||
        o.ownerId.toLowerCase().includes(q) ||
        o.email.toLowerCase().includes(q) ||
        o.phone.toLowerCase().includes(q) ||
        o.ownerType.toLowerCase().includes(q) ||
        o.properties.some(p => p.toLowerCase().includes(q))
      )
    );
  }, [searchTerm, owners]);

  const showToastMessage = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const closeConfirm = () => setConfirmModal(prev => ({ ...prev, isOpen: false }));

  const askToggleStatus = (o) => {
    const willActivate = o.accountStatus !== 'active';
    setConfirmModal({
      isOpen: true,
      title: willActivate ? 'Activate Owner Account' : 'Deactivate Owner Account',
      message: `Are you sure you want to ${willActivate ? 'activate' : 'deactivate'} the account for "${o.name}" (${o.ownerId})?`,
      confirmText: willActivate ? 'Yes, Activate' : 'Yes, Deactivate',
      cancelText: 'No',
      confirmColor: willActivate ? 'bg-emerald-500' : 'bg-amber-500',
      icon: willActivate ? <FiUserCheck className="text-3xl text-emerald-500" /> : <FiUserX className="text-3xl text-amber-500" />,
      onConfirm: () => {
        setOwners(prev => prev.map(x => x.id === o.id ? { ...x, accountStatus: willActivate ? 'active' : 'inactive' } : x));
        showToastMessage(`Owner account ${willActivate ? 'activated' : 'deactivated'}`, willActivate ? 'success' : 'warning');
        closeConfirm();
      },
    });
  };

  const askDeleteOwner = (o) => {
    setConfirmModal({
      isOpen: true,
      title: 'Remove Owner Record',
      message: `Are you sure you want to remove "${o.name}" (${o.ownerId})? This will unlink all associated properties and cannot be undone.`,
      confirmText: 'Yes, Remove',
      cancelText: 'No',
      confirmColor: 'bg-red-500',
      icon: <FiTrash2 className="text-3xl text-red-500" />,
      onConfirm: () => {
        setOwners(prev => prev.filter(x => x.id !== o.id));
        showToastMessage('Owner removed successfully', 'error');
        closeConfirm();
      },
    });
  };


  const handleEditOwner = (updatedOwner) => {
    setOwners(prev => prev.map(o => o.id === updatedOwner.id ? updatedOwner : o));
    setEditingOwner(null);
    showToastMessage('Owner updated successfully', 'success');
  };

  const checkDuplicate = (email, phone, excludeId = null) => {
    return owners.some(o =>
      o.id !== excludeId &&
      (o.email.toLowerCase() === email.toLowerCase() || o.phone === phone)
    );
  };

  const totalOwners = owners.length;
  const activeOwners = owners.filter(o => o.accountStatus === 'active').length;
  const inactiveOwners = owners.filter(o => o.accountStatus === 'inactive').length;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <Toast toast={toast} />
      
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[88vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 rounded-t-2xl z-10 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
              <FiUser className="text-sm" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Owner Management</h2>
              <p className="text-white/70 text-[10px]">{company.name} · {totalOwners} owners</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110">
            <FiX className="text-sm" />
          </button>
        </div>

        {/* UPDATED STATS SECTION */}
        <div className="px-4 pt-3 shrink-0">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#F5F9F8] rounded-xl px-3 py-2 border border-[#E8F0EE]">
              <p className="text-[9px] uppercase tracking-wider text-[#5A7D78]">Total Owners</p>
              <p className="text-sm font-bold text-[#1A2E2A]">{totalOwners}</p>
            </div>
            <div className="bg-emerald-50 rounded-xl px-3 py-2 border border-emerald-100">
              <p className="text-[9px] uppercase tracking-wider text-emerald-700">Active Accounts</p>
              <p className="text-sm font-bold text-emerald-700">{activeOwners}</p>
            </div>
            <div className="bg-gray-50 rounded-xl px-3 py-2 border border-gray-200">
              <p className="text-[9px] uppercase tracking-wider text-gray-600">Inactive Accounts</p>
              <p className="text-sm font-bold text-gray-700">{inactiveOwners}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm" />
              <input
                type="text"
                placeholder="Search by name, ID, email, phone, type, or property..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-9 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] hover:text-[#1A2E2A] transition-colors hover:scale-110">
                  <FiX className="text-sm" />
                </button>
              )}
            </div>
            
          </div>

          <div className="space-y-2">
            {filteredOwners.map((owner) => (
              <div key={owner.id} className="flex items-center justify-between p-3 bg-[#F5F9F8] rounded-xl border-l-4 border-l-blue-500 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {owner.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm text-[#1A2E2A]">{owner.name}</p>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">{owner.ownerId}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${owner.accountStatus === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
                        {owner.accountStatus.toUpperCase()}
                      </span>
                      {owner.verificationStatus === 'Verified' && (
                        <FiShield className="text-emerald-600 text-[10px]" />
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#5A7D78] mt-1">
                      <span className="font-medium text-blue-600">{owner.ownerType}</span>
                      <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
                      <span className="truncate">{owner.email}</span>
                      <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
                      <span>{owner.phone}</span>
                      <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
                      <span className="text-[#00695C] font-medium">{owner.agreementStatus}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <span className={`hidden sm:inline-block text-[10px] px-2 py-1 rounded-lg mr-1 ${owner.agreementStatus === 'Active' ? 'bg-emerald-50 text-emerald-700' : owner.agreementStatus === 'Expiring Soon' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>
                    {owner.agreementStatus}
                  </span>
                  <button onClick={() => setViewingOwner(owner)} className="p-1.5 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 text-[#00695C] hover:scale-110" title="View">
                    <FiEye className="text-sm" />
                  </button>
                  <button onClick={() => setEditingOwner(owner)} className="p-1.5 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 text-[#00695C] hover:scale-110" title="Edit">
                    <FiEdit className="text-sm" />
                  </button>
                  <button
                    onClick={() => askToggleStatus(owner)}
                    className={`p-1.5 rounded-lg transition-all duration-300 hover:scale-110 ${owner.accountStatus === 'active' ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
                    title={owner.accountStatus === 'active' ? 'Deactivate' : 'Activate'}
                  >
                    {owner.accountStatus === 'active' ? <FiUserX className="text-sm" /> : <FiUserCheck className="text-sm" />}
                  </button>
                  <button onClick={() => askDeleteOwner(owner)} className="p-1.5 rounded-lg hover:bg-red-50 transition-all duration-300 text-red-500 hover:scale-110" title="Remove">
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              </div>
            ))}
            {filteredOwners.length === 0 && (
              <div className="text-center py-8 text-[#5A7D78]">No owners found</div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white pt-3 px-4 pb-4 border-t border-[#E8F0EE] flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 bg-[#F5F9F8] text-[#1A2E2A] rounded-lg hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">Close</button>
        </div>
      </div>

      {/* 🔥 MOVED OUTSIDE THE PARENT CONTAINER TO PREVENT CLIPPING 🔥 */}
      
      <OwnerFormModal
        show={!!editingOwner}
        onClose={() => setEditingOwner(null)}
        onSave={handleEditOwner}
        owner={editingOwner}
        mode="edit"
        checkDuplicate={checkDuplicate}
      />
      <OwnerViewModal
        owner={viewingOwner}
        show={!!viewingOwner}
        onClose={() => setViewingOwner(null)}
        onEdit={(o) => { setViewingOwner(null); setEditingOwner(o); }}
      />
      
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirm}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        confirmColor={confirmModal.confirmColor}
        icon={confirmModal.icon}
      />
    </div>
  );
};

// ============ OWNER FORM MODAL ============
const OwnerFormModal = ({ show, onClose, onSave, owner, mode = 'add', checkDuplicate }) => {
  const emptyForm = {
    name: '', email: '', phone: '', address: '', ownerType: 'Individual',
    properties: '', agreementStatus: 'Active',
    agreementStartDate: new Date().toISOString().split('T')[0],
    agreementEndDate: '', accountStatus: 'active', verificationStatus: 'Pending',
  };

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (show && owner && mode === 'edit') {
      setFormData({
        name: owner.name || '', email: owner.email || '', phone: owner.phone || '',
        address: owner.address || '', ownerType: owner.ownerType || 'Individual',
        properties: owner.properties ? owner.properties.join(', ') : '',
        agreementStatus: owner.agreementStatus || 'Active',
        agreementStartDate: owner.agreementStartDate || '',
        agreementEndDate: owner.agreementEndDate || '',
        accountStatus: owner.accountStatus || 'active',
        verificationStatus: owner.verificationStatus || 'Pending',
      });
    } else if (show) {
      setFormData(emptyForm);
    }
    setErrors({});
  }, [show, owner, mode]);

  if (!show) return null;

  const ownerTypes = ['Individual', 'Corporate', 'Trust/LLP', 'Joint Ownership'];
  const agreementStatuses = ['Active', 'Expiring Soon', 'Expired', 'Pending', 'Terminated'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^[\d\s+\-()]{7,20}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Invalid phone number';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    const props = formData.properties.split(',').map(p => p.trim()).filter(Boolean);
    if (props.length === 0) newErrors.properties = 'At least one property is required';
    if (!formData.agreementStartDate) newErrors.agreementStartDate = 'Start date is required';
    if (!formData.agreementEndDate) {
      newErrors.agreementEndDate = 'End date is required';
    } else if (new Date(formData.agreementEndDate) <= new Date(formData.agreementStartDate)) {
      newErrors.agreementEndDate = 'End date must be after start date';
    }
    if (!newErrors.email && !newErrors.phone && checkDuplicate) {
      const isDuplicate = checkDuplicate(formData.email, formData.phone, mode === 'edit' ? owner.id : null);
      if (isDuplicate) newErrors.email = 'An owner with this email or phone already exists';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    const propertiesArray = formData.properties.split(',').map(p => p.trim()).filter(Boolean);
    const payload = {
      ...formData,
      properties: propertiesArray,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      ...(mode === 'edit' && owner ? { id: owner.id, ownerId: owner.ownerId } : {}),
    };
    setTimeout(() => {
      onSave(payload);
      setIsSubmitting(false);
    }, 400);
  };

  const inputClass = (field) =>
    `w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border ${errors[field] ? 'border-red-400' : 'border-[#E8F0EE]'} focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-4 pb-2 shrink-0 border-b border-[#E8F0EE]">
          <h3 className="text-base font-bold text-[#1A2E2A]">{mode === 'edit' ? 'Edit Owner' : 'Add Owner'}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#F5F9F8] transition-all duration-300 text-[#5A7D78] hover:scale-110">
            <FiX className="text-sm" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Full Name <span className="text-red-500">*</span></label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass('name')} placeholder="Michael Chen" />
                {errors.name && <p className="text-[10px] text-red-500 mt-0.5">{errors.name}</p>}
              </div>
              <div>
                <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Owner Type</label>
                <select name="ownerType" value={formData.ownerType} onChange={handleChange} className={inputClass('ownerType')}>
                  {ownerTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Email <span className="text-red-500">*</span></label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass('email')} placeholder="name@example.com" />
                {errors.email && <p className="text-[10px] text-red-500 mt-0.5">{errors.email}</p>}
              </div>
              <div>
                <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Phone <span className="text-red-500">*</span></label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputClass('phone')} placeholder="+91 98765 43210" />
                {errors.phone && <p className="text-[10px] text-red-500 mt-0.5">{errors.phone}</p>}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Address <span className="text-red-500">*</span></label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} className={inputClass('address')} placeholder="123 Street Name, City" />
              {errors.address && <p className="text-[10px] text-red-500 mt-0.5">{errors.address}</p>}
            </div>

            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Assigned Properties <span className="text-[#B5C9C5]">(comma separated)</span> <span className="text-red-500">*</span></label>
              <input type="text" name="properties" value={formData.properties} onChange={handleChange} className={inputClass('properties')} placeholder="Green Valley, Lake View" />
              {errors.properties && <p className="text-[10px] text-red-500 mt-0.5">{errors.properties}</p>}
            </div>

            <div className="bg-[#F5F9F8] rounded-xl p-3 border border-[#E8F0EE] space-y-3">
              <h4 className="text-[10px] font-bold text-[#1A2E2A] uppercase tracking-wider">Management Agreement</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Status</label>
                  <select name="agreementStatus" value={formData.agreementStatus} onChange={handleChange} className={inputClass('agreementStatus')}>
                    {agreementStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Start Date <span className="text-red-500">*</span></label>
                  <input type="date" name="agreementStartDate" value={formData.agreementStartDate} onChange={handleChange} className={inputClass('agreementStartDate')} />
                  {errors.agreementStartDate && <p className="text-[10px] text-red-500 mt-0.5">{errors.agreementStartDate}</p>}
                </div>
                <div>
                  <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">End Date <span className="text-red-500">*</span></label>
                  <input type="date" name="agreementEndDate" value={formData.agreementEndDate} onChange={handleChange} className={inputClass('agreementEndDate')} />
                  {errors.agreementEndDate && <p className="text-[10px] text-red-500 mt-0.5">{errors.agreementEndDate}</p>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Account Status</label>
                <select name="accountStatus" value={formData.accountStatus} onChange={handleChange} className={inputClass('accountStatus')}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Verification Status</label>
                <select name="verificationStatus" value={formData.verificationStatus} onChange={handleChange} className={inputClass('verificationStatus')}>
                  <option value="Verified">Verified</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          <div className="px-5 py-3 border-t border-[#E8F0EE] flex items-center gap-3 shrink-0 bg-white">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-[#F5F9F8] text-[#1A2E2A] rounded-lg hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md shadow-[#00695C]/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isSubmitting ? <><FiRefreshCw className="animate-spin text-sm" /> Saving...</> : <><FiSave className="text-sm" /> {mode === 'edit' ? 'Update' : 'Add'}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============ OWNER VIEW MODAL ============
const OwnerViewModal = ({ owner, show, onClose, onEdit }) => {
  if (!owner || !show) return null;

  const statusBadge = owner.accountStatus === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700';
  const agreementBadge = owner.agreementStatus === 'Active' ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
    : owner.agreementStatus === 'Expiring Soon' ? 'bg-amber-100 text-amber-700 border-amber-200'
    : 'bg-red-100 text-red-700 border-red-200';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
              <FiUser className="text-lg" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">Owner Details</h2>
              <p className="text-white/80 text-[11px] tracking-wide mt-0.5">ID: {owner.ownerId}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110">
            <FiX className="text-base" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-white">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-2xl font-bold shadow-lg shrink-0">
              {owner.name.charAt(0)}
            </div>
            <div className="pt-1">
              <h3 className="text-xl font-bold text-[#1A2E2A] leading-tight">{owner.name}</h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{owner.ownerType}</span>
                <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold ${statusBadge}`}>{owner.accountStatus.toUpperCase()}</span>
                {owner.verificationStatus === 'Verified' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <FiShield className="text-[10px]" /> Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-[#F5F9F8] rounded-xl p-4 border border-[#E8F0EE]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-2">
              <div>
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Email ID</p>
                <div className="flex items-center gap-2 text-sm text-[#1A2E2A]">
                  <FiMail className="text-[#00695C] shrink-0" />
                  <span className="truncate">{owner.email}</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Phone</p>
                <div className="flex items-center gap-2 text-sm text-[#1A2E2A]">
                  <FiPhone className="text-[#00695C] shrink-0" />
                  <span className="truncate">{owner.phone}</span>
                </div>
              </div>
              <div className="sm:col-span-2">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Address</p>
                <div className="flex items-center gap-2 text-sm text-[#1A2E2A]">
                  <FiMapPin className="text-[#00695C] shrink-0" />
                  <span className="truncate">{owner.address}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-bold text-[#5A7D78] uppercase tracking-wider mb-2">Management Agreement</h4>
            <div className="bg-white rounded-xl p-4 border border-[#E8F0EE] flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Status</p>
                <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-semibold border ${agreementBadge}`}>{owner.agreementStatus}</span>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Duration</p>
                <p className="text-sm font-medium text-[#1A2E2A]">
                  {owner.agreementStartDate} <span className="text-[#B5C9C5] mx-1">→</span> {owner.agreementEndDate}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-bold text-[#5A7D78] uppercase tracking-wider mb-2">Assigned Properties</h4>
            <div className="flex flex-wrap gap-2">
              {owner.properties.length > 0 ? (
                owner.properties.map((p, i) => (
                  <span key={i} className="px-3 py-1.5 bg-[#E8F4F2] text-[#00695C] rounded-lg text-xs font-semibold border border-[#B5C9C5]/30">{p}</span>
                ))
              ) : (
                <p className="text-sm text-[#5A7D78]">No properties assigned</p>
              )}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white pt-3 px-5 pb-4 border-t border-[#E8F0EE] flex items-center justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-6 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">Close</button>
          <button onClick={() => onEdit && onEdit(owner)} className="px-6 py-2.5 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-xl hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md shadow-[#00695C]/30 hover:scale-[1.02] flex items-center gap-2">
            <FiEdit className="text-sm" /> Edit
          </button>
        </div>
      </div>
    </div>
  );
};

// ============ TENANT MANAGEMENT MODAL ============
const TenantManagementModal = ({ company, show, onClose }) => {
  if (!show || !company) return null;

  const TENANT_NAMES = ['Alice Johnson', 'Bob Williams', 'Carol Davis', 'David Lee', 'Emma Wilson', 'Frank Miller', 'Grace Taylor', 'Henry Anderson'];
  const PROPERTIES = ['Green Valley', 'Lake View', 'Royal Palm', 'City Heights', 'Garden Villa', 'Sunset Bay'];
  const PAYMENT_STATUSES = ['Paid', 'Pending', 'Overdue', 'Partial'];

  const [tenants, setTenants] = useState(() => {
    const count = Number(company.tenantCount) || 0;
    return Array.from({ length: count }).map((_, i) => {
      const leaseStart = new Date(2024, i % 12, 1 + (i % 28));
      const leaseEnd = new Date(leaseStart);
      leaseEnd.setFullYear(leaseEnd.getFullYear() + 1);
      return {
        id: i + 1,
        tenantId: `TNT-${1001 + i}`,
        name: TENANT_NAMES[i % TENANT_NAMES.length],
        email: `tenant${i + 1}@example.com`,
        phone: `+91 88776 655${String(i).padStart(2, '0')}`,
        property: PROPERTIES[i % PROPERTIES.length],
        unit: `A-${100 + i}`,
        leaseStartDate: leaseStart.toISOString().split('T')[0],
        leaseEndDate: leaseEnd.toISOString().split('T')[0],
        monthlyRent: 15000 + (i * 2500),
        paymentStatus: PAYMENT_STATUSES[i % PAYMENT_STATUSES.length],
        tenancyStatus: i % 4 === 0 && i !== 0 ? 'Inactive' : 'Active',
      };
    });
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTenants, setFilteredTenants] = useState(tenants);
  const [toast, setToast] = useState(null);
  const [editingTenant, setEditingTenant] = useState(null);
  const [viewingTenant, setViewingTenant] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false, title: '', message: '', confirmText: 'Yes', cancelText: 'No',
    confirmColor: 'bg-red-500', icon: null, onConfirm: null
  });

  useEffect(() => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) {
      setFilteredTenants(tenants);
      return;
    }
    setFilteredTenants(
      tenants.filter(t =>
        t.tenantId.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) ||
        t.phone.toLowerCase().includes(q) ||
        t.property.toLowerCase().includes(q) ||
        t.unit.toLowerCase().includes(q) ||
        t.paymentStatus.toLowerCase().includes(q) ||
        t.tenancyStatus.toLowerCase().includes(q)
      )
    );
  }, [searchTerm, tenants]);

  const showToastMessage = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const closeConfirm = () => setConfirmModal(prev => ({ ...prev, isOpen: false }));

  const checkDuplicate = (email, phone, excludeId = null) => {
    return tenants.some(t =>
      t.id !== excludeId &&
      (t.email.toLowerCase() === email.toLowerCase() || t.phone === phone)
    );
  };

  const askToggleStatus = (t) => {
    const willActivate = t.tenancyStatus !== 'Active';
    setConfirmModal({
      isOpen: true,
      title: willActivate ? 'Activate Tenant' : 'Deactivate Tenant',
      message: `Are you sure you want to ${willActivate ? 'activate' : 'deactivate'} "${t.name}" (${t.tenantId})?`,
      confirmText: willActivate ? 'Yes, Activate' : 'Yes, Deactivate',
      cancelText: 'No',
      confirmColor: willActivate ? 'bg-emerald-500' : 'bg-amber-500',
      icon: willActivate ? <FiUserCheck className="text-3xl text-emerald-500" /> : <FiUserX className="text-3xl text-amber-500" />,
      onConfirm: () => {
        setTenants(prev => prev.map(x => x.id === t.id ? { ...x, tenancyStatus: willActivate ? 'Active' : 'Inactive' } : x));
        showToastMessage(`Tenant ${willActivate ? 'activated' : 'deactivated'} successfully`, willActivate ? 'success' : 'warning');
        closeConfirm();
      },
    });
  };

  const askDeleteTenant = (t) => {
    setConfirmModal({
      isOpen: true,
      title: 'Remove Tenant',
      message: `Are you sure you want to remove "${t.name}" (${t.tenantId})? This action cannot be undone.`,
      confirmText: 'Yes, Remove',
      cancelText: 'No',
      confirmColor: 'bg-red-500',
      icon: <FiTrash2 className="text-3xl text-red-500" />,
      onConfirm: () => {
        setTenants(prev => prev.filter(x => x.id !== t.id));
        showToastMessage('Tenant removed successfully', 'error');
        closeConfirm();
      },
    });
  };

  const handleEditTenant = (updatedTenant) => {
    setTenants(prev => prev.map(t => t.id === updatedTenant.id ? updatedTenant : t));
    setEditingTenant(null);
    showToastMessage('Tenant updated successfully', 'success');
  };

  const totalTenants = tenants.length;
  const activeTenants = tenants.filter(t => t.tenancyStatus === 'Active').length;
  const inactiveTenants = tenants.filter(t => t.tenancyStatus === 'Inactive').length;

  const getPaymentBadge = (status) => {
    const map = {
      'Paid': 'bg-emerald-100 text-emerald-700',
      'Pending': 'bg-amber-100 text-amber-700',
      'Overdue': 'bg-red-100 text-red-700',
      'Partial': 'bg-blue-100 text-blue-700',
    };
    return map[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <Toast toast={toast} />

      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[88vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 rounded-t-2xl z-10 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
              <FiUsers className="text-sm" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Tenant Management</h2>
              <p className="text-white/70 text-[10px]">{company.name} · {totalTenants} tenants</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110">
            <FiX className="text-sm" />
          </button>
        </div>

        {/* Stats */}
        <div className="px-4 pt-3 shrink-0">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#F5F9F8] rounded-xl px-3 py-2 border border-[#E8F0EE]">
              <p className="text-[9px] uppercase tracking-wider text-[#5A7D78]">Total Tenants</p>
              <p className="text-sm font-bold text-[#1A2E2A]">{totalTenants}</p>
            </div>
            <div className="bg-emerald-50 rounded-xl px-3 py-2 border border-emerald-100">
              <p className="text-[9px] uppercase tracking-wider text-emerald-700">Active</p>
              <p className="text-sm font-bold text-emerald-700">{activeTenants}</p>
            </div>
            <div className="bg-gray-50 rounded-xl px-3 py-2 border border-gray-200">
              <p className="text-[9px] uppercase tracking-wider text-gray-600">Inactive</p>
              <p className="text-sm font-bold text-gray-700">{inactiveTenants}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Search only — Add Tenant button removed */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm" />
              <input
                type="text"
                placeholder="Search by ID, name, email, phone, property, unit, or status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-9 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] hover:text-[#1A2E2A] transition-colors hover:scale-110">
                  <FiX className="text-sm" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            {filteredTenants.map((tenant) => (
              <div key={tenant.id} className="p-3 bg-[#F5F9F8] rounded-xl border-l-4 border-l-purple-500 hover:shadow-md transition-all duration-300">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {tenant.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm text-[#1A2E2A]">{tenant.name}</p>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium">{tenant.tenantId}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${tenant.tenancyStatus === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
                          {tenant.tenancyStatus}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${getPaymentBadge(tenant.paymentStatus)}`}>
                          {tenant.paymentStatus}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#5A7D78] mt-1">
                        <span className="truncate">{tenant.email}</span>
                        <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
                        <span>{tenant.phone}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#5A7D78] mt-0.5">
                        <span className="flex items-center gap-1">
                          <FiHome className="text-[10px] text-purple-600" />
                          <span className="font-medium text-purple-700">{tenant.property}</span>
                          <span className="text-[#B5C9C5]">·</span>
                          Unit {tenant.unit}
                        </span>
                        <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
                        <span className="flex items-center gap-1">
                          <FiCalendar className="text-[10px] text-purple-600" />
                          {tenant.leaseStartDate} → {tenant.leaseEndDate}
                        </span>
                        <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
                        <span className="flex items-center gap-1 font-medium text-[#1A2E2A]">
                          <FiDollarSign className="text-[10px] text-emerald-600" />
                          ₹{tenant.monthlyRent.toLocaleString()}/mo
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => setViewingTenant(tenant)} className="p-1.5 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 text-[#00695C] hover:scale-110" title="View Tenant">
                      <FiEye className="text-sm" />
                    </button>
                    <button onClick={() => setEditingTenant(tenant)} className="p-1.5 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 text-[#00695C] hover:scale-110" title="Edit Tenant">
                      <FiEdit className="text-sm" />
                    </button>
                    <button
                      onClick={() => askToggleStatus(tenant)}
                      className={`p-1.5 rounded-lg transition-all duration-300 hover:scale-110 ${tenant.tenancyStatus === 'Active' ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
                      title={tenant.tenancyStatus === 'Active' ? 'Deactivate' : 'Activate'}
                    >
                      {tenant.tenancyStatus === 'Active' ? <FiUserX className="text-sm" /> : <FiUserCheck className="text-sm" />}
                    </button>
                    <button onClick={() => askDeleteTenant(tenant)} className="p-1.5 rounded-lg hover:bg-red-50 transition-all duration-300 text-red-500 hover:scale-110" title="Remove Tenant">
                      <FiTrash2 className="text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredTenants.length === 0 && (
              <div className="text-center py-8 text-[#5A7D78]">
                {searchTerm ? 'No tenants match your search' : 'No tenants found'}
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white pt-3 px-4 pb-4 border-t border-[#E8F0EE] flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 bg-[#F5F9F8] text-[#1A2E2A] rounded-lg hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">Close</button>
        </div>
      </div>

  
      <TenantFormModal
        show={!!editingTenant}
        onClose={() => setEditingTenant(null)}
        onSave={handleEditTenant}
        tenant={editingTenant}
        mode="edit"
        checkDuplicate={checkDuplicate}
      />

      <TenantViewModal
        tenant={viewingTenant}
        show={!!viewingTenant}
        onClose={() => setViewingTenant(null)}
        onEdit={(t) => { setViewingTenant(null); setEditingTenant(t); }}
      />

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirm}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        confirmColor={confirmModal.confirmColor}
        icon={confirmModal.icon}
      />
    </div>
  );
};

// ============ TENANT FORM MODAL ============
const TenantFormModal = ({ show, onClose, onSave, tenant, mode = 'add', checkDuplicate }) => {
  const getEmptyForm = () => {
    const today = new Date().toISOString().split('T')[0];
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    return {
      name: '',
      email: '',
      phone: '',
      property: '',
      unit: '',
      leaseStartDate: today,
      leaseEndDate: nextYear.toISOString().split('T')[0],
      monthlyRent: '',
      paymentStatus: 'Pending',
      tenancyStatus: 'Active',
    };
  };

  const [formData, setFormData] = useState(getEmptyForm());
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (show && tenant && mode === 'edit') {
      setFormData({
        name: tenant.name || '',
        email: tenant.email || '',
        phone: tenant.phone || '',
        property: tenant.property || '',
        unit: tenant.unit || '',
        leaseStartDate: tenant.leaseStartDate || '',
        leaseEndDate: tenant.leaseEndDate || '',
        monthlyRent: tenant.monthlyRent || '',
        paymentStatus: tenant.paymentStatus || 'Pending',
        tenancyStatus: tenant.tenancyStatus || 'Active',
      });
    } else if (show) {
      setFormData(getEmptyForm());
    }
    setErrors({});
  }, [show, tenant, mode]);

  if (!show) return null;

  const paymentStatuses = ['Paid', 'Pending', 'Overdue', 'Partial'];
  const tenancyStatuses = ['Active', 'Inactive'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Full name is required';

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^[\d\s+\-()]{7,20}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Invalid phone number';
    }

    if (!formData.property.trim()) newErrors.property = 'Property is required';
    if (!formData.unit.trim()) newErrors.unit = 'Unit number is required';

    if (!formData.leaseStartDate) {
      newErrors.leaseStartDate = 'Lease start date is required';
    }

    if (!formData.leaseEndDate) {
      newErrors.leaseEndDate = 'Lease expiry date is required';
    } else if (formData.leaseStartDate && new Date(formData.leaseEndDate) <= new Date(formData.leaseStartDate)) {
      newErrors.leaseEndDate = 'Expiry date must be after start date';
    }

    if (!formData.monthlyRent) {
      newErrors.monthlyRent = 'Monthly rent is required';
    } else if (Number(formData.monthlyRent) <= 0) {
      newErrors.monthlyRent = 'Monthly rent must be greater than 0';
    }

    if (!newErrors.email && !newErrors.phone && checkDuplicate) {
      const isDuplicate = checkDuplicate(
        formData.email.trim(),
        formData.phone.trim(),
        mode === 'edit' ? tenant.id : null
      );
      if (isDuplicate) {
        newErrors.email = 'A tenant with this email or phone already exists';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    const payload = {
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      property: formData.property.trim(),
      unit: formData.unit.trim(),
      monthlyRent: Number(formData.monthlyRent),
      ...(mode === 'edit' && tenant ? { id: tenant.id, tenantId: tenant.tenantId } : {}),
    };

    setTimeout(() => {
      onSave(payload);
      setIsSubmitting(false);
    }, 400);
  };

  const inputClass = (field) =>
    `w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border ${errors[field] ? 'border-red-400' : 'border-[#E8F0EE]'} focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="flex items-center justify-between px-5 pt-4 pb-2 shrink-0 border-b border-[#E8F0EE]">
          <h3 className="text-base font-bold text-[#1A2E2A]">{mode === 'edit' ? 'Edit Tenant' : 'Add Tenant'}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#F5F9F8] transition-all duration-300 text-[#5A7D78] hover:scale-110">
            <FiX className="text-sm" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Full Name <span className="text-red-500">*</span></label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass('name')} placeholder="Alice Johnson" />
                {errors.name && <p className="text-[10px] text-red-500 mt-0.5">{errors.name}</p>}
              </div>
              <div>
                <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Phone <span className="text-red-500">*</span></label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputClass('phone')} placeholder="+91 98765 43210" />
                {errors.phone && <p className="text-[10px] text-red-500 mt-0.5">{errors.phone}</p>}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Email <span className="text-red-500">*</span></label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass('email')} placeholder="tenant@example.com" />
              {errors.email && <p className="text-[10px] text-red-500 mt-0.5">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Assigned Property <span className="text-red-500">*</span></label>
                <input type="text" name="property" value={formData.property} onChange={handleChange} className={inputClass('property')} placeholder="Green Valley" />
                {errors.property && <p className="text-[10px] text-red-500 mt-0.5">{errors.property}</p>}
              </div>
              <div>
                <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Unit Number <span className="text-red-500">*</span></label>
                <input type="text" name="unit" value={formData.unit} onChange={handleChange} className={inputClass('unit')} placeholder="A-101" />
                {errors.unit && <p className="text-[10px] text-red-500 mt-0.5">{errors.unit}</p>}
              </div>
            </div>

            <div className="bg-[#F5F9F8] rounded-xl p-3 border border-[#E8F0EE] space-y-3">
              <h4 className="text-[10px] font-bold text-[#1A2E2A] uppercase tracking-wider">Lease Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Start Date <span className="text-red-500">*</span></label>
                  <input type="date" name="leaseStartDate" value={formData.leaseStartDate} onChange={handleChange} className={inputClass('leaseStartDate')} />
                  {errors.leaseStartDate && <p className="text-[10px] text-red-500 mt-0.5">{errors.leaseStartDate}</p>}
                </div>
                <div>
                  <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Expiry Date <span className="text-red-500">*</span></label>
                  <input type="date" name="leaseEndDate" value={formData.leaseEndDate} onChange={handleChange} className={inputClass('leaseEndDate')} />
                  {errors.leaseEndDate && <p className="text-[10px] text-red-500 mt-0.5">{errors.leaseEndDate}</p>}
                </div>
                <div>
                  <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Monthly Rent (₹) <span className="text-red-500">*</span></label>
                  <input type="number" name="monthlyRent" value={formData.monthlyRent} onChange={handleChange} className={inputClass('monthlyRent')} placeholder="15000" min="1" />
                  {errors.monthlyRent && <p className="text-[10px] text-red-500 mt-0.5">{errors.monthlyRent}</p>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Payment Status</label>
                <select name="paymentStatus" value={formData.paymentStatus} onChange={handleChange} className={inputClass('paymentStatus')}>
                  {paymentStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Tenancy Status</label>
                <select name="tenancyStatus" value={formData.tenancyStatus} onChange={handleChange} className={inputClass('tenancyStatus')}>
                  {tenancyStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="px-5 py-3 border-t border-[#E8F0EE] flex items-center gap-3 shrink-0 bg-white">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-[#F5F9F8] text-[#1A2E2A] rounded-lg hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md shadow-[#00695C]/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isSubmitting ? <><FiRefreshCw className="animate-spin text-sm" /> Saving...</> : <><FiSave className="text-sm" /> {mode === 'edit' ? 'Update' : 'Add'}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============ TENANT VIEW MODAL ============
const TenantViewModal = ({ tenant, show, onClose, onEdit }) => {
  if (!tenant || !show) return null;

  const getPaymentBadge = (status) => {
    const map = {
      'Paid': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'Pending': 'bg-amber-100 text-amber-700 border-amber-200',
      'Overdue': 'bg-red-100 text-red-700 border-red-200',
      'Partial': 'bg-blue-100 text-blue-700 border-blue-200',
    };
    return map[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const tenancyBadge = tenant.tenancyStatus === 'Active'
    ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
    : 'bg-gray-100 text-gray-700 border-gray-200';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
              <FiUsers className="text-lg" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">Tenant Details</h2>
              <p className="text-white/80 text-[11px] tracking-wide mt-0.5">ID: {tenant.tenantId}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110">
            <FiX className="text-base" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-white">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center text-white text-2xl font-bold shadow-lg shrink-0">
              {tenant.name.charAt(0)}
            </div>
            <div className="pt-1 flex-1">
              <h3 className="text-xl font-bold text-[#1A2E2A] leading-tight">{tenant.name}</h3>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${tenancyBadge}`}>{tenant.tenancyStatus}</span>
                <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${getPaymentBadge(tenant.paymentStatus)}`}>
                  {tenant.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#F5F9F8] rounded-xl p-4 border border-[#E8F0EE]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-2">
              <div>
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Email</p>
                <div className="flex items-center gap-2 text-sm text-[#1A2E2A]">
                  <FiMail className="text-[#00695C] shrink-0" />
                  <span className="truncate">{tenant.email}</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Phone</p>
                <div className="flex items-center gap-2 text-sm text-[#1A2E2A]">
                  <FiPhone className="text-[#00695C] shrink-0" />
                  <span className="truncate">{tenant.phone}</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Assigned Property</p>
                <div className="flex items-center gap-2 text-sm text-[#1A2E2A]">
                  <FiHome className="text-purple-600 shrink-0" />
                  <span className="truncate font-medium">{tenant.property}</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Unit Number</p>
                <div className="flex items-center gap-2 text-sm text-[#1A2E2A]">
                  <FiTag className="text-purple-600 shrink-0" />
                  <span className="font-medium">{tenant.unit}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-bold text-[#5A7D78] uppercase tracking-wider mb-2">Lease Information</h4>
            <div className="bg-white rounded-xl p-4 border border-[#E8F0EE]">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Start Date</p>
                  <p className="text-sm font-medium text-[#1A2E2A]">{tenant.leaseStartDate}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Expiry Date</p>
                  <p className="text-sm font-medium text-[#1A2E2A]">{tenant.leaseEndDate}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Monthly Rent</p>
                  <p className="text-sm font-bold text-emerald-600">₹{tenant.monthlyRent.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white pt-3 px-5 pb-4 border-t border-[#E8F0EE] flex items-center justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-6 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">Close</button>
          <button onClick={() => onEdit && onEdit(tenant)} className="px-6 py-2.5 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-xl hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md shadow-[#00695C]/30 hover:scale-[1.02] flex items-center gap-2">
            <FiEdit className="text-sm" /> Edit
          </button>
        </div>
      </div>
    </div>
  );
};

// ============ PROPERTY ASSIGNMENT MODAL ============
const PropertyAssignmentModal = ({ company, show, onClose }) => {
  if (!show || !company) return null;

  // ---- Realistic dummy data pools ----
  const PROPERTY_POOL = [
    { name: 'Green Valley', type: 'Apartment' },
    { name: 'Lake View', type: 'Apartment' },
    { name: 'Royal Palm', type: 'Commercial' },
    { name: 'City Heights', type: 'Apartment' },
    { name: 'Garden Villa', type: 'Individual' },
    { name: 'Sunset Bay', type: 'Hostel' },
    { name: 'Palm Springs', type: 'Land & Plots' },
    { name: 'Ocean Breeze', type: 'Apartment' },
  ];
  const OWNER_NAMES = ['Michael Chen', 'Sarah Patel', 'James Wilson', 'Lisa Johnson', 'David Lee', 'Emma Watson'];
  const STAFF_POOL = [
    'Rajesh Kumar (Property Manager)',
    'Priya Sharma (Assistant Manager)',
    'Amit Patel (Leasing Agent)',
    'Sneha Reddy (Maintenance Coordinator)',
    'Vikram Singh (Administrator)',
    'Ananya Iyer (Property Manager)',
  ];

  // ---- Seed state ----
  const [assignments, setAssignments] = useState(() => {
    const count = Number(company.propertiesCount) || 0;
    return Array.from({ length: count }).map((_, i) => {
      const prop = PROPERTY_POOL[i % PROPERTY_POOL.length];
      const totalUnits = 20 + ((i * 7) % 80);
      const occupiedUnits = Math.max(1, Math.floor(totalUnits * (0.4 + (i % 5) * 0.1)));
      const availableUnits = totalUnits - occupiedUnits;
      const occupancyRate = Math.round((occupiedUnits / totalUnits) * 100);
      const assignmentDate = new Date(2023, (i % 12), 1 + (i % 27));
      const startDate = new Date(assignmentDate);
      startDate.setDate(startDate.getDate() + 7);
      const endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + 1);

      return {
        id: i + 1,
        assignmentId: `ASG-${1001 + i}`,
        propertyName: prop.name + (i >= PROPERTY_POOL.length ? ` ${Math.floor(i / PROPERTY_POOL.length) + 1}` : ''),
        propertyType: prop.type,
        ownerName: OWNER_NAMES[i % OWNER_NAMES.length],
        assignedStaff: STAFF_POOL[i % STAFF_POOL.length],
        assignmentDate: assignmentDate.toISOString().split('T')[0],
        agreementStartDate: startDate.toISOString().split('T')[0],
        agreementEndDate: endDate.toISOString().split('T')[0],
        totalUnits,
        occupiedUnits,
        availableUnits,
        occupancyRate,
        status: i % 5 === 0 && i !== 0 ? 'Inactive' : 'Active',
      };
    });
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAssignments, setFilteredAssignments] = useState(assignments);
  const [toast, setToast] = useState(null);
  const [viewingAssignment, setViewingAssignment] = useState(null);
  const [editingAssignment, setEditingAssignment] = useState(null);

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false, title: '', message: '', confirmText: 'Yes', cancelText: 'No',
    confirmColor: 'bg-red-500', icon: null, onConfirm: null
  });

  useEffect(() => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) {
      setFilteredAssignments(assignments);
      return;
    }
    setFilteredAssignments(
      assignments.filter(a =>
        a.assignmentId.toLowerCase().includes(q) ||
        a.propertyName.toLowerCase().includes(q) ||
        a.propertyType.toLowerCase().includes(q) ||
        a.ownerName.toLowerCase().includes(q) ||
        a.assignedStaff.toLowerCase().includes(q) ||
        a.status.toLowerCase().includes(q)
      )
    );
  }, [searchTerm, assignments]);

  const showToastMessage = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const closeConfirm = () => setConfirmModal(prev => ({ ...prev, isOpen: false }));

  // ---- Duplicate guard: only check against Active assignments (excluding self) ----
  const checkDuplicateActive = (propertyName, excludeId = null) => {
    return assignments.some(a =>
      a.id !== excludeId &&
      a.status === 'Active' &&
      a.propertyName.toLowerCase() === propertyName.trim().toLowerCase()
    );
  };

  // ---- Edit ----
  const handleEditAssignment = (updated) => {
    setAssignments(prev => prev.map(a => a.id === updated.id ? updated : a));
    setEditingAssignment(null);
    showToastMessage('Assignment updated successfully', 'success');
  };

  // ---- Toggle status ----
  const askToggleStatus = (a) => {
    const willActivate = a.status !== 'Active';
    if (willActivate && checkDuplicateActive(a.propertyName, a.id)) {
      showToastMessage(`Cannot activate: "${a.propertyName}" already has an active assignment`, 'error');
      return;
    }
    setConfirmModal({
      isOpen: true,
      title: willActivate ? 'Activate Assignment' : 'Deactivate Assignment',
      message: `Are you sure you want to ${willActivate ? 'activate' : 'deactivate'} the assignment for "${a.propertyName}" (${a.assignmentId})?`,
      confirmText: willActivate ? 'Yes, Activate' : 'Yes, Deactivate',
      cancelText: 'No',
      confirmColor: willActivate ? 'bg-emerald-500' : 'bg-amber-500',
      icon: willActivate ? <FiCheckCircle className="text-3xl text-emerald-500" /> : <FiXCircle className="text-3xl text-amber-500" />,
      onConfirm: () => {
        setAssignments(prev => prev.map(x => x.id === a.id ? { ...x, status: willActivate ? 'Active' : 'Inactive' } : x));
        showToastMessage(`Assignment ${willActivate ? 'activated' : 'deactivated'} successfully`, willActivate ? 'success' : 'warning');
        closeConfirm();
      },
    });
  };

  // ---- Remove (does NOT delete property / owner) ----
  const askDeleteAssignment = (a) => {
    setConfirmModal({
      isOpen: true,
      title: 'Remove Assignment',
      message: `Are you sure you want to remove the assignment for "${a.propertyName}" (${a.assignmentId})? The property and owner records will remain intact.`,
      confirmText: 'Yes, Remove',
      cancelText: 'No',
      confirmColor: 'bg-red-500',
      icon: <FiTrash2 className="text-3xl text-red-500" />,
      onConfirm: () => {
        setAssignments(prev => prev.filter(x => x.id !== a.id));
        showToastMessage('Assignment removed successfully', 'error');
        closeConfirm();
      },
    });
  };

  // ---- Stats ----
  const totalAssignments = assignments.length;
  const activeAssignments = assignments.filter(a => a.status === 'Active').length;
  const inactiveAssignments = assignments.filter(a => a.status === 'Inactive').length;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <Toast toast={toast} />

      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[88vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 rounded-t-2xl z-10 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
              <FiLink className="text-sm" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Property Assignments</h2>
              <p className="text-white/70 text-[10px]">{company.name} · {totalAssignments} assignments</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110">
            <FiX className="text-sm" />
          </button>
        </div>

        {/* Stats — Occupancy removed, 3 columns */}
        <div className="px-4 pt-3 shrink-0">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#F5F9F8] rounded-xl px-3 py-2 border border-[#E8F0EE]">
              <p className="text-[9px] uppercase tracking-wider text-[#5A7D78]">Total</p>
              <p className="text-sm font-bold text-[#1A2E2A]">{totalAssignments}</p>
            </div>
            <div className="bg-emerald-50 rounded-xl px-3 py-2 border border-emerald-100">
              <p className="text-[9px] uppercase tracking-wider text-emerald-700">Active</p>
              <p className="text-sm font-bold text-emerald-700">{activeAssignments}</p>
            </div>
            <div className="bg-gray-50 rounded-xl px-3 py-2 border border-gray-200">
              <p className="text-[9px] uppercase tracking-wider text-gray-600">Inactive</p>
              <p className="text-sm font-bold text-gray-700">{inactiveAssignments}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Search */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm" />
              <input
                type="text"
                placeholder="Search by assignment ID, property, owner, staff, type, or status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-9 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] hover:text-[#1A2E2A] transition-colors hover:scale-110">
                  <FiX className="text-sm" />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredAssignments.map((a) => (
              <div key={a.id} className="bg-[#F5F9F8] rounded-xl p-4 border-l-4 border-l-[#00695C] hover:shadow-md transition-all duration-300">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-[#1A2E2A] truncate">{a.propertyName}</h4>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#E8F4F2] text-[#00695C] font-medium">{a.assignmentId}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${a.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
                        {a.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#5A7D78] mt-0.5">
                      <span className="font-medium text-[#00695C]">{a.propertyType}</span>
                      <span className="mx-1.5 text-[#B5C9C5]">·</span>
                      Owner: {a.ownerName}
                    </p>
                    <p className="text-[11px] text-[#5A7D78] mt-0.5 truncate">
                      <FiUser className="inline text-[10px] text-[#00695C] mr-1" />
                      {a.assignedStaff}
                    </p>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-[#E8F0EE] grid grid-cols-3 gap-1 text-center">
                  <div>
                    <p className="text-[8px] uppercase tracking-wider text-[#5A7D78]">Total</p>
                    <p className="text-xs font-bold text-[#1A2E2A]">{a.totalUnits}</p>
                  </div>
                  <div>
                    <p className="text-[8px] uppercase tracking-wider text-[#5A7D78]">Occupied</p>
                    <p className="text-xs font-bold text-[#00695C]">{a.occupiedUnits}</p>
                  </div>
                  <div>
                    <p className="text-[8px] uppercase tracking-wider text-[#5A7D78]">Occupancy</p>
                    <p className={`text-xs font-bold ${a.occupancyRate >= 80 ? 'text-emerald-600' : a.occupancyRate >= 50 ? 'text-amber-600' : 'text-red-500'}`}>{a.occupancyRate}%</p>
                  </div>
                </div>

                <div className="mt-1 text-[10px] text-[#5A7D78] flex items-center gap-1">
                  <FiCalendar className="text-[10px] text-[#00695C]" />
                  {a.agreementStartDate} → {a.agreementEndDate}
                </div>

                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#E8F0EE]">
                  <button
                    onClick={() => setViewingAssignment(a)}
                    className="flex-1 py-1.5 text-xs font-medium text-[#5A7D78] bg-white rounded-lg hover:bg-[#E8F0EE] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 border border-[#E8F0EE]"
                  >
                    <FiEye className="text-[10px]" /> View
                  </button>
                  <button
                    onClick={() => setEditingAssignment(a)}
                    className="flex-1 py-1.5 text-xs font-medium text-[#00695C] bg-[#E8F4F2] rounded-lg hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                  >
                    <FiEdit className="text-[10px]" /> Edit
                  </button>
                  <button
                    onClick={() => askToggleStatus(a)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 ${a.status === 'Active' ? 'text-amber-600 bg-amber-50 hover:bg-amber-100' : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'}`}
                  >
                    {a.status === 'Active' ? <FiXCircle className="text-[10px]" /> : <FiCheckCircle className="text-[10px]" />}
                    {a.status === 'Active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => askDeleteAssignment(a)}
                    className="py-1.5 px-3 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                  >
                    <FiTrash2 className="text-[10px]" />
                  </button>
                </div>
              </div>
            ))}
            {filteredAssignments.length === 0 && (
              <div className="col-span-full text-center py-8 text-[#5A7D78]">
                {searchTerm ? 'No assignments match your search' : 'No assignments found'}
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white pt-3 px-4 pb-4 border-t border-[#E8F0EE] flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 bg-[#F5F9F8] text-[#1A2E2A] rounded-lg hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">Close</button>
        </div>
      </div>

      {/* Modals rendered outside parent to prevent clipping */}
      <AssignmentViewModal
        assignment={viewingAssignment}
        show={!!viewingAssignment}
        onClose={() => setViewingAssignment(null)}
        onEdit={(a) => { setViewingAssignment(null); setEditingAssignment(a); }}
      />

      <AssignmentFormModal
        show={!!editingAssignment}
        onClose={() => setEditingAssignment(null)}
        onSave={handleEditAssignment}
        assignment={editingAssignment}
        mode="edit"
        assignments={assignments}
        checkDuplicateActive={checkDuplicateActive}
      />

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirm}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        confirmColor={confirmModal.confirmColor}
        icon={confirmModal.icon}
      />
    </div>
  );
};

// ============ ASSIGNMENT FORM MODAL (EDIT ONLY) ============
const AssignmentFormModal = ({ show, onClose, onSave, assignment, mode = 'edit', assignments = [], checkDuplicateActive }) => {
  const [formData, setFormData] = useState({
    propertyName: '',
    propertyType: 'Apartment',
    ownerName: '',
    assignedStaff: '',
    assignmentDate: new Date().toISOString().split('T')[0],
    agreementStartDate: '',
    agreementEndDate: '',
    totalUnits: 0,
    occupiedUnits: 0,
    status: 'Active',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (show && assignment && mode === 'edit') {
      setFormData({
        propertyName: assignment.propertyName || '',
        propertyType: assignment.propertyType || 'Apartment',
        ownerName: assignment.ownerName || '',
        assignedStaff: assignment.assignedStaff || '',
        assignmentDate: assignment.assignmentDate || '',
        agreementStartDate: assignment.agreementStartDate || '',
        agreementEndDate: assignment.agreementEndDate || '',
        totalUnits: assignment.totalUnits || 0,
        occupiedUnits: assignment.occupiedUnits || 0,
        status: assignment.status || 'Active',
      });
    }
    setErrors({});
  }, [show, assignment, mode]);

  if (!show) return null;

  const propertyTypes = ['Individual', 'Apartment', 'Commercial', 'Land & Plots', 'Hostel'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.propertyName.trim()) newErrors.propertyName = 'Property name is required';
    if (!formData.ownerName.trim()) newErrors.ownerName = 'Owner name is required';
    if (!formData.assignedStaff.trim()) newErrors.assignedStaff = 'Assigned staff is required';

    if (!formData.assignmentDate) {
      newErrors.assignmentDate = 'Assignment date is required';
    } else if (new Date(formData.assignmentDate) > new Date()) {
      newErrors.assignmentDate = 'Assignment date cannot be in the future';
    }

    if (!formData.agreementStartDate) {
      newErrors.agreementStartDate = 'Start date is required';
    }
    if (!formData.agreementEndDate) {
      newErrors.agreementEndDate = 'End date is required';
    } else if (formData.agreementStartDate && new Date(formData.agreementEndDate) <= new Date(formData.agreementStartDate)) {
      newErrors.agreementEndDate = 'End date must be after start date';
    }

    if (formData.totalUnits === '' || Number(formData.totalUnits) <= 0) {
      newErrors.totalUnits = 'Total units must be greater than 0';
    }
    if (formData.occupiedUnits === '') {
      newErrors.occupiedUnits = 'Occupied units is required';
    } else if (Number(formData.occupiedUnits) < 0) {
      newErrors.occupiedUnits = 'Occupied units cannot be negative';
    } else if (Number(formData.occupiedUnits) > Number(formData.totalUnits)) {
      newErrors.occupiedUnits = 'Occupied units cannot exceed total units';
    }

    // Duplicate active assignment guard
    if (!newErrors.propertyName && formData.status === 'Active' && checkDuplicateActive) {
      const isDup = checkDuplicateActive(formData.propertyName, mode === 'edit' && assignment ? assignment.id : null);
      if (isDup) {
        newErrors.propertyName = 'An active assignment for this property already exists';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    const totalUnits = Number(formData.totalUnits);
    const occupiedUnits = Number(formData.occupiedUnits);
    const availableUnits = totalUnits - occupiedUnits;
    const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

    const payload = {
      ...formData,
      propertyName: formData.propertyName.trim(),
      ownerName: formData.ownerName.trim(),
      assignedStaff: formData.assignedStaff.trim(),
      totalUnits,
      occupiedUnits,
      availableUnits,
      occupancyRate,
      ...(mode === 'edit' && assignment ? { id: assignment.id, assignmentId: assignment.assignmentId } : {}),
    };

    setTimeout(() => {
      onSave(payload);
      setIsSubmitting(false);
    }, 400);
  };

  const inputClass = (field) =>
    `w-full px-3 py-1.5 bg-[#F5F9F8] rounded-lg border ${errors[field] ? 'border-red-400' : 'border-[#E8F0EE]'} focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none`;

  const availableUnits = Math.max(0, (Number(formData.totalUnits) || 0) - (Number(formData.occupiedUnits) || 0));
  const occupancyRate = Number(formData.totalUnits) > 0
    ? Math.round((Number(formData.occupiedUnits) / Number(formData.totalUnits)) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="flex items-center justify-between px-5 pt-4 pb-2 shrink-0 border-b border-[#E8F0EE]">
          <h3 className="text-base font-bold text-[#1A2E2A]">Edit Assignment</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#F5F9F8] transition-all duration-300 text-[#5A7D78] hover:scale-110">
            <FiX className="text-sm" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Property Name <span className="text-red-500">*</span></label>
                <input type="text" name="propertyName" value={formData.propertyName} onChange={handleChange} className={inputClass('propertyName')} placeholder="Green Valley" />
                {errors.propertyName && <p className="text-[10px] text-red-500 mt-0.5">{errors.propertyName}</p>}
              </div>
              <div>
                <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Property Type</label>
                <select name="propertyType" value={formData.propertyType} onChange={handleChange} className={inputClass('propertyType')}>
                  {propertyTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Owner Name <span className="text-red-500">*</span></label>
                <input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} className={inputClass('ownerName')} placeholder="Michael Chen" />
                {errors.ownerName && <p className="text-[10px] text-red-500 mt-0.5">{errors.ownerName}</p>}
              </div>
              <div>
                <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Assigned Staff / Manager <span className="text-red-500">*</span></label>
                <input type="text" name="assignedStaff" value={formData.assignedStaff} onChange={handleChange} className={inputClass('assignedStaff')} placeholder="Rajesh Kumar (Property Manager)" />
                {errors.assignedStaff && <p className="text-[10px] text-red-500 mt-0.5">{errors.assignedStaff}</p>}
              </div>
            </div>

            <div className="bg-[#F5F9F8] rounded-xl p-3 border border-[#E8F0EE] space-y-3">
              <h4 className="text-[10px] font-bold text-[#1A2E2A] uppercase tracking-wider">Agreement Dates</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Assignment Date <span className="text-red-500">*</span></label>
                  <input type="date" name="assignmentDate" value={formData.assignmentDate} onChange={handleChange} max={new Date().toISOString().split('T')[0]} className={inputClass('assignmentDate')} />
                  {errors.assignmentDate && <p className="text-[10px] text-red-500 mt-0.5">{errors.assignmentDate}</p>}
                </div>
                <div>
                  <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Start Date <span className="text-red-500">*</span></label>
                  <input type="date" name="agreementStartDate" value={formData.agreementStartDate} onChange={handleChange} className={inputClass('agreementStartDate')} />
                  {errors.agreementStartDate && <p className="text-[10px] text-red-500 mt-0.5">{errors.agreementStartDate}</p>}
                </div>
                <div>
                  <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">End Date <span className="text-red-500">*</span></label>
                  <input type="date" name="agreementEndDate" value={formData.agreementEndDate} onChange={handleChange} className={inputClass('agreementEndDate')} />
                  {errors.agreementEndDate && <p className="text-[10px] text-red-500 mt-0.5">{errors.agreementEndDate}</p>}
                </div>
              </div>
            </div>

            <div className="bg-[#F5F9F8] rounded-xl p-3 border border-[#E8F0EE] space-y-3">
              <h4 className="text-[10px] font-bold text-[#1A2E2A] uppercase tracking-wider">Unit Details</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Total Units <span className="text-red-500">*</span></label>
                  <input type="number" name="totalUnits" value={formData.totalUnits} onChange={handleChange} min="1" className={inputClass('totalUnits')} />
                  {errors.totalUnits && <p className="text-[10px] text-red-500 mt-0.5">{errors.totalUnits}</p>}
                </div>
                <div>
                  <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Occupied <span className="text-red-500">*</span></label>
                  <input type="number" name="occupiedUnits" value={formData.occupiedUnits} onChange={handleChange} min="0" className={inputClass('occupiedUnits')} />
                  {errors.occupiedUnits && <p className="text-[10px] text-red-500 mt-0.5">{errors.occupiedUnits}</p>}
                </div>
                <div>
                  <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Available</label>
                  <input type="text" value={availableUnits} readOnly className="w-full px-3 py-1.5 bg-[#E8F0EE] rounded-lg border border-[#E8F0EE] text-sm text-[#5A7D78] outline-none cursor-not-allowed" />
                </div>
                <div>
                  <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Occupancy</label>
                  <input type="text" value={`${occupancyRate}%`} readOnly className="w-full px-3 py-1.5 bg-[#E8F0EE] rounded-lg border border-[#E8F0EE] text-sm text-[#00695C] font-medium outline-none cursor-not-allowed" />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-medium text-[#5A7D78] block mb-0.5">Assignment Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className={inputClass('status')}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="px-5 py-3 border-t border-[#E8F0EE] flex items-center gap-3 shrink-0 bg-white">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-[#F5F9F8] text-[#1A2E2A] rounded-lg hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md shadow-[#00695C]/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isSubmitting ? <><FiRefreshCw className="animate-spin text-sm" /> Saving...</> : <><FiSave className="text-sm" /> Update</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============ ASSIGNMENT VIEW MODAL ============
const AssignmentViewModal = ({ assignment, show, onClose, onEdit }) => {
  if (!assignment || !show) return null;

  const statusBadge = assignment.status === 'Active'
    ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
    : 'bg-gray-100 text-gray-700 border-gray-200';

  const occupancyColor = assignment.occupancyRate >= 80
    ? 'text-emerald-600'
    : assignment.occupancyRate >= 50
    ? 'text-amber-600'
    : 'text-red-500';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
              <FiLink className="text-lg" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">Assignment Details</h2>
              <p className="text-white/80 text-[11px] tracking-wide mt-0.5">ID: {assignment.assignmentId}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110">
            <FiX className="text-base" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold text-[#1A2E2A] leading-tight">{assignment.propertyName}</h3>
              <p className="text-sm text-[#5A7D78] mt-0.5">{assignment.propertyType}</p>
            </div>
            <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold border ${statusBadge}`}>{assignment.status}</span>
          </div>

          <div className="bg-[#F5F9F8] rounded-xl p-4 border border-[#E8F0EE]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-2">
              <div>
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Owner</p>
                <div className="flex items-center gap-2 text-sm text-[#1A2E2A]">
                  <FiUser className="text-[#00695C] shrink-0" />
                  <span className="truncate">{assignment.ownerName}</span>
                </div>
              </div>
              <div>

                 <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Assignment Date</p>
                <div className="flex items-center gap-2 text-sm text-[#1A2E2A]">
                  <FiCalendar className="text-[#00695C] shrink-0" />
                  <span>{assignment.assignmentDate}</span>
                </div>
                
              </div>
              <div className="sm:col-span-2">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Assigned Staff</p>
                <div className="flex items-center gap-2 text-sm text-[#1A2E2A]">
                  <FiUserCheck className="text-[#00695C] shrink-0" />
                  <span className="truncate">{assignment.assignedStaff}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-bold text-[#5A7D78] uppercase tracking-wider mb-2">Agreement Period</h4>
            <div className="bg-white rounded-xl p-4 border border-[#E8F0EE] flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">Start</p>
                <p className="text-sm font-medium text-[#1A2E2A]">{assignment.agreementStartDate}</p>
              </div>
              <span className="text-[#B5C9C5] mx-2">→</span>
              <div className="text-right">
                <p className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider mb-1">End</p>
                <p className="text-sm font-medium text-[#1A2E2A]">{assignment.agreementEndDate}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-bold text-[#5A7D78] uppercase tracking-wider mb-2">Unit Summary</h4>
            <div className="grid grid-cols-4 gap-2">
              <div className="text-center p-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE]">
                <p className="text-lg font-bold text-[#1A2E2A]">{assignment.totalUnits}</p>
                <p className="text-[9px] uppercase tracking-wider text-[#5A7D78]">Total</p>
              </div>
              <div className="text-center p-2 bg-[#E8F4F2] rounded-xl border border-[#B5C9C5]/40">
                <p className="text-lg font-bold text-[#00695C]">{assignment.occupiedUnits}</p>
                <p className="text-[9px] uppercase tracking-wider text-[#5A7D78]">Occupied</p>
              </div>
              <div className="text-center p-2 bg-emerald-50 rounded-xl border border-emerald-100">
                <p className="text-lg font-bold text-emerald-700">{assignment.availableUnits}</p>
                <p className="text-[9px] uppercase tracking-wider text-emerald-700">Available</p>
              </div>
              <div className="text-center p-2 bg-white rounded-xl border border-[#E8F0EE]">
                <p className={`text-lg font-bold ${occupancyColor}`}>{assignment.occupancyRate}%</p>
                <p className="text-[9px] uppercase tracking-wider text-[#5A7D78]">Occupancy</p>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white pt-3 px-5 pb-4 border-t border-[#E8F0EE] flex items-center justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-6 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">Close</button>
          <button onClick={() => onEdit && onEdit(assignment)} className="px-6 py-2.5 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-xl hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md shadow-[#00695C]/30 hover:scale-[1.02] flex items-center gap-2">
            <FiEdit className="text-sm" /> Edit
          </button>
        </div>
      </div>
    </div>
  );
};

// ============ MAIN COMPONENT ============
const PropertyManagersCompanyManagement = () => {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [showStats, setShowStats] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [filterCount, setFilterCount] = useState(0);
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const [viewingCompany, setViewingCompany] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [staffCompany, setStaffCompany] = useState(null);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [ownerCompany, setOwnerCompany] = useState(null);
  const [showOwnerModal, setShowOwnerModal] = useState(false);
  const [tenantCompany, setTenantCompany] = useState(null);
  const [showTenantModal, setShowTenantModal] = useState(false);
  const [assignmentCompany, setAssignmentCompany] = useState(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);

  const searchInputRef = useRef(null);

  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false, title: '', message: '', confirmText: 'Yes', cancelText: 'No',
    confirmColor: 'bg-red-500', icon: <FiAlertTriangle className="text-4xl text-red-500" />,
    onConfirm: null, companyId: null, action: null,
  });

  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, rejected: 0 });

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  }, []);

  const generateMockCompanies = useCallback(() => {
    const companyNames = [
      'Prestige Property Management', 'Golden Gate Realty', 'Urban Nest Solutions',
      'Elite Estate Managers', 'Cityscape Properties', 'Royal Oak Management',
      'Silverline Real Estate', 'Heritage Property Services', 'Crestview Management',
      'Park Avenue Realty', 'Harbor Property Group', 'Skyline Management',
    ];

    const types = ['Individual', 'Apartment', 'Commercial', 'Land & Plots', 'Hostel'];
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur'];
    const domains = ['gmail.com', 'outlook.com', 'yahoo.com', 'company.in'];
    const statuses = ['active', 'active', 'active', 'inactive', 'rejected'];

    return companyNames.map((name, i) => {
      const type = types[i % types.length];
      const city = cities[i % cities.length];
      const status = statuses[i % statuses.length];
      const counts = getCountsForCompany(name);

      return {
        id: `company_${i + 1}`,
        name: name,
        type: type,
        location: `${city}, India`,
        email: `${name.toLowerCase().replace(/\s/g, '')}@${domains[i % domains.length]}`,
        phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        website: `https://${name.toLowerCase().replace(/\s/g, '')}.com`,
        description: `${type} company based in ${city} managing residential and commercial properties with a focus on customer satisfaction.`,
        isVerified: i % 2 === 0,
        status: status,
        staffCount: counts.staffCount,
        ownerCount: counts.ownerCount,
        tenantCount: counts.tenantCount,
        propertiesCount: counts.propertiesCount,
        registeredDate: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      };
    });
  }, []);

  useEffect(() => {
    const mockCompanies = generateMockCompanies();
    setCompanies(mockCompanies);
    setFilteredCompanies(mockCompanies);
    updateStats(mockCompanies);
  }, [generateMockCompanies]);

  const updateStats = useCallback((companiesList) => {
    setStats({
      total: companiesList.length,
      active: companiesList.filter(c => (c.status || 'active') === 'active').length,
      inactive: companiesList.filter(c => c.status === 'inactive').length,
      rejected: companiesList.filter(c => c.status === 'rejected').length,
    });
  }, []);

  useEffect(() => {
    updateStats(companies);
  }, [companies, updateStats]);

  const filterCompanies = useCallback(() => {
    let filtered = [...companies];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.location.toLowerCase().includes(query) ||
        c.type.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query)
      );
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(c => c.type.toLowerCase() === selectedType.toLowerCase());
    }

    if (activeFilter === 'verified') {
      filtered = filtered.filter(c => c.isVerified);
    } else if (activeFilter === 'active' || activeFilter === 'inactive' || activeFilter === 'rejected') {
      filtered = filtered.filter(c => (c.status || 'active') === activeFilter);
    }

    let count = 0;
    if (selectedType !== 'all') count++;
    if (searchQuery) count++;
    if (activeFilter !== 'all') count++;
    setFilterCount(count);

    filtered.sort((a, b) => {
      let aVal = a[sortField] || '';
      let bVal = b[sortField] || '';
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredCompanies(filtered);
    setCurrentPage(1);
  }, [companies, searchQuery, selectedType, sortField, sortDirection, activeFilter]);

  useEffect(() => {
    filterCompanies();
  }, [filterCompanies]);

  const totalPages = Math.ceil(filteredCompanies.length / pageSize);
  const paginatedCompanies = useMemo(() =>
    filteredCompanies.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  , [filteredCompanies, currentPage, pageSize]);

  const handleSort = useCallback((field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);

  const handleSelectAll = useCallback(() => {
    if (selectedCompanies.length === paginatedCompanies.length) {
      setSelectedCompanies([]);
    } else {
      setSelectedCompanies(paginatedCompanies.map(c => c.id));
    }
  }, [selectedCompanies, paginatedCompanies]);

  const handleSelectCompany = useCallback((companyId) => {
    setSelectedCompanies(prev =>
      prev.includes(companyId) ? prev.filter(id => id !== companyId) : [...prev, companyId]
    );
  }, []);

  const handleStatClick = useCallback((filter) => {
    setActiveFilter(filter);
    setSelectedType('all');
    setSearchQuery('');
    searchInputRef.current?.focus();
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedType('all');
    setActiveFilter('all');
    searchInputRef.current?.focus();
    showToast('All filters cleared', 'info');
  }, [showToast]);

  const showConfirmation = useCallback(({
    title, message, confirmText = 'Yes', cancelText = 'No',
    confirmColor = 'bg-red-500', icon = <FiAlertTriangle className="text-4xl text-red-500" />,
    onConfirm, companyId, action,
  }) => {
    setConfirmationModal({ isOpen: true, title, message, confirmText, cancelText, confirmColor, icon, onConfirm, companyId, action });
  }, []);

  const closeConfirmation = useCallback(() => {
    setConfirmationModal(prev => ({ ...prev, isOpen: false }));
  }, []);

  const handleConfirmAction = useCallback(async () => {
    const { onConfirm, companyId, action } = confirmationModal;
    if (onConfirm) {
      setActionLoading(`${action}_${companyId}`);
      await onConfirm(companyId);
      setActionLoading(null);
    }
    closeConfirmation();
  }, [confirmationModal, closeConfirmation]);

  const handleViewCompany = useCallback((company) => {
  const populatedCompany = {
    ...company,
    contactPerson: company.contactPerson || ['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Reddy'][company.name.length % 4],
    fullAddress: company.fullAddress || `${company.location} - 400001, India`,
    registeredDate: company.registeredDate || new Date(Date.now() - (company.name.length * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
    businessRegDetails: company.businessRegDetails || {
      regNumber: `REG-${company.id ? company.id.replace(/\D/g, '').padStart(5, '0') : '10245'}`,
    },
  };

  setCompanies(prev => prev.map(c => c.id === company.id ? populatedCompany : c));
  setFilteredCompanies(prev => prev.map(c => c.id === company.id ? populatedCompany : c));
  setViewingCompany(populatedCompany); 
  setShowViewModal(true); 
}, []);

  const handleEditCompany = useCallback((company) => { setEditingCompany(company); setShowEditModal(true); }, []);

  const handleSaveEdit = useCallback((updatedData) => {
    setActionLoading('edit');
    setTimeout(() => {
      setCompanies(prev => prev.map(c => c.id === editingCompany.id ? { ...c, ...updatedData } : c));
      setShowEditModal(false);
      setEditingCompany(null);
      setActionLoading(null);
      showToast('Company updated successfully!', 'success');
    }, 600);
  }, [editingCompany, showToast]);

  const handleRegisterCompany = useCallback((newData) => {
    setActionLoading('register');
    setTimeout(() => {
      const newCompany = {
        ...newData,
        status: newData.status || 'active',
        id: `company_${Date.now()}`,
        registeredDate: new Date().toISOString().split('T')[0],
        staffCount: Number(newData.staffCount) || DUMMY_COUNTS.staffCount,
        ownerCount: Number(newData.ownerCount) || DUMMY_COUNTS.ownerCount,
        tenantCount: Number(newData.tenantCount) || DUMMY_COUNTS.tenantCount,
        propertiesCount: Number(newData.propertiesCount) || DUMMY_COUNTS.propertiesCount,
      };
      setCompanies(prev => [...prev, newCompany]);
      setShowRegisterModal(false);
      setActionLoading(null);
      showToast('Company registered successfully!', 'success');
    }, 600);
  }, [showToast]);

  const handleDeleteCompany = useCallback((companyId) => {
    const company = companies.find(c => c.id === companyId);
    showConfirmation({
      title: 'Delete Company',
      message: `Are you sure you want to delete "${company?.name || 'this company'}"? This action cannot be undone.`,
      confirmText: 'Yes, Delete', cancelText: 'No', confirmColor: 'bg-red-500',
      icon: <FiTrash2 className="text-4xl text-red-500" />,
      onConfirm: (id) => new Promise((resolve) => {
        setActionLoading(`delete_${id}`);
        setTimeout(() => {
          setCompanies(prev => {
            const updated = prev.filter(c => c.id !== id);
            showToast('Company deleted successfully!', 'error');
            return updated;
          });
          setActionLoading(null);
          resolve();
        }, 600);
      }),
      companyId, action: 'delete',
    });
  }, [companies, showConfirmation, showToast]);

  const handleToggleVerify = useCallback((companyId) => {
    const company = companies.find(c => c.id === companyId);
    const isVerified = company?.isVerified;
    showConfirmation({
      title: isVerified ? 'Unverify Company' : 'Verify Company',
      message: isVerified ? `Are you sure you want to unverify "${company?.name}"? The verified badge will be removed.` : `Are you sure you want to verify "${company?.name}"? It will get a verified badge.`,
      confirmText: isVerified ? 'Yes, Unverify' : 'Yes, Verify',
      cancelText: 'No',
      confirmColor: isVerified ? 'bg-blue-500' : 'bg-emerald-500',
      icon: isVerified ? <FiXCircle className="text-4xl text-blue-500" /> : <FiShield className="text-4xl text-emerald-500" />,
      onConfirm: (id) => new Promise((resolve) => {
        setActionLoading(`verify_${id}`);
        setTimeout(() => {
          setCompanies(prev => prev.map(c => c.id === id ? { ...c, isVerified: !c.isVerified } : c));
          setActionLoading(null);
          showToast(`Company ${isVerified ? 'unverified' : 'verified'} successfully!`, 'success');
          resolve();
        }, 400);
      }),
      companyId, action: 'verify',
    });
  }, [companies, showConfirmation, showToast]);

  const handleToggleActive = useCallback((companyId) => {
    const company = companies.find(c => c.id === companyId);
    const isActive = (company?.status || 'active') === 'active';
    showConfirmation({
      title: isActive ? 'Deactivate Company' : 'Activate Company',
      message: isActive ? `Are you sure you want to deactivate "${company?.name}"? They will be marked inactive.` : `Are you sure you want to activate "${company?.name}"? They will be marked active.`,
      confirmText: isActive ? 'Yes, Deactivate' : 'Yes, Activate',
      cancelText: 'No',
      confirmColor: isActive ? 'bg-amber-500' : 'bg-emerald-500',
      icon: isActive ? <FiUserX className="text-4xl text-amber-500" /> : <FiUserCheck className="text-4xl text-emerald-500" />,
      onConfirm: (id) => new Promise((resolve) => {
        setActionLoading(`active_${id}`);
        setTimeout(() => {
          setCompanies(prev => prev.map(c => c.id === id ? { ...c, status: isActive ? 'inactive' : 'active' } : c));
          setActionLoading(null);
          showToast(`Company ${isActive ? 'deactivated' : 'activated'} successfully!`, isActive ? 'warning' : 'success');
          resolve();
        }, 400);
      }),
      companyId, action: 'active',
    });
  }, [companies, showConfirmation, showToast]);

  const handleViewStaff = useCallback((company) => { setStaffCompany(company); setShowStaffModal(true); }, []);
  const handleViewOwners = useCallback((company) => { setOwnerCompany(company); setShowOwnerModal(true); }, []);
  const handleViewTenants = useCallback((company) => { setTenantCompany(company); setShowTenantModal(true); }, []);
  const handleViewAssignments = useCallback((company) => { setAssignmentCompany(company); setShowAssignmentModal(true); }, []);

  const handleRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const mockCompanies = generateMockCompanies();
      setCompanies(mockCompanies);
      setFilteredCompanies(mockCompanies);
      setLoading(false);
      showToast('Data refreshed successfully', 'success');
    }, 1000);
  }, [generateMockCompanies, showToast]);

  const handleExportCompanies = useCallback(() => {
    const data = filteredCompanies.map(c => ({
      Name: c.name, Type: c.type, Location: c.location, Email: c.email, Phone: c.phone,
      Website: c.website || 'N/A', Status: c.status || 'active',
      Staff: c.staffCount, Owners: c.ownerCount, Tenants: c.tenantCount,
      Properties: c.propertiesCount || 0, Verified: c.isVerified ? 'Yes' : 'No',
      'Registered Date': c.registeredDate,
    }));
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `companies_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast(`${filteredCompanies.length} companies exported successfully`, 'success');
  }, [filteredCompanies, showToast]);

  return (
    <div className="space-y-6 p-4 lg:p-6 pb-24 bg-[#F8FAF9] min-h-full h-full overflow-y-auto custom-page-scroll relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-[#00695C]/5 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-[#26A69A]/5 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <Toast toast={toast} />

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={closeConfirmation}
        onConfirm={handleConfirmAction}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText={confirmationModal.confirmText}
        cancelText={confirmationModal.cancelText}
        confirmColor={confirmationModal.confirmColor}
        icon={confirmationModal.icon}
        loading={actionLoading !== null}
      />

      <ViewCompanyModal 
  company={viewingCompany} 
  show={showViewModal} 
  onClose={() => { setShowViewModal(false); setViewingCompany(null); }} 
  onEdit={(c) => { 
    setShowViewModal(false); 
    setViewingCompany(null); 
    setEditingCompany(c); 
    setShowEditModal(true); 
  }} 
/>
      <CompanyFormModal company={editingCompany} show={showEditModal} onClose={() => { setShowEditModal(false); setEditingCompany(null); }} onSave={handleSaveEdit} loading={actionLoading === 'edit'} mode="edit" />
      <CompanyFormModal show={showRegisterModal} onClose={() => setShowRegisterModal(false)} onSave={handleRegisterCompany} loading={actionLoading === 'register'} mode="register" />
      
      <StaffManagementModal company={staffCompany} show={showStaffModal} onClose={() => { setShowStaffModal(false); setStaffCompany(null); }} />
      <OwnerManagementModal company={ownerCompany} show={showOwnerModal} onClose={() => { setShowOwnerModal(false); setOwnerCompany(null); }} />
      <TenantManagementModal company={tenantCompany} show={showTenantModal} onClose={() => { setShowTenantModal(false); setTenantCompany(null); }} />
      <PropertyAssignmentModal company={assignmentCompany} show={showAssignmentModal} onClose={() => { setShowAssignmentModal(false); setAssignmentCompany(null); }} />

      {/* Header */}
      <div className="relative animate-fade-in">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                Company Management
              </h1>
              <span className="px-3 py-1 bg-[#E8F4F2] text-[#00695C] text-xs font-semibold rounded-full animate-pulse">
                {filteredCompanies.length} Companies
              </span>
              {filterCount > 0 && (
                <span className="px-3 py-1 bg-[#FEF3E2] text-amber-700 text-xs font-semibold rounded-full">
                  {filterCount} filters
                </span>
              )}
            </div>
            <p className="text-sm text-[#5A7D78] flex items-center gap-2 flex-wrap">
              <span>Manage companies, staff, owners, tenants & property assignments</span>
              <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
              <span className="text-[#00695C] font-medium">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </p>
          </div>
                   <div className="flex items-center gap-2 w-full lg:w-auto flex-wrap justify-start lg:justify-end">
            <button
              onClick={() => setShowStats(!showStats)}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-[#E8F0EE] rounded-xl hover:border-[#00695C]/30 hover:shadow-md transition-all duration-300 text-sm font-medium text-[#1A2E2A] hover:scale-105"
            >
              <FiActivity className={`text-sm transition-transform duration-300 ${showStats ? 'rotate-0' : 'rotate-180'}`} />
              <span className="hidden sm:inline">{showStats ? 'Hide Stats' : 'Show Stats'}</span>
            </button>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8F0EE] rounded-xl hover:border-[#00695C]/30 hover:shadow-md transition-all duration-300 text-sm font-medium text-[#1A2E2A] hover:scale-105 disabled:opacity-50"
            >
              <FiRefreshCw className={`text-sm ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{loading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            <button
              onClick={handleExportCompanies}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8F0EE] rounded-xl hover:border-[#00695C]/30 hover:shadow-md transition-all duration-300 text-sm font-medium text-[#1A2E2A] hover:scale-105"
            >
              <FiDownload className="text-sm" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      {showStats && (
        <div className="relative animate-slide-in">
          <div className="bg-white rounded-2xl p-4 border border-[#E8F0EE] shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard icon={<MdOutlineBusiness className="text-white text-sm" />} title="Total Companies" value={stats.total} color="bg-gradient-to-br from-[#00695C] to-[#26A69A]" delay={0} isActive={activeFilter === 'all'} onClick={() => handleStatClick('all')} />
              <StatCard icon={<FiUserCheck className="text-white text-sm" />} title="Active" value={stats.active} color="bg-gradient-to-br from-emerald-600 to-emerald-400" delay={50} isActive={activeFilter === 'active'} onClick={() => handleStatClick('active')} />
              <StatCard icon={<FiUserX className="text-white text-sm" />} title="Inactive" value={stats.inactive} color="bg-gradient-to-br from-gray-500 to-gray-400" delay={100} isActive={activeFilter === 'inactive'} onClick={() => handleStatClick('inactive')} />
              <StatCard icon={<FiXCircle className="text-white text-sm" />} title="Rejected" value={stats.rejected} color="bg-gradient-to-br from-red-600 to-red-400" delay={150} isActive={activeFilter === 'rejected'} onClick={() => handleStatClick('rejected')} />
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="relative bg-white rounded-2xl p-4 shadow-sm border border-[#E8F0EE] hover:shadow-md transition-all duration-300">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          <div className="flex-1 w-full lg:w-auto relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search companies by name, location, type, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none placeholder:text-[#B5C9C5]"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#5A7D78] hover:text-[#1A2E2A] transition-colors hover:scale-110">
                <FiX className="text-sm" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto flex-wrap">
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="appearance-none px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none cursor-pointer pr-10 hover:bg-[#E8F0EE]"
              >
                <option value="all">All Types</option>
                <option value="individual">Individual</option>
                <option value="apartment">Apartment</option>
                <option value="commercial">Commercial</option>
                <option value="land & plots">Land & Plots</option>
                <option value="hostel">Hostel</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm pointer-events-none" />
            </div>

            {filterCount > 0 && (
              <button onClick={clearAllFilters} className="px-3 py-2.5 bg-[#FEF3E2] text-amber-700 rounded-xl hover:bg-[#FEE6C5] transition-all duration-300 text-sm font-medium flex items-center gap-1 hover:scale-105">
                <FiX className="text-sm" /> Clear
              </button>
            )}

            <div className="flex items-center bg-[#F5F9F8] rounded-xl p-1 border border-[#E8F0EE]">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#00695C]' : 'text-[#5A7D78] hover:text-[#1A2E2A]'}`} title="Grid View">
                <FiGrid className="text-sm" />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${viewMode === 'list' ? 'bg-white shadow-sm text-[#00695C]' : 'text-[#5A7D78] hover:text-[#1A2E2A]'}`} title="List View">
                <FiList className="text-sm" />
              </button>
            </div>
          </div>
        </div>

        {selectedCompanies.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#E8F0EE] flex flex-wrap items-center justify-between gap-3 animate-slide-in">
            <span className="text-sm text-[#5A7D78]">
              <span className="font-semibold text-[#00695C]">{selectedCompanies.length}</span> company(s) selected
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setCompanies(prev => prev.map(c => selectedCompanies.includes(c.id) ? { ...c, isVerified: true } : c));
                  setSelectedCompanies([]);
                  showToast('Companies verified successfully', 'success');
                }}
                className="px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105"
              >
                <FiShield className="text-[10px]" /> Verify
              </button>
              <button
                onClick={() => {
                  setCompanies(prev => prev.map(c => selectedCompanies.includes(c.id) ? { ...c, isVerified: false } : c));
                  setSelectedCompanies([]);
                  showToast('Companies unverified successfully', 'warning');
                }}
                className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105"
              >
                <FiXCircle className="text-[10px]" /> Unverify
              </button>
              <button
                onClick={() => {
                  showConfirmation({
                    title: 'Delete Companies',
                    message: `Are you sure you want to delete ${selectedCompanies.length} selected company(s)? This action cannot be undone.`,
                    confirmText: 'Yes, Delete All', cancelText: 'No', confirmColor: 'bg-red-500',
                    icon: <FiTrash2 className="text-4xl text-red-500" />,
                    onConfirm: () => new Promise((resolve) => {
                      setActionLoading('bulk_delete');
                      setTimeout(() => {
                        setCompanies(prev => prev.filter(c => !selectedCompanies.includes(c.id)));
                        setSelectedCompanies([]);
                        setActionLoading(null);
                        showToast('Companies deleted successfully', 'error');
                        resolve();
                      }, 600);
                    }),
                    companyId: 'bulk', action: 'bulk_delete',
                  });
                }}
                className="px-4 py-1.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105"
              >
                <FiTrash2 className="text-[10px]" /> Delete
              </button>
              <button onClick={() => setSelectedCompanies([])} className="px-4 py-1.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-xs font-medium hover:scale-105">
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00695C]/20 border-t-[#00695C] rounded-full animate-spin" />
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {paginatedCompanies.map((company, index) => {
              const isSelected = selectedCompanies.includes(company.id);
              const status = company.status || 'active';
              const statusBadge = { active: 'bg-emerald-100 text-emerald-700', inactive: 'bg-gray-100 text-gray-700', rejected: 'bg-red-100 text-red-700' }[status];
              const typeStyle = getTypeStyle(company.type);

              return (
                <div
                  key={company.id}
                  className={`relative bg-white rounded-2xl border border-[#E8F0EE] ${typeStyle.accent} border-l-4 p-4 hover:shadow-xl hover:-translate-y-1 group animate-slide-in transition-all duration-500 ${isSelected ? 'ring-2 ring-[#00695C] shadow-lg' : ''}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" checked={isSelected} onChange={() => handleSelectCompany(company.id)}
                        className="w-4 h-4 shrink-0 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300" />
                      <div className="relative">
                        <div className={`w-9 h-9 rounded-2xl bg-gradient-to-br ${typeStyle.iconBg} flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
                          {React.cloneElement(typeStyle.icon, { className: 'text-white text-2xl' })}
                        </div>
                      </div>
                                            <div className="min-w-0">
                        <h3 className="font-semibold text-[#1A2E2A] text-sm break-words leading-tight pr-2">
                          {company.name}
                        </h3>
                        <div className="flex items-center gap-1 mt-1 flex-wrap">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ring-1 ${typeStyle.badge}`}>
                            {company.type}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${statusBadge}`}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                          {company.isVerified && (
                            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-emerald-100 text-emerald-600">
                              <FiShield className="text-[9px]" />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button onClick={() => handleViewCompany(company)} className="w-7 h-7 rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#00695C] hover:scale-110" title="View Details">
                      <FiEye className="text-sm" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiMapPin className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{company.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiMail className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{company.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiPhone className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{company.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiCalendar className="text-[#00695C] flex-shrink-0" />
                      <span>Registered: {company.registeredDate}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-1 mt-3 pt-3 border-t border-[#E8F0EE]">
                    <div className="text-center">
                      <p className="text-xs font-bold text-[#1A2E2A]">{company.staffCount}</p>
                      <p className="text-[8px] text-[#5A7D78] uppercase tracking-wider">Staff</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-[#1A2E2A]">{company.ownerCount}</p>
                      <p className="text-[8px] text-[#5A7D78] uppercase tracking-wider">Owners</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-[#00695C]">{company.tenantCount}</p>
                      <p className="text-[8px] text-[#5A7D78] uppercase tracking-wider">Tenants</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-[#1A2E2A]">{company.propertiesCount !== undefined ? company.propertiesCount : 0}</p>
                      <p className="text-[8px] text-[#5A7D78] uppercase tracking-wider">Properties</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-[#E8F0EE]">
                    <button onClick={() => handleViewStaff(company)} className="flex-1 py-1.5 text-[10px] font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105">
                      <FiUsers className="text-[10px]" /> Staff
                    </button>
                    <button onClick={() => handleViewOwners(company)} className="flex-1 py-1.5 text-[10px] font-medium text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105">
                      <FiUser className="text-[10px]" /> Owners
                    </button>
                    <button onClick={() => handleViewTenants(company)} className="flex-1 py-1.5 text-[10px] font-medium text-purple-600 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105">
                      <FiUsers className="text-[10px]" /> Tenants
                    </button>
                    <button onClick={() => handleViewAssignments(company)} className="flex-1 py-1.5 text-[10px] font-medium text-amber-600 bg-amber-50 rounded-xl hover:bg-amber-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105">
                      <FiLink className="text-[10px]" /> Assignments
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    <button onClick={() => handleViewCompany(company)} className="flex-1 py-1.5 text-[10px] font-medium text-[#5A7D78] bg-[#F5F9F8] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105">
                      <FiEye className="text-[10px]" /> View
                    </button>
                    <button onClick={() => handleEditCompany(company)} className="flex-1 py-1.5 text-[10px] font-medium text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105">
                      <FiEdit className="text-[10px]" /> Edit
                    </button>
                    <button
                      onClick={() => handleToggleActive(company.id)}
                      disabled={actionLoading === `active_${company.id}`}
                      className={`flex-1 py-1.5 text-[10px] font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50 ${status === 'active' ? 'text-amber-600 bg-amber-50 hover:bg-amber-100' : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'}`}
                    >
                      {actionLoading === `active_${company.id}` ? <FiRefreshCw className="text-[10px] animate-spin" /> : status === 'active' ? <FiUserX className="text-[10px]" /> : <FiUserCheck className="text-[10px]" />}
                      {status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-1">
                    <button
                      onClick={() => handleToggleVerify(company.id)}
                      disabled={actionLoading === `verify_${company.id}`}
                      className={`flex-1 py-1.5 text-[10px] font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50 ${company.isVerified ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' : 'text-cyan-600 bg-cyan-50 hover:bg-cyan-100'}`}
                    >
                      {actionLoading === `verify_${company.id}` ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiShield className="text-[10px]" />}
                      {company.isVerified ? 'Unverify' : 'Verify'}
                    </button>
                    <button
                      onClick={() => handleDeleteCompany(company.id)}
                      disabled={actionLoading === `delete_${company.id}`}
                      className="flex-1 py-1.5 text-[10px] font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 disabled:opacity-50"
                    >
                      {actionLoading === `delete_${company.id}` ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiTrash2 className="text-[10px]" />}
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (

          //list view
                   <div className="bg-white rounded-2xl border border-[#E8F0EE] shadow-sm overflow-hidden">
            {/* List Header */}
            <div className="grid grid-cols-14 gap-2 items-center px-4 py-3 bg-[#F5F9F8] border-b border-[#E8F0EE] text-[10px] sm:text-xs font-medium text-[#5A7D78] uppercase tracking-wider">
              <div className="col-span-1 flex items-center gap-2">
                <input type="checkbox" checked={selectedCompanies.length === paginatedCompanies.length && paginatedCompanies.length > 0} onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300" />
                <span>#</span>
              </div>
              <div className="col-span-3 cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('name')}>
                Company {sortField === 'name' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 text-center">Type</div>
              <div className="col-span-1">Location</div>
              <div className="col-span-1 text-center">Status</div>
              <div className="col-span-1 text-center cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('staffCount')}>
                Staff {sortField === 'staffCount' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 text-center cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('ownerCount')}>
                Owners {sortField === 'ownerCount' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 text-center cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('tenantCount')}>
                Tenants {sortField === 'tenantCount' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 text-center cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('propertiesCount')}>
                Props {sortField === 'propertiesCount' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
              <div className="col-span-1 text-center">Verified</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* List Items */}
            {paginatedCompanies.map((company, index) => {
              const isSelected = selectedCompanies.includes(company.id);
              const status = company.status || 'active';
              const statusBadge = { active: 'bg-emerald-100 text-emerald-700', inactive: 'bg-gray-100 text-gray-700', rejected: 'bg-red-100 text-red-700' }[status];
              const typeStyle = getTypeStyle(company.type);

              return (
                <div
                  key={company.id}
                  className={`grid grid-cols-14 gap-2 items-center py-3 px-4 border-b border-[#E8F0EE] ${typeStyle.accent} border-l-4 hover:bg-[#F5F9F8] transition-all duration-300 group relative ${isSelected ? 'bg-[#E8F4F2]' : ''}`}
                >
                  <div className="col-span-1 flex items-center gap-2">
                    <input type="checkbox" checked={isSelected} onChange={() => handleSelectCompany(company.id)}
                      className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300" />
                    <span className="text-xs text-[#5A7D78]">{index + 1}</span>
                  </div>

                  {/* Removed Icon, increased space, added min-w-0 to prevent overflow */}
                  <div className="col-span-3 min-w-0 pr-2">
                    <p className="font-semibold text-sm text-[#1A2E2A] truncate">{company.name}</p>
                    <p className="text-[10px] text-[#5A7D78] truncate">{company.email}</p>
                  </div>

                  <div className="col-span-1 flex justify-center">
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium ring-1 whitespace-nowrap ${typeStyle.badge}`}>{company.type}</span>
                  </div>

                  <div className="col-span-1 text-xs text-[#5A7D78] truncate pr-1">{company.location}</div>

                  <div className="col-span-1 text-center">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusBadge}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                  </div>

                  {/* Metrics: Staff, Owners, Tenants, Properties */}
                  <div className="col-span-1 text-center text-sm font-medium text-[#1A2E2A]">{company.staffCount}</div>
                  <div className="col-span-1 text-center text-sm font-medium text-[#1A2E2A]">{company.ownerCount}</div>
                  <div className="col-span-1 text-center text-sm font-medium text-[#00695C]">{company.tenantCount}</div>
                  <div className="col-span-1 text-center text-sm font-medium text-[#1A2E2A]">{company.propertiesCount || 0}</div>

                  <div className="col-span-1 flex justify-center">
                    {company.isVerified ? <FiShield className="text-emerald-500 text-sm" /> : <span className="text-[#B5C9C5] text-xs">-</span>}
                  </div>

                  {/* Actions area set to grid-cols-5 so they stack cleanly into 2 rows */}
                  <div className="col-span-2 grid grid-cols-5 gap-1 justify-items-center">
                    <button onClick={() => handleViewStaff(company)} className="p-1.5 rounded-lg hover:bg-blue-50 transition-all duration-300 text-blue-600 hover:scale-110" title="Staff">
                      <FiUsers className="text-sm" />
                    </button>
                    <button onClick={() => handleViewOwners(company)} className="p-1.5 rounded-lg hover:bg-indigo-50 transition-all duration-300 text-indigo-600 hover:scale-110" title="Owners">
                      <FiUser className="text-sm" />
                    </button>
                    <button onClick={() => handleViewTenants(company)} className="p-1.5 rounded-lg hover:bg-purple-50 transition-all duration-300 text-purple-600 hover:scale-110" title="Tenants">
                      <FiUsers className="text-sm" />
                    </button>
                    <button onClick={() => handleViewAssignments(company)} className="p-1.5 rounded-lg hover:bg-amber-50 transition-all duration-300 text-amber-600 hover:scale-110" title="Assignments">
                      <FiLink className="text-sm" />
                    </button>
                    <button onClick={() => handleViewCompany(company)} className="p-1.5 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 text-[#00695C] hover:scale-110" title="View">
                      <FiEye className="text-sm" />
                    </button>
                    
                    <button onClick={() => handleEditCompany(company)} className="p-1.5 rounded-lg hover:bg-[#E8F4F2] transition-all duration-300 text-[#00695C] hover:scale-110" title="Edit">
                      <FiEdit className="text-sm" />
                    </button>
                    <button
                      onClick={() => handleToggleActive(company.id)}
                      disabled={actionLoading === `active_${company.id}`}
                      className={`p-1.5 rounded-lg transition-all duration-300 hover:scale-110 disabled:opacity-50 ${status === 'active' ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
                      title={status === 'active' ? 'Deactivate' : 'Activate'}
                    >
                      {actionLoading === `active_${company.id}` ? <FiRefreshCw className="text-sm animate-spin" /> : status === 'active' ? <FiUserX className="text-sm" /> : <FiUserCheck className="text-sm" />}
                    </button>
                    <button
                      onClick={() => handleToggleVerify(company.id)}
                      disabled={actionLoading === `verify_${company.id}`}
                      className={`p-1.5 rounded-lg transition-all duration-300 hover:scale-110 disabled:opacity-50 ${company.isVerified ? 'text-blue-600 hover:bg-blue-50' : 'text-cyan-600 hover:bg-cyan-50'}`}
                      title={company.isVerified ? 'Unverify' : 'Verify'}
                    >
                      {actionLoading === `verify_${company.id}` ? <FiRefreshCw className="text-sm animate-spin" /> : <FiShield className="text-sm" />}
                    </button>
                    <button
                      onClick={() => handleDeleteCompany(company.id)}
                      disabled={actionLoading === `delete_${company.id}`}
                      className="p-1.5 rounded-lg hover:bg-red-50 transition-all duration-300 text-red-500 hover:scale-110 disabled:opacity-50"
                      title="Delete"
                    >
                      {actionLoading === `delete_${company.id}` ? <FiRefreshCw className="text-sm animate-spin" /> : <FiTrash2 className="text-sm" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {paginatedCompanies.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E8F0EE]">
            <div className="w-24 h-24 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4 animate-float">
              <MdOutlineBusiness className="text-4xl text-[#B5C9C5]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1A2E2A]">No companies found</h3>
            <p className="text-sm text-[#5A7D78] mt-1">
              {filterCount > 0 ? 'Try adjusting your search or filter criteria' : 'No companies match your current view'}
            </p>
            {filterCount > 0 && (
              <button onClick={clearAllFilters} className="mt-4 px-6 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#00695C]/30 hover:scale-105">
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between bg-white rounded-2xl px-4 py-3 border border-[#E8F0EE] shadow-sm gap-3">
          <div className="flex items-center gap-2 text-sm text-[#5A7D78] flex-wrap">
            <span>
              Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredCompanies.length)} of {filteredCompanies.length} companies
            </span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="ml-2 px-2 py-1 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] text-sm text-[#1A2E2A] outline-none focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}
              className="w-9 h-9 rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 flex items-center justify-center text-[#1A2E2A] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110">
              <FiChevronLeft className="text-sm" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) pageNum = i + 1;
              else if (currentPage <= 3) pageNum = i + 1;
              else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = currentPage - 2 + i;
              return (
                <button key={pageNum} onClick={() => setCurrentPage(pageNum)}
                  className={`w-9 h-9 rounded-xl transition-all duration-300 text-sm font-medium hover:scale-110 ${currentPage === pageNum ? 'bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white shadow-lg shadow-[#00695C]/30' : 'text-[#1A2E2A] hover:bg-[#F5F9F8]'}`}>
                  {pageNum}
                </button>
              );
            })}
            <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}
              className="w-9 h-9 rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 flex items-center justify-center text-[#1A2E2A] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110">
              <FiChevronRight className="text-sm" />
            </button>
          </div>
        </div>
      )}

      <div className="pb-5"/>

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(50px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes float-delayed { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(10px); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-slide-in { animation: slide-in 0.4s ease-out forwards; opacity: 0; }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .animate-pulse { animation: pulse 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default PropertyManagersCompanyManagement;