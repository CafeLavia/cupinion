import React from 'react';
import logo from '../assets/logo.png';

interface PageTransitionProps {
  children: React.ReactNode;
  direction: 'left' | 'right';
}

const PageTransition: React.FC<PageTransitionProps> = ({ children, direction }) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Watermark with transition */}
      <img
        src={logo}
        alt="Cafe LaVia watermark"
        className="pointer-events-none select-none transition-all duration-1000 ease-in-out"
        style={{
          position: 'absolute',
          [direction]: '-45%',
          top: '50%',
          width: '220vw',
          height: 'auto',
          opacity: 0.13,
          zIndex: 0,
          objectFit: 'contain',
          objectPosition: `${direction} center`,
          transform: 'translateY(-50%)',
        }}
      />
      {/* Page content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default PageTransition; 