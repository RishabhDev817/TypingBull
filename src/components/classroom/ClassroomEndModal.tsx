import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ClassroomEndModal: React.FC<Props> = ({ isOpen, onConfirm, onCancel }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-6 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-4 text-rose-500">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">End Classroom?</h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  This will close the session for all students.
                </p>
              </div>
            </div>

            <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              Are you sure you want to end this classroom session? All student screens will be returned to the main menu and temporary classroom data will be removed.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="px-5 py-2.5 rounded-xl font-black text-sm text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/30 transition cursor-pointer"
              >
                End Session
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
