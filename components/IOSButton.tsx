import React, { useState } from 'react';
import { audioService } from '../services/audioService';

interface IOSButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  withSound?: boolean;
}

export const IOSButton: React.FC<IOSButtonProps> = ({ 
  children, 
  className = '', 
  variant = 'primary', 
  onClick, 
  withSound = true,
  ...props 
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const baseStyles = "relative overflow-hidden transition-all duration-200 active:scale-95 font-medium rounded-xl flex items-center justify-center";
  
  const variants = {
    primary: "bg-[#007AFF] text-white shadow-md hover:bg-[#0062cc]",
    secondary: "bg-white text-black shadow-sm border border-gray-200 hover:bg-gray-50",
    danger: "bg-[#FF3B30] text-white shadow-md hover:bg-[#d6332a]",
    ghost: "bg-transparent text-[#007AFF] hover:bg-[#007AFF]/10"
  };

  const handlePointerDown = () => setIsPressed(true);
  const handlePointerUp = () => setIsPressed(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (withSound) {
      if (variant === 'danger') audioService.playDelete();
      else if (variant === 'primary') audioService.playTap();
      else audioService.playTap();
    }
    if (onClick) onClick(e);
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};
