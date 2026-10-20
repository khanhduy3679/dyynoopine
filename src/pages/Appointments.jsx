import React, { useState, useEffect } from 'react';
import appointmentService from '../services/appointmentService';
import { useAuth } from '../contexts/AuthContext';
import { formatVND, formatDate, statusLabels, statusColors } from '../utils';

export default function Appointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('appointments');
  const [qrToken, setQrToken] = useState('');
  const [checkInResult, setCheckInResult] = useState(null);
  const [checkInError, setCheckInError] = useState('');
  const [checkInLoading, setCheckInLoading] = useState(false);

  const fetchAppointments = () => {
    setLoading(true);
    appointmentService.getAppointments()
      .then((res) => setAppointments(res.appointments || []))
      .catch((err) => setError(err.response?.data?.message || 'Không thể tải danh sách lịch hẹn'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const filtered = appointments.filter(a => {
    if (filter !== 'all' && a.status !== filter) return false;
    const custName = a.customerId?.fullName || a.customerName || '';
    const custPhone = a.customerId?.phone || a.customerPhone || '';
    if (search && !custName.toLowerCase().includes(search.toLowerCase()) && !custPhone.includes(search)) return false;
    if (dateFilter) {
      const aDate = new Date(a.startTime).toISOString().split('T')[0];
      if (aDate !== dateFilter) return false;
    }
    return true;
  }).sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

  const statusFilterOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'pending_otp', label: 'Chờ OTP' },
    { value: 'confirmed', label: 'Đã xác nhận' },
    { value: 'checked_in', label: 'Đã check-in' },
    { value: 'in_progress', label: 'Đang thực hiện' },
    { value: 'completed', label: 'Hoàn thành' },
    { value: 'cancelled', label: 'Đã hủy' },
  ];

  const handleStatusChange = (id, newStatus) => {
    appointmentService.updateStatus(id, newStatus)
      .then(() => fetchAppointments())
      .catch((err) => alert(err.response?.data?.message || 'Lỗi khi cập nhật trạng thái'));
  };

  const handleCancel = (id) => {
    if (window.confirm('Hủy lịch hẹn này?')) {
      handleStatusChange(id, 'cancelled');
    }
  };

  const handleCheckIn = async (event) => {
    event.preventDefault();
    setCheckInResult(null);
    setCheckInError('');
    setCheckInLoading(true);
    try {
      const response = await appointmentService.checkIn(qrToken.trim());
      setCheckInResult(response.appointment);
      fetchAppointments();
    } catch (err) {
      setCheckInError(err.response?.data?.message || 'Mã QR không hợp lệ hoặc đã được sử dụng');
    } finally {
      setCheckInLoading(false);
    }
  };

  return (
    <div className="max-w-[1200px]">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <h2 className="text-xl font-semibold" style={{ color: '#3b2b25' }}>Quản lý lịch hẹn</h2>
        <div className="appointments-tabs" role="tablist" aria-label="Lịch hẹn và check-in">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'appointments'}
            className={activeTab === 'appointments' ? 'active' : ''}
            onClick={() => setActiveTab('appointments')}
          >
            Lịch hẹn
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'check-in'}
            className={activeTab === 'check-in' ? 'active' : ''}
            onClick={() => setActiveTab('check-in')}
          >
            Check-in
          </button>
        </div>
      </div>

      {activeTab === 'check-in' ? (
        <section className="dashboard-table-card" style={{ maxWidth: '640px', padding: '20px' }}>
          <h3 style={{ color: '#3b2b25', margin: '0 0 8px' }}>Check-in bằng mã QR</h3>
          <p style={{ color: '#78716c', fontSize: '13px', margin: '0 0 16px' }}>
            Nhập hoặc dán mã QR token của khách hàng để xác nhận check-in.
          </p>
          {checkInError && <div className="alert" role="alert">{checkInError}</div>}
          {checkInResult && (
            <div className="alert alert-success" role="status">
              <b>Check-in thành công!</b>
              <p>Khách: {checkInResult.customerName || '—'}</p>
              <p>Dịch vụ: {checkInResult.serviceName || '—'}</p>
              <p>
                Giờ hẹn: {new Date(checkInResult.startTime).toLocaleString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          )}
          <form onSubmit={handleCheckIn}>
            <label htmlFor="qr-token" style={{ display: 'block', fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>
              Mã QR token
            </label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <input
                id="qr-token"
                type="text"
                value={qrToken}
                onChange={event => setQrToken(event.target.value)}
                className="input-field"
                placeholder="Nhập hoặc dán qrToken"
                autoComplete="off"
                style={{ flex: '1 1 240px' }}
              />
              <button
                type="submit"
                className="btn-primary"
                disabled={!qrToken.trim() || checkInLoading}
                style={{ width: 'auto', minWidth: '120px' }}
              >
                {checkInLoading ? 'Đang xác nhận...' : 'Check-in'}
              </button>
            </div>
          </form>
        </section>
      ) : (
        <>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="input-field"
              style={{ width: '160px', padding: '8px 10px' }}
            >
              {statusFilterOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <input
              type="date"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className="input-field"
              style={{ width: '140px', padding: '8px 10px' }}
            />
            <input
              type="text"
              placeholder="Tìm khách..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field"
              style={{ width: '160px' }}
            />
          </div>

          {error && <div className="auth-alert" style={{ marginBottom: '16px' }}>{error}</div>}

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginBottom: '20px' }}>
        {['pending_otp', 'confirmed', 'checked_in', 'in_progress', 'completed', 'cancelled'].map(status => {
          const count = appointments.filter(a => a.status === status).length;
          return (
            <div key={status} style={{ background: 'white', borderRadius: '10px', padding: '12px 14px', border: '1px solid #f0e4d8' }}>
              <div style={{ fontSize: '11px', color: '#78716c', marginBottom: '2px' }}>{statusLabels[status] || status}</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#3b2b25' }}>{count}</div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-table-card">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}><span className="spinner" /></div>
        ) : (
          <table className="salon-table">
            <thead>
              <tr>
                <th>Ngày</th>
                <th>Giờ</th>
                <th>Khách hàng</th>
                <th>SĐT</th>
                <th>Dịch vụ</th>
                <th>Stylist</th>
                <th>Trạng thái</th>
                <th style={{ textAlign: 'right' }}>Giá tiền</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a._id || a.id}>
                  <td>{formatDate(a.startTime)}</td>
                  <td style={{ fontWeight: 600 }}>
                    {new Date(a.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{a.customerId?.fullName || a.customerName || 'Khách lẻ'}</div>
                  </td>
                  <td style={{ fontSize: '12px', color: '#6b5b4f' }}>
                    {a.customerId?.phone || a.customerPhone || '—'}
                  </td>
                  <td style={{ fontSize: '12px', color: '#6b5b4f' }}>
                    {a.serviceId?.name || (a.services && a.services.map(s => s.name).join(', ')) || '—'}
                  </td>
                  <td style={{ fontSize: '12px', color: '#6b5b4f' }}>
                    {a.staffId?.fullName || a.staffName || 'Bất kỳ'}
                  </td>
                  <td>
                    <span className={`badge ${statusColors[a.status] || 'badge-pending'}`}>
                      {statusLabels[a.status] || a.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>
                    {formatVND(a.serviceId?.price || a.totalPrice || 0)}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {(a.status === 'pending_otp' || a.status === 'confirmed') && (
                        <button
                          style={{ padding: '4px 8px', fontSize: '11px', border: '1.5px solid #fecaca', color: '#dc2626', borderRadius: '6px', background: 'white', cursor: 'pointer' }}
                          onClick={() => handleCancel(a._id || a.id)}
                        >
                          Hủy
                        </button>
                      )}
                      {a.status === 'confirmed' && (
                        <button
                          style={{ padding: '4px 8px', fontSize: '11px', border: '1.5px solid #d1fae5', color: '#059669', borderRadius: '6px', background: 'white', cursor: 'pointer' }}
                          onClick={() => handleStatusChange(a._id || a.id, 'checked_in')}
                        >
                          Check-in
                        </button>
                      )}
                      {a.status === 'checked_in' && (
                        <button
                          style={{ padding: '4px 8px', fontSize: '11px', border: '1.5px solid #d1fae5', color: '#059669', borderRadius: '6px', background: 'white', cursor: 'pointer' }}
                          onClick={() => handleStatusChange(a._id || a.id, 'in_progress')}
                        >
                          Bắt đầu
                        </button>
                      )}
                      {a.status === 'in_progress' && (
                        <button
                          style={{ padding: '4px 8px', fontSize: '11px', border: '1.5px solid #d1fae5', color: '#059669', borderRadius: '6px', background: 'white', cursor: 'pointer' }}
                          onClick={() => handleStatusChange(a._id || a.id, 'completed')}
                        >
                          Hoàn thành
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '30px', color: '#78716c' }}>
                    Không có lịch hẹn nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
        </>
      )}
    </div>
  );
}
