import React, { createContext, useContext, useState, useCallback } from 'react';
import type { FeedbackType } from '../engine/feedbackStore';
import { FeedbackModal } from '../components/feedback/FeedbackModal';

interface FeedbackContextType {
  isOpen: boolean;
  initialType: FeedbackType;
  contextTag?: string;
  openFeedback: (initialType?: FeedbackType, contextTag?: string) => void;
  closeFeedback: () => void;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export const FeedbackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [initialType, setInitialType] = useState<FeedbackType>('feature_request');
  const [contextTag, setContextTag] = useState<string | undefined>(undefined);

  const openFeedback = useCallback((type?: FeedbackType, tag?: string) => {
    if (type) setInitialType(type);
    setContextTag(tag);
    setIsOpen(true);

    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'feedback_opened', {
        feedback_type: type || 'feature_request',
        context_tag: tag || 'dashboard',
      });
    }
  }, []);

  const closeFeedback = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <FeedbackContext.Provider value={{ isOpen, initialType, contextTag, openFeedback, closeFeedback }}>
      {children}
      <FeedbackModal isOpen={isOpen} onClose={closeFeedback} initialType={initialType} contextTag={contextTag} />
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};
