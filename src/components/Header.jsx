import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Header({ title }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <header className="main-header">
      <div>
        <h1 className="header-title">{title}</h1>
      </div>
      <div className="header-right">
        <button
          onClick={() => navigate('/admin/booking')}
          className="btn-primary"
          style={{ width: 'auto', padding: '8px 16px', fontSize: '13px' }}
        >
          + Đặt lịch mới
        </button>
        <div className="header-user">
          <div className="header-avatar">{user?.name?.charAt(0) || user?.fullName?.charAt(0) || 'U'}</div>
          <span className="header-user-name">{user?.name || user?.fullName}</span>
        </div>
        <button
          onClick={logout}
          className="btn-secondary"
          style={{ padding: '6px 10px', fontSize: '12px' }}
        >
          Đăng xuất
        </button>
      </div>
    </header>
  );
}

