import * as React from "react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      let errorMessage =
        "An unexpected operational error occurred while rendering this view. Reload the application or check your network connection.";
      try {
        if (this.state.error?.message) {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.error) {
            errorMessage = `Firestore Error: ${parsed.error} (${parsed.operationType} on ${parsed.path})`;
          } else {
            errorMessage = this.state.error.message;
          }
        }
      } catch (e) {
        if (this.state.error?.message) {
          errorMessage = this.state.error.message;
        }
      }

      return (
        <div className="flex min-h-screen items-center justify-center p-6 glass-dark text-white">
          <div className="max-w-md text-center space-y-4">
            <h2 className="text-2xl font-bold text-red-400">System Error</h2>
            <p className="text-white/70 text-sm leading-relaxed">{errorMessage}</p>
            <p className="text-white/40 text-xs font-mono">
              If the problem persists, verify network connectivity and reload.
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-500 font-mono text-xs uppercase tracking-wider px-6"
            >
              Reload Interface
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
