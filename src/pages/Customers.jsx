import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../apiClient';
import { formatVND, formatDate } from '../utils';
import Modal from '../components/Modal';

export default function Customers() {
  const { user } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ fullName: '', phone: '', email: '', gender: 'female', birthday: '', address: '', notes: '' });
  const [error, setError] = useState('');

  const fetchCustomers = () => {
    setLoading(true);
    apiClient.get('/users/customers')
      .then((res) => setCustomers(res.data.customers || []))
      .catch((err) => setError(err.response?.data?.message || 'Không thể tải danh sách khách hàng'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const canEdit = user?.role === 'admin' || user?.role === 'staff';
  const canDelete = user?.role === 'admin';

  const filtered = customers.filter(c =>
    (c.fullName?.toLowerCase().includes(search.toLowerCase()) || '') ||
    (c.phone?.includes(search) || '')
  );

  const handleSave = async () => {
    if (!form.fullName || !form.phone) return alert('Nhập đủ họ tên và SĐT');
    try {
      if (editing) {
        await apiClient.put(`/users/customers/${editing._id}`, form);
      } else {
        await apiClient.post('/users/customers', form);
      }
      fetchCustomers();
      setShowAdd(false);
      setEditing(null);
      setForm({ fullName: '', phone: '', email: '', gender: 'female', birthday: '', address: '', notes: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi lưu thông tin');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Khóa tài khoản khách hàng này?')) {
      try {
        await apiClient.delete(`/users/customers/${id}`);
        fetchCustomers();
      } catch (err) {
        alert(err.response?.data?.message || 'Lỗi khi xóa');
      }
    }
  };

  return (
    <div className="max-w-[1200px]">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <h2 className="text-xl font-semibold" style={{ color: '#3b2b25' }}>Khách hàng</h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Tìm theo tên hoặc SĐT..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field"
            style={{ width: '240px' }}
          />
          {canEdit && (
            <button className="btn-primary" onClick={() => { setForm({ fullName: '', phone: '', email: '', gender: 'female', birthday: '', address: '', notes: '' }); setEditing(null); setShowAdd(true); }} style={{ width: 'auto', padding: '8px 16px', fontSize: '13px' }}>
              + Thêm khách
            </button>
          )}
        </div>
      </div>

      {showAdd && (
        <Modal maxWidth="480px" ariaLabel={editing ? 'Sửa thông tin khách hàng' : 'Thêm khách hàng mới'}>
            <h3 className="text-lg font-semibold" style={{ marginBottom: '16px', color: '#3b2b25' }}>
              {editing ? 'Sửa thông tin' : 'Thêm khách hàng mới'}
            </h3>
            <div className="space-y-3">
              <div>
                <label style={{ fontWeight: 600, fontSize: '13px', display: 'block', marginBottom: '4px' }}>Họ và tên *</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: '13px', display: 'block', marginBottom: '4px' }}>Số điện thoại *</label>
                <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="input-field" placeholder="0901234567" required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontWeight: 600, fontSize: '13px', display: 'block', marginBottom: '4px' }}>Email</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label style={{ fontWeight: 600, fontSize: '13px', display: 'block', marginBottom: '4px' }}>Giới tính</label>
                  <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} className="input-field">
                    <option value="female">Nữ</option>
                    <option value="male">Nam</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: '13px', display: 'block', marginBottom: '4px' }}>Ngày sinh</label>
                <input type="date" value={form.birthday} onChange={e => setForm({ ...form, birthday: e.target.value })} className="input-field" />
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: '13px', display: 'block', marginBottom: '4px' }}>Địa chỉ</label>
                <input type="text" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="input-field" placeholder="12 Lê Lợi, Q.1, TP.HCM" />
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: '13px', display: 'block', marginBottom: '4px' }}>Ghi chú</label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="input-field" rows="2" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
              <button className="btn-secondary" onClick={() => setShowAdd(false)}>Hủy</button>
              <button className="btn-primary" onClick={handleSave}>{editing ? 'Cập nhật' : 'Thêm mới'}</button>
            </div>
        </Modal>
      )}

      {/* Table */}
      <div className="dashboard-table-card">
        <table className="salon-table">
          <thead>
            <tr>
              <th>Khách hàng</th>
              <th>SĐT</th>
              <th>Email</th>
              <th>Lần đến</th>
              <th style={{ textAlign: 'right' }}>Đã chi</th>
              <th style={{ textAlign: 'right' }}>Lần</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{c.name}</div>
                  {c.address && <div style={{ fontSize: '11px', color: '#78716c' }}>{c.address}</div>}
                </td>
                <td>{c.phone}</td>
                <td style={{ color: '#6b5b4f', fontSize: '12px' }}>{c.email || '—'}</td>
                <td>{c.lastVisit ? formatDate(c.lastVisit) : '—'}</td>
                <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatVND(c.totalSpent)}</td>
                <td style={{ textAlign: 'center' }}>{c.totalVisits}</td>
                <td>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {canEdit && (
                      <button
                        className="btn-secondary"
                        onClick={() => { setEditing(c); setForm({ name: c.name, phone: c.phone, email: c.email || '', gender: c.gender, birthday: c.birthday || '', address: c.address || '', notes: c.notes || '' }); setShowAdd(true); }}
                        style={{ padding: '4px 8px', fontSize: '11px', minWidth: 'auto' }}
                      >
                        Sửa
                      </button>
                    )}
                    {canDelete && (
                      <button
                        className="btn-secondary"
                        onClick={() => handleDelete(c.id)}
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
                <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#78716c' }}>
                  Không tìm thấy khách hàng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
