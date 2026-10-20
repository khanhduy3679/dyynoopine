import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * ProtectedRoute — Proxy Pattern
 *
 * Hoạt động như một proxy trước các route cần bảo vệ:
 * - Nếu chưa đăng nhập → redirect về /login
 * - Nếu đã đăng nhập nhưng không đủ role → redirect về trang chủ
 * - Nếu hợp lệ → render children
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Đang khôi phục phiên → hiện loading
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <span className="spinner" />
      </div>
    );
  }

  // Chưa đăng nhập → redirect về /login, lưu lại trang muốn truy cập
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Kiểm tra role (nếu có chỉ định allowedRoles)
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
