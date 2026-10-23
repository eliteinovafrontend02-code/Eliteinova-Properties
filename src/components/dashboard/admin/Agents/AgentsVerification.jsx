// src/components/dashboard/admin/Agents/AgentsVerification.jsx

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiHome, FiPlus, FiEdit, FiTrash2, FiCheckCircle, FiXCircle,
  FiClock, FiSearch, FiFilter, FiChevronDown, FiChevronLeft,
  FiChevronRight, FiEye, FiStar, FiShield, FiRefreshCw,
  FiGrid, FiX, FiDownload, FiUpload, FiMoreVertical,
  FiAlertTriangle, FiInfo, FiMapPin, FiCalendar, FiUser,
  FiTag, FiDollarSign, FiSquare, FiMaximize, FiMinimize,
  FiActivity, FiExternalLink, FiUserCheck, FiUserX, FiSave,
  FiImage, FiFileText, FiPhone, FiMail, FiGlobe, FiSettings,
  FiZoomIn, FiZoomOut, FiRotateCw, FiPaperclip, FiAward,
  FiBriefcase, FiCreditCard, FiList,
} from 'react-icons/fi';
import {
  FaStar as FaStarSolid,
  FaCheck, FaTimes, FaBuilding,
  FaHome, FaBed, FaBath, FaRulerCombined,
  FaParking, FaWifi, FaSwimmingPool, FaSnowflake,
  FaFire, FaShieldAlt, FaCrown, FaMedal,
  FaUserCircle, FaStore, FaIdCard, FaFileContract, FaFilePdf,
} from 'react-icons/fa';
import { MdOutlineRealEstateAgent, MdApartment, MdOutlineBusiness, MdVerified } from 'react-icons/md';

// ============ HELPER: Detect document type from URL ============
const getDocType = (doc) => {
  if (!doc || !doc.url) return 'image';
  if (doc.type) return doc.type;
  const url = doc.url.toLowerCase().split('?')[0];
  if (url.endsWith('.pdf')) return 'pdf';
  return 'image';
};

// ============ HELPER: Is every submitted document verified? ============
const isFullyVerified = (agent) => {
  if (!agent) return false;
  const docs = [agent.agentLicenseDoc, ...agent.idDocs];
  const submitted = docs.filter(d => d && d.status !== 'not_submitted');
  return submitted.length > 0 && submitted.every(d => d.status === 'approved');
};

// ============ TOAST COMPONENT ============
const Toast = ({ toast }) => {
  if (!toast) return null;
  const colors = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-500'
  };
  return (
    <div className={`fixed bottom-6 right-6 z-[100] px-6 py-4 rounded-2xl text-white shadow-2xl flex items-center gap-3 animate-slide-up ${colors[toast.type] || colors.success}`}>
      {toast.type === 'success' && <FiCheckCircle className="text-lg" />}
      {toast.type === 'error' && <FiXCircle className="text-lg" />}
      {toast.type === 'warning' && <FiAlertTriangle className="text-lg" />}
      {toast.type === 'info' && <FiInfo className="text-lg" />}
      <span className="text-sm font-medium">{toast.message}</span>
    </div>
  );
};

// ============ CONFIRMATION MODAL ============
const ConfirmationModal = ({
  isOpen, onClose, onConfirm, title, message,
  confirmText = 'Yes', cancelText = 'No',
  confirmColor = 'bg-red-500',
  icon = <FiAlertTriangle className="text-3xl text-red-500" />,
  loading = false,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl animate-slide-up border border-[#E8F0EE]">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-3">{icon}</div>
          <h3 className="text-lg font-bold text-[#1A2E2A] mb-1.5">{title}</h3>
          <p className="text-sm text-[#5A7D78] mb-4 leading-relaxed">{message}</p>
          <div className="flex items-center gap-3 w-full">
            <button onClick={onClose} disabled={loading}
              className="flex-1 px-4 py-2 bg-[#F5F9F8] text-[#1A2E2A] rounded-xl hover:bg-[#E8F0EE] transition-all duration-300 text-sm font-medium">
              {cancelText}
            </button>
            <button onClick={onConfirm} disabled={loading}
              className={`flex-1 px-4 py-2 text-white rounded-xl hover:shadow-xl transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed ${confirmColor}`}>
              {loading ? (<><FiRefreshCw className="animate-spin text-sm" />Processing...</>) : (confirmText)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ STAT CARD COMPONENT ============
const StatCard = ({ icon, title, value, color, delay = 0, isActive, onClick }) => (
  <div
    className={`bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-500 border group cursor-pointer transform hover:-translate-y-1 ${isActive ? 'ring-2 ring-[#00695C] shadow-lg bg-[#F5F9F8]' : 'border-[#E8F0EE]'}`}
    style={{ animationDelay: `${delay}ms` }}
    onClick={() => onClick()}
  >
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-medium text-[#5A7D78] uppercase tracking-wider">{title}</p>
        <p className={`text-xl font-bold text-[#1A2E2A] group-hover:text-[#00695C] transition-colors duration-300 ${isActive ? 'text-[#00695C]' : ''}`}>
          {value.toLocaleString()}
        </p>
      </div>
    </div>
    {isActive && (
      <div className="mt-2 flex items-center gap-1">
        <span className="text-[8px] text-[#00695C] font-medium bg-[#E8F4F2] px-2 py-0.5 rounded-full">Active Filter</span>
      </div>
    )}
  </div>
);

// ============ STATUS BADGE ============
const StatusBadge = ({ status, size = 'sm' }) => {
  const styles = {
    pending: 'bg-amber-100 text-amber-700',
    approved: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-red-100 text-red-700',
    not_submitted: 'bg-gray-100 text-gray-500',
  };
  const labels = {
    pending: 'Pending',
    approved: 'Verified',
    rejected: 'Rejected',
    not_submitted: 'Not Submitted',
  };
  const iconSize = size === 'sm' ? 'text-[9px]' : 'text-xs';
  const icons = {
    pending: <FiClock className={iconSize} />,
    approved: <FiCheckCircle className={iconSize} />,
    rejected: <FiXCircle className={iconSize} />,
    not_submitted: <FiInfo className={iconSize} />,
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${size === 'sm' ? 'text-[9px]' : 'text-[10px] px-2.5 py-1'} ${styles[status] || styles.not_submitted}`}>
      {icons[status]} {labels[status] || 'Unknown'}
    </span>
  );
};

// ============ DOC CHIP ============
const DocChip = ({ doc }) => {
  const type = getDocType(doc);
  const isOptional = !!doc.optional;
  if (!isOptional && type !== 'pdf') return null;
  return (
    <span className="flex items-center gap-0.5 shrink-0">
      {type === 'pdf' && (
        <span className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[7px] font-bold bg-red-100 text-red-700 leading-none">
          <FaFilePdf className="text-[7px]" /> PDF
        </span>
      )}
      {isOptional && (
        <span className="inline-flex items-center px-1 py-0.5 rounded text-[7px] font-semibold bg-[#E8F4F2] text-[#00695C] leading-none">
          Optional
        </span>
      )}
    </span>
  );
};

// ============ DOC THUMBNAIL ============
const DocThumbnail = ({ doc, className = 'w-12 h-12 rounded-lg', iconSize = 'text-lg' }) => {
  const type = getDocType(doc);
  if (doc.status === 'not_submitted' || !doc.url) {
    return (
      <div className={`${className} flex items-center justify-center bg-white border border-[#E8F0EE] text-[#B5C9C5] shrink-0`}>
        <FiFileText className={iconSize} />
      </div>
    );
  }
  if (type === 'pdf') {
    return (
      <div className={`${className} flex flex-col items-center justify-center bg-red-50 border border-red-100 text-red-600 shrink-0`}>
        <FaFilePdf className={iconSize} />
        <span className="text-[7px] font-bold mt-0.5">PDF</span>
      </div>
    );
  }
  return (
    <div className={`${className} overflow-hidden shrink-0 border border-[#E8F0EE]`}>
      <img src={doc.url} alt={doc.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
    </div>
  );
};

// ============ CUSTOM PDF VIEWER ============
const PdfViewer = ({ url, title }) => {
  const [zoom, setZoom] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const wrapperRef = useRef(null);

  const pdfUrl = `${url}#toolbar=0&navpanes=0&scrollbar=1&view=FitH&zoom=page-width`;

  const toggleFullscreen = () => {
    const el = wrapperRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  useEffect(() => { setZoom(1); setRotate(0); }, [url]);

  return (
    <div ref={wrapperRef} className={`flex flex-col bg-[#1B2A28] ${isFullscreen ? 'w-screen h-screen' : 'w-full h-full'}`}>
      <div className="flex items-center justify-between gap-2 px-3 py-2 bg-[#0F1B19] border-b border-white/10 shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400 shrink-0">
            <FaFilePdf className="text-xs" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-white truncate">{title}</p>
            <p className="text-[9px] text-white/50">PDF Document</p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => setZoom(z => Math.max(0.5, +(z - 0.15).toFixed(2)))}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all duration-300 hover:scale-110" title="Zoom out">
            <FiZoomOut className="text-xs" />
          </button>
          <span className="text-[10px] text-white/70 font-medium w-10 text-center tabular-nums">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(3, +(z + 0.15).toFixed(2)))}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all duration-300 hover:scale-110" title="Zoom in">
            <FiZoomIn className="text-xs" />
          </button>
          <button onClick={() => setRotate(r => (r + 90) % 360)}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 ml-1" title="Rotate">
            <FiRotateCw className="text-xs" />
          </button>
          <button onClick={() => { setZoom(1); setRotate(0); }}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all duration-300 hover:scale-110" title="Reset">
            <FiRefreshCw className="text-xs" />
          </button>
          <button onClick={toggleFullscreen}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 ml-1"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
            {isFullscreen ? <FiMinimize className="text-xs" /> : <FiMaximize className="text-xs" />}
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-[#1B2A28] flex items-start justify-center p-3">
        <div className="transition-transform duration-200 ease-out origin-top"
          style={{ transform: `scale(${zoom}) rotate(${rotate}deg)`, width: '100%', height: '100%', transformOrigin: 'top center' }}>
          <iframe
            src={pdfUrl}
            title={title}
            className="w-full h-full min-h-[70vh] bg-white rounded-lg shadow-2xl border-0"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </div>
  );
};

// ============ DOCUMENT VIEWER MODAL ============
const DocumentViewerModal = ({ doc, show, onClose, onApprove, onReject, onSetPending, onDownload, loading }) => {
  const [zoom, setZoom] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => { if (show) { setZoom(1); setRotate(0); } }, [show, doc]);

  useEffect(() => {
    if (!show) return;
    const onKey = (e) => { if (e.key === 'Escape' && !document.fullscreenElement) onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [show, onClose]);

  useEffect(() => {
    const onFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  if (!doc || !show) return null;

  const isOptional = !!doc.optional;
  const notSubmitted = doc.status === 'not_submitted';
  const docType = getDocType(doc);

  const toggleFullscreen = () => {
    const el = modalRef.current;
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen?.().catch(() => {});
    else document.exitFullscreen?.().catch(() => {});
  };

  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div ref={modalRef}
        className={`bg-white rounded-2xl w-full overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col ${
          isFullscreen ? 'max-w-none max-h-none w-screen h-screen rounded-none' : 'max-w-5xl max-h-[94vh]'
        }`}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-[#00695C] to-[#26A69A] shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
              {docType === 'pdf' ? <FaFilePdf className="text-sm" /> : <FiFileText className="text-sm" />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white truncate">{doc.label}</h2>
                {isOptional && (
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/20 text-white font-medium shrink-0">Optional</span>
                )}
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/20 text-white font-medium shrink-0 uppercase">{docType}</span>
              </div>
              <p className="text-white/70 text-[10px] truncate">{doc.number ? `No: ${doc.number}` : 'Document Preview'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <StatusBadge status={doc.status} size="md" />
            <button onClick={toggleFullscreen}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
              {isFullscreen ? <FiMinimize className="text-sm" /> : <FiMaximize className="text-sm" />}
            </button>
            <button onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110">
              <FiX className="text-sm" />
            </button>
          </div>
        </div>

        {/* Viewer body */}
        <div className="flex-1 overflow-hidden bg-[#0F1B19] flex items-center justify-center min-h-[420px] relative">
          {notSubmitted ? (
            <div className="text-center text-white/70 p-6">
              <FiFileText className="text-5xl mx-auto mb-3 opacity-50" />
              <p className="text-sm">This optional document was not submitted.</p>
            </div>
          ) : docType === 'pdf' ? (
            <PdfViewer url={doc.url} title={doc.label} />
          ) : (
            <div className="w-full h-full overflow-auto flex items-center justify-center p-6">
              <img src={doc.url} alt={doc.label} draggable={false}
                className="max-w-full rounded-lg shadow-2xl select-none transition-transform duration-300"
                style={{ transform: `scale(${zoom}) rotate(${rotate}deg)` }} />
            </div>
          )}
        </div>

        {/* Image controls */}
        {!notSubmitted && docType === 'image' && (
          <div className="flex items-center justify-center gap-2 py-2.5 border-t border-[#E8F0EE] bg-[#F5F9F8] shrink-0 flex-wrap">
            <button onClick={() => setZoom(z => Math.max(0.5, +(z - 0.25).toFixed(2)))}
              className="w-8 h-8 rounded-lg bg-white border border-[#E8F0EE] flex items-center justify-center text-[#1A2E2A] hover:border-[#00695C]/30 hover:scale-110 transition-all duration-300" title="Zoom out">
              <FiZoomOut className="text-xs" />
            </button>
            <span className="text-xs text-[#5A7D78] font-medium w-12 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.min(2.5, +(z + 0.25).toFixed(2)))}
              className="w-8 h-8 rounded-lg bg-white border border-[#E8F0EE] flex items-center justify-center text-[#1A2E2A] hover:border-[#00695C]/30 hover:scale-110 transition-all duration-300" title="Zoom in">
              <FiZoomIn className="text-xs" />
            </button>
            <button onClick={() => setRotate(r => (r + 90) % 360)}
              className="w-8 h-8 rounded-lg bg-white border border-[#E8F0EE] flex items-center justify-center text-[#1A2E2A] hover:border-[#00695C]/30 hover:scale-110 transition-all duration-300 ml-1" title="Rotate">
              <FiRotateCw className="text-xs" />
            </button>
            <button onClick={() => onDownload(doc)} disabled={loading === `download_${doc.id}`}
              className="ml-1 h-8 px-3 rounded-lg bg-white border border-[#E8F0EE] flex items-center gap-1.5 text-[#1A2E2A] text-xs font-medium hover:border-[#00695C]/30 hover:scale-105 transition-all duration-300 disabled:opacity-50"
              title="Download this document">
              {loading === `download_${doc.id}` ? <FiRefreshCw className="text-xs animate-spin" /> : <FiDownload className="text-xs" />}
              Download
            </button>
          </div>
        )}

        {/* Actions row */}
        <div className="px-5 py-4 border-t border-[#E8F0EE] flex items-center gap-2.5 bg-white shrink-0 flex-wrap">
          <button onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 bg-[#F5F9F8] text-[#1A2E2A] hover:bg-[#E8F0EE] transition-all duration-300">
            <FiX className="text-xs" /> Close
          </button>
          <button onClick={() => onDownload(doc)} disabled={loading === `download_${doc.id}` || notSubmitted}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 bg-[#E8F4F2] text-[#00695C] hover:bg-[#C5EDE5] transition-all duration-300 disabled:opacity-50"
            title="Download this document">
            {loading === `download_${doc.id}` ? <FiRefreshCw className="text-xs animate-spin" /> : <FiDownload className="text-xs" />}
            Download
          </button>

          {!notSubmitted && doc.status !== 'rejected' && (
            <button onClick={() => onReject(doc)} disabled={loading}
              className="flex-1 min-w-[140px] py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 bg-red-50 text-red-700 hover:bg-red-100 transition-all duration-300 disabled:opacity-50">
              {loading === `reject_${doc.id}` ? <FiRefreshCw className="text-xs animate-spin" /> : <FiXCircle className="text-xs" />}
              Reject Document
            </button>
          )}
          {!notSubmitted && doc.status !== 'pending' && (
            <button onClick={() => onSetPending(doc)} disabled={loading}
              className="flex-1 min-w-[140px] py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-all duration-300 disabled:opacity-50">
              {loading === `pending_${doc.id}` ? <FiRefreshCw className="text-xs animate-spin" /> : <FiClock className="text-xs" />}
              Mark as Pending
            </button>
          )}
          {!notSubmitted && doc.status !== 'approved' && (
            <button onClick={() => onApprove(doc)} disabled={loading}
              className="flex-1 min-w-[140px] py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-300 disabled:opacity-50">
              {loading === `approve_${doc.id}` ? <FiRefreshCw className="text-xs animate-spin" /> : <FiCheckCircle className="text-xs" />}
              Verify Document
            </button>
          )}
          {notSubmitted && (
            <span className="flex-1 text-center text-[11px] text-[#5A7D78] italic">
              No actions available — document not submitted.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// ===== VIEW AGENT / VERIFICATION MODAL =====
const AgentVerificationModal = ({
  agent, show, onClose, onOpenDocument, onApproveDoc, onRejectDoc,
  onSetPendingDoc, onDownloadDocument, onViewAgentProfile, actionLoading,
}) => {
  if (!agent || !show) return null;
  const licenseDoc = agent.agentLicenseDoc;
  const verified = isFullyVerified(agent);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-hidden shadow-2xl animate-slide-up border border-[#E8F0EE] flex flex-col">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#00695C] to-[#26A69A] p-6 shrink-0">
          <button onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 flex items-center justify-center text-white hover:scale-110">
            <FiX className="text-lg" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-white text-2xl font-bold">
              {agent.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 min-w-0 flex-wrap">
                <h2 className="text-xl font-bold text-white truncate">{agent.name}</h2>
                {verified && (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-400 text-emerald-900 text-[10px] font-bold shrink-0"
                    title="All submitted documents verified"
                  >
                    <MdVerified className="text-xs" /> Verified
                  </span>
                )}
              </div>
              <p className="text-white/80 text-sm truncate">{agent.agencyName} · {agent.city}, {agent.state}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${
              agent.overallStatus === 'approved' ? 'bg-emerald-100 text-emerald-700' :
              agent.overallStatus === 'rejected' ? 'bg-red-100 text-red-700' :
              'bg-amber-100 text-amber-700'
            }`}>
              {agent.overallStatus === 'approved' ? 'Fully Verified' : agent.overallStatus === 'rejected' ? 'Needs Attention' : 'Verification Pending'}
            </span>
            <span className="text-[10px] px-2.5 py-1 rounded-full font-semibold bg-white/20 text-white">
              Submitted {new Date(agent.submittedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="flex items-center justify-between p-3 bg-[#F5F9F8] rounded-xl">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-[#00695C] flex items-center justify-center text-white font-bold shrink-0">
                {agent.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#1A2E2A] truncate">{agent.name}</p>
                <p className="text-xs text-[#5A7D78] truncate">Agent · {agent.email}</p>
              </div>
            </div>
            <button onClick={() => onViewAgentProfile(agent.id)}
              className="px-4 py-2 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-xs font-medium flex items-center gap-2 hover:scale-105 shrink-0">
              <FiExternalLink className="text-xs" /> View Profile
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm text-[#1A2E2A] p-3 bg-[#F5F9F8] rounded-xl">
              <FiMail className="text-[#00695C] shrink-0" /><span className="truncate">{agent.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#1A2E2A] p-3 bg-[#F5F9F8] rounded-xl">
              <FiPhone className="text-[#00695C] shrink-0" /><span className="truncate">{agent.phone}</span>
            </div>
          </div>

          {/* Agent License */}
          <div className="border border-[#E8F0EE] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#E8F4F2] flex items-center justify-center text-[#00695C]">
                  <FiAward className="text-sm" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#1A2E2A]">Agent License Verification</h4>
                  <p className="text-[11px] text-[#5A7D78]">{licenseDoc.number ? `License No: ${licenseDoc.number}` : 'Not provided'}</p>
                </div>
              </div>
              <StatusBadge status={licenseDoc.status} size="md" />
            </div>

            <div className="w-full flex items-center gap-3 p-2.5 bg-[#F5F9F8] rounded-xl mb-3">
              <button onClick={() => onOpenDocument(licenseDoc)} className="flex items-center gap-3 flex-1 min-w-0 text-left group">
                <DocThumbnail doc={licenseDoc} />
                <div className="flex-1 text-left min-w-0">
                  <p className="text-xs font-medium text-[#1A2E2A] truncate">{licenseDoc.label}</p>
                  <p className="text-[10px] text-[#5A7D78]">Click to view full document</p>
                </div>
              </button>
              <button onClick={() => onOpenDocument(licenseDoc)} className="w-8 h-8 rounded-lg hover:bg-white transition-all duration-300 flex items-center justify-center text-[#00695C] hover:scale-110 shrink-0" title="View">
                <FiEye className="text-sm" />
              </button>
              <button onClick={() => onDownloadDocument(licenseDoc)} disabled={actionLoading} className="w-8 h-8 rounded-lg hover:bg-white transition-all duration-300 flex items-center justify-center text-[#00695C] hover:scale-110 shrink-0 disabled:opacity-50" title="Download">
                <FiDownload className="text-sm" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              {licenseDoc.status !== 'rejected' && (
                <button onClick={() => onRejectDoc(licenseDoc)} disabled={actionLoading} className="flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 bg-red-50 text-red-700 hover:bg-red-100 transition-all duration-300 disabled:opacity-50">
                  <FiXCircle className="text-xs" /> Reject
                </button>
              )}
              {licenseDoc.status !== 'pending' && (
                <button onClick={() => onSetPendingDoc(licenseDoc)} disabled={actionLoading} className="flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-all duration-300 disabled:opacity-50">
                  <FiClock className="text-xs" /> Pending
                </button>
              )}
              {licenseDoc.status !== 'approved' && (
                <button onClick={() => onApproveDoc(licenseDoc)} disabled={actionLoading} className="flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-300 disabled:opacity-50">
                  <FiCheckCircle className="text-xs" /> Verify
                </button>
              )}
            </div>
          </div>

          {/* Documents */}
          <div className="border border-[#E8F0EE] rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#E8F4F2] flex items-center justify-center text-[#00695C]">
                <FaIdCard className="text-sm" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#1A2E2A]">Document Verification</h4>
                <p className="text-[11px] text-[#5A7D78]">Aadhaar, PAN & business documents</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {agent.idDocs.map(doc => {
                const notSubmitted = doc.status === 'not_submitted';
                const isOptional = !!doc.optional;
                return (
                <div key={doc.id} className="flex items-center gap-3 p-2.5 bg-[#F5F9F8] rounded-xl">
                  <button onClick={() => onOpenDocument(doc)} className="flex items-center gap-3 flex-1 min-w-0 text-left group">
                    <DocThumbnail doc={doc} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-medium text-[#1A2E2A] truncate">{doc.label}</p>
                        {isOptional && (
                          <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-[#E8F4F2] text-[#00695C] font-medium shrink-0">Optional</span>
                        )}
                      </div>
                      <p className="text-[10px] text-[#5A7D78] truncate">{doc.number || 'Not submitted'}</p>
                    </div>
                  </button>
                  <StatusBadge status={doc.status} />
                  <button onClick={() => onOpenDocument(doc)} className="w-8 h-8 rounded-lg hover:bg-white transition-all duration-300 flex items-center justify-center text-[#00695C] hover:scale-110 shrink-0" title="View">
                    <FiEye className="text-sm" />
                  </button>
                  <button onClick={() => onDownloadDocument(doc)} disabled={actionLoading || notSubmitted} className="w-8 h-8 rounded-lg hover:bg-white transition-all duration-300 flex items-center justify-center text-[#00695C] hover:scale-110 shrink-0 disabled:opacity-50" title="Download">
                    <FiDownload className="text-sm" />
                  </button>
                  <div className="flex items-center gap-1 shrink-0">
                    {!notSubmitted && doc.status !== 'rejected' && (
                      <button onClick={() => onRejectDoc(doc)} disabled={actionLoading} className="w-8 h-8 rounded-lg hover:bg-red-50 transition-all duration-300 flex items-center justify-center text-red-600 hover:scale-110 disabled:opacity-50" title="Reject">
                        <FiXCircle className="text-sm" />
                      </button>
                    )}
                    {!notSubmitted && doc.status !== 'pending' && (
                      <button onClick={() => onSetPendingDoc(doc)} disabled={actionLoading} className="w-8 h-8 rounded-lg hover:bg-amber-50 transition-all duration-300 flex items-center justify-center text-amber-600 hover:scale-110 disabled:opacity-50" title="Pending">
                        <FiClock className="text-sm" />
                      </button>
                    )}
                    {!notSubmitted && doc.status !== 'approved' && (
                      <button onClick={() => onApproveDoc(doc)} disabled={actionLoading} className="w-8 h-8 rounded-lg hover:bg-emerald-50 transition-all duration-300 flex items-center justify-center text-emerald-600 hover:scale-110 disabled:opacity-50" title="Verify">
                        <FiCheckCircle className="text-sm" />
                      </button>
                    )}
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ========== AGENT LIST ROW (LIST VIEW) ==========
const AgentListRow = ({
  agent, index, onViewAgent, onViewAgentProfile,
  onOpenDocument, onApproveDoc, onRejectDoc, onDownloadDocument,
  actionLoading,
}) => {
  const verified = isFullyVerified(agent);
  const allDocs = [agent.agentLicenseDoc, ...agent.idDocs];
  const pendingCount = allDocs.filter(d => d.status === 'pending').length;
  const rejectedCount = allDocs.filter(d => d.status === 'rejected').length;

  const badgeStatus = agent.overallStatus;
  const borderColor =
    badgeStatus === 'pending' ? 'border-l-amber-500' :
    badgeStatus === 'approved' ? 'border-l-emerald-500' : 'border-l-red-500';

  const overallPill =
    badgeStatus === 'approved' ? { label: 'Fully Verified', cls: 'bg-emerald-100 text-emerald-700' } :
    badgeStatus === 'rejected' ? { label: 'Rejected', cls: 'bg-red-100 text-red-700' } :
    { label: 'Pending', cls: 'bg-amber-100 text-amber-700' };

  return (
    <div
      className={`bg-white rounded-2xl border border-[#E8F0EE] border-l-4 ${borderColor} p-4 hover:shadow-lg transition-all duration-300 animate-slide-in`}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Left: Agent info */}
        <div className="flex items-center gap-3 lg:w-72 shrink-0 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white text-base font-bold shadow-lg shrink-0">
            {agent.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <h3 className="font-semibold text-[#1A2E2A] text-sm truncate">{agent.name}</h3>
              {verified && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[8px] font-bold shrink-0" title="All submitted documents verified">
                  <MdVerified className="text-[9px]" /> VERIFIED
                </span>
              )}
            </div>
            <p className="text-[10px] text-[#5A7D78] truncate flex items-center gap-1">
              <FaBuilding className="text-[9px] shrink-0" /> {agent.agencyName}
            </p>
            <p className="text-[10px] text-[#5A7D78] truncate flex items-center gap-1 mt-0.5">
              <FiMapPin className="text-[9px] text-[#00695C] shrink-0" /> {agent.city}, {agent.state} · {agent.pincode}
            </p>
          </div>
        </div>

        {/* Middle: Docs summary */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${overallPill.cls}`}>{overallPill.label}</span>
            <span className="text-[9px] px-2 py-0.5 rounded-full font-medium bg-[#F5F9F8] text-[#5A7D78]">
              {allDocs.length} Documents
            </span>
            {pendingCount > 0 && (
              <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-700">
                {pendingCount} Pending
              </span>
            )}
            {rejectedCount > 0 && (
              <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-red-100 text-red-700">
                {rejectedCount} Rejected
              </span>
            )}
          </div>

          {/* Document chips — wider so full names show */}
          <div className="flex flex-wrap gap-1.5">
            {allDocs.map(doc => (
              <button
                key={doc.id}
                onClick={() => onOpenDocument(doc)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#F5F9F8] hover:bg-[#E8F0EE] transition-all duration-300 text-[10px] font-medium text-[#1A2E2A] group/doc shrink-0"
                title={`${doc.label} — ${doc.status}`}
              >
                {doc.category === 'license'
                  ? <FiAward className="text-[#00695C] text-[11px] shrink-0" />
                  : <FaIdCard className="text-[#00695C] text-[10px] shrink-0" />}
                <span className="whitespace-nowrap">{doc.label}</span>
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  doc.status === 'approved' ? 'bg-emerald-500' :
                  doc.status === 'pending' ? 'bg-amber-500' :
                  doc.status === 'rejected' ? 'bg-red-500' : 'bg-gray-300'
                }`} />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 lg:shrink-0 flex-wrap lg:justify-end">
          <button
            onClick={() => onViewAgent(agent)}
            className="px-3 py-2 text-xs font-medium text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center gap-1.5 hover:scale-105"
          >
            <FiShield className="text-[11px]" /> Review
          </button>
          <button
            onClick={() => onViewAgentProfile(agent.id)}
            className="px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-[#00695C] to-[#26A69A] rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-1.5 hover:scale-105"
          >
            <FiExternalLink className="text-[11px]" /> Profile
          </button>
        </div>
      </div>
    </div>
  );
};
// =====================================================
// ==========  CLEAN REALISTIC DUMMY DATASET  ==========
// =====================================================

const SAMPLE_PDF = {
  A: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
  B: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  C: 'https://pdfobject.com/pdf/sample.pdf',
};

const SAMPLE_IMG = {
  A: 'https://picsum.photos/seed/aadhaar_doc/900/600',
  B: 'https://picsum.photos/seed/pan_doc/900/600',
  C: 'https://picsum.photos/seed/gst_doc/900/600',
  D: 'https://picsum.photos/seed/br_doc/900/600',
  E: 'https://picsum.photos/seed/license_doc/900/600',
};

const AGENT_SEEDS = [
  { name: 'Rajesh Kumar',     agency: 'GreenNest Realty',      city: 'Mumbai',     state: 'Maharashtra', pin: '400001', rera: 'MH/RERA/AGT/2021/45231', aadhaar: '4821', pan: 'ABCDE4821F', gstin: '27ABCDE4821F1Z5', cin: 'U70100MH2019PTC321456' },
  { name: 'Priya Sharma',     agency: 'Urban Homes Group',     city: 'Delhi',      state: 'Delhi',       pin: '110001', rera: 'DL/RERA/AGT/2022/11287', aadhaar: '7723', pan: 'FGHIJ7723K', gstin: '07FGHIJ7723K1Z9', cin: 'U70100DL2020PTC211876' },
  { name: 'Amit Singh',       agency: 'Elite Homes',           city: 'Bangalore',  state: 'Karnataka',   pin: '560001', rera: 'KA/RERA/AGT/2021/99845', aadhaar: '1245', pan: 'KLMNO1245P', gstin: '29KLMNO1245P1Z3', cin: 'U70100KA2018PTC112233' },
  { name: 'Sneha Patel',      agency: 'Trust Estates',         city: 'Ahmedabad',  state: 'Gujarat',     pin: '380001', rera: 'GJ/RERA/AGT/2022/67412', aadhaar: '3390', pan: 'PQRST3390V', gstin: '24PQRST3390V1Z7', cin: 'U70100GJ2019PTC119878' },
  { name: 'Vikram Reddy',     agency: 'Skyline Properties',    city: 'Hyderabad',  state: 'Telangana',   pin: '500001', rera: 'TS/RERA/AGT/2021/33011', aadhaar: '5567', pan: 'UVWXY5567Z', gstin: '36UVWXY5567Z1Z4', cin: 'U70100TS2017PTC098765' },
  { name: 'Meera Joshi',      agency: 'Prime Living Realtors', city: 'Pune',       state: 'Maharashtra', pin: '411001', rera: 'MH/RERA/AGT/2022/78554', aadhaar: '8834', pan: 'ZYXWV8834B', gstin: '27ZYXWV8834B1Z2', cin: 'U70100MH2020PTC222334' },
  { name: 'Arjun Nair',       agency: 'Coastal Properties',    city: 'Kochi',      state: 'Kerala',      pin: '682001', rera: 'KL/RERA/AGT/2021/12908', aadhaar: '6678', pan: 'LMNOP6678Q', gstin: '32LMNOP6678Q1Z8', cin: 'U70100KL2018PTC334455' },
  { name: 'Kavya Rao',        agency: 'Metro Housing Co.',     city: 'Chennai',    state: 'Tamil Nadu',  pin: '600001', rera: 'TN/RERA/AGT/2022/55671', aadhaar: '9901', pan: 'QRSTU9901L', gstin: '33QRSTU9901L1Z5', cin: 'U70100TN2019PTC445566' },
  { name: 'Sanjay Iyer',      agency: 'NextGen Realty',        city: 'Jaipur',     state: 'Rajasthan',   pin: '302001', rera: 'RJ/RERA/AGT/2021/21344', aadhaar: '4412', pan: 'VWXYZ4412M', gstin: '08VWXYZ4412M1Z1', cin: 'U70100RJ2017PTC556677' },
  { name: 'Divya Krishnan',   agency: 'Golden Key Estates',    city: 'Nagpur',     state: 'Maharashtra', pin: '440001', rera: 'MH/RERA/AGT/2022/88710', aadhaar: '2256', pan: 'ABCDE2256N', gstin: '27ABCDE2256N1Z6', cin: 'U70100MH2021PTC667788' },
  { name: 'Rohit Malhotra',   agency: 'Urban Homes Group',     city: 'Delhi',      state: 'Delhi',       pin: '110002', rera: 'DL/RERA/AGT/2021/34512', aadhaar: '7738', pan: 'FGHIJ7738P', gstin: '07FGHIJ7738P1Z0', cin: 'U70100DL2019PTC778899' },
  { name: 'Anita Menon',      agency: 'GreenNest Realty',      city: 'Mumbai',     state: 'Maharashtra', pin: '400002', rera: 'MH/RERA/AGT/2022/61209', aadhaar: '1104', pan: 'KLMNO1104R', gstin: '27KLMNO1104R1Z4', cin: 'U70100MH2020PTC889900' },
];

const pick = (arr, seed) => arr[seed % arr.length];

const buildAgent = (seed, i) => {
  const s = AGENT_SEEDS[i % AGENT_SEEDS.length];
  const submitted = new Date();
  submitted.setDate(submitted.getDate() - (5 + (i * 3) % 80));

  const licenseStatus = i % 5 === 0 ? 'pending' : i % 7 === 0 ? 'rejected' : 'approved';
  const aadhaarStatus = i % 6 === 0 ? 'pending' : i % 11 === 0 ? 'rejected' : 'approved';
  const panStatus     = i % 4 === 0 ? 'pending' : i % 9 === 0 ? 'rejected' : 'approved';
  const gstSubmitted  = i % 3 !== 0;
  const gstStatus     = gstSubmitted ? (i % 8 === 0 ? 'rejected' : i % 5 === 0 ? 'pending' : 'approved') : 'not_submitted';
  const brSubmitted   = i % 4 !== 0;
  const brStatus      = brSubmitted ? (i % 10 === 0 ? 'rejected' : i % 6 === 0 ? 'pending' : 'approved') : 'not_submitted';

  const licenseIsPdf = i % 3 === 0;
  const aadhaarIsPdf = i % 2 === 1;
  const panIsPdf     = i % 4 === 0;
  const gstIsPdf     = i % 5 === 1;
  const brIsPdf      = i % 2 === 0;

  const allStatuses = [licenseStatus, aadhaarStatus, panStatus, gstStatus, brStatus].filter(x => x !== 'not_submitted');
  let overallStatus = 'pending';
  if (allStatuses.every(x => x === 'approved')) overallStatus = 'approved';
  else if (allStatuses.some(x => x === 'rejected')) overallStatus = 'rejected';

  return {
    id: `agent_${i + 1}`,
    name: s.name,
    email: `${s.name.toLowerCase().replace(/\s+/g, '.')}@${s.agency.toLowerCase().replace(/[^a-z]/g, '')}.in`,
    phone: `+91 ${90000 + (i * 37) % 9999}${String(10000 + i * 137).slice(-5)}`,
    agencyName: s.agency,
    city: s.city,
    state: s.state,
    pincode: s.pin,
    submittedDate: submitted.toISOString(),
    overallStatus,
    agentLicenseDoc: {
      id: `license_${i + 1}`,
      label: 'Agent License',
      category: 'license',
      number: s.rera,
      url: licenseIsPdf ? pick(Object.values(SAMPLE_PDF), i) : SAMPLE_IMG.E,
      type: licenseIsPdf ? 'pdf' : 'image',
      status: licenseStatus,
      agentName: s.name,
      optional: false,
    },
    idDocs: [
      {
        id: `aadhaar_${i + 1}`,
        label: 'Aadhaar Card',
        category: 'documents',
        number: `XXXX XXXX ${s.aadhaar}`,
        url: aadhaarIsPdf ? pick(Object.values(SAMPLE_PDF), i + 1) : SAMPLE_IMG.A,
        type: aadhaarIsPdf ? 'pdf' : 'image',
        status: aadhaarStatus,
        agentName: s.name,
        optional: false,
      },
      {
        id: `pan_${i + 1}`,
        label: 'PAN Card',
        category: 'documents',
        number: s.pan,
        url: panIsPdf ? pick(Object.values(SAMPLE_PDF), i + 2) : SAMPLE_IMG.B,
        type: panIsPdf ? 'pdf' : 'image',
        status: panStatus,
        agentName: s.name,
        optional: false,
      },
      {
        id: `gst_${i + 1}`,
        label: 'GST Certificate',
        category: 'documents',
        number: gstSubmitted ? s.gstin : '',
        url: gstSubmitted ? (gstIsPdf ? pick(Object.values(SAMPLE_PDF), i + 3) : SAMPLE_IMG.C) : '',
        type: gstIsPdf ? 'pdf' : 'image',
        status: gstStatus,
        agentName: s.name,
        optional: true,
      },
      {
        id: `br_${i + 1}`,
        label: 'Business Registration Certificate',
        category: 'documents',
        number: brSubmitted ? s.cin : '',
        url: brSubmitted ? (brIsPdf ? pick(Object.values(SAMPLE_PDF), i + 4) : SAMPLE_IMG.D) : '',
        type: brIsPdf ? 'pdf' : 'image',
        status: brStatus,
        agentName: s.name,
        optional: true,
      },
    ],
  };
};

const DUMMY_AGENTS = Array.from({ length: 12 }, (_, i) => buildAgent(i, i));

// ============ MAIN COMPONENT ============
const AgentsVerification = () => {
  const navigate = useNavigate();

  const [agents, setAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [showStats, setShowStats] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const searchInputRef = useRef(null);

  const [viewingAgent, setViewingAgent] = useState(null);
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [viewingDoc, setViewingDoc] = useState(null);
  const [showDocModal, setShowDocModal] = useState(false);

  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false, title: '', message: '', confirmText: 'Yes', cancelText: 'No',
    confirmColor: 'bg-red-500',
    icon: <FiAlertTriangle className="text-4xl text-red-500" />,
    onConfirm: null,
  });

  const [stats, setStats] = useState({
    total: 0, pending: 0, pendingLicense: 0, pendingDocs: 0, fullyVerified: 0, rejected: 0,
  });

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  }, []);

  useEffect(() => {
    setAgents(DUMMY_AGENTS);
    setFilteredAgents(DUMMY_AGENTS);
    updateStats(DUMMY_AGENTS);
  }, []);

  const updateStats = useCallback((list) => {
    setStats({
      total: list.length,
      pending: list.filter(a => a.overallStatus === 'pending').length,
      pendingLicense: list.filter(a => a.agentLicenseDoc.status === 'pending').length,
      pendingDocs: list.filter(a => a.idDocs.some(d => d.status === 'pending')).length,
      fullyVerified: list.filter(a => a.overallStatus === 'approved').length,
      rejected: list.filter(a => a.overallStatus === 'rejected').length,
    });
  }, []);

  const filterAgents = useCallback(() => {
    let filtered = [...agents];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(a =>
        a.name.toLowerCase().includes(q) || a.agencyName.toLowerCase().includes(q) ||
        a.city.toLowerCase().includes(q) || a.email.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(a => a.overallStatus === statusFilter);
    }
    setFilteredAgents(filtered);
    setCurrentPage(1);
  }, [agents, searchQuery, statusFilter]);

  useEffect(() => { filterAgents(); }, [filterAgents]);

  const totalPages = Math.ceil(filteredAgents.length / pageSize);
  const paginatedAgents = useMemo(() =>
    filteredAgents.slice((currentPage - 1) * pageSize, currentPage * pageSize),
  [filteredAgents, currentPage, pageSize]);

  const handleStatClick = useCallback((filter) => {
    setActiveFilter(filter);
    if (filter === 'all') { setStatusFilter('all'); }
    else if (filter === 'pending') { setStatusFilter('pending'); }
    else if (filter === 'pendingLicense') { setStatusFilter('all'); }
    else if (filter === 'pendingDocs') { setStatusFilter('all'); }
    else if (filter === 'fullyVerified') { setStatusFilter('approved'); }
    else if (filter === 'rejected') { setStatusFilter('rejected'); }
    setSearchQuery('');
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchQuery(''); setStatusFilter('all'); setActiveFilter('all');
    searchInputRef.current?.focus();
    showToast('All filters cleared', 'info');
  }, [showToast]);

  const handleViewAgent = useCallback((agent) => {
    setViewingAgent(agent); setShowAgentModal(true);
  }, []);

  const handleViewAgentProfile = useCallback((agentId) => {
    navigate('/profile/agent');
    showToast('Opening Agent Profile...', 'info');
  }, [navigate, showToast]);

  const handleOpenDocument = useCallback((doc) => {
    setViewingDoc(doc); setShowDocModal(true);
  }, []);

  // ============ DOWNLOAD — NO NEW TAB, PROPER FILENAME ============
  const handleDownloadDocument = useCallback(async (doc) => {
    if (!doc.url) {
      showToast(`No file available for "${doc.label}"`, 'warning');
      return;
    }

    const docType = getDocType(doc);
    const baseName = `${doc.agentName || 'agent'}_${doc.label}`
      .replace(/[^a-z0-9]+/gi, '_')
      .replace(/^_+|_+$/g, '') || 'document';
    const fallbackExt = docType === 'pdf' ? 'pdf' : 'jpg';
    const targetName = `${baseName}.${fallbackExt}`;

    setActionLoading(`download_${doc.id}`);

    const tryFetchDownload = async () => {
      const response = await fetch(doc.url, { mode: 'cors', credentials: 'omit' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      let ext = fallbackExt;
      if (blob.type.includes('pdf')) ext = 'pdf';
      else if (blob.type.includes('png')) ext = 'png';
      else if (blob.type.includes('webp')) ext = 'webp';
      else if (blob.type.includes('jpeg') || blob.type.includes('jpg')) ext = 'jpg';

      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = `${baseName}.${ext}`;
      link.rel = 'noopener';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => window.URL.revokeObjectURL(objectUrl), 2000);
      return true;
    };

    const tryAnchorDownload = () => {
      try {
        const link = document.createElement('a');
        link.href = doc.url;
        link.download = targetName;
        link.target = '_self';
        link.rel = 'noopener';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        link.remove();
        return true;
      } catch { return false; }
    };

    try {
      await tryFetchDownload();
      showToast(`${doc.label} downloaded`, 'success');
    } catch {
      if (tryAnchorDownload()) showToast(`${doc.label} download started`, 'success');
      else showToast(`Couldn't download "${doc.label}". Please try again or check the file host.`, 'error');
    } finally {
      setActionLoading(null);
    }
  }, [showToast]);

  const applyDocStatus = useCallback((doc, newStatus) => {
    return new Promise((resolve) => {
      const loadKey = `${newStatus === 'approved' ? 'approve' : newStatus === 'rejected' ? 'reject' : 'pending'}_${doc.id}`;
      setActionLoading(loadKey);
      setTimeout(() => {
        setAgents(prev => {
          const updated = prev.map(agent => {
            if (agent.agentLicenseDoc.id === doc.id) {
              const agentLicenseDoc = { ...agent.agentLicenseDoc, status: newStatus };
              return recomputeOverall({ ...agent, agentLicenseDoc });
            }
            if (agent.idDocs.some(d => d.id === doc.id)) {
              const idDocs = agent.idDocs.map(d => d.id === doc.id ? { ...d, status: newStatus } : d);
              return recomputeOverall({ ...agent, idDocs });
            }
            return agent;
          });
          updateStats(updated);
          return updated;
        });
        setViewingDoc(prev => (prev && prev.id === doc.id) ? { ...prev, status: newStatus } : prev);
        setViewingAgent(prev => {
          if (!prev) return prev;
          if (prev.agentLicenseDoc.id === doc.id) return recomputeOverall({ ...prev, agentLicenseDoc: { ...prev.agentLicenseDoc, status: newStatus } });
          if (prev.idDocs.some(d => d.id === doc.id)) {
            const idDocs = prev.idDocs.map(d => d.id === doc.id ? { ...d, status: newStatus } : d);
            return recomputeOverall({ ...prev, idDocs });
          }
          return prev;
        });
        const statusLabel = newStatus === 'approved' ? 'verified' : newStatus === 'rejected' ? 'rejected' : 'marked as pending';
        showToast(`${doc.label} ${statusLabel} successfully`,
          newStatus === 'approved' ? 'success' : newStatus === 'rejected' ? 'warning' : 'info');
        setActionLoading(null);
        resolve();
      }, 600);
    });
  }, [showToast, updateStats]);

  const recomputeOverall = (agent) => {
    const allStatuses = [agent.agentLicenseDoc.status, ...agent.idDocs.map(d => d.status)].filter(s => s !== 'not_submitted');
    let overallStatus = 'pending';
    if (allStatuses.every(s => s === 'approved')) overallStatus = 'approved';
    else if (allStatuses.some(s => s === 'rejected')) overallStatus = 'rejected';
    return { ...agent, overallStatus };
  };

  const handleApproveDoc = useCallback((doc) => {
    if (doc.status === 'not_submitted') { showToast(`"${doc.label}" was not submitted — cannot verify.`, 'warning'); return; }
    setConfirmationModal({
      isOpen: true, title: 'Verify Document',
      message: `Are you sure you want to verify "${doc.label}"? This will mark it as verified.`,
      confirmText: 'Yes, Verify', confirmColor: 'bg-emerald-500',
      icon: <FiCheckCircle className="text-4xl text-emerald-500" />,
      onConfirm: () => applyDocStatus(doc, 'approved'),
    });
  }, [applyDocStatus, showToast]);

  const handleRejectDoc = useCallback((doc) => {
    if (doc.status === 'not_submitted') { showToast(`"${doc.label}" was not submitted — nothing to reject.`, 'warning'); return; }
    setConfirmationModal({
      isOpen: true, title: 'Reject Document',
      message: `Are you sure you want to reject "${doc.label}"? The agent will need to resubmit it.`,
      confirmText: 'Yes, Reject', confirmColor: 'bg-red-500',
      icon: <FiXCircle className="text-4xl text-red-500" />,
      onConfirm: () => applyDocStatus(doc, 'rejected'),
    });
  }, [applyDocStatus, showToast]);

  const handleSetPendingDoc = useCallback((doc) => {
    if (doc.status === 'not_submitted') { showToast(`"${doc.label}" was not submitted.`, 'warning'); return; }
    setConfirmationModal({
      isOpen: true, title: 'Mark as Pending',
      message: `Are you sure you want to move "${doc.label}" back to pending review?`,
      confirmText: 'Yes, Mark Pending', confirmColor: 'bg-amber-500',
      icon: <FiClock className="text-4xl text-amber-500" />,
      onConfirm: () => applyDocStatus(doc, 'pending'),
    });
  }, [applyDocStatus, showToast]);

  const closeConfirmation = useCallback(() => {
    setConfirmationModal(prev => ({ ...prev, isOpen: false }));
  }, []);

  const handleConfirmAction = useCallback(async () => {
    if (confirmationModal.onConfirm) await confirmationModal.onConfirm();
    closeConfirmation();
  }, [confirmationModal, closeConfirmation]);

  const handleRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setAgents(DUMMY_AGENTS);
      setFilteredAgents(DUMMY_AGENTS);
      updateStats(DUMMY_AGENTS);
      setLoading(false);
      showToast('Data refreshed successfully', 'success');
    }, 800);
  }, [showToast, updateStats]);

  return (
    <div className="space-y-6 p-4 lg:p-6 pb-24 bg-[#F8FAF9] min-h-full h-full overflow-y-auto custom-page-scroll relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-[#00695C]/5 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-[#26A69A]/5 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <Toast toast={toast} />

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={closeConfirmation}
        onConfirm={handleConfirmAction}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText={confirmationModal.confirmText}
        cancelText={confirmationModal.cancelText}
        confirmColor={confirmationModal.confirmColor}
        icon={confirmationModal.icon}
        loading={!!actionLoading}
      />

      <DocumentViewerModal
        doc={viewingDoc}
        show={showDocModal}
        onClose={() => { setShowDocModal(false); setViewingDoc(null); }}
        onApprove={handleApproveDoc}
        onReject={handleRejectDoc}
        onSetPending={handleSetPendingDoc}
        onDownload={handleDownloadDocument}
        loading={actionLoading}
      />

      <AgentVerificationModal
        agent={viewingAgent}
        show={showAgentModal}
        onClose={() => { setShowAgentModal(false); setViewingAgent(null); }}
        onOpenDocument={handleOpenDocument}
        onApproveDoc={handleApproveDoc}
        onRejectDoc={handleRejectDoc}
        onSetPendingDoc={handleSetPendingDoc}
        onDownloadDocument={handleDownloadDocument}
        onViewAgentProfile={handleViewAgentProfile}
        actionLoading={!!actionLoading}
      />

      {/* Header */}
      <div className="relative animate-fade-in">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#00695C] to-[#26A69A] bg-clip-text text-transparent">
                Agent Verification
              </h1>
              <span className="px-3 py-1 bg-[#E8F4F2] text-[#00695C] text-xs font-semibold rounded-full animate-pulse">
                {filteredAgents.length} Agents
              </span>
            </div>
            <p className="text-sm text-[#5A7D78] flex items-center gap-2 flex-wrap">
              <span>License & document verification in one place</span>
              <span className="w-1 h-1 bg-[#B5C9C5] rounded-full" />
              <span className="text-[#00695C] font-medium">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto flex-wrap">
            <button
              onClick={() => setShowStats(!showStats)}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-[#E8F0EE] rounded-xl hover:border-[#00695C]/30 hover:shadow-md transition-all duration-300 text-sm font-medium text-[#1A2E2A] hover:scale-105"
            >
              <FiActivity className={`text-sm transition-transform duration-300 ${showStats ? 'rotate-0' : 'rotate-180'}`} />
              <span className="hidden sm:inline">{showStats ? 'Hide Stats' : 'Show Stats'}</span>
            </button>

            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white rounded-xl hover:shadow-xl transition-all duration-300 text-sm font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden hover:scale-105"
            >
              <span className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
              <FiRefreshCw className={`text-sm ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
              <span className="hidden sm:inline">{loading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      {showStats && (
        <div className="relative animate-slide-in">
          <div className="bg-white rounded-2xl p-4 border border-[#E8F0EE] shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <StatCard icon={<FiUser className="text-white text-sm" />} title="Total Agents" value={stats.total}
                color="bg-gradient-to-br from-[#00695C] to-[#26A69A]" delay={0}
                isActive={activeFilter === 'all'} onClick={() => handleStatClick('all')} />
              <StatCard icon={<FiClock className="text-white text-sm" />} title="Pending" value={stats.pending}
                color="bg-gradient-to-br from-amber-600 to-amber-400" delay={50}
                isActive={activeFilter === 'pending'} onClick={() => handleStatClick('pending')} />
              <StatCard icon={<FiAward className="text-white text-sm" />} title="Pending License" value={stats.pendingLicense}
                color="bg-gradient-to-br from-yellow-600 to-yellow-400" delay={100}
                isActive={activeFilter === 'pendingLicense'} onClick={() => handleStatClick('pendingLicense')} />
              <StatCard icon={<FaIdCard className="text-white text-sm" />} title="Pending Docs" value={stats.pendingDocs}
                color="bg-gradient-to-br from-blue-600 to-blue-400" delay={150}
                isActive={activeFilter === 'pendingDocs'} onClick={() => handleStatClick('pendingDocs')} />
              <StatCard icon={<MdVerified className="text-white text-sm" />} title="Fully Verified" value={stats.fullyVerified}
                color="bg-gradient-to-br from-emerald-600 to-emerald-400" delay={200}
                isActive={activeFilter === 'fullyVerified'} onClick={() => handleStatClick('fullyVerified')} />
              <StatCard icon={<FiXCircle className="text-white text-sm" />} title="Rejected" value={stats.rejected}
                color="bg-gradient-to-br from-red-600 to-red-400" delay={250}
                isActive={activeFilter === 'rejected'} onClick={() => handleStatClick('rejected')} />
            </div>
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="relative bg-white rounded-2xl p-4 shadow-sm border border-[#E8F0EE] hover:shadow-md transition-all duration-300">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">

          {/* Search */}
          <div className="flex-1 w-full lg:w-auto relative min-w-0">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search agents by name, agency, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none placeholder:text-[#B5C9C5]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#5A7D78] hover:text-[#1A2E2A] transition-colors hover:scale-110"
              >
                <FiX className="text-sm" />
              </button>
            )}
          </div>

          {/* Right-side controls: Status filter + Clear + View toggle */}
          <div className="flex items-center gap-2 w-full lg:w-auto flex-wrap">

            {/* Status filter */}
            <div className="relative shrink-0">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none px-4 py-2.5 bg-[#F5F9F8] rounded-xl border border-[#E8F0EE] focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300 text-sm text-[#1A2E2A] outline-none cursor-pointer pr-10 hover:bg-[#E8F0EE]"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5A7D78] text-sm pointer-events-none" />
            </div>

            {/* Clear filter */}
            {(statusFilter !== 'all' || searchQuery) && (
              <button
                onClick={clearAllFilters}
                className="px-3 py-2.5 bg-[#FEF3E2] text-amber-700 rounded-xl hover:bg-[#FEE6C5] transition-all duration-300 text-sm font-medium flex items-center gap-1 hover:scale-105 shrink-0"
              >
                <FiX className="text-sm" /> Clear
              </button>
            )}

            {/* Divider */}
            <span className="hidden sm:block w-px h-8 bg-[#E8F0EE] mx-1" />

            {/* View mode toggle */}
            <div className="flex items-center bg-[#F5F9F8] border border-[#E8F0EE] rounded-xl p-0.5 shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                  viewMode === 'grid'
                    ? 'bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white shadow-md'
                    : 'text-[#5A7D78] hover:text-[#00695C] hover:bg-white'
                }`}
                title="Grid view"
              >
                <FiGrid className="text-sm" />

              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                  viewMode === 'list'
                    ? 'bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white shadow-md'
                    : 'text-[#5A7D78] hover:text-[#00695C] hover:bg-white'
                }`}
                title="List view"
              >
                <FiList className="text-sm" />

              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Content: Grid or List */}
      <div className="relative">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00695C]/20 border-t-[#00695C] rounded-full animate-spin" />
          </div>
        ) : viewMode === 'grid' ? (
          /* ============ GRID VIEW ============ */
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {paginatedAgents.map((agent, index) => {
              const badgeStatus = agent.overallStatus;
              const quickDoc = agent.agentLicenseDoc.status === 'pending' ? agent.agentLicenseDoc : (agent.idDocs.find(d => d.status === 'pending') || null);
              const isQuickPending = quickDoc && quickDoc.status === 'pending';
              const verified = isFullyVerified(agent);
              const allDocs = [agent.agentLicenseDoc, ...agent.idDocs];

              return (
                <div key={agent.id}
                  className={`bg-white rounded-2xl border border-[#E8F0EE] p-4 hover:shadow-xl hover:-translate-y-1 group animate-slide-in transition-all duration-500 ${
                    badgeStatus === 'pending' ? 'border-l-4 border-l-amber-500' :
                    badgeStatus === 'approved' ? 'border-l-4 border-l-emerald-500' :
                    'border-l-4 border-l-red-500'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}>
                  <div className="flex items-start justify-between mb-3 gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#00695C] to-[#26A69A] flex items-center justify-center text-white text-sm font-bold shadow-lg shrink-0">
                        {agent.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <h3 className="font-semibold text-[#1A2E2A] text-sm truncate">{agent.name}</h3>
                          {verified && (
                            <span
                              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[8px] font-bold shrink-0"
                              title="All submitted documents verified"
                            >
                              <MdVerified className="text-[9px]" /> VERIFIED
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-[#5A7D78] truncate flex items-center gap-1">
                          <FaBuilding className="text-[9px]" /> {agent.agencyName}
                        </p>
                      </div>
                    </div>
                    <button type="button" onClick={() => handleViewAgent(agent)}
                      className="w-8 h-8 rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 flex items-center justify-center text-[#5A7D78] hover:text-[#00695C] hover:scale-110 shrink-0" title="View Verification">
                      <FiEye className="text-sm" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-[#5A7D78] mb-3">
                    <FiMapPin className="text-[#00695C] shrink-0" />
                    <span className="truncate">{agent.city}, {agent.state} · {agent.pincode}</span>
                  </div>

                  {/* Documents — one per line */}
                  <div className="space-y-1.5 mb-3">
                    {allDocs.map((doc) => (
                      <button
                        key={doc.id}
                        onClick={() => handleOpenDocument(doc)}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 bg-[#F5F9F8] rounded-lg hover:bg-[#E8F0EE] transition-all duration-300 min-w-0"
                        title={doc.label}
                      >
                        <span className="shrink-0 w-5 flex justify-center">
                          {doc.category === 'license'
                            ? <FiAward className="text-[#00695C] text-xs" />
                            : <FaIdCard className="text-[#00695C] text-[10px]" />}
                        </span>
                        <span className="text-[10px] font-medium text-[#1A2E2A] truncate flex-1 text-left">
                          {doc.label}
                        </span>
                        <DocChip doc={doc} />
                        <StatusBadge status={doc.status} />
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-2.5 border-t border-[#E8F0EE]">
                    {isQuickPending ? (
                      <>
                        <button onClick={() => handleRejectDoc(quickDoc)} disabled={!!actionLoading}
                          className="flex-1 py-2 text-xs font-medium text-red-700 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-300 flex items-center justify-center gap-1.5 hover:scale-105 disabled:opacity-50">
                          <FiXCircle className="text-[11px]" /> Reject
                        </button>
                        <button onClick={() => handleApproveDoc(quickDoc)} disabled={!!actionLoading}
                          className="flex-1 py-2 text-xs font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-all duration-300 flex items-center justify-center gap-1.5 hover:scale-105 disabled:opacity-50">
                          <FiCheckCircle className="text-[11px]" /> Verify
                        </button>
                      </>
                    ) : (
                      <button onClick={() => handleViewAgent(agent)}
                        className="flex-1 py-2 text-xs font-medium text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1.5 hover:scale-105">
                        <FiShield className="text-[11px]" /> Review Verification
                      </button>
                    )}
                  </div>
                  {isQuickPending && (
                    <button onClick={() => handleViewAgent(agent)}
                      className="w-full mt-1.5 py-1.5 text-[10px] font-medium text-[#5A7D78] hover:text-[#00695C] transition-all duration-300 flex items-center justify-center gap-1">
                      <FiEye className="text-[10px]" /> View full verification
                    </button>
                  )}

                  <div className="mt-1.5">
                    <button type="button" onClick={() => handleViewAgentProfile(agent.id)}
                      className="w-full py-1.5 text-[10px] font-medium text-[#00695C] bg-[#E8F4F2] rounded-xl hover:bg-[#C5EDE5] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-[1.02]">
                      <FiExternalLink className="text-[10px]" /> View Agent Profile
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ============ LIST VIEW ============ */
          <div className="space-y-3">
            {paginatedAgents.map((agent, index) => (
              <AgentListRow
                key={agent.id}
                agent={agent}
                index={index}
                onViewAgent={handleViewAgent}
                onViewAgentProfile={handleViewAgentProfile}
                onOpenDocument={handleOpenDocument}
                onApproveDoc={handleApproveDoc}
                onRejectDoc={handleRejectDoc}
                onDownloadDocument={handleDownloadDocument}
                actionLoading={!!actionLoading}
              />
            ))}
          </div>
        )}

        {paginatedAgents.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#E8F0EE]">
            <div className="w-24 h-24 rounded-full bg-[#F5F9F8] flex items-center justify-center mb-4 animate-float">
              <FiUser className="text-4xl text-[#B5C9C5]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1A2E2A]">No agents found</h3>
            <p className="text-sm text-[#5A7D78] mt-1">Try adjusting your search or filter criteria</p>
            <button onClick={clearAllFilters}
              className="mt-4 px-6 py-2.5 bg-[#00695C] text-white rounded-xl hover:bg-[#004D40] transition-all duration-300 text-sm font-medium shadow-lg shadow-[#00695C]/30 hover:scale-105">
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between bg-white rounded-2xl px-4 py-3 border border-[#E8F0EE] shadow-sm gap-3">
          <div className="flex items-center gap-2 text-sm text-[#5A7D78] flex-wrap">
            <span>
              Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredAgents.length)} of {filteredAgents.length} agents
            </span>
            <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="ml-2 px-2 py-1 bg-[#F5F9F8] rounded-lg border border-[#E8F0EE] text-sm text-[#1A2E2A] outline-none focus:border-[#00695C] focus:ring-2 focus:ring-[#00695C]/20 transition-all duration-300">
              <option value={6}>6</option>
              <option value={9}>9</option>
              <option value={18}>18</option>
              <option value={30}>30</option>
            </select>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}
              className="w-9 h-9 rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 flex items-center justify-center text-[#1A2E2A] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110">
              <FiChevronLeft className="text-sm" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) pageNum = i + 1;
              else if (currentPage <= 3) pageNum = i + 1;
              else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = currentPage - 2 + i;
              return (
                <button key={pageNum} onClick={() => setCurrentPage(pageNum)}
                  className={`w-9 h-9 rounded-xl transition-all duration-300 text-sm font-medium hover:scale-110 ${
                    currentPage === pageNum
                      ? 'bg-gradient-to-r from-[#00695C] to-[#26A69A] text-white shadow-lg shadow-[#00695C]/30'
                      : 'text-[#1A2E2A] hover:bg-[#F5F9F8]'
                  }`}>
                  {pageNum}
                </button>
              );
            })}
            <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}
              className="w-9 h-9 rounded-xl hover:bg-[#F5F9F8] transition-all duration-300 flex items-center justify-center text-[#1A2E2A] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110">
              <FiChevronRight className="text-sm" />
            </button>
          </div>
        </div>
      )}

      <div className="pb-5"/>

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(50px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes float-delayed { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(10px); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-slide-in { animation: slide-in 0.4s ease-out forwards; opacity: 0; }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default AgentsVerification;