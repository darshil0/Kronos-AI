import { Component, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      let errorMessage = "Something went wrong.";
      try {
        if (this.state.error?.message) {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.error) {
            errorMessage = `Firestore Error: ${parsed.error} (${parsed.operationType} on ${parsed.path})`;
          }
        }
      } catch (e) {
        errorMessage = this.state.error?.message || "An unexpected error occurred.";
      }

      return (
        <div className="flex min-h-screen items-center justify-center p-6 glass-dark text-white">
          <div className="max-w-md text-center space-y-4">
            <h2 className="text-2xl font-bold text-red-400">System Error</h2>
            <p className="text-white/60">{errorMessage}</p>
            <Button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-500">
              Reload Interface
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
