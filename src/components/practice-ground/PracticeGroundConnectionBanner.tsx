import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, RefreshCw, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import type { SocketStatus, ToastNotification } from '../../hooks/usePracticeGroundSocket';

interface Props {
  status: SocketStatus;
  notifications: ToastNotification[];
  onRetry?: () => void;
}

export const PracticeGroundConnectionBanner: React.FC<Props> = ({
  status,
  notifications,
  onRetry,
}) => {
  return (
    <>
      {/* Network Status Floating Pill (when disconnected or reconnecting) */}
      <AnimatePresence>
        {status !== 'CONNECTED' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-2xl border-2 border-amber-400 text-xs font-black text-slate-800 dark:text-slate-100"
          >
            {status === 'RECONNECTING' || status === 'CONNECTING' ? (
              <>
                <RefreshCw className="w-4 h-4 text-amber-500 animate-spin" />
                <span>Connecting to Practice Ground...</span>
              </>
            ) : status === 'DISCONNECTED' ? (
              <>
                <WifiOff className="w-4 h-4 text-rose-500" />
                <span>Connection Lost</span>
                {onRetry && (
                  <button
                    onClick={onRetry}
                    className="ml-2 px-2 py-0.5 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors cursor-pointer"
                  >
                    Retry
                  </button>
                )}
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-rose-500" />
                <span>Offline mode</span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Notifications Toasts (Top Right) */}
      <div className="fixed top-24 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm">
        <AnimatePresence>
          {notifications.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              className={`pointer-events-auto px-4 py-2.5 rounded-2xl shadow-xl backdrop-blur-md border text-xs font-black flex items-center gap-2.5 ${
                toast.type === 'success'
                  ? 'bg-emerald-50/95 dark:bg-emerald-950/95 border-emerald-400 text-emerald-800 dark:text-emerald-200'
                  : toast.type === 'warning'
                  ? 'bg-amber-50/95 dark:bg-amber-950/95 border-amber-400 text-amber-800 dark:text-amber-200'
                  : toast.type === 'error'
                  ? 'bg-rose-50/95 dark:bg-rose-950/95 border-rose-400 text-rose-800 dark:text-rose-200'
                  : 'bg-white/95 dark:bg-slate-900/95 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100'
              }`}
            >
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : toast.type === 'warning' ? (
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
              ) : toast.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              ) : (
                <Info className="w-4 h-4 text-sky-500 shrink-0" />
              )}
              <span className="leading-snug">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
};
