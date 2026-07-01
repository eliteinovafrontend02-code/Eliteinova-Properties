import React, { useState } from "react";
import { ArrowLeft, Upload, X } from "lucide-react";

const steps = [
  "Builder Information",
  "Property Details",
  "Approval & Legal Details",
  "Pricing & Payment",
  "Documents To Upload",
];

const subtitles = [
  "Enter builder & company information",
  "Tell us about your property project",
  "Share approval & legal details",
  "Set pricing & payment plans",
  "Upload required documents",
];

const Field = ({ label, required, hint, children }) => (
  <div className="mb-3">
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
const inDt = "input w-full text-sm placeholder:text-gray-300 placeholder:text-xs";

const availableAmenities = ["Lift", "Power Backup", "Security", "Water Supply", "Park", "Gym", "Swimming Pool", "Parking", "Children Play Area"];

export default function BuilderFormModal({ isOpen, onClose }) {
  const [step, setStep] = useState(0);
  
  // Form state
  const [formData, setFormData] = useState({
    builderName: "", companyName: "", reraNo: "", officeAddress: "", contactPerson: "", phoneNumber: "", emailId: "", website: "",
    projectName: "", projectLocation: "", city: "", pincode: "", propertyType: "", totalArea: "", noOfUnits: "", unitRange: "",
    configuration: "", furnishingStatus: "",
    ownershipType: "", approvalStatus: "", projectStatus: "", expectedCompletion: "",
    priceRange: "", paymentPlan: "", bookingAmount: "", selectedAmenities: [],
    reraCert: null, floorPlan: null, builderIdProof: null, brochure: null
  });

  const [customAmenitiesList, setCustomAmenitiesList] = useState([]);
  const [reraPreview, setReraPreview] = useState(null);
  const [floorPlanPreview, setFloorPlanPreview] = useState(null);
  const [builderIdPreview, setBuilderIdPreview] = useState(null);
  const [brochurePreview, setBrochurePreview] = useState(null);

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (docType, e, setPreview) => {
    const files = Array.from(e.target.files);
    if (docType === "brochure" && files.length > 0) {
      updateForm(docType, files);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      if (brochurePreview) {
        brochurePreview.forEach(preview => URL.revokeObjectURL(preview));
      }
      setBrochurePreview(newPreviews);
    } else if (files.length > 0) {
      const file = files[0];
      updateForm(docType, file);
      if (setPreview) {
        if (setPreview === setReraPreview && reraPreview) URL.revokeObjectURL(reraPreview);
        if (setPreview === setFloorPlanPreview && floorPlanPreview) URL.revokeObjectURL(floorPlanPreview);
        if (setPreview === setBuilderIdPreview && builderIdPreview) URL.revokeObjectURL(builderIdPreview);
        setPreview(URL.createObjectURL(file));
      }
    }
  };

  const removeFile = (docType, setPreview, index = null) => {
    if (docType === "brochure") {
      if (brochurePreview && index !== null) {
        URL.revokeObjectURL(brochurePreview[index]);
        const newPreviews = brochurePreview.filter((_, i) => i !== index);
        const newFiles = formData.brochure.filter((_, i) => i !== index);
        setBrochurePreview(newPreviews);
        updateForm("brochure", newFiles);
      } else if (brochurePreview) {
        brochurePreview.forEach(preview => URL.revokeObjectURL(preview));
        setBrochurePreview(null);
        updateForm("brochure", null);
      }
    } else {
      updateForm(docType, null);
      if (setPreview) {
        if (setPreview === setReraPreview && reraPreview) URL.revokeObjectURL(reraPreview);
        if (setPreview === setFloorPlanPreview && floorPlanPreview) URL.revokeObjectURL(floorPlanPreview);
        if (setPreview === setBuilderIdPreview && builderIdPreview) URL.revokeObjectURL(builderIdPreview);
        setPreview(null);
      }
    }
  };

  const removeBrochureImage = (index) => {
    removeFile("brochure", null, index);
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
    const newAmenity = formData.otherAmenities?.trim();
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
    console.log("Builder Form submitted:", formData);
    alert('Form submitted successfully!');
    handleClose();
  };

  const handleClose = () => {
    setStep(0);
    setFormData({
      builderName: "", companyName: "", reraNo: "", officeAddress: "", contactPerson: "", phoneNumber: "", emailId: "", website: "",
      projectName: "", projectLocation: "", city: "", pincode: "", propertyType: "", totalArea: "", noOfUnits: "", unitRange: "",
      configuration: "", furnishingStatus: "",
      ownershipType: "", approvalStatus: "", projectStatus: "", expectedCompletion: "",
      priceRange: "", paymentPlan: "", bookingAmount: "", selectedAmenities: [],
      reraCert: null, floorPlan: null, builderIdProof: null, brochure: null
    });
    setCustomAmenitiesList([]);
    if (reraPreview) URL.revokeObjectURL(reraPreview);
    if (floorPlanPreview) URL.revokeObjectURL(floorPlanPreview);
    if (builderIdPreview) URL.revokeObjectURL(builderIdPreview);
    if (brochurePreview) brochurePreview.forEach(preview => URL.revokeObjectURL(preview));
    setReraPreview(null);
    setFloorPlanPreview(null);
    setBuilderIdPreview(null);
    setBrochurePreview(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* MOBILE (< sm) */}
      <div className="fixed inset-0 z-50 flex flex-col sm:hidden">
        <div className="bg-black/50" style={{ height: "10vh" }} onClick={handleClose} />
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
            <button onClick={handleClose} className="absolute top-2.5 left-2.5 w-7 h-7 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center z-10">
              <ArrowLeft className="w-3.5 h-3.5 text-white" />
            </button>
            <button onClick={handleClose} className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center z-10 text-white font-bold text-xs">✕</button>
            <div className="text-2xl mb-1 relative z-10">🏗️</div>
            <h1 className="text-sm font-extrabold text-white tracking-wide relative z-10 text-center" style={{ textShadow: "0 2px 6px rgba(0,0,0,.2)" }}>
              Builder Registration
            </h1>
            <p className="text-[10px] text-white/80 relative z-10 mt-0.5 text-center">Register your project with us — fast &amp; easy</p>
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
              handleFileUpload={handleFileUpload} 
              reraPreview={reraPreview} setReraPreview={setReraPreview}
              floorPlanPreview={floorPlanPreview} setFloorPlanPreview={setFloorPlanPreview}
              builderIdPreview={builderIdPreview} setBuilderIdPreview={setBuilderIdPreview}
              brochurePreview={brochurePreview} setBrochurePreview={setBrochurePreview}
              removeFile={removeFile} removeBrochureImage={removeBrochureImage}
              availableAmenities={availableAmenities} customAmenitiesList={customAmenitiesList}
              toggleAmenity={toggleAmenity} addCustomAmenity={addCustomAmenity} removeCustomAmenity={removeCustomAmenity}
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
            <button onClick={handleClose} className="absolute top-2.5 left-2.5 w-7 h-7 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center z-10">
              <ArrowLeft className="w-4 h-4 text-white" />
            </button>
            <button onClick={handleClose} className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center z-10 text-white font-bold text-sm">✕</button>
            <div className="text-3xl mb-1 relative z-10">🏗️</div>
            <h1 className="text-base sm:text-lg font-extrabold text-white tracking-wide relative z-10" style={{ textShadow:"0 2px 6px rgba(0,0,0,.2)" }}>
              Builder Registration
            </h1>
            <p className="text-[11px] text-white/80 relative z-10 mt-0.5">Register your project with us — fast &amp; easy</p>
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
              handleFileUpload={handleFileUpload}
              reraPreview={reraPreview} setReraPreview={setReraPreview}
              floorPlanPreview={floorPlanPreview} setFloorPlanPreview={setFloorPlanPreview}
              builderIdPreview={builderIdPreview} setBuilderIdPreview={setBuilderIdPreview}
              brochurePreview={brochurePreview} setBrochurePreview={setBrochurePreview}
              removeFile={removeFile} removeBrochureImage={removeBrochureImage}
              availableAmenities={availableAmenities} customAmenitiesList={customAmenitiesList}
              toggleAmenity={toggleAmenity} addCustomAmenity={addCustomAmenity} removeCustomAmenity={removeCustomAmenity}
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

/* Mobile step content */
function MobContent({ step, inp, formData, updateForm, handleFileUpload, reraPreview, setReraPreview, floorPlanPreview, setFloorPlanPreview, builderIdPreview, setBuilderIdPreview, brochurePreview, setBrochurePreview, removeFile, removeBrochureImage, availableAmenities, customAmenitiesList, toggleAmenity, addCustomAmenity, removeCustomAmenity }) {
  const ta = `${inp} resize-y`;
  
  if (step===0) return <>
    <Field label="Builder/Developer Name" required><input className={inp} placeholder="Enter builder/developer name" value={formData.builderName} onChange={(e)=>updateForm("builderName", e.target.value)}/></Field>
    <Field label="Company/Firm Name" required><input className={inp} placeholder="Enter company/firm name" value={formData.companyName} onChange={(e)=>updateForm("companyName", e.target.value)}/></Field>
    <Field label="RERA Registration No" hint="If applicable"><input className={inp} placeholder="Enter RERA registration number" value={formData.reraNo} onChange={(e)=>updateForm("reraNo", e.target.value)}/></Field>
    <Field label="Office Address" required><textarea className={`${ta} min-h-[65px]`} placeholder="Enter office address" value={formData.officeAddress} onChange={(e)=>updateForm("officeAddress", e.target.value)}/></Field>
    <Field label="Authorized Contact Person Name" required><input className={inp} placeholder="Enter contact person name" value={formData.contactPerson} onChange={(e)=>updateForm("contactPerson", e.target.value)}/></Field>
    <Field label="Phone Number" required><input className={inp} type="tel" placeholder="Enter phone number" value={formData.phoneNumber} onChange={(e)=>updateForm("phoneNumber", e.target.value)}/></Field>
    <Field label="Email" required><input className={inp} type="email" placeholder="Enter email address" value={formData.emailId} onChange={(e)=>updateForm("emailId", e.target.value)}/></Field>
    <Field label="Website"><input className={inp} placeholder="Enter website URL" value={formData.website} onChange={(e)=>updateForm("website", e.target.value)}/></Field>
  </>;
  
  if (step===1) return <>
    <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50"><div className="w-1 h-3 bg-[#00695C] rounded"/><h3 className="text-[10px] font-bold text-[#00695C]">Property Details</h3></div>
    <Field label="Project Name" required><input className={inp} placeholder="Enter project name" value={formData.projectName} onChange={(e)=>updateForm("projectName", e.target.value)}/></Field>
    <Field label="Project Location/Address" required><textarea className={`${ta} min-h-[55px]`} placeholder="Enter project location/address" value={formData.projectLocation} onChange={(e)=>updateForm("projectLocation", e.target.value)}/></Field>
    <div className="grid grid-cols-2 gap-1.5"><Field label="City" required><input className={inp} placeholder="City" value={formData.city} onChange={(e)=>updateForm("city", e.target.value)}/></Field><Field label="Pincode" required><input className={inp} placeholder="Pincode" value={formData.pincode} onChange={(e)=>updateForm("pincode", e.target.value)}/></Field></div>
    <Field label="Property Type" required><select className={inp} value={formData.propertyType} onChange={(e)=>updateForm("propertyType", e.target.value)}><option value="">Select Property Type</option><option>Residential</option><option>Commercial</option><option>Mixed Use</option></select></Field>
    <Field label="Total Area (sq/acre)" required><input className={inp} placeholder="Total area" value={formData.totalArea} onChange={(e)=>updateForm("totalArea", e.target.value)}/></Field>
    <div className="grid grid-cols-2 gap-1.5"><Field label="No of Units"><input className={inp} placeholder="No of units" value={formData.noOfUnits} onChange={(e)=>updateForm("noOfUnits", e.target.value)}/></Field><Field label="Units Range (sq.ft)"><input className={inp} placeholder="Units range" value={formData.unitRange} onChange={(e)=>updateForm("unitRange", e.target.value)}/></Field></div>
    <Field label="Configuration" required><div className="flex flex-wrap gap-2">{["1 BHK","2 BHK","3 BHK","4 BHK","Other"].map(c=><label key={c} className="flex items-center gap-2 text-[10px] cursor-pointer"><input type="radio" name="mob-config" className="accent-[#00695C] w-3 h-3" checked={formData.configuration === c} onChange={()=>updateForm("configuration", c)}/>{c}</label>)}</div></Field>
    <Field label="Furnishing Status" required>{["Full Furnished","Semi Furnished","Unfurnished"].map(f=><label key={f} className="flex items-center gap-2 text-[10px] mb-1 cursor-pointer"><input type="radio" name="mob-furnish" className="accent-[#00695C] w-3 h-3" checked={formData.furnishingStatus === f} onChange={()=>updateForm("furnishingStatus", f)}/>{f}</label>)}</Field>
  </>;
  
  if (step===2) return <>
    <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50"><div className="w-1 h-3 bg-[#00695C] rounded"/><h3 className="text-[10px] font-bold text-[#00695C]">Approval & Legal Details</h3></div>
    <Field label="Ownership Type" required><div className="flex gap-4"><label className="flex items-center gap-1.5 text-[10px] cursor-pointer"><input type="radio" name="mob-ownership" className="accent-[#00695C] w-3 h-3" checked={formData.ownershipType === "Free Hold"} onChange={()=>updateForm("ownershipType", "Free Hold")}/>Free Hold</label><label className="flex items-center gap-1.5 text-[10px] cursor-pointer"><input type="radio" name="mob-ownership" className="accent-[#00695C] w-3 h-3" checked={formData.ownershipType === "Lease Hold"} onChange={()=>updateForm("ownershipType", "Lease Hold")}/>Lease Hold</label></div></Field>
    <Field label="RERA/Govt Approval Status" required><div className="flex gap-4"><label className="flex items-center gap-1.5 text-[10px] cursor-pointer"><input type="radio" name="mob-approval" className="accent-[#00695C] w-3 h-3" checked={formData.approvalStatus === "Approved"} onChange={()=>updateForm("approvalStatus", "Approved")}/>Approved</label><label className="flex items-center gap-1.5 text-[10px] cursor-pointer"><input type="radio" name="mob-approval" className="accent-[#00695C] w-3 h-3" checked={formData.approvalStatus === "In Progress"} onChange={()=>updateForm("approvalStatus", "In Progress")}/>In Progress</label></div></Field>
    <Field label="Project Status" required><div className="flex gap-4"><label className="flex items-center gap-1.5 text-[10px] cursor-pointer whitespace-nowrap"><input type="radio" name="mob-projectStatus" className="accent-[#00695C] w-3 h-3" checked={formData.projectStatus === "Ready to Move"} onChange={()=>updateForm("projectStatus", "Ready to Move")}/>Ready to Move</label><label className="flex items-center gap-1.5 text-[10px] cursor-pointer whitespace-nowrap"><input type="radio" name="mob-projectStatus" className="accent-[#00695C] w-3 h-3" checked={formData.projectStatus === "Under Construction"} onChange={()=>updateForm("projectStatus", "Under Construction")}/>Under Construction</label></div></Field>
    <Field label="Expected Completion Date"><input className={inp} type="date" value={formData.expectedCompletion} onChange={(e)=>updateForm("expectedCompletion", e.target.value)}/></Field>
  </>;
  
  if (step===3) return <>
    <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50"><div className="w-1 h-3 bg-[#00695C] rounded"/><h3 className="text-[10px] font-bold text-[#00695C]">Pricing & Payment Details</h3></div>
    <Field label="Price Range (per unit/per sq.ft)" required><input className={inp} placeholder="Enter price range" value={formData.priceRange} onChange={(e)=>updateForm("priceRange", e.target.value)}/></Field>
    <Field label="Payment Plan"><select className={inp} value={formData.paymentPlan} onChange={(e)=>updateForm("paymentPlan", e.target.value)}><option value="">Select Payment Plan</option><option>Construction Linked</option><option>Time Linked</option><option>Down Payment</option><option>Flexible</option></select></Field>
    <Field label="Booking Amount"><input className={inp} placeholder="Enter booking amount" value={formData.bookingAmount} onChange={(e)=>updateForm("bookingAmount", e.target.value)}/></Field>
    <Field label="Amenities"><div className="flex flex-wrap gap-1 mt-0.5">{availableAmenities.map(a=><span key={a} onClick={()=>toggleAmenity(a)} className={`px-1.5 py-0.5 text-[9px] rounded-full border cursor-pointer transition-all ${formData.selectedAmenities.includes(a) ? 'bg-[#00695C] text-white border-[#00695C]' : 'bg-teal-50 text-[#00695C] border-teal-200 hover:bg-teal-100'}`}>{a}</span>)}{customAmenitiesList.map(a=><span key={a} className="px-1.5 py-0.5 text-[9px] bg-[#00695C] text-white rounded-full border border-[#00695C] flex items-center gap-1">{a}<X className="w-2 h-2 cursor-pointer hover:text-red-200" onClick={()=>removeCustomAmenity(a)}/></span>)}</div></Field>
    <Field label="Other Amenities"><div className="flex gap-1"><input className={`${inp} flex-1`} placeholder="e.g. Clubhouse, CCTV..." value={formData.otherAmenities} onChange={(e)=>updateForm("otherAmenities", e.target.value)} onKeyPress={(e)=>e.key==='Enter' && addCustomAmenity()}/><button onClick={addCustomAmenity} className="px-2 py-1 text-[10px] bg-[#00695C] text-white rounded-lg">Add</button></div></Field>
  </>;
  
  if (step===4) return <>
    <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b-2 border-green-50"><div className="w-1 h-3 bg-[#00695C] rounded"/><h3 className="text-[10px] font-bold text-[#00695C] text-center w-full">Document Upload</h3></div>
    <p className="text-[9px] text-gray-400 text-center mb-2">Upload required documents for verification</p>
    <Field label="RERA Registration Certificate" required><div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50"><input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" id="m-rera" onChange={(e)=>handleFileUpload("reraCert", e, setReraPreview)}/><label htmlFor="m-rera" className="cursor-pointer flex flex-col items-center"><div className="w-8 h-8 rounded-full bg-[#00695C] flex items-center justify-center mb-1"><Upload className="w-4 h-4 text-white"/></div><span className="text-[10px] font-semibold text-[#00695C]">Upload RERA Registration Certificate</span><span className="text-[9px] text-gray-400">Upload RERA registration document</span></label></div>{reraPreview && <div className="mt-2 relative"><p className="text-[9px] text-green-600 truncate">{formData.reraCert?.name}</p><button onClick={()=>removeFile("reraCert", setReraPreview)} className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[8px] flex items-center justify-center">✕</button></div>}</Field>
    <Field label="Property Layout/Floor Plan" required><div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50"><input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" id="m-floorplan" onChange={(e)=>handleFileUpload("floorPlan", e, setFloorPlanPreview)}/><label htmlFor="m-floorplan" className="cursor-pointer flex flex-col items-center"><div className="w-8 h-8 rounded-full bg-[#00695C] flex items-center justify-center mb-1"><Upload className="w-4 h-4 text-white"/></div><span className="text-[10px] font-semibold text-[#00695C]">Upload Property Layout/Floor Plan</span><span className="text-[9px] text-gray-400">Upload property layout or floor plan</span></label></div>{floorPlanPreview && <div className="mt-2 relative"><p className="text-[9px] text-green-600 truncate">{formData.floorPlan?.name}</p><button onClick={()=>removeFile("floorPlan", setFloorPlanPreview)} className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[8px] flex items-center justify-center">✕</button></div>}</Field>
    <Field label="Builder ID Proof/Company Registration" required><div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50"><input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" id="m-builderid" onChange={(e)=>handleFileUpload("builderIdProof", e, setBuilderIdPreview)}/><label htmlFor="m-builderid" className="cursor-pointer flex flex-col items-center"><div className="w-8 h-8 rounded-full bg-[#00695C] flex items-center justify-center mb-1"><Upload className="w-4 h-4 text-white"/></div><span className="text-[10px] font-semibold text-[#00695C]">Upload Builder ID Proof/Company Registration</span><span className="text-[9px] text-gray-400">Upload builder ID or company registration</span></label></div>{builderIdPreview && <div className="mt-2 relative"><p className="text-[9px] text-green-600 truncate">{formData.builderIdProof?.name}</p><button onClick={()=>removeFile("builderIdProof", setBuilderIdPreview)} className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[8px] flex items-center justify-center">✕</button></div>}</Field>
    <Field label="Project Brochure/Images"><div className="border-2 border-dashed border-teal-300 rounded-xl p-3 text-center hover:bg-green-50"><input type="file" accept=".pdf,.jpg,.jpeg,.png" multiple className="hidden" id="m-brochure" onChange={(e)=>handleFileUpload("brochure", e, setBrochurePreview)}/><label htmlFor="m-brochure" className="cursor-pointer flex flex-col items-center"><div className="w-8 h-8 rounded-full bg-[#00695C] flex items-center justify-center mb-1"><Upload className="w-4 h-4 text-white"/></div><span className="text-[10px] font-semibold text-[#00695C]">Upload Project Brochure/Images</span><span className="text-[9px] text-gray-400">Upload project brochure or images</span></label></div>{brochurePreview && brochurePreview.length > 0 && <div className="mt-2 grid grid-cols-3 gap-1">{brochurePreview.map((preview, idx)=><div key={idx} className="relative"><img src={preview} className="w-full h-12 object-cover rounded"/><button onClick={()=>removeBrochureImage(idx)} className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 text-white rounded-full text-[6px] flex items-center justify-center">✕</button></div>)}</div>}</Field>
  </>;
}

/* Desktop step content */
function DtContent({ step, inp, formData, updateForm, handleFileUpload, reraPreview, setReraPreview, floorPlanPreview, setFloorPlanPreview, builderIdPreview, setBuilderIdPreview, brochurePreview, setBrochurePreview, removeFile, removeBrochureImage, availableAmenities, customAmenitiesList, toggleAmenity, addCustomAmenity, removeCustomAmenity }) {
  const ta = "input w-full text-sm resize-y placeholder:text-gray-300 placeholder:text-xs";
  
  if (step===0) return <>
    <FieldDt label="Builder/Developer Name" required><input className={inp} placeholder="Enter builder/developer name" value={formData.builderName} onChange={(e)=>updateForm("builderName", e.target.value)}/></FieldDt>
    <FieldDt label="Company/Firm Name" required><input className={inp} placeholder="Enter company/firm name" value={formData.companyName} onChange={(e)=>updateForm("companyName", e.target.value)}/></FieldDt>
    <FieldDt label="RERA Registration No" hint="If applicable"><input className={inp} placeholder="Enter RERA registration number" value={formData.reraNo} onChange={(e)=>updateForm("reraNo", e.target.value)}/></FieldDt>
    <FieldDt label="Office Address" required><textarea className={`${ta} min-h-[70px]`} placeholder="Enter office address" value={formData.officeAddress} onChange={(e)=>updateForm("officeAddress", e.target.value)}/></FieldDt>
    <FieldDt label="Authorized Contact Person Name" required><input className={inp} placeholder="Enter contact person name" value={formData.contactPerson} onChange={(e)=>updateForm("contactPerson", e.target.value)}/></FieldDt>
    <FieldDt label="Phone Number" required><input className={inp} type="tel" placeholder="Enter phone number" value={formData.phoneNumber} onChange={(e)=>updateForm("phoneNumber", e.target.value)}/></FieldDt>
    <FieldDt label="Email" required><input className={inp} type="email" placeholder="Enter email address" value={formData.emailId} onChange={(e)=>updateForm("emailId", e.target.value)}/></FieldDt>
    <FieldDt label="Website"><input className={inp} placeholder="Enter website URL" value={formData.website} onChange={(e)=>updateForm("website", e.target.value)}/></FieldDt>
  </>;
  
  if (step===1) return <>
    <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50"><div className="w-1 h-4 bg-[#00695C] rounded"/><h3 className="text-sm font-bold text-[#00695C]">Property Details</h3></div>
    <FieldDt label="Project Name" required><input className={inp} placeholder="Enter project name" value={formData.projectName} onChange={(e)=>updateForm("projectName", e.target.value)}/></FieldDt>
    <FieldDt label="Project Location/Address" required><textarea className={`${ta} min-h-[70px]`} placeholder="Enter project location/address" value={formData.projectLocation} onChange={(e)=>updateForm("projectLocation", e.target.value)}/></FieldDt>
    <div className="grid grid-cols-2 gap-2"><FieldDt label="City" required><input className={inp} placeholder="City" value={formData.city} onChange={(e)=>updateForm("city", e.target.value)}/></FieldDt><FieldDt label="Pincode" required><input className={inp} placeholder="Pincode" value={formData.pincode} onChange={(e)=>updateForm("pincode", e.target.value)}/></FieldDt></div>
    <FieldDt label="Property Type" required><select className={inp} value={formData.propertyType} onChange={(e)=>updateForm("propertyType", e.target.value)}><option value="">Select Property Type</option><option>Residential</option><option>Commercial</option><option>Mixed Use</option></select></FieldDt>
    <FieldDt label="Total Area (sq/acre)" required><input className={inp} placeholder="Total area" value={formData.totalArea} onChange={(e)=>updateForm("totalArea", e.target.value)}/></FieldDt>
    <div className="grid grid-cols-2 gap-2"><FieldDt label="No of Units"><input className={inp} placeholder="No of units" value={formData.noOfUnits} onChange={(e)=>updateForm("noOfUnits", e.target.value)}/></FieldDt><FieldDt label="Units Range (sq.ft)"><input className={inp} placeholder="Units range" value={formData.unitRange} onChange={(e)=>updateForm("unitRange", e.target.value)}/></FieldDt></div>
    <FieldDt label="Configuration" required><div className="flex flex-wrap gap-3">{["1 BHK","2 BHK","3 BHK","4 BHK","Other"].map(c=><label key={c} className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer"><input type="radio" name="dt-config" className="accent-[#00695C] w-3.5 h-3.5" checked={formData.configuration === c} onChange={()=>updateForm("configuration", c)}/>{c}</label>)}</div></FieldDt>
    <FieldDt label="Furnishing Status" required>{["Full Furnished","Semi Furnished","Unfurnished"].map(f=><label key={f} className="flex items-center gap-2 text-xs sm:text-sm mb-2 cursor-pointer"><input type="radio" name="dt-furnish" className="accent-[#00695C] w-3.5 h-3.5" checked={formData.furnishingStatus === f} onChange={()=>updateForm("furnishingStatus", f)}/>{f}</label>)}</FieldDt>
  </>;
  
  if (step===2) return <>
    <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50"><div className="w-1 h-4 bg-[#00695C] rounded"/><h3 className="text-sm font-bold text-[#00695C]">Approval & Legal Details</h3></div>
    <FieldDt label="Ownership Type" required><div className="flex gap-5"><label className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer"><input type="radio" name="dt-ownership" className="accent-[#00695C] w-3.5 h-3.5" checked={formData.ownershipType === "Free Hold"} onChange={()=>updateForm("ownershipType", "Free Hold")}/>Free Hold</label><label className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer"><input type="radio" name="dt-ownership" className="accent-[#00695C] w-3.5 h-3.5" checked={formData.ownershipType === "Lease Hold"} onChange={()=>updateForm("ownershipType", "Lease Hold")}/>Lease Hold</label></div></FieldDt>
    <FieldDt label="RERA/Govt Approval Status" required><div className="flex gap-5"><label className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer"><input type="radio" name="dt-approval" className="accent-[#00695C] w-3.5 h-3.5" checked={formData.approvalStatus === "Approved"} onChange={()=>updateForm("approvalStatus", "Approved")}/>Approved</label><label className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer"><input type="radio" name="dt-approval" className="accent-[#00695C] w-3.5 h-3.5" checked={formData.approvalStatus === "In Progress"} onChange={()=>updateForm("approvalStatus", "In Progress")}/>In Progress</label></div></FieldDt>
    <FieldDt label="Project Status" required><div className="flex gap-5"><label className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer whitespace-nowrap"><input type="radio" name="dt-projectStatus" className="accent-[#00695C] w-3.5 h-3.5" checked={formData.projectStatus === "Ready to Move"} onChange={()=>updateForm("projectStatus", "Ready to Move")}/>Ready to Move</label><label className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer whitespace-nowrap"><input type="radio" name="dt-projectStatus" className="accent-[#00695C] w-3.5 h-3.5" checked={formData.projectStatus === "Under Construction"} onChange={()=>updateForm("projectStatus", "Under Construction")}/>Under Construction</label></div></FieldDt>
    <FieldDt label="Expected Completion Date"><input className={inp} type="date" value={formData.expectedCompletion} onChange={(e)=>updateForm("expectedCompletion", e.target.value)}/></FieldDt>
  </>;
  
  if (step===3) return <>
    <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50"><div className="w-1 h-4 bg-[#00695C] rounded"/><h3 className="text-sm font-bold text-[#00695C]">Pricing & Payment Details</h3></div>
    <FieldDt label="Price Range (per unit/per sq.ft)" required><input className={inp} placeholder="Enter price range" value={formData.priceRange} onChange={(e)=>updateForm("priceRange", e.target.value)}/></FieldDt>
    <FieldDt label="Payment Plan"><select className={inp} value={formData.paymentPlan} onChange={(e)=>updateForm("paymentPlan", e.target.value)}><option value="">Select Payment Plan</option><option>Construction Linked</option><option>Time Linked</option><option>Down Payment</option><option>Flexible</option></select></FieldDt>
    <FieldDt label="Booking Amount"><input className={inp} placeholder="Enter booking amount" value={formData.bookingAmount} onChange={(e)=>updateForm("bookingAmount", e.target.value)}/></FieldDt>
    <FieldDt label="Amenities"><div className="flex flex-wrap gap-1.5 mt-1">{availableAmenities.map(a=><span key={a} onClick={()=>toggleAmenity(a)} className={`px-2 py-1 text-xs sm:text-sm rounded-full border cursor-pointer transition-all ${formData.selectedAmenities.includes(a) ? 'bg-[#00695C] text-white border-[#00695C]' : 'bg-teal-50 text-[#00695C] border-teal-200 hover:bg-teal-100'}`}>{a}</span>)}{customAmenitiesList.map(a=><span key={a} className="px-2 py-1 text-xs sm:text-sm bg-[#00695C] text-white rounded-full border border-[#00695C] flex items-center gap-1">{a}<X className="w-3 h-3 cursor-pointer hover:text-red-200" onClick={()=>removeCustomAmenity(a)}/></span>)}</div></FieldDt>
    <FieldDt label="Other Amenities"><div className="flex gap-2"><input className={inp} placeholder="e.g. Clubhouse, CCTV..." value={formData.otherAmenities} onChange={(e)=>updateForm("otherAmenities", e.target.value)} onKeyPress={(e)=>e.key==='Enter' && addCustomAmenity()}/><button onClick={addCustomAmenity} className="px-3 py-1 text-sm bg-[#00695C] text-white rounded-lg hover:bg-[#004d42] transition-colors">Add</button></div></FieldDt>
  </>;
  
  if (step===4) return <>
    <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-50"><div className="w-1 h-4 bg-[#00695C] rounded"/><h3 className="text-sm font-bold text-[#00695C] text-center w-full">Document Upload</h3></div>
    <p className="text-[10px] text-gray-400 text-center mb-3">Upload required documents for verification</p>
    <FieldDt label="RERA Registration Certificate" required><div className="upload-box cursor-pointer hover:bg-green-50 border-2 border-dashed border-teal-300 rounded-xl p-4 text-center"><input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" id="dt-rera" onChange={(e)=>handleFileUpload("reraCert", e, setReraPreview)}/><label htmlFor="dt-rera" className="cursor-pointer flex flex-col items-center"><div className="w-10 h-10 rounded-full bg-[#00695C] flex items-center justify-center mb-2"><Upload className="w-5 h-5 text-white"/></div><span className="text-xs sm:text-sm font-semibold text-[#00695C]">Upload RERA Registration Certificate</span><span className="text-[10px] text-gray-400 mt-1">Upload RERA registration document</span></label></div>{reraPreview && <div className="mt-2 relative"><p className="text-xs text-green-600">{formData.reraCert?.name}</p><button onClick={()=>removeFile("reraCert", setReraPreview)} className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">✕</button></div>}</FieldDt>
    <FieldDt label="Property Layout/Floor Plan" required><div className="upload-box cursor-pointer hover:bg-green-50 border-2 border-dashed border-teal-300 rounded-xl p-4 text-center"><input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" id="dt-floorplan" onChange={(e)=>handleFileUpload("floorPlan", e, setFloorPlanPreview)}/><label htmlFor="dt-floorplan" className="cursor-pointer flex flex-col items-center"><div className="w-10 h-10 rounded-full bg-[#00695C] flex items-center justify-center mb-2"><Upload className="w-5 h-5 text-white"/></div><span className="text-xs sm:text-sm font-semibold text-[#00695C]">Upload Property Layout/Floor Plan</span><span className="text-[10px] text-gray-400 mt-1">Upload property layout or floor plan</span></label></div>{floorPlanPreview && <div className="mt-2 relative"><p className="text-xs text-green-600">{formData.floorPlan?.name}</p><button onClick={()=>removeFile("floorPlan", setFloorPlanPreview)} className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">✕</button></div>}</FieldDt>
    <FieldDt label="Builder ID Proof/Company Registration" required><div className="upload-box cursor-pointer hover:bg-green-50 border-2 border-dashed border-teal-300 rounded-xl p-4 text-center"><input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" id="dt-builderid" onChange={(e)=>handleFileUpload("builderIdProof", e, setBuilderIdPreview)}/><label htmlFor="dt-builderid" className="cursor-pointer flex flex-col items-center"><div className="w-10 h-10 rounded-full bg-[#00695C] flex items-center justify-center mb-2"><Upload className="w-5 h-5 text-white"/></div><span className="text-xs sm:text-sm font-semibold text-[#00695C]">Upload Builder ID Proof/Company Registration</span><span className="text-[10px] text-gray-400 mt-1">Upload builder ID or company registration</span></label></div>{builderIdPreview && <div className="mt-2 relative"><p className="text-xs text-green-600">{formData.builderIdProof?.name}</p><button onClick={()=>removeFile("builderIdProof", setBuilderIdPreview)} className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">✕</button></div>}</FieldDt>
    <FieldDt label="Project Brochure/Images"><div className="upload-box cursor-pointer hover:bg-green-50 border-2 border-dashed border-teal-300 rounded-xl p-4 text-center"><input type="file" accept=".pdf,.jpg,.jpeg,.png" multiple className="hidden" id="dt-brochure" onChange={(e)=>handleFileUpload("brochure", e, setBrochurePreview)}/><label htmlFor="dt-brochure" className="cursor-pointer flex flex-col items-center"><div className="w-10 h-10 rounded-full bg-[#00695C] flex items-center justify-center mb-2"><Upload className="w-5 h-5 text-white"/></div><span className="text-xs sm:text-sm font-semibold text-[#00695C]">Upload Project Brochure/Images</span><span className="text-[10px] text-gray-400 mt-1">Upload project brochure or images</span></label></div>{brochurePreview && brochurePreview.length > 0 && <div className="mt-2 grid grid-cols-3 gap-2">{brochurePreview.map((preview, idx)=><div key={idx} className="relative"><img src={preview} className="w-full h-16 object-cover rounded border"/><button onClick={()=>removeBrochureImage(idx)} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">✕</button></div>)}</div>}</FieldDt>
  </>;
}