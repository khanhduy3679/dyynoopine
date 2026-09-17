import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const AuthContext = createContext(null);

const getStoredAuth = () => {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  const rawUser = localStorage.getItem('authUser') || sessionStorage.getItem('authUser');
  return { token, user: rawUser ? JSON.parse(rawUser) : null };
};

const saveAuth = (token, user, rememberMe) => {
  const storage = rememberMe ? localStorage : sessionStorage;
  localStorage.removeItem('authToken'); localStorage.removeItem('authUser');
  sessionStorage.removeItem('authToken'); sessionStorage.removeItem('authUser');
  storage.setItem('authToken', token);
  storage.setItem('authUser', JSON.stringify(user));
};

// Observer Pattern: AuthContext là subject; component dùng useAuth sẽ tự re-render khi state auth đổi.
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(getStoredAuth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => setAuth(getStoredAuth()), []);

  const navigateByRole = useCallback((role) => {
    if (role === 'admin') navigate('/admin/dashboard');
    else if (role === 'staff') navigate('/admin/appointments');
    else navigate('/');
  }, [navigate]);

  const login = async (email, password, rememberMe = false) => {
    setLoading(true); setError('');
    try {
      const response = await authService.login(email, password);
      const token = response.token || response.data?.token;
      const user = response.user || response.data?.user;
      if (!token || !user) throw new Error('Dữ liệu đăng nhập từ server không hợp lệ');
      saveAuth(token, user, rememberMe);
      setAuth({ token, user });
      navigateByRole(user.role);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally { setLoading(false); }
  };

  const register = async (userData) => {
    setLoading(true); setError('');
    try {
      const response = await authService.register(userData);
      return { success: true, message: response.message || 'Đăng ký thành công' };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally { setLoading(false); }
  };

  const logout = () => {
    localStorage.removeItem('authToken'); localStorage.removeItem('authUser');
    sessionStorage.removeItem('authToken'); sessionStorage.removeItem('authUser');
    setAuth({ token: null, user: null });
    navigate('/login');
  };

  const value = { user: auth.user, token: auth.token, loading, error, login, register, logout, clearError: () => setError(''), isAuthenticated: !!auth.token && !!auth.user };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Facade Pattern: useAuth() che giấu chi tiết gọi API/lưu token/context/điều hướng cho component.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth phải được dùng bên trong AuthProvider');
  return context;
};

export default AuthContext;
