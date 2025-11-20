import React from 'react';

interface ButtonProps {
  label: string | React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'accent' | 'secondary' | 'ghost';
  className?: string;
  span?: number;
}

export const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  variant = 'default', 
  className = '',
  span = 1 
}) => {
  
  const baseStyles = "h-16 sm:h-20 rounded-full text-2xl sm:text-3xl font-medium transition-all duration-200 active:scale-90 flex items-center justify-center select-none";
  
  const variants = {
    default: "bg-[#333333] text-white hover:bg-[#404040]",
    accent: "bg-[#ff9f0a] text-white hover:bg-[#ffb340]",
    secondary: "bg-[#a5a5a5] text-black hover:bg-[#d4d4d4]",
    ghost: "bg-transparent text-white hover:bg-white/10 text-lg sm:text-xl"
  };

  const widthClass = span === 2 ? 'col-span-2 w-full aspect-[2.1/1]' : 'aspect-square w-full';

  return (
    <button 
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`}
    >
      {label}
    </button>
  );
};