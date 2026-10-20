import React, { useState } from 'react';

export default function Account({ user, onLogout }) {
  const [tab, setTab] = useState('profile');
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || '');
  const [email, setEmail] = useState(user.email);
  const [saved, setSaved] = useState(false);
  const [pwCurrent, setPwCurrent] = useState('');
  const [pwNew, setPwNew] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [pwSaved, setPwSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handlePasswordChange = () => {
    if (pwNew === pwConfirm && pwNew.length >= 6) {
      setPwSaved(true);
      setPwCurrent(''); setPwNew(''); setPwConfirm('');
      setTimeout(() => setPwSaved(false), 2500);
    }
  };

  return (
    <div className="max-w-2xl space-y-5">
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', background: 'white', border: '1px solid #f0e4d8', borderRadius: '8px', padding: '3px' }}>
        {[
          ['profile', 'Thông tin cá nhân'],
          ['security', 'Bảo mật'],
        ].map(([t, l]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '7px 14px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: tab === t ? 600 : 400,
              cursor: 'pointer',
              background: tab === t ? '#b2775b' : 'white',
              color: tab === t ? 'white' : '#6b5b4f',
              border: 'none',
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {tab === 'profile' && (
        <div className="dashboard-table-card" style={{ background: 'white' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #f0e4d8', background: '#faf8f6', borderRadius: '12px 12px 0 0' }}>
            <h3 style={{ fontWeight: 600, fontSize: '15px', margin: 0, color: '#3b2b25' }}>Thông tin cá nhân</h3>
          </div>
          <form onSubmit={handleSave} style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '14px', borderBottom: '1px solid #f0e4d8' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#b2775b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '18px', flexShrink: 0 }}>
                {name.split(' ').map(n => n[0]).slice(-2).join('')}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '15px' }}>{name}</div>
                <div style={{ fontSize: '12px', color: '#78716c' }}>{user.roleLabel}</div>
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', color: '#b2775b', fontSize: '11px', fontWeight: 600, cursor: 'pointer', marginTop: '2px' }}
                >
                  Đổi ảnh đại diện
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ fontWeight: 600, fontSize: '12px', display: 'block', marginBottom: '4px', color: '#3b2b25' }}>Họ và tên</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="input-field" />
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: '12px', display: 'block', marginBottom: '4px', color: '#3b2b25' }}>Số điện thoại</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="input-field" />
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: '12px', display: 'block', marginBottom: '4px', color: '#3b2b25' }}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field" />
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: '12px', display: 'block', marginBottom: '4px', color: '#3b2b25' }}>Vai trò</label>
                <input value={user.roleLabel} readOnly className="input-field" style={{ background: '#f0e4d8', color: '#78716c', cursor: 'not-allowed' }} />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px' }}>
              <button type="submit" className="btn-primary" style={{ minWidth: '120px' }}>
                Lưu thay đổi
              </button>
              {saved && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#059669' }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 7l3.5 3.5L10 4" /></svg>
                  Đã lưu thành công
                </span>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Security tab */}
      {tab === 'security' && (
        <div className="dashboard-table-card" style={{ background: 'white' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #f0e4d8', background: '#faf8f6', borderRadius: '12px 12px 0 0' }}>
            <h3 style={{ fontWeight: 600, fontSize: '15px', margin: 0, color: '#3b2b25' }}>Bảo mật tài khoản</h3>
          </div>
          <div style={{ padding: '16px' }}>
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontWeight: 600, fontSize: '13px', marginBottom: '10px', color: '#3b2b25' }}>Đổi mật khẩu</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div>
                  <label style={{ fontWeight: 600, fontSize: '12px', display: 'block', marginBottom: '4px', color: '#3b2b25' }}>Mật khẩu hiện tại</label>
                  <input type="password" value={pwCurrent} onChange={e => setPwCurrent(e.target.value)} placeholder="••••••••" className="input-field" />
                </div>
                <div>
                  <label style={{ fontWeight: 600, fontSize: '12px', display: 'block', marginBottom: '4px', color: '#3b2b25' }}>Mật khẩu mới</label>
                  <input type="password" value={pwNew} onChange={e => setPwNew(e.target.value)} placeholder="Tối thiểu 6 ký tự" className="input-field" />
                </div>
                <div>
                  <label style={{ fontWeight: 600, fontSize: '12px', display: 'block', marginBottom: '4px', color: '#3b2b25' }}>Xác nhận mật khẩu mới</label>
                  <input type="password" value={pwConfirm} onChange={e => setPwConfirm(e.target.value)} placeholder="••••••••" className="input-field" />
                </div>
                <button
                  onClick={handlePasswordChange}
                  className="btn-primary"
                  style={{ minWidth: '140px' }}
                  disabled={pwNew !== pwConfirm || pwNew.length < 6}
                >
                  Cập nhật mật khẩu
                </button>
                {pwSaved && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#059669' }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1.5 5l2.5 2.5L8.5 3" /></svg>
                    Đã cập nhật
                  </span>
                )}
              </div>
            </div>

            <div style={{ borderTop: '1px solid #f0e4d8', paddingTop: '14px' }}>
              <h4 style={{ fontWeight: 600, fontSize: '13px', marginBottom: '8px', color: '#3b2b25' }}>Phiên đăng nhập</h4>
              {[
                { device: 'Chrome trên Windows 11', location: 'TP. Hồ Chí Minh', time: 'Hiện tại', current: true },
                { device: 'Safari trên iPhone 15', location: 'TP. Hồ Chí Minh', time: '2 giờ trước', current: false },
              ].map(s => (
                <div key={s.device} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #faf8f6' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 500 }}>{s.device}</div>
                    <div style={{ fontSize: '10px', color: '#78716c' }}>{s.location} · {s.time}</div>
                  </div>
                  {s.current ? (
                    <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: '#ecfdf5', color: '#059669', fontWeight: 600 }}>
                      Hiện tại
                    </span>
                  ) : (
                    <button
                      onClick={onLogout}
                      style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '11px', cursor: 'pointer', fontWeight: 500 }}
                    >
                      Đăng xuất
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
