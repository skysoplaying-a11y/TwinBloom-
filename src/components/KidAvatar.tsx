import React, { useState } from 'react';
import { Child } from '../types';

export const DEFAULT_KID_AVATAR = 'https://i.ibb.co/99rRhMgJ/151308084-1789448969311573.jpg';

interface KidAvatarProps {
  child?: Partial<Child> | null;
  src?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shape?: 'circle' | 'rounded';
  className?: string;
  showBadge?: boolean;
}

const sizeMap = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
  '2xl': 'w-20 h-20 text-2xl',
};

export const KidAvatar: React.FC<KidAvatarProps> = ({
  child,
  src,
  name,
  size = 'md',
  shape = 'circle',
  className = '',
  showBadge = false,
}) => {
  const [imageError, setImageError] = useState(false);

  const displayName = name || child?.name || 'Child';
  const initial = displayName.charAt(0).toUpperCase();
  const avatarSrc = src || child?.avatar_url || DEFAULT_KID_AVATAR;
  const bgColor = child?.avatar_color || '#1E3C65';

  const shapeClass = shape === 'rounded' ? 'rounded-2xl' : 'rounded-full';

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      <div
        className={`${sizeMap[size]} ${shapeClass} overflow-hidden flex items-center justify-center font-extrabold text-white ring-2 ring-white/90 shadow-sm transition-transform hover:scale-105`}
        style={{ backgroundColor: bgColor }}
      >
        {!imageError && avatarSrc ? (
          <img
            src={avatarSrc}
            alt={`${displayName}'s avatar`}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <span>{initial}</span>
        )}
      </div>

      {showBadge && (
        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#FF001E] border-2 border-white ring-1 ring-black/10 shadow-xs" />
      )}
    </div>
  );
};
