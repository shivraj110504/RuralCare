
import React, { useEffect, useState } from 'react';
import { useCursorPosition } from '../animations/useAnimations';

const Cursor: React.FC = () => {
  const { position, isHovering } = useCursorPosition();
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Check if it's a mobile device (touch screen)
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsMobile(isTouchDevice);

    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, []);

  // Don't render the custom cursor on mobile devices
  if (!isMounted || isMobile) {
    return null;
  }

  return (
    <div 
      className="custom-cursor"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        transform: `translate(-50%, -50%) scale(${isHovering ? 1.2 : 1})`,
        transition: 'transform 0.2s ease'
      }}
    >
      <img
        src="/images/stethoscope.svg"
        alt="Stethoscope Cursor"
        className={`w-9 h-9 ${isHovering ? 'scale-110' : 'scale-100'} transition-transform duration-200`}
      />
    </div>
  );
};

export default Cursor;
