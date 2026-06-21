import React, { useState } from 'react';

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
  stack?: string;
}

export function ErrorBanner({ message, onRetry, stack }: ErrorBannerProps) {
  const [showStack, setShowStack] = useState(false);

  return (
    <div style={{ 
      padding: '24px 28px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      background: '#FEE2E2',
      border: '1px solid #EF4444',
      borderRadius: '12px',
      width: '100%',
      textAlign: 'center',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
        <svg style={{ width: 28, height: 28, color: '#EF4444', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span style={{ color: '#991B1B', fontSize: 18, fontWeight: 500, lineHeight: 1.4 }}>
          {message}
        </span>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        {onRetry && (
          <button 
            onClick={onRetry} 
            style={{ 
              flexShrink: 0,
              padding: '10px 24px',
              fontSize: 15,
              fontWeight: 600,
              borderRadius: 8,
              background: '#EF4444',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 150ms'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#DC2626')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#EF4444')}
          >
            Retry
          </button>
        )}
        {stack && (
          <button
            onClick={() => setShowStack(v => !v)}
            style={{
              fontSize: 15,
              fontWeight: 500,
              color: '#6B7280',
              padding: '10px 20px',
              border: '1px solid #D1D5DB',
              borderRadius: 8,
              background: 'transparent',
              cursor: 'pointer',
              transition: 'background 150ms'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#F3F4F6')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            {showStack ? 'Hide stack' : 'Show stack'}
          </button>
        )}
      </div>
      
      {showStack && stack && (
        <div style={{
          marginTop: 4,
          padding: 16,
          background: '#1F2937',
          borderRadius: 8,
          overflow: 'auto',
          maxHeight: 250,
          fontFamily: 'monospace',
          fontSize: 13,
          color: '#F3F4F6',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
          width: '100%',
          textAlign: 'left',
        }}>
          {stack}
        </div>
      )}
    </div>
  );
}
