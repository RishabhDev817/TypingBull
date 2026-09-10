import { forwardRef } from 'react';
import { Zap, Target, Flame, Trophy, Award } from 'lucide-react';

export interface SocialScoreCardProps {
  wpm: number;
  accuracy: number;
  streak?: number;
  modeName?: string;
  rankTitle?: string;
  className?: string;
}

/**
 * Derives a gamified tier title and color theme based on WPM.
 */
function getPerformanceTier(wpm: number) {
  if (wpm >= 90) {
    return {
      title: 'CYBER TITAN',
      badgeBg: 'rgba(239, 68, 68, 0.15)',
      badgeBorder: 'rgba(239, 68, 68, 0.4)',
      badgeText: '#F87171',
      icon: Flame,
      glowColor: 'rgba(239, 68, 68, 0.45)',
    };
  }
  if (wpm >= 70) {
    return {
      title: 'LIGHTNING SPEED',
      badgeBg: 'rgba(245, 158, 11, 0.15)',
      badgeBorder: 'rgba(245, 158, 11, 0.4)',
      badgeText: '#FBBF24',
      icon: Zap,
      glowColor: 'rgba(245, 158, 11, 0.45)',
    };
  }
  if (wpm >= 50) {
    return {
      title: 'VELOCITY MASTER',
      badgeBg: 'rgba(16, 185, 129, 0.15)',
      badgeBorder: 'rgba(16, 185, 129, 0.4)',
      badgeText: '#34D399',
      icon: Trophy,
      glowColor: 'rgba(16, 185, 129, 0.45)',
    };
  }
  if (wpm >= 35) {
    return {
      title: 'PRECISION STRIKER',
      badgeBg: 'rgba(56, 189, 248, 0.15)',
      badgeBorder: 'rgba(56, 189, 248, 0.4)',
      badgeText: '#38BDF8',
      icon: Target,
      glowColor: 'rgba(56, 189, 248, 0.45)',
    };
  }
  return {
    title: 'RISING PRODIGY',
    badgeBg: 'rgba(168, 85, 247, 0.15)',
    badgeBorder: 'rgba(168, 85, 247, 0.4)',
    badgeText: '#C084FC',
    icon: Award,
    glowColor: 'rgba(168, 85, 247, 0.45)',
  };
}

/**
 * OfficialTypingBullLogo — Raw, self-contained inline SVG of Bully the Bull,
 * the official website mascot logo.
 * Renders synchronously without external URLs or CORS risks for html2canvas/html-to-image.
 */
const OfficialTypingBullLogo = ({
  size = 36,
  className = '',
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    viewBox="0 0 96 96"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 ${className}`}
  >
    {/* Left Horn */}
    <path
      d="M28 28 Q20 12 30 15 Q36 18 32 28 Z"
      fill="#F59E0B"
      stroke="#B45309"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path d="M27 24 Q23 15 29 17 Z" fill="#FCD34D" />

    {/* Right Horn */}
    <path
      d="M68 28 Q76 12 66 15 Q60 18 64 28 Z"
      fill="#F59E0B"
      stroke="#B45309"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path d="M69 24 Q73 15 67 17 Z" fill="#FCD34D" />

    {/* Left Ear */}
    <g>
      <ellipse cx="23" cy="38" rx="8.5" ry="6.5" fill="#9A3412" stroke="#7C2D12" strokeWidth="2" />
      <ellipse cx="23" cy="38" rx="5" ry="3.5" fill="#F97316" />
    </g>

    {/* Right Ear */}
    <g>
      <ellipse cx="73" cy="38" rx="8.5" ry="6.5" fill="#9A3412" stroke="#7C2D12" strokeWidth="2" />
      <ellipse cx="73" cy="38" rx="5" ry="3.5" fill="#F97316" />
    </g>

    {/* Main Round Head */}
    <circle cx="48" cy="48" r="27" fill="#C2410C" stroke="#7C2D12" strokeWidth="2.5" />
    <path d="M 28 36 A 24 24 0 0 1 68 36 A 27 27 0 0 0 28 36 Z" fill="#EA580C" />

    {/* Face lighter area */}
    <ellipse cx="48" cy="52" rx="19" ry="15.5" fill="#FB923C" stroke="#C2410C" strokeWidth="1.5" />

    {/* Snout */}
    <ellipse cx="48" cy="53" rx="13" ry="8.5" fill="#FFEDD5" stroke="#F97316" strokeWidth="1.5" />

    {/* Nostrils */}
    <ellipse cx="43.5" cy="52" rx="2.5" ry="2" fill="#7C2D12" />
    <ellipse cx="52.5" cy="52" rx="2.5" ry="2" fill="#7C2D12" />

    {/* Rosy Cheeks */}
    <circle cx="29" cy="50" r="4.5" fill="#F87171" opacity="0.7" />
    <circle cx="67" cy="50" r="4.5" fill="#F87171" opacity="0.7" />

    {/* Happy Eyes */}
    <path d="M34 43 Q39 36 44 43" stroke="#1F2937" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M52 43 Q57 36 62 43" stroke="#1F2937" strokeWidth="3" fill="none" strokeLinecap="round" />

    {/* Cheerful Mouth */}
    <g>
      <path d="M39 54 Q48 64 57 54 Z" fill="#EF4444" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
      <path d="M43 57 Q48 54 53 57" fill="#FCA5A5" />
    </g>

    {/* Gold Nose Ring with specular glint */}
    <circle cx="48" cy="57" r="3.5" stroke="#F59E0B" strokeWidth="2" fill="none" />
    <circle cx="46.5" cy="55.5" r="0.8" fill="white" />
  </svg>
);

/**
 * SocialScoreCard — A premium, glassmorphic card ready for social sharing
 * (optimized for 1:1 and 4:5 feeds like Instagram and LinkedIn).
 */
export const SocialScoreCard = forwardRef<HTMLDivElement, SocialScoreCardProps>(
  ({ wpm, accuracy, streak, rankTitle, className = '' }, ref) => {
    const tier = getPerformanceTier(wpm);
    const TierIcon = tier.icon;
    const effectiveRank = rankTitle || tier.title;

    // Wordle-style score blocks
    const totalBlocks = 7;
    const speedRatio = Math.min(1, Math.max(0, wpm / 90));
    const accuracyRatio = Math.min(1, Math.max(0, accuracy / 100));
    const compositeScore = accuracyRatio * 0.65 + speedRatio * 0.35;
    const filledBlocks = Math.max(1, Math.min(totalBlocks, Math.round(compositeScore * totalBlocks)));

    return (
      <div
        ref={ref}
        id="typingbull-social-card"
        className={`relative overflow-hidden select-none text-white font-sans ${className}`}
        style={{
          width: '460px',
          minWidth: '460px',
          height: '460px',
          minHeight: '460px',
          aspectRatio: '1 / 1',
          background: 'linear-gradient(145deg, #0B0F19 0%, #0F172A 50%, #090D16 100%)',
          borderRadius: '32px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
        }}
      >
        {/* Glowing Background Ambience */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-60px',
            width: '240px',
            height: '240px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.28) 0%, rgba(16, 185, 129, 0) 70%)',
            filter: 'blur(35px)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-70px',
            left: '-60px',
            width: '260px',
            height: '260px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${tier.glowColor} 0%, rgba(0, 0, 0, 0) 70%)`,
            filter: 'blur(45px)',
            pointerEvents: 'none',
          }}
        />

        {/* Subtle geometric dot grid pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            pointerEvents: 'none',
            opacity: 0.6,
          }}
        />

        {/* ─── Top Row: Brand & Mode ─── */}
        <div
          className="relative z-10"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            whiteSpace: 'nowrap',
          }}
        >
          {/* Official Brand Logo + Title */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
          >
            <div
              className="w-11 h-11 rounded-2xl p-0.5 flex items-center justify-center shrink-0 shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 50%, #2563EB 100%)',
                boxShadow: '0 4px 16px rgba(124, 58, 237, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.3)',
                flexShrink: 0,
              }}
            >
              <OfficialTypingBullLogo size={36} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
              <span
                style={{
                  fontWeight: 900,
                  fontSize: '24px',
                  letterSpacing: '-0.02em',
                  color: '#FFFFFF',
                  whiteSpace: 'nowrap',
                  lineHeight: '28px',
                }}
              >
                Typing<span style={{ color: '#C084FC' }}>Bull</span>
              </span>
            </div>
          </div>

          {/* Performance Tier Pill (Single-line constraint) */}
          <div
            style={{
              background: tier.badgeBg,
              border: `1px solid ${tier.badgeBorder}`,
              borderRadius: '9999px',
              padding: '6px 14px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            <TierIcon size={14} color={tier.badgeText} strokeWidth={2.6} style={{ flexShrink: 0 }} />
            <span
              style={{
                color: tier.badgeText,
                fontSize: '11px',
                fontWeight: 900,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                display: 'inline-block',
                lineHeight: '14px',
              }}
            >
              {effectiveRank}
            </span>
          </div>
        </div>

        {/* ─── Center: Huge Glowing WPM & Core Metrics ─── */}
        <div
          className="relative z-10 text-center my-auto py-2"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          {/* WPM Title & Glow Display */}
          <div className="relative inline-block" style={{ whiteSpace: 'nowrap' }}>
            <span
              style={{
                fontSize: '78px',
                lineHeight: '80px',
                fontWeight: 900,
                letterSpacing: '-0.04em',
                background: 'linear-gradient(180deg, #FFFFFF 20%, #E2E8F0 60%, #94A3B8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 25px rgba(255, 255, 255, 0.25))',
                fontVariantNumeric: 'tabular-nums',
                display: 'inline-block',
                whiteSpace: 'nowrap',
              }}
            >
              {Math.round(wpm)}
            </span>
            <span
              style={{
                fontSize: '22px',
                lineHeight: '24px',
                fontWeight: 900,
                letterSpacing: '0.04em',
                color: '#38BDF8',
                marginLeft: '8px',
                textTransform: 'uppercase',
                verticalAlign: 'super',
                textShadow: '0 0 16px rgba(56, 189, 248, 0.5)',
                whiteSpace: 'nowrap',
                display: 'inline-block',
              }}
            >
              WPM
            </span>
          </div>

          <div
            style={{
              fontSize: '11px',
              lineHeight: '14px',
              fontWeight: 800,
              letterSpacing: '0.15em',
              color: '#64748B',
              textTransform: 'uppercase',
              marginTop: '4px',
              whiteSpace: 'nowrap',
            }}
          >
            WORDS PER MINUTE
          </div>

          {/* Secondary Badges (Accuracy, Streak/Rating) - Fixed min-width and rigid flex gap */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              marginTop: '16px',
              width: '100%',
              whiteSpace: 'nowrap',
            }}
          >
            {/* Accuracy Pill */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '16px',
                padding: '10px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                minWidth: '155px',
                boxSizing: 'border-box',
                flexShrink: 0,
                whiteSpace: 'nowrap',
              }}
            >
              <Target size={18} color="#10B981" strokeWidth={2.4} style={{ flexShrink: 0 }} />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px',
                  textAlign: 'left',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    display: 'block',
                    fontSize: '9px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: '#94A3B8',
                    letterSpacing: '0.08em',
                    lineHeight: '12px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Accuracy
                </span>
                <span
                  style={{
                    display: 'block',
                    fontSize: '16px',
                    fontWeight: 900,
                    color: '#10B981',
                    letterSpacing: '-0.02em',
                    lineHeight: '18px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {typeof accuracy === 'number' ? accuracy.toFixed(accuracy % 1 === 0 ? 0 : 1) : accuracy}%
                </span>
              </div>
            </div>

            {/* Streak or Speed Rating Pill */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '16px',
                padding: '10px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                minWidth: '155px',
                boxSizing: 'border-box',
                flexShrink: 0,
                whiteSpace: 'nowrap',
              }}
            >
              <Zap size={18} color="#F59E0B" strokeWidth={2.4} style={{ flexShrink: 0 }} />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px',
                  textAlign: 'left',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    display: 'block',
                    fontSize: '9px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: '#94A3B8',
                    letterSpacing: '0.08em',
                    lineHeight: '12px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {streak ? 'Streak' : 'Speed Rating'}
                </span>
                <span
                  style={{
                    display: 'block',
                    fontSize: '16px',
                    fontWeight: 900,
                    color: '#FBBF24',
                    letterSpacing: '-0.02em',
                    lineHeight: '18px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {streak ? `${streak} keys` : `${Math.round(wpm * 5)} CPM`}
                </span>
              </div>
            </div>
          </div>

          {/* Wordle-Style Visual Block Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginTop: '18px',
              whiteSpace: 'nowrap',
            }}
          >
            {Array.from({ length: totalBlocks }).map((_, i) => {
              const isFilled = i < filledBlocks;
              return (
                <div
                  key={i}
                  style={{
                    width: '32px',
                    height: '10px',
                    borderRadius: '4px',
                    backgroundColor: isFilled ? '#10B981' : 'rgba(255, 255, 255, 0.1)',
                    boxShadow: isFilled ? '0 0 10px rgba(16, 185, 129, 0.5)' : 'none',
                    border: isFilled ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(255, 255, 255, 0.05)',
                    flexShrink: 0,
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* ─── Bottom CTA Bar ─── */}
        <div
          className="relative z-10"
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.09)',
            borderRadius: '18px',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            width: '100%',
          }}
        >
          <span
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: '#CBD5E1',
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              lineHeight: '16px',
            }}
          >
            Can you beat my score?
          </span>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '9999px',
              padding: '4px 12px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontSize: '11px',
                fontWeight: 900,
                color: '#34D399',
                letterSpacing: '0.02em',
                whiteSpace: 'nowrap',
                lineHeight: '14px',
              }}
            >
              typingbull.com
            </span>
          </div>
        </div>
      </div>
    );
  }
);

SocialScoreCard.displayName = 'SocialScoreCard';
