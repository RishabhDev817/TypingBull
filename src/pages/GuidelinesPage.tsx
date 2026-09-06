import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Hand, Sparkles } from 'lucide-react';
import { KeyboardDiagram, FINGER_COLORS, FINGER_SYMBOLS } from '../components/keyboard/KeyboardDiagram';
import { FingerGuide } from '../components/keyboard/FingerGuide';
import { Mascot } from '../components/Mascot';
import { soundEngine } from '../utils/audio';
import { useI18n } from '../context/I18nContext';

const FINGER_MAP_DATA = [
  {
    idx: 0,
    handKey: 'guide.leftHand',
    fingerKey: 'guide.pinky',
    homeKey: 'A',
    keys: ['A', 'Q', 'Z', '1', '`', 'Tab', 'Caps', 'Shift'],
  },
  {
    idx: 1,
    handKey: 'guide.leftHand',
    fingerKey: 'guide.ring',
    homeKey: 'S',
    keys: ['S', 'W', 'X', '2'],
  },
  {
    idx: 2,
    handKey: 'guide.leftHand',
    fingerKey: 'guide.middle',
    homeKey: 'D',
    keys: ['D', 'E', 'C', '3'],
  },
  {
    idx: 3,
    handKey: 'guide.leftHand',
    fingerKey: 'guide.index',
    homeKey: 'F',
    keys: ['F', 'R', 'T', 'V', 'B', 'G', '4', '5'],
  },
  {
    idx: 4,
    handKey: 'guide.rightHand',
    fingerKey: 'guide.index',
    homeKey: 'J',
    keys: ['J', 'Y', 'U', 'N', 'M', 'H', '6', '7'],
  },
  {
    idx: 5,
    handKey: 'guide.rightHand',
    fingerKey: 'guide.middle',
    homeKey: 'K',
    keys: ['K', 'I', ',', '8'],
  },
  {
    idx: 6,
    handKey: 'guide.rightHand',
    fingerKey: 'guide.ring',
    homeKey: 'L',
    keys: ['L', 'O', '.', '9'],
  },
  {
    idx: 7,
    handKey: 'guide.rightHand',
    fingerKey: 'guide.pinky',
    homeKey: ';',
    keys: [';', 'P', '/', '0', '-', '=', '[', ']', "'", 'Enter', 'Shift'],
  },
];

export const GuidelinesPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [hoveredFingerIdx, setHoveredFingerIdx] = useState<number | null>(null);
  const [colorblindAssist, setColorblindAssist] = useState(true);
  const [showHands, setShowHands] = useState(true);

  const tips = [
    { emoji: '🪑', title: t('guide.tip.posture.title'), text: t('guide.tip.posture.desc'), color: '#2196F3' },
    { emoji: '🖐️', title: t('guide.tip.wrist.title'), text: t('guide.tip.wrist.desc'), color: '#4CAF50' },
    { emoji: '🏠', title: t('guide.tip.homeRow.title'), text: t('guide.tip.homeRow.desc'), color: '#FF9800' },
    { emoji: '👀', title: t('guide.tip.eyes.title'), text: t('guide.tip.eyes.desc'), color: '#9C27B0' },
    { emoji: '🎯', title: t('guide.tip.accuracy.title'), text: t('guide.tip.accuracy.desc'), color: '#FF4081' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 80, damping: 12 } },
  };

  const leftHandFingers = FINGER_MAP_DATA.filter(f => f.handKey === 'guide.leftHand');
  const rightHandFingers = FINGER_MAP_DATA.filter(f => f.handKey === 'guide.rightHand');

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto px-4 py-6 md:py-10"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center mb-8">
        <Mascot mood="thinking" size="md" className="mb-2" />
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white drop-shadow-sm tracking-tight leading-tight">
          {t('guide.title')}
        </h1>
        <p className="text-slate-800 dark:text-slate-200 text-sm md:text-base mt-2 max-w-lg mx-auto font-bold leading-relaxed drop-shadow-sm">
          {t('guide.subtitle')}
        </p>
      </motion.div>

      {/* Keyboard Diagram Card (Front-Lit 3D Tactile Panel) */}
      <motion.div variants={itemVariants} className="card-frontlit p-5 md:p-8 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold text-ink">{t('guide.keyboardTitle')}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Home Row Touch Anchors Toggle */}
            <button
              onClick={() => {
                soundEngine.playPop();
                setShowHands(prev => !prev);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                showHands
                  ? 'bg-sky-blue/15 border-sky-blue text-sky-blue dark:text-sky-400 shadow-sm'
                  : 'bg-canvas/80 border-hairline text-mute hover:text-ink'
              }`}
              title="Toggle home row resting touch anchors on keyboard"
            >
              <Hand className="w-3.5 h-3.5" />
              <span>{t('guide.touchAnchors')}: {showHands ? 'ON' : 'OFF'}</span>
            </button>

            {/* Colorblind / Tactile Assist Toggle */}
            <button
              onClick={() => {
                soundEngine.playPop();
                setColorblindAssist(prev => !prev);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                colorblindAssist
                  ? 'bg-primary/15 border-primary text-primary-dark dark:text-primary-light shadow-sm'
                  : 'bg-canvas/80 border-hairline text-mute hover:text-ink'
              }`}
              title="Toggle tactile patterns and shape symbols for colorblind accessibility"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('guide.tactileAssist')}: {colorblindAssist ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>

        <KeyboardDiagram
          highlightKeys={['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';']}
          showPatterns={true}
          showSymbols={colorblindAssist}
          showHandShadows={showHands}
          onKeyHover={(_key, fingerIdx) => {
            setHoveredFingerIdx(fingerIdx !== undefined ? fingerIdx : null);
          }}
        />

        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-body mt-5 pt-3 border-t border-hairline/60">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            {t('guide.homeRowNotice')}
          </span>
          <span className="text-hairline-strong">•</span>
          <span>{t('guide.distinctColors')}</span>
        </div>
      </motion.div>

      {/* Prominent Finger → Key Map (Colorblind & Accessibility First) */}
      <motion.div variants={itemVariants} className="card-frontlit p-5 md:p-7 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base md:text-lg font-black text-ink flex items-center gap-2">
              <span>🗺️ {t('guide.map.title')}</span>
              <span className="text-xs font-bold bg-primary/10 text-primary-dark dark:text-primary-light px-2.5 py-0.5 rounded-full border border-primary/20">
                {t('guide.map.badge')}
              </span>
            </h2>
            <p className="text-xs text-body font-semibold mt-0.5">
              {t('guide.map.desc')}
            </p>
          </div>
          <div className="text-xs font-mono text-mute hidden sm:block">
            {t('guide.map.hover')}
          </div>
        </div>

        {/* Hand Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Hand Section */}
          <div className="bg-canvas/60 rounded-2xl p-3.5 border border-hairline flex flex-col gap-2.5">
            <div className="flex items-center justify-between px-1 pb-1 border-b border-hairline/70">
              <span className="text-xs font-black text-ink uppercase tracking-wider flex items-center gap-1.5">
                <span>🤚 {t('guide.leftHand')}</span>
              </span>
              <span className="text-[11px] font-bold text-mute">{t('guide.homeAnchor')}: A - S - D - F</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {leftHandFingers.map((f) => {
                const color = FINGER_COLORS[f.idx];
                const sym = FINGER_SYMBOLS[f.idx];
                const isHovered = hoveredFingerIdx === f.idx;

                return (
                  <motion.div
                    key={f.idx}
                    whileHover={{ scale: 1.02 }}
                    onMouseEnter={() => setHoveredFingerIdx(f.idx)}
                    onMouseLeave={() => setHoveredFingerIdx(null)}
                    className="p-3 rounded-xl cursor-pointer transition-all duration-200 flex flex-col justify-between"
                    style={{
                      background: isHovered ? `${color}25` : `${color}10`,
                      border: isHovered ? `2px solid ${color}` : `1.5px solid ${color}35`,
                      boxShadow: isHovered ? `0 8px 16px -2px ${color}35` : 'none',
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-sm"
                            style={{ backgroundColor: color }}
                          >
                            {sym.symbol}
                          </span>
                          <span className="text-xs font-extrabold text-ink">{t(f.fingerKey)}</span>
                        </div>
                        <span className="text-[10px] font-extrabold bg-canvas px-1.5 py-0.5 rounded-md border border-hairline text-ink">
                          {t('guide.home')}: <strong>{f.homeKey}</strong>
                        </span>
                      </div>

                      <div className="text-[10px] font-semibold text-mute mb-2">
                        {t('guide.pattern')}: {sym.patternLabel}
                      </div>
                    </div>

                    {/* Key Chips */}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {f.keys.map((k) => (
                        <span
                          key={k}
                          className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded bg-canvas text-ink border border-hairline shadow-xs"
                          style={k === f.homeKey ? { borderColor: color, fontWeight: 900 } : undefined}
                        >
                          {k}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Hand Section */}
          <div className="bg-canvas/60 rounded-2xl p-3.5 border border-hairline flex flex-col gap-2.5">
            <div className="flex items-center justify-between px-1 pb-1 border-b border-hairline/70">
              <span className="text-xs font-black text-ink uppercase tracking-wider flex items-center gap-1.5">
                <span>✋ {t('guide.rightHand')}</span>
              </span>
              <span className="text-[11px] font-bold text-mute">{t('guide.homeAnchor')}: J - K - L - ;</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {rightHandFingers.map((f) => {
                const color = FINGER_COLORS[f.idx];
                const sym = FINGER_SYMBOLS[f.idx];
                const isHovered = hoveredFingerIdx === f.idx;

                return (
                  <motion.div
                    key={f.idx}
                    whileHover={{ scale: 1.02 }}
                    onMouseEnter={() => setHoveredFingerIdx(f.idx)}
                    onMouseLeave={() => setHoveredFingerIdx(null)}
                    className="p-3 rounded-xl cursor-pointer transition-all duration-200 flex flex-col justify-between"
                    style={{
                      background: isHovered ? `${color}25` : `${color}10`,
                      border: isHovered ? `2px solid ${color}` : `1.5px solid ${color}35`,
                      boxShadow: isHovered ? `0 8px 16px -2px ${color}35` : 'none',
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-sm"
                            style={{ backgroundColor: color }}
                          >
                            {sym.symbol}
                          </span>
                          <span className="text-xs font-extrabold text-ink">{t(f.fingerKey)}</span>
                        </div>
                        <span className="text-[10px] font-extrabold bg-canvas px-1.5 py-0.5 rounded-md border border-hairline text-ink">
                          {t('guide.home')}: <strong>{f.homeKey}</strong>
                        </span>
                      </div>

                      <div className="text-[10px] font-semibold text-mute mb-2">
                        {t('guide.pattern')}: {sym.patternLabel}
                      </div>
                    </div>

                    {/* Key Chips */}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {f.keys.map((k) => (
                        <span
                          key={k}
                          className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded bg-canvas text-ink border border-hairline shadow-xs"
                          style={k === f.homeKey ? { borderColor: color, fontWeight: 900 } : undefined}
                        >
                          {k}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Space Bar / Thumbs note */}
        <div className="mt-3 p-2.5 rounded-xl bg-canvas border border-hairline flex items-center justify-between text-xs text-body font-semibold">
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-slate-400 flex items-center justify-center text-[9px] font-black text-white">—</span>
            <span><strong>{t('guide.thumbs')}:</strong> {t('guide.thumbsNote')}</span>
          </span>
          <span className="font-mono text-[11px] bg-canvas-soft-2 px-2 py-0.5 rounded border border-hairline">[SPACE]</span>
        </div>
      </motion.div>

      {/* Finger Legend Card (Front-Lit 3D Tactile Panel with Realistic 3D Hands) */}
      <motion.div variants={itemVariants} className="card-frontlit p-5 md:p-8 mb-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Hand className="w-5 h-5 text-violet" />
            <span className="text-sm font-extrabold text-ink">{t('guide.handAnatomy')}</span>
          </div>
          <span className="text-xs font-mono text-mute uppercase tracking-wider">
            {t('guide.anatomicalGuide')}
          </span>
        </div>
        <FingerGuide
          activeFingers={[0, 1, 2, 3, 4, 5, 6, 7]}
          hoveredFingerIdx={hoveredFingerIdx}
        />
      </motion.div>

      {/* Tips */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {tips.map((tip, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02, y: -2 }}
            className="card-game p-4"
            style={{ borderLeft: `5px solid ${tip.color}` }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{tip.emoji}</span>
              <span className="text-sm font-extrabold text-ink">{tip.title}</span>
            </div>
            <p className="text-xs text-body font-semibold leading-relaxed">{tip.text}</p>
          </motion.div>
        ))}
      </motion.div>

        {/* CTA */}
        <motion.div variants={itemVariants} className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92, rotate: -1 }}
            onClick={() => { soundEngine.playPop(); navigate('/learn'); }}
            className="btn-chunky btn-chunky-green text-lg cursor-pointer"
          >
            {t('guide.cta')}
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
    </motion.div>
  );
};

export default GuidelinesPage;
