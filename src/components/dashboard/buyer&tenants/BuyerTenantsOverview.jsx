// src/components/dashboard/buyer&tenants/BuyerTenantsOverview.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FiUsers, FiUser, FiHome, FiHeart, FiMapPin, FiCalendar, 
  FiClock, FiTrendingUp, FiArrowUp, FiArrowDown, FiCheckCircle,
  FiXCircle, FiEye, FiMessageCircle, FiStar, 
  FiRefreshCw, FiDownload, FiFilter, FiSearch,
  FiMoreVertical, FiEdit, FiTrash2, FiMail, FiPhone,
  FiClock as FiClockIcon, FiDollarSign, FiMap, FiBookmark,
  FiGrid, FiBell, FiPlus, FiUserPlus, FiChevronRight,
  FiInfo, FiAlertCircle, FiFile, FiSettings  // <-- ADDED FiFile and FiSettings
} from 'react-icons/fi';
import { 
  FaUsers, FaUserCheck, FaUserTimes, FaBuilding,
  FaChartLine, FaWallet, FaUserCircle, FaCalendarCheck,
  FaClipboardList, FaHandshake, FaPhoneAlt, FaEnvelope,
  FaWhatsapp, FaFacebook, FaTwitter, FaInstagram,
  FaLinkedin, FaYoutube
} from 'react-icons/fa';
import { MdOutlinePeople, MdOutlineDashboard } from 'react-icons/md';
import { BsPeople, BsBuilding } from 'react-icons/bs';

// Export utility functions
const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || data.length === 0) {
    return;
  }

  const headers = Object.keys(data[0]);
  const csvRows = [];
  csvRows.push(headers.join(','));
  
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header] || '';
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    csvRows.push(values.join(','));
  }
  
  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const exportToJSON = (data, filename = 'export.json') => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const BuyerTenantsOverview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('this-month');
  const [loading, setLoading] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // ============ NAVIGATION HANDLERS ============
  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleQuickAction = (path, actionName) => {
    showToast(`Navigating to ${actionName}...`, 'info');
    setTimeout(() => {
      navigate(path);
    }, 300);
  };

  // ============ TOAST NOTIFICATION ============
  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  // ============ PERIOD HANDLER ============
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    if (period !== 'custom') {
      setShowCustomDatePicker(false);
      setStartDate('');
      setEndDate('');
      showToast(`Showing data for ${getPeriodLabel(period)}`, 'info');
      handleRefresh();
    } else {
      setShowCustomDatePicker(true);
    }
  };

  const getPeriodLabel = (period) => {
    const labels = {
      'today': 'Today',
      'this-week': 'This Week',
      'this-month': 'This Month',
      'this-quarter': 'This Quarter',
      'this-year': 'This Year',
      'custom': 'Custom Range'
    };
    return labels[period] || period;
  };

  const handleCustomDateApply = () => {
    if (startDate && endDate) {
      setShowCustomDatePicker(false);
      const start = new Date(startDate);
      const end = new Date(endDate);
      showToast(`Showing data from ${start.toLocaleDateString()} to ${end.toLocaleDateString()}`, 'info');
      handleRefresh();
    } else {
      showToast('Please select both start and end dates', 'error');
    }
  };

  // ============ STATISTICS DATA ============
  const statsData = [
    {
      id: 1,
      title: 'Total Buyers',
      value: '1,284',
      change: '+12.5%',
      trend: 'up',
      icon: <FaUserCircle className="text-[#00695C] dark:text-[#4DB6AC]" />,
      color: 'from-[#00695C]/10 to-[#26A69A]/10 dark:from-[#00695C]/20 dark:to-[#26A69A]/10',
      borderColor: 'border-[#00695C]',
      path: '/admin/buyers-tenants/buyer/overview'
    },
    {
      id: 2,
      title: 'Total Tenants',
      value: '856',
      change: '+8.2%',
      trend: 'up',
      icon: <BsPeople className="text-[#26A69A] dark:text-[#80CBC4]" />,
      color: 'from-[#26A69A]/10 to-[#80CBC4]/10 dark:from-[#26A69A]/20 dark:to-[#80CBC4]/10',
      borderColor: 'border-[#26A69A]',
      path: '/admin/buyers-tenants/tenant/overview'
    },
    {
      id: 3,
      title: 'Total Leads',
      value: '2,156',
      change: '+18.7%',
      trend: 'up',
      icon: <MdOutlinePeople className="text-[#9C27B0] dark:text-[#CE93D8]" />,
      color: 'from-[#9C27B0]/10 to-[#CE93D8]/10 dark:from-[#9C27B0]/20 dark:to-[#CE93D8]/10',
      borderColor: 'border-[#9C27B0]',
      path: '/admin/buyers-tenants/lead/overview'
    },
    {
      id: 4,
      title: 'New Registrations',
      value: '47',
      change: '-3.1%',
      trend: 'down',
      icon: <FiUserPlus className="text-[#FF6B6B] dark:text-[#FF8A8A]" />,
      color: 'from-[#FF6B6B]/10 to-[#FF8A8A]/10 dark:from-[#FF6B6B]/20 dark:to-[#FF8A8A]/10',
      borderColor: 'border-[#FF6B6B]',
      path: '/admin/buyers-tenants/buyer/registration'
    },
    {
      id: 5,
      title: 'Wishlist Properties',
      value: '3,429',
      change: '+24.7%',
      trend: 'up',
      icon: <FiHeart className="text-[#E91E63] dark:text-[#F06292]" />,
      color: 'from-[#E91E63]/10 to-[#F06292]/10 dark:from-[#E91E63]/20 dark:to-[#F06292]/10',
      borderColor: 'border-[#E91E63]',
      path: '/admin/buyers-tenants/saved/wishlist'
    },
    {
      id: 6,
      title: 'Site Visits',
      value: '892',
      change: '+18.9%',
      trend: 'up',
      icon: <FiMapPin className="text-[#FF9800] dark:text-[#FFB74D]" />,
      color: 'from-[#FF9800]/10 to-[#FFB74D]/10 dark:from-[#FF9800]/20 dark:to-[#FFB74D]/10',
      borderColor: 'border-[#FF9800]',
      path: '/admin/buyers-tenants/site-visits/dashboard'
    },
    {
      id: 7,
      title: 'Purchase Requests',
      value: '156',
      change: '+22.3%',
      trend: 'up',
      icon: <FaHandshake className="text-[#4CAF50] dark:text-[#81C784]" />,
      color: 'from-[#4CAF50]/10 to-[#81C784]/10 dark:from-[#4CAF50]/20 dark:to-[#81C784]/10',
      borderColor: 'border-[#4CAF50]',
      path: '/admin/buyers-tenants/purchase/overview'
    },
    {
      id: 8,
      title: 'Rental Requests',
      value: '234',
      change: '+14.8%',
      trend: 'up',
      icon: <FaClipboardList className="text-[#2196F3] dark:text-[#64B5F6]" />,
      color: 'from-[#2196F3]/10 to-[#64B5F6]/10 dark:from-[#2196F3]/20 dark:to-[#64B5F6]/10',
      borderColor: 'border-[#2196F3]',
      path: '/admin/buyers-tenants/rental/overview'
    }
  ];

  // ============ RECENT ACTIVITY DATA ============
  const recentActivities = [
    {
      id: 1,
      user: 'Rahul Sharma',
      type: 'buyer',
      action: 'Saved Property',
      property: 'Luxury Villa in Whitefield',
      time: '2 minutes ago',
      avatar: 'https://ui-avatars.com/api/?name=Rahul+Sharma&background=00695C&color=fff&size=32',
      path: '/admin/buyers-tenants/buyer/profile'
    },
    {
      id: 2,
      user: 'Priya Patel',
      type: 'tenant',
      action: 'Rental Request',
      property: '3BHK Apartment in Indiranagar',
      time: '15 minutes ago',
      avatar: 'https://ui-avatars.com/api/?name=Priya+Patel&background=26A69A&color=fff&size=32',
      path: '/admin/buyers-tenants/tenant/profile'
    },
    {
      id: 3,
      user: 'Amit Kumar',
      type: 'buyer',
      action: 'Site Visit Scheduled',
      property: 'Penthouse in Koramangala',
      time: '45 minutes ago',
      avatar: 'https://ui-avatars.com/api/?name=Amit+Kumar&background=00897B&color=fff&size=32',
      path: '/admin/buyers-tenants/site-visits/details'
    },
    {
      id: 4,
      user: 'Sneha Reddy',
      type: 'tenant',
      action: 'Wishlist Added',
      property: '2BHK in Electronic City',
      time: '1 hour ago',
      avatar: 'https://ui-avatars.com/api/?name=Sneha+Reddy&background=E91E63&color=fff&size=32',
      path: '/admin/buyers-tenants/saved/wishlist'
    },
    {
      id: 5,
      user: 'Vikram Singh',
      type: 'buyer',
      action: 'Purchase Request',
      property: '4BHK Villa in Sarjapur',
      time: '2 hours ago',
      avatar: 'https://ui-avatars.com/api/?name=Vikram+Singh&background=4CAF50&color=fff&size=32',
      path: '/admin/buyers-tenants/purchase/details'
    }
  ];

  // ============ TOP PERFORMERS DATA ============
  const topPerformers = [
    {
      id: 1,
      name: 'Sanjay Mehta',
      role: 'Real Estate Agent',
      totalDeals: 28,
      revenue: '₹2.4 Cr',
      rating: 4.9,
      avatar: 'https://ui-avatars.com/api/?name=Sanjay+Mehta&background=00695C&color=fff&size=40',
      path: '/profile/agent'
    },
    {
      id: 2,
      name: 'Ananya Iyer',
      role: 'Property Manager',
      totalDeals: 22,
      revenue: '₹1.8 Cr',
      rating: 4.8,
      avatar: 'https://ui-avatars.com/api/?name=Ananya+Iyer&background=26A69A&color=fff&size=40',
      path: '/profile/property-management'
    },
    {
      id: 3,
      name: 'Ravi Desai',
      role: 'Real Estate Agent',
      totalDeals: 19,
      revenue: '₹1.5 Cr',
      rating: 4.7,
      avatar: 'https://ui-avatars.com/api/?name=Ravi+Desai&background=00897B&color=fff&size=40',
      path: '/profile/agent'
    },
    {
      id: 4,
      name: 'Neha Gupta',
      role: 'Property Manager',
      totalDeals: 16,
      revenue: '₹1.2 Cr',
      rating: 4.6,
      avatar: 'https://ui-avatars.com/api/?name=Neha+Gupta&background=FF9800&color=fff&size=40',
      path: '/profile/property-management'
    }
  ];

  // ============ CHART DATA ============
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const buyersData = [45, 52, 38, 65, 58, 72, 68, 84, 79, 92, 88, 98];
  const tenantsData = [28, 35, 42, 38, 45, 52, 48, 56, 62, 58, 68, 72];

  const maxValue = Math.max(...buyersData, ...tenantsData);
  const chartHeight = 100;

  const getBarHeight = (value) => {
    return (value / maxValue) * chartHeight;
  };

  // ============ QUICK ACTIONS ============
  const quickActions = [
    { 
      icon: <FiUserPlus />, 
      label: 'Add Buyer', 
      color: 'bg-[#00695C]', 
      path: '/admin/buyers-tenants/buyer/registration',
      actionName: 'Add Buyer'
    },
    { 
      icon: <FiUserPlus />, 
      label: 'Add Tenant', 
      color: 'bg-[#26A69A]', 
      path: '/admin/buyers-tenants/tenant/registration',
      actionName: 'Add Tenant'
    },
    { 
      icon: <FiHeart />, 
      label: 'View Wishlist', 
      color: 'bg-[#E91E63]', 
      path: '/admin/buyers-tenants/saved/wishlist',
      actionName: 'Wishlist'
    },
    { 
      icon: <FiMapPin />, 
      label: 'Site Visits', 
      color: 'bg-[#FF9800]', 
      path: '/admin/buyers-tenants/site-visits/dashboard',
      actionName: 'Site Visits'
    },
    { 
      icon: <FaHandshake />, 
      label: 'Purchase Requests', 
      color: 'bg-[#4CAF50]', 
      path: '/admin/buyers-tenants/purchase/overview',
      actionName: 'Purchase Requests'
    },
    { 
      icon: <FaClipboardList />, 
      label: 'Rental Requests', 
      color: 'bg-[#2196F3]', 
      path: '/admin/buyers-tenants/rental/overview',
      actionName: 'Rental Requests'
    },
    { 
      icon: <MdOutlinePeople />, 
      label: 'Lead Management', 
      color: 'bg-[#9C27B0]', 
      path: '/admin/buyers-tenants/lead/overview',
      actionName: 'Lead Management'
    },
    { 
      icon: <FaChartLine />, 
      label: 'Reports', 
      color: 'bg-[#607D8B]', 
      path: '/admin/reports',
      actionName: 'Reports'
    }
  ];

  // ============ LEAD STATUS DATA ============
  const leadStatusData = [
    { label: 'New Leads', value: 45, color: 'bg-blue-500', path: '/admin/buyers-tenants/lead/status' },
    { label: 'In Progress', value: 82, color: 'bg-yellow-500', path: '/admin/buyers-tenants/lead/dashboard' },
    { label: 'Site Visits', value: 38, color: 'bg-purple-500', path: '/admin/buyers-tenants/site-visits/dashboard' },
    { label: 'Negotiation', value: 27, color: 'bg-orange-500', path: '/admin/buyers-tenants/lead/dashboard' },
    { label: 'Closed Won', value: 64, color: 'bg-green-500', path: '/admin/buyers-tenants/lead/status' },
    { label: 'Closed Lost', value: 23, color: 'bg-red-500', path: '/admin/buyers-tenants/lead/status' }
  ];

  const maxLeadValue = Math.max(...leadStatusData.map(item => item.value));

  // ============ EXPORT HANDLER ============
  const handleExport = (format = 'csv') => {
    setExportLoading(true);
    showToast('Preparing export data...', 'info');

    setTimeout(() => {
      try {
        const exportData = {
          summary: {
            'Total Buyers': '1,284',
            'Total Tenants': '856',
            'Total Leads': '2,156',
            'New Registrations': '47',
            'Wishlist Properties': '3,429',
            'Site Visits': '892',
            'Purchase Requests': '156',
            'Rental Requests': '234'
          },
          recentActivity: recentActivities.map(activity => ({
            'User': activity.user,
            'Type': activity.type,
            'Action': activity.action,
            'Property': activity.property,
            'Time': activity.time
          })),
          topPerformers: topPerformers.map(performer => ({
            'Name': performer.name,
            'Role': performer.role,
            'Deals': performer.totalDeals,
            'Revenue': performer.revenue,
            'Rating': performer.rating
          })),
          leadStatus: leadStatusData.map(lead => ({
            'Status': lead.label,
            'Count': lead.value
          })),
          monthlyData: months.map((month, index) => ({
            'Month': month,
            'Buyers': buyersData[index],
            'Tenants': tenantsData[index]
          }))
        };

        const filename = `buyer-tenant-overview-${new Date().toISOString().split('T')[0]}`;

        if (format === 'json') {
          exportToJSON(exportData, `${filename}.json`);
        } else {
          const flatData = [
            ...exportData.monthlyData,
            { 'Month': '--- Summary ---', 'Buyers': '', 'Tenants': '' },
            { 'Month': 'Total Buyers', 'Buyers': exportData.summary['Total Buyers'], 'Tenants': '' },
            { 'Month': 'Total Tenants', 'Buyers': exportData.summary['Total Tenants'], 'Tenants': '' },
            { 'Month': 'Total Leads', 'Buyers': exportData.summary['Total Leads'], 'Tenants': '' },
            { 'Month': 'New Registrations', 'Buyers': exportData.summary['New Registrations'], 'Tenants': '' },
          ];
          exportToCSV(flatData, `${filename}.csv`);
        }

        showToast(`Data exported successfully as ${format.toUpperCase()}!`, 'success');
        setShowExportMenu(false);
      } catch (error) {
        showToast('Failed to export data. Please try again.', 'error');
      } finally {
        setExportLoading(false);
      }
    }, 500);
  };

  // ============ REFRESH HANDLER ============
  const handleRefresh = () => {
    setLoading(true);
    showToast('Refreshing data...', 'info');
    setTimeout(() => {
      setLoading(false);
      showToast('Data refreshed successfully!', 'success');
    }, 1000);
  };

  // ============ STAT CARD CLICK ============
  const handleStatClick = (stat) => {
    if (stat.path) {
      navigate(stat.path);
      showToast(`Navigating to ${stat.title}...`, 'info');
    }
  };

  // Get date range based on selected period
  const getDateRange = () => {
    const now = new Date();
    let start = new Date();
    let end = new Date();

    switch (selectedPeriod) {
      case 'today':
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'this-week':
        const day = now.getDay();
        start.setDate(now.getDate() - day);
        start.setHours(0, 0, 0, 0);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        break;
      case 'this-month':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'this-quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        start = new Date(now.getFullYear(), quarter * 3, 1);
        end = new Date(now.getFullYear(), quarter * 3 + 3, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'this-year':
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now.getFullYear(), 11, 31);
        end.setHours(23, 59, 59, 999);
        break;
      case 'custom':
        if (startDate && endDate) {
          start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
        }
        break;
      default:
        break;
    }

    return { start, end };
  };

  const dateRange = getDateRange();

  return (
    <div className="relative">
      {/* ============ TOAST NOTIFICATION ============ */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg animate-slide-in-right flex items-center gap-3 ${
          toast.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300' :
          toast.type === 'error' ? 'bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300' :
          'bg-blue-50 border border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300'
        }`}>
          {toast.type === 'success' && <FiCheckCircle className="text-green-500" />}
          {toast.type === 'error' && <FiXCircle className="text-red-500" />}
          {toast.type === 'info' && <FiInfo className="text-blue-500" />}
          <span className="text-sm font-medium">{toast.message}</span>
          <button 
            onClick={() => setToast({ show: false, message: '', type: '' })}
            className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <FiXCircle className="text-sm" />
          </button>
        </div>
      )}

      {/* ============ PAGE HEADER ============ */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-3">  {/* Changed from h1 to div */}
            <span className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-2 rounded-xl shadow-lg shadow-[#00695C]/20">
              <FiUsers className="text-white text-lg" />
            </span>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
              Buyer & Tenant Overview
            </h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#26A69A] animate-pulse" />
            Real-time overview of buyers and tenants activity
          </p>
        </div>

        {/* ============ HEADER RIGHT SIDE - THEME BASED CONTROLS ============ */}
        <div className="flex items-center gap-2 flex-wrap relative">
          {/* Period Selector */}
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-xl px-3 py-2 border border-gray-200 dark:border-gray-700 shadow-sm">
            <FiCalendar className="text-gray-400 dark:text-gray-500 text-sm" />
            <select 
              value={selectedPeriod}
              onChange={(e) => handlePeriodChange(e.target.value)}
              className="bg-transparent text-sm text-gray-600 dark:text-gray-300 focus:outline-none cursor-pointer pr-6 [&>option]:text-gray-700 dark:[&>option]:bg-gray-800 dark:[&>option]:text-gray-200"
            >
              <option value="today">Today</option>
              <option value="this-week">This Week</option>
              <option value="this-month">This Month</option>
              <option value="this-quarter">This Quarter</option>
              <option value="this-year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
            {selectedPeriod === 'custom' && startDate && endDate && (
              <span className="text-xs text-[#00695C] dark:text-[#4DB6AC] font-medium ml-1">
                {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
              </span>
            )}
          </div>

          {/* Custom Date Picker */}
          {showCustomDatePicker && (
            <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-40 w-72">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 outline-none [color-scheme:light] dark:[color-scheme:dark]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 outline-none [color-scheme:light] dark:[color-scheme:dark]"
                  />
                </div>
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={handleCustomDateApply}
                    className="flex-1 px-3 py-1.5 bg-[#00695C] text-white rounded-lg text-sm font-medium hover:bg-[#004D40] transition-all"
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => {
                      setShowCustomDatePicker(false);
                      setStartDate('');
                      setEndDate('');
                    }}
                    className="px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Refresh Button */}
          <button 
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] dark:from-[#00897B] dark:to-[#26A69A] text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[#00695C]/30 dark:hover:shadow-black/40 transition-all duration-300"
          >
            <FiRefreshCw className={`text-sm ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          {/* Export Button with Dropdown Menu */}
          <div className="relative">
            <button 
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={exportLoading}
              className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-600 dark:text-gray-300 hover:border-[#00695C] hover:text-[#00695C] dark:hover:border-[#4DB6AC] dark:hover:text-[#4DB6AC] transition-all duration-300 shadow-sm disabled:opacity-70"
            >
              {exportLoading ? (
                <FiRefreshCw className="text-sm animate-spin" />
              ) : (
                <FiDownload className="text-sm" />
              )}
              {exportLoading ? 'Exporting...' : 'Export'}
              <FiChevronRight className={`text-xs transition-transform duration-200 ${showExportMenu ? 'rotate-90' : ''}`} />
            </button>

            {/* Export Dropdown Menu */}
            {showExportMenu && (
              <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50 min-w-[160px] animate-slide-down">
                <button
                  onClick={() => handleExport('csv')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <span className="w-4 h-4 flex items-center justify-center text-[#00695C] dark:text-[#4DB6AC]">
                    <FiDownload className="text-xs" />
                  </span>
                  Export as CSV
                </button>
                <button
                  onClick={() => handleExport('json')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <span className="w-4 h-4 flex items-center justify-center text-[#00695C] dark:text-[#4DB6AC]">
                    <FiFile className="text-xs" />
                  </span>
                  Export as JSON
                </button>
                <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
               
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============ REST OF THE COMPONENT (unchanged) ============ */}
      {/* Date Range Display */}
      <div className="mb-4 flex items-center gap-2">
        <div className="bg-gray-50 dark:bg-gray-800/60 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Showing data for: <span className="font-medium text-gray-700 dark:text-gray-200">
              {selectedPeriod === 'custom' && startDate && endDate 
                ? `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`
                : getPeriodLabel(selectedPeriod)
              }
            </span>
          </span>
        </div>
        {selectedPeriod === 'custom' && startDate && endDate && (
          <span className="text-xs text-[#00695C] dark:text-[#4DB6AC] bg-[#00695C]/10 dark:bg-[#00695C]/20 px-2 py-0.5 rounded-full">
            {Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))} days
          </span>
        )}
      </div>

      {/* ============ STATISTICS CARDS ============ */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {statsData.map((stat, index) => (
          <div
            key={stat.id}
            onClick={() => handleStatClick(stat)}
            className={`bg-gradient-to-br ${stat.color} backdrop-blur-sm rounded-xl p-3 border border-gray-100/50 dark:border-white/5 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden cursor-pointer`}
            style={{ animationDelay: `${index * 0.05}s` }}
            onMouseEnter={() => setHoveredCard(stat.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="absolute -top-8 -right-8 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-1">
                <div className={`w-7 h-7 rounded-lg bg-white/50 dark:bg-gray-900/40 backdrop-blur-sm flex items-center justify-center text-base shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>
                <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full flex items-center gap-0.5 ${
                  stat.trend === 'up' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                }`}>
                  {stat.trend === 'up' ? <FiArrowUp className="text-xs" /> : <FiArrowDown className="text-xs" />}
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-300">{stat.title}</p>
                <p className="text-lg font-bold text-gray-800 dark:text-gray-50">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ============ MAIN CONTENT GRID ============ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Chart Section */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-base">
                  <FaChartLine className="text-[#00695C]" />
                  User Growth Overview
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Monthly user registrations trend</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-xs cursor-pointer hover:opacity-70 transition-opacity" onClick={() => showToast('Showing buyers data', 'info')}>
                  <span className="w-2 h-2 rounded-full bg-[#00695C]"></span>
                  <span className="text-gray-600">Buyers</span>
                </div>
                <div className="flex items-center gap-1 text-xs cursor-pointer hover:opacity-70 transition-opacity" onClick={() => showToast('Showing tenants data', 'info')}>
                  <span className="w-2 h-2 rounded-full bg-[#26A69A]"></span>
                  <span className="text-gray-600">Tenants</span>
                </div>
              </div>
            </div>
            
            <div className="relative h-[100px] mt-3">
              <div className="absolute inset-0 flex flex-col justify-between">
                {[0, 25, 50, 75, 100].map((val) => (
                  <div key={val} className="w-full border-t border-gray-100 relative">
                    <span className="absolute -left-10 -top-2 text-[10px] text-gray-400">{val}%</span>
                  </div>
                ))}
              </div>
              
              <div className="absolute inset-0 flex items-end justify-between pl-2 pr-1">
                {months.map((month, index) => (
                  <div key={month} className="flex items-end gap-1 group relative h-full">
                    <div className="relative flex flex-col items-center h-full justify-end">
                      <div 
                        className="w-2.5 bg-gradient-to-t from-[#00695C] to-[#26A69A] rounded-t-sm transition-all duration-500 cursor-pointer hover:opacity-80"
                        style={{ 
                          height: `${getBarHeight(buyersData[index])}px`,
                          minHeight: '3px'
                        }}
                        onClick={() => showToast(`Buyers: ${buyersData[index]} registrations in ${month}`, 'info')}
                      >
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {buyersData[index]}
                        </div>
                      </div>
                      <div 
                        className="w-2.5 bg-gradient-to-t from-[#26A69A] to-[#80CBC4] rounded-t-sm transition-all duration-500 cursor-pointer hover:opacity-80 mt-0.5"
                        style={{ 
                          height: `${getBarHeight(tenantsData[index])}px`,
                          minHeight: '3px'
                        }}
                        onClick={() => showToast(`Tenants: ${tenantsData[index]} registrations in ${month}`, 'info')}
                      >
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {tenantsData[index]}
                        </div>
                      </div>
                    </div>
                    <span className="absolute -bottom-5 text-[10px] text-gray-500 font-medium">
                      {month}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-5 pt-2 border-t border-gray-100 text-xs">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00695C]"></span>
                  <span className="text-gray-500">Total Buyers: <span className="font-semibold text-gray-700">1,284</span></span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#26A69A]"></span>
                  <span className="text-gray-500">Total Tenants: <span className="font-semibold text-gray-700">856</span></span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#00695C] font-medium">+22.8%</span>
                <span className="text-gray-400">vs last year</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-base">
                  <FiClock className="text-[#00695C]" />
                  Recent Activity
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Latest actions by buyers and tenants</p>
              </div>
              <button 
                onClick={() => handleNavigate('/admin/buyers-tenants/buyer/overview')}
                className="text-xs text-[#00695C] font-medium hover:underline flex items-center gap-1"
              >
                View All <FiArrowUp className="rotate-90 text-xs" />
              </button>
            </div>
            
            <div className="space-y-2">
              {recentActivities.map((activity, index) => (
                <div 
                  key={activity.id}
                  onClick={() => handleNavigate(activity.path)}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-all duration-300 group border border-transparent hover:border-gray-100 cursor-pointer"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <img 
                    src={activity.avatar} 
                    alt={activity.user}
                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm text-gray-800">{activity.user}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full uppercase font-medium ${
                        activity.type === 'buyer' ? 'bg-[#00695C]/10 text-[#00695C]' : 'bg-[#26A69A]/10 text-[#26A69A]'
                      }`}>
                        {activity.type}
                      </span>
                      <span className="text-xs text-gray-500">{activity.action}</span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">{activity.property}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 flex-shrink-0">
                    <FiClockIcon className="text-xs" />
                    {activity.time}
                  </div>
                  <FiChevronRight className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-base mb-3">
              <FiGrid className="text-[#00695C]" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {quickActions.map((action, index) => (
                <div
                  key={index}
                  onClick={() => handleQuickAction(action.path, action.actionName)}
                  className="group flex flex-col items-center gap-1.5 p-2 rounded-xl bg-gray-50 hover:bg-white hover:shadow-md border border-transparent hover:border-gray-200 transition-all duration-300 cursor-pointer"
                  style={{ animationDelay: `${index * 0.03}s` }}
                >
                  <div className={`w-9 h-9 rounded-lg ${action.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {action.icon}
                  </div>
                  <span className="text-xs text-gray-600 text-center font-medium leading-tight">{action.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-4">
          {/* Top Performers */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-base">
                  <FiStar className="text-yellow-500" />
                  Top Performers
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Best performing agents & managers</p>
              </div>
              <button 
                onClick={() => handleNavigate('/admin/agents/overview')}
                className="text-xs text-[#00695C] font-medium hover:underline"
              >
                View All
              </button>
            </div>
            
            <div className="space-y-2">
              {topPerformers.map((performer, index) => (
                <div 
                  key={performer.id}
                  onClick={() => handleNavigate(performer.path)}
                  className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-50 transition-all duration-300 group cursor-pointer"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <img 
                    src={performer.avatar} 
                    alt={performer.name}
                    className="w-9 h-9 rounded-full border-2 border-white shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-sm text-gray-800">{performer.name}</span>
                      <span className="text-[10px] px-1 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                        ★ {performer.rating}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">{performer.role}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-semibold text-gray-700">{performer.totalDeals} deals</div>
                    <div className="text-xs text-[#00695C] font-medium">{performer.revenue}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lead Status */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-base">
                <FiTrendingUp className="text-[#00695C]" />
                Lead Status
              </h3>
              <button 
                onClick={() => handleNavigate('/admin/buyers-tenants/lead/dashboard')}
                className="text-xs text-[#00695C] font-medium hover:underline"
              >
                View All
              </button>
            </div>
            
            <div className="space-y-2">
              {leadStatusData.map((item, index) => (
                <div 
                  key={index} 
                  className="space-y-1 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => handleNavigate(item.path)}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">{item.label}</span>
                    <span className="font-semibold text-gray-800">{item.value}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                      style={{ width: `${(item.value / maxLeadValue) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications / Alerts */}
          <div className="bg-gradient-to-br from-[#00695C]/5 to-[#26A69A]/5 rounded-2xl p-4 border border-[#00695C]/10 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#00695C]/10 flex items-center justify-center flex-shrink-0">
                <FiBell className="text-[#00695C] text-base" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-800">Pending Verifications</h4>
                <p className="text-xs text-gray-500 mt-0.5">12 buyers and 8 tenants require KYC verification</p>
                <button 
                  onClick={() => handleNavigate('/admin/buyers-tenants/buyer/registration')}
                  className="mt-1.5 text-xs text-[#00695C] font-medium hover:underline flex items-center gap-1"
                >
                  Review Now <FiArrowUp className="rotate-90 text-xs" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div 
              className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm text-center cursor-pointer hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
              onClick={() => handleNavigate('/admin/buyers-tenants/buyer/registration')}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#00695C]/10 text-[#00695C] mx-auto mb-1">
                <FiUsers className="text-base" />
              </div>
              <div className="text-xl font-bold text-gray-800">47</div>
              <div className="text-xs text-gray-500">New Registrations</div>
            </div>
            <div 
              className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm text-center cursor-pointer hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
              onClick={() => handleNavigate('/admin/buyers-tenants/saved/wishlist')}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#E91E63]/10 text-[#E91E63] mx-auto mb-1">
                <FiHeart className="text-base" />
              </div>
              <div className="text-xl font-bold text-gray-800">3.4K</div>
              <div className="text-xs text-gray-500">Wishlist Items</div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ FOOTER NOTE ============ */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
          <span className="w-1 h-1 rounded-full bg-[#26A69A] animate-pulse" />
          Live Data Updated Every 30 Seconds
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          Last Updated: {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
          <button 
            onClick={handleRefresh}
            className="text-[#00695C] hover:underline ml-1"
          >
            Refresh
          </button>
        </p>
      </div>

      {/* ============ ANIMATION STYLES ============ */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-down {
          animation: slideDown 0.3s ease-out;
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default BuyerTenantsOverview;