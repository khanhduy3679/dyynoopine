import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import appointmentService from '../services/appointmentService';

const OtpPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [demoOtp, setDemoOtp] = useState(location.state?.demoOtp || '');
  const [secondsLeft, setSecondsLeft] = useState(300);
  const [resendLeft, setResendLeft] = useState(30);
  const [resending, setResending] = useState(false);

  useEffect(() => { const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000); return () => clearInterval(t); }, []);
  useEffect(() => { const t = setInterval(() => setResendLeft((s) => Math.max(0, s - 1)), 1000); return () => clearInterval(t); }, []);

  const verify = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await appointmentService.verifyOtp(id, otp);
      navigate('/my-appointments');
    } catch (err) {
      setMessage(err.response?.data?.message || err.message || 'Mã OTP không đúng hoặc đã hết hạn');
    }
  };

  const handleResendOtp = async () => {
    setMessage('');
    setResending(true);
    try {
      const res = await appointmentService.resendOtp(id);
      setSecondsLeft(300);
      setResendLeft(30);
      if (res.demoOtp) {
        setDemoOtp(res.demoOtp);
      }
      setMessage('Đã gửi lại mã OTP thành công!');
    } catch (err) {
      setMessage(err.response?.data?.message || err.message || 'Không thể gửi lại mã OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="placeholder-page">
      <h1>Xác nhận OTP</h1>
      <p>Nhập mã OTP 6 số để xác nhận lịch hẹn.</p>
      {demoOtp && <div className="alert alert-success">OTP demo: <b>{demoOtp}</b></div>}
      <p>Còn lại: {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')}</p>
      {message && <div className={message.includes('thành công') ? 'alert alert-success' : 'alert'}>{message}</div>}
      <form onSubmit={verify}>
        <input value={otp} maxLength="6" onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} placeholder="123456" />
        <button className="submit-button" disabled={otp.length !== 6}>Xác nhận</button>
      </form>
      <button
        className="secondary-button"
        disabled={resendLeft > 0 || resending}
        onClick={handleResendOtp}
        style={{ marginTop: '12px' }}
      >
        {resending ? 'Đang gửi...' : `Gửi lại mã ${resendLeft > 0 ? `(${resendLeft}s)` : ''}`}
      </button>
      <p><Link to="/booking">Đặt lịch khác</Link></p>
    </main>
  );
};

export default OtpPage;
