import React from 'react';

interface TakonoLogoProps {
  variant?: 'full' | 'icon' | 'wordmark';
  theme?: 'light' | 'dark' | 'auto';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const TakonoLogo: React.FC<TakonoLogoProps> = ({
  variant = 'full',
  theme = 'light',
  size = 'md',
  className = '',
}) => {
  // Size metrics
  const dimensions = {
    sm: { height: 26, iconSize: 26, fontSize: 'text-lg', gap: 'gap-2' },
    md: { height: 34, iconSize: 34, fontSize: 'text-xl', gap: 'gap-2.5' },
    lg: { height: 42, iconSize: 42, fontSize: 'text-2xl', gap: 'gap-3' },
    xl: { height: 54, iconSize: 54, fontSize: 'text-3xl', gap: 'gap-3.5' },
  }[size];

  // Theme colors
  const primaryBlue = '#0052FF';
  const accentBlue = '#388BFD';
  const textColor = theme === 'dark' ? 'text-white' : 'text-blue-600';

  // SVG Mark matching the authentic Takono monogram (swooping T canopy, dot, trunk leg, and K diagonal)
  const renderIcon = () => (
    <svg
      width={dimensions.iconSize}
      height={dimensions.iconSize}
      viewBox="0 0 100 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-200 group-hover:scale-105"
      aria-label="Takono Icon"
    >
      <defs>
        <linearGradient id="takono-accent-grad" x1="48" y1="36" x2="85" y2="76" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
      </defs>

      {/* Circle / Eye dot under the visor */}
      <circle cx="16" cy="45" r="6" fill={primaryBlue} />

      {/* Top T-Cap / Visor curving down on the left */}
      <path
        d="M 6 27 C 6 22 13 16 24 16 L 86 16 C 92 16 96 19 94 24 L 88 27 C 85 28 80 28 72 28 L 26 28 C 17 28 10 24 6 27 Z"
        fill={primaryBlue}
      />

      {/* Main vertical trunk with forward curve / wave kick */}
      <path
        d="M 40 28 L 54 28 L 54 44 C 54 55 48 64 38 69 C 32 72 26 73 21 73 C 19 73 18 70 20 68 C 26 62 38 52 40 44 Z"
        fill={primaryBlue}
      />

      {/* K Diagonal lower leg */}
      <path
        d="M 47 38 L 59 31 L 88 71 L 71 71 Z"
        fill="url(#takono-accent-grad)"
      />
    </svg>
  );

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {renderIcon()}
      </div>
    );
  }

  if (variant === 'wordmark') {
    return (
      <span
        className={`font-black tracking-tight leading-none uppercase select-none ${dimensions.fontSize} ${textColor} ${className}`}
        style={{ letterSpacing: '0.04em' }}
      >
        TAKONO
      </span>
    );
  }

  return (
    <div className={`inline-flex items-center ${dimensions.gap} ${className}`}>
      {renderIcon()}
      <span
        className={`font-black tracking-tight leading-none uppercase select-none ${dimensions.fontSize} ${textColor}`}
        style={{ letterSpacing: '0.04em' }}
      >
        TAKONO
      </span>
    </div>
  );
};
