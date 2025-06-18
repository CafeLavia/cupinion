import React, { useState } from 'react';
import logo from '../assets/logo.png';
import loveit from '../assets/loveit.png';
import great from '../assets/great.png';
import okay from '../assets/okay.png';
import poor from '../assets/poor.png';
import terribale from '../assets/terribale.png';
import '../index.css';

// Add Google Fonts import
const fontStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Cherry+Swash:wght@400;700&display=swap');
`;

const FEEDBACK_OPTIONS = [
  { label: 'Love it', image: loveit },
  { label: 'Great', image: great },
  { label: 'Okay', image: okay },
  { label: 'Bad', image: poor },
  { label: 'Terrible', image: terribale },
];

const BAR_COLOR = '#20b2aa';
const BAR_BG = '#0e4747';
const THUMB_COLOR = '#20b2aa';
const SLIDER_THUMB_SIZE = 52;
const SLIDER_TRACK_WIDTH = 16;
const SLIDER_HEIGHT = 380;
const COLUMN_GAP = 28;

const GOOD_QUESTIONS = [
  'Food Quality',
  'Service',
  'Ambiance',
  'Value for Money',
  'Location',
];
const BAD_QUESTIONS = [
  'Food Quality',
  'Service Speed',
  'Staff Behavior',
  'Cleanliness',
  'Pricing',
  'Other',
];

const LandingPage: React.FC = () => {
  const [step, setStep] = useState(0); // 0: initial, 1: good, 2: bad
  const [selected, setSelected] = useState(2); // Default to 'Okay'
  const [direction, setDirection] = useState<'left' | 'right'>('left');
  const [animating, setAnimating] = useState(false);

  // For slider
  const fillPercent = ((FEEDBACK_OPTIONS.length - 1 - selected) / (FEEDBACK_OPTIONS.length - 1)) * 100;

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
    goToStep(0, 'right');
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
        <h2 className="text-white text-xl text-center mb-10 font-normal z-10" style={{ fontFamily: "'Cherry Swash', cursive" }}>How was your Experience?</h2>
        <div className="flex flex-1 flex-col justify-center items-center w-full z-10" style={{ minHeight: 360 }}>
          <div className="flex flex-row justify-center items-center w-full max-w-xs mx-auto" style={{height: SLIDER_HEIGHT + 60, gap: COLUMN_GAP, alignItems: 'flex-start'}}>
            {/* Labels */}
            <div className="flex flex-col justify-between h-full items-end pr-2" style={{minHeight: SLIDER_HEIGHT, height: SLIDER_HEIGHT}}>
              {FEEDBACK_OPTIONS.map(option => (
                <span
                  key={option.label}
                  className={`text-white text-xl text-right font-normal`}
                  style={{ minHeight: 52, display: 'flex', alignItems: 'center', height: 52 }}
                >
                  {option.label}
                </span>
              ))}
            </div>
            {/* Slider */}
            <div className="relative flex flex-col items-center justify-between px-3" style={{height: SLIDER_HEIGHT, minHeight: SLIDER_HEIGHT, minWidth: SLIDER_TRACK_WIDTH, justifyContent: 'space-between'}}>
              {/* Teal fill below thumb */}
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  width: SLIDER_TRACK_WIDTH,
                  height: `${fillPercent}%`,
                  bottom: 0,
                  transform: 'translateX(-50%)',
                  background: BAR_COLOR,
                  borderRadius: SLIDER_TRACK_WIDTH,
                  zIndex: 1,
                  transition: 'height 0.2s',
                }}
              />
              {/* Slider input */}
              <input
                type="range"
                min={0}
                max={FEEDBACK_OPTIONS.length - 1}
                value={selected}
                onChange={e => setSelected(Number(e.target.value))}
                className="custom-vertical-slider"
                style={{
                  WebkitAppearance: 'slider-vertical',
                  writingMode: 'vertical-lr',
                  height: SLIDER_HEIGHT,
                  width: SLIDER_TRACK_WIDTH,
                  background: BAR_BG,
                  borderRadius: 999,
                  zIndex: 2,
                  margin: 0,
                  padding: 0,
                  display: 'block',
                }}
              />
              {/* Custom thumb icon overlay */}
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: `calc(${((selected) / (FEEDBACK_OPTIONS.length - 1)) * 100}% - ${SLIDER_THUMB_SIZE / 2}px)`,
                  transform: 'translate(-50%, 0)',
                  width: SLIDER_THUMB_SIZE,
                  height: SLIDER_THUMB_SIZE,
                  pointerEvents: 'none',
                  zIndex: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    width: SLIDER_THUMB_SIZE,
                    height: SLIDER_THUMB_SIZE,
                    borderRadius: '50%',
                    background: THUMB_COLOR,
                    border: '3px solid #fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="9" cy="9" r="5" stroke="white" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>
            {/* Emojis */}
            <div className="flex flex-col justify-between h-full items-start pl-2" style={{minHeight: SLIDER_HEIGHT, height: SLIDER_HEIGHT}}>
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
        <div className="w-full flex flex-col items-center z-10 mb-2 mt-8" style={{ marginTop: '3.5rem', marginBottom: '2.5rem' }}>
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
        {/* Back arrow */}
        <button onClick={handleBack} style={{ position: 'absolute', left: 16, top: 24, zIndex: 20, background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M20 24L12 16L20 8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <h2 className="text-white text-xl text-center mb-6 font-normal z-10" style={{ fontFamily: "'Cherry Swash', cursive" }}>Was everything perfetto?</h2>
        <div className="w-full max-w-md z-10 flex flex-col gap-4 items-center">
          <div className="w-full">
            <label className="block text-white text-sm mb-2 font-semibold">Let us know what made your visit special.</label>
            <textarea className="w-full rounded-lg p-3 text-base text-gray-900" placeholder="Tell us what you enjoyed most!" rows={3} style={{ resize: 'none' }} />
          </div>
          {/* Upload box */}
          <div className="w-full">
            <label className="block text-white text-sm mb-2 font-semibold">Upload a photo (optional)</label>
            <div className="w-full border-2 border-dashed border-white/40 rounded-lg p-4 flex flex-col items-center justify-center text-white/70 text-sm cursor-pointer hover:bg-white/10 transition-all" style={{ minHeight: 90 }}>
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-8m-4 4h8" /></svg>
              <span>Click to upload or drag and drop<br/>.JPG, .JPEG, .PNG less than 1MB.</span>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col items-center z-10 mb-2 mt-8">
          <button
            style={{
              background: '#20b2aa',
              color: 'white',
              fontWeight: 600,
              fontSize: '1rem',
              padding: '0.75rem 0',
              borderRadius: '0.5rem',
              width: '100%',
              maxWidth: '20rem',
              transition: 'background 0.2s',
            }}
            onMouseOver={e => (e.currentTarget.style.background = '#178f8a')}
            onMouseOut={e => (e.currentTarget.style.background = '#20b2aa')}
          >
            SUBMIT
          </button>
        </div>
      </>
    );
  } else if (step === 2) {
    // Bad feedback step
    content = (
      <>
        {/* Back arrow */}
        <button onClick={handleBack} style={{ position: 'absolute', left: 16, top: 24, zIndex: 20, background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M20 24L12 16L20 8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <h2 className="text-white text-xl text-center mb-6 font-normal z-10" style={{ fontFamily: "'Cherry Swash', cursive" }}>What could we improve?</h2>
        <div className="w-full max-w-md z-10 flex flex-col gap-4 items-center">
          <div className="w-full">
            <label className="block text-white text-sm mb-2 font-semibold">Let us know what went wrong.</label>
            <textarea className="w-full rounded-lg p-3 text-base text-gray-900" placeholder="Tell us what could be better!" rows={3} style={{ resize: 'none' }} />
          </div>
          {/* Upload box */}
          <div className="w-full">
            <label className="block text-white text-sm mb-2 font-semibold">Upload a photo (optional)</label>
            <div className="w-full border-2 border-dashed border-white/40 rounded-lg p-4 flex flex-col items-center justify-center text-white/70 text-sm cursor-pointer hover:bg-white/10 transition-all" style={{ minHeight: 90 }}>
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-8m-4 4h8" /></svg>
              <span>Click to upload or drag and drop<br/>.JPG, .JPEG, .PNG less than 1MB.</span>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col items-center z-10 mb-2 mt-8">
          <button
            style={{
              background: '#20b2aa',
              color: 'white',
              fontWeight: 600,
              fontSize: '1rem',
              padding: '0.75rem 0',
              borderRadius: '0.5rem',
              width: '100%',
              maxWidth: '20rem',
              transition: 'background 0.2s',
            }}
            onMouseOver={e => (e.currentTarget.style.background = '#178f8a')}
            onMouseOut={e => (e.currentTarget.style.background = '#20b2aa')}
          >
            SUBMIT
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Add font style */}
      <style>{fontStyle}</style>
      {/* Main content container */}
      <div
        className="min-h-screen w-full flex flex-col items-center px-2 sm:px-4 py-4 relative overflow-hidden"
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
            position: 'absolute',
            left: step === 0 ? '0%' : '-100%',
            right: 'auto',
            top: '50%',
            width: '190vw',
            height: 'auto',
            opacity: 0.13,
            zIndex: 0,
            objectFit: 'contain',
            objectPosition: step === 1 ? 'right center' : 'left center',
            transform: 'translateY(-50%)',
            maxWidth: 'none',
            transition: 'left 0.8s cubic-bezier(.77,0,.18,1), right 0.8s cubic-bezier(.77,0,.18,1), object-position 0.8s cubic-bezier(.77,0,.18,1)',
          }}
        />
        {/* Static Logo */}
        <div className="w-full flex flex-col items-center z-10 mt-8 mb-2">
          <div className="w-full max-w-lg flex justify-center">
            <div className="w-40 sm:w-56 md:w-72 h-2 rounded-full mb-4 flex overflow-hidden" style={{ background: BAR_BG }}>
              <div style={{ width: step === 0 ? '25%' : '50%', background: BAR_COLOR, height: '100%', transition: 'width 0.5s ease-in-out' }} />
            </div>
          </div>
          <img src={logo} alt="Cafe LaVia logo" className="object-contain mb-6" style={{ height: '6rem', maxHeight: '18vw', minHeight: '3.5rem', width: 'auto' }} />
        </div>
        {/* Content: slides left/right */}
        <div className="w-full flex flex-col items-center z-10 relative max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto" style={{...contentSlide, minHeight: '70vh'}}>
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