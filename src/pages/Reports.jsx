import React from 'react';
import { revenueData, mockAppointments, mockPayments } from '../data/mockData';
import { formatVND } from '../utils';

export default function Reports({ onNavigate }) {
  const todayStr = new Date().toISOString().split('T')[0];

  const todayRevenue = mockAppointments
    .filter(a => a.date === todayStr && a.status !== 'cancelled')
    .reduce((s, a) => s + a.totalPrice, 0);

  const monthRevenue = mockPayments
    .filter(p => p.status === 'completed' && p.date.startsWith('2026-09'))
    .reduce((s, p) => s + p.finalAmount, 0);

  const totalRevenue = mockPayments
    .filter(p => p.status === 'completed')
    .reduce((s, p) => s + p.finalAmount, 0);

  const totalOrders = mockAppointments.filter(a => a.status === 'completed').length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const totalDiscount = mockPayments.filter(p => p.discount > 0).reduce((s, p) => s + p.discount, 0);

  const maxRevenue = Math.max(...revenueData.map(d => d.revenue));
  const barMaxHeight = 180;

  return (
    <div className="max-w-[1200px]">
      <h2 className="text-xl font-semibold" style={{ color: '#3b2b25', marginBottom: '20px' }}>Báo cáo doanh thu</h2>

      {/* Key metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        {[
          { label: 'Doanh thu hôm nay', value: formatVND(todayRevenue), sub: 'Từ lịch hẹn', color: '#b2775b', bg: '#fdf0ea' },
          { label: 'Doanh thu tháng 9', value: formatVND(monthRevenue), sub: '9 tháng 2026', color: '#059669', bg: '#ecfdf5' },
          { label: 'Tổng doanh thu', value: formatVND(totalRevenue), sub: 'Tất cả thời gian', color: '#c9a84c', bg: '#fdf7e8' },
          { label: 'Đơn hàng trung bình', value: formatVND(avgOrderValue), sub: `Từ ${totalOrders} đơn`, color: '#7c3aed', bg: '#f5f3ff' },
          { label: 'Tổng giảm giá', value: formatVND(totalDiscount), sub: 'Đã chi cho khuyến mãi', color: '#d97706', bg: '#fffbeb' },
        ].map(s => (
          <div key={s.label} style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #f0e4d8' }}>
            <div style={{ fontSize: '11px', color: '#78716c', marginBottom: '4px' }}>{s.label}</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '11px', color: '#a09080', marginTop: '2px' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="dashboard-table-card" style={{ marginBottom: '24px' }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid #f0e4d8' }}>
          <span style={{ fontWeight: 600, fontSize: '14px', color: '#3b2b25' }}>Biểu đồ doanh thu (6 tháng)</span>
        </div>
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', height: `${barMaxHeight + 40}px` }}>
            {revenueData.map((d, i) => {
              const height = (d.revenue / maxRevenue) * barMaxHeight;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{ fontSize: '11px', color: '#78716c' }}>
                    {(d.revenue / 1000000).toFixed(1)}M
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: `${height}px`,
                      background: i === revenueData.length - 1 ? '#d97706' : '#b2775b',
                      borderRadius: '4px 4px 0 0',
                      minHeight: '4px',
                      transition: 'height 0.3s',
                    }}
                    title={`${d.month}: ${formatVND(d.revenue)}`}
                  />
                  <div style={{ fontSize: '11px', color: '#78716c', fontWeight: 600 }}>{d.month}</div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: '12px', fontSize: '11px', color: '#78716c', textAlign: 'center' }}>
            * Dữ liệu mẫu, không phản ánh thực tế
          </div>
        </div>
      </div>

      {/* Top services */}
      <div className="dashboard-table-card">
        <div style={{ padding: '14px 16px', borderBottom: '1px solid #f0e4d8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 600, fontSize: '14px', color: '#3b2b25' }}>Dịch vụ được yêu cầu nhiều nhất</span>
        </div>
        <table className="salon-table">
          <thead>
            <tr>
              <th>Dịch vụ</th>
              <th>Số lần</th>
              <th style={{ textAlign: 'right' }}>Doanh thu</th>
              <th style={{ textAlign: 'right' }}>Tỷ trọng</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'Cắt tóc nữ', count: 4, revenue: 530000 },
              { name: 'Highlight / Ombre', count: 2, revenue: 1000000 },
              { name: 'Fade / Undercut', count: 3, revenue: 360000 },
              { name: 'Uốn lơi Hàn Quốc', count: 1, revenue: 380000 },
              { name: 'Gội đầu phục hồi', count: 2, revenue: 350000 },
              { name: 'Duỗi / Thẳng tóc', count: 1, revenue: 500000 },
            ].map((s, i) => (
              <tr key={i}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#b2775b', flexShrink: 0 }} />
                    <span style={{ fontWeight: 500 }}>{s.name}</span>
                  </div>
                </td>
                <td style={{ textAlign: 'center', fontWeight: 600 }}>{s.count}</td>
                <td style={{ textAlign: 'right' }}>{formatVND(s.revenue)}</td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ height: '6px', background: '#f0e4d8', borderRadius: '3px', overflow: 'hidden', maxWidth: '100px' }}>
                    <div style={{ height: '100%', width: `${s.revenue / 3120000 * 100}%`, background: '#b2775b', borderRadius: '3px' }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
