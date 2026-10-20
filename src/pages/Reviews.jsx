import React, { useState } from 'react';
import { mockReviews } from '../data/mockData';

const Stars = ({ rating, size = 13 }) => (
  <div style={{ display: 'flex', gap: '1px' }}>
    {[1, 2, 3, 4, 5].map(i => (
      <svg key={i} width={size} height={size} viewBox="0 0 12 12" fill={i <= rating ? '#c9a84c' : '#e5e7eb'}>
        <path d="M6 1l1.32 2.67 2.95.43-2.13 2.08.5 2.94L6 7.77l-2.64 1.35.5-2.94L1.73 4.1l2.95-.43L6 1z" />
      </svg>
    ))}
  </div>
);

export default function Reviews({ user }) {
  const [reviews, setReviews] = useState(mockReviews);
  const [filterRating, setFilterRating] = useState(0);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const filtered = reviews.filter(r => filterRating === 0 || r.rating === filterRating);
  const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  const dist = [5, 4, 3, 2, 1].map(n => ({
    n,
    count: reviews.filter(r => r.rating === n).length,
    pct: (reviews.filter(r => r.rating === n).length / reviews.length) * 100,
  }));

  const submitReply = (id) => {
    if (!replyText.trim()) return;
    setReviews(prev => prev.map(r => r.id === id ? { ...r, reply: replyText } : r));
    setReplyingTo(null);
    setReplyText('');
  };

  return (
    <div className="max-w-[1000px] space-y-5">
      <div className="dashboard-table-card">
        <div style={{ padding: '18px 20px', display: 'flex', gap: '20px', alignItems: 'center', borderBottom: '1px solid #f0e4d8' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#b2775b' }}>{avgRating.toFixed(1)}</div>
            <Stars rating={Math.round(avgRating)} size={16} />
            <div style={{ fontSize: '12px', color: '#78716c', marginTop: '4px' }}>{reviews.length} đánh giá</div>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {dist.map(({ n, count, pct }) => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => setFilterRating(filterRating === n ? 0 : n)}
                  style={{
                    padding: '2px 6px', borderRadius: '4px', fontSize: '11px',
                    fontWeight: filterRating === n ? 700 : 400, cursor: 'pointer',
                    color: filterRating === n ? '#c9a84c' : '#78716c',
                    border: `1px solid ${filterRating === n ? '#c9a84c' : 'transparent'}`,
                    background: filterRating === n ? '#fdf7e8' : 'transparent',
                  }}
                >
                  {n} ★
                </button>
                <div style={{ flex: 1, height: '4px', background: '#f0e4d8', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: '#c9a84c', borderRadius: '2px' }} />
                </div>
                <span style={{ fontSize: '11px', color: '#78716c', width: '16px', textAlign: 'right' }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {filterRating > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: '#6b5b4f' }}>Lọc: {filterRating} sao</span>
          <button onClick={() => setFilterRating(0)} style={{ background: 'none', border: 'none', color: '#78716c', fontSize: '11px', cursor: 'pointer' }}>Xóa lọc</button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.map(r => (
          <div key={r.id} className="dashboard-table-card" style={{ background: 'white' }}>
            <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f0e4d8' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#b2775b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>
                  {r.customerName.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{r.customerName}</div>
                  <Stars rating={r.rating} />
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', color: '#78716c' }}>{r.date.split('-').reverse().join('/')}</div>
                <div style={{ fontSize: '11px', color: '#a09080' }}>NV: {r.staffName}</div>
              </div>
            </div>
            <div style={{ padding: '10px 16px' }}>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                {r.services.map(s => (
                  <span key={s} style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', background: '#f0e4d8', color: '#6b5b4f' }}>{s}</span>
                ))}
              </div>
              {r.comment && <p style={{ fontSize: '13px', color: '#6b5b4f', lineHeight: '1.5', marginBottom: '8px' }}>{r.comment}</p>}
              {r.reply && (
                <div style={{ marginTop: '8px', padding: '8px 12px', background: '#fdf0ea', borderRadius: '6px', borderLeft: '3px solid #b2775b' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#b2775b', marginBottom: '2px' }}>Phản hồi từ Salon</div>
                  <p style={{ fontSize: '12px', color: '#6b5b4f' }}>{r.reply}</p>
                </div>
              )}
              {!r.reply && (
                <div style={{ marginTop: '4px' }}>
                  {replyingTo === r.id ? (
                    <div style={{ marginTop: '6px' }}>
                      <textarea
                        value={replyText} onChange={e => setReplyText(e.target.value)} rows={2}
                        placeholder="Viết phản hồi..."
                        style={{ width: '100%', border: '1px solid #f0e4d8', borderRadius: '6px', padding: '8px 10px', fontSize: '12px', resize: 'none', outline: 'none' }}
                      />
                      <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                        <button onClick={() => { setReplyingTo(null); setReplyText(''); }} style={{ padding: '5px 10px', borderRadius: '4px', border: '1px solid #f0e4d8', background: 'white', color: '#6b5b4f', fontSize: '11px', cursor: 'pointer' }}>Hủy</button>
                        <button onClick={() => submitReply(r.id)} style={{ padding: '5px 10px', borderRadius: '4px', background: '#b2775b', color: 'white', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>Gửi phản hồi</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setReplyingTo(r.id)} style={{ background: 'none', border: 'none', color: '#b2775b', fontSize: '11px', fontWeight: 600, cursor: 'pointer', padding: '2px 0' }}>
                      Trả lời đánh giá này
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
