// src/components/dashboard/admin/superadmin/VerificationManagement.jsx

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  FiUsers, FiUser, FiUserPlus, FiUserCheck, FiUserX, FiSearch,
  FiChevronDown, FiChevronLeft, FiChevronRight, FiEye,
  FiTrash2, FiLock, FiUnlock, FiCheckCircle, FiXCircle, FiClock,
  FiMail, FiPhone, FiMapPin, FiCalendar, FiShield, FiActivity,
  FiRefreshCw, FiDownload, FiInfo, FiAlertTriangle, FiPlus,
  FiExternalLink, FiGrid, FiList, FiX, FiAward, FiBriefcase,
  FiHome, FiDollarSign, FiSquare, FiMinimize, FiTrendingUp,
  FiArrowUp, FiArrowDown, FiPercent, FiLayers, FiMap, FiPieChart,
  FiBarChart2, FiGlobe, FiZap, FiBox, FiClipboard, FiFileText,
  FiPackage, FiCreditCard, FiSave, FiTool, FiRotateCcw,
  FiCheckSquare, FiPlayCircle, FiEdit3, FiDatabase, FiFilter,
  FiDownloadCloud, FiUploadCloud, FiZoomIn, FiZoomOut, FiRotateCw,
  FiPaperclip, FiHash, FiFolder, FiInbox, FiSend
} from 'react-icons/fi';
import {
  FaHome, FaHardHat, FaCheck, FaStar as FaStarSolid, FaCrown,
  FaGem, FaHotel, FaBriefcase, FaIdCard, FaFileAlt,
  FaCertificate, FaShieldAlt, FaBuilding, FaUserTie
} from 'react-icons/fa';
import { MdVerified, MdBusiness, MdOutlineAssignment } from 'react-icons/md';

// ============================================================
// CONSTANTS
// ============================================================
const UNIQUE_COLORS = [
  '#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899',
  '#06B6D4', '#EF4444', '#84CC16', '#F97316', '#6366F1',
  '#14B8A6', '#A855F7', '#EAB308', '#0EA5E9', '#F43F5E'
];

const PLAN_COLORS = {
  'Free': {
    containerBg: '#F8FAFC', containerBorder: '#E2E8F0',
    iconBg: '#FFFFFF', iconColor: '#475569',
    badgeBg: '#FFFFFF', badgeBorder: '#CBD5E1', badgeText: '#334155',
    activeBorder: '#CBD5E1', activeText: '#475569', activeBg: '#F1F5F9',
    icon: FiPackage
  },
  'Silver': {
    containerBg: '#F0F9FF', containerBorder: '#BAE6FD',
    iconBg: '#FFFFFF', iconColor: '#0284C7',
    badgeBg: '#FFFFFF', badgeBorder: '#7DD3FC', badgeText: '#0369A1',
    activeBorder: '#7DD3FC', activeText: '#0284C7', activeBg: '#E0F2FE',
    icon: FiAward
  },
  'Gold': {
    containerBg: '#FFFBEB', containerBorder: '#FDE68A',
    iconBg: '#FFFFFF', iconColor: '#D97706',
    badgeBg: '#FFFFFF', badgeBorder: '#FCD34D', badgeText: '#B45309',
    activeBorder: '#FCD34D', activeText: '#D97706', activeBg: '#FEF3C7',
    icon: FaCrown
  },
  'Platinum': {
    containerBg: '#F5F3FF', containerBorder: '#DDD6FE',
    iconBg: '#FFFFFF', iconColor: '#7C3AED',
    badgeBg: '#FFFFFF', badgeBorder: '#C4B5FD', badgeText: '#6D28D9',
    activeBorder: '#C4B5FD', activeText: '#7C3AED', activeBg: '#EDE9FE',
    icon: FaGem
  },
  'Basic': {
    containerBg: '#EFF6FF', containerBorder: '#BFDBFE',
    iconBg: '#FFFFFF', iconColor: '#2563EB',
    badgeBg: '#FFFFFF', badgeBorder: '#93C5FD', badgeText: '#1D4ED8',
    activeBorder: '#93C5FD', activeText: '#2563EB', activeBg: '#DBEAFE',
    icon: FiPackage
  },
  'Professional': {
    containerBg: '#EEF2FF', containerBorder: '#C7D2FE',
    iconBg: '#FFFFFF', iconColor: '#4F46E5',
    badgeBg: '#FFFFFF', badgeBorder: '#A5B4FC', badgeText: '#4338CA',
    activeBorder: '#A5B4FC', activeText: '#4F46E5', activeBg: '#E0E7FF',
    icon: FiAward
  },
  'Enterprise': {
    containerBg: '#FDF2F8', containerBorder: '#FBCFE8',
    iconBg: '#FFFFFF', iconColor: '#DB2777',
    badgeBg: '#FFFFFF', badgeBorder: '#F9A8D4', badgeText: '#BE185D',
    activeBorder: '#F9A8D4', activeText: '#DB2777', activeBg: '#FCE7F3',
    icon: FaGem
  },
  'Premium': {
    containerBg: '#FFF7ED', containerBorder: '#FED7AA',
    iconBg: '#FFFFFF', iconColor: '#EA580C',
    badgeBg: '#FFFFFF', badgeBorder: '#FDBA74', badgeText: '#C2410C',
    activeBorder: '#FDBA74', activeText: '#EA580C', activeBg: '#FFEDD5',
    icon: FaCrown
  },
  'Standard': {
    containerBg: '#F0FDFA', containerBorder: '#99F6E4',
    iconBg: '#FFFFFF', iconColor: '#0D9488',
    badgeBg: '#FFFFFF', badgeBorder: '#5EEAD4', badgeText: '#0F766E',
    activeBorder: '#5EEAD4', activeText: '#0D9488', activeBg: '#CCFBF1',
    icon: FiPackage
  },
  'Business': {
    containerBg: '#ECFEFF', containerBorder: '#A5F3FC',
    iconBg: '#FFFFFF', iconColor: '#0891B2',
    badgeBg: '#FFFFFF', badgeBorder: '#67E8F9', badgeText: '#0E7490',
    activeBorder: '#67E8F9', activeText: '#0891B2', activeBg: '#CFFAFE',
    icon: FiAward
  }
};

const getPlanStyle = (planName) => PLAN_COLORS[planName] || {
  containerBg: '#F8FAFC', containerBorder: '#E2E8F0',
  iconBg: '#FFFFFF', iconColor: '#475569',
  badgeBg: '#FFFFFF', badgeBorder: '#CBD5E1', badgeText: '#334155',
  activeBorder: '#CBD5E1', activeText: '#475569', activeBg: '#F1F5F9',
  icon: FiPackage
};

// ============================================================
// USER TYPE CONFIG
// ============================================================
const USER_TYPE_CONFIG = {
  'Owner': {
    icon: FaHome,
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    gradient: 'from-emerald-800 to-teal-600',
    color: '#10B981',
    description: 'Property owners who list and manage their properties',
    docTypes: [
      { key: 'aadhaar', label: 'Aadhaar Card', icon: FaIdCard, required: true },
      { key: 'pan', label: 'PAN Card', icon: FaFileAlt, required: true },
      { key: 'gst', label: 'GST Certificate', icon: FaCertificate, required: false }
    ]
  },
  'Agent': {
    icon: FiBriefcase,
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    gradient: 'from-blue-600 via-blue-500 to-indigo-400',
    color: '#3B82F6',
    description: 'Real estate agents who connect buyers and sellers',
    docTypes: [
      { key: 'aadhaar', label: 'Aadhaar Card', icon: FaIdCard, required: true },
      { key: 'pan', label: 'PAN Card', icon: FaFileAlt, required: true },
      { key: 'gst', label: 'GST Certificate', icon: FaCertificate, required: false },
      { key: 'agent_license', label: 'Agent License', icon: FiAward, required: true },
      { key: 'business_reg', label: 'Business Registration Certificate', icon: MdBusiness, required: false }
    ]
  },
  'Builder': {
    icon: FaHardHat,
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    gradient: 'from-orange-600 via-orange-500 to-amber-400',
    color: '#F97316',
    description: 'Builders who construct and sell new properties',
    docTypes: [
      { key: 'aadhaar', label: 'Aadhaar Card', icon: FaIdCard, required: true },
      { key: 'pan', label: 'PAN Card', icon: FaFileAlt, required: true },
      { key: 'company_pan', label: 'Company PAN Card', icon: FaBuilding, required: true },
      { key: 'company_reg', label: 'Company Registration Certificate', icon: FaCertificate, required: true },
      { key: 'gst', label: 'GST Certificate', icon: FiFileText, required: false },
      { key: 'business_address', label: 'Business Address Proof', icon: FiMapPin, required: true }
    ]
  },
  'Property Manager': {
    icon: FiClipboard,
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    gradient: 'from-purple-600 via-purple-500 to-violet-400',
    color: '#8B5CF6',
    description: 'Managers who handle property management services',
    docTypes: [
      { key: 'aadhaar', label: 'Aadhaar Card', icon: FaIdCard, required: true },
      { key: 'pan', label: 'PAN Card', icon: FaFileAlt, required: true },
      { key: 'company_pan', label: 'Company PAN Card', icon: FaBuilding, required: true },
      { key: 'company_reg', label: 'Company Registration Certificate', icon: FaCertificate, required: true },
      { key: 'gst', label: 'GST Certificate', icon: FiFileText, required: false },
      { key: 'business_address', label: 'Business Address Proof', icon: FiMapPin, required: true }
    ]
  },
  'Buyer': {
    icon: FiUser,
    bg: 'bg-cyan-50',
    text: 'text-cyan-700',
    border: 'border-cyan-200',
    gradient: 'from-cyan-600 via-cyan-500 to-sky-400',
    color: '#06B6D4',
    description: 'Buyers looking to purchase properties',
    docTypes: [
      { key: 'aadhaar', label: 'Aadhaar Card', icon: FaIdCard, required: true },
      { key: 'pan', label: 'PAN Card', icon: FaFileAlt, required: true },
      { key: 'address', label: 'Address Proof', icon: FiMapPin, required: true },
      { key: 'income', label: 'Income Proof', icon: FiDollarSign, required: true }
    ]
  },
  'Tenant': {
    icon: FiUsers,
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    gradient: 'from-rose-600 via-rose-500 to-pink-400',
    color: '#EC4899',
    description: 'Tenants renting properties',
    docTypes: [
      { key: 'aadhaar', label: 'Aadhaar Card', icon: FaIdCard, required: true },
      { key: 'pan', label: 'PAN Card', icon: FaFileAlt, required: true },
      { key: 'address', label: 'Address Proof', icon: FiMapPin, required: true },
      { key: 'income', label: 'Income Proof', icon: FiDollarSign, required: true }
    ]
  }
};

const ALL_USER_TYPES = Object.keys(USER_TYPE_CONFIG);

const PLANS_BY_USER_TYPE = {
  'Owner': ['Free', 'Silver', 'Gold', 'Platinum'],
  'Agent': ['Basic', 'Professional', 'Enterprise'],
  'Builder': ['Basic', 'Premium', 'Enterprise'],
  'Property Manager': ['Standard', 'Business', 'Enterprise'],
  'Buyer': ['Basic'],
  'Tenant': ['Basic']
};

const STATUS_BORDER = {
  pending: 'border-l-amber-500',
  approved: 'border-l-emerald-500',
  rejected: 'border-l-red-500',
  suspended: 'border-l-gray-500',
  blocked: 'border-l-gray-400'
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
const formatCompact = (amount) => {
  const num = Number(amount || 0);
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num}`;
};
const formatDate = (date) => {
  try {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  } catch { return 'N/A'; }
};
const getDateRangeLabel = (preset, customStart, customEnd) => {
  if (preset === 'custom') return `${formatDate(customStart)} - ${formatDate(customEnd)}`;
  return DATE_RANGE_PRESETS.find(p => p.id === preset)?.label || 'Select Range';
};

// ============================================================
// FILE TYPE HELPERS
// ============================================================
const isImageFile = (url = '', mime = '') => {
  if (mime) return mime.startsWith('image/');
  return /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(url);
};

const isPdfFile = (url = '', mime = '') => {
  if (mime) return mime === 'application/pdf';
  return /\.pdf$/i.test(url);
};

const getFileKind = (doc) => {
  if (doc?.fileType === 'image' || doc?.fileType === 'pdf') return doc.fileType;
  if (isPdfFile(doc?.url, doc?.mimeType)) return 'pdf';
  if (isImageFile(doc?.url, doc?.mimeType)) return 'image';
  return 'unknown';
};

// ============================================================
// 🔒 FORCE DOWNLOAD HELPER
// ============================================================
const EXT_BY_MIME = {
  'application/pdf': 'pdf',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/bmp': 'bmp',
  'image/svg+xml': 'svg',
  'image/tiff': 'tiff',
};

const extFromUrl = (url = '') => {
  const m = url.split('?')[0].match(/\.([a-z0-9]+)$/i);
  if (!m) return null;
  const e = m[1].toLowerCase();
  return EXT_BY_MIME[`image/${e}`] || (e === 'pdf' ? 'pdf' : e);
};

const extFromMime = (mime = '') => {
  if (!mime) return null;
  const m = mime.split(';')[0].trim().toLowerCase();
  return EXT_BY_MIME[m] || null;
};

const buildDownloadFilename = (doc, resolvedExt) => {
  const ext =
    resolvedExt ||
    extFromMime(doc.mimeType) ||
    extFromUrl(doc.url) ||
    (getFileKind(doc) === 'pdf' ? 'pdf' : 'jpg');

  const safeLabel = (doc.label || 'document').replace(/[^a-z0-9]+/gi, '_').toLowerCase();
  const safeNumber = (doc.number || doc.id || '').replace(/[^a-z0-9]+/gi, '_');
  return `${safeLabel}_${safeNumber}.${ext}`;
};

const triggerBlobDownload = (blob, filename) => {
  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename;
  link.rel = 'noopener';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1500);
};

const toProxiedUrl = (url) => {
  if (!url) return url;
  if (!/^https?:\/\//i.test(url)) return url;
  const bare = url.replace(/^https?:\/\//i, '');
  return `https://images.weserv.nl/?url=${encodeURIComponent(bare)}&n=-1`;
};

const downloadFile = async (doc, showToast) => {
  if (!doc?.url) {
    if (showToast) showToast('File URL missing', 'error');
    return;
  }

  if (showToast) showToast(`Downloading ${doc.label}...`, 'info');

  try {
    const res = await fetch(doc.url, { mode: 'cors', credentials: 'omit' });
    if (res.ok) {
      const mime = res.headers.get('content-type') || '';
      const blob = await res.blob();
      const ext = extFromMime(mime) || extFromUrl(doc.url) || 'bin';
      triggerBlobDownload(blob, buildDownloadFilename(doc, ext));
      if (showToast) showToast(`Downloaded ${doc.label}`, 'success');
      return;
    }
  } catch (_) { /* CORS / network → fall through */ }

  try {
    const res = await fetch(toProxiedUrl(doc.url), { mode: 'cors', credentials: 'omit' });
    if (res.ok) {
      const mime = res.headers.get('content-type') || '';
      const blob = await res.blob();
      const ext =
        extFromMime(mime) ||
        extFromUrl(doc.url) ||
        (getFileKind(doc) === 'pdf' ? 'pdf' : 'jpg');
      triggerBlobDownload(blob, buildDownloadFilename(doc, ext));
      if (showToast) showToast(`Downloaded ${doc.label}`, 'success');
      return;
    }
  } catch (_) { /* fall through */ }

  const link = document.createElement('a');
  link.href = doc.url;
  link.download = buildDownloadFilename(doc);
  link.rel = 'noopener';
  link.target = '_self';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  if (showToast) showToast(`Downloading ${doc.label}...`, 'info');
};

// ============================================================
// SEEDED RANDOM
// ============================================================
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

// ============================================================
// GENERATE VERIFICATION DOCS
//   ✅ STATUS_MAP removed
//   ✅ Required docs → always included for every user
//   ✅ Optional docs  → only included if user uploaded (kyc[key] === true)
//   ✅ Every uploaded doc → random status (60% verified / 25% pending / 15% rejected)
// ============================================================
const generateVerificationDocs = (user) => {
  const config = USER_TYPE_CONFIG[user.type];
  if (!config) return [];

  const TEST_IMAGES = [
    'https://picsum.photos/seed/aadhaar_img/800/600',
    'https://picsum.photos/seed/address_img/800/600',
    'https://picsum.photos/seed/biz_address_img/800/600',
    'https://picsum.photos/seed/doc_a/800/600',
    'https://picsum.photos/seed/doc_b/800/600',
    'https://picsum.photos/seed/doc_c/800/600',
  ];

  const TEST_PDFS = [
    'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
    'https://www.orimi.com/pdf-test.pdf',
  ];

  const FILE_TYPE_MAP = {
    aadhaar: 'image',
    address: 'image',
    business_address: 'image',
    pan: 'pdf',
    gst: 'pdf',
    company_pan: 'pdf',
    company_reg: 'pdf',
    agent_license: 'pdf',
    business_reg: 'pdf',
    income: 'pdf',
  };

  const rand = seededRandom(seedFromString(user.id + '_docs'));

  return config.docTypes
    // ✅ STEP 1: only include required docs + uploaded optional docs
    .filter((doc) => {
      const isRequired = doc.required !== false;
      if (isRequired) return true;
      return user.kyc[doc.key] === true;
    })
    // ✅ STEP 2: random status for each included doc
    .map((doc, idx) => {
      const fileType =
        FILE_TYPE_MAP[doc.key] !== undefined
          ? FILE_TYPE_MAP[doc.key]
          : rand() < 0.5
          ? 'pdf'
          : 'image';

      const roll = rand();
      let status;
      if (roll < 0.6) {
        status = 'approved'; // 60%
      } else if (roll < 0.85) {
        status = 'pending';  // 25%
      } else {
        status = 'rejected'; // 15%
      }

      const url =
        fileType === 'pdf'
          ? TEST_PDFS[idx % TEST_PDFS.length]
          : TEST_IMAGES[idx % TEST_IMAGES.length];

      return {
        id: `${user.id}_${doc.key}`,
        key: doc.key,
        label: doc.label,
        icon: doc.icon,
        required: doc.required !== false,
        number:
          doc.key === 'rera'
            ? `RERA/${(user.state || 'XX').slice(0, 2).toUpperCase()}/${2020 + idx}/${10000 + idx}`
            : doc.key === 'gst'
            ? `22ABCDE${1000 + idx}1Z5`
            : doc.key === 'pan'
            ? `ABCDE${1000 + idx}F`
            : doc.key === 'aadhaar'
            ? `XXXX XXXX ${1000 + idx}`
            : doc.key === 'agent_license'
            ? `AGL/${2020 + idx}/${50000 + idx}`
            : doc.key === 'business_reg'
            ? `BR/${2020 + idx}/${70000 + idx}`
            : doc.key === 'company_pan'
            ? `AABCC${1000 + idx}D`
            : doc.key === 'company_reg'
            ? `CIN/U${2020 + idx}/PLC/${100000 + idx}`
            : doc.key === 'business_address'
            ? `ADDR/${100000 + idx}`
            : doc.key === 'address'
            ? `ADDR-${100000 + idx}`
            : doc.key === 'income'
            ? `INC-${100000 + idx}`
            : `${doc.key.toUpperCase()}-${100000 + idx}`,
        url,
        fileType,
        status,
        uploadedAt: new Date(
          Date.now() - Math.floor(rand() * 30) * 24 * 60 * 60 * 1000
        ).toISOString(),
      };
    });
};

// ============================================================
// KYC VERIFICATION HELPER
// ============================================================
const isUserKycVerified = (user) => {
  if (!user) return false;
  const docs = generateVerificationDocs(user);
  if (docs.length === 0) return false;
  return docs.every(d => d.status === 'approved');
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
// MOCK USERS GENERATOR
//   ✅ Required docs → ~85% users upload
//   ✅ Optional docs → ~50% users upload (ellarukum illa)
// ============================================================
const generateMockUsers = (type, count = 20, dateRange = 'month', customStart, customEnd) => {
  const firstNames = ['Rajesh', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Ananya', 'Deepak', 'Meera', 'Ravi', 'Kavya', 'Suresh', 'Pooja', 'Arjun', 'Lakshmi', 'Kiran', 'Mohan', 'Ritu', 'Gautam', 'Nisha', 'Tarun'];
  const lastNames = ['Kumar', 'Sharma', 'Singh', 'Patel', 'Reddy', 'Gupta', 'Verma', 'Joshi', 'Malhotra', 'Mehta', 'Nair', 'Pillai', 'Rao', 'Shetty', 'Agarwal', 'Khanna', 'Chopra', 'Saxena', 'Tiwari', 'Desai'];
  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Nagpur', 'Kolkata', 'Surat', 'Indore'];
  const states = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Gujarat', 'Rajasthan', 'West Bengal', 'Kerala'];
  const statuses = ['pending', 'approved', 'rejected', 'blocked'];
  const plans = PLANS_BY_USER_TYPE[type] || ['Basic'];
  const companies = ['ABC Realty', 'Dream Homes', 'Green Valley', 'Luxury Living', 'Urban Estate', 'Prime Properties', 'Elite Homes', 'Royal Estate'];
  const agencies = ['Skyline Realty', 'Trust Estates', 'Coastal Properties', 'Metro Housing', 'NextGen Realty', 'Golden Key Estates'];
  const builderCompanies = ['Shree Construction', 'BuildWell Developers', 'Green Valley Builders', 'Urban Homes Group', 'Premier Estates Ltd'];
  const pmCompanies = ['Prestige Property Management', 'Golden Gate Realty', 'Urban Nest Solutions', 'Elite Estate Managers'];

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

  return Array.from({ length: count }, (_, i) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const date = new Date();

    if (dateRange === 'today') {
      date.setHours(Math.floor(Math.random() * 24));
    } else if (dateRange === 'yesterday') {
      date.setDate(date.getDate() - 1);
      date.setHours(Math.floor(Math.random() * 24));
    } else {
      date.setDate(date.getDate() - Math.floor(Math.random() * maxDaysBack));
    }

    let companyName = companies[i % companies.length];
    if (type === 'Agent') companyName = agencies[i % agencies.length];
    if (type === 'Builder') companyName = builderCompanies[i % builderCompanies.length];
    if (type === 'Property Manager') companyName = pmCompanies[i % pmCompanies.length];
    if (type === 'Buyer' || type === 'Tenant') companyName = '—';

    const config = USER_TYPE_CONFIG[type];
    const kyc = {};
    config.docTypes.forEach(doc => {
      if (doc.required) {
        // required docs — 85% users upload
        kyc[doc.key] = Math.random() > 0.15;
      } else {
        // ✅ optional docs — only 50% users upload
        kyc[doc.key] = Math.random() > 0.5;
      }
    });

    return {
      id: `${type.toLowerCase().replace(/\s+/g, '_')}_${i + 1}_${Date.now()}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@email.com`,
      phone: `+91 ${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
      city,
      state: states[Math.floor(Math.random() * states.length)],
      company: companyName,
      status,
      kycStatus: 'pending',
      subscriptionPlan: plans[Math.floor(Math.random() * plans.length)],
      propertiesCount: Math.floor(Math.random() * 30),
      leadsCount: Math.floor(Math.random() * 50),
      clientsCount: Math.floor(Math.random() * 40),
      projectsCount: Math.floor(Math.random() * 10),
      rating: (Math.random() * 4 + 1).toFixed(1),
      experience: Math.floor(Math.random() * 15) + 1,
      specialization: ['Individual', 'Apartment', 'Commercial', 'Land & Plots', 'Hostel'][Math.floor(Math.random() * 5)],
      registrationDate: date.toISOString(),
      revenue: Math.floor(Math.random() * 5000000) + 100000,
      commission: Math.floor(Math.random() * 3000000) + 200000,
      transactionCount: Math.floor(Math.random() * 500) + 50,
      successRate: (Math.random() * 20 + 80).toFixed(1),
      avatar: firstName[0] + lastName[0],
      type,
      kyc,
      verification: {
        email: Math.random() > 0.15,
        phone: Math.random() > 0.2,
        aadhaar: kyc.aadhaar ?? false,
        pan: kyc.pan ?? false
      }
    };
  });
};

// ============================================================
// BUILD USER TYPE STATS
// ============================================================
const buildUserTypeStats = (type, userList, datePreset = 'month') => {
  const plans = PLANS_BY_USER_TYPE[type];
  const growthLabels = generateTimeSeriesLabels(datePreset);
  const growthSeed = seedFromString(`${type}_${datePreset}_growth`);
  const monthlyGrowth = generateGrowthSeries(growthLabels, growthSeed);

  const config = USER_TYPE_CONFIG[type];
  const docStats = config.docTypes.map((doc, idx) => ({
    label: doc.label,
    value: userList.filter(u => u.kyc[doc.key]).length,
    color: UNIQUE_COLORS[idx % UNIQUE_COLORS.length],
    icon: doc.icon,
    required: doc.required !== false
  }));

  const kycVerifiedUsers = userList.filter(u => isUserKycVerified(u));

  // ============================================================
  // KYC 3-WAY DISTRIBUTION (Verified / Pending / Rejected)
  // ============================================================
  let kycVerifiedCount = 0;
  let kycPendingCount = 0;
  let kycRejectedCount = 0;

  userList.forEach(u => {
    const docs = generateVerificationDocs(u);
    if (docs.length === 0) {
      kycPendingCount += 1;
      return;
    }
    const allApproved = docs.every(d => d.status === 'approved');
    const anyRejected = docs.some(d => d.status === 'rejected');

    if (allApproved) kycVerifiedCount += 1;
    else if (anyRejected) kycRejectedCount += 1;
    else kycPendingCount += 1;
  });

  return {
    total: userList.length,
    pending: userList.filter(u => u.status === 'pending').length,
    approved: userList.filter(u => u.status === 'approved').length,
    rejected: userList.filter(u => u.status === 'rejected').length,
    blocked: userList.filter(u => u.status === 'blocked').length,
    verified: kycVerifiedUsers.length,
    pendingKyc: userList.length - kycVerifiedUsers.length,
    rejectedKyc: kycRejectedCount,
    approvedAndVerified: userList.filter(u => u.status === 'approved' && isUserKycVerified(u)).length,
    totalRevenue: userList.reduce((sum, u) => sum + u.revenue, 0),
    totalCommission: userList.reduce((sum, u) => sum + u.commission, 0),
    totalTransactions: userList.reduce((sum, u) => sum + u.transactionCount, 0),
    totalProperties: userList.reduce((sum, u) => sum + u.propertiesCount, 0),
    totalLeads: userList.reduce((sum, u) => sum + u.leadsCount, 0),
    avgRating: userList.length > 0
      ? (userList.reduce((sum, u) => sum + parseFloat(u.rating), 0) / userList.length).toFixed(1)
      : '0.0',
    planDistribution: plans.map((plan, idx) => ({
      label: plan,
      value: userList.filter(u => u.subscriptionPlan === plan).length,
      color: UNIQUE_COLORS[idx % UNIQUE_COLORS.length]
    })),
    statusDistribution: [
      { label: 'Approved', value: userList.filter(u => u.status === 'approved').length, color: '#10B981' },
      { label: 'Pending', value: userList.filter(u => u.status === 'pending').length, color: '#F59E0B' },
      { label: 'Rejected', value: userList.filter(u => u.status === 'rejected').length, color: '#EF4444' },
      { label: 'Blocked', value: userList.filter(u => u.status === 'blocked').length, color: '#6B7280' }
    ],
    kycDistribution: [
      { label: 'Verified', value: kycVerifiedCount, color: '#10B981' },
      { label: 'Pending',  value: kycPendingCount,  color: '#F59E0B' },
      { label: 'Rejected', value: kycRejectedCount, color: '#EF4444' }
    ],
    docStats,
    monthlyGrowth
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
    danger: { gradient: 'from-red-500 to-rose-400', btn: 'bg-gradient-to-r from-red-500 to-rose-400', ring: 'bg-red-50', iconColor: 'text-red-600' },
    success: { gradient: 'from-emerald-500 to-teal-400', btn: 'bg-gradient-to-r from-emerald-500 to-teal-400', ring: 'bg-emerald-50', iconColor: 'text-emerald-600' },
    warning: { gradient: 'from-amber-500 to-orange-400', btn: 'bg-gradient-to-r from-amber-500 to-orange-400', ring: 'bg-amber-50', iconColor: 'text-amber-600' }
  }[type] || { gradient: 'from-[#00695C] to-[#26A69A]', btn: 'bg-gradient-to-r from-[#00695C] to-[#26A69A]', ring: 'bg-[#E8F4F2]', iconColor: 'text-[#00695C]' };

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
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl text-sm font-bold hover:bg-[#E8F0EE] hover:scale-[1.02] transition-all"
            >
              {cancelText || 'Cancel'}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2.5 text-white rounded-xl text-sm font-bold shadow-lg hover:scale-[1.02] transition-all ${theme.btn}`}
            >
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
const StatCard = ({ icon, title, value, trend, subtitle, color, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-2xl transition-all duration-500 border border-[#E8F0EE] group cursor-pointer relative overflow-hidden animate-card-in"
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

  if (!uniqueData.length) return <div className="text-center py-8 text-sm text-[#8FA8A4]">No data</div>;

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
                cx={size / 2} cy={size / 2} r={radius}
                fill="none" stroke={d.color}
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
                <span className="text-xs font-black text-[#0F1A18] min-w-[40px] text-right">{d.value}</span>
              </div>
            </div>
          );
        })}
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

  if (!data.length) return <div className="text-center py-8 text-sm text-[#8FA8A4]">No data</div>;

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
                    {d.value}
                  </div>
                </div>
              )}
              <div className={`text-[11px] font-black px-1.5 py-0.5 rounded-md mb-1 ${isHovered ? 'opacity-100' : 'opacity-60'}`} style={{ color: d.color, backgroundColor: `${d.color}15` }}>
                {d.value}
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
            <span className={`text-[11px] font-black truncate block ${hoveredIndex === i ? 'text-[#00695C]' : 'text-[#3D5A55]'}`}>{d.label}</span>
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

  const points = data.map((d, i) => ({
    x: i * stepX,
    y: 20 + (1 - (d.value - min) / range) * chartHeight * animationProgress
  }));
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
                <rect x={p.x - 45} y={p.y - 55} width="90" height="42" rx="8" fill="#0F1A18" />
                <text x={p.x} y={p.y - 38} textAnchor="middle" fill="#D9E6E3" fontSize="9" fontWeight="700">{data[i].label}</text>
                <text x={p.x} y={p.y - 22} textAnchor="middle" fill="#fff" fontSize="14" fontWeight="900">{data[i].value}</text>
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
const ProgressBar = ({ label, value, max, color, icon: Icon, delay = 0, optional = false }) => {
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
          {optional && (
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 font-bold flex-shrink-0">Optional</span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[11px] font-black text-[#0F1A18]">{value}</span>
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
// STATUS BADGE
// ============================================================
const StatusBadge = ({ status, labelOverride }) => {
  const styles = {
    pending: 'bg-amber-100 text-amber-700',
    approved: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-red-100 text-red-700',
    not_submitted: 'bg-gray-100 text-gray-600',
    suspended: 'bg-gray-100 text-gray-700',
    blocked: 'bg-gray-100 text-gray-700',
    verified: 'bg-emerald-100 text-emerald-700'
  };
  const labels = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    not_submitted: 'Not Submitted',
    suspended: 'Suspended',
    blocked: 'Blocked',
    verified: 'Verified'
  };
  const finalLabel = labelOverride || labels[status] || 'Unknown';
  const styleKey = status === 'verified' ? 'verified' : status;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[9px] ${styles[styleKey] || styles.not_submitted}`}>
      {finalLabel}
    </span>
  );
};

// ============================================================
// KYC BADGE
// ============================================================
const KycBadge = ({ user }) => {
  const verified = useMemo(() => isUserKycVerified(user), [user]);
  if (!verified) return null;
  return (
    <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold bg-blue-100 text-blue-700 inline-flex items-center gap-0.5">
      KYC : Verified
    </span>
  );
};

// ============================================================
// PLAN BADGE
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
      style={{ backgroundColor: style.badgeBg, color: style.badgeText, borderColor: style.badgeBorder }}
    >
      <Icon className={size === 'lg' ? 'text-base' : size === 'md' ? 'text-sm' : 'text-[11px]'} />
      {plan}
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
                  {selected === preset.id && <FiCheckCircle className="ml-auto text-[#00695C] text-sm" />}
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
                    className="w-full px-2 py-1.5 bg-white rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/10 text-xs font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#3D5A55] mb-1">To</label>
                  <input
                    type="date"
                    value={customEnd ? customEnd.toISOString().split('T')[0] : ''}
                    onChange={(e) => onCustomChange(customStart, new Date(e.target.value))}
                    className="w-full px-2 py-1.5 bg-white rounded-lg border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/10 text-xs font-medium outline-none"
                  />
                </div>
                <button
                  onClick={() => { onSelect('custom'); setIsOpen(false); setShowCustom(false); }}
                  disabled={!customStart || !customEnd}
                  className="w-full px-3 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg text-xs font-bold hover:shadow-lg transition-all disabled:opacity-50 hover:scale-105"
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
// DOCUMENT VIEWER MODAL
// ============================================================
const DocumentViewerModal = ({ doc, show, onClose, onDownload, loading }) => {
  const [zoom, setZoom] = useState(1);
  const [rotate, setRotate] = useState(0);

  useEffect(() => {
    if (show) { setZoom(1); setRotate(0); }
  }, [show, doc]);

  if (!doc || !show) return null;

  const kind = getFileKind(doc);
  const viewerLabelOverride = doc.status === 'approved' ? 'Verified' : undefined;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-[#00695C] to-[#26A69A] shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
              <FiFileText className="text-sm" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-white truncate flex items-center gap-2">
                {doc.label}
                {doc.required === false && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/20 text-white font-bold">Optional</span>
                )}
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/20 text-white font-bold uppercase">
                  {kind}
                </span>
              </h2>
              <p className="text-white/70 text-[10px] truncate">{doc.number}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <StatusBadge status={doc.status} labelOverride={viewerLabelOverride} />
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all flex items-center justify-center text-white hover:scale-110"
            >
              <FiX className="text-sm" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-[#0F1B19] flex items-center justify-center p-6 min-h-[320px]">
          {kind === 'pdf' ? (
            <iframe
              src={`${doc.url}#toolbar=1&navpanes=0&scrollbar=1`}
              title={doc.label}
              className="w-full h-[60vh] bg-white rounded-lg shadow-2xl border-0"
            />
          ) : kind === 'image' ? (
            <img
              src={doc.url}
              alt={doc.label}
              draggable={false}
              className="max-w-full rounded-lg shadow-2xl select-none transition-transform duration-300"
              style={{ transform: `scale(${zoom}) rotate(${rotate}deg)` }}
            />
          ) : (
            <div className="text-white/70 text-sm font-medium flex flex-col items-center gap-2">
              <FiFileText className="text-3xl" />
              Preview not available
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 py-2.5 border-t border-[#E8F0EE] bg-[#F5F9F8] shrink-0">
          {kind === 'image' && (
            <>
              <button
                onClick={() => setZoom(z => Math.max(0.5, +(z - 0.25).toFixed(2)))}
                className="w-8 h-8 rounded-lg bg-white border border-[#E8F0EE] flex items-center justify-center text-[#1A2E2A] hover:scale-110 transition-all"
              >
                <FiZoomOut className="text-xs" />
              </button>
              <span className="text-xs text-[#5A7D78] font-medium w-12 text-center">{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom(z => Math.min(2.5, +(z + 0.25).toFixed(2)))}
                className="w-8 h-8 rounded-lg bg-white border border-[#E8F0EE] flex items-center justify-center text-[#1A2E2A] hover:scale-110 transition-all"
              >
                <FiZoomIn className="text-xs" />
              </button>
              <button
                onClick={() => setRotate(r => (r + 90) % 360)}
                className="w-8 h-8 rounded-lg bg-white border border-[#E8F0EE] flex items-center justify-center text-[#1A2E2A] hover:scale-110 transition-all ml-1"
              >
                <FiRotateCw className="text-xs" />
              </button>
            </>
          )}
          <button
            onClick={() => onDownload(doc)}
            disabled={loading === `download_${doc.id}`}
            className="ml-1 h-8 px-3 rounded-lg bg-white border border-[#E8F0EE] flex items-center gap-1.5 text-[#1A2E2A] text-xs font-medium hover:scale-105 transition-all disabled:opacity-50"
          >
            {loading === `download_${doc.id}` ? <FiRefreshCw className="text-xs animate-spin" /> : <FiDownload className="text-xs" />}
            Download
          </button>
        </div>

        <div className="px-5 py-4 border-t border-[#E8F0EE] flex items-center justify-end bg-white shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 bg-[#F5F9F8] text-[#1A2E2A] hover:bg-[#E8F0EE] transition-all"
          >
            <FiX className="text-xs" /> Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// TAB: OVERVIEW
// ============================================================
const OverviewTab = ({ activeUserType, stats, config, dateRangeLabel, datePreset }) => {
  const growthTitle = {
    today: 'Hourly Growth', yesterday: 'Hourly Growth',
    week: 'Daily Growth', month: 'Weekly Growth',
    quarter: 'Monthly Growth', year: 'Monthly Growth',
    all: 'Yearly Growth', custom: 'Period Growth'
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
          title={`Total ${activeUserType}s`}
          value={stats.total || 0}
          trend={12.5}
          subtitle="All registered"
          color={`bg-gradient-to-br ${config.gradient}`}
          delay={0}
        />
        <StatCard
          icon={<FiCheckCircle className="text-white text-base" />}
          title="Approved"
          value={stats.approved || 0}
          trend={8.3}
          subtitle="Active vendors"
          color="bg-gradient-to-br from-emerald-600 to-teal-400"
          delay={100}
        />
        <StatCard
          icon={<FiShield className="text-white text-base" />}
          title="KYC Verified"
          value={stats.verified || 0}
          trend={5.7}
          subtitle="Fully verified"
          color="bg-gradient-to-br from-blue-600 to-cyan-400"
          delay={200}
        />
        <StatCard
          icon={<FiClock className="text-white text-base" />}
          title="Pending KYC"
          value={stats.pendingKyc || 0}
          trend={-2.4}
          subtitle="Awaiting review"
          color="bg-gradient-to-br from-amber-600 to-yellow-400"
          delay={300}
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<FiFileText className="text-white text-base" />}
          title="Pending Approvals"
          value={stats.pending || 0}
          subtitle="Status pending"
          color="bg-gradient-to-br from-orange-600 to-amber-400"
          delay={400}
        />
        <StatCard
          icon={<FiXCircle className="text-white text-base" />}
          title="Rejected"
          value={stats.rejected || 0}
          subtitle="Not approved"
          color="bg-gradient-to-br from-red-600 to-rose-400"
          delay={500}
        />
        <StatCard
          icon={<FiLock className="text-white text-base" />}
          title="Blocked"
          value={stats.blocked || 0}
          subtitle="Suspended access"
          color="bg-gradient-to-br from-gray-600 to-gray-400"
          delay={600}
        />
        <StatCard
          icon={<MdVerified className="text-white text-base" />}
          title="Approved & Verified"
          value={stats.approvedAndVerified || 0}
          subtitle="Both complete"
          color="bg-gradient-to-br from-purple-600 to-violet-400"
          delay={700}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="text-lg font-black text-[#0F1A18] flex items-center gap-2">
              <FiTrendingUp className="text-[#00695C]" /> {growthTitle}
            </h3>
            <span className="px-3 py-1 bg-[#E8F4F2] text-[#00695C] text-[10px] font-black rounded-full flex items-center gap-1">
              <FiCalendar className="text-[10px]" /> {dateRangeLabel}
            </span>
          </div>
          <AreaChart data={stats.monthlyGrowth || []} height={320} color={config.color} />
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm">
          <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
            <FiShield className="text-[#00695C]" /> KYC Status
          </h3>
          <DonutChart
            data={stats.kycDistribution || []}
            size={220}
            thickness={48}
            centerLabel="KYC"
            centerValue={stats.verified || 0}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <div>
              <h3 className="text-lg font-black text-[#0F1A18] flex items-center gap-2">
                <FiFileText className="animate-icon-float text-[#00695C]" />
                Document Verification Breakdown
              </h3>
              <p className="text-xs text-[#3D5A55] font-semibold">
                Per-document verification counts for {activeUserType.toLowerCase()}s
              </p>
            </div>
            <span className="px-3 py-1 bg-[#E8F4F2] text-[#00695C] text-[10px] font-black rounded-full flex items-center gap-1">
              <FiCalendar className="text-[10px]" /> {dateRangeLabel}
            </span>
          </div>
          <div className="space-y-3">
            {(stats.docStats || []).map((doc, i) => (
              <ProgressBar
                key={i}
                label={`${doc.label} — Uploaded`}
                value={doc.value}
                max={stats.total || 1}
                color={doc.color}
                icon={doc.icon}
                optional={doc.required === false}
                delay={i * 100}
              />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm">
          <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
            <FiActivity className="text-[#00695C]" /> Account Status Distribution
          </h3>
          <BarChart data={stats.statusDistribution || []} height={260} />
        </div>
      </div>
    </div>
  );
};

// ============================================================
// TAB: MANAGE
// ============================================================

// ---------- GRID CARD ----------
const VerificationGridCard = ({ user, config, index, onOpenDoc, onViewAll, onViewDetails, onToggleBlock, actionLoading }) => {
  const isBlocked = user.status === 'blocked' || user.status === 'rejected';
  const docs = useMemo(() => generateVerificationDocs(user), [user]);
  const approvedCount = docs.filter(d => d.status === 'approved').length;

  return (
    <div
      className={`bg-white rounded-2xl border border-[#E8F0EE] p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 animate-card-in ${STATUS_BORDER[user.status] ? `border-l-4 ${STATUS_BORDER[user.status]}` : ''}`}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${config.color} 0%, ${config.color}CC 100%)` }}
          >
            {user.avatar || user.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-[#0F1A18] text-sm truncate">{user.name}</h4>
            <p className="text-[10px] text-[#5A7D78] font-mono truncate mt-0.5 flex items-center gap-1">
              <FiHash className="text-[9px]" /> {user.id}
            </p>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <StatusBadge status={user.status} />
              <KycBadge user={user} />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <PlanBadge plan={user.subscriptionPlan} size="sm" />
      </div>

      <div className="space-y-1 text-[11px] text-[#3D5A55]">
        <div className="flex items-center gap-2">
          <FiHash className="text-[11px] flex-shrink-0 text-[#00695C]" />
          <span className="truncate font-mono text-[10px] font-semibold text-[#0F1A18]">{user.id}</span>
        </div>
        <div className="flex items-center gap-2">
          <FiMail className="text-[11px] flex-shrink-0" />
          <span className="truncate">{user.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <FiPhone className="text-[11px] flex-shrink-0" />
          <span>{user.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <FiMapPin className="text-[11px] flex-shrink-0" />
          <span className="truncate">{user.city}, {user.state}</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-[#E8F0EE]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black text-[#185d53] uppercase tracking-wider">
            Documents
          </span>
          <span className="text-[10px] font-bold text-[#3D5A55]">
            {approvedCount}/{docs.length} verified
          </span>
        </div>
        {docs.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {docs.map(doc => {
              const DocIcon = doc.icon || FiFileText;
              const kind = getFileKind(doc);
              const color =
                doc.status === 'approved' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                doc.status === 'rejected' ? 'bg-red-100 text-red-700 border-red-200' :
                'bg-amber-100 text-amber-700 border-amber-200';
              return (
                <button
                  key={doc.id}
                  onClick={() => onOpenDoc(doc, user)}
                  className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg border ${color} hover:scale-105 transition-all`}
                  title={`${doc.label} — ${doc.status}`}
                >
                  {kind === 'pdf' ? <FiFileText className="text-[10px]" /> : <DocIcon className="text-[10px]" />}
                  <span className="max-w-[70px] truncate">{doc.label.split(' ')[0]}</span>
                  {doc.required === false && <span className="text-[8px] opacity-70">OPT</span>}
                  {kind === 'pdf' && <span className="text-[8px] font-black opacity-80">PDF</span>}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-[10px] text-[#8FA8A4] font-medium italic">No documents uploaded yet</p>
        )}
      </div>

      <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-[#E8F0EE]">
        <button
          onClick={() => onViewDetails(user)}
          className="flex-1 py-1.5 text-xs font-bold text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] flex items-center justify-center gap-1 transition"
        >
          <FiInfo className="text-[10px]" /> Details
        </button>
        <button
          onClick={() => onViewAll(user)}
          className="flex-1 py-1.5 text-xs font-bold text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] flex items-center justify-center gap-1"
        >
          <FiEye className="text-[10px]" /> Review All
        </button>
        <button
          onClick={() => onToggleBlock(user)}
          disabled={!!actionLoading}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl flex items-center justify-center gap-1 disabled:opacity-50 ${
            isBlocked ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'
          }`}
        >
          {isBlocked ? <FiUnlock className="text-[10px]" /> : <FiLock className="text-[10px]" />}
          {isBlocked ? 'Unblock' : 'Block'}
        </button>
      </div>
    </div>
  );
};

// ---------- LIST VIEW CARD ----------
const VerificationListCard = ({ user, config, index, onOpenDoc, onViewAll, onViewDetails, onToggleBlock, actionLoading }) => {
  const isBlocked = user.status === 'blocked' || user.status === 'rejected';
  const docs = useMemo(() => generateVerificationDocs(user), [user]);
  const approvedCount = docs.filter(d => d.status === 'approved').length;
  const pendingCount = docs.filter(d => d.status === 'pending').length;
  const rejectedCount = docs.filter(d => d.status === 'rejected').length;

  return (
    <div
      className={`bg-white rounded-2xl border border-[#94e9d4] hover:shadow-lg transition-all duration-300 animate-card-in overflow-hidden ${
        STATUS_BORDER[user.status] ? `border-l-4 ${STATUS_BORDER[user.status]}` : ''
      }`}
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-[#E8F0EE]">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-md flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${config.color} 0%, ${config.color}CC 100%)` }}
          >
            {user.avatar || user.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-[15px] text-[#0F1A18] truncate">{user.name}</h4>
              <StatusBadge status={user.status} />
              <PlanBadge plan={user.subscriptionPlan} size="sm" />
              <KycBadge user={user} />
            </div>
            <p className="text-[11px] text-[#5A7D78] font-mono mt-0.5 truncate flex items-center gap-1">
              <FiHash className="text-[10px]" /> {user.id}
            </p>
            <p className="text-[12px] text-[#3D5A55] font-medium mt-0.5 truncate">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => onViewDetails(user)}
            className="px-4 py-2 text-xs font-bold text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] flex items-center gap-1.5 transition"
          >
            <FiInfo className="text-sm" /> Details
          </button>
          <button
            onClick={() => onViewAll(user)}
            className="px-4 py-2 text-xs font-bold text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] flex items-center gap-1.5 transition"
          >
            <FiEye className="text-sm" /> Review All
          </button>
          <button
            onClick={() => onToggleBlock(user)}
            disabled={!!actionLoading}
            className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition disabled:opacity-50 ${
              isBlocked ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' : 'text-red-600 bg-red-50 hover:bg-red-100'
            }`}
          >
            {isBlocked ? <FiUnlock className="text-sm" /> : <FiLock className="text-sm" />}
            {isBlocked ? 'Unblock' : 'Block'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-5 py-4">
        <div className="min-w-0">
          <p className="text-[11px] font-black text-[#185d53] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <FiHash className="text-[13px] text-[#185d53]" /> ID
          </p>
          <p className="text-[12px] font-mono font-semibold text-[#1A2E2A] truncate">{user.id}</p>
          <p className="text-[11px] text-[#3D5A55] font-medium mt-0.5">{user.type}</p>
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-black text-[#185d53] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <FiMail className="text-[13px] text-[#185d53]" /> Contact
          </p>
          <p className="text-[13px] font-semibold text-[#1A2E2A] truncate">{user.email}</p>
          <p className="text-[12px] text-[#3D5A55] font-medium mt-0.5">{user.phone}</p>
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-black text-[#185d53] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <FiMapPin className="text-[13px] text-[#185d53]" /> Location
          </p>
          <p className="text-[13px] font-semibold text-[#1A2E2A] truncate">{user.city}</p>
          <p className="text-[12px] text-[#3D5A55] font-medium mt-0.5 truncate">{user.state}</p>
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-black text-[#185d53] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <FiFileText className="text-[13px] text-[#185d53]" /> Documents
          </p>
          <div className="flex items-center gap-2 text-[12px] font-bold">
            <span className="text-emerald-600">{approvedCount} ✓</span>
            <span className="text-amber-600">{pendingCount} ⏱</span>
            <span className="text-red-600">{rejectedCount} ✗</span>
          </div>
          <p className="text-[12px] text-[#3D5A55] font-medium mt-0.5">
            {approvedCount}/{docs.length} verified
          </p>
        </div>
      </div>

      {docs.length > 0 && (
        <div className="px-5 pb-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {docs.map(doc => {
              const DocIcon = doc.icon || FiFileText;
              const kind = getFileKind(doc);
              const color =
                doc.status === 'approved' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                doc.status === 'rejected' ? 'bg-red-50 border-red-200 text-red-700' :
                'bg-amber-50 border-amber-200 text-amber-700';
              const StatusIcon = doc.status === 'approved' ? FiCheckCircle : doc.status === 'rejected' ? FiXCircle : FiClock;
              return (
                <button
                  key={doc.id}
                  onClick={() => onOpenDoc(doc, user)}
                  className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl border ${color} hover:scale-[1.02] transition-all`}
                  title={`${doc.label} — ${doc.status}`}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    {kind === 'pdf' ? <FiFileText className="text-xs flex-shrink-0" /> : <DocIcon className="text-xs flex-shrink-0" />}
                    <span className="text-[10px] font-bold truncate">{doc.label}</span>
                    {doc.required === false && <span className="text-[8px] opacity-70 font-black">OPT</span>}
                    {kind === 'pdf' && <span className="text-[8px] font-black opacity-80">PDF</span>}
                  </div>
                  <StatusIcon className="text-xs flex-shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// USER DETAILS MODAL
// ============================================================
const InfoCard = ({ icon: Icon, label, value }) => (
  <div className="bg-[#F8FAF9] border border-[#E8F0EE] rounded-xl p-3 flex flex-col gap-1.5 transition-all hover:bg-[#EEF4F2]">
    <div className="flex items-center gap-2 text-[#3D5A55]">
      <Icon className="text-sm text-[#00695C]" />
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    </div>
    <span className="text-sm font-bold text-[#0F1A18] truncate">
      {value || '—'}
    </span>
  </div>
);

const UserDetailsModal = ({ user, config, docs, onClose, onOpenDoc, onViewAll, onToggleBlock }) => {
  if (!user) return null;

  const isBlocked = user.status === 'blocked' || user.status === 'rejected';
  const planStyle = getPlanStyle(user.subscriptionPlan);
  const PlanIcon = planStyle.icon;
  const kycVerified = isUserKycVerified(user);

  return (
    <div className="fixed inset-0 z-[115] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-hidden shadow-2xl animate-slide-up flex flex-col">

        <div className={`relative px-6 py-5 shrink-0 bg-gradient-to-r ${config.gradient}`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all hover:scale-110"
          >
            <FiX className="text-base" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center text-white font-black text-2xl shadow-xl flex-shrink-0">
              {user.avatar || user.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-bold text-white truncate">{user.name}</h2>
              <p className="text-white/85 text-xs font-mono truncate">ID: {user.id}</p>
              <p className="text-white/85 text-xs font-medium truncate">{user.email}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-bold flex items-center gap-1">
                  <config.icon className="text-[10px]" /> {user.type}
                </span>
                <StatusBadge status={user.status} />
                {kycVerified && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500 text-white font-bold">
                    KYC ✓
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#F8FAF9]">
          <div className="p-6 space-y-5">

            <section className="bg-white rounded-2xl border border-[#E8F0EE] p-5">
              <h3 className="text-[11px] font-black text-[#0F1A18] mb-4 flex items-center gap-2 uppercase tracking-wider">
                <FiPackage className="text-[#00695C]" /> Subscription Plan
              </h3>

              <div
                className="rounded-2xl border p-4 flex items-center justify-between gap-4 transition-colors"
                style={{
                  backgroundColor: planStyle.containerBg,
                  borderColor: planStyle.containerBorder
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center shadow-sm border"
                    style={{
                      backgroundColor: planStyle.iconBg,
                      borderColor: planStyle.badgeBorder,
                      color: planStyle.iconColor
                    }}
                  >
                    <PlanIcon className="text-2xl" />
                  </div>

                  <div>
                    <p
                      className="text-[10px] font-bold uppercase tracking-wider mb-1.5"
                      style={{ color: planStyle.activeText }}
                    >
                      Current Plan
                    </p>
                    <span
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-black text-sm border shadow-sm"
                      style={{
                        backgroundColor: planStyle.badgeBg,
                        color: planStyle.badgeText,
                        borderColor: planStyle.badgeBorder
                      }}
                    >
                      <PlanIcon className="text-base" />
                      {user.subscriptionPlan}
                    </span>
                  </div>
                </div>

                <span
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-black shadow-sm"
                  style={{
                    backgroundColor: planStyle.activeBg,
                    color: planStyle.activeText,
                    borderColor: planStyle.activeBorder
                  }}
                >
                  <FiCheckCircle className="text-sm" /> ACTIVE
                </span>
              </div>
            </section>

            <section className="bg-white rounded-2xl border border-[#E8F0EE] p-5">
              <h3 className="text-[11px] font-black text-[#0F1A18] mb-4 flex items-center gap-2 uppercase tracking-wider">
                <FiUser className="text-[#00695C]" /> Basic Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InfoCard icon={FiHash} label="ID" value={user.id} />
                <InfoCard icon={FiUser} label="Name" value={user.name} />
                <InfoCard icon={FiMail} label="Email" value={user.email} />
                <InfoCard icon={FiPhone} label="Phone" value={user.phone} />
                <InfoCard icon={FiMapPin} label="Location" value={`${user.city}, ${user.state}`} />
                <InfoCard icon={FiBriefcase} label="User Type" value={user.type} />
              </div>
            </section>

            <section className="bg-white rounded-2xl border border-[#E8F0EE] p-5">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h3 className="text-[11px] font-black text-[#0F1A18] flex items-center gap-2 uppercase tracking-wider">
                  <FiFileText className="text-[#00695C]" /> Verification Documents
                </h3>
                <button
                  onClick={onViewAll}
                  className="text-[10px] font-black text-[#00695C] hover:underline flex items-center gap-1"
                >
                  Review All <FiChevronRight className="text-xs" />
                </button>
              </div>

              {docs.length > 0 ? (
                <div className="space-y-2">
                  {docs.map(doc => {
                    const DocIcon = doc.icon || FiFileText;
                    const kind = getFileKind(doc);
                    return (
                      <button
                        key={doc.id}
                        onClick={() => onOpenDoc(doc)}
                        className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-[#F8FAF9] hover:bg-[#EEF4F2] border border-transparent hover:border-[#E8F0EE] transition-all group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {kind === 'pdf' ? <FiFileText className="text-base text-[#00695C] flex-shrink-0" /> : <DocIcon className="text-base text-[#00695C] flex-shrink-0" />}
                          <span className="text-sm font-bold text-[#0F1A18] truncate group-hover:text-[#00695C]">
                            {doc.label}
                          </span>
                          {doc.required === false && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 font-black flex-shrink-0">
                              OPTIONAL
                            </span>
                          )}
                          {kind === 'pdf' && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 font-black flex-shrink-0">
                              PDF
                            </span>
                          )}
                        </div>
                        <StatusBadge status={doc.status} />
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-[#8FA8A4] font-medium italic text-center py-4">
                  No documents uploaded yet
                </p>
              )}
            </section>

          </div>
        </div>

        <div className="shrink-0 px-6 py-4 border-t border-[#E8F0EE] bg-white flex items-center gap-3">
          <button
            onClick={() => onToggleBlock(user)}
            className={`flex-1 py-3 rounded-xl text-sm font-black flex items-center justify-center gap-2 transition-all hover:scale-[1.02] ${
              isBlocked
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                : 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
            }`}
          >
            {isBlocked ? <FiUnlock className="text-sm" /> : <FiLock className="text-sm" />}
            {isBlocked ? 'Unblock' : 'Block'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-black bg-[#F5F9F8] text-[#0F1A18] hover:bg-[#E8F0EE] transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// USER FULL VERIFICATION PANEL (Review All)
// ============================================================
const UserVerificationPanel = ({ user, docs, config, onClose, onOpenDoc, onStatusChange, showToast }) => {
  const approvedCount = docs.filter(d => d.status === 'approved').length;
  const total = docs.length;
  const pct = total > 0 ? Math.round((approvedCount / total) * 100) : 0;
  const kycVerified = docs.length > 0 && docs.every(d => d.status === 'approved');

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up flex flex-col">
        <div className={`sticky top-0 px-6 py-5 rounded-t-3xl z-10 shrink-0 bg-gradient-to-r ${config.gradient}`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
          >
            <FiX className="text-lg" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center text-white font-black text-2xl shadow-xl">
              {user.avatar || user.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-white truncate">{user.name}</h2>
              <p className="text-white/90 text-xs font-mono truncate">ID: {user.id}</p>
              <p className="text-white/90 text-xs font-medium truncate">{user.email}</p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-bold flex items-center gap-1">
                  <config.icon className="text-[10px]" /> {user.type}
                </span>
                <StatusBadge status={user.status} />
                {kycVerified && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500 text-white font-bold">KYC ✓</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pt-5 pb-2 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#3D5A55] uppercase tracking-wider">
              Verification Progress
            </span>
            <span className="text-sm font-black text-[#0F6B5C]">{pct}%</span>
          </div>
          <div className="w-full h-3 bg-[#E5EEEB] rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${pct}%`,
                background: 'linear-gradient(90deg, #0F6B5C 0%, #26A69A 50%, #4DB6AC 100%)',
              }}
            />
          </div>
          <p className="text-[10px] font-semibold text-[#6B8983] mt-2 text-right">
            {approvedCount}/{total} documents verified
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-[#F8FAF9]">
          {docs.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {docs.map((doc) => {
                const DocIcon = doc.icon || FiFileText;
                const kind = getFileKind(doc);
                const statusColor =
                  doc.status === 'approved' ? 'border-emerald-200 bg-emerald-50' :
                  doc.status === 'rejected' ? 'border-red-200 bg-red-50' :
                  'border-amber-200 bg-amber-50';

                const labelOverride = doc.status === 'approved' ? 'Verified' : undefined;

                return (
                  <div
                    key={doc.id}
                    className={`rounded-2xl border ${statusColor} p-3 flex flex-col`}
                  >
                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <DocIcon className="text-base text-[#0F6B5C] flex-shrink-0" />
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-[#1A2E2A] truncate flex items-center gap-2">
                            {doc.label}
                            {doc.required === false && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 font-bold flex-shrink-0">
                                Optional
                              </span>
                            )}
                          </h4>
                          <p className="text-[11px] text-[#3D5A55] truncate">{doc.number}</p>
                        </div>
                      </div>
                      <StatusBadge status={doc.status} labelOverride={labelOverride} />
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#E8F0EE] bg-white shrink-0 flex items-center justify-center">
                        {kind === 'image' ? (
                          <img
                            src={doc.url}
                            alt={doc.label}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : kind === 'pdf' ? (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 text-red-600">
                            <FiFileText className="text-base" />
                            <span className="text-[8px] font-black mt-0.5">PDF</span>
                          </div>
                        ) : (
                          <FiFileText className="text-base text-[#5A7D78]" />
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onOpenDoc(doc)}
                          className="w-8 h-8 rounded-lg bg-white border border-[#E8F0EE] hover:bg-[#F5F9F8] flex items-center justify-center text-[#00695C] transition"
                          title={kind === 'pdf' ? 'Preview PDF' : 'View full'}
                        >
                          <FiEye className="text-sm" />
                        </button>
                        <button
                          onClick={() => downloadFile(doc, showToast)}
                          className="w-8 h-8 rounded-lg bg-white border border-[#E8F0EE] hover:bg-[#F5F9F8] flex items-center justify-center text-[#00695C] transition"
                          title="Download"
                        >
                          <FiDownload className="text-sm" />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenDoc(doc)}
                      className="mt-auto w-full py-1.5 text-xs font-bold text-[#00695C] bg-white border border-[#E8F0EE] rounded-xl hover:bg-[#E8F4F2] transition flex items-center justify-center gap-1"
                    >
                      <FiExternalLink className="text-[10px]" />
                      {kind === 'pdf' ? 'Open PDF' : 'Open & Review'}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4">
                <FiFileText className="text-3xl text-[#8FA8A4]" />
              </div>
              <h3 className="text-lg font-black text-[#0F1A18]">No documents uploaded yet</h3>
              <p className="text-sm text-[#3D5A55] mt-1 font-medium">
                This user hasn't uploaded any documents
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// MANAGE TAB WRAPPER
// ============================================================
const ManageTab = ({
  userType, users, onToggleBlock,
  actionLoading, searchQuery, setSearchQuery,
  selectedStatus, setSelectedStatus,
  viewMode, setViewMode, dateRangeLabel, showToast
}) => {
  const [viewingUser, setViewingUser] = useState(null);
  const [viewingDoc, setViewingDoc] = useState(null);
  const [detailsUser, setDetailsUser] = useState(null);
  const config = USER_TYPE_CONFIG[userType];

  const userDocsMap = useMemo(() => {
    const map = {};
    users.forEach(u => {
      map[u.id] = generateVerificationDocs(u);
    });
    return map;
  }, [users]);

  useEffect(() => {
    setViewingUser(null);
    setViewingDoc(null);
    setDetailsUser(null);
  }, [users, userType]);

  const filtered = useMemo(() => {
    let result = [...users];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(u =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.includes(q) ||
        u.city.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q)
      );
    }
    if (selectedStatus !== 'all') result = result.filter(u => u.status === selectedStatus);
    return result;
  }, [users, searchQuery, selectedStatus]);

  const openDoc = (doc, user) => {
    setViewingDoc({ ...doc });
    setViewingUser(user);
  };

  const viewAll = (user) => {
    setViewingDoc(null);
    setViewingUser(user);
  };

  const viewDetails = (user) => {
    setDetailsUser(user);
  };

  const handleDocStatus = (doc, newStatus) => {
    userDocsMap[viewingUser?.id] = (userDocsMap[viewingUser?.id] || []).map(d =>
      d.id === doc.id ? { ...d, status: newStatus } : d
    );
    setViewingDoc(prev => (prev && prev.id === doc.id ? { ...prev, status: newStatus } : prev));
    showToast(`${doc.label} ${newStatus}`, newStatus === 'approved' ? 'success' : newStatus === 'rejected' ? 'warning' : 'info');
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 border border-[#E8F0EE] shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          <div className="flex-1 w-full relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A7D78] text-sm" />
            <input
              type="text"
              placeholder={`Search ${userType.toLowerCase()}s by name, email, ID...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] text-sm text-[#0F1A18] placeholder:text-[#5A7D78] outline-none"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] text-sm text-[#0F1A18] outline-none cursor-pointer font-medium"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="blocked">Blocked</option>
          </select>
          <div className="flex items-center bg-[#F5F9F8] rounded-xl p-1 border border-[#E8F0EE]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#00695C]' : 'text-[#3D5A55]'}`}
              title="Grid View"
            >
              <FiGrid className="text-sm" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-white shadow-sm text-[#00695C]' : 'text-[#3D5A55]'}`}
              title="List View"
            >
              <FiList className="text-sm" />
            </button>
          </div>
          <span className="px-3 py-2 bg-[#E8F4F2] text-[#00695C] text-xs font-black rounded-xl">
            {filtered.length} vendors
          </span>
        </div>
        <div className="mt-2 flex items-center gap-2 text-[10px] text-[#3D5A55] font-semibold">
          <FiCalendar className="text-[#00695C]" /> Showing data from: {dateRangeLabel}
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {filtered.map((user, i) => (
            <VerificationGridCard
              key={user.id}
              user={user}
              config={config}
              index={i}
              onOpenDoc={openDoc}
              onViewAll={viewAll}
              onViewDetails={viewDetails}
              onToggleBlock={onToggleBlock}
              actionLoading={actionLoading}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((user, i) => (
            <VerificationListCard
              key={user.id}
              user={user}
              config={config}
              index={i}
              onOpenDoc={openDoc}
              onViewAll={viewAll}
              onViewDetails={viewDetails}
              onToggleBlock={onToggleBlock}
              actionLoading={actionLoading}
            />
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E8F0EE]">
          <div className="w-24 h-24 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4 animate-float">
            <FiUsers className="text-4xl text-[#8FA8A4]" />
          </div>
          <h3 className="text-xl font-black text-[#0F1A18]">No {userType.toLowerCase()}s found</h3>
          <p className="text-sm text-[#3D5A55] mt-1 font-medium">Try adjusting your filters or date range</p>
        </div>
      )}

      {viewingDoc && (
        <DocumentViewerModal
          doc={viewingDoc}
          show={!!viewingDoc}
          onClose={() => { setViewingDoc(null); }}
          onDownload={(d) => downloadFile(d, showToast)}
          loading={actionLoading}
        />
      )}

      {detailsUser && !viewingDoc && !viewingUser && (
        <UserDetailsModal
          user={detailsUser}
          config={config}
          docs={userDocsMap[detailsUser.id] || []}
          onClose={() => setDetailsUser(null)}
          onOpenDoc={(doc) => {
            const u = detailsUser;
            setDetailsUser(null);
            setViewingDoc({ ...doc });
            setViewingUser(u);
          }}
          onViewAll={() => {
            const u = detailsUser;
            setDetailsUser(null);
            setViewingUser(u);
          }}
          onToggleBlock={(u) => {
            setDetailsUser(null);
            onToggleBlock(u);
          }}
        />
      )}

      {viewingUser && !viewingDoc && (
        <UserVerificationPanel
          user={viewingUser}
          docs={userDocsMap[viewingUser.id] || []}
          config={config}
          onClose={() => setViewingUser(null)}
          onOpenDoc={(doc) => setViewingDoc({ ...doc })}
          onStatusChange={handleDocStatus}
          showToast={showToast}
        />
      )}
    </div>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================
const VerificationManagement = () => {
  const [activeUserType, setActiveUserType] = useState('Owner');
  const [activeView, setActiveView] = useState('overview');
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  const [confirmAction, setConfirmAction] = useState(null);

  const [datePreset, setDatePreset] = useState('month');
  const [customStart, setCustomStart] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [customEnd, setCustomEnd] = useState(new Date());

  const [users, setUsers] = useState(() => {
    const initial = {};
    ALL_USER_TYPES.forEach(t => initial[t] = []);
    return initial;
  });
  const [userTypeStats, setUserTypeStats] = useState({});

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  }, []);

  useEffect(() => {
    const newUsers = {};
    const newStats = {};
    ALL_USER_TYPES.forEach(type => {
      const userList = generateMockUsers(
        type,
        Math.floor(Math.random() * 20) + 15,
        datePreset,
        customStart,
        customEnd
      );
      newUsers[type] = userList;
      newStats[type] = buildUserTypeStats(type, userList, datePreset);
    });
    setUsers(newUsers);
    setUserTypeStats(newStats);
  }, [datePreset, customStart, customEnd]);

  useEffect(() => {
    setSearchQuery('');
    setSelectedStatus('all');
  }, [activeUserType]);

  const currentUsers = users[activeUserType] || [];
  const currentStats = userTypeStats[activeUserType] || {};
  const currentConfig = USER_TYPE_CONFIG[activeUserType];
  const dateRangeLabel = getDateRangeLabel(datePreset, customStart, customEnd);

  const requestToggleBlock = useCallback((user) => {
    const isBlocked = user.status === 'blocked' || user.status === 'rejected';
    setConfirmAction({
      user,
      isBlocked,
      title: isBlocked ? 'Unblock User?' : 'Block User?',
      message: isBlocked
        ? `Are you sure you want to unblock ${user.name}? They will regain access.`
        : `Are you sure you want to block ${user.name}? They will lose access immediately.`,
      confirmText: isBlocked ? 'Yes, Unblock' : 'Yes, Block',
      cancelText: 'No, Cancel',
      type: isBlocked ? 'success' : 'danger',
      icon: isBlocked ? FiUnlock : FiLock
    });
  }, []);

  const executeToggleBlock = useCallback(() => {
    if (!confirmAction) return;
    const { user, isBlocked } = confirmAction;

    setUsers(prev => {
      const updatedList = prev[activeUserType].map(u =>
        u.id === user.id ? { ...u, status: isBlocked ? 'approved' : 'blocked' } : u
      );
      const updated = { ...prev, [activeUserType]: updatedList };
      setUserTypeStats(prevStats => ({
        ...prevStats,
        [activeUserType]: buildUserTypeStats(activeUserType, updatedList, datePreset)
      }));
      return updated;
    });

    showToast(`${user.name} ${isBlocked ? 'unblocked' : 'blocked'}`, isBlocked ? 'success' : 'warning');
    setConfirmAction(null);
  }, [confirmAction, activeUserType, datePreset, showToast]);

  const handleRefresh = useCallback(() => {
    setActionLoading('refresh');
    setTimeout(() => {
      const newUsers = generateMockUsers(
        activeUserType,
        Math.floor(Math.random() * 20) + 15,
        datePreset,
        customStart,
        customEnd
      );
      setUsers(prev => ({ ...prev, [activeUserType]: newUsers }));
      setUserTypeStats(prev => ({
        ...prev,
        [activeUserType]: buildUserTypeStats(activeUserType, newUsers, datePreset)
      }));
      setActionLoading(null);
      showToast('Data refreshed', 'success');
    }, 800);
  }, [activeUserType, datePreset, customStart, customEnd, showToast]);

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
        onConfirm={executeToggleBlock}
        onCancel={() => setConfirmAction(null)}
      />

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-[#00695C] via-[#26A69A] to-[#4DB6AC] bg-clip-text text-transparent">
                Verification Management
              </h1>
              <span className="px-3 py-1.5 bg-gradient-to-r from-[#E8F4F2] to-[#D5F0EA] text-[#00695C] text-xs font-black rounded-full flex items-center gap-1.5">
                <FiShield className="text-[10px]" /> Super Admin
              </span>
            </div>
            <p className="text-sm text-[#3D5A55] font-semibold flex items-center gap-2 flex-wrap">
              <span>Verify & manage documents for all user types</span>
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

            <button
              onClick={() => setActiveView('overview')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black hover:scale-105 transition-all ${
                activeView === 'overview'
                  ? 'bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white shadow-lg'
                  : 'bg-white border border-[#E8F0EE] text-[#0F1A18]'
              }`}
            >
              <FiPieChart className="text-sm" />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setActiveView('manage')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black hover:scale-105 transition-all ${
                activeView === 'manage'
                  ? 'bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white shadow-lg'
                  : 'bg-white border border-[#E8F0EE] text-[#0F1A18]'
              }`}
            >
              <FiShield className="text-sm" />
              <span>Manage</span>
            </button>

            <button
              onClick={handleRefresh}
              disabled={actionLoading === 'refresh'}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E8F0EE] rounded-xl text-sm font-black text-[#0F1A18] hover:scale-105 transition-all disabled:opacity-50"
            >
              <FiRefreshCw className={`text-sm ${actionLoading === 'refresh' ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-0">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {ALL_USER_TYPES.map((type, idx) => {
            const config = USER_TYPE_CONFIG[type];
            const Icon = config.icon;
            const isActive = activeUserType === type;
            return (
              <div
                key={type}
                onClick={() => setActiveUserType(type)}
                className={`rounded-2xl p-3 cursor-pointer transition-all duration-500 border-2 hover:shadow-xl group relative overflow-hidden animate-card-in flex flex-col ${
                  isActive
                    ? `bg-gradient-to-br ${config.gradient} border-transparent shadow-xl scale-105`
                    : `bg-white ${config.border} hover:-translate-y-2 hover:shadow-lg`
                }`}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="relative flex items-start justify-between mb-2">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? 'bg-white/20' : config.bg} group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                    <Icon className={`text-base ${isActive ? 'text-white' : config.text}`} />
                  </div>
                  {isActive && <FiCheckCircle className="text-white text-sm" />}
                </div>

                <div className="min-h-[2.5rem] flex items-start">
                  <h4
                    className={`text-sm font-bold leading-tight line-clamp-2 break-words ${
                      isActive ? 'text-white' : 'text-[#0F1A18]'
                    }`}
                    title={type}
                  >
                    {type}
                  </h4>
                </div>

                <div className={`flex items-center gap-1.5 pt-1.5 mt-auto border-t ${isActive ? 'border-white/20' : 'border-[#E8F0EE]'}`}>
                  <FiUsers className={`text-xs ${isActive ? 'text-white/90' : 'text-[#3D5A55]'}`} />
                  <span className={`text-[11px] font-bold ${isActive ? 'text-white' : 'text-[#0F1A18]'}`}>
                    {users[type]?.length || 0}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {activeView === 'overview' ? (
        <OverviewTab
          key={`overview-${activeUserType}-${datePreset}`}
          activeUserType={activeUserType}
          stats={currentStats}
          config={currentConfig}
          dateRangeLabel={dateRangeLabel}
          datePreset={datePreset}
        />
      ) : (
        <ManageTab
          key={`manage-${activeUserType}-${datePreset}`}
          userType={activeUserType}
          users={currentUsers}
          onToggleBlock={requestToggleBlock}
          actionLoading={actionLoading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          viewMode={viewMode}
          setViewMode={setViewMode}
          dateRangeLabel={dateRangeLabel}
          showToast={showToast}
        />
      )}

      <div className="pb-30"/>

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(50px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes slide-down { from { opacity: 0; transform: translateY(-10px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes dropdown-in { from { opacity: 0; transform: translateY(-10px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes toast-in { from { opacity: 0; transform: translateY(50px) scale(0.9); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes card-in { from { opacity: 0; transform: translateY(30px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        @keyframes float-delayed { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(15px); } }
        @keyframes icon-float { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-3px) rotate(5deg); } }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
        .animate-slide-down { animation: slide-down 0.3s ease-out forwards; }
        .animate-dropdown-in { animation: dropdown-in 0.3s ease-out forwards; }
        .animate-toast-in { animation: toast-in 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards; }
        .animate-card-in { animation: card-in 0.5s ease-out forwards; opacity: 0; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .animate-icon-float { animation: icon-float 3s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 2s ease-in-out infinite; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #F1F5F4; border-radius: 4px; }
        ::-webkit-scrollbar-thumb { background: #8FA8A4; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #00695C; }
      `}</style>
    </div>
  );
};

export default VerificationManagement;