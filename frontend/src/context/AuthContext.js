import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (userData) => {
    console.log('AuthContext: Logging in user:', userData);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    // Clear guest cart on login
    localStorage.removeItem('cartItems');
  };

  const logout = () => {
    console.log('AuthContext: Logging out user:', user);
    setUser(null);
    localStorage.removeItem('user');
    // Clear guest cart on logout to prevent customer products from appearing in guest cart
    localStorage.removeItem('cartItems');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
