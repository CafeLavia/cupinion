import React from 'react';
import logo from '../assets/logo.png';
import '../index.css';
import PageTransition from '../components/PageTransition';

const GoodFeedbackPage: React.FC = () => {
  return (
    <PageTransition direction="left">
      <div
        className="min-h-screen w-full flex flex-col items-center px-4 py-4"
        style={{
          background: 'linear-gradient(to bottom, #186863 0%, #084040 50%, #011217 100%)',
          boxSizing: 'border-box',
        }}
      >
        {/* Watermark */}
        <img
          src={logo}
          alt="Cafe LaVia watermark"
          className="pointer-events-none select-none"
          style={{
            position: 'absolute',
            right: '-45%',
            top: '50%',
            width: '220vw',
            height: 'auto',
            opacity: 0.13,
            zIndex: 0,
            objectFit: 'contain',
            objectPosition: 'right center',
            transform: 'translateY(-50%)',
          }}
        />
        
        {/* Progress bar */}
        <div className="w-full flex flex-col items-center z-10 mt-8 mb-2">
          <div className="w-24 h-1.5 rounded-full mb-4 flex overflow-hidden" style={{ background: '#0e4747' }}>
            <div style={{ width: '50%', background: '#20b2aa', height: '100%' }} />
          </div>
          <img src={logo} alt="Cafe LaVia logo" className="h-20 object-contain mb-6" />
        </div>

        <h2 className="text-white text-xl text-center mb-10 font-normal z-10">What did you enjoy the most?</h2>
        
        <div className="w-full max-w-md z-10">
          <div className="space-y-4">
            {[
              'Food Quality',
              'Service',
              'Ambiance',
              'Value for Money',
              'Location'
            ].map((option) => (
              <button
                key={option}
                className="w-full text-left p-4 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
                style={{ backdropFilter: 'blur(8px)' }}
              >
                {option}
              </button>
            ))}
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
      </div>
    </PageTransition>
  );
};

export default GoodFeedbackPage; 