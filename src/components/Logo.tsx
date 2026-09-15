import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showTagline = false }) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* TwinBloom Mirrored Two-Petal Growth Icon */}
      <div className={`relative flex items-center justify-center ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Left Bloom Leaf: Deep Navy */}
          <path
            d="M20 34C13 32 8 25 8 18C8 11 13 6 20 6C20 13 18 27 20 34Z"
            fill="#1E3C65"
            opacity="0.95"
          />
          {/* Right Bloom Leaf: Vivid Red */}
          <path
            d="M20 34C27 32 32 25 32 18C32 11 27 6 20 6C20 13 22 27 20 34Z"
            fill="#FF001E"
            opacity="0.9"
          />
          {/* Center Digital Nucleus Dot */}
          <circle cx="20" cy="20" r="3" fill="#FFFFFF" />
          <circle cx="20" cy="20" r="1.5" fill="#010313" />
        </svg>
      </div>

      <div className="flex flex-col">
        <span
          className={`font-extrabold tracking-tight text-[#010313] leading-none ${textSizes[size]}`}
        >
          Twin<span className="text-[#FF001E]">Bloom</span>
        </span>
        {showTagline && (
          <span className="text-[10px] font-semibold tracking-widest text-[#1E3C65] uppercase mt-0.5">
            Child Development Digital Twin
          </span>
        )}
      </div>
    </div>
  );
};
