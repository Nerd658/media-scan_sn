import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for a user session in localStorage on initial load
    try {
      const storedUser = localStorage.getItem('media-scan-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('media-scan-user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (email, password) => {
    // Simulate a successful login
    // In a real app, you'd make an API call here
    console.log("Attempting login with", { email, password });
    const mockUser = {
      name: 'Admin User',
      email: email,
      avatarUrl: `https://ui-avatars.com/api/?name=${email.charAt(0)}&background=random`,
    };
    localStorage.setItem('media-scan-user', JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const logout = () => {
    localStorage.removeItem('media-scan-user');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
