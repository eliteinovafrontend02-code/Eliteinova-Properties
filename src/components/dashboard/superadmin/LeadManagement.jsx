// src/components/dashboard/admin/superadmin/LeadManagement.jsx

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUsers, FiUser, FiUserPlus, FiUserCheck, FiUserX, FiUserMinus,
  FiSearch, FiChevronDown, FiChevronLeft, FiChevronRight, FiFilter,
  FiMoreVertical, FiExternalLink, FiArrowUp, FiArrowDown,
  FiEye, FiEdit, FiEdit3, FiSave, FiSave as FiSaveIcon, FiTrash2,
  FiPlus, FiMinus, FiCheck, FiCheckSquare, FiCheckCircle, FiXCircle,
  FiRefreshCw, FiRotateCcw, FiDownload, FiCopy, FiSlash, FiSend,
  FiPlayCircle, FiTool, FiLock, FiUnlock, FiMaximize, FiMinimize,
  FiInfo, FiAlertTriangle, FiShield, FiActivity, FiClock, FiStar,
  FiMessageSquare, FiMail, FiPhone, FiMapPin, FiCalendar,
  FiGrid, FiGrid as FiGridIcon, FiList, FiX, FiLayers, FiSquare,
  FiPackage, FiBox, FiDatabase, FiServer, FiCreditCard,
  FiHome, FiHome as FiHomeIcon,
  FiDollarSign, FiTrendingUp, FiPieChart, FiBarChart2, FiPercent,
  FiTarget, FiAward, FiBriefcase,
  FiTag, FiHash, FiKey, FiShoppingBag, FiClipboard, FiFileText,
  FiFlag, FiThumbsUp, FiNavigation, FiGlobe, FiZap, FiMap
} from 'react-icons/fi';

import {
  FaHome, FaHardHat, FaCheck, FaStar as FaStarSolid, FaCrown,
  FaGem, FaHotel, FaBriefcase
} from 'react-icons/fa';

// ============================================================
// CONSTANTS — UNIQUE COLORS
// ============================================================
const UNIQUE_COLORS = [
  '#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899',
  '#06B6D4', '#EF4444', '#84CC16', '#F97316', '#6366F1',
  '#14B8A6', '#A855F7', '#EAB308', '#0EA5E9', '#F43F5E'
];

// ============================================================
// LEAD STATUS CONFIG (aligned with LeadDashboardAndList)
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
// PURPOSE CONFIG (Buy / Rent / Lease) — drives the tabs & stats
// ============================================================
const PURPOSE_CONFIG = {
  'Buy': { icon: FiShoppingBag, bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', gradient: 'from-emerald-800 to-teal-600', color: '#10B981', description: 'Customers looking to purchase properties' },
  'Rent': { icon: FiKey, bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', gradient: 'from-blue-600 via-blue-500 to-indigo-400', color: '#3B82F6', description: 'Customers looking for rental properties' },
  'Lease': { icon: FiFileText, bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', gradient: 'from-purple-600 via-purple-500 to-violet-400', color: '#8B5CF6', description: 'Customers looking for lease agreements' }
};
const ALL_PURPOSES = ['Buy', 'Rent', 'Lease'];

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
const formatCurrency = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;
const formatDate = (date) => {
  try {
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return 'N/A';
  }
};
const formatDateTime = (date) => {
  try {
    return new Date(date).toLocaleString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  } catch {
    return 'N/A';
  }
};
const getDateRangeLabel = (preset, customStart, customEnd) => {
  if (preset === 'custom') return `${formatDate(customStart)} - ${formatDate(customEnd)}`;
  return DATE_RANGE_PRESETS.find(p => p.id === preset)?.label || 'Select Range';
};

// Seeded random
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
// MOCK LEADS GENERATOR (with date-range support)
// ============================================================
const generateMockLeads = (purposeFilter, count = 60, dateRange = 'month', customStart, customEnd) => {
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

  const now = new Date();
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

  const list = [];
  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const customerName = `${firstName} ${lastName}`;
    const leadStatus = ALL_LEAD_STATUSES[Math.floor(Math.random() * ALL_LEAD_STATUSES.length)];
    const priority = ALL_LEAD_PRIORITIES[Math.floor(Math.random() * ALL_LEAD_PRIORITIES.length)];
    const leadType = ALL_LEAD_TYPES[Math.floor(Math.random() * ALL_LEAD_TYPES.length)];
    const leadSource = ALL_LEAD_SOURCES[Math.floor(Math.random() * ALL_LEAD_SOURCES.length)];
    const propertyType = ALL_PROPERTY_TYPES[Math.floor(Math.random() * ALL_PROPERTY_TYPES.length)];
    const purpose = purposeFilter || ALL_PURPOSES[Math.floor(Math.random() * ALL_PURPOSES.length)];
    const assignedTo = agents[Math.floor(Math.random() * agents.length)];
    const propertyName = propertyNames[Math.floor(Math.random() * propertyNames.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];

    let leadDate;
    if (dateRange === 'today') {
      leadDate = new Date(now);
      leadDate.setHours(Math.floor(Math.random() * 12) + 8);
    } else if (dateRange === 'yesterday') {
      leadDate = new Date(now);
      leadDate.setDate(leadDate.getDate() - 1);
      leadDate.setHours(Math.floor(Math.random() * 12) + 8);
    } else {
      leadDate = new Date(now);
      leadDate.setDate(leadDate.getDate() - Math.floor(Math.random() * maxDaysBack));
    }

    let nextFollowUp = null;
    if (leadStatus !== 'Lost' && leadStatus !== 'Invalid Lead' && leadStatus !== 'Duplicate Lead') {
      nextFollowUp = new Date(now);
      nextFollowUp.setDate(nextFollowUp.getDate() + Math.floor(Math.random() * 14) + 1);
    }

    const mobileNum = `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`;
    const budget = Math.floor(Math.random() * 9000000) + 1000000;

    list.push({
      id: `lead_${purpose.toLowerCase()}_${i}_${Date.now()}`,
      leadId: `LEAD-${purpose.slice(0, 2).toUpperCase()}-${String(i).padStart(5, '0')}`,
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
      budget,
      purpose,
      notes: Math.random() > 0.7
        ? [{
            text: 'Follow-up call scheduled with customer.',
            addedBy: 'Admin',
            addedAt: new Date(now.getTime() - Math.random() * 86400000 * 7).toISOString()
          }]
        : []
    });
  }
  return list;
};

// ============================================================
// BUILD STATS FOR A PURPOSE (Buy / Rent / Lease)
// ============================================================
const buildPurposeStats = (purpose, leadList, datePreset) => {
  const labels = generateTimeSeriesLabels(datePreset);
  const growthSeed = seedFromString(`${purpose}_${datePreset}_growth`);
  const monthlyGrowth = generateGrowthSeries(labels, growthSeed);

  const total = leadList.length;
  const converted = leadList.filter(l => l.leadStatus === 'Negotiation' || l.leadStatus === 'Site Visit Completed').length;
  const lost = leadList.filter(l => l.leadStatus === 'Lost').length;

  return {
    total,
    pending: leadList.filter(l => l.status === 'pending').length,
    new: leadList.filter(l => l.leadStatus === 'New').length,
    contacted: leadList.filter(l => l.leadStatus === 'Contacted').length,
    interested: leadList.filter(l => l.leadStatus === 'Interested').length,
    followUp: leadList.filter(l => l.leadStatus === 'Follow-Up').length,
    siteVisitScheduled: leadList.filter(l => l.leadStatus === 'Site Visit Scheduled').length,
    siteVisitCompleted: leadList.filter(l => l.leadStatus === 'Site Visit Completed').length,
    negotiation: leadList.filter(l => l.leadStatus === 'Negotiation').length,
    lost,
    invalid: leadList.filter(l => l.leadStatus === 'Invalid Lead').length,
    duplicate: leadList.filter(l => l.leadStatus === 'Duplicate Lead').length,
    unassigned: leadList.filter(l => !l.assignedTo || l.assignedTo.trim() === '').length,
    assigned: leadList.filter(l => l.assignedTo && l.assignedTo.trim() !== '').length,
    highPriority: leadList.filter(l => l.priority === 'High').length,
    totalBudget: leadList.reduce((sum, l) => sum + (l.budget || 0), 0),
    avgBudget: total > 0 ? Math.floor(leadList.reduce((sum, l) => sum + (l.budget || 0), 0) / total) : 0,
    conversionRate: total > 0 ? ((converted / total) * 100).toFixed(1) : '0.0',
    lossRate: total > 0 ? ((lost / total) * 100).toFixed(1) : '0.0',

    statusDistribution: [
      { label: 'New', value: leadList.filter(l => l.leadStatus === 'New').length, color: '#3B82F6' },
      { label: 'Contacted', value: leadList.filter(l => l.leadStatus === 'Contacted').length, color: '#06B6D4' },
      { label: 'Interested', value: leadList.filter(l => l.leadStatus === 'Interested').length, color: '#10B981' },
      { label: 'Follow-Up', value: leadList.filter(l => l.leadStatus === 'Follow-Up').length, color: '#F59E0B' },
      { label: 'Visit Scheduled', value: leadList.filter(l => l.leadStatus === 'Site Visit Scheduled').length, color: '#8B5CF6' },
      { label: 'Visit Completed', value: leadList.filter(l => l.leadStatus === 'Site Visit Completed').length, color: '#6366F1' },
      { label: 'Negotiation', value: leadList.filter(l => l.leadStatus === 'Negotiation').length, color: '#F97316' },
      { label: 'Lost', value: leadList.filter(l => l.leadStatus === 'Lost').length, color: '#EF4444' },
      { label: 'Invalid', value: leadList.filter(l => l.leadStatus === 'Invalid Lead').length, color: '#64748B' },
      { label: 'Duplicate', value: leadList.filter(l => l.leadStatus === 'Duplicate Lead').length, color: '#EC4899' }
    ].filter(item => item.value > 0),

    sourceDistribution: ALL_LEAD_SOURCES.map((source, idx) => ({
      label: source,
      value: leadList.filter(l => l.leadSource === source).length,
      color: UNIQUE_COLORS[idx % UNIQUE_COLORS.length]
    })).filter(item => item.value > 0),

    typeDistribution: ALL_LEAD_TYPES.slice(0, 8).map((type, idx) => ({
      label: type.length > 14 ? type.slice(0, 14) + '…' : type,
      value: leadList.filter(l => l.leadType === type).length,
      color: UNIQUE_COLORS[idx % UNIQUE_COLORS.length]
    })).filter(item => item.value > 0),

    propertyTypeDistribution: ALL_PROPERTY_TYPES.map((pt, idx) => ({
      label: pt,
      value: leadList.filter(l => l.propertyType === pt).length,
      color: UNIQUE_COLORS[idx % UNIQUE_COLORS.length]
    })).filter(item => item.value > 0),

    priorityDistribution: ALL_LEAD_PRIORITIES.map((pr, idx) => ({
      label: pr,
      value: leadList.filter(l => l.priority === pr).length,
      color: pr === 'High' ? '#EF4444' : pr === 'Medium' ? '#F59E0B' : '#10B981'
    })),

    agentLeaderboard: [
      { name: 'Rajesh Kumar', value: leadList.filter(l => l.assignedTo === 'Rajesh Kumar').length, color: '#3B82F6' },
      { name: 'Priya Sharma', value: leadList.filter(l => l.assignedTo === 'Priya Sharma').length, color: '#10B981' },
      { name: 'Amit Patel', value: leadList.filter(l => l.assignedTo === 'Amit Patel').length, color: '#F59E0B' },
      { name: 'Sneha Reddy', value: leadList.filter(l => l.assignedTo === 'Sneha Reddy').length, color: '#8B5CF6' },
      { name: 'Vikram Singh', value: leadList.filter(l => l.assignedTo === 'Vikram Singh').length, color: '#EC4899' },
      { name: 'Anjali Desai', value: leadList.filter(l => l.assignedTo === 'Anjali Desai').length, color: '#06B6D4' }
    ].filter(item => item.value > 0),

    monthlyGrowth
  };
};

// ============================================================
// TOAST
// ============================================================
const Toast = ({ toast, setToast }) => {
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(t);
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
    warning: { gradient: 'from-amber-500 to-orange-400', btn: 'bg-gradient-to-r from-amber-500 to-orange-400 hover:shadow-amber-500/40', ring: 'bg-amber-50', iconColor: 'text-amber-600' }
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
      className="bg-white rounded-2xl p-2 shadow-sm hover:shadow-2xl transition-all duration-500 border border-[#E8F0EE] group cursor-pointer relative overflow-hidden animate-card-in"
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
                    style={{
                      background: `linear-gradient(135deg, ${item.color} 0%, ${item.color}CC 100%)`,
                      transform: isHovered ? 'scale(1.15) rotate(5deg)' : 'scale(1)'
                    }}>
                    {Icon && <Icon className="text-sm" />}
                  </div>
                  <div>
                    <p className={`text-sm font-black ${isHovered ? 'text-[#00695C]' : 'text-[#0F1A18]'}`}>{item.label}</p>
                    <p className="text-[10px] text-[#3D5A55] font-medium">{item.subtitle || `${percentage.toFixed(1)}% of total`}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black" style={{ color: item.color }}>{item.value.toLocaleString()}</p>
                  <p className="text-[10px] text-[#3D5A55] font-bold">leads</p>
                </div>
              </div>
              <div className="relative h-8 bg-[#F5F9F8] rounded-xl overflow-hidden">
                <div className="h-full rounded-xl transition-all duration-1000 ease-out relative overflow-hidden"
                  style={{
                    width: `${widthPercent}%`,
                    background: `linear-gradient(90deg, ${item.color} 0%, ${item.color}DD 100%)`,
                    boxShadow: isHovered ? `0 0 20px ${item.color}80` : `0 0 10px ${item.color}40`,
                    transitionDelay: `${index * 100}ms`
                  }}>
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
        <span className="text-xl font-black text-[#00695C]">{total.toLocaleString()} leads</span>
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
                style={{
                  filter: isHovered ? `drop-shadow(0 0 12px ${d.color})` : 'none',
                  opacity: hoveredIndex !== null && !isHovered ? 0.35 : 1
                }}
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
                    {d.value.toLocaleString()}
                  </div>
                </div>
              )}
              <div
                className={`text-[10px] font-black px-1.5 py-0.5 rounded-md mb-1 ${isHovered ? 'opacity-100' : 'opacity-60'}`}
                style={{ color: d.color, backgroundColor: `${d.color}15` }}
              >
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
      <div className="flex justify-between mt-3 gap-3 pt-2 border-t border-[#F1F5F4]">
        {data.map((d, i) => (
          <div key={i} className="flex-1 text-center min-w-0">
            <span className={`text-[11px] font-black truncate block ${hoveredIndex === i ? 'text-[#00695C]' : 'text-[#3D5A55]'}`}>
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
          <span className="text-[11px] font-black text-[#0F1A18]">{value.toLocaleString()}</span>
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: color }}>{pct.toFixed(1)}%</span>
        </div>
      </div>
      <div className="h-3.5 bg-[#EEF4F2] rounded-full overflow-hidden relative">
        <div
          className="h-full rounded-full transition-all duration-1000 relative overflow-hidden"
          style={{
            width: `${animatedPct}%`,
            background: `linear-gradient(90deg, ${color}, ${color}DD)`
          }}
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
const StatusBadge = ({ status }) => {
  const styles = {
    pending: 'bg-amber-100 text-amber-700',
    approved: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-red-100 text-red-700',
    not_submitted: 'bg-gray-100 text-gray-600',
    suspended: 'bg-gray-100 text-gray-700',
    blocked: 'bg-gray-100 text-gray-700'
  };
  const labels = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    not_submitted: 'Not Submitted',
    suspended: 'Suspended',
    blocked: 'Blocked'
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[9px] ${styles[status] || styles.not_submitted}`}>
      {labels[status] || 'Unknown'}
    </span>
  );
};

const LeadStatusBadge = ({ status }) => {
  const cfg = LEAD_STATUS_TYPES[status] || LEAD_STATUS_TYPES['New'];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[9px] ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
      <Icon className="text-[8px]" /> {cfg.label}
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  const cfg = LEAD_PRIORITY_TYPES[priority] || LEAD_PRIORITY_TYPES['Medium'];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[9px] ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
      <Icon className="text-[8px]" /> {cfg.label}
    </span>
  );
};

// ============================================================
// TINY HELPERS
// ============================================================
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center justify-between gap-2">
    <span className="flex items-center gap-2 text-[11px] font-bold text-[#3D5A55]">
      <span className="text-[#00695C]">{icon}</span> {label}
    </span>
    <span className="text-xs font-bold text-[#1A2E2A] truncate text-right max-w-[60%]">{value}</span>
  </div>
);

const MiniStat = ({ label, value, color }) => (
  <div className="text-center p-3 rounded-xl border-l-4" style={{ backgroundColor: '#F5F9F8', borderLeftColor: color }}>
    <p className="text-lg font-black" style={{ color }}>{value}</p>
    <p className="text-[9px] uppercase tracking-wider text-[#3D5A55] font-bold mt-0.5">{label}</p>
  </div>
);

// ============================================================
// VIEW LEAD DETAILS MODAL
// ============================================================
const ViewLeadDetailModal = ({ lead, show, onClose, onDelete }) => {
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

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up flex flex-col">
        <div className={`sticky top-0 px-6 py-5 rounded-t-3xl z-10 shrink-0 bg-gradient-to-r ${purposeConfig.gradient}`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition"
          >
            <FiX className="text-lg" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center text-white font-black text-2xl shadow-xl">
              {lead.customerName?.charAt(0) || 'L'}
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-white truncate">{lead.customerName}</h2>
              <p className="text-white/90 text-xs font-medium truncate">{lead.mobileNumber}</p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-bold flex items-center gap-1">
                  <PurposeIcon className="text-[10px]" /> {lead.purpose}
                </span>
                <LeadStatusBadge status={lead.leadStatus} />
                <PriorityBadge priority={lead.priority} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#F8FAF9]">
          <div className="bg-white rounded-2xl border border-[#E8F0EE] p-5">
            <h3 className="text-xs font-black text-[#3D5A55] uppercase tracking-wider mb-3 flex items-center gap-2">
              <FiInfo className="text-[#00695C]" /> Lead Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <InfoRow icon={<FiHash />} label="Lead ID" value={lead.leadId} />
                <InfoRow icon={<FiCalendar />} label="Lead Date" value={formatDate(lead.leadDate)} />
                <InfoRow icon={<FiUser />} label="Customer" value={lead.customerName} />
                <InfoRow icon={<FiPhone />} label="Mobile" value={lead.mobileNumber} />
                <InfoRow icon={<FiMail />} label="Email" value={lead.customerEmail || '—'} />
              </div>
              <div className="space-y-3">
                <InfoRow
                  icon={<PropTypeIcon />}
                  label="Property"
                  value={`${lead.propertyName} (${lead.propertyType})`}
                />
                <InfoRow icon={<FiMapPin />} label="Location" value={lead.location} />
                <InfoRow icon={<FiUserCheck />} label="Assigned To" value={lead.assignedTo || 'Unassigned'} />
                <InfoRow icon={<FiDollarSign />} label="Budget" value={formatCurrency(lead.budget)} />
                <InfoRow
                  icon={<FiCalendar />}
                  label="Next Follow-Up"
                  value={lead.nextFollowUp ? formatDateTime(lead.nextFollowUp) : 'Not scheduled'}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E8F0EE] p-5">
  <h3 className="text-xs font-black text-[#3D5A55] uppercase tracking-wider mb-3 flex items-center gap-2">
    <FiActivity className="text-[#00695C]" /> Lead Classification
  </h3>
  <div className="flex flex-wrap items-center gap-2">

    {/* Lead Type */}
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#E8F0EE] bg-[#F5F9F8]">
      <span className="text-[10px] font-bold text-[#3D5A55] uppercase tracking-wide">Lead Type:</span>
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] ${leadTypeConfig.bg} ${leadTypeConfig.text} border ${leadTypeConfig.border}`}>
        <LeadTypeIcon className="text-[10px]" /> {lead.leadType}
      </span>
    </span>

    {/* Lead Source */}
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#E8F0EE] bg-[#F5F9F8]">
      <span className="text-[10px] font-bold text-[#3D5A55] uppercase tracking-wide">Lead Source:</span>
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] ${leadSourceConfig.bg} ${leadSourceConfig.text} border ${leadSourceConfig.border}`}>
        <LeadSourceIcon className="text-[10px]" /> {lead.leadSource}
      </span>
    </span>

    {/* Purpose */}
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#E8F0EE] bg-[#F5F9F8]">
      <span className="text-[10px] font-bold text-[#3D5A55] uppercase tracking-wide">Purpose:</span>
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] ${purposeConfig.bg} ${purposeConfig.text} border ${purposeConfig.border}`}>
        <PurposeIcon className="text-[10px]" /> {lead.purpose}
      </span>
    </span>

    {/* Lead Status */}
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#E8F0EE] bg-[#F5F9F8]">
      <span className="text-[10px] font-bold text-[#3D5A55] uppercase tracking-wide">Lead Status:</span>
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] ${LEAD_STATUS_TYPES[lead.leadStatus]?.bg} ${LEAD_STATUS_TYPES[lead.leadStatus]?.text} border ${LEAD_STATUS_TYPES[lead.leadStatus]?.border}`}>
        <FiActivity className="text-[10px]" /> {lead.leadStatus}
      </span>
    </span>

    {/* Priority */}
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#E8F0EE] bg-[#F5F9F8]">
      <span className="text-[10px] font-bold text-[#3D5A55] uppercase tracking-wide">Priority:</span>
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] ${LEAD_PRIORITY_TYPES[lead.priority]?.bg} ${LEAD_PRIORITY_TYPES[lead.priority]?.text} border ${LEAD_PRIORITY_TYPES[lead.priority]?.border}`}>
        <FiFlag className="text-[10px]" /> {lead.priority}
      </span>
    </span>

  </div>
</div>

          {lead.siteVisitDate && (
            <div className="bg-purple-50 rounded-2xl p-5 border border-purple-200">
              <h3 className="text-xs font-black text-purple-700 uppercase tracking-wider mb-2 flex items-center gap-2">
                <FiNavigation className="text-purple-600" /> Site Visit Scheduled
              </h3>
              <p className="text-sm font-bold text-purple-900">{formatDateTime(lead.siteVisitDate)}</p>
              {lead.siteVisitNotes && <p className="text-xs text-purple-700 mt-1">📝 {lead.siteVisitNotes}</p>}
            </div>
          )}

          <div className="bg-white rounded-2xl border border-[#E8F0EE] p-5">
            <h3 className="text-xs font-black text-[#3D5A55] uppercase tracking-wider mb-3 flex items-center gap-2">
              <FiFileText className="text-[#00695C]" /> Description
            </h3>
            <p className="text-sm text-[#1A2E2A] font-medium">{lead.description || 'No description available.'}</p>
          </div>

          {lead.notes && lead.notes.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#E8F0EE] p-5">
              <h3 className="text-xs font-black text-[#3D5A55] uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiClipboard className="text-[#00695C]" /> Notes ({lead.notes.length})
              </h3>
              <div className="space-y-2">
                {lead.notes.map((note, idx) => (
                  <div key={idx} className="text-sm text-[#1A2E2A] bg-[#F5F9F8] rounded-lg p-3 border border-[#E8F0EE]">
                    <p className="font-medium">{note.text}</p>
                    <p className="text-[10px] text-[#5A7D78] mt-1.5">
                      {note.addedBy} • {formatDateTime(note.addedAt)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 px-6 py-4 bg-white border-t border-[#E8F0EE] flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition text-sm font-bold"
          >
            Close
          </button>
          <button
            onClick={() => { onDelete(lead.id); onClose(); }}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition text-sm font-bold shadow-lg shadow-red-600/30"
          >
            <FiTrash2 className="inline mr-2" /> Delete          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// TAB: OVERVIEW (Stats inside Buy / Rent / Lease)
// ============================================================
const OverviewTab = ({ activePurpose, stats, config, dateRangeLabel, datePreset }) => {
  const Icon = config.icon;

  const growthTitle = {
    today: 'Hourly Growth',
    yesterday: 'Hourly Growth',
    week: 'Daily Growth',
    month: 'Weekly Growth',
    quarter: 'Monthly Growth',
    year: 'Monthly Growth',
    all: 'Yearly Growth',
    custom: 'Period Growth'
  }[datePreset] || 'Growth Trend';

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#E8F4F2] to-[#D5F0EA] rounded-2xl p-3 border border-[#C5EDE5] flex items-center gap-2">
        <FiCalendar className="text-[#00695C] text-sm" />
        <span className="text-xs font-bold text-[#00695C]">Showing data for: {dateRangeLabel}</span>
      </div>

      {/* Purpose-specific primary stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Icon className="text-white text-base" />}
          title={`Total ${activePurpose} Leads`}
          value={stats.total || 0}
          trend={12.5}
          subtitle="All registered"
          color={`bg-gradient-to-br ${config.gradient}`}
          delay={0}
        />
        <StatCard
          icon={<FiTrendingUp className="text-white text-base" />}
          title="Conversion Rate"
          value={`${stats.conversionRate || 0}%`}
          trend={8.3}
          subtitle="Negotiation + Visit Done"
          color="bg-gradient-to-br from-emerald-600 to-teal-400"
          delay={100}
        />
        <StatCard
          icon={<FiDollarSign className="text-white text-base" />}
          title="Total Budget"
          value={formatCompact(stats.totalBudget || 0)}
          trend={15.2}
          subtitle="Sum of all budgets"
          color="bg-gradient-to-br from-purple-600 to-violet-400"
          delay={200}
        />
        <StatCard
          icon={<FiClock className="text-white text-base" />}
          title="Avg Budget"
          value={formatCompact(stats.avgBudget || 0)}
          trend={4.1}
          subtitle="Per lead"
          color="bg-gradient-to-br from-amber-600 to-yellow-400"
          delay={300}
        />
      </div>

      {/* Growth Trend + Priority Breakdown */}
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
            <FiPieChart className="text-[#00695C]" /> Priority Breakdown
          </h3>
          <DonutChart
            data={stats.priorityDistribution || []}
            size={220}
            thickness={48}
            centerLabel="Total"
            centerValue={stats.total || 0}
          />
        </div>
      </div>

      {/* Property Type Distribution (narrower) + Lead Sources (wider) */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm flex flex-col justify-start">
          <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2 self-start">
            <FiHomeIcon className="text-[#00695C]" /> Property Type Distribution
          </h3>
          <DonutChart
            data={stats.propertyTypeDistribution || []}
            size={220}
            thickness={48}
            centerLabel="Total"
            centerValue={stats.total || 0}
          />
        </div>

        <div className="xl:col-span-3 bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm">
          <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
            <FiGlobe className="text-[#00695C]" /> Lead Sources
          </h3>
          <BarChart data={stats.sourceDistribution || []} height={280} />
        </div>
      </div>

      {/* Lead Status Flow — bottom, full width */}
      <div className="bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-black text-[#0F1A18] flex items-center gap-2">
              <Icon className="animate-icon-float" style={{ color: config.color }} />
              {activePurpose} Lead Status Flow
            </h3>
            <p className="text-xs text-[#3D5A55] font-semibold">Distribution across the entire lead lifecycle</p>
          </div>
        </div>
        <FlowChart
          data={(stats.statusDistribution || []).map((item, idx) => ({
            ...item,
            icon: LEAD_STATUS_TYPES[item.label]?.icon || FiActivity,
            subtitle: `${((item.value / (stats.total || 1)) * 100).toFixed(1)}% of leads`
          }))}
          height={320}
        />
      </div>
    </div>
  );
};

// ============================================================
// TAB: LEADS LIST (the "Manage" tab inside each purpose)
// ============================================================
const LeadsManageTab = ({
  purpose, leads, onView, onDelete, onFilterChange,
  searchQuery, setSearchQuery, activeStatus, setActiveStatus,
  activePriority, setActivePriority, viewMode, setViewMode,
  actionLoading, dateRangeLabel
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const config = PURPOSE_CONFIG[purpose];

  const filtered = useMemo(() => {
    let result = [...leads];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(l =>
        l.customerName.toLowerCase().includes(q) ||
        l.leadId.toLowerCase().includes(q) ||
        l.mobileNumber.includes(q) ||
        l.propertyName.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q) ||
        (l.assignedTo || '').toLowerCase().includes(q)
      );
    }
    if (activeStatus !== 'all') result = result.filter(l => l.leadStatus === activeStatus);
    if (activePriority !== 'all') result = result.filter(l => l.priority === activePriority);
    return result;
  }, [leads, searchQuery, activeStatus, activePriority]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, activeStatus, activePriority, purpose]);

  const statusOptions = ALL_LEAD_STATUSES.map(s => ({ value: s, label: LEAD_STATUS_TYPES[s].label }));
  const priorityOptions = ALL_LEAD_PRIORITIES.map(p => ({ value: p, label: p }));

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E8F0EE] shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          <div className="flex-1 w-full relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A7D78] text-sm" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${purpose.toLowerCase()} leads...`}
              className="w-full pl-11 pr-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] text-sm text-[#0F1A18] placeholder:text-[#5A7D78] outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5A7D78] hover:text-[#1A2E2A]"
              >
                <FiX className="text-sm" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto">
            <div className="relative">
              <select
                value={activeStatus}
                onChange={(e) => setActiveStatus(e.target.value)}
                className="appearance-none px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] text-sm text-[#1A2E2A] outline-none cursor-pointer pr-10 hover:bg-[#E8F0EE]"
              >
                <option value="all">All Status</option>
                {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A7D78] text-sm pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={activePriority}
                onChange={(e) => setActivePriority(e.target.value)}
                className="appearance-none px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] text-sm text-[#1A2E2A] outline-none cursor-pointer pr-10 hover:bg-[#E8F0EE]"
              >
                <option value="all">All Priority</option>
                {priorityOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A7D78] text-sm pointer-events-none" />
            </div>

            <div className="flex items-center bg-[#F5F9F8] rounded-xl p-1 border border-[#E8F0EE]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#00695C]' : 'text-[#3D5A55]'}`}
              >
                <FiGrid className="text-sm" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-white shadow-sm text-[#00695C]' : 'text-[#3D5A55]'}`}
              >
                <FiList className="text-sm" />
              </button>
            </div>

            <span className="px-3 py-2 bg-[#E8F4F2] text-[#00695C] text-xs font-black rounded-xl">
              {filtered.length} leads
            </span>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-2 text-[10px] text-[#3D5A55] font-semibold">
          <FiCalendar className="text-[#00695C]" /> Showing leads from: {dateRangeLabel}
        </div>
      </div>

      {paginated.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E8F0EE]">
          <div className="w-24 h-24 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4 animate-float">
            <FiUsers className="text-4xl text-[#8FA8A4]" />
          </div>
          <h3 className="text-xl font-black text-[#0F1A18]">No {purpose.toLowerCase()} leads found</h3>
          <p className="text-sm text-[#3D5A55] mt-1 font-medium">Try adjusting your search or filter criteria</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {paginated.map((lead, index) => {
            const statusCfg = LEAD_STATUS_TYPES[lead.leadStatus] || LEAD_STATUS_TYPES['New'];
            const StatusIcon = statusCfg.icon;
            const priorityCfg = LEAD_PRIORITY_TYPES[lead.priority] || LEAD_PRIORITY_TYPES['Medium'];
            const PriorityIcon = priorityCfg.icon;
            const leadTypeCfg = LEAD_TYPE_CONFIG[lead.leadType] || LEAD_TYPE_CONFIG['Buy Enquiry'];
            const LeadTypeIcon = leadTypeCfg.icon;
            const sourceCfg = LEAD_SOURCE_CONFIG[lead.leadSource] || LEAD_SOURCE_CONFIG['Website'];
            const SourceIcon = sourceCfg.icon;
            const propTypeCfg = PROPERTY_TYPE_CONFIG[lead.propertyType] || PROPERTY_TYPE_CONFIG['Individual'];

            return (
              <div
                key={lead.id}
                className="bg-white rounded-2xl border border-[#E8F0EE] p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 animate-card-in"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${statusCfg.color} flex items-center justify-center text-white font-bold flex-shrink-0`}>
                      <StatusIcon className="text-lg" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-[#0F1A18] text-sm truncate">{lead.customerName}</h4>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <LeadStatusBadge status={lead.leadStatus} />
                        <PriorityBadge priority={lead.priority} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-[11px] text-[#3D5A55]">
                  <div className="flex items-center gap-2">
                    <FiHash className="text-[#00695C] flex-shrink-0" />
                    <span className="font-bold text-[#00695C] truncate">{lead.leadId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiPhone className="text-[#00695C] flex-shrink-0" />
                    <span className="truncate font-medium">{lead.mobileNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiHomeIcon className="text-[#00695C] flex-shrink-0" />
                    <span className="truncate font-medium">{lead.propertyName}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${propTypeCfg.bg} ${propTypeCfg.text} border ${propTypeCfg.border}`}>
                      {lead.propertyType}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMapPin className="text-[#00695C] flex-shrink-0" />
                    <span className="truncate font-medium">{lead.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiUserCheck className="text-[#00695C] flex-shrink-0" />
                    <span className="font-medium">{lead.assignedTo || 'Unassigned'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LeadTypeIcon className="text-[#00695C] flex-shrink-0" />
                    <span className="font-medium truncate">{lead.leadType}</span>
                    <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
                    <SourceIcon className="text-[#00695C] flex-shrink-0" />
                    <span className="font-medium truncate">{lead.leadSource}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiDollarSign className="text-[#00695C] flex-shrink-0" />
                    <span className="font-bold text-[#00695C]">{formatCurrency(lead.budget)}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-[#E8F0EE]">
                  <button
                    onClick={() => onView(lead)}
                    className="flex-1 py-1.5 text-xs font-bold text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] flex items-center justify-center gap-1"
                  >
                    <FiEye className="text-[10px]" /> View
                  </button>
                  <button
                    onClick={() => onDelete(lead.id)}
                    disabled={actionLoading === lead.id}
                    className="flex-1 py-1.5 text-xs font-bold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 flex items-center justify-center gap-1 disabled:opacity-50"
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
          <div className="grid grid-cols-12 gap-2 items-center px-4 py-3 bg-[#F5F9F8] border-b border-[#E8F0EE] text-[10px] font-bold text-[#3D5A55] uppercase tracking-wider">
            <div className="col-span-2">Lead ID</div>
            <div className="col-span-1">Customer</div>
            <div className="col-span-1">Mobile</div>
            <div className="col-span-2">Property</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1">Priority</div>
            <div className="col-span-1">Agent</div>
            <div className="col-span-1">Budget</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          {paginated.map((lead, index) => {
            const statusCfg = LEAD_STATUS_TYPES[lead.leadStatus] || LEAD_STATUS_TYPES['New'];
            const propTypeCfg = PROPERTY_TYPE_CONFIG[lead.propertyType] || PROPERTY_TYPE_CONFIG['Individual'];
            return (
              <div
                key={lead.id}
                className="grid grid-cols-12 gap-2 items-center px-4 py-3 border-b border-[#E8F0EE] hover:bg-[#F5F9F8] transition"
              >
                <div className="col-span-2 flex items-center gap-2 min-w-0">
                  <span className={`w-6 h-6 rounded-lg bg-gradient-to-br ${statusCfg.color} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}>
                    {lead.customerName.charAt(0)}
                  </span>
                  <span className="text-xs font-bold text-[#00695C] truncate">{lead.leadId}</span>
                </div>
                <div className="col-span-1 text-xs font-bold text-[#1A2E2A] truncate">{lead.customerName}</div>
                <div className="col-span-1 text-xs font-medium text-[#5A7D78] truncate">{lead.mobileNumber}</div>
                <div className="col-span-2 min-w-0">
                  <p className="text-xs font-medium text-[#1A2E2A] truncate">{lead.propertyName}</p>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${propTypeCfg.bg} ${propTypeCfg.text} border ${propTypeCfg.border}`}>
                    {lead.propertyType}
                  </span>
                </div>
                <div className="col-span-2"><LeadStatusBadge status={lead.leadStatus} /></div>
                <div className="col-span-1"><PriorityBadge priority={lead.priority} /></div>
                <div className="col-span-1 text-xs font-medium text-[#5A7D78] truncate">{lead.assignedTo || 'Unassigned'}</div>
                <div className="col-span-1 text-xs font-bold text-[#00695C] truncate">{formatCompact(lead.budget)}</div>
                <div className="col-span-1 flex items-center justify-end gap-1">
                  <button
                    onClick={() => onView(lead)}
                    className="w-7 h-7 rounded-lg hover:bg-[#E8F4F2] flex items-center justify-center text-[#00695C]"
                    title="View"
                  >
                    <FiEye className="text-md" />
                  </button>
                  <button
                    onClick={() => onDelete(lead.id)}
                    disabled={actionLoading === lead.id}
                    className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-red-600 disabled:opacity-50"
                    title="Delete"
                  >
                    {actionLoading === lead.id ? <FiRefreshCw className="text-xs animate-spin" /> : <FiTrash2 className="text-md" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between bg-white rounded-2xl px-4 py-3 border border-[#E8F0EE] shadow-sm gap-3">
          <div className="flex items-center gap-2 text-sm text-[#5A7D78] flex-wrap">
            <span className="font-medium">
              Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} leads
            </span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="ml-2 px-2 py-1 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] text-sm text-[#1A2E2A] outline-none font-medium"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 rounded-xl hover:bg-[#F5F9F8] flex items-center justify-center text-[#1A2E2A] disabled:opacity-50"
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
                  className={`w-9 h-9 rounded-xl transition text-sm font-bold ${
                    currentPage === pageNum
                      ? 'bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white shadow-lg'
                      : 'text-[#1A2E2A] hover:bg-[#F5F9F8]'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-9 h-9 rounded-xl hover:bg-[#F5F9F8] flex items-center justify-center text-[#1A2E2A] disabled:opacity-50"
            >
              <FiChevronRight className="text-sm" />
            </button>
          </div>
        </div>
      )}
    </div>
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
        <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-[#E8F0EE] py-2 z-[90] animate-slide-down">
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
              className="w-full flex items-center justify-between text-xs font-bold text-[#00695C] px-2 py-1.5 rounded-lg hover:bg-[#E8F4F2] transition-all"
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
                    className="w-full px-2 py-1.5 bg-white rounded-lg border border-[#E8F0EE] focus:border-[#00695C] text-xs text-[#0F1A18] font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#3D5A55] mb-1">To</label>
                  <input
                    type="date"
                    value={customEnd ? customEnd.toISOString().split('T')[0] : ''}
                    onChange={(e) => onCustomChange(customStart, new Date(e.target.value))}
                    className="w-full px-2 py-1.5 bg-white rounded-lg border border-[#E8F0EE] focus:border-[#00695C] text-xs text-[#0F1A18] font-medium outline-none"
                  />
                </div>
                <button
                  onClick={() => { onSelect('custom'); setIsOpen(false); setShowCustom(false); }}
                  disabled={!customStart || !customEnd}
                  className="w-full px-3 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg text-xs font-bold hover:shadow-lg transition disabled:opacity-50"
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
// MAIN COMPONENT
// ============================================================
const LeadManagement = () => {
  const [activePurpose, setActivePurpose] = useState('Buy');
  const [activeView, setActiveView] = useState('overview');
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStatus, setActiveStatus] = useState('all');
  const [activePriority, setActivePriority] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  const [confirmAction, setConfirmAction] = useState(null);

  const [datePreset, setDatePreset] = useState('month');
  const [customStart, setCustomStart] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [customEnd, setCustomEnd] = useState(new Date());

  const [leadsByPurpose, setLeadsByPurpose] = useState({ Buy: [], Rent: [], Lease: [] });
  const [purposeStats, setPurposeStats] = useState({});

  // View details modal
  const [viewingLead, setViewingLead] = useState(null);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  }, []);

  // Regenerate leads when date range changes
  useEffect(() => {
    const newLeads = {};
    const newStats = {};
    ALL_PURPOSES.forEach(purpose => {
      const list = generateMockLeads(purpose, Math.floor(Math.random() * 20) + 25, datePreset, customStart, customEnd);
      newLeads[purpose] = list;
      newStats[purpose] = buildPurposeStats(purpose, list, datePreset);
    });
    setLeadsByPurpose(newLeads);
    setPurposeStats(newStats);
  }, [datePreset, customStart, customEnd]);

  useEffect(() => {
    setSearchQuery('');
    setActiveStatus('all');
    setActivePriority('all');
  }, [activePurpose]);

  const currentLeads = leadsByPurpose[activePurpose] || [];
  const currentStats = purposeStats[activePurpose] || {};
  const currentConfig = PURPOSE_CONFIG[activePurpose];
  const dateRangeLabel = getDateRangeLabel(datePreset, customStart, customEnd);

  // ============================================================
  // DELETE LEAD
  // ============================================================
  const requestDeleteLead = useCallback((leadId) => {
    const lead = currentLeads.find(l => l.id === leadId);
    if (!lead) return;
    setConfirmAction({
      leadId,
      title: 'Delete Lead?',
      message: `Are you sure you want to delete lead "${lead.leadId}" for ${lead.customerName}? This cannot be undone.`,
      confirmText: 'Yes, Delete',
      cancelText: 'No, Cancel',
      type: 'danger',
      icon: FiTrash2,
      onConfirm: () => {
        setActionLoading(leadId);
        setTimeout(() => {
          setLeadsByPurpose(prev => {
            const updated = {
              ...prev,
              [activePurpose]: prev[activePurpose].filter(l => l.id !== leadId)
            };
            setPurposeStats(prevStats => ({
              ...prevStats,
              [activePurpose]: buildPurposeStats(activePurpose, updated[activePurpose], datePreset)
            }));
            return updated;
          });
          setActionLoading(null);
          showToast(`Lead "${lead.leadId}" deleted`, 'warning');
          setConfirmAction(null);
        }, 600);
      }
    });
  }, [currentLeads, activePurpose, datePreset, showToast]);

  const handleConfirmAction = useCallback(() => {
    if (confirmAction && confirmAction.onConfirm) {
      confirmAction.onConfirm();
    } else {
      setConfirmAction(null);
    }
  }, [confirmAction]);

  // ============================================================
  // REFRESH
  // ============================================================
  const handleRefresh = useCallback(() => {
    setActionLoading('refresh');
    setTimeout(() => {
      const newList = generateMockLeads(activePurpose, Math.floor(Math.random() * 20) + 25, datePreset, customStart, customEnd);
      setLeadsByPurpose(prev => ({ ...prev, [activePurpose]: newList }));
      setPurposeStats(prev => ({ ...prev, [activePurpose]: buildPurposeStats(activePurpose, newList, datePreset) }));
      setActionLoading(null);
      showToast('Data refreshed successfully', 'success');
    }, 800);
  }, [activePurpose, datePreset, customStart, customEnd, showToast]);

  // ============================================================
  // EXPORT
  // ============================================================
  const handleExport = useCallback(() => {
    if (currentLeads.length === 0) {
      showToast('No data to export', 'warning');
      return;
    }
    const data = currentLeads.map(l => ({
      'Lead ID': l.leadId,
      'Lead Date': formatDate(l.leadDate),
      'Customer Name': l.customerName,
      'Mobile': l.mobileNumber,
      'Email': l.customerEmail,
      'Property': l.propertyName,
      'Property Type': l.propertyType,
      'Location': l.location,
      'Assigned To': l.assignedTo || 'Unassigned',
      'Lead Status': l.leadStatus,
      'Priority': l.priority,
      'Lead Type': l.leadType,
      'Lead Source': l.leadSource,
      'Purpose': l.purpose,
      'Budget': l.budget
    }));
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activePurpose.toLowerCase()}_leads_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast(`${currentLeads.length} ${activePurpose.toLowerCase()} leads exported`, 'success');
  }, [currentLeads, activePurpose, showToast]);

  // ============================================================
  // VIEW LEAD
  // ============================================================
  const handleViewLead = useCallback((lead) => {
    setViewingLead(lead);
  }, []);

  return (
    <div className="space-y-6 p-4 lg:p-6 min-h-screen bg-[#F8FAF9]">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
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
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmAction(null)}
      />

      <ViewLeadDetailModal
        lead={viewingLead}
        show={!!viewingLead}
        onClose={() => setViewingLead(null)}
        onDelete={requestDeleteLead}
      />

      {/* Header */}
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-[#00695C] via-[#26A69A] to-[#4DB6AC] bg-clip-text text-transparent">
                Lead Management
              </h1>
              <span className="px-3 py-1.5 bg-gradient-to-r from-[#E8F4F2] to-[#D5F0EA] text-[#00695C] text-xs font-black rounded-full flex items-center gap-1.5">
                <FiActivity className="text-[10px]" /> Super Admin
              </span>
            </div>
            <p className="text-sm text-[#3D5A55] font-semibold flex items-center gap-2 flex-wrap">
              <span>Manage Buy, Rent & Lease leads across all sources, agents & properties</span>
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
              <FiList className="text-sm" />
              <span>Manage</span>
            </button>
            <button
              onClick={handleRefresh}
              disabled={actionLoading === 'refresh'}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E8F0EE] rounded-xl text-sm font-black text-[#0F1A18] hover:scale-105 transition-all disabled:opacity-50"
            >
              <FiRefreshCw className={`text-sm ${actionLoading === 'refresh' ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{actionLoading === 'refresh' ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E8F0EE] rounded-xl text-sm font-black text-[#0F1A18] hover:scale-105 transition-all"
            >
              <FiDownload className="text-sm" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Purpose Selector — Buy / Rent / Lease */}
      <div className="relative z-0">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {ALL_PURPOSES.map((purpose, idx) => {
            const cfg = PURPOSE_CONFIG[purpose];
            const Icon = cfg.icon;
            const isActive = activePurpose === purpose;
            const purposeLeads = leadsByPurpose[purpose] || [];
            return (
              <div
                key={purpose}
                onClick={() => setActivePurpose(purpose)}
                className={`rounded-2xl p-5 cursor-pointer transition-all duration-500 border-2 hover:shadow-xl group relative overflow-hidden animate-card-in ${
                  isActive
                    ? `bg-gradient-to-br ${cfg.gradient} border-transparent shadow-xl scale-105`
                    : `bg-white ${cfg.border} hover:-translate-y-2 hover:shadow-lg`
                }`}
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className="relative flex items-start justify-between mb-3">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${isActive ? 'bg-white/20' : cfg.bg} group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                    <Icon className={`text-2xl ${isActive ? 'text-white' : cfg.text}`} />
                  </div>
                  {isActive && <FiCheckCircle className="text-white text-lg" />}
                </div>
                <h4 className={`text-lg font-bold mb-1 ${isActive ? 'text-white' : 'text-[#0F1A18]'}`}>{purpose}</h4>
                <p className={`text-[11px] font-medium mb-3 ${isActive ? 'text-white/90' : 'text-[#3D5A55]'}`}>{cfg.description}</p>
                <div className={`flex items-center justify-between pt-3 border-t ${isActive ? 'border-white/20' : 'border-[#E8F0EE]'}`}>
                  <div className="flex items-center gap-2">
                    <FiUsers className={`text-sm ${isActive ? 'text-white/90' : 'text-[#3D5A55]'}`} />
                    <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-[#0F1A18]'}`}>{purposeLeads.length} leads</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : `${cfg.bg} ${cfg.text}`
                  }`}>
                    {purposeStats[purpose]?.conversionRate || 0}% conv.
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {activeView === 'overview' ? (
        <OverviewTab
          key={`overview-${activePurpose}-${datePreset}`}
          activePurpose={activePurpose}
          stats={currentStats}
          config={currentConfig}
          dateRangeLabel={dateRangeLabel}
          datePreset={datePreset}
        />
      ) : (
        <div key={`manage-${activePurpose}-${datePreset}`}>
          <LeadsManageTab
            purpose={activePurpose}
            leads={currentLeads}
            onView={handleViewLead}
            onDelete={requestDeleteLead}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeStatus={activeStatus}
            setActiveStatus={setActiveStatus}
            activePriority={activePriority}
            setActivePriority={setActivePriority}
            viewMode={viewMode}
            setViewMode={setViewMode}
            actionLoading={actionLoading}
            dateRangeLabel={dateRangeLabel}
          />
        </div>
      )}

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

export default LeadManagement;