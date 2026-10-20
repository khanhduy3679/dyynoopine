import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../apiClient';
import Modal from '../components/Modal';

export default function Staff() {
  const { user } = useAuth();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    fullName: '', phone: '', email: '', password: '', role: 'staff',
    specialties: '', workDays: [1,2,3,4,5,6], startTime: '08:00', endTime: '18:00',
    rating: 5, active: true,
  });
  const [error, setError] = useState('');

  const fetchStaff = () => {
    setLoading(true);
    apiClient.get('/users/staff')
      .then((res) => setStaff(res.data.staff || []))
      .catch((err) => setError(err.response?.data?.message || 'Không thể tải danh sách nhân viên'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const canEdit = user?.role === 'admin';
  const canDelete = user?.role === 'admin';

  const filtered = staff.filter(s =>
    (s.fullName?.toLowerCase().includes(search.toLowerCase()) || '') ||
    (s.role?.toLowerCase().includes(search.toLowerCase()) || '')
  );

  const handleSave = async () => {
    if (!form.fullName || !form.phone) return alert('Nhập đủ họ tên và SĐT');
    if (!editing && !form.password) return alert('Nhân viên mới cần mật khẩu');
    try {
      const payload = { ...form, specialties: form.specialties.split(',').map(s => s.trim()) };
      if (!form.password) delete payload.password;
      
      if (editing) {
        await apiClient.put(`/users/staff/${editing._id}`, payload);
      } else {
        await apiClient.post('/users/staff', payload);
      }
      fetchStaff();
      setShowAdd(false);
      setEditing(null);
      setForm({ fullName: '', phone: '', email: '', password: '', role: 'staff', specialties: '', workDays: [1,2,3,4,5,6], startTime: '08:00', endTime: '18:00', rating: 5, active: true });
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi lưu thông tin');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Khóa tài khoản nhân viên này?')) {
      try {
        await apiClient.delete(`/users/staff/${id}`);
        fetchStaff();
      } catch (err) {
        alert(err.response?.data?.message || 'Lỗi khi xóa');
      }
    }
  };

  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  if (loading) return <div className="placeholder-page">Đang tải...</div>;
  if (error) return <div className="auth-alert">{error}</div>;

  return (
    <div className="max-w-[1200px]">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <h2 className="text-xl font-semibold" style={{ color: '#3b2b25' }}>Nhân viên</h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Tìm theo tên hoặc vai trò..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field"
            style={{ width: '240px' }}
          />
          {canEdit && (
            <button className="btn-primary" onClick={() => { setForm({ fullName: '', phone: '', email: '', password: '', role: 'staff', specialties: '', workDays: [1,2,3,4,5,6], startTime: '08:00', endTime: '18:00', rating: 5, active: true }); setEditing(null); setShowAdd(true); }} style={{ width: 'auto', padding: '8px 16px', fontSize: '13px' }}>
              + Thêm NV
            </button>
          )}
        </div>
      </div>

      {showAdd && (
        <Modal maxWidth="520px" ariaLabel={editing ? 'Sửa thông tin nhân viên' : 'Thêm nhân viên mới'}>
            <h3 className="text-lg font-semibold" style={{ marginBottom: '16px', color: '#3b2b25' }}>
              {editing ? 'Sửa thông tin' : 'Thêm nhân viên mới'}
            </h3>
            <div className="space-y-3">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontWeight: 600, fontSize: '13px', display: 'block', marginBottom: '4px' }}>Họ và tên *</label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label style={{ fontWeight: 600, fontSize: '13px', display: 'block', marginBottom: '4px' }}>SĐT *</label>
                  <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="input-field" />
                </div>
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: '13px', display: 'block', marginBottom: '4px' }}>Email</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-field" />
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: '13px', display: 'block', marginBottom: '4px' }}>Vai trò</label>
                <input type="text" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="input-field" placeholder="Thợ cắt tóc chính, Chuyên gia nhuộm..." />
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: '13px', display: 'block', marginBottom: '4px' }}>Chuyên môn (phân cách bằng dấu phẩy)</label>
                <input type="text" value={form.specialties} onChange={e => setForm({ ...form, specialties: e.target.value })} className="input-field" placeholder="Cắt tóc nam, Fade, Undercut, Barber" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontWeight: 600, fontSize: '13px', display: 'block', marginBottom: '4px' }}>Ca làm việc</label>
                  <select value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} className="input-field">
                    {['07:00','07:30','08:00','08:30','09:00','09:30'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div style={{ color: '#78716c', fontSize: '12px', display: 'flex', alignItems: 'center' }}>→</div>
                <div>
                  <label style={{ fontWeight: 600, fontSize: '13px', display: 'block', marginBottom: '4px' }}>&nbsp;</label>
                  <select value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} className="input-field">
                    {['17:00','17:30','18:00','18:30','19:00','19:30','20:00'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: '13px', display: 'block', marginBottom: '4px' }}>Ngày làm việc (click để chọn)</label>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {dayNames.map((d, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        const days = [...form.workDays];
                        if (days.includes(i)) days.splice(days.indexOf(i), 1);
                        else days.push(i);
                        setForm({ ...form, workDays: days.sort() });
                      }}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: `1.5px solid ${form.workDays.includes(i) ? '#b2775b' : '#ead5ca'}`,
                        background: form.workDays.includes(i) ? '#fdf0ea' : 'white',
                        color: form.workDays.includes(i) ? '#b2775b' : '#6b5b4f',
                        fontWeight: 600,
                        fontSize: '12px',
                        cursor: 'pointer',
                        minWidth: '36px',
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontWeight: 600, fontSize: '13px', display: 'block', marginBottom: '4px' }}>Đánh giá (0-5)</label>
                  <input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={e => setForm({ ...form, rating: parseFloat(e.target.value) || 0 })} className="input-field" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label style={{ fontWeight: 600, fontSize: '13px' }}>Hoạt động</label>
                  <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} style={{ width: '16px', height: '16px', accentColor: '#b2775b' }} />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
              <button className="btn-secondary" onClick={() => setShowAdd(false)}>Hủy</button>
              <button className="btn-primary" onClick={handleSave}>{editing ? 'Cập nhật' : 'Thêm mới'}</button>
            </div>
        </Modal>
      )}

      <div className="dashboard-table-card">
        <table className="salon-table">
          <thead>
            <tr>
              <th>Nhân viên</th>
              <th>Vai trò</th>
              <th>Chuyên môn</th>
              <th>Ca làm</th>
              <th>Rating</th>
              <th>Dịch vụ</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s._id || s.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#b2775b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', flexShrink: 0 }}>
                      {(s.fullName || s.name).charAt(0)}
                    </div>
                    <div style={{ fontWeight: 600 }}>{s.fullName || s.name}</div>
                  </div>
                </td>
                <td style={{ color: '#6b5b4f' }}>{s.role === 'staff' ? 'Nhân viên' : s.role}</td>
                <td style={{ fontSize: '12px', color: '#78716c' }}>{(s.specialties || []).join(', ')}</td>
                <td>
                  <span style={{ fontSize: '12px' }}>{s.startTime} – {s.endTime}</span>
                </td>
                <td>
                  <span style={{ color: '#c9a84c', fontWeight: 600 }}>★ {s.rating || 5}</span>
                </td>
                <td style={{ textAlign: 'center' }}>{s.totalServices || 0}</td>
                <td>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {canEdit && (
                      <button
                        className="btn-secondary"
                        onClick={() => {
                          setEditing(s);
                          setForm({ fullName: s.fullName || s.name, phone: s.phone, email: s.email || '', password: '', role: s.role || 'staff', specialties: (s.specialties || []).join(', '), workDays: [...(s.workDays || [1,2,3,4,5,6])], startTime: s.startTime, endTime: s.endTime, rating: s.rating || 5, active: s.active !== false });
                          setShowAdd(true);
                        }}
                        style={{ padding: '4px 8px', fontSize: '11px', minWidth: 'auto' }}
                      >
                        Sửa
                      </button>
                    )}
                    {canDelete && (
                      <button
                        className="btn-secondary"
                        onClick={() => handleDelete(s._id || s.id)}
                        style={{ padding: '4px 8px', fontSize: '11px', minWidth: 'auto', color: '#dc2626', borderColor: '#fecaca' }}
                      >
                        Xóa
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#78716c' }}>Không tìm thấy nhân viên nào</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
