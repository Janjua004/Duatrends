import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught Production Exception:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6 font-poppins">
          <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-500 mx-auto flex items-center justify-center border border-rose-500/30">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-serif font-bold text-white">Something Went Wrong</h1>
              <p className="text-xs text-gray-400">
                We encountered an unexpected rendering error. Your data and cart remain completely safe.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-gray-950 p-3.5 rounded-xl border border-gray-800 text-left overflow-x-auto">
                <p className="text-[11px] font-mono text-rose-400 truncate">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 bg-brand-pink hover:bg-brand-pink-hover text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-pink/20"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all border border-gray-700"
              >
                <Home className="w-4 h-4" />
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
