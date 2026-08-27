import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-[var(--theme-bg-base)] text-[var(--theme-text-primary)] p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-error-500/10 flex items-center justify-center mb-6">
            <AlertTriangle className="h-8 w-8 text-error-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
          <p className="text-[var(--theme-text-secondary)] max-w-2xl mb-8 font-mono text-sm p-4 bg-black/20 rounded-lg text-red-400 text-left overflow-auto">
            {this.state.error && this.state.error.toString()}
            <br/><br/>
            {this.state.error && this.state.error.stack}
          </p>
          <Button onClick={() => window.location.href = window.location.pathname + '?clearCache=true'}>
            Refresh Page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
