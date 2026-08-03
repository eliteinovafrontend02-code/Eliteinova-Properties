import React, { useState } from "react";
import { ArrowLeft, ImagePlus, Video, X } from "lucide-react";

const steps = ["Owner Details","Property Details","Pricing & Amenities","Media Upload","Document Upload"];
const subtitles = ["Enter your personal information","Tell us about your property","Set pricing & select amenities","Upload property photos & video","Upload ownership documents"];

const Field = ({ label, required, hint, children }) => (
  <div className="mb-2.5">
    <label className="block text-[11px] font-semibold text-[#00695C] mb-0.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {hint && <p className="text-[9px] text-gray-400 mt-0.5">{hint}</p>}
  </div>
);

const FieldDt = ({ label, required, hint, children }) => (
  <div className="mb-3">
    <label className="block text-xs sm:text-sm font-semibold text-[#00695C] mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {hint && <p className="text-[10px] text-gray-400 mt-1">{hint}</p>}
  </div>
);

const inMob = "w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-[11px] text-gray-700 placeholder:text-gray-300 placeholder:text-[10px] focus:outline-none focus:border-[#00695C] focus:ring-1 focus:ring-[#00695C]/20 bg-white transition-all";
const inDt  = "input w-full text-sm placeholder:text-gray-300 placeholder:text-xs";

const availableAmenities = ["Lift", "Power Backup", "Security", "Water Supply", "Garden", "Gym", "Pool"];

export default function OwnerFormModal({ isOpen, onClose }) {
  const [step, setStep] = useState(0);
  
  // Form state
  const [formData, setFormData] = useState({
    ownerName: "", contactNumber: "", emailId: "", address: "", idProof: "",
    propertyTitle: "", propertyCategory: "", propertyType: "", propertyAddress: "",
    city: "", builtUpArea: "", carpetArea: "", bedrooms: "", bathrooms: "",
    furnishingStatus: "", parking: "", listingPurpose: "", expectedPrice: "",
    priceType: "", maintenance: "", availableFrom: "", selectedAmenities: [],
    otherAmenities: "", propertyImages: [], propertyVideo: null, ownershipDoc: null,
    idProofDoc: null, additionalDocs: []
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoPreview, setVideoPreview] = useState(null);
  const [customAmenitiesList, setCustomAmenitiesList] = useState([]);

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [...formData.propertyImages, ...files];
    updateForm("propertyImages", newImages);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newImages = formData.propertyImages.filter((_, i) => i !== index);
    updateForm("propertyImages", newImages);
    URL.revokeObjectURL(imagePreviews[index]);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
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

  const handleDocumentUpload = (docType, e) => {
    const file = e.target.files[0];
    if (file) {
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

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* MOBILE (< sm) */}
      <div className="fixed inset-0 z-50 flex flex-col sm:hidden">
        <div className="bg-black/50" style={{ height: "10vh" }} onClick={onClose} />
        <div className="flex-1 bg-white rounded-3xl flex flex-col overflow-hidden shadow-2xl mx-5 mb-5">
          <div className="relative flex flex-col items-center justify-center px-4 pt-4 pb-5 overflow-hidden shrink-0 rounded-t-3xl"
            style={{ background: "linear-gradient(160deg,#00695C 0%,#00897B 45%,#26A69A 75%,#80CBC4 100%)", minHeight: 100 }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 15% 60%,rgba(255,255,255,.18) 0%,transparent 45%),radial-gradient(circle at 85% 25%,rgba(255,255,255,.12) 0%,transparent 40%)" }} />
            <svg className="absolute bottom-0 left-0 pointer-events-none" width="120" height="70" viewBox="0 0 160 90" xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="10" width="13" height="80" fill="white"/><polygon points="6.5,4 0,10 13,10" fill="white"/>
              <rect x="2" y="15" width="2" height="3" fill="#26A69A" opacity=".5"/><rect x="6" y="15" width="2" height="3" fill="#26A69A" opacity=".5"/><rect x="10" y="15" width="2" height="3" fill="#26A69A" opacity=".5"/>
              <rect x="2" y="22" width="2" height="3" fill="#26A69A" opacity=".5"/><rect x="6" y="22" width="2" height="3" fill="#26A69A" opacity=".5"/><rect x="10" y="22" width="2" height="3" fill="#26A69A" opacity=".5"/>
              <rect x="2" y="29" width="2" height="3" fill="#26A69A" opacity=".5"/><rect x="6" y="29" width="2" height="3" fill="#26A69A" opacity=".5"/><rect x="10" y="29" width="2" height="3" fill="#26A69A" opacity=".5"/>
              <rect x="2" y="36" width="2" height="3" fill="#26A69A" opacity=".5"/><rect x="6" y="36" width="2" height="3" fill="#26A69A" opacity=".5"/><rect x="10" y="36" width="2" height="3" fill="#26A69A" opacity=".5"/>
              <rect x="2" y="43" width="2" height="3" fill="#26A69A" opacity=".5"/><rect x="6" y="43" width="2" height="3" fill="#26A69A" opacity=".5"/><rect x="10" y="43" width="2" height="3" fill="#26A69A" opacity=".5"/>
              <rect x="15" y="28" width="9" height="62" fill="white"/><rect x="18" y="22" width="3" height="8" fill="white"/><rect x="19" y="18" width="1" height="6" fill="white"/>
              <rect x="16" y="33" width="2" height="3" fill="#26A69A" opacity=".45"/><rect x="20" y="33" width="2" height="3" fill="#26A69A" opacity=".45"/>
              <rect x="16" y="40" width="2" height="3" fill="#26A69A" opacity=".45"/><rect x="20" y="40" width="2" height="3" fill="#26A69A" opacity=".45"/>
              <rect x="16" y="47" width="2" height="3" fill="#26A69A" opacity=".45"/><rect x="20" y="47" width="2" height="3" fill="#26A69A" opacity=".45"/>
              <rect x="16" y="54" width="2" height="3" fill="#26A69A" opacity=".45"/><rect x="20" y="54" width="2" height="3" fill="#26A69A" opacity=".45"/>
              <rect x="26" y="35" width="22" height="55" fill="white"/>
              <rect x="28" y="40" width="3" height="4" fill="#26A69A" opacity=".4"/><rect x="34" y="40" width="3" height="4" fill="#26A69A" opacity=".4"/><rect x="40" y="40" width="3" height="4" fill="#26A69A" opacity=".4"/>
              <rect x="28" y="48" width="3" height="4" fill="#26A69A" opacity=".4"/><rect x="34" y="48" width="3" height="4" fill="#26A69A" opacity=".4"/><rect x="40" y="48" width="3" height="4" fill="#26A69A" opacity=".4"/>
              <rect x="28" y="56" width="3" height="4" fill="#26A69A" opacity=".4"/><rect x="34" y="56" width="3" height="4" fill="#26A69A" opacity=".4"/><rect x="40" y="56" width="3" height="4" fill="#26A69A" opacity=".4"/>
              <rect x="50" y="52" width="14" height="38" fill="white"/>
              <rect x="52" y="57" width="3" height="3" fill="#26A69A" opacity=".4"/><rect x="58" y="57" width="3" height="3" fill="#26A69A" opacity=".4"/>
              <rect x="66" y="42" width="12" height="48" fill="white"/><rect x="68" y="36" width="8" height="8" fill="white"/><rect x="70" y="32" width="4" height="6" fill="white"/>
              <rect x="67" y="47" width="2" height="3" fill="#26A69A" opacity=".4"/><rect x="72" y="47" width="2" height="3" fill="#26A69A" opacity=".4"/>
              <rect x="80" y="60" width="10" height="30" fill="white" opacity=".8"/>
              <rect x="92" y="50" width="8" height="40" fill="white" opacity=".75"/>
            </svg>
            <svg className="absolute bottom-0 right-0 pointer-events-none" width="120" height="70" viewBox="0 0 160 90" xmlns="http://www.w3.org/2000/svg">
              <rect x="147" y="10" width="13" height="80" fill="white"/><polygon points="153.5,4 147,10 160,10" fill="white"/>
              <rect x="148" y="15" width="2" height="3" fill="#26A69A" opacity=".5"/><rect x="152" y="15" width="2" height="3" fill="#26A69A" opacity=".5"/><rect x="156" y="15" width="2" height="3" fill="#26A69A" opacity=".5"/>
              <rect x="148" y="22" width="2" height="3" fill="#26A69A" opacity=".5"/><rect x="152" y="22" width="2" height="3" fill="#26A69A" opacity=".5"/><rect x="156" y="22" width="2" height="3" fill="#26A69A" opacity=".5"/>
              <rect x="148" y="29" width="2" height="3" fill="#26A69A" opacity=".5"/><rect x="152" y="29" width="2" height="3" fill="#26A69A" opacity=".5"/><rect x="156" y="29" width="2" height="3" fill="#26A69A" opacity=".5"/>
              <rect x="148" y="36" width="2" height="3" fill="#26A69A" opacity=".5"/><rect x="152" y="36" width="2" height="3" fill="#26A69A" opacity=".5"/><rect x="156" y="36" width="2" height="3" fill="#26A69A" opacity=".5"/>
              <rect x="148" y="43" width="2" height="3" fill="#26A69A" opacity=".5"/><rect x="152" y="43" width="2" height="3" fill="#26A69A" opacity=".5"/><rect x="156" y="43" width="2" height="3" fill="#26A69A" opacity=".5"/>
              <rect x="136" y="28" width="9" height="62" fill="white"/><rect x="138" y="22" width="3" height="8" fill="white"/><rect x="139" y="18" width="1" height="6" fill="white"/>
              <rect x="137" y="33" width="2" height="3" fill="#26A69A" opacity=".45"/><rect x="141" y="33" width="2" height="3" fill="#26A69A" opacity=".45"/>
              <rect x="137" y="40" width="2" height="3" fill="#26A69A" opacity=".45"/><rect x="141" y="40" width="2" height="3" fill="#26A69A" opacity=".45"/>
              <rect x="137" y="47" width="2" height="3" fill="#26A69A" opacity=".45"/><rect x="141" y="47" width="2" height="3" fill="#26A69A" opacity=".45"/>
              <rect x="137" y="54" width="2" height="3" fill="#26A69A" opacity=".45"/><rect x="141" y="54" width="2" height="3" fill="#26A69A" opacity=".45"/>
              <rect x="112" y="35" width="22" height="55" fill="white"/>
              <rect x="114" y="40" width="3" height="4" fill="#26A69A" opacity=".4"/><rect x="120" y="40" width="3" height="4" fill="#26A69A" opacity=".4"/><rect x="126" y="40" width="3" height="4" fill="#26A69A" opacity=".4"/>
              <rect x="114" y="48" width="3" height="4" fill="#26A69A" opacity=".4"/><rect x="120" y="48" width="3" height="4" fill="#26A69A" opacity=".4"/><rect x="126" y="48" width="3" height="4" fill="#26A69A" opacity=".4"/>
              <rect x="114" y="56" width="3" height="4" fill="#26A69A" opacity=".4"/><rect x="120" y="56" width="3" height="4" fill="#26A69A" opacity=".4"/><rect x="126" y="56" width="3" height="4" fill="#26A69A" opacity=".4"/>
              <rect x="96" y="52" width="14" height="38" fill="white"/>
              <rect x="98" y="57" width="3" height="3" fill="#26A69A" opacity=".4"/><rect x="104" y="57" width="3" height="3" fill="#26A69A" opacity=".4"/>
              <rect x="82" y="42" width="12" height="48" fill="white"/><rect x="84" y="36" width="8" height="8" fill="white"/><rect x="86" y="32" width="4" height="6" fill="white"/>
              <rect x="83" y="47" width="2" height="3" fill="#26A69A" opacity=".4"/><rect x="88" y="47" width="2" height="3" fill="#26A69A" opacity=".4"/>
              <rect x="70" y="60" width="10" height="30" fill="white" opacity=".8"/>
              <rect x="60" y="50" width="8" height="40" fill="white" opacity=".75"/>
            </svg>
            <div className="absolute bottom-0 left-0 right-0 bg-white" 
              style={{ height:"15px", clipPath:"polygon(0 100%,0 100%,2% 100%,2% 70%,4% 70%,4% 45%,6% 45%,6% 70%,8% 70%,8% 20%,10% 20%,10% 70%,12% 70%,12% 55%,14% 55%,14% 15%,16% 15%,16% 55%,18% 55%,18% 65%,20% 65%,20% 35%,22% 35%,22% 50%,24% 50%,24% 68%,26% 68%,26% 38%,28% 38%,28% 52%,30% 52%,30% 28%,32% 28%,32% 52%,34% 52%,34% 68%,36% 68%,36% 45%,38% 45%,38% 58%,40% 58%,40% 42%,42% 42%,42% 58%,44% 58%,44% 68%,46% 68%,46% 50%,48% 50%,48% 42%,50% 42%,50% 50%,52% 50%,52% 68%,54% 68%,54% 50%,56% 50%,56% 58%,58% 58%,58% 42%,60% 42%,60% 58%,62% 58%,62% 45%,64% 45%,64% 28%,66% 28%,66% 45%,68% 45%,68% 68%,70% 68%,70% 38%,72% 38%,72% 52%,74% 52%,74% 15%,76% 15%,76% 52%,78% 52%,78% 20%,80% 20%,80% 65%,82% 65%,82% 45%,84% 45%,84% 65%,86% 65%,86% 100%,88% 100%,88% 70%,90% 70%,90% 45%,92% 45%,92% 70%,94% 70%,94% 20%,96% 20%,96% 70%,98% 70%,98% 100%,100% 100%)" }} />
            <button onClick={onClose} className="absolute top-2.5 left-2.5 w-7 h-7 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center z-10">
              <ArrowLeft className="w-3.5 h-3.5 text-white" />
            </button>
            <button onClick={onClose} className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center z-10 text-white font-bold text-xs">✕</button>
            <div className="text-2xl mb-1 relative z-10">🏠</div>
            <h1 className="text-sm font-extrabold text-white tracking-wide relative z-10 text-center" style={{ textShadow: "0 2px 6px rgba(0,0,0,.2)" }}>
              Property Owner Registration
            </h1>
            <p className="text-[10px] text-white/80 relative z-10 mt-0.5 text-center">List your property with us — fast &amp; easy</p>
          </div>

          <div className="text-center px-3 py-1.5 bg-gradient-to-r from-teal-50 to-emerald-100 border-b border-teal-200 shrink-0">
            <h2 className="text-xs font-bold text-[#00695C]">{steps[step]}</h2>
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
            <MobContent 
              step={step} inp={inMob} formData={formData} updateForm={updateForm}
              imagePreviews={imagePreviews} handleImageUpload={handleImageUpload} removeImage={removeImage}
              handleVideoUpload={handleVideoUpload} videoPreview={videoPreview} removeVideo={removeVideo}
              handleDocumentUpload={handleDocumentUpload} toggleAmenity={toggleAmenity}
              availableAmenities={availableAmenities} customAmenitiesList={customAmenitiesList}
              addCustomAmenity={addCustomAmenity} removeCustomAmenity={removeCustomAmenity}
            />
          </div>

          <div className="flex flex-col shrink-0 bg-white border-t border-teal-100">
            <div className="h-[2px] w-full bg-gradient-to-r from-[#00695C] via-[#26A69A] to-[#80CBC4]" />
            {step < 4 && (
              <div className="px-3 pt-1.5 pb-0.5">
                <div className="flex justify-between mb-0.5">
                  <span className="text-[8px] text-gray-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#26A69A] inline-block" />Form completion</span>
                  <span className="text-[8px] text-[#00695C] font-bold">{Math.round(((step+1)/5)*100)}%</span>
                </div>
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#00695C] to-[#26A69A] rounded-full transition-all duration-500" style={{ width: `${((step+1)/5)*100}%` }} />
                </div>
              </div>
            )}
            <div className="flex justify-center gap-1 pt-1">
              {steps.map((_,i)=>(
                <div key={i} className={`rounded-full transition-all duration-300 ${i<step?'w-2.5 h-1 bg-green-400':i===step?'w-4 h-1 bg-[#00695C]':'w-1 h-1 bg-gray-200'}`} />
              ))}
            </div>
            <div className="flex gap-2 px-3 py-2.5">
              {step > 0 && (
                <button className="px-3 py-1.5 text-[11px] font-semibold text-[#00695C] bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 flex items-center gap-1" onClick={() => setStep(step-1)}>
                  <ArrowLeft className="w-3 h-3" /> Back
                </button>
              )}
              <button
                className={`flex-1 py-2 text-xs font-semibold text-white rounded-xl flex items-center justify-center gap-1 shadow ${step===4?'bg-gradient-to-r from-green-600 to-teal-600':'bg-gradient-to-r from-[#00695C] to-[#00897B]'}`}
                onClick={() => step===4 ? handleSubmit() : setStep(step+1)}
              >
                {step===4 ? <><span>✓</span> Submit Form</> : <>Continue →</>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP (>= sm) */}
      <div className="fixed inset-0 bg-black/60 z-50 hidden sm:flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
          <div className="relative flex flex-col items-center justify-center min-h-[110px] px-4 pt-4 pb-7 overflow-hidden shrink-0 rounded-3xl"
            style={{ background: "linear-gradient(160deg,#00695C 0%,#00897B 45%,#26A69A 75%,#80CBC4 100%)" }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 15% 60%,rgba(255,255,255,.18) 0%,transparent 45%),radial-gradient(circle at 85% 25%,rgba(255,255,255,.12) 0%,transparent 40%)" }} />
            <svg className="absolute bottom-0 left-0 pointer-events-none" width="160" height="90" viewBox="0 0 160 90" xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="10" width="13" height="80" fill="white"/><polygon points="6.5,4 0,10 13,10" fill="white"/>
              <rect x="2" y="15" width="2" height="3" fill="#26A69A" opacity=".5"/><rect x="6" y="15" width="2" height="3" fill="#26A69A" opacity=".5"/><rect x="10" y="15" width="2" height="3" fill="#26A69A" opacity=".5"/>
              <rect x="2" y="22" width="2" height="3" fill="#26A69A" opacity=".5"/><rect x="6" y="22" width="2" height="3" fill="#26A69A" opacity=".5"/><rect x="10" y="22" width="2" height="3" fill="#26A69A" opacity=".5"/>
              <rect x="2" y="29" width="2" height="3" fill="#26A69A" opacity=".5"/><rect x="6" y="29" width="2" height="3" fill="#26A69A" opacity=".5"/><rect x="10" y="29" width="2" height="3" fill="#26A69A" opacity=".5"/>
              <rect x="2" y="36" width="2" height="3" fill="#26A69A" opacity=".5"/><rect x="6" y="36" width="2" height="3" fill="#26A69A" opacity=".5"/><rect x="10" y="36" width="2" height="3" fill="#26A69A" opacity=".5"/>
              <rect x="2" y="43" width="2" height="3" fill="#26A69A" opacity=".5"/><rect x="6" y="43" width="2" height="3" fill="#26A69A" opacity=".5"/><rect x="10" y="43" width="2" height="3" fill="#26A69A" opacity=".5"/>
              <rect x="15" y="28" width="9" height="62" fill="white"/><rect x="18" y="22" width="3" height="8" fill="white"/><rect x="19" y="18" width="1" height="6" fill="white"/>
              <rect x="16" y="33" width="2" height="3" fill="#26A69A" opacity=".45"/><rect x="20" y="33" width="2" height="3" fill="#26A69A" opacity=".45"/>
              <rect x="16" y="40" width="2" height="3" fill="#26A69A" opacity=".45"/><rect x="20" y="40" width="2" height="3" fill="#26A69A" opacity=".45"/>
              <rect x="16" y="47" width="2" height="3" fill="#26A69A" opacity=".45"/><rect x="20" y="47" width="2" height="3" fill="#26A69A" opacity=".45"/>
              <rect x="16" y="54" width="2" height="3" fill="#26A69A" opacity=".45"/><rect x="20" y="54" width="2" height="3" fill="#26A69A" opacity=".45"/>
              <rect x="26" y="35" width="22" height="55" fill="white"/>
              <rect x="28" y="40" width="3" height="4" fill="#26A69A" opacity=".4"/><rect x="34" y="40" width="3" height="4" fill="#26A69A" opacity=".4"/><rect x="40" y="40" width="3" height="4" fill="#26A69A" opacity=".4"/>
              <rect x="28" y="48" width="3" height="4" fill="#26A69A" opacity=".4"/><rect x="34" y="48" width="3" height="4" fill="#26A69A" opacity=".4"/><rect x="40" y="48" width="3" height="4" fill="#26A69A" opacity=".4"/>
              <rect x="28" y="56" width="3" height="4" fill="#26A69A" opacity=".4"/><rect x="34" y="56" width="3" height="4" fill="#26A69A" opacity=".4"/><rect x="40" y="56" width="3" height="4" fill="#26A69A" opacity=".4"/>
              <rect x="28" y="64" width="3" height="4" fill="#26A69A" opacity=".4"/><rect x="34" y="64" width="3" height="4" fill="#26A69A" opacity=".4"/><rect x="40" y="64" width="3" height="4" fill="#26A69A" opacity=".4"/>
              <rect x="50" y="52" width="14" height="38" fill="white"/>
              <rect x="52" y="57" width="3" height="3" fill="#26A69A" opacity=".4"/><rect x="58" y="57" width="3" height="3" fill="#26A69A" opacity=".4"/>
              <rect x="52" y="64" width="3" height="3" fill="#26A69A" opacity=".4"/><rect x="58" y="64" width="3" height="3" fill="#26A69A" opacity=".4"/>
              <rect x="66" y="42" width="12" height="48" fill="white"/><rect x="68" y="36" width="8" height="8" fill="white"/><rect x="70" y="32" width="4" height="6" fill="white"/>
              <rect x="67" y="47" width="2" height="3" fill="#26A69A" opacity=".4"/><rect x="72" y="47" width="2" height="3" fill="#26A69A" opacity=".4"/>
              <rect x="67" y="54" width="2" height="3" fill="#26A69A" opacity=".4"/><rect x="72" y="54" width="2" height="3" fill="#26A69A" opacity=".4"/>
              <rect x="67" y="61" width="2" height="3" fill="#26A69A" opacity=".4"/><rect x="72" y="61" width="2" height="3" fill="#26A69A" opacity=".4"/>
              <rect x="80" y="60" width="10" height="30" fill="white" opacity=".8"/>
              <rect x="82" y="64" width="2" height="3" fill="#26A69A" opacity=".35"/><rect x="86" y="64" width="2" height="3" fill="#26A69A" opacity=".35"/>
              <rect x="92" y="50" width="8" height="40" fill="white" opacity=".75"/>
              <rect x="93" y="55" width="2" height="3" fill="#26A69A" opacity=".35"/><rect x="97" y="55" width="2" height="3" fill="#26A69A" opacity=".35"/>
              <rect x="93" y="62" width="2" height="3" fill="#26A69A" opacity=".35"/><rect x="97" y="62" width="2" height="3" fill="#26A69A" opacity=".35"/>
            </svg>
            <svg className="absolute bottom-0 right-0 pointer-events-none" width="160" height="90" viewBox="0 0 160 90" xmlns="http://www.w3.org/2000/svg">
              <rect x="147" y="10" width="13" height="80" fill="white"/><polygon points="153.5,4 147,10 160,10" fill="white"/>
              <rect x="148" y="15" width="2" height="3" fill="#26A69A" opacity=".5"/><rect x="152" y="15" width="2" height="3" fill="#26A69A" opacity=".5"/><rect x="156" y="15" width="2" height="3" fill="#26A69A" opacity=".5"/>
              <rect x="148" y="22" width="2" height="3" fill="#26A69A" opacity=".5"/><rect x="152" y="22" width="2" height="3" fill="#26A69A" opacity=".5"/><rect x="156" y="22" width="2" height="3" fill="#26A69A" opacity=".5"/>
              <rect x="148" y="29" width="2" height="3" fill="#26A69A" opacity=".5"/><rect x="152" y="29" width="2" height="3" fill="#26A69A" opacity=".5"/><rect x="156" y="29" width="2" height="3" fill="#26A69A" opacity=".5"/>
              <rect x="148" y="36" width="2" height="3" fill="#26A69A" opacity=".5"/><rect x="152" y="36" width="2" height="3" fill="#26A69A" opacity=".5"/><rect x="156" y="36" width="2" height="3" fill="#26A69A" opacity=".5"/>
              <rect x="148" y="43" width="2" height="3" fill="#26A69A" opacity=".5"/><rect x="152" y="43" width="2" height="3" fill="#26A69A" opacity=".5"/><rect x="156" y="43" width="2" height="3" fill="#26A69A" opacity=".5"/>
              <rect x="136" y="28" width="9" height="62" fill="white"/><rect x="138" y="22" width="3" height="8" fill="white"/><rect x="139" y="18" width="1" height="6" fill="white"/>
              <rect x="137" y="33" width="2" height="3" fill="#26A69A" opacity=".45"/><rect x="141" y="33" width="2" height="3" fill="#26A69A" opacity=".45"/>
              <rect x="137" y="40" width="2" height="3" fill="#26A69A" opacity=".45"/><rect x="141" y="40" width="2" height="3" fill="#26A69A" opacity=".45"/>
              <rect x="137" y="47" width="2" height="3" fill="#26A69A" opacity=".45"/><rect x="141" y="47" width="2" height="3" fill="#26A69A" opacity=".45"/>
              <rect x="137" y="54" width="2" height="3" fill="#26A69A" opacity=".45"/><rect x="141" y="54" width="2" height="3" fill="#26A69A" opacity=".45"/>
              <rect x="112" y="35" width="22" height="55" fill="white"/>
              <rect x="114" y="40" width="3" height="4" fill="#26A69A" opacity=".4"/><rect x="120" y="40" width="3" height="4" fill="#26A69A" opacity=".4"/><rect x="126" y="40" width="3" height="4" fill="#26A69A" opacity=".4"/>
              <rect x="114" y="48" width="3" height="4" fill="#26A69A" opacity=".4"/><rect x="120" y="48" width="3" height="4" fill="#26A69A" opacity=".4"/><rect x="126" y="48" width="3" height="4" fill="#26A69A" opacity=".4"/>
              <rect x="114" y="56" width="3" height="4" fill="#26A69A" opacity=".4"/><rect x="120" y="56" width="3" height="4" fill="#26A69A" opacity=".4"/><rect x="126" y="56" width="3" height="4" fill="#26A69A" opacity=".4"/>
              <rect x="114" y="64" width="3" height="4" fill="#26A69A" opacity=".4"/><rect x="120" y="64" width="3" height="4" fill="#26A69A" opacity=".4"/><rect x="126" y="64" width="3" height="4" fill="#26A69A" opacity=".4"/>
              <rect x="96" y="52" width="14" height="38" fill="white"/>
              <rect x="98" y="57" width="3" height="3" fill="#26A69A" opacity=".4"/><rect x="104" y="57" width="3" height="3" fill="#26A69A" opacity=".4"/>
              <rect x="98" y="64" width="3" height="3" fill="#26A69A" opacity=".4"/><rect x="104" y="64" width="3" height="3" fill="#26A69A" opacity=".4"/>
              <rect x="82" y="42" width="12" height="48" fill="white"/><rect x="84" y="36" width="8" height="8" fill="white"/><rect x="86" y="32" width="4" height="6" fill="white"/>
              <rect x="83" y="47" width="2" height="3" fill="#26A69A" opacity=".4"/><rect x="88" y="47" width="2" height="3" fill="#26A69A" opacity=".4"/>
              <rect x="83" y="54" width="2" height="3" fill="#26A69A" opacity=".4"/><rect x="88" y="54" width="2" height="3" fill="#26A69A" opacity=".4"/>
              <rect x="83" y="61" width="2" height="3" fill="#26A69A" opacity=".4"/><rect x="88" y="61" width="2" height="3" fill="#26A69A" opacity=".4"/>
              <rect x="70" y="60" width="10" height="30" fill="white" opacity=".8"/>
              <rect x="72" y="64" width="2" height="3" fill="#26A69A" opacity=".35"/><rect x="76" y="64" width="2" height="3" fill="#26A69A" opacity=".35"/>
              <rect x="60" y="50" width="8" height="40" fill="white" opacity=".75"/>
              <rect x="61" y="55" width="2" height="3" fill="#26A69A" opacity=".35"/><rect x="65" y="55" width="2" height="3" fill="#26A69A" opacity=".35"/>
              <rect x="61" y="62" width="2" height="3" fill="#26A69A" opacity=".35"/><rect x="65" y="62" width="2" height="3" fill="#26A69A" opacity=".35"/>
            </svg>
            <div className="absolute bottom-0 left-0 right-0 bg-white" style={{ height:"15px", clipPath:"polygon(0 100%,0 100%,2% 100%,2% 70%,4% 70%,4% 45%,6% 45%,6% 70%,8% 70%,8% 20%,10% 20%,10% 70%,12% 70%,12% 55%,14% 55%,14% 15%,16% 15%,16% 55%,18% 55%,18% 65%,20% 65%,20% 35%,22% 35%,22% 50%,24% 50%,24% 68%,26% 68%,26% 38%,28% 38%,28% 52%,30% 52%,30% 28%,32% 28%,32% 52%,34% 52%,34% 68%,36% 68%,36% 45%,38% 45%,38% 58%,40% 58%,40% 42%,42% 42%,42% 58%,44% 58%,44% 68%,46% 68%,46% 50%,48% 50%,48% 42%,50% 42%,50% 50%,52% 50%,52% 68%,54% 68%,54% 50%,56% 50%,56% 58%,58% 58%,58% 42%,60% 42%,60% 58%,62% 58%,62% 45%,64% 45%,64% 28%,66% 28%,66% 45%,68% 45%,68% 68%,70% 68%,70% 38%,72% 38%,72% 52%,74% 52%,74% 15%,76% 15%,76% 52%,78% 52%,78% 20%,80% 20%,80% 65%,82% 65%,82% 45%,84% 45%,84% 65%,86% 65%,86% 100%,88% 100%,88% 70%,90% 70%,90% 45%,92% 45%,92% 70%,94% 70%,94% 20%,96% 20%,96% 70%,98% 70%,98% 100%,100% 100%)" }} />
            <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height:"28px" }}>
              {[5,10,17,23,29,35,41,47,53,59,65,71,77,83,89,95].map((l,i)=>(
                <div key={i} className="absolute rounded-full bg-[#26A69A]" style={{ left:`${l}%`, bottom:`${4+(i%3)*5}px`, width:"3px", height:"3px", opacity:0.5+(i%3)*0.15 }} />
              ))}
            </div>
            <button onClick={onClose} className="absolute top-2.5 left-2.5 w-7 h-7 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center z-10">
              <ArrowLeft className="w-4 h-4 text-white" />
            </button>
            <button onClick={onClose} className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center z-10 text-white font-bold text-sm">✕</button>
            <div className="text-3xl mb-1 relative z-10">🏠</div>
            <h1 className="text-base sm:text-lg font-extrabold text-white tracking-wide relative z-10" style={{ textShadow:"0 2px 6px rgba(0,0,0,.2)" }}>
              Property Owner Registration
            </h1>
            <p className="text-[11px] text-white/80 relative z-10 mt-0.5">List your property with us — fast &amp; easy</p>
          </div>

          <div className="text-center px-4 py-2 bg-gradient-to-r from-teal-50 to-emerald-100 border-b border-teal-200 shrink-0">
            <h2 className="text-sm sm:text-base font-bold text-[#00695C]">{steps[step]}</h2>
            <p className="text-[10px] sm:text-xs text-green-500 mt-0.5">Step {step+1} of {steps.length} — {subtitles[step]}</p>
          </div>

          <div className="flex items-start justify-between px-2 sm:px-3 py-2 shrink-0 border-b border-gray-100 overflow-x-auto">
            {steps.map((s,i)=>(
              <div key={i} className="flex-1 flex flex-col items-center min-w-[54px]">
                <div className={`w-6 h-6 rounded-full text-[10px] flex items-center justify-center font-bold ${i<step?"bg-green-500 text-white":i===step?"bg-[#00695C] text-white":"bg-gray-200 text-gray-500"}`}>
                  {i<step?"✓":i+1}
                </div>
                <p className={`text-[9px] mt-1 text-center px-0.5 ${i===step?"text-[#00695C] font-bold":"text-gray-400"}`}>{s}</p>
              </div>
            ))}
          </div>

          <div className="px-3 sm:px-4 py-3 overflow-y-auto flex-1">
            <DtContent 
              step={step} inp={inDt} formData={formData} updateForm={updateForm}
              imagePreviews={imagePreviews} handleImageUpload={handleImageUpload} removeImage={removeImage}
              handleVideoUpload={handleVideoUpload} videoPreview={videoPreview} removeVideo={removeVideo}
              handleDocumentUpload={handleDocumentUpload} toggleAmenity={toggleAmenity}
              availableAmenities={availableAmenities} customAmenitiesList={customAmenitiesList}
              addCustomAmenity={addCustomAmenity} removeCustomAmenity={removeCustomAmenity}
            />
          </div>

          <div className="flex flex-col shrink-0 bg-white rounded-b-2xl border-t border-teal-100 overflow-hidden">
            <div className="h-[2px] w-full bg-gradient-to-r from-[#00695C] via-[#26A69A] to-[#80CBC4]" />
            {step < 4 && (
              <div className="px-4 pt-2.5 pb-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] text-gray-400 font-medium flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#26A69A] inline-block"/>Form completion</span>
                  <span className="text-[9px] text-[#00695C] font-bold">{Math.round(((step+1)/5)*100)}%</span>
                </div>
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#00695C] to-[#26A69A] rounded-full transition-all duration-500" style={{ width:`${((step+1)/5)*100}%` }} />
                </div>
              </div>
            )}
            <div className="flex justify-center gap-1.5 pt-2">
              {steps.map((_,i)=>(
                <div key={i} className={`rounded-full transition-all duration-300 ${i<step?'w-3 h-1.5 bg-green-400':i===step?'w-5 h-1.5 bg-[#00695C]':'w-1.5 h-1.5 bg-gray-200'}`} />
              ))}
            </div>
            <div className="flex gap-2 px-4 py-3">
              {step > 0 && (
                <button className="px-4 py-2 text-sm font-semibold text-[#00695C] bg-teal-50 hover:bg-teal-100 rounded-lg flex items-center gap-1 border border-teal-200" onClick={()=>setStep(step-1)}>
                  <ArrowLeft className="w-3.5 h-3.5"/>Back
                </button>
              )}
              <button className={`px-5 py-2 text-sm font-semibold text-white rounded-lg flex items-center gap-1.5 ml-auto shadow-md hover:-translate-y-0.5 ${step===4?'bg-gradient-to-r from-green-600 to-teal-600':'bg-gradient-to-r from-[#00695C] to-[#00897B]'}`}
                onClick={()=>step===4?handleSubmit():setStep(step+1)}>
                {step===4?<><span>✓</span>Submit Form</>:<>Continue <span className="text-base">→</span></>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* Mobile step content with working functionality */
function MobContent({ step, inp, formData, updateForm, imagePreviews, handleImageUpload, removeImage, handleVideoUpload, videoPreview, removeVideo, handleDocumentUpload, toggleAmenity, availableAmenities, customAmenitiesList, addCustomAmenity, removeCustomAmenity }) {
  const ta = `${inp} resize-y`;
  
  if (step===0) return <>
    <Field label="Owner Name" required hint="As per your government-issued ID"><input className={inp} placeholder="Enter your full name" value={formData.ownerName} onChange={(e)=>updateForm("ownerName", e.target.value)}/></Field>
    <Field label="Contact Number" required><input className={inp} type="tel" placeholder="Enter your 10-digit mobile number" value={formData.contactNumber} onChange={(e)=>updateForm("contactNumber", e.target.value)}/></Field>
    <Field label="Email ID" required hint="We'll send listing updates to this email"><input className={inp} type="email" placeholder="Enter your email address" value={formData.emailId} onChange={(e)=>updateForm("emailId", e.target.value)}/></Field>
    <Field label="Address" required><textarea className={`${ta} min-h-[65px]`} placeholder="Enter your residential address (Street, Area, City, State, PIN)" value={formData.address} onChange={(e)=>updateForm("address", e.target.value)}/></Field>
    <Field label="ID Proof / Aadhaar / PAN" required hint="12-digit Aadhaar or 10-character PAN"><input className={inp} placeholder="Enter Aadhaar or PAN number" value={formData.idProof} onChange={(e)=>updateForm("idProof", e.target.value)}/></Field>
  </>;
  
  if (step===1) return <>
    <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50"><div className="w-1 h-3 bg-[#00695C] rounded"/><h3 className="text-[10px] font-bold text-[#00695C]">Property Details</h3></div>
    <Field label="Property Title / Name" required><input className={inp} placeholder="e.g. Green Valley 3BHK Apartment" value={formData.propertyTitle} onChange={(e)=>updateForm("propertyTitle", e.target.value)}/></Field>
    <Field label="Property Category" required><input className={inp} placeholder="e.g. Apartment, Villa, Plot..." value={formData.propertyCategory} onChange={(e)=>updateForm("propertyCategory", e.target.value)}/></Field>
    <Field label="Property Type" required>{["Residential","Commercial","Mill / Industrial"].map(t=><label key={t} className="flex items-center gap-2 text-[10px] mb-1 cursor-pointer"><input type="radio" name="mob-ptype" className="accent-[#00695C] w-3 h-3 cursor-pointer" checked={formData.propertyType === t} onChange={()=>updateForm("propertyType", t)} readOnly={false}/>{t}</label>)}</Field>
    <Field label="Property Address" required><textarea className={`${ta} min-h-[55px]`} placeholder="Enter complete property address" value={formData.propertyAddress} onChange={(e)=>updateForm("propertyAddress", e.target.value)}/></Field>
    <Field label="City" required><input className={inp} placeholder="Enter city name" value={formData.city} onChange={(e)=>updateForm("city", e.target.value)}/></Field>
    <Field label="Area Details" required hint="In square feet"><div className="grid grid-cols-2 gap-1.5"><input className={inp} type="number" placeholder="Build-up Area" value={formData.builtUpArea} onChange={(e)=>updateForm("builtUpArea", e.target.value)}/><input className={inp} type="number" placeholder="Carpet Area" value={formData.carpetArea} onChange={(e)=>updateForm("carpetArea", e.target.value)}/></div></Field>
    <Field label="Room Details"><div className="grid grid-cols-2 gap-1.5"><input className={inp} type="number" placeholder="Bedrooms" value={formData.bedrooms} onChange={(e)=>updateForm("bedrooms", e.target.value)}/><input className={inp} type="number" placeholder="Bathrooms" value={formData.bathrooms} onChange={(e)=>updateForm("bathrooms", e.target.value)}/></div></Field>
    <Field label="Furnishing Status" required>{["Full Furnish","Semi Furnish","Unfurnished"].map(f=><label key={f} className="flex items-center gap-2 text-[10px] mb-1 cursor-pointer"><input type="radio" name="mob-furnish" className="accent-[#00695C] w-3 h-3 cursor-pointer" checked={formData.furnishingStatus === f} onChange={()=>updateForm("furnishingStatus", f)} readOnly={false}/>{f}</label>)}</Field>
    <Field label="Parking"><div className="flex gap-4"><label className="flex items-center gap-1.5 text-[10px] cursor-pointer"><input type="radio" name="mob-parking" className="accent-[#00695C] w-3 h-3 cursor-pointer" checked={formData.parking === "yes"} onChange={()=>updateForm("parking", "yes")} readOnly={false}/>Yes</label><label className="flex items-center gap-1.5 text-[10px] cursor-pointer"><input type="radio" name="mob-parking" className="accent-[#00695C] w-3 h-3 cursor-pointer" checked={formData.parking === "no"} onChange={()=>updateForm("parking", "no")} readOnly={false}/>No</label></div></Field>
  </>;
  
  if (step===2) return <>
    <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50"><div className="w-1 h-3 bg-[#00695C] rounded"/><h3 className="text-[10px] font-bold text-[#00695C]">Pricing & Amenities</h3></div>
    <Field label="Listing Purpose" required><div className="flex gap-4"><label className="flex items-center gap-1.5 text-[10px] cursor-pointer"><input type="radio" name="mob-purpose" className="accent-[#00695C] w-3 h-3 cursor-pointer" checked={formData.listingPurpose === "sale"} onChange={()=>updateForm("listingPurpose", "sale")} readOnly={false}/>For Sale</label><label className="flex items-center gap-1.5 text-[10px] cursor-pointer"><input type="radio" name="mob-purpose" className="accent-[#00695C] w-3 h-3 cursor-pointer" checked={formData.listingPurpose === "rent"} onChange={()=>updateForm("listingPurpose", "rent")} readOnly={false}/>For Rent</label></div></Field>
    <Field label="Expected Price / Rent (₹)" required><input className={inp} placeholder="e.g. 45,00,000 or 15,000/month" value={formData.expectedPrice} onChange={(e)=>updateForm("expectedPrice", e.target.value)}/></Field>
    <Field label="Price Type"><div className="flex gap-4"><label className="flex items-center gap-1.5 text-[10px] cursor-pointer"><input type="radio" name="mob-pt" className="accent-[#00695C] w-3 h-3 cursor-pointer" checked={formData.priceType === "fixed"} onChange={()=>updateForm("priceType", "fixed")} readOnly={false}/>Fixed</label><label className="flex items-center gap-1.5 text-[10px] cursor-pointer"><input type="radio" name="mob-pt" className="accent-[#00695C] w-3 h-3 cursor-pointer" checked={formData.priceType === "negotiable"} onChange={()=>updateForm("priceType", "negotiable")} readOnly={false}/>Negotiable</label></div></Field>
    <Field label="Maintenance (₹/month)"><input className={inp} placeholder="Enter monthly maintenance" value={formData.maintenance} onChange={(e)=>updateForm("maintenance", e.target.value)}/></Field>
    <Field label="Available From"><input className={inp} type="date" value={formData.availableFrom} onChange={(e)=>updateForm("availableFrom", e.target.value)}/></Field>
    <Field label="Amenities"><div className="flex flex-wrap gap-1 mt-0.5">
      {availableAmenities.map(a=><span key={a} onClick={()=>toggleAmenity(a)} className={`px-1.5 py-0.5 text-[9px] rounded-full border cursor-pointer transition-all ${formData.selectedAmenities.includes(a) ? 'bg-[#00695C] text-white border-[#00695C]' : 'bg-teal-50 text-[#00695C] border-teal-200 hover:bg-teal-100'}`}>{a}</span>)}
      {customAmenitiesList.map(a=><span key={a} className="px-1.5 py-0.5 text-[9px] bg-[#00695C] text-white rounded-full border border-[#00695C] flex items-center gap-1">{a}<X className="w-2 h-2 cursor-pointer hover:text-red-200" onClick={()=>removeCustomAmenity(a)}/></span>)}
    </div></Field>
    <Field label="Other Amenities"><div className="flex gap-1"><input className={`${inp} flex-1`} placeholder="e.g. Clubhouse, CCTV..." value={formData.otherAmenities} onChange={(e)=>updateForm("otherAmenities", e.target.value)} onKeyPress={(e)=>e.key==='Enter' && addCustomAmenity()}/><button onClick={addCustomAmenity} className="px-2 py-1 text-[10px] bg-[#00695C] text-white rounded-lg">Add</button></div></Field>
  </>;
  
  if (step===3) return <>
    <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50"><div className="w-1 h-3 bg-[#00695C] rounded"/><h3 className="text-[10px] font-bold text-[#00695C]">Media Upload</h3></div>
    <p className="text-[9px] text-center text-gray-400 mb-2">📸 Minimum 3 property images required</p>
    <Field label="Property Images" required>
      <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
        <input type="file" accept="image/*" multiple className="hidden" id="m-imgs" onChange={handleImageUpload}/>
        <label htmlFor="m-imgs" className="cursor-pointer flex flex-col items-center">
          <ImagePlus className="mb-1 w-7 h-7 text-[#00695C]"/>
          <span className="text-[10px] font-semibold text-[#00695C]">Upload Property Photos</span>
          <span className="text-[9px] text-gray-400">JPG, PNG supported</span>
        </label>
      </div>
      {imagePreviews.length > 0 && <div className="mt-2 grid grid-cols-3 gap-1">{imagePreviews.map((preview, idx) => (<div key={idx} className="relative"><img src={preview} alt={`Preview ${idx+1}`} className="w-full h-16 object-cover rounded-lg"/><button onClick={()=>removeImage(idx)} className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[8px] flex items-center justify-center">✕</button></div>))}</div>}
    </Field>
    <Field label="Property Video">
      <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
        <input type="file" accept="video/mp4,video/mov" className="hidden" id="m-vid" onChange={handleVideoUpload}/>
        <label htmlFor="m-vid" className="cursor-pointer flex flex-col items-center">
          <Video className="mb-1 w-7 h-7 text-[#00695C]"/>
          <span className="text-[10px] font-semibold text-[#00695C]">Upload Video Tour</span>
          <span className="text-[9px] text-gray-400">MP4 or MOV</span>
        </label>
      </div>
      {videoPreview && <div className="mt-2 relative"><video src={videoPreview} controls className="w-full h-24 object-cover rounded-lg"/><button onClick={removeVideo} className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">✕</button></div>}
    </Field>
  </>;
  
  if (step===4) return <>
    <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50"><div className="w-1 h-3 bg-[#00695C] rounded"/><h3 className="text-[10px] font-bold text-[#00695C]">Document Upload</h3></div>
    {[{id:"m-own",e:"📄",t:"Upload Ownership Document",s:"Sale deed, registry (PDF/JPG/PNG)",l:"Ownership Proof",r:true,key:"ownershipDoc"},{id:"m-id",e:"🪪",t:"Upload ID Proof",s:"Aadhaar, PAN or Passport",l:"Owner ID Proof",r:true,key:"idProofDoc"},{id:"m-add",e:"📎",t:"+ Add More Documents",s:"Tax receipts, NOC, floor plans",l:"Additional Documents",r:false,key:"additionalDocs"}].map(d=>(
      <Field key={d.id} label={d.l} required={d.r}>
        <div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50">
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" id={d.id} onChange={(e)=>handleDocumentUpload(d.key, e)}/>
          <label htmlFor={d.id} className="cursor-pointer">
            <div className="text-xl mb-0.5">{d.e}</div>
            <div className="text-[10px] font-semibold text-[#00695C]">{d.t}</div>
            <span className="text-[9px] text-gray-400">{d.s}</span>
          </label>
        </div>
        {formData[d.key] && <p className="text-[9px] text-green-600 mt-1">✓ {formData[d.key].name}</p>}
      </Field>
    ))}
  </>;
}

/* Desktop step content with working functionality */
function DtContent({ step, inp, formData, updateForm, imagePreviews, handleImageUpload, removeImage, handleVideoUpload, videoPreview, removeVideo, handleDocumentUpload, toggleAmenity, availableAmenities, customAmenitiesList, addCustomAmenity, removeCustomAmenity }) {
  const ta = "input w-full text-sm resize-y placeholder:text-gray-300 placeholder:text-xs";
  
  if (step===0) return <>
    <FieldDt label="Owner Name" required hint="As per your government-issued ID"><input className={inp} placeholder="Enter your full name" value={formData.ownerName} onChange={(e)=>updateForm("ownerName", e.target.value)}/></FieldDt>
    <FieldDt label="Contact Number" required><input className={inp} type="tel" placeholder="Enter your 10-digit mobile number" value={formData.contactNumber} onChange={(e)=>updateForm("contactNumber", e.target.value)}/></FieldDt>
    <FieldDt label="Email ID" required hint="We'll send listing updates to this email"><input className={inp} type="email" placeholder="Enter your email address" value={formData.emailId} onChange={(e)=>updateForm("emailId", e.target.value)}/></FieldDt>
    <FieldDt label="Address" required><textarea className={`${ta} min-h-[80px]`} placeholder={"Enter your current residential address\n(Street, Area, City, State, PIN)"} value={formData.address} onChange={(e)=>updateForm("address", e.target.value)}/></FieldDt>
    <FieldDt label="ID Proof / Aadhaar / PAN" required hint="12-digit Aadhaar or 10-character PAN"><input className={inp} placeholder="Enter Aadhaar or PAN number" value={formData.idProof} onChange={(e)=>updateForm("idProof", e.target.value)}/></FieldDt>
  </>;
  
  if (step===1) return <>
    <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50"><div className="w-1 h-4 bg-[#00695C] rounded"/><h3 className="text-sm font-bold text-[#00695C]">Property Details</h3></div>
    <FieldDt label="Property Title / Name" required><input className={inp} placeholder="e.g. Green Valley 3BHK Apartment" value={formData.propertyTitle} onChange={(e)=>updateForm("propertyTitle", e.target.value)}/></FieldDt>
    <FieldDt label="Property Category" required><input className={inp} placeholder="e.g. Apartment, Villa, Plot..." value={formData.propertyCategory} onChange={(e)=>updateForm("propertyCategory", e.target.value)}/></FieldDt>
    <FieldDt label="Property Type" required>{["Residential","Commercial","Mill / Industrial"].map(t=><label key={t} className="flex items-center gap-2 text-xs sm:text-sm mb-2 cursor-pointer"><input type="radio" name="dt-ptype" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.propertyType === t} onChange={()=>updateForm("propertyType", t)} readOnly={false}/>{t}</label>)}</FieldDt>
    <FieldDt label="Property Address" required><textarea className={`${ta} min-h-[70px]`} placeholder={"Enter complete property address\n(Flat No., Building, Street, Locality)"} value={formData.propertyAddress} onChange={(e)=>updateForm("propertyAddress", e.target.value)}/></FieldDt>
    <FieldDt label="City" required><input className={inp} placeholder="Enter city name" value={formData.city} onChange={(e)=>updateForm("city", e.target.value)}/></FieldDt>
    <FieldDt label="Area Details" required hint="Enter values in square feet"><div className="grid grid-cols-2 gap-2"><input className={inp} type="number" placeholder="Build-up Area (sq ft)" value={formData.builtUpArea} onChange={(e)=>updateForm("builtUpArea", e.target.value)}/><input className={inp} type="number" placeholder="Carpet Area (sq ft)" value={formData.carpetArea} onChange={(e)=>updateForm("carpetArea", e.target.value)}/></div></FieldDt>
    <FieldDt label="Room Details"><div className="grid grid-cols-2 gap-2"><input className={inp} type="number" placeholder="No. of Bedrooms" value={formData.bedrooms} onChange={(e)=>updateForm("bedrooms", e.target.value)}/><input className={inp} type="number" placeholder="No. of Bathrooms" value={formData.bathrooms} onChange={(e)=>updateForm("bathrooms", e.target.value)}/></div></FieldDt>
    <FieldDt label="Furnishing Status" required>{["Full Furnish","Semi Furnish","Unfurnished"].map(f=><label key={f} className="flex items-center gap-2 text-xs sm:text-sm mb-2 cursor-pointer"><input type="radio" name="dt-furnish" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.furnishingStatus === f} onChange={()=>updateForm("furnishingStatus", f)} readOnly={false}/>{f}</label>)}</FieldDt>
    <FieldDt label="Parking Facility"><div className="flex gap-5"><label className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer"><input type="radio" name="dt-parking" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.parking === "yes"} onChange={()=>updateForm("parking", "yes")} readOnly={false}/>Yes, available</label><label className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer"><input type="radio" name="dt-parking" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.parking === "no"} onChange={()=>updateForm("parking", "no")} readOnly={false}/>No parking</label></div></FieldDt>
  </>;
  
  if (step===2) return <>
    <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50"><div className="w-1 h-4 bg-[#00695C] rounded"/><h3 className="text-sm font-bold text-[#00695C]">Pricing & Amenities</h3></div>
    <FieldDt label="Listing Purpose" required><div className="flex gap-5"><label className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer"><input type="radio" name="dt-purpose" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.listingPurpose === "sale"} onChange={()=>updateForm("listingPurpose", "sale")} readOnly={false}/>For Sale</label><label className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer"><input type="radio" name="dt-purpose" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.listingPurpose === "rent"} onChange={()=>updateForm("listingPurpose", "rent")} readOnly={false}/>For Rent / Lease</label></div></FieldDt>
    <FieldDt label="Expected Price / Rent (₹)" required><input className={inp} placeholder="e.g. 45,00,000 or 15,000/month" value={formData.expectedPrice} onChange={(e)=>updateForm("expectedPrice", e.target.value)}/></FieldDt>
    <FieldDt label="Price Type"><div className="flex gap-5"><label className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer"><input type="radio" name="dt-priceType" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.priceType === "fixed"} onChange={()=>updateForm("priceType", "fixed")} readOnly={false}/>Fixed Price</label><label className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer"><input type="radio" name="dt-priceType" className="accent-[#00695C] w-3.5 h-3.5 cursor-pointer" checked={formData.priceType === "negotiable"} onChange={()=>updateForm("priceType", "negotiable")} readOnly={false}/>Negotiable</label></div></FieldDt>
    <FieldDt label="Maintenance Charges (₹/month)"><input className={inp} placeholder="Enter monthly maintenance amount" value={formData.maintenance} onChange={(e)=>updateForm("maintenance", e.target.value)}/></FieldDt>
    <FieldDt label="Available From" hint="Date from which the property is available"><input className={inp} type="date" value={formData.availableFrom} onChange={(e)=>updateForm("availableFrom", e.target.value)}/></FieldDt>
    <FieldDt label="Select Amenities"><div className="flex flex-wrap gap-1.5 mt-1">
      {availableAmenities.map(a=><span key={a} onClick={()=>toggleAmenity(a)} className={`px-2 py-1 text-xs sm:text-sm rounded-full border cursor-pointer transition-all ${formData.selectedAmenities.includes(a) ? 'bg-[#00695C] text-white border-[#00695C]' : 'bg-teal-50 text-[#00695C] border-teal-200 hover:bg-teal-100'}`}>{a}</span>)}
      {customAmenitiesList.map(a=><span key={a} className="px-2 py-1 text-xs sm:text-sm bg-[#00695C] text-white rounded-full border border-[#00695C] flex items-center gap-1">{a}<X className="w-3 h-3 cursor-pointer hover:text-red-200" onClick={()=>removeCustomAmenity(a)}/></span>)}
    </div></FieldDt>
    <FieldDt label="Other Amenities"><div className="flex gap-2"><input className={inp} placeholder="e.g. Clubhouse, CCTV, Solar Panel..." value={formData.otherAmenities} onChange={(e)=>updateForm("otherAmenities", e.target.value)} onKeyPress={(e)=>e.key==='Enter' && addCustomAmenity()}/><button onClick={addCustomAmenity} className="px-3 py-1 text-sm bg-[#00695C] text-white rounded-lg hover:bg-[#004d42] transition-colors">Add</button></div></FieldDt>
  </>;
  
  if (step===3) return <>
    <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50"><div className="w-1 h-4 bg-[#00695C] rounded"/><h3 className="text-sm font-bold text-[#00695C]">Media Upload</h3></div>
    <p className="text-[10px] sm:text-xs text-center text-gray-400 mb-3">📸 Minimum 3 property images required</p>
    <FieldDt label="Property Images" required>
      <div className="upload-box cursor-pointer hover:bg-green-50 border-2 border-dashed border-teal-300 rounded-xl p-4 text-center">
        <input type="file" accept="image/*" multiple className="hidden" id="property-images" onChange={handleImageUpload}/>
        <label htmlFor="property-images" className="cursor-pointer flex flex-col items-center"><ImagePlus className="mx-auto mb-2 w-8 h-8 sm:w-10 sm:h-10 text-[#00695C]"/><span className="text-xs sm:text-sm font-semibold text-[#00695C]">Upload Property Photos</span><span className="text-[10px] text-gray-400 mt-1">Click to select multiple images (JPG, PNG)</span></label>
      </div>
      {imagePreviews.length > 0 && <div className="mt-3 grid grid-cols-3 gap-2">{imagePreviews.map((preview, idx) => (<div key={idx} className="relative"><img src={preview} alt={`Preview ${idx+1}`} className="w-full h-20 object-cover rounded-lg border border-gray-200"/><button onClick={()=>removeImage(idx)} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600">✕</button></div>))}</div>}
    </FieldDt>
    <FieldDt label="Property Video">
      <div className="upload-box cursor-pointer hover:bg-green-50 border-2 border-dashed border-teal-300 rounded-xl p-4 text-center">
        <input type="file" accept="video/mp4,video/mov" className="hidden" id="property-video" onChange={handleVideoUpload}/>
        <label htmlFor="property-video" className="cursor-pointer flex flex-col items-center"><Video className="mx-auto mb-2 w-8 h-8 sm:w-10 sm:h-10 text-[#00695C]"/><span className="text-xs sm:text-sm font-semibold text-[#00695C]">Upload Property Video Tour</span><p className="text-[10px] text-gray-400 mt-1">MP4 or MOV format supported</p></label>
      </div>
      {videoPreview && <div className="mt-3 relative"><video src={videoPreview} controls className="w-full h-32 object-cover rounded-lg border border-gray-200"/><button onClick={removeVideo} className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full text-sm flex items-center justify-center hover:bg-red-600">✕</button></div>}
    </FieldDt>
  </>;
  
  if (step===4) return <>
    <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50"><div className="w-1 h-4 bg-[#00695C] rounded"/><h3 className="text-sm font-bold text-[#00695C]">Document Upload</h3></div>
    {[{id:"ownership-proof",e:"📄",t:"Upload Ownership Document",s:"Sale deed, registry, or title deed (PDF/JPG/PNG)",l:"Property Ownership Proof",r:true,key:"ownershipDoc"},{id:"id-proof",e:"🪪",t:"Upload ID Proof",s:"Aadhaar, PAN, or Passport (PDF/JPG/PNG)",l:"Owner ID Proof",r:true,key:"idProofDoc"},{id:"additional-docs",e:"📎",t:"+ Add More Documents",s:"Tax receipts, NOC, floor plans (Multiple allowed)",l:"Additional Documents",r:false,key:"additionalDocs"}].map(d=>(
      <FieldDt key={d.id} label={d.l} required={d.r}>
        <div className="upload-box cursor-pointer hover:bg-green-50 border-2 border-dashed border-teal-300 rounded-xl p-4 text-center">
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" id={d.id} onChange={(e)=>handleDocumentUpload(d.key, e)}/>
          <label htmlFor={d.id} className="cursor-pointer"><div className="text-2xl mb-1">{d.e}</div><div className="text-xs sm:text-sm font-semibold text-[#00695C]">{d.t}</div><span className="block text-[10px] text-gray-400 mt-1">{d.s}</span></label>
        </div>
        {formData[d.key] && <p className="text-xs text-green-600 mt-2">✓ File selected: {formData[d.key].name}</p>}
      </FieldDt>
    ))}
  </>;
}