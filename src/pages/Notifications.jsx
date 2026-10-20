import React, { useState } from 'react';
import { mockNotifications } from '../data/mockData';

const typeConfig = {
  appointment: { color: '#b2775b', bg: '#fdf0ea', label: 'Lịch hẹn', icon: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="2.5" width="12" height="10" rx="1.5" />
      <path d="M4 1v3M10 1v3M1 6h12" />
    </svg>
  )},
  payment: { color: '#059669', bg: '#ecfdf5', label: 'Thanh toán', icon: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="3" width="12" height="8" rx="1.5" />
      <path d="M1 6.5h12M4 10h3" />
    </svg>
  )},
  review: { color: '#c9a84c', bg: '#fdf7e8', label: 'Đánh giá', icon: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M7 1.5l1.2 2.5 2.5.4-1.8 1.7.4 2.4L7 6.2l-2.2 1.3.4-2.4L2.5 4.4l2.5-.4L7 1.5z" />
    </svg>
  )},
  system: { color: '#7c3aed', bg: '#f5f3ff', label: 'Hệ thống', icon: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="7" cy="7" r="5.5" />
      <path d="M7 4v3M7 10.5v.5" />
    </svg>
  )},
};

export default function Notifications({ user }) {
  const [notifs, setNotifs] = useState(mockNotifications);
  const [filter, setFilter] = useState('all');

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const deleteNotif = (id) => setNotifs(prev => prev.filter(n => n.id !== id));

  const filtered = notifs.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'all') return true;
    return n.type === filter;
  });

  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {[
            ['all', 'Tất cả'],
            ['unread', `Chưa đọc (${unreadCount})`],
            ['appointment', 'Lịch hẹn'],
            ['payment', 'Thanh toán'],
            ['review', 'Đánh giá'],
            ['system', 'Hệ thống'],
          ].map(([v, l]) => (
            <button
              key={v}
              onClick={() => setFilter(v)}
              style={{
                padding: '5px 10px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: filter === v ? 600 : 400,
                cursor: 'pointer',
                background: filter === v ? '#b2775b' : 'white',
                color: filter === v ? 'white' : '#6b5b4f',
                border: `1px solid ${filter === v ? '#b2775b' : '#f0e4d8'}`,
              }}
            >
              {l}
            </button>
          ))}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: '#b2775b', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
            Đánh dấu tất cả đã đọc
          </button>
        )}
      </div>

      {/* List */}
      <div className="dashboard-table-card" style={{ background: 'white' }}>
        {filtered.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#78716c' }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 8px', color: '#d1d5db' }}>
              <path d="M16 3A9 9 0 007 12v6L4 22h24l-3-4v-6A9 9 0 0016 3z" />
              <path d="M13 22v1a3 3 0 006 0v-1" />
            </svg>
            <p style={{ fontSize: '13px' }}>Không có thông báo nào</p>
          </div>
        )}
        {filtered.map((n, i) => {
          const cfg = typeConfig[n.type] || typeConfig.system;
          return (
            <div
              key={n.id}
              style={{
                padding: '12px 16px',
                borderBottom: i < filtered.length - 1 ? '1px solid #faf8f6' : 'none',
                background: n.read ? 'white' : '#fdf0ea',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
                transition: 'background 0.2s',
              }}
              onMouseOver={e => !n.read && (e.currentTarget.style.background = '#f5ede6')}
              onMouseOut={e => !n.read && (e.currentTarget.style.background = '#fdf0ea')}
            >
              <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                <span style={{ color: cfg.color }}>{cfg.icon}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ fontWeight: 600, fontSize: '13px', color: '#3b2b25' }}>{n.title}</span>
                  <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: cfg.bg, color: cfg.color, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {cfg.label}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#78716c', marginTop: '3px', lineHeight: '1.4' }}>{n.message}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                  <span style={{ fontSize: '10px', color: '#b0a090' }}>
                    {new Date(n.createdAt).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {!n.read && (
                      <button
                        onClick={() => markRead(n.id)}
                        style={{ background: 'none', border: 'none', color: '#78716c', fontSize: '11px', cursor: 'pointer', fontWeight: 500 }}
                      >
                        Đánh dấu đã đọc
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotif(n.id)}
                      style={{ background: 'none', border: 'none', color: '#d1d5db', fontSize: '11px', cursor: 'pointer' }}
                      onMouseOver={e => e.currentTarget.style.color = '#dc2626'}
                      onMouseOut={e => e.currentTarget.style.color = '#d1d5db'}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
              {!n.read && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#b2775b', flexShrink: 0, marginTop: '4px' }} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
