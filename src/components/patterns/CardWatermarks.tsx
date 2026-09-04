import React from 'react';

interface IllustrationProps {
  className?: string;
  style?: React.CSSProperties;
}

/** 1. Welcome Banner Hero Illustration (Full Color Chibi Art) */
export const WelcomeBannerIllustration: React.FC<IllustrationProps> = ({ className = '' }) => (
  <div className={`w-64 md:w-80 h-36 flex items-center justify-end pointer-events-none select-none ${className}`}>
    <svg viewBox="0 0 320 150" className="w-full h-full" fill="none">
      {/* Letter Blocks (left side) */}
      <g>
        <rect x="10" y="80" width="28" height="28" rx="6" fill="#4ADE80" stroke="#166534" strokeWidth="2" />
        <text x="24" y="100" textAnchor="middle" fontSize="17" fontWeight="900" fill="#052E16">A</text>

        <rect x="44" y="66" width="26" height="26" rx="6" fill="#60A5FA" stroke="#1E40AF" strokeWidth="2" />
        <text x="57" y="84" textAnchor="middle" fontSize="15" fontWeight="900" fill="#1E3A8A">B</text>

        <rect x="76" y="86" width="24" height="24" rx="5" fill="#F472B6" stroke="#9D174D" strokeWidth="2" />
        <text x="88" y="103" textAnchor="middle" fontSize="14" fontWeight="900" fill="#831843">C</text>
      </g>

      {/* Toy Keyboard (center-left) */}
      <g transform="translate(108, 72)">
        <rect x="0" y="0" width="70" height="34" rx="7" fill="#F3F4F6" stroke="#374151" strokeWidth="2.5" />
        <rect x="4" y="4" width="62" height="10" rx="3" fill="#E5E7EB" />
        <rect x="6" y="6" width="7" height="5" rx="1.5" fill="#3B82F6" />
        <rect x="15" y="6" width="7" height="5" rx="1.5" fill="#EF4444" />
        <rect x="24" y="6" width="7" height="5" rx="1.5" fill="#10B981" />
        <rect x="33" y="6" width="7" height="5" rx="1.5" fill="#F59E0B" />
        <rect x="42" y="6" width="7" height="5" rx="1.5" fill="#8B5CF6" />
        <rect x="51" y="6" width="12" height="5" rx="1.5" fill="#EC4899" />
        <rect x="14" y="18" width="42" height="9" rx="2.5" fill="#F97316" stroke="#C2410C" strokeWidth="1" />
      </g>

      {/* Unified Chibi Bull Calf (right side — all parts grouped together) */}
      <g transform="translate(180, 12)">
        {/* Tail (behind body) */}
        <path d="M 20 62 Q 5 48 2 60" stroke="#7C2D12" strokeWidth="3" strokeLinecap="round" />
        <circle cx="2" cy="62" r="4" fill="#C2410C" />

        {/* Body */}
        <ellipse cx="55" cy="65" rx="30" ry="22" fill="#EA580C" stroke="#7C2D12" strokeWidth="2.5" />
        <ellipse cx="55" cy="70" rx="20" ry="13" fill="#F97316" />

        {/* Running Legs (under body) */}
        <path d="M 35 82 L 28 100 M 48 84 L 56 102 M 64 84 L 78 100 M 76 82 L 88 96" stroke="#7C2D12" strokeWidth="4.5" strokeLinecap="round" />

        {/* Head (attached to body — positioned on the right side) */}
        <circle cx="82" cy="46" r="20" fill="#EA580C" stroke="#7C2D12" strokeWidth="2.5" />

        {/* Left ear */}
        <ellipse cx="72" cy="38" rx="6.5" ry="4.5" fill="#C2410C" stroke="#7C2D12" strokeWidth="1.5" transform="rotate(-20 72 38)" />

        {/* Horns */}
        <path d="M 76 30 Q 72 18 78 20 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
        <path d="M 88 28 Q 92 16 95 19 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />

        {/* Snout */}
        <ellipse cx="92" cy="50" rx="10" ry="6.5" fill="#FFEDD5" stroke="#F97316" strokeWidth="1.5" />

        {/* Nostrils */}
        <circle cx="89" cy="49" r="1.5" fill="#7C2D12" />
        <circle cx="95" cy="49" r="1.5" fill="#7C2D12" />

        {/* Eyes */}
        <ellipse cx="82" cy="41" rx="3" ry="3.5" fill="#1E293B" />
        <circle cx="81" cy="39.5" r="1.2" fill="white" />

        {/* Rosy cheek */}
        <circle cx="77" cy="48" r="3" fill="#F87171" opacity="0.7" />

        {/* Nose ring */}
        <circle cx="92" cy="54" r="3" stroke="#F59E0B" strokeWidth="1.5" fill="none" />
      </g>
    </svg>
  </div>
);

/** 2. Streak Card Icon (Chibi Bull with Flame) */
export const StreakIllustration: React.FC = () => (
  <svg viewBox="0 0 64 64" className="w-full h-full p-1" fill="none">
    {/* Background Glow */}
    <circle cx="32" cy="32" r="28" fill="#FFF7ED" />
    {/* Flame Badge */}
    <path d="M 44 26 Q 52 14 46 32 Q 54 28 42 46 Q 30 46 36 34 Q 32 38 36 28 Z" fill="#F97316" stroke="#C2410C" strokeWidth="1.5" />
    <path d="M 42 32 Q 47 22 44 36 Z" fill="#FDE047" />
    {/* Chibi Bull Face */}
    <circle cx="26" cy="34" r="14" fill="#EA580C" stroke="#7C2D12" strokeWidth="2" />
    <ellipse cx="26" cy="38" rx="8" ry="5.5" fill="#FFEDD5" />
    {/* Eyes */}
    <circle cx="22" cy="31" r="2" fill="#1E293B" />
    <circle cx="30" cy="31" r="2" fill="#1E293B" />
    <circle cx="21.5" cy="30" r="0.8" fill="white" />
    <circle cx="29.5" cy="30" r="0.8" fill="white" />
    {/* Horns */}
    <path d="M 18 22 Q 13 14 20 16 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
    <path d="M 34 22 Q 39 14 32 16 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
  </svg>
);

/** 3. Stars Card Icon (Chibi Bull with Gold Star) */
export const StarsIllustration: React.FC = () => (
  <svg viewBox="0 0 64 64" className="w-full h-full p-1" fill="none">
    <circle cx="32" cy="32" r="28" fill="#FEFCE8" />
    {/* Shiny Gold Star */}
    <path d="M 44 14 L 46.5 21.5 L 54 22.5 L 48.5 28 L 50 35.5 L 44 32 L 38 35.5 L 39.5 28 L 34 22.5 L 41.5 21.5 Z" fill="#EAB308" stroke="#CA8A04" strokeWidth="1.5" />
    {/* Chibi Bull */}
    <circle cx="24" cy="36" r="14" fill="#EA580C" stroke="#7C2D12" strokeWidth="2" />
    <ellipse cx="24" cy="40" rx="8" ry="5.5" fill="#FFEDD5" />
    <circle cx="20" cy="33" r="2" fill="#1E293B" />
    <circle cx="28" cy="33" r="2" fill="#1E293B" />
    <circle cx="19.5" cy="32" r="0.8" fill="white" />
    <circle cx="27.5" cy="32" r="0.8" fill="white" />
    <path d="M 16 24 Q 11 16 18 18 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
    <path d="M 32 24 Q 37 16 30 18 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
  </svg>
);

/** 4. Lessons Card Icon (Chibi Bull Reading Book) */
export const LessonsIllustration: React.FC = () => (
  <svg viewBox="0 0 64 64" className="w-full h-full p-1" fill="none">
    <circle cx="32" cy="32" r="28" fill="#FAF5FF" />
    {/* Open Book */}
    <path d="M 14 44 Q 32 36 32 52 Q 32 36 50 44 L 47 56 Q 32 48 32 60 Q 32 48 17 56 Z" fill="#A855F7" stroke="#6B21A8" strokeWidth="1.5" />
    {/* Chibi Bull Head looking down */}
    <circle cx="32" cy="26" r="13" fill="#EA580C" stroke="#7C2D12" strokeWidth="2" />
    <ellipse cx="32" cy="30" rx="7.5" ry="5" fill="#FFEDD5" />
    <path d="M 27 24 Q 30 27 32 24 M 32 24 Q 34 27 37 24" stroke="#1E293B" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M 24 15 Q 19 8 26 10 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
    <path d="M 40 15 Q 45 8 38 10 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
  </svg>
);

/** 5. Sessions Card Icon (Chibi Bull with Trend Graph) */
export const SessionsIllustration: React.FC = () => (
  <svg viewBox="0 0 64 64" className="w-full h-full p-1" fill="none">
    <circle cx="32" cy="32" r="28" fill="#EFF6FF" />
    {/* Trend Line */}
    <path d="M 12 48 L 26 34 L 38 42 L 52 20" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <polygon points="54,20 46,20 52,26" fill="#3B82F6" />
    {/* Chibi Bull */}
    <circle cx="26" cy="28" r="12" fill="#EA580C" stroke="#7C2D12" strokeWidth="2" />
    <ellipse cx="26" cy="32" rx="7" ry="4.5" fill="#FFEDD5" />
    <circle cx="22" cy="26" r="1.8" fill="#1E293B" />
    <circle cx="30" cy="26" r="1.8" fill="#1E293B" />
    <path d="M 18 18 Q 13 10 20 12 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
    <path d="M 34 18 Q 39 10 32 12 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
  </svg>
);

/** 6. Continue Learning Icon */
export const ContinueLearningIllustration: React.FC = () => (
  <svg viewBox="0 0 64 64" className="w-full h-full p-1" fill="none">
    <circle cx="32" cy="32" r="28" fill="#F0FDF4" />
    {/* Green Satchel / Scroll */}
    <rect x="30" y="34" width="22" height="18" rx="4" fill="#22C55E" stroke="#15803D" strokeWidth="1.5" />
    <path d="M 22 26 L 42 42" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" />
    {/* Chibi Bull */}
    <circle cx="24" cy="26" r="12" fill="#EA580C" stroke="#7C2D12" strokeWidth="2" />
    <ellipse cx="24" cy="30" rx="7" ry="4.5" fill="#FFEDD5" />
    <circle cx="20" cy="24" r="1.8" fill="#1E293B" />
    <circle cx="28" cy="24" r="1.8" fill="#1E293B" />
  </svg>
);

/** 7. Play Game Icon */
export const PlayGameIllustration: React.FC = () => (
  <svg viewBox="0 0 64 64" className="w-full h-full p-1" fill="none">
    <circle cx="32" cy="32" r="28" fill="#FDF2F8" />
    {/* Rocket Invader */}
    <path d="M 38 16 Q 48 16 48 30 L 42 42 L 34 42 Z" fill="#EC4899" stroke="#BE185D" strokeWidth="1.5" />
    <polygon points="42,42 46,48 38,48" fill="#F59E0B" />
    {/* Chibi Bull */}
    <circle cx="24" cy="34" r="12" fill="#EA580C" stroke="#7C2D12" strokeWidth="2" />
    <ellipse cx="24" cy="38" rx="7" ry="4.5" fill="#FFEDD5" />
    <circle cx="20" cy="32" r="1.8" fill="#1E293B" />
    <circle cx="28" cy="32" r="1.8" fill="#1E293B" />
  </svg>
);

/** 8. Quick Practice Icon */
export const QuickPracticeIllustration: React.FC = () => (
  <svg viewBox="0 0 64 64" className="w-full h-full p-1" fill="none">
    <circle cx="32" cy="32" r="28" fill="#FFF7ED" />
    {/* Mini Desk & Keyboard */}
    <rect x="12" y="44" width="40" height="6" rx="2" fill="#D97706" stroke="#78350F" strokeWidth="1" />
    <rect x="20" y="38" width="24" height="6" rx="1.5" fill="#38BDF8" stroke="#0284C7" strokeWidth="1" />
    {/* Chibi Bull with Glasses */}
    <circle cx="32" cy="24" r="12" fill="#EA580C" stroke="#7C2D12" strokeWidth="2" />
    <circle cx="28" cy="24" r="3.5" fill="none" stroke="#38BDF8" strokeWidth="1.5" />
    <circle cx="36" cy="24" r="3.5" fill="none" stroke="#38BDF8" strokeWidth="1.5" />
    <ellipse cx="32" cy="29" rx="6" ry="4" fill="#FFEDD5" />
  </svg>
);

/** 9. Recent Sessions Icon */
export const RecentSessionsIllustration: React.FC = () => (
  <div className="w-48 h-28 flex items-center justify-end pointer-events-none select-none">
    <svg viewBox="0 0 200 120" className="w-full h-full" fill="none">
      <ellipse cx="100" cy="90" rx="75" ry="16" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5" />
      <g transform="translate(15, 20)">
        <circle cx="40" cy="35" r="15" fill="#EA580C" stroke="#7C2D12" strokeWidth="2" />
        <ellipse cx="40" cy="40" rx="9" ry="6" fill="#FFEDD5" />
        <circle cx="35" cy="32" r="2" fill="#1E293B" />
        <circle cx="45" cy="32" r="2" fill="#1E293B" />
        <g transform="translate(90, 5)">
          <circle cx="30" cy="35" r="14" fill="#F97316" stroke="#7C2D12" strokeWidth="2" />
          <ellipse cx="30" cy="40" rx="8" ry="5.5" fill="#FFEDD5" />
          <circle cx="26" cy="32" r="1.8" fill="#1E293B" />
          <circle cx="34" cy="32" r="1.8" fill="#1E293B" />
        </g>
      </g>
    </svg>
  </div>
);

/** 10. Weak Key Icon */
export const WeakKeyIllustration: React.FC = () => (
  <div className="w-48 h-28 flex items-center justify-end pointer-events-none select-none">
    <svg viewBox="0 0 200 120" className="w-full h-full" fill="none">
      <g transform="translate(10, 25)">
        <rect x="0" y="0" width="22" height="22" rx="4" fill="#EF4444" stroke="#991B1B" strokeWidth="1.5" />
        <text x="11" y="16" textAnchor="middle" fontSize="13" fontWeight="900" fill="white">A</text>
        <rect x="28" y="20" width="22" height="22" rx="4" fill="#F87171" stroke="#B91C1C" strokeWidth="1.5" />
        <text x="39" y="36" textAnchor="middle" fontSize="13" fontWeight="900" fill="white">K</text>
      </g>
      <g transform="translate(90, 15)">
        <path d="M 15 80 C 8 45, 30 30, 60 30 C 85 30, 105 48, 112 80 Z" fill="#C2410C" stroke="#7C2D12" strokeWidth="2" />
        <polygon points="25,50 -5,62 12,74" fill="#EA580C" stroke="#7C2D12" strokeWidth="1.5" />
        <path d="M 20 50 Q 5 24 -30 35 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
      </g>
    </svg>
  </div>
);
