import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Loader2 } from 'lucide-react';
import type { SocketStatus } from '../../types/classroom';

interface Props {
  status: SocketStatus;
}

export const ClassroomReconnectBanner: React.FC<Props> = ({ status }) => {
  const show = status === 'DISCONNECTED' || status === 'RECONNECTING';

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl flex items-center gap-2 border border-amber-300"
        >
          {status === 'RECONNECTING' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Restoring classroom connection...</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4" />
              <span>Connection lost. Attempting to reconnect...</span>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
