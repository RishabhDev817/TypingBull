import React from 'react';
import { motion } from 'framer-motion';
import { getTotalStars } from '../engine/sessionStore';

interface CoinCounterProps {
  className?: string;
  compact?: boolean;
}

/**
 * Persistent coin/point counter — displays stars × 10 as "coins".
 */
export const CoinCounter: React.FC<CoinCounterProps> = ({
  className = '',
  compact = false,
}) => {
  const totalStars = getTotalStars();
  const coins = totalStars * 10;

  return (
    <motion.div
      className={`inline-flex items-center gap-1.5 ${className}`}
      whileHover={{ scale: 1.05 }}
    >
      {/* Coin icon */}
      <motion.div
        className="relative flex items-center justify-center"
        style={{ width: compact ? 20 : 28, height: compact ? 20 : 28 }}
      >
        <svg viewBox="0 0 28 28" width={compact ? 20 : 28} height={compact ? 20 : 28}>
          <circle cx="14" cy="14" r="13" fill="#FFD700" stroke="#FFA000" strokeWidth="2" />
          <circle cx="14" cy="14" r="9" fill="#FFC107" stroke="#FFB300" strokeWidth="1" />
          <text
            x="14" y="18"
            textAnchor="middle"
            fontSize="12"
            fontWeight="900"
            fill="#E65100"
            fontFamily="Nunito, sans-serif"
          >
            $
          </text>
        </svg>
      </motion.div>

      {/* Count */}
      <span
        className={`font-extrabold ${compact ? 'text-xs md:text-sm' : 'text-sm font-black'}`}
        style={{ fontFamily: 'Nunito, sans-serif' }}
      >
        {coins}
      </span>
    </motion.div>
  );
};

export default CoinCounter;
