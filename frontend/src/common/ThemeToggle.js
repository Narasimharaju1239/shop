import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ style = {} }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  const handleToggle = () => {
    toggleTheme();
  };

  return (
    <>
      <style>{`
        .theme-toggle-button {
          outline: none !important;
          border: none !important;
          box-shadow: none !important;
          -webkit-appearance: none !important;
          -moz-appearance: none !important;
          appearance: none !important;
          -webkit-tap-highlight-color: transparent !important;
          -webkit-focus-ring-color: transparent !important;
          background-clip: padding-box !important;
          outline-offset: 0 !important;
          outline-width: 0 !important;
          outline-style: none !important;
          outline-color: transparent !important;
        }
        .theme-toggle-button:focus,
        .theme-toggle-button:active,
        .theme-toggle-button:hover,
        .theme-toggle-button:focus-visible,
        .theme-toggle-button:focus-within {
          outline: none !important;
          border: none !important;
          box-shadow: none !important;
          -webkit-appearance: none !important;
          -moz-appearance: none !important;
          appearance: none !important;
          outline-offset: 0 !important;
          outline-width: 0 !important;
          outline-style: none !important;
          outline-color: transparent !important;
          -webkit-focus-ring-color: transparent !important;
          -webkit-tap-highlight-color: transparent !important;
        }
        .theme-toggle-button *,
        .theme-toggle-button *:focus,
        .theme-toggle-button *:active,
        .theme-toggle-button *:hover {
          outline: none !important;
          border: none !important;
          box-shadow: none !important;
          outline-offset: 0 !important;
          outline-width: 0 !important;
          outline-style: none !important;
          outline-color: transparent !important;
        }
      `}</style>
      <div style={{ ...style }}>
        <button
          className="theme-toggle-button"
          onClick={handleToggle}
        style={{
          background: isDarkMode ? '#1f2937' : '#e5e7eb',
          border: 'none',
          borderRadius: '18px',
          width: '100px',
          height: '32px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          padding: '2px',
          transition: 'all 0.3s ease',
          position: 'relative',
          outline: 'none',
          outlineWidth: '0',
          outlineStyle: 'none',
          outlineColor: 'transparent',
          outlineOffset: '0',
          boxShadow: 'none',
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          appearance: 'none',
          WebkitTapHighlightColor: 'transparent',
          WebkitFocusRingColor: 'transparent',
          focusRingColor: 'transparent',
          backgroundColor: isDarkMode ? '#1f2937' : '#e5e7eb'
        }}
        title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      >
        {/* Sliding Circle */}
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            transform: isDarkMode ? 'translateX(68px)' : 'translateX(0px)',
            position: 'absolute',
            left: '2px',
            top: '2px',
            border: 'none',
            boxShadow: isDarkMode ? '0 1px 4px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.1)',
            zIndex: 2
          }}
        >
          <span style={{ 
            fontSize: '11px',
            filter: 'grayscale(0)',
            opacity: 1
          }}>
            {isDarkMode ? '🌙' : '☀️'}
          </span>
        </div>

        {/* Mode Text */}
        <div
          style={{
            position: 'absolute',
            left: isDarkMode ? '15px' : '36px',
            fontSize: '7px',
            fontWeight: '700',
            color: isDarkMode ? '#ffffff' : '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: '0.3px',
            transition: 'all 0.3s ease',
            zIndex: 1,
            whiteSpace: 'nowrap',
            maxWidth: isDarkMode ? '60px' : '58px',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {isDarkMode ? 'DARK MODE' : 'LIGHT MODE'}
        </div>
      </button>
      </div>
    </>
  );
};

export default ThemeToggle;
