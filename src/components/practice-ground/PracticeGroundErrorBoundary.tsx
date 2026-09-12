import { Component, type ErrorInfo, type ReactNode } from 'react';
import { RotateCcw, ArrowLeft, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class PracticeGroundErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[PracticeGroundErrorBoundary] Caught rendering error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full max-w-xl mx-auto my-12 p-8 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-4 border-rose-400 dark:border-rose-500 shadow-2xl flex flex-col items-center text-center select-none">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-950/80 border-2 border-rose-400 flex items-center justify-center text-rose-500 mb-4 shadow-inner">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Arena Sync Glitch Detected
          </h2>

          <p className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 mt-2 mb-6 max-w-md">
            A real-time synchronization error occurred during render. We have safely intercepted it so your session remains intact.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={this.handleReset}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Arena</span>
            </button>

            <button
              onClick={() => {
                window.location.href = '/play';
              }}
              className="px-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-black text-xs sm:text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Game Hub</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
