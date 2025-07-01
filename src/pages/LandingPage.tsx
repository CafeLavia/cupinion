import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import loveit from '../assets/loveit.png';
import great from '../assets/great.png';
import okay from '../assets/okay.png';
import poor from '../assets/poor.png';
import terribale from '../assets/terribale.png';
import badfeed from '../assets/badfeed.png';
import goodfeed from '../assets/goodfeed.png';
import google from '../assets/google.png';
import tripadvisor from '../assets/tripadvisor.png';
import whatsapp from '../assets/whatsapp.png';
import background2 from '../assets/background2.png';
import GOOD from '../assets/GOOD.png';
import favicon from '../assets/favicon.png';
import '../index.css';
import { FeedbackService } from '../services/feedbackService';
import imageCompression from 'browser-image-compression';
import { validateTable } from "../services/feedbackService";

// Add Google Fonts import
const fontStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Cherry+Swash:wght@400;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Quattrocento+Sans:wght@400;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Julius+Sans+One&display=swap');
`;

const FEEDBACK_OPTIONS = [
  { label: 'Love it', image: loveit },
  { label: 'Great', image: great },
  { label: 'Okay', image: okay },
  { label: 'Poor', image: poor },
  { label: 'Terrible', image: terribale },
];

const BAR_COLOR = '#20b2aa';
const BAR_BG = '#0e4747';
const THUMB_COLOR = '#20b2aa';
const SLIDER_THUMB_SIZE = 52;
const SLIDER_TRACK_WIDTH = 32;
const SLIDER_HEIGHT = 380;
const COLUMN_GAP = 56;

const GOOD_QUESTIONS = [
  'Food Quality',
  'Service',
  'Ambiance',
  'Value for Money',
  'Location',
];
const BAD_CATEGORIES = [
  'Food',
  'Wait Time',
  'Staff',
  'Value',
  'Environment',
];

// Update color map for solid fill colors (green at bottom, red at top)
const FILL_COLORS = [
  '#16a34a', // Love it - green (bottom)
  '#0e7490', // Great - teal blue
  '#eab308', // Okay - gold
  '#ea580c', // Poor - deep orange
  '#dc2626', // Terrible - red (top)
];

// Add email validation helper
const isValidEmail = (email: string | undefined) => {
  if (!email) return false;
  const trimmed = email.trim();
  // Improved regex: must have @, a domain, and a valid TLD
  return /^[^@\s]+@[^@\s]+\.[a-zA-Z]{2,}$/.test(trimmed);
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const FEEDBACK_COOLDOWN = 10 * 1000; // 5 minute in ms

const LandingPage: React.FC = () => {
  const [step, setStep] = useState(0); // 0: initial, 1: good, 2: bad, 3: thank you (good), 4: thank you (bad)
  const [selected, setSelected] = useState(2); // Default to 'Okay'
  const [direction, setDirection] = useState<'left' | 'right'>('left');
  const [animating, setAnimating] = useState(false);
  const [autoScrollDone, setAutoScrollDone] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [goodFeedback, setGoodFeedback] = useState('');
  const [badFeedbackText, setBadFeedbackText] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [billFile, setBillFile] = useState<File | null>(null);
  const [tableNumber, setTableNumber] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedFeedback, setSubmittedFeedback] = useState<any>(null);
  const [offerPercentage, setOfferPercentage] = useState<number>(0);

  const [searchParams] = useSearchParams();
  const query = useQuery();
  const [isValid, setIsValid] = useState<null | boolean>(null);
  const table = query.get("table");

  // Add a state to track cooldown
  const [isCooldown, setIsCooldown] = useState(false);
  const [showCooldownMsg, setShowCooldownMsg] = useState(false);

  // Add a state to track scroll lock
  const [isScrollUnlocked, setIsScrollUnlocked] = useState(false);

  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const [isOverflow, setIsOverflow] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [showBillToast, setShowBillToast] = useState(false);

  const billInputRef = useRef<HTMLInputElement | null>(null);

  const progressBarRef = useRef<HTMLDivElement | null>(null);

  const [emailTouched, setEmailTouched] = useState(false);
  const [badFeedbackTouched, setBadFeedbackTouched] = useState(false);

  const showBillRequiredLabel = step === 2;

  useEffect(() => {
    if (!table) {
      setIsValid(false);
      return;
    }
    validateTable(table).then(setIsValid);
  }, [table]);

  useEffect(() => {
    if (table && !isNaN(parseInt(table, 10))) {
      setTableNumber(parseInt(table, 10));
    }
  }, [table]);

  useEffect(() => {
    const lastFeedback = localStorage.getItem('feedback_submitted');
    if (lastFeedback) {
      const elapsed = Date.now() - parseInt(lastFeedback, 10);
      if (elapsed < FEEDBACK_COOLDOWN) {
        setIsCooldown(true);
      }
    }
  }, []);

  // Bill is required only for bad feedback (step 2)
  const isBillUploadRequired = step === 2;

  // Fill is scaled to be 5% at minimum (Terrible) and 100% at maximum (Love it)
  const basePercent = (FEEDBACK_OPTIONS.length - 1 - selected) / (FEEDBACK_OPTIONS.length - 1);
  const fillPercent = 5 + basePercent * 95;

  // Auto-animate slider on mount
  useEffect(() => {
    if (step === 0 && !autoScrollDone) {
      let up = 0;
      let down = FEEDBACK_OPTIONS.length - 1;
      setSelected(down);
      setTimeout(() => {
        setSelected(up);
        setTimeout(() => {
          setSelected(2); // Return to default
          setAutoScrollDone(true);
        }, 600);
      }, 600);
    }
  }, [step, autoScrollDone]);

  const handleInteractionUpdate = (clientY: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const y = clientY - rect.top;
    const percent = Math.max(0, Math.min(1, y / rect.height));
    const newIndex = Math.round(percent * (FEEDBACK_OPTIONS.length - 1));
    setSelected(newIndex);
  };

  const handleInteractionStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    // Prevent default behavior like text selection during drag
    e.preventDefault();

    const moveHandler = (moveEvent: MouseEvent | TouchEvent) => {
      const clientY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;
      handleInteractionUpdate(clientY);
    };

    const endHandler = () => {
      window.removeEventListener('mousemove', moveHandler as any);
      window.removeEventListener('mouseup', endHandler);
      window.removeEventListener('touchmove', moveHandler as any);
      window.removeEventListener('touchend', endHandler);
    };

    window.addEventListener('mousemove', moveHandler as any);
    window.addEventListener('mouseup', endHandler);
    window.addEventListener('touchmove', moveHandler as any);
    window.addEventListener('touchend', endHandler);

    // Set initial value on click/touch
    const startClientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    handleInteractionUpdate(startClientY);
  };

  // Animation helpers
  const goToStep = (nextStep: number, dir: 'left' | 'right') => {
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setStep(nextStep);
      setAnimating(false);
    }, 500); // match CSS duration
  };

  // Handlers
  const handleNext = () => {
    if (selected === 0) {
      // If 'Love it' is selected, submit feedback immediately and go to thank you page
      handleGoodSubmit();
    } else if (selected >= 3) {
      goToStep(2, 'left'); // Bad feedback
    } else {
      goToStep(1, 'left'); // Good feedback
    }
  };
  const handleBack = () => {
    if (step === 3) {
      goToStep(1, 'right');
    } else if (step === 4) {
      goToStep(2, 'right');
    } else {
      goToStep(0, 'right');
    }
  };

  const handleGoodSubmit = async () => {
    if (isCooldown) {
      setShowCooldownMsg(true);
      setTimeout(() => setShowCooldownMsg(false), 2500);
      return;
    }
    if (isBillUploadRequired && !billFile) {
      setError('Please upload a bill to proceed.');
      return;
    }
    setError(null);
    setSubmitting(true);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1500);

    try {
      let compressedFile = billFile;
      if (billFile) {
        compressedFile = await imageCompression(billFile, {
          maxSizeMB: 0.25,
          maxWidthOrHeight: 1200,
          useWebWorker: true,
        });
      }
      const feedback = await FeedbackService.submitFeedback({
        table_number: tableNumber,
        rating: FEEDBACK_OPTIONS[selected].label,
        customer_email: email || undefined,
        details: { notes: goodFeedback },
        billFile: compressedFile,
      });
      setSubmittedFeedback(feedback);
      const percent = await FeedbackService.fetchOfferPercentage(feedback.rating);
      setOfferPercentage(percent);
      goToStep(3, 'left');
      localStorage.setItem('feedback_submitted', Date.now().toString());
      setIsCooldown(true);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBadSubmit = async () => {
    if (isCooldown) {
      setShowCooldownMsg(true);
      setTimeout(() => setShowCooldownMsg(false), 2500);
      return;
    }
    if (isBillUploadRequired && !billFile) {
      setShowBillToast(true);
      setTimeout(() => setShowBillToast(false), 1500);
      return;
    }
    setError(null);
    setSubmitting(true);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1500);

    try {
      let compressedFile = billFile;
      if (billFile) {
        compressedFile = await imageCompression(billFile, {
          maxSizeMB: 0.25,
          maxWidthOrHeight: 1200,
          useWebWorker: true,
        });
      }
      const feedback = await FeedbackService.submitFeedback({
        table_number: tableNumber,
        rating: FEEDBACK_OPTIONS[selected].label,
        customer_email: email || undefined,
        details: {
          categories: selectedCategories,
          notes: badFeedbackText,
        },
        billFile: compressedFile,
      });
      setSubmittedFeedback(feedback);
      const percent = await FeedbackService.fetchOfferPercentage(feedback.rating);
      setOfferPercentage(percent);
      goToStep(4, 'left');
      localStorage.setItem('feedback_submitted', Date.now().toString());
      setIsCooldown(true);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  // Content slide: next content slides in from the right
  const contentSlide = {
    transform: 'translateX(0)',
    opacity: animating ? 0 : 1,
    transition: 'opacity 0.5s ease-in-out',
  };

  // Render content for each step
  let content = null;
  if (step === 0) {
    content = (
      <>
        <h2 className="text-white text-center font-normal z-10" style={{ fontFamily: "'Julius Sans One', sans-serif", fontSize: 'clamp(1.3rem, 6vw, 3.5rem)', marginBottom: 'clamp(1.2rem, 6vw, 3.5rem)' }}>How was your Experience?</h2>
        <div className="flex flex-col justify-center items-center w-full z-10" style={{ minHeight: 0 }}>
          <div className="flex flex-row justify-center items-center mx-auto" style={{height: 'clamp(260px, 48vh, 600px)', gap: 'clamp(24px, 10vw, 96px)', alignItems: 'flex-start', width: '100%', maxWidth: '38rem'}}>
            {/* Labels */}
            <div className="flex flex-col justify-between h-full items-center pr-3" style={{minHeight: 'clamp(200px, 40vh, 540px)', height: 'clamp(200px, 40vh, 540px)', flex: 1}}>
              {FEEDBACK_OPTIONS.map((option, idx) => (
                <div
                  key={option.label + '-label'}
                  className={`text-white text-center transition-all duration-300 ${selected === idx ? 'scale-125 opacity-100 font-bold' : 'opacity-60 font-normal'} hover:opacity-100 hover:scale-110`}
                  style={{ fontSize: 'clamp(1rem, 4vw, 2.2rem)', minHeight: 'clamp(40px, 7vw, 90px)', display: 'flex', alignItems: 'center', height: 'clamp(40px, 7vw, 90px)', fontFamily: "'Quattrocento Sans', sans-serif", cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => setSelected(idx)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Select ${option.label}`}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setSelected(idx); }}
                >
                  {option.label}
                </div>
              ))}
            </div>
            {/* Slider bar */}
            <div
              ref={sliderRef}
              className="relative flex flex-col items-center justify-between px-2 select-none"
              style={{
                height: 'clamp(200px, 40vh, 540px)',
                minHeight: 'clamp(200px, 40vh, 540px)',
                minWidth: 'clamp(32px, 10vw, 96px)',
                width: 'clamp(32px, 10vw, 96px)',
                justifyContent: 'space-between',
                cursor: 'pointer',
                overflow: 'hidden',
                borderRadius: 24,
              }}
              onMouseDown={handleInteractionStart}
              onTouchStart={handleInteractionStart}
            >
              {/* Gradient background */}
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  width: 'clamp(32px, 10vw, 96px)',
                  height: '100%',
                  background: 'linear-gradient(to bottom, #16a34a 0%, #eab308 50%, #dc2626 100%)',
                  transform: 'translateX(-50%)',
                  zIndex: 1,
                  pointerEvents: 'none',
                }}
              />
              {/* Gray overlay */}
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  width: 'clamp(32px, 10vw, 96px)',
                  height: `${100 - fillPercent}%`,
                  background: '#78717c',
                  opacity: 0.85,
                  transform: 'translateX(-50%)',
                  zIndex: 2,
                  transition: 'height 0.2s',
                  pointerEvents: 'none',
                }}
              />
              {/* White line at the top of the filled area (thicker, fits slider) */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  width: '100%',
                  height: 8,
                  background: '#fff',
                  borderRadius: 2,
                  zIndex: 3,
                  top: `${100 - fillPercent}%`,
                  transition: 'top 0.2s',
                  pointerEvents: 'none',
                }}
              />
            </div>
            {/* Emojis */}
            <div className="flex flex-col justify-between h-full items-center pl-3" style={{minHeight: 'clamp(200px, 40vh, 540px)', height: 'clamp(200px, 40vh, 540px)', flex: 1}}>
              {FEEDBACK_OPTIONS.map((option, idx) => (
                <div
                  key={option.label + '-emoji'}
                  className="transition-all duration-300"
                  style={{ 
                    minHeight: 'clamp(40px, 7vw, 90px)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    height: 'clamp(40px, 7vw, 90px)',
                    position: 'relative',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                  onClick={() => setSelected(idx)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Select ${option.label}`}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setSelected(idx); }}
                >
                  <img 
                    src={option.image} 
                    alt={option.label}
                    className={`transition-all duration-300 ${selected === idx ? 'scale-125 opacity-100' : 'opacity-40 grayscale hover:scale-125 hover:opacity-70'}`}
                    style={{
                      width: 'clamp(28px, 6vw, 70px)',
                      height: 'clamp(28px, 6vw, 70px)',
                      objectFit: 'contain',
                      pointerEvents: 'none', // so the div handles the click
                    }}
                  />
                  {selected !== idx && (
                    <div 
                      className="absolute left-0 top-0 w-full h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300"
                      style={{
                        transform: 'translateX(12px)'
                      }}
                    >
                      <span className="text-white font-medium bg-black/50 rounded" style={{ fontSize: 'clamp(1rem, 4vw, 2.2rem)', padding: '0.2em 0.7em', fontFamily: "'Quattrocento Sans', sans-serif" }}>
                        {option.label}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* NEXT button immediately after slider, with small gap */}
          <div className="w-full flex flex-col items-center z-10" style={{ marginTop: 0, marginBottom: 0, padding: 0 }}>
            <button
              className="w-full max-w-[22rem] rounded-lg py-3 text-base font-semibold bg-teal-500 text-white shadow-md hover:bg-teal-600 transition-all"
              style={{ fontSize: '1.125rem' }}
              onClick={handleNext}
            >
              NEXT
            </button>
          </div>
        </div>
      </>
    );
  } else if (step === 1) {
    // Good feedback step
    const isOkayOrGreat = selected === 1 || selected === 2;
    const emailInvalid = !isValidEmail(email) && emailTouched;
    content = (
      <div className="w-full max-w-sm z-10 flex flex-col gap-3 items-center px-2 sm:px-4">
        <h2 className="text-white text-center font-normal z-10 mb-6" style={{ fontFamily: "'Julius Sans One', sans-serif", fontSize: 'clamp(1.5rem, 6vw, 3.5rem)' }}>
          {isOkayOrGreat ? 'We Value Your Opinion' : 'Want to hear from us\nabout new offers?'}
        </h2>
        <div className="w-full max-w-[22rem] flex flex-col gap-1 mx-auto">
          {/* Email field only for Love it */}
          {!isOkayOrGreat && (
            <div className="w-full">
              <label className="block text-white text-xs sm:text-sm mb-1 font-semibold text-left" style={{ fontFamily: "'Quattrocento Sans', sans-serif" }}>
                Email Address <span style={{ color: '#ef4444', fontSize: '1.1em', fontWeight: 'bold' }}>*</span>
              </label>
              <div className="relative">
                <input 
                  type="email" 
                  className={`w-full max-w-[22rem] rounded-lg p-3 text-base text-gray-900 bg-white ${emailInvalid ? 'border-2 border-red-500' : 'border border-gray-300'} focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition`} 
                  placeholder="Enter your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onBlur={() => setEmailTouched(true)}
                  required
                />
              </div>
            </div>
          )}
          {/* Textarea for improvement feedback (no label for Okay/Great) */}
          <div className="w-full">
            {!isOkayOrGreat && (
              <label className="block text-white text-xs sm:text-sm mb-1 font-semibold text-left" style={{ fontFamily: "'Quattrocento Sans', sans-serif" }}>Tell us what you enjoyed most!</label>
            )}
            <textarea 
              className="w-full max-w-[22rem] rounded-lg p-3 text-base text-gray-900 bg-white border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition" 
              placeholder={isOkayOrGreat ? 'Tell us how can we improve?' : 'Type your feedback here...'} 
              rows={3} 
              style={{ resize: 'none' }}
              value={goodFeedback}
              onChange={e => setGoodFeedback(e.target.value)}
            />
          </div>
          {/* Bill Upload with remove option */}
          <div
            className="w-full max-w-[22rem] border-2 border-dashed border-white/40 rounded-lg p-2 sm:p-4 flex flex-col items-center justify-center text-xs sm:text-sm cursor-pointer hover:bg-white/10 transition-all min-h-[64px]"
            style={{ minHeight: 64, position: 'relative' }}
            onClick={() => !billFile && billInputRef.current && billInputRef.current.click()}
          >
            {billFile && (
              <button
                type="button"
                aria-label="Remove uploaded bill"
                onClick={e => {
                  e.stopPropagation();
                  setBillFile(null);
                  if (billInputRef.current) billInputRef.current.value = '';
                }}
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  background: 'rgba(255,255,255,0.22)',
                  border: '1.5px solid #fff',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                  transition: 'background 0.18s',
                  padding: 0,
                  zIndex: 10,
                }}
                onMouseOver={e => (e.currentTarget.style.background = 'rgba(20,184,166,0.85)')}
                onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.22)')}
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{display: 'block'}}>
                  <line x1="4.22" y1="4.22" x2="11.78" y2="11.78" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="11.78" y1="4.22" x2="4.22" y2="11.78" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            )}
            {billFile ? (
              <div className="flex flex-col items-center justify-center w-full relative">
                <span className="text-green-400 text-2xl mb-1">✔️</span>
                <span className="text-white text-xs truncate w-full text-center">{billFile.name}</span>
              </div>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-teal-300 font-semibold mt-1">Click to upload your Bill</span>
                <span className="text-white/60 text-xs mt-1">
                  JPG, JPEG, PNG {showBillRequiredLabel && <span className="text-amber-400 font-bold ml-1">(Required)</span>}
                </span>
              </>
            )}
            <input
              type="file"
              id="bill-upload-input"
              className="hidden"
              accept=".jpg,.jpeg,.png"
              ref={billInputRef}
              onChange={e => setBillFile(e.target.files ? e.target.files[0] : null)}
            />
          </div>
        </div>
        <div className="w-full flex-shrink-0 flex flex-col items-center z-10" style={{ marginTop: 'clamp(0.7rem, 2vw, 1.2rem)', marginBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))', position: 'sticky', bottom: 0, maxWidth: '36rem' }}>
          <button
            className="w-full max-w-[22rem] rounded-lg py-3 text-base font-semibold bg-teal-500 text-white shadow-md hover:bg-teal-600 transition-all"
            style={{ fontSize: '1.125rem' }}
            onClick={handleGoodSubmit}
          >
            SUBMIT
          </button>
        </div>
      </div>
    );
  } else if (step === 2) {
    // Bad feedback step
    const emailInvalid = !isValidEmail(email) && emailTouched;
    const badFeedbackInvalid = badFeedbackTouched && badFeedbackText.trim() === '';
    const handleCategoryClick = (category: string) => {
      setSelectedCategories(prev =>
        prev.includes(category)
          ? prev.filter(c => c !== category)
          : [...prev, category]
      );
    };

    const isBadSubmitDisabled =
      email.trim() === '' || !isValidEmail(email) ||
      badFeedbackText.trim() === '' || badFeedbackInvalid;

    content = (
      <div className="w-full max-w-sm z-10 flex flex-col gap-3 items-center px-2 sm:px-4">
        <h2 className="text-white text-center font-normal z-10 mb-2" style={{ fontFamily: "'Julius Sans One', sans-serif", fontSize: 'clamp(1.5rem, 6vw, 3.5rem)' }}>
        Help Us Do Better Next Time?
        </h2>
        <div className="w-full max-w-[22rem] flex flex-col gap-1 mx-auto">
          {/* Category Selection */}
          <div className="w-full flex flex-wrap justify-center gap-1 mt-0 mb-1">
            {BAD_CATEGORIES.map(category => {
              const isSelected = selectedCategories.includes(category);
              return (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`flex items-center justify-center px-2.5 py-0.5 rounded-full border-2 transition-all duration-200 text-xs font-semibold ${
                    isSelected
                      ? 'bg-teal-400 border-teal-400 text-black'
                      : 'bg-transparent border-white/50 text-white/80 hover:bg-white/10'
                  }`}
                >
                  {isSelected && (
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  )}
                  {category}
                </button>
              );
            })}
          </div>
          {/* Email Input */}
          <div className="w-full">
            <label className="block text-white text-xs sm:text-sm mb-1 font-semibold text-left" style={{ fontFamily: "'Quattrocento Sans', sans-serif" }}>
              Email Address <span style={{ color: '#ef4444', fontSize: '1.1em', fontWeight: 'bold' }}>*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                className={`w-full max-w-[22rem] rounded-lg p-3 text-base text-gray-900 bg-white ${emailInvalid ? 'border-2 border-red-500' : 'border border-gray-300'} focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition`}
                placeholder="Enter your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onBlur={() => setEmailTouched(true)}
                required
              />
            </div>
          </div>
          {/* Additional Feedback */}
          <div className="w-full">
            <label className="block text-white text-xs sm:text-sm mb-1 font-semibold text-left" style={{ fontFamily: "'Quattrocento Sans', sans-serif" }}>
              Additional feedback <span style={{ color: '#ef4444', fontSize: '1.1em', fontWeight: 'bold' }}>*</span>
            </label>
            <textarea
              className={`w-full max-w-[22rem] rounded-lg p-3 text-base text-gray-900 bg-white ${badFeedbackInvalid ? 'border-2 border-red-500' : 'border border-gray-300'} focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition`}
              placeholder="Tell us how can we improve?"
              rows={2}
              style={{ resize: 'none' }}
              value={badFeedbackText}
              onChange={e => setBadFeedbackText(e.target.value)}
              onBlur={() => setBadFeedbackTouched(true)}
              required
            />
          </div>
          {/* Bill Upload with remove option */}
          <div
            className="w-full max-w-[22rem] border-2 border-dashed border-white/40 rounded-lg p-2 sm:p-4 flex flex-col items-center justify-center text-xs sm:text-sm cursor-pointer hover:bg-white/10 transition-all min-h-[64px]"
            style={{ minHeight: 64, position: 'relative' }}
            onClick={() => !billFile && billInputRef.current && billInputRef.current.click()}
          >
            {billFile && (
              <button
                type="button"
                aria-label="Remove uploaded bill"
                onClick={e => {
                  e.stopPropagation();
                  setBillFile(null);
                  if (billInputRef.current) billInputRef.current.value = '';
                }}
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  background: 'rgba(255,255,255,0.22)',
                  border: '1.5px solid #fff',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                  transition: 'background 0.18s',
                  padding: 0,
                  zIndex: 10,
                }}
                onMouseOver={e => (e.currentTarget.style.background = 'rgba(20,184,166,0.85)')}
                onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.22)')}
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{display: 'block'}}>
                  <line x1="4.22" y1="4.22" x2="11.78" y2="11.78" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="11.78" y1="4.22" x2="4.22" y2="11.78" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            )}
            {billFile ? (
              <div className="flex flex-col items-center justify-center w-full relative">
                <span className="text-green-400 text-2xl mb-1">✔️</span>
                <span className="text-white text-xs truncate w-full text-center">{billFile.name}</span>
              </div>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-teal-300 font-semibold mt-1">Click to upload your Bill</span>
                <span className="text-white/60 text-xs mt-1">
                  JPG, JPEG, PNG {showBillRequiredLabel && <span className="text-amber-400 font-bold ml-1">(Required)</span>}
                </span>
              </>
            )}
            <input
              type="file"
              id="bill-upload-input"
              className="hidden"
              accept=".jpg,.jpeg,.png"
              ref={billInputRef}
              onChange={e => setBillFile(e.target.files ? e.target.files[0] : null)}
            />
          </div>
        </div>
        <div className="w-full flex-shrink-0 flex flex-col items-center z-10" style={{ marginTop: 'auto', marginBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))', position: 'sticky', bottom: 0 }}>
          <button
            disabled={isBadSubmitDisabled}
            className="w-full max-w-[22rem] rounded-lg py-3 text-base font-semibold bg-teal-500 text-white shadow-md hover:bg-teal-600 transition-all"
            style={{ fontSize: '1.125rem' }}
            onClick={handleBadSubmit}
          >
            SUBMIT
          </button>
        </div>
      </div>
    );
  } else if (step === 3) {
    // Thank you page for good/okay/great feedback
    const customTimestamp = submittedFeedback?.created_at ? new Date(submittedFeedback.created_at).toLocaleString() : new Date().toLocaleString();
    const verificationUrl = submittedFeedback?.custom_id ? `${window.location.origin}/verify?fid=${submittedFeedback.custom_id}` : '';
    const rating = submittedFeedback?.rating;
    const isOkay = rating === 'Okay';
    const isGreatOrLoveIt = rating === 'Great' || rating === 'Love it';
    content = (
      <>
        <h2 className="text-white text-center font-normal z-10" style={{ fontFamily: "'Julius Sans One', sans-serif", fontSize: 'clamp(1.5rem, 6vw, 3.5rem)', marginBottom: 'clamp(1.2rem, 6vw, 3rem)' }}>
          Thanks a Latte for Your<br/>Awesome Feedback!
        </h2>

        <div className="w-full flex justify-center items-center my-6 z-10">
          <div className="relative flex items-center justify-center" style={{ width: 'clamp(9rem, 32vw, 18rem)', height: 'clamp(9rem, 32vw, 18rem)' }}>
            <img 
              src={goodfeed} 
              alt="Awesome feedback" 
              className="object-contain"
              style={{ width: 'clamp(7rem, 28vw, 14rem)', height: 'clamp(7rem, 28vw, 14rem)', filter: 'drop-shadow(0 0 1.5rem rgba(255, 223, 186, 0.5))' }}
            />
          </div>
        </div>

        <p className="text-white/80 text-center mb-2 sm:mb-6 mt-2 z-10" style={{ fontFamily: "'Julius Sans One', sans-serif", fontSize: 'clamp(1.1rem, 4vw, 2rem)' }}>
          Your feedback helps us serve you better every day.
        </p>

        {/* Conditional thank you actions */}
        {isOkay ? (
          // WhatsApp only for Okay
          <div className="w-full flex flex-col items-center gap-1 sm:gap-2 z-10 mt-8" style={{ marginTop: '2rem', marginBottom: '0.5rem', maxWidth: '24rem' }}>
            <a
              href="https://wa.me/+94702557567"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full max-w-[22rem] rounded-lg py-3 text-base font-semibold flex items-center justify-center gap-2 shadow-md"
              style={{ background: '#64B161', color: '#000', fontSize: '1.125rem' }}
            >
              <img src={whatsapp} alt="WhatsApp logo" className="w-7 h-7" />
              Chat with us on Whatsapp
            </a>
          </div>
        ) : isGreatOrLoveIt ? (
          // Google and TripAdvisor review for Great/Love it
          <div className="w-full flex flex-col items-center gap-1 sm:gap-2 z-10" style={{ marginTop: '0', marginBottom: '0.75rem', maxWidth: '20rem' }}>
            <a
              href="https://www.google.com/search?sca_esv=94c780ffd014c36e&q=cafe+lavia&si=AMgyJEtREmoPL4P1I5IDCfuA8gybfVI2d5Uj7QMwYCZHKDZ-EytgvNq2kHIZiVks2Zk8AOok-XY2dVJmbYV1UwSppDWOC4McqlRaMH3yfL7PoWUFqezt2WAcyMM8LRgpi1MEIp0N6kNr&sa=X&ved=2ahUKEwizh_S9-5uOAxV21DgGHdU4EggQrrQLegQIGxAA#lrd=0x3ae3672324d49ce3:0x9399d4fec283ff7f,1,,"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full max-w-[22rem] rounded-lg py-3 text-base font-semibold flex items-center justify-center gap-2 shadow-md"
              style={{ background: '#fff', color: '#222', fontSize: '1.125rem' }}
            >
              <img src={google} alt="Google" className="w-5 h-5" />
              Review us on Google
            </a>
            <a
              href="https://www.tripadvisor.com/UserReviewEdit-g304138-d25416219-Cafe_Lavia-Kandy_Kandy_District_Central_Province.html"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full max-w-[22rem] rounded-lg py-3 text-base font-semibold flex items-center justify-center gap-2 shadow-md"
              style={{ background: '#01ae87', color: '#000', fontSize: '1.125rem' }}
            >
              <img src={tripadvisor} alt="TripAdvisor" className="w-5 h-5" />
              Review us on TripAdvisor
            </a>
          </div>
        ) : null}
      </>
    );
  } else if (step === 4) {
    // Thank you page for bad feedback (match good thank you page)
    const customTimestamp = submittedFeedback?.created_at ? new Date(submittedFeedback.created_at).toLocaleString() : new Date().toLocaleString();
    const verificationUrl = submittedFeedback?.custom_id ? `${window.location.origin}/verify?fid=${submittedFeedback.custom_id}` : '';
    content = (
      <>
        <h2 className="text-white text-center font-normal z-10" style={{ fontFamily: "'Julius Sans One', sans-serif", fontSize: 'clamp(1.5rem, 6vw, 3.5rem)', marginBottom: 'clamp(1.2rem, 6vw, 3rem)' }}>
          Thanks for Helping Us<br/>Brew a Better Experience!
        </h2>

        <div className="w-full flex justify-center items-center my-6 z-10">
          <div className="relative flex items-center justify-center" style={{ width: 'clamp(9rem, 32vw, 18rem)', height: 'clamp(9rem, 32vw, 18rem)' }}>
            <img 
              src={badfeed} 
              alt="Bad feedback" 
              className="object-contain"
              style={{ width: 'clamp(7rem, 28vw, 14rem)', height: 'clamp(7rem, 28vw, 14rem)', filter: 'drop-shadow(0 0 1.5rem rgba(255, 223, 186, 0.5))' }}
            />
          </div>
        </div>

        <p className="text-white/80 text-center mb-2 sm:mb-6 mt-2 z-10" style={{ fontFamily: "'Julius Sans One', sans-serif", fontSize: 'clamp(1.1rem, 4vw, 2rem)' }}>
          Thank you for sharing – we'll use<br/>this to improve your next visit.
        </p>

        <div className="w-full flex flex-col items-center gap-1 sm:gap-2 z-10 mt-8" style={{ marginTop: '2rem', marginBottom: '0.5rem', maxWidth: '24rem' }}>
          <a
            href="https://wa.me/+94702557567"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full max-w-[22rem] rounded-lg py-3 text-base font-semibold flex items-center justify-center gap-2 shadow-md"
            style={{ background: '#64B161', color: '#000', fontSize: '1.125rem' }}
          >
            <img src={whatsapp} alt="WhatsApp logo" className="w-7 h-7" />
            Chat with us on Whatsapp
          </a>
        </div>
      </>
    );
  }

  const getProgressBarWidth = () => {
    switch (step) {
      case 0:
        return '25%';
      case 1:
      case 2:
        return '50%';
      case 3:
      case 4:
        return '100%';
      default:
        return '25%';
    }
  };

  // Helper to get progress as a number (0-1)
  const getProgressFraction = () => {
    switch (step) {
      case 0:
        return 0.25;
      case 1:
      case 2:
        return 0.5;
      case 3:
      case 4:
        return 1;
      default:
        return 0.25;
    }
  };

  // Add error display to your form steps
  const renderError = () => {
    if (!error) return null;
    return (
      <div className="text-red-500 bg-red-100 p-3 rounded-md my-4 text-center">
        {error}
      </div>
    );
  };

  // Lock vertical scroll on mount, restore on unmount
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Dynamic viewport height fix for mobile browsers
    function setVh() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    setVh();
    window.addEventListener('resize', setVh);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('resize', setVh);
    };
  }, []);

  useEffect(() => {
    function checkOverflow() {
      if (contentWrapperRef.current) {
        setIsOverflow(contentWrapperRef.current.scrollHeight > window.innerHeight);
      }
    }
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, []);

  useEffect(() => {
    // Inject Cherry Swash and Quattrocento Sans fonts if not already present
    if (!document.getElementById('julius-sans-font')) {
      const style = document.createElement('style');
      style.id = 'julius-sans-font';
      style.innerText = `
        @import url('https://fonts.googleapis.com/css2?family=Cherry+Swash:wght@400;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Quattrocento+Sans:wght@400;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Julius+Sans+One&display=swap');
      `;
      document.head.appendChild(style);
    }
  }, []);

  if (isValid === null) return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50" style={{background: 'linear-gradient(to bottom, #186863 0%, #084040 50%, #011217 100%)'}}>
      <div className="flex flex-col items-center">
        <svg className="animate-spin h-8 w-8 text-teal-500 mb-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        <span className="text-lg text-white font-semibold">Validating QR code...</span>
      </div>
    </div>
  );
  if (isValid === false) return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50" style={{background: 'linear-gradient(to bottom, #186863 0%, #084040 50%, #011217 100%)'}}>
      <div className="bg-white rounded-xl shadow-lg p-6 px-4 sm:px-6 flex flex-col items-center max-w-xs w-full border border-gray-200">
        <img src={favicon} alt="Cafe LaVia Favicon" className="w-32 h-32 mb-4" />
        <div className="flex items-center mb-2">
          <svg className="w-6 h-6 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xl font-semibold text-gray-800">Access Denied</span>
        </div>
        <p className="text-gray-600 text-center mb-2">Invalid or inactive table QR.</p>
        <p className="text-gray-500 text-center">Please scan the QR code on your table to access feedback.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-gradient-to-b from-[#186863] via-[#084040] to-[#011217] overflow-hidden">
      {/* Watermark and background images */}
      <img
        src={logo}
        alt="Cafe LaVia watermark"
        className="pointer-events-none select-none"
        style={{
          position: 'fixed',
          left: step === 0 ? '0%' : '-100%',
          right: 'auto',
          top: '50%',
          width: '171vw',
          height: 'auto',
          opacity: (step === 3 || step === 4) ? 0 : 0.13,
          zIndex: 0,
          objectFit: 'contain',
          objectPosition: step !== 0 ? 'right center' : 'left center',
          transform: 'translateY(-50%)',
          maxWidth: 'none',
          transition: 'left 0.8s cubic-bezier(.77,0,.18,1), right 0.8s cubic-bezier(.77,0,.18,1), object-position 0.8s cubic-bezier(.77,0,.18,1), opacity 0.5s ease-in-out',
        }}
      />
      <img
        src={background2}
        alt="Thank you background"
        className="pointer-events-none select-none"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          opacity: (step === 3 || step === 4) ? 0.07 : 0,
          zIndex: 0,
          transition: 'opacity 0.8s ease-in-out',
        }}
      />
      {/* Main content wrapper: center on desktop, natural flow on mobile */}
      <div
        ref={contentWrapperRef}
        className="flex-1 flex flex-col items-center justify-between w-full max-w-lg mx-auto px-2 sm:px-4 py-2 relative z-10 overflow-hidden"
        style={{ minHeight: '100dvh', paddingTop: '0.30rem' }}
      >
        {/* Progress bar, logo, etc. */}
        <div className="w-full flex flex-col items-center mt-8 mb-2">
          <div className="w-full max-w-lg flex justify-center items-center relative mb-4 px-4">
            {step !== 0 && step !== 3 && step !== 4 && (
              <button
                onClick={handleBack}
                className="absolute left-4 p-2"
                style={{ top: '50%', transform: 'translateY(-50%)', zIndex: 20 }}
              >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M20 24L12 16L20 8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
            <div
              className="w-20 sm:w-28 md:w-36 h-1 rounded-full flex overflow-hidden" style={{ background: BAR_BG, position: 'relative' }} ref={progressBarRef}>
              <div style={{ width: getProgressBarWidth(), background: BAR_COLOR, height: '100%', transition: 'width 0.5s ease-in-out', position: 'relative' }} />
            </div>
          </div>
          <img src={logo} alt="Cafe LaVia logo" className="object-contain mb-4" style={{ height: '8rem', maxHeight: '25vw', minHeight: '5rem', width: 'auto' }} />
        </div>
        {/* Content: slides left/right */}
        <div className="w-full flex flex-col items-center relative max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto flex-1" style={{...contentSlide}}>
          {content}
        </div>
      </div>
      {/* Custom slider styles and responsive tweaks */}
      <style>{`
        .watermark-img {
          width: 540vw !important;
        }
        @media (min-width: 600px) {
          .watermark-img {
            width: 198vw !important;
          }
        }
        @media (max-width: 600px) {
          .watermark-img {
            width: 315vw !important;
          }
        }
        input[type='range'].custom-vertical-slider {
          -webkit-appearance: slider-vertical;
          appearance: none;
          width: 22px;
          height: 380px;
          background: ${BAR_BG};
          border-radius: 999px;
          margin: 0;
          padding: 0;
          position: relative;
          display: block;
        }
        @media (max-width: 600px) {
          input[type='range'].custom-vertical-slider {
            width: 16px;
            height: 260px;
          }
        }
        input[type='range'].custom-vertical-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 1px;
          height: 1px;
          background: transparent;
          border: none;
          box-shadow: none;
          cursor: pointer;
        }
        input[type='range'].custom-vertical-slider::-webkit-slider-thumb:hover {
          transform: none;
        }
        input[type='range'].custom-vertical-slider::-webkit-slider-runnable-track {
          width: 100%;
          height: 100%;
          background: transparent;
          border-radius: 999px;
        }
        input[type='range'].custom-vertical-slider:focus {
          outline: none;
        }
        input[type='range'].custom-vertical-slider::-moz-range-thumb {
          width: 1px;
          height: 1px;
          background: transparent;
          border: none;
          box-shadow: none;
          cursor: pointer;
        }
        input[type='range'].custom-vertical-slider::-moz-range-thumb:hover {
          transform: none;
        }
        input[type='range'].custom-vertical-slider::-moz-range-track {
          width: 100%;
          height: 100%;
          background: transparent;
          border-radius: 999px;
        }
        input[type='range'].custom-vertical-slider::-ms-thumb {
          width: 1px;
          height: 1px;
          background: transparent;
          border: none;
          box-shadow: none;
          cursor: pointer;
        }
        input[type='range'].custom-vertical-slider::-ms-thumb:hover {
          transform: none;
        }
        input[type='range'].custom-vertical-slider::-ms-fill-lower,
        input[type='range'].custom-vertical-slider::-ms-fill-upper {
          background: transparent;
          border-radius: 999px;
        }
        input[type='range'].custom-vertical-slider:focus::-ms-fill-lower,
        input[type='range'].custom-vertical-slider:focus::-ms-fill-upper {
          background: transparent;
        }
      `}</style>
      {showCooldownMsg && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.4)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: '#f87171',
            color: 'white',
            padding: '1.5rem 2rem',
            borderRadius: '1rem',
            fontSize: '1.1rem',
            fontWeight: 500,
            boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
            textAlign: 'center',
            maxWidth: 320
          }}>
            You have already submitted feedback.<br />
          </div>
        </div>
      )}
      {showToast && (
        <div style={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#14b8a6',
          color: 'white',
          padding: '0.6rem 1.2rem',
          borderRadius: '1.2rem',
          fontSize: '0.88rem',
          fontWeight: 600,
          boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
          zIndex: 2000,
          pointerEvents: 'none',
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}>
          Feedback Submitted!
        </div>
      )}
      {showBillToast && (
        <div style={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#ef4444',
          color: 'white',
          padding: '0.6rem 1.2rem',
          borderRadius: '1.2rem',
          fontSize: '0.88rem',
          fontWeight: 600,
          boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
          zIndex: 2100,
          pointerEvents: 'none',
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}>
          Bill not uploaded. Please upload the bill.
        </div>
      )}
    </div>
  );
};

export default LandingPage;
