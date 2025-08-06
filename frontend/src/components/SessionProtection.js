import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

const SessionProtection = () => {
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    // Check if we're on production website (not localhost)
    const isProduction = !window.location.hostname.includes('localhost') && 
                        !window.location.hostname.includes('127.0.0.1');

    if (isProduction && user) {
      // Prevent users from leaving the website without logging out
      const handleBeforeUnload = (e) => {
        const message = "Are you sure you want to leave? Please use the logout button to properly sign out.";
        e.returnValue = message;
        return message;
      };

      const handlePopState = (e) => {
        // Check if user is trying to leave the site entirely
        const currentDomain = window.location.hostname;
        const isLeavingSite = !window.location.href.includes(currentDomain);
        
        if (isLeavingSite) {
          const userChoice = window.confirm(
            "You are trying to leave the website.\n\n" +
            "• Click 'OK' to logout and leave the website\n" +
            "• Click 'Cancel' to stay logged in\n\n" +
            "For security, please use the logout button to properly sign out."
          );
          
          if (userChoice) {
            // User confirmed leaving - logout automatically
            logout();
          } else {
            // User wants to stay, push the current state back
            window.history.pushState(null, null, window.location.pathname);
          }
        }
      };

      const handleVisibilityChange = () => {
        // Optional: Handle when user switches tabs or minimizes browser
        if (document.hidden) {
          console.log('User left the tab - session still active');
        }
      };

      // Add event listeners
      window.addEventListener('beforeunload', handleBeforeUnload);
      window.addEventListener('popstate', handlePopState);
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      // Push initial state to handle back button
      window.history.pushState(null, null, window.location.pathname);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        window.removeEventListener('popstate', handlePopState);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [user, logout]);

  // This component doesn't render anything
  return null;
};

export default SessionProtection;
