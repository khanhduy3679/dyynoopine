import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../apiClient';
import { formatVND } from '../utils';
import Modal from '../components/Modal';

export default function Services() {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '', duration: 30, price: 100000,
    description: '', active: true,
  });
  const [error, setError] = useState('');

  const fetchServices = () => {
    setLoading(true);
    apiClient.get('/services')
      .then((res) => setServices(res.data.services || []))
      .catch((err) => setError(err.response?.data?.message || 'Không thể tải danh sách dịch vụ'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const canEdit = user?.role === 'admin' || user?.role === 'staff';
  const canDelete = user?.role === 'admin';
  const categories = [];

  const filtered = services.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) || ''
  );

  const handleSave = async () => {
    if (!form.name) return alert('Nhập tên dịch vụ');
    const payload = {
      name: form.name,
      description: form.description,
      duration: Number(form.duration),
      price: Number(form.price),
      isActive: form.active,
    };
    try {
      if (editing) {
        await apiClient.put(`/services/${editing._id || editing.id}`, payload);
      } else {
        await apiClient.post('/services', payload);
      }
      fetchServices();
      setShowAdd(false);
      setEditing(null);
      setForm({ name: '', duration: 30, price: 100000, description: '', active: true });
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi lưu thông tin');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Xóa dịch vụ này?')) {
      try {
        await apiClient.delete(`/services/${id}`);
        fetchServices();
      } catch (err) {
        alert(err.response?.data?.message || 'Lỗi khi xóa');
      }
    }
  };

  return (
    <div className="max-w-[1200px]">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <h2 className="text-xl font-semibold" style={{ color: '#3b2b25' }}>Dịch vụ</h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Tìm theo tên dịch vụ..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field"
            style={{ width: '240px' }}
          />
          {canEdit && (
            <button className="btn-primary" onClick={() => { setForm({ name: '', duration: 30, price: 100000, description: '', active: true }); setEditing(null); setShowAdd(true); }} style={{ width: 'auto', padding: '8px 16px', fontSize: '13px' }}>
              + Thêm dịch vụ
            </button>
          )}
        </div>
      </div>

      {/* Category filter chips */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setSearch('')}
          style={{
            padding: '5px 12px',
            borderRadius: '999px',
            border: '1.5px solid',
            borderColor: !search ? '#b2775b' : '#ead5ca',
            background: !search ? '#fdf0ea' : 'white',
            color: !search ? '#b2775b' : '#6b5b4f',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Tất cả ({services.length})
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSearch(cat)}
            style={{
              padding: '5px 12px',
              borderRadius: '999px',
              border: '1.5px solid',
              borderColor: search === cat ? '#b2775b' : '#ead5ca',
              background: search === cat ? '#fdf0ea' : 'white',
              color: search === cat ? '#b2775b' : '#6b5b4f',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {cat} ({services.filter(s => s.category === cat).length})
          </button>
        ))}
      </div>

      {showAdd && (
        <Modal maxWidth="420px" ariaLabel={editing ? 'Sửa dịch vụ' : 'Thêm dịch vụ mới'}>
            <h3 className="text-lg font-semibold" style={{ marginBottom: '16px', color: '#3b2b25' }}>
              {editing ? 'Sửa dịch vụ' : 'Thêm dịch vụ mới'}
            </h3>
            <div className="space-y-3">
              <div>
                <label style={{ fontWeight: 600, fontSize: '13px', display: 'block', marginBottom: '4px' }}>Tên dịch vụ *</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Cắt tóc nam" />
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: '13px', display: 'block', marginBottom: '4px' }}>Danh mục</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-field">
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontWeight: 600, fontSize: '13px', display: 'block', marginBottom: '4px' }}>Thời gian (phút)</label>
                  <input type="number" min="5" max="300" value={form.duration} onChange={e => setForm({ ...form, duration: parseInt(e.target.value) || 0 })} className="input-field" />
                </div>
                <div>
                  <label style={{ fontWeight: 600, fontSize: '13px', display: 'block', marginBottom: '4px' }}>Giá (₫)</label>
                  <input type="number" min="0" value={form.price} onChange={e => setForm({ ...form, price: parseInt(e.target.value) || 0 })} className="input-field" />
                </div>
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: '13px', display: 'block', marginBottom: '4px' }}>Mô tả</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field" rows="2" placeholder="Mô tả ngắn về dịch vụ" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ fontWeight: 600, fontSize: '13px' }}>Hoạt động</label>
                <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} style={{ width: '16px', height: '16px', accentColor: '#b2775b' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
              <button className="btn-secondary" onClick={() => setShowAdd(false)}>Hủy</button>
              <button className="btn-primary" onClick={handleSave}>{editing ? 'Cập nhật' : 'Thêm mới'}</button>
            </div>
        </Modal>
      )}

      {/* Services grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
        {filtered.map(s => (
          <div
            key={s.id}
            style={{
              background: 'white',
              borderRadius: '14px',
              border: '1px solid #f0e4d8',
              padding: '16px',
              opacity: s.active ? 1 : 0.6,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#b2775b' }}>
                {s.category}
              </span>
              {!s.active && (
                <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: '#fee2e2', color: '#dc2626', fontWeight: 600 }}>
                  Tạm ngưng
                </span>
              )}
            </div>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#3b2b25', marginBottom: '4px' }}>{s.name}</h3>
            {s.description && <p style={{ fontSize: '12px', color: '#78716c', lineHeight: '1.4', marginBottom: '10px' }}>{s.description}</p>}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#b2775b' }}>{formatVND(s.price)}</div>
                <div style={{ fontSize: '11px', color: '#78716c' }}>{s.duration} phút</div>
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                {canEdit && (
                  <button
                    className="btn-secondary"
                    onClick={() => { setEditing(s); setForm({ name: s.name, category: s.category, duration: s.duration, price: s.price, description: s.description || '', active: s.active }); setShowAdd(true); }}
                    style={{ padding: '4px 8px', fontSize: '11px', minWidth: 'auto' }}
                  >
                    Sửa
                  </button>
                )}
                {canDelete && (
                  <button
                    className="btn-secondary"
                    onClick={() => handleDelete(s.id)}
                    style={{ padding: '4px 8px', fontSize: '11px', minWidth: 'auto', color: '#dc2626', borderColor: '#fecaca' }}
                  >
                    Xóa
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#78716c' }}>
            Không tìm thấy dịch vụ nào
          </div>
        )}
      </div>
    </div>
  );
}
