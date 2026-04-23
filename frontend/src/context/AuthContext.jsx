import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/authApi';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(() => localStorage.getItem('tm_token'));
  const [loading, setLoading] = useState(true);

  // Apply theme class on body
  const applyTheme = useCallback((theme) => {
    if (theme === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
  }, []);

  // Restore session on mount
  useEffect(() => {
    const restore = async () => {
      if (!token) { setLoading(false); return; }
      try {
        const { data } = await authApi.getMe();
        setUser(data.data.user);
        applyTheme(data.data.user.theme);
      } catch {
        localStorage.removeItem('tm_token');
        setToken(null);
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, [token, applyTheme]);

  const login = async (credentials) => {
    const { data } = await authApi.login(credentials);
    const { token: tk, user: u } = data.data;
    localStorage.setItem('tm_token', tk);
    setToken(tk);
    setUser(u);
    applyTheme(u.theme);
    toast.success(`Welcome back, ${u.name}! 👋`);
    return u;
  };

  const register = async (userData) => {
    const { data } = await authApi.register(userData);
    const { token: tk, user: u } = data.data;
    localStorage.setItem('tm_token', tk);
    setToken(tk);
    setUser(u);
    applyTheme(u.theme);
    toast.success(`Welcome, ${u.name}! 🎉`);
    return u;
  };

  const logout = () => {
    localStorage.removeItem('tm_token');
    setToken(null);
    setUser(null);
    document.body.classList.remove('light');
    toast.success('Logged out successfully');
  };

  const updateUser = async (updates) => {
    const { data } = await authApi.updateProfile(updates);
    const updated = data.data.user;
    setUser(updated);
    applyTheme(updated.theme);
    return updated;
  };

  const toggleTheme = async () => {
    const newTheme = user?.theme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    setUser((prev) => ({ ...prev, theme: newTheme }));
    try {
      await authApi.updateProfile({ theme: newTheme });
    } catch {
      // Revert on failure
      applyTheme(user?.theme);
      setUser((prev) => ({ ...prev, theme: user?.theme }));
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser, toggleTheme }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
