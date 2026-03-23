'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import Navbar from './Navigation/Navbar';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center',
          background: '#f7f9fc'
        }}>
          <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>😴</h1>
          <h2 style={{ color: '#ff6b6b' }}>Teacher AI is taking a quick nap!</h2>
          <p style={{ color: '#636e72', maxWidth: '500px', margin: '1rem 0' }}>
            Oops! Something went slightly wrong. Don't worry, even superheroes need a break sometimes. 
            Try refreshing the page or come back in a minute!
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '1rem 2rem',
              background: '#ff6b6b',
              color: 'white',
              borderRadius: '12px',
              fontWeight: '700',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(255,107,107,0.3)'
            }}
          >
            Refresh Classroom 🚀
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
