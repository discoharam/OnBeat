import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, XCircle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-zinc-950 text-white font-mono p-4">
          <div className="max-w-4xl w-full bg-zinc-900 border border-red-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="bg-red-500/10 border-b border-red-500/20 p-6 flex items-center gap-4">
              <div className="p-3 bg-red-500/20 rounded-full text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                <AlertTriangle size={32} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-red-400 tracking-wide uppercase">Runtime Exception</h1>
                <p className="text-sm text-red-300/70">The application encountered a critical error.</p>
              </div>
            </div>

            {/* Error Message */}
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">Error Message</label>
                <div className="p-4 bg-black rounded-xl border border-red-500/20 text-red-300 font-bold text-lg">
                  {this.state.error?.message}
                </div>
              </div>

              {/* Stack Trace */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">Stack Trace</label>
                <div className="p-4 bg-black rounded-xl border border-zinc-800 text-xs text-zinc-400 overflow-x-auto whitespace-pre leading-relaxed font-mono">
                  {this.state.errorInfo?.componentStack || this.state.error?.stack}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/5 bg-zinc-900 flex justify-end gap-4">
              <button 
                onClick={() => window.location.reload()} 
                className="px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-zinc-200 transition-colors flex items-center gap-2"
              >
                <RefreshCw size={18} /> Reload Application
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
