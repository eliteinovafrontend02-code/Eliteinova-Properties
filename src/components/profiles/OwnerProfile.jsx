

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
  Zap as ZapIcon, Rocket, Crown, Diamond
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const OwnerProfile = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('personal');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [showProfilePhotoDeleteConfirm, setShowProfilePhotoDeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // File input refs
  const fileInputRefs = useRef({});
  const profilePhotoInputRef = useRef(null);

  const [editForm, setEditForm] = useState({
    // Personal Details
    fullName: 'Rajesh Kumar',
    mobileNumber: '+91 98765 43210',
    emailAddress: 'rajesh.kumar@example.com',
    dateOfBirth: '1985-06-15',
    gender: 'Male',
    aadhaarNumber: '1234 5678 9012',
    panNumber: 'ABCDE1234F',
    
    // Address Details
    addressLine1: '123, Green Valley Apartments',
    addressLine2: 'Near City Center',
    city: 'Mumbai',
    district: 'Mumbai City',
    state: 'Maharashtra',
    pinCode: '400001',
    
    // Bank Details
    accountHolderName: 'Rajesh Kumar',
    bankName: 'State Bank of India',
    accountNumber: '1234567890',
    ifscCode: 'SBIN0001234',
    upiId: 'rajesh.kumar@upi',
    
    // Communication Preferences
    preferredMethods: ['Phone Call', 'WhatsApp'],
    preferredTimes: ['Morning', 'Evening'],
    additionalNotes: 'Prefer contact during business hours',
  });

  const [documents, setDocuments] = useState({
    // Identity Documents
    aadhaarCard: null,
    panCard: null,
    passportPhoto: null,
    
    // Property Images
    coverImage: null,
    propertyPhotos: [],
    propertyVideo: null,
    floorPlan: null,
    
    // Legal Documents
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

  // Handle navigation back
  const handleNavigateBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/dashboard');
    }
  };

  // Handle edit form changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle file upload
  const handleFileUpload = (field, file) => {
    if (file) {
      setDocuments(prev => ({
        ...prev,
        [field]: file
      }));
      showSuccessToast();
    }
  };

  // Handle multiple file upload
  const handleMultipleFileUpload = (field, files) => {
    const fileArray = Array.from(files);
    if (fileArray.length > 0) {
      setDocuments(prev => ({
        ...prev,
        [field]: [...prev[field], ...fileArray]
      }));
      showSuccessToast();
    }
  };

  // Handle file removal
  const removeFile = (field, index) => {
    setDeleteItem({ field, index });
    setShowDeleteConfirm(true);
  };

  // Confirm file removal
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

  // Handle profile photo delete
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

  // Toggle preferences
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

  // Handle profile photo upload
  const handleProfilePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload('passportPhoto', file);
    }
  };

  // Handle save
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

  // Show success toast
  const showSuccessToast = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Get file size
  const getFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // Get file icon
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

  const sections = [
    { id: 'personal', title: 'Personal Details', icon: User },
    { id: 'address', title: 'Address Details', icon: MapPin },
    { id: 'property', title: 'Property Images', icon: Image },
    { id: 'legal', title: 'Legal Documents', icon: FileText },
    { id: 'bank', title: 'Bank Details', icon: Banknote },
    { id: 'communication', title: 'Communication', icon: MessageCircle },
  ];

  // InfoCard with animations - Namma Theme
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

  // FileCard with animations - Namma Theme
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
                  value={editForm.dateOfBirth} 
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00695C]/5 via-teal-50/50 to-[#26A69A]/5 pt-20 pb-12 w-full relative overflow-hidden">
      {/* Animated Background Elements with Namma Theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#00695C]/10 to-[#26A69A]/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#26A69A]/10 to-[#00695C]/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-[#00695C]/5 to-[#26A69A]/5 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {/* Profile Photo Delete Confirmation Modal */}
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

      {/* File Delete Confirmation Modal */}
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

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn w-full mt-33">
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
                      <input
                        type={field.type || 'text'}
                        name={field.name}
                        value={editForm[field.name]}
                        onChange={handleEditChange}
                        className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-300"
                      />
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

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-55 right-4 z-50 bg-gradient-to-r from-[#00695C]/10 to-[#26A69A]/10 border-2 border-[#00695C]/30 rounded-2xl p-2 flex items-center gap-4 shadow-xl animate-slideDown max-w-md backdrop-blur-sm">
          <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-3 rounded-2xl animate-bounce-in">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-[#00695C] font-bold text-lg">Success!</p>
            <p className="text-[#00695C]/80 text-sm">Profile updated successfully!</p>
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
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 w-full hover:shadow-3xl transition-all duration-500 border border-[#00695C]/20 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00695C]/5 to-[#26A69A]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-[#00695C]/10 to-[#26A69A]/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-br from-[#26A69A]/10 to-[#00695C]/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 w-full relative z-10">
            {/* Profile Photo */}
            <div className="relative flex-shrink-0 group/photo">
              <div className="w-36 h-36 rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#00695C]/20 to-[#26A69A]/20 flex items-center justify-center ring-4 ring-white/50 group-hover/photo:ring-[#00695C]/30 transition-all duration-500">
                {documents.passportPhoto ? (
                  <img 
                    src={URL.createObjectURL(documents.passportPhoto)} 
                    alt={editForm.fullName} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-6xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                    {editForm.fullName.charAt(0)}
                  </span>
                )}
              </div>
              
              {/* Delete button */}
              {documents.passportPhoto && (
                <button 
                  onClick={handleProfilePhotoDelete}
                  className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-lg hover:bg-red-500 text-gray-600 hover:text-white transition-all duration-300 hover:scale-110 hover:rotate-12 z-20"
                  aria-label="Delete profile photo"
                  title="Delete Profile Photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
              
              {/* Camera button */}
              <button 
                onClick={() => profilePhotoInputRef.current?.click()}
                className="absolute bottom-2 right-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white p-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:rotate-12 z-20"
                aria-label="Upload profile photo"
                title="Upload Profile Photo"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                ref={profilePhotoInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleProfilePhotoUpload}
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left w-full">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                <h2 className="text-3xl font-bold text-gray-800">{editForm.fullName}</h2>
                <span className="bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white px-4 py-1 rounded-full text-xs font-bold animate-pulse">
                  Verified Owner
                </span>
              </div>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-2 bg-[#00695C]/5 px-4 py-2 rounded-2xl shadow-sm border border-[#00695C]/10">
                  <MapPin className="w-4 h-4 text-[#00695C]" /> {editForm.city}, {editForm.state}
                </span>
                <span className="flex items-center gap-2 bg-[#00695C]/5 px-4 py-2 rounded-2xl shadow-sm border border-[#00695C]/10">
                  <Phone className="w-4 h-4 text-[#00695C]" /> {editForm.mobileNumber}
                </span>
                <span className="flex items-center gap-2 bg-[#00695C]/5 px-4 py-2 rounded-2xl shadow-sm border border-[#00695C]/10">
                  <Mail className="w-4 h-4 text-[#00695C]" /> {editForm.emailAddress}
                </span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <span className="flex items-center gap-2 bg-gradient-to-r from-[#00695C]/10 to-[#26A69A]/10 text-[#00695C] px-4 py-2 rounded-2xl text-xs font-bold shadow-sm hover:scale-105 transition-transform duration-300 border border-[#00695C]/20">
                  <Shield className="w-3.5 h-3.5" /> Aadhaar: {editForm.aadhaarNumber}
                </span>
                <span className="flex items-center gap-2 bg-gradient-to-r from-[#00695C]/10 to-[#26A69A]/10 text-[#00695C] px-4 py-2 rounded-2xl text-xs font-bold shadow-sm hover:scale-105 transition-transform duration-300 border border-[#00695C]/20">
                  <CreditCard className="w-3.5 h-3.5" /> PAN: {editForm.panNumber}
                </span>
                <span className="flex items-center gap-2 bg-gradient-to-r from-[#00695C]/10 to-[#26A69A]/10 text-[#00695C] px-4 py-2 rounded-2xl text-xs font-bold shadow-sm hover:scale-105 transition-transform duration-300 border border-[#00695C]/20">
                  <Building className="w-3.5 h-3.5" /> Bank: {editForm.bankName}
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
      `}</style>
    </div>
  );
};

export default OwnerProfile;

// sucess