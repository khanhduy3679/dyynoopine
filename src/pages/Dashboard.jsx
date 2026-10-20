import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import appointmentService from '../services/appointmentService';
import { mockNotifications, mockPayments, mockServices, mockCustomers, mockStaff } from '../data/mockData';
import { formatVND, statusLabels, statusColors } from '../utils';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    appointmentService.getAppointments()
      .then((res) => setAppointments(res.appointments || []))
      .catch((err) => console.log('Tải danh sách lịch hẹn lỗi:', err))
      .finally(() => setLoading(false));
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppts = appointments.filter(a => {
    const d = new Date(a.startTime).toISOString().split('T')[0];
    return d === todayStr;
  });

  const pending = todayAppts.filter(a => a.status === 'pending_otp' || a.status === 'pending').length;
  const completed = todayAppts.filter(a => a.status === 'completed' || a.status === 'checked_in').length;
  const totalRev = todayAppts.filter(a => a.status !== 'cancelled' && a.status !== 'expired').reduce((s, a) => s + (a.serviceId?.price || 0), 0);
  const rate = todayAppts.length > 0 ? Math.round((completed / todayAppts.length) * 100) : 0;
  const totalCustomers = mockCustomers.length;
  const totalStaff = mockStaff.filter(s => s.active).length;
  const totalServices = mockServices.filter(s => s.active).length;
  const totalRevenue = mockPayments.filter(p => p.status === 'completed').reduce((s, p) => s + p.finalAmount, 0);

  const stats = [
    { label: 'Lịch hẹn hôm nay', value: todayAppts.length, sub: `${pending} chờ xác nhận`, color: '#b2775b', bg: '#fdf0ea' },
    { label: 'Chờ xác nhận', value: pending, sub: 'Cần xử lý ngay', color: '#d97706', bg: '#fffbeb' },
    { label: 'Doanh thu hôm nay', value: formatVND(totalRev), sub: 'Từ lịch hẹn', color: '#059669', bg: '#ecfdf5' },
    { label: 'Tỷ lệ hoàn thành', value: `${rate}%`, sub: `${completed}/${todayAppts.length} dịch vụ`, color: '#7c3aed', bg: '#f5f3ff' },
  ];

  const recentNotifs = mockNotifications.slice(0, 5);
  const upcomingAppts = mockAppointments.filter(a => a.date === todayStr && a.status === 'confirmed').slice(0, 5);

  return (
    <div className="max-w-[1400px]">
      {/* Greeting */}
      <div style={{ marginBottom: '20px' }}>
        <h2 className="text-2xl font-semibold" style={{ color: '#3b2b25' }}>
          Chào buổi sáng, {user?.name || user?.fullName || 'Quản trị viên'} 👋
        </h2>
        <p style={{ color: '#78716c', fontSize: '14px', marginTop: '2px' }}>
          Thứ {new Date().getDay === 1 ? 'Hai' : new Date().getDay === 2 ? 'Ba' : new Date().getDay === 3 ? 'Tư' : new Date().getDay === 4 ? 'Năm' : new Date().getDay === 5 ? 'Sáu' : 'Chủ Nhật'}, {new Date().toLocaleDateString('vi-VN')}
        </p>
      </div>

      {/* Stats row */}
      <div className="dashboard-grid">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-card-icon" style={{ backgroundColor: s.bg }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: s.color }} />
            </div>
            <div className="stat-card-label">{s.label}</div>
            <div className="stat-card-value">{s.value}</div>
            <div className="stat-card-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* 2-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '16px', marginBottom: '24px' }}>
        {/* Today's appointments */}
        <div className="dashboard-table-card">
          <div className="salon-table-header" style={{ padding: '12px 16px', borderBottom: '1px solid #f0e4d8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, fontSize: '14px', color: '#3b2b25' }}>Lịch hẹn hôm nay</span>
            <button
              onClick={() => navigate('/admin/appointments')}
              style={{ background: 'none', border: 'none', color: '#b2775b', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
            >
              Xem tất cả →
            </button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="salon-table">
              <thead>
                <tr>
                  <th>Giờ</th>
                  <th>Khách hàng</th>
                  <th>Dịch vụ</th>
                  <th>NV</th>
                  <th>Trạng thái</th>
                  <th style={{ textAlign: 'right' }}>Tiền</th>
                </tr>
              </thead>
              <tbody>
                {upcomingAppts.map(a => (
                  <tr key={a.id}>
                    <td style={{ fontSize: '13px' }}>{a.time}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{a.customerName}</div>
                      <div style={{ fontSize: '11px', color: '#78716c' }}>{a.customerPhone}</div>
                    </td>
                    <td style={{ color: '#6b5b4f', fontSize: '12px' }}>{a.services.map(s => s.name).join(', ')}</td>
                    <td style={{ color: '#6b5b4f', fontSize: '12px' }}>{a.staffName}</td>
                    <td>
                      <span className={`badge badge-${a.status === 'in-progress' ? 'in-progress' : a.status === 'confirmed' ? 'confirmed' : a.status}`}>
                        {statusLabels[a.status] || a.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>{formatVND(a.totalPrice)}</td>
                  </tr>
                ))}
                {upcomingAppts.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: '#78716c', fontSize: '13px' }}>
                      Không có lịch hẹn hôm nay
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity feed */}
        <div className="dashboard-table-card">
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0e4d8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, fontSize: '14px', color: '#3b2b25' }}>Hoạt động gần đây</span>
            <button
              onClick={() => navigate('/admin/notifications')}
              style={{ background: 'none', border: 'none', color: '#b2775b', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
            >
              Xem tất cả →
            </button>
          </div>
          <div style={{ padding: '8px 0' }}>
            {recentNotifs.map(n => {
              const iconColor = n.type === 'appointment' ? '#b2775b' : n.type === 'payment' ? '#059669' : n.type === 'review' ? '#c9a84c' : '#7c3aed';
              return (
                <div key={n.id} style={{ padding: '10px 16px', borderBottom: '1px solid #faf8f6', display: 'flex', gap: '10px', opacity: n.read ? 0.7 : 1 }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: `${iconColor}1A`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: iconColor }} />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#3b2b25' }}>{n.title}</div>
                    <div style={{ fontSize: '11px', color: '#78716c', marginTop: '2px', lineHeight: '1.4' }}>{n.message}</div>
                    <div style={{ fontSize: '10px', color: '#b0a090', marginTop: '4px' }}>
                      {new Date(n.createdAt).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  {!n.read && <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#b2775b', flexShrink: 0, marginTop: '4px' }} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick actions + Additional stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Quick actions */}
        <div className="dashboard-table-card">
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #f0e4d8' }}>
            <span style={{ fontWeight: 600, fontSize: '14px', color: '#3b2b25' }}>Thao tác nhanh</span>
          </div>
          <div style={{ padding: '12px 16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {[
              { label: 'Đặt lịch mới', path: '/admin/booking', color: '#b2775b' },
              { label: 'Quản lý lịch hẹn', path: '/admin/appointments', color: '#b2775b' },
              { label: 'Thêm khách hàng', path: '/admin/customers', color: '#b2775b' },
              { label: 'Quản lý nhân viên', path: '/admin/staff', color: '#b2775b' },
              { label: 'Xem báo cáo', path: '/admin/reports', color: '#c9a84c' },
            ].map(a => (
              <button
                key={a.label}
                onClick={() => navigate(a.path)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: `1.5px solid ${a.color}`,
                  color: a.color,
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: 'white',
                  transition: 'opacity 0.2s',
                }}
                onMouseOver={e => e.currentTarget.style.opacity = '0.8'}
                onMouseOut={e => e.currentTarget.style.opacity = '1'}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* Key metrics */}
        <div className="dashboard-table-card">
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #f0e4d8' }}>
            <span style={{ fontWeight: 600, fontSize: '14px', color: '#3b2b25' }}>Thông tin salon</span>
          </div>
          <div style={{ padding: '12px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { label: 'Khách hàng', value: totalCustomers, color: '#b2775b' },
              { label: 'Nhân viên', value: totalStaff, color: '#a35f45' },
              { label: 'Dịch vụ', value: totalServices, color: '#c9a84c' },
              { label: 'Doanh thu', value: formatVND(totalRevenue), color: '#059669' },
            ].map(m => (
              <div key={m.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 700, color: m.color }}>{m.value}</div>
                <div style={{ fontSize: '11px', color: '#78716c', marginTop: '2px' }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
