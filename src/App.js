import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import OtpPage from './pages/OtpPage';
import MyAppointmentsPage from './pages/MyAppointmentsPage';
import CheckInPage from './pages/CheckInPage';
import ScrollToTop from './components/ScrollToTop';
import { useAuth } from './contexts/AuthContext';

const AdminPlaceholder = ({ title }) => {
  const { logout } = useAuth();
  return (
    <main className="placeholder-page">
      <h1>{title}</h1>
      <p>Trang mẫu để kiểm tra điều hướng theo role.</p>
      <button className="secondary-button" onClick={logout}>Đăng xuất</button>
    </main>
  );
};

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/appointments/:id/otp" element={<OtpPage />} />
        <Route path="/my-appointments" element={<MyAppointmentsPage />} />
        <Route path="/check-in" element={<CheckInPage />} />
        <Route path="/admin/appointments" element={<AdminPlaceholder title="Quản lý lịch hẹn" />} />
        <Route path="/admin/dashboard" element={<AdminPlaceholder title="Bảng điều khiển Admin" />} />
        <Route path="/forgot-password" element={<AdminPlaceholder title="Quên mật khẩu" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ScrollToTop />
    </>
  );
}

export default App;
