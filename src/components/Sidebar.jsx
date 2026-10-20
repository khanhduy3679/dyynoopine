import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Icons as inline SVG
const Icons = {
  grid: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="1" width="5.5" height="5.5" rx="1" />
      <rect x="8.5" y="1" width="5.5" height="5.5" rx="1" />
      <rect x="1" y="8.5" width="5.5" height="5.5" rx="1" />
      <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1" />
    </svg>
  ),
  calendarPlus: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="2.5" width="13" height="11" rx="1.5" />
      <path d="M4 1v3M11 1v3M1 6.5h13" />
      <path d="M7.5 9v4M5.5 11h4" />
    </svg>
  ),
  calendar: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="2.5" width="13" height="11" rx="1.5" />
      <path d="M4 1v3M11 1v3M1 6.5h13" />
      <circle cx="4.5" cy="10" r="0.75" fill="currentColor" />
      <circle cx="7.5" cy="10" r="0.75" fill="currentColor" />
      <circle cx="10.5" cy="10" r="0.75" fill="currentColor" />
    </svg>
  ),
  scissors: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="3.5" cy="4.5" r="2" />
      <circle cx="3.5" cy="11" r="2" />
      <path d="M5.5 4.5L13 7M5.5 11L13 7" />
    </svg>
  ),
  users: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="5" cy="4.5" r="2.5" />
      <path d="M1 13.5c0-2.76 2.24-5 5-5s5 2.24 5 5" />
      <circle cx="11" cy="4.5" r="2" />
      <path d="M14 13.5c0-2.2-1.34-4.09-3.24-4.75" />
    </svg>
  ),
  user: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="7" cy="5" r="3" />
      <path d="M2 13.5c0-3.31 2.69-6 6-6s6 2.69 6 6" />
    </svg>
  ),
  card: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="3" width="13" height="9" rx="1.5" />
      <path d="M1 6h13M4 10h3" />
    </svg>
  ),
  chart: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 13V7l3-3 3 3 4-6" />
      <path d="M1 13h13" />
    </svg>
  ),
  bell: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M7 1A4.5 4.5 0 002.5 5.5v3L1 11h13l-1.5-2V5.5A4.5 4.5 0 007 1z" />
      <path d="M5.5 11v.5a1.5 1.5 0 003 0V11" />
    </svg>
  ),
  star: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M7 1.5l1.5 3 3 0.5-2.5 2.3.6 3.4L7 9.3l-2.7 1.6.6-3.4L2.5 5l3-0.5L7 1.5z" />
    </svg>
  ),
  shield: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M7 1L2 3.5v4c0 3.31 2.69 6 5 6s5-2.69 5-6V3.5L7 1z" />
      <path d="M4.5 7.5l2 2 2.5-2.5" />
    </svg>
  ),
  settings: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="7" cy="7" r="2.5" />
      <path d="M7 1v1.5M7 12.5V14M1 7h1.5M12.5 7H14M3.05 3.05l1.06 1.06M10.89 10.89l1.06 1.06M3.05 10.95l1.06-1.06M10.89 4.11l1.06-1.06" />
    </svg>
  ),
};

const navGroups = [
  {
    label: 'Tổng quan',
    items: [{ path: '/admin/dashboard', label: 'Bảng điều khiển', icon: Icons.grid }],
  },
  {
    label: 'Đặt lịch & Dịch vụ',
    items: [
      { path: '/admin/booking', label: 'Đặt lịch mới', icon: Icons.calendarPlus },
      { path: '/admin/appointments', label: 'Quản lý lịch hẹn', icon: Icons.calendar },
      { path: '/admin/services', label: 'Dịch vụ', icon: Icons.scissors },
    ],
  },
  {
    label: 'Quản lý',
    items: [
      { path: '/admin/customers', label: 'Khách hàng', icon: Icons.users },
      { path: '/admin/staff', label: 'Nhân viên', icon: Icons.user },
    ],
  },
  {
    label: 'Tài chính',
    items: [
      { path: '/admin/payments', label: 'Thanh toán', icon: Icons.card },
      { path: '/admin/reports', label: 'Báo cáo', icon: Icons.chart },
    ],
  },
  {
    label: 'Hệ thống',
    items: [
      { path: '/admin/notifications', label: 'Thông báo', icon: Icons.bell },
      { path: '/admin/reviews', label: 'Đánh giá', icon: Icons.star },
      { path: '/admin/account', label: 'Tài khoản', icon: Icons.settings },
    ],
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M5 6c0-.5.5-1.5 1.5-2s4-1 5 0 2 2 1 4-3 4-5 5-4 1-5 0 0-4 1-5z" fill="#c9a84c" />
            <path d="M10 11c.5-.5 1.5-1 2-.5s1 1 .5 2-1 1.5-1.5 1.5-1-.5-1-1.5 0-1.5 0-1.5z" fill="#c9a84c" opacity="0.6" />
            <circle cx="13" cy="5" r="1.5" fill="#c9a84c" opacity="0.8" />
          </svg>
        </div>
        <div>
          <div className="sidebar-logo-text">PHANMEM</div>
          <div className="sidebar-logo-sub">Salon Booking</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {navGroups.map((group) => (
          <div key={group.label}>
            <div className="sidebar-group-label">{group.label}</div>
            {group.items.map(({ path, label, icon }) => {
              const isActive = location.pathname === path;
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                >
                  {icon}
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="sidebar-user">
        <div className="sidebar-user-avatar">
          {user?.name?.charAt(0) || 'U'}
        </div>
        <div className="sidebar-user-info">
          <div className="sidebar-user-name">{user?.name || 'Người dùng'}</div>
          <div className="sidebar-user-role">{user?.roleLabel || 'Khách hàng'}</div>
        </div>
      </div>
    </aside>
  );
}
