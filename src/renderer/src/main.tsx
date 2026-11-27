/**
 * EXCO Renderer Entry Point
 * React 18+ application with TypeScript
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider } from './stores/themeStore';
import { SettingsProvider } from './stores/settingsStore';
import { WorkspaceProvider } from './stores/workspaceStore';
import './styles/index.css';

// Error boundary for graceful degradation
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Application error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const root = ReactDOM.createRoot(
  document.getElementById('root')!
);

root.render(
  <React.StrictMode>
    <HashRouter>
      <ThemeProvider>
        <SettingsProvider>
          <WorkspaceProvider>
            <ErrorBoundary
              fallback={
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100vh',
                  background: 'var(--color-background)',
                  color: 'var(--color-foreground)',
                  fontFamily: 'var(--font-sans)',
                  padding: '2rem',
                  textAlign: 'center',
                }}>
                  <div>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Something went wrong</h1>
                    <p style={{ marginBottom: '1rem', opacity: 0.7 }}>
                      An unexpected error occurred. Please restart the application.
                    </p>
                    <button
                      onClick={() => window.location.reload()}
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'var(--color-primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                      }}
                    >
                      Reload Application
                    </button>
                  </div>
                </div>
              }
            >
              <App />
            </ErrorBoundary>
          </WorkspaceProvider>
        </SettingsProvider>
      </ThemeProvider>
    </HashRouter>
  </React.StrictMode>
);