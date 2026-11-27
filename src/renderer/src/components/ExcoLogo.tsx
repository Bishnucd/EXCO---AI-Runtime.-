import React from 'react';
import excoLogoImg from '../assets/exco-logo.png';

interface ExcoLogoProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export const ExcoLogo: React.FC<ExcoLogoProps> = ({ className = 'w-6 h-6', size }) => {
  return (
    <img
      src={excoLogoImg}
      alt="EXCO"
      draggable={false}
      className={`${className} object-contain select-none`}
      style={size ? { width: size, height: size } : undefined}
    />
  );
};

export default ExcoLogo;
