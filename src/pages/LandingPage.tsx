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

const SLIDER_COLOR = '#14b8a6'; // teal-500
const SLIDER_BG = '#e5e7eb'; // gray-200
const SLIDER_THUMB_SIZE = 38;
const SLIDER_TRACK_WIDTH = 16;
const SLIDER_HEIGHT = 240;

const LandingPage: React.FC = () => {
  const [selected, setSelected] = useState(2); // Default to 'Okay'

  // Calculate the fill percent for the slider (bottom to top)
  const fillPercent = ((FEEDBACK_OPTIONS.length - 1 - selected) / (FEEDBACK_OPTIONS.length - 1)) * 100;
  const sliderTrackGradient = `linear-gradient(to top, ${SLIDER_COLOR} 0% ${100 - fillPercent}%, ${SLIDER_BG} ${100 - fillPercent}%, ${SLIDER_BG} 100%)`;

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center px-4 py-4 relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #249688 0%, #0B1B17 100%)',
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
        <div className="w-24 h-1.5 rounded-full mb-4" style={{ background: SLIDER_COLOR }} />
        <img src={logo} alt="Cafe LaVia logo" className="h-20 object-contain mb-6" />
      </div>
      <h2 className="text-white text-xl text-center mb-10 font-normal z-10">How was your Experience?</h2>
      <div className="flex flex-1 flex-col justify-center items-center w-full z-10" style={{ minHeight: 300 }}>
        <div className="flex flex-row justify-center items-center w-full max-w-xs mx-auto gap-2" style={{height: SLIDER_HEIGHT + 60}}>
          {/* Labels */}
          <div className="flex flex-col justify-between h-full items-end pr-2" style={{minHeight: SLIDER_HEIGHT}}>
            {FEEDBACK_OPTIONS.map((option, idx) => (
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
                background: sliderTrackGradient,
                borderRadius: 999,
                zIndex: 2,
                margin: 0,
                padding: 0,
                display: 'block',
              }}
            />
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
          className="w-full max-w-xs bg-teal-600 hover:bg-teal-700 text-white text-base font-semibold py-3 rounded transition"
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
          background: ${sliderTrackGradient};
          border-radius: 999px;
          margin: 0;
          padding: 0;
          position: relative;
          display: block;
        }
        input[type='range'].custom-vertical-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: ${SLIDER_THUMB_SIZE}px;
          height: ${SLIDER_THUMB_SIZE}px;
          border-radius: 50%;
          background: ${SLIDER_COLOR};
          border: 3px solid #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.10);
          cursor: pointer;
          margin-left: -${(SLIDER_THUMB_SIZE - SLIDER_TRACK_WIDTH) / 2}px;
          margin-top: -${SLIDER_THUMB_SIZE / 2 - SLIDER_TRACK_WIDTH / 2}px;
          transition: transform 0.2s ease-in-out, background 0.2s;
          position: relative;
        }
        input[type='range'].custom-vertical-slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
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
          width: ${SLIDER_THUMB_SIZE}px;
          height: ${SLIDER_THUMB_SIZE}px;
          border-radius: 50%;
          background: ${SLIDER_COLOR};
          border: 3px solid #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.10);
          cursor: pointer;
          margin-left: -${(SLIDER_THUMB_SIZE - SLIDER_TRACK_WIDTH) / 2}px;
          margin-top: -${SLIDER_THUMB_SIZE / 2 - SLIDER_TRACK_WIDTH / 2}px;
          transition: transform 0.2s ease-in-out, background 0.2s;
          position: relative;
        }
        input[type='range'].custom-vertical-slider::-moz-range-thumb:hover {
          transform: scale(1.1);
        }
        input[type='range'].custom-vertical-slider::-moz-range-track {
          width: ${SLIDER_TRACK_WIDTH}px;
          height: 100%;
          background: transparent;
          border-radius: 999px;
        }
        input[type='range'].custom-vertical-slider::-ms-thumb {
          width: ${SLIDER_THUMB_SIZE}px;
          height: ${SLIDER_THUMB_SIZE}px;
          border-radius: 50%;
          background: ${SLIDER_COLOR};
          border: 3px solid #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.10);
          cursor: pointer;
          margin-left: -${(SLIDER_THUMB_SIZE - SLIDER_TRACK_WIDTH) / 2}px;
          margin-top: -${SLIDER_THUMB_SIZE / 2 - SLIDER_TRACK_WIDTH / 2}px;
          transition: transform 0.2s ease-in-out, background 0.2s;
          position: relative;
        }
        input[type='range'].custom-vertical-slider::-ms-thumb:hover {
          transform: scale(1.1);
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