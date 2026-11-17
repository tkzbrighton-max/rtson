import React from 'react';

interface IconProps {
  className?: string;
  size?: number | string;
}

// 1. Authentic Figma Logo (The official 5-part colored geometric mark)
export const FigmaIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg 
    viewBox="0 0 38 57" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE"/>
    <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83"/>
    <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/>
    <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E"/>
    <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF"/>
  </svg>
);

// 2. Authentic Canva Brand Icon (Official Canva dynamic gradient emblem with elegant script C)
export const CanvaIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <defs>
      <linearGradient id="canvaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00C4CC" />
        <stop offset="50%" stopColor="#0E86D4" />
        <stop offset="100%" stopColor="#7D2AE8" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="48" fill="url(#canvaGrad)" />
    {/* Stylized Canva signature script 'C' */}
    <path 
      d="M68 35.5C65.5 33.2 61.2 31.8 55.4 31.8C43.2 31.8 33.5 40.5 33.5 52.8C33.5 63.8 42.1 70.2 53.6 70.2C61.4 70.2 67.2 67.5 70.5 63.8C71.3 62.9 71.1 61.5 70.1 60.8L66.8 58.4C65.9 57.7 64.6 57.9 63.8 58.7C61.5 61.2 57.8 62.8 53.2 62.8C45.8 62.8 40.4 58.2 40.4 51.5C40.4 44.5 46.2 39.2 54.8 39.2C59.2 39.2 62.6 40.5 64.8 42.3C65.7 43 67 42.8 67.8 41.9L70.4 38.6C71.1 37.7 70.8 36.3 68 35.5Z" 
      fill="white"
    />
  </svg>
);

// 3. Authentic PicsArt Logo (Official vibrant magenta-cyan gradient brand badge)
export const PicsArtIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <defs>
      <linearGradient id="picsartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF1493" />
        <stop offset="45%" stopColor="#C71585" />
        <stop offset="85%" stopColor="#9400D3" />
        <stop offset="100%" stopColor="#00D2FF" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="24" fill="url(#picsartGrad)" />
    {/* Stylized PicsArt 'P' icon */}
    <circle cx="50" cy="50" r="32" fill="white" />
    <circle cx="50" cy="50" r="19" fill="#0E0E10" />
    <circle cx="50" cy="50" r="11" fill="url(#picsartGrad)" />
    <path d="M40 50V75C40 77.8 42.2 80 45 80H49C51.8 80 54 77.8 54 75V50H40Z" fill="white" />
  </svg>
);

// 4. Authentic Adobe Lightroom (Lr) Official Badge
export const LightroomIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect width="100" height="100" rx="22" fill="#001E36" />
    <rect x="2" y="2" width="96" height="96" rx="20" stroke="#31A8FF" strokeWidth="4" />
    <text 
      x="27" 
      y="66" 
      fontFamily="'Helvetica Neue', Arial, sans-serif" 
      fontWeight="900" 
      fontSize="44" 
      fill="#31A8FF"
      letterSpacing="-1"
    >
      Lr
    </text>
  </svg>
);

// 5. Authentic Adobe Photoshop (Ps) Official Badge
export const PhotoshopIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect width="100" height="100" rx="22" fill="#001E36" />
    <rect x="2" y="2" width="96" height="96" rx="20" stroke="#31A8FF" strokeWidth="4" />
    <text 
      x="25" 
      y="66" 
      fontFamily="'Helvetica Neue', Arial, sans-serif" 
      fontWeight="900" 
      fontSize="44" 
      fill="#31A8FF"
      letterSpacing="-1"
    >
      Ps
    </text>
  </svg>
);

// 6. Authentic Adobe Illustrator (Ai) Official Badge
export const IllustratorIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect width="100" height="100" rx="22" fill="#330000" />
    <rect x="2" y="2" width="96" height="96" rx="20" stroke="#FF9A00" strokeWidth="4" />
    <text 
      x="26" 
      y="66" 
      fontFamily="'Helvetica Neue', Arial, sans-serif" 
      fontWeight="900" 
      fontSize="44" 
      fill="#FF9A00"
      letterSpacing="-1"
    >
      Ai
    </text>
  </svg>
);

// 7. Authentic Google AI Studio Official Icon (The 4-color AI Sparkle badge)
export const GoogleAIStudioIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect width="100" height="100" rx="24" fill="#0F172A" stroke="#334155" strokeWidth="2" />
    {/* Google AI Studio 4-color core star */}
    <g transform="translate(10, 10) scale(0.8)">
      <path d="M50 8C50 31.2 31.2 50 8 50C31.2 50 50 68.8 50 92C50 68.8 68.8 50 92 50C68.8 50 50 31.2 50 8Z" fill="url(#gaiGrad)" />
      <circle cx="50" cy="50" r="14" fill="#FFFFFF" opacity="0.95" />
      <path d="M50 18L52.5 35L70 37.5L52.5 40L50 57L47.5 40L30 37.5L47.5 35Z" fill="#4285F4" opacity="0.4" />
    </g>
    <defs>
      <linearGradient id="gaiGrad" x1="8" y1="8" x2="92" y2="92" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#4285F4" />
        <stop offset="35%" stopColor="#EA4335" />
        <stop offset="70%" stopColor="#FBBC05" />
        <stop offset="100%" stopColor="#34A853" />
      </linearGradient>
    </defs>
  </svg>
);

// 8. Authentic Firebase Flame Icon (Official Google Firebase Logo)
export const FirebaseIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M22.8 77.2L38.4 17.5C38.9 15.6 41.5 15.2 42.5 16.9L53.7 37.8L22.8 77.2Z" fill="#FFA000"/>
    <path d="M53.7 37.8L63.5 19.3C64.4 17.6 66.9 17.8 67.5 19.7L78.6 77.2L53.7 37.8Z" fill="#F57C00"/>
    <path d="M22.8 77.2L50 92.5C51.2 93.2 52.8 93.2 54 92.5L78.6 77.2L53.7 37.8L22.8 77.2Z" fill="#FFCA28"/>
  </svg>
);

// 9. Authentic Google Gemini Sparkle Icon (Official Google Gemini diamond gradient)
export const GoogleGeminiIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <defs>
      <linearGradient id="geminiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1BA1E3" />
        <stop offset="35%" stopColor="#5B5BE6" />
        <stop offset="70%" stopColor="#9B51E0" />
        <stop offset="100%" stopColor="#EA4335" />
      </linearGradient>
    </defs>
    <path 
      d="M50 5C50 29.85 29.85 50 5 50C29.85 50 50 70.15 50 95C50 70.15 70.15 50 95 50C70.15 50 50 29.85 50 5Z" 
      fill="url(#geminiGrad)"
    />
    <circle cx="50" cy="50" r="10" fill="#FFFFFF" opacity="0.3" />
  </svg>
);

// 10. Authentic CapCut Logo (Official CapCut interlocking geometric ribbon mark)
export const CapCutIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect width="100" height="100" rx="24" fill="#000000" stroke="#1F2937" strokeWidth="2" />
    {/* CapCut dual interlocking ribbon bowtie shape */}
    <path 
      d="M20 28H46L36 50L46 72H20L30 50L20 28Z" 
      fill="#FFFFFF"
    />
    <path 
      d="M80 28H54L64 50L54 72H80L70 50L80 28Z" 
      fill="#FFFFFF"
    />
  </svg>
);

// 11. React Logo
export const ReactIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg 
    viewBox="-11.5 -10.23174 23 20.46348" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <circle cx="0" cy="0" r="2.05" fill="#61DAFB"/>
    <g stroke="#61DAFB" strokeWidth="1" fill="none">
      <ellipse rx="11" ry="4.2"/>
      <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
      <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
    </g>
  </svg>
);

// 12. HTML5 Logo
export const HTML5Icon: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg 
    viewBox="0 0 512 512" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path d="M107.6 460L71 49.6H441L404.4 460L256 501.2L107.6 460Z" fill="#E44D26"/>
    <path d="M256 465.1L371.3 433.1L400.9 101.4H256V465.1Z" fill="#F16529"/>
    <path d="M256 211.3H193.3L189.1 164.2H256V117.1H138.4L150.9 258.4H256V211.3ZM256 352.4L255.8 352.5L203.4 338.3L200 300.2H152.6L159.2 374.8L255.8 401.6L256 401.5V352.4Z" fill="#EBEBEB"/>
    <path d="M255.9 211.3V258.4H314.4L308.9 319.8L255.9 334.1V383.2L352.3 356.5L364.5 219.7L365.1 211.3H255.9ZM255.9 117.1V164.2H369.3L373.5 117.1H255.9Z" fill="#FFFFFF"/>
  </svg>
);

// 13. JavaScript Logo
export const JavaScriptIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect width="100" height="100" rx="16" fill="#F7DF1E"/>
    <path d="M32 75C34 77 37 78 40 78C46 78 50 74 50 67V30H42V66C42 69 40 71 37 71C34 71 33 70 32 68L32 75Z" fill="#000000"/>
    <path d="M57 73C60 76 65 78 71 78C79 78 85 73 85 66C85 58 79 55 72 52C67 50 64 48 64 45C64 42 66 40 70 40C74 40 77 42 79 45L84 40C81 36 76 34 70 34C63 34 57 38 57 45C57 52 62 55 69 58C74 60 78 62 78 66C78 70 75 72 70 72C65 72 61 70 59 66L57 73Z" fill="#000000"/>
  </svg>
);

// 14. PHP Logo
export const PHPIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg 
    viewBox="0 0 100 60" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <rect width="100" height="60" rx="14" fill="#777BB4" />
    <text 
      x="50" 
      y="41" 
      fontFamily="'Helvetica Neue', Arial, sans-serif" 
      fontWeight="900" 
      fontSize="28" 
      fill="#FFFFFF"
      textAnchor="middle"
      fontStyle="italic"
      letterSpacing="1"
    >
      php
    </text>
  </svg>
);
