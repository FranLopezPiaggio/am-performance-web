'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

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
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorMessage = 'Algo salió mal. Por favor, intenta recargar la página.';
      
      try {
        if (this.state.error?.message.startsWith('{')) {
          const firestoreError = JSON.parse(this.state.error.message);
          errorMessage = `Error de base de datos: ${firestoreError.error}. Por favor, contacta a soporte.`;
        }
      } catch {
        // Not JSON
      }

      return (
        <div className="min-h-screen bg-brutal-black flex items-center justify-center p-4 text-center">
          <div className="max-w-md p-8 bg-white text-brutal-black brutal-shadow">
            <h2 className="text-4xl font-display uppercase mb-4">¡UPS!</h2>
            <p className="mb-8 uppercase tracking-widest text-sm font-bold">{errorMessage}</p>
            <button
              onClick={() => window.location.reload()}
              className="brutal-btn w-full"
            >
              Recargar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
