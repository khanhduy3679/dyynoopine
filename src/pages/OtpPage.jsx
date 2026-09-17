import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import appointmentService from '../services/appointmentService';

const OtpPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(300);
  const [resendLeft, setResendLeft] = useState(30);
  useEffect(() => { const t = setInterval(()=>setSecondsLeft((s)=>Math.max(0,s-1)),1000); return()=>clearInterval(t); }, []);
  useEffect(() => { const t = setInterval(()=>setResendLeft((s)=>Math.max(0,s-1)),1000); return()=>clearInterval(t); }, []);
  const verify = async (e) => { e.preventDefault(); setMessage(''); try { await appointmentService.verifyOtp(id, otp); navigate('/my-appointments'); } catch(err){ setMessage(err.response?.data?.message || err.message || 'Mã OTP không đúng hoặc đã hết hạn'); } };
  return <main className="placeholder-page"><h1>Xác nhận OTP</h1><p>Nhập mã OTP 6 số để xác nhận lịch hẹn.</p>{location.state?.demoOtp && <div className="alert alert-success">OTP demo: <b>{location.state.demoOtp}</b></div>}<p>Còn lại: {Math.floor(secondsLeft/60)}:{String(secondsLeft%60).padStart(2,'0')}</p>{message && <div className="alert">{message}</div>}<form onSubmit={verify}><input value={otp} maxLength="6" onChange={(e)=>setOtp(e.target.value.replace(/\D/g,''))} placeholder="123456"/><button className="submit-button" disabled={otp.length!==6}>Xác nhận</button></form><button className="secondary-button" disabled={resendLeft>0} onClick={()=>setResendLeft(30)}>Gửi lại mã {resendLeft>0 && `(${resendLeft}s)`}</button><p><Link to="/booking">Đặt lịch khác</Link></p></main>;
};
export default OtpPage;
