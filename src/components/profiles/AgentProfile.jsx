import React, { useState, useRef, useEffect } from 'react';
import { 
  User, Mail, Phone, Calendar, MapPin, Building, 
  CreditCard, Banknote, Upload, Camera, FileText,
  CheckCircle, AlertCircle, ChevronDown, ChevronUp,
  Save, X, Shield, Clock, Globe, MessageCircle,
  Image, Video, Home, Briefcase, Landmark,
  FileCheck, Users, BookOpen, Printer, Download,
  Edit2, Trash2, Plus, Minus, Check, AlertTriangle,
  Info, ArrowLeft, Smartphone, Eye, EyeOff, Heart,
  Award, Star, Trophy, Target, Zap, Sparkles,
  Layers, Grid, Layout, Palette, Circle, Square,
  Menu, MoreHorizontal, Copy, ExternalLink, Link,
  Bookmark, Flag, Bell, Settings, Power,
  Zap as ZapIcon, Rocket, Crown, Diamond,
  Search, Filter, Grid as GridIcon, List,
  Eye as ViewIcon, Bed, Bath, Trees, Wifi, Shield as ShieldIcon, 
  Dumbbell, Waves, ParkingCircle, Sprout, Leaf, ChevronLeft, ChevronRight,
  Store, Globe2, Facebook, Instagram, Linkedin, Youtube,
  Key, Lock, UserCheck, UserCog, BadgeCheck, Building2, MapPinHouse,
  PhoneCall, AtSign, Hash, FileSignature, ClipboardList, Award as AwardIcon,
  Star as StarIcon, Users as UsersIcon, Home as HomeIcon, DollarSign,
  TrendingUp, PieChart, BarChart3, Activity, Clock as ClockIcon,
  FolderOpen, FileArchive
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

// Media Lightbox Modal Component
const MediaLightboxModal = ({ items, index, onClose, onNavigate, onDelete }) => {
  if (!items || items.length === 0) return null;
  const current = items[index];

  const goPrev = () => onNavigate((index - 1 + items.length) % items.length);
  const goNext = () => onNavigate((index + 1) % items.length);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-md animate-fadeIn p-4" onClick={onClose}>
      <div className="relative max-w-4xl max-h-[85vh] w-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/80 hover:text-white transition-all duration-300 hover:rotate-90 hover:scale-110"
        >
          <X className="w-7 h-7" />
        </button>

        {items.length > 1 && (
          <button
            onClick={goPrev}
            className="absolute left-0 sm:-left-14 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-2.5 transition-all duration-300 z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        <div className="w-full flex flex-col items-center gap-3 animate-scaleIn">
          {current.type === 'video' ? (
            <video src={current.url} controls autoPlay className="max-w-full max-h-[75vh] rounded-2xl shadow-2xl bg-black" />
          ) : (
            <img src={current.url} alt={current.name || 'Preview'} className="max-w-full max-h-[75vh] rounded-2xl shadow-2xl object-contain bg-black/20" />
          )}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-white/80 text-xs font-medium">
              <span>{current.name}</span>
              {items.length > 1 && <span>· {index + 1} / {items.length}</span>}
            </div>
            {onDelete && (
              <button
                onClick={onDelete}
                title="Delete this file"
                className="flex items-center gap-1 bg-red-500/90 hover:bg-red-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Trash2 className="w-3 h-3" />
                Delete
              </button>
            )}
          </div>
        </div>

        {items.length > 1 && (
          <button
            onClick={goNext}
            className="absolute right-0 sm:-right-14 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-2.5 transition-all duration-300 z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};

const AgentProfile = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('personal');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [showProfilePhotoDeleteConfirm, setShowProfilePhotoDeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showMediaLightbox, setShowMediaLightbox] = useState(false);
  const [lightboxItems, setLightboxItems] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showDeletePropertyConfirm, setShowDeletePropertyConfirm] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  
  const fileInputRefs = useRef({});
  const profilePhotoInputRef = useRef(null);

  // Agent Form State
  const [editForm, setEditForm] = useState({
    // Personal Details
    fullName: 'Amit Sharma',
    mobileNumber: '+91 98765 43210',
    emailAddress: 'amit.sharma@realestate.com',
    dateOfBirth: '15-08-1990',
    gender: 'Male',
    
    // Business Information
    agencyName: 'Sharma Realty Solutions',
    reraRegistrationNumber: 'RERA/2025/12345',
    gstNumber: '22ABCDE1234F1Z5',
    yearsOfExperience: '8',
    activeListings: '45',
    serviceAreas: 'Mumbai, Pune, Thane, Navi Mumbai',
    officeAddress: 'Office No. 304, 3rd Floor, Business Tower, Andheri East, Mumbai - 400093',
    
    // Identity Verification
    aadhaarNumber: '1234 5678 9012',
    panNumber: 'ABCDE1234F',
    
    // Contact Information
    city: 'Mumbai',
    district: 'Mumbai City',
    state: 'Maharashtra',
    pinCode: '400093',
    website: 'https://www.sharmarealty.com',
    whatsappNumber: '+91 98765 43211',
    
    // Bank Details
    accountHolderName: 'Amit Sharma',
    bankName: 'State Bank of India',
    accountNumber: '12345678901',
    ifscCode: 'SBIN0001234',
    upiId: 'amit.sharma@upi',
    
    // Social Media (with full URLs)
    facebookPage: 'https://facebook.com/sharmarealty',
    instagram: 'https://instagram.com/sharmarealty',
    linkedin: 'https://linkedin.com/in/amit-sharma-realty',
    youtubeChannel: 'https://youtube.com/@sharmarealty',
  });

  // Documents State
  const [documents, setDocuments] = useState({
    // Profile & Business Documents
    profilePhoto: null,
    agencyLogo: null,
    aadhaarCard: null,
    panCard: null,
    reraCertificate: null,
    gstCertificate: null,
    businessRegistrationCertificate: null,
    
    // Media Upload (like OwnerProfile)
    coverImage: null,
    propertyPhotos: [],
    propertyVideo: null,
  });

  // Properties/Listings for the Agent
  const [properties, setProperties] = useState([
    {
      id: 'PROP-001',
      name: 'Sunset Villa',
      type: 'Villa',
      status: 'Active',
      price: '₹1,20,00,000',
      area: '2500 sq ft',
      location: 'Pune, Maharashtra',
      postedDate: '15-06-2025',
      description: 'Luxury villa with garden, pool, and premium interiors.',
      images: ['/villa1_1.png', '/villa1_2.png', '/villa1_3.png', '/villa1_4.png'],
      features: ['4 BHK', 'Swimming Pool', 'Garden', 'Smart Home', 'Premium Interiors'],
      views: 245,
      inquiries: 12,
      bedrooms: '4 BHK',
      bathrooms: '4',
      furnishing: 'Fully Furnished',
      parking: '3+ Cars',
      propertyCategory: 'residential',
      listedBy: 'agent',
      listingPurpose: 'For Sale',
      expectedPrice: '12000000',
      maintenance: '5000',
      availableFrom: '2025-07-01',
      selectedAmenities: ['Gated Community', '24/7 Security', 'Swimming Pool', 'Garden', 'Smart Home'],
      propertyAddress: '45, Sunset Villa, Pune, Maharashtra',
      propertyCity: 'Pune',
      builtUpArea: '2500',
      carpetArea: '2200',
      propertyTitle: 'Sunset Villa',
      propertyType: 'Villa'
    },
    {
      id: 'PROP-002',
      name: 'Green Valley Apartment',
      type: 'Apartment',
      status: 'Active',
      price: '₹45,00,000',
      area: '1200 sq ft',
      location: 'Mumbai, Maharashtra',
      postedDate: '20-05-2025',
      description: 'Beautiful 2 BHK apartment with modern amenities and sea view.',
      images: ['https://via.placeholder.com/400x300/00695C/ffffff?text=Green+Valley'],
      features: ['2 BHK', 'Sea View', 'Modern Kitchen', 'Parking'],
      views: 189,
      inquiries: 8,
      bedrooms: '2 BHK',
      bathrooms: '2',
      furnishing: 'Fully Furnished',
      parking: '2 Cars',
      propertyCategory: 'residential',
      listedBy: 'agent',
      listingPurpose: 'For Sale',
      expectedPrice: '4500000',
      maintenance: '2000',
      availableFrom: '2025-08-15',
      selectedAmenities: ['Gated Community', '24/7 Security', 'Parking'],
      propertyAddress: '123, Green Valley Apartments, Mumbai',
      propertyCity: 'Mumbai',
      builtUpArea: '1200',
      carpetArea: '1000',
      propertyTitle: 'Green Valley Apartment',
      propertyType: 'Apartment'
    },
    {
      id: 'PROP-003',
      name: 'City Center Office',
      type: 'Commercial',
      status: 'Inactive',
      price: '₹2,00,000/month',
      area: '800 sq ft',
      location: 'Bangalore, Karnataka',
      postedDate: '10-04-2025',
      description: 'Prime location office space in the city center.',
      images: ['https://via.placeholder.com/400x300/2E86AB/ffffff?text=City+Office'],
      features: ['Prime Location', 'Fully Furnished', '24/7 Security'],
      views: 134,
      inquiries: 5,
      bedrooms: '0',
      bathrooms: '2',
      furnishing: 'Fully Furnished',
      parking: '2 Cars',
      propertyCategory: 'commercial',
      listedBy: 'agent',
      listingPurpose: 'For Rent',
      expectedPrice: '200000',
      maintenance: '10000',
      availableFrom: '2025-05-01',
      selectedAmenities: ['24/7 Security', 'Power Backup', 'CCTV Surveillance'],
      propertyAddress: 'City Center, MG Road, Bangalore',
      propertyCity: 'Bangalore',
      builtUpArea: '800',
      carpetArea: '700',
      propertyTitle: 'City Center Office',
      propertyType: 'Commercial'
    },
  ]);

  const handleNavigateBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/dashboard');
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e) => {
    const value = e.target.value;
    if (value) {
      const [year, month, day] = value.split('-');
      setEditForm(prev => ({ ...prev, dateOfBirth: `${day}-${month}-${year}` }));
    } else {
      setEditForm(prev => ({ ...prev, dateOfBirth: '' }));
    }
  };

  const handleFileUpload = (field, file) => {
    if (file) {
      setDocuments(prev => ({
        ...prev,
        [field]: file
      }));
      if (field === 'profilePhoto' && profilePhotoInputRef.current) {
        profilePhotoInputRef.current.value = '';
      }
      showSuccessToast();
    }
  };

  const handleMultipleFileUpload = (field, files) => {
    let fileArray = Array.from(files);

    if (field === 'propertyPhotos') {
      const existingCount = documents.propertyPhotos.length;
      const remainingSlots = Math.max(0, 3 - existingCount);
      if (fileArray.length > remainingSlots) {
        alert('Property Photos allows a maximum of 3 images.');
      }
      fileArray = fileArray.slice(0, remainingSlots);
    }

    if (fileArray.length > 0) {
      setDocuments(prev => ({
        ...prev,
        [field]: [...prev[field], ...fileArray]
      }));
      showSuccessToast();
    }
  };

  const removeFile = (field, index) => {
    setDeleteItem({ field, index });
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (deleteItem) {
      const { field, index } = deleteItem;
      if (index !== undefined && index !== null) {
        setDocuments(prev => ({
          ...prev,
          [field]: prev[field].filter((_, i) => i !== index)
        }));
      } else {
        setDocuments(prev => ({
          ...prev,
          [field]: null
        }));
        if (fileInputRefs.current[field]) {
          fileInputRefs.current[field].value = '';
        }
      }
      setShowDeleteConfirm(false);
      setDeleteItem(null);
      showSuccessToast();
    }
  };

  const handleProfilePhotoDelete = () => {
    setShowProfilePhotoDeleteConfirm(true);
  };

  const confirmProfilePhotoDelete = () => {
    setDocuments(prev => ({
      ...prev,
      profilePhoto: null
    }));
    if (profilePhotoInputRef.current) {
      profilePhotoInputRef.current.value = '';
    }
    setShowProfilePhotoDeleteConfirm(false);
    showSuccessToast();
  };

  const handleProfilePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload('profilePhoto', file);
    }
  };

  const handleSave = () => {
    const requiredFields = ['fullName', 'mobileNumber', 'emailAddress', 'agencyName', 'aadhaarNumber', 'panNumber'];
    const missingFields = requiredFields.filter(field => !editForm[field]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setShowEditModal(false);
      setIsLoading(false);
      showSuccessToast();
    }, 1500);
  };

  const showSuccessToast = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const getFileStatusLabel = (field) => {
    const files = documents[field];
    const hasFiles = Array.isArray(files) ? files.length > 0 : files !== null;
    if (!hasFiles) return null;
    return Array.isArray(files) ? `${files.length} uploaded` : 'Uploaded';
  };

  const getFileIcon = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
      return '🖼️';
    } else if (['mp4', 'webm', 'mov', 'avi'].includes(extension)) {
      return '🎬';
    } else if (['pdf'].includes(extension)) {
      return '📄';
    } else if (['doc', 'docx'].includes(extension)) {
      return '📝';
    } else {
      return '📎';
    }
  };

  const openMediaLightbox = (field, type) => {
    const val = documents[field];
    if (!val) return;
    const files = Array.isArray(val) ? val : [val];
    if (files.length === 0) return;
    const items = files.map((f, i) => ({
      type,
      url: URL.createObjectURL(f),
      name: f.name,
      field,
      docIndex: Array.isArray(val) ? i : undefined,
    }));
    setLightboxItems(items);
    setLightboxIndex(0);
    setShowMediaLightbox(true);
  };

  const handleDeleteLightboxItem = () => {
    const item = lightboxItems[lightboxIndex];
    if (!item) return;

    setDocuments(prev => {
      if (item.docIndex === undefined) {
        return { ...prev, [item.field]: null };
      }
      return { ...prev, [item.field]: prev[item.field].filter((_, i) => i !== item.docIndex) };
    });

    setLightboxItems(prevItems => {
      const newItems = prevItems
        .filter((_, i) => i !== lightboxIndex)
        .map((it, i) => (it.docIndex !== undefined ? { ...it, docIndex: i } : it));
      if (newItems.length === 0) {
        setShowMediaLightbox(false);
      } else {
        setLightboxIndex(idx => Math.min(idx, newItems.length - 1));
      }
      return newItems;
    });

    showSuccessToast();
  };

  // ============ INVOICE PDF HANDLER ============
  const handleDownloadInvoice = () => {
    const doc = new jsPDF();
    const teal = [0, 105, 92];

    doc.setFillColor(...teal);
    doc.rect(0, 0, 210, 28, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('Agent Profile Invoice', 14, 17);
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 196, 17, { align: 'right' });

    doc.setTextColor(30, 30, 30);
    let y = 40;

    const section = (title) => {
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(...teal);
      doc.text(title, 14, y);
      doc.setDrawColor(...teal);
      doc.line(14, y + 1.5, 196, y + 1.5);
      y += 8;
      doc.setFont(undefined, 'normal');
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(10.5);
    };

    const row = (label, value) => {
      doc.setFont(undefined, 'bold');
      doc.text(`${label}:`, 14, y);
      doc.setFont(undefined, 'normal');
      doc.text(String(value || 'Not specified'), 65, y);
      y += 7;
    };

    section('Personal Details');
    row('Full Name', editForm.fullName);
    row('Mobile Number', editForm.mobileNumber);
    row('Email Address', editForm.emailAddress);
    row('Date of Birth', editForm.dateOfBirth);
    row('Gender', editForm.gender);
    y += 4;

    section('Business Information');
    row('Agency Name', editForm.agencyName);
    row('RERA Registration', editForm.reraRegistrationNumber);
    row('GST Number', editForm.gstNumber);
    row('Years of Experience', editForm.yearsOfExperience);
    row('Active Listings', editForm.activeListings);
    row('Service Areas', editForm.serviceAreas);
    row('Office Address', editForm.officeAddress);
    y += 4;

    section('Contact Information');
    row('City', editForm.city);
    row('District', editForm.district);
    row('State', editForm.state);
    row('PIN Code', editForm.pinCode);
    row('Website', editForm.website);
    row('WhatsApp', editForm.whatsappNumber);
    y += 4;

    section('Identity & Bank Details');
    row('Aadhaar Number', editForm.aadhaarNumber);
    row('PAN Number', editForm.panNumber);
    row('Bank Name', editForm.bankName);
    row('Account Number', editForm.accountNumber);
    row('IFSC Code', editForm.ifscCode);
    row('UPI ID', editForm.upiId);
    y += 4;

    section('Social Media');
    row('Facebook', editForm.facebookPage);
    row('Instagram', editForm.instagram);
    row('LinkedIn', editForm.linkedin);
    row('YouTube', editForm.youtubeChannel);
    y += 4;

    section('Properties Summary');
    row('Total Properties', properties.length);
    row('Active Listings', properties.filter(p => p.status === 'Active').length);

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('This is a system-generated document.', 14, 287);

    doc.save(`Agent_Invoice_${editForm.fullName.replace(/\s+/g, '_')}.pdf`);
  };

  // ============ PROPERTY HANDLERS ============
  const handleViewDetails = (property) => {
    alert(`Viewing details for ${property.name}`);
  };

  const handleEditProperty = (property) => {
    alert(`Editing property: ${property.name}`);
  };

  const handleDeleteProperty = (property) => {
    setPropertyToDelete(property);
    setShowDeletePropertyConfirm(true);
  };

  const confirmDeleteProperty = () => {
    setProperties(prev => prev.filter(p => p.id !== propertyToDelete.id));
    setShowDeletePropertyConfirm(false);
    setPropertyToDelete(null);
    showSuccessToast();
  };

  // ============ FILTER PROPERTIES ============
  const getFilteredProperties = () => {
    let filtered = [...properties];
    
    if (searchTerm && searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(prop => {
        return (
          prop.name.toLowerCase().includes(searchLower) ||
          prop.id.toLowerCase().includes(searchLower) ||
          prop.location.toLowerCase().includes(searchLower) ||
          prop.type.toLowerCase().includes(searchLower) ||
          prop.price.toLowerCase().includes(searchLower) ||
          prop.area.toLowerCase().includes(searchLower)
        );
      });
    }
    
    if (filterStatus && filterStatus !== 'all') {
      const statusLower = filterStatus.toLowerCase();
      filtered = filtered.filter(prop => 
        prop.status.toLowerCase() === statusLower
      );
    }
    
    return filtered;
  };

  const filteredProperties = getFilteredProperties();

  const clearSearch = () => {
    setSearchTerm('');
  };

  // ============ SECTION DEFINITIONS ============
  const sections = [
    { id: 'personal', title: 'Personal Details', icon: User },
    { id: 'business', title: 'Business Info', icon: Store },
    { id: 'media', title: 'Media Upload', icon: Image },
    { id: 'documents', title: 'Upload Documents', icon: FileText },
    { id: 'identity', title: 'Identity & Verification', icon: Shield },
    { id: 'contact', title: 'Contact Information', icon: MapPin },
    { id: 'bank', title: 'Bank Details', icon: Banknote },
    { id: 'social', title: 'Social Media', icon: Globe },
  ];

  // ============ RENDER FUNCTIONS ============

  const renderSectionContent = () => {
    // Shared animated building blocks
    const RingBadge = ({ pct }) => {
      const circumference = 2 * Math.PI * 15.5;
      const dashOffset = circumference - (pct / 100) * circumference;
      return (
        <div className="flex items-center gap-2 bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 border border-[#00695C]/15 rounded-2xl pl-2 pr-4 py-1.5 shadow-sm">
          <div className="relative w-9 h-9 flex-shrink-0">
            <svg viewBox="0 0 36 36" className="w-9 h-9 -rotate-90">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="#00695C1A" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15.5" fill="none"
                stroke="url(#ringGradShared)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{ transition: 'stroke-dashoffset 1s ease-out' }}
              />
              <defs>
                <linearGradient id="ringGradShared" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00695C" />
                  <stop offset="100%" stopColor="#26A69A" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-extrabold text-[#00695C]">
              {pct}%
            </span>
          </div>
        </div>
      );
    };

    const SectionHeader = ({ title, subtitle, filled, total }) => {
      const pct = total ? Math.round((filled / total) * 100) : null;
      return (
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div className="flex items-center">
            <div className="w-1 h-8 bg-gradient-to-b from-[#00695C] to-[#26A69A] mr-3 rounded-full animate-pulse-slow"></div>
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                {title}
              </h2>
              <p className="text-xs text-gray-500">{subtitle}</p>
            </div>
          </div>
          {pct !== null && (
            <div className="flex items-center gap-2">
              <RingBadge pct={pct} />
              <div className="leading-tight hidden sm:block">
                <p className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Completion</p>
                <p className="text-[10px] text-gray-400">{filled} of {total} complete</p>
              </div>
            </div>
          )}
        </div>
      );
    };

    const AnimatedCard = ({ label, value, icon, delay = 0, children }) => (
      <div
        className="group/acard relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#00695C]/[0.06] to-[#26A69A]/[0.06] border border-[#00695C]/10 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 animate-fade-up"
        style={{ animationDelay: `${delay}s` }}
      >
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-[#00695C]/0 via-[#26A69A]/40 to-[#00695C]/0 opacity-0 group-hover/acard:opacity-100 blur-sm transition-opacity duration-500 -z-10" />
        <div className="absolute top-0 left-[-100%] w-full h-[1px] bg-gradient-to-r from-transparent via-[#26A69A]/60 to-transparent group-hover/acard:left-full transition-all duration-[1100ms] ease-out" />
        <div className="absolute -top-8 -right-8 w-20 h-20 bg-gradient-to-br from-[#26A69A]/10 to-[#00695C]/10 rounded-full blur-2xl opacity-0 group-hover/acard:opacity-100 group-hover/acard:scale-125 transition-all duration-500" />
        <div className="relative p-3.5 flex items-start gap-3">
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#00695C] to-[#26A69A] blur-md opacity-0 group-hover/acard:opacity-60 transition-opacity duration-500" />
            <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-[#00695C] to-[#26A69A] shadow-lg transform group-hover/acard:scale-110 group-hover/acard:rotate-6 transition-all duration-300">
              <div className="text-white">{icon}</div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider group-hover/acard:text-[#00695C] transition-colors duration-300">
              {label}
            </label>
            {children ? (
              children
            ) : (
              <div className="text-[13px] text-gray-800 font-semibold break-words">
                {value || <span className="text-gray-400 font-medium italic">Not specified</span>}
              </div>
            )}
          </div>
          {value && !children && (
            <CheckCircle className="w-4 h-4 text-[#00695C]/30 group-hover/acard:text-[#00695C] flex-shrink-0 transition-colors duration-300" />
          )}
        </div>
        <div className="h-[2px] w-full bg-gray-100 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#00695C] to-[#26A69A] w-0 group-hover/acard:w-full transition-all duration-700 ease-out" />
        </div>
      </div>
    );

    switch (activeSection) {
      case 'personal': {
        const personalFields = [
          editForm.fullName, 
          editForm.mobileNumber, 
          editForm.emailAddress, 
          editForm.dateOfBirth, 
          editForm.gender, 
          documents.profilePhoto
        ];
        const filledCount = personalFields.filter(Boolean).length;

        return (
          <div className="w-full animate-slideUp">
            <SectionHeader
              title="Personal Details"
              subtitle="Manage your personal information"
              filled={filledCount}
              total={personalFields.length}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 w-full">
              <div className="space-y-3 w-full">
                <AnimatedCard label="Full Name" value={editForm.fullName} icon={<User className="w-4 h-4" />} delay={0.05} />
                <AnimatedCard label="Mobile Number" value={editForm.mobileNumber} icon={<Phone className="w-4 h-4" />} delay={0.12} />
                <AnimatedCard label="Email Address" value={editForm.emailAddress} icon={<Mail className="w-4 h-4" />} delay={0.19} />
              </div>
              <div className="space-y-3 w-full">
                <AnimatedCard label="Date of Birth" value={formatDateForDisplay(editForm.dateOfBirth)} icon={<Calendar className="w-4 h-4" />} delay={0.26} />
                <AnimatedCard label="Gender" value={editForm.gender} icon={<User className="w-4 h-4" />} delay={0.33} />
                <AnimatedCard label="Profile Photo" icon={<Camera className="w-4 h-4" />} delay={0.40}>
                  <div className="flex items-center gap-2">
                    {documents.profilePhoto ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-[#00695C] font-bold bg-gradient-to-r from-[#00695C]/10 to-[#26A69A]/10 px-3 py-1.5 rounded-lg border border-[#00695C]/20 animate-fadeIn">
                        <Check className="w-3.5 h-3.5" />
                        Uploaded
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 font-medium italic">No photo uploaded</span>
                    )}
                  </div>
                </AnimatedCard>
              </div>
            </div>
          </div>
        );
      }

      case 'business': {
        const businessFields = [
          editForm.agencyName,
          editForm.reraRegistrationNumber,
          editForm.gstNumber,
          editForm.yearsOfExperience,
          editForm.activeListings,
          editForm.serviceAreas,
          editForm.officeAddress,
          documents.agencyLogo,
          documents.businessRegistrationCertificate,
          documents.reraCertificate,
          documents.gstCertificate,
        ];
        const filledCount = businessFields.filter(Boolean).length;

        return (
          <div className="w-full animate-slideUp">
            <SectionHeader
              title="Business Information"
              subtitle="Professional details about your agency"
              filled={filledCount}
              total={businessFields.length}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 w-full">
              <div className="space-y-3 w-full">
                <AnimatedCard label="Agency Name" value={editForm.agencyName} icon={<Store className="w-4 h-4" />} delay={0.05} />
                <AnimatedCard label="RERA Registration Number" value={editForm.reraRegistrationNumber} icon={<BadgeCheck className="w-4 h-4" />} delay={0.11} />
                <AnimatedCard label="GST Number" value={editForm.gstNumber} icon={<Hash className="w-4 h-4" />} delay={0.17} />
                <AnimatedCard label="Years of Experience" value={editForm.yearsOfExperience} icon={<AwardIcon className="w-4 h-4" />} delay={0.23} />
                <AnimatedCard label="Agency Logo" icon={<Image className="w-4 h-4" />} delay={0.29}>
                  <div className="flex items-center gap-2">
                    {documents.agencyLogo ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-[#00695C] font-bold bg-gradient-to-r from-[#00695C]/10 to-[#26A69A]/10 px-3 py-1.5 rounded-lg border border-[#00695C]/20">
                        <Check className="w-3.5 h-3.5" />
                        Uploaded
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 font-medium italic">Not uploaded</span>
                    )}
                  </div>
                </AnimatedCard>
              </div>
              <div className="space-y-3 w-full">
                <AnimatedCard label="Active Listings" value={editForm.activeListings} icon={<Home className="w-4 h-4" />} delay={0.35} />
                <AnimatedCard label="Service Areas" value={editForm.serviceAreas} icon={<MapPin className="w-4 h-4" />} delay={0.41} />
                <AnimatedCard label="Office Address" value={editForm.officeAddress} icon={<MapPinHouse className="w-4 h-4" />} delay={0.47} />
                <AnimatedCard label="Business Documents" icon={<FileCheck className="w-4 h-4" />} delay={0.53}>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 p-2 rounded-lg border border-[#00695C]/15">
                      <Check className={`w-4 h-4 ${documents.businessRegistrationCertificate ? 'text-[#00695C]' : 'text-gray-300'}`} />
                      <span className={documents.businessRegistrationCertificate ? 'text-gray-700 font-medium' : 'text-gray-400'}>
                        Registration: {documents.businessRegistrationCertificate ? '✓ Uploaded' : '✗ Not uploaded'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 p-2 rounded-lg border border-[#00695C]/15">
                      <Check className={`w-4 h-4 ${documents.reraCertificate ? 'text-[#00695C]' : 'text-gray-300'}`} />
                      <span className={documents.reraCertificate ? 'text-gray-700 font-medium' : 'text-gray-400'}>
                        RERA: {documents.reraCertificate ? '✓ Uploaded' : '✗ Not uploaded'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 p-2 rounded-lg border border-[#00695C]/15">
                      <Check className={`w-4 h-4 ${documents.gstCertificate ? 'text-[#00695C]' : 'text-gray-300'}`} />
                      <span className={documents.gstCertificate ? 'text-gray-700 font-medium' : 'text-gray-400'}>
                        GST: {documents.gstCertificate ? '✓ Uploaded' : '✗ Not uploaded'}
                      </span>
                    </div>
                  </div>
                </AnimatedCard>
              </div>
            </div>
          </div>
        );
      }

      case 'media': {
        const mediaFields = ['coverImage', 'propertyPhotos', 'propertyVideo'];
        const filledCount = mediaFields.filter(f => {
          const v = documents[f];
          return Array.isArray(v) ? v.length > 0 : v !== null;
        }).length;

        return (
          <div className="w-full animate-slideUp">
            <SectionHeader
              title="Media Upload"
              subtitle="Visual documentation of your properties"
              filled={filledCount}
              total={mediaFields.length}
            />
            <div className="flex flex-wrap justify-start gap-3 w-full">
              <div className="w-full sm:w-56">
                <AnimatedCard label="Cover Image" icon={<Camera className="w-4 h-4" />} delay={0.05}>
                  {getFileStatusLabel('coverImage') ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openMediaLightbox('coverImage', 'image')}
                        className="text-[13px] font-semibold text-[#00695C] underline underline-offset-2 decoration-[#00695C]/40 hover:text-[#004D40] hover:decoration-[#004D40] transition-colors"
                      >
                        View Image
                      </button>
                      <button
                        onClick={() => removeFile('coverImage')}
                        title="Remove Cover Image"
                        className="p-1 rounded-md text-red-500 hover:text-white hover:bg-red-500 transition-colors duration-300"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-[13px] text-gray-400 font-medium italic">Not specified</span>
                  )}
                </AnimatedCard>
              </div>
              <div className="w-full sm:w-56">
                <AnimatedCard label="Property Photos" icon={<Image className="w-4 h-4" />} delay={0.12}>
                  {getFileStatusLabel('propertyPhotos') ? (
                    <button
                      onClick={() => openMediaLightbox('propertyPhotos', 'image')}
                      className="text-[13px] font-semibold text-[#00695C] underline underline-offset-2 decoration-[#00695C]/40 hover:text-[#004D40] hover:decoration-[#004D40] transition-colors"
                    >
                      View Photos ({documents.propertyPhotos.length})
                    </button>
                  ) : (
                    <span className="text-[13px] text-gray-400 font-medium italic">Not specified</span>
                  )}
                  {getFileStatusLabel('propertyPhotos') && (
                    <p className="text-[10px] text-gray-400 mt-1">Open to view &amp; delete individual photos</p>
                  )}
                </AnimatedCard>
              </div>
              <div className="w-full sm:w-56">
                <AnimatedCard label="Property Video" icon={<Video className="w-4 h-4" />} delay={0.19}>
                  {getFileStatusLabel('propertyVideo') ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openMediaLightbox('propertyVideo', 'video')}
                        className="text-[13px] font-semibold text-[#00695C] underline underline-offset-2 decoration-[#00695C]/40 hover:text-[#004D40] hover:decoration-[#004D40] transition-colors"
                      >
                        Watch Video
                      </button>
                      <button
                        onClick={() => removeFile('propertyVideo')}
                        title="Remove Property Video"
                        className="p-1 rounded-md text-red-500 hover:text-white hover:bg-red-500 transition-colors duration-300"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-[13px] text-gray-400 font-medium italic">Not specified</span>
                  )}
                </AnimatedCard>
              </div>
            </div>
          </div>
        );
      }

      case 'documents': {
        const docFields = [
          documents.profilePhoto,
          documents.agencyLogo,
          documents.aadhaarCard,
          documents.panCard,
          documents.reraCertificate,
          documents.gstCertificate,
          documents.businessRegistrationCertificate,
        ];
        const filledCount = docFields.filter(Boolean).length;

        return (
          <div className="w-full animate-slideUp">
            <SectionHeader
              title="Upload Documents"
              subtitle="All your important documents in one place"
              filled={filledCount}
              total={docFields.length}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 w-full">
              <AnimatedCard label="Profile Photo" value={getFileStatusLabel('profilePhoto')} icon={<Camera className="w-4 h-4" />} delay={0.03}>
                {getFileStatusLabel('profilePhoto') ? (
                  <button
                    onClick={() => openMediaLightbox('profilePhoto', 'image')}
                    className="text-[13px] font-semibold text-[#00695C] underline underline-offset-2 decoration-[#00695C]/40 hover:text-[#004D40] hover:decoration-[#004D40] transition-colors"
                  >
                    View Photo
                  </button>
                ) : (
                  <span className="text-[13px] text-gray-400 font-medium italic">Not uploaded</span>
                )}
              </AnimatedCard>

              <AnimatedCard label="Agency Logo" value={getFileStatusLabel('agencyLogo')} icon={<Image className="w-4 h-4" />} delay={0.07}>
                {getFileStatusLabel('agencyLogo') ? (
                  <button
                    onClick={() => openMediaLightbox('agencyLogo', 'image')}
                    className="text-[13px] font-semibold text-[#00695C] underline underline-offset-2 decoration-[#00695C]/40 hover:text-[#004D40] hover:decoration-[#004D40] transition-colors"
                  >
                    View Logo
                  </button>
                ) : (
                  <span className="text-[13px] text-gray-400 font-medium italic">Not uploaded</span>
                )}
              </AnimatedCard>

              <AnimatedCard label="Aadhaar Card" value={getFileStatusLabel('aadhaarCard')} icon={<Shield className="w-4 h-4" />} delay={0.11}>
                {getFileStatusLabel('aadhaarCard') ? (
                  <button
                    onClick={() => openMediaLightbox('aadhaarCard', 'image')}
                    className="text-[13px] font-semibold text-[#00695C] underline underline-offset-2 decoration-[#00695C]/40 hover:text-[#004D40] hover:decoration-[#004D40] transition-colors"
                  >
                    View Document
                  </button>
                ) : (
                  <span className="text-[13px] text-gray-400 font-medium italic">Not uploaded</span>
                )}
              </AnimatedCard>

              <AnimatedCard label="PAN Card" value={getFileStatusLabel('panCard')} icon={<CreditCard className="w-4 h-4" />} delay={0.15}>
                {getFileStatusLabel('panCard') ? (
                  <button
                    onClick={() => openMediaLightbox('panCard', 'image')}
                    className="text-[13px] font-semibold text-[#00695C] underline underline-offset-2 decoration-[#00695C]/40 hover:text-[#004D40] hover:decoration-[#004D40] transition-colors"
                  >
                    View Document
                  </button>
                ) : (
                  <span className="text-[13px] text-gray-400 font-medium italic">Not uploaded</span>
                )}
              </AnimatedCard>

              <AnimatedCard label="RERA Certificate" value={getFileStatusLabel('reraCertificate')} icon={<BadgeCheck className="w-4 h-4" />} delay={0.19}>
                {getFileStatusLabel('reraCertificate') ? (
                  <button
                    onClick={() => openMediaLightbox('reraCertificate', 'image')}
                    className="text-[13px] font-semibold text-[#00695C] underline underline-offset-2 decoration-[#00695C]/40 hover:text-[#004D40] hover:decoration-[#004D40] transition-colors"
                  >
                    View Document
                  </button>
                ) : (
                  <span className="text-[13px] text-gray-400 font-medium italic">Not uploaded</span>
                )}
              </AnimatedCard>

              <AnimatedCard label="GST Certificate" value={getFileStatusLabel('gstCertificate')} icon={<FileText className="w-4 h-4" />} delay={0.23}>
                {getFileStatusLabel('gstCertificate') ? (
                  <button
                    onClick={() => openMediaLightbox('gstCertificate', 'image')}
                    className="text-[13px] font-semibold text-[#00695C] underline underline-offset-2 decoration-[#00695C]/40 hover:text-[#004D40] hover:decoration-[#004D40] transition-colors"
                  >
                    View Document
                  </button>
                ) : (
                  <span className="text-[13px] text-gray-400 font-medium italic">Not uploaded</span>
                )}
              </AnimatedCard>

              <AnimatedCard label="Business Registration" value={getFileStatusLabel('businessRegistrationCertificate')} icon={<FileCheck className="w-4 h-4" />} delay={0.27}>
                {getFileStatusLabel('businessRegistrationCertificate') ? (
                  <button
                    onClick={() => openMediaLightbox('businessRegistrationCertificate', 'image')}
                    className="text-[13px] font-semibold text-[#00695C] underline underline-offset-2 decoration-[#00695C]/40 hover:text-[#004D40] hover:decoration-[#004D40] transition-colors"
                  >
                    View Document
                  </button>
                ) : (
                  <span className="text-[13px] text-gray-400 font-medium italic">Not uploaded</span>
                )}
              </AnimatedCard>
            </div>
          </div>
        );
      }

      case 'identity': {
        const identityFields = [
          editForm.aadhaarNumber,
          editForm.panNumber,
          documents.aadhaarCard,
          documents.panCard,
        ];
        const filledCount = identityFields.filter(Boolean).length;

        return (
          <div className="w-full animate-slideUp">
            <SectionHeader
              title="Identity & Verification"
              subtitle="Identity verification documents"
              filled={filledCount}
              total={identityFields.length}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 w-full">
              <div className="space-y-3 w-full">
                <AnimatedCard label="Aadhaar Number" value={editForm.aadhaarNumber} icon={<Shield className="w-4 h-4" />} delay={0.05} />
                <AnimatedCard label="PAN Number" value={editForm.panNumber} icon={<CreditCard className="w-4 h-4" />} delay={0.12} />
              </div>
              <div className="space-y-3 w-full">
                <AnimatedCard label="Identity Documents" icon={<FileCheck className="w-4 h-4" />} delay={0.19}>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 p-2 rounded-lg border border-[#00695C]/15">
                      <Check className={`w-4 h-4 ${documents.aadhaarCard ? 'text-[#00695C]' : 'text-gray-300'}`} />
                      <span className={documents.aadhaarCard ? 'text-gray-700 font-medium' : 'text-gray-400'}>
                        Aadhaar Card: {documents.aadhaarCard ? '✓ Uploaded' : '✗ Not uploaded'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 p-2 rounded-lg border border-[#00695C]/15">
                      <Check className={`w-4 h-4 ${documents.panCard ? 'text-[#00695C]' : 'text-gray-300'}`} />
                      <span className={documents.panCard ? 'text-gray-700 font-medium' : 'text-gray-400'}>
                        PAN Card: {documents.panCard ? '✓ Uploaded' : '✗ Not uploaded'}
                      </span>
                    </div>
                  </div>
                </AnimatedCard>
              </div>
            </div>
          </div>
        );
      }

      case 'contact': {
        const contactFields = [
          editForm.officeAddress,
          editForm.city,
          editForm.district,
          editForm.state,
          editForm.pinCode,
          editForm.website,
          editForm.whatsappNumber,
        ];
        const filledCount = contactFields.filter(Boolean).length;

        return (
          <div className="w-full animate-slideUp">
            <SectionHeader
              title="Contact Information"
              subtitle="How to reach you and your office"
              filled={filledCount}
              total={contactFields.length}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 w-full">
              <div className="space-y-3 w-full">
                <AnimatedCard label="Office Address" value={editForm.officeAddress} icon={<MapPinHouse className="w-4 h-4" />} delay={0.05} />
                <AnimatedCard label="City" value={editForm.city} icon={<Building className="w-4 h-4" />} delay={0.12} />
                <AnimatedCard label="District" value={editForm.district} icon={<Landmark className="w-4 h-4" />} delay={0.19} />
                <AnimatedCard label="State" value={editForm.state} icon={<Globe className="w-4 h-4" />} delay={0.26} />
              </div>
              <div className="space-y-3 w-full">
                <AnimatedCard label="PIN Code" value={editForm.pinCode} icon={<MapPin className="w-4 h-4" />} delay={0.33} />
                <AnimatedCard label="Website" value={editForm.website} icon={<Globe2 className="w-4 h-4" />} delay={0.40} />
                <AnimatedCard label="WhatsApp Number" value={editForm.whatsappNumber} icon={<PhoneCall className="w-4 h-4" />} delay={0.47} />
              </div>
            </div>
          </div>
        );
      }

      case 'bank': {
        const bankFields = [
          editForm.accountHolderName,
          editForm.bankName,
          editForm.accountNumber,
          editForm.ifscCode,
          editForm.upiId,
        ];
        const filledCount = bankFields.filter(Boolean).length;

        return (
          <div className="w-full animate-slideUp">
            <SectionHeader
              title="Bank Details"
              subtitle="Financial information for transactions"
              filled={filledCount}
              total={bankFields.length}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 w-full">
              <div className="space-y-3 w-full">
                <AnimatedCard label="Account Holder Name" value={editForm.accountHolderName} icon={<User className="w-4 h-4" />} delay={0.05} />
                <AnimatedCard label="Bank Name" value={editForm.bankName} icon={<Building className="w-4 h-4" />} delay={0.12} />
                <AnimatedCard label="Account Number" value={editForm.accountNumber} icon={<CreditCard className="w-4 h-4" />} delay={0.19} />
              </div>
              <div className="space-y-3 w-full">
                <AnimatedCard label="IFSC Code" value={editForm.ifscCode} icon={<Banknote className="w-4 h-4" />} delay={0.26} />
                <AnimatedCard label="UPI ID" value={editForm.upiId} icon={<AtSign className="w-4 h-4" />} delay={0.33} />
              </div>
            </div>
          </div>
        );
      }

      case 'social': {
        const socialFields = [
          editForm.facebookPage,
          editForm.instagram,
          editForm.linkedin,
          editForm.youtubeChannel,
        ];
        const filledCount = socialFields.filter(Boolean).length;

        // Function to open social media link in new tab
        const openSocialLink = (url) => {
          if (url && url !== 'Not specified') {
            // Add https:// if not present
            let finalUrl = url;
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
              finalUrl = 'https://' + url;
            }
            window.open(finalUrl, '_blank', 'noopener,noreferrer');
          }
        };

        // Helper to get display name from URL
        const getDisplayName = (url, platform) => {
          if (!url || url === 'Not specified') return platform;
          try {
            const urlObj = new URL(url);
            const path = urlObj.pathname.replace(/^\//, '');
            if (path) return path.split('/')[0];
            return platform;
          } catch {
            return platform;
          }
        };

        return (
          <div className="w-full animate-slideUp">
            <SectionHeader
              title="Social Media & Website"
              subtitle="Connect with clients across platforms"
              filled={filledCount}
              total={socialFields.length}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 w-full">
              <div className="space-y-3 w-full">
                <AnimatedCard label="Facebook Page" icon={<Facebook className="w-4 h-4" />} delay={0.05}>
                  {editForm.facebookPage ? (
                    <button
                      onClick={() => openSocialLink(editForm.facebookPage)}
                      className="text-[13px] font-semibold text-[#00695C] underline underline-offset-2 decoration-[#00695C]/40 hover:text-[#004D40] hover:decoration-[#004D40] transition-colors flex items-center gap-2"
                    >
                      <Facebook className="w-4 h-4" />
                      {getDisplayName(editForm.facebookPage, 'Facebook')}
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  ) : (
                    <span className="text-[13px] text-gray-400 font-medium italic">Not specified</span>
                  )}
                </AnimatedCard>

                <AnimatedCard label="Instagram" icon={<Instagram className="w-4 h-4" />} delay={0.12}>
                  {editForm.instagram ? (
                    <button
                      onClick={() => openSocialLink(editForm.instagram)}
                      className="text-[13px] font-semibold text-[#00695C] underline underline-offset-2 decoration-[#00695C]/40 hover:text-[#004D40] hover:decoration-[#004D40] transition-colors flex items-center gap-2"
                    >
                      <Instagram className="w-4 h-4" />
                      {getDisplayName(editForm.instagram, 'Instagram')}
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  ) : (
                    <span className="text-[13px] text-gray-400 font-medium italic">Not specified</span>
                  )}
                </AnimatedCard>
              </div>
              <div className="space-y-3 w-full">
                <AnimatedCard label="LinkedIn" icon={<Linkedin className="w-4 h-4" />} delay={0.19}>
                  {editForm.linkedin ? (
                    <button
                      onClick={() => openSocialLink(editForm.linkedin)}
                      className="text-[13px] font-semibold text-[#00695C] underline underline-offset-2 decoration-[#00695C]/40 hover:text-[#004D40] hover:decoration-[#004D40] transition-colors flex items-center gap-2"
                    >
                      <Linkedin className="w-4 h-4" />
                      {getDisplayName(editForm.linkedin, 'LinkedIn')}
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  ) : (
                    <span className="text-[13px] text-gray-400 font-medium italic">Not specified</span>
                  )}
                </AnimatedCard>

                <AnimatedCard label="YouTube Channel" icon={<Youtube className="w-4 h-4" />} delay={0.26}>
                  {editForm.youtubeChannel ? (
                    <button
                      onClick={() => openSocialLink(editForm.youtubeChannel)}
                      className="text-[13px] font-semibold text-[#00695C] underline underline-offset-2 decoration-[#00695C]/40 hover:text-[#004D40] hover:decoration-[#004D40] transition-colors flex items-center gap-2"
                    >
                      <Youtube className="w-4 h-4" />
                      {getDisplayName(editForm.youtubeChannel, 'YouTube')}
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  ) : (
                    <span className="text-[13px] text-gray-400 font-medium italic">Not specified</span>
                  )}
                </AnimatedCard>
              </div>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  // ============ FORMAT HELPERS ============
  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return 'Not specified';
    if (dateStr.match(/^\d{2}-\d{2}-\d{4}$/)) return dateStr;
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = dateStr.split('-');
      return `${day}-${month}-${year}`;
    }
    return dateStr;
  };

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
    if (dateStr.match(/^\d{2}-\d{2}-\d{4}$/)) {
      const [day, month, year] = dateStr.split('-');
      return `${year}-${month}-${day}`;
    }
    return dateStr;
  };

  // ============ DELETE CONFIRM MODAL ============
  const DeletePropertyConfirmModal = ({ property, onConfirm, onCancel }) => {
    if (!property) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full animate-scaleIn p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-red-100 p-3 rounded-2xl">
              <AlertTriangle className="w-8 h-8 text-red-500 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Delete Property</h3>
          </div>
          <p className="text-gray-600 mb-2">
            Are you sure you want to delete <span className="font-bold text-[#00695C]">{property.name}</span>?
          </p>
          <p className="text-sm text-red-500 mb-6">This action cannot be undone.</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-6 py-3 rounded-2xl border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold hover:from-red-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ============ EDIT MODAL ============
  const EditProfileModal = () => {
    const [editStep, setEditStep] = useState(0);
    const [localForm, setLocalForm] = useState({ ...editForm });
    const [localDocs, setLocalDocs] = useState({ ...documents });

    const editSteps = [
      'Personal Details',
      'Business Information',
      'Media Upload',
      'Upload Documents',
      'Identity & Verification',
      'Contact Information',
      'Bank Details',
      'Social Media'
    ];

    const handleLocalChange = (e) => {
      const { name, value } = e.target;
      setLocalForm(prev => ({ ...prev, [name]: value }));
    };

    const handleLocalDateChange = (e) => {
      const value = e.target.value;
      if (value) {
        const [year, month, day] = value.split('-');
        setLocalForm(prev => ({ ...prev, dateOfBirth: `${day}-${month}-${year}` }));
      } else {
        setLocalForm(prev => ({ ...prev, dateOfBirth: '' }));
      }
    };

    const handleLocalFileUpload = (field, file) => {
      if (file) {
        setLocalDocs(prev => ({ ...prev, [field]: file }));
        showSuccessToast();
      }
    };

    const handleLocalMultipleFileUpload = (field, files) => {
      let fileArray = Array.from(files);
      if (field === 'propertyPhotos') {
        const existingCount = localDocs.propertyPhotos.length;
        const remainingSlots = Math.max(0, 3 - existingCount);
        if (fileArray.length > remainingSlots) {
          alert('Property Photos allows a maximum of 3 images.');
        }
        fileArray = fileArray.slice(0, remainingSlots);
      }
      if (fileArray.length > 0) {
        setLocalDocs(prev => ({
          ...prev,
          [field]: [...prev[field], ...fileArray]
        }));
        showSuccessToast();
      }
    };

    const handleLocalRemoveFile = (field, index) => {
      if (index !== undefined && index !== null) {
        setLocalDocs(prev => ({
          ...prev,
          [field]: prev[field].filter((_, i) => i !== index)
        }));
      } else {
        setLocalDocs(prev => ({
          ...prev,
          [field]: null
        }));
      }
      showSuccessToast();
    };

    const handleLocalSave = () => {
      setEditForm(localForm);
      setDocuments(localDocs);
      setShowEditModal(false);
      setIsLoading(false);
      showSuccessToast();
    };

    const renderStepContent = () => {
      switch (editStep) {
        case 0: // Personal Details
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={localForm.fullName}
                    onChange={handleLocalChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="mobileNumber"
                    value={localForm.mobileNumber}
                    onChange={handleLocalChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                    placeholder="Enter mobile number"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="emailAddress"
                    value={localForm.emailAddress}
                    onChange={handleLocalChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formatDateForInput(localForm.dateOfBirth)}
                    onChange={handleLocalDateChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={localForm.gender}
                    onChange={handleLocalChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Profile Photo <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => fileInputRefs.current['profilePhoto']?.click()}
                      className="px-4 py-2 bg-[#00695C] text-white rounded-xl text-xs font-bold hover:bg-[#005A4F] transition-all"
                    >
                      Upload
                    </button>
                    {localDocs.profilePhoto && (
                      <button
                        onClick={() => handleLocalRemoveFile('profilePhoto')}
                        className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition-all"
                      >
                        Remove
                      </button>
                    )}
                    <input
                      ref={el => fileInputRefs.current['profilePhoto'] = el}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleLocalFileUpload('profilePhoto', file);
                        e.target.value = '';
                      }}
                    />
                  </div>
                  {localDocs.profilePhoto && (
                    <p className="text-xs text-[#00695C] mt-1">✓ File uploaded</p>
                  )}
                </div>
              </div>
            </div>
          );

        case 1: // Business Information
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Agency Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="agencyName"
                    value={localForm.agencyName}
                    onChange={handleLocalChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                    placeholder="Enter agency name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">RERA Registration Number</label>
                  <input
                    type="text"
                    name="reraRegistrationNumber"
                    value={localForm.reraRegistrationNumber}
                    onChange={handleLocalChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                    placeholder="Enter RERA number"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">GST Number</label>
                  <input
                    type="text"
                    name="gstNumber"
                    value={localForm.gstNumber}
                    onChange={handleLocalChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                    placeholder="Enter GST number"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Years of Experience <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="yearsOfExperience"
                    value={localForm.yearsOfExperience}
                    onChange={handleLocalChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                    placeholder="e.g., 8"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Active Listings <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="activeListings"
                    value={localForm.activeListings}
                    onChange={handleLocalChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                    placeholder="e.g., 45"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Service Areas <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="serviceAreas"
                    value={localForm.serviceAreas}
                    onChange={handleLocalChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                    placeholder="e.g., Mumbai, Pune, Thane"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Office Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="officeAddress"
                    value={localForm.officeAddress}
                    onChange={handleLocalChange}
                    rows="2"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all resize-y"
                    placeholder="Enter complete office address"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Agency Logo</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => fileInputRefs.current['agencyLogo']?.click()}
                      className="px-4 py-2 bg-[#00695C] text-white rounded-xl text-xs font-bold hover:bg-[#005A4F] transition-all"
                    >
                      Upload
                    </button>
                    {localDocs.agencyLogo && (
                      <button
                        onClick={() => handleLocalRemoveFile('agencyLogo')}
                        className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition-all"
                      >
                        Remove
                      </button>
                    )}
                    <input
                      ref={el => fileInputRefs.current['agencyLogo'] = el}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleLocalFileUpload('agencyLogo', file);
                        e.target.value = '';
                      }}
                    />
                  </div>
                  {localDocs.agencyLogo && (
                    <p className="text-xs text-[#00695C] mt-1">✓ File uploaded</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Business Registration Certificate</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => fileInputRefs.current['businessRegistrationCertificate']?.click()}
                      className="px-4 py-2 bg-[#00695C] text-white rounded-xl text-xs font-bold hover:bg-[#005A4F] transition-all"
                    >
                      Upload
                    </button>
                    {localDocs.businessRegistrationCertificate && (
                      <button
                        onClick={() => handleLocalRemoveFile('businessRegistrationCertificate')}
                        className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition-all"
                      >
                        Remove
                      </button>
                    )}
                    <input
                      ref={el => fileInputRefs.current['businessRegistrationCertificate'] = el}
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleLocalFileUpload('businessRegistrationCertificate', file);
                        e.target.value = '';
                      }}
                    />
                  </div>
                  {localDocs.businessRegistrationCertificate && (
                    <p className="text-xs text-[#00695C] mt-1">✓ File uploaded</p>
                  )}
                </div>
              </div>
            </div>
          );

        case 2: // Media Upload
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Cover Image</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => fileInputRefs.current['coverImage']?.click()}
                      className="px-4 py-2 bg-[#00695C] text-white rounded-xl text-xs font-bold hover:bg-[#005A4F] transition-all"
                    >
                      Upload
                    </button>
                    {localDocs.coverImage && (
                      <button
                        onClick={() => handleLocalRemoveFile('coverImage')}
                        className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition-all"
                      >
                        Remove
                      </button>
                    )}
                    <input
                      ref={el => fileInputRefs.current['coverImage'] = el}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleLocalFileUpload('coverImage', file);
                        e.target.value = '';
                      }}
                    />
                  </div>
                  {localDocs.coverImage && (
                    <p className="text-xs text-[#00695C] mt-1">✓ File uploaded</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Property Photos (Max 3)</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => fileInputRefs.current['propertyPhotos']?.click()}
                      className="px-4 py-2 bg-[#00695C] text-white rounded-xl text-xs font-bold hover:bg-[#005A4F] transition-all"
                    >
                      Upload
                    </button>
                    {localDocs.propertyPhotos.length > 0 && (
                      <button
                        onClick={() => setLocalDocs(prev => ({ ...prev, propertyPhotos: [] }))}
                        className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition-all"
                      >
                        Remove All
                      </button>
                    )}
                    <input
                      ref={el => fileInputRefs.current['propertyPhotos'] = el}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) {
                          handleLocalMultipleFileUpload('propertyPhotos', files);
                        }
                        e.target.value = '';
                      }}
                    />
                  </div>
                  {localDocs.propertyPhotos.length > 0 && (
                    <p className="text-xs text-[#00695C] mt-1">✓ {localDocs.propertyPhotos.length} file(s) uploaded</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Property Video</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => fileInputRefs.current['propertyVideo']?.click()}
                      className="px-4 py-2 bg-[#00695C] text-white rounded-xl text-xs font-bold hover:bg-[#005A4F] transition-all"
                    >
                      Upload
                    </button>
                    {localDocs.propertyVideo && (
                      <button
                        onClick={() => handleLocalRemoveFile('propertyVideo')}
                        className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition-all"
                      >
                        Remove
                      </button>
                    )}
                    <input
                      ref={el => fileInputRefs.current['propertyVideo'] = el}
                      type="file"
                      className="hidden"
                      accept="video/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleLocalFileUpload('propertyVideo', file);
                        e.target.value = '';
                      }}
                    />
                  </div>
                  {localDocs.propertyVideo && (
                    <p className="text-xs text-[#00695C] mt-1">✓ File uploaded</p>
                  )}
                </div>
              </div>
            </div>
          );

        case 3: // Upload Documents
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Aadhaar Card <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => fileInputRefs.current['aadhaarCard']?.click()}
                      className="px-4 py-2 bg-[#00695C] text-white rounded-xl text-xs font-bold hover:bg-[#005A4F] transition-all"
                    >
                      Upload
                    </button>
                    {localDocs.aadhaarCard && (
                      <button
                        onClick={() => handleLocalRemoveFile('aadhaarCard')}
                        className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition-all"
                      >
                        Remove
                      </button>
                    )}
                    <input
                      ref={el => fileInputRefs.current['aadhaarCard'] = el}
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleLocalFileUpload('aadhaarCard', file);
                        e.target.value = '';
                      }}
                    />
                  </div>
                  {localDocs.aadhaarCard && (
                    <p className="text-xs text-[#00695C] mt-1">✓ File uploaded</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    PAN Card <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => fileInputRefs.current['panCard']?.click()}
                      className="px-4 py-2 bg-[#00695C] text-white rounded-xl text-xs font-bold hover:bg-[#005A4F] transition-all"
                    >
                      Upload
                    </button>
                    {localDocs.panCard && (
                      <button
                        onClick={() => handleLocalRemoveFile('panCard')}
                        className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition-all"
                      >
                        Remove
                      </button>
                    )}
                    <input
                      ref={el => fileInputRefs.current['panCard'] = el}
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleLocalFileUpload('panCard', file);
                        e.target.value = '';
                      }}
                    />
                  </div>
                  {localDocs.panCard && (
                    <p className="text-xs text-[#00695C] mt-1">✓ File uploaded</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">RERA Certificate</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => fileInputRefs.current['reraCertificate']?.click()}
                      className="px-4 py-2 bg-[#00695C] text-white rounded-xl text-xs font-bold hover:bg-[#005A4F] transition-all"
                    >
                      Upload
                    </button>
                    {localDocs.reraCertificate && (
                      <button
                        onClick={() => handleLocalRemoveFile('reraCertificate')}
                        className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition-all"
                      >
                        Remove
                      </button>
                    )}
                    <input
                      ref={el => fileInputRefs.current['reraCertificate'] = el}
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleLocalFileUpload('reraCertificate', file);
                        e.target.value = '';
                      }}
                    />
                  </div>
                  {localDocs.reraCertificate && (
                    <p className="text-xs text-[#00695C] mt-1">✓ File uploaded</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">GST Certificate</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => fileInputRefs.current['gstCertificate']?.click()}
                      className="px-4 py-2 bg-[#00695C] text-white rounded-xl text-xs font-bold hover:bg-[#005A4F] transition-all"
                    >
                      Upload
                    </button>
                    {localDocs.gstCertificate && (
                      <button
                        onClick={() => handleLocalRemoveFile('gstCertificate')}
                        className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition-all"
                      >
                        Remove
                      </button>
                    )}
                    <input
                      ref={el => fileInputRefs.current['gstCertificate'] = el}
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleLocalFileUpload('gstCertificate', file);
                        e.target.value = '';
                      }}
                    />
                  </div>
                  {localDocs.gstCertificate && (
                    <p className="text-xs text-[#00695C] mt-1">✓ File uploaded</p>
                  )}
                </div>
              </div>
            </div>
          );

        case 4: // Identity & Verification
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Aadhaar Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="aadhaarNumber"
                    value={localForm.aadhaarNumber}
                    onChange={handleLocalChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                    placeholder="Enter Aadhaar number"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    PAN Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="panNumber"
                    value={localForm.panNumber}
                    onChange={handleLocalChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                    placeholder="Enter PAN number"
                  />
                </div>
              </div>
            </div>
          );

        case 5: // Contact Information
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Office Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="officeAddress"
                    value={localForm.officeAddress}
                    onChange={handleLocalChange}
                    rows="2"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all resize-y"
                    placeholder="Enter complete office address"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={localForm.city}
                    onChange={handleLocalChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    District <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={localForm.district}
                    onChange={handleLocalChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                    placeholder="Enter district"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={localForm.state}
                    onChange={handleLocalChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                    placeholder="Enter state"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    PIN Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="pinCode"
                    value={localForm.pinCode}
                    onChange={handleLocalChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                    placeholder="Enter PIN code"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Website</label>
                  <input
                    type="text"
                    name="website"
                    value={localForm.website}
                    onChange={handleLocalChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                    placeholder="Enter website URL"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    WhatsApp Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="whatsappNumber"
                    value={localForm.whatsappNumber}
                    onChange={handleLocalChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                    placeholder="Enter WhatsApp number"
                  />
                </div>
              </div>
            </div>
          );

        case 6: // Bank Details
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Account Holder Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="accountHolderName"
                    value={localForm.accountHolderName}
                    onChange={handleLocalChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                    placeholder="Enter account holder name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Bank Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="bankName"
                    value={localForm.bankName}
                    onChange={handleLocalChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                    placeholder="Enter bank name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Account Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={localForm.accountNumber}
                    onChange={handleLocalChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                    placeholder="Enter account number"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    IFSC Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="ifscCode"
                    value={localForm.ifscCode}
                    onChange={handleLocalChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                    placeholder="Enter IFSC code"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">UPI ID</label>
                  <input
                    type="text"
                    name="upiId"
                    value={localForm.upiId}
                    onChange={handleLocalChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                    placeholder="Enter UPI ID"
                  />
                </div>
              </div>
            </div>
          );

        case 7: // Social Media
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Website</label>
                  <input
                    type="text"
                    name="website"
                    value={localForm.website}
                    onChange={handleLocalChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                    placeholder="Enter website URL"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Facebook Page</label>
                  <input
                    type="text"
                    name="facebookPage"
                    value={localForm.facebookPage}
                    onChange={handleLocalChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                    placeholder="Enter Facebook page URL"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Instagram</label>
                  <input
                    type="text"
                    name="instagram"
                    value={localForm.instagram}
                    onChange={handleLocalChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                    placeholder="Enter Instagram profile URL"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">LinkedIn</label>
                  <input
                    type="text"
                    name="linkedin"
                    value={localForm.linkedin}
                    onChange={handleLocalChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                    placeholder="Enter LinkedIn URL"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">YouTube Channel</label>
                  <input
                    type="text"
                    name="youtubeChannel"
                    value={localForm.youtubeChannel}
                    onChange={handleLocalChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                    placeholder="Enter YouTube channel URL"
                  />
                </div>
              </div>
            </div>
          );

        default:
          return null;
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn w-full">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[90%] sm:max-w-[95%] lg:max-w-4xl mx-4 overflow-hidden max-h-[90vh] flex flex-col animate-scaleIn">
          <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] px-6 py-4 flex items-center justify-between flex-shrink-0">
            <h2 className="text-white text-xl font-bold flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <Edit2 className="w-5 h-5" />
              </div>
              Edit Agent Profile
            </h2>
            <button 
              onClick={() => setShowEditModal(false)} 
              className="text-white/80 hover:text-white transition-all duration-300 hover:rotate-90 hover:scale-110"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex overflow-x-auto border-b border-gray-200 bg-gray-50 px-4 py-2 flex-shrink-0 gap-1">
            {editSteps.map((stepName, idx) => (
              <button
                key={idx}
                onClick={() => setEditStep(idx)}
                className={`px-3 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-all ${
                  editStep === idx
                    ? 'bg-[#00695C] text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                {idx + 1}. {stepName}
              </button>
            ))}
          </div>

          <div className="px-6 py-6 overflow-y-auto flex-1 bg-gray-50/50">
            {renderStepContent()}
          </div>

          <div className="px-6 py-4 bg-white border-t border-gray-200 flex justify-between items-center flex-shrink-0">
            <button
              onClick={() => setEditStep(prev => Math.max(0, prev - 1))}
              disabled={editStep === 0}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                editStep === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ← Previous
            </button>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-6 py-2.5 rounded-xl border-2 border-gray-300 text-gray-700 text-sm font-bold hover:bg-gray-100 transition-all duration-300"
              >
                Cancel
              </button>
              {editStep < editSteps.length - 1 ? (
                <button
                  onClick={() => setEditStep(prev => Math.min(editSteps.length - 1, prev + 1))}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white text-sm font-bold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={handleLocalSave}
                  disabled={isLoading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white text-sm font-bold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isLoading ? 'Saving...' : 'Save All Changes'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============ MAIN RENDER ============
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00695C]/5 via-teal-50/50 to-[#26A69A]/5 pt-20 pb-12 w-full relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#00695C]/10 to-[#26A69A]/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#26A69A]/10 to-[#00695C]/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-[#00695C]/5 to-[#26A69A]/5 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {/* ============================================================ */}
      {/* MODALS */}
      {/* ============================================================ */}

      {showProfilePhotoDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 p-8 animate-scaleIn">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-red-100 p-3 rounded-2xl">
                <AlertTriangle className="w-8 h-8 text-red-500 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Delete Profile Photo</h3>
            </div>
            <p className="text-gray-600 mb-6">Are you sure you want to delete your profile photo? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowProfilePhotoDeleteConfirm(false)}
                className="px-6 py-3 rounded-2xl border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105"
              >
                Cancel
              </button>
              <button
                onClick={confirmProfilePhotoDelete}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold hover:from-red-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 p-8 animate-scaleIn">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-red-100 p-3 rounded-2xl">
                <AlertTriangle className="w-8 h-8 text-red-500 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Confirm Delete</h3>
            </div>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this file? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteItem(null);
                }}
                className="px-6 py-3 rounded-2xl border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold hover:from-red-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && <EditProfileModal />}

      {/* Media Lightbox */}
      {showMediaLightbox && lightboxItems.length > 0 && (
        <MediaLightboxModal
          items={lightboxItems}
          index={lightboxIndex}
          onNavigate={setLightboxIndex}
          onDelete={handleDeleteLightboxItem}
          onClose={() => {
            setShowMediaLightbox(false);
            setLightboxItems([]);
            setLightboxIndex(0);
          }}
        />
      )}

      {/* Delete Property Confirmation Modal */}
      {showDeletePropertyConfirm && propertyToDelete && (
        <DeletePropertyConfirmModal
          property={propertyToDelete}
          onConfirm={confirmDeleteProperty}
          onCancel={() => {
            setShowDeletePropertyConfirm(false);
            setPropertyToDelete(null);
          }}
        />
      )}

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-55 right-4 z-50 bg-gradient-to-r from-[#00695C]/10 to-[#26A69A]/10 border-2 border-[#00695C]/30 rounded-2xl p-3 flex items-center gap-4 shadow-xl animate-slideDown max-w-md backdrop-blur-sm">
          <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-3 rounded-2xl animate-bounce-in">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-[#00695C] font-bold text-lg">Success!</p>
            <p className="text-[#00695C]/80 text-sm">Operation completed successfully!</p>
          </div>
          <button onClick={() => setShowSuccess(false)} className="text-[#00695C] hover:text-[#004D40] ml-auto hover:rotate-90 transition-transform duration-300 hover:scale-110">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* MAIN CONTENT */}
      {/* ============================================================ */}
      <div className="container mx-auto px-4 max-w-full w-full relative z-10 -mt-15">
        
        {/* HEADER */}
        <div className="relative overflow-hidden rounded-3xl mb-6 w-full animate-fade-up">
          <div className="absolute inset-0 bg-gradient-to-r from-[#00695C]/[0.04] via-[#26A69A]/[0.06] to-[#00695C]/[0.04] rounded-3xl" />
          <div className="absolute -top-16 -left-10 w-40 h-40 bg-gradient-to-br from-[#00695C]/10 to-[#26A69A]/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
          <div className="absolute -bottom-16 -right-10 w-40 h-40 bg-gradient-to-br from-[#26A69A]/10 to-[#00695C]/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" style={{ animationDelay: '1.2s' }} />
          <div className="absolute top-0 left-[-100%] w-full h-[1px] bg-gradient-to-r from-transparent via-[#26A69A]/50 to-transparent animate-shimmer pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full p-4 sm:p-5">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <button
                onClick={handleNavigateBack}
                className="relative p-3 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 hover:-rotate-12 group border border-[#00695C]/10 overflow-hidden"
                aria-label="Go back"
              >
                <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#00695C]/0 to-[#26A69A]/0 group-hover:from-[#00695C]/10 group-hover:to-[#26A69A]/10 transition-all duration-300" />
                <ArrowLeft className="relative w-5 h-5 text-gray-600 group-hover:text-[#00695C] group-hover:-translate-x-0.5 transition-all duration-300" />
              </button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent flex items-center gap-3 relative">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#00695C] to-[#26A69A] blur-lg opacity-40 animate-pulse-slow" />
                    <div className="absolute -inset-1 rounded-2xl border-2 border-[#26A69A]/30 animate-spin-slow" />
                    <div className="relative bg-gradient-to-r from-[#00695C] to-[#26A69A] p-2.5 rounded-2xl shadow-lg ">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <span className="relative">
                    Agent Profile
                    <span className="absolute -bottom-1 left-0 h-[3px] w-full bg-gradient-to-r from-[#00695C] to-[#26A69A] rounded-full scale-x-0 origin-left animate-underline-grow" />
                  </span>
                </h1>
                <p className="text-xs text-gray-500 mt-1.5 ml-1 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#26A69A] animate-pulse" />
                  Manage your agent profile and property listings
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowEditModal(true)}
              className="relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00695C] to-[#26A69A] hover:from-[#005A4F] hover:to-[#1B9E8E] text-white rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-2xl w-full sm:w-auto justify-center transform hover:scale-105 hover:-translate-y-1 group text-sm overflow-hidden"
            >
              <span className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent group-hover:left-full transition-all duration-700 ease-out" />
              <Edit2 className="relative w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
              <span className="relative">Edit Profile</span>
            </button>
          </div>
        </div>

        {/* PROFILE CARD */}
        <div className="relative bg-[#00695C]/5 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6 w-full hover:shadow-2xl transition-all duration-500 border border-[#00695C]/20 overflow-hidden group">
          <div className="absolute top-0 left-[-100%] w-full h-[2px] bg-gradient-to-r from-transparent via-[#26A69A] to-transparent group-hover:left-full transition-all duration-[900ms] ease-out" />

          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-[#00695C]/10 to-[#26A69A]/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-[#26A69A]/10 to-[#00695C]/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

          <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
            {Array.from({ length: 10 }).map((_, i) => (
              <span
                key={i}
                className="absolute bottom-[-40px] rounded-full border border-white/50 animate-bubble"
                style={{
                  left: `${Math.random() * 100}%`,
                  width: `${4 + Math.random() * 10}px`,
                  height: `${4 + Math.random() * 10}px`,
                  background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(38,166,154,0.35) 60%, rgba(0,105,92,0.15) 100%)',
                  animationDuration: `${6 + Math.random() * 6}s`,
                  animationDelay: `${Math.random() * 8}s`,
                }}
              />
            ))}
          </div>

          {/* Download Invoice */}
          <button
            onClick={handleDownloadInvoice}
            title="Download Invoice PDF"
            className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg hover:from-[#005A4F] hover:to-[#1B9E8E] hover:scale-105 transition-all duration-300"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download Invoice</span>
          </button>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 w-full relative z-10">
            <div className="relative flex-shrink-0">
              <div className="absolute -inset-1 rounded-[24px] animate-spin-slow"
                   style={{ background: 'conic-gradient(from 0deg, #00695C, #26A69A, #7fd6c9, #26A69A, #00695C)' }} />
              <div className="relative w-28 h-28 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#00695C]/20 to-[#26A69A]/20 flex items-center justify-center ring-4 ring-white/60">
                {documents.profilePhoto ? (
                  <img src={URL.createObjectURL(documents.profilePhoto)} alt={editForm.fullName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                    {editForm.fullName.charAt(0)}
                  </span>
                )}
              </div>

              {documents.profilePhoto && (
                <button onClick={handleProfilePhotoDelete}
                  className="absolute top-1 right-1 p-1.5 rounded-full bg-white shadow-lg hover:bg-red-500 text-gray-600 hover:text-white transition-all duration-300 hover:scale-110 hover:rotate-12 z-20"
                  aria-label="Delete profile photo" title="Delete Profile Photo">
                  <Trash2 className="w-3 h-3" />
                </button>
              )}

              <button onClick={() => profilePhotoInputRef.current?.click()}
                className="absolute bottom-1 right-1 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white p-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:rotate-12 z-20"
                aria-label="Upload profile photo" title="Upload Profile Photo">
                <Camera className="w-3.5 h-3.5" />
              </button>
              <input ref={profilePhotoInputRef} type="file" className="hidden" accept="image/*" onChange={handleProfilePhotoUpload} />
            </div>

            <div className="flex-1 text-center md:text-left w-full">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1.5">
                <h2 className="text-2xl font-bold text-gray-800">{editForm.fullName}</h2>
                <span className="relative overflow-hidden bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white px-3 py-0.5 rounded-full text-[10px] font-bold">
                  Licensed Agent
                  <span className="absolute inset-y-0 left-[-60%] w-[40%] bg-gradient-to-r from-transparent via-white/80 to-transparent animate-shimmer" />
                </span>
                {editForm.reraRegistrationNumber && (
                  <span className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-0.5 rounded-full text-[10px] font-bold">
                    RERA Registered
                    <span className="absolute inset-y-0 left-[-60%] w-[40%] bg-gradient-to-r from-transparent via-white/80 to-transparent animate-shimmer" style={{ animationDelay: '0.5s' }} />
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs text-gray-500 mb-3">
                <span className="flex items-center gap-1.5 bg-[#00695C]/5 px-3 py-1.5 rounded-xl shadow-sm border border-[#00695C]/10 hover:border-[#26A69A] hover:-translate-y-0.5 transition-all duration-300 animate-rise" style={{ animationDelay: '0.05s' }}>
                  <Store className="w-3.5 h-3.5 text-[#00695C]" /> {editForm.agencyName}
                </span>
                <span className="flex items-center gap-1.5 bg-[#00695C]/5 px-3 py-1.5 rounded-xl shadow-sm border border-[#00695C]/10 hover:border-[#26A69A] hover:-translate-y-0.5 transition-all duration-300 animate-rise" style={{ animationDelay: '0.15s' }}>
                  <Phone className="w-3.5 h-3.5 text-[#00695C]" /> {editForm.mobileNumber}
                </span>
                <span className="flex items-center gap-1.5 bg-[#00695C]/5 px-3 py-1.5 rounded-xl shadow-sm border border-[#00695C]/10 hover:border-[#26A69A] hover:-translate-y-0.5 transition-all duration-300 animate-rise" style={{ animationDelay: '0.25s' }}>
                  <Mail className="w-3.5 h-3.5 text-[#00695C]" /> {editForm.emailAddress}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="flex items-center gap-1.5 bg-gradient-to-r from-[#00695C]/10 to-[#26A69A]/10 text-[#00695C] px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-sm hover:scale-105 transition-transform duration-300 border border-[#00695C]/20 text-left animate-rise" style={{ animationDelay: '0.35s' }}>
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate max-w-[200px]">
                    {[editForm.officeAddress, editForm.city, editForm.state, editForm.pinCode].filter(Boolean).join(', ')}
                  </span>
                </span>
                <span className="flex items-center gap-1.5 bg-gradient-to-r from-[#00695C]/10 to-[#26A69A]/10 text-[#00695C] px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-sm hover:scale-105 transition-transform duration-300 border border-[#00695C]/20">
                  <AwardIcon className="w-3 h-3" /> {editForm.yearsOfExperience} Years Experience
                </span>
                <span className="flex items-center gap-1.5 bg-gradient-to-r from-[#00695C]/10 to-[#26A69A]/10 text-[#00695C] px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-sm hover:scale-105 transition-transform duration-300 border border-[#00695C]/20">
                  <Home className="w-3 h-3" /> {editForm.activeListings} Active Listings
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* TAB NAVIGATION - Updated with 8 tabs */}
        <div className="bg-gradient-to-br from-[#00695C]/[0.05] to-[#26A69A]/[0.05] backdrop-blur-sm rounded-2xl shadow-xl p-2 mb-6 border border-[#00695C]/20 w-full overflow-x-auto">
          <div className="flex gap-1.5 min-w-max">
            {sections.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-all duration-500 whitespace-nowrap relative group ${
                    isActive
                      ? 'text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-[#00695C]'
                  }`}
                  style={{
                    background: isActive 
                      ? `linear-gradient(135deg, #00695C, #26A69A)`
                      : 'transparent'
                  }}
                >
                  {isActive && (
                    <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#00695C] to-[#26A69A] shadow-lg animate-pulse-slow" />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <Icon className={`w-3.5 h-3.5 transition-all duration-300 ${isActive ? 'text-white' : 'group-hover:text-[#00695C]'}`} />
                    {tab.title}
                    {isActive && (
                      <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB CONTENT */}
        <div className="bg-gradient-to-br from-[#00695C]/[0.05] to-[#26A69A]/[0.05] backdrop-blur-sm rounded-2xl shadow-xl p-5 mb-6 border border-[#00695C]/20 w-full relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#00695C]/5 to-[#26A69A]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-[#26A69A]/5 to-[#00695C]/5 rounded-full blur-3xl" />
          <div className="relative z-10">
            {renderSectionContent()}
          </div>
        </div>

        {/* PROPERTIES SECTION */}
        <div className="bg-gradient-to-br from-[#00695C]/[0.05] to-[#26A69A]/[0.05] backdrop-blur-sm rounded-2xl shadow-xl p-5 mb-6 w-full border border-[#00695C]/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00695C]/5 to-[#26A69A]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-2 rounded-xl shadow-lg">
                <Home className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-800">My Listings</h2>
                <p className="text-[11px] text-gray-500">Properties listed by you</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
              <div className="relative flex-1 sm:flex-initial min-w-[120px]">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-1.5 pl-8 rounded-lg border-2 border-gray-200 focus:border-[#00695C] focus:ring-3 focus:ring-[#00695C]/20 outline-none transition-all duration-300 text-xs"
                />
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1.5 rounded-lg border-2 border-gray-200 focus:border-[#00695C] focus:ring-3 focus:ring-[#00695C]/20 outline-none transition-all duration-300 text-xs bg-white"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
              
              <div className="flex rounded-lg border-2 border-gray-200 overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? 'bg-[#00695C] text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                  aria-label="Grid view"
                >
                  <GridIcon className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 transition-all duration-300 ${
                    viewMode === 'list' 
                      ? 'bg-[#00695C] text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                  aria-label="List view"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {filteredProperties.length > 0 ? (
            <div>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {filteredProperties.map((property, index) => (
                    <div
                      key={property.id}
                      className="group relative bg-gradient-to-br from-white via-[#00695C]/5 to-[#26A69A]/10 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-500 border border-[#00695C]/10 hover:border-[#00695C]/25 overflow-hidden animate-fade-up hover:-translate-y-1.5"
                      style={{ animationDelay: `${index * 0.08}s` }}
                    >
                      <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <span
                            key={i}
                            className="absolute rounded-full bg-[#00695C]/5 animate-float-particle"
                            style={{
                              left: `${Math.random() * 100}%`,
                              top: `${Math.random() * 100}%`,
                              width: `${3 + Math.random() * 4}px`,
                              height: `${3 + Math.random() * 4}px`,
                              animationDuration: `${8 + Math.random() * 12}s`,
                              animationDelay: `${Math.random() * 10}s`,
                            }}
                          />
                        ))}
                      </div>

                      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00695C]/10 via-[#26A69A]/15 to-[#00695C]/10 rounded-xl opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 pointer-events-none" />
                      <div className="absolute top-0 left-[-100%] w-full h-[1px] bg-gradient-to-r from-transparent via-[#26A69A]/30 to-transparent group-hover:left-full transition-all duration-700 pointer-events-none" />
                      <div className="absolute bottom-0 right-[-100%] w-full h-[1px] bg-gradient-to-l from-transparent via-[#26A69A]/30 to-transparent group-hover:right-full transition-all duration-700 delay-200 pointer-events-none" />

                      <div className="relative h-28 overflow-hidden">
                        <img 
                          src={property.images?.[0] || 'https://via.placeholder.com/400x300/CCCCCC/666666?text=No+Image'} 
                          alt={property.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x300/CCCCCC/666666?text=No+Image';
                          }}
                        />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-300" />

                        <div className="absolute top-1.5 right-1.5">
                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold shadow-lg backdrop-blur-sm flex items-center gap-0.5 transition-all duration-300 hover:scale-105 ${
                            property.status === 'Active' ? 'bg-emerald-400/80 text-white' :
                            property.status === 'Pending' ? 'bg-amber-400/80 text-white' :
                            'bg-rose-400/80 text-white'
                          }`}>
                            <span className={`w-0.5 h-0.5 rounded-full animate-pulse ${property.status === 'Active' ? 'bg-white' : property.status === 'Pending' ? 'bg-white' : 'bg-white'}`} />
                            {property.status}
                          </span>
                        </div>

                        <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <p className="text-white font-bold text-xs drop-shadow-lg bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-lg border border-white/10">
                              {property.price}
                            </p>
                          </div>
                        </div>

                        {property.images && property.images.length > 1 && (
                          <div className="absolute bottom-1.5 right-1.5 bg-black/30 backdrop-blur-sm text-white text-[7px] px-1.5 py-0.5 rounded-full border border-white/10 flex items-center gap-0.5">
                            <Image className="w-2 h-2" />
                            {property.images.length}
                          </div>
                        )}
                      </div>

                      <div className="p-2.5 space-y-1">
                        <div className="group/title">
                          <h3 className="font-bold text-gray-800 text-[11px] group-hover:text-[#00695C] transition-colors duration-300 line-clamp-1 relative">
                            {property.name}
                            <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00695C]/40 to-[#26A69A]/40 group-hover/title:w-full transition-all duration-300" />
                          </h3>
                          <p className="text-[8px] text-gray-400 font-medium flex items-center gap-1 mt-0.5">
                            <span className="bg-gray-100 px-1.5 py-0.5 rounded-full">{property.id}</span>
                            <span className="w-0.5 h-0.5 rounded-full bg-gray-300" />
                            <span className="text-gray-400">{property.postedDate}</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-1 text-[10px] text-gray-600 group/location">
                          <div className="p-0.5 bg-[#00695C]/8 rounded-lg group-hover/location:rotate-12 transition-transform duration-300">
                            <MapPin className="w-2.5 h-2.5 text-[#00695C]/70" />
                          </div>
                          <span className="font-medium truncate text-[9px] group-hover/location:text-[#00695C] transition-colors duration-300">{property.location}</span>
                        </div>

                        <div className="flex flex-wrap gap-0.5">
                          {[
                            { icon: Building, label: property.type },
                            { icon: Layers, label: property.area },
                            { icon: Bed, label: property.bedrooms || 'N/A' }
                          ].map((item, idx) => (
                            <span 
                              key={idx}
                              className="flex items-center gap-0.5 bg-[#00695C]/5 px-1.5 py-0.5 rounded-lg text-[7px] font-medium text-[#00695C]/80 border border-[#00695C]/8 hover:border-[#00695C]/20 transition-all duration-300 hover:scale-105 hover:shadow-sm"
                            >
                              <item.icon className="w-2 h-2" />
                              {item.label}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-[#00695C]/8">
                          <span className="text-[7px] text-gray-400 font-medium flex items-center gap-0.5 bg-gray-50/80 px-1.5 py-0.5 rounded-lg">
                            <Calendar className="w-2 h-2 text-[#00695C]/60" />
                            {property.postedDate}
                          </span>
                          <div className="flex items-center gap-0.5">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleViewDetails(property);
                              }}
                              className="p-1 bg-gradient-to-r from-[#00695C]/80 to-[#26A69A]/80 text-white rounded-lg hover:shadow-[0_0_10px_rgba(0,105,92,0.3)] transition-all duration-300 hover:scale-110 hover:-rotate-6"
                              title="View"
                              type="button"
                            >
                              <ViewIcon className="w-2.5 h-2.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleEditProperty(property);
                              }}
                              className="p-1 bg-gradient-to-r from-blue-400/80 to-blue-500/80 text-white rounded-lg hover:shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all duration-300 hover:scale-110 hover:-rotate-6"
                              title="Edit"
                              type="button"
                            >
                              <Edit2 className="w-2.5 h-2.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDeleteProperty(property);
                              }}
                              className="p-1 bg-gradient-to-r from-red-400/80 to-red-500/80 text-white rounded-lg hover:shadow-[0_0_10px_rgba(239,68,68,0.3)] transition-all duration-300 hover:scale-110 hover:-rotate-6"
                              title="Delete"
                              type="button"
                            >
                              <Trash2 className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00695C]/0 via-[#26A69A]/30 to-[#00695C]/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left pointer-events-none" />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#00695C]/0 via-[#26A69A]/3 to-[#00695C]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px] text-xs">
                    <thead>
                      <tr className="border-b-2 border-gray-200 bg-gray-50">
                        <th className="text-left py-2 px-3 text-[10px] font-bold text-gray-700 uppercase tracking-wider">Property</th>
                        <th className="text-left py-2 px-3 text-[10px] font-bold text-gray-700 uppercase tracking-wider">Type</th>
                        <th className="text-left py-2 px-3 text-[10px] font-bold text-gray-700 uppercase tracking-wider">Status</th>
                        <th className="text-left py-2 px-3 text-[10px] font-bold text-gray-700 uppercase tracking-wider">Price</th>
                        <th className="text-left py-2 px-3 text-[10px] font-bold text-gray-700 uppercase tracking-wider">Area</th>
                        <th className="text-left py-2 px-3 text-[10px] font-bold text-gray-700 uppercase tracking-wider">Location</th>
                        <th className="text-right py-2 px-3 text-[10px] font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredProperties.map((property) => (
                        <tr 
                          key={property.id}
                          className="hover:bg-[#00695C]/3 transition-colors duration-200 group"
                        >
                          <td className="py-2 px-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                <img 
                                  src={property.images?.[0] || 'https://via.placeholder.com/100x100/CCCCCC/666666?text=No+Image'} 
                                  alt={property.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/100x100/CCCCCC/666666?text=No+Image';
                                  }}
                                />
                              </div>
                              <div>
                                <p className="font-bold text-xs text-gray-800 group-hover:text-[#00695C] transition-colors">
                                  {property.name}
                                </p>
                                <p className="text-[9px] text-gray-500">{property.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-2 px-3 text-xs text-gray-700">{property.type}</td>
                          <td className="py-2 px-3">
                            <span className={`px-1.5 py-0.5 rounded-lg text-[9px] font-bold ${
                              property.status === 'Active' ? 'bg-green-100 text-green-700' :
                              property.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {property.status}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-xs font-bold text-gray-800">{property.price}</td>
                          <td className="py-2 px-3 text-xs text-gray-700">{property.area}</td>
                          <td className="py-2 px-3 text-xs text-gray-700 truncate max-w-[120px]">{property.location}</td>
                          <td className="py-2 px-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleViewDetails(property)}
                                className="p-1 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-110"
                                title="View Details"
                              >
                                <ViewIcon className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleEditProperty(property)}
                                className="p-1 bg-blue-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-110"
                                title="Edit Property"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteProperty(property)}
                                className="p-1 bg-red-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-110"
                                title="Delete Property"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Home className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium text-sm">No properties found</p>
              <p className="text-xs text-gray-400">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'You haven\'t listed any properties yet'}
              </p>
              {(searchTerm || filterStatus !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('all');
                  }}
                  className="mt-2 px-3 py-1.5 bg-[#00695C] text-white rounded-lg text-xs font-bold hover:bg-[#005A4F] transition-all duration-300"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          <div className="mt-3 pt-3 border-t-2 border-gray-100 flex justify-between text-[10px] text-gray-500">
            <span>Showing {filteredProperties.length} of {properties.length} properties</span>
            <span>Total: {properties.length}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes floatDelayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
        }
        @keyframes pulseSlow {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.5; }
        }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        @keyframes bubbleRise {
          0%   { transform: translateY(0) translateX(0) scale(0.6); opacity: 0; }
          8%   { opacity: .55; }
          85%  { opacity: .35; }
          100% { transform: translateY(-380px) translateX(var(--drift, 18px)) scale(1); opacity: 0; }
        }
        @keyframes spinSlow { to { transform: rotate(360deg); } }
        @keyframes shimmerSweep { 0% { left: -60%; } 50%, 100% { left: 130%; } }
        @keyframes underlineGrow { 0% { transform: scaleX(0); } 60% { transform: scaleX(1); } 100% { transform: scaleX(1); } }
        @keyframes riseIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-150px) translateX(var(--drift, 20px)) scale(1.5); opacity: 0; }
        }
        @keyframes fadeInTag {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }

        .animate-slideDown { animation: slideDown 0.4s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.4s ease-out forwards; }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out forwards; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: floatDelayed 7s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulseSlow 4s ease-in-out infinite; }
        .animate-bounce-in { animation: bounceIn 0.5s ease-out forwards; }
        .animate-bubble { animation-name: bubbleRise; animation-timing-function: linear; animation-iteration-count: infinite; }
        .animate-spin-slow { animation: spinSlow 6s linear infinite; }
        .animate-shimmer { animation: shimmerSweep 3.2s ease-in-out infinite; }
        .animate-underline-grow { animation: underlineGrow 1.2s ease-out 0.6s forwards; }
        .animate-rise { opacity: 0; animation: riseIn 0.5s ease forwards; }
        .animate-fade-up { animation: fadeUp 0.5s ease-out forwards; opacity: 0; }
        .animate-float-particle { animation: floatParticle linear infinite; }
        .animate-fade-in { animation: fadeInTag 0.3s ease-out forwards; opacity: 0; }

        .shadow-3xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        .border-3 {
          border-width: 3px;
        }
        .focus:ring-3 {
          --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
          --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color);
          box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
        }
      `}</style>
    </div>
  );
};

export default AgentProfile;