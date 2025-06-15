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

const LandingPage: React.FC = () => {
  const [selected, setSelected] = useState(2); // Default to 'Okay'

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
      {/* Logo at the top */}
      <div className="flex flex-col items-center w-full z-10 mt-2 mb-2">
        <img src={logo} alt="Cafe LaVia logo" className="h-16 object-contain mb-2" />
        <div className="w-16 h-1 bg-white/60 rounded-full mb-2" />
      </div>
      <h2 className="text-white text-lg font-semibold text-center mb-6 underline underline-offset-4 z-10">How was your Experience?</h2>
      <div className="flex flex-1 flex-col justify-center items-center w-full z-10" style={{ minHeight: 350 }}>
        <div className="flex flex-row justify-center items-center w-full max-w-xs mx-auto" style={{height: 320}}>
          {/* Labels */}
          <div className="flex flex-col justify-between h-full mr-2">
            {FEEDBACK_OPTIONS.map((option, idx) => (
              <span
                key={option.label}
                className={`text-white text-sm text-right ${selected === idx ? 'font-bold' : 'opacity-70'}`}
                style={{ minHeight: 40, display: 'flex', alignItems: 'center', height: 40 }}
              >
                {option.label}
              </span>
            ))}
          </div>
          {/* Slider */}
          <div className="relative flex flex-col items-center" style={{height: 260}}>
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
                height: 260,
                width: 24,
                accentColor: '#5ECFFF',
                zIndex: 2,
              }}
            />
          </div>
          {/* Emojis */}
          <div className="flex flex-col justify-between h-full ml-2">
            {FEEDBACK_OPTIONS.map((option, idx) => (
              <span
                key={option.label}
                className={`text-2xl ${selected === idx ? '' : 'opacity-30'}`}
                style={{ minHeight: 40, display: 'flex', alignItems: 'center', height: 40 }}
              >
                {option.emoji}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col items-center z-10 mb-2">
        <button
          className="w-full max-w-xs bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded transition"
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
          width: 24px;
          height: 260px;
          background: transparent;
        }
        input[type='range'].custom-vertical-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #5ECFFF;
          border: 3px solid #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          cursor: pointer;
          margin-top: -2px;
        }
        input[type='range'].custom-vertical-slider::-webkit-slider-runnable-track {
          width: 8px;
          height: 100%;
          background: #fff;
          border-radius: 8px;
        }
        input[type='range'].custom-vertical-slider:focus {
          outline: none;
        }
        input[type='range'].custom-vertical-slider::-moz-range-thumb {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #5ECFFF;
          border: 3px solid #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          cursor: pointer;
        }
        input[type='range'].custom-vertical-slider::-moz-range-track {
          width: 8px;
          height: 100%;
          background: #fff;
          border-radius: 8px;
        }
        input[type='range'].custom-vertical-slider::-ms-thumb {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #5ECFFF;
          border: 3px solid #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          cursor: pointer;
        }
        input[type='range'].custom-vertical-slider::-ms-fill-lower,
        input[type='range'].custom-vertical-slider::-ms-fill-upper {
          background: #fff;
          border-radius: 8px;
        }
        input[type='range'].custom-vertical-slider:focus::-ms-fill-lower,
        input[type='range'].custom-vertical-slider:focus::-ms-fill-upper {
          background: #fff;
        }
      `}</style>
    </div>
  );
};

export default LandingPage; 