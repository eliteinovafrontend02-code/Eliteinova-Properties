import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, ImagePlus, Video, X, MapPin, Bed, Bath, Home, Car, Trees, Building, Lock, Camera, Wifi, Shield, Sun, Coffee, Users, Briefcase, Square, TrendingUp, Clock, FileText, CheckCircle, Sprout, Leaf, Dumbbell, Waves, Hotel, ParkingCircle, Landmark, ArrowUpDown, Calendar, User, Mail, Phone, Calendar as CalendarIcon, UserCheck, File, MapPin as MapPinIcon, Building as BuildingIcon, Home as HomeIcon, CheckSquare, PenTool, Trash2, Globe, Facebook, Instagram, Linkedin, Youtube, BriefcaseBusiness, Building2, Factory, Store, ShieldCheck } from "lucide-react";

const steps = ["Company Details", "Authorized Person", "Office Address", "Identity & Business Verification", "Property Details", "Pricing & Amenities", "Bank Details", "Social Media", "Documents", "Declaration"];
const subtitles = [
  "Enter company/builder information",
  "Authorized representative details",
  "Office address information",
  "Verify business identity",
  "Tell us about your property",
  "Set pricing & select amenities",
  "Bank account details",
  "Social media & online presence",
  "Upload company documents",
  "Confirm & submit"
];

const Field = ({ label, required, hint, children }) => (
  <div className="mb-2">
    <label className="block text-[12px] font-semibold text-[#00695C] mb-0.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {hint && <p className="text-[10px] text-gray-400 mt-0.5">{hint}</p>}
  </div>
);

const FieldDt = ({ label, required, hint, children }) => (
  <div className="mb-2.5">
    <label className="block text-[13px] font-semibold text-[#00695C] mb-0.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {hint && <p className="text-[10px] text-gray-400 mt-0.5">{hint}</p>}
  </div>
);

const inMob = "w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-[12px] text-gray-700 placeholder:text-gray-300 placeholder:text-[11px] focus:outline-none focus:border-[#00695C] focus:ring-1 focus:ring-[#00695C]/20 bg-white transition-all";
const inDt = "w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px] text-gray-700 placeholder:text-gray-300 placeholder:text-xs focus:outline-none focus:border-[#00695C] focus:ring-1 focus:ring-[#00695C]/20 bg-white transition-all";

const availableAmenities = ["Gated Community", "24/7 Security", "Power Backup", "CCTV Surveillance", "24/7 Water Supply", "Wi-Fi Ready", "Children's Play Area", "Gym / Fitness Center", "Balcony / Terrace", "Lift / Elevator", "Visitor Parking", "Nearby School / Hospital"];
const yesNoOptions = ["Yes", "No"];

export default function RentBuilderIndForm({ isOpen, onClose }) {
  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState({
    // Company Details (Step 0)
    companyName: "", companyRegNumber: "", reraNumber: "", gstNumber: "", yearsOfExperience: "", companyWebsite: "", companyLogo: null, companyProfile: "",
    
    // Authorized Person (Step 1)
    authFullName: "", authDesignation: "", authMobile: "", authEmail: "", authWhatsapp: "", authPhoto: null,
    
    // Office Address (Step 2)
    officeAddress: "", officeCity: "", officeDistrict: "", officeState: "", officePinCode: "", officeLandmark: "",
    
    // Identity & Business Verification (Step 3)
    aadhaarNumber: "", panNumber: "", aadhaarCard: null, panCard: null, companyRegCert: null, gstCert: null, reraCert: null, companyPanCard: null,
    
    // Property Details (Step 4)
    propertyTitle: "", propertyType: "", propertyAddress: "", propertyCity: "", builtUpArea: "", carpetArea: "", bedrooms: "", bathrooms: "", furnishingStatus: "", parking: "",
    rentalDuration: "", occupancyDetails: "", petFriendly: "", gardenSpace: "", terrace: "",
    
    // Pricing & Amenities (Step 5)
    listingPurpose: "rent", expectedPrice: "", budgetRange: { min: "", max: "" }, priceType: "", maintenance: "", availableFrom: "", selectedAmenities: [], otherAmenities: "",
    
    // Bank Details (Step 6)
    accountHolderName: "", bankName: "", accountNumber: "", ifscCode: "", upiId: "",
    
    // Social Media (Step 7)
    website: "", facebook: "", instagram: "", linkedin: "", youtube: "",
    
    // Documents (Step 8)
    companyLogoDoc: null, companyBrochure: null, projectBrochures: [], companyRegCertDoc: null, reraCertDoc: null, gstCertDoc: null, panCardDoc: null, authIdProof: null, officeAddressProof: null,
    propertyImages: [], propertyVideo: null, coverImage: null, floorPlan: null,
    
    // Declaration (Step 9)
    declarationAccepted: false,
    signature: null, signatureDate: "", signaturePlace: ""
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoPreview, setVideoPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [floorPlanPreview, setFloorPlanPreview] = useState(null);
  const [customAmenitiesList, setCustomAmenitiesList] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signaturePoints, setSignaturePoints] = useState([]);
  const [allSignaturePoints, setAllSignaturePoints] = useState([]);
  const [activeCanvas, setActiveCanvas] = useState(null);

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const limitedFiles = files.slice(0, 3 - formData.propertyImages.length);
    const newImages = [...formData.propertyImages, ...limitedFiles];
    updateForm("propertyImages", newImages);
    const newPreviews = limitedFiles.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newImages = formData.propertyImages.filter((_, i) => i !== index);
    updateForm("propertyImages", newImages);
    URL.revokeObjectURL(imagePreviews[index]);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);
  };

  const handleCoverImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Cover image must be less than 2MB");
        return;
      }
      updateForm("coverImage", file);
      if (coverPreview) URL.revokeObjectURL(coverPreview);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const removeCoverImage = () => {
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    updateForm("coverImage", null);
    setCoverPreview(null);
  };

  const handleFloorPlanUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert("Floor plan must be a PDF file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Floor plan must be less than 5MB");
        return;
      }
      updateForm("floorPlan", file);
      if (floorPlanPreview) URL.revokeObjectURL(floorPlanPreview);
      setFloorPlanPreview(URL.createObjectURL(file));
    }
  };

  const removeFloorPlan = () => {
    if (floorPlanPreview) URL.revokeObjectURL(floorPlanPreview);
    updateForm("floorPlan", null);
    setFloorPlanPreview(null);
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("Video must be less than 10MB");
        return;
      }
      updateForm("propertyVideo", file);
      if (videoPreview) URL.revokeObjectURL(videoPreview);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const removeVideo = () => {
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    updateForm("propertyVideo", null);
    setVideoPreview(null);
  };

  const handleDocumentUpload = (docType, e, maxSize = 5) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert(`${docType} must be a PDF file`);
        return;
      }
      if (file.size > maxSize * 1024 * 1024) {
        alert(`${docType} must be less than ${maxSize}MB`);
        return;
      }
      updateForm(docType, file);
    }
  };

  const toggleAmenity = (amenity) => {
    const current = formData.selectedAmenities;
    if (current.includes(amenity)) {
      updateForm("selectedAmenities", current.filter(a => a !== amenity));
    } else {
      updateForm("selectedAmenities", [...current, amenity]);
    }
  };

  const addCustomAmenity = () => {
    const newAmenity = formData.otherAmenities.trim();
    if (newAmenity && !formData.selectedAmenities.includes(newAmenity) && !customAmenitiesList.includes(newAmenity)) {
      setCustomAmenitiesList([...customAmenitiesList, newAmenity]);
      updateForm("selectedAmenities", [...formData.selectedAmenities, newAmenity]);
      updateForm("otherAmenities", "");
    }
  };

  const removeCustomAmenity = (amenity) => {
    setCustomAmenitiesList(customAmenitiesList.filter(a => a !== amenity));
    updateForm("selectedAmenities", formData.selectedAmenities.filter(a => a !== amenity));
  };

  // Signature handling
  const startDrawing = (e, canvasId) => {
    const canvas = document.getElementById(canvasId);
    const rect = canvas.getBoundingClientRect();
    setIsDrawing(true);
    setActiveCanvas(canvasId);
    const point = {
      x: (e.clientX || e.touches[0].clientX) - rect.left,
      y: (e.clientY || e.touches[0].clientY) - rect.top
    };
    setSignaturePoints([point]);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = document.getElementById(activeCanvas);
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const point = {
      x: (e.clientX || e.touches[0].clientX) - rect.left,
      y: (e.clientY || e.touches[0].clientY) - rect.top
    };
    setSignaturePoints([...signaturePoints, point]);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (signaturePoints.length > 1 && activeCanvas) {
      setAllSignaturePoints([...allSignaturePoints, [...signaturePoints]]);
      const canvas = document.getElementById(activeCanvas);
      const ctx = canvas.getContext('2d');
      const dataUrl = canvas.toDataURL('image/png');
      updateForm('signature', dataUrl);
    }
    setActiveCanvas(null);
  };

  const clearSignature = () => {
    setSignaturePoints([]);
    setAllSignaturePoints([]);
    updateForm('signature', null);
    ['signatureCanvas', 'm-signatureCanvas', 'dt-signatureCanvas'].forEach(id => {
      const canvas = document.getElementById(id);
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    });
  };

  const handleSubmit = () => {
    updateForm('signatureDate', new Date().toLocaleDateString());
    console.log("Rent Builder Form submitted:", formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* MOBILE */}
      <div className="fixed inset-0 z-50 flex flex-col sm:hidden">
        <div className="bg-black/50" style={{ height: "10vh" }} onClick={onClose} />
        <div className="flex-1 bg-white rounded-3xl flex flex-col overflow-hidden shadow-2xl mx-5 mb-5">
          <div className="relative flex flex-col items-center justify-center px-4 pt-3 pb-3 overflow-hidden shrink-0 rounded-t-3xl"
            style={{ background: "linear-gradient(160deg,#00695C 0%,#00897B 45%,#26A69A 75%,#80CBC4 100%)", minHeight: 75 }}>
            <button onClick={onClose} className="absolute top-2 left-2 w-7 h-7 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center z-10">
              <ArrowLeft className="w-3.5 h-3.5 text-white" />
            </button>
            <button onClick={onClose} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center z-10 text-white font-bold text-[11px]">✕</button>
            <div className="text-xl mb-0.5 relative z-10">🏗️</div>
            <h1 className="text-[13px] font-extrabold text-white tracking-wide relative z-10 text-center">Rent Property - Builder/Company</h1>
            <p className="text-[10px] text-white/80 relative z-10 mt-0.5 text-center">List your property for rent</p>
          </div>

          <div className="text-center px-3 py-1.5 bg-gradient-to-r from-teal-50 to-emerald-100 border-b border-teal-200 shrink-0">
            <h2 className="text-[12px] font-bold text-[#00695C]">{steps[step]}</h2>
            <p className="text-[9px] text-green-500 mt-0.5">Step {step + 1} of {steps.length} — {subtitles[step]}</p>
          </div>

          <div className="flex items-start justify-between px-1.5 py-1.5 shrink-0 border-b border-gray-100 overflow-x-auto">
            {steps.map((s, i) => (
              <div key={i} className="flex-1 flex flex-col items-center min-w-[50px]">
                <div className={`w-5 h-5 rounded-full text-[9px] flex items-center justify-center font-bold ${i < step ? "bg-green-500 text-white" : i === step ? "bg-[#00695C] text-white" : "bg-gray-200 text-gray-500"}`}>
                  {i < step ? "✓" : i + 1}
                </div>
                <p className={`text-[8px] mt-0.5 text-center px-0.5 ${i === step ? "text-[#00695C] font-bold" : "text-gray-400"}`}>{s}</p>
              </div>
            ))}
          </div>

          <div className="px-3 py-2.5 overflow-y-auto flex-1">
            <MobContentRentBuilder
              step={step}
              inp={inMob}
              formData={formData}
              updateForm={updateForm}
              imagePreviews={imagePreviews}
              handleImageUpload={handleImageUpload}
              removeImage={removeImage}
              handleVideoUpload={handleVideoUpload}
              videoPreview={videoPreview}
              removeVideo={removeVideo}
              handleDocumentUpload={handleDocumentUpload}
              toggleAmenity={toggleAmenity}
              availableAmenities={availableAmenities}
              customAmenitiesList={customAmenitiesList}
              addCustomAmenity={addCustomAmenity}
              removeCustomAmenity={removeCustomAmenity}
              yesNoOptions={yesNoOptions}
              handleCoverImageUpload={handleCoverImageUpload}
              handleFloorPlanUpload={handleFloorPlanUpload}
              coverPreview={coverPreview}
              floorPlanPreview={floorPlanPreview}
              removeCoverImage={removeCoverImage}
              removeFloorPlan={removeFloorPlan}
              startDrawing={startDrawing}
              draw={draw}
              stopDrawing={stopDrawing}
              clearSignature={clearSignature}
              signaturePoints={signaturePoints}
              allSignaturePoints={allSignaturePoints}
              setAllSignaturePoints={setAllSignaturePoints}
            />
          </div>

          <div className="flex flex-col shrink-0 bg-white border-t border-teal-100">
            <div className="h-[2px] w-full bg-gradient-to-r from-[#00695C] via-[#26A69A] to-[#80CBC4]" />
            {step < steps.length - 1 && (
              <div className="px-3 pt-1.5 pb-0.5">
                <div className="flex justify-between mb-0.5">
                  <span className="text-[8px] text-gray-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#26A69A] inline-block" />Form completion</span>
                  <span className="text-[8px] text-[#00695C] font-bold">{Math.round(((step + 1) / steps.length) * 100)}%</span>
                </div>
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#00695C] to-[#26A69A] rounded-full transition-all duration-500" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
                </div>
              </div>
            )}
            <div className="flex justify-center gap-1 pt-1">
              {steps.map((_, i) => (
                <div key={i} className={`rounded-full transition-all duration-300 ${i < step ? 'w-2.5 h-1 bg-green-400' : i === step ? 'w-4 h-1 bg-[#00695C]' : 'w-1 h-1 bg-gray-200'}`} />
              ))}
            </div>
            <div className="flex gap-2 px-3 py-2">
              {step > 0 && (
                <button className="px-3 py-1.5 text-[12px] font-semibold text-[#00695C] bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 flex items-center gap-1" onClick={() => setStep(step - 1)}>
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              )}
              <button
                className={`flex-1 py-2 text-[12px] font-semibold text-white rounded-xl flex items-center justify-center gap-1 shadow ${step === steps.length - 1 ? 'bg-gradient-to-r from-green-600 to-teal-600' : 'bg-gradient-to-r from-[#00695C] to-[#00897B]'}`}
                onClick={() => step === steps.length - 1 ? handleSubmit() : setStep(step + 1)}
              >
                {step === steps.length - 1 ? <><span>✓</span> Submit Form</> : <>Continue →</>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP */}
      <div className="fixed inset-0 bg-black/60 z-50 hidden sm:flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
          <div className="relative flex flex-col items-center justify-center min-h-[65px] px-4 pt-2.5 pb-2.5 overflow-hidden shrink-0 rounded-3xl"
            style={{ background: "linear-gradient(160deg,#00695C 0%,#00897B 45%,#26A69A 75%,#80CBC4 100%)" }}>
            <button onClick={onClose} className="absolute top-2 left-2 w-7 h-7 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center z-10">
              <ArrowLeft className="w-3.5 h-3.5 text-white" />
            </button>
            <button onClick={onClose} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center z-10 text-white font-bold text-[11px]">✕</button>
            <div className="text-xl mb-0.5 relative z-10">🏗️</div>
            <h1 className="text-[14px] font-extrabold text-white tracking-wide relative z-10">Rent Property - Builder/Company</h1>
            <p className="text-[10px] text-white/80 relative z-10 mt-0.5">List your property for rent</p>
          </div>

          <div className="text-center px-4 py-1.5 bg-gradient-to-r from-teal-50 to-emerald-100 border-b border-teal-200 shrink-0">
            <h2 className="text-[12px] font-bold text-[#00695C]">{steps[step]}</h2>
            <p className="text-[9px] text-green-500 mt-0.5">Step {step + 1} of {steps.length} — {subtitles[step]}</p>
          </div>

          <div className="flex items-start justify-between px-2 sm:px-3 py-1.5 shrink-0 border-b border-gray-100 overflow-x-auto">
            {steps.map((s, i) => (
              <div key={i} className="flex-1 flex flex-col items-center min-w-[54px]">
                <div className={`w-5.5 h-5.5 rounded-full text-[10px] flex items-center justify-center font-bold ${i < step ? "bg-green-500 text-white" : i === step ? "bg-[#00695C] text-white" : "bg-gray-200 text-gray-500"}`}>
                  {i < step ? "✓" : i + 1}
                </div>
                <p className={`text-[8px] mt-0.5 text-center px-0.5 ${i === step ? "text-[#00695C] font-bold" : "text-gray-400"}`}>{s}</p>
              </div>
            ))}
          </div>

          <div className="px-3 sm:px-4 py-3 overflow-y-auto flex-1">
            <DtContentRentBuilder
              step={step}
              inp={inDt}
              formData={formData}
              updateForm={updateForm}
              imagePreviews={imagePreviews}
              handleImageUpload={handleImageUpload}
              removeImage={removeImage}
              handleVideoUpload={handleVideoUpload}
              videoPreview={videoPreview}
              removeVideo={removeVideo}
              handleDocumentUpload={handleDocumentUpload}
              toggleAmenity={toggleAmenity}
              availableAmenities={availableAmenities}
              customAmenitiesList={customAmenitiesList}
              addCustomAmenity={addCustomAmenity}
              removeCustomAmenity={removeCustomAmenity}
              yesNoOptions={yesNoOptions}
              handleCoverImageUpload={handleCoverImageUpload}
              handleFloorPlanUpload={handleFloorPlanUpload}
              coverPreview={coverPreview}
              floorPlanPreview={floorPlanPreview}
              removeCoverImage={removeCoverImage}
              removeFloorPlan={removeFloorPlan}
              startDrawing={startDrawing}
              draw={draw}
              stopDrawing={stopDrawing}
              clearSignature={clearSignature}
              signaturePoints={signaturePoints}
              allSignaturePoints={allSignaturePoints}
              setAllSignaturePoints={setAllSignaturePoints}
            />
          </div>

          <div className="flex flex-col shrink-0 bg-white rounded-b-2xl border-t border-teal-100 overflow-hidden">
            <div className="h-[2px] w-full bg-gradient-to-r from-[#00695C] via-[#26A69A] to-[#80CBC4]" />
            {step < steps.length - 1 && (
              <div className="px-4 pt-1.5 pb-0.5">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-[8px] text-gray-400 font-medium flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#26A69A] inline-block" />Form completion</span>
                  <span className="text-[8px] text-[#00695C] font-bold">{Math.round(((step + 1) / steps.length) * 100)}%</span>
                </div>
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#00695C] to-[#26A69A] rounded-full transition-all duration-500" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
                </div>
              </div>
            )}
            <div className="flex justify-center gap-1.5 pt-1">
              {steps.map((_, i) => (
                <div key={i} className={`rounded-full transition-all duration-300 ${i < step ? 'w-3 h-1.5 bg-green-400' : i === step ? 'w-5 h-1.5 bg-[#00695C]' : 'w-1.5 h-1.5 bg-gray-200'}`} />
              ))}
            </div>
            <div className="flex gap-2 px-4 py-2">
              {step > 0 && (
                <button className="px-4 py-1.5 text-[12px] font-semibold text-[#00695C] bg-teal-50 hover:bg-teal-100 rounded-lg flex items-center gap-1 border border-teal-200" onClick={() => setStep(step - 1)}>
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              )}
              <button className={`px-5 py-1.5 text-[12px] font-semibold text-white rounded-lg flex items-center gap-1.5 ml-auto shadow-md hover:-translate-y-0.5 ${step === steps.length - 1 ? 'bg-gradient-to-r from-green-600 to-teal-600' : 'bg-gradient-to-r from-[#00695C] to-[#00897B]'}`}
                onClick={() => step === steps.length - 1 ? handleSubmit() : setStep(step + 1)}>
                {step === steps.length - 1 ? <><span>✓</span> Submit Form</> : <>Continue <span className="text-sm">→</span></>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// MOBILE CONTENT - BUILDER RENT
function MobContentRentBuilder({ step, inp, formData, updateForm, imagePreviews, handleImageUpload, removeImage, handleVideoUpload, videoPreview, removeVideo, handleDocumentUpload, toggleAmenity, availableAmenities, customAmenitiesList, addCustomAmenity, removeCustomAmenity, yesNoOptions, handleCoverImageUpload, handleFloorPlanUpload, coverPreview, floorPlanPreview, removeCoverImage, removeFloorPlan, startDrawing, draw, stopDrawing, clearSignature, signaturePoints, allSignaturePoints, setAllSignaturePoints }) {
  const ta = `${inp} resize-y`;
  const signatureCanvasRef = useRef(null);

  useEffect(() => {
    const canvas = signatureCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      allSignaturePoints.forEach(stroke => {
        if (stroke.length > 1) {
          ctx.beginPath();
          ctx.strokeStyle = '#00695C';
          ctx.lineWidth = 2;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          stroke.forEach((point, index) => {
            if (index === 0) {
              ctx.moveTo(point.x, point.y);
            } else {
              ctx.lineTo(point.x, point.y);
            }
          });
          ctx.stroke();
        }
      });
      
      if (signaturePoints.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = '#00695C';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        signaturePoints.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
      }
    }
  }, [signaturePoints, allSignaturePoints]);

  // STEP 0: Company Details
  if (step === 0) return (
    <>
      <Field label="Builder / Company Name" required>
        <input className={inp} placeholder="Enter company name" value={formData.companyName} onChange={(e) => updateForm("companyName", e.target.value)} />
      </Field>
      <Field label="Company Registration Number" required>
        <input className={inp} placeholder="Enter registration number" value={formData.companyRegNumber} onChange={(e) => updateForm("companyRegNumber", e.target.value)} />
      </Field>
      <Field label="RERA Registration Number" required>
        <input className={inp} placeholder="Enter RERA number" value={formData.reraNumber} onChange={(e) => updateForm("reraNumber", e.target.value)} />
      </Field>
      <Field label="GST Number">
        <input className={inp} placeholder="Enter GST number" value={formData.gstNumber} onChange={(e) => updateForm("gstNumber", e.target.value)} />
      </Field>
      <Field label="Years of Experience" required>
        <input className={inp} type="number" placeholder="Enter years of experience" value={formData.yearsOfExperience} onChange={(e) => updateForm("yearsOfExperience", e.target.value)} />
      </Field>
      <Field label="Company Website (Optional)">
        <input className={inp} placeholder="e.g. www.company.com" value={formData.companyWebsite} onChange={(e) => updateForm("companyWebsite", e.target.value)} />
      </Field>
      <Field label="Company Profile / About Us" required>
        <textarea className={`${ta} min-h-[60px]`} placeholder="Describe your company background" value={formData.companyProfile} onChange={(e) => updateForm("companyProfile", e.target.value)} />
      </Field>
    </>
  );

  // STEP 1: Authorized Person
  if (step === 1) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Authorized Person Details</h3>
      </div>
      <Field label="Full Name" required>
        <input className={inp} placeholder="Enter authorized person's full name" value={formData.authFullName} onChange={(e) => updateForm("authFullName", e.target.value)} />
      </Field>
      <Field label="Designation" required>
        <input className={inp} placeholder="e.g. Director, Manager" value={formData.authDesignation} onChange={(e) => updateForm("authDesignation", e.target.value)} />
      </Field>
      <Field label="Mobile Number" required>
        <input className={inp} type="tel" placeholder="Enter 10-digit mobile number" value={formData.authMobile} onChange={(e) => updateForm("authMobile", e.target.value)} />
      </Field>
      <Field label="Email Address" required>
        <input className={inp} type="email" placeholder="Enter email address" value={formData.authEmail} onChange={(e) => updateForm("authEmail", e.target.value)} />
      </Field>
      <Field label="WhatsApp Number">
        <input className={inp} type="tel" placeholder="Enter WhatsApp number" value={formData.authWhatsapp} onChange={(e) => updateForm("authWhatsapp", e.target.value)} />
      </Field>
      <Field label="Profile Photo" required>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".jpg,.jpeg,.png" className="hidden" id="m-authphoto" onChange={(e) => handleDocumentUpload("authPhoto", e)} />
          <label htmlFor="m-authphoto" className="cursor-pointer flex flex-col items-center">
            <User className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Photo</span>
            <span className="text-[9px] text-gray-400">JPG/PNG (Max 2MB)</span>
          </label>
        </div>
        {formData.authPhoto && <p className="text-[10px] text-green-600 mt-1">✓ {formData.authPhoto.name}</p>}
      </Field>
    </>
  );

  // STEP 2: Office Address
  if (step === 2) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Office Address</h3>
      </div>
      <Field label="Office Address" required>
        <textarea className={`${ta} min-h-[55px]`} placeholder="Enter complete office address" value={formData.officeAddress} onChange={(e) => updateForm("officeAddress", e.target.value)} />
      </Field>
      <Field label="City" required>
        <input className={inp} placeholder="Enter city" value={formData.officeCity} onChange={(e) => updateForm("officeCity", e.target.value)} />
      </Field>
      <Field label="District" required>
        <input className={inp} placeholder="Enter district" value={formData.officeDistrict} onChange={(e) => updateForm("officeDistrict", e.target.value)} />
      </Field>
      <Field label="State" required>
        <input className={inp} placeholder="Enter state" value={formData.officeState} onChange={(e) => updateForm("officeState", e.target.value)} />
      </Field>
      <Field label="PIN Code" required>
        <input className={inp} type="number" placeholder="Enter 6-digit PIN code" value={formData.officePinCode} onChange={(e) => updateForm("officePinCode", e.target.value)} />
      </Field>
      <Field label="Landmark">
        <input className={inp} placeholder="Enter nearby landmark" value={formData.officeLandmark} onChange={(e) => updateForm("officeLandmark", e.target.value)} />
      </Field>
    </>
  );

  // STEP 3: Identity & Business Verification
  if (step === 3) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Identity & Business Verification</h3>
      </div>
      <Field label="Aadhaar Number" required>
        <input className={inp} placeholder="Enter 12-digit Aadhaar number" value={formData.aadhaarNumber} onChange={(e) => updateForm("aadhaarNumber", e.target.value)} />
      </Field>
      <Field label="PAN Number" required>
        <input className={inp} placeholder="Enter 10-character PAN number" value={formData.panNumber} onChange={(e) => updateForm("panNumber", e.target.value)} />
      </Field>

      <Field label="Upload Aadhaar Card" required>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-authaadhaar" onChange={(e) => handleDocumentUpload("aadhaarCard", e)} />
          <label htmlFor="m-authaadhaar" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Aadhaar</span>
            <span className="text-[9px] text-gray-400">PDF (Max 2MB)</span>
          </label>
        </div>
        {formData.aadhaarCard && <p className="text-[10px] text-green-600 mt-1">✓ {formData.aadhaarCard.name}</p>}
      </Field>

      <Field label="Upload PAN Card" required>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-authpan" onChange={(e) => handleDocumentUpload("panCard", e)} />
          <label htmlFor="m-authpan" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload PAN</span>
            <span className="text-[9px] text-gray-400">PDF (Max 2MB)</span>
          </label>
        </div>
        {formData.panCard && <p className="text-[10px] text-green-600 mt-1">✓ {formData.panCard.name}</p>}
      </Field>

      <Field label="Upload Company Registration Certificate" required>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-companyreg" onChange={(e) => handleDocumentUpload("companyRegCert", e)} />
          <label htmlFor="m-companyreg" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Registration</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.companyRegCert && <p className="text-[10px] text-green-600 mt-1">✓ {formData.companyRegCert.name}</p>}
      </Field>

      <Field label="Upload GST Certificate (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-gstcert" onChange={(e) => handleDocumentUpload("gstCert", e)} />
          <label htmlFor="m-gstcert" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload GST</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.gstCert && <p className="text-[10px] text-green-600 mt-1">✓ {formData.gstCert.name}</p>}
      </Field>

      <Field label="Upload RERA Certificate" required>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-reracert" onChange={(e) => handleDocumentUpload("reraCert", e)} />
          <label htmlFor="m-reracert" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload RERA</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.reraCert && <p className="text-[10px] text-green-600 mt-1">✓ {formData.reraCert.name}</p>}
      </Field>

      <Field label="Upload Company PAN Card (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-companypan" onChange={(e) => handleDocumentUpload("companyPanCard", e)} />
          <label htmlFor="m-companypan" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-6 h-6 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Company PAN</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.companyPanCard && <p className="text-[10px] text-green-600 mt-1">✓ {formData.companyPanCard.name}</p>}
      </Field>
    </>
  );

  // STEP 4: Property Details
  if (step === 4) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Property Details</h3>
      </div>
      <Field label="Property Title / Name" required>
        <input className={inp} placeholder="e.g. Green Valley 3BHK Apartment" value={formData.propertyTitle} onChange={(e) => updateForm("propertyTitle", e.target.value)} />
      </Field>
      <Field label="Property Type" required>
        {["Independent House", "Independent Villa", "Duplex Residential Unit"].map(t => (
          <label key={t} className="flex items-center gap-2 text-[11px] mb-1 cursor-pointer">
            <input type="radio" name="mob-ptype" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.propertyType === t} onChange={() => updateForm("propertyType", t)} />
            {t}
          </label>
        ))}
      </Field>
      <Field label="Property Address" required>
        <textarea className={`${ta} min-h-[55px]`} placeholder="Enter complete property address" value={formData.propertyAddress} onChange={(e) => updateForm("propertyAddress", e.target.value)} />
      </Field>
      <Field label="City" required>
        <input className={inp} placeholder="Enter city name" value={formData.propertyCity} onChange={(e) => updateForm("propertyCity", e.target.value)} />
      </Field>
      <Field label="Area Details" required hint="In square feet">
        <div className="grid grid-cols-2 gap-1.5">
          <input className={inp} type="number" placeholder="Build-up Area" value={formData.builtUpArea} onChange={(e) => updateForm("builtUpArea", e.target.value)} />
          <input className={inp} type="number" placeholder="Carpet Area" value={formData.carpetArea} onChange={(e) => updateForm("carpetArea", e.target.value)} />
        </div>
      </Field>
      <Field label="Room Details">
        <div className="grid grid-cols-2 gap-1.5">
          <input className={inp} type="number" placeholder="Bedrooms" value={formData.bedrooms} onChange={(e) => updateForm("bedrooms", e.target.value)} />
          <input className={inp} type="number" placeholder="Bathrooms" value={formData.bathrooms} onChange={(e) => updateForm("bathrooms", e.target.value)} />
        </div>
      </Field>
      <Field label="Furnishing Status" required>
        {["Full Furnish", "Semi Furnish", "Unfurnished"].map(f => (
          <label key={f} className="flex items-center gap-2 text-[11px] mb-1 cursor-pointer">
            <input type="radio" name="mob-furnish" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.furnishingStatus === f} onChange={() => updateForm("furnishingStatus", f)} />
            {f}
          </label>
        ))}
      </Field>
      <Field label="Parking">
        <div className="flex gap-4">
          <label className="flex items-center gap-1.5 text-[11px] cursor-pointer">
            <input type="radio" name="mob-parking" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.parking === "yes"} onChange={() => updateForm("parking", "yes")} />
            Yes
          </label>
          <label className="flex items-center gap-1.5 text-[11px] cursor-pointer">
            <input type="radio" name="mob-parking" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.parking === "no"} onChange={() => updateForm("parking", "no")} />
            No
          </label>
        </div>
      </Field>
      <Field label="Rental Duration">
        {["Short Term", "Long Term", "Flexible"].map(duration => (
          <label key={duration} className="flex items-center gap-1.5 text-[10px] cursor-pointer">
            <input type="radio" name="mob-duration" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.rentalDuration === duration} onChange={() => updateForm("rentalDuration", duration)} />
            {duration}
          </label>
        ))}
      </Field>
      <Field label="Occupancy Details">
        {["Single", "Family", "Bachelors", "Company Lease"].map(occupancy => (
          <label key={occupancy} className="flex items-center gap-1.5 text-[10px] cursor-pointer">
            <input type="radio" name="mob-occupancy" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.occupancyDetails === occupancy} onChange={() => updateForm("occupancyDetails", occupancy)} />
            {occupancy}
          </label>
        ))}
      </Field>
      <Field label="Pet Friendly">
        <div className="flex gap-2">
          {yesNoOptions.map(option => (
            <label key={option} className="flex items-center gap-1.5 text-[10px] cursor-pointer">
              <input type="radio" name="mob-pet" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.petFriendly === option} onChange={() => updateForm("petFriendly", option)} />
              {option}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Garden Space">
        <div className="flex gap-2">
          {yesNoOptions.map(option => (
            <label key={option} className="flex items-center gap-1.5 text-[10px] cursor-pointer">
              <input type="radio" name="mob-garden" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.gardenSpace === option} onChange={() => updateForm("gardenSpace", option)} />
              {option}
            </label>
          ))}
        </div>
      </Field>
      <Field label="Terrace / Balcony">
        <div className="flex gap-2">
          {yesNoOptions.map(option => (
            <label key={option} className="flex items-center gap-1.5 text-[10px] cursor-pointer">
              <input type="radio" name="mob-terrace" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.terrace === option} onChange={() => updateForm("terrace", option)} />
              {option}
            </label>
          ))}
        </div>
      </Field>
    </>
  );

  // STEP 5: Pricing & Amenities
  if (step === 5) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Pricing & Amenities</h3>
      </div>
      <Field label="Listing Purpose" required>
        <div className="flex gap-4">
          <label className="flex items-center gap-1.5 text-[11px] cursor-pointer">
            <input type="radio" name="mob-purpose" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.listingPurpose === "rent"} onChange={() => updateForm("listingPurpose", "rent")} />
            For Rent
          </label>
        </div>
      </Field>
      <Field label="Expected Rent (₹/month)" required>
        <input className={inp} placeholder="e.g. 15,000" value={formData.expectedPrice} onChange={(e) => updateForm("expectedPrice", e.target.value)} />
      </Field>
      
      <Field label="Budget Range (₹/month)" hint="Set a range for negotiation">
        <div className="flex gap-1">
          <input className={inp} type="number" placeholder="Min" value={formData.budgetRange.min} onChange={(e) => updateForm("budgetRange", { ...formData.budgetRange, min: e.target.value })} />
          <input className={inp} type="number" placeholder="Max" value={formData.budgetRange.max} onChange={(e) => updateForm("budgetRange", { ...formData.budgetRange, max: e.target.value })} />
        </div>
      </Field>

      <Field label="Price Type">
        <div className="flex gap-4">
          <label className="flex items-center gap-1.5 text-[11px] cursor-pointer">
            <input type="radio" name="mob-priceType" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.priceType === "fixed"} onChange={() => updateForm("priceType", "fixed")} />
            Fixed
          </label>
          <label className="flex items-center gap-1.5 text-[11px] cursor-pointer">
            <input type="radio" name="mob-priceType" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.priceType === "negotiable"} onChange={() => updateForm("priceType", "negotiable")} />
            Negotiable
          </label>
        </div>
      </Field>
      <Field label="Maintenance (₹/month)">
        <input className={inp} placeholder="Enter monthly maintenance" value={formData.maintenance} onChange={(e) => updateForm("maintenance", e.target.value)} />
      </Field>
      <Field label="Available From">
        <input className={inp} type="date" value={formData.availableFrom} onChange={(e) => updateForm("availableFrom", e.target.value)} />
      </Field>
      <Field label="Amenities">
        <div className="flex flex-wrap gap-1 mt-0.5">
          {availableAmenities.map(a => (
            <span key={a} onClick={() => toggleAmenity(a)} className={`px-1.5 py-0.5 text-[10px] rounded-full border cursor-pointer transition-all ${formData.selectedAmenities.includes(a) ? 'bg-[#00695C] text-white border-[#00695C]' : 'bg-teal-50 text-[#00695C] border-teal-200 hover:bg-teal-100'}`}>
              {a}
            </span>
          ))}
          {customAmenitiesList.map(a => (
            <span key={a} className="px-1.5 py-0.5 text-[10px] bg-[#00695C] text-white rounded-full border border-[#00695C] flex items-center gap-1">
              {a}
              <X className="w-2.5 h-2.5 cursor-pointer hover:text-red-200" onClick={() => removeCustomAmenity(a)} />
            </span>
          ))}
        </div>
      </Field>
      <Field label="Other Amenities">
        <div className="flex gap-1">
          <input className={`${inp} flex-1`} placeholder="e.g. Clubhouse, CCTV..." value={formData.otherAmenities} onChange={(e) => updateForm("otherAmenities", e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addCustomAmenity()} />
          <button onClick={addCustomAmenity} className="px-2 py-1 text-[11px] bg-[#00695C] text-white rounded-lg">Add</button>
        </div>
      </Field>
    </>
  );

  // STEP 6: Bank Details
  if (step === 6) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Bank Details</h3>
      </div>
      <Field label="Account Holder Name" required>
        <input className={inp} placeholder="Enter account holder name" value={formData.accountHolderName} onChange={(e) => updateForm("accountHolderName", e.target.value)} />
      </Field>
      <Field label="Bank Name" required>
        <input className={inp} placeholder="Enter bank name" value={formData.bankName} onChange={(e) => updateForm("bankName", e.target.value)} />
      </Field>
      <Field label="Account Number" required>
        <input className={inp} type="number" placeholder="Enter account number" value={formData.accountNumber} onChange={(e) => updateForm("accountNumber", e.target.value)} />
      </Field>
      <Field label="IFSC Code" required>
        <input className={inp} placeholder="Enter IFSC code" value={formData.ifscCode} onChange={(e) => updateForm("ifscCode", e.target.value)} />
      </Field>
      <Field label="UPI ID">
        <input className={inp} placeholder="Enter UPI ID (e.g. name@upi)" value={formData.upiId} onChange={(e) => updateForm("upiId", e.target.value)} />
      </Field>
    </>
  );

  // STEP 7: Social Media
  if (step === 7) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Social Media & Online Presence</h3>
      </div>
      <Field label="Website">
        <input className={inp} placeholder="Enter website URL" value={formData.website} onChange={(e) => updateForm("website", e.target.value)} />
      </Field>
      <Field label="Facebook Page">
        <input className={inp} placeholder="Enter Facebook URL" value={formData.facebook} onChange={(e) => updateForm("facebook", e.target.value)} />
      </Field>
      <Field label="Instagram">
        <input className={inp} placeholder="Enter Instagram URL" value={formData.instagram} onChange={(e) => updateForm("instagram", e.target.value)} />
      </Field>
      <Field label="LinkedIn">
        <input className={inp} placeholder="Enter LinkedIn URL" value={formData.linkedin} onChange={(e) => updateForm("linkedin", e.target.value)} />
      </Field>
      <Field label="YouTube Channel">
        <input className={inp} placeholder="Enter YouTube URL" value={formData.youtube} onChange={(e) => updateForm("youtube", e.target.value)} />
      </Field>
    </>
  );

  // STEP 8: Documents
  if (step === 8) return (
    <>
      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Company Documents</h3>
      </div>
      <p className="text-[9px] text-gray-400 mb-2">All documents must be in PDF format (Max 5MB each)</p>

      <Field label="Company Logo" required>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".jpg,.jpeg,.png" className="hidden" id="m-comp-logo" onChange={(e) => handleDocumentUpload("companyLogoDoc", e, 2)} />
          <label htmlFor="m-comp-logo" className="cursor-pointer flex flex-col items-center">
            <ImagePlus className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Logo</span>
            <span className="text-[9px] text-gray-400">JPG/PNG (Max 2MB)</span>
          </label>
        </div>
        {formData.companyLogoDoc && <p className="text-[10px] text-green-600 mt-1">✓ {formData.companyLogoDoc.name}</p>}
      </Field>

      <Field label="Company Profile Brochure (PDF)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-comp-brochure" onChange={(e) => handleDocumentUpload("companyBrochure", e)} />
          <label htmlFor="m-comp-brochure" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Brochure</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.companyBrochure && <p className="text-[10px] text-green-600 mt-1">✓ {formData.companyBrochure.name}</p>}
      </Field>

      <Field label="Project Brochure(s)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" multiple className="hidden" id="m-project-brochures" onChange={(e) => {
            const files = Array.from(e.target.files);
            const validFiles = files.filter(f => f.type === 'application/pdf');
            if (validFiles.length !== files.length) {
              alert('Only PDF files are allowed');
            }
            updateForm("projectBrochures", [...formData.projectBrochures, ...validFiles]);
          }} />
          <label htmlFor="m-project-brochures" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Brochures</span>
            <span className="text-[9px] text-gray-400">PDF, multiple allowed</span>
          </label>
        </div>
        {formData.projectBrochures.length > 0 && (
          <p className="text-[10px] text-green-600 mt-1">✓ {formData.projectBrochures.length} file(s) uploaded</p>
        )}
      </Field>

      <Field label="Company Registration Certificate" required>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-comp-reg-doc" onChange={(e) => handleDocumentUpload("companyRegCertDoc", e)} />
          <label htmlFor="m-comp-reg-doc" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Registration</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.companyRegCertDoc && <p className="text-[10px] text-green-600 mt-1">✓ {formData.companyRegCertDoc.name}</p>}
      </Field>

      <Field label="RERA Certificate" required>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-rera-doc" onChange={(e) => handleDocumentUpload("reraCertDoc", e)} />
          <label htmlFor="m-rera-doc" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload RERA</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.reraCertDoc && <p className="text-[10px] text-green-600 mt-1">✓ {formData.reraCertDoc.name}</p>}
      </Field>

      <Field label="GST Certificate (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-gst-doc" onChange={(e) => handleDocumentUpload("gstCertDoc", e)} />
          <label htmlFor="m-gst-doc" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload GST</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.gstCertDoc && <p className="text-[10px] text-green-600 mt-1">✓ {formData.gstCertDoc.name}</p>}
      </Field>

      <Field label="PAN Card" required>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-pan-doc" onChange={(e) => handleDocumentUpload("panCardDoc", e)} />
          <label htmlFor="m-pan-doc" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload PAN</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.panCardDoc && <p className="text-[10px] text-green-600 mt-1">✓ {formData.panCardDoc.name}</p>}
      </Field>

      <Field label="Authorized Signatory ID Proof" required>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-auth-id" onChange={(e) => handleDocumentUpload("authIdProof", e)} />
          <label htmlFor="m-auth-id" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload ID Proof</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.authIdProof && <p className="text-[10px] text-green-600 mt-1">✓ {formData.authIdProof.name}</p>}
      </Field>

      <Field label="Office Address Proof" required>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-office-proof" onChange={(e) => handleDocumentUpload("officeAddressProof", e)} />
          <label htmlFor="m-office-proof" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Address Proof</span>
            <span className="text-[9px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.officeAddressProof && <p className="text-[10px] text-green-600 mt-1">✓ {formData.officeAddressProof.name}</p>}
      </Field>

      {/* Media Upload for Property */}
      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Property Media</h3>
      </div>
      <Field label="Upload Cover Image" required hint="Max 2MB">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept="image/*" className="hidden" id="m-cover" onChange={handleCoverImageUpload} />
          <label htmlFor="m-cover" className="cursor-pointer flex flex-col items-center">
            <ImagePlus className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Cover</span>
            <span className="text-[9px] text-gray-400">JPG/PNG (Max 2MB)</span>
          </label>
        </div>
        {coverPreview && (
          <div className="mt-1 relative">
            <img src={coverPreview} alt="Cover" className="w-full h-16 object-cover rounded-lg" />
            <button onClick={removeCoverImage} className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-500 text-white rounded-full text-[9px] flex items-center justify-center">✕</button>
          </div>
        )}
      </Field>

      <Field label="Upload Property Photos (Max 3)" required hint={`${formData.propertyImages.length}/3 images uploaded`}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept="image/*" multiple className="hidden" id="m-imgs" onChange={handleImageUpload} disabled={formData.propertyImages.length >= 3} />
          <label htmlFor="m-imgs" className={`cursor-pointer flex flex-col items-center ${formData.propertyImages.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <ImagePlus className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Photos</span>
            <span className="text-[9px] text-gray-400">Max 3 photos</span>
          </label>
        </div>
        {imagePreviews.length > 0 && (
          <div className="mt-1 grid grid-cols-3 gap-1">
            {imagePreviews.map((preview, idx) => (
              <div key={idx} className="relative">
                <img src={preview} alt={`Preview ${idx + 1}`} className="w-full h-14 object-cover rounded-lg" />
                <button onClick={() => removeImage(idx)} className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-500 text-white rounded-full text-[9px] flex items-center justify-center">✕</button>
              </div>
            ))}
          </div>
        )}
      </Field>

      <Field label="Upload Property Video (Optional)" hint="Max 10MB">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept="video/mp4,video/mov" className="hidden" id="m-vid" onChange={handleVideoUpload} />
          <label htmlFor="m-vid" className="cursor-pointer flex flex-col items-center">
            <Video className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Video</span>
            <span className="text-[9px] text-gray-400">MP4/MOV (Max 10MB)</span>
          </label>
        </div>
        {videoPreview && (
          <div className="mt-1 relative">
            <video src={videoPreview} controls className="w-full h-20 object-cover rounded-lg" />
            <button onClick={removeVideo} className="absolute top-0 right-0 w-4.5 h-4.5 bg-red-500 text-white rounded-full text-[9px] flex items-center justify-center">✕</button>
          </div>
        )}
      </Field>

      <Field label="Upload Floor Plan" required hint="PDF only (Max 5MB)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-2.5 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="m-floorplan" onChange={handleFloorPlanUpload} />
          <label htmlFor="m-floorplan" className="cursor-pointer flex flex-col items-center">
            <Home className="w-5 h-5 text-[#00695C]" />
            <span className="text-[10px] font-semibold text-[#00695C]">Upload Floor Plan</span>
            <span className="text-[9px] text-gray-400">PDF only</span>
          </label>
        </div>
        {floorPlanPreview && (
          <div className="mt-1 relative">
            <p className="text-[10px] text-green-600">✓ {formData.floorPlan?.name}</p>
            <button onClick={removeFloorPlan} className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-500 text-white rounded-full text-[9px] flex items-center justify-center">✕</button>
          </div>
        )}
      </Field>
    </>
  );

  // STEP 9: Declaration
  if (step === 9) return (
    <>

      <div className="flex items-center gap-1.5 mt-3 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Authorized Signature</h3>
      </div>
      <label className="flex items-center gap-2 text-[10px] font-semibold text-[#00695C] mb-1">
        <PenTool className="w-3.5 h-3.5" /> Authorized Signatory <span className="text-red-500">*</span>
      </label>
      <p className="text-[10px] text-gray-500 mb-1.5">Draw your signature in the box below</p>
      <div className="relative">
        <canvas
          id="m-signatureCanvas"
          ref={signatureCanvasRef}
          width="400"
          height="100"
          className="signature-canvas w-full h-24 rounded-lg border-2 border-[#00695C] bg-white touch-none cursor-crosshair"
          onMouseDown={(e) => startDrawing(e, 'm-signatureCanvas')}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={(e) => startDrawing(e, 'm-signatureCanvas')}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        <button
          type="button"
          onClick={clearSignature}
          className="absolute top-1 right-1 bg-[#00695C] text-white px-2 py-0.5 rounded text-[10px] hover:bg-[#004d42] transition-colors"
        >
          Clear
        </button>
      </div>
      <Field label="Date" required>
        <input className={inp} type="date" value={formData.signatureDate} onChange={(e) => updateForm("signatureDate", e.target.value)} />
      </Field>
      <Field label="Place" required>
        <input className={inp} placeholder="Enter place" value={formData.signaturePlace} onChange={(e) => updateForm("signaturePlace", e.target.value)} />
      </Field>

      <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50">
        <div className="w-1 h-3 bg-[#00695C] rounded" />
        <h3 className="text-[11px] font-bold text-[#00695C]">Declaration</h3>
      </div>

      <div className="space-y-1.5">
        <label className="flex items-start gap-1.5 text-[10px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 mt-0.5 cursor-pointer" checked={formData.declarationAccepted} onChange={() => updateForm("declarationAccepted", !formData.declarationAccepted)} />
          <span>I confirm that I am the authorized representative of the builder/company.</span>
        </label>
        <label className="flex items-start gap-1.5 text-[10px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 mt-0.5 cursor-pointer" checked={formData.declarationAccepted} onChange={() => updateForm("declarationAccepted", !formData.declarationAccepted)} />
          <span>I certify that all information and documents provided are true and accurate.</span>
        </label>
        <label className="flex items-start gap-1.5 text-[10px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 mt-0.5 cursor-pointer" checked={formData.declarationAccepted} onChange={() => updateForm("declarationAccepted", !formData.declarationAccepted)} />
          <span>I agree to comply with all applicable real estate laws and regulations.</span>
        </label>
        <label className="flex items-start gap-1.5 text-[10px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-3.5 h-3.5 mt-0.5 cursor-pointer" checked={formData.declarationAccepted} onChange={() => updateForm("declarationAccepted", !formData.declarationAccepted)} />
          <span>I agree to the Terms & Conditions and Privacy Policy.</span>
        </label>
      </div>
    </>
  );

  return null;
}

// DESKTOP CONTENT - BUILDER RENT
function DtContentRentBuilder({ step, inp, formData, updateForm, imagePreviews, handleImageUpload, removeImage, handleVideoUpload, videoPreview, removeVideo, handleDocumentUpload, toggleAmenity, availableAmenities, customAmenitiesList, addCustomAmenity, removeCustomAmenity, yesNoOptions, handleCoverImageUpload, handleFloorPlanUpload, coverPreview, floorPlanPreview, removeCoverImage, removeFloorPlan, startDrawing, draw, stopDrawing, clearSignature, signaturePoints, allSignaturePoints, setAllSignaturePoints }) {
  const ta = `${inp} resize-y`;
  const signatureCanvasRef = useRef(null);

  useEffect(() => {
    const canvas = signatureCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      allSignaturePoints.forEach(stroke => {
        if (stroke.length > 1) {
          ctx.beginPath();
          ctx.strokeStyle = '#00695C';
          ctx.lineWidth = 2;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          stroke.forEach((point, index) => {
            if (index === 0) {
              ctx.moveTo(point.x, point.y);
            } else {
              ctx.lineTo(point.x, point.y);
            }
          });
          ctx.stroke();
        }
      });
      
      if (signaturePoints.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = '#00695C';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        signaturePoints.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
      }
    }
  }, [signaturePoints, allSignaturePoints]);

  // STEP 0: Company Details
  if (step === 0) return (
    <>
      <FieldDt label="Builder / Company Name" required>
        <input className={inp} placeholder="Enter company name" value={formData.companyName} onChange={(e) => updateForm("companyName", e.target.value)} />
      </FieldDt>
      <FieldDt label="Company Registration Number" required>
        <input className={inp} placeholder="Enter registration number" value={formData.companyRegNumber} onChange={(e) => updateForm("companyRegNumber", e.target.value)} />
      </FieldDt>
      <FieldDt label="RERA Registration Number" required>
        <input className={inp} placeholder="Enter RERA number" value={formData.reraNumber} onChange={(e) => updateForm("reraNumber", e.target.value)} />
      </FieldDt>
      <FieldDt label="GST Number">
        <input className={inp} placeholder="Enter GST number" value={formData.gstNumber} onChange={(e) => updateForm("gstNumber", e.target.value)} />
      </FieldDt>
      <FieldDt label="Years of Experience" required>
        <input className={inp} type="number" placeholder="Enter years of experience" value={formData.yearsOfExperience} onChange={(e) => updateForm("yearsOfExperience", e.target.value)} />
      </FieldDt>
      <FieldDt label="Company Website (Optional)">
        <input className={inp} placeholder="e.g. www.company.com" value={formData.companyWebsite} onChange={(e) => updateForm("companyWebsite", e.target.value)} />
      </FieldDt>
      <FieldDt label="Company Profile / About Us" required>
        <textarea className={`${ta} min-h-[70px]`} placeholder="Describe your company background" value={formData.companyProfile} onChange={(e) => updateForm("companyProfile", e.target.value)} />
      </FieldDt>
    </>
  );

  // STEP 1: Authorized Person
  if (step === 1) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Authorized Person Details</h3>
      </div>
      <FieldDt label="Full Name" required>
        <input className={inp} placeholder="Enter authorized person's full name" value={formData.authFullName} onChange={(e) => updateForm("authFullName", e.target.value)} />
      </FieldDt>
      <FieldDt label="Designation" required>
        <input className={inp} placeholder="e.g. Director, Manager" value={formData.authDesignation} onChange={(e) => updateForm("authDesignation", e.target.value)} />
      </FieldDt>
      <FieldDt label="Mobile Number" required>
        <input className={inp} type="tel" placeholder="Enter 10-digit mobile number" value={formData.authMobile} onChange={(e) => updateForm("authMobile", e.target.value)} />
      </FieldDt>
      <FieldDt label="Email Address" required>
        <input className={inp} type="email" placeholder="Enter email address" value={formData.authEmail} onChange={(e) => updateForm("authEmail", e.target.value)} />
      </FieldDt>
      <FieldDt label="WhatsApp Number">
        <input className={inp} type="tel" placeholder="Enter WhatsApp number" value={formData.authWhatsapp} onChange={(e) => updateForm("authWhatsapp", e.target.value)} />
      </FieldDt>
      <FieldDt label="Profile Photo" required>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".jpg,.jpeg,.png" className="hidden" id="dt-authphoto" onChange={(e) => handleDocumentUpload("authPhoto", e)} />
          <label htmlFor="dt-authphoto" className="cursor-pointer flex flex-col items-center">
            <User className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Photo</span>
            <span className="text-[11px] text-gray-400">JPG/PNG (Max 2MB)</span>
          </label>
        </div>
        {formData.authPhoto && <p className="text-[13px] text-green-600 mt-2">✓ {formData.authPhoto.name}</p>}
      </FieldDt>
    </>
  );

  // STEP 2: Office Address
  if (step === 2) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Office Address</h3>
      </div>
      <FieldDt label="Office Address" required>
        <textarea className={`${ta} min-h-[70px]`} placeholder="Enter complete office address" value={formData.officeAddress} onChange={(e) => updateForm("officeAddress", e.target.value)} />
      </FieldDt>
      <FieldDt label="City" required>
        <input className={inp} placeholder="Enter city" value={formData.officeCity} onChange={(e) => updateForm("officeCity", e.target.value)} />
      </FieldDt>
      <FieldDt label="District" required>
        <input className={inp} placeholder="Enter district" value={formData.officeDistrict} onChange={(e) => updateForm("officeDistrict", e.target.value)} />
      </FieldDt>
      <FieldDt label="State" required>
        <input className={inp} placeholder="Enter state" value={formData.officeState} onChange={(e) => updateForm("officeState", e.target.value)} />
      </FieldDt>
      <FieldDt label="PIN Code" required>
        <input className={inp} type="number" placeholder="Enter 6-digit PIN code" value={formData.officePinCode} onChange={(e) => updateForm("officePinCode", e.target.value)} />
      </FieldDt>
      <FieldDt label="Landmark">
        <input className={inp} placeholder="Enter nearby landmark" value={formData.officeLandmark} onChange={(e) => updateForm("officeLandmark", e.target.value)} />
      </FieldDt>
    </>
  );

  // STEP 3: Identity & Business Verification
  if (step === 3) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Identity & Business Verification</h3>
      </div>
      <FieldDt label="Aadhaar Number" required>
        <input className={inp} placeholder="Enter 12-digit Aadhaar number" value={formData.aadhaarNumber} onChange={(e) => updateForm("aadhaarNumber", e.target.value)} />
      </FieldDt>
      <FieldDt label="PAN Number" required>
        <input className={inp} placeholder="Enter 10-character PAN number" value={formData.panNumber} onChange={(e) => updateForm("panNumber", e.target.value)} />
      </FieldDt>

      <FieldDt label="Upload Aadhaar Card" required>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-authaadhaar" onChange={(e) => handleDocumentUpload("aadhaarCard", e)} />
          <label htmlFor="dt-authaadhaar" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Aadhaar Card</span>
            <span className="text-[11px] text-gray-400">PDF (Max 2MB)</span>
          </label>
        </div>
        {formData.aadhaarCard && <p className="text-[13px] text-green-600 mt-2">✓ {formData.aadhaarCard.name}</p>}
      </FieldDt>

      <FieldDt label="Upload PAN Card" required>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-authpan" onChange={(e) => handleDocumentUpload("panCard", e)} />
          <label htmlFor="dt-authpan" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload PAN Card</span>
            <span className="text-[11px] text-gray-400">PDF (Max 2MB)</span>
          </label>
        </div>
        {formData.panCard && <p className="text-[13px] text-green-600 mt-2">✓ {formData.panCard.name}</p>}
      </FieldDt>

      <FieldDt label="Upload Company Registration Certificate" required>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-companyreg" onChange={(e) => handleDocumentUpload("companyRegCert", e)} />
          <label htmlFor="dt-companyreg" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Registration Certificate</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.companyRegCert && <p className="text-[13px] text-green-600 mt-2">✓ {formData.companyRegCert.name}</p>}
      </FieldDt>

      <FieldDt label="Upload GST Certificate (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-gstcert" onChange={(e) => handleDocumentUpload("gstCert", e)} />
          <label htmlFor="dt-gstcert" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload GST Certificate</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.gstCert && <p className="text-[13px] text-green-600 mt-2">✓ {formData.gstCert.name}</p>}
      </FieldDt>

      <FieldDt label="Upload RERA Certificate" required>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-reracert" onChange={(e) => handleDocumentUpload("reraCert", e)} />
          <label htmlFor="dt-reracert" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload RERA Certificate</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.reraCert && <p className="text-[13px] text-green-600 mt-2">✓ {formData.reraCert.name}</p>}
      </FieldDt>

      <FieldDt label="Upload Company PAN Card (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-companypan" onChange={(e) => handleDocumentUpload("companyPanCard", e)} />
          <label htmlFor="dt-companypan" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Company PAN</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.companyPanCard && <p className="text-[13px] text-green-600 mt-2">✓ {formData.companyPanCard.name}</p>}
      </FieldDt>
    </>
  );

  // STEP 4: Property Details
  if (step === 4) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Property Details</h3>
      </div>
      <FieldDt label="Property Title / Name" required>
        <input className={inp} placeholder="e.g. Green Valley 3BHK Apartment" value={formData.propertyTitle} onChange={(e) => updateForm("propertyTitle", e.target.value)} />
      </FieldDt>
      <FieldDt label="Property Type" required>
        {["Independent House", "Independent Villa", "Duplex Residential Unit"].map(t => (
          <label key={t} className="flex items-center gap-2 text-[13px] mb-2 cursor-pointer">
            <input type="radio" name="dt-ptype" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.propertyType === t} onChange={() => updateForm("propertyType", t)} />
            {t}
          </label>
        ))}
      </FieldDt>
      <FieldDt label="Property Address" required>
        <textarea className={`${ta} min-h-[70px]`} placeholder="Enter complete property address" value={formData.propertyAddress} onChange={(e) => updateForm("propertyAddress", e.target.value)} />
      </FieldDt>
      <FieldDt label="City" required>
        <input className={inp} placeholder="Enter city name" value={formData.propertyCity} onChange={(e) => updateForm("propertyCity", e.target.value)} />
      </FieldDt>
      <FieldDt label="Area Details" required hint="Enter values in square feet">
        <div className="grid grid-cols-2 gap-2">
          <input className={inp} type="number" placeholder="Build-up Area" value={formData.builtUpArea} onChange={(e) => updateForm("builtUpArea", e.target.value)} />
          <input className={inp} type="number" placeholder="Carpet Area" value={formData.carpetArea} onChange={(e) => updateForm("carpetArea", e.target.value)} />
        </div>
      </FieldDt>
      <FieldDt label="Room Details">
        <div className="grid grid-cols-2 gap-2">
          <input className={inp} type="number" placeholder="No. of Bedrooms" value={formData.bedrooms} onChange={(e) => updateForm("bedrooms", e.target.value)} />
          <input className={inp} type="number" placeholder="No. of Bathrooms" value={formData.bathrooms} onChange={(e) => updateForm("bathrooms", e.target.value)} />
        </div>
      </FieldDt>
      <FieldDt label="Furnishing Status" required>
        {["Full Furnish", "Semi Furnish", "Unfurnished"].map(f => (
          <label key={f} className="flex items-center gap-2 text-[13px] mb-2 cursor-pointer">
            <input type="radio" name="dt-furnish" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.furnishingStatus === f} onChange={() => updateForm("furnishingStatus", f)} />
            {f}
          </label>
        ))}
      </FieldDt>
      <FieldDt label="Parking Facility">
        <div className="flex gap-5">
          <label className="flex items-center gap-2 text-[13px] cursor-pointer">
            <input type="radio" name="dt-parking" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.parking === "yes"} onChange={() => updateForm("parking", "yes")} />
            Yes, available
          </label>
          <label className="flex items-center gap-2 text-[13px] cursor-pointer">
            <input type="radio" name="dt-parking" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.parking === "no"} onChange={() => updateForm("parking", "no")} />
            No parking
          </label>
        </div>
      </FieldDt>
      <FieldDt label="Rental Duration">
        {["Short Term", "Long Term", "Flexible"].map(duration => (
          <label key={duration} className="flex items-center gap-2 text-[13px] mb-1.5 cursor-pointer">
            <input type="radio" name="dt-duration" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.rentalDuration === duration} onChange={() => updateForm("rentalDuration", duration)} />
            {duration}
          </label>
        ))}
      </FieldDt>
      <FieldDt label="Occupancy Details">
        {["Single", "Family", "Bachelors", "Company Lease"].map(occupancy => (
          <label key={occupancy} className="flex items-center gap-2 text-[13px] mb-1.5 cursor-pointer">
            <input type="radio" name="dt-occupancy" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.occupancyDetails === occupancy} onChange={() => updateForm("occupancyDetails", occupancy)} />
            {occupancy}
          </label>
        ))}
      </FieldDt>
      <FieldDt label="Pet Friendly">
        <div className="flex gap-5">
          {yesNoOptions.map(option => (
            <label key={option} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-pet" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.petFriendly === option} onChange={() => updateForm("petFriendly", option)} />
              {option}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Garden Space">
        <div className="flex gap-5">
          {yesNoOptions.map(option => (
            <label key={option} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-garden" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.gardenSpace === option} onChange={() => updateForm("gardenSpace", option)} />
              {option}
            </label>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Terrace / Balcony">
        <div className="flex gap-5">
          {yesNoOptions.map(option => (
            <label key={option} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="radio" name="dt-terrace" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.terrace === option} onChange={() => updateForm("terrace", option)} />
              {option}
            </label>
          ))}
        </div>
      </FieldDt>
    </>
  );

  // STEP 5: Pricing & Amenities
  if (step === 5) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Pricing & Amenities</h3>
      </div>
      <FieldDt label="Listing Purpose" required>
        <div className="flex gap-5">
          <label className="flex items-center gap-2 text-[13px] cursor-pointer">
            <input type="radio" name="dt-purpose" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.listingPurpose === "rent"} onChange={() => updateForm("listingPurpose", "rent")} />
            For Rent
          </label>
        </div>
      </FieldDt>
      <FieldDt label="Expected Rent (₹/month)" required>
        <input className={inp} placeholder="e.g. 15,000" value={formData.expectedPrice} onChange={(e) => updateForm("expectedPrice", e.target.value)} />
      </FieldDt>
      
      <FieldDt label="Budget Range (₹/month)" hint="Set a range for negotiation">
        <div className="flex gap-2">
          <input className={inp} type="number" placeholder="Min" value={formData.budgetRange.min} onChange={(e) => updateForm("budgetRange", { ...formData.budgetRange, min: e.target.value })} />
          <input className={inp} type="number" placeholder="Max" value={formData.budgetRange.max} onChange={(e) => updateForm("budgetRange", { ...formData.budgetRange, max: e.target.value })} />
        </div>
      </FieldDt>

      <FieldDt label="Price Type">
        <div className="flex gap-5">
          <label className="flex items-center gap-2 text-[13px] cursor-pointer">
            <input type="radio" name="dt-priceType" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.priceType === "fixed"} onChange={() => updateForm("priceType", "fixed")} />
            Fixed Price
          </label>
          <label className="flex items-center gap-2 text-[13px] cursor-pointer">
            <input type="radio" name="dt-priceType" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.priceType === "negotiable"} onChange={() => updateForm("priceType", "negotiable")} />
            Negotiable
          </label>
        </div>
      </FieldDt>
      <FieldDt label="Maintenance Charges (₹/month)">
        <input className={inp} placeholder="Enter monthly maintenance amount" value={formData.maintenance} onChange={(e) => updateForm("maintenance", e.target.value)} />
      </FieldDt>
      <FieldDt label="Available From" hint="Date from which the property is available">
        <input className={inp} type="date" value={formData.availableFrom} onChange={(e) => updateForm("availableFrom", e.target.value)} />
      </FieldDt>
      <FieldDt label="Select Amenities">
        <div className="flex flex-wrap gap-1.5 mt-1">
          {availableAmenities.map(a => (
            <span key={a} onClick={() => toggleAmenity(a)} className={`px-2.5 py-1.5 text-[13px] rounded-full border cursor-pointer transition-all ${formData.selectedAmenities.includes(a) ? 'bg-[#00695C] text-white border-[#00695C]' : 'bg-teal-50 text-[#00695C] border-teal-200 hover:bg-teal-100'}`}>
              {a}
            </span>
          ))}
          {customAmenitiesList.map(a => (
            <span key={a} className="px-2.5 py-1.5 text-[13px] bg-[#00695C] text-white rounded-full border border-[#00695C] flex items-center gap-1">
              {a}
              <X className="w-3.5 h-3.5 cursor-pointer hover:text-red-200" onClick={() => removeCustomAmenity(a)} />
            </span>
          ))}
        </div>
      </FieldDt>
      <FieldDt label="Other Amenities">
        <div className="flex gap-2">
          <input className={inp} placeholder="e.g. Clubhouse, CCTV, Solar Panel..." value={formData.otherAmenities} onChange={(e) => updateForm("otherAmenities", e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addCustomAmenity()} />
          <button onClick={addCustomAmenity} className="px-3 py-1.5 text-[13px] bg-[#00695C] text-white rounded-lg hover:bg-[#004d42] transition-colors">Add</button>
        </div>
      </FieldDt>
    </>
  );

  // STEP 6: Bank Details
  if (step === 6) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Bank Details</h3>
      </div>
      <FieldDt label="Account Holder Name" required>
        <input className={inp} placeholder="Enter account holder name" value={formData.accountHolderName} onChange={(e) => updateForm("accountHolderName", e.target.value)} />
      </FieldDt>
      <FieldDt label="Bank Name" required>
        <input className={inp} placeholder="Enter bank name" value={formData.bankName} onChange={(e) => updateForm("bankName", e.target.value)} />
      </FieldDt>
      <FieldDt label="Account Number" required>
        <input className={inp} type="number" placeholder="Enter account number" value={formData.accountNumber} onChange={(e) => updateForm("accountNumber", e.target.value)} />
      </FieldDt>
      <FieldDt label="IFSC Code" required>
        <input className={inp} placeholder="Enter IFSC code" value={formData.ifscCode} onChange={(e) => updateForm("ifscCode", e.target.value)} />
      </FieldDt>
      <FieldDt label="UPI ID">
        <input className={inp} placeholder="Enter UPI ID (e.g. name@upi)" value={formData.upiId} onChange={(e) => updateForm("upiId", e.target.value)} />
      </FieldDt>
    </>
  );

  // STEP 7: Social Media
  if (step === 7) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Social Media & Online Presence</h3>
      </div>
      <FieldDt label="Website">
        <input className={inp} placeholder="Enter website URL" value={formData.website} onChange={(e) => updateForm("website", e.target.value)} />
      </FieldDt>
      <FieldDt label="Facebook Page">
        <input className={inp} placeholder="Enter Facebook URL" value={formData.facebook} onChange={(e) => updateForm("facebook", e.target.value)} />
      </FieldDt>
      <FieldDt label="Instagram">
        <input className={inp} placeholder="Enter Instagram URL" value={formData.instagram} onChange={(e) => updateForm("instagram", e.target.value)} />
      </FieldDt>
      <FieldDt label="LinkedIn">
        <input className={inp} placeholder="Enter LinkedIn URL" value={formData.linkedin} onChange={(e) => updateForm("linkedin", e.target.value)} />
      </FieldDt>
      <FieldDt label="YouTube Channel">
        <input className={inp} placeholder="Enter YouTube URL" value={formData.youtube} onChange={(e) => updateForm("youtube", e.target.value)} />
      </FieldDt>
    </>
  );

  // STEP 8: Documents
  if (step === 8) return (
    <>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Company Documents</h3>
      </div>
      <p className="text-[11px] text-gray-400 mb-3">All documents must be in PDF format (Max 5MB each)</p>

      <FieldDt label="Company Logo" required>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".jpg,.jpeg,.png" className="hidden" id="dt-comp-logo" onChange={(e) => handleDocumentUpload("companyLogoDoc", e, 2)} />
          <label htmlFor="dt-comp-logo" className="cursor-pointer flex flex-col items-center">
            <ImagePlus className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Company Logo</span>
            <span className="text-[11px] text-gray-400">JPG/PNG (Max 2MB)</span>
          </label>
        </div>
        {formData.companyLogoDoc && <p className="text-[13px] text-green-600 mt-2">✓ {formData.companyLogoDoc.name}</p>}
      </FieldDt>

      <FieldDt label="Company Profile Brochure (PDF)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-comp-brochure" onChange={(e) => handleDocumentUpload("companyBrochure", e)} />
          <label htmlFor="dt-comp-brochure" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Profile Brochure</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.companyBrochure && <p className="text-[13px] text-green-600 mt-2">✓ {formData.companyBrochure.name}</p>}
      </FieldDt>

      <FieldDt label="Project Brochure(s)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" multiple className="hidden" id="dt-project-brochures" onChange={(e) => {
            const files = Array.from(e.target.files);
            const validFiles = files.filter(f => f.type === 'application/pdf');
            if (validFiles.length !== files.length) {
              alert('Only PDF files are allowed');
            }
            updateForm("projectBrochures", [...formData.projectBrochures, ...validFiles]);
          }} />
          <label htmlFor="dt-project-brochures" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Project Brochures</span>
            <span className="text-[11px] text-gray-400">PDF, multiple allowed</span>
          </label>
        </div>
        {formData.projectBrochures.length > 0 && (
          <p className="text-[13px] text-green-600 mt-2">✓ {formData.projectBrochures.length} file(s) uploaded</p>
        )}
      </FieldDt>

      <FieldDt label="Company Registration Certificate" required>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-comp-reg-doc" onChange={(e) => handleDocumentUpload("companyRegCertDoc", e)} />
          <label htmlFor="dt-comp-reg-doc" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Registration Certificate</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.companyRegCertDoc && <p className="text-[13px] text-green-600 mt-2">✓ {formData.companyRegCertDoc.name}</p>}
      </FieldDt>

      <FieldDt label="RERA Certificate" required>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-rera-doc" onChange={(e) => handleDocumentUpload("reraCertDoc", e)} />
          <label htmlFor="dt-rera-doc" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload RERA Certificate</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.reraCertDoc && <p className="text-[13px] text-green-600 mt-2">✓ {formData.reraCertDoc.name}</p>}
      </FieldDt>

      <FieldDt label="GST Certificate (Optional)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-gst-doc" onChange={(e) => handleDocumentUpload("gstCertDoc", e)} />
          <label htmlFor="dt-gst-doc" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload GST Certificate</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.gstCertDoc && <p className="text-[13px] text-green-600 mt-2">✓ {formData.gstCertDoc.name}</p>}
      </FieldDt>

      <FieldDt label="PAN Card" required>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-pan-doc" onChange={(e) => handleDocumentUpload("panCardDoc", e)} />
          <label htmlFor="dt-pan-doc" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload PAN Card</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.panCardDoc && <p className="text-[13px] text-green-600 mt-2">✓ {formData.panCardDoc.name}</p>}
      </FieldDt>

      <FieldDt label="Authorized Signatory ID Proof" required>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-auth-id" onChange={(e) => handleDocumentUpload("authIdProof", e)} />
          <label htmlFor="dt-auth-id" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload ID Proof</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.authIdProof && <p className="text-[13px] text-green-600 mt-2">✓ {formData.authIdProof.name}</p>}
      </FieldDt>

      <FieldDt label="Office Address Proof" required>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-office-proof" onChange={(e) => handleDocumentUpload("officeAddressProof", e)} />
          <label htmlFor="dt-office-proof" className="cursor-pointer flex flex-col items-center">
            <FileText className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Address Proof</span>
            <span className="text-[11px] text-gray-400">PDF (Max 5MB)</span>
          </label>
        </div>
        {formData.officeAddressProof && <p className="text-[13px] text-green-600 mt-2">✓ {formData.officeAddressProof.name}</p>}
      </FieldDt>

      {/* Media Upload for Property */}
      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Property Media</h3>
      </div>
      <FieldDt label="Upload Cover Image" required hint="Max 2MB">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept="image/*" className="hidden" id="dt-cover" onChange={handleCoverImageUpload} />
          <label htmlFor="dt-cover" className="cursor-pointer flex flex-col items-center">
            <ImagePlus className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Cover Image</span>
            <span className="text-[11px] text-gray-400">JPG/PNG (Max 2MB)</span>
          </label>
        </div>
        {coverPreview && (
          <div className="mt-2 relative">
            <img src={coverPreview} alt="Cover" className="w-full h-20 object-cover rounded-lg" />
            <button onClick={removeCoverImage} className="absolute -top-2 -right-2 w-5.5 h-5.5 bg-red-500 text-white rounded-full text-[11px] flex items-center justify-center">✕</button>
          </div>
        )}
      </FieldDt>

      <FieldDt label="Upload Property Photos (Max 3)" required hint={`${formData.propertyImages.length}/3 images uploaded`}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept="image/*" multiple className="hidden" id="dt-imgs" onChange={handleImageUpload} disabled={formData.propertyImages.length >= 3} />
          <label htmlFor="dt-imgs" className={`cursor-pointer flex flex-col items-center ${formData.propertyImages.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <ImagePlus className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Property Photos</span>
            <span className="text-[11px] text-gray-400">Max 3 photos</span>
          </label>
        </div>
        {imagePreviews.length > 0 && (
          <div className="mt-2 grid grid-cols-3 gap-2">
            {imagePreviews.map((preview, idx) => (
              <div key={idx} className="relative">
                <img src={preview} alt={`Preview ${idx + 1}`} className="w-full h-16 object-cover rounded-lg" />
                <button onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 w-5.5 h-5.5 bg-red-500 text-white rounded-full text-[11px] flex items-center justify-center">✕</button>
              </div>
            ))}
          </div>
        )}
      </FieldDt>

      <FieldDt label="Upload Property Video (Optional)" hint="Max 10MB">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept="video/mp4,video/mov" className="hidden" id="dt-vid" onChange={handleVideoUpload} />
          <label htmlFor="dt-vid" className="cursor-pointer flex flex-col items-center">
            <Video className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Video Tour</span>
            <span className="text-[11px] text-gray-400">MP4/MOV (Max 10MB)</span>
          </label>
        </div>
        {videoPreview && (
          <div className="mt-2 relative">
            <video src={videoPreview} controls className="w-full h-24 object-cover rounded-lg" />
            <button onClick={removeVideo} className="absolute top-2 right-2 w-6.5 h-6.5 bg-red-500 text-white rounded-full text-[13px] flex items-center justify-center">✕</button>
          </div>
        )}
      </FieldDt>

      <FieldDt label="Upload Floor Plan" required hint="PDF only (Max 5MB)">
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf" className="hidden" id="dt-floorplan" onChange={handleFloorPlanUpload} />
          <label htmlFor="dt-floorplan" className="cursor-pointer flex flex-col items-center">
            <Home className="w-7 h-7 text-[#00695C]" />
            <span className="text-[12px] font-semibold text-[#00695C] mt-1">Upload Floor Plan</span>
            <span className="text-[11px] text-gray-400">PDF only</span>
          </label>
        </div>
        {floorPlanPreview && (
          <div className="mt-2 relative">
            <p className="text-[13px] text-green-600">✓ {formData.floorPlan?.name}</p>
            <button onClick={removeFloorPlan} className="absolute -top-2 -right-2 w-5.5 h-5.5 bg-red-500 text-white rounded-full text-[11px] flex items-center justify-center">✕</button>
          </div>
        )}
      </FieldDt>
    </>
  );

  // STEP 9: Declaration
  if (step === 9) return (
    <>

      <div className="flex items-center gap-2 mt-4 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Authorized Signature</h3>
      </div>
      <label className="flex items-center gap-2 text-[13px] font-semibold text-[#00695C] mb-2">
        <PenTool className="w-4 h-4" /> Authorized Signatory <span className="text-red-500">*</span>
      </label>
      <p className="text-[12px] text-gray-500 mb-2">Draw your signature in the box below</p>
      <div className="relative">
        <canvas
          id="dt-signatureCanvas"
          ref={signatureCanvasRef}
          width="400"
          height="100"
          className="signature-canvas w-full h-32 rounded-lg border-2 border-[#00695C] bg-white touch-none cursor-crosshair"
          onMouseDown={(e) => startDrawing(e, 'dt-signatureCanvas')}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={(e) => startDrawing(e, 'dt-signatureCanvas')}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        <button
          type="button"
          onClick={clearSignature}
          className="absolute top-2 right-3 bg-[#00695C] text-white px-3 py-0.5 rounded text-xs hover:bg-[#004d42] transition-colors"
        >
          Clear
        </button>
      </div>
      <FieldDt label="Date" required>
        <input className={inp} type="date" value={formData.signatureDate} onChange={(e) => updateForm("signatureDate", e.target.value)} />
      </FieldDt>
      <FieldDt label="Place" required>
        <input className={inp} placeholder="Enter place" value={formData.signaturePlace} onChange={(e) => updateForm("signaturePlace", e.target.value)} />
      </FieldDt>

      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50">
        <div className="w-1 h-4 bg-[#00695C] rounded" />
        <h3 className="text-[14px] font-bold text-[#00695C]">Declaration</h3>
      </div>

      <div className="space-y-2.5">
        <label className="flex items-start gap-2.5 text-[13px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-4 h-4 mt-0.5 cursor-pointer" checked={formData.declarationAccepted} onChange={() => updateForm("declarationAccepted", !formData.declarationAccepted)} />
          <span>I confirm that I am the authorized representative of the builder/company.</span>
        </label>
        <label className="flex items-start gap-2.5 text-[13px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-4 h-4 mt-0.5 cursor-pointer" checked={formData.declarationAccepted} onChange={() => updateForm("declarationAccepted", !formData.declarationAccepted)} />
          <span>I certify that all information and documents provided are true and accurate.</span>
        </label>
        <label className="flex items-start gap-2.5 text-[13px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-4 h-4 mt-0.5 cursor-pointer" checked={formData.declarationAccepted} onChange={() => updateForm("declarationAccepted", !formData.declarationAccepted)} />
          <span>I agree to comply with all applicable real estate laws and regulations.</span>
        </label>
        <label className="flex items-start gap-2.5 text-[13px] cursor-pointer">
          <input type="checkbox" className="accent-[#00695C] w-4 h-4 mt-0.5 cursor-pointer" checked={formData.declarationAccepted} onChange={() => updateForm("declarationAccepted", !formData.declarationAccepted)} />
          <span>I agree to the Terms & Conditions and Privacy Policy.</span>
        </label>
      </div>
    </>
  );

  return null;
}