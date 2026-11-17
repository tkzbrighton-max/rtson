import React, { Component, ReactNode, ErrorInfo } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught UI error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full p-8 rounded-2xl bg-zinc-900 border border-zinc-800 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
            </div>
            <h2 className="text-lg font-extrabold text-zinc-100">
              R'tson Creations Studio
            </h2>
            <p className="text-xs text-zinc-400">
              A temporary display error occurred. Click below to reload the studio layout.
            </p>
            {this.state.error && (
              <p className="text-[11px] font-mono text-rose-400/80 bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 break-all text-left">
                {this.state.error.message}
              </p>
            )}
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 font-bold text-xs hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-amber-500/20"
            >
              Reload Studio Preview
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
