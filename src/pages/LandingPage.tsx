import React, { useState, useEffect, useRef } from 'react';
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
import '../index.css';

// Add Google Fonts import
const fontStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Cherry+Swash:wght@400;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Quattrocento+Sans:wght@400;700&display=swap');
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
  'Delivery Time',
  'Environment',
  'Staff',
  'Cleanliness',
];

// Update color map for solid fill colors (green at bottom, red at top)
const FILL_COLORS = [
  '#16a34a', // Love it - green (bottom)
  '#0e7490', // Great - teal blue
  '#eab308', // Okay - gold
  '#ea580c', // Poor - deep orange
  '#dc2626', // Terrible - red (top)
];

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

  const isBillUploadRequired = email.trim() !== '';

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
    if (selected >= 3) {
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

  const handleGoodSubmit = () => {
    // Here you would typically handle form submission
    // For example, send data to a server
    console.log({
      email,
      goodFeedback,
      billFile
    });
    // Then proceed to the thank you page
    goToStep(3, 'left');
  };

  const handleBadSubmit = () => {
    // Here you would typically handle form submission
    // For example, send data to a server
    console.log({
      email,
      selectedCategories,
      badFeedbackText,
      billFile
    });
    // Then proceed to the thank you page
    goToStep(4, 'left');
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
        <h2 className="text-white text-2xl text-center mb-8 font-normal z-10" style={{ fontFamily: "'Cherry Swash', cursive" }}>How was your Experience?</h2>
        <div className="flex flex-1 flex-col justify-center items-center w-full z-10" style={{ minHeight: 360 }}>
          <div className="flex flex-row justify-center items-center mx-auto" style={{height: SLIDER_HEIGHT + 60, gap: COLUMN_GAP, alignItems: 'flex-start', width: '90%', maxWidth: '32rem'}}>
            {/* Labels */}
            <div className="flex flex-col justify-between h-full items-center pr-2" style={{minHeight: SLIDER_HEIGHT, height: SLIDER_HEIGHT, flex: 1}}>
              {FEEDBACK_OPTIONS.map((option, idx) => (
                <span
                  key={option.label}
                  className={`text-white text-xl text-center transition-all duration-300 ${selected === idx ? 'scale-105 opacity-100 font-bold' : 'opacity-60 font-normal'} hover:opacity-100 hover:scale-110`}
                  style={{ minHeight: 52, display: 'flex', alignItems: 'center', height: 52, fontFamily: "'Quattrocento Sans', sans-serif" }}
                >
                  {option.label}
                </span>
              ))}
            </div>
            {/* Completely custom slider bar, two stacked divs for fill and unfilled (solid color and gray) */}
            <div
              ref={sliderRef}
              className="relative flex flex-col items-center justify-between px-3 select-none"
              style={{
                height: SLIDER_HEIGHT,
                minHeight: SLIDER_HEIGHT,
                minWidth: SLIDER_TRACK_WIDTH,
                justifyContent: 'space-between',
                cursor: 'pointer',
                overflow: 'hidden',
                borderRadius: 16,
              }}
              onMouseDown={handleInteractionStart}
              onTouchStart={handleInteractionStart}
            >
              {/* Gradient background: always full height */}
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  width: SLIDER_TRACK_WIDTH,
                  height: '100%',
                  background: 'linear-gradient(to bottom, #16a34a 0%, #eab308 50%, #dc2626 100%)',
                  transform: 'translateX(-50%)',
                  zIndex: 1,
                  pointerEvents: 'none',
                }}
              />
              {/* Gray overlay: covers unfilled portion from the top */}
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  width: SLIDER_TRACK_WIDTH,
                  height: `${100 - fillPercent}%`,
                  background: '#78717c',
                  opacity: 0.85,
                  transform: 'translateX(-50%)',
                  zIndex: 2,
                  transition: 'height 0.2s',
                  pointerEvents: 'none',
                }}
              />
            </div>
            {/* Emojis */}
            <div className="flex flex-col justify-between h-full items-center pl-2" style={{minHeight: SLIDER_HEIGHT, height: SLIDER_HEIGHT, flex: 1}}>
              {FEEDBACK_OPTIONS.map((option, idx) => (
                <div
                  key={option.label}
                  className="transition-all duration-300"
                  style={{ 
                    minHeight: 52, 
                    display: 'flex', 
                    alignItems: 'center', 
                    height: 52,
                    position: 'relative'
                  }}
                >
                  <img 
                    src={option.image} 
                    alt={option.label}
                    className={`transition-all duration-300 ${selected === idx ? 'scale-125 opacity-100' : 'opacity-40 grayscale hover:scale-150 hover:opacity-70'}`}
                    style={{
                      width: '40px',
                      height: '40px',
                      objectFit: 'contain'
                    }}
                  />
                  {selected !== idx && (
                    <div 
                      className="absolute left-0 top-0 w-full h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300"
                      style={{
                        transform: 'translateX(15px)'
                      }}
                    >
                      <span className="text-white text-base font-medium bg-black/50 px-3 py-1.5 rounded">
                        {option.label}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col items-center z-10" style={{ marginTop: 'auto', marginBottom: '4rem' }}>
          <button
            style={{
              background: '#20b2aa',
              color: 'white',
              fontWeight: 600,
              fontSize: '1.1rem',
              padding: '1rem 0',
              borderRadius: '0.5rem',
              width: '100%',
              maxWidth: '22rem',
              transition: 'background 0.2s',
            }}
            onMouseOver={e => (e.currentTarget.style.background = '#178f8a')}
            onMouseOut={e => (e.currentTarget.style.background = '#20b2aa')}
            onClick={handleNext}
          >
            NEXT
          </button>
        </div>
      </>
    );
  } else if (step === 1) {
    // Good feedback step
    content = (
      <>
        <h2 className="text-white text-2xl text-center mb-8 font-normal z-10" style={{ fontFamily: "'Cherry Swash', cursive" }}>
          Want to hear from us<br/>about new offers?
        </h2>
        
        <div className="w-full max-w-sm z-10 flex flex-col gap-5 items-center px-4">
          {/* Email Input */}
          <div className="w-full">
            <label className="block text-white text-sm mb-1 font-semibold text-left">Email Address</label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <input 
                type="email" 
                className="w-full rounded-lg py-3 pl-10 pr-3 text-base text-gray-900 bg-white" 
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Feedback Textarea */}
          <div className="w-full">
            <label className="block text-white text-sm mb-1 font-semibold text-left">Tell us what you enjoyed most!</label>
            <textarea 
              className="w-full rounded-lg p-3 text-base text-gray-900 bg-white" 
              placeholder="Type your feedback here..." 
              rows={4} 
              style={{ resize: 'none' }}
              value={goodFeedback}
              onChange={e => setGoodFeedback(e.target.value)}
            />
          </div>
          
          {/* Bill Upload */}
          <div className="w-full">
            <div 
              className="w-full border-2 border-dashed border-white/40 rounded-lg p-4 flex flex-col items-center justify-center text-sm cursor-pointer hover:bg-white/10 transition-all" 
              style={{ minHeight: 90 }}
              onClick={() => document.getElementById('bill-upload-input')?.click()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-teal-300 font-semibold mt-1">Click to upload your Bill</span>
              <span className="text-white/60 text-xs mt-1">
                JPG, JPEG, PNG less than 5MB. 
                {isBillUploadRequired && <span className="text-amber-400 font-bold ml-1">(Required)</span>}
              </span>
              <input type="file" id="bill-upload-input" className="hidden" accept=".jpg,.jpeg,.png" onChange={e => setBillFile(e.target.files ? e.target.files[0] : null)} />
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col items-center z-10" style={{ marginTop: 'auto', marginBottom: '4rem' }}>
          <button
            style={{
              background: '#20b2aa',
              color: 'white',
              fontWeight: 600,
              fontSize: '1.1rem',
              padding: '1rem 0',
              borderRadius: '0.5rem',
              width: '100%',
              maxWidth: '22rem',
              transition: 'background 0.2s',
            }}
            onMouseOver={e => (e.currentTarget.style.background = '#178f8a')}
            onMouseOut={e => (e.currentTarget.style.background = '#20b2aa')}
            onClick={handleGoodSubmit}
          >
            SUBMIT
          </button>
        </div>
      </>
    );
  } else if (step === 2) {
    // Bad feedback step
    const handleCategoryClick = (category: string) => {
      setSelectedCategories(prev =>
        prev.includes(category)
          ? prev.filter(c => c !== category)
          : [...prev, category]
      );
    };

    const isBadSubmitDisabled =
      selectedCategories.length === 0 ||
      email.trim() === '' ||
      badFeedbackText.trim() === '' ||
      billFile === null;

    content = (
      <>
        <h2 className="text-white text-2xl text-center mb-8 font-normal z-10" style={{ fontFamily: "'Cherry Swash', cursive" }}>
          What aspect of our service<br/>didn't meet expectations?
        </h2>

        <div className="w-full max-w-sm z-10 flex flex-col gap-5 items-center px-4">
          {/* Category Selection */}
          <div className="w-full flex flex-wrap justify-center gap-3 mb-2">
            {BAD_CATEGORIES.map(category => {
              const isSelected = selectedCategories.includes(category);
              return (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`flex items-center justify-center px-4 py-2 rounded-full border-2 transition-all duration-200 text-sm font-semibold ${
                    isSelected
                      ? 'bg-teal-400 border-teal-400 text-black'
                      : 'bg-transparent border-white/50 text-white/80 hover:bg-white/10'
                  }`}
                >
                  {isSelected && (
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  )}
                  {category}
                </button>
              );
            })}
          </div>

          {/* Email Input */}
          <div className="w-full">
            <label className="block text-white text-sm mb-1 font-semibold text-left">Email Address</label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <input
                type="email"
                className="w-full rounded-lg py-3 pl-10 pr-3 text-base text-gray-900 bg-white"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Additional Feedback */}
          <div className="w-full">
            <label className="block text-white text-sm mb-1 font-semibold text-left">Additional feedback</label>
            <textarea
              className="w-full rounded-lg p-3 text-base text-gray-900 bg-white"
              placeholder="Type your feedback here..."
              rows={3}
              style={{ resize: 'none' }}
              value={badFeedbackText}
              onChange={e => setBadFeedbackText(e.target.value)}
            />
          </div>

          {/* Bill Upload */}
          <div className="w-full">
            <div
              className="w-full border-2 border-dashed border-white/40 rounded-lg p-4 flex flex-col items-center justify-center text-sm cursor-pointer hover:bg-white/10 transition-all"
              style={{ minHeight: 90 }}
              onClick={() => document.getElementById('bill-upload-input')?.click()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-teal-300 font-semibold mt-1">Click to upload your Bill</span>
              <span className="text-white/60 text-xs mt-1">
                JPG, JPEG, PNG less than 1MB.
                <span className="text-amber-400 font-bold ml-1">(Required)</span>
              </span>
              <input type="file" id="bill-upload-input" className="hidden" accept=".jpg,.jpeg,.png" onChange={e => setBillFile(e.target.files ? e.target.files[0] : null)} />
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col items-center z-10" style={{ marginTop: 'auto', marginBottom: '4rem' }}>
          <button
            disabled={isBadSubmitDisabled}
            style={{
              background: '#20b2aa',
              color: 'white',
              fontWeight: 600,
              fontSize: '1.1rem',
              padding: '1rem 0',
              borderRadius: '0.5rem',
              width: '100%',
              maxWidth: '22rem',
              transition: 'background 0.2s, opacity 0.2s',
              opacity: isBadSubmitDisabled ? 0.5 : 1,
            }}
            onMouseOver={e => (e.currentTarget.style.background = '#178f8a')}
            onMouseOut={e => (e.currentTarget.style.background = '#20b2aa')}
            onClick={handleBadSubmit}
          >
            SUBMIT
          </button>
        </div>
      </>
    );
  } else if (step === 3) {
    // Thank you page for good feedback
    content = (
      <>
        <h2 className="text-white text-2xl text-center mb-8 font-normal z-10" style={{ fontFamily: "'Cherry Swash', cursive" }}>
          Thanks a Latte for Your<br/>Awesome Feedback!
        </h2>

        <div className="w-full flex justify-center items-center my-4 z-10">
            <img 
                src={goodfeed} 
                alt="Awesome feedback" 
                className="w-48 h-48"
                style={{
                    filter: 'drop-shadow(0 0 1.5rem rgba(255, 223, 186, 0.5))'
                }}
            />
        </div>

        <p className="text-white/80 text-lg text-center my-6 z-10" style={{ fontFamily: "'Cherry Swash', cursive" }}>
          Your feedback helps us serve you better every day.
        </p>

        <div className="w-full flex flex-col items-center gap-4 z-10" style={{ marginTop: 'auto', marginBottom: '4rem', maxWidth: '24rem' }}>
          <a
            href="https://g.co/kgs/TZVQBZA"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-white text-gray-800 font-bold text-lg py-4 px-6 rounded-lg flex items-center justify-center gap-3 transition-transform hover:scale-105"
          >
            <img src={google} alt="Google logo" className="w-6 h-6" />
            Review us on Google
          </a>
          <a
            href="https://www.tripadvisor.com/UserReviewEdit-g304138-d25416219-Cafe_Lavia-Kandy_Kandy_District_Central_Province.html"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#34E0A1] text-black font-bold text-lg py-4 px-6 rounded-lg flex items-center justify-center gap-3 transition-transform hover:scale-105"
          >
            <img src={tripadvisor} alt="TripAdvisor logo" className="w-6 h-6" />
            Review us on TripAdvisor
          </a>
        </div>
      </>
    );
  } else if (step === 4) {
    // Thank you page for bad feedback
    content = (
      <>
        <h2 className="text-white text-2xl text-center mb-8 font-normal z-10" style={{ fontFamily: "'Cherry Swash', cursive" }}>
          Thanks for Helping Us<br/>Brew a Better Experience!
        </h2>

        <div className="w-full flex justify-center items-center my-4 z-10">
            <img 
                src={badfeed} 
                alt="Sad feedback" 
                className="w-48 h-48"
                style={{
                    filter: 'drop-shadow(0 0 1.5rem rgba(255, 223, 186, 0.5))'
                }}
            />
        </div>

        <p className="text-white/80 text-lg text-center my-6 z-10" style={{ fontFamily: "'Cherry Swash', cursive" }}>
          Thank you for sharing – we'll use<br/>this to improve your next visit.
        </p>

        <div className="w-full flex flex-col items-center gap-4 z-10" style={{ marginTop: 'auto', marginBottom: '4rem', maxWidth: '24rem' }}>
          <a
            href="https://wa.me/94000000000" // Replace with actual WhatsApp number
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#25D366] text-white font-bold text-lg py-4 px-6 rounded-lg flex items-center justify-center gap-3 transition-transform hover:scale-105"
          >
            <img src={whatsapp} alt="WhatsApp logo" className="w-7 h-7" />
            Chat with us on WhatsApp
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

  return (
    <>
      {/* Add font style */}
      <style>{fontStyle}</style>
      {/* Main content container */}
      <div
        className="min-h-screen w-full flex flex-col items-center px-4 sm:px-6 py-4 relative overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom, #186863 0%, #084040 50%, #011217 100%)',
          boxSizing: 'border-box',
          zIndex: 1,
          minHeight: '100dvh',
        }}
      >
        {/* Watermark */}
        <img
          src={logo}
          alt="Cafe LaVia watermark"
          className="pointer-events-none select-none"
          style={{
            position: 'fixed',
            left: step === 0 ? '0%' : '-100%',
            right: 'auto',
            top: '50%',
            width: '190vw',
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
        {/* Watermark for Thank You Pages */}
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
        {/* Static Logo and Progress Bar */}
        <div className="w-full flex flex-col items-center z-10 mt-8 mb-2">
          <div className="w-full max-w-lg flex justify-center items-center relative mb-4 px-4">
            {step !== 0 && (
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
            <div className="w-40 sm:w-56 md:w-72 h-2 rounded-full flex overflow-hidden" style={{ background: BAR_BG }}>
                <div style={{ width: getProgressBarWidth(), background: BAR_COLOR, height: '100%', transition: 'width 0.5s ease-in-out' }} />
            </div>
          </div>
          <img src={logo} alt="Cafe LaVia logo" className="object-contain mb-6" style={{ height: '8rem', maxHeight: '25vw', minHeight: '5rem', width: 'auto' }} />
        </div>
        {/* Content: slides left/right */}
        <div className="w-full flex flex-col items-center z-10 relative max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto flex-1" style={{...contentSlide}}>
          {content}
        </div>
        {/* Custom slider styles and responsive tweaks */}
        <style>{`
          .watermark-img {
            width: 600vw !important;
          }
          @media (min-width: 600px) {
            .watermark-img {
              width: 220vw !important;
            }
          }
          @media (max-width: 600px) {
            .watermark-img {
              width: 350vw !important;
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
      </div>
    </>
  );
};

export default LandingPage;
