import { Link } from 'react-router-dom';
import { CalendarCheck, Clock, QrCode, Scissors, ShieldCheck, Sparkles, Star, UserRound } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const featuredServices = [
  { icon: <Scissors size={24} />, title: 'Cắt & tạo kiểu', text: 'Tư vấn kiểu tóc phù hợp khuôn mặt, phong cách và công việc.' },
  { icon: <Sparkles size={24} />, title: 'Gội dưỡng sinh', text: 'Thư giãn với liệu trình gội, massage da đầu và chăm sóc tóc.' },
  { icon: <Star size={24} />, title: 'Nhuộm & phục hồi', text: 'Màu tóc thời trang, quy trình chăm sóc giúp tóc mềm khỏe hơn.' }
];

const bookingSteps = [
  { title: 'Chọn dịch vụ', text: 'Xem danh sách dịch vụ, thời lượng và stylist phù hợp.' },
  { title: 'Nhận OTP', text: 'Xác nhận lịch bằng mã OTP để hạn chế đặt lịch ảo.' },
  { title: 'Check-in QR', text: 'Đến salon và dùng mã QR để check-in nhanh chóng.' }
];

const HomePage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const displayName = user?.fullName || user?.name || user?.email;

  return (
    <main className="landing-page">
      <nav className="landing-nav">
        <Link className="landing-logo" to="/">
          <span>SB</span>
          Salon Booking
        </Link>
        <div className="landing-links">
          <a href="#services">Dịch vụ</a>
          <a href="#process">Quy trình</a>
          <a href="#features">Tính năng</a>
          {isAuthenticated ? (
            <>
              <Link to="/my-appointments">Lịch hẹn</Link>
              {(user?.role === 'staff' || user?.role === 'admin') && <Link to="/check-in">Check-in</Link>}
              <button className="nav-logout" onClick={logout}>Đăng xuất</button>
            </>
          ) : (
            <>
              <Link to="/login">Đăng nhập</Link>
              <Link className="nav-register" to="/register">Đăng ký</Link>
            </>
          )}
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <div className="eyebrow">Hair salon booking system</div>
          <h1>Đặt lịch salon tóc nhanh hơn, xác nhận an toàn hơn.</h1>
          <p>
            Trải nghiệm đặt lịch trực tuyến cho salon tóc với luồng chọn dịch vụ,
            stylist, OTP xác nhận và QR check-in khi đến cửa hàng.
          </p>
          {isAuthenticated && <div className="welcome-box">Xin chào, <b>{displayName}</b>! Bạn đã sẵn sàng đặt lịch hôm nay chưa?</div>}
          <div className="hero-actions">
            <Link className="primary-link" to={isAuthenticated ? '/booking' : '/register'}>
              {isAuthenticated ? 'Đặt lịch ngay' : 'Bắt đầu đăng ký'}
            </Link>
            <Link className="secondary-link" to={isAuthenticated ? '/my-appointments' : '/login'}>
              {isAuthenticated ? 'Xem lịch hẹn' : 'Tôi đã có tài khoản'}
            </Link>
          </div>
          <div className="hero-stats">
            <div><b>3 bước</b><span>Đặt lịch đơn giản</span></div>
            <div><b>OTP</b><span>Xác nhận an toàn</span></div>
            <div><b>QR</b><span>Check-in nhanh</span></div>
          </div>
        </div>

        <div className="hero-visual" aria-label="Mô phỏng thẻ lịch hẹn salon">
          <div className="appointment-preview">
            <div className="preview-top"><span>Lịch hẹn hôm nay</span><CalendarCheck size={26} /></div>
            <h3>Cắt & tạo kiểu tóc</h3>
            <p>Stylist Minh Anh · 09:30 sáng</p>
            <div className="preview-row"><Clock size={18} /> 45 phút</div>
            <div className="preview-row"><ShieldCheck size={18} /> Đã xác nhận OTP</div>
            <div className="qr-preview"><QrCode size={74} /><span>QR Check-in</span></div>
          </div>
        </div>
      </section>

      <section className="section-block" id="services">
        <div className="section-heading">
          <span>Dịch vụ nổi bật</span>
          <h2>Chăm sóc tóc theo nhu cầu của bạn</h2>
        </div>
        <div className="service-cards">
          {featuredServices.map((item) => (
            <article className="service-card" key={item.title}>
              <div className="card-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="process-section" id="process">
        <div className="section-heading">
          <span>Quy trình đặt lịch</span>
          <h2>Từ đặt lịch đến check-in đều rõ ràng</h2>
        </div>
        <div className="process-grid">
          {bookingSteps.map((step, index) => (
            <div className="process-card" key={step.title}>
              <div className="step-number">0{index + 1}</div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      
    </main>
  );
};

export default HomePage;
