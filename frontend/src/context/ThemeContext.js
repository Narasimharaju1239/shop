import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContext';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Safely get user context with error handling
  let user = null;
  try {
    const authContext = useContext(AuthContext);
    user = authContext?.user || null;
  } catch (error) {
    user = null;
  }

  // Helper function to get user-specific theme key
  const getUserThemeKey = useCallback(() => {
    if (user && (user._id || user.id)) {
      const key = `theme_${user._id || user.id}`;
      return key;
    }
    return 'theme_guest';
  }, [user]);

  // Function to get current theme from localStorage
  const getCurrentThemeFromStorage = useCallback(() => {
    const themeKey = getUserThemeKey();
    const savedTheme = localStorage.getItem(themeKey);
    
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme === 'dark';
    }
    
    // Default to system preference
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return systemPrefersDark;
  }, [getUserThemeKey]);

  // Initialize with current theme from storage
  const [isDarkMode, setIsDarkMode] = useState(() => getCurrentThemeFromStorage());

  // Force re-read theme when user changes
  useEffect(() => {
    const currentTheme = getCurrentThemeFromStorage();
    
    // Force immediate state update
    setIsDarkMode(currentTheme);
    
    // Also force DOM update
    document.documentElement.setAttribute('data-theme', currentTheme ? 'dark' : 'light');
    document.body.className = currentTheme ? 'dark-theme' : 'light-theme';
    
  }, [user, getCurrentThemeFromStorage]); // Include user object to satisfy ESLint

  // Toggle theme function with immediate localStorage update
  const toggleTheme = useCallback(() => {
    const currentTheme = getCurrentThemeFromStorage();
    const newTheme = !currentTheme;
    const themeKey = getUserThemeKey();
    
    // Save immediately to localStorage
    localStorage.setItem(themeKey, newTheme ? 'dark' : 'light');
    
    // Update React state
    setIsDarkMode(newTheme);
    
  }, [getCurrentThemeFromStorage, getUserThemeKey]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    document.body.className = isDarkMode ? 'dark-theme' : 'light-theme';
  }, [isDarkMode]);

  // Clear user theme function (memoized)
  const clearUserTheme = useCallback(() => {
    // Clear theme preference for current user (useful for logout)
    const themeKey = getUserThemeKey();
    localStorage.removeItem(themeKey);
  }, [getUserThemeKey]);

  // Debug function to show all theme keys (memoized)
  const debugThemeKeys = useCallback(() => {
    // Debug function available but silent by default
    // Can be used for debugging theme keys if needed
  }, []);

  // Theme values
  const theme = {
    isDarkMode,
    toggleTheme,
    // User-specific theme management
    getUserThemeKey,
    clearUserTheme,
    // Debug function to show all theme keys
    debugThemeKeys,
    colors: {
      // Light theme colors
      light: {
        primary: '#3b82f6',
        secondary: '#6b7280',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#1f2937',
        textSecondary: '#6b7280',
        border: '#e5e7eb',
        shadow: 'rgba(0, 0, 0, 0.1)',
        navbar: '#ffffff',
        sidebar: '#ffffff',
        card: '#ffffff',
        input: '#ffffff',
        button: '#3b82f6',
        buttonText: '#ffffff',
        hover: '#f3f4f6'
      },
      // Dark theme colors
      dark: {
        primary: '#60a5fa',
        secondary: '#9ca3af',
        background: '#111827',
        surface: '#1f2937',
        text: '#f9fafb',
        textSecondary: '#d1d5db',
        border: '#374151',
        shadow: 'rgba(0, 0, 0, 0.3)',
        navbar: '#1f2937',
        sidebar: '#1f2937',
        card: '#1f2937',
        input: '#374151',
        button: '#60a5fa',
        buttonText: '#111827',
        hover: '#374151'
      }
    }
  };

  // Get current theme colors
  const currentTheme = isDarkMode ? theme.colors.dark : theme.colors.light;

  return (
    <ThemeContext.Provider value={{ ...theme, currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
