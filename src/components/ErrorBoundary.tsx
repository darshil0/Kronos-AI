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
    (this as any).state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    const self = this as any;
    if (self.state.hasError) {
      let errorMessage = "Something went wrong.";
      try {
        if (self.state.error?.message) {
          const parsed = JSON.parse(self.state.error.message);
          if (parsed.error) {
            errorMessage = `Firestore Error: ${parsed.error} (${parsed.operationType} on ${parsed.path})`;
          }
        }
      } catch (e) {
        errorMessage =
          self.state.error?.message || "An unexpected error occurred.";
      }

      return (
        <div className="flex min-h-screen items-center justify-center p-6 glass-dark text-white">
          <div className="max-w-md text-center space-y-4">
            <h2 className="text-2xl font-bold text-red-400">System Error</h2>
            <p className="text-white/60">{errorMessage}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-500"
            >
              Reload Interface
            </Button>
          </div>
        </div>
      );
    }

    return self.props.children;
  }
}
