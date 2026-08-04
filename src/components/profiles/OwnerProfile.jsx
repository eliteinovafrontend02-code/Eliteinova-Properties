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
  Share2, Bookmark, Flag, Bell, Settings, Power,
  Zap as ZapIcon, Rocket, Crown, Diamond,
  Search, Filter, Grid as GridIcon, List,
  Eye as ViewIcon, Bed, Bath, Trees, Wifi, Shield as ShieldIcon, 
  Dumbbell, Waves, ParkingCircle, Sprout, Leaf, ChevronLeft, ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Rent Options for Property Details & Pricing
const bedroomOptions = ["Studio", "1 BHK", "2 BHK", "3 BHK", "4+ BHK"];
const bathroomOptions = ["1", "2", "3", "4+"];
const furnishingOptions = ["Fully Furnished", "Semi Furnished", "Unfurnished"];
const parkingOptions = ["1 Car", "2 Cars", "3+ Cars"];
const propertyTypeOptions = ["Apartment", "Independent House", "Independent Villa", "Duplex Residential Unit", "Commercial", "Land"];
const statusOptions = ["Active", "Pending", "Inactive"];
const listingPurposeOptions = ["For Rent", "For Sale", "For Lease"];

const availableAmenities = [
  "Gated Community", "24/7 Security", "Power Backup", "CCTV Surveillance", 
  "24/7 Water Supply", "Wi-Fi Ready", "Children's Play Area", "Gym / Fitness Center", 
  "Balcony / Terrace", "Lift / Elevator", "Visitor Parking", "Nearby School / Hospital",
  "Swimming Pool", "Garden", "Smart Home", "Sea View", "Lake View", "City View"
];


const OwnerProfile = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('personal');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [showProfilePhotoDeleteConfirm, setShowProfilePhotoDeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showPropertyDetails, setShowPropertyDetails] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showEditPropertyModal, setShowEditPropertyModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [showDeletePropertyConfirm, setShowDeletePropertyConfirm] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [sharingProperty, setSharingProperty] = useState(null);
  const [editPropertyStep, setEditPropertyStep] = useState(0);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [coverPreview, setCoverPreview] = useState(null);
  const [floorPlanPreview, setFloorPlanPreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [customAmenitiesList, setCustomAmenitiesList] = useState([]);
  
  const fileInputRefs = useRef({});
  const profilePhotoInputRef = useRef(null);

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
    description: 'Luxury villa with garden, pool, and premium interiors. This stunning property features modern architecture with premium finishes throughout. The villa offers spacious living areas, a beautiful garden, and a swimming pool.',
    images: [
      "/villa1_1.png",
      "/villa1_2.png",
      "/villa1_3.png",
      "/villa1_4.png"
    ],
    features: ['4 BHK', 'Swimming Pool', 'Garden', 'Smart Home', 'Premium Interiors'],
    views: 245,
    inquiries: 12,
    bedrooms: '4 BHK',
    bathrooms: '4',
    furnishing: 'Fully Furnished',
    parking: '3+ Cars',
    propertyCategory: 'residential',
    listedBy: 'owner',
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
    listedBy: 'owner',
    listingPurpose: 'For Sale',
    expectedPrice: '4500000',
    maintenance: '2000',
    availableFrom: '2025-08-15',
    selectedAmenities: ['Gated Community', '24/7 Security', 'Parking'],
    propertyAddress: '123, Green Valley Apartments, Near City Center, Mumbai',
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
    listedBy: 'owner',
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
  {
    id: 'PROP-004',
    name: 'Lake View Paradise',
    type: 'Apartment',
    status: 'Active',
    price: '₹75,00,000',
    area: '1800 sq ft',
    location: 'Hyderabad, Telangana',
    postedDate: '01-07-2025',
    description: 'Stunning lake view apartment with premium amenities.',
    images: ['https://via.placeholder.com/400x300/2E86AB/ffffff?text=Lake+View'],
    features: ['3 BHK', 'Lake View', 'Gym', 'Swimming Pool'],
    views: 312,
    inquiries: 18,
    bedrooms: '3 BHK',
    bathrooms: '3',
    furnishing: 'Semi Furnished',
    parking: '2 Cars',
    propertyCategory: 'residential',
    listedBy: 'owner',
    listingPurpose: 'For Sale',
    expectedPrice: '7500000',
    maintenance: '3000',
    availableFrom: '2025-07-15',
    selectedAmenities: ['Swimming Pool', 'Gym / Fitness Center', 'Gated Community', 'Balcony / Terrace', 'Lake View'],
    propertyAddress: 'Lake View Paradise, Hyderabad',
    propertyCity: 'Hyderabad',
    builtUpArea: '1800',
    carpetArea: '1500',
    propertyTitle: 'Lake View Paradise',
    propertyType: 'Apartment'
  },
  {
    id: 'PROP-005',
    name: 'Downtown Studio',
    type: 'Apartment',
    status: 'Active',
    price: '₹30,00,000',
    area: '650 sq ft',
    location: 'Delhi, NCR',
    postedDate: '10-07-2025',
    description: 'Compact studio apartment in the heart of the city.',
    images: ['https://via.placeholder.com/400x300/2E86AB/ffffff?text=Downtown+Studio'],
    features: ['1 BHK', 'City View', 'Fully Furnished'],
    views: 98,
    inquiries: 4,
    bedrooms: 'Studio',
    bathrooms: '1',
    furnishing: 'Fully Furnished',
    parking: '1 Car',
    propertyCategory: 'residential',
    listedBy: 'owner',
    listingPurpose: 'For Rent',
    expectedPrice: '30000',
    maintenance: '1500',
    availableFrom: '2025-08-01',
    selectedAmenities: ['24/7 Security', 'Wi-Fi Ready', 'City View'],
    propertyAddress: 'Downtown, Delhi NCR',
    propertyCity: 'Delhi',
    builtUpArea: '650',
    carpetArea: '550',
    propertyTitle: 'Downtown Studio',
    propertyType: 'Apartment'
  },
  {
    id: 'PROP-006',
    name: 'Green Valley Apartment',
    type: 'Apartment',
    status: 'Active',
    price: '₹45,00,000',
    area: '1200 sq ft',
    location: 'Mumbai, Maharashtra',
    postedDate: '15-06-2025',
    description: 'Beautiful 2 BHK apartment with modern amenities and sea view.',
    images: ['https://via.placeholder.com/400x300/00695C/ffffff?text=Green+Valley'],
    features: ['2 BHK', 'Sea View', 'Modern Kitchen', 'Parking'],
    views: 245,
    inquiries: 12,
    bedrooms: '2 BHK',
    bathrooms: '2',
    furnishing: 'Fully Furnished',
    parking: '2 Cars',
    propertyCategory: 'residential',
    listedBy: 'owner',
    listingPurpose: 'For Sale',
    expectedPrice: '4500000',
    maintenance: '2000',
    availableFrom: '2025-07-01',
    selectedAmenities: ['Gated Community', '24/7 Security', 'Parking'],
    propertyAddress: '123, Green Valley Apartments, Mumbai',
    propertyCity: 'Mumbai',
    builtUpArea: '1200',
    carpetArea: '1000',
    propertyTitle: 'Green Valley Apartment',
    propertyType: 'Apartment'
  },
]);

  const [editForm, setEditForm] = useState({
    fullName: 'Rajesh Kumar',
    mobileNumber: '+91 98765 43210',
    emailAddress: 'rajesh.kumar@example.com',
    dateOfBirth: '15-06-1985',
    gender: 'Male',
    aadhaarNumber: '1234 5678 9012',
    panNumber: 'ABCDE1234F',
    addressLine1: '123, Green Valley Apartments',
    addressLine2: 'Near City Center',
    city: 'Mumbai',
    district: 'Mumbai City',
    state: 'Maharashtra',
    pinCode: '400001',
    accountHolderName: 'Rajesh Kumar',
    bankName: 'State Bank of India',
    accountNumber: '1234567890',
    ifscCode: 'SBIN0001234',
    upiId: 'rajesh.kumar@upi',
    preferredMethods: ['Phone Call', 'WhatsApp'],
    preferredTimes: ['Morning', 'Evening'],
    additionalNotes: 'Prefer contact during business hours',
  });

  const [documents, setDocuments] = useState({
    aadhaarCard: null,
    panCard: null,
    passportPhoto: null,
    coverImage: null,
    propertyPhotos: [],
    propertyVideo: null,
    floorPlan: null,
    saleDeed: null,
    floorPlanOptional: null,
    pattaChitta: null,
    encumbranceCertificate: null,
    propertyTaxReceipt: null,
    buildingApprovalPlan: null,
    completionCertificate: null,
    occupancyCertificate: null,
    rentalAgreement: null,
    otherDocuments: [],
  });

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
      
      // Update property images when uploading property-related images
      if (field === 'coverImage' || field === 'propertyPhotos') {
        // Find first property to update (or you can add logic to select specific property)
        const firstProperty = properties[0];
        if (firstProperty) {
          const updatedProperties = properties.map((prop, index) => {
            if (index === 0) {
              const updatedImages = [...prop.images];
              if (field === 'coverImage') {
                updatedImages[0] = URL.createObjectURL(file);
              }
              return { ...prop, images: updatedImages };
            }
            return prop;
          });
          setProperties(updatedProperties);
        }
      }
      
      showSuccessToast();
    }
  };

  const handleMultipleFileUpload = (field, files) => {
    const fileArray = Array.from(files);
    if (fileArray.length > 0) {
      setDocuments(prev => ({
        ...prev,
        [field]: [...prev[field], ...fileArray]
      }));
      
      // Update property images when uploading property photos
      if (field === 'propertyPhotos') {
        const firstProperty = properties[0];
        if (firstProperty) {
          const updatedProperties = properties.map((prop, index) => {
            if (index === 0) {
              const newImageUrls = fileArray.map(f => URL.createObjectURL(f));
              return { ...prop, images: [...prop.images, ...newImageUrls] };
            }
            return prop;
          });
          setProperties(updatedProperties);
        }
      }
      
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
      passportPhoto: null
    }));
    if (profilePhotoInputRef.current) {
      profilePhotoInputRef.current.value = '';
    }
    setShowProfilePhotoDeleteConfirm(false);
    showSuccessToast();
  };

  const togglePreference = (field, value) => {
    setEditForm(prev => {
      const currentValues = prev[field] || [];
      if (currentValues.includes(value)) {
        return {
          ...prev,
          [field]: currentValues.filter(item => item !== value)
        };
      } else {
        return {
          ...prev,
          [field]: [...currentValues, value]
        };
      }
    });
  };

  const handleProfilePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload('passportPhoto', file);
    }
  };

  const handleSave = () => {
    const requiredFields = ['fullName', 'mobileNumber', 'emailAddress', 'aadhaarNumber'];
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

  const getFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
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

  // ============ PROPERTY HANDLERS ============
  
  const handleViewDetails = (property) => {
    setSelectedProperty(property);
    setShowPropertyDetails(true);
  };

  const handleEditProperty = (property) => {
    setEditingProperty({ ...property });
    setEditPropertyStep(0);
    if (property.images && property.images.length > 0) {
      setImagePreviews(property.images.map(img => img));
    }
    if (property.coverImage) {
      setCoverPreview(property.coverImage);
    }
    if (property.selectedAmenities) {
      setCustomAmenitiesList(property.selectedAmenities.filter(a => !availableAmenities.includes(a)));
    }
    setShowEditPropertyModal(true);
  };

  const handlePropertyEditChange = (field, value) => {
    setEditingProperty(prev => ({ ...prev, [field]: value }));
  };

  const toggleAmenity = (amenity) => {
    const current = editingProperty?.selectedAmenities || [];
    if (current.includes(amenity)) {
      handlePropertyEditChange('selectedAmenities', current.filter(a => a !== amenity));
    } else {
      handlePropertyEditChange('selectedAmenities', [...current, amenity]);
    }
  };

  const addCustomAmenity = () => {
    if (editingProperty?.otherAmenities) {
      const newAmenity = editingProperty.otherAmenities.trim();
      if (newAmenity && !editingProperty.selectedAmenities.includes(newAmenity) && !customAmenitiesList.includes(newAmenity)) {
        setCustomAmenitiesList([...customAmenitiesList, newAmenity]);
        handlePropertyEditChange('selectedAmenities', [...editingProperty.selectedAmenities, newAmenity]);
        handlePropertyEditChange('otherAmenities', '');
      }
    }
  };

  const removeCustomAmenity = (amenity) => {
    setCustomAmenitiesList(customAmenitiesList.filter(a => a !== amenity));
    handlePropertyEditChange('selectedAmenities', editingProperty.selectedAmenities.filter(a => a !== amenity));
  };

  const handleSavePropertyEdit = () => {
    // Preserve images from documents if they exist
    const updatedProperty = { ...editingProperty };
    
    // If cover image exists in documents, add it to property images
    if (documents.coverImage) {
      const coverUrl = URL.createObjectURL(documents.coverImage);
      if (updatedProperty.images) {
        updatedProperty.images[0] = coverUrl;
      } else {
        updatedProperty.images = [coverUrl];
      }
    }
    
    // If property photos exist in documents, add them
    if (documents.propertyPhotos && documents.propertyPhotos.length > 0) {
      const photoUrls = documents.propertyPhotos.map(f => URL.createObjectURL(f));
      updatedProperty.images = [...(updatedProperty.images || []), ...photoUrls];
    }
    
    setProperties(prev => 
      prev.map(p => p.id === updatedProperty.id ? updatedProperty : p)
    );
    
    setShowEditPropertyModal(false);
    setEditingProperty(null);
    setEditPropertyStep(0);
    setImagePreviews([]);
    setCoverPreview(null);
    setFloorPlanPreview(null);
    setVideoPreview(null);
    setCustomAmenitiesList([]);
    showSuccessToast();
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

  const handleShareProperty = (property) => {
    setSharingProperty(property);
    setShowShareModal(true);
  };

  const handleCopyLink = () => {
    const link = `https://property.com/listings/${sharingProperty.id}`;
    navigator.clipboard.writeText(link).then(() => {
      showSuccessToast();
      setShowShareModal(false);
      setSharingProperty(null);
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [...editingProperty.images, ...files.map(f => URL.createObjectURL(f))];
    handlePropertyEditChange('images', newImages);
    setImagePreviews(newImages);
  };

  const removeImage = (index) => {
    const newImages = editingProperty.images.filter((_, i) => i !== index);
    handlePropertyEditChange('images', newImages);
    setImagePreviews(newImages);
  };

  const handleCoverImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setCoverPreview(preview);
      handlePropertyEditChange('coverImage', file);
    }
  };

  const removeCoverImage = () => {
    setCoverPreview(null);
    handlePropertyEditChange('coverImage', null);
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setVideoPreview(preview);
      handlePropertyEditChange('propertyVideo', file);
    }
  };

  const removeVideo = () => {
    setVideoPreview(null);
    handlePropertyEditChange('propertyVideo', null);
  };

  const handleFloorPlanUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setFloorPlanPreview(preview);
      handlePropertyEditChange('floorPlan', file);
    }
  };

  const removeFloorPlan = () => {
    setFloorPlanPreview(null);
    handlePropertyEditChange('floorPlan', null);
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
    { id: 'address', title: 'Address Details', icon: MapPin },
    { id: 'property', title: 'Property Images', icon: Image },
    { id: 'legal', title: 'Legal Documents', icon: FileText },
    { id: 'bank', title: 'Bank Details', icon: Banknote },
    { id: 'communication', title: 'Communication', icon: MessageCircle },
  ];

  // ============ COMPONENTS ============

  const InfoCard = ({ label, value, icon, children }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
      <div 
        className="group relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-2xl transition-all duration-500 w-full border border-[#00695C]/10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#00695C]/5 to-[#26A69A]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative p-4">
          <div className="flex items-start space-x-3">
            <div className={`p-3 rounded-2xl bg-gradient-to-br from-[#00695C] to-[#26A69A] shadow-lg transform group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
              <div className="text-white">
                {icon}
              </div>
            </div>
            <div className="flex-1 min-w-0 w-full">
              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">
                {label}
              </label>
              {children ? (
                children
              ) : (
                <div className="p-3 text-sm text-gray-800 bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 rounded-xl border border-[#00695C]/20 font-medium break-all group-hover:border-[#00695C]/40 transition-all duration-300">
                  {value || 'Not specified'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const FileCard = ({ label, field, icon, description }) => {
    const files = documents[field];
    const hasFiles = Array.isArray(files) ? files.length > 0 : files !== null;
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div 
        className="relative group overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-2xl transition-all duration-500 w-full border border-[#00695C]/10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#00695C]/5 to-[#26A69A]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative p-5 text-center">
          <div className="flex flex-col items-center">
            <div className={`p-4 rounded-2xl bg-gradient-to-br from-[#00695C] to-[#26A69A] shadow-lg transform group-hover:scale-110 transition-all duration-300 mb-3`}>
              <div className="text-white">
                {icon || <FileText className="w-8 h-8" />}
              </div>
            </div>
            <span className="text-sm font-bold text-gray-700">{label}</span>
            {description && <span className="text-xs text-gray-400 mt-1">{description}</span>}
          </div>
          {hasFiles ? (
            <div className="mt-3 space-y-2 animate-fadeIn">
              {Array.isArray(files) ? (
                files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 rounded-xl p-3 shadow-sm border border-[#00695C]/20 group-hover:border-[#00695C]/40 transition-all duration-300">
                    <span className="text-xs truncate flex-1 font-medium text-gray-700">
                      {getFileIcon(file.name)} {file.name}
                      <span className="text-gray-400 text-xs ml-2">({getFileSize(file.size)})</span>
                    </span>
                    <span className="text-xs text-[#00695C] font-semibold bg-[#00695C]/10 px-3 py-1 rounded-full">✓ Uploaded</span>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-between bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 rounded-xl p-3 shadow-sm border border-[#00695C]/20">
                  <span className="text-xs truncate flex-1 font-medium text-gray-700">
                    {getFileIcon(files.name)} {files.name}
                    <span className="text-gray-400 text-xs ml-2">({getFileSize(files.size)})</span>
                  </span>
                  <span className="text-xs text-[#00695C] font-semibold bg-[#00695C]/10 px-3 py-1 rounded-full">✓ Uploaded</span>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-3">
              <span className="inline-block bg-gray-100 px-5 py-2.5 rounded-xl text-sm text-gray-400 font-medium">
                No file uploaded
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ============ MODALS ============

  const ShareModal = ({ property, onClose }) => {
    if (!property) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md animate-scaleIn">
          <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] px-6 py-4 flex items-center justify-between rounded-t-3xl">
            <div className="flex items-center gap-3">
              <Share2 className="w-5 h-5 text-white" />
              <h2 className="text-white text-lg font-bold">Share Property</h2>
            </div>
            <button 
              onClick={onClose}
              className="text-white/80 hover:text-white transition-all duration-300 hover:rotate-90 hover:scale-110"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-sm text-gray-600">
              Share <span className="font-bold text-[#00695C]">{property.name}</span> with others
            </p>
            <div className="bg-gray-50 p-3 rounded-2xl flex items-center justify-between border border-gray-200">
              <span className="text-xs text-gray-500 truncate flex-1">
                https://property.com/listings/{property.id}
              </span>
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 bg-[#00695C] text-white rounded-xl text-sm font-bold hover:bg-[#005A4F] transition-all duration-300 hover:scale-105"
              >
                Copy Link
              </button>
            </div>
            <div className="flex gap-3">
              {['Facebook', 'Twitter', 'WhatsApp', 'Email'].map((platform) => (
                <button
                  key={platform}
                  className="flex-1 py-2 bg-gray-100 rounded-xl text-sm font-bold text-gray-600 hover:bg-[#00695C] hover:text-white transition-all duration-300 hover:scale-105"
                  onClick={() => {
                    alert(`Share on ${platform} coming soon!`);
                    setShowShareModal(false);
                    setSharingProperty(null);
                  }}
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

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

// ============ ENHANCED EDIT PROPERTY MODAL - FULLY FIXED NO RE-RENDER ============
  
  const EditPropertyModal = ({ property, onSave, onCancel }) => {
    if (!property) return null;

    const editSteps = ['Property Details', 'Pricing & Amenities'];

    // Complete local state - no parent sync needed
    const [localStep, setLocalStep] = useState(0);
    const [localProperty, setLocalProperty] = useState({ ...property });
    // Local custom amenities list - completely independent
    const [localCustomAmenities, setLocalCustomAmenities] = useState([]);

    // Update local property when parent property changes (only on initial open)
    useEffect(() => {
      setLocalProperty({ ...property });
      // Initialize custom amenities from property
      if (property.selectedAmenities) {
        const custom = property.selectedAmenities.filter(a => !availableAmenities.includes(a));
        setLocalCustomAmenities(custom);
      }
    }, [property]);

    const handleLocalChange = (field, value) => {
      setLocalProperty(prev => ({ ...prev, [field]: value }));
    };

    const handleLocalAmenityToggle = (amenity) => {
      const current = localProperty.selectedAmenities || [];
      if (current.includes(amenity)) {
        setLocalProperty(prev => ({
          ...prev,
          selectedAmenities: prev.selectedAmenities.filter(a => a !== amenity)
        }));
      } else {
        setLocalProperty(prev => ({
          ...prev,
          selectedAmenities: [...(prev.selectedAmenities || []), amenity]
        }));
      }
    };

    const handleLocalAddCustomAmenity = () => {
      if (localProperty.otherAmenities) {
        const newAmenity = localProperty.otherAmenities.trim();
        if (newAmenity && !localProperty.selectedAmenities.includes(newAmenity) && !localCustomAmenities.includes(newAmenity)) {
          setLocalCustomAmenities(prev => [...prev, newAmenity]);
          setLocalProperty(prev => ({
            ...prev,
            selectedAmenities: [...(prev.selectedAmenities || []), newAmenity],
            otherAmenities: ''
          }));
        }
      }
    };

    const handleLocalRemoveCustomAmenity = (amenity) => {
      setLocalCustomAmenities(prev => prev.filter(a => a !== amenity));
      setLocalProperty(prev => ({
        ...prev,
        selectedAmenities: prev.selectedAmenities.filter(a => a !== amenity)
      }));
    };

    const handleLocalNext = () => {
      setLocalStep(prev => prev + 1);
    };

    const handleLocalBack = () => {
      setLocalStep(prev => prev - 1);
    };

    const handleLocalSave = () => {
      // Update parent property with local changes
      onSave(localProperty);
      handleSavePropertyEdit();
    };

    const handleLocalCancel = () => {
      onCancel();
      setLocalStep(0);
      setLocalCustomAmenities([]);
    };

    // Reset step when modal opens
    useEffect(() => {
      if (showEditPropertyModal) {
        setLocalStep(0);
        setLocalCustomAmenities([]);
      }
    }, [showEditPropertyModal]);

    const renderStepContent = () => {
      if (localStep === 0) {
        return (
          <div className="space-y-3">
            {/* Property Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-0.5">Property Title</label>
                <input
                  type="text"
                  value={localProperty.propertyTitle || localProperty.name || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setLocalProperty(prev => ({ ...prev, propertyTitle: val, name: val }));
                  }}
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                  placeholder="e.g. Green Valley 3BHK Apartment"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-0.5">Property ID</label>
                <input
                  type="text"
                  value={localProperty.id}
                  disabled
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-0.5">Property Type</label>
                <select
                  value={localProperty.propertyType || localProperty.type || 'Apartment'}
                  onChange={(e) => {
                    const val = e.target.value;
                    setLocalProperty(prev => ({ ...prev, propertyType: val, type: val }));
                  }}
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                >
                  {propertyTypeOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-0.5">Status</label>
                <select
                  value={localProperty.status}
                  onChange={(e) => setLocalProperty(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                >
                  {statusOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Address Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-0.5">Property Address</label>
                <textarea
                  value={localProperty.propertyAddress || localProperty.location || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setLocalProperty(prev => ({ ...prev, propertyAddress: val, location: val }));
                  }}
                  rows="2"
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all resize-y"
                  placeholder="Enter complete property address"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-0.5">City</label>
                <input
                  type="text"
                  value={localProperty.propertyCity || ''}
                  onChange={(e) => setLocalProperty(prev => ({ ...prev, propertyCity: e.target.value }))}
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                  placeholder="Enter city name"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-0.5">Area Details</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={localProperty.builtUpArea || ''}
                    onChange={(e) => setLocalProperty(prev => ({ ...prev, builtUpArea: e.target.value }))}
                    className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                    placeholder="Built-up (sq ft)"
                  />
                  <input
                    type="number"
                    value={localProperty.carpetArea || ''}
                    onChange={(e) => setLocalProperty(prev => ({ ...prev, carpetArea: e.target.value }))}
                    className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                    placeholder="Carpet (sq ft)"
                  />
                </div>
              </div>
            </div>

            {/* Room Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-0.5">Bedrooms</label>
                <select
                  value={localProperty.bedrooms || '2 BHK'}
                  onChange={(e) => setLocalProperty(prev => ({ ...prev, bedrooms: e.target.value }))}
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                >
                  {bedroomOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-0.5">Bathrooms</label>
                <select
                  value={localProperty.bathrooms || '2'}
                  onChange={(e) => setLocalProperty(prev => ({ ...prev, bathrooms: e.target.value }))}
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                >
                  {bathroomOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-0.5">Furnishing Status</label>
                <select
                  value={localProperty.furnishing || 'Fully Furnished'}
                  onChange={(e) => setLocalProperty(prev => ({ ...prev, furnishing: e.target.value }))}
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                >
                  {furnishingOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Parking & Additional Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-0.5">Parking</label>
                <select
                  value={localProperty.parking || '2 Cars'}
                  onChange={(e) => setLocalProperty(prev => ({ ...prev, parking: e.target.value }))}
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                >
                  {parkingOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-0.5">Listing Purpose</label>
                <select
                  value={localProperty.listingPurpose || 'For Sale'}
                  onChange={(e) => setLocalProperty(prev => ({ ...prev, listingPurpose: e.target.value }))}
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                >
                  {listingPurposeOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-0.5">Description</label>
              <textarea
                value={localProperty.description || ''}
                onChange={(e) => setLocalProperty(prev => ({ ...prev, description: e.target.value }))}
                rows="3"
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all resize-y"
                placeholder="Enter property description..."
              />
            </div>
          </div>
        );
      } else {
        return (
          <div className="space-y-3">
            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-0.5">Expected Price</label>
                <input
                  type="text"
                  value={localProperty.expectedPrice || localProperty.price?.replace(/[^0-9]/g, '') || ''}
                  onChange={(e) => setLocalProperty(prev => ({ ...prev, expectedPrice: e.target.value }))}
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                  placeholder="e.g. 4500000"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-0.5">Maintenance (₹/month)</label>
                <input
                  type="text"
                  value={localProperty.maintenance || ''}
                  onChange={(e) => setLocalProperty(prev => ({ ...prev, maintenance: e.target.value }))}
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                  placeholder="e.g. 2000"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-0.5">Available From</label>
                <input
                  type="date"
                  value={localProperty.availableFrom || ''}
                  onChange={(e) => setLocalProperty(prev => ({ ...prev, availableFrom: e.target.value }))}
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-0.5">Price Display</label>
                <input
                  type="text"
                  value={localProperty.price || ''}
                  onChange={(e) => setLocalProperty(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                  placeholder="e.g. ₹45,00,000"
                />
              </div>
            </div>

            {/* Area */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-0.5">Area Display</label>
              <input
                type="text"
                value={localProperty.area || ''}
                onChange={(e) => setLocalProperty(prev => ({ ...prev, area: e.target.value }))}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                placeholder="e.g. 1200 sq ft"
              />
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Select Amenities</label>
              <div className="flex flex-wrap gap-1.5">
                {availableAmenities.map(a => (
                  <span
                    key={a}
                    onClick={() => handleLocalAmenityToggle(a)}
                    className={`px-2.5 py-1 text-xs rounded-full border cursor-pointer transition-all ${
                      localProperty.selectedAmenities?.includes(a)
                        ? 'bg-[#00695C] text-white border-[#00695C]'
                        : 'bg-teal-50 text-[#00695C] border-teal-200 hover:bg-teal-100'
                    }`}
                  >
                    {a}
                  </span>
                ))}
                {localCustomAmenities.map(a => (
                  <span key={a} className="px-2.5 py-1 text-xs bg-[#00695C] text-white rounded-full border border-[#00695C] flex items-center gap-1">
                    {a}
                    <X className="w-3 h-3 cursor-pointer hover:text-red-200" onClick={() => handleLocalRemoveCustomAmenity(a)} />
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={localProperty.otherAmenities || ''}
                onChange={(e) => setLocalProperty(prev => ({ ...prev, otherAmenities: e.target.value }))}
                className="flex-1 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                placeholder="e.g. Clubhouse, CCTV, Solar Panel..."
                onKeyPress={(e) => e.key === 'Enter' && handleLocalAddCustomAmenity()}
              />
              <button
                onClick={handleLocalAddCustomAmenity}
                className="px-4 py-2 text-sm bg-[#00695C] text-white rounded-xl hover:bg-[#005A4F] transition-colors"
              >
                Add
              </button>
            </div>

            {/* Features (for backward compatibility) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-0.5">Features (comma separated)</label>
              <input
                type="text"
                value={localProperty.features?.join(', ') || ''}
                onChange={(e) => {
                  const features = e.target.value.split(',').map(f => f.trim());
                  setLocalProperty(prev => ({ ...prev, features }));
                }}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                placeholder="2 BHK, Sea View, Parking, etc."
              />
            </div>
          </div>
        );
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-scaleIn">
          <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] px-6 py-4 flex items-center justify-between rounded-t-3xl flex-shrink-0">
            <div className="flex items-center gap-3">
              <Edit2 className="w-5 h-5 text-white" />
              <h2 className="text-white text-xl font-bold">Edit Property</h2>
            </div>
            <button 
              onClick={handleLocalCancel}
              className="text-white/80 hover:text-white transition-all duration-300 hover:rotate-90 hover:scale-110"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Step Navigation */}
          <div className="flex border-b border-gray-100 flex-shrink-0 px-4 pt-2">
            {editSteps.map((stepName, idx) => (
              <button
                key={idx}
                onClick={() => setLocalStep(idx)}
                className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all ${
                  localStep === idx
                    ? 'border-[#00695C] text-[#00695C]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {stepName}
              </button>
            ))}
          </div>

          <div className="p-6 overflow-y-auto flex-1">
            {renderStepContent()}
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-3xl flex justify-between items-center flex-shrink-0">
            <div className="flex gap-2">
              {localStep > 0 && (
                <button
                  onClick={handleLocalBack}
                  className="px-4 py-2 text-sm font-bold text-[#00695C] bg-teal-50 rounded-xl hover:bg-teal-100 transition-all"
                >
                  ← Back
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleLocalCancel}
                className="px-6 py-2.5 rounded-xl border-2 border-gray-300 text-gray-700 text-sm font-bold hover:bg-gray-100 transition-all duration-300"
              >
                Cancel
              </button>
              {localStep < editSteps.length - 1 ? (
                <button
                  onClick={handleLocalNext}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white text-sm font-bold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={handleLocalSave}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white text-sm font-bold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const PropertyDetailsModal = ({ property, onClose }) => {
  if (!property) return null;

  // State for current image index
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = property.images || ['https://via.placeholder.com/400x300/CCCCCC/666666?text=No+Image'];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-scaleIn">
        {/* Header - Increased Property Name Size */}
        <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] px-4 py-3 flex items-center justify-between rounded-t-2xl flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="bg-white/20 p-1.5 rounded-lg">
              <Home className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-white text-lg sm:text-xl font-bold truncate">
              {property.name}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white transition-all duration-300 hover:rotate-90 hover:scale-110 flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {/* Main Image with Navigation */}
          <div className="relative rounded-xl overflow-hidden bg-gray-100 h-56 sm:h-64">
            <img 
              src={images[currentImageIndex]} 
              alt={property.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x300/CCCCCC/666666?text=No+Image';
              }}
            />
            
            {/* Image Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-300"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-300"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                {/* Image Counter */}
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2.5 py-0.5 rounded-full">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}

            {/* Status Badge */}
            <div className="absolute top-2 right-2">
              <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold shadow-lg ${
                property.status === 'Active' ? 'bg-green-500 text-white' :
                property.status === 'Pending' ? 'bg-yellow-500 text-white' :
                'bg-red-500 text-white'
              }`}>
                {property.status}
              </span>
            </div>
          </div>

          {/* Thumbnail Gallery - Show all images */}
          {images.length > 1 && (
            <div className="flex gap-1.5 overflow-x-auto pb-1.5">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    currentImageIndex === idx ? 'border-[#00695C] shadow-md' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100x100/CCCCCC/666666?text=No+Image';
                    }}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Property Info Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <div className="p-1.5 bg-[#00695C]/10 rounded-lg">
                <Building className="w-3.5 h-3.5 text-[#00695C]" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Property ID</p>
                <p className="text-xs font-bold text-gray-800">{property.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <div className="p-1.5 bg-[#00695C]/10 rounded-lg">
                <CreditCard className="w-3.5 h-3.5 text-[#00695C]" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Price</p>
                <p className="text-xs font-bold text-gray-800">{property.price}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <div className="p-1.5 bg-[#00695C]/10 rounded-lg">
                <Bed className="w-3.5 h-3.5 text-[#00695C]" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Bedrooms</p>
                <p className="text-xs font-bold text-gray-800">{property.bedrooms || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <div className="p-1.5 bg-[#00695C]/10 rounded-lg">
                <Bath className="w-3.5 h-3.5 text-[#00695C]" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Bathrooms</p>
                <p className="text-xs font-bold text-gray-800">{property.bathrooms || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <div className="p-1.5 bg-[#00695C]/10 rounded-lg">
                <MapPin className="w-3.5 h-3.5 text-[#00695C]" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Location</p>
                <p className="text-xs font-bold text-gray-800 truncate">{property.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <div className="p-1.5 bg-[#00695C]/10 rounded-lg">
                <Calendar className="w-3.5 h-3.5 text-[#00695C]" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Posted</p>
                <p className="text-xs font-bold text-gray-800">{property.postedDate}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {property.description && (
            <div className="bg-gray-50 rounded-lg p-3">
              <h3 className="text-[11px] font-bold text-gray-700 mb-1">Description</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{property.description}</p>
            </div>
          )}

          {/* Features */}
          {property.features && property.features.length > 0 && (
            <div>
              <h3 className="text-[11px] font-bold text-gray-700 mb-1.5">Features</h3>
              <div className="flex flex-wrap gap-1.5">
                {property.features.map((feature, index) => (
                  <span key={index} className="px-2.5 py-1 bg-[#00695C]/10 text-[#00695C] rounded-lg text-[10px] font-bold">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Amenities */}
          {property.selectedAmenities && property.selectedAmenities.length > 0 && (
            <div>
              <h3 className="text-[11px] font-bold text-gray-700 mb-1.5">Amenities</h3>
              <div className="flex flex-wrap gap-1.5">
                {property.selectedAmenities.map((amenity, index) => (
                  <span key={index} className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ALL PROPERTY IMAGES GALLERY AT BOTTOM */}
          {images.length > 0 && (
            <div>
              <h3 className="text-[11px] font-bold text-gray-700 mb-2">All Property Images</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {images.map((img, idx) => (
                  <div 
                    key={idx} 
                    className={`relative rounded-lg overflow-hidden bg-gray-100 aspect-square cursor-pointer border-2 transition-all duration-300 hover:scale-105 ${
                      currentImageIndex === idx ? 'border-[#00695C] shadow-md' : 'border-gray-200 hover:border-gray-400'
                    }`}
                    onClick={() => setCurrentImageIndex(idx)}
                  >
                    <img 
                      src={img} 
                      alt={`Property Image ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/200x200/CCCCCC/666666?text=No+Image';
                      }}
                    />
                    {currentImageIndex === idx && (
                      <div className="absolute inset-0 bg-[#00695C]/20 flex items-center justify-center">
                        <div className="bg-[#00695C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Active
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Buttons - Fixed with Increased Size */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 rounded-b-2xl flex flex-wrap gap-2.5 flex-shrink-0">
          <button 
            onClick={() => {
              onClose();
              handleEditProperty(property);
            }}
            className="flex-1 min-w-[100px] px-4 py-2.5 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Edit Property
          </button>
          <button 
            onClick={() => {
              onClose();
              handleShareProperty(property);
            }}
            className="flex-1 min-w-[100px] px-4 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share Listing
          </button>
          <button 
            onClick={() => {
              onClose();
              handleDeleteProperty(property);
            }}
            className="flex-1 min-w-[100px] px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

  // ============ RENDER FUNCTIONS ============

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'personal':
        return (
          <div className="w-full animate-slideUp">
            <div className="flex items-center mb-8">
              <div className="w-1.5 h-12 bg-gradient-to-b from-[#00695C] to-[#26A69A] mr-4 rounded-full"></div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                  Personal Details
                </h2>
                <p className="text-sm text-gray-500 mt-1">Manage your personal information and identity documents</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
              <div className="space-y-4 w-full">
                <InfoCard 
                  label="Full Name" 
                  value={editForm.fullName} 
                  icon={<User className="w-5 h-5" />} 
                />
                <InfoCard 
                  label="Mobile Number" 
                  value={editForm.mobileNumber} 
                  icon={<Phone className="w-5 h-5" />} 
                />
                <InfoCard 
                  label="Email Address" 
                  value={editForm.emailAddress} 
                  icon={<Mail className="w-5 h-5" />} 
                />
                <InfoCard 
                  label="Date of Birth" 
                  value={formatDateForDisplay(editForm.dateOfBirth)} 
                  icon={<Calendar className="w-5 h-5" />} 
                />
                <InfoCard 
                  label="Gender" 
                  value={editForm.gender} 
                  icon={<User className="w-5 h-5" />} 
                />
              </div>
              <div className="space-y-4 w-full">
                <InfoCard 
                  label="Aadhaar Number" 
                  value={editForm.aadhaarNumber} 
                  icon={<Shield className="w-5 h-5" />} 
                />
                <InfoCard 
                  label="PAN Number" 
                  value={editForm.panNumber} 
                  icon={<CreditCard className="w-5 h-5" />} 
                />
                <InfoCard 
                  label="Identity Verification" 
                  icon={<FileCheck className="w-5 h-5" />}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm bg-white p-3 rounded-xl border border-[#00695C]/20 shadow-sm">
                      <Check className={`w-5 h-5 ${documents.aadhaarCard ? 'text-[#00695C]' : 'text-gray-300'}`} />
                      <span className={documents.aadhaarCard ? 'text-gray-700 font-medium' : 'text-gray-400'}>
                        Aadhaar Card: {documents.aadhaarCard ? '✓ Uploaded' : '✗ Not uploaded'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm bg-white p-3 rounded-xl border border-[#00695C]/20 shadow-sm">
                      <Check className={`w-5 h-5 ${documents.panCard ? 'text-[#00695C]' : 'text-gray-300'}`} />
                      <span className={documents.panCard ? 'text-gray-700 font-medium' : 'text-gray-400'}>
                        PAN Card: {documents.panCard ? '✓ Uploaded' : '✗ Not uploaded'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm bg-white p-3 rounded-xl border border-[#00695C]/20 shadow-sm">
                      <Check className={`w-5 h-5 ${documents.passportPhoto ? 'text-[#00695C]' : 'text-gray-300'}`} />
                      <span className={documents.passportPhoto ? 'text-gray-700 font-medium' : 'text-gray-400'}>
                        Passport Photo: {documents.passportPhoto ? '✓ Uploaded' : '✗ Not uploaded'}
                      </span>
                    </div>
                  </div>
                </InfoCard>
              </div>
            </div>
          </div>
        );

      case 'address':
        return (
          <div className="w-full animate-slideUp">
            <div className="flex items-center mb-8">
              <div className="w-1.5 h-12 bg-gradient-to-b from-[#00695C] to-[#26A69A] mr-4 rounded-full"></div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                  Address Details
                </h2>
                <p className="text-sm text-gray-500 mt-1">Your current residential address information</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
              <div className="space-y-4 w-full">
                <InfoCard 
                  label="Address Line 1" 
                  value={editForm.addressLine1} 
                  icon={<MapPin className="w-5 h-5" />} 
                />
                <InfoCard 
                  label="Address Line 2" 
                  value={editForm.addressLine2} 
                  icon={<MapPin className="w-5 h-5" />} 
                />
                <InfoCard 
                  label="City" 
                  value={editForm.city} 
                  icon={<Building className="w-5 h-5" />} 
                />
              </div>
              <div className="space-y-4 w-full">
                <InfoCard 
                  label="District" 
                  value={editForm.district} 
                  icon={<Landmark className="w-5 h-5" />} 
                />
                <InfoCard 
                  label="State" 
                  value={editForm.state} 
                  icon={<Globe className="w-5 h-5" />} 
                />
                <InfoCard 
                  label="PIN Code" 
                  value={editForm.pinCode} 
                  icon={<MapPin className="w-5 h-5" />} 
                />
              </div>
            </div>
          </div>
        );

      case 'property':
        return (
          <div className="w-full animate-slideUp">
            <div className="flex items-center mb-8">
              <div className="w-1.5 h-12 bg-gradient-to-b from-[#00695C] to-[#26A69A] mr-4 rounded-full"></div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                  Property Images
                </h2>
                <p className="text-sm text-gray-500 mt-1">Visual documentation of your property</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
              <FileCard 
                label="Cover Image" 
                field="coverImage" 
                icon={<Camera className="w-8 h-8" />}
                description="Main property image"
              />
              <FileCard 
                label="Property Photos" 
                field="propertyPhotos" 
                icon={<Image className="w-8 h-8" />}
                description="Multiple property images"
              />
              <FileCard 
                label="Property Video" 
                field="propertyVideo" 
                icon={<Video className="w-8 h-8" />}
                description="Property walkthrough"
              />
              <FileCard 
                label="Floor Plan" 
                field="floorPlan" 
                icon={<FileText className="w-8 h-8" />}
                description="Property layout"
              />
            </div>
          </div>
        );

      case 'legal':
        return (
          <div className="w-full animate-slideUp">
            <div className="flex items-center mb-8">
              <div className="w-1.5 h-12 bg-gradient-to-b from-[#00695C] to-[#26A69A] mr-4 rounded-full"></div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                  Legal Documents
                </h2>
                <p className="text-sm text-gray-500 mt-1">All legal documents for property verification</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
              <FileCard 
                label="Sale Deed" 
                field="saleDeed" 
                icon={<FileCheck className="w-8 h-8" />}
                description="Property ownership"
              />
              <FileCard 
                label="Floor Plan" 
                field="floorPlanOptional" 
                icon={<FileCheck className="w-8 h-8" />}
                description="Property layout plan"
              />
              <FileCard 
                label="Patta / Chitta" 
                field="pattaChitta" 
                icon={<FileCheck className="w-8 h-8" />}
                description="Land ownership"
              />
              <FileCard 
                label="Encumbrance Certificate" 
                field="encumbranceCertificate" 
                icon={<FileCheck className="w-8 h-8" />}
                description="Property encumbrance"
              />
              <FileCard 
                label="Property Tax Receipt" 
                field="propertyTaxReceipt" 
                icon={<FileCheck className="w-8 h-8" />}
                description="Tax payment proof"
              />
              <FileCard 
                label="Building Approval Plan" 
                field="buildingApprovalPlan" 
                icon={<FileCheck className="w-8 h-8" />}
                description="Construction approval"
              />
              <FileCard 
                label="Completion Certificate" 
                field="completionCertificate" 
                icon={<FileCheck className="w-8 h-8" />}
                description="Construction completion"
              />
              <FileCard 
                label="Occupancy Certificate" 
                field="occupancyCertificate" 
                icon={<FileCheck className="w-8 h-8" />}
                description="Building occupancy"
              />
              <FileCard 
                label="Rental Agreement" 
                field="rentalAgreement" 
                icon={<FileCheck className="w-8 h-8" />}
                description="Tenancy agreement"
              />
              <FileCard 
                label="Other Documents" 
                field="otherDocuments" 
                icon={<FileText className="w-8 h-8" />}
                description="Additional documents"
              />
            </div>
          </div>
        );

      case 'bank':
        return (
          <div className="w-full animate-slideUp">
            <div className="flex items-center mb-8">
              <div className="w-1.5 h-12 bg-gradient-to-b from-[#00695C] to-[#26A69A] mr-4 rounded-full"></div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                  Bank Details
                </h2>
                <p className="text-sm text-gray-500 mt-1">Financial information for property transactions</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
              <div className="space-y-4 w-full">
                <InfoCard 
                  label="Account Holder Name" 
                  value={editForm.accountHolderName} 
                  icon={<User className="w-5 h-5" />} 
                />
                <InfoCard 
                  label="Bank Name" 
                  value={editForm.bankName} 
                  icon={<Building className="w-5 h-5" />} 
                />
                <InfoCard 
                  label="Account Number" 
                  value={editForm.accountNumber} 
                  icon={<CreditCard className="w-5 h-5" />} 
                />
              </div>
              <div className="space-y-4 w-full">
                <InfoCard 
                  label="IFSC Code" 
                  value={editForm.ifscCode} 
                  icon={<Banknote className="w-5 h-5" />} 
                />
                <InfoCard 
                  label="UPI ID" 
                  value={editForm.upiId} 
                  icon={<Globe className="w-5 h-5" />} 
                />
              </div>
            </div>
          </div>
        );

      case 'communication':
        return (
          <div className="w-full animate-slideUp">
            <div className="flex items-center mb-8">
              <div className="w-1.5 h-12 bg-gradient-to-b from-[#00695C] to-[#26A69A] mr-4 rounded-full"></div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                  Communication Preferences
                </h2>
                <p className="text-sm text-gray-500 mt-1">How and when to contact you</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 w-full">
              <InfoCard 
                label="Preferred Contact Method" 
                icon={<MessageCircle className="w-5 h-5" />}
              >
                <div className="flex flex-wrap gap-2">
                  {['Phone Call', 'WhatsApp', 'Email'].map((method) => {
                    const isSelected = editForm.preferredMethods.includes(method);
                    return (
                      <span
                        key={method}
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                          isSelected
                            ? 'bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white shadow-lg transform scale-105'
                            : 'bg-gray-100 text-gray-500 border-2 border-gray-200'
                        }`}
                      >
                        {method === 'Phone Call' && '📞'}
                        {method === 'WhatsApp' && '💬'}
                        {method === 'Email' && '✉️'}
                        {' '}{method}
                        {isSelected && <Check className="w-4 h-4 ml-1" />}
                      </span>
                    );
                  })}
                </div>
                <div className="mt-2 text-xs text-gray-500 font-medium">
                  Selected: {editForm.preferredMethods.length > 0 ? editForm.preferredMethods.join(', ') : 'None selected'}
                </div>
              </InfoCard>

              <InfoCard 
                label="Preferred Contact Time" 
                icon={<Clock className="w-5 h-5" />}
              >
                <div className="flex flex-wrap gap-2">
                  {['Morning', 'Afternoon', 'Evening', 'Anytime'].map((time) => {
                    const isSelected = editForm.preferredTimes.includes(time);
                    return (
                      <span
                        key={time}
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                          isSelected
                            ? 'bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white shadow-lg transform scale-105'
                            : 'bg-gray-100 text-gray-500 border-2 border-gray-200'
                        }`}
                      >
                        {time}
                        {isSelected && <Check className="w-4 h-4 ml-1" />}
                      </span>
                    );
                  })}
                </div>
                <div className="mt-2 text-xs text-gray-500 font-medium">
                  Selected: {editForm.preferredTimes.length > 0 ? editForm.preferredTimes.join(', ') : 'None selected'}
                </div>
              </InfoCard>

              <InfoCard 
                label="Additional Notes" 
                icon={<Info className="w-5 h-5" />}
              >
                <div className="p-4 text-sm text-gray-800 bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 rounded-xl border border-[#00695C]/20 font-medium shadow-sm">
                  {editForm.additionalNotes || 'No additional notes'}
                </div>
              </InfoCard>
            </div>
          </div>
        );

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

  // ============ MAIN RENDER ============

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00695C]/5 via-teal-50/50 to-[#26A69A]/5 pt-20 pb-12 w-full relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#00695C]/10 to-[#26A69A]/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#26A69A]/10 to-[#00695C]/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-[#00695C]/5 to-[#26A69A]/5 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {/* Modals */}
      {showProfilePhotoDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 p-8 transform transition-all duration-300 scale-100 animate-scaleIn">
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
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 p-8 transform transition-all duration-300 scale-100 animate-scaleIn">
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

      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn w-full">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[90%] sm:max-w-[95%] lg:max-w-2xl mx-4 overflow-hidden max-h-[75vh] flex flex-col animate-scaleIn">
            <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] px-8 py-5 flex items-center justify-between flex-shrink-0">
              <h2 className="text-white text-xl font-bold flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl">
                  <Edit2 className="w-5 h-5" />
                </div>
                Edit Profile
              </h2>
              <button 
                onClick={() => setShowEditModal(false)} 
                className="text-white/80 hover:text-white transition-all duration-300 hover:rotate-90 hover:scale-110"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="px-8 py-6 space-y-6 overflow-y-auto flex-1 w-full bg-gray-50">
              {/* Personal Details */}
              <div className="space-y-4 w-full bg-white rounded-2xl p-6 shadow-sm border border-[#00695C]/10">
                <h3 className="text-sm font-bold text-[#00695C] uppercase tracking-wider flex items-center gap-3">
                  <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-2 rounded-xl">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  Personal Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  {[
                    { name: 'fullName', label: 'Full Name', emoji: '👤' },
                    { name: 'mobileNumber', label: 'Mobile Number', emoji: '📱' },
                    { name: 'emailAddress', label: 'Email Address', emoji: '✉️' },
                    { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', emoji: '🎂' },
                    { name: 'gender', label: 'Gender', emoji: '⚥' },
                    { name: 'aadhaarNumber', label: 'Aadhaar Number', emoji: '🆔' },
                    { name: 'panNumber', label: 'PAN Number', emoji: '📄' },
                  ].map((field) => (
                    <div key={field.name} className="space-y-1.5 w-full">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                        <span>{field.emoji}</span> {field.label}
                      </label>
                      {field.name === 'dateOfBirth' ? (
                        <input
                          type="date"
                          name={field.name}
                          value={formatDateForInput(editForm.dateOfBirth)}
                          onChange={handleDateChange}
                          className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-300"
                        />
                      ) : (
                        <input
                          type={field.type || 'text'}
                          name={field.name}
                          value={editForm[field.name]}
                          onChange={handleEditChange}
                          className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-300"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Identity Verification */}
              <div className="space-y-4 w-full bg-white rounded-2xl p-6 shadow-sm border border-[#00695C]/10">
                <h3 className="text-sm font-bold text-[#00695C] uppercase tracking-wider flex items-center gap-3">
                  <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-2 rounded-xl">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  Identity Verification
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                  {[
                    { name: 'aadhaarCard', label: 'Aadhaar Card' },
                    { name: 'panCard', label: 'PAN Card' },
                    { name: 'passportPhoto', label: 'Passport Photo' },
                  ].map((doc) => (
                    <div key={doc.name} className="border-3 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-[#00695C] transition-all duration-300 hover:bg-[#00695C]/5 group w-full">
                      <label className="block text-xs font-medium text-gray-600 cursor-pointer">
                        <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-3 rounded-2xl w-12 h-12 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                          <Upload className="w-6 h-6 text-white" />
                        </div>
                        <span className="block font-bold">{doc.label}</span>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*,.pdf"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setDocuments(prev => ({ ...prev, [doc.name]: file }));
                              showSuccessToast();
                            }
                          }} 
                        />
                      </label>
                      {documents[doc.name] && (
                        <span className="text-xs text-[#00695C] block mt-3 font-bold bg-[#00695C]/10 px-3 py-1.5 rounded-full animate-fadeIn">
                          ✓ Uploaded
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Address Details */}
              <div className="space-y-4 w-full bg-white rounded-2xl p-6 shadow-sm border border-[#00695C]/10">
                <h3 className="text-sm font-bold text-[#00695C] uppercase tracking-wider flex items-center gap-3">
                  <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-2 rounded-xl">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  Address Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  {[
                    { name: 'addressLine1', label: 'Address Line 1', emoji: '🏠' },
                    { name: 'addressLine2', label: 'Address Line 2', emoji: '🏠' },
                    { name: 'city', label: 'City', emoji: '🏙️' },
                    { name: 'district', label: 'District', emoji: '🗺️' },
                    { name: 'state', label: 'State', emoji: '🌍' },
                    { name: 'pinCode', label: 'PIN Code', emoji: '📍' },
                  ].map((field) => (
                    <div key={field.name} className="space-y-1.5 w-full">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                        <span>{field.emoji}</span> {field.label}
                      </label>
                      <input
                        type="text"
                        name={field.name}
                        value={editForm[field.name]}
                        onChange={handleEditChange}
                        className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Property Images */}
              <div className="space-y-4 w-full bg-white rounded-2xl p-6 shadow-sm border border-[#00695C]/10">
                <h3 className="text-sm font-bold text-[#00695C] uppercase tracking-wider flex items-center gap-3">
                  <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-2 rounded-xl">
                    <Image className="w-4 h-4 text-white" />
                  </div>
                  Property Images
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                  {[
                    { name: 'coverImage', label: 'Cover Image' },
                    { name: 'propertyPhotos', label: 'Property Photos', multiple: true },
                    { name: 'propertyVideo', label: 'Property Video' },
                    { name: 'floorPlan', label: 'Floor Plan' },
                  ].map((doc) => (
                    <div key={doc.name} className="border-3 border-dashed border-gray-300 rounded-2xl p-4 text-center hover:border-[#00695C] transition-all duration-300 hover:bg-[#00695C]/5 group w-full">
                      <label className="block text-xs font-medium text-gray-600 cursor-pointer">
                        <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-3 rounded-2xl w-12 h-12 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                          <Upload className="w-6 h-6 text-white" />
                        </div>
                        <span className="block font-bold">{doc.label}</span>
                        <input 
                          type="file" 
                          className="hidden" 
                          multiple={doc.multiple || false}
                          accept={doc.name === 'propertyVideo' ? 'video/*' : 'image/*'}
                          onChange={(e) => {
                            const files = e.target.files;
                            if (files && files.length > 0) {
                              if (doc.multiple) {
                                handleMultipleFileUpload(doc.name, files);
                              } else {
                                handleFileUpload(doc.name, files[0]);
                              }
                            }
                          }} 
                        />
                      </label>
                      {documents[doc.name] && (
                        <span className="text-xs text-[#00695C] block mt-3 font-bold bg-[#00695C]/10 px-3 py-1.5 rounded-full animate-fadeIn">
                          {Array.isArray(documents[doc.name]) ? `${documents[doc.name].length} uploaded` : '✓ Uploaded'}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Legal Documents */}
              <div className="space-y-4 w-full bg-white rounded-2xl p-6 shadow-sm border border-[#00695C]/10">
                <h3 className="text-sm font-bold text-[#00695C] uppercase tracking-wider flex items-center gap-3">
                  <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-2 rounded-xl">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  Legal Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
                  {[
                    { name: 'saleDeed', label: 'Sale Deed' },
                    { name: 'floorPlanOptional', label: 'Floor Plan' },
                    { name: 'pattaChitta', label: 'Patta / Chitta' },
                    { name: 'encumbranceCertificate', label: 'Encumbrance Certificate' },
                    { name: 'propertyTaxReceipt', label: 'Property Tax Receipt' },
                    { name: 'buildingApprovalPlan', label: 'Building Approval Plan' },
                    { name: 'completionCertificate', label: 'Completion Certificate' },
                    { name: 'occupancyCertificate', label: 'Occupancy Certificate' },
                    { name: 'rentalAgreement', label: 'Rental Agreement' },
                  ].map((doc) => (
                    <div key={doc.name} className="border-3 border-dashed border-gray-300 rounded-2xl p-3 text-center hover:border-[#00695C] transition-all duration-300 hover:bg-[#00695C]/5 group w-full">
                      <label className="block text-xs font-medium text-gray-600 cursor-pointer">
                        <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-2 rounded-2xl w-10 h-10 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
                          <Upload className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xs font-bold">{doc.label}</span>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setDocuments(prev => ({ ...prev, [doc.name]: file }));
                              showSuccessToast();
                            }
                          }} 
                        />
                      </label>
                      {documents[doc.name] && (
                        <span className="text-xs text-[#00695C] block mt-2 font-bold bg-[#00695C]/10 px-2 py-1 rounded-full animate-fadeIn">
                          ✓ Uploaded
                        </span>
                      )}
                    </div>
                  ))}
                  <div className="border-3 border-dashed border-gray-300 rounded-2xl p-3 text-center hover:border-[#00695C] transition-all duration-300 hover:bg-[#00695C]/5 group w-full">
                    <label className="block text-xs font-medium text-gray-600 cursor-pointer">
                      <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-2 rounded-2xl w-10 h-10 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
                        <Upload className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xs font-bold">Other Documents</span>
                      <input 
                        type="file" 
                        className="hidden" 
                        multiple 
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files && files.length > 0) {
                            handleMultipleFileUpload('otherDocuments', files);
                          }
                        }} 
                      />
                    </label>
                    {documents.otherDocuments.length > 0 && (
                      <span className="text-xs text-[#00695C] block mt-2 font-bold bg-[#00695C]/10 px-2 py-1 rounded-full animate-fadeIn">
                        {documents.otherDocuments.length} uploaded
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div className="space-y-4 w-full bg-white rounded-2xl p-6 shadow-sm border border-[#00695C]/10">
                <h3 className="text-sm font-bold text-[#00695C] uppercase tracking-wider flex items-center gap-3">
                  <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-2 rounded-xl">
                    <Banknote className="w-4 h-4 text-white" />
                  </div>
                  Bank Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  {[
                    { name: 'accountHolderName', label: 'Account Holder Name', emoji: '👤' },
                    { name: 'bankName', label: 'Bank Name', emoji: '🏦' },
                    { name: 'accountNumber', label: 'Account Number', emoji: '💳' },
                    { name: 'ifscCode', label: 'IFSC Code', emoji: '🔢' },
                    { name: 'upiId', label: 'UPI ID', emoji: '📱' },
                  ].map((field) => (
                    <div key={field.name} className="space-y-1.5 w-full">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                        <span>{field.emoji}</span> {field.label}
                      </label>
                      <input
                        type="text"
                        name={field.name}
                        value={editForm[field.name]}
                        onChange={handleEditChange}
                        className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Communication Preferences */}
              <div className="space-y-4 w-full bg-white rounded-2xl p-6 shadow-sm border border-[#00695C]/10">
                <h3 className="text-sm font-bold text-[#00695C] uppercase tracking-wider flex items-center gap-3">
                  <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-2 rounded-xl">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  Communication Preferences
                </h3>
                <div className="space-y-4 w-full">
                  <div className="w-full">
                    <label className="block text-xs font-bold text-gray-700 mb-2">Preferred Contact Method</label>
                    <div className="flex flex-wrap gap-3">
                      {['Phone Call', 'WhatsApp', 'Email'].map((method) => {
                        const isSelected = editForm.preferredMethods.includes(method);
                        return (
                          <button
                            key={method}
                            type="button"
                            onClick={() => togglePreference('preferredMethods', method)}
                            className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 cursor-pointer ${
                              isSelected
                                ? 'bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white shadow-lg transform scale-105'
                                : 'bg-gray-100 text-gray-600 border-2 border-gray-200 hover:border-[#00695C] hover:bg-[#00695C]/5'
                            }`}
                          >
                            {method}
                            {isSelected && <Check className="w-4 h-4 ml-2 inline" />}
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-2 text-xs text-gray-500 font-medium">
                      Selected: {editForm.preferredMethods.length > 0 ? editForm.preferredMethods.join(', ') : 'None selected'}
                    </div>
                  </div>

                  <div className="w-full">
                    <label className="block text-xs font-bold text-gray-700 mb-2">Preferred Contact Time</label>
                    <div className="flex flex-wrap gap-3">
                      {['Morning', 'Afternoon', 'Evening', 'Anytime'].map((time) => {
                        const isSelected = editForm.preferredTimes.includes(time);
                        return (
                          <button
                            key={time}
                            type="button"
                            onClick={() => togglePreference('preferredTimes', time)}
                            className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 cursor-pointer ${
                              isSelected
                                ? 'bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white shadow-lg transform scale-105'
                                : 'bg-gray-100 text-gray-600 border-2 border-gray-200 hover:border-[#00695C] hover:bg-[#00695C]/5'
                            }`}
                          >
                            {time}
                            {isSelected && <Check className="w-4 h-4 ml-2 inline" />}
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-2 text-xs text-gray-500 font-medium">
                      Selected: {editForm.preferredTimes.length > 0 ? editForm.preferredTimes.join(', ') : 'None selected'}
                    </div>
                  </div>

                  <div className="w-full">
                    <label className="block text-xs font-bold text-gray-700 mb-2">Additional Notes</label>
                    <textarea
                      name="additionalNotes"
                      value={editForm.additionalNotes}
                      onChange={handleEditChange}
                      rows="4"
                      className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-300 resize-y"
                      placeholder="Enter any additional notes or special requests..."
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="px-8 py-5 bg-white border-t-2 border-gray-100 flex flex-col sm:flex-row justify-end gap-3 flex-shrink-0">
              <button 
                onClick={() => setShowEditModal(false)} 
                className="px-8 py-3 rounded-2xl border-2 border-gray-300 text-gray-700 text-sm font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105 w-full sm:w-auto"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                disabled={isLoading}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white text-sm font-bold hover:from-[#005A4F] hover:to-[#1B9E8E] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 justify-center w-full sm:w-auto hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Property Details Modal */}
      {showPropertyDetails && selectedProperty && (
        <PropertyDetailsModal 
          property={selectedProperty} 
          onClose={() => {
            setShowPropertyDetails(false);
            setSelectedProperty(null);
          }} 
        />
      )}

      {/* Edit Property Modal */}
      {showEditPropertyModal && editingProperty && (
        <EditPropertyModal
          property={editingProperty}
          onSave={setEditingProperty}
          onCancel={() => {
            setShowEditPropertyModal(false);
            setEditingProperty(null);
            setEditPropertyStep(0);
            setImagePreviews([]);
            setCoverPreview(null);
            setFloorPlanPreview(null);
            setVideoPreview(null);
            setCustomAmenitiesList([]);
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

      {/* Share Property Modal */}
      {showShareModal && sharingProperty && (
        <ShareModal
          property={sharingProperty}
          onClose={() => {
            setShowShareModal(false);
            setSharingProperty(null);
          }}
        />
      )}

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-55 right-4 z-50 bg-gradient-to-r from-[#00695C]/10 to-[#26A69A]/10 border-2 border-[#00695C]/30 rounded-2xl p-2 flex items-center gap-4 shadow-xl animate-slideDown max-w-md backdrop-blur-sm">
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

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-full w-full relative z-10 -mt-15">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 w-full">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button
              onClick={handleNavigateBack}
              className="p-3 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 hover:rotate-12 group border border-[#00695C]/10"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-[#00695C] transition-colors duration-300" />
            </button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent flex items-center gap-3">
                <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-3 rounded-2xl shadow-lg animate-float">
                  <User className="w-7 h-7 text-white" />
                </div>
                Owner Profile
              </h1>
              <p className="text-sm text-gray-500 mt-1 ml-1">Manage your owner profile and property information</p>
            </div>
          </div>
          <button
            onClick={() => setShowEditModal(true)}
            className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#00695C] to-[#26A69A] hover:from-[#005A4F] hover:to-[#1B9E8E] text-white rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-2xl w-full sm:w-auto justify-center transform hover:scale-105 hover:-translate-y-1 group"
          >
            <Edit2 className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
            Edit Profile
          </button>
        </div>

{/* Profile Card */}
<div className="relative bg-[#00695C]/5 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 w-full hover:shadow-3xl transition-all duration-500 border border-[#00695C]/20 overflow-hidden group">
  {/* top edge sweep on hover */}
  <div className="absolute top-0 left-[-100%] w-full h-[3px] bg-gradient-to-r from-transparent via-[#26A69A] to-transparent group-hover:left-full transition-all duration-[900ms] ease-out" />

  <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-[#00695C]/10 to-[#26A69A]/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
  <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-br from-[#26A69A]/10 to-[#00695C]/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

  {/* rising bubbles */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
    {Array.from({ length: 14 }).map((_, i) => (
      <span
        key={i}
        className="absolute bottom-[-40px] rounded-full border border-white/50 animate-bubble"
        style={{
          left: `${Math.random() * 100}%`,
          width: `${6 + Math.random() * 14}px`,
          height: `${6 + Math.random() * 14}px`,
          background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(38,166,154,0.35) 60%, rgba(0,105,92,0.15) 100%)',
          animationDuration: `${6 + Math.random() * 6}s`,
          animationDelay: `${Math.random() * 8}s`,
          '--drift': `${Math.random() * 60 - 30}px`,
        }}
      />
    ))}
  </div>

  <div className="flex flex-col md:flex-row items-center md:items-start gap-8 w-full relative z-10">
    {/* Profile Photo with spinning ring */}
    <div className="relative flex-shrink-0">
      <div className="absolute -inset-1.5 rounded-[28px] animate-spin-slow"
           style={{ background: 'conic-gradient(from 0deg, #00695C, #26A69A, #7fd6c9, #26A69A, #00695C)' }} />
      <div className="relative w-36 h-36 rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#00695C]/20 to-[#26A69A]/20 flex items-center justify-center ring-4 ring-white/60">
        {documents.passportPhoto ? (
          <img src={URL.createObjectURL(documents.passportPhoto)} alt={editForm.fullName} className="w-full h-full object-cover" />
        ) : (
          <span className="text-6xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
            {editForm.fullName.charAt(0)}
          </span>
        )}
      </div>

      {documents.passportPhoto && (
        <button onClick={handleProfilePhotoDelete}
          className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-lg hover:bg-red-500 text-gray-600 hover:text-white transition-all duration-300 hover:scale-110 hover:rotate-12 z-20"
          aria-label="Delete profile photo" title="Delete Profile Photo">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}

      <button onClick={() => profilePhotoInputRef.current?.click()}
        className="absolute bottom-2 right-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white p-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:rotate-12 z-20"
        aria-label="Upload profile photo" title="Upload Profile Photo">
        <Camera className="w-4 h-4" />
      </button>
      <input ref={profilePhotoInputRef} type="file" className="hidden" accept="image/*" onChange={handleProfilePhotoUpload} />
    </div>

    {/* Profile Info */}
    <div className="flex-1 text-center md:text-left w-full">
      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
        <h2 className="text-3xl font-bold text-gray-800">{editForm.fullName}</h2>
        <span className="relative overflow-hidden bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white px-4 py-1 rounded-full text-xs font-bold">
          Verified Owner
          <span className="absolute inset-y-0 left-[-60%] w-[40%] bg-gradient-to-r from-transparent via-white/80 to-transparent animate-shimmer" />
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm text-gray-500 mb-4">
        <span className="flex items-center gap-2 bg-[#00695C]/5 px-4 py-2 rounded-2xl shadow-sm border border-[#00695C]/10 hover:border-[#26A69A] hover:-translate-y-0.5 transition-all duration-300 animate-rise" style={{ animationDelay: '0.05s' }}>
          <MapPin className="w-4 h-4 text-[#00695C]" /> {editForm.city}, {editForm.state}
        </span>
        <span className="flex items-center gap-2 bg-[#00695C]/5 px-4 py-2 rounded-2xl shadow-sm border border-[#00695C]/10 hover:border-[#26A69A] hover:-translate-y-0.5 transition-all duration-300 animate-rise" style={{ animationDelay: '0.15s' }}>
          <Phone className="w-4 h-4 text-[#00695C]" /> {editForm.mobileNumber}
        </span>
        <span className="flex items-center gap-2 bg-[#00695C]/5 px-4 py-2 rounded-2xl shadow-sm border border-[#00695C]/10 hover:border-[#26A69A] hover:-translate-y-0.5 transition-all duration-300 animate-rise" style={{ animationDelay: '0.25s' }}>
          <Mail className="w-4 h-4 text-[#00695C]" /> {editForm.emailAddress}
        </span>
      </div>

      <div className="flex flex-wrap gap-3 justify-center md:justify-start">
        <span className="flex items-center gap-2 bg-gradient-to-r from-[#00695C]/10 to-[#26A69A]/10 text-[#00695C] px-4 py-2 rounded-2xl text-xs font-bold shadow-sm hover:scale-105 transition-transform duration-300 border border-[#00695C]/20 text-left animate-rise" style={{ animationDelay: '0.35s' }}>
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span>
            {[editForm.addressLine1, editForm.addressLine2, editForm.city, editForm.district, editForm.state, editForm.pinCode].filter(Boolean).join(', ')}
          </span>
        </span>
        {documents.coverImage && (
          <span className="flex items-center gap-2 bg-gradient-to-r from-[#00695C]/10 to-[#26A69A]/10 text-[#00695C] px-4 py-2 rounded-2xl text-xs font-bold shadow-sm hover:scale-105 transition-transform duration-300 border border-[#00695C]/20">
            <Image className="w-3.5 h-3.5" /> Cover Image Uploaded
          </span>
        )}
      </div>
    </div>
  </div>
</div>

        {/* Properties Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 mb-8 w-full border border-[#00695C]/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00695C]/5 to-[#26A69A]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500  pointer-events-none" />
          
          {/* Properties Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-2.5 rounded-xl shadow-lg">
                <Home className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">My Properties</h2>
                <p className="text-sm text-gray-500">Manage your property listings</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
              {/* Search */}
              <div className="relative flex-1 sm:flex-initial min-w-[150px]">
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 rounded-xl border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all duration-300 text-sm"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {/* Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all duration-300 text-sm bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
              
              {/* View Mode Toggle */}
              <div className="flex rounded-xl border-2 border-gray-200 overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? 'bg-[#00695C] text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                  aria-label="Grid view"
                >
                  <GridIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-all duration-300 ${
                    viewMode === 'list' 
                      ? 'bg-[#00695C] text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

{/* Properties Display */}
{filteredProperties.length > 0 ? (
  <div>
    {viewMode === 'grid' ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProperties.map((property, index) => (
          <div
            key={property.id}
            className="group relative bg-gradient-to-br from-white via-[#00695C]/5 to-[#26A69A]/10 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl transition-all duration-700 border border-[#00695C]/10 hover:border-[#00695C]/25 overflow-hidden animate-fade-up hover:-translate-y-2"
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            {/* Floating particles background - light */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 6 }).map((_, i) => (
                <span
                  key={i}
                  className="absolute rounded-full bg-[#00695C]/5 animate-float-particle"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: `${3 + Math.random() * 6}px`,
                    height: `${3 + Math.random() * 6}px`,
                    animationDuration: `${8 + Math.random() * 12}s`,
                    animationDelay: `${Math.random() * 10}s`,
                  }}
                />
              ))}
            </div>

            {/* Light border glow on hover */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00695C]/10 via-[#26A69A]/15 to-[#00695C]/10 rounded-xl opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-700" />
            
            {/* Top shimmer line - light */}
            <div className="absolute top-0 left-[-100%] w-full h-[1.5px] bg-gradient-to-r from-transparent via-[#26A69A]/30 to-transparent group-hover:left-full transition-all duration-1000" />
            
            {/* Bottom shimmer line - light */}
            <div className="absolute bottom-0 right-[-100%] w-full h-[1.5px] bg-gradient-to-l from-transparent via-[#26A69A]/30 to-transparent group-hover:right-full transition-all duration-1000 delay-300" />

            {/* Corner accents - light - smaller */}
            <div className="absolute top-1.5 left-1.5 w-5 h-5 border-t border-l border-[#00695C]/10 group-hover:border-[#00695C]/40 transition-all duration-500 rounded-tl-md opacity-0 group-hover:opacity-100" />
            <div className="absolute top-1.5 right-1.5 w-5 h-5 border-t border-r border-[#00695C]/10 group-hover:border-[#00695C]/40 transition-all duration-500 rounded-tr-md opacity-0 group-hover:opacity-100" />
            <div className="absolute bottom-1.5 left-1.5 w-5 h-5 border-b border-l border-[#00695C]/10 group-hover:border-[#00695C]/40 transition-all duration-500 rounded-bl-md opacity-0 group-hover:opacity-100" />
            <div className="absolute bottom-1.5 right-1.5 w-5 h-5 border-b border-r border-[#00695C]/10 group-hover:border-[#00695C]/40 transition-all duration-500 rounded-br-md opacity-0 group-hover:opacity-100" />

            {/* Light pulsing ring on hover */}
            <div className="absolute inset-0 rounded-xl border border-[#00695C]/0 group-hover:border-[#00695C]/10 transition-all duration-700 scale-95 group-hover:scale-100" />

            {/* Image Section - Reduced height */}
            <div className="relative h-36 overflow-hidden">
              <img 
                src={property.images?.[0] || 'https://via.placeholder.com/400x300/CCCCCC/666666?text=No+Image'} 
                alt={property.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x300/CCCCCC/666666?text=No+Image';
                }}
              />
              
              {/* Light image overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-500" />

              {/* Status Badge with light glass morphism - smaller */}
              <div className="absolute top-2 right-2">
                <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold shadow-lg backdrop-blur-sm flex items-center gap-1 transition-all duration-300 hover:scale-105 ${
                  property.status === 'Active' ? 'bg-emerald-400/80 text-white' :
                  property.status === 'Pending' ? 'bg-amber-400/80 text-white' :
                  'bg-rose-400/80 text-white'
                }`}>
                  <span className={`w-1 h-1 rounded-full animate-pulse ${
                    property.status === 'Active' ? 'bg-white' :
                    property.status === 'Pending' ? 'bg-white' :
                    'bg-white'
                  }`} />
                  {property.status}
                </span>
              </div>

              {/* Price with light glass morphism - smaller */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <p className="text-white font-bold text-sm drop-shadow-lg bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/10">
                    {property.price}
                  </p>
                  <span className="text-[9px] text-white/80 bg-black/20 backdrop-blur-sm px-2 py-0.5 rounded-lg border border-white/10">
                    {property.listingPurpose || 'For Sale'}
                  </span>
                </div>
              </div>

              {/* Image counter badge - smaller */}
              {property.images && property.images.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black/30 backdrop-blur-sm text-white text-[8px] px-2 py-0.5 rounded-full border border-white/10 flex items-center gap-1">
                  <Image className="w-2 h-2" />
                  {property.images.length}
                </div>
              )}
            </div>

            {/* Content Section - Reduced padding */}
            <div className="p-3 space-y-1.5">
              {/* Property Name & ID with animated underline - smaller */}
              <div className="group/title">
                <h3 className="font-bold text-gray-800 text-xs group-hover:text-[#00695C] transition-colors duration-300 line-clamp-1 relative">
                  {property.name}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-[#00695C]/40 to-[#26A69A]/40 group-hover/title:w-full transition-all duration-500" />
                </h3>
                <p className="text-[9px] text-gray-400 font-medium flex items-center gap-1.5 mt-0.5">
                  <span className="bg-gray-100 px-1.5 py-0.5 rounded-full">{property.id}</span>
                  <span className="w-0.5 h-0.5 rounded-full bg-gray-300" />
                  <span className="text-gray-400">{property.postedDate}</span>
                </p>
              </div>

              {/* Location with animated icon - smaller */}
              <div className="flex items-center gap-1.5 text-xs text-gray-600 group/location">
                <div className="p-1 bg-[#00695C]/8 rounded-lg group-hover/location:rotate-12 transition-transform duration-300">
                  <MapPin className="w-3 h-3 text-[#00695C]/70" />
                </div>
                <span className="font-medium truncate text-[10px] group-hover/location:text-[#00695C] transition-colors duration-300">{property.location}</span>
              </div>

              {/* Property Details Chips - smaller */}
              <div className="flex flex-wrap gap-1">
                {[
                  { icon: Building, label: property.type },
                  { icon: Layers, label: property.area },
                  { icon: Bed, label: property.bedrooms || 'N/A' }
                ].map((item, idx) => (
                  <span 
                    key={idx}
                    className="flex items-center gap-1 bg-[#00695C]/5 px-2 py-0.5 rounded-lg text-[9px] font-medium text-[#00695C]/80 border border-[#00695C]/8 hover:border-[#00695C]/20 transition-all duration-300 hover:scale-105 hover:shadow-sm"
                  >
                    <item.icon className="w-2.5 h-2.5" />
                    {item.label}
                  </span>
                ))}
              </div>

              {/* Features with animated tags - smaller */}
              {property.features && property.features.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {property.features.slice(0, 3).map((feature, idx) => (
                    <span 
                      key={idx} 
                      className="px-1.5 py-0.5 bg-[#00695C]/3 text-[#00695C]/70 rounded-lg text-[8px] font-medium border border-[#00695C]/8 hover:bg-[#00695C]/8 transition-all duration-300 hover:scale-105 hover:shadow-sm animate-fade-in"
                      style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                      {feature}
                    </span>
                  ))}
                  {property.features.length > 3 && (
                    <span className="px-1.5 py-0.5 bg-gray-50/80 text-gray-500 rounded-lg text-[8px] font-medium backdrop-blur-sm border border-gray-100">
                      +{property.features.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Content Section - Reduced padding */}
<div className="p-3 space-y-1.5" style={{ position: 'relative', zIndex: 5 }}>
  

  

  

  

  {/* Action Buttons - Direct handlers with explicit z-index */}
  <div className="flex items-center justify-between pt-1.5 border-t border-[#00695C]/8" style={{ position: 'relative', zIndex: 50 }}>
    <div className="flex items-center gap-1">
      <span className="text-[8px] text-gray-400 font-medium flex items-center gap-1 bg-gray-50/80 px-2 py-0.5 rounded-lg backdrop-blur-sm">
        <Calendar className="w-2.5 h-2.5 text-[#00695C]/60" />
        {property.postedDate}
      </span>
    </div>
    <div className="flex items-center gap-1" style={{ position: 'relative', zIndex: 999 }}>
      {/* View Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleViewDetails(property);
        }}
        className="p-1.5 bg-gradient-to-r from-[#00695C]/80 to-[#26A69A]/80 text-white rounded-lg hover:shadow-[0_0_12px_rgba(0,105,92,0.3)] transition-all duration-300 hover:scale-110 hover:-rotate-6 relative"
        title="View"
        type="button"
        style={{ cursor: 'pointer', pointerEvents: 'auto', zIndex: 999 }}
      >
        <ViewIcon className="w-3 h-3" />
      </button>

      {/* Edit Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleEditProperty(property);
        }}
        className="p-1.5 bg-gradient-to-r from-blue-400/80 to-blue-500/80 text-white rounded-lg hover:shadow-[0_0_12px_rgba(59,130,246,0.3)] transition-all duration-300 hover:scale-110 hover:-rotate-6 relative"
        title="Edit"
        type="button"
        style={{ cursor: 'pointer', pointerEvents: 'auto', zIndex: 999 }}
      >
        <Edit2 className="w-3 h-3" />
      </button>

      {/* Share Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleShareProperty(property);
        }}
        className="p-1.5 bg-gradient-to-r from-purple-400/80 to-purple-500/80 text-white rounded-lg hover:shadow-[0_0_12px_rgba(168,85,247,0.3)] transition-all duration-300 hover:scale-110 hover:-rotate-6 relative"
        title="Share"
        type="button"
        style={{ cursor: 'pointer', pointerEvents: 'auto', zIndex: 999 }}
      >
        <Share2 className="w-3 h-3" />
      </button>

      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleDeleteProperty(property);
        }}
        className="p-1.5 bg-gradient-to-r from-red-400/80 to-red-500/80 text-white rounded-lg hover:shadow-[0_0_12px_rgba(239,68,68,0.3)] transition-all duration-300 hover:scale-110 hover:-rotate-6 relative"
        title="Delete"
        type="button"
        style={{ cursor: 'pointer', pointerEvents: 'auto', zIndex: 999 }}
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  </div>
</div>
            </div>

            {/* Bottom animated gradient bar - light */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00695C]/0 via-[#26A69A]/30 to-[#00695C]/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-left" />
            
            {/* Light hover glow effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#00695C]/0 via-[#26A69A]/3 to-[#00695C]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </div>
        ))}
      </div>
    ) : (
      /* List View */
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b-2 border-gray-200 bg-gray-50">
              <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Property</th>
              <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
              <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
              <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Price</th>
              <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Area</th>
              <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Location</th>
              <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Views</th>
              <th className="text-right py-3 px-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredProperties.map((property) => (
              <tr 
                key={property.id}
                className="hover:bg-[#00695C]/3 transition-colors duration-200 group"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
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
                      <p className="font-bold text-sm text-gray-800 group-hover:text-[#00695C] transition-colors">
                        {property.name}
                      </p>
                      <p className="text-xs text-gray-500">{property.id}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-700 font-medium">{property.type}</span>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${
                    property.status === 'Active' ? 'bg-green-100 text-green-700' :
                    property.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {property.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm font-bold text-gray-800">{property.price}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-700">{property.area}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-700 truncate max-w-[150px] block">{property.location}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-700 font-medium">{property.views}</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => handleViewDetails(property)}
                      className="p-1.5 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-110"
                      title="View Details"
                    >
                      <ViewIcon className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleEditProperty(property)}
                      className="p-1.5 bg-blue-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-110"
                      title="Edit Property"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleShareProperty(property)}
                      className="p-1.5 bg-purple-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-110"
                      title="Share Property"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProperty(property)}
                      className="p-1.5 bg-red-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-110"
                      title="Delete Property"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
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
  /* Empty State */
  <div className="text-center py-12">
    <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
      <Home className="w-10 h-10 text-gray-400" />
    </div>
    <p className="text-gray-500 font-medium">No properties found</p>
    <p className="text-sm text-gray-400">
      {searchTerm || filterStatus !== 'all' 
        ? 'Try adjusting your search or filters' 
        : 'You haven\'t added any properties yet'}
    </p>
    {(searchTerm || filterStatus !== 'all') && (
      <button
        onClick={() => {
          setSearchTerm('');
          setFilterStatus('all');
        }}
        className="mt-3 px-4 py-2 bg-[#00695C] text-white rounded-xl text-sm font-bold hover:bg-[#005A4F] transition-all duration-300"
      >
        Clear Filters
      </button>
    )}
  </div>
)}

{/* Property Count */}
<div className="mt-4 pt-4 border-t-2 border-gray-100 flex justify-between text-xs text-gray-500">
  <span>Showing {filteredProperties.length} of {properties.length} properties</span>
  <span>Total Properties: {properties.length}</span>
</div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-3 mb-8 border border-[#00695C]/20 w-full overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {sections.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all duration-500 whitespace-nowrap relative group ${
                    isActive
                      ? 'text-white shadow-xl transform scale-105'
                      : 'text-gray-600 hover:text-[#00695C]'
                  }`}
                  style={{
                    background: isActive 
                      ? `linear-gradient(135deg, #00695C, #26A69A)`
                      : 'transparent'
                  }}
                >
                  {isActive && (
                    <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#00695C] to-[#26A69A] shadow-2xl animate-pulse-slow" />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon className={`w-4 h-4 transition-all duration-300 ${isActive ? 'text-white' : 'group-hover:text-[#00695C]'}`} />
                    {tab.title}
                    {isActive && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-[#00695C]/20 w-full relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#00695C]/5 to-[#26A69A]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-[#26A69A]/5 to-[#00695C]/5 rounded-full blur-3xl" />
          <div className="relative z-10">
            {renderSectionContent()}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        @keyframes floatDelayed {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(-5deg);
          }
        }
        @keyframes pulseSlow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.5;
          }
        }
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.4s ease-out forwards;
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out forwards;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: floatDelayed 7s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulseSlow 4s ease-in-out infinite;
        }
        .animate-bounce-in {
          animation: bounceIn 0.5s ease-out forwards;
        }
        .shadow-3xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        .border-3 {
          border-width: 3px;
        }

        @keyframes bubbleRise {
  0%   { transform: translateY(0) translateX(0) scale(0.6); opacity: 0; }
  8%   { opacity: .55; }
  85%  { opacity: .35; }
  100% { transform: translateY(-380px) translateX(var(--drift, 18px)) scale(1); opacity: 0; }
}
@keyframes spinSlow { to { transform: rotate(360deg); } }
@keyframes shimmerSweep { 0% { left: -60%; } 50%, 100% { left: 130%; } }
@keyframes riseIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.animate-bubble { animation-name: bubbleRise; animation-timing-function: linear; animation-iteration-count: infinite; }
.animate-spin-slow { animation: spinSlow 6s linear infinite; }
.animate-shimmer { animation: shimmerSweep 3.2s ease-in-out infinite; }
.animate-rise { opacity: 0; animation: riseIn 0.5s ease forwards; }

 @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(30px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes floatParticle {
    0%, 100% {
      transform: translateY(0) translateX(0) scale(1);
      opacity: 0;
    }
    10% {
      opacity: 0.6;
    }
    90% {
      opacity: 0.6;
    }
    100% {
      transform: translateY(-200px) translateX(var(--drift, 20px)) scale(1.5);
      opacity: 0;
    }
  }

  @keyframes pulseOnce {
    0% {
      transform: scale(0.8);
      opacity: 0;
    }
    50% {
      transform: scale(1.2);
      opacity: 1;
    }
    70% {
      transform: scale(0.9);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes fadeInTag {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes shimmerSweep {
    0% { left: -100%; }
    100% { left: 200%; }
  }

  .animate-fade-up {
    animation: fadeUp 0.6s ease-out forwards;
    opacity: 0;
  }

  .animate-float-particle {
    animation: floatParticle linear infinite;
  }

  .animate-pulse-once {
    animation: pulseOnce 0.6s ease-out forwards;
  }

  .animate-fade-in {
    animation: fadeInTag 0.3s ease-out forwards;
    opacity: 0;
  }

  .animate-shimmer-sweep {
    animation: shimmerSweep 3s ease-in-out infinite;
  }

  .shadow-3xl {
    box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.25), 0 15px 30px -10px rgba(0, 105, 92, 0.1);
  }

  .shadow-3xl:hover {
    box-shadow: 0 40px 80px -20px rgba(0, 105, 92, 0.3), 0 20px 40px -15px rgba(0, 105, 92, 0.15);
  }

  /* Glass morphism utilities */
  .glass {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.18);
  }
      `}</style>
    </div>
  );
};

export default OwnerProfile;