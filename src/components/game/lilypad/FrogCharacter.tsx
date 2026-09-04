import React, { useEffect, useState } from 'react';

interface FrogCharacterProps {
  isJumping: boolean;
  jumpPhase: 'idle' | 'takeoff' | 'apex' | 'landing';
  isHappy?: boolean;
  isError?: boolean;
  flightAngle?: number; // Direction of jump in degrees
  className?: string;
  size?: number;
}

export const FrogCharacter: React.FC<FrogCharacterProps> = ({
  isJumping,
  jumpPhase,
  isHappy = false,
  isError = false,
  flightAngle = 0,
  className = '',
  size = 72,
}) => {
  const [blink, setBlink] = useState(false);

  // Periodic natural blinking
  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 160);
    }, 3200 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, []);

  // Calculate dynamic deform scale & tilt based on jump phase & flight trajectory
  let scaleX = 1;
  let scaleY = 1;
  let rotation = 0;

  if (jumpPhase === 'takeoff') {
    // Crouch down in anticipation
    scaleX = 1.3;
    scaleY = 0.7;
    rotation = flightAngle * 0.3;
  } else if (jumpPhase === 'apex') {
    // Dynamic aerodynamic stretch at the apex with float
    scaleX = 0.82;
    scaleY = 1.28;
    rotation = flightAngle;
  } else if (jumpPhase === 'landing') {
    // Snappy squash on landing contact
    scaleX = 1.35;
    scaleY = 0.68;
    rotation = 0;
  } else if (isJumping) {
    scaleX = 0.88;
    scaleY = 1.18;
    rotation = flightAngle * 0.7;
  }

  // If moving leftwards (flight angle > 90 or < -90), mirror X scale so frog faces flight direction
  const isFacingLeft = Math.abs(flightAngle) > 90;
  const finalScaleX = isFacingLeft ? -scaleX : scaleX;

  return (
    <div
      className={`relative select-none pointer-events-none transition-transform duration-100 ease-out ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: `scale(${finalScaleX}, ${scaleY}) rotate(${isFacingLeft ? -rotation : rotation}deg)`,
        transformOrigin: 'bottom center',
      }}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="w-full h-full drop-shadow-lg overflow-visible"
      >
        <defs>
          <radialGradient id="frogSkin2D" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#86EFAC" />
            <stop offset="50%" stopColor="#4ADE80" />
            <stop offset="100%" stopColor="#16A34A" />
          </radialGradient>
          <radialGradient id="frogBelly2D" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FEF9C3" />
            <stop offset="100%" stopColor="#FDE047" />
          </radialGradient>
          <radialGradient id="frogCheek2D" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FDA4AF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#F43F5E" stopOpacity="0" />
          </radialGradient>
          <filter id="frogGlow2D" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#15803d" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Back Legs / Webbed Feet */}
        {jumpPhase === 'apex' ? (
          // Outstretched athletic leap legs
          <g fill="#16A34A" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 28 65 Q 15 80 5 85 Q 12 88 18 84 Q 25 78 32 68 Z" />
            <path d="M 68 65 Q 55 80 45 85 Q 52 88 58 84 Q 65 78 72 68 Z" />
          </g>
        ) : (
          // Folded sitting legs
          <g fill="#16A34A" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <ellipse cx="22" cy="72" rx="14" ry="10" transform="rotate(-15 22 72)" />
            <path d="M 12 78 Q 6 84 4 88 Q 12 87 18 83 Q 22 80 20 76" fill="#22C55E" />
            <ellipse cx="78" cy="72" rx="14" ry="10" transform="rotate(15 78 72)" />
            <path d="M 88 78 Q 94 84 96 88 Q 88 87 82 83 Q 78 80 80 76" fill="#22C55E" />
          </g>
        )}

        {/* Main Body */}
        <ellipse
          cx="50"
          cy="58"
          rx="32"
          ry="26"
          fill="url(#frogSkin2D)"
          stroke="#15803D"
          strokeWidth="2.5"
          filter="url(#frogGlow2D)"
        />

        {/* Belly */}
        <ellipse
          cx="50"
          cy="63"
          rx="20"
          ry="17"
          fill="url(#frogBelly2D)"
        />

        {/* Front Paws */}
        {jumpPhase === 'apex' ? (
          <g fill="#22C55E" stroke="#15803D" strokeWidth="2">
            <ellipse cx="40" cy="52" rx="5" ry="9" transform="rotate(-30 40 52)" />
            <ellipse cx="64" cy="52" rx="5" ry="9" transform="rotate(30 64 52)" />
          </g>
        ) : (
          <g fill="#22C55E" stroke="#15803D" strokeWidth="2">
            <ellipse cx="36" cy="68" rx="6" ry="8" transform="rotate(-10 36 68)" />
            <ellipse cx="64" cy="68" rx="6" ry="8" transform="rotate(10 64 68)" />
          </g>
        )}

        {/* Eye Sockets */}
        <circle cx="34" cy="32" r="14" fill="url(#frogSkin2D)" stroke="#15803D" strokeWidth="2.5" />
        <circle cx="66" cy="32" r="14" fill="url(#frogSkin2D)" stroke="#15803D" strokeWidth="2.5" />

        {/* Eye Whites */}
        <circle cx="34" cy="32" r="10" fill="#FFFFFF" />
        <circle cx="66" cy="32" r="10" fill="#FFFFFF" />

        {/* Pupils */}
        {blink ? (
          <g stroke="#15803D" strokeWidth="3" strokeLinecap="round">
            <line x1="26" y1="33" x2="42" y2="33" />
            <line x1="58" y1="33" x2="74" y2="33" />
          </g>
        ) : isHappy ? (
          <g stroke="#15803D" strokeWidth="3.5" fill="none" strokeLinecap="round">
            <path d="M 26 34 Q 34 26 42 34" />
            <path d="M 58 34 Q 66 26 74 34" />
          </g>
        ) : (
          <g>
            <circle cx="36" cy="32" r="6" fill="#1E293B" />
            <circle cx="68" cy="32" r="6" fill="#1E293B" />
            <circle cx="38" cy="30" r="2.2" fill="#FFFFFF" />
            <circle cx="70" cy="30" r="2.2" fill="#FFFFFF" />
            <circle cx="34" cy="34" r="1.2" fill="#FFFFFF" />
            <circle cx="66" cy="34" r="1.2" fill="#FFFFFF" />
          </g>
        )}

        {/* Rosy Cheeks */}
        <circle cx="24" cy="50" r="7" fill="url(#frogCheek2D)" />
        <circle cx="76" cy="50" r="7" fill="url(#frogCheek2D)" />

        {/* Mouth */}
        {isHappy ? (
          <path
            d="M 38 52 Q 50 64 62 52"
            fill="#F43F5E"
            stroke="#15803D"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        ) : isError ? (
          <path
            d="M 42 54 Q 50 49 58 54"
            fill="none"
            stroke="#15803D"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        ) : (
          <path
            d="M 40 50 Q 50 57 60 50"
            fill="none"
            stroke="#15803D"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        )}

        {/* Little Lotus Sprout Hat on Head */}
        <g transform="translate(48, 16) scale(0.65)">
          <path
            d="M 0 10 C -8 -4 8 -12 12 -2 C 14 6 6 10 0 10 Z"
            fill="#22C55E"
            stroke="#15803D"
            strokeWidth="2"
          />
          <circle cx="6" cy="0" r="2.5" fill="#F472B6" />
        </g>
      </svg>
    </div>
  );
};
