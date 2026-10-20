import React, { useState } from 'react';
import { mockPayments } from '../data/mockData';
import { formatVND, methodLabels } from '../utils';

export default function Payments({ onNavigate, user }) {
  const [payments, setPayments] = useState(mockPayments);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = payments.filter(p => {
    if (filter !== 'all' && p.status !== filter) return false;
    if (search && !p.customerName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));

  const totalToday = payments.filter(p => p.date === new Date().toISOString().split('T')[0] && p.status === 'completed').reduce((s, p) => s + p.finalAmount, 0);
  const pendingCount = payments.filter(p => p.status === 'pending').length;

  return (
    <div className="max-w-[1200px]">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <h2 className="text-xl font-semibold" style={{ color: '#3b2b25' }}>Thanh toán</h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="input-field"
            style={{ width: '140px', padding: '8px 10px' }}
          >
            <option value="all">Tất cả</option>
            <option value="completed">Đã hoàn tất</option>
            <option value="pending">Chờ thanh toán</option>
            <option value="refunded">Đã hoàn tiền</option>
          </select>
          <input
            type="text"
            placeholder="Tìm khách..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field"
            style={{ width: '160px', padding: '8px 10px' }}
          />
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginBottom: '20px' }}>
        <div style={{ background: 'white', borderRadius: '10px', padding: '12px 14px', border: '1px solid #f0e4d8' }}>
          <div style={{ fontSize: '11px', color: '#78716c', marginBottom: '2px' }}>Doanh thu hôm nay</div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#059669' }}>{formatVND(totalToday)}</div>
        </div>
        <div style={{ background: 'white', borderRadius: '10px', padding: '12px 14px', border: '1px solid #f0e4d8' }}>
          <div style={{ fontSize: '11px', color: '#d97706', marginBottom: '2px' }}>Chờ thanh toán</div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#d97706' }}>{pendingCount}</div>
        </div>
        <div style={{ background: 'white', borderRadius: '10px', padding: '12px 14px', border: '1px solid #f0e4d8' }}>
          <div style={{ fontSize: '11px', color: '#78716c', marginBottom: '2px' }}>Tổng đã thu</div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#b2775b' }}>
            {formatVND(payments.filter(p => p.status === 'completed').reduce((s, p) => s + p.finalAmount, 0))}
          </div>
        </div>
      </div>

      <div className="dashboard-table-card">
        <table className="salon-table">
          <thead>
            <tr>
              <th>Phiếu</th>
              <th>Khách hàng</th>
              <th>NV</th>
              <th>Dịch vụ</th>
              <th>Ngày</th>
              <th>Giờ</th>
              <th>Phương thức</th>
              <th style={{ textAlign: 'right' }}>Giá</th>
              <th style={{ textAlign: 'right' }}>Giảm</th>
              <th style={{ textAlign: 'right' }}>Thực</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td style={{ fontSize: '12px' }}>{p.id}</td>
                <td>
                  <div style={{ fontWeight: 600 }}>{p.customerName}</div>
                </td>
                <td style={{ fontSize: '12px', color: '#6b5b4f' }}>{p.staffName}</td>
                <td style={{ fontSize: '11px', color: '#78716c' }}>{p.services.join(', ')}</td>
                <td>{p.date}</td>
                <td style={{ fontSize: '12px' }}>{p.time || '—'}</td>
                <td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, background: '#fef3c7', color: '#92400e' }}>
                    {methodLabels[p.method] || p.method}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>{formatVND(p.amount)}</td>
                <td style={{ textAlign: 'right', color: p.discount > 0 ? '#059669' : '#78716c' }}>
                  {p.discount > 0 ? `-${formatVND(p.discount)}` : '—'}
                </td>
                <td style={{ textAlign: 'right', fontWeight: 700 }}>{formatVND(p.finalAmount)}</td>
                <td>
                  <span className={`badge ${p.status === 'completed' ? 'badge-completed' : p.status === 'pending' ? 'badge-pending' : 'badge-cancelled'}`}>
                    {p.status === 'completed' ? 'Đã hoàn tất' : p.status === 'pending' ? 'Chờ thanh toán' : 'Đã hoàn tiền'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {p.status === 'pending' && (
                      <button
                        className="btn-gold"
                        onClick={() => {
                          setPayments(payments.map(pp => pp.id === p.id ? { ...pp, status: 'completed', time: new Date().toTimeString().slice(0, 5) } : pp));
                        }}
                        style={{ padding: '4px 8px', fontSize: '11px', minWidth: 'auto' }}
                      >
                        Thanh toán
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="12" style={{ textAlign: 'center', padding: '30px', color: '#78716c' }}>Không có phiên thanh toán nào</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
