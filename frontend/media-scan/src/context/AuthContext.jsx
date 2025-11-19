import { createContext, useState, useContext, useEffect } from 'react';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // New state for errors

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (token) {
          // Validate token and fetch user info from backend
          const response = await fetch('/api/v1/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const userData = await response.json();
            setUser({ ...userData, token }); // Store user data and token
          } else {
            localStorage.removeItem('access_token'); // Token invalid, remove it
          }
        }
      } catch (err) {
        console.error("Failed to load user from token", err);
        localStorage.removeItem('access_token');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded', // Required by OAuth2PasswordRequestForm
        },
        body: new URLSearchParams({
          username: email,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('access_token', data.access_token);

      // Fetch user details after successful login
      const userResponse = await fetch('/api/v1/auth/me', {
        headers: {
          'Authorization': `Bearer ${data.access_token}`
        }
      });
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser({ ...userData, token: data.access_token });
      } else {
        throw new Error('Failed to fetch user data after login');
      }
      return true; // Indicate success
    } catch (err) {
      setError(err.message);
      console.error("Login error:", err);
      return false; // Indicate failure
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed');
      }

      const data = await response.json();
      // Optionally auto-login after registration, or redirect to login page
      // For now, just return success and let the component handle redirection
      return true; // Indicate success
    } catch (err) {
      setError(err.message);
      console.error("Registration error:", err);
      return false; // Indicate failure
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
  };

  const value = {
    user,
    login,
    register, // Add register to the context value
    logout,
    isAuthenticated: !!user,
    loading,
    error, // Expose error state
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
