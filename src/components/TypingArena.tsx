import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Keyboard } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface TypingArenaProps {
  words: string[];
  currentIndex: number;
  userInput: string;
  setUserInput: (input: string) => void;
  activeWordIndex: number;
  setActiveWordIndex: (index: number) => void;
  onStart: () => void;
  isCompleted: boolean;
  streak: number;
  setStreak: (s: number | ((prev: number) => number)) => void;
  totalCorrectChars: number;
  setTotalCorrectChars: (c: number | ((prev: number) => number)) => void;
  totalTypedChars: number;
  setTotalTypedChars: (c: number | ((prev: number) => number)) => void;
}

export const TypingArena: React.FC<TypingArenaProps> = ({
  words,
  userInput,
  setUserInput,
  activeWordIndex,
  setActiveWordIndex,
  onStart,
  isCompleted,
  streak,
  setStreak,
  setTotalCorrectChars,
  setTotalTypedChars,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [shakeWord, setShakeWord] = useState(false);
  const [typedHistory, setTypedHistory] = useState<string[]>([]); // stores typed inputs for past words
  
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus utility
  const focusInput = () => {
    hiddenInputRef.current?.focus();
    setIsFocused(true);
  };

  useEffect(() => {
    focusInput();
  }, [isCompleted]);

  // Keep track of total typed/correct characters
  const activeWord = words[activeWordIndex] || '';

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isCompleted) return;

    // Start timer on first key press
    onStart();

    // Prevent default scrolling for Spacebar
    if (e.key === ' ') {
      e.preventDefault();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isCompleted) return;

    const value = e.target.value;
    
    // Space bar pressed -> proceed to next word
    if (value.endsWith(' ')) {
      const wordInput = value.trim();
      const isWordCorrect = wordInput === activeWord;
      
      // Update stats for the completed word
      if (isWordCorrect) {
        setTotalCorrectChars((prev) => prev + activeWord.length + 1); // +1 for the space
      }
      setTotalTypedChars((prev) => prev + value.length);

      // Play spacebar clack sound
      soundEngine.playClick(true);

      // Update history and shift to next word
      const newHistory = [...typedHistory, wordInput];
      setTypedHistory(newHistory);
      setUserInput('');
      setActiveWordIndex(activeWordIndex + 1);
      return;
    }

    // Normal character typing
    const newChar = value.slice(-1);
    const expectedChar = activeWord[value.length - 1];
    
    setTotalTypedChars((prev) => prev + 1);

    if (newChar === expectedChar) {
      // Correct character
      soundEngine.playClick(false);
      setStreak((prev) => {
        const next = prev + 1;
        // Every 15 streak, trigger a streak effect audio cue
        if (next > 0 && next % 15 === 0) {
          soundEngine.playStreak();
        }
        return next;
      });
      setTotalCorrectChars((prev) => prev + 1);
    } else {
      // Incorrect character -> trigger shake and error sound
      soundEngine.playError();
      setStreak(0); // Break the streak
      setShakeWord(true);
      setTimeout(() => setShakeWord(false), 300);
    }

    setUserInput(value);
  };

  // Reset local typing state when words change
  useEffect(() => {
    if (activeWordIndex === 0) {
      setTypedHistory([]);
    }
  }, [words, activeWordIndex]);

  return (
    <div
      ref={containerRef}
      onClick={focusInput}
      className="relative w-full max-w-4xl min-h-[220px] bg-primary text-on-primary rounded-md p-6 md:p-8 font-mono border border-hairline-strong/20 shadow-xl overflow-hidden cursor-text select-none"
    >
      {/* Hidden input to capture key events */}
      <input
        ref={hiddenInputRef}
        type="text"
        value={userInput}
        onKeyDown={handleKeyDown}
        onChange={handleInputChange}
        onBlur={() => setIsFocused(false)}
        onFocus={() => setIsFocused(true)}
        className="absolute opacity-0 pointer-events-none"
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
      />

      {/* Mac Terminal style controls */}
      <div className="absolute top-4 left-5 flex items-center gap-1.5 z-10">
        <div className="w-3 h-3 rounded-full bg-error opacity-80" />
        <div className="w-3 h-3 rounded-full bg-warning opacity-80" />
        <div className="w-3 h-3 rounded-full bg-success opacity-80" />
        <span className="ml-3 text-[11px] text-mute font-sans tracking-wide uppercase">
          typing_bull.tsx
        </span>
      </div>

      {/* Dynamic Hotstreak Badge using Framer Motion */}
      <div className="absolute top-4 right-5 flex items-center gap-1.5 z-10 text-[11px] font-sans text-warning">
        <AnimatePresence mode="wait">
          {streak >= 15 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 5 }}
              className="flex items-center gap-1 bg-warning-deep/20 border border-warning-deep/30 px-2.5 py-0.5 rounded-full text-warning font-semibold select-none"
            >
              <Sparkles className="w-3 h-3 animate-pulse" />
              STREAK x{Math.floor(streak / 15)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Focus overlay */}
      {!isFocused && !isCompleted && (
        <div className="absolute inset-0 bg-primary/90 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3 z-20 transition-all select-none">
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex flex-col items-center"
          >
            <Keyboard className="w-8 h-8 text-success mb-2" />
            <p className="text-sm font-sans font-medium text-on-primary">
              Click to focus and start typing
            </p>
            <p className="text-xs font-sans text-mute mt-1">
              Press any key to initiate the countdown
            </p>
          </motion.div>
        </div>
      )}

      {/* Word wrapping and rendering space */}
      <div className="mt-8 text-base md:text-lg leading-relaxed text-left select-none relative overflow-y-auto max-h-[160px] custom-scrollbar">
        <div className="flex flex-wrap gap-x-3 gap-y-2.5">
          {words.map((word, wordIdx) => {
            const isActive = wordIdx === activeWordIndex;
            const isTyped = wordIdx < activeWordIndex;
            const typedVal = typedHistory[wordIdx] || '';

            return (
              <motion.div
                key={wordIdx}
                animate={isActive && shakeWord ? { x: [-3, 3, -3, 3, 0] } : {}}
                transition={{ duration: 0.2 }}
                className={`relative px-1 rounded transition-all ${
                  isActive ? 'bg-canvas-soft-2/15 border-b border-success/60' : ''
                }`}
              >
                {/* Render word characters */}
                {word.split('').map((char, charIdx) => {
                  let charColor = 'text-mute opacity-50'; // Default untyped
                  let charBg = '';

                  if (isTyped) {
                    const isCorrect = typedVal[charIdx] === char;
                    charColor = isCorrect ? 'text-success' : 'text-error line-through';
                  } else if (isActive) {
                    if (charIdx < userInput.length) {
                      const isCorrect = userInput[charIdx] === char;
                      charColor = isCorrect ? 'text-success' : 'text-error';
                      charBg = isCorrect ? '' : 'bg-error/35 rounded-sm px-[1px]';
                    }
                  }

                  return (
                    <span
                      key={charIdx}
                      className={`relative font-mono transition-colors duration-100 ${charColor} ${charBg}`}
                    >
                      {/* Active carets cursor inside active word */}
                      {isActive && charIdx === userInput.length && (
                        <motion.span
                          layoutId="caret"
                          className="absolute -left-[1px] top-[2px] bottom-[2px] w-[2px] bg-success"
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                        />
                      )}
                      {char}
                    </span>
                  );
                })}

                {/* Handle extra characters typed by user (typos beyond word length) */}
                {isActive && userInput.length > word.length && (
                  <span className="text-error bg-error/35 rounded-sm px-[1px] line-through">
                    {userInput.slice(word.length).split('').map((char, charIdx) => (
                      <span key={charIdx} className="relative">
                        {charIdx === userInput.length - word.length - 1 && (
                          <motion.span
                            layoutId="caret"
                            className="absolute -left-[1px] top-[2px] bottom-[2px] w-[2px] bg-success"
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                          />
                        )}
                        {char}
                      </span>
                    ))}
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
