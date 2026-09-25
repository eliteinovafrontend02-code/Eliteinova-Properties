// src/components/dashboard/admin/LeadManagement.jsx

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
  FiAward, FiBriefcase, FiTarget, FiPieChart, FiCopy,
  FiMessageSquare, FiSend, FiCheck, FiChevronUp,
  FiUserPlus, FiPhoneCall, FiEdit2, FiTrash, FiFlag,
  FiBookmark, FiHeart, FiThumbsUp, FiThumbsDown, FiShare2,
  FiPrinter, FiFolder, FiArchive, FiInbox,
  FiNavigation, FiCompass, FiCrosshair,
  FiCreditCard, FiPercent, FiTrendingDown, FiBarChart,
  FiZap
} from 'react-icons/fi';
import {
  FaStar as FaStarSolid,
  FaCheck, FaTimes, FaBuilding,
  FaHome, FaBed, FaBath, FaRulerCombined,
  FaParking, FaWifi, FaSwimmingPool, FaSnowflake,
  FaFire, FaShieldAlt, FaCrown, FaMedal,
  FaUserCircle, FaStore, FaUserTie, FaUserGraduate,
  FaWhatsapp, FaSms, FaPhone, FaEnvelope,
  FaMapMarkerAlt, FaCalendarAlt, FaClock,
  FaChevronDown, FaChevronUp, FaFilter,
  FaSort, FaSortUp, FaSortDown, FaEye,
  FaEdit, FaTrash, FaCopy, FaExternalLinkAlt,
  FaCheckCircle, FaTimesCircle, FaExclamationCircle,
  FaInfoCircle, FaUserPlus, FaUserMinus,
  FaHandshake, FaChartLine, FaChartBar, FaChartPie,
  FaFileAlt, FaFilePdf, FaFileExcel, FaFileCsv,
  FaPrint, FaShare, FaBookmark, FaHeart,
  FaThumbsUp, FaThumbsDown, FaStar, FaRegStar,
  FaRegClock, FaRegCalendar, FaRegUser,
  FaRegEnvelope, FaRegBuilding, FaRegMap,
  FaRupeeSign
} from 'react-icons/fa';
import { MdOutlineRealEstateAgent, MdApartment, MdOutlineBusiness, MdOutlineLeaderboard } from 'react-icons/md';
import { HiOutlineUserGroup, HiOutlineOfficeBuilding, HiOutlineHome, HiOutlineUserCircle } from 'react-icons/hi';

// ============ CONSTANTS ============
const USER_TYPES = ['owner', 'agent', 'builder', 'property manager'];

const PREFERRED_CONTACT_METHODS = [
  'Phone Call', 'WhatsApp', 'Email', 'SMS', 'Meeting', 'Site Visit'
];

const ENQUIRY_TYPES = [
  'Buy Enquiry', 'Rent Enquiry', 'Lease Enquiry', 'Property Listing Enquiry',
  'Property Contact Request', 'Site Visit Request', 'Property Information Request',
  'Price Enquiry', 'Loan Enquiry', 'Home Construction Enquiry',
  'Land Purchase Enquiry', 'Property Management Enquiry', 'Other Service Enquiry'
];

const LISTING_TYPES = ['Buy', 'Rent', 'Sell', 'Lease'];

const PROPERTY_TYPES = ['Individual', 'Apartment', 'Commercial', 'Land & Plots', 'Hostel'];

const LEAD_SOURCES = [
  'Website', 'Mobile App', 'Property Listing', 'Search', 'Advertisement',
  'Google', 'Facebook', 'Instagram', 'WhatsApp', 'Referral',
  'Owner', 'Agent', 'Builder', 'Property Manager', 'Direct Enquiry', 'Other'
];

const LEAD_STATUSES = [
  'New', 'Contacted', 'Interested', 'Follow-Up', 'Site Visit Scheduled',
  'Site Visit Completed', 'Negotiation', 'Converted', 'Not Interested',
  'Lost', 'Invalid Lead', 'Duplicate Lead'
];

const LEAD_PRIORITIES = ['Hot', 'Warm', 'Cold'];

const FURNISHING_OPTIONS = ['Unfurnished', 'Semi-Furnished', 'Fully Furnished'];

const FACING_OPTIONS = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'];

const AMENITIES_LIST = [
  'WiFi', 'Swimming Pool', 'AC', 'Parking', 'Gym', 'Security',
  'CCTV', 'Garden', 'Lift', 'Power Backup', 'Water Supply', 'Gas Pipeline',
  'Clubhouse', 'Play Area', 'Jogging Track', 'Indoor Games', 'Intercom', 'Fire Safety'
];

const STAFF_MEMBERS = [
  { id: 'lead_1', name: 'Suresh Kumar', role: 'Senior Agent', email: 'suresh.kumar@realestate.com', phone: '+91 98765 11111', avatar: 'SK', activeLeads: 12 },
  { id: 'lead_2', name: 'Anita Desai', role: 'Property Manager', email: 'anita.desai@realestate.com', phone: '+91 98765 22222', avatar: 'AD', activeLeads: 8 },
  { id: 'lead_3', name: 'Rajesh Nair', role: 'Sales Executive', email: 'rajesh.nair@realestate.com', phone: '+91 98765 33333', avatar: 'RN', activeLeads: 15 },
  { id: 'lead_4', name: 'Kavita Sharma', role: 'Lead Manager', email: 'kavita.sharma@realestate.com', phone: '+91 98765 44444', avatar: 'KS', activeLeads: 6 },
  { id: 'lead_5', name: 'Mohan Rao', role: 'Senior Agent', email: 'mohan.rao@realestate.com', phone: '+91 98765 55555', avatar: 'MR', activeLeads: 10 },
];

const STATUS_COLORS = {
  'New': 'bg-blue-100 text-blue-700 border-blue-200',
  'Contacted': 'bg-purple-100 text-purple-700 border-purple-200',
  'Interested': 'bg-cyan-100 text-cyan-700 border-cyan-200',
  'Follow-Up': 'bg-amber-100 text-amber-700 border-amber-200',
  'Site Visit Scheduled': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'Site Visit Completed': 'bg-teal-100 text-teal-700 border-teal-200',
  'Negotiation': 'bg-orange-100 text-orange-700 border-orange-200',
  'Converted': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Not Interested': 'bg-gray-100 text-gray-700 border-gray-200',
  'Lost': 'bg-red-100 text-red-700 border-red-200',
  'Invalid Lead': 'bg-rose-100 text-rose-700 border-rose-200',
  'Duplicate Lead': 'bg-slate-100 text-slate-700 border-slate-200'
};

const STATUS_BORDER = {
  'New': 'border-l-blue-500',
  'Contacted': 'border-l-purple-500',
  'Interested': 'border-l-cyan-500',
  'Follow-Up': 'border-l-amber-500',
  'Site Visit Scheduled': 'border-l-indigo-500',
  'Site Visit Completed': 'border-l-teal-500',
  'Negotiation': 'border-l-orange-500',
  'Converted': 'border-l-emerald-500',
  'Not Interested': 'border-l-gray-400',
  'Lost': 'border-l-red-500',
  'Invalid Lead': 'border-l-rose-500',
  'Duplicate Lead': 'border-l-slate-400'
};

const PRIORITY_COLORS = {
  'Hot': 'bg-red-100 text-red-700 border-red-200',
  'Warm': 'bg-amber-100 text-amber-700 border-amber-200',
  'Cold': 'bg-blue-100 text-blue-700 border-blue-200'
};

const PRIORITY_ICONS = {
  'Hot': <FaFire className="text-red-500" />,
  'Warm': <FaClock className="text-amber-500" />,
  'Cold': <FaSnowflake className="text-blue-500" />
};

const USER_TYPE_ICONS = {
  'owner': <HiOutlineHome className="text-emerald-600" />,
  'agent': <HiOutlineUserCircle className="text-blue-600" />,
  'builder': <HiOutlineOfficeBuilding className="text-purple-600" />,
  'property manager': <HiOutlineUserGroup className="text-amber-600" />
};

const USER_TYPE_COLORS = {
  'owner': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'agent': 'bg-blue-100 text-blue-700 border-blue-200',
  'builder': 'bg-purple-100 text-purple-700 border-purple-200',
  'property manager': 'bg-amber-100 text-amber-700 border-amber-200'
};

const SOURCE_COLORS = {
  'Website': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'Mobile App': 'bg-violet-100 text-violet-700 border-violet-200',
  'Property Listing': 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200',
  'Search': 'bg-sky-100 text-sky-700 border-sky-200',
  'Advertisement': 'bg-pink-100 text-pink-700 border-pink-200',
  'Google': 'bg-red-100 text-red-700 border-red-200',
  'Facebook': 'bg-blue-100 text-blue-700 border-blue-200',
  'Instagram': 'bg-rose-100 text-rose-700 border-rose-200',
  'WhatsApp': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Referral': 'bg-lime-100 text-lime-700 border-lime-200',
  'Owner': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Agent': 'bg-blue-100 text-blue-700 border-blue-200',
  'Builder': 'bg-purple-100 text-purple-700 border-purple-200',
  'Property Manager': 'bg-amber-100 text-amber-700 border-amber-200',
  'Direct Enquiry': 'bg-teal-100 text-teal-700 border-teal-200',
  'Other': 'bg-gray-100 text-gray-700 border-gray-200'
};

const ENQUIRY_COLORS = {
  'Buy Enquiry': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Rent Enquiry': 'bg-blue-100 text-blue-700 border-blue-200',
  'Lease Enquiry': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'Property Listing Enquiry': 'bg-purple-100 text-purple-700 border-purple-200',
  'Property Contact Request': 'bg-pink-100 text-pink-700 border-pink-200',
  'Site Visit Request': 'bg-amber-100 text-amber-700 border-amber-200',
  'Property Information Request': 'bg-cyan-100 text-cyan-700 border-cyan-200',
  'Price Enquiry': 'bg-orange-100 text-orange-700 border-orange-200',
  'Loan Enquiry': 'bg-teal-100 text-teal-700 border-teal-200',
  'Home Construction Enquiry': 'bg-lime-100 text-lime-700 border-lime-200',
  'Land Purchase Enquiry': 'bg-green-100 text-green-700 border-green-200',
  'Property Management Enquiry': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Other Service Enquiry': 'bg-gray-100 text-gray-700 border-gray-200'
};

// ============ TOAST COMPONENT ============
const Toast = ({ toast }) => {
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
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
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
      className={`bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-500 border group cursor-pointer transform hover:-translate-y-1 ${isActive ? 'ring-2 ring-[#00695C] shadow-lg bg-[#F5F9F8]' : 'border-[#E8F0EE]'}`}
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

// Tiny deterministic PRNG
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

// ============ VIEW LEAD DETAILS MODAL ============
const ViewLeadDetailsModal = ({ lead, show, onClose, onEdit, onDelete, onViewProperties }) => {
  if (!lead || !show) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 rounded-t-2xl z-10 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
              <FiEye className="text-sm" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Lead Details</h2>
              <p className="text-white/70 text-[10px]">Complete lead information</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-sm" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-white">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono bg-[#F5F9F8] px-2 py-1 rounded-lg text-[#5A7D78]">
                  {lead.leadId || `LEAD-${lead.id}`}
                </span>
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${STATUS_COLORS[lead.leadStatus] || 'bg-gray-100 text-gray-700'}`}>
                  {lead.leadStatus}
                </span>
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold flex items-center gap-1 ${PRIORITY_COLORS[lead.leadPriority] || 'bg-gray-100 text-gray-700'}`}>
                  {PRIORITY_ICONS[lead.leadPriority]}
                  {lead.leadPriority}
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#1A2E2A]">{lead.customerName}</h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold flex items-center gap-1 ${USER_TYPE_COLORS[lead.userType] || 'bg-gray-100 text-gray-700'}`}>
                  {USER_TYPE_ICONS[lead.userType]}
                  {lead.userType?.charAt(0).toUpperCase() + lead.userType?.slice(1)}
                </span>
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${SOURCE_COLORS[lead.leadSource] || 'bg-gray-100 text-gray-700'}`}>
                  {lead.leadSource}
                </span>
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${ENQUIRY_COLORS[lead.enquiryType] || 'bg-gray-100 text-gray-700'}`}>
                  {lead.enquiryType}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit && onEdit(lead)}
                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all duration-300 text-sm font-medium flex items-center gap-2 hover:scale-105"
              >
                <FiEdit className="text-sm" /> Edit
              </button>
              <button
                onClick={() => onDelete && onDelete(lead.id)}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all duration-300 text-sm font-medium flex items-center gap-2 hover:scale-105"
              >
                <FiTrash2 className="text-sm" /> Delete
              </button>
            </div>
          </div>

          <div className="bg-[#F5F9F8] rounded-xl p-4">
            <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
              <FiUser className="text-[#00695C]" /> Contact Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <FiPhone className="text-[#00695C] shrink-0" />
                <span className="text-[#5A7D78]">Mobile:</span>
                <span className="font-medium text-[#1A2E2A]">{lead.mobileNumber || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FiMail className="text-[#00695C] shrink-0" />
                <span className="text-[#5A7D78]">Email:</span>
                <span className="font-medium text-[#1A2E2A] truncate">{lead.emailAddress || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FiMessageSquare className="text-[#00695C] shrink-0" />
                <span className="text-[#5A7D78]">Preferred Contact:</span>
                <span className="font-medium text-[#1A2E2A]">{lead.preferredContactMethod || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FiUser className="text-[#00695C] shrink-0" />
                <span className="text-[#5A7D78]">User Type:</span>
                <span className="font-medium text-[#1A2E2A]">{lead.userType?.charAt(0).toUpperCase() + lead.userType?.slice(1) || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* ✅ PROPERTIES SECTION - Only shows count with View Properties button */}
          <div className="bg-[#F5F9F8] rounded-xl p-4">
            <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
              <FiHome className="text-[#00695C]" /> Properties
            </h4>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white">
                  <FiHome className="text-lg" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1A2E2A]">
                    {lead.properties?.length || 0} Properties Linked
                  </p>
                  <p className="text-xs text-[#5A7D78]">
                    Click to view all property details & requirements
                  </p>
                </div>
              </div>
              <button
                onClick={() => onViewProperties && onViewProperties(lead)}
                className="px-4 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-xl hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md shadow-[#00695C]/30 hover:scale-105 flex items-center gap-2"
              >
                <FiEye className="text-sm" />
                View Properties
              </button>
            </div>
          </div>

          <div className="bg-[#F5F9F8] rounded-xl p-4">
            <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
              <FiUser className="text-[#00695C]" /> Property Owner Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <FiUser className="text-[#00695C] shrink-0" />
                <span className="text-[#5A7D78]">Owner Name:</span>
                <span className="font-medium text-[#1A2E2A]">{lead.propertyOwnerName || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FiPhone className="text-[#00695C] shrink-0" />
                <span className="text-[#5A7D78]">Owner Contact:</span>
                <span className="font-medium text-[#1A2E2A]">{lead.propertyOwnerContact || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#F5F9F8] rounded-xl p-4">
            <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
              <FiShare2 className="text-[#00695C]" /> Lead Source & Assignment
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[#5A7D78]">Enquiry Type:</span>
                <span className="font-medium text-[#1A2E2A]">{lead.enquiryType || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[#5A7D78]">Lead Source:</span>
                <span className="font-medium text-[#1A2E2A]">{lead.leadSource || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FiUserCheck className="text-[#00695C] shrink-0" />
                <span className="text-[#5A7D78]">Assigned Lead:</span>
                <span className="font-medium text-[#1A2E2A]">{lead.assignedStaff || 'Unassigned'}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#F5F9F8] rounded-xl p-4">
            <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
              <FiCalendar className="text-[#00695C]" /> Important Dates
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <FiCalendar className="text-[#00695C] shrink-0" />
                <span className="text-[#5A7D78]">Created:</span>
                <span className="font-medium text-[#1A2E2A]">{formatDate(lead.createdDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FiClock className="text-[#00695C] shrink-0" />
                <span className="text-[#5A7D78]">Last Contacted:</span>
                <span className="font-medium text-[#1A2E2A]">{formatDateTime(lead.lastContacted)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FiCalendar className="text-[#00695C] shrink-0" />
                <span className="text-[#5A7D78]">Next Follow-Up:</span>
                <span className="font-medium text-[#1A2E2A]">{formatDate(lead.nextFollowUp)}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#F5F9F8] rounded-xl p-4">
            <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
              <FiFileText className="text-[#00695C]" /> Notes
            </h4>
            <p className="text-sm text-[#5A7D78] leading-relaxed">
              {lead.notes || 'No notes available.'}
            </p>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white pt-3 px-4 pb-4 border-t border-[#E8F0EE] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit && onEdit(lead)}
              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all duration-300 text-sm font-medium flex items-center gap-2"
            >
              <FiEdit className="text-sm" /> Edit Lead
            </button>
            <button
              onClick={() => onDelete && onDelete(lead.id)}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-300 text-sm font-medium flex items-center gap-2"
            >
              <FiTrash2 className="text-sm" /> Delete
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md shadow-[#00695C]/30 hover:scale-[1.02]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ============ EDIT LEAD MODAL ============
const EditLeadModal = ({ lead, show, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (lead && show) {
      setFormData({
        customerName: lead.customerName || '',
        mobileNumber: lead.mobileNumber || '',
        emailAddress: lead.emailAddress || '',
        userType: lead.userType || 'owner',
        preferredContactMethod: lead.preferredContactMethod || 'Phone Call',
        propertyOwnerName: lead.propertyOwnerName || '',
        propertyOwnerContact: lead.propertyOwnerContact || '',
        enquiryType: lead.enquiryType || 'Buy Enquiry',
        listingType: lead.listingType || 'Buy',
        minBudget: lead.minBudget || '',
        maxBudget: lead.maxBudget || '',
        preferredLocation: lead.preferredLocation || '',
        propertyType: lead.propertyType || 'Apartment',
        leadSource: lead.leadSource || 'Website',
        leadStatus: lead.leadStatus || 'New',
        leadPriority: lead.leadPriority || 'Warm',
        assignedStaff: lead.assignedStaff || '',
        createdDate: lead.createdDate ? lead.createdDate.split('T')[0] : new Date().toISOString().split('T')[0],
        lastContacted: lead.lastContacted ? lead.lastContacted.split('T')[0] : '',
        nextFollowUp: lead.nextFollowUp ? lead.nextFollowUp.split('T')[0] : '',
        notes: lead.notes || '',
        purpose: lead.purpose || '',
        preferredState: lead.preferredState || '',
        preferredCity: lead.preferredCity || '',
        preferredArea: lead.preferredArea || '',
        minArea: lead.minArea || '',
        maxArea: lead.maxArea || '',
        bedrooms: lead.bedrooms || '',
        bathrooms: lead.bathrooms || '',
        furnishing: lead.furnishing || 'Unfurnished',
        preferredFacing: lead.preferredFacing || '',
        requiredAmenities: lead.requiredAmenities || [],
      });
      setErrors({});
    }
  }, [lead, show]);

  if (!lead || !show || !formData) return null;

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

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      requiredAmenities: prev.requiredAmenities.includes(amenity)
        ? prev.requiredAmenities.filter(a => a !== amenity)
        : [...prev.requiredAmenities, amenity]
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.customerName.trim()) newErrors.customerName = 'Customer name is required';
    if (!formData.mobileNumber.trim()) newErrors.mobileNumber = 'Mobile number is required';
    if (formData.emailAddress && !/\S+@\S+\.\S+/.test(formData.emailAddress)) {
      newErrors.emailAddress = 'Invalid email format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const updatedData = {
      ...formData,
      minBudget: formData.minBudget ? Number(formData.minBudget) : null,
      maxBudget: formData.maxBudget ? Number(formData.maxBudget) : null,
      minArea: formData.minArea ? Number(formData.minArea) : null,
      maxArea: formData.maxArea ? Number(formData.maxArea) : null,
      bedrooms: formData.bedrooms ? Number(formData.bedrooms) : null,
      bathrooms: formData.bathrooms ? Number(formData.bathrooms) : null,
    };

    setTimeout(() => {
      onSave(updatedData);
      setIsSubmitting(false);
    }, 600);
  };

  const inputClass = "w-full px-3 py-2 bg-white rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none text-[#1A2E2A]";
  const labelClass = "text-[13px] font-medium text-[#024840] block mb-1";

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 rounded-t-2xl z-10 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
              <FiEdit className="text-sm" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Edit Lead</h2>
              <p className="text-white/70 text-[10px]">Update lead information</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-sm" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5 bg-white">

          {/* ===== Contact Information ===== */}
          <div className="bg-[#F5F9F8] rounded-xl p-4">
            <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
              <FiUser className="text-[#00695C]" /> Contact Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text" name="customerName" value={formData.customerName} onChange={handleChange}
                  className={`${inputClass} ${errors.customerName ? 'border-red-400' : ''}`}
                />
                {errors.customerName && <p className="text-[10px] text-red-500 mt-1">{errors.customerName}</p>}
              </div>
              <div>
                <label className={labelClass}>
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange}
                  className={`${inputClass} ${errors.mobileNumber ? 'border-red-400' : ''}`}
                />
                {errors.mobileNumber && <p className="text-[10px] text-red-500 mt-1">{errors.mobileNumber}</p>}
              </div>
              <div>
                <label className={labelClass}>Email Address</label>
                <input
                  type="email" name="emailAddress" value={formData.emailAddress} onChange={handleChange}
                  className={`${inputClass} ${errors.emailAddress ? 'border-red-400' : ''}`}
                />
                {errors.emailAddress && <p className="text-[10px] text-red-500 mt-1">{errors.emailAddress}</p>}
              </div>
              <div>
                <label className={labelClass}>Preferred Contact Method</label>
                <select name="preferredContactMethod" value={formData.preferredContactMethod} onChange={handleChange} className={inputClass}>
                  {PREFERRED_CONTACT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>User Type</label>
                <select name="userType" value={formData.userType} onChange={handleChange} className={inputClass}>
                  {USER_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* ===== Property Owner Details ===== */}
          <div className="bg-[#F5F9F8] rounded-xl p-4">
            <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
              <FiUser className="text-[#00695C]" /> Property Owner Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Owner Name</label>
                <input
                  type="text" name="propertyOwnerName" value={formData.propertyOwnerName} onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Owner Contact</label>
                <input
                  type="text" name="propertyOwnerContact" value={formData.propertyOwnerContact} onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
     
          {/* ===== Lead Source & Assignment ===== */}
          <div className="bg-[#F5F9F8] rounded-xl p-4">
            <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
              <FiShare2 className="text-[#00695C]" /> Lead Source & Assignment
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Lead Source</label>
                <select name="leadSource" value={formData.leadSource} onChange={handleChange} className={inputClass}>
                  {LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Lead Status</label>
                <select name="leadStatus" value={formData.leadStatus} onChange={handleChange} className={inputClass}>
                  {LEAD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Lead Priority</label>
                <select name="leadPriority" value={formData.leadPriority} onChange={handleChange} className={inputClass}>
                  {LEAD_PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Assigned Lead</label>
                <input
                  type="text" name="assignedLead" value={formData.assignedStaff} onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* ===== Important Dates ===== */}
          <div className="bg-[#F5F9F8] rounded-xl p-4">
            <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
              <FiCalendar className="text-[#00695C]" /> Important Dates
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className={labelClass}>Created Date</label>
                <input type="date" name="createdDate" value={formData.createdDate} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Last Contacted</label>
                <input type="date" name="lastContacted" value={formData.lastContacted} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Next Follow-Up</label>
                <input type="date" name="nextFollowUp" value={formData.nextFollowUp} onChange={handleChange} className={inputClass} />
              </div>
            </div>
          </div>

          {/* ===== Notes ===== */}
          <div className="bg-[#F5F9F8] rounded-xl p-4">
            <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
              <FiFileText className="text-[#00695C]" /> Notes
            </h4>
            <textarea
              name="notes" value={formData.notes} onChange={handleChange}
              rows="4"
              className={`${inputClass} resize-none`}
              placeholder="Add any additional notes about this lead..."
            />
          </div>

        </form>

        <div className="sticky bottom-0 bg-white pt-3 px-4 pb-4 border-t border-[#E8F0EE] flex items-center justify-end gap-3">
          <button
            type="button" onClick={onClose}
            className="px-6 py-2 bg-[#F5F9F8] text-[#1A2E2A] rounded-lg hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="submit" disabled={isSubmitting || loading}
            onClick={handleSubmit}
            className="px-6 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md shadow-[#00695C]/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting || loading ? (
              <><FiRefreshCw className="animate-spin text-sm" /> Saving...</>
            ) : (
              <><FiSave className="text-sm" /> Save Changes</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============ ASSIGN LEAD MODAL ============
const AssignStaffModal = ({ lead, show, onClose, onAssign, loading }) => {
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState('all');
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  useEffect(() => {
    if (show && lead) {
      setSelectedStaff([]);
      setSearchQuery('');
      setSelectAllChecked(false);
      setViewMode('all');
    }
  }, [show, lead]);

  const filteredStaff = useMemo(() => {
    let staff = [...STAFF_MEMBERS];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      staff = staff.filter(s =>
        s.name.toLowerCase().includes(query) ||
        s.role.toLowerCase().includes(query) ||
        s.email.toLowerCase().includes(query)
      );
    }
    return staff;
  }, [searchQuery]);

  const formatLeadDetails = (lead) => {
    if (!lead) return '';
    const parts = [];
    if (lead.propertyType) parts.push(lead.propertyType);
    if (lead.bedrooms) parts.push(`${lead.bedrooms} BHK`);
    if (lead.preferredCity || lead.preferredLocation) {
      const city = lead.preferredCity || lead.preferredLocation?.split(',')[0]?.trim() || '';
      if (city) parts.push(city);
    }
    if (lead.mobileNumber) parts.push(lead.mobileNumber);
    return parts.join('  ·  ');
  };

  const handleToggleStaff = (staffId) => {
    setSelectedStaff(prev => {
      const newSelection = prev.includes(staffId)
        ? prev.filter(id => id !== staffId)
        : [...prev, staffId];
      setSelectAllChecked(newSelection.length === filteredStaff.length && filteredStaff.length > 0);
      return newSelection;
    });
  };

  const handleSelectAll = () => {
    if (selectAllChecked || selectedStaff.length === filteredStaff.length) {
      setSelectedStaff([]);
      setSelectAllChecked(false);
    } else {
      setSelectedStaff(filteredStaff.map(s => s.id));
      setSelectAllChecked(true);
    }
  };

  const handleDownloadStaff = () => {
    if (filteredStaff.length === 0) return;
    const data = filteredStaff.map(staff => ({
      'Name': staff.name,
      'Role': staff.role,
      'Email': staff.email,
      'Phone': staff.phone,
      'Active Leads': staff.activeLeads,
      'ID': staff.id,
      'Selected': selectedStaff.includes(staff.id) ? 'Yes' : 'No',
    }));
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `staff_${(lead?.customerName || 'lead').replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSubmit = () => {
    if (selectedStaff.length === 0) return;
    setIsSubmitting(true);
    const staffObjects = STAFF_MEMBERS.filter(s => selectedStaff.includes(s.id));
    setTimeout(() => {
      onAssign(lead.id, staffObjects);
      setIsSubmitting(false);
    }, 500);
  };

  if (!show || !lead) return null;

  const leadDetails = formatLeadDetails(lead);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">

        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 rounded-t-2xl z-10 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
              <FiUserCheck className="text-sm" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Assign Lead</h2>
              <p className="text-white/70 text-[10px]">Assign lead to lead</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110">
            <FiX className="text-sm" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {/* Lead Details - Complete Info */}
          <div className="bg-[#F5F9F8] rounded-xl p-3 border border-[#E8F0EE]">
            <div className="flex items-start gap-3 flex-wrap">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white text-sm font-bold shrink-0">
                {lead.customerName?.charAt(0) || 'L'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-[#1A2E2A] truncate">{lead.customerName}</p>

                <p className="text-xs text-[#5A7D78] truncate mt-0.5">
                  <span className="font-medium text-[#00695C]">{leadDetails}</span>
                </p>

                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                  {lead.propertyType && (
                    <span className="text-[11px] font-bold text-[#00695C]">{lead.propertyType}</span>
                  )}
                  {lead.propertyType && lead.bedrooms > 0 && <span className="text-[#C5D3D0] text-[10px]">·</span>}
                  {lead.bedrooms > 0 && <span className="text-[11px] text-[#5A7D78]">{lead.bedrooms} BHK</span>}
                  {lead.bedrooms > 0 && (lead.preferredCity || lead.preferredLocation) && <span className="text-[#C5D3D0] text-[10px]">·</span>}
                  {(lead.preferredCity || lead.preferredLocation) && (
                    <span className="text-[11px] text-[#5A7D78]">
                      {lead.preferredCity || lead.preferredLocation?.split(',')[0]?.trim()}
                    </span>
                  )}
                  {(lead.preferredCity || lead.preferredLocation) && lead.mobileNumber && <span className="text-[#C5D3D0] text-[10px]">·</span>}
                  {lead.mobileNumber && <span className="text-[11px] text-[#5A7D78]">{lead.mobileNumber}</span>}
                </div>

                {lead.properties && lead.properties.length > 0 && (
                  <div className="flex items-center gap-1 mt-1.5">
                    <FiHome className="text-[#00695C] text-[10px]" />
                    <span className="text-[10px] font-medium text-[#00695C] bg-[#E8F4F2] px-2 py-0.5 rounded-full">
                      {lead.properties.length} {lead.properties.length === 1 ? 'Property' : 'Properties'}
                    </span>
                  </div>
                )}

                {lead.properties && lead.properties.length > 0 && (
                  <details className="mt-1.5 group">
                    <summary className="text-[10px] text-[#00695C] cursor-pointer font-medium hover:text-[#004D40] flex items-center gap-1 select-none">
                      <FiChevronDown className="group-open:rotate-180 transition-transform text-[10px]" />
                      View all {lead.properties.length} properties
                    </summary>
                    <div className="mt-2 space-y-1 pl-3 border-l-2 border-[#E8F4F2]">
                      {lead.properties.map((prop, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[10px] flex-wrap">
                          <span className="font-semibold text-[#00695C]">{prop.propertyType}</span>
                          {prop.bedrooms > 0 && <span className="text-[#C5D3D0]">·</span>}
                          {prop.bedrooms > 0 && <span className="text-[#5A7D78]">{prop.bedrooms} BHK</span>}
                          {prop.city && <span className="text-[#C5D3D0]">·</span>}
                          {prop.city && <span className="text-[#5A7D78]">{prop.city}</span>}
                          {prop.mobile && <span className="text-[#C5D3D0]">·</span>}
                          {prop.mobile && <span className="text-[#5A7D78]">{prop.mobile}</span>}
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-[#E8F4F2] text-[#00695C] whitespace-nowrap">
                {lead.leadId}
              </span>
            </div>
          </div>

          {/* View Mode & Date Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-[#F5F9F8] rounded-xl p-1 border border-[#E8F0EE]">
              <button onClick={() => setViewMode('all')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${viewMode === 'all' ? 'bg-white shadow-sm text-[#00695C]' : 'text-[#5A7D78] hover:text-[#1A2E2A]'}`}>All Staff</button>
              <button onClick={() => setViewMode('monthly')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${viewMode === 'monthly' ? 'bg-white shadow-sm text-[#00695C]' : 'text-[#5A7D78] hover:text-[#1A2E2A]'}`}>Monthly</button>
              <button onClick={() => setViewMode('daily')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${viewMode === 'daily' ? 'bg-white shadow-sm text-[#00695C]' : 'text-[#5A7D78] hover:text-[#1A2E2A]'}`}>Daily</button>
            </div>
            {viewMode === 'monthly' && (
              <div className="flex items-center gap-2">
                <FiCalendar className="text-[#00695C] text-sm" />
                <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="px-3 py-1.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-xs outline-none" />
              </div>
            )}
            {viewMode === 'daily' && (
              <div className="flex items-center gap-2">
                <FiCalendar className="text-[#00695C] text-sm" />
                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="px-3 py-1.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-xs outline-none" />
              </div>
            )}
          </div>

          {/* Search and Download */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm" />
              <input type="text" placeholder="Search lead by name, role, or email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm outline-none" />
            </div>
            <button onClick={handleDownloadStaff} className="px-3 py-2 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 shadow-md shadow-[#00695C]/30 whitespace-nowrap" title="Download lead list as CSV">
              <FiDownload className="text-sm" /> Download
            </button>
          </div>

          {/* Select All */}
          <div className="flex items-center justify-between bg-[#F5F9F8] rounded-xl px-3 py-2 border border-[#E8F0EE]">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div className="relative">
                <input type="checkbox" checked={selectAllChecked} onChange={handleSelectAll} className="w-5 h-5 rounded border-2 border-[#C5D3D0] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300 cursor-pointer appearance-none checked:bg-[#00695C] checked:border-[#00695C]" />
                {selectAllChecked && <FiCheck className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xs pointer-events-none" />}
              </div>
              <span className="text-xs font-medium text-[#1A2E2A]">Select All ({filteredStaff.length} lead)</span>
            </label>
            <span className="text-[10px] text-[#5A7D78]">{selectedStaff.length} selected</span>
          </div>

          {/* Staff List */}
          {filteredStaff.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-[#F5F9F8] flex items-center justify-center mx-auto mb-3">
                <FiUsers className="text-2xl text-[#B5C9C5]" />
              </div>
              <p className="text-sm text-[#5A7D78]">No lead members found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredStaff.map((staff) => {
                const isChecked = selectedStaff.includes(staff.id);
                return (
                  <div
                    key={staff.id}
                    onClick={() => handleToggleStaff(staff.id)}
                    className={`flex items-center gap-4 px-4 py-4 rounded-xl border transition-all duration-300 cursor-pointer bg-white ${
                      isChecked ? 'border-[#00695C] shadow-sm' : 'border-[#E8F0EE] hover:border-[#B5C9C5]'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-[4px] border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${isChecked ? 'bg-[#00695C] border-[#00695C]' : 'border-[#C5D3D0] bg-white'}`}>
                      {isChecked && <FiCheck className="text-white text-[11px]" strokeWidth={3} />}
                    </div>

                    <div className="w-11 h-11 rounded-full bg-[#0F766E] flex items-center justify-center text-white text-sm font-bold shrink-0 tracking-wide">
                      {staff.avatar}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-semibold text-[#1A2E2A] leading-tight">{staff.name}</p>
                      <div className="flex items-center gap-2 text-[12px] text-[#8A9A96] mt-1 flex-wrap">
                        <span>{staff.role}</span>
                        <span className="text-[#C5D3D0]">•</span>
                        <span className="truncate">{staff.email}</span>
                        <span className="text-[#C5D3D0]">•</span>
                        <span className="whitespace-nowrap">{staff.phone}</span>
                      </div>
                    </div>

                    <span className="text-[11px] px-2.5 py-1 rounded-full font-medium bg-[#E0F2FE] text-[#0369A1] shrink-0 whitespace-nowrap">
                      {staff.activeLeads} active leads
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white pt-3 px-4 pb-4 border-t border-[#E8F0EE] flex items-center gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2 bg-[#F5F9F8] text-[#1A2E2A] rounded-lg hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">Cancel</button>
          <button onClick={handleSubmit} disabled={selectedStaff.length === 0 || isSubmitting || loading} className="flex-1 px-4 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md shadow-[#00695C]/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {isSubmitting || loading ? (<><FiRefreshCw className="animate-spin text-sm" /> Assigning...</>) : (<><FiUserCheck className="text-sm" /> Assign {selectedStaff.length} Lead</>)}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============ VIEW ASSIGNED LEAD MODAL ============
const ViewAssignedStaffModal = ({ lead, assignedStaff, show, onClose }) => {
  if (!show || !lead) return null;

  const totalStaff = assignedStaff?.length || 0;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 rounded-t-2xl z-10 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
              <FiUsers className="text-sm" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Assigned Lead</h2>
              <p className="text-white/70 text-[10px]">Lead assigned to {lead.customerName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
          >
            <FiX className="text-sm" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center justify-between p-3 bg-[#F5F9F8] rounded-xl border-l-4 border-l-[#00695C] mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#00695C] flex items-center justify-center text-white">
                <FiUserCheck className="text-sm" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#1A2E2A]">Total Assigned</p>
                <p className="text-[10px] text-[#5A7D78]">
                  {totalStaff} Lead member{totalStaff !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <span className="text-lg font-bold text-[#00695C]">{totalStaff}</span>
          </div>

          {totalStaff === 0 ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-full bg-[#F5F9F8] flex items-center justify-center mx-auto mb-3">
                <FiUsers className="text-2xl text-[#B5C9C5]" />
              </div>
              <p className="text-sm font-medium text-[#1A2E2A] mb-1">No lead assigned yet</p>
              <p className="text-xs text-[#5A7D78]">Assign lead to this lead to see them here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {assignedStaff.map((staff, idx) => (
                <div
                  key={`${staff.id}_${idx}`}
                  className="bg-white rounded-xl border border-[#E8F0EE] hover:border-[#00695C]/30 hover:shadow-md transition-all duration-300 overflow-hidden"
                >
                  <div className="p-3">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-md">
                        {staff.avatar || staff.name?.charAt(0) || 'S'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-[#1A2E2A] truncate">
                          {staff.name}
                        </h3>
                        <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-medium bg-[#E8F4F2] text-[#00695C]">
                          {staff.role}
                        </span>
                      </div>
                      {staff.assignedDate && (
                        <div className="text-right shrink-0">
                          <span className="text-[9px] px-2 py-1 rounded-lg font-medium bg-blue-50 text-blue-700 whitespace-nowrap">
                            {new Date(staff.assignedDate).toLocaleDateString('en-IN', {
                              day: 'numeric', month: 'short'
                            })}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-[#E8F0EE] pt-3 space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-6 h-6 rounded-lg bg-[#F5F9F8] flex items-center justify-center shrink-0">
                          <FiMail className="text-[#00695C] text-[10px]" />
                        </div>
                        <span className="text-[#5A7D78] shrink-0">Email:</span>
                        <span className="font-medium text-[#1A2E2A] truncate">
                          {staff.email || 'N/A'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-6 h-6 rounded-lg bg-[#F5F9F8] flex items-center justify-center shrink-0">
                          <FiPhone className="text-[#00695C] text-[10px]" />
                        </div>
                        <span className="text-[#5A7D78] shrink-0">Phone:</span>
                        <span className="font-medium text-[#1A2E2A]">
                          {staff.phone || 'N/A'}
                        </span>
                      </div>

                      {staff.assignedDate && (
                        <div className="flex items-center gap-2 text-xs">
                          <div className="w-6 h-6 rounded-lg bg-[#F5F9F8] flex items-center justify-center shrink-0">
                            <FiCalendar className="text-[#00695C] text-[10px]" />
                          </div>
                          <span className="text-[#5A7D78] shrink-0">Assigned:</span>
                          <span className="font-medium text-[#1A2E2A]">
                            {new Date(staff.assignedDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white pt-3 px-4 pb-4 border-t border-[#E8F0EE] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#F5F9F8] text-[#1A2E2A] rounded-lg hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ============ COMMISSION TRACKING MODAL ============
const CommissionTrackingModal = ({ lead, show, onClose }) => {
  const [commissionData, setCommissionData] = useState([]);
  const [stats, setStats] = useState({ total: 0, paid: 0, pending: 0 });

  useEffect(() => {
    if (show && lead) {
      const mockCommissions = [
        { id: 1, property: 'Luxury Villa in Mumbai', price: 45000000, commission: 450000, date: '2026-01-15', status: 'paid' },
        { id: 2, property: 'Modern Apartment in Delhi', price: 12000000, commission: 120000, date: '2026-01-10', status: 'pending' },
        { id: 3, property: 'Commercial Space in Bangalore', price: 25000000, commission: 250000, date: '2026-01-05', status: 'paid' },
        { id: 4, property: 'Family Home in Chennai', price: 18000000, commission: 180000, date: '2025-12-28', status: 'pending' },
        { id: 5, property: 'Beachfront Villa in Goa', price: 55000000, commission: 550000, date: '2025-12-20', status: 'paid' },
      ];
      setCommissionData(mockCommissions);
      setStats({
        total: mockCommissions.reduce((sum, c) => sum + c.commission, 0),
        paid: mockCommissions.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.commission, 0),
        pending: mockCommissions.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.commission, 0),
      });
    }
  }, [show, lead]);

  const handleExportCommission = useCallback(() => {
    if (!commissionData.length) return;
    const data = commissionData.map(item => ({
      Property: item.property,
      Price: item.price,
      Commission: item.commission,
      Date: item.date,
      Status: item.status,
    }));
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `commission_${(lead?.customerName || 'lead').replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }, [commissionData, lead]);

  if (!show || !lead) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 rounded-t-2xl z-10 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
              <FiDollarSign className="text-sm" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Commission Tracking</h2>
              <p className="text-white/70 text-[10px]">Commission details for {lead.customerName}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110">
            <FiX className="text-sm" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-[#F5F9F8] rounded-xl border-l-4 border-l-[#00695C]">
              <p className="text-lg font-bold text-[#1A2E2A]">₹{stats.total.toLocaleString()}</p>
              <p className="text-[9px] uppercase tracking-wider text-[#5A7D78]">Total</p>
            </div>
            <div className="text-center p-3 bg-emerald-50 rounded-xl border-l-4 border-l-emerald-500">
              <p className="text-lg font-bold text-emerald-600">₹{stats.paid.toLocaleString()}</p>
              <p className="text-[9px] uppercase tracking-wider text-emerald-600">Paid</p>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-xl border-l-4 border-l-amber-500">
              <p className="text-lg font-bold text-amber-600">₹{stats.pending.toLocaleString()}</p>
              <p className="text-[9px] uppercase tracking-wider text-amber-600">Pending</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3">Transaction History</h4>
            <div className="space-y-2">
              {commissionData.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-[#F5F9F8] rounded-xl border-l-4 border-l-[#00695C]">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[#1A2E2A] truncate">{item.property}</p>
                    <div className="flex items-center gap-3 text-xs text-[#5A7D78]">
                      <span>{new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
                      <span>₹{item.price.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-semibold text-[#00695C]">₹{item.commission.toLocaleString()}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${item.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white pt-3 px-4 pb-4 border-t border-[#E8F0EE] flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 bg-[#F5F9F8] text-[#1A2E2A] rounded-lg hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">Close</button>
          <button onClick={handleExportCommission} className="px-6 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md shadow-[#00695C]/30 hover:scale-[1.02]">
            <FiDownload className="inline mr-2 text-sm" /> Export Report
          </button>
        </div>
      </div>
    </div>
  );
};

// ============ PERFORMANCE REPORT MODAL ============
const PerformanceReportModal = ({ lead, show, onClose }) => {
  if (!show || !lead) return null;

  const performanceData = {
    totalLeads: 45,
    conversionRate: 68,
    avgResponseTime: '2.4 hrs',
    monthlyPerformance: [
      { month: 'Aug', leads: 8,  converted: 5, lost: 2, pending: 1 },
      { month: 'Sep', leads: 7,  converted: 4, lost: 2, pending: 1 },
      { month: 'Oct', leads: 10, converted: 7, lost: 2, pending: 1 },
      { month: 'Nov', leads: 6,  converted: 4, lost: 1, pending: 1 },
      { month: 'Dec', leads: 12, converted: 9, lost: 2, pending: 1 },
      { month: 'Jan', leads: 9,  converted: 6, lost: 2, pending: 1 },
    ]
  };

  const maxLeads = Math.max(...performanceData.monthlyPerformance.map(m => m.leads));
  const totalConverted = performanceData.monthlyPerformance.reduce((s, m) => s + m.converted, 0);
  const totalLost = performanceData.monthlyPerformance.reduce((s, m) => s + m.lost, 0);
  const totalPending = performanceData.monthlyPerformance.reduce((s, m) => s + m.pending, 0);

  const handleExportPerformance = () => {
    const data = performanceData.monthlyPerformance.map(item => ({
      Month: item.month,
      Leads: item.leads,
      Converted: item.converted,
      Lost: item.lost,
      Pending: item.pending,
      'Conversion %': ((item.converted / item.leads) * 100).toFixed(1) + '%',
    }));
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `performance_${(lead?.customerName || 'lead').replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 rounded-t-2xl z-10 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
              <FiBarChart2 className="text-sm" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Performance Report</h2>
              <p className="text-white/70 text-[10px]">Performance metrics for {lead.customerName}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110">
            <FiX className="text-sm" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-3 bg-[#F5F9F8] rounded-xl border-l-4 border-l-[#00695C]">
              <p className="text-lg font-bold text-[#1A2E2A]">{performanceData.totalLeads}</p>
              <p className="text-[9px] uppercase tracking-wider text-[#5A7D78]">Total Leads</p>
            </div>
            <div className="text-center p-3 bg-emerald-50 rounded-xl border-l-4 border-l-emerald-500">
              <p className="text-lg font-bold text-emerald-600">{totalConverted}</p>
              <p className="text-[9px] uppercase tracking-wider text-emerald-600">Converted</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-xl border-l-4 border-l-red-500">
              <p className="text-lg font-bold text-red-600">{totalLost}</p>
              <p className="text-[9px] uppercase tracking-wider text-red-600">Lost</p>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-xl border-l-4 border-l-amber-500">
              <p className="text-lg font-bold text-amber-600">{totalPending}</p>
              <p className="text-[9px] uppercase tracking-wider text-amber-600">Pending</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-[#F5F9F8] rounded-xl border-l-4 border-l-blue-500">
              <p className="text-lg font-bold text-[#00695C]">{performanceData.conversionRate}%</p>
              <p className="text-[9px] uppercase tracking-wider text-[#5A7D78]">Conversion Rate</p>
            </div>
            <div className="text-center p-3 bg-[#F5F9F8] rounded-xl border-l-4 border-l-purple-500">
              <p className="text-lg font-bold text-[#00695C]">{performanceData.avgResponseTime}</p>
              <p className="text-[9px] uppercase tracking-wider text-[#5A7D78]">Avg Response Time</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3">Monthly Leads Overview</h4>
            <div className="bg-[#F5F9F8] rounded-xl p-4">
              <div className="flex items-end justify-between h-36 gap-2">
                {performanceData.monthlyPerformance.map((item) => (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex flex-col items-center gap-0.5">
                      <span className="text-[9px] font-bold text-[#00695C]">{item.leads}</span>
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-[#00695C] to-[#26A69A] transition-all duration-500 hover:opacity-80"
                        style={{ height: `${(item.leads / maxLeads) * 90}px`, minHeight: '10px' }}
                      />
                    </div>
                    <span className="text-[8px] text-[#5A7D78] font-medium">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3">Monthly Leads Breakdown</h4>
            <div className="bg-white rounded-xl border border-[#E8F0EE] overflow-hidden">
              <div className="grid grid-cols-6 gap-2 px-3 py-2.5 bg-[#F5F9F8] border-b border-[#E8F0EE] text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider">
                <div className="col-span-1">Month</div>
                <div className="col-span-1 text-center">Leads</div>
                <div className="col-span-1 text-center">Converted</div>
                <div className="col-span-1 text-center">Lost</div>
                <div className="col-span-1 text-center">Pending</div>
                <div className="col-span-1 text-center">Conv. %</div>
              </div>
              {performanceData.monthlyPerformance.map((item, idx) => {
                const convRate = ((item.converted / item.leads) * 100).toFixed(0);
                return (
                  <div
                    key={item.month}
                    className={`grid grid-cols-6 gap-2 px-3 py-2.5 items-center border-b border-[#E8F0EE] last:border-b-0 hover:bg-[#F5F9F8] transition-all duration-300 ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-[#FAFCFB]'
                    }`}
                  >
                    <div className="col-span-1 text-xs font-semibold text-[#1A2E2A]">{item.month}</div>
                    <div className="col-span-1 text-center text-xs font-bold text-[#00695C]">{item.leads}</div>
                    <div className="col-span-1 text-center">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-700">
                        {item.converted}
                      </span>
                    </div>
                    <div className="col-span-1 text-center">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-red-100 text-red-700">
                        {item.lost}
                      </span>
                    </div>
                    <div className="col-span-1 text-center">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-amber-100 text-amber-700">
                        {item.pending}
                      </span>
                    </div>
                    <div className="col-span-1 text-center text-xs font-semibold text-[#1A2E2A]">{convRate}%</div>
                  </div>
                );
              })}
              <div className="grid grid-cols-6 gap-2 px-3 py-2.5 items-center bg-[#E8F4F2] border-t-2 border-[#00695C]">
                <div className="col-span-1 text-xs font-bold text-[#00695C]">Total</div>
                <div className="col-span-1 text-center text-xs font-bold text-[#00695C]">{performanceData.totalLeads}</div>
                <div className="col-span-1 text-center text-xs font-bold text-emerald-700">{totalConverted}</div>
                <div className="col-span-1 text-center text-xs font-bold text-red-700">{totalLost}</div>
                <div className="col-span-1 text-center text-xs font-bold text-amber-700">{totalPending}</div>
                <div className="col-span-1 text-center text-xs font-bold text-[#00695C]">{performanceData.conversionRate}%</div>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white pt-3 px-4 pb-4 border-t border-[#E8F0EE] flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 bg-[#F5F9F8] text-[#1A2E2A] rounded-lg hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">
            Close
          </button>
          <button onClick={handleExportPerformance} className="px-6 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md shadow-[#00695C]/30 hover:scale-[1.02] flex items-center gap-2">
            <FiDownload className="text-sm" /> Export Report
          </button>
        </div>
      </div>
    </div>
  );
};

// ============ VIEW LEAD PROPERTIES MODAL ============
const ViewLeadPropertiesModal = ({ lead, show, onClose, navigate }) => {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showPropertyDetails, setShowPropertyDetails] = useState(false);

  useEffect(() => {
    if (show && lead) {
      const propertyTypes = ['Individual', 'Apartment', 'Commercial', 'Land & Plots', 'Hostel'];
      const statuses = ['pending', 'approved', 'rejected', 'suspended'];
      const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur'];
      const states = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Maharashtra', 'Gujarat', 'Rajasthan'];
      const titles = [
        'Luxury Apartment with Sea View', 'Modern Family Home', 'Spacious Villa', 'Penthouse Suite',
        'Cozy Studio Apartment', 'Commercial Office Space', 'Garden House', 'Lake View Apartment',
        'City Center Condo', 'Hostel Building', 'Land for Development', 'Beachfront Villa',
        'Corporate Commercial Space', 'Working Professional Hostel'
      ];
      const ownerNames = ['Amit Agarwal', 'Rajesh Kumar', 'Priya Sharma', 'Suresh Patel', 'Neha Verma'];

      const rand = seededRandom(seedFromString(lead.id));
      const count = Math.min(Math.max((lead.id?.length % 6) + 4, 4), 12);

      const generated = Array.from({ length: count }, (_, idx) => {
        const type = propertyTypes[Math.floor(rand() * propertyTypes.length)];
        const status = statuses[Math.floor(rand() * statuses.length)];
        const cityIndex = Math.floor(rand() * cities.length);
        const city = cities[cityIndex];
        const state = states[cityIndex];
        const bedrooms = type === 'Land & Plots' ? 0 : Math.floor(rand() * 4) + 1;
        const bathrooms = type === 'Land & Plots' ? 0 : Math.floor(rand() * 3) + 1;
        const price = Math.floor(rand() * 45000000) + 5000000;
        const createdDate = new Date(Date.now() - Math.floor(rand() * 365) * 24 * 60 * 60 * 1000);
        const propertyId = `PROP-${String(2000 + idx + 1).padStart(4, '0')}`;

        // Each property has its own complete requirements
        const minBudget = Math.floor(rand() * 5000000) + 1000000;
        const maxBudget = minBudget + Math.floor(rand() * 10000000) + 500000;
        const minArea = Math.floor(rand() * 1000) + 500;
        const maxArea = Math.floor(rand() * 2000) + 1500;
        const purpose = ['Purchase', 'Rental', 'Investment', 'Residential', 'Commercial'][Math.floor(rand() * 5)];
        const furnishing = FURNISHING_OPTIONS[Math.floor(rand() * FURNISHING_OPTIONS.length)];
        const facing = FACING_OPTIONS[Math.floor(rand() * FACING_OPTIONS.length)];
        const requiredAmenities = AMENITIES_LIST.filter(() => rand() > 0.6).slice(0, 4);

        return {
          id: propertyId,
          propertyId: propertyId,
          title: `${titles[Math.floor(rand() * titles.length)]} ${idx + 1}`,
          type,
          status,
          location: `${city}, ${state}`,
          city,
          state,
          price,
          bedrooms,
          bathrooms,
          area: Math.floor(rand() * 3000) + 400,
          areaUnit: 'sq ft',
          isFeatured: rand() > 0.75,
          isVerified: rand() > 0.6,
          views: Math.floor(rand() * 400) + 100,
          inquiries: Math.floor(rand() * 30) + 5,
          ownerName: ownerNames[Math.floor(rand() * ownerNames.length)],
          listedDate: createdDate.toISOString(),
          description: `${type} property located in ${city}, ${state}. Well-maintained with modern amenities.`,
          // Complete property requirements
          requirements: {
            purpose,
            preferredState: state,
            preferredCity: city,
            preferredArea: `${city}, ${state}`,
            minArea,
            maxArea,
            bedrooms,
            bathrooms,
            furnishing,
            preferredFacing: facing,
            minBudget,
            maxBudget,
            requiredAmenities,
          },
        };
      });

      setProperties(generated);
    }
  }, [show, lead]);

  const getStatusBadge = (status) => {
    const map = {
      approved: 'bg-emerald-100 text-emerald-700',
      pending: 'bg-amber-100 text-amber-700',
      rejected: 'bg-red-100 text-red-700',
      suspended: 'bg-gray-100 text-gray-700',
    };
    return map[status] || 'bg-gray-100 text-gray-700';
  };

  const getTypeIcon = (type) => {
    const map = {
      'Individual': <FiHome className="text-[#00695C] text-[10px]" />,
      'Apartment': <MdApartment className="text-[#00695C] text-[10px]" />,
      'Commercial': <MdOutlineBusiness className="text-[#00695C] text-[10px]" />,
      'Land & Plots': <FiMapPin className="text-[#00695C] text-[10px]" />,
      'Hostel': <FiHome className="text-[#00695C] text-[10px]" />,
    };
    return map[type] || <FiHome className="text-[#00695C] text-[10px]" />;
  };

  const handleViewPropertyDetails = (property) => {
    if (navigate) {
      onClose && onClose();
      navigate(`/properties/${property.propertyId}`, { state: { property } });
    }
  };

  const handleViewRequirements = (property) => {
    setSelectedProperty(property);
    setShowPropertyDetails(true);
  };

  const handleCloseRequirements = () => {
    setShowPropertyDetails(false);
    setSelectedProperty(null);
  };

  if (!show || !lead) return null;

  return (
    <>
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
          <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 rounded-t-2xl z-10 shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
                <FiHome className="text-sm" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Lead Properties</h2>
                <p className="text-white/70 text-[10px]">All properties linked to {lead.customerName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
            >
              <FiX className="text-sm" />
            </button>
          </div>

          {/* Lead Summary Bar */}
          <div className="px-4 pt-4 pb-0">
            <div className="flex items-center gap-3 p-3 bg-[#F5F9F8] rounded-xl border-l-4 border-l-[#00695C]">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white text-base font-bold shrink-0">
                {lead.customerName?.charAt(0) || 'L'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-[#1A2E2A] truncate text-sm">{lead.customerName}</p>
                <p className="text-xs text-[#5A7D78] truncate">
                  {lead.mobileNumber} · {lead.preferredLocation}
                </p>
              </div>
              <span className="text-[10px] font-semibold text-[#00695C] bg-[#E8F4F2] px-2.5 py-1 rounded-full whitespace-nowrap">
                {properties.length} Propert{properties.length !== 1 ? 'ies' : 'y'}
              </span>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#F8FAF9]">
            {properties.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-xl border border-[#E8F0EE]">
                <div className="w-16 h-16 rounded-full bg-[#F5F9F8] flex items-center justify-center mx-auto mb-3">
                  <FiHome className="text-2xl text-[#B5C9C5]" />
                </div>
                <p className="text-sm text-[#5A7D78]">No properties linked to this lead</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {properties.map((property) => (
                  <div
                    key={property.id}
                    className="bg-white rounded-2xl border border-[#E8F0EE] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
                  >
                    <div className="p-4 flex-1">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-base text-[#1A2E2A] leading-tight truncate">
                            {property.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg font-medium bg-[#F5F9F8] text-[#1A2E2A]">
                              {getTypeIcon(property.type)}
                              {property.type}
                            </span>
                            <span className={`text-[10px] px-2 py-1 rounded-lg font-semibold capitalize ${getStatusBadge(property.status)}`}>
                              {property.status}
                            </span>
                            {property.isVerified && (
                              <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg font-medium bg-blue-50 text-blue-700">
                                <FiShield className="text-[9px]" />
                                Verified
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-[#00695C] to-[#26A69A] rounded-xl px-3 py-1.5 text-white font-bold text-sm shrink-0 shadow-md">
                          ₹{(property.price / 100000).toFixed(0)}L
                        </div>
                      </div>

                      {/* Location & Price */}
                      <div className="space-y-1.5 mb-3">
                        <div className="flex items-center gap-2 text-xs text-[#5A7D78]">
                          <FiMapPin className="text-[#00695C] shrink-0" />
                          <span className="truncate">{property.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#5A7D78]">
                          <FiDollarSign className="text-[#00695C] shrink-0" />
                          <span className="truncate font-medium text-[#1A2E2A]">
                            ₹{property.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#5A7D78]">
                          <FiUser className="text-[#00695C] shrink-0" />
                          <span className="truncate">{property.ownerName}</span>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-[#E8F0EE] mb-3">
                        <div className="text-center">
                          <p className="text-base font-bold text-[#1A2E2A]">{property.bedrooms}</p>
                          <p className="text-[9px] uppercase tracking-wider text-[#5A7D78] font-medium">Beds</p>
                        </div>
                        <div className="text-center border-l border-r border-[#E8F0EE]">
                          <p className="text-base font-bold text-[#1A2E2A]">{property.bathrooms}</p>
                          <p className="text-[9px] uppercase tracking-wider text-[#5A7D78] font-medium">Baths</p>
                        </div>
                        <div className="text-center">
                          <p className="text-base font-bold text-[#1A2E2A]">{property.area}</p>
                          <p className="text-[9px] uppercase tracking-wider text-[#5A7D78] font-medium">Sq Ft</p>
                        </div>
                      </div>

                      {/* Quick Requirements Preview */}
                      <div className="bg-[#F5F9F8] rounded-xl p-3 mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <FiTarget className="text-[#00695C] text-xs" />
                          <span className="text-[10px] font-semibold text-[#5A7D78] uppercase tracking-wider">Requirements</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[14px]">
                          <div className="flex items-center gap-1">
                            <span className="text-[#4b6b67]">Purpose:</span>
                            <span className="font-medium text-[#1A2E2A]">{property.requirements?.purpose || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-[#5A7D78]">Furnishing:</span>
                            <span className="font-medium text-[#1A2E2A] truncate">{property.requirements?.furnishing || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-[#5A7D78]">Budget:</span>
                            <span className="font-medium text-[#1A2E2A]">
                              ₹{((property.requirements?.minBudget || 0) / 100000).toFixed(1)}L - ₹{((property.requirements?.maxBudget || 0) / 100000).toFixed(1)}L
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-[#5A7D78]">Facing:</span>
                            <span className="font-medium text-[#1A2E2A] truncate">{property.requirements?.preferredFacing || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="px-4 pb-4 flex gap-2">
                      <button
                        onClick={() => handleViewRequirements(property)}
                        className="flex-1 py-2.5 bg-[#E8F4F2] text-[#00695C] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 text-xs font-semibold hover:scale-[1.02] flex items-center justify-center gap-2"
                      >
                        <FiTarget className="text-xs" />
                        Full Requirements
                      </button>
                      <button
                        onClick={() => handleViewPropertyDetails(property)}
                        className="flex-1 py-2.5 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-xl hover:shadow-lg transition-all duration-300 text-xs font-semibold shadow-md shadow-[#00695C]/30 hover:scale-[1.02] flex items-center justify-center gap-2"
                      >
                        <FiEye className="text-xs" />
                        View Property
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="sticky bottom-0 bg-white pt-3 px-4 pb-4 border-t border-[#E8F0EE] flex items-center justify-between gap-3">
            <span className="text-xs text-[#5A7D78]">
              Total: <span className="font-semibold text-[#00695C]">{properties.length}</span> properties
            </span>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md shadow-[#00695C]/30 hover:scale-[1.02]"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Property Requirements Modal */}
      {showPropertyDetails && selectedProperty && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
            <div className="sticky top-0 bg-gradient-to-r from-[#00695C] to-[#26A69A] px-5 py-3 rounded-t-2xl z-10 shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
                  <FiTarget className="text-sm" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Property Requirements</h2>
                  <p className="text-white/70 text-[10px]">{selectedProperty.title}</p>
                </div>
              </div>
              <button
                onClick={handleCloseRequirements}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
              >
                <FiX className="text-sm" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Property Summary */}
              <div className="bg-[#F5F9F8] rounded-xl p-4 border border-[#E8F0EE]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white text-lg font-bold shrink-0">
                    {selectedProperty.type?.charAt(0) || 'P'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[#1A2E2A] truncate">{selectedProperty.title}</p>
                    <div className="flex items-center gap-2 text-xs text-[#5A7D78]">
                      <FiMapPin className="text-[#00695C] text-[10px]" />
                      <span className="truncate">{selectedProperty.location}</span>
                      <span className="text-[#C5D3D0]">·</span>
                      <span className="font-medium text-[#00695C]">₹{(selectedProperty.price / 100000).toFixed(1)}L</span>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold capitalize ${getStatusBadge(selectedProperty.status)}`}>
                    {selectedProperty.status}
                  </span>
                </div>
              </div>

              {/* Full Property Requirements */}
              <div className="bg-[#F5F9F8] rounded-xl p-4">
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FiTarget className="text-[#00695C]" /> Property Requirement
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-[#5A7D78]">Purpose:</span>
                    <span className="font-medium text-[#1A2E2A]">{selectedProperty.requirements?.purpose || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-[#5A7D78]">Preferred State:</span>
                    <span className="font-medium text-[#1A2E2A]">{selectedProperty.requirements?.preferredState || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-[#5A7D78]">Preferred City:</span>
                    <span className="font-medium text-[#1A2E2A]">{selectedProperty.requirements?.preferredCity || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-[#5A7D78]">Preferred Area:</span>
                    <span className="font-medium text-[#1A2E2A]">{selectedProperty.requirements?.preferredArea || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-[#5A7D78]">Min Area:</span>
                    <span className="font-medium text-[#1A2E2A]">{selectedProperty.requirements?.minArea ? `${selectedProperty.requirements.minArea} sq ft` : 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-[#5A7D78]">Max Area:</span>
                    <span className="font-medium text-[#1A2E2A]">{selectedProperty.requirements?.maxArea ? `${selectedProperty.requirements.maxArea} sq ft` : 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FaBed className="text-[#00695C] shrink-0" />
                    <span className="text-[#5A7D78]">Bedrooms:</span>
                    <span className="font-medium text-[#1A2E2A]">{selectedProperty.requirements?.bedrooms || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FaBath className="text-[#00695C] shrink-0" />
                    <span className="text-[#5A7D78]">Bathrooms:</span>
                    <span className="font-medium text-[#1A2E2A]">{selectedProperty.requirements?.bathrooms || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-[#5A7D78]">Furnishing:</span>
                    <span className="font-medium text-[#1A2E2A]">{selectedProperty.requirements?.furnishing || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-[#5A7D78]">Preferred Facing:</span>
                    <span className="font-medium text-[#1A2E2A]">{selectedProperty.requirements?.preferredFacing || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FiDollarSign className="text-[#00695C] shrink-0" />
                    <span className="text-[#5A7D78]">Budget:</span>
                    <span className="font-medium text-[#1A2E2A]">
                      {selectedProperty.requirements?.minBudget && selectedProperty.requirements?.maxBudget
                        ? `₹${(selectedProperty.requirements.minBudget / 100000).toFixed(1)}L - ₹${(selectedProperty.requirements.maxBudget / 100000).toFixed(1)}L`
                        : 'N/A'}
                    </span>
                  </div>
                </div>
                {selectedProperty.requirements?.requiredAmenities && selectedProperty.requirements.requiredAmenities.length > 0 && (
                  <div className="mt-3">
                    <span className="text-[#5A7D78] text-sm">Required Amenities:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {selectedProperty.requirements.requiredAmenities.map((amenity, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 bg-white rounded-full text-[#1A2E2A] border border-[#E8F0EE]">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Property Details */}
              <div className="bg-[#F5F9F8] rounded-xl p-4">
                <h4 className="text-xs font-semibold text-[#5A7D78] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FiHome className="text-[#00695C]" /> Property Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <FiTag className="text-[#00695C] shrink-0" />
                    <span className="text-[#5A7D78]">Type:</span>
                    <span className="font-medium text-[#1A2E2A]">{selectedProperty.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FiDollarSign className="text-[#00695C] shrink-0" />
                    <span className="text-[#5A7D78]">Price:</span>
                    <span className="font-medium text-[#1A2E2A]">₹{selectedProperty.price.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FiUser className="text-[#00695C] shrink-0" />
                    <span className="text-[#5A7D78]">Owner:</span>
                    <span className="font-medium text-[#1A2E2A]">{selectedProperty.ownerName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FiCalendar className="text-[#00695C] shrink-0" />
                    <span className="text-[#5A7D78]">Listed:</span>
                    <span className="font-medium text-[#1A2E2A]">
                      {new Date(selectedProperty.listedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FiEye className="text-[#00695C] shrink-0" />
                    <span className="text-[#5A7D78]">Views:</span>
                    <span className="font-medium text-[#1A2E2A]">{selectedProperty.views}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FiMail className="text-[#00695C] shrink-0" />
                    <span className="text-[#5A7D78]">Inquiries:</span>
                    <span className="font-medium text-[#1A2E2A]">{selectedProperty.inquiries}</span>
                  </div>
                </div>
                {selectedProperty.description && (
                  <div className="mt-3 pt-3 border-t border-[#E8F0EE]">
                    <span className="text-[#5A7D78] text-sm">Description:</span>
                    <p className="text-sm text-[#1A2E2A] mt-1 leading-relaxed">{selectedProperty.description}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="sticky bottom-0 bg-white pt-3 px-4 pb-4 border-t border-[#E8F0EE] flex items-center justify-end gap-3">
              <button
                onClick={handleCloseRequirements}
                className="px-6 py-2 bg-[#F5F9F8] text-[#1A2E2A] rounded-lg hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleCloseRequirements();
                  handleViewPropertyDetails(selectedProperty);
                }}
                className="px-6 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md shadow-[#00695C]/30 hover:scale-[1.02] flex items-center gap-2"
              >
                <FiExternalLink className="text-sm" />
                View Full Property
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ============ MAIN COMPONENT ============
const LeadManagement = () => {
  const navigate = useNavigate();

  // ============ STATE ============
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserType, setSelectedUserType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [selectedEnquiryType, setSelectedEnquiryType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('createdDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [showStats, setShowStats] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [filterCount, setFilterCount] = useState(0);
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  // Modal states
  const [viewingLead, setViewingLead] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [assignStaffLead, setAssignStaffLead] = useState(null);
  const [showAssignStaffModal, setShowAssignStaffModal] = useState(false);
  const [viewAssignedLead, setViewAssignedLead] = useState(null);
  const [showViewAssignedModal, setShowViewAssignedModal] = useState(false);
  const [commissionLead, setCommissionLead] = useState(null);
  const [showCommissionModal, setShowCommissionModal] = useState(false);
  const [performanceLead, setPerformanceLead] = useState(null);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [viewPropertiesLead, setViewPropertiesLead] = useState(null);
  const [showViewPropertiesModal, setShowViewPropertiesModal] = useState(false);

  // Assigned lead tracking
  const [assignedStaffMap, setAssignedStaffMap] = useState({});

  const searchInputRef = useRef(null);

  // ============ CONFIRMATION MODAL STATE ============
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Yes',
    cancelText: 'No',
    confirmColor: 'bg-red-500',
    icon: <FiAlertTriangle className="text-4xl text-red-500" />,
    onConfirm: null,
    leadId: null,
    action: null,
  });

  // ============ STATS ============
  const [stats, setStats] = useState({
    total: 0,
    owner: 0,
    agent: 0,
    builder: 0,
    propertyManager: 0,
  });

  // ============ TOAST FUNCTION ============
  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  }, []);

  // ============ GENERATE MOCK LEADS ============
  const generateMockLeads = useCallback(() => {
    const customerNames = [
      'Rahul Sharma', 'Priya Patel', 'Amit Singh', 'Sneha Reddy', 'Vikram Kumar',
      'Meera Iyer', 'Deepak Jain', 'Kavya Nair', 'Arjun Menon', 'Neha Kapoor',
      'Ravi Desai', 'Pooja Gupta', 'Sanjay Verma', 'Ananya Rao', 'Karan Malhotra',
      'Divya Joshi', 'Nikhil Agarwal', 'Ritu Singh', 'Manish Tiwari', 'Swati Mishra'
    ];

    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur'];
    const states = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Maharashtra', 'Gujarat', 'Rajasthan'];
    const areas = ['Andheri', 'Bandra', 'Juhu', 'Powai', 'Thane', 'Navi Mumbai', 'Worli', 'Lower Parel'];
    const staffNames = ['Suresh Kumar', 'Anita Desai', 'Rajesh Nair', 'Kavita Sharma', 'Mohan Rao'];

    const rand = seededRandom(42);

    return Array.from({ length: 45 }, (_, i) => {
      const userType = USER_TYPES[Math.floor(rand() * USER_TYPES.length)];
      const leadStatus = LEAD_STATUSES[Math.floor(rand() * LEAD_STATUSES.length)];
      const leadPriority = LEAD_PRIORITIES[Math.floor(rand() * LEAD_PRIORITIES.length)];
      const leadSource = LEAD_SOURCES[Math.floor(rand() * LEAD_SOURCES.length)];
      const enquiryType = ENQUIRY_TYPES[Math.floor(rand() * ENQUIRY_TYPES.length)];
      const listingType = LISTING_TYPES[Math.floor(rand() * LISTING_TYPES.length)];
      const propertyType = PROPERTY_TYPES[Math.floor(rand() * PROPERTY_TYPES.length)];
      const preferredContactMethod = PREFERRED_CONTACT_METHODS[Math.floor(rand() * PREFERRED_CONTACT_METHODS.length)];
      const cityIndex = Math.floor(rand() * cities.length);
      const city = cities[cityIndex];
      const state = states[cityIndex];
      const area = areas[Math.floor(rand() * areas.length)];

      const minBudget = Math.floor(rand() * 5000000) + 1000000;
      const maxBudget = minBudget + Math.floor(rand() * 10000000) + 500000;

      const createdDate = new Date(Date.now() - Math.floor(rand() * 90) * 24 * 60 * 60 * 1000);
      const lastContacted = new Date(createdDate.getTime() + Math.floor(rand() * 10) * 24 * 60 * 60 * 1000);
      const nextFollowUp = new Date(lastContacted.getTime() + Math.floor(rand() * 7 + 1) * 24 * 60 * 60 * 1000);

      const requiredAmenities = AMENITIES_LIST.filter(() => rand() > 0.6).slice(0, 4);

      return {
        id: `lead_${i + 1}`,
        leadId: `LEAD-${String(1000 + i + 1).padStart(4, '0')}`,
        customerName: customerNames[Math.floor(rand() * customerNames.length)] + (i > 15 ? ` ${i}` : ''),
        mobileNumber: `+91 98765${String(43210 + i).padStart(5, '0')}`,
        emailAddress: `customer${i + 1}@example.com`,
        userType: userType,
        preferredContactMethod: preferredContactMethod,
        propertyOwnerName: `Owner ${Math.floor(rand() * 20) + 1}`,
        propertyOwnerContact: `+91 87654${String(32100 + i).padStart(5, '0')}`,
        enquiryType: enquiryType,
        listingType: listingType,
        minBudget: minBudget,
        maxBudget: maxBudget,
        preferredLocation: `${area}, ${city}`,
        propertyType: propertyType,
        leadSource: leadSource,
        leadStatus: leadStatus,
        leadPriority: leadPriority,
        assignedStaff: staffNames[Math.floor(rand() * staffNames.length)],
        createdDate: createdDate.toISOString(),
        lastContacted: lastContacted.toISOString(),
        nextFollowUp: nextFollowUp.toISOString(),
        notes: `Lead generated from ${leadSource}. Customer is interested in ${propertyType} properties in ${city}. Budget range: ₹${(minBudget/100000).toFixed(1)}L - ₹${(maxBudget/100000).toFixed(1)}L.`,
        purpose: listingType === 'Buy' ? 'Purchase' : listingType === 'Rent' ? 'Rental' : listingType,
        preferredState: state,
        preferredCity: city,
        preferredArea: area,
        minArea: Math.floor(rand() * 1000) + 500,
        maxArea: Math.floor(rand() * 2000) + 1500,
        bedrooms: propertyType === 'Land & Plots' ? 0 : Math.floor(rand() * 4) + 1,
        bathrooms: propertyType === 'Land & Plots' ? 0 : Math.floor(rand() * 3) + 1,
        furnishing: FURNISHING_OPTIONS[Math.floor(rand() * FURNISHING_OPTIONS.length)],
        preferredFacing: FACING_OPTIONS[Math.floor(rand() * FACING_OPTIONS.length)],
        requiredAmenities: requiredAmenities,

        // Properties array (1 to 5 properties per lead)
        properties: Array.from({ length: Math.floor(rand() * 5) + 1 }, (_, pIdx) => {
          const propType = PROPERTY_TYPES[Math.floor(rand() * PROPERTY_TYPES.length)];
          const propCity = cities[Math.floor(rand() * cities.length)];
          const propState = states[cities.indexOf(propCity)];
          return {
            propertyType: propType,
            bedrooms: propType === 'Land & Plots' ? 0 : Math.floor(rand() * 4) + 1,
            city: propCity,
            location: `${propCity}, ${propState}`,
            mobile: `+91 98765${String(43210 + i * 5 + pIdx).padStart(5, '0')}`,
            budget: Math.floor(rand() * 5000000) + 1000000,
          };
        }),
      };
    });
  }, []);

  // ============ INITIALIZE DATA ============
  useEffect(() => {
    const mockLeads = generateMockLeads();
    setLeads(mockLeads);
    setFilteredLeads(mockLeads);
    updateStats(mockLeads);
  }, [generateMockLeads]);

  // ============ UPDATE STATS ============
  const updateStats = useCallback((leadsList) => {
    setStats({
      total: leadsList.length,
      owner: leadsList.filter(l => l.userType === 'owner').length,
      agent: leadsList.filter(l => l.userType === 'agent').length,
      builder: leadsList.filter(l => l.userType === 'builder').length,
      propertyManager: leadsList.filter(l => l.userType === 'property manager').length,
    });
  }, []);

  // ============ FILTER LEADS ============
  const filterLeads = useCallback(() => {
    let filtered = [...leads];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(l =>
        l.customerName.toLowerCase().includes(query) ||
        l.mobileNumber.includes(query) ||
        l.emailAddress.toLowerCase().includes(query) ||
        l.leadId.toLowerCase().includes(query) ||
        l.preferredLocation.toLowerCase().includes(query) ||
        l.assignedStaff.toLowerCase().includes(query)
      );
    }

    if (selectedUserType !== 'all') {
      filtered = filtered.filter(l => l.userType === selectedUserType);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(l => l.leadStatus === selectedStatus);
    }

    if (selectedPriority !== 'all') {
      filtered = filtered.filter(l => l.leadPriority === selectedPriority);
    }

    if (selectedSource !== 'all') {
      filtered = filtered.filter(l => l.leadSource === selectedSource);
    }

    if (selectedEnquiryType !== 'all') {
      filtered = filtered.filter(l => l.enquiryType === selectedEnquiryType);
    }

    let count = 0;
    if (selectedUserType !== 'all') count++;
    if (selectedStatus !== 'all') count++;
    if (selectedPriority !== 'all') count++;
    if (selectedSource !== 'all') count++;
    if (selectedEnquiryType !== 'all') count++;
    if (searchQuery) count++;
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

    setFilteredLeads(filtered);
    setCurrentPage(1);
  }, [leads, searchQuery, selectedUserType, selectedStatus, selectedPriority, selectedSource, selectedEnquiryType, sortField, sortDirection]);

  useEffect(() => {
    filterLeads();
  }, [filterLeads]);

  // ============ PAGINATION ============
  const totalPages = Math.ceil(filteredLeads.length / pageSize);
  const paginatedLeads = useMemo(() =>
    filteredLeads.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    )
  , [filteredLeads, currentPage, pageSize]);

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
    if (selectedLeads.length === paginatedLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(paginatedLeads.map(l => l.id));
    }
  }, [selectedLeads, paginatedLeads]);

  // ============ HANDLE SELECT LEAD ============
  const handleSelectLead = useCallback((leadId) => {
    setSelectedLeads(prev =>
      prev.includes(leadId) ? prev.filter(id => id !== leadId) : [...prev, leadId]
    );
  }, []);

  // ============ STAT CLICK HANDLER ============
  const handleStatClick = useCallback((filter) => {
    setActiveFilter(filter);

    if (filter === 'all') {
      setSelectedUserType('all');
    } else if (filter === 'owner') {
      setSelectedUserType('owner');
    } else if (filter === 'agent') {
      setSelectedUserType('agent');
    } else if (filter === 'builder') {
      setSelectedUserType('builder');
    } else if (filter === 'propertyManager') {
      setSelectedUserType('property manager');
    }

    setSearchQuery('');
    searchInputRef.current?.focus();
  }, []);

  // ============ CLEAR ALL FILTERS ============
  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedUserType('all');
    setSelectedStatus('all');
    setSelectedPriority('all');
    setSelectedSource('all');
    setSelectedEnquiryType('all');
    setActiveFilter('all');
    searchInputRef.current?.focus();
    showToast('All filters cleared', 'info');
  }, [showToast]);

  // ============ SHOW CONFIRMATION MODAL ============
  const showConfirmation = useCallback(({
    title,
    message,
    confirmText = 'Yes',
    cancelText = 'No',
    confirmColor = 'bg-red-500',
    icon = <FiAlertTriangle className="text-4xl text-red-500" />,
    onConfirm,
    leadId,
    action,
  }) => {
    setConfirmationModal({
      isOpen: true,
      title,
      message,
      confirmText,
      cancelText,
      confirmColor,
      icon,
      onConfirm,
      leadId,
      action,
    });
  }, []);

  // ============ CLOSE CONFIRMATION MODAL ============
  const closeConfirmation = useCallback(() => {
    setConfirmationModal(prev => ({ ...prev, isOpen: false }));
  }, []);

  // ============ HANDLE CONFIRM ACTION ============
  const handleConfirmAction = useCallback(async () => {
    const { onConfirm, leadId, action } = confirmationModal;
    if (onConfirm) {
      setActionLoading(`${action}_${leadId}`);
      await onConfirm(leadId);
      setActionLoading(null);
    }
    closeConfirmation();
  }, [confirmationModal, closeConfirmation]);

  // ============ VIEW LEAD ============
  const handleViewLead = useCallback((lead) => {
    setViewingLead(lead);
    setShowViewModal(true);
  }, []);

  // ============ EDIT LEAD ============
  const handleEditLead = useCallback((lead) => {
    setEditingLead(lead);
    setShowEditModal(true);
    setShowViewModal(false);
  }, []);

  // ============ SAVE EDIT ============
  const handleSaveEdit = useCallback((updatedData) => {
    setActionLoading('edit');
    setTimeout(() => {
      setLeads(prev => {
        const updated = prev.map(l =>
          l.id === editingLead.id ? { ...l, ...updatedData } : l
        );
        updateStats(updated);
        return updated;
      });
      setShowEditModal(false);
      setEditingLead(null);
      setActionLoading(null);
      showToast('Lead updated successfully!', 'success');
    }, 600);
  }, [editingLead, showToast, updateStats]);

  // ============ DELETE LEAD ============
  const handleDeleteLead = useCallback((leadId) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    showConfirmation({
      title: 'Delete Lead',
      message: `Are you sure you want to delete lead "${lead.customerName}" (${lead.leadId})? This action cannot be undone.`,
      confirmText: 'Yes, Delete',
      confirmColor: 'bg-red-500',
      icon: <FiTrash2 className="text-4xl text-red-500" />,
      onConfirm: (id) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            setLeads(prev => {
              const updated = prev.filter(l => l.id !== id);
              updateStats(updated);
              showToast(`Lead deleted successfully`, 'error');
              return updated;
            });
            setShowViewModal(false);
            setViewingLead(null);
            resolve();
          }, 600);
        });
      },
      leadId,
      action: 'delete',
    });
  }, [leads, showConfirmation, showToast, updateStats]);

  // ============ ASSIGN LEAD TO LEAD ============
  const handleAssignStaffToLead = useCallback((lead) => {
    setAssignStaffLead(lead);
    setShowAssignStaffModal(true);
  }, []);

  const handleAssignStaffSubmit = useCallback((leadId, staffObjects) => {
    setActionLoading(`assign_staff_${leadId}`);
    setTimeout(() => {
      setLeads(prev => {
        const updated = prev.map(lead => {
          if (lead.id === leadId) {
            const staffNames = staffObjects.map(s => s.name).join(', ');
            showToast(`${staffObjects.length} lead assigned to ${lead.customerName}`, 'success');
            return { ...lead, assignedStaff: staffNames, assignedStaffCount: staffObjects.length };
          }
          return lead;
        });
        updateStats(updated);
        return updated;
      });

      setAssignedStaffMap(prev => {
        const existing = prev[leadId] || [];
        const withDate = staffObjects.map(s => ({ ...s, assignedDate: new Date().toISOString() }));
        return { ...prev, [leadId]: [...existing, ...withDate] };
      });

      setActionLoading(null);
      setShowAssignStaffModal(false);
      setAssignStaffLead(null);
    }, 600);
  }, [showToast, updateStats]);

  // ============ VIEW ASSIGNED LEAD ============
  const handleViewAssignedStaff = useCallback((lead) => {
    setViewAssignedLead(lead);
    setShowViewAssignedModal(true);
  }, []);

  // ============ VIEW COMMISSION ============
  const handleViewCommission = useCallback((lead) => {
    setCommissionLead(lead);
    setShowCommissionModal(true);
  }, []);

  // ============ VIEW PERFORMANCE ============
  const handleViewPerformance = useCallback((lead) => {
    setPerformanceLead(lead);
    setShowPerformanceModal(true);
  }, []);

  // ============ VIEW LEAD PROPERTIES ============
  const handleViewLeadProperties = useCallback((lead) => {
    setViewPropertiesLead(lead);
    setShowViewPropertiesModal(true);
  }, []);

  // ============ VIEW LEAD PROFILE - NAVIGATE BY USER TYPE ============
  const handleViewLeadProfile = useCallback((lead) => {
    const userType = lead.userType || 'owner';
    const normalizedType = userType.toLowerCase().replace(/\s+/g, '-');
    navigate(`/profile/${normalizedType}`, {
      state: { lead, leadId: lead.id }
    });
    showToast(`Opening ${lead.customerName}'s Profile...`, 'info');
  }, [navigate, showToast]);

  // ============ BULK ACTIONS ============
  const handleBulkAction = useCallback((action) => {
    if (selectedLeads.length === 0) {
      showToast('Please select leads first', 'warning');
      return;
    }

    const actionMap = {
      delete: {
        title: 'Delete Leads',
        message: `Are you sure you want to delete ${selectedLeads.length} selected lead(s)? This action cannot be undone.`,
        confirmText: 'Yes, Delete All',
        confirmColor: 'bg-red-500',
        icon: <FiTrash2 className="text-4xl text-red-500" />,
      },
      'status-new': {
        title: 'Mark as New',
        message: `Mark ${selectedLeads.length} selected lead(s) as New?`,
        confirmText: 'Yes, Mark New',
        confirmColor: 'bg-blue-500',
        icon: <FiFlag className="text-4xl text-blue-500" />,
      },
      'status-contacted': {
        title: 'Mark as Contacted',
        message: `Mark ${selectedLeads.length} selected lead(s) as Contacted?`,
        confirmText: 'Yes, Mark Contacted',
        confirmColor: 'bg-purple-500',
        icon: <FiPhoneCall className="text-4xl text-purple-500" />,
      },
      'status-interested': {
        title: 'Mark as Interested',
        message: `Mark ${selectedLeads.length} selected lead(s) as Interested?`,
        confirmText: 'Yes, Mark Interested',
        confirmColor: 'bg-cyan-500',
        icon: <FiThumbsUp className="text-4xl text-cyan-500" />,
      },
      'status-converted': {
        title: 'Mark as Converted',
        message: `Mark ${selectedLeads.length} selected lead(s) as Converted?`,
        confirmText: 'Yes, Mark Converted',
        confirmColor: 'bg-emerald-500',
        icon: <FiCheckCircle className="text-4xl text-emerald-500" />,
      },
    };

    const config = actionMap[action];
    if (!config) return;

    showConfirmation({
      ...config,
      onConfirm: () => {
        return new Promise((resolve) => {
          setActionLoading(action);
          setTimeout(() => {
            const selectedIds = new Set(selectedLeads);
            let updatedLeads = [...leads];

            if (action === 'delete') {
              updatedLeads = updatedLeads.filter(l => !selectedIds.has(l.id));
            } else if (action.startsWith('status-')) {
              const newStatus = action.replace('status-', '');
              const statusMap = {
                'new': 'New',
                'contacted': 'Contacted',
                'interested': 'Interested',
                'converted': 'Converted',
              };
              updatedLeads = updatedLeads.map(l => {
                if (selectedIds.has(l.id)) {
                  return { ...l, leadStatus: statusMap[newStatus] || l.leadStatus };
                }
                return l;
              });
            }

            setLeads(updatedLeads);
            updateStats(updatedLeads);
            setSelectedLeads([]);
            setActionLoading(null);
            showToast(`${selectedLeads.length} lead(s) ${action === 'delete' ? 'deleted' : 'updated'} successfully`, 'success');
            resolve();
          }, 800);
        });
      },
      leadId: 'bulk',
      action: action,
    });
  }, [selectedLeads, leads, showConfirmation, showToast, updateStats]);

  // ============ REFRESH DATA ============
  const handleRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const mockLeads = generateMockLeads();
      setLeads(mockLeads);
      setFilteredLeads(mockLeads);
      updateStats(mockLeads);
      setLoading(false);
      showToast('Data refreshed successfully', 'success');
    }, 1000);
  }, [generateMockLeads, showToast, updateStats]);

  // ============ EXPORT LEADS ============
  const handleExportLeads = useCallback(() => {
    const data = filteredLeads.map(l => ({
      'Lead ID': l.leadId,
      'Customer Name': l.customerName,
      'Mobile Number': l.mobileNumber,
      'Email Address': l.emailAddress,
      'User Type': l.userType,
      'Preferred Contact Method': l.preferredContactMethod,
      'Property Owner Details': `${l.propertyOwnerName} (${l.propertyOwnerContact})`,
      'Enquiry Type': l.enquiryType,
      'Listing Type': l.listingType,
      'Min Budget': l.minBudget,
      'Max Budget': l.maxBudget,
      'Preferred Location': l.preferredLocation,
      'Property Type': l.propertyType,
      'Lead Source': l.leadSource,
      'Lead Status': l.leadStatus,
      'Lead Priority': l.leadPriority,
      'Assigned Staff': l.assignedStaff,
      'Created Date': new Date(l.createdDate).toLocaleDateString(),
      'Last Contacted': new Date(l.lastContacted).toLocaleDateString(),
      'Next Follow-Up': new Date(l.nextFollowUp).toLocaleDateString(),
      'Notes': l.notes,
    }));

    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast(`${filteredLeads.length} leads exported successfully`, 'success');
  }, [filteredLeads, showToast]);

  // ============ RENDER ============
  return (
    <div className="space-y-6 p-4 lg:p-6 bg-[#F8FAF9] min-h-screen">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
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

      <ViewLeadDetailsModal
        lead={viewingLead}
        show={showViewModal}
        onClose={() => { setShowViewModal(false); setViewingLead(null); }}
        onEdit={handleEditLead}
        onDelete={handleDeleteLead}
        onViewProperties={(lead) => {
          setShowViewModal(false);
          setViewingLead(null);
          setViewPropertiesLead(lead);
          setShowViewPropertiesModal(true);
        }}
      />

      <EditLeadModal
        lead={editingLead}
        show={showEditModal}
        onClose={() => { setShowEditModal(false); setEditingLead(null); }}
        onSave={handleSaveEdit}
        loading={actionLoading === 'edit'}
      />

      <AssignStaffModal
        lead={assignStaffLead}
        show={showAssignStaffModal}
        onClose={() => { setShowAssignStaffModal(false); setAssignStaffLead(null); }}
        onAssign={handleAssignStaffSubmit}
        loading={actionLoading !== null}
      />

      <ViewAssignedStaffModal
        lead={viewAssignedLead}
        assignedStaff={viewAssignedLead ? (assignedStaffMap[viewAssignedLead.id] || []) : []}
        show={showViewAssignedModal}
        onClose={() => { setShowViewAssignedModal(false); setViewAssignedLead(null); }}
      />

      <CommissionTrackingModal
        lead={commissionLead}
        show={showCommissionModal}
        onClose={() => { setShowCommissionModal(false); setCommissionLead(null); }}
      />

      <PerformanceReportModal
        lead={performanceLead}
        show={showPerformanceModal}
        onClose={() => { setShowPerformanceModal(false); setPerformanceLead(null); }}
      />

      <ViewLeadPropertiesModal
        lead={viewPropertiesLead}
        show={showViewPropertiesModal}
        onClose={() => { setShowViewPropertiesModal(false); setViewPropertiesLead(null); }}
        navigate={navigate}
      />

      {/* Header */}
      <div className="relative animate-fade-in">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                Lead Management
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
              <span>Manage all leads from owners, agents, builders & property managers</span>
              <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
              <span className="text-[#00695C] font-medium">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2 w-full lg:w-auto flex-wrap">
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
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-xl hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden hover:scale-105"
            >
              <span className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
              <FiRefreshCw className={`text-sm ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
              <span className="hidden sm:inline">{loading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            <button
              onClick={handleExportLeads}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8F0EE] rounded-xl hover:border-[#00695C]/30 hover:shadow-md transition-all duration-300 text-sm font-medium text-[#1A2E2A] hover:scale-105"
            >
              <FiDownload className="text-sm" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {showStats && (
        <div className="relative animate-slide-in">
          <div className="bg-white rounded-2xl p-4 border border-[#E8F0EE] shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              <StatCard
                icon={<FiUsers className="text-white text-sm" />}
                title="Total Leads"
                value={stats.total}
                color="bg-gradient-to-br from-[#00695C] to-[#26A69A]"
                delay={0}
                isActive={activeFilter === 'all'}
                onClick={() => handleStatClick('all')}
              />
              <StatCard
                icon={<HiOutlineHome className="text-white text-sm" />}
                title="Owner Leads"
                value={stats.owner}
                color="bg-gradient-to-br from-emerald-600 to-emerald-400"
                delay={100}
                isActive={activeFilter === 'owner'}
                onClick={() => handleStatClick('owner')}
              />
              <StatCard
                icon={<HiOutlineUserCircle className="text-white text-sm" />}
                title="Agent Leads"
                value={stats.agent}
                color="bg-gradient-to-br from-blue-600 to-blue-400"
                delay={200}
                isActive={activeFilter === 'agent'}
                onClick={() => handleStatClick('agent')}
              />
              <StatCard
                icon={<HiOutlineOfficeBuilding className="text-white text-sm" />}
                title="Builder Leads"
                value={stats.builder}
                color="bg-gradient-to-br from-purple-600 to-purple-400"
                delay={300}
                isActive={activeFilter === 'builder'}
                onClick={() => handleStatClick('builder')}
              />
              <StatCard
                icon={<HiOutlineUserGroup className="text-white text-sm" />}
                title="Property Manager Leads"
                value={stats.propertyManager}
                color="bg-gradient-to-br from-amber-600 to-amber-400"
                delay={400}
                isActive={activeFilter === 'propertyManager'}
                onClick={() => handleStatClick('propertyManager')}
              />
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
              placeholder="Search leads by name, mobile, email, lead ID, location, or assigned lead..."
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
            <div className="relative">
              <select
                value={selectedUserType}
                onChange={(e) => setSelectedUserType(e.target.value)}
                className="appearance-none px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none cursor-pointer pr-10 hover:bg-[#E8F0EE]"
              >
                <option value="all">All User Types</option>
                {USER_TYPES.map(t => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="appearance-none px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none cursor-pointer pr-10 hover:bg-[#E8F0EE]"
              >
                <option value="all">All Status</option>
                {LEAD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="appearance-none px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none cursor-pointer pr-10 hover:bg-[#E8F0EE]"
              >
                <option value="all">All Priority</option>
                {LEAD_PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="appearance-none px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none cursor-pointer pr-10 hover:bg-[#E8F0EE]"
              >
                <option value="all">All Sources</option>
                {LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={selectedEnquiryType}
                onChange={(e) => setSelectedEnquiryType(e.target.value)}
                className="appearance-none px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none cursor-pointer pr-10 hover:bg-[#E8F0EE]"
              >
                <option value="all">All Enquiry Types</option>
                {ENQUIRY_TYPES.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm pointer-events-none" />
            </div>

            {filterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="px-3 py-2.5 bg-[#FEF3E2] text-amber-700 rounded-xl hover:bg-[#FEE6C5] transition-all duration-300 text-sm font-medium flex items-center gap-1 hover:scale-105"
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
                <FiGrid className="text-sm" />
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
                onClick={() => handleBulkAction('status-new')}
                disabled={actionLoading === 'status-new'}
                className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50"
              >
                {actionLoading === 'status-new' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiFlag className="text-[10px]" />}
                Mark New
              </button>
              <button
                onClick={() => handleBulkAction('status-contacted')}
                disabled={actionLoading === 'status-contacted'}
                className="px-4 py-1.5 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50"
              >
                {actionLoading === 'status-contacted' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiPhoneCall className="text-[10px]" />}
                Mark Contacted
              </button>
              <button
                onClick={() => handleBulkAction('status-interested')}
                disabled={actionLoading === 'status-interested'}
                className="px-4 py-1.5 bg-cyan-50 text-cyan-700 rounded-xl hover:bg-cyan-100 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50"
              >
                {actionLoading === 'status-interested' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiThumbsUp className="text-[10px]" />}
                Mark Interested
              </button>
              <button
                onClick={() => handleBulkAction('status-converted')}
                disabled={actionLoading === 'status-converted'}
                className="px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50"
              >
                {actionLoading === 'status-converted' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiCheckCircle className="text-[10px]" />}
                Mark Converted
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                disabled={actionLoading === 'delete'}
                className="px-4 py-1.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-300 text-xs font-medium flex items-center gap-1 hover:scale-105 disabled:opacity-50"
              >
                {actionLoading === 'delete' ? <FiRefreshCw className="text-[10px] animate-spin" /> : <FiTrash2 className="text-[10px]" />}
                Delete
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

      {/* Leads Grid */}
      <div className="relative">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00695C]/20 border-t-[#00695C] rounded-full animate-spin" />
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {paginatedLeads.map((lead, index) => {
              const isSelected = selectedLeads.includes(lead.id);
              const assignedCount = (assignedStaffMap[lead.id] || []).length;

              return (
                <div
                  key={lead.id}
                  className={`relative bg-white rounded-2xl border border-[#E8F0EE] border-l-4 ${STATUS_BORDER[lead.leadStatus] || 'border-l-[#00695C]'} p-4 hover:shadow-xl hover:-translate-y-1 group animate-slide-in transition-all duration-500 ${isSelected ? 'ring-2 ring-[#00695C] shadow-lg' : ''}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectLead(lead.id)}
                        className="w-4 h-4 shrink-0 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
                      />
                      <div className="relative">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white text-xl font-bold shadow-lg">
                          {lead.customerName.charAt(0)}
                        </div>
                        {lead.leadPriority && (
                          <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                            lead.leadPriority === 'Hot' ? 'bg-red-500' :
                            lead.leadPriority === 'Warm' ? 'bg-amber-500' : 'bg-blue-500'
                          } text-white border-2 border-white`}>
                            {lead.leadPriority === 'Hot' ? '🔥' : lead.leadPriority === 'Warm' ? '☀️' : '❄️'}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-[#1A2E2A] text-sm truncate">{lead.customerName}</h3>
                        <div className="flex items-center gap-1 mt-1 flex-wrap">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${STATUS_COLORS[lead.leadStatus] || 'bg-gray-100 text-gray-700'}`}>
                            {lead.leadStatus}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${USER_TYPE_COLORS[lead.userType] || 'bg-gray-100 text-gray-700'}`}>
                            {lead.userType?.charAt(0).toUpperCase() + lead.userType?.slice(1)}
                          </span>
                          {lead.leadPriority && (
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium flex items-center gap-0.5 ${PRIORITY_COLORS[lead.leadPriority] || 'bg-gray-100 text-gray-700'}`}>
                              {PRIORITY_ICONS[lead.leadPriority]}
                              {lead.leadPriority}
                            </span>
                          )}
                          {lead.leadSource && (
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${SOURCE_COLORS[lead.leadSource] || 'bg-gray-100 text-gray-700'}`}>
                              {lead.leadSource}
                            </span>
                          )}
                          {lead.enquiryType && (
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${ENQUIRY_COLORS[lead.enquiryType] || 'bg-gray-100 text-gray-700'}`}>
                              {lead.enquiryType?.replace(' Enquiry', '')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleViewLead(lead)}
                      className="w-7 h-7 rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#00695C] hover:scale-110 shrink-0"
                      title="View Details"
                    >
                      <FiEye className="text-sm" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiPhone className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{lead.mobileNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiMail className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{lead.emailAddress}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiMapPin className="text-[#00695C] flex-shrink-0" />
                      <span className="truncate">{lead.preferredLocation}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiTag className="text-[#00695C] flex-shrink-0" />
                      <span>{lead.propertyType}</span>
                      <span className="text-[#B5C9C5]">·</span>
                      <span>{lead.listingType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#5A7D78]">
                      <FiUser className="text-[#00695C] flex-shrink-0" />
                      <span>{lead.assignedStaff}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#E8F0EE]">
                    <div className="text-center">
                      <p className="text-sm font-bold text-[#1A2E2A]">₹{(lead.minBudget / 100000).toFixed(1)}L - ₹{(lead.maxBudget / 100000).toFixed(1)}L</p>
                      <p className="text-[8px] text-[#5A7D78] uppercase tracking-wider">Budget</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-[#00695C]">{new Date(lead.createdDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                      <p className="text-[8px] text-[#5A7D78] uppercase tracking-wider">Created</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-[#E8F0EE]">
                    <button
                      onClick={() => handleAssignStaffToLead(lead)}
                      className="flex-1 py-1.5 text-[10px] font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiUserCheck className="text-[10px]" /> Assign Lead
                    </button>
                    <button
                      onClick={() => handleViewAssignedStaff(lead)}
                      className="flex-1 py-1.5 text-[10px] font-medium text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105 relative"
                    >
                      <FiEye className="text-[10px]" /> Assigned
                      {assignedCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-indigo-600 text-white text-[8px] flex items-center justify-center font-semibold">
                          {assignedCount}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => handleViewCommission(lead)}
                      className="flex-1 py-1.5 text-[10px] font-medium text-amber-600 bg-amber-50 rounded-xl hover:bg-amber-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiDollarSign className="text-[10px]" /> Commission
                    </button>
                    <button
                      onClick={() => handleViewPerformance(lead)}
                      className="flex-1 py-1.5 text-[10px] font-medium text-purple-600 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiBarChart2 className="text-[10px]" /> Performance
                    </button>
                    <button
                      onClick={() => handleViewLeadProperties(lead)}
                      className="flex-1 py-1.5 text-[10px] font-medium text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiHome className="text-[10px]" /> Properties
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    <button
                      onClick={() => handleViewLeadProfile(lead)}
                      className="flex-1 py-1.5 text-[10px] font-medium text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiExternalLink className="text-[10px]" /> View Profile
                    </button>
                    <button
                      onClick={() => handleViewLead(lead)}
                      className="flex-1 py-1.5 text-[10px] font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiEye className="text-[10px]" /> View
                    </button>
                    <button
                      onClick={() => handleEditLead(lead)}
                      className="flex-1 py-1.5 text-[10px] font-medium text-amber-600 bg-amber-50 rounded-xl hover:bg-amber-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiEdit className="text-[10px]" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteLead(lead.id)}
                      className="flex-1 py-1.5 text-[10px] font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105"
                    >
                      <FiTrash2 className="text-[10px]" /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View */
<div className="bg-white rounded-2xl border border-[#E8F0EE] shadow-sm overflow-hidden">
  {/* Header */}
  <div className="grid grid-cols-12 gap-2 items-center px-4 py-3 bg-[#F5F9F8] border-b border-[#E8F0EE] text-xs font-medium text-[#5A7D78] uppercase tracking-wider">
    <div className="col-span-1 flex items-center gap-2">
      <input
        type="checkbox"
        checked={selectedLeads.length === paginatedLeads.length && paginatedLeads.length > 0}
        onChange={handleSelectAll}
        className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
      />
      <span>#</span>
    </div>
    <div className="col-span-2 cursor-pointer hover:text-[#00695C] transition-colors" onClick={() => handleSort('customerName')}>
      Customer {sortField === 'customerName' && <span className="text-[#00695C]">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
    </div>
    <div className="col-span-1">User Type</div>
    <div className="col-span-1">Status</div>
    <div className="col-span-1">Priority</div>
    <div className="col-span-1">Source</div>
    <div className="col-span-1">Enquiry</div>
    <div className="col-span-1">Property</div>
    <div className="col-span-1">Location</div>
    <div className="col-span-1 text-center">Budget</div>
    <div className="col-span-1 text-right">Actions</div>
  </div>

  {paginatedLeads.map((lead, index) => {
    const isSelected = selectedLeads.includes(lead.id);
    const assignedCount = (assignedStaffMap[lead.id] || []).length;

    return (
      <div
        key={lead.id}
        className={`grid grid-cols-12 gap-2 items-center py-3 px-4 border-b border-[#E8F0EE] border-l-4 ${STATUS_BORDER[lead.leadStatus] || 'border-l-[#00695C]'} hover:bg-[#F5F9F8] transition-all duration-300 group ${isSelected ? 'bg-[#E8F4F2]' : ''}`}
      >
        {/* Checkbox + Index */}
        <div className="col-span-1 flex items-center gap-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => handleSelectLead(lead.id)}
            className="w-4 h-4 rounded border-[#B5C9C5] text-[#00695C] focus:ring-[#00695C] focus:ring-2 transition-all duration-300"
          />
          <span className="text-xs text-[#5A7D78]">{index + 1}</span>
        </div>

        {/* Customer */}
        <div className="col-span-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white text-xs font-bold shrink-0">
              {lead.customerName.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-[#1A2E2A] truncate">{lead.customerName}</p>
              <p className="text-[10px] text-[#5A7D78] truncate">{lead.mobileNumber}</p>
            </div>
          </div>
        </div>

        {/* User Type */}
        <div className="col-span-1">
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium inline-block truncate max-w-full ${USER_TYPE_COLORS[lead.userType] || 'bg-gray-100 text-gray-700'}`}>
            {lead.userType?.charAt(0).toUpperCase() + lead.userType?.slice(1)}
          </span>
        </div>

        {/* Status */}
        <div className="col-span-1">
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium inline-block truncate max-w-full ${STATUS_COLORS[lead.leadStatus] || 'bg-gray-100 text-gray-700'}`}>
            {lead.leadStatus}
          </span>
        </div>

        {/* Priority */}
        <div className="col-span-1">
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1 w-fit ${PRIORITY_COLORS[lead.leadPriority] || 'bg-gray-100 text-gray-700'}`}>
            {PRIORITY_ICONS[lead.leadPriority]}
            {lead.leadPriority}
          </span>
        </div>

        {/* Source */}
        <div className="col-span-1">
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium inline-block truncate max-w-full ${SOURCE_COLORS[lead.leadSource] || 'bg-gray-100 text-gray-700'}`}>
            {lead.leadSource}
          </span>
        </div>

        {/* Enquiry */}
        <div className="col-span-1">
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium inline-block truncate max-w-full ${ENQUIRY_COLORS[lead.enquiryType] || 'bg-gray-100 text-gray-700'}`}>
            {lead.enquiryType?.replace(' Enquiry', '') || 'N/A'}
          </span>
        </div>

        {/* Property */}
        <div className="col-span-1 text-xs text-[#5A7D78] truncate">{lead.propertyType}</div>

        {/* Location */}
        <div className="col-span-1 text-xs text-[#5A7D78] truncate">{lead.preferredLocation}</div>

        {/* Budget */}
        <div className="col-span-1 text-center text-xs font-semibold text-[#00695C]">
          ₹{(lead.minBudget / 100000).toFixed(1)}L - ₹{(lead.maxBudget / 100000).toFixed(1)}L
        </div>

        {/* Actions - Single Line, No Wrap */}
        <div className="col-span-1 flex items-center justify-end gap-1 flex-wrap overflow-visible">
          <button
            onClick={() => handleAssignStaffToLead(lead)}
            className="p-0.5 rounded hover:bg-blue-50 transition-all duration-300 text-blue-600 hover:scale-110 shrink-0"
            title="Assign Lead"
          >
            <FiUserCheck className="text-[12px]" />
          </button>
          <button
            onClick={() => handleViewAssignedStaff(lead)}
            className="p-0.5 rounded hover:bg-indigo-50 transition-all duration-300 text-indigo-600 hover:scale-110 relative shrink-0"
            title="View Assigned Lead"
          >
            <FiEye className="text-[12px]" />
            {assignedCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-indigo-600 text-white text-[6px] flex items-center justify-center font-semibold">
                {assignedCount}
              </span>
            )}
          </button>
          <button
            onClick={() => handleViewCommission(lead)}
            className="p-0.5 rounded hover:bg-amber-50 transition-all duration-300 text-amber-600 hover:scale-110 shrink-0"
            title="Commission"
          >
            <FiDollarSign className="text-[12px]" />
          </button>
          <button
            onClick={() => handleViewPerformance(lead)}
            className="p-0.5 rounded hover:bg-purple-50 transition-all duration-300 text-purple-600 hover:scale-110 shrink-0"
            title="Performance"
          >
            <FiBarChart2 className="text-[12px]" />
          </button>
          <button
            onClick={() => handleViewLeadProperties(lead)}
            className="p-0.5 rounded hover:bg-[#E8F4F2] transition-all duration-300 text-[#00695C] hover:scale-110 shrink-0"
            title="Properties"
          >
            <FiHome className="text-[12px]" />
          </button>
          <button
            onClick={() => handleViewLeadProfile(lead)}
            className="p-0.5 rounded hover:bg-[#E8F4F2] transition-all duration-300 text-[#00695C] hover:scale-110 shrink-0"
            title="View Profile"
          >
            <FiExternalLink className="text-[12px]" />
          </button>
          <button
            onClick={() => handleViewLead(lead)}
            className="p-0.5 rounded hover:bg-blue-50 transition-all duration-300 text-blue-600 hover:scale-110 shrink-0"
            title="View Details"
          >
            <FiEye className="text-[12px]" />
          </button>
          <button
            onClick={() => handleEditLead(lead)}
            className="p-0.5 rounded hover:bg-amber-50 transition-all duration-300 text-amber-600 hover:scale-110 shrink-0"
            title="Edit"
          >
            <FiEdit className="text-[12px]" />
          </button>
          <button
            onClick={() => handleDeleteLead(lead.id)}
            disabled={actionLoading === `delete_${lead.id}`}
            className="p-0.5 rounded hover:bg-red-50 transition-all duration-300 text-red-500 hover:scale-110 disabled:opacity-50 shrink-0"
            title="Delete"
          >
            {actionLoading === `delete_${lead.id}` ? (
              <FiRefreshCw className="text-[11px] animate-spin" />
            ) : (
              <FiTrash2 className="text-[12px]" />
            )}
          </button>
        </div>
      </div>
    );
  })}
</div>
        )}

        {paginatedLeads.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E8F0EE]">
            <div className="w-24 h-24 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4 animate-float">
              <FiUsers className="text-4xl text-[#B5C9C5]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1A2E2A]">No leads found</h3>
            <p className="text-sm text-[#5A7D78] mt-1">
              {filterCount > 0 ? 'Try adjusting your search or filter criteria' : 'No leads match your current view'}
            </p>
            {filterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="mt-4 px-6 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#00695C]/30 hover:scale-105"
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
            <span>
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, filteredLeads.length)} of{' '}
              {filteredLeads.length} leads
            </span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="ml-2 px-2 py-1 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] text-sm text-[#1A2E2A] outline-none focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300"
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
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-9 h-9 rounded-xl transition-all duration-300 text-sm font-medium hover:scale-110 ${
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
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(10px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
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

export default LeadManagement;