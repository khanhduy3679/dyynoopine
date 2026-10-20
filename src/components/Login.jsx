import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { validateFullName, validateEmail, validatePhone, validatePassword } from '../utils/authValidators';

export default function Login() {
  const { login, register } = useAuth();
  const [tab, setTab] = useState('login');

  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const emailErr = validateEmail(email);
    if (emailErr) { setError(emailErr); return; }
    if (!password) { setError('Vui lòng nhập mật khẩu'); return; }
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const nameErr = validateFullName(name);
    if (nameErr) { setError(nameErr); return; }
    const phoneErr = validatePhone(phone);
    if (phoneErr) { setError(phoneErr); return; }
    const emailErr = validateEmail(regEmail);
    if (emailErr) { setError(emailErr); return; }
    const passErr = validatePassword(regPassword);
    if (passErr) { setError(passErr); return; }
    setLoading(true);
    try {
      await register({ fullName: name, email: regEmail, phone, password: regPassword });
      setSuccess('Đăng ký thành công! Bạn có thể đăng nhập ngay.');
      setTab('login');
      setEmail(regEmail);
      setRegEmail(''); setRegPassword(''); setName(''); setPhone('');
    } catch (err) {
      setError(err.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <div className="auth-hero-bg" />
        <div className="auth-hero-content">
          <div className="brand-row">
            <div className="logo-icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M5 6c0-.5.5-1.5 1.5-2s4-1 5 0 2 2 1 4-3 4-5 5-4 1-5 0 0-4 1-5z" fill="#c9a84c" />
                <path d="M10 11c.5-.5 1.5-1 2-.5s1 1 .5 2-1 1.5-1.5 1.5-1-.5-1-1.5 0-1.5 0-1.5z" fill="#c9a84c" opacity="0.6" />
                <circle cx="13" cy="5" r="1.5" fill="#c9a84c" opacity="0.8" />
              </svg>
            </div>
            <div>
              <div className="brand-name">PHANMEM</div>
              <div className="brand-sub">Salon Booking</div>
            </div>
          </div>
          <h1>Quản lý salon<br /><span className="highlight">chuyên nghiệp</span></h1>
          <p>Hệ thống quản lý salon toàn diện — từ đặt lịch, nhân sự đến báo cáo doanh thu, tất cả trong một nền tảng.</p>
          <div className="auth-hero-stats">
            <div><div className="auth-hero-stat-val">1.200+</div><div className="auth-hero-stat-label">Khách hàng</div></div>
            <div><div className="auth-hero-stat-val">98%</div><div className="auth-hero-stat-label">Hài lòng</div></div>
            <div><div className="auth-hero-stat-val">45M</div><div className="auth-hero-stat-label">Doanh thu/tháng</div></div>
          </div>
        </div>
        <div className="auth-hero-footer">
          <img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=60&h=60&fit=crop&auto=format" alt="Salon" />
          <div>
            <div className="quote">"Tóc đẹp — Tự tin hơn mỗi ngày"</div>
            <div className="location">— PhanMem Salon, TP. Hồ Chí Minh</div>
          </div>
        </div>
      </div>
      <div className="auth-panel">
        <div className="auth-card">
          <div className="brand-row" style={{ justifyContent: 'center', marginBottom: '16px' }}>
            <div className="logo-icon" style={{ width: '32px', height: '32px' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4.5 5c0-.4.4-1.2 1.2-1.6s3.2-.8 4 0 1.6 1.6.8 3.2-2.4 3.6-4 4.4-4 1.6-4.5 0 0-3.2.8-4z" fill="#c9a84c" />
                <path d="M8.5 9.5c.4-.4 1.2-1 1.6-1s1.2 1 .8 1.6-1.2 1.2-1.6 1.2-1.6-.8-1.6-1.6 0-1.2-.4-1.2z" fill="#c9a84c" opacity="0.6" />
                <circle cx="11" cy="4.5" r="1.2" fill="#c9a84c" opacity="0.8" />
              </svg>
            </div>
            <span className="brand-name" style={{ fontSize: '18px' }}>PHANMEM</span>
          </div>
          <h2>{tab === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}</h2>
          <p style={{ color: '#78716c', fontSize: '13px', marginBottom: '20px', textAlign: 'center' }}>
            {tab === 'login' ? 'Chào mừng trở lại! Vui lòng đăng nhập.' : 'Điền thông tin để tạo tài khoản mới.'}
          </p>
          {/* Hiển thị lỗi / thành công */}
          {error && (
            <div style={{ padding: '8px 12px', borderRadius: '8px', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: '12px', marginBottom: '12px', textAlign: 'center' }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ padding: '8px 12px', borderRadius: '8px', background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#059669', fontSize: '12px', marginBottom: '12px', textAlign: 'center' }}>
              {success}
            </div>
          )}

          <div className="tab-bar">
            <button className={tab === 'login' ? 'active' : ''} onClick={() => { setTab('login'); setError(''); setSuccess(''); }}>Đăng nhập</button>
            <button className={tab === 'register' ? 'active' : ''} onClick={() => { setTab('register'); setError(''); setSuccess(''); }}>Đăng ký</button>
          </div>
          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label style={{ fontWeight: 600, fontSize: '13px', display: 'block', marginBottom: '4px' }}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@salon.vn" className="input-field" required />
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: '13px', display: 'block', marginBottom: '4px' }}>Mật khẩu</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="input-field" required />
              </div>
              <div className="form-row">
                <label className="remember-me"><input type="checkbox" /> Ghi nhớ đăng nhập</label>
                <button type="button" className="forgot-link">Quên mật khẩu?</button>
              </div>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? <span style={{ display: 'flex', alignItems: 'center' }}><span className="spinner" /> Đang xử lý...</span> : 'Đăng nhập'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontWeight: 600, fontSize: '13px', display: 'block', marginBottom: '4px' }}>Họ và tên</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nguyễn Văn An" className="input-field" required />
                </div>
                <div>
                  <label style={{ fontWeight: 600, fontSize: '13px', display: 'block', marginBottom: '4px' }}>Số điện thoại</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="0901234567" className="input-field" required />
                </div>
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: '13px', display: 'block', marginBottom: '4px' }}>Email</label>
                <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="email@salon.vn" className="input-field" required />
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: '13px', display: 'block', marginBottom: '4px' }}>Mật khẩu</label>
                <input type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} placeholder="Tối thiểu 6 ký tự (gồm chữ và số)" className="input-field" required />
              </div>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Đang tạo...' : 'Tạo tài khoản'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
