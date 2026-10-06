// src/components/admin/LeadManagement/LeadReports.jsx

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import {
  FiSearch, FiChevronDown, FiRefreshCw, FiDownload, FiAlertTriangle, FiInfo, FiX,
  FiTag, FiCheckCircle, FiXCircle, FiBriefcase, FiActivity, FiUser, FiMail,
  FiPhone, FiClock, FiRotateCcw, FiDollarSign, FiTrendingUp, FiCalendar, FiHome,
  FiClipboard, FiKey, FiMap, FiPieChart, FiBarChart2, FiFilter, FiSliders,
  FiGlobe, FiShield, FiZap, FiStar, FiAward, FiBox, FiTarget, FiArrowUp,
  FiArrowDown, FiPercent, FiLayers, FiMapPin, FiEdit3, FiFileText, FiDatabase,
  FiMoreHorizontal, FiChevronRight, FiTrendingDown, FiMinus, FiPlus, FiMaximize,
  FiMinimize, FiCpu, FiPackage, FiInbox, FiSend, FiUsers, FiUserCheck, FiUserX,
  FiNavigation, FiCheckSquare, FiCopy, FiSlash, FiExternalLink, FiEye,
  FiFlag, FiShoppingBag, FiMessageCircle, FiMessageSquare,
  FiHome as FiHomeIcon
} from 'react-icons/fi';
import {
  FaHome, FaHotel, FaHardHat, FaBuilding, FaStore, FaRupeeSign
} from 'react-icons/fa';

// ============================================================
// UNIQUE COLOR PALETTE 
// ============================================================
const UNIQUE_COLORS = [
  '#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899',
  '#06B6D4', '#EF4444', '#84CC16', '#F97316', '#6366F1',
  '#14B8A6', '#A855F7', '#EAB308', '#0EA5E9', '#F43F5E',
  '#22C55E', '#0EA5E9', '#D946EF', '#FB923C', '#4ADE80'
];

// ============================================================
// USER TYPE CONFIG
// ============================================================
const USER_TYPE_CONFIG = {
  'Owner': { icon: FaHome, color: '#10B981' },
  'Agent': { icon: FiBriefcase, color: '#3B82F6' },
  'Builder': { icon: FaHardHat, color: '#F97316' },
  'Property Manager': { icon: FiClipboard, color: '#8B5CF6' }
};

// ============================================================
// LEAD STATUS CONFIG
// ============================================================
const LEAD_STATUS_TYPES = {
  'New': { icon: FiStar, hexColor: '#3B82F6' },
  'Contacted': { icon: FiPhone, hexColor: '#06B6D4' },
  'Interested': { icon: FiCheckCircle, hexColor: '#10B981' },
  'Follow-Up': { icon: FiRefreshCw, hexColor: '#F59E0B' },
  'Site Visit Scheduled': { icon: FiCalendar, hexColor: '#8B5CF6' },
  'Site Visit Completed': { icon: FiCheckSquare, hexColor: '#6366F1' },
  'Negotiation': { icon: FiDollarSign, hexColor: '#F97316' },
  'Lost': { icon: FiXCircle, hexColor: '#EF4444' },
  'Invalid Lead': { icon: FiSlash, hexColor: '#64748B' },
  'Duplicate Lead': { icon: FiCopy, hexColor: '#EC4899' }
};
const ALL_LEAD_STATUSES = Object.keys(LEAD_STATUS_TYPES);

// ============================================================
// LEAD PRIORITY CONFIG
// ============================================================
const LEAD_PRIORITY_TYPES = {
  'High': { icon: FiFlag, hexColor: '#EF4444' },
  'Medium': { icon: FiFlag, hexColor: '#F59E0B' },
  'Low': { icon: FiFlag, hexColor: '#10B981' }
};
const ALL_LEAD_PRIORITIES = Object.keys(LEAD_PRIORITY_TYPES);

// ============================================================
// LEAD TYPE CONFIG
// ============================================================
const LEAD_TYPE_CONFIG = {
  'Buy Enquiry': { icon: FiShoppingBag, color: '#10B981' },
  'Rent Enquiry': { icon: FiKey, color: '#3B82F6' },
  'Lease Enquiry': { icon: FiFileText, color: '#8B5CF6' },
  'Property Listing Enquiry': { icon: FaHome, color: '#F59E0B' },
  'Property Contact Request': { icon: FiPhone, color: '#06B6D4' },
  'Site Visit Request': { icon: FiCalendar, color: '#6366F1' },
  'Property Information Request': { icon: FiInfo, color: '#EC4899' },
  'Price Enquiry': { icon: FiDollarSign, color: '#F97316' },
  'Home Construction Enquiry': { icon: FaHardHat, color: '#EAB308' },
  'Land Purchase Enquiry': { icon: FiMap, color: '#84CC16' },
  'Property Management Enquiry': { icon: FiClipboard, color: '#14B8A6' },
  'Service Enquiry': { icon: FiBriefcase, color: '#0EA5E9' },
  'Other Enquiry': { icon: FiMoreHorizontal, color: '#64748B' }
};
const ALL_LEAD_TYPES = Object.keys(LEAD_TYPE_CONFIG);

// ============================================================
// LEAD SOURCE CONFIG
// ============================================================
const LEAD_SOURCE_CONFIG = {
  'Website': { icon: FiGlobe, color: '#3B82F6' },
  'Advertisement': { icon: FiTarget, color: '#F97316' },
  'Social Media': { icon: FiUsers, color: '#EC4899' },
  'Referral': { icon: FiAward, color: '#10B981' },
  'Direct Enquiry': { icon: FiSend, color: '#8B5CF6' },
  'Others': { icon: FiMoreHorizontal, color: '#64748B' }
};
const ALL_LEAD_SOURCES = Object.keys(LEAD_SOURCE_CONFIG);

// ============================================================
// PROPERTY TYPE CONFIG
// ============================================================
const PROPERTY_TYPES = [
  { label: 'Individual', icon: FaHome, color: '#10B981', gradient: 'from-emerald-500 to-teal-400' },
  { label: 'Apartment', icon: FaBuilding, color: '#3B82F6', gradient: 'from-blue-500 to-indigo-400' },
  { label: 'Commercial', icon: FaStore, color: '#F59E0B', gradient: 'from-amber-500 to-orange-400' },
  { label: 'Land & Plots', icon: FiMap, color: '#8B5CF6', gradient: 'from-violet-500 to-purple-400' },
  { label: 'Hostel', icon: FaHotel, color: '#EC4899', gradient: 'from-pink-500 to-rose-400' }
];

// ============================================================
// PURPOSE CONFIG
// ============================================================
const PURPOSE_CONFIG = {
  'Buy': { icon: FiShoppingBag, color: '#10B981' },
  'Rent': { icon: FiKey, color: '#3B82F6' },
  'Lease': { icon: FiFileText, color: '#8B5CF6' }
};
const ALL_PURPOSES = Object.keys(PURPOSE_CONFIG);

// ============================================================
// CUSTOMER TYPE CONFIG
// ============================================================
const CUSTOMER_TYPES = ['Individual', 'Business', 'NRI', 'Corporate'];
const ALL_CUSTOMER_TYPES = CUSTOMER_TYPES;

// ============================================================
// ASSIGNED STAFF (Mock)
// ============================================================
const AVAILABLE_STAFF = [
  { id: 'staff_1', name: 'Rajesh Kumar', role: 'Senior Agent' },
  { id: 'staff_2', name: 'Priya Sharma', role: 'Sales Manager' },
  { id: 'staff_3', name: 'Amit Patel', role: 'Field Agent' },
  { id: 'staff_4', name: 'Sneha Reddy', role: 'Lease Specialist' },
  { id: 'staff_5', name: 'Vikram Singh', role: 'Senior Agent' },
  { id: 'staff_6', name: 'Anjali Desai', role: 'Junior Agent' }
];

// ============================================================
// LOCATIONS
// ============================================================
const STATES = ['Maharashtra', 'Karnataka', 'Delhi', 'Telangana', 'Tamil Nadu', 'West Bengal', 'Gujarat', 'Rajasthan', 'Uttar Pradesh'];
const CITIES = ['Mumbai', 'Pune', 'Bangalore', 'Delhi', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow'];
const AREAS = ['Andheri', 'Koramangala', 'Whitefield', 'Gurgaon', 'Hitech City', 'OMR', 'Salt Lake', 'SG Highway', 'Malviya Nagar', 'Gomti Nagar'];

// ============================================================
// BUDGET RANGES
// ============================================================
const BUDGET_RANGES = [
  { id: 'under_10l', label: 'Under ₹10L' },
  { id: '10l_25l', label: '₹10L - ₹25L' },
  { id: '25l_50l', label: '₹25L - ₹50L' },
  { id: '50l_1cr', label: '₹50L - ₹1Cr' },
  { id: 'above_1cr', label: 'Above ₹1Cr' }
];

// ============================================================
// REPORT TYPES (14 Reports)
// ============================================================
const REPORT_TYPES = [
  { id: 'daily', title: 'Daily Lead Report', desc: 'Day-wise analytics', icon: FiCalendar, bg: 'bg-emerald-100', text: 'text-emerald-700' },
  { id: 'weekly', title: 'Weekly Lead Report', desc: 'Week-wise trends', icon: FiCalendar, bg: 'bg-blue-100', text: 'text-blue-700' },
  { id: 'monthly', title: 'Monthly Lead Report', desc: 'Month-wise trends', icon: FiCalendar, bg: 'bg-purple-100', text: 'text-purple-700' },
  { id: 'source', title: 'Source-wise Lead Report', desc: 'Source analytics', icon: FiGlobe, bg: 'bg-cyan-50', text: 'text-cyan-700' },
  { id: 'property', title: 'Property-wise Lead Report', desc: 'Property analytics', icon: FaBuilding, bg: 'bg-amber-100', text: 'text-amber-700' },
  { id: 'location', title: 'Location-wise Lead Report', desc: 'Location analytics', icon: FiMapPin, bg: 'bg-pink-100', text: 'text-pink-700' },
  { id: 'owner', title: 'Owner-wise Lead Report', desc: 'Owner analytics', icon: FaHome, bg: 'bg-teal-100', text: 'text-teal-700' },
  { id: 'agent', title: 'Agent-wise Lead Report', desc: 'Agent analytics', icon: FiBriefcase, bg: 'bg-indigo-50', text: 'text-indigo-700' },
  { id: 'builder', title: 'Builder-wise Lead Report', desc: 'Builder analytics', icon: FaHardHat, bg: 'bg-orange-100', text: 'text-orange-700' },
  { id: 'pm', title: 'Property Mgmt-wise Report', desc: 'PM analytics', icon: FiClipboard, bg: 'bg-violet-100', text: 'text-violet-700' },
  { id: 'staff', title: 'Assigned Staff-wise Report', desc: 'Staff performance', icon: FiUserCheck, bg: 'bg-lime-50', text: 'text-lime-700' },
  { id: 'lost', title: 'Lost Lead Report', desc: 'Lost analytics', icon: FiXCircle, bg: 'bg-red-100', text: 'text-red-700' },
  { id: 'followup', title: 'Follow-Up Report', desc: 'Follow-up analytics', icon: FiRefreshCw, bg: 'bg-yellow-100', text: 'text-yellow-700' },
  { id: 'sitevisit', title: 'Site Visit Report', desc: 'Site visit analytics', icon: FiNavigation, bg: 'bg-sky-50', text: 'text-sky-700' }
];

// ============================================================
// REPORT TITLES MAP
// ============================================================
const REPORT_TITLES = {
  daily: 'Daily Lead Report',
  weekly: 'Weekly Lead Report',
  monthly: 'Monthly Lead Report',
  source: 'Source-wise Lead Report',
  property: 'Property-wise Lead Report',
  location: 'Location-wise Lead Report',
  owner: 'Owner-wise Lead Report',
  agent: 'Agent-wise Lead Report',
  builder: 'Builder-wise Lead Report',
  pm: 'Property Management-wise Lead Report',
  staff: 'Assigned Staff-wise Lead Report',
  lost: 'Lost Lead Report',
  followup: 'Follow-Up Report',
  sitevisit: 'Site Visit Report'
};
const ALL_REPORT_IDS = Object.keys(REPORT_TITLES);

// ============================================================
// DATE RANGE PRESETS
// ============================================================
const DATE_RANGE_PRESETS = [
  { id: 'today', label: 'Today', icon: FiCalendar },
  { id: 'yesterday', label: 'Yesterday', icon: FiClock },
  { id: 'week', label: 'This Week', icon: FiCalendar },
  { id: 'month', label: 'This Month', icon: FiCalendar },
  { id: 'quarter', label: 'This Quarter', icon: FiBarChart2 },
  { id: 'year', label: 'This Year', icon: FiTrendingUp },
  { id: 'all', label: 'All Time', icon: FiDatabase }
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
const formatNumber = (num) => Number(num || 0).toLocaleString('en-IN');
const formatDate = (date) => date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const getDateRangeLabel = (preset, customStart, customEnd) => {
  if (preset === 'custom') return `${formatDate(customStart)} - ${formatDate(customEnd)}`;
  return DATE_RANGE_PRESETS.find(p => p.id === preset)?.label || 'Select Range';
};

// ============================================================
// STATS GENERATOR
// ============================================================
const generateStatsFor = () => {
  const totalLeads = Math.floor(Math.random() * 5000) + 500;
  const convertedLeads = Math.floor(totalLeads * (Math.random() * 0.3 + 0.15));
  const lostLeads = Math.floor(totalLeads * (Math.random() * 0.2 + 0.1));
  
  return {
    totalLeads,
    newLeads: Math.floor(totalLeads * (Math.random() * 0.3 + 0.2)),
    contactedLeads: Math.floor(totalLeads * (Math.random() * 0.2 + 0.15)),
    interestedLeads: Math.floor(totalLeads * (Math.random() * 0.15 + 0.1)),
    followUpLeads: Math.floor(totalLeads * (Math.random() * 0.15 + 0.1)),
    siteVisitScheduled: Math.floor(totalLeads * (Math.random() * 0.1 + 0.05)),
    siteVisitCompleted: Math.floor(totalLeads * (Math.random() * 0.08 + 0.04)),
    negotiationLeads: Math.floor(totalLeads * (Math.random() * 0.1 + 0.05)),
    convertedLeads,
    lostLeads,
    invalidLeads: Math.floor(totalLeads * (Math.random() * 0.05 + 0.02)),
    duplicateLeads: Math.floor(totalLeads * (Math.random() * 0.03 + 0.01)),
    conversionRate: ((convertedLeads / totalLeads) * 100).toFixed(1),
    lostRate: ((lostLeads / totalLeads) * 100).toFixed(1),
    avgResponseTime: (Math.random() * 24 + 2).toFixed(1),
    avgConversionTime: (Math.random() * 30 + 7).toFixed(1),
    totalBudget: Math.floor(Math.random() * 500000000) + 50000000,
    avgBudget: Math.floor(Math.random() * 5000000) + 500000,
    assignedLeads: Math.floor(totalLeads * (Math.random() * 0.3 + 0.6)),
    todayLeads: Math.floor(Math.random() * 50) + 10,
    weekLeads: Math.floor(Math.random() * 200) + 50,
    monthLeads: Math.floor(Math.random() * 800) + 200
  };
};

// ============================================================
// CHART DATA GENERATORS
// ============================================================
const generateTimeSeriesData = (preset) => {
  let labels = [];
  if (preset === 'today' || preset === 'yesterday') labels = Array.from({ length: 12 }, (_, i) => `${i * 2}:00`);
  else if (preset === 'week') labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  else if (preset === 'month') labels = ['W1', 'W2', 'W3', 'W4'];
  else if (preset === 'quarter') labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  else if (preset === 'year') labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  else labels = ['2020', '2021', '2022', '2023', '2024', '2025'];
  
  return labels.map(label => ({ label, value: Math.floor(Math.random() * 500) + 50 }));
};

const generateDistribution = (items) => {
  return items.map((item, idx) => ({
    label: typeof item === 'string' ? item : item.label,
    value: Math.floor(Math.random() * 800) + 100,
    color: (typeof item === 'object' && item.color) ? item.color : UNIQUE_COLORS[idx % UNIQUE_COLORS.length]
  }));
};

// ============================================================
// EXPORT DATA BUILDER
// ============================================================
const buildExportData = (activeReport, stats, timeSeriesData, statusData, priorityData, sourceData, propertyData, locationData, staffData) => {
  const rows = [];
  
  switch (activeReport) {
    case 'daily':
    case 'weekly':
    case 'monthly':
      rows.push(['Metric', 'Value', 'Trend']);
      rows.push(['Total Leads', formatNumber(stats.totalLeads), '+12.5%']);
      rows.push(['New Leads', formatNumber(stats.newLeads), '+8.3%']);
      rows.push(['Contacted', formatNumber(stats.contactedLeads), '+5.2%']);
      rows.push(['Interested', formatNumber(stats.interestedLeads), '+7.8%']);
      rows.push(['Conversion Rate', `${stats.conversionRate}%`, '+2.5%']);
      rows.push([]);
      rows.push(['Period', 'Leads']);
      timeSeriesData.forEach(d => rows.push([d.label, d.value]));
      rows.push([]);
      rows.push(['Status', 'Count']);
      statusData.forEach(d => rows.push([d.label, d.value]));
      break;

    case 'source':
      rows.push(['Metric', 'Value', 'Trend']);
      rows.push(['Total Leads', formatNumber(stats.totalLeads), '+12.5%']);
      rows.push(['Top Source', sourceData[0]?.label || 'Website', '+15.2%']);
      rows.push(['Conversion Rate', `${stats.conversionRate}%`, '+2.5%']);
      rows.push([]);
      rows.push(['Source', 'Leads', 'Converted']);
      sourceData.forEach(d => {
        const converted = Math.floor(d.value * (Math.random() * 0.3 + 0.1));
        rows.push([d.label, d.value, converted]);
      });
      break;

    case 'property':
      rows.push(['Metric', 'Value', 'Trend']);
      rows.push(['Total Leads', formatNumber(stats.totalLeads), '+12.5%']);
      rows.push(['Top Type', 'Apartment', '+15.2%']);
      rows.push(['Avg Budget', formatCompact(stats.avgBudget), '+3.2%']);
      rows.push([]);
      rows.push(['Property Type', 'Leads', 'Converted']);
      propertyData.forEach(d => {
        const converted = Math.floor(d.value * (Math.random() * 0.3 + 0.1));
        rows.push([d.label, d.value, converted]);
      });
      break;

    case 'location':
      rows.push(['Metric', 'Value', 'Trend']);
      rows.push(['Total Leads', formatNumber(stats.totalLeads), '+12.5%']);
      rows.push(['Top State', 'Maharashtra', '+15.2%']);
      rows.push(['Top City', 'Mumbai', '+12.8%']);
      rows.push([]);
      rows.push(['Location', 'Leads', 'Converted']);
      locationData.forEach(d => {
        const converted = Math.floor(d.value * (Math.random() * 0.3 + 0.1));
        rows.push([d.label, d.value, converted]);
      });
      break;

    case 'owner':
    case 'agent':
    case 'builder':
    case 'pm':
      const roleKey = { owner: 'Owner', agent: 'Agent', builder: 'Builder', pm: 'Property Manager' }[activeReport];
      rows.push(['Metric', 'Value', 'Trend']);
      rows.push([`Total ${roleKey}s`, formatNumber(Math.floor(stats.totalLeads * 0.1)), '+8.4%']);
      rows.push(['Total Leads', formatNumber(stats.totalLeads), '+12.5%']);
      rows.push(['Conversion Rate', `${stats.conversionRate}%`, '+2.5%']);
      rows.push([]);
      rows.push(['Rank', 'Name', 'Leads', 'Converted']);
      const roleNames = {
        'Owner': ['Priya Properties', 'Suresh Estates', 'Anitha Homes', 'Vijay Realty', 'Meena Properties'],
        'Agent': ['Rajesh Kumar', 'Priya Sharma', 'Suresh Reddy', 'Anitha Nair', 'Vijay Menon'],
        'Builder': ['Suresh Builders', 'Prestige Group', 'DLF Ltd', 'Godrej Properties', 'Lodha Group'],
        'Property Manager': ['ABC Property Mgmt', 'Prime Estates', 'Urban Homes', 'Metro PM', 'City Managers']
      }[roleKey] || [];
      const shareArr = [0.30, 0.24, 0.18, 0.16, 0.12];
      roleNames.forEach((n, i) => {
        const leads = Math.floor(stats.totalLeads * shareArr[i]);
        const converted = Math.floor(leads * (Math.random() * 0.3 + 0.1));
        rows.push([i + 1, n, leads, converted]);
      });
      break;

    case 'staff':
      rows.push(['Metric', 'Value', 'Trend']);
      rows.push(['Total Staff', AVAILABLE_STAFF.length, '0%']);
      rows.push(['Total Leads', formatNumber(stats.totalLeads), '+12.5%']);
      rows.push(['Assigned Leads', formatNumber(stats.assignedLeads), '+10.2%']);
      rows.push([]);
      rows.push(['Rank', 'Name', 'Role', 'Leads', 'Converted']);
      AVAILABLE_STAFF.forEach((s, i) => {
        const leads = Math.floor(stats.totalLeads * [0.25, 0.22, 0.18, 0.15, 0.12, 0.08][i]);
        const converted = Math.floor(leads * (Math.random() * 0.3 + 0.1));
        rows.push([i + 1, s.name, s.role, leads, converted]);
      });
      break;

    case 'lost':
      rows.push(['Metric', 'Value', 'Trend']);
      rows.push(['Total Lost', formatNumber(stats.lostLeads), '-3.1%']);
      rows.push(['Lost Rate', `${stats.lostRate}%`, '-1.2%']);
      rows.push(['Top Reason', 'Budget Mismatch', '-2.8%']);
      rows.push([]);
      rows.push(['Lost Reason', 'Count']);
      const lostReasons = ['Budget Mismatch', 'Location Not Suitable', 'Property Sold', 'Not Interested', 'Other'];
      lostReasons.forEach((r, i) => {
        const count = Math.floor(stats.lostLeads * [0.35, 0.25, 0.20, 0.12, 0.08][i]);
        rows.push([r, count]);
      });
      break;

    case 'followup':
      rows.push(['Metric', 'Value', 'Trend']);
      rows.push(['Total Follow-Ups', formatNumber(stats.followUpLeads), '+10.5%']);
      rows.push(['Pending', formatNumber(Math.floor(stats.followUpLeads * 0.4)), '-5.2%']);
      rows.push(['Completed', formatNumber(Math.floor(stats.followUpLeads * 0.5)), '+8.3%']);
      rows.push([]);
      rows.push(['Period', 'Follow-Ups']);
      timeSeriesData.forEach(d => rows.push([d.label, Math.floor(d.value * 0.4)]));
      break;

    case 'sitevisit':
      rows.push(['Metric', 'Value', 'Trend']);
      rows.push(['Total Site Visits', formatNumber(stats.siteVisitScheduled), '+12.8%']);
      rows.push(['Scheduled', formatNumber(Math.floor(stats.siteVisitScheduled * 0.4)), '+8.2%']);
      rows.push(['Completed', formatNumber(stats.siteVisitCompleted), '+15.2%']);
      rows.push([]);
      rows.push(['Period', 'Site Visits']);
      timeSeriesData.forEach(d => rows.push([d.label, Math.floor(d.value * 0.25)]));
      break;

    default: break;
  }
  return rows;
};

// ============================================================
// DOWNLOAD HELPERS
// ============================================================
const escapeCSV = (val) => {
  const s = String(val ?? '');
  if (s.includes(',') || s.includes('"') || s.includes('\n')) return `"${s.replace(/"/g, '""')}"`;
  return s;
};

const downloadCSV = (rows, filename) => {
  const csv = rows.map(row => row.map(escapeCSV).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const downloadExcel = (rows, filename, sheetName = 'Report') => {
  let html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">`;
  html += `<head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>`;
  html += `<x:Name>${sheetName}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>`;
  html += `</x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->`;
  html += `<style>table{border-collapse:collapse;} td,th{border:1px solid #ccc;padding:6px 10px;font-family:Arial,sans-serif;font-size:12px;} th{background:#00695C;color:#fff;font-weight:bold;}</style>`;
  html += `</head><body><table>`;
  rows.forEach((row, rIdx) => {
    if (row.length === 0) { html += `<tr><td colspan="6" style="border:none;height:8px;"></td></tr>`; return; }
    html += '<tr>';
    row.forEach(cell => {
      const tag = rIdx === 0 ? 'th' : 'td';
      html += `<${tag}>${String(cell ?? '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</${tag}>`;
    });
    html += '</tr>';
  });
  html += `</table></body></html>`;
  const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const downloadMultiSheetExcel = (reports, filename) => {
  let html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">`;
  html += `<head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets>`;
  reports.forEach((report) => {
    html += `<x:ExcelWorksheet><x:Name>${report.title}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>`;
  });
  html += `</x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->`;
  html += `<style>table{border-collapse:collapse;margin-bottom:20px;} td,th{border:1px solid #ccc;padding:6px 10px;font-family:Arial,sans-serif;font-size:12px;} th{background:#00695C;color:#fff;font-weight:bold;}</style>`;
  html += `</head><body>`;
  reports.forEach((report) => {
    html += `<table>`;
    report.rows.forEach((row, rIdx) => {
      if (row.length === 0) { html += `<tr><td colspan="6" style="border:none;height:8px;"></td></tr>`; return; }
      html += '<tr>';
      row.forEach(cell => {
        const tag = rIdx === 0 ? 'th' : 'td';
        html += `<${tag}>${String(cell ?? '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</${tag}>`;
      });
      html += '</tr>';
    });
    html += `</table>`;
  });
  html += `</body></html>`;
  const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// ============================================================
// PDF DOWNLOAD
// ============================================================
const downloadPDF = (rows, title, subtitle) => {
  let tableHTML = '';
  rows.forEach((row, rIdx) => {
    if (row.length === 0) { tableHTML += `<tr><td colspan="6" style="border:none;height:10px;"></td></tr>`; return; }
    tableHTML += '<tr>';
    row.forEach(cell => {
      const tag = rIdx === 0 ? 'th' : 'td';
      tableHTML += `<${tag}>${String(cell ?? '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</${tag}>`;
    });
    tableHTML += '</tr>';
  });

  const container = document.createElement('div');
  container.style.padding = '20px';
  container.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif';
  container.style.color = '#1A2E2A';
  container.style.background = '#fff';
  container.innerHTML = `
    <div style="border-bottom: 3px solid #00695C; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end;">
      <div>
        <h1 style="color: #00695C; margin: 0; font-size: 22px;">${title}</h1>
        <p style="color: #5A7D78; margin: 4px 0 0; font-size: 12px;">${subtitle || ''}</p>
      </div>
      <div style="text-align: right; font-size: 11px; color: #5A7D78;">
        <div>Generated: ${new Date().toLocaleString('en-IN')}</div>
        <div>Lead Reports & Analytics</div>
      </div>
    </div>
    <table style="width: 100%; border-collapse: collapse;">${tableHTML}</table>
    <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #E8F0EE; font-size: 10px; color: #5A7D78; text-align: center;">
      © ${new Date().getFullYear()} Lead Reports · Confidential
    </div>
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = `
    table th { background: #00695C; color: #fff; padding: 10px 12px; text-align: left; font-size: 12px; font-weight: 600; }
    table td { padding: 8px 12px; border-bottom: 1px solid #E8F0EE; font-size: 12px; }
    table tr:nth-child(even) td { background: #F8FAF9; }
  `;
  container.appendChild(styleEl);

  const filename = `${title.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.pdf`;
  html2pdf().set({
    margin: [10, 10, 10, 10], filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  }).from(container).save();
};

const downloadAllPDF = (reports, dateLabel) => {
  const container = document.createElement('div');
  container.style.padding = '20px';
  container.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif';
  container.style.color = '#1A2E2A';
  container.style.background = '#fff';

  let bodyHTML = `
    <div style="border-bottom: 3px solid #00695C; padding-bottom: 15px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end;">
      <div>
        <h1 style="color: #00695C; margin: 0; font-size: 24px;">All Lead Reports</h1>
        <p style="color: #5A7D78; margin: 4px 0 0; font-size: 12px;">Period: ${dateLabel} · ${reports.length} reports</p>
      </div>
      <div style="text-align: right; font-size: 11px; color: #5A7D78;">
        <div>Generated: ${new Date().toLocaleString('en-IN')}</div>
        <div>Lead Reports & Analytics</div>
      </div>
    </div>
  `;

  reports.forEach((report) => {
    let tableHTML = '';
    report.rows.forEach((row, rIdx) => {
      if (row.length === 0) { tableHTML += `<tr><td colspan="6" style="border:none;height:10px;"></td></tr>`; return; }
      tableHTML += '<tr>';
      row.forEach(cell => {
        const tag = rIdx === 0 ? 'th' : 'td';
        tableHTML += `<${tag}>${String(cell ?? '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</${tag}>`;
      });
      tableHTML += '</tr>';
    });

    bodyHTML += `
      <div style="margin-bottom: 30px; page-break-after: always;">
        <div style="background: linear-gradient(90deg, #00695C, #26A69A); color: #fff; padding: 10px 14px; border-radius: 8px 8px 0 0; font-size: 15px; font-weight: bold;">
          ${report.title}
        </div>
        <table style="width: 100%; border-collapse: collapse;">${tableHTML}</table>
      </div>
    `;
  });

  bodyHTML += `
    <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #E8F0EE; font-size: 10px; color: #5A7D78; text-align: center;">
      © ${new Date().getFullYear()} Lead Reports · Confidential
    </div>
  `;

  container.innerHTML = bodyHTML;

  const styleEl = document.createElement('style');
  styleEl.textContent = `
    table th { background: #E8F4F2; color: #00695C; padding: 8px 12px; text-align: left; font-size: 11px; font-weight: 700; border: 1px solid #C5EDE5; }
    table td { padding: 7px 12px; border: 1px solid #E8F0EE; font-size: 11px; }
    table tr:nth-child(even) td { background: #F8FAF9; }
  `;
  container.appendChild(styleEl);

  const filename = `all_lead_reports_${new Date().toISOString().split('T')[0]}.pdf`;
  html2pdf().set({
    margin: [10, 10, 10, 10], filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['css', 'legacy'] }
  }).from(container).save();
};

// ============================================================
// TOAST COMPONENT
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
      <button onClick={() => setToast(null)} className="ml-2 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
        <FiX className="text-xs" />
      </button>
    </div>
  );
};

// ============================================================
// STAT CARD
// ============================================================
const StatCard = ({ icon, title, value, trend, subtitle, color, delay = 0 }) => (
  <div 
    className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-2xl transition-all duration-500 border border-[#E8F0EE] group cursor-pointer relative overflow-hidden animate-card-in"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
    <div className="relative flex items-start justify-between mb-3">
      <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 flex-shrink-0`}>
        {icon}
      </div>
      {trend !== undefined && (
        <span className={`text-[10px] font-bold px-2.5 py-1.5 rounded-full flex items-center gap-1 ${trend >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
          {trend >= 0 ? <FiArrowUp className="text-[9px]" /> : <FiArrowDown className="text-[9px]" />}
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    <p className="text-[11px] font-bold text-[#3D5A55] uppercase tracking-wider truncate mb-1">{title}</p>
    <p className="text-2xl font-black text-[#0F1A18] group-hover:text-[#00695C] transition-colors truncate">{value}</p>
    {subtitle && <p className="text-[10px] text-[#5A7D78] mt-1.5 truncate font-medium">{subtitle}</p>}
  </div>
);

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
        setIsOpen(false); setShowCustom(false); 
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
        <FiChevronDown className={`text-sm transition-transform ${isOpen ? 'rotate-180' : ''}`} />
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
                  className={`w-full px-4 py-2.5 text-left text-sm transition-all duration-200 flex items-center gap-2 hover:bg-[#F5F9F8] ${selected === preset.id ? 'bg-[#E8F4F2] text-[#00695C] font-bold' : 'text-[#0F1A18] font-medium'}`}
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
              <FiChevronDown className={`transition-transform ${showCustom ? 'rotate-180' : ''}`} />
            </button>
            {showCustom && (
              <div className="mt-2 space-y-2 p-2 bg-[#F5F9F8] rounded-xl">
                <div>
                  <label className="block text-[10px] font-bold text-[#3D5A55] mb-1">From</label>
                  <input 
                    type="date" 
                    value={customStart ? customStart.toISOString().split('T')[0] : ''} 
                    onChange={(e) => onCustomChange(new Date(e.target.value), customEnd)} 
                    className="w-full px-2 py-1.5 bg-white rounded-lg border border-[#E8F0EE] text-xs font-medium outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#3D5A55] mb-1">To</label>
                  <input 
                    type="date" 
                    value={customEnd ? customEnd.toISOString().split('T')[0] : ''} 
                    onChange={(e) => onCustomChange(customStart, new Date(e.target.value))} 
                    className="w-full px-2 py-1.5 bg-white rounded-lg border border-[#E8F0EE] text-xs font-medium outline-none" 
                  />
                </div>
                <button 
                  onClick={() => { onSelect('custom'); setIsOpen(false); setShowCustom(false); }} 
                  disabled={!customStart || !customEnd} 
                  className="w-full px-3 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg text-xs font-bold disabled:opacity-50"
                >
                  Apply
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
// EXPORT DROPDOWN
// ============================================================
const ExportDropdown = ({ onExportAll, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const allOptions = [
    { id: 'excel', label: 'All Reports → Excel', desc: '1 file · 14 sheets', icon: FiFileText, bg: 'bg-emerald-100', text: 'text-emerald-800' },
    { id: 'csv', label: 'All Reports → CSV', desc: '14 separate files', icon: FiFileText, bg: 'bg-blue-100', text: 'text-blue-800' },
    { id: 'pdf', label: 'All Reports → PDF', desc: '1 PDF · 14 pages', icon: FiFileText, bg: 'bg-red-100', text: 'text-red-800' }
  ];
  
  return (
    <div className="relative z-[80]" ref={dropdownRef}>
      <button 
        onClick={() => !disabled && setIsOpen(!isOpen)} 
        disabled={disabled}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 text-sm font-bold hover:scale-105 disabled:opacity-50 ${
          isOpen 
            ? 'bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white shadow-lg' 
            : 'bg-white border border-[#E8F0EE] text-[#0F1A18] hover:border-[#00695C]/30 hover:shadow-md'
        }`}
      >
        <FiDownload className="text-sm" />
        <span className="hidden sm:inline">Export All</span>
        <FiChevronDown className={`text-sm transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-[#E8F0EE] py-2 z-[90] animate-dropdown-in">
          <div className="px-4 py-3 border-b border-[#E8F0EE] bg-gradient-to-r from-[#F5F9F8] to-white">
            <p className="text-[10px] font-bold text-[#00695C] uppercase tracking-wider flex items-center gap-2">
              <FiLayers className="text-sm" /> Download All Reports
            </p>
            <p className="text-[10px] text-[#3D5A55] font-medium mt-1">14 comprehensive reports included</p>
          </div>
          {allOptions.map((opt) => {
            const Icon = opt.icon;
            return (
              <button 
                key={opt.id} 
                onClick={() => { onExportAll(opt.id); setIsOpen(false); }} 
                className="w-full px-4 py-3 text-left text-sm transition-all flex items-center gap-3 hover:bg-[#E8F4F2] group"
              >
                <div className={`w-10 h-10 rounded-xl ${opt.bg} flex items-center justify-center group-hover:scale-110 transition-all flex-shrink-0`}>
                  <Icon className={`text-base ${opt.text}`} />
                </div>
                <div className="min-w-0">
                  <p className="font-bold truncate">{opt.label}</p>
                  <p className="text-[10px] text-[#5A7D78] font-medium truncate">{opt.desc}</p>
                </div>
                <FiChevronRight className="ml-auto text-[#5A7D78] opacity-0 group-hover:opacity-100 transition-all" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ============================================================
// REPORT EXPORT BAR
// ============================================================
const ReportExportBar = ({ reportTitle, onExport }) => {
  const buttons = [
    { id: 'excel', label: 'Excel', icon: FiFileText, text: 'text-emerald-800', gradient: 'from-emerald-500 to-teal-400' },
    { id: 'csv', label: 'CSV', icon: FiFileText, text: 'text-blue-800', gradient: 'from-blue-500 to-cyan-400' },
    { id: 'pdf', label: 'PDF', icon: FiFileText, text: 'text-red-800', gradient: 'from-red-500 to-rose-400' }
  ];
  
  return (
    <div className="bg-[#b0d2cc] rounded-2xl p-5 border border-[#044a42] shadow-sm hover:shadow-lg transition-all animate-slide-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center shadow-lg flex-shrink-0">
            <FiFileText className="text-white text-lg" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-[#0F1A18] truncate">{reportTitle}</h2>
            <p className="text-[11px] text-[#3D5A55] font-medium truncate">Download in your preferred format</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {buttons.map((b) => {
            const Icon = b.icon;
            return (
              <button 
                key={b.id} 
                onClick={() => onExport(b.id)} 
                className="group flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E8F0EE] rounded-xl transition-all text-xs font-bold hover:scale-105 hover:shadow-lg relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${b.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <Icon className={`text-sm relative z-10 ${b.text} group-hover:text-white transition-colors`} />
                <span className={`relative z-10 ${b.text} group-hover:text-white transition-colors`}>{b.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// REPORT TYPE CARD
// ============================================================
const ReportTypeCard = ({ report, isActive, onClick, index }) => {
  const Icon = report.icon;
  return (
    <div 
      onClick={onClick} 
      className={`rounded-2xl p-2 cursor-pointer transition-all duration-500 border-3 hover:shadow-xl group relative overflow-hidden animate-card-in ${
        isActive 
          ? 'bg-gradient-to-br from-[#00695C] to-[#26A69A] border-transparent shadow-xl scale-105' 
          : `${report.bg} border-[#d2ece6] hover:-translate-y-2 hover:border-[#00695C]/40`
      }`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="relative flex items-start justify-between mb-2">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 ${
          isActive ? 'bg-white/20' : 'bg-white/60 shadow-sm'
        }`}>
          <Icon className={`text-base ${isActive ? 'text-white' : report.text}`} />
        </div>
        {isActive && (
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
            <FiCheckCircle className="text-white text-xs" />
          </div>
        )}
      </div>
      <h4 className={`text-xs font-bold mb-0.5 ${isActive ? 'text-white' : 'text-[#0F1A18]'}`}>{report.title}</h4>
      <p className={`text-[10px] font-medium ${isActive ? 'text-white/90' : 'text-[#5A7D78]'}`}>{report.desc}</p>
    </div>
  );
};

// ============================================================
// DONUT CHART
// ============================================================
const DonutChart = ({ data, size = 220, thickness = 48, centerLabel = 'TOTAL', centerValue }) => {
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
    const timer = setTimeout(() => setAnimationProgress(1), 100);
    return () => clearTimeout(timer);
  }, []);

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
            <p className="text-[10px] font-bold text-[#5A7D78] uppercase tracking-wider mb-1">{centerLabel}</p>
            <p className="text-[26px] font-black text-[#0F1A18] leading-none">{centerValue}</p>
            {hoveredIndex !== null ? (
              <div className="mt-2 flex flex-col items-center">
                <span className="text-[13px] font-black px-2 py-0.5 rounded-md text-white" style={{ backgroundColor: uniqueData[hoveredIndex].color }}>
                  {((uniqueData[hoveredIndex].value / total) * 100).toFixed(1)}%
                </span>
                <span className="text-[10px] font-bold text-[#3D5A55] mt-1 truncate max-w-[120px]">{uniqueData[hoveredIndex].label}</span>
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
              className={`flex items-center justify-between text-xs p-2.5 rounded-xl transition-all cursor-pointer border ${
                isHovered ? 'bg-white shadow-md scale-[1.02] border-transparent' : 'border-transparent hover:bg-[#F5F9F8]'
              }`}
              style={{ borderLeftWidth: '4px', borderLeftColor: d.color }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                <span className={`font-bold truncate ${isHovered ? 'text-[#0F1A18]' : 'text-[#1A2E2A]'}`}>{d.label}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: d.color }}>{pct}%</span>
                <span className="text-xs font-black text-[#0F1A18] min-w-[50px] text-right">{formatNumber(d.value)}</span>
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
const BarChart = ({ data, height = 260 }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const max = Math.max(...data.map(d => d.value), 1);
  const barAreaHeight = height - 55;

  useEffect(() => {
    const timer = setTimeout(() => setAnimationProgress(1), 100);
    return () => clearTimeout(timer);
  }, []);

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
              <div className={`absolute -top-12 transition-all z-20 pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                <div className="bg-[#0F1A18] text-white text-[11px] font-black px-3 py-1.5 rounded-lg whitespace-nowrap">
                  <div className="text-[9px] text-white/70 mb-0.5">{d.label}</div>
                  {formatNumber(d.value)}
                </div>
              </div>
              <div 
                className="text-[9px] font-black px-1.5 py-0.5 rounded-md mb-1"
                style={{ color: d.color, backgroundColor: `${d.color}15` }}
              >
                {formatNumber(d.value)}
              </div>
              <div
                className="w-full rounded-t-lg transition-all relative overflow-hidden"
                style={{
                  height: `${barHeight}px`,
                  background: `linear-gradient(180deg, ${d.color} 0%, ${d.color}80 100%)`,
                  boxShadow: isHovered ? `0 8px 24px ${d.color}70` : `0 2px 8px ${d.color}30`,
                  transform: isHovered ? 'scaleX(1.08)' : 'scaleX(1)',
                  opacity: hoveredIndex !== null && !isHovered ? 0.4 : 1,
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-3 gap-2 pt-2 border-t border-[#F1F5F4]">
        {data.map((d, i) => (
          <div key={i} className="flex-1 text-center min-w-0">
            <span className={`text-[10px] font-black truncate block ${hoveredIndex === i ? 'text-[#00695C]' : 'text-[#3D5A55]'}`}>
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
const AreaChart = ({ data, height = 260, color = '#00695C' }) => {
  const [animationProgress, setAnimationProgress] = useState(0);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const max = Math.max(...data.map(d => d.value), 1);
  const min = Math.min(...data.map(d => d.value), 0);
  const range = max - min || 1;
  const chartHeight = height - 40;
  const chartWidth = 1000;
  const stepX = chartWidth / Math.max(data.length - 1, 1);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimationProgress(1), 100);
    return () => clearTimeout(timer);
  }, []);

  const points = data.map((d, i) => ({ 
    x: i * stepX, 
    y: 20 + (1 - (d.value - min) / range) * chartHeight * animationProgress 
  }));
  
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${chartWidth} ${height} L 0 ${height} Z`;
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
        {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
          const y = 20 + (1 - r) * chartHeight;
          return <line key={i} x1="0" y1={y} x2={chartWidth} y2={y} stroke="#EEF4F2" strokeWidth="1" strokeDasharray="4 6" />;
        })}
        <path d={areaPath} fill={`url(#${gradId})`} />
        <path d={linePath} fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => {
          const isHovered = hoveredPoint === i;
          return (
            <g key={i} onMouseEnter={() => setHoveredPoint(i)} onMouseLeave={() => setHoveredPoint(null)} className="cursor-pointer">
              <circle cx={p.x} cy={p.y} r={isHovered ? 9 : 6} fill="white" stroke={color} strokeWidth="3" className="transition-all" />
              <circle cx={p.x} cy={p.y} r="3" fill={color} />
              {isHovered && (
                <g>
                  <rect x={p.x - 55} y={p.y - 55} width="110" height="42" rx="8" fill="#0F1A18" />
                  <text x={p.x} y={p.y - 38} textAnchor="middle" fill="#B5C9C5" fontSize="9" fontWeight="700">{data[i].label}</text>
                  <text x={p.x} y={p.y - 22} textAnchor="middle" fill="#fff" fontSize="14" fontWeight="900">{formatNumber(data[i].value)}</text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
      <div className="flex justify-between mt-3">
        {data.map((d, i) => (
          <span key={i} className={`text-[10px] font-black flex-1 text-center truncate ${hoveredPoint === i ? 'text-[#00695C]' : 'text-[#3D5A55]'}`}>
            {d.label}
          </span>
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
    const timer = setTimeout(() => setAnimationProgress(1), 100 + delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const animatedPct = Math.min(pct * animationProgress, 100);

  return (
    <div className="space-y-2 p-3 rounded-xl">
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
          <span className="text-[11px] font-black text-[#0F1A18]">{formatNumber(value)}</span>
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: color }}>
            {pct.toFixed(1)}%
          </span>
        </div>
      </div>
      <div className="h-3.5 bg-[#EEF4F2] rounded-full overflow-hidden relative">
        <div 
          className="h-full rounded-full transition-all duration-1000"
          style={{ 
            width: `${animatedPct}%`, 
            background: `linear-gradient(90deg, ${color}, ${color}DD)`,
            boxShadow: `0 0 8px ${color}40`
          }}
        />
      </div>
    </div>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================
const LeadReports = () => {
  const [activeReport, setActiveReport] = useState('daily');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [datePreset, setDatePreset] = useState('month');
  const [customStart, setCustomStart] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [customEnd, setCustomEnd] = useState(new Date());

  // Filters
  const [activeStatus, setActiveStatus] = useState('all');
  const [activePriority, setActivePriority] = useState('all');
  const [activeLeadType, setActiveLeadType] = useState('all');
  const [activeCustomerType, setActiveCustomerType] = useState('all');
  const [activeLeadSource, setActiveLeadSource] = useState('all');
  const [activeStaff, setActiveStaff] = useState('all');
  const [activePropertyType, setActivePropertyType] = useState('all');
  const [activePurpose, setActivePurpose] = useState('all');
  const [activeState, setActiveState] = useState('all');
  const [activeCity, setActiveCity] = useState('all');
  const [activeArea, setActiveArea] = useState('all');
  const [activeBudgetRange, setActiveBudgetRange] = useState('all');
  const [activeFollowUpDate, setActiveFollowUpDate] = useState('');

  const [stats, setStats] = useState({});
  const computeStats = useCallback(() => { setStats(generateStatsFor()); }, []);
  useEffect(() => { computeStats(); }, [activeReport, datePreset, computeStats]);

  const timeSeriesData = useMemo(() => generateTimeSeriesData(datePreset), [datePreset]);
  const statusData = useMemo(() => generateDistribution(ALL_LEAD_STATUSES.map(s => ({ label: s, color: LEAD_STATUS_TYPES[s]?.hexColor }))), []);
  const priorityData = useMemo(() => generateDistribution(ALL_LEAD_PRIORITIES.map(p => ({ label: p, color: LEAD_PRIORITY_TYPES[p]?.hexColor }))), []);
  const sourceData = useMemo(() => generateDistribution(ALL_LEAD_SOURCES.map(s => ({ label: s, color: LEAD_SOURCE_CONFIG[s]?.color }))), []);
  const propertyData = useMemo(() => generateDistribution(PROPERTY_TYPES.map(p => ({ label: p.label, color: p.color }))), []);
  const locationData = useMemo(() => generateDistribution(CITIES.slice(0, 8)), []);
  const staffData = useMemo(() => generateDistribution(AVAILABLE_STAFF.map(s => ({ label: s.name, color: null }))), []);

  const filterCount = useMemo(() => {
    let count = 0;
    if (activeStatus !== 'all') count++;
    if (activePriority !== 'all') count++;
    if (activeLeadType !== 'all') count++;
    if (activeCustomerType !== 'all') count++;
    if (activeLeadSource !== 'all') count++;
    if (activeStaff !== 'all') count++;
    if (activePropertyType !== 'all') count++;
    if (activePurpose !== 'all') count++;
    if (activeState !== 'all') count++;
    if (activeCity !== 'all') count++;
    if (activeArea !== 'all') count++;
    if (activeBudgetRange !== 'all') count++;
    if (activeFollowUpDate) count++;
    return count;
  }, [activeStatus, activePriority, activeLeadType, activeCustomerType, activeLeadSource, activeStaff, activePropertyType, activePurpose, activeState, activeCity, activeArea, activeBudgetRange, activeFollowUpDate]);

  const clearAllFilters = useCallback(() => {
    setActiveStatus('all');
    setActivePriority('all');
    setActiveLeadType('all');
    setActiveCustomerType('all');
    setActiveLeadSource('all');
    setActiveStaff('all');
    setActivePropertyType('all');
    setActivePurpose('all');
    setActiveState('all');
    setActiveCity('all');
    setActiveArea('all');
    setActiveBudgetRange('all');
    setActiveFollowUpDate('');
    setToast({ message: 'All filters cleared', type: 'info' });
  }, []);

  const handleExport = useCallback((format) => {
    try {
      setLoading(true);
      const reportTitle = REPORT_TITLES[activeReport] || 'Report';
      const dateLabel = getDateRangeLabel(datePreset, customStart, customEnd);
      const timestamp = new Date().toISOString().split('T')[0];
      const baseFilename = `lead_${activeReport}_report_${timestamp}`;
      const rows = buildExportData(activeReport, stats, timeSeriesData, statusData, priorityData, sourceData, propertyData, locationData, staffData);

      if (!rows || rows.length === 0) {
        setToast({ message: 'No data to export for this report', type: 'warning' });
        setLoading(false);
        return;
      }
      if (format === 'csv') {
        downloadCSV(rows, `${baseFilename}.csv`);
        setToast({ message: `CSV downloaded — ${reportTitle}`, type: 'success' });
      } else if (format === 'excel') {
        downloadExcel(rows, `${baseFilename}.xls`, reportTitle);
        setToast({ message: `Excel downloaded — ${reportTitle}`, type: 'success' });
      } else if (format === 'pdf') {
        setToast({ message: `Generating PDF — ${reportTitle}...`, type: 'info' });
        downloadPDF(rows, reportTitle, `Period: ${dateLabel}`);
        setTimeout(() => setToast({ message: `PDF downloaded ✅`, type: 'success' }), 1500);
      }
    } catch (error) {
      console.error('Export error:', error);
      setToast({ message: `Export failed: ${error.message}`, type: 'error' });
    } finally {
      setTimeout(() => setLoading(false), 600);
    }
  }, [activeReport, stats, timeSeriesData, statusData, priorityData, sourceData, propertyData, locationData, staffData, datePreset, customStart, customEnd]);

  const handleExportAll = useCallback((format) => {
    try {
      setLoading(true);
      const timestamp = new Date().toISOString().split('T')[0];
      const dateLabel = getDateRangeLabel(datePreset, customStart, customEnd);

      const allReports = ALL_REPORT_IDS.map((reportId) => {
        const reportStats = generateStatsFor();
        const tsData = generateTimeSeriesData(datePreset);
        const stData = generateDistribution(ALL_LEAD_STATUSES);
        const prData = generateDistribution(ALL_LEAD_PRIORITIES);
        const srcData = generateDistribution(ALL_LEAD_SOURCES);
        const propData = generateDistribution(PROPERTY_TYPES.map(p => p.label));
        const locData = generateDistribution(CITIES.slice(0, 8));
        const stfData = generateDistribution(AVAILABLE_STAFF.map(s => s.name));
        return {
          id: reportId,
          title: REPORT_TITLES[reportId] || reportId,
          rows: buildExportData(reportId, reportStats, tsData, stData, prData, srcData, propData, locData, stfData)
        };
      });

      if (format === 'csv') {
        allReports.forEach((report, i) => {
          setTimeout(() => {
            downloadCSV(report.rows, `lead_${report.id}_report_${timestamp}.csv`);
          }, i * 250);
        });
        setToast({ message: `Downloading all ${allReports.length} reports...`, type: 'success' });
      } else if (format === 'excel') {
        downloadMultiSheetExcel(allReports, `lead_all_reports_${timestamp}.xls`);
        setToast({ message: `Excel downloaded — ${allReports.length} sheets`, type: 'success' });
      } else if (format === 'pdf') {
        setToast({ message: `Generating full PDF...`, type: 'info' });
        downloadAllPDF(allReports, dateLabel);
        setTimeout(() => setToast({ message: `Full PDF downloaded ✅`, type: 'success' }), 2000);
      }
    } catch (error) {
      console.error('Export all error:', error);
      setToast({ message: `Export all failed: ${error.message}`, type: 'error' });
    } finally {
      setTimeout(() => setLoading(false), 3000);
    }
  }, [datePreset, customStart, customEnd]);

  const handleRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => { 
      computeStats(); 
      setLoading(false); 
      setToast({ message: 'Report data refreshed', type: 'success' }); 
    }, 1000);
  }, [computeStats]);

  const renderStatsCards = () => {
    const cards = [];
    switch (activeReport) {
      case 'daily':
      case 'weekly':
      case 'monthly':
        cards.push(
          { icon: <FiUsers className="text-white text-base" />, title: 'Total Leads', value: formatNumber(stats.totalLeads), trend: 12.5, subtitle: 'vs previous', color: 'bg-gradient-to-br from-emerald-600 to-teal-400' },
          { icon: <FiStar className="text-white text-base" />, title: 'New Leads', value: formatNumber(stats.newLeads), trend: 8.3, subtitle: 'Fresh leads', color: 'bg-gradient-to-br from-blue-600 to-cyan-400' },
          { icon: <FiCheckCircle className="text-white text-base" />, title: 'Converted', value: formatNumber(stats.convertedLeads), trend: 15.2, subtitle: 'Converted', color: 'bg-gradient-to-br from-green-600 to-emerald-400' },
          { icon: <FiPercent className="text-white text-base" />, title: 'Conversion Rate', value: `${stats.conversionRate}%`, trend: 2.5, subtitle: 'Overall', color: 'bg-gradient-to-br from-purple-600 to-violet-400' }
        );
        break;
      case 'source':
        cards.push(
          { icon: <FiGlobe className="text-white text-base" />, title: 'Total Sources', value: ALL_LEAD_SOURCES.length, trend: 0, subtitle: 'Sources', color: 'bg-gradient-to-br from-blue-600 to-cyan-400' },
          { icon: <FiAward className="text-white text-base" />, title: 'Top Source', value: 'Website', trend: 15.2, subtitle: 'Most leads', color: 'bg-gradient-to-br from-emerald-600 to-teal-400' },
          { icon: <FiPercent className="text-white text-base" />, title: 'Conversion Rate', value: `${stats.conversionRate}%`, trend: 2.5, subtitle: 'Overall', color: 'bg-gradient-to-br from-purple-600 to-violet-400' },
          { icon: <FiClock className="text-white text-base" />, title: 'Avg Response', value: `${stats.avgResponseTime} hrs`, trend: -5.2, subtitle: 'Response', color: 'bg-gradient-to-br from-amber-600 to-orange-400' }
        );
        break;
      case 'property':
        cards.push(
          { icon: <FaBuilding className="text-white text-base" />, title: 'Property Types', value: PROPERTY_TYPES.length, trend: 0, subtitle: 'Categories', color: 'bg-gradient-to-br from-cyan-600 to-sky-400' },
          { icon: <FaHome className="text-white text-base" />, title: 'Top Type', value: 'Apartment', trend: 15.2, subtitle: 'Most leads', color: 'bg-gradient-to-br from-blue-600 to-indigo-400' },
          { icon: <FiUsers className="text-white text-base" />, title: 'Total Leads', value: formatNumber(stats.totalLeads), trend: 12.5, subtitle: 'All types', color: 'bg-gradient-to-br from-emerald-600 to-teal-400' },
          { icon: <FiDollarSign className="text-white text-base" />, title: 'Avg Budget', value: formatCompact(stats.avgBudget), trend: 3.2, subtitle: 'Per lead', color: 'bg-gradient-to-br from-purple-600 to-violet-400' }
        );
        break;
      case 'location':
        cards.push(
          { icon: <FiMapPin className="text-white text-base" />, title: 'Total Locations', value: CITIES.length, trend: 0, subtitle: 'Cities', color: 'bg-gradient-to-br from-pink-600 to-rose-400' },
          { icon: <FiMapPin className="text-white text-base" />, title: 'Top State', value: 'Maharashtra', trend: 15.2, subtitle: 'Most leads', color: 'bg-gradient-to-br from-emerald-600 to-teal-400' },
          { icon: <FiMapPin className="text-white text-base" />, title: 'Top City', value: 'Mumbai', trend: 12.8, subtitle: 'Most leads', color: 'bg-gradient-to-br from-blue-600 to-cyan-400' },
          { icon: <FiUsers className="text-white text-base" />, title: 'Total Leads', value: formatNumber(stats.totalLeads), trend: 12.5, subtitle: 'All locations', color: 'bg-gradient-to-br from-purple-600 to-violet-400' }
        );
        break;
      case 'staff':
        cards.push(
          { icon: <FiUserCheck className="text-white text-base" />, title: 'Total Staff', value: AVAILABLE_STAFF.length, trend: 0, subtitle: 'Active', color: 'bg-gradient-to-br from-lime-600 to-green-400' },
          { icon: <FiAward className="text-white text-base" />, title: 'Top Performer', value: 'Rajesh K.', trend: 18.5, subtitle: 'Most conversions', color: 'bg-gradient-to-br from-amber-600 to-yellow-400' },
          { icon: <FiUsers className="text-white text-base" />, title: 'Assigned Leads', value: formatNumber(stats.assignedLeads), trend: 10.2, subtitle: 'Total assigned', color: 'bg-gradient-to-br from-blue-600 to-cyan-400' },
          { icon: <FiPercent className="text-white text-base" />, title: 'Avg Conversion', value: `${stats.conversionRate}%`, trend: 2.5, subtitle: 'Per staff', color: 'bg-gradient-to-br from-emerald-600 to-teal-400' }
        );
        break;
      case 'lost':
        cards.push(
          { icon: <FiXCircle className="text-white text-base" />, title: 'Total Lost', value: formatNumber(stats.lostLeads), trend: -3.1, subtitle: 'Lost leads', color: 'bg-gradient-to-br from-red-600 to-rose-400' },
          { icon: <FiPercent className="text-white text-base" />, title: 'Lost Rate', value: `${stats.lostRate}%`, trend: -1.2, subtitle: 'Of total', color: 'bg-gradient-to-br from-orange-600 to-amber-400' },
          { icon: <FiAlertTriangle className="text-white text-base" />, title: 'Top Reason', value: 'Budget', trend: -2.8, subtitle: 'Most common', color: 'bg-gradient-to-br from-amber-600 to-yellow-400' },
          { icon: <FiRefreshCw className="text-white text-base" />, title: 'Recoverable', value: formatNumber(Math.floor(stats.lostLeads * 0.15)), trend: 5.2, subtitle: 'Potential', color: 'bg-gradient-to-br from-blue-600 to-cyan-400' }
        );
        break;
      case 'followup':
        cards.push(
          { icon: <FiRefreshCw className="text-white text-base" />, title: 'Total Follow-Ups', value: formatNumber(stats.followUpLeads), trend: 10.5, subtitle: 'All', color: 'bg-gradient-to-br from-yellow-600 to-amber-400' },
          { icon: <FiClock className="text-white text-base" />, title: 'Pending', value: formatNumber(Math.floor(stats.followUpLeads * 0.4)), trend: -5.2, subtitle: 'Awaiting', color: 'bg-gradient-to-br from-amber-600 to-orange-400' },
          { icon: <FiCheckCircle className="text-white text-base" />, title: 'Completed', value: formatNumber(Math.floor(stats.followUpLeads * 0.5)), trend: 8.3, subtitle: 'Done', color: 'bg-gradient-to-br from-emerald-600 to-teal-400' },
          { icon: <FiAlertTriangle className="text-white text-base" />, title: 'Overdue', value: formatNumber(Math.floor(stats.followUpLeads * 0.1)), trend: -2.1, subtitle: 'Attention', color: 'bg-gradient-to-br from-red-600 to-rose-400' }
        );
        break;
      case 'sitevisit':
        cards.push(
          { icon: <FiNavigation className="text-white text-base" />, title: 'Total Visits', value: formatNumber(stats.siteVisitScheduled), trend: 12.8, subtitle: 'All visits', color: 'bg-gradient-to-br from-sky-600 to-cyan-400' },
          { icon: <FiCalendar className="text-white text-base" />, title: 'Scheduled', value: formatNumber(Math.floor(stats.siteVisitScheduled * 0.4)), trend: 8.2, subtitle: 'Upcoming', color: 'bg-gradient-to-br from-blue-600 to-indigo-400' },
          { icon: <FiCheckCircle className="text-white text-base" />, title: 'Completed', value: formatNumber(stats.siteVisitCompleted), trend: 15.2, subtitle: 'Done', color: 'bg-gradient-to-br from-emerald-600 to-teal-400' },
          { icon: <FiXCircle className="text-white text-base" />, title: 'Cancelled', value: formatNumber(Math.floor(stats.siteVisitScheduled * 0.1)), trend: -3.1, subtitle: 'Cancelled', color: 'bg-gradient-to-br from-red-600 to-rose-400' }
        );
        break;
      default:
        cards.push(
          { icon: <FiUsers className="text-white text-base" />, title: 'Total Leads', value: formatNumber(stats.totalLeads), trend: 12.5, subtitle: 'All leads', color: 'bg-gradient-to-br from-[#00695C] to-[#26A69A]' },
          { icon: <FiCheckCircle className="text-white text-base" />, title: 'Converted', value: formatNumber(stats.convertedLeads), trend: 15.2, subtitle: 'Success rate', color: 'bg-gradient-to-br from-emerald-600 to-teal-400' },
          { icon: <FiXCircle className="text-white text-base" />, title: 'Lost', value: formatNumber(stats.lostLeads), trend: -3.1, subtitle: 'Lost leads', color: 'bg-gradient-to-br from-red-600 to-rose-400' },
          { icon: <FiPercent className="text-white text-base" />, title: 'Conversion', value: `${stats.conversionRate}%`, trend: 2.5, subtitle: 'Overall rate', color: 'bg-gradient-to-br from-purple-600 to-violet-400' }
        );
        break;
    }
    return cards.map((card, i) => <StatCard key={i} {...card} delay={i * 100} />);
  };

  const renderChartSection = () => {
    switch (activeReport) {
            case 'daily':
      case 'weekly':
      case 'monthly':
        return (
          <div className="space-y-6 animate-slide-in">
            <ReportExportBar reportTitle={`${REPORT_TITLES[activeReport]} Export`} onExport={handleExport} />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Lead Trend — Area Chart */}
              <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all animate-slide-in">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-black text-[#0F1A18] flex items-center gap-2">
                      <FiTrendingUp className="text-[#00695C]" /> Lead Trend
                    </h3>
                    <p className="text-xs text-[#3D5A55] font-semibold">Leads over time</p>
                  </div>
                  <span className="px-3 py-1.5 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 text-xs font-black rounded-full flex items-center gap-1">
                    <FiArrowUp className="text-[10px]" />+12.5%
                  </span>
                </div>
                <AreaChart data={timeSeriesData} height={280} color="#00695C" />
              </div>

              {/* Lead Status Distribution — Donut */}
              <div className="bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all animate-slide-in">
                <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
                  <FiActivity className="text-[#00695C]" /> Lead Status Distribution
                </h3>
                <DonutChart
                  data={statusData}
                  size={220}
                  thickness={48}
                  centerLabel="Total"
                  centerValue={formatNumber(stats.totalLeads)}
                />
              </div>

             

              {/* Lead Source Distribution — Bar Chart */}
              <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all animate-slide-in">
                <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
                  <FiGlobe className="text-[#00695C]" /> Lead Source Distribution
                </h3>
                <BarChart data={sourceData} height={280} />
              </div>

               {/* Lead Priority Distribution — Donut */}
              <div className="bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all animate-slide-in">
                <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
                  <FiFlag className="text-[#00695C]" /> Lead Priority Distribution
                </h3>
                <DonutChart
                  data={priorityData}
                  size={220}
                  thickness={48}
                  centerLabel="Total"
                  centerValue={formatNumber(stats.totalLeads)}
                />
              </div>
            </div>
          </div>
        );

      case 'source':
  return (
    <div className="space-y-6 animate-slide-in">
      <ReportExportBar reportTitle="Source-wise Lead Report Export" onExport={handleExport} />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all animate-slide-in">
          <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
            <FiGlobe className="text-[#00695C]" /> Lead Source Distribution
          </h3>
          <AreaChart data={timeSeriesData} height={280} color="#3B82F6" />
        </div>
        
        <div className="bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all animate-slide-in">
          <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
            <FiPieChart className="text-[#00695C]" /> Source Distribution
          </h3>
          <DonutChart data={sourceData} size={220} thickness={48} centerLabel="Total" centerValue={formatNumber(stats.totalLeads)} />
        </div>
        
        {/* Source-wise Breakdown Section - Now in a grid so cards sit side-by-side */}
        <div className="xl:col-span-3 bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all animate-slide-in">
          <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
            <FiBarChart2 className="text-[#00695C]" /> Source-wise Breakdown
          </h3>
          {/* Changed to a responsive grid: 1 col on mobile, 2 on tablet, 3 on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sourceData.map((d, i) => {
              const config = LEAD_SOURCE_CONFIG[d.label] || {};
              const Icon = config.icon || FiGlobe;
              return (
                <div 
                  key={i} 
                  className="bg-gradient-to-br from-[#F5F9F8] to-white rounded-2xl p-5 hover:shadow-xl transition-all hover:-translate-y-2 cursor-pointer border border-[#E8F0EE] group animate-card-in"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all" style={{ backgroundColor: `${config.color}20` }}>
                      <Icon className="text-lg" style={{ color: config.color }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-black text-[#0F1A18] truncate">{d.label}</p>
                      <p className="text-[10px] text-[#3D5A55] font-bold">{formatNumber(d.value)} leads</p>
                    </div>
                  </div>
                  {/* "Conversion" word removed, replaced with "Leads" */}
                  <ProgressBar label="Leads" value={Math.floor(d.value * 0.25)} max={d.value} color={d.color} icon={FiPercent} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

      case 'property':
        return (
          <div className="space-y-6 animate-slide-in">
            <ReportExportBar reportTitle="Property-wise Lead Report Export" onExport={handleExport} />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all animate-slide-in">
                <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
                  <FaBuilding className="text-[#00695C]" /> Property-wise Leads
                </h3>
                <BarChart data={propertyData} height={280} />
              </div>
              
              <div className="bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all animate-slide-in">
                <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
                  <FiPieChart className="text-[#00695C]" /> Property Distribution
                </h3>
                <DonutChart data={propertyData} size={220} thickness={48} centerLabel="Total" centerValue={formatNumber(stats.totalLeads)} />
              </div>
              
              <div className="xl:col-span-3 bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all animate-slide-in">
                <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
                  <FiLayers className="text-[#00695C]" /> Property Type Breakdown
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {PROPERTY_TYPES.map((p, i) => {
                    const Icon = p.icon;
                    const value = propertyData[i]?.value || Math.floor(Math.random() * 500) + 100;
                    return (
                      <div 
                        key={i} 
                        className="bg-gradient-to-br from-[#F5F9F8] to-white rounded-2xl p-5 hover:shadow-xl transition-all hover:-translate-y-2 cursor-pointer border border-[#E8F0EE] group animate-card-in"
                        style={{ animationDelay: `${i * 80}ms` }}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${p.gradient} flex items-center justify-center text-white shadow-lg flex-shrink-0 group-hover:scale-110 transition-all`}>
                            <Icon className="text-lg" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-black text-[#0F1A18] truncate">{p.label}</p>
                            <p className="text-[10px] text-[#3D5A55] font-bold">{formatNumber(value)} leads</p>
                          </div>
                        </div>
                        <p className="text-xl font-black" style={{ color: p.color }}>{formatCompact(value * 10000)}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );

      case 'location':
  return (
    <div className="space-y-6 animate-slide-in">
      <ReportExportBar reportTitle="Location-wise Lead Report Export" onExport={handleExport} />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all animate-slide-in">
          <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
            <FiMapPin className="text-[#00695C]" /> Location-wise Leads
          </h3>
          <BarChart data={locationData} height={280} />
        </div>
        
        <div className="bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all animate-slide-in">
          <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
            <FiPieChart className="text-[#00695C]" /> City Distribution
          </h3>
          <DonutChart data={locationData} size={220} thickness={48} centerLabel="Total" centerValue={formatNumber(stats.totalLeads)} />
        </div>
        
        {/* Top 5 Locations Section */}
        <div className="xl:col-span-3 bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all animate-slide-in">
          <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
            <FiLayers className="text-[#00695C]" /> Top 5 Locations
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CITIES.slice(0, 5).map((city, i) => {
              const value = locationData[i]?.value || Math.floor(Math.random() * 400) + 100;
              const maxTop5 = Math.max(...CITIES.slice(0, 5).map((_, idx) => locationData[idx]?.value || 1));
              
              // Define 5 distinct colors and gradients for the 5 cards
              const cardColors = [
                { bg: 'from-emerald-500 to-teal-400', text: '#10B981' }, // Green
                { bg: 'from-blue-500 to-indigo-400', text: '#3B82F6' },   // Blue
                { bg: 'from-amber-500 to-orange-400', text: '#F59E0B' }, // Orange
                { bg: 'from-violet-500 to-purple-400', text: '#8B5CF6' }, // Purple
                { bg: 'from-pink-500 to-rose-400', text: '#EC4899' },     // Pink
              ];
              
              const currentColor = cardColors[i % cardColors.length];

              return (
                <div 
                  key={i} 
                  className="bg-gradient-to-br from-[#F5F9F8] to-white rounded-2xl p-4 hover:shadow-xl transition-all hover:-translate-y-2 cursor-pointer border border-[#E8F0EE] group animate-card-in"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {/* Icon uses the unique gradient color */}
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentColor.bg} flex items-center justify-center text-white shadow-lg flex-shrink-0 group-hover:scale-110 transition-all`}>
                      <FiMapPin className="text-sm" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-[#0F1A18] truncate">{city}</p>
                      <p className="text-[10px] text-[#3D5A55] font-bold">{formatNumber(value)} leads</p>
                    </div>
                  </div>
                  {/* Progress bar uses the unique text color */}
                  <ProgressBar label="Leads" value={value} max={maxTop5} color={currentColor.text} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

      case 'staff':
  return (
    <div className="space-y-6 animate-slide-in">
      <ReportExportBar reportTitle="Assigned Staff-wise Lead Report Export" onExport={handleExport} />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all animate-slide-in">
          <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
            <FiUserCheck className="text-[#00695C]" /> Assigned Staff-wise Leads
          </h3>
          <BarChart data={staffData} height={280} />
        </div>
        
        <div className="bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all animate-slide-in">
          <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
            <FiPieChart className="text-[#00695C]" /> Staff Distribution
          </h3>
          <DonutChart data={staffData} size={220} thickness={48} centerLabel="Total" centerValue={formatNumber(stats.totalLeads)} />
        </div>
        
        {/* Top 5 Performing Staff Section */}
        <div className="xl:col-span-3 bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all animate-slide-in">
          <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
            <FiAward className="text-[#00695C]" /> Top 5 Performing Staff
          </h3>
          
          {/* Added max-h and overflow-y-auto so if you add 50+ staff, it scrolls smoothly instead of breaking the page */}
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white z-10 shadow-sm">
                <tr className="border-b border-[#E8F0EE] bg-gradient-to-r from-[#F5F9F8] to-white">
                  <th className="text-left py-3 px-4 text-xs font-black text-[#3D5A55] uppercase">#</th>
                  <th className="text-left py-3 px-4 text-xs font-black text-[#3D5A55] uppercase">Name</th>
                  <th className="text-left py-3 px-4 text-xs font-black text-[#3D5A55] uppercase">Role</th>
                  <th className="text-right py-3 px-4 text-xs font-black text-[#3D5A55] uppercase">Leads</th>
                  <th className="text-right py-3 px-4 text-xs font-black text-[#3D5A55] uppercase">Converted</th>
                  <th className="text-right py-3 px-4 text-xs font-black text-[#3D5A55] uppercase">Rate</th>
                </tr>
              </thead>
              <tbody>
                {/* Changed to .slice(0, 5) to only show Top 5 */}
                {AVAILABLE_STAFF.slice(0, 5).map((s, i) => {
                  const leads = Math.floor(stats.totalLeads * [0.25, 0.22, 0.18, 0.15, 0.12][i]);
                  const converted = Math.floor(leads * (Math.random() * 0.3 + 0.1));
                  return (
                    <tr key={i} className="border-b border-[#E8F0EE] hover:bg-[#F5F9F8] transition-colors group animate-slide-in" style={{ animationDelay: `${i * 50}ms` }}>
                      <td className="py-3 px-4">
                        <span className={`w-7 h-7 rounded-full inline-flex items-center justify-center text-[11px] font-black ${
                          i === 0 ? 'bg-amber-200 text-amber-900' : 
                          i === 1 ? 'bg-gray-200 text-gray-800' : 
                          i === 2 ? 'bg-orange-200 text-orange-900' : 
                          'bg-[#D5F0EA] text-[#00695C]'
                        }`}>
                          {i + 1}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-black text-[#0F1A18] group-hover:text-[#00695C] transition-colors">{s.name}</td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] px-2.5 py-1 rounded-full font-black bg-[#00695C] text-white">{s.role}</span>
                      </td>
                      <td className="text-right py-3 px-4 font-black text-[#0F1A18]">{formatNumber(leads)}</td>
                      <td className="text-right py-3 px-4 font-black text-emerald-700">{formatNumber(converted)}</td>
                      <td className="text-right py-3 px-4">
                        <span className="text-xs font-black text-white bg-emerald-600 px-2.5 py-1 rounded-full">
                          {((converted / leads) * 100).toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

      case 'lost':
        return (
          <div className="space-y-6 animate-slide-in">
            <ReportExportBar reportTitle="Lost Lead Report Export" onExport={handleExport} />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all animate-slide-in">
                <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
                  <FiTrendingDown className="text-red-600" /> Lost Lead Trend
                </h3>
                <AreaChart data={timeSeriesData.map(d => ({ ...d, value: Math.floor(d.value * 0.15) }))} height={280} color="#EF4444" />
              </div>
              
              <div className="bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all animate-slide-in">
                <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
                  <FiPieChart className="text-red-600" /> Lost by Source
                </h3>
                <DonutChart data={sourceData.map(d => ({ ...d, value: Math.floor(d.value * 0.12) }))} size={220} thickness={48} centerLabel="Lost" centerValue={formatNumber(stats.lostLeads)} />
              </div>
              
              <div className="xl:col-span-3 bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all animate-slide-in">
                <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
                  <FiAlertTriangle className="text-red-600" /> Lost Reasons
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {[
                    { label: 'Budget Mismatch', value: 35, color: '#EF4444', gradient: 'from-red-500 to-rose-400', icon: FiDollarSign },
                    { label: 'Location Not Suitable', value: 25, color: '#F97316', gradient: 'from-orange-500 to-amber-400', icon: FiMapPin },
                    { label: 'Property Sold', value: 20, color: '#F59E0B', gradient: 'from-amber-500 to-yellow-400', icon: FiHome },
                    { label: 'Not Interested', value: 12, color: '#8B5CF6', gradient: 'from-violet-500 to-purple-400', icon: FiXCircle },
                    { label: 'Other', value: 8, color: '#64748B', gradient: 'from-slate-500 to-gray-400', icon: FiMoreHorizontal }
                  ].map((d, i) => (
                    <div 
                      key={i} 
                      className="bg-gradient-to-br from-[#F5F9F8] to-white rounded-2xl p-4 hover:shadow-xl transition-all hover:-translate-y-2 cursor-pointer group animate-card-in border border-[#E8F0EE]"
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${d.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-all shadow-lg`}>
                        <d.icon className="text-white text-base" />
                      </div>
                      <p className="text-3xl font-black text-[#0F1A18]">{d.value}%</p>
                      <p className="text-xs text-[#3D5A55] font-bold mt-1">{d.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'followup':
        return (
          <div className="space-y-6 animate-slide-in">
            <ReportExportBar reportTitle="Follow-Up Report Export" onExport={handleExport} />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all animate-slide-in">
                <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
                  <FiRefreshCw className="text-amber-600" /> Follow-Up Trend
                </h3>
                <AreaChart data={timeSeriesData.map(d => ({ ...d, value: Math.floor(d.value * 0.4) }))} height={280} color="#F59E0B" />
              </div>
              
              <div className="bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all animate-slide-in">
                <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
                  <FiPieChart className="text-amber-600" /> Follow-Up Status
                </h3>
                <DonutChart 
                  data={[
                    { label: 'Pending', value: Math.floor(stats.followUpLeads * 0.4), color: '#F59E0B' },
                    { label: 'Completed', value: Math.floor(stats.followUpLeads * 0.5), color: '#10B981' },
                    { label: 'Overdue', value: Math.floor(stats.followUpLeads * 0.1), color: '#EF4444' }
                  ]} 
                  size={220} thickness={48} centerLabel="Total" centerValue={formatNumber(stats.followUpLeads)} 
                />
              </div>
              
              <div className="xl:col-span-3 bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all animate-slide-in">
                <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
                  <FiActivity className="text-amber-600" /> Follow-Up by Type
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {['Call', 'WhatsApp', 'SMS', 'Email', 'Meeting', 'Site Visit'].map((type, i) => {
                    const value = Math.floor(stats.followUpLeads * [0.30, 0.25, 0.15, 0.12, 0.10, 0.08][i]);
                    return (
                      <div 
                        key={i} 
                        className="bg-gradient-to-br from-[#F5F9F8] to-white rounded-2xl p-5 hover:shadow-xl transition-all hover:-translate-y-2 cursor-pointer border border-[#E8F0EE] group animate-card-in"
                        style={{ animationDelay: `${i * 80}ms` }}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${
                            i === 0 ? 'from-blue-500 to-cyan-400' :
                            i === 1 ? 'from-emerald-500 to-green-400' :
                            i === 2 ? 'from-cyan-500 to-sky-400' :
                            i === 3 ? 'from-purple-500 to-violet-400' :
                            i === 4 ? 'from-amber-500 to-orange-400' :
                            'from-indigo-500 to-blue-400'
                          } flex items-center justify-center text-white shadow-lg flex-shrink-0 group-hover:scale-110 transition-all`}>
                            {i === 0 ? <FiPhone /> : i === 1 ? <FiMessageCircle /> : i === 2 ? <FiMessageSquare /> : i === 3 ? <FiMail /> : i === 4 ? <FiUsers /> : <FiNavigation />}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-black text-[#0F1A18] truncate">{type}</p>
                            <p className="text-[10px] text-[#3D5A55] font-bold">{formatNumber(value)} follow-ups</p>
                          </div>
                        </div>
                        <ProgressBar label="Share" value={value} max={stats.followUpLeads} color={UNIQUE_COLORS[i % UNIQUE_COLORS.length]} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );

      case 'sitevisit':
        return (
          <div className="space-y-6 animate-slide-in">
            <ReportExportBar reportTitle="Site Visit Report Export" onExport={handleExport} />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all animate-slide-in">
                <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
                  <FiNavigation className="text-sky-600" /> Site Visit Trend
                </h3>
                <AreaChart data={timeSeriesData.map(d => ({ ...d, value: Math.floor(d.value * 0.25) }))} height={280} color="#0EA5E9" />
              </div>
              
              <div className="bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all animate-slide-in">
                <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
                  <FiPieChart className="text-sky-600" /> Visit Status
                </h3>
                <DonutChart 
                  data={[
                    { label: 'Scheduled', value: Math.floor(stats.siteVisitScheduled * 0.4), color: '#0EA5E9' },
                    { label: 'Completed', value: stats.siteVisitCompleted, color: '#10B981' },
                    { label: 'Cancelled', value: Math.floor(stats.siteVisitScheduled * 0.1), color: '#EF4444' },
                    { label: 'Requested', value: Math.floor(stats.siteVisitScheduled * 0.2), color: '#F59E0B' }
                  ]} 
                  size={220} thickness={48} centerLabel="Total" centerValue={formatNumber(stats.siteVisitScheduled)} 
                />
              </div>
              
              <div className="xl:col-span-3 bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all animate-slide-in">
                <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
                  <FiHomeIcon className="text-sky-600" /> Site Visits by Property Type
                </h3>
                <BarChart data={propertyData.map(d => ({ ...d, value: Math.floor(d.value * 0.25) }))} height={280} />
              </div>
            </div>
          </div>
        );

      case 'owner':
      case 'agent':
      case 'builder':
      case 'pm': {
        const roleKey = { owner: 'Owner', agent: 'Agent', builder: 'Builder', pm: 'Property Manager' }[activeReport];
        const roleConfig = USER_TYPE_CONFIG[roleKey];
        const RoleIcon = roleConfig.icon;
        
        return (
          <div className="space-y-6 animate-slide-in">
            <ReportExportBar reportTitle={`${roleKey}-wise Lead Report Export`} onExport={handleExport} />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all animate-slide-in">
                <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
                  <RoleIcon style={{ color: roleConfig.color }} /> {roleKey} Lead Trend
                </h3>
                <AreaChart data={timeSeriesData} height={280} color={roleConfig.color} />
              </div>
              
              <div className="bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all animate-slide-in">
                <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
                  <FiPieChart style={{ color: roleConfig.color }} /> Lead Distribution
                </h3>
                <DonutChart data={statusData} size={220} thickness={48} centerLabel="Total" centerValue={formatNumber(stats.totalLeads)} />
              </div>
              
              <div className="xl:col-span-3 bg-white rounded-2xl p-6 border border-[#E8F0EE] shadow-sm hover:shadow-xl transition-all animate-slide-in">
                <h3 className="text-lg font-black text-[#0F1A18] mb-4 flex items-center gap-2">
                  <FiAward style={{ color: roleConfig.color }} /> Top {roleKey}s
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#E8F0EE] bg-gradient-to-r from-[#F5F9F8] to-white">
                        <th className="text-left py-3 px-4 text-xs font-black text-[#3D5A55] uppercase">#</th>
                        <th className="text-left py-3 px-4 text-xs font-black text-[#3D5A55] uppercase">Name</th>
                        <th className="text-right py-3 px-4 text-xs font-black text-[#3D5A55] uppercase">Leads</th>
                        <th className="text-right py-3 px-4 text-xs font-black text-[#3D5A55] uppercase">Converted</th>
                        <th className="text-right py-3 px-4 text-xs font-black text-[#3D5A55] uppercase">Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {['Priya Properties', 'Suresh Estates', 'Anitha Homes', 'Vijay Realty', 'Meena Properties'].map((n, i) => {
                        const leads = Math.floor(stats.totalLeads * [0.30, 0.24, 0.18, 0.16, 0.12][i]);
                        const converted = Math.floor(leads * (Math.random() * 0.3 + 0.1));
                        return (
                          <tr key={i} className="border-b border-[#E8F0EE] hover:bg-[#F5F9F8] transition-colors group animate-slide-in" style={{ animationDelay: `${i * 50}ms` }}>
                            <td className="py-3 px-4">
                              <span className={`w-7 h-7 rounded-full inline-flex items-center justify-center text-[11px] font-black ${
                                i === 0 ? 'bg-amber-200 text-amber-900' : 
                                i === 1 ? 'bg-gray-200 text-gray-800' : 
                                i === 2 ? 'bg-orange-200 text-orange-900' : 
                                'bg-[#D5F0EA] text-[#00695C]'
                              }`}>
                                {i + 1}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-black text-[#0F1A18] group-hover:text-[#00695C] transition-colors">{n}</td>
                            <td className="text-right py-3 px-4 font-black text-[#0F1A18]">{formatNumber(leads)}</td>
                            <td className="text-right py-3 px-4 font-black text-emerald-700">{formatNumber(converted)}</td>
                            <td className="text-right py-3 px-4">
                              <span className="text-xs font-black text-white bg-emerald-600 px-2.5 py-1 rounded-full">
                                {((converted / leads) * 100).toFixed(1)}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 p-4 lg:p-6 min-h-screen bg-[#F8FAF9]">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-[500px] h-[500px] rounded-full blur-3xl animate-float bg-[#00695C]/5" />
        <div className="absolute -bottom-1/2 -left-1/2 w-[500px] h-[500px] rounded-full blur-3xl animate-float-delayed bg-[#26A69A]/5" />
      </div>

      <Toast toast={toast} setToast={setToast} />

      {/* Header */}
      <div className="relative z-50 animate-fade-in">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-[#00695C] via-[#26A69A] to-[#4DB6AC] bg-clip-text text-transparent">
                Lead Reports
              </h1>
              <span className="px-3 py-1.5 bg-gradient-to-r from-[#E8F4F2] to-[#D5F0EA] text-[#00695C] text-xs font-black rounded-full flex items-center gap-1.5">
                <FiActivity className="text-[10px]" />
                Analytics Dashboard
              </span>
            </div>
            <p className="text-sm text-[#3D5A55] font-semibold flex items-center gap-2 flex-wrap">
              <span>Comprehensive lead analytics and reports</span>
              <span className="w-1.5 h-1.5 bg-[#B5C9C5] rounded-full" />
              <span className="text-[#00695C] font-black flex items-center gap-1">
                <FiCalendar className="text-xs" />
                {getDateRangeLabel(datePreset, customStart, customEnd)}
              </span>
              {filterCount > 0 && (
                <>
                  <span className="w-1.5 h-1.5 bg-[#B5C9C5] rounded-full" />
                  <span className="px-2 py-0.5 bg-[#FEF3E2] text-amber-700 text-xs font-semibold rounded-full">
                    {filterCount} filters active
                  </span>
                </>
              )}
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
            <ExportDropdown onExportAll={handleExportAll} disabled={loading} />
            <button 
              onClick={handleRefresh} 
              disabled={loading} 
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E8F0EE] rounded-xl hover:border-[#00695C]/30 hover:shadow-md transition-all text-sm font-black text-[#0F1A18] disabled:opacity-50 hover:scale-105"
            >
              <FiRefreshCw className={`text-sm ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{loading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      {filterCount > 0 && (
        <div className="relative z-40 bg-white rounded-2xl p-4 border border-[#E8F0EE] shadow-sm animate-slide-in">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-[#5A7D78]">Active Filters:</span>
              {activeStatus !== 'all' && (
                <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full flex items-center gap-1">
                  Status: {activeStatus}
                  <button onClick={() => setActiveStatus('all')} className="hover:text-red-600"><FiX className="text-[10px]" /></button>
                </span>
              )}
              {activePriority !== 'all' && (
                <span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full flex items-center gap-1">
                  Priority: {activePriority}
                  <button onClick={() => setActivePriority('all')} className="hover:text-red-600"><FiX className="text-[10px]" /></button>
                </span>
              )}
              {activeLeadType !== 'all' && (
                <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full flex items-center gap-1">
                  Type: {activeLeadType}
                  <button onClick={() => setActiveLeadType('all')} className="hover:text-red-600"><FiX className="text-[10px]" /></button>
                </span>
              )}
              {activeLeadSource !== 'all' && (
                <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full flex items-center gap-1">
                  Source: {activeLeadSource}
                  <button onClick={() => setActiveLeadSource('all')} className="hover:text-red-600"><FiX className="text-[10px]" /></button>
                </span>
              )}
            </div>
            <button
              onClick={clearAllFilters}
              className="px-4 py-1.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all text-xs font-bold flex items-center gap-1"
            >
              <FiX className="text-sm" /> Clear All
            </button>
          </div>
        </div>
      )}

      {/* Report Type Cards */}
      <div className="relative z-0 animate-slide-in">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5  gap-2.5">
          {REPORT_TYPES.map((report, idx) => (
            <ReportTypeCard 
              key={report.id} 
              report={report} 
              isActive={activeReport === report.id} 
              onClick={() => setActiveReport(report.id)} 
              index={idx}
            />
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="relative z-0 animate-slide-in">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {renderStatsCards()}
        </div>
      </div>

      {/* Charts */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-[#00695C]/20 border-t-[#00695C] rounded-full animate-spin" />
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-[#26A69A] rounded-full animate-spin-reverse" />
            </div>
            <p className="text-sm text-[#3D5A55] font-bold animate-pulse">Loading report data...</p>
          </div>
        </div>
      ) : renderChartSection()}

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes dropdown-in { from { opacity: 0; transform: translateY(-10px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes toast-in { from { opacity: 0; transform: translateY(50px) scale(0.9); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes card-in { from { opacity: 0; transform: translateY(30px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        @keyframes float-delayed { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(15px); } }
        @keyframes spin-reverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
        .animate-slide-in { animation: slide-in 0.5s ease-out forwards; opacity: 0; }
        .animate-dropdown-in { animation: dropdown-in 0.3s ease-out forwards; }
        .animate-toast-in { animation: toast-in 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards; }
        .animate-card-in { animation: card-in 0.5s ease-out forwards; opacity: 0; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .animate-spin-reverse { animation: spin-reverse 3s linear infinite; }
        
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #F1F5F4; border-radius: 4px; }
        ::-webkit-scrollbar-thumb { background: #8FA8A4; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #00695C; }
      `}</style>
    </div>
  );
};

export default LeadReports;