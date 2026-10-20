import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import Login from './components/Login';

// Pages — Khu vực khách hàng (public / customer)
import BookingPage from './pages/BookingPage';
import OtpPage from './pages/OtpPage';
import MyAppointmentsPage from './pages/MyAppointmentsPage';

// Pages — Khu vực quản trị (staff / admin)
import Dashboard from './pages/Dashboard';
import Booking from './pages/Booking';
import Appointments from './pages/Appointments';
import Customers from './pages/Customers';
import Staff from './pages/Staff';
import Services from './pages/Services';
import Payments from './pages/Payments';
import Notifications from './pages/Notifications';
import Reviews from './pages/Reviews';
import Account from './pages/Account';
import Reports from './pages/Reports';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <span className="spinner" />
      </div>
    );
  }

  return (
    <Routes>
      {/* ===== KHU VỰC PUBLIC / KHÁCH HÀNG ===== */}

      {/* Trang chủ — redirect theo trạng thái đăng nhập */}
      <Route
        path="/"
        element={
          user
            ? (user.role === 'admin' || user.role === 'staff')
              ? <Navigate to="/admin/dashboard" replace />
              : <Navigate to="/booking" replace />
            : <Navigate to="/login" replace />
        }
      />

      {/* Login / Register */}
      <Route
        path="/login"
        element={
          user
            ? <Navigate to="/" replace />
            : <Login />
        }
      />

      {/* Đặt lịch (public — nhưng cần đăng nhập customer) */}
      <Route
        path="/booking"
        element={
          <ProtectedRoute>
            <BookingPage />
          </ProtectedRoute>
        }
      />

      {/* Xác nhận OTP */}
      <Route
        path="/appointments/:id/otp"
        element={
          <ProtectedRoute>
            <OtpPage />
          </ProtectedRoute>
        }
      />

      {/* Lịch hẹn của tôi (customer) */}
      <Route
        path="/my-appointments"
        element={
          <ProtectedRoute>
            <MyAppointmentsPage />
          </ProtectedRoute>
        }
      />

      {/* ===== KHU VỰC QUẢN TRỊ (staff / admin) ===== */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['staff', 'admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="booking" element={<Booking />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="customers" element={<Customers />} />
        <Route path="staff" element={<Staff />} />
        <Route path="services" element={<Services />} />
        <Route path="payments" element={<Payments />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="reports" element={<Reports />} />
        <Route path="account" element={<Account />} />
      </Route>

      {/* Catch-all: redirect về trang chủ */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

