import React, { useState } from 'react';
import logo from '../assets/logo.png';
import '../index.css';

const FEEDBACK_OPTIONS = [
  { label: 'Love it', emoji: '😍' },
  { label: 'Great', emoji: '😊' },
  { label: 'Okay', emoji: '😐' },
  { label: 'Bad', emoji: '😕' },
  { label: 'Terrible', emoji: '😡' },
];

const SLIDER_COLOR = '#ff7a29'; // vibrant orange
const SLIDER_BG = '#f3edea'; // light color
const SLIDER_THUMB_SIZE = 44;
const SLIDER_TRACK_WIDTH = 14;
const SLIDER_HEIGHT = 240;

const LandingPage: React.FC = () => {
  const [selected, setSelected] = useState(2); // Default to 'Okay'

  // Calculate the fill percent for the slider (from thumb to bottom)
  const fillPercent = ((FEEDBACK_OPTIONS.length - 1 - selected) / (FEEDBACK_OPTIONS.length - 1)) * 100;

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center px-4 py-4 relative overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #186863 0%, #084040 50%, #011217 100%)',
        boxSizing: 'border-box',
      }}
    >
      {/* Watermark */}
      <img
        src={logo}
        alt="Cafe LaVia watermark"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none select-none"
        style={{ width: '90%', maxWidth: 500, zIndex: 0 }}
      />
      {/* Divider bar above logo */}
      <div className="w-full flex flex-col items-center z-10 mt-8 mb-2">
        <div className="w-24 h-1.5 rounded-full mb-4" style={{ background: '#20b2aa' }} />
        <img src={logo} alt="Cafe LaVia logo" className="h-20 object-contain mb-6" />
      </div>
      <h2 className="text-white text-xl text-center mb-10 font-normal z-10">How was your Experience?</h2>
      <div className="flex flex-1 flex-col justify-center items-center w-full z-10" style={{ minHeight: 300 }}>
        <div className="flex flex-row justify-center items-center w-full max-w-xs mx-auto gap-2" style={{height: SLIDER_HEIGHT + 60}}>
          {/* Labels */}
          <div className="flex flex-col justify-between h-full items-end pr-2" style={{minHeight: SLIDER_HEIGHT}}>
            {FEEDBACK_OPTIONS.map(option => (
              <span
                key={option.label}
                className={`text-white text-lg text-right font-normal`}
                style={{ minHeight: 44, display: 'flex', alignItems: 'center', height: 44 }}
              >
                {option.label}
              </span>
            ))}
          </div>
          {/* Slider */}
          <div className="relative flex flex-col items-center justify-between" style={{height: SLIDER_HEIGHT, minHeight: SLIDER_HEIGHT, minWidth: SLIDER_TRACK_WIDTH}}>
            {/* Orange fill below thumb */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                width: SLIDER_TRACK_WIDTH,
                height: `${fillPercent}%`,
                bottom: 0,
                transform: 'translateX(-50%)',
                background: SLIDER_COLOR,
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
                background: SLIDER_BG,
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
                  background: SLIDER_COLOR,
                  border: '3px solid #fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="9" cy="9" r="5" stroke="white" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>
          {/* Emojis */}
          <div className="flex flex-col justify-between h-full items-start pl-2" style={{minHeight: SLIDER_HEIGHT}}>
            {FEEDBACK_OPTIONS.map((option, idx) => (
              <span
                key={option.label}
                className={`text-2xl transition-all duration-300 text-left ${selected === idx ? 'scale-110 opacity-100' : 'opacity-40 grayscale'}`}
                style={{ minHeight: 44, display: 'flex', alignItems: 'center', height: 44 }}
              >
                {option.emoji}
              </span>
            ))}
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
          // onClick={handleNext}
        >
          NEXT
        </button>
      </div>
      {/* Custom slider styles */}
      <style>{`
        input[type='range'].custom-vertical-slider {
          -webkit-appearance: slider-vertical;
          appearance: none;
          width: ${SLIDER_TRACK_WIDTH}px;
          height: ${SLIDER_HEIGHT}px;
          background: ${SLIDER_BG};
          border-radius: 999px;
          margin: 0;
          padding: 0;
          position: relative;
          display: block;
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
          width: ${SLIDER_TRACK_WIDTH}px;
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
          width: ${SLIDER_TRACK_WIDTH}px;
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
  );
};

export default LandingPage;