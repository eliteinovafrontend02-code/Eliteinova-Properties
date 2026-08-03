import React, { useState, useEffect } from 'react';
import { DuplexData } from "../../data/Apartment/DuplexData";

const PAGE_NAME = "Duplex Apartment";

// Helper: split price into amount + unit
const splitPrice = (price) => {
  if (!price) return { num: '', unit: '' };
  const match = price.match(/^(\s*₹[\d.,]+)(.*)$/);
  if (!match) return { num: price, unit: '' };
  return { num: match[1].trim(), unit: match[2].trim() };
};

// Helper: extract BHK from highlights
const extractBHK = (highlights) => {
  if (!highlights) return '';
  const match = highlights.match(/(\d+\s*\+?\s*BHK)/i);
  return match ? match[1].trim() : '';
};

// Helper: format price with crores/lakhs - preserves month units
const formatPriceAmount = (priceNum, originalUnit) => {
  if (!priceNum) return { amount: priceNum, unit: '' };
  const hasMonth = originalUnit && originalUnit.toLowerCase().includes('month');
  const numeric = parseFloat(priceNum.replace(/[^0-9.-]/g, ''));
  if (isNaN(numeric)) return { amount: priceNum, unit: originalUnit || '' };
  if (numeric >= 10000000) {
    const crores = (numeric / 10000000).toFixed(2);
    const formatted = crores.endsWith('.00') ? crores.slice(0, -3) : crores;
    return { amount: `₹${formatted}`, unit: hasMonth ? 'Cr/month' : 'Cr' };
  } else if (numeric >= 100000) {
    const lakhs = (numeric / 100000).toFixed(2);
    const formatted = lakhs.endsWith('.00') ? lakhs.slice(0, -3) : lakhs;
    return { amount: `₹${formatted}`, unit: hasMonth ? 'Lakh/month' : 'L' };
  }
  return { amount: priceNum, unit: originalUnit || '' };
};

const PropertyCard = ({ property, onContactClick }) => {
  const [activeImg, setActiveImg] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showFullGallery, setShowFullGallery] = useState(false);
  const [galleryActiveImg, setGalleryActiveImg] = useState(0);
  const [logoError, setLogoError] = useState(false);
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isContactHovered, setIsContactHovered] = useState(false);
  const [mapConfirm, setMapConfirm] = useState({ show: false, location: '' });

  const openInMaps = (location) => {
    setMapConfirm({ show: true, location });
  };

  const nextImg = (e) => {
    e.stopPropagation();
    setActiveImg((prev) => (prev + 1) % property.images.length);
  };

  const prevImg = (e) => {
    e.stopPropagation();
    setActiveImg((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const nextGalleryImg = (e) => {
    e.stopPropagation();
    setGalleryActiveImg((prev) => (prev + 1) % property.images.length);
  };

  const prevGalleryImg = (e) => {
    e.stopPropagation();
    setGalleryActiveImg((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const handleGalleryThumbnailClick = (idx) => {
    setGalleryActiveImg(idx);
  };

  const handleImageDoubleClick = (idx, e) => {
    e.stopPropagation();
    setGalleryActiveImg(idx);
    setShowFullGallery(true);
  };

  const getStatusStyle = (status) => {
    if (status === 'NEW') return { bg: 'bg-gradient-to-r from-green-500 to-emerald-600', icon: '✨', animation: 'pulse-green' };
    if (status === 'RE-SALE') return { bg: 'bg-gradient-to-r from-indigo-500 to-purple-500', icon: '🔄', animation: 'rotate-slow' };
    return { bg: 'bg-gradient-to-r from-gray-500 to-gray-600', icon: '🏷️', animation: '' };
  };

  const statusStyle = getStatusStyle(property.status);
  const { num: priceNumRaw, unit: priceUnit } = splitPrice(property.price);
  const formattedPrice = formatPriceAmount(priceNumRaw, priceUnit);
  const priceAmount = formattedPrice.amount || priceNumRaw;
  const priceUnitSuffix = formattedPrice.unit || priceUnit;
  const bhk = extractBHK(property.highlights);

  const getRoleTitle = () => {
    if (property.postedAs === 'Agent') return 'Real Estate Agent';
    if (property.postedAs === 'Builder') return 'Builder / Developer';
    if (property.postedAs === 'Seller') return 'Property Seller';
    if (property.tag === 'BUY') return 'Property Owner';
    if (property.tag === 'SELL') return 'Property Seller';
    if (property.tag === 'RENT') return 'Property Owner';
    if (property.tag === 'LEASE') return 'Property Lessor';
    return 'Listed By';
  };

  const getListedByText = () => {
    if (property.postedAs === 'Agent') return '🏢 Listed By (Agent)';
    if (property.postedAs === 'Builder') return '🏗️ Listed By (Builder)';
    if (property.postedAs === 'Seller') return '💰 Listed By (Seller)';
    if (property.tag === 'BUY') return '🏠 Listed By (Owner)';
    if (property.tag === 'SELL') return '💰 Listed By (Seller)';
    if (property.tag === 'RENT') return '🔑 Listed By (Owner)';
    if (property.tag === 'LEASE') return '📄 Listed By (Lessor)';
    return '👤 Listed By';
  };

  const imageCount = property.images.length;

  return (
    <>
      <div
        className="w-full bg-white rounded-2xl shadow-2xl border border-teal-100 overflow-hidden transition-all duration-500 hover:shadow-3xl mb-6 hover:-translate-y-1"
        style={{
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: isHovered
            ? '0 25px 40px -12px rgba(0,105,92,0.4), 0 0 0 1px rgba(0,105,92,0.1)'
            : '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.02)'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="p-4 md:p-5">
          <div className="flex flex-col lg:flex-row gap-5 items-stretch">

            {/* IMAGE SECTION */}
            <div className="w-full lg:w-[35%] xl:w-[32%]" style={{ position: 'relative', minHeight: '260px' }}>
              <div
                className="flex flex-row bg-gray-100 rounded-xl overflow-hidden shadow-lg"
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
              >
                {/* Main Image */}
                <div
                  className="relative cursor-pointer overflow-hidden flex-1"
                  onDoubleClick={(e) => handleImageDoubleClick(activeImg, e)}
                >
                  <img
                    src={property.images[activeImg]}
                    alt="Property"
                    style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=450&fit=crop'; }}
                  />
                  <div className="absolute top-2 left-2 z-10">
                    <div className={`${statusStyle.bg} text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg flex items-center gap-1 ${statusStyle.animation}`}>
                      <span className="text-[10px]">{statusStyle.icon}</span>
                      <span className="uppercase tracking-wider text-[9px]">{property.status}</span>
                    </div>
                  </div>
                </div>

                {/* Thumbnails */}
                <div
                  className="overflow-y-auto bg-white flex flex-col gap-1 p-1"
                  style={{ width: imageCount <= 2 ? '70px' : imageCount <= 3 ? '75px' : imageCount <= 4 ? '80px' : '85px' }}
                >
                  {property.images.map((img, idx) => (
                    <div
                      key={idx}
                      className={`relative overflow-hidden rounded cursor-pointer transition-all duration-200 flex-shrink-0 ${activeImg === idx ? 'ring-2 ring-[#26A69A] shadow-md' : 'hover:shadow-md'}`}
                      style={{ height: `calc(100% / ${imageCount})`, minHeight: '50px' }}
                      onClick={() => setActiveImg(idx)}
                      onDoubleClick={(e) => handleImageDoubleClick(idx, e)}
                    >
                      <img
                        src={img}
                        className="w-full h-full object-cover"
                        alt="thumb"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100&h=100&fit=crop'; }}
                      />
                      {imageCount > 5 && idx === 3 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-[10px]">
                          +{imageCount - 3}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CONTENT SECTION */}
            <div className="flex-1 flex flex-col gap-2">

              {/* PRICE AND HEADER */}
              <div className="flex flex-wrap justify-between items-start gap-2">
                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
                    <span className="font-black text-slate-900 text-2xl md:text-3xl">{priceAmount}</span>
                    {priceUnitSuffix && (
                      <>
                        <span className="font-black text-slate-900 text-2xl md:text-3xl">
                          {priceUnitSuffix.includes('/') ? priceUnitSuffix.split('/')[0] : priceUnitSuffix}
                        </span>
                        {priceUnitSuffix.includes('/') && priceUnitSuffix.split('/')[1] && (
                          <span className="font-black text-slate-900 text-[12px] md:text-[15px] font-medium">
                            /{priceUnitSuffix.split('/')[1]}
                          </span>
                        )}
                      </>
                    )}
                    {bhk && <span className="font-bold text-[#00695C] text-base md:text-lg ml-1">({bhk})</span>}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                    <span className="text-[#00695C] font-bold bg-teal-50 px-2 py-1 rounded-md text-xs md:text-sm shadow-sm">{property.sqftPrice}</span>
                    <span className="text-[#00695C] font-bold flex items-center gap-1 text-xs md:text-sm">
                      <span className="text-[#26A69A] text-sm">🟩</span> {property.totalSqft}
                    </span>
                    <span className="text-[#00695C] font-bold bg-teal-50 px-2 py-1 rounded-md text-xs md:text-sm shadow-sm">🏗️ {property.builtUp}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="font-black text-[#00695C] uppercase tracking-wide blink-text"
                      style={{ fontSize: '13px', letterSpacing: '0.7px', whiteSpace: 'nowrap', WebkitFontSmoothing: 'antialiased' }}
                    >
                      {PAGE_NAME}
                    </span>
                  </div>

                  <div
                    className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-black tracking-wider uppercase flex items-center justify-center gap-1 whitespace-nowrap text-[10px] md:text-xs tag-animation"
                    style={{
                      clipPath: 'polygon(0% 0%, 100% 0%, 92% 50%, 100% 100%, 0% 100%, 8% 50%)',
                      padding: '2px 10px',
                      minWidth: '40px',
                      animation: 'tagJump 1.5s ease-in-out infinite',
                      boxShadow: '0 0 20px rgba(0,0,0,0.4), 0 0 10px rgba(0,105,92,0.8)',
                      filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))'
                    }}
                  >
                    <span className="text-xs md:text-sm">
                      {property.tag === 'BUY' && '💰'}
                      {property.tag === 'SELL' && '🏷️'}
                      {property.tag === 'RENT' && '🔑'}
                      {property.tag === 'LEASE' && '📄'}
                    </span>
                    <span>{property.tag}</span>
                  </div>
                </div>
              </div>

              {/* LOCATION - Clickable to open maps */}
              <div
                className="flex items-start gap-2 cursor-pointer group"
                onClick={() => openInMaps(property.location)}
                title="View on Google Maps"
              >
                <div className="bg-teal-100 p-1.5 rounded-lg text-[#00695C] shrink-0 shadow-sm group-hover:bg-teal-300 transition-colors duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-slate-800 font-bold text-sm md:text-base leading-tight group-hover:text-[#00695C] group-hover:underline transition-colors duration-200">
                  {property.location}
                </p>
              </div>

              {/* HIGHLIGHTS */}
              <div>
                <p className="font-black text-[#004D40] uppercase tracking-wider mb-1.5 flex items-center gap-3 text-[10px] md:text-[11px]">
                  <span className="w-5 h-px bg-[#004D40]"></span>
                  Property Highlights
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {property.highlights.split('|').map((h, i) => (
                    <div key={i} className="flex items-center gap-1 bg-gray-50 text-[#004D40] px-2 py-1 rounded-lg border border-gray-200 font-medium text-[10px] md:text-xs shadow-sm">
                      <span className="w-1 h-1 rounded-full bg-[#00695C] shrink-0"></span>
                      <span>{h.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* POSTED BY SECTION */}
              <div className="pt-2 border-t border-gray-100">
                <div className="flex flex-wrap items-center justify-between gap-2">

                  <div className="flex items-center gap-3 flex-1 min-w-[180px]">
                    {/* LOGO — click to open Google Maps */}
                    <div
                      className="rounded-xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white font-black shadow-lg overflow-hidden shrink-0 w-10 h-10 md:w-12 md:h-12 text-base md:text-lg cursor-pointer hover:scale-110 hover:shadow-xl transition-all duration-200"
                      onClick={() => openInMaps(property.location)}
                      title="View on Google Maps"
                    >
                      {property.logo && !logoError ? (
                        <img src={property.logo} alt="logo" className="w-full h-full object-cover" onError={() => setLogoError(true)} />
                      ) : (
                        <span>{property.postedBy.charAt(0)}</span>
                      )}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <p className="text-[#00695C] font-bold uppercase tracking-wider text-[8px] md:text-[9px] leading-tight">{getListedByText()}</p>
                      <div className="flex items-baseline gap-4.5 flex-wrap">
                        <p className="font-black text-slate-800 text-sm md:text-base leading-snug">{property.postedBy}</p>
                        <button
                          onClick={() => setShowAgentModal(true)}
                          className="text-teal-500 hover:text-teal-700 underline flex items-center gap-0.7 transition-all duration-300 hover:translate-x-1 text-sm font-medium whitespace-nowrap"
                        >
                          📖 View Details →
                        </button>
                      </div>
                      <span className="text-teal-600 font-medium text-[9px] md:text-[10px] leading-tight">{getRoleTitle()}</span>
                    </div>
                  </div>

                  <button
                    onClick={onContactClick}
                    onMouseEnter={() => setIsContactHovered(true)}
                    onMouseLeave={() => setIsContactHovered(false)}
                    className="bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white font-bold rounded-lg flex items-center gap-1 whitespace-nowrap transition-all duration-300 shrink-0 px-4 md:px-5 py-1.5 md:py-2 text-xs md:text-sm contact-button"
                    style={{
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: isContactHovered ? 'translateY(-2px) scale(1.02)' : 'translateY(0) scale(1)',
                      boxShadow: isContactHovered
                        ? '0 12px 30px rgba(0,105,92,0.5), 0 0 0 3px rgba(38,166,154,0.3)'
                        : '0 8px 20px rgba(0,105,92,0.3)',
                      animation: 'contactPulse 2s ease-in-out infinite'
                    }}
                  >
                    <span className="text-xs md:text-sm transition-transform duration-300" style={{
                      transform: isContactHovered ? 'scale(1.1) rotate(-5deg)' : 'scale(1) rotate(0)'
                    }}>📞</span>
                    Contact
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* MAP CONFIRM MODAL */}
      {mapConfirm.show && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300] flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setMapConfirm({ show: false, location: '' })}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 bg-gradient-to-br from-[#00695C] to-[#26A69A] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-black text-slate-800 text-center mb-1">Open in Maps?</h3>
            <p className="text-sm text-slate-500 text-center mb-5 leading-relaxed px-2">{mapConfirm.location}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setMapConfirm({ show: false, location: '' })}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-sm transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const query = encodeURIComponent(mapConfirm.location);
                  window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
                  setMapConfirm({ show: false, location: '' });
                }}
                className="flex-1 bg-gradient-to-r from-[#00695C] to-[#26A69A] hover:opacity-90 text-white font-bold py-2.5 rounded-xl text-sm transition-all duration-200 shadow-lg"
              >
                Open
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AGENT DETAILS MODAL */}
      {showAgentModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[200] flex items-start justify-center p-4 pt-16 md:pt-20 animate-fadeIn" onClick={() => setShowAgentModal(false)}>
          <div className="bg-white rounded-2xl max-w-[95%] sm:max-w-lg md:max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl animate-scale-in mt-16 md:mt-20" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-5 rounded-t-2xl flex justify-between items-center sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                  {property.tag === 'BUY' && '💰'}
                  {property.tag === 'SELL' && '🏷️'}
                  {property.tag === 'RENT' && '🔑'}
                  {property.tag === 'LEASE' && '📄'}
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg md:text-xl">Complete Details</h3>
                  <p className="text-white/80 text-xs md:text-sm">{property.postedAs || getRoleTitle()}</p>
                </div>
              </div>
              <button onClick={() => setShowAgentModal(false)} className="text-white hover:text-gray-200 text-3xl transition-transform hover:scale-110">✕</button>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-4 pb-4 border-b border-teal-100 mb-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white font-black shadow-lg text-xl overflow-hidden">
                  {property.logo && !logoError ? (
                    <img src={property.logo} alt="logo" className="w-full h-full object-cover" onError={() => setLogoError(true)} />
                  ) : (
                    <span>{property.postedBy.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <p className="text-[10px] text-[#00695C] font-bold uppercase tracking-wider">{getListedByText()}</p>
                  <p className="text-xl md:text-2xl font-black text-slate-800">{property.postedBy}</p>
                  <p className="text-xs md:text-sm text-teal-600 font-medium mt-0.5">{getRoleTitle()}</p>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
                  Property Information
                </h4>
                <div className="bg-teal-50/50 rounded-xl p-4 space-y-2">
                  <p className="text-sm"><strong>Property ID:</strong> {property.id}</p>
                  <p className="text-sm"><strong>Listed Price:</strong> {property.price} {bhk && `(${bhk})`}</p>
                  <p className="text-sm"><strong>{property.sqftPrice}</strong> • 🟩 {property.totalSqft} • 🏗️ {property.builtUp}</p>
                  <p
                    className="text-sm flex items-center gap-1 cursor-pointer hover:text-[#00695C] hover:underline transition-colors duration-200 w-fit"
                    onClick={() => openInMaps(property.location)}
                    title="View on Google Maps"
                  >
                    <strong>📍 Location:</strong> {property.location}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
                  Property Highlights
                </h4>
                <div className="bg-teal-50/50 rounded-xl p-4">
                  <div className="flex flex-wrap gap-2">
                    {property.highlights.split('|').map((h, i) => (
                      <span key={i} className="bg-white px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 border border-teal-100 shadow-sm">✨ {h.trim()}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
                  About {property.postedAs === 'Agent' ? 'Agent' : property.postedAs === 'Builder' ? 'Builder' : property.postedAs === 'Seller' ? 'Seller' : 'Owner'}
                </h4>
                <div className="bg-teal-50/50 rounded-xl p-4">
                  <p className="text-sm text-gray-700 leading-relaxed">{property.agentDetails || "No additional details provided."}</p>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
                  Contact Information
                </h4>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <p className="text-sm flex items-center gap-2 break-all"><span className="text-teal-600">📧</span><span>{property.contactEmail || property.postedBy.toLowerCase().replace(/\s/g, '') + '@example.com'}</span></p>
                  <p className="text-sm flex items-center gap-2"><span className="text-teal-600">📞</span><span>{property.contactPhone || '+91 98765 43210'}</span></p>
                  <p
                    className="text-sm flex items-center gap-2 cursor-pointer hover:text-[#00695C] hover:underline transition-colors duration-200 w-fit"
                    onClick={() => openInMaps(property.location)}
                    title="View on Google Maps"
                  >
                    <span className="text-teal-600">📍</span><span>{property.location}</span>
                  </p>
                </div>
              </div>

              {(property.experience || property.achievements) && (
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
                    Additional Information
                  </h4>
                  <div className="bg-teal-50/30 rounded-xl p-4 space-y-2">
                    {property.experience && <p className="text-sm flex items-center gap-2"><span className="text-teal-600">⭐</span><span><strong>Experience:</strong> {property.experience}</span></p>}
                    {property.achievements && <p className="text-sm flex items-center gap-2"><span className="text-teal-600">🏆</span><span><strong>Achievements:</strong> {property.achievements}</span></p>}
                  </div>
                </div>
              )}

              <div className="mb-4">
                <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
                  Photos Uploaded ({property.images.length} {property.images.length === 1 ? 'Photo' : 'Photos'})
                </h4>
                <div className="bg-teal-50/40 rounded-xl p-4">
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {property.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group shadow-md hover:shadow-xl transition-all hover:scale-105"
                        onClick={() => {
                          setGalleryActiveImg(idx);
                          setShowFullGallery(true);
                          setShowAgentModal(false);
                        }}
                      >
                        <img
                          src={img}
                          alt={`property-photo-${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200&h=200&fit=crop'; }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <span className="text-white text-[10px] bg-black/60 px-2 py-0.5 rounded-full">Click</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-teal-600 mt-3 text-center">
                    💡 Click on any photo to view larger gallery
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-5 pt-4 border-t border-teal-100">
                <button onClick={() => { setShowAgentModal(false); onContactClick(); }} className="flex-1 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105 shadow-lg">📞 Contact Now</button>
                <button onClick={() => setShowAgentModal(false)} className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-xl font-bold text-sm transition-all hover:bg-gray-200 shadow-sm">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FULL GALLERY MODAL */}
      {showFullGallery && (
        <div className="fixed inset-0 bg-black/95 z-[150] flex flex-col animate-fadeIn" onClick={() => setShowFullGallery(false)}>
          <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-3 md:p-4 flex justify-between items-center px-4 md:px-6">
            <div className="pr-2">
              <h3 className="text-white font-bold text-sm md:text-lg truncate max-w-[180px] md:max-w-none">{property.location.split(',')[0]}</h3>
              <p className="text-white/80 text-[10px] md:text-xs mt-0.5">Click outside or press ESC to close</p>
            </div>
            <button onClick={() => setShowFullGallery(false)} className="text-white hover:text-gray-200 text-2xl md:text-3xl transition-transform hover:scale-110 shrink-0">✕</button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-3 md:p-6 pb-2" onClick={(e) => e.stopPropagation()}>
            <div className="relative w-full max-w-4xl">
              <div className="relative rounded-xl overflow-hidden shadow-2xl bg-black/50">
                <img src={property.images[galleryActiveImg]} alt="Gallery main" className="w-full h-auto max-h-[50vh] md:max-h-[60vh] object-contain" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'; }} />
              </div>
              <button onClick={prevGalleryImg} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 bg-white/20 hover:bg-white/40 text-white w-8 h-8 md:w-10 md:h-10 rounded-full transition-all text-sm md:text-xl flex items-center justify-center backdrop-blur hover:scale-110 shadow-lg">❮</button>
              <button onClick={nextGalleryImg} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 bg-white/20 hover:bg-white/40 text-white w-8 h-8 md:w-10 md:h-10 rounded-full transition-all text-sm md:text-xl flex items-center justify-center backdrop-blur hover:scale-110 shadow-lg">❯</button>
            </div>
            <div className="mt-2 text-white/80 text-xs md:text-sm">{galleryActiveImg + 1} / {property.images.length}</div>
            <div className="w-full max-w-5xl mt-4 md:mt-6 px-2">
              <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 justify-center flex-wrap">
                {property.images.map((img, idx) => (
                  <div key={idx} className={`w-12 h-12 md:w-16 md:h-16 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer transition-all ${galleryActiveImg === idx ? 'ring-2 ring-[#26A69A] shadow-xl scale-105' : 'opacity-70 hover:opacity-100 hover:scale-105 shadow-md'}`} onClick={() => handleGalleryThumbnailClick(idx)}>
                    <img src={img} alt="thumb" className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100&h=100&fit=crop'; }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="text-center pb-2 text-white/40 text-[10px] md:text-xs">Click outside or press ESC to close</div>
        </div>
      )}

      {/* SINGLE CLICK MODAL */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex flex-col animate-fadeIn" onClick={() => setShowImageModal(false)}>
          <div className="bg-gradient-to-r from-[#00695C] to-[#26A69A] p-3 md:p-5 flex justify-between items-center px-4 md:px-8">
            <div>
              <h3 className="text-white font-bold text-sm md:text-xl truncate max-w-[150px] sm:max-w-[300px]">{property.location.split(',')[0]}</h3>
              <p className="text-white/80 text-xs md:text-sm mt-1">{property.images.length} Photos</p>
            </div>
            <button onClick={() => setShowImageModal(false)} className="text-white hover:text-gray-200 text-2xl md:text-4xl transition-transform hover:scale-110">✕</button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-3 md:p-8" onClick={(e) => e.stopPropagation()}>
            <div className="relative w-full max-w-4xl">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-black/50">
                <img src={property.images[activeImg]} alt="Gallery" className="w-full h-auto max-h-[50vh] md:max-h-[65vh] object-contain" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'; }} />
              </div>
              <button onClick={prevImg} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 bg-white/20 hover:bg-white/40 text-white w-8 h-8 md:w-12 md:h-12 rounded-full transition-all text-sm md:text-2xl flex items-center justify-center backdrop-blur hover:scale-110 shadow-lg">❮</button>
              <button onClick={nextImg} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 bg-white/20 hover:bg-white/40 text-white w-8 h-8 md:w-12 md:h-12 rounded-full transition-all text-sm md:text-2xl flex items-center justify-center backdrop-blur hover:scale-110 shadow-lg">❯</button>
              <div className="absolute -bottom-8 md:-bottom-12 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-lg text-white text-[10px] md:text-sm px-2 md:px-4 py-1 rounded-full shadow-lg">{activeImg + 1} / {property.images.length}</div>
            </div>
            <div className="flex gap-2 md:gap-3 mt-6 md:mt-12 overflow-x-auto pb-2 justify-center flex-wrap max-w-full">
              {property.images.map((img, idx) => (
                <div key={idx} className={`w-12 h-12 md:w-20 md:h-20 flex-shrink-0 rounded-lg md:rounded-xl overflow-hidden cursor-pointer transition-all ${activeImg === idx ? 'ring-2 ring-[#26A69A] shadow-xl scale-105' : 'opacity-60 hover:opacity-100 hover:scale-105 shadow-md'}`} onClick={() => setActiveImg(idx)}>
                  <img src={img} alt="thumb" className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100&h=100&fit=crop'; }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const DuplexApartment = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [filteredProperties, setFilteredProperties] = useState(DuplexData);

  const handleContactClick = (property) => {
    setSelectedProperty(property);
    setShowLoginModal(true);
  };

  const handleLogin = () => {
    setShowLoginModal(false);
    setShowContactInfo(true);
    setTimeout(() => setShowContactInfo(false), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-teal-100/50 p-4 md:p-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="w-full">
          <div className="flex flex-col gap-5">
            {filteredProperties.length > 0 ? (
              filteredProperties.map((item) => (
                <PropertyCard key={item.id} property={item} onContactClick={() => handleContactClick(item)} />
              ))
            ) : (
              <div className="w-full bg-white rounded-2xl shadow-2xl border border-teal-100 p-8 text-center">
                <div className="text-5xl mb-3">🔍</div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">No Properties Found</h3>
                <p className="text-xs text-slate-500">No rental apartments available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[200] flex items-center justify-center animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl">
            <div className="w-14 h-14 bg-gradient-to-br from-[#00695C] to-[#26A69A] rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
              <span className="text-xl text-white">🔒</span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 text-center mb-1">Unlock Contact</h3>
            <p className="text-gray-500 text-xs text-center mb-4">Login to view contact details</p>
            <button onClick={handleLogin} className="w-full bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white py-2 rounded-lg font-bold text-sm shadow-lg hover:shadow-xl transition">Continue to Login</button>
            <button onClick={() => setShowLoginModal(false)} className="w-full mt-2 text-gray-500 text-xs py-1.5">Cancel</button>
          </div>
        </div>
      )}

      {/* CONTACT TOAST */}
      {showContactInfo && selectedProperty && (
        <div className="fixed bottom-4 right-4 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-xl shadow-2xl p-2.5 z-[200] animate-slideIn max-w-[260px] sm:max-w-sm">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-1 rounded-full text-xs">📞</div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[10px]">Contact Details</p>
              <p className="text-[9px] truncate">{selectedProperty.contactEmail || selectedProperty.postedBy.toLowerCase().replace(/\s/g, '') + '@example.com'}</p>
              <p className="text-[9px]">{selectedProperty.contactPhone || '+91 98765 43210'}</p>
            </div>
            <button onClick={() => setShowContactInfo(false)} className="text-white/70 text-sm shrink-0">✕</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes scale-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes pulse-green { 0%, 100% { box-shadow: 0 0 5px rgba(34,197,94,0.5); transform: rotate(0deg); } 50% { box-shadow: 0 0 20px rgba(34,197,94,0.8); transform: rotate(5deg); } }
        @keyframes rotate-slow { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(5deg); } }
        @keyframes blinkText { 0%, 100% { transform: scale(1); } 50% { transform: scale(0.97); } }
        .blink-text { animation: blinkText 0.8s ease-in-out infinite; display: inline-block; }
        @keyframes tagJump {
          0%, 100% { transform: translateY(0px) scale(1); box-shadow: 0 0 20px rgba(0,0,0,0.4), 0 0 10px rgba(0,105,92,0.8); }
          50% { transform: translateY(-7px) scale(1.05); box-shadow: 0 0 30px rgba(0,0,0,0.6), 0 0 20px rgba(0,105,92,1), 0 5px 15px rgba(0,0,0,0.5); }
        }
        @keyframes contactPulse {
          0%, 100% { box-shadow: 0 8px 20px rgba(0,105,92,0.3); }
          50% { box-shadow: 0 8px 25px rgba(0,105,92,0.5), 0 0 0 3px rgba(38,166,154,0.2); }
        }
        .tag-animation { animation: tagJump 1.5s ease-in-out infinite; }
        .contact-button { animation: contactPulse 2s ease-in-out infinite; position: relative; overflow: hidden; }
        .contact-button::before { content: ''; position: absolute; top: 50%; left: 50%; width: 0; height: 0; border-radius: 50%; background: rgba(255,255,255,0.3); transform: translate(-50%,-50%); transition: width 0.6s, height 0.6s; }
        .contact-button:hover::before { width: 300px; height: 300px; }
        .contact-button:hover { animation: none; }
        .pulse-green { animation: pulse-green 2s infinite; }
        .rotate-slow { animation: rotate-slow 3s infinite; }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideIn { animation: slideIn 0.3s ease-out; }
        .animate-scale-in { animation: scale-in 0.2s ease-out; }
      `}</style>
    </div>
  );
};

export default DuplexApartment;