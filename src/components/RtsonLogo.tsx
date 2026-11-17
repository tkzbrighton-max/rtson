import React, { useId } from 'react';

export interface RtsonLogoProps {
  variant?: 'full' | 'icon' | 'horizontal';
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  textColor?: 'dark' | 'light' | 'auto';
  showSubtitle?: boolean;
  accentColor?: string; // Electric Lime #d4f15d
}

export const RtsonLogo: React.FC<RtsonLogoProps> = ({
  variant = 'full',
  className = '',
  size = 'md',
  textColor = 'auto',
  showSubtitle = true,
  accentColor = '#ff6b00' // Electric Studio Orange Standard
}) => {
  const reactId = useId().replace(/:/g, '');
  const gradientId = `rtsonBrandGrad_${reactId}`;

  // Dimensions map
  const sizeMap = {
    xs: { iconSize: 22, textHeight: 22, fontSize: 'text-[14px]', subSize: 'text-[7px]' },
    sm: { iconSize: 28, textHeight: 28, fontSize: 'text-[16px]', subSize: 'text-[8px]' },
    md: { iconSize: 38, textHeight: 38, fontSize: 'text-[18px] sm:text-[21px]', subSize: 'text-[8.5px] sm:text-[9.5px]' },
    lg: { iconSize: 48, textHeight: 48, fontSize: 'text-[22px] sm:text-[26px]', subSize: 'text-[10px] sm:text-[11px]' },
    xl: { iconSize: 64, textHeight: 64, fontSize: 'text-[28px] sm:text-[34px]', subSize: 'text-[12px] sm:text-[13px]' }
  };

  const { iconSize, fontSize, subSize } = sizeMap[size];

  // Strictly Orange #ff6b00, Pure Black & White
  const isLight = textColor === 'light';
  const isDark = textColor === 'dark';
  
  const rtsonColor = isLight ? 'text-white' : isDark ? 'text-black' : 'text-white';
  const subtitleColor = isLight ? 'text-neutral-300' : isDark ? 'text-neutral-800' : 'text-neutral-300';
  // Leg color: pure black on light background, pure white on dark background
  const legColor = isDark ? '#000000' : '#ffffff';

  // Stylized Geometric 'R' Icon in Electric Orange, Black & White
  const IconElement = (
    <svg 
      width={iconSize} 
      height={iconSize} 
      viewBox="0 0 120 110" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 drop-shadow-sm select-none transition-all duration-300"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="110" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ff6b00" />
          <stop offset="100%" stopColor="#ff8800" />
        </linearGradient>
      </defs>

      {/* Main Electric Orange Geometric R Body with Clean Inner Cutout */}
      <path
        d="M20,0 H72 C96,0 114,16 114,40 C114,60 98,74 74,75 L56,75 L56,110 L38,110 L38,75 L18,75 L18,52 L38,32 L38,20 L0,20 Z
           M38,20 L38,44 L54,60 H68 C82,60 92,52 92,40 C92,28 82,20 68,20 Z"
        fill={`url(#${gradientId})`}
        fillRule="evenodd"
        clipRule="evenodd"
      />

      {/* Bright Orange Arrow Notch pointing UP-RIGHT */}
      <path
        d="M0,45 L18,27 L18,52 L0,70 Z"
        fill="#f97316"
      />

      {/* Contrast Leg of the 'R' (Pure Black on light background, Pure White on dark background) */}
      <path
        d="M56,58 L98,110 L72,110 L38,68 Z"
        fill={legColor}
      />
    </svg>
  );

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {IconElement}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {IconElement}

      <div className="flex flex-col leading-none">
        <div className="flex flex-col font-black tracking-tight">
          <span className={`${fontSize} font-black tracking-tight leading-none ${rtsonColor}`}>
            Rtson
          </span>
          <span 
            className={`${fontSize} font-black tracking-tight leading-tight text-[#ff6b00]`}
          >
            Creations
          </span>
        </div>

        {showSubtitle && (
          <div className={`flex items-center gap-1.5 ${subSize} font-black uppercase tracking-[0.18em] pt-0.5 ${subtitleColor}`}>
            <span>DESIGN</span>
            <span className="text-[#ff6b00] font-bold">•</span>
            <span>WEB</span>
            <span className="text-[#ff6b00] font-bold">•</span>
            <span>DIGITAL</span>
          </div>
        )}
      </div>
    </div>
  );
};
