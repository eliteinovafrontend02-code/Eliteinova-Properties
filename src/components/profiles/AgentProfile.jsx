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
  File, FolderOpen, FileImage, FileSpreadsheet, FileArchive, ImagePlus,
  BriefcaseBusiness, Store, Globe2, Hash, IdCard, BadgeCheck,
  Link as LinkIcon, Share2, UsersRound, TrendingUp, PieChart,
  BarChart3, Activity, Building2, PenTool, Lock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

// ============ TOGGLE SWITCH COMPONENT ============
const ToggleSwitch = ({ isOn, onToggle, size = 'sm' }) => {
  const sizes = {
    sm: {
      container: 'w-8 h-4',
      circle: 'w-3 h-3',
      translate: 'translate-x-4',
    },
    md: {
      container: 'w-10 h-5',
      circle: 'w-4 h-4',
      translate: 'translate-x-5',
    },
    lg: {
      container: 'w-12 h-6',
      circle: 'w-5 h-5',
      translate: 'translate-x-6',
    },
  };

  const selectedSize = sizes[size] || sizes.sm;

  return (
    <button
      type="button"
      className={`relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#00695C] focus:ring-offset-2 ${
        isOn ? 'bg-[#00695C]' : 'bg-gray-300'
      } ${selectedSize.container}`}
      onClick={onToggle}
      role="switch"
      aria-checked={isOn}
    >
      <span
        className={`pointer-events-none inline-block transform rounded-full bg-white shadow-lg ring-0 transition-all duration-300 ease-in-out ${
          isOn ? selectedSize.translate : 'translate-x-0'
        } ${selectedSize.circle}`}
      />
    </button>
  );
};

// ============ PDF VIEWER MODAL ============
const PdfViewerModal = ({ file, onClose }) => {
  if (!file) return null;

  const fileUrl = typeof file === 'string' ? file : URL.createObjectURL(file);
  const fileName = typeof file === 'string' ? file.split('/').pop() || 'document.pdf' : file.name || 'document.pdf';

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 backdrop-blur-md animate-fadeIn p-4">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-white" />
            <h3 className="text-white font-bold text-lg truncate max-w-md">{fileName}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-all duration-300 hover:rotate-90 hover:scale-110"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-auto bg-gray-100 p-4">
          <embed src={fileUrl} type="application/pdf" className="w-full h-full min-h-[70vh]" />
        </div>
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center flex-shrink-0">
          <span className="text-sm text-gray-500">{fileName}</span>
          <button
            onClick={() => window.open(fileUrl, '_blank')}
            className="flex items-center gap-2 px-4 py-2 bg-[#00695C] text-white rounded-xl text-sm font-bold hover:bg-[#005A4F] transition-all duration-300"
          >
            <ExternalLink className="w-4 h-4" />
            Open in New Tab
          </button>
        </div>
      </div>
    </div>
  );
};

// ============ MEDIA LIGHTBOX MODAL ============
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

// ============ PROPERTY DETAILS MODAL ============
const PropertyDetailsModal = ({ property, onClose, onAddImages, onRemoveImage, onToggleStatus, onEdit, onDelete }) => {
  if (!property) return null;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const detailImageInputRef = useRef(null);
  const rawImages = property.images || [];
  const hasImages = rawImages.length > 0;
  const images = hasImages ? rawImages : ['https://via.placeholder.com/400x300/CCCCCC/666666?text=No+Image'];

  useEffect(() => {
    if (currentImageIndex >= images.length) {
      setCurrentImageIndex(Math.max(0, images.length - 1));
    }
  }, [images.length]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleAddImagesChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onAddImages(property.id, files);
    }
    e.target.value = '';
  };

  const handleDeleteImage = (idx) => {
    onRemoveImage(property.id, idx);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-scaleIn">
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

        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          <div className="relative rounded-xl overflow-hidden bg-gray-100 h-56 sm:h-64">
            <img 
              src={images[currentImageIndex]} 
              alt={property.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x300/CCCCCC/666666?text=No+Image';
              }}
            />
            
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
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2.5 py-0.5 rounded-full">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}

            {hasImages && (
              <button
                onClick={() => handleDeleteImage(currentImageIndex)}
                title="Delete this image"
                className="absolute bottom-2 left-2 flex items-center gap-1 bg-red-500/90 hover:bg-red-600 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Trash2 className="w-3 h-3" />
                Delete
              </button>
            )}

            <div className="absolute top-2 right-2 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-2.5 py-1.5 rounded-xl">
              <span className="text-white text-[10px] font-bold">
                {property.status === 'Active' ? 'ON' : 'OFF'}
              </span>
              <ToggleSwitch 
                isOn={property.status === 'Active'} 
                onToggle={() => onToggleStatus(property)}
                size="sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-[10px] text-gray-500 font-medium">
              {hasImages ? `${images.length} image${images.length > 1 ? 's' : ''}` : 'No images uploaded yet'}
            </p>
            <button
              onClick={() => detailImageInputRef.current?.click()}
              className="flex items-center gap-1.5 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Upload className="w-3 h-3" />
              Add Image
            </button>
            <input
              ref={detailImageInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleAddImagesChange}
            />
          </div>

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

          {property.description && (
            <div className="bg-gray-50 rounded-lg p-3">
              <h3 className="text-[11px] font-bold text-gray-700 mb-1">Description</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{property.description}</p>
            </div>
          )}

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
        </div>

        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 rounded-b-2xl flex flex-wrap gap-2.5 flex-shrink-0">
          <button 
            onClick={() => {
              onClose();
              onEdit(property);
            }}
            className="flex-1 min-w-[100px] px-4 py-2.5 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Edit Property
          </button>
          <button 
            onClick={() => {
              onClose();
              onDelete(property);
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

// ============ DELETE PROPERTY CONFIRM MODAL ============
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

// ============ EDIT PROPERTY MODAL ============
const EditPropertyModal = ({ property, onSave, onCancel }) => {
  if (!property) return null;

  const editSteps = ['Property Details', 'Pricing & Amenities', 'Media Upload'];

  const [localStep, setLocalStep] = useState(0);
  const [localProperty, setLocalProperty] = useState({ ...property });
  const [localCustomAmenities, setLocalCustomAmenities] = useState([]);
  const [localImagePreviews, setLocalImagePreviews] = useState([]);
  const [localCoverPreview, setLocalCoverPreview] = useState(null);
  const [localVideoPreview, setLocalVideoPreview] = useState(null);
  const [localCoverImage, setLocalCoverImage] = useState(null);
  const [localVideoFile, setLocalVideoFile] = useState(null);
  const [newImageFiles, setNewImageFiles] = useState([]);

  const availableAmenities = [
    "Gated Community", "24/7 Security", "Power Backup", "CCTV Surveillance",
    "24/7 Water Supply", "Wi-Fi Ready", "Children's Play Area", "Gym / Fitness Center",
    "Balcony / Terrace", "Lift / Elevator", "Visitor Parking", "Nearby School / Hospital",
    "Swimming Pool", "Garden", "Smart Home", "Sea View", "Lake View", "City View"
  ];

  useEffect(() => {
    setLocalProperty({ ...property });
    if (property.selectedAmenities) {
      const custom = property.selectedAmenities.filter(a => !availableAmenities.includes(a));
      setLocalCustomAmenities(custom);
    }
    if (property.images && property.images.length > 0) {
      setLocalImagePreviews(property.images.map(img => img));
    }
    if (property.coverImage) {
      setLocalCoverPreview(property.coverImage);
    }
    if (property.propertyVideo) {
      setLocalVideoPreview(property.propertyVideo);
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

  const handleLocalImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = Math.max(0, 3 - localImagePreviews.length);
    if (files.length > remainingSlots) {
      alert(`You can only upload ${remainingSlots} more image(s). Maximum 3 images allowed.`);
    }
    const limitedFiles = files.slice(0, remainingSlots);
    const newPreviews = limitedFiles.map(file => URL.createObjectURL(file));
    setLocalImagePreviews([...localImagePreviews, ...newPreviews]);
    setNewImageFiles([...newImageFiles, ...limitedFiles]);
  };

  const removeLocalImage = (index) => {
    const newPreviews = localImagePreviews.filter((_, i) => i !== index);
    setLocalImagePreviews(newPreviews);
    const newFiles = newImageFiles.filter((_, i) => i !== index);
    setNewImageFiles(newFiles);
  };

  const handleLocalCoverImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Cover image must be less than 2MB');
        return;
      }
      setLocalCoverPreview(URL.createObjectURL(file));
      setLocalCoverImage(file);
    }
  };

  const removeLocalCoverImage = () => {
    if (localCoverPreview) URL.revokeObjectURL(localCoverPreview);
    setLocalCoverPreview(null);
    setLocalCoverImage(null);
  };

  const handleLocalVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('Video must be less than 10MB');
        return;
      }
      setLocalVideoPreview(URL.createObjectURL(file));
      setLocalVideoFile(file);
    }
  };

  const removeLocalVideo = () => {
    if (localVideoPreview) URL.revokeObjectURL(localVideoPreview);
    setLocalVideoPreview(null);
    setLocalVideoFile(null);
  };

  const handleLocalNext = () => {
    setLocalStep(prev => prev + 1);
  };

  const handleLocalBack = () => {
    setLocalStep(prev => prev - 1);
  };

  const handleLocalSave = () => {
    const updatedProperty = {
      ...localProperty,
    };
    
    let finalImages = [...localImagePreviews];
    
    if (newImageFiles.length > 0) {
      const newUrls = newImageFiles.map(f => URL.createObjectURL(f));
      finalImages = [...finalImages, ...newUrls];
    }
    
    if (localCoverImage) {
      const coverUrl = URL.createObjectURL(localCoverImage);
      finalImages = [coverUrl, ...finalImages.filter((_, i) => i !== 0)];
      updatedProperty.coverImage = localCoverImage;
    }
    
    updatedProperty.images = finalImages;
    
    if (localVideoFile) {
      updatedProperty.propertyVideo = localVideoFile;
    }
    
    onSave(updatedProperty);
  };

  const renderStepContent = () => {
    if (localStep === 0) {
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-0.5">Property Title / Name</label>
              <input
                type="text"
                value={localProperty.name || ''}
                onChange={(e) => handleLocalChange('name', e.target.value)}
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
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">Property Type</label>
            <div className="space-y-1.5">
              {['Independent House', 'Independent Villa', 'Duplex Residential Unit', 'Apartment', 'Commercial', 'Land'].map(type => (
                <label key={type} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="propertyType"
                    className="accent-[#00695C] w-4 h-4 cursor-pointer"
                    checked={localProperty.type === type}
                    onChange={() => handleLocalChange('type', type)}
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">Property Address</label>
            <textarea
              value={localProperty.location || ''}
              onChange={(e) => handleLocalChange('location', e.target.value)}
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
              onChange={(e) => handleLocalChange('propertyCity', e.target.value)}
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
                onChange={(e) => handleLocalChange('builtUpArea', e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                placeholder="Build-up Area (sq ft)"
              />
              <input
                type="number"
                value={localProperty.carpetArea || ''}
                onChange={(e) => handleLocalChange('carpetArea', e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                placeholder="Carpet Area (sq ft)"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-0.5">Bedrooms</label>
              <input
                type="number"
                value={localProperty.bedrooms || ''}
                onChange={(e) => handleLocalChange('bedrooms', e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                placeholder="Number of bedrooms"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-0.5">Bathrooms</label>
              <input
                type="number"
                value={localProperty.bathrooms || ''}
                onChange={(e) => handleLocalChange('bathrooms', e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
                placeholder="Number of bathrooms"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">Furnishing Status</label>
            <div className="space-y-1.5">
              {['Full Furnish', 'Semi Furnish', 'Unfurnished'].map(f => (
                <label key={f} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="furnishing"
                    className="accent-[#00695C] w-4 h-4 cursor-pointer"
                    checked={localProperty.furnishing === f}
                    onChange={() => handleLocalChange('furnishing', f)}
                  />
                  {f}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">Parking Facility</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="parking"
                  className="accent-[#00695C] w-4 h-4 cursor-pointer"
                  checked={localProperty.parking === 'yes' || localProperty.parking === 'Yes'}
                  onChange={() => handleLocalChange('parking', 'yes')}
                />
                Yes, available
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="parking"
                  className="accent-[#00695C] w-4 h-4 cursor-pointer"
                  checked={localProperty.parking === 'no' || localProperty.parking === 'No'}
                  onChange={() => handleLocalChange('parking', 'no')}
                />
                No parking
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">Status</label>
            <select
              value={localProperty.status || 'Active'}
              onChange={(e) => handleLocalChange('status', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">Description</label>
            <textarea
              value={localProperty.description || ''}
              onChange={(e) => handleLocalChange('description', e.target.value)}
              rows="3"
              className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all resize-y"
              placeholder="Enter property description..."
            />
          </div>
        </div>
      );
    } else if (localStep === 1) {
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">Listing Purpose</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="listingPurpose"
                  className="accent-[#00695C] w-4 h-4 cursor-pointer"
                  checked={localProperty.listingPurpose === 'rent' || localProperty.listingPurpose === 'For Rent'}
                  onChange={() => handleLocalChange('listingPurpose', 'rent')}
                />
                For Rent
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">Expected Rent (₹/month)</label>
            <input
              type="text"
              value={localProperty.expectedPrice || localProperty.price?.replace(/[^0-9]/g, '') || ''}
              onChange={(e) => handleLocalChange('expectedPrice', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
              placeholder="e.g. 15,000"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">Budget Range (₹/month)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                value={localProperty.budgetRange?.min || ''}
                onChange={(e) => handleLocalChange('budgetRange', { ...localProperty.budgetRange, min: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
              />
              <input
                type="number"
                placeholder="Max"
                value={localProperty.budgetRange?.max || ''}
                onChange={(e) => handleLocalChange('budgetRange', { ...localProperty.budgetRange, max: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">Price Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="priceType"
                  className="accent-[#00695C] w-4 h-4 cursor-pointer"
                  checked={localProperty.priceType === 'fixed'}
                  onChange={() => handleLocalChange('priceType', 'fixed')}
                />
                Fixed Price
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="priceType"
                  className="accent-[#00695C] w-4 h-4 cursor-pointer"
                  checked={localProperty.priceType === 'negotiable'}
                  onChange={() => handleLocalChange('priceType', 'negotiable')}
                />
                Negotiable
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">Maintenance Charges (₹/month)</label>
            <input
              type="text"
              value={localProperty.maintenance || ''}
              onChange={(e) => handleLocalChange('maintenance', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
              placeholder="Enter monthly maintenance"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">Available From</label>
            <input
              type="date"
              value={localProperty.availableFrom || ''}
              onChange={(e) => handleLocalChange('availableFrom', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
            />
          </div>

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

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">Other Amenities</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={localProperty.otherAmenities || ''}
                onChange={(e) => handleLocalChange('otherAmenities', e.target.value)}
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
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">Features (comma separated)</label>
            <input
              type="text"
              value={localProperty.features?.join(', ') || ''}
              onChange={(e) => {
                const features = e.target.value.split(',').map(f => f.trim());
                handleLocalChange('features', features);
              }}
              className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 outline-none transition-all"
              placeholder="2 BHK, Sea View, Parking, etc."
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b-2 border-green-50">
            <div className="w-1 h-4 bg-[#00695C] rounded" />
            <h3 className="text-sm font-bold text-[#00695C]">Media Upload</h3>
          </div>
          <p className="text-xs text-gray-400 mb-3">📸 Upload property images and media</p>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Upload Cover Image</label>
            <div className="border-2 border-dashed border-teal-300 rounded-xl p-4 text-center hover:bg-green-50 transition-colors">
              <input type="file" accept="image/*" className="hidden" id="edit-cover" onChange={handleLocalCoverImageUpload} />
              <label htmlFor="edit-cover" className="cursor-pointer flex flex-col items-center">
                <ImagePlus className="mx-auto mb-2 w-8 h-8 text-[#00695C]" />
                <span className="text-sm font-semibold text-[#00695C]">Upload Cover Image</span>
                <span className="text-xs text-gray-400 mt-1">JPG, PNG (Max 2MB)</span>
              </label>
            </div>
            {localCoverPreview && (
              <div className="mt-2 relative">
                <img src={localCoverPreview} alt="Cover" className="w-full h-24 object-cover rounded-lg border border-gray-200" />
                <button onClick={removeLocalCoverImage} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600">✕</button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Upload Property Photos (Max 3)</label>
            <div className="border-2 border-dashed border-teal-300 rounded-xl p-4 text-center hover:bg-green-50 transition-colors">
              <input type="file" accept="image/*" multiple className="hidden" id="edit-photos" onChange={handleLocalImageUpload} disabled={localImagePreviews.length >= 3} />
              <label htmlFor="edit-photos" className={`cursor-pointer flex flex-col items-center ${localImagePreviews.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <ImagePlus className="mx-auto mb-2 w-8 h-8 text-[#00695C]" />
                <span className="text-sm font-semibold text-[#00695C]">Upload Property Photos</span>
                <span className="text-xs text-gray-400 mt-1">Max 3 photos</span>
              </label>
            </div>
            {localImagePreviews.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {localImagePreviews.map((preview, idx) => (
                  <div key={idx} className="relative">
                    <img src={preview} alt={`Preview ${idx + 1}`} className="w-full h-20 object-cover rounded-lg border border-gray-200" />
                    <button onClick={() => removeLocalImage(idx)} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600">✕</button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-400 mt-2">{localImagePreviews.length}/3 images uploaded</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Upload Property Video (Optional)</label>
            <div className="border-2 border-dashed border-teal-300 rounded-xl p-4 text-center hover:bg-green-50 transition-colors">
              <input type="file" accept="video/mp4,video/mov" className="hidden" id="edit-video" onChange={handleLocalVideoUpload} />
              <label htmlFor="edit-video" className="cursor-pointer flex flex-col items-center">
                <Video className="mx-auto mb-2 w-8 h-8 text-[#00695C]" />
                <span className="text-sm font-semibold text-[#00695C]">Upload Property Video Tour</span>
                <span className="text-xs text-gray-400 mt-1">MP4/MOV (Max 10MB)</span>
              </label>
            </div>
            {localVideoPreview && (
              <div className="mt-2 relative">
                <video src={localVideoPreview} controls className="w-full h-32 object-cover rounded-lg border border-gray-200" />
                <button onClick={removeLocalVideo} className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full text-sm flex items-center justify-center hover:bg-red-600">✕</button>
              </div>
            )}
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
            onClick={onCancel}
            className="text-white/80 hover:text-white transition-all duration-300 hover:rotate-90 hover:scale-110"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

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
              onClick={onCancel}
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

// ============ AGENT PROFILE COMPONENT ============
const AgentProfile = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('personal');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [showProfilePhotoDeleteConfirm, setShowProfilePhotoDeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [pdfToView, setPdfToView] = useState(null);
  const [showMediaLightbox, setShowMediaLightbox] = useState(false);
  const [lightboxItems, setLightboxItems] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showPropertyDetails, setShowPropertyDetails] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showEditPropertyModal, setShowEditPropertyModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [showDeletePropertyConfirm, setShowDeletePropertyConfirm] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  
  const profilePhotoInputRef = useRef(null);
  const agencyLogoInputRef = useRef(null);
  const fileInputRefs = useRef({});

  // ============ PROPERTIES STATE ============
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
      images: [
        '/villa1_1.png',
        '/villa1_2.png',
        '/villa1_3.png',
        '/villa1_4.png'
      ],
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
      listedBy: 'agent',
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
      listedBy: 'agent',
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
  ]);

  // ============ FORM STATE ============
  const [editForm, setEditForm] = useState({
    // Personal Details
    fullName: 'Amit Sharma',
    mobileNumber: '+91 98765 43210',
    emailAddress: 'amit.sharma@realestate.com',
    dateOfBirth: '15-03-1990',
    gender: 'Male',

    // Business Information
    agencyName: 'Sharma Realty & Associates',
    reraRegistrationNumber: 'RERA/2025/MH/12345',
    gstNumber: '22ABCDE1234F1Z5',
    yearsOfExperience: '8',
    numberOfActiveListings: '45',
    serviceAreas: 'Mumbai, Pune, Navi Mumbai, Thane',
    officeAddress: 'Office No. 201, Crystal Tower, Andheri East, Mumbai - 400093',

    // Identity Verification
    aadhaarNumber: '1234 5678 9012',
    panNumber: 'ABCDE1234F',

    // Contact Information
    city: 'Mumbai',
    district: 'Mumbai City',
    state: 'Maharashtra',
    pinCode: '400093',
    website: 'www.sharmarealty.com',
    whatsappNumber: '+91 98765 43211',

    // Bank Details
    accountHolderName: 'Amit Sharma',
    bankName: 'State Bank of India',
    accountNumber: '123456789012',
    ifscCode: 'SBIN0001234',
    upiId: 'amit.sharma@upi',

    // Social Media
    facebookPage: 'facebook.com/sharmarealty',
    instagram: 'instagram.com/sharmarealty',
    linkedIn: 'linkedin.com/in/amitsharma',
    youtubeChannel: 'youtube.com/sharmarealty',

    // Login Credentials
    username: 'amit.sharma',
    emailAddressLogin: 'amit.sharma@realestate.com',
    mobileNumberLogin: '+91 98765 43210',
    password: '********',
    confirmPassword: '********',
  });

  // ============ DOCUMENTS STATE ============
  const [documents, setDocuments] = useState({
    profilePhoto: null,
    agencyLogo: null,
    aadhaarCard: null,
    panCard: null,
    reraCertificate: null,
    gstCertificate: null,
    businessRegistrationCertificate: null,
  });

  // ============ TOAST HANDLER ============
  const showSuccessToast = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // ============ FILE UPLOAD HANDLERS ============
  const handleFileUpload = (field, file) => {
    if (file) {
      setDocuments(prev => ({
        ...prev,
        [field]: file
      }));
      showSuccessToast();
    }
  };

  const handleProfilePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload('profilePhoto', file);
    }
  };

  const handleAgencyLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload('agencyLogo', file);
    }
  };

  const handlePdfUpload = (field, file) => {
    if (file) {
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        setDocuments(prev => ({
          ...prev,
          [field]: file
        }));
        showSuccessToast();
      } else {
        alert('Please upload a valid PDF file.');
      }
    }
  };

  const handlePdfView = (field) => {
    const file = documents[field];
    if (file) {
      setPdfToView(file);
      setShowPdfViewer(true);
    }
  };

  const handlePdfDelete = (field) => {
    setDeleteItem({ field });
    setShowDeleteConfirm(true);
  };

  const removeFile = (field) => {
    setDeleteItem({ field });
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (deleteItem) {
      const { field } = deleteItem;
      setDocuments(prev => ({
        ...prev,
        [field]: null
      }));
      if (fileInputRefs.current[field]) {
        fileInputRefs.current[field].value = '';
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

  // ============ FORM CHANGE HANDLER ============
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

  // ============ NAVIGATION ============
  const handleNavigateBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/dashboard');
    }
  };

  // ============ SAVE HANDLER ============
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
    row('RERA Number', editForm.reraRegistrationNumber);
    row('GST Number', editForm.gstNumber);
    row('Years of Experience', editForm.yearsOfExperience);
    row('Active Listings', editForm.numberOfActiveListings);
    row('Service Areas', editForm.serviceAreas);
    y += 4;

    section('Identity & Contact');
    row('Aadhaar Number', editForm.aadhaarNumber);
    row('PAN Number', editForm.panNumber);
    row('Office Address', editForm.officeAddress);
    row('City', editForm.city);
    row('State', editForm.state);
    row('PIN Code', editForm.pinCode);
    row('Website', editForm.website);
    row('WhatsApp', editForm.whatsappNumber);
    y += 4;

    section('Bank Details');
    row('Account Holder', editForm.accountHolderName);
    row('Bank Name', editForm.bankName);
    row('Account Number', editForm.accountNumber);
    row('IFSC Code', editForm.ifscCode);
    row('UPI ID', editForm.upiId);

    // Property Summary
    section('Properties Summary');
    row('Total Properties', properties.length);
    row('Active Listings', properties.filter(p => p.status === 'Active').length);

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('This is a system-generated document.', 14, 287);

    doc.save(`Invoice_${editForm.fullName.replace(/\s+/g, '_')}.pdf`);
  };

  // ============ SECTION DEFINITIONS ============
const sections = [
  { id: 'personal', title: 'Personal Details', icon: User },
  { id: 'business', title: 'Business Information', icon: Briefcase },
  { id: 'identity', title: 'Identity Verification', icon: Shield },
  { id: 'documents', title: 'Upload Documents', icon: FileText },
  { id: 'bank', title: 'Bank Details', icon: Banknote },
  { id: 'social', title: 'Social Media', icon: Share2 },
  { id: 'login', title: 'Login Credentials', icon: Settings },
  { id: 'contact', title: 'Contact Information', icon: MapPin },
];

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

  const getFileStatusLabel = (field) => {
    const file = documents[field];
    return file !== null && file !== undefined ? 'Uploaded' : null;
  };

  // ============ PROPERTY HANDLERS ============
  const handleViewDetails = (property) => {
    setSelectedProperty(property);
    setShowPropertyDetails(true);
  };

  const handleEditProperty = (property) => {
    setEditingProperty({ ...property });
    setShowEditPropertyModal(true);
  };

  const handleToggleStatus = (property) => {
    const newStatus = property.status === 'Active' ? 'Inactive' : 'Active';
    setProperties(prev => 
      prev.map(p => 
        p.id === property.id 
          ? { ...p, status: newStatus } 
          : p
      )
    );
    showSuccessToast();
  };

  const handleAddPropertyImages = (propertyId, files) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;
    const newUrls = fileArray.map((f) => URL.createObjectURL(f));

    setProperties(prev =>
      prev.map(p => p.id === propertyId ? { ...p, images: [...(p.images || []), ...newUrls] } : p)
    );
    setSelectedProperty(prev =>
      prev && prev.id === propertyId ? { ...prev, images: [...(prev.images || []), ...newUrls] } : prev
    );
    showSuccessToast();
  };

  const handleRemovePropertyImage = (propertyId, imageIndex) => {
    setProperties(prev =>
      prev.map(p => p.id === propertyId ? { ...p, images: (p.images || []).filter((_, i) => i !== imageIndex) } : p)
    );
    setSelectedProperty(prev =>
      prev && prev.id === propertyId ? { ...prev, images: (prev.images || []).filter((_, i) => i !== imageIndex) } : prev
    );
    showSuccessToast();
  };

  const handleSavePropertyEdit = (updatedProperty) => {
    if (updatedProperty) {
      setProperties(prev => 
        prev.map(p => p.id === updatedProperty.id ? updatedProperty : p)
      );
    }
    setShowEditPropertyModal(false);
    setEditingProperty(null);
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

  // ============ RENDER HELPERS ============
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

  // ============ SECTION CONTENT RENDER ============
  const renderSectionContent = () => {
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
                <AnimatedCard label="Profile Photo" icon={<Camera className="w-4 h-4" />} delay={0.4}>
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
          editForm.numberOfActiveListings,
          editForm.serviceAreas,
          editForm.officeAddress,
          documents.agencyLogo
        ];
        const filledCount = businessFields.filter(Boolean).length;

        return (
          <div className="w-full animate-slideUp">
            <SectionHeader
              title="Business Information"
              subtitle="Manage your agency and business details"
              filled={filledCount}
              total={businessFields.length}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 w-full">
              <div className="space-y-3 w-full">
                <AnimatedCard label="Agency Name" value={editForm.agencyName} icon={<Building className="w-4 h-4" />} delay={0.05} />
                <AnimatedCard label="RERA Registration Number" value={editForm.reraRegistrationNumber} icon={<BadgeCheck className="w-4 h-4" />} delay={0.12} />
                <AnimatedCard label="GST Number" value={editForm.gstNumber || 'Not provided'} icon={<Hash className="w-4 h-4" />} delay={0.19} />
                <AnimatedCard label="Years of Experience" value={editForm.yearsOfExperience} icon={<Award className="w-4 h-4" />} delay={0.26} />
              </div>
              <div className="space-y-3 w-full">
                <AnimatedCard label="Number of Active Listings" value={editForm.numberOfActiveListings} icon={<TrendingUp className="w-4 h-4" />} delay={0.33} />
                <AnimatedCard label="Service Areas" value={editForm.serviceAreas} icon={<Globe className="w-4 h-4" />} delay={0.4} />
                <AnimatedCard label="Office Address" value={editForm.officeAddress} icon={<MapPin className="w-4 h-4" />} delay={0.47} />
                <AnimatedCard label="Agency Logo" icon={<Image className="w-4 h-4" />} delay={0.54}>
                  <div className="flex items-center gap-2">
                    {documents.agencyLogo ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-[#00695C] font-bold bg-gradient-to-r from-[#00695C]/10 to-[#26A69A]/10 px-3 py-1.5 rounded-lg border border-[#00695C]/20 animate-fadeIn">
                        <Check className="w-3.5 h-3.5" />
                        Uploaded
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 font-medium italic">No logo uploaded</span>
                    )}
                  </div>
                </AnimatedCard>
              </div>
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
          documents.businessRegistrationCertificate,
          documents.reraCertificate
        ];
        const filledCount = identityFields.filter(Boolean).length;

        return (
          <div className="w-full animate-slideUp">
            <SectionHeader
              title="Identity Verification"
              subtitle="Your identity and verification documents"
              filled={filledCount}
              total={identityFields.length}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 w-full">
              <div className="space-y-3 w-full">
                <AnimatedCard label="Aadhaar Number" value={editForm.aadhaarNumber} icon={<IdCard className="w-4 h-4" />} delay={0.05} />
                <AnimatedCard label="PAN Number" value={editForm.panNumber} icon={<CreditCard className="w-4 h-4" />} delay={0.12} />
              </div>
              <div className="space-y-3 w-full">
                <AnimatedCard label="Upload Aadhaar Card" icon={<FileCheck className="w-4 h-4" />} delay={0.19}>
                  {documents.aadhaarCard ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePdfView('aadhaarCard')}
                        className="text-xs text-[#00695C] font-bold hover:underline flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3" />
                        View Document
                      </button>
                      <button
                        onClick={() => handlePdfDelete('aadhaarCard')}
                        className="text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400 font-medium italic">Not uploaded</span>
                  )}
                </AnimatedCard>
                <AnimatedCard label="Upload PAN Card" icon={<FileCheck className="w-4 h-4" />} delay={0.26}>
                  {documents.panCard ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePdfView('panCard')}
                        className="text-xs text-[#00695C] font-bold hover:underline flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3" />
                        View Document
                      </button>
                      <button
                        onClick={() => handlePdfDelete('panCard')}
                        className="text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400 font-medium italic">Not uploaded</span>
                  )}
                </AnimatedCard>
                <AnimatedCard label="Business Registration Certificate" icon={<FileCheck className="w-4 h-4" />} delay={0.33}>
                  {documents.businessRegistrationCertificate ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePdfView('businessRegistrationCertificate')}
                        className="text-xs text-[#00695C] font-bold hover:underline flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3" />
                        View Document
                      </button>
                      <button
                        onClick={() => handlePdfDelete('businessRegistrationCertificate')}
                        className="text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400 font-medium italic">Not uploaded</span>
                  )}
                </AnimatedCard>
                <AnimatedCard label="RERA Certificate" icon={<FileCheck className="w-4 h-4" />} delay={0.4}>
                  {documents.reraCertificate ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePdfView('reraCertificate')}
                        className="text-xs text-[#00695C] font-bold hover:underline flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3" />
                        View Document
                      </button>
                      <button
                        onClick={() => handlePdfDelete('reraCertificate')}
                        className="text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400 font-medium italic">Not uploaded</span>
                  )}
                </AnimatedCard>
              </div>
            </div>
          </div>
        );
      }
        
       case 'documents': {
        const docFields = [
          'profilePhoto',
          'agencyLogo',
          'aadhaarCard',
          'panCard',
          'reraCertificate',
          'gstCertificate',
          'businessRegistrationCertificate'
        ];
        const filledCount = docFields.filter(f => {
          const v = documents[f];
          return v !== null && v !== undefined;
        }).length;

        return (
          <div className="w-full animate-slideUp">
            <SectionHeader
              title="Upload Documents"
              subtitle="All your important documents in one place"
              filled={filledCount}
              total={docFields.length}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 w-full">
              {[
                { field: 'profilePhoto', label: 'Profile Photo', icon: <Camera className="w-4 h-4" /> },
                { field: 'agencyLogo', label: 'Agency Logo', icon: <Image className="w-4 h-4" /> },
                { field: 'aadhaarCard', label: 'Aadhaar Card', icon: <IdCard className="w-4 h-4" /> },
                { field: 'panCard', label: 'PAN Card', icon: <CreditCard className="w-4 h-4" /> },
                { field: 'reraCertificate', label: 'RERA Certificate', icon: <BadgeCheck className="w-4 h-4" /> },
                { field: 'gstCertificate', label: 'GST Certificate', icon: <Hash className="w-4 h-4" /> },
                { field: 'businessRegistrationCertificate', label: 'Business Registration', icon: <FileCheck className="w-4 h-4" /> },
              ].map((doc) => {
                const file = documents[doc.field];
                const hasFile = file !== null && file !== undefined;

                return (
                  <div
                    key={doc.field}
                    className="group relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 w-full border border-[#00695C]/10 hover:border-[#00695C]/30"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00695C]/5 to-[#26A69A]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#00695C] to-[#26A69A] shadow-lg transform group-hover:scale-110 transition-all duration-300">
                            <div className="text-white">
                              {doc.icon}
                            </div>
                          </div>
                          <span className="text-xs font-bold text-gray-700">{doc.label}</span>
                        </div>
                        {hasFile && (
                          <span className="text-[10px] text-[#00695C] font-bold bg-[#00695C]/10 px-2 py-0.5 rounded-full animate-fadeIn">
                            ✓
                          </span>
                        )}
                      </div>

                      {hasFile ? (
                        <div className="flex items-center gap-2 bg-gradient-to-r from-[#00695C]/5 to-[#26A69A]/5 rounded-lg p-1.5 border border-[#00695C]/20 group-hover:border-[#00695C]/40 transition-all duration-300">
                          {doc.field === 'profilePhoto' || doc.field === 'agencyLogo' ? (
                            <button
                              onClick={() => {
                                const items = [{
                                  type: 'image',
                                  url: URL.createObjectURL(file),
                                  name: file.name || `${doc.label}`
                                }];
                                setLightboxItems(items);
                                setLightboxIndex(0);
                                setShowMediaLightbox(true);
                              }}
                              className="flex-1 text-[10px] text-[#00695C] font-medium hover:underline truncate text-left flex items-center gap-1"
                            >
                              <Image className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{file.name || 'Image'}</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handlePdfView(doc.field)}
                              className="flex-1 text-[10px] text-[#00695C] font-medium hover:underline truncate text-left flex items-center gap-1"
                            >
                              <FileText className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{file.name || 'Document'}</span>
                            </button>
                          )}
                          <button
                            onClick={() => removeFile(doc.field)}
                            className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-300 flex-shrink-0"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-2 text-center hover:border-[#00695C] hover:bg-[#00695C]/5 transition-all duration-300 group/upload">
                          <label className="block cursor-pointer">
                            <div className="flex items-center justify-center gap-2">
                              <div className="p-1 bg-gray-100 rounded-lg group-hover/upload:bg-[#00695C]/10 transition-colors duration-300">
                                <Upload className="w-3.5 h-3.5 text-gray-400 group-hover/upload:text-[#00695C] transition-colors duration-300" />
                              </div>
                              <span className="text-[10px] font-medium text-gray-500 group-hover/upload:text-[#00695C] transition-colors duration-300">
                                Upload
                              </span>
                            </div>
                            <input
                              type="file"
                              className="hidden"
                              accept={doc.field === 'profilePhoto' || doc.field === 'agencyLogo' ? 'image/*' : '.pdf'}
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  if (doc.field === 'profilePhoto' || doc.field === 'agencyLogo') {
                                    handleFileUpload(doc.field, file);
                                  } else {
                                    handlePdfUpload(doc.field, file);
                                  }
                                }
                                e.target.value = '';
                              }}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                    <div className="h-[2px] w-full bg-gray-100 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#00695C] to-[#26A69A] w-0 group-hover:w-full transition-all duration-700 ease-out" />
                    </div>
                  </div>
                );
              })}
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
          editForm.upiId
        ];
        const filledCount = bankFields.filter(Boolean).length;

        return (
          <div className="w-full animate-slideUp">
            <SectionHeader
              title="Bank Details"
              subtitle="Your banking and financial information"
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
                <AnimatedCard label="UPI ID" value={editForm.upiId || 'Not provided'} icon={<Globe className="w-4 h-4" />} delay={0.33} />
              </div>
            </div>
          </div>
        );
      }

     case 'social': {
  const socialFields = [
    editForm.website,
    editForm.facebookPage,
    editForm.instagram,
    editForm.linkedIn,
    editForm.youtubeChannel
  ];
  const filledCount = socialFields.filter(Boolean).length;

  // Helper function to get social media URL
  const getSocialUrl = (platform, value) => {
    if (!value) return '#';
    // If it already has http:// or https://, return as is
    if (value.startsWith('http://') || value.startsWith('https://')) {
      return value;
    }
    // Add protocol and platform specific base URL
    const cleanValue = value.replace(/^https?:\/\//, '').replace(/^www\./, '');
    switch(platform) {
      case 'website':
        return `https://${cleanValue}`;
      case 'facebook':
        return `https://www.facebook.com/${cleanValue}`;
      case 'instagram':
        return `https://www.instagram.com/${cleanValue}`;
      case 'linkedin':
        return `https://www.linkedin.com/${cleanValue}`;
      case 'youtube':
        return `https://www.youtube.com/${cleanValue}`;
      default:
        return `https://${cleanValue}`;
    }
  };

  return (
    <div className="w-full animate-slideUp">
      <SectionHeader
        title="Social Media & Website"
        subtitle="Your online presence and social media links"
        filled={filledCount}
        total={socialFields.length}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 w-full">
        <div className="space-y-3 w-full">
          <AnimatedCard label="Website" icon={<Globe2 className="w-4 h-4" />} delay={0.05}>
            {editForm.website ? (
              <a 
                href={getSocialUrl('website', editForm.website)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] font-semibold text-[#00695C] hover:text-[#004D40] hover:underline flex items-center gap-2 transition-all duration-300"
                onClick={(e) => {
                  if (!editForm.website) e.preventDefault();
                }}
              >
                {editForm.website}
                <ExternalLink className="w-3.5 h-3.5 inline" />
              </a>
            ) : (
              <span className="text-[13px] text-gray-400 font-medium italic">Not provided</span>
            )}
          </AnimatedCard>

          <AnimatedCard label="Facebook Page" icon={<Share2 className="w-4 h-4" />} delay={0.12}>
            {editForm.facebookPage ? (
              <a 
                href={getSocialUrl('facebook', editForm.facebookPage)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] font-semibold text-[#00695C] hover:text-[#004D40] hover:underline flex items-center gap-2 transition-all duration-300"
              >
                {editForm.facebookPage}
                <ExternalLink className="w-3.5 h-3.5 inline" />
              </a>
            ) : (
              <span className="text-[13px] text-gray-400 font-medium italic">Not provided</span>
            )}
          </AnimatedCard>

          <AnimatedCard label="Instagram" icon={<Camera className="w-4 h-4" />} delay={0.19}>
            {editForm.instagram ? (
              <a 
                href={getSocialUrl('instagram', editForm.instagram)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] font-semibold text-[#00695C] hover:text-[#004D40] hover:underline flex items-center gap-2 transition-all duration-300"
              >
                {editForm.instagram}
                <ExternalLink className="w-3.5 h-3.5 inline" />
              </a>
            ) : (
              <span className="text-[13px] text-gray-400 font-medium italic">Not provided</span>
            )}
          </AnimatedCard>
        </div>

        <div className="space-y-3 w-full">
          <AnimatedCard label="LinkedIn" icon={<Briefcase className="w-4 h-4" />} delay={0.26}>
            {editForm.linkedIn ? (
              <a 
                href={getSocialUrl('linkedin', editForm.linkedIn)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] font-semibold text-[#00695C] hover:text-[#004D40] hover:underline flex items-center gap-2 transition-all duration-300"
              >
                {editForm.linkedIn}
                <ExternalLink className="w-3.5 h-3.5 inline" />
              </a>
            ) : (
              <span className="text-[13px] text-gray-400 font-medium italic">Not provided</span>
            )}
          </AnimatedCard>

          <AnimatedCard label="YouTube Channel" icon={<Video className="w-4 h-4" />} delay={0.33}>
            {editForm.youtubeChannel ? (
              <a 
                href={getSocialUrl('youtube', editForm.youtubeChannel)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] font-semibold text-[#00695C] hover:text-[#004D40] hover:underline flex items-center gap-2 transition-all duration-300"
              >
                {editForm.youtubeChannel}
                <ExternalLink className="w-3.5 h-3.5 inline" />
              </a>
            ) : (
              <span className="text-[13px] text-gray-400 font-medium italic">Not provided</span>
            )}
          </AnimatedCard>
        </div>
      </div>
    </div>
  );
}

      case 'login': {
        const loginFields = [
          editForm.username,
          editForm.emailAddressLogin,
          editForm.mobileNumberLogin,
          editForm.password
        ];
        const filledCount = loginFields.filter(Boolean).length;

        return (
          <div className="w-full animate-slideUp">
            <SectionHeader
              title="Login Credentials"
              subtitle="Your account access information"
              filled={filledCount}
              total={loginFields.length}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 w-full">
              <div className="space-y-3 w-full">
                <AnimatedCard label="Username" value={editForm.username} icon={<User className="w-4 h-4" />} delay={0.05} />
                <AnimatedCard label="Email Address" value={editForm.emailAddressLogin} icon={<Mail className="w-4 h-4" />} delay={0.12} />
              </div>
              <div className="space-y-3 w-full">
                <AnimatedCard label="Mobile Number" value={editForm.mobileNumberLogin} icon={<Phone className="w-4 h-4" />} delay={0.19} />
                <AnimatedCard label="Password" icon={<Lock className="w-4 h-4" />} delay={0.26}>
                  <div className="text-[13px] text-gray-800 font-semibold">••••••••</div>
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
          editForm.whatsappNumber
        ];
        const filledCount = contactFields.filter(Boolean).length;

        return (
          <div className="w-full animate-slideUp">
            <SectionHeader
              title="Contact Information"
              subtitle="Your complete contact details"
              filled={filledCount}
              total={contactFields.length}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 w-full">
              <div className="space-y-3 w-full">
                <AnimatedCard label="Office Address" value={editForm.officeAddress} icon={<MapPin className="w-4 h-4" />} delay={0.05} />
                <AnimatedCard label="City" value={editForm.city} icon={<Building className="w-4 h-4" />} delay={0.12} />
                <AnimatedCard label="District" value={editForm.district} icon={<Landmark className="w-4 h-4" />} delay={0.19} />
                <AnimatedCard label="State" value={editForm.state} icon={<Globe className="w-4 h-4" />} delay={0.26} />
              </div>
              <div className="space-y-3 w-full">
                <AnimatedCard label="PIN Code" value={editForm.pinCode} icon={<MapPin className="w-4 h-4" />} delay={0.33} />
                <AnimatedCard label="Website" value={editForm.website || 'Not provided'} icon={<Globe2 className="w-4 h-4" />} delay={0.4} />
                <AnimatedCard label="WhatsApp Number" value={editForm.whatsappNumber || 'Not provided'} icon={<Smartphone className="w-4 h-4" />} delay={0.47} />
              </div>
            </div>
          </div>
        );
      }
     

      default:
        return null;
    }
  };

  // ============ RENDER PROPERTIES SECTION ============
  const renderPropertiesSection = () => {
    return (
      <div className="bg-gradient-to-br from-[#00695C]/[0.05] to-[#26A69A]/[0.05] backdrop-blur-sm rounded-2xl shadow-xl p-5 mb-6 w-full border border-[#00695C]/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00695C]/5 to-[#26A69A]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-2 rounded-xl shadow-lg">
              <Home className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-800">My Properties</h2>
              <p className="text-[11px] text-gray-500">Manage your property listings</p>
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
                <GridIcon className="w-4.5 h-4.5" />
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
                <List className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </div>

        {filteredProperties.length > 0 ? (
          <div>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProperties.map((property, index) => (
                  <div
                    key={property.id}
                    className="group relative bg-teal-100/30 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-[#00695C]/10 overflow-hidden hover:-translate-y-1"
                    style={{ animationDelay: `${index * 0.08}s` }}
                  >
                    <div className="relative w-full h-46 bg-gray-100 overflow-hidden">
                      <img 
                        src={property.images?.[0] || 'https://via.placeholder.com/400x400/CCCCCC/666666?text=No+Image'} 
                        alt={property.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x400/CCCCCC/666666?text=No+Image';
                        }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-3">
                        <p className="text-white font-bold text-lg drop-shadow-lg">
                          {property.price}
                        </p>
                      </div>
                      {property.images && property.images.length > 1 && (
                        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5">
                          <Image className="w-3.5 h-3.5" />
                          {property.images.length}
                        </div>
                      )}
                    </div>

                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-bold text-gray-800 text-base hover:text-[#00695C] transition-colors duration-300 line-clamp-1 flex-1">
                          {property.name}
                        </h3>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <span className={`text-[10px] font-bold ${
                            property.status === 'Active' ? 'text-green-600' : 'text-gray-400'
                          }`}>
                            {property.status === 'Active' ? 'Active' : 'Inactive'}
                          </span>
                          <ToggleSwitch 
                            isOn={property.status === 'Active'} 
                            onToggle={() => handleToggleStatus(property)}
                            size="sm"
                          />
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 font-medium flex items-center gap-2">
                        <span className="bg-gray-100 px-2 py-0.5 rounded-full">{property.id}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span>{property.postedDate}</span>
                      </p>

                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-[#00695C] flex-shrink-0" />
                        <span className="font-medium truncate">{property.location}</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { icon: Building, label: property.type },
                          { icon: Layers, label: property.area },
                          { icon: Bed, label: property.bedrooms || 'N/A' }
                        ].map((item, idx) => (
                          <span 
                            key={idx}
                            className="flex items-center gap-1 bg-[#00695C]/5 px-2.5 py-1 rounded-lg text-xs font-medium text-[#00695C] border border-[#00695C]/10"
                          >
                            <item.icon className="w-3.5 h-3.5" />
                            {item.label}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                        <button
                          onClick={() => handleViewDetails(property)}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-lg text-sm font-bold hover:shadow-lg transition-all duration-300 hover:scale-105"
                        >
                          <ViewIcon className="w-4 h-4" />
                          View
                        </button>
                        <button
                          onClick={() => handleEditProperty(property)}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-sm font-bold hover:shadow-lg transition-all duration-300 hover:scale-105"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProperty(property)}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-sm font-bold hover:shadow-lg transition-all duration-300 hover:scale-105"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200 bg-gray-50">
                      <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Property</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Price</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Area</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Location</th>
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
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
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
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-sm text-gray-800 group-hover:text-[#00695C] transition-colors">
                                  {property.name}
                                </p>
                                <div className="flex items-center gap-1">
                                  <span className={`text-[10px] font-bold ${
                                    property.status === 'Active' ? 'text-green-600' : 'text-gray-400'
                                  }`}>
                                    {property.status === 'Active' ? 'Active' : 'Inactive'}
                                  </span>
                                  <ToggleSwitch 
                                    isOn={property.status === 'Active'} 
                                    onToggle={() => handleToggleStatus(property)}
                                    size="sm"
                                  />
                                </div>
                              </div>
                              <p className="text-xs text-gray-500">{property.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                            property.status === 'Active' ? 'bg-green-100 text-green-700' :
                            property.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {property.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">{property.type}</td>
                        <td className="py-3 px-4 text-sm font-bold text-gray-800">{property.price}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{property.area}</td>
                        <td className="py-3 px-4 text-sm text-gray-700 truncate max-w-[150px]">{property.location}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleViewDetails(property)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00695C] text-white rounded-lg text-xs font-bold hover:bg-[#005A4F] transition-all duration-300"
                            >
                              <ViewIcon className="w-3.5 h-3.5" />
                              View
                            </button>
                            <button
                              onClick={() => handleEditProperty(property)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-bold hover:bg-blue-600 transition-all duration-300"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProperty(property)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-bold hover:bg-red-600 transition-all duration-300"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
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
                : 'You haven\'t added any properties yet'}
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
    );
  };

  // ============ MAIN RENDER ============
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00695C]/5 via-teal-50/50 to-[#26A69A]/5 pt-20 pb-12 w-full relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#00695C]/10 to-[#26A69A]/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#26A69A]/10 to-[#00695C]/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-[#00695C]/5 to-[#26A69A]/5 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {/* PDF Viewer Modal */}
      {showPdfViewer && pdfToView && (
        <PdfViewerModal
          file={pdfToView}
          onClose={() => {
            setShowPdfViewer(false);
            setPdfToView(null);
          }}
        />
      )}

      {/* Media Lightbox */}
      {showMediaLightbox && lightboxItems.length > 0 && (
        <MediaLightboxModal
          items={lightboxItems}
          index={lightboxIndex}
          onNavigate={setLightboxIndex}
          onDelete={() => {
            const item = lightboxItems[lightboxIndex];
            if (item) {
              const field = item.field;
              setDocuments(prev => ({ ...prev, [field]: null }));
              setLightboxItems([]);
              setShowMediaLightbox(false);
              showSuccessToast();
            }
          }}
          onClose={() => {
            setShowMediaLightbox(false);
            setLightboxItems([]);
            setLightboxIndex(0);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
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

      {/* Profile Photo Delete Confirmation */}
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

{/* Edit Modal */}
{showEditModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn w-full">
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[90%] sm:max-w-[95%] lg:max-w-2xl mx-4 overflow-hidden max-h-[85vh] flex flex-col animate-scaleIn">
      <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] px-8 py-5 flex items-center justify-between flex-shrink-0">
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
      <div className="px-8 py-6 space-y-6 overflow-y-auto flex-1 w-full bg-gray-50">
        
        {/* 1. Personal Details */}
        <div className="space-y-4 w-full bg-gradient-to-br from-[#00695C]/[0.05] to-[#26A69A]/[0.05] rounded-2xl p-6 shadow-sm border border-[#00695C]/10">
          <h3 className="text-sm font-bold text-[#00695C] uppercase tracking-wider flex items-center gap-3">
            <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-2 rounded-xl">
              <User className="w-4 h-4 text-white" />
            </div>
            Personal Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <span>👤</span> Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={editForm.fullName}
                onChange={handleEditChange}
                className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-300"
              />
            </div>
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <span>📱</span> Mobile Number *
              </label>
              <input
                type="text"
                name="mobileNumber"
                value={editForm.mobileNumber}
                onChange={handleEditChange}
                className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-300"
              />
            </div>
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <span>✉️</span> Email Address *
              </label>
              <input
                type="email"
                name="emailAddress"
                value={editForm.emailAddress}
                onChange={handleEditChange}
                className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-300"
              />
            </div>
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <span>🎂</span> Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formatDateForInput(editForm.dateOfBirth)}
                onChange={handleDateChange}
                className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-300"
              />
            </div>
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <span>⚥</span> Gender
              </label>
              <select
                name="gender"
                value={editForm.gender}
                onChange={handleEditChange}
                className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-300"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <span>📸</span> Profile Photo *
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => profilePhotoInputRef.current?.click()}
                  className="px-4 py-2 bg-[#00695C] text-white rounded-xl text-sm font-bold hover:bg-[#005A4F] transition-all duration-300"
                >
                  Upload
                </button>
                {documents.profilePhoto && (
                  <button
                    onClick={handleProfilePhotoDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-all duration-300"
                  >
                    Delete
                  </button>
                )}
                <input ref={profilePhotoInputRef} type="file" className="hidden" accept="image/*" onChange={handleProfilePhotoUpload} />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Business Information */}
        <div className="space-y-4 w-full bg-gradient-to-br from-[#00695C]/[0.05] to-[#26A69A]/[0.05] rounded-2xl p-6 shadow-sm border border-[#00695C]/10">
          <h3 className="text-sm font-bold text-[#00695C] uppercase tracking-wider flex items-center gap-3">
            <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-2 rounded-xl">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            Business Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <span>🏢</span> Agency Name *
              </label>
              <input
                type="text"
                name="agencyName"
                value={editForm.agencyName}
                onChange={handleEditChange}
                className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-300"
              />
            </div>
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <span>📋</span> RERA Registration Number
              </label>
              <input
                type="text"
                name="reraRegistrationNumber"
                value={editForm.reraRegistrationNumber}
                onChange={handleEditChange}
                className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-300"
              />
            </div>
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <span>#️⃣</span> GST Number
              </label>
              <input
                type="text"
                name="gstNumber"
                value={editForm.gstNumber}
                onChange={handleEditChange}
                className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-300"
              />
            </div>
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <span>⭐</span> Years of Experience *
              </label>
              <input
                type="number"
                name="yearsOfExperience"
                value={editForm.yearsOfExperience}
                onChange={handleEditChange}
                className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-300"
              />
            </div>
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <span>📊</span> Number of Active Listings
              </label>
              <input
                type="number"
                name="numberOfActiveListings"
                value={editForm.numberOfActiveListings}
                onChange={handleEditChange}
                className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-300"
              />
            </div>
            <div className="space-y-1.5 w-full md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <span>🌍</span> Service Areas (City/Locality)
              </label>
              <input
                type="text"
                name="serviceAreas"
                value={editForm.serviceAreas}
                onChange={handleEditChange}
                className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-300"
                placeholder="e.g. Mumbai, Pune, Navi Mumbai"
              />
            </div>
            <div className="space-y-1.5 w-full md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <span>📍</span> Office Address *
              </label>
              <textarea
                name="officeAddress"
                value={editForm.officeAddress}
                onChange={handleEditChange}
                rows="2"
                className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-300 resize-y"
                placeholder="Enter complete office address"
              />
            </div>
          </div>
        </div>

        {/* 3. Identity Verification */}
        <div className="space-y-4 w-full bg-gradient-to-br from-[#00695C]/[0.05] to-[#26A69A]/[0.05] rounded-2xl p-6 shadow-sm border border-[#00695C]/10">
          <h3 className="text-sm font-bold text-[#00695C] uppercase tracking-wider flex items-center gap-3">
            <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-2 rounded-xl">
              <Shield className="w-4 h-4 text-white" />
            </div>
            Identity Verification
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <span>🆔</span> Aadhaar Number *
              </label>
              <input
                type="text"
                name="aadhaarNumber"
                value={editForm.aadhaarNumber}
                onChange={handleEditChange}
                className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-300"
              />
            </div>
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <span>📄</span> PAN Number *
              </label>
              <input
                type="text"
                name="panNumber"
                value={editForm.panNumber}
                onChange={handleEditChange}
                className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-300"
              />
            </div>
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <span>📎</span> Upload Aadhaar Card *
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => fileInputRefs.current['aadhaarCard']?.click()}
                  className="px-4 py-2 bg-[#00695C] text-white rounded-xl text-sm font-bold hover:bg-[#005A4F] transition-all duration-300"
                >
                  Upload
                </button>
                {documents.aadhaarCard && (
                  <button
                    onClick={() => handlePdfDelete('aadhaarCard')}
                    className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-all duration-300"
                  >
                    Delete
                  </button>
                )}
                <input
                  ref={el => fileInputRefs.current['aadhaarCard'] = el}
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) handlePdfUpload('aadhaarCard', file);
                    e.target.value = '';
                  }}
                />
              </div>
              {documents.aadhaarCard && (
                <p className="text-xs text-[#00695C] font-bold mt-1 flex items-center gap-1">
                  <Check className="w-3 h-3" /> {documents.aadhaarCard.name}
                </p>
              )}
            </div>
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <span>📎</span> Upload PAN Card *
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => fileInputRefs.current['panCard']?.click()}
                  className="px-4 py-2 bg-[#00695C] text-white rounded-xl text-sm font-bold hover:bg-[#005A4F] transition-all duration-300"
                >
                  Upload
                </button>
                {documents.panCard && (
                  <button
                    onClick={() => handlePdfDelete('panCard')}
                    className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-all duration-300"
                  >
                    Delete
                  </button>
                )}
                <input
                  ref={el => fileInputRefs.current['panCard'] = el}
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) handlePdfUpload('panCard', file);
                    e.target.value = '';
                  }}
                />
              </div>
              {documents.panCard && (
                <p className="text-xs text-[#00695C] font-bold mt-1 flex items-center gap-1">
                  <Check className="w-3 h-3" /> {documents.panCard.name}
                </p>
              )}
            </div>
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <span>📎</span> Upload Business Registration Certificate
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => fileInputRefs.current['businessRegistrationCertificate']?.click()}
                  className="px-4 py-2 bg-[#00695C] text-white rounded-xl text-sm font-bold hover:bg-[#005A4F] transition-all duration-300"
                >
                  Upload
                </button>
                {documents.businessRegistrationCertificate && (
                  <button
                    onClick={() => handlePdfDelete('businessRegistrationCertificate')}
                    className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-all duration-300"
                  >
                    Delete
                  </button>
                )}
                <input
                  ref={el => fileInputRefs.current['businessRegistrationCertificate'] = el}
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) handlePdfUpload('businessRegistrationCertificate', file);
                    e.target.value = '';
                  }}
                />
              </div>
              {documents.businessRegistrationCertificate && (
                <p className="text-xs text-[#00695C] font-bold mt-1 flex items-center gap-1">
                  <Check className="w-3 h-3" /> {documents.businessRegistrationCertificate.name}
                </p>
              )}
            </div>
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <span>📎</span> Upload RERA Certificate
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => fileInputRefs.current['reraCertificate']?.click()}
                  className="px-4 py-2 bg-[#00695C] text-white rounded-xl text-sm font-bold hover:bg-[#005A4F] transition-all duration-300"
                >
                  Upload
                </button>
                {documents.reraCertificate && (
                  <button
                    onClick={() => handlePdfDelete('reraCertificate')}
                    className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-all duration-300"
                  >
                    Delete
                  </button>
                )}
                <input
                  ref={el => fileInputRefs.current['reraCertificate'] = el}
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) handlePdfUpload('reraCertificate', file);
                    e.target.value = '';
                  }}
                />
              </div>
              {documents.reraCertificate && (
                <p className="text-xs text-[#00695C] font-bold mt-1 flex items-center gap-1">
                  <Check className="w-3 h-3" /> {documents.reraCertificate.name}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 4. Upload Documents */}
        <div className="space-y-4 w-full bg-gradient-to-br from-[#00695C]/[0.05] to-[#26A69A]/[0.05] rounded-2xl p-6 shadow-sm border border-[#00695C]/10">
          <h3 className="text-sm font-bold text-[#00695C] uppercase tracking-wider flex items-center gap-3">
            <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-2 rounded-xl">
              <FileText className="w-4 h-4 text-white" />
            </div>
            Upload Documents
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <span>📸</span> Profile Photo *
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => profilePhotoInputRef.current?.click()}
                  className="px-4 py-2 bg-[#00695C] text-white rounded-xl text-sm font-bold hover:bg-[#005A4F] transition-all duration-300"
                >
                  Upload
                </button>
                {documents.profilePhoto && (
                  <button
                    onClick={handleProfilePhotoDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-all duration-300"
                  >
                    Delete
                  </button>
                )}
              </div>
              {documents.profilePhoto && (
                <p className="text-xs text-[#00695C] font-bold mt-1 flex items-center gap-1">
                  <Check className="w-3 h-3" /> {documents.profilePhoto.name}
                </p>
              )}
            </div>
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <span>🏢</span> Agency Logo
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => agencyLogoInputRef.current?.click()}
                  className="px-4 py-2 bg-[#00695C] text-white rounded-xl text-sm font-bold hover:bg-[#005A4F] transition-all duration-300"
                >
                  Upload
                </button>
                {documents.agencyLogo && (
                  <button
                    onClick={() => removeFile('agencyLogo')}
                    className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-all duration-300"
                  >
                    Delete
                  </button>
                )}
                <input ref={agencyLogoInputRef} type="file" className="hidden" accept="image/*" onChange={handleAgencyLogoUpload} />
              </div>
              {documents.agencyLogo && (
                <p className="text-xs text-[#00695C] font-bold mt-1 flex items-center gap-1">
                  <Check className="w-3 h-3" /> {documents.agencyLogo.name}
                </p>
              )}
            </div>
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <span>📎</span> Aadhaar Card *
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => fileInputRefs.current['aadhaarCard']?.click()}
                  className="px-4 py-2 bg-[#00695C] text-white rounded-xl text-sm font-bold hover:bg-[#005A4F] transition-all duration-300"
                >
                  Upload
                </button>
                {documents.aadhaarCard && (
                  <button
                    onClick={() => handlePdfDelete('aadhaarCard')}
                    className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-all duration-300"
                  >
                    Delete
                  </button>
                )}
              </div>
              {documents.aadhaarCard && (
                <p className="text-xs text-[#00695C] font-bold mt-1 flex items-center gap-1">
                  <Check className="w-3 h-3" /> {documents.aadhaarCard.name}
                </p>
              )}
            </div>
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <span>📎</span> PAN Card *
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => fileInputRefs.current['panCard']?.click()}
                  className="px-4 py-2 bg-[#00695C] text-white rounded-xl text-sm font-bold hover:bg-[#005A4F] transition-all duration-300"
                >
                  Upload
                </button>
                {documents.panCard && (
                  <button
                    onClick={() => handlePdfDelete('panCard')}
                    className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-all duration-300"
                  >
                    Delete
                  </button>
                )}
              </div>
              {documents.panCard && (
                <p className="text-xs text-[#00695C] font-bold mt-1 flex items-center gap-1">
                  <Check className="w-3 h-3" /> {documents.panCard.name}
                </p>
              )}
            </div>
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <span>📎</span> RERA Certificate
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => fileInputRefs.current['reraCertificate']?.click()}
                  className="px-4 py-2 bg-[#00695C] text-white rounded-xl text-sm font-bold hover:bg-[#005A4F] transition-all duration-300"
                >
                  Upload
                </button>
                {documents.reraCertificate && (
                  <button
                    onClick={() => handlePdfDelete('reraCertificate')}
                    className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-all duration-300"
                  >
                    Delete
                  </button>
                )}
              </div>
              {documents.reraCertificate && (
                <p className="text-xs text-[#00695C] font-bold mt-1 flex items-center gap-1">
                  <Check className="w-3 h-3" /> {documents.reraCertificate.name}
                </p>
              )}
            </div>
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <span>📎</span> GST Certificate
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => fileInputRefs.current['gstCertificate']?.click()}
                  className="px-4 py-2 bg-[#00695C] text-white rounded-xl text-sm font-bold hover:bg-[#005A4F] transition-all duration-300"
                >
                  Upload
                </button>
                {documents.gstCertificate && (
                  <button
                    onClick={() => handlePdfDelete('gstCertificate')}
                    className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-all duration-300"
                  >
                    Delete
                  </button>
                )}
              </div>
              {documents.gstCertificate && (
                <p className="text-xs text-[#00695C] font-bold mt-1 flex items-center gap-1">
                  <Check className="w-3 h-3" /> {documents.gstCertificate.name}
                </p>
              )}
            </div>
            <div className="space-y-1.5 w-full md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <span>📎</span> Business Registration Certificate
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => fileInputRefs.current['businessRegistrationCertificate']?.click()}
                  className="px-4 py-2 bg-[#00695C] text-white rounded-xl text-sm font-bold hover:bg-[#005A4F] transition-all duration-300"
                >
                  Upload
                </button>
                {documents.businessRegistrationCertificate && (
                  <button
                    onClick={() => handlePdfDelete('businessRegistrationCertificate')}
                    className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-all duration-300"
                  >
                    Delete
                  </button>
                )}
              </div>
              {documents.businessRegistrationCertificate && (
                <p className="text-xs text-[#00695C] font-bold mt-1 flex items-center gap-1">
                  <Check className="w-3 h-3" /> {documents.businessRegistrationCertificate.name}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 5. Bank Details */}
        <div className="space-y-4 w-full bg-gradient-to-br from-[#00695C]/[0.05] to-[#26A69A]/[0.05] rounded-2xl p-6 shadow-sm border border-[#00695C]/10">
          <h3 className="text-sm font-bold text-[#00695C] uppercase tracking-wider flex items-center gap-3">
            <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-2 rounded-xl">
              <Banknote className="w-4 h-4 text-white" />
            </div>
            Bank Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <span>👤</span> Account Holder Name
              </label>
              <input
                type="text"
                name="accountHolderName"
                value={editForm.accountHolderName}
                onChange={handleEditChange}
                className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-300"
              />
            </div>
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <span>🏦</span> Bank Name
              </label>
              <input
                type="text"
                name="bankName"
                value={editForm.bankName}
                onChange={handleEditChange}
                className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-300"
              />
            </div>
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <span>💳</span> Account Number
              </label>
              <input
                type="text"
                name="accountNumber"
                value={editForm.accountNumber}
                onChange={handleEditChange}
                className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-300"
              />
            </div>
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <span>🔢</span> IFSC Code
              </label>
              <input
                type="text"
                name="ifscCode"
                value={editForm.ifscCode}
                onChange={handleEditChange}
                className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-300"
              />
            </div>
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <span>📱</span> UPI ID
              </label>
              <input
                type="text"
                name="upiId"
                value={editForm.upiId}
                onChange={handleEditChange}
                className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-300"
                placeholder="example@upi"
              />
            </div>
          </div>
        </div>

        {/* 6. Social Media */}
        <div className="space-y-4 w-full bg-gradient-to-br from-[#00695C]/[0.05] to-[#26A69A]/[0.05] rounded-2xl p-6 shadow-sm border border-[#00695C]/10">
          <h3 className="text-sm font-bold text-[#00695C] uppercase tracking-wider flex items-center gap-3">
            <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-2 rounded-xl">
              <Share2 className="w-4 h-4 text-white" />
            </div>
            Social Media & Website
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <span>🌐</span> Website
              </label>
              <input
                type="text"
                name="website"
                value={editForm.website}
                onChange={handleEditChange}
                className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-300"
                placeholder="www.example.com"
              />
            </div>
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <span>📘</span> Facebook Page
              </label>
              <input
                type="text"
                name="facebookPage"
                value={editForm.facebookPage}
                onChange={handleEditChange}
                className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-300"
                placeholder="facebook.com/yourpage"
              />
            </div>
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <span>📸</span> Instagram
              </label>
              <input
                type="text"
                name="instagram"
                value={editForm.instagram}
                onChange={handleEditChange}
                className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-300"
                placeholder="instagram.com/yourpage"
              />
            </div>
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <span>💼</span> LinkedIn
              </label>
              <input
                type="text"
                name="linkedIn"
                value={editForm.linkedIn}
                onChange={handleEditChange}
                className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-300"
                placeholder="linkedin.com/in/yourprofile"
              />
            </div>
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <span>▶️</span> YouTube Channel
              </label>
              <input
                type="text"
                name="youtubeChannel"
                value={editForm.youtubeChannel}
                onChange={handleEditChange}
                className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-300"
                placeholder="youtube.com/yourchannel"
              />
            </div>
          </div>
        </div>

        {/* 7. Login Credentials */}
        <div className="space-y-4 w-full bg-gradient-to-br from-[#00695C]/[0.05] to-[#26A69A]/[0.05] rounded-2xl p-6 shadow-sm border border-[#00695C]/10">
          <h3 className="text-sm font-bold text-[#00695C] uppercase tracking-wider flex items-center gap-3">
            <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-2 rounded-xl">
              <Settings className="w-4 h-4 text-white" />
            </div>
            Login Credentials
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <span>👤</span> Username *
              </label>
              <input
                type="text"
                name="username"
                value={editForm.username}
                onChange={handleEditChange}
                className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-300"
              />
            </div>
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <span>✉️</span> Email Address *
              </label>
              <input
                type="email"
                name="emailAddressLogin"
                value={editForm.emailAddressLogin}
                onChange={handleEditChange}
                className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-300"
              />
            </div>
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <span>📱</span> Mobile Number *
              </label>
              <input
                type="text"
                name="mobileNumberLogin"
                value={editForm.mobileNumberLogin}
                onChange={handleEditChange}
                className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-300"
              />
            </div>
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <span>🔒</span> Password *
              </label>
              <input
                type="password"
                name="password"
                value={editForm.password}
                onChange={handleEditChange}
                className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-300"
              />
            </div>
            <div className="space-y-1.5 w-full md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <span>🔒</span> Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={editForm.confirmPassword}
                onChange={handleEditChange}
                className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-300"
              />
            </div>
          </div>
        </div>

        {/* 8. Contact Information */}
        <div className="space-y-4 w-full bg-gradient-to-br from-[#00695C]/[0.05] to-[#26A69A]/[0.05] rounded-2xl p-6 shadow-sm border border-[#00695C]/10">
          <h3 className="text-sm font-bold text-[#00695C] uppercase tracking-wider flex items-center gap-3">
            <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-2 rounded-xl">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="space-y-1.5 w-full md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <span>📍</span> Office Address *
              </label>
              <textarea
                name="officeAddress"
                value={editForm.officeAddress}
                onChange={handleEditChange}
                rows="2"
                className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-300 resize-y"
                placeholder="Enter complete office address"
              />
            </div>
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <span>🏙️</span> City *
              </label>
              <input
                type="text"
                name="city"
                value={editForm.city}
                onChange={handleEditChange}
                className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-300"
              />
            </div>
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <span>🗺️</span> District *
              </label>
              <input
                type="text"
                name="district"
                value={editForm.district}
                onChange={handleEditChange}
                className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-300"
              />
            </div>
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <span>🌍</span> State *
              </label>
              <input
                type="text"
                name="state"
                value={editForm.state}
                onChange={handleEditChange}
                className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-300"
              />
            </div>
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <span>📍</span> PIN Code *
              </label>
              <input
                type="text"
                name="pinCode"
                value={editForm.pinCode}
                onChange={handleEditChange}
                className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-300"
              />
            </div>
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <span>🌐</span> Website
              </label>
              <input
                type="text"
                name="website"
                value={editForm.website}
                onChange={handleEditChange}
                className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-300"
                placeholder="www.example.com"
              />
            </div>
            <div className="space-y-1.5 w-full">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <span>📱</span> WhatsApp Number
              </label>
              <input
                type="text"
                name="whatsappNumber"
                value={editForm.whatsappNumber}
                onChange={handleEditChange}
                className="w-full border-2 border-gray-200 focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/20 rounded-2xl px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-300"
                placeholder="+91 98765 43210"
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

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-20 right-4 z-50 bg-gradient-to-r from-[#00695C]/10 to-[#26A69A]/10 border-2 border-[#00695C]/30 rounded-2xl p-4 flex items-center gap-4 shadow-xl animate-slideDown max-w-md backdrop-blur-sm">
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

      {/* Property Details Modal */}
      {showPropertyDetails && selectedProperty && (
        <PropertyDetailsModal 
          property={selectedProperty} 
          onClose={() => {
            setShowPropertyDetails(false);
            setSelectedProperty(null);
          }}
          onAddImages={handleAddPropertyImages}
          onRemoveImage={handleRemovePropertyImage}
          onToggleStatus={handleToggleStatus}
          onEdit={handleEditProperty}
          onDelete={handleDeleteProperty}
        />
      )}

      {/* Edit Property Modal */}
      {showEditPropertyModal && editingProperty && (
        <EditPropertyModal
          property={editingProperty}
          onSave={handleSavePropertyEdit}
          onCancel={() => {
            setShowEditPropertyModal(false);
            setEditingProperty(null);
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

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-full w-full relative z-10 -mt-15">
        {/* Header */}
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
                    <div className="relative bg-gradient-to-r from-[#00695C] to-[#26A69A] p-2.5 rounded-2xl shadow-lg">
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

        {/* Profile Card */}
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
                <span className="text-xs text-[#00695C] font-medium bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                  Agent ID: #AGT-{editForm.mobileNumber?.slice(-4) || '0000'}
                </span>
                <span className="relative overflow-hidden bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white px-3 py-0.5 rounded-full text-[10px] font-bold">
                  Verified Agent
                  <span className="absolute inset-y-0 left-[-60%] w-[40%] bg-gradient-to-r from-transparent via-white/80 to-transparent animate-shimmer" />
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs text-gray-500 mb-3">
                <span className="flex items-center gap-1.5 bg-[#00695C]/5 px-3 py-1.5 rounded-xl shadow-sm border border-[#00695C]/10 hover:border-[#26A69A] hover:-translate-y-0.5 transition-all duration-300 animate-rise" style={{ animationDelay: '0.05s' }}>
                  <Building className="w-3.5 h-3.5 text-[#00695C]" /> {editForm.agencyName}
                </span>
                <span className="flex items-center gap-1.5 bg-[#00695C]/5 px-3 py-1.5 rounded-xl shadow-sm border border-[#00695C]/10 hover:border-[#26A69A] hover:-translate-y-0.5 transition-all duration-300 animate-rise" style={{ animationDelay: '0.15s' }}>
                  <MapPin className="w-3.5 h-3.5 text-[#00695C]" /> {editForm.city}, {editForm.state}
                </span>
                <span className="flex items-center gap-1.5 bg-[#00695C]/5 px-3 py-1.5 rounded-xl shadow-sm border border-[#00695C]/10 hover:border-[#26A69A] hover:-translate-y-0.5 transition-all duration-300 animate-rise" style={{ animationDelay: '0.25s' }}>
                  <Phone className="w-3.5 h-3.5 text-[#00695C]" /> {editForm.mobileNumber}
                </span>
                <span className="flex items-center gap-1.5 bg-[#00695C]/5 px-3 py-1.5 rounded-xl shadow-sm border border-[#00695C]/10 hover:border-[#26A69A] hover:-translate-y-0.5 transition-all duration-300 animate-rise" style={{ animationDelay: '0.35s' }}>
                  <Award className="w-3.5 h-3.5 text-[#00695C]" /> {editForm.yearsOfExperience} Years Exp.
                </span>
              </div>

              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="flex items-center gap-1.5 bg-gradient-to-r from-[#00695C]/10 to-[#26A69A]/10 text-[#00695C] px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-sm hover:scale-105 transition-transform duration-300 border border-[#00695C]/20 text-left animate-rise" style={{ animationDelay: '0.45s' }}>
                  <TrendingUp className="w-3 h-3 flex-shrink-0" />
                  <span>{editForm.numberOfActiveListings} Active Listings</span>
                </span>
                <span className="flex items-center gap-1.5 bg-gradient-to-r from-[#00695C]/10 to-[#26A69A]/10 text-[#00695C] px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-sm hover:scale-105 transition-transform duration-300 border border-[#00695C]/20 text-left animate-rise" style={{ animationDelay: '0.55s' }}>
                  <Globe className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate max-w-[200px]">{editForm.serviceAreas}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
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

        {/* Tab Content */}
        <div className="bg-gradient-to-br from-[#00695C]/[0.05] to-[#26A69A]/[0.05] backdrop-blur-sm rounded-2xl shadow-xl p-5 mb-6 border border-[#00695C]/20 w-full relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#00695C]/5 to-[#26A69A]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-[#26A69A]/5 to-[#00695C]/5 rounded-full blur-3xl" />
          <div className="relative z-10">
            {renderSectionContent()}
          </div>
        </div>

        {/* Properties Section - Separately at the bottom */}
        {renderPropertiesSection()}
      </div>

      {/* Styles */}
      <style>{`
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

        .border-3 {
          border-width: 3px;
        }
        .focus\\:ring-3 {
          --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
          --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color);
          box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
        }
      `}</style>
    </div>
  );
};

export default AgentProfile;