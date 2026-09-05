import React from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, AlertTriangle } from 'lucide-react';
import { analyzeWeakKeys, type WeakKeyRecommendation } from '../engine/weakKeyAnalyzer';
import { soundEngine } from '../utils/audio';

interface WeakKeyPanelProps {
  className?: string;
  onStartMission?: (content: string, targetKeys: string[]) => void;
}

export const WeakKeyPanel: React.FC<WeakKeyPanelProps> = ({
  className = '',
  onStartMission,
}) => {
  const [recommendation, setRecommendation] = React.useState<WeakKeyRecommendation | null>(null);

  React.useEffect(() => {
    setRecommendation(analyzeWeakKeys());
  }, []);

  if (!recommendation) return null;

  const hasWeakKeys = recommendation.weakKeys.some(k => k.errorRate > 0.1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card-game card-halo-red p-4 pb-4 flex flex-col justify-between h-full min-h-[210px] ${className}`}
    >
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2 shrink-0">
          <Target className="w-4 h-4 text-highlight-pink" />
          <h3 className="text-sm font-extrabold text-ink">🎯 Weak-Key Analysis</h3>
        </div>

        {/* Text-focused message */}
        <p className="text-xs text-body font-semibold leading-snug mb-2 line-clamp-2 shrink-0">
          {recommendation.message}
        </p>

        {/* Weak keys bars */}
        {hasWeakKeys && (
          <div className="space-y-1.5 mb-2">
            {recommendation.weakKeys
              .filter(k => k.errorRate > 0.05)
              .slice(0, 4)
              .map(({ key, errorRate }) => (
                <div key={key} className="flex items-center gap-2">
                  <span className="w-6 h-6 flex items-center justify-center text-[11px] font-extrabold rounded-lg text-white shrink-0"
                    style={{ background: 'linear-gradient(135deg, #FF9800, #F57C00)' }}
                  >
                    {key.toUpperCase()}
                  </span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden"
                    style={{ background: 'var(--color-badge-bg-orange)', border: '1px solid var(--color-badge-border-orange)' }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(errorRate * 100, 100)}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{
                        background: errorRate > 0.3
                          ? 'linear-gradient(90deg, #FF6B6B, #E53935)'
                          : errorRate > 0.15
                            ? 'linear-gradient(90deg, #FF9800, #F57C00)'
                            : 'linear-gradient(90deg, #FFD700, #FFC107)',
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-extrabold w-8 text-right shrink-0" style={{ color: errorRate > 0.3 ? '#E53935' : '#FF9800' }}>
                    {Math.round(errorRate * 100)}%
                  </span>
                </div>
              ))}
          </div>
        )}

        {/* Weak bigrams */}
        {recommendation.weakBigrams.length > 0 && recommendation.weakBigrams.some(b => b.errorRate > 0.1) && (
          <div className="mb-2 shrink-0">
            <div className="flex items-center gap-1.5 mb-1">
              <AlertTriangle className="w-3 h-3 text-orange" />
              <span className="text-[10px] font-extrabold text-orange uppercase tracking-wider">Tricky Combos</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {recommendation.weakBigrams
                .filter(b => b.errorRate > 0.1)
                .slice(0, 4)
                .map(({ bigram, errorRate }) => (
                  <span
                    key={bigram}
                    className="px-2 py-0.5 text-[10px] font-bold rounded-lg"
                    style={{
                      background: 'var(--color-badge-bg-orange)',
                      color: 'var(--color-ink)',
                      border: '1px solid var(--color-badge-border-orange)'
                    }}
                  >
                    "{bigram}" · {Math.round(errorRate * 100)}%
                  </span>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Mission CTA */}
      {recommendation.mission && onStartMission && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            soundEngine.playPop();
            const m = recommendation.mission!;
            onStartMission(m.content, m.targetKeys);
          }}
          className="w-full btn-chunky btn-chunky-orange text-xs py-2 cursor-pointer mt-1.5 shrink-0"
        >
          <Zap className="w-3.5 h-3.5" />
          🚀 Start {recommendation.mission.durationMinutes}-min Mission
        </motion.button>
      )}
    </motion.div>
  );
};

export default WeakKeyPanel;
