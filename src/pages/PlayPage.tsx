import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useLocation } from 'react-router-dom';
import { GameHubMenu } from '../components/game/GameHubMenu';
import { LilypadLeapGame } from '../components/game/lilypad/LilypadLeapGame';
import { NeonVelocityGame } from '../components/game/neon/NeonVelocityGame';
import { PracticeGroundView } from '../components/practice-ground/PracticeGroundView';

type PlayViewMode = 'hub' | 'lilypad-leap' | 'neon-velocity' | 'practice-ground';

export const PlayPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const roomParam = searchParams.get('room') || '';
  const modeParam = searchParams.get('mode') || '';
  const isPracticeGroundRoute =
    location.pathname.includes('/practice-ground') ||
    location.pathname.includes('/multiplayer') ||
    modeParam === 'practice-ground' ||
    Boolean(roomParam);

  const [viewMode, setViewMode] = useState<PlayViewMode>(
    isPracticeGroundRoute ? 'practice-ground' : 'hub'
  );
  const [selectedLevel, setSelectedLevel] = useState<number>(1);

  useEffect(() => {
    if (isPracticeGroundRoute) {
      setViewMode('practice-ground');
    }
  }, [isPracticeGroundRoute]);

  const handleLaunchKidsGame = (level = 1) => {
    setSelectedLevel(level);
    setViewMode('lilypad-leap');
  };

  const handleLaunchNeonVelocity = () => {
    setViewMode('neon-velocity');
  };

  const handleLaunchPracticeGround = () => {
    setViewMode('practice-ground');
  };

  const handleReturnToHub = () => {
    setViewMode('hub');
  };

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] flex flex-col justify-center">
      <AnimatePresence mode="wait">
        {viewMode === 'hub' && (
          <motion.div
            key="game-hub"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            <GameHubMenu
              onSelectKidsGame={handleLaunchKidsGame}
              onSelectNeonVelocity={handleLaunchNeonVelocity}
              onSelectPracticeGround={handleLaunchPracticeGround}
            />
          </motion.div>
        )}

        {viewMode === 'lilypad-leap' && (
          <motion.div
            key="lilypad-leap-game"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <LilypadLeapGame
              initialLevel={selectedLevel}
              onBackToHub={handleReturnToHub}
            />
          </motion.div>
        )}

        {viewMode === 'neon-velocity' && (
          <motion.div
            key="neon-velocity-game"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <NeonVelocityGame
              onBackToHub={handleReturnToHub}
            />
          </motion.div>
        )}

        {viewMode === 'practice-ground' && (
          <motion.div
            key="practice-ground-game"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <PracticeGroundView
              onBackToHub={handleReturnToHub}
              initialRoomCode={roomParam}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlayPage;

