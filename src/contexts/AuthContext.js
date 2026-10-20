import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

/**
 * AuthContext — Observer Pattern + Facade Pattern
 *
 * Observer Pattern: React Context hoạt động như một Observable —
 *   khi state (user, loading) thay đổi, tất cả các component subscribe
 *   (qua useAuth()) đều tự động re-render.
 *
 * Facade Pattern: hook useAuth() cung cấp interface đơn giản
 *   (login, logout, register, user, loading) che giấu toàn bộ logic
 *   phức tạp bên trong (gọi API, lưu JWT, điều hướng theo role…).
 */
const AuthContext = createContext(null);

/** Xác định nhãn hiển thị cho role */
const roleLabelMap = {
  admin: 'Quản trị viên',
  staff: 'Nhân viên',
  customer: 'Khách hàng',
};

/** Xác định route mặc định sau đăng nhập theo role */
const defaultRouteByRole = {
  admin: '/admin/dashboard',
  staff: '/admin/dashboard',
  customer: '/my-appointments',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // loading khi khôi phục session
  const navigate = useNavigate();

  // Khôi phục phiên đăng nhập từ localStorage khi mount
  useEffect(() => {
    try {
      const token = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('authUser');
      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Facade: login() — gọi authService.login(), lưu JWT, cập nhật state,
   * điều hướng tự động theo role.
   */
  const login = useCallback(async (email, password) => {
    const data = await authService.login(email, password);
    const { token, user: serverUser } = data;

    // Bổ sung các trường hiển thị
    const enrichedUser = {
      ...serverUser,
      name: serverUser.fullName || serverUser.name,
      roleLabel: roleLabelMap[serverUser.role] || 'Khách hàng',
    };

    localStorage.setItem('authToken', token);
    localStorage.setItem('authUser', JSON.stringify(enrichedUser));
    setUser(enrichedUser);

    // Điều hướng theo role
    const targetRoute = defaultRouteByRole[serverUser.role] || '/';
    navigate(targetRoute, { replace: true });

    return enrichedUser;
  }, [navigate]);

  /**
   * Facade: register() — gọi authService.register()
   * Không tự đăng nhập sau khi đăng ký — người dùng cần login.
   */
  const register = useCallback(async ({ fullName, email, phone, password }) => {
    const data = await authService.register({ fullName, email, phone, password });
    return data;
  }, []);

  /**
   * Facade: logout() — xóa JWT, reset state, điều hướng về /login
   */
  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setUser(null);
    navigate('/login', { replace: true });
  }, [navigate]);

  const value = { user, loading, login, register, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Facade hook: useAuth()
 * Cung cấp { user, loading, login, register, logout }
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth() phải được gọi bên trong <AuthProvider>');
  }
  return context;
}

export default AuthContext;
