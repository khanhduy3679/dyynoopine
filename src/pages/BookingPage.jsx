import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import appointmentService from '../services/appointmentService';
import catalogService from '../services/catalogService';

const BookingPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState({ serviceId: '', staffId: '', startTime: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    catalogService.getServices().then((data) => setServices(data.services || data.data || []));
    catalogService.getStaff().then((data) => setStaff(data.staff || data.data || []));
  }, []);

  const selectedService = services.find((s) => s._id === form.serviceId);
  const canNext = step === 1 ? form.serviceId : step === 2 ? form.startTime : true;

  const submit = async () => {
    setLoading(true); setMessage('');
    try {
      const payload = { serviceId: form.serviceId, startTime: form.startTime };
      if (form.staffId) payload.staffId = form.staffId;
      const res = await appointmentService.createAppointment(payload);
      navigate(`/appointments/${res.appointmentId}/otp`, { state: { otpExpiresAt: res.otpExpiresAt, demoOtp: res.demoOtp } });
    } catch (err) {
      setMessage(err.response?.data?.message || err.message || 'Không thể tạo lịch hẹn');
    } finally { setLoading(false); }
  };

  return <main className="booking-page"><div className="booking-card"><h1>Đặt lịch salon</h1><div className="steps"><span className={step===1?'active':''}>1. Dịch vụ</span><span className={step===2?'active':''}>2. Thời gian</span><span className={step===3?'active':''}>3. Xác nhận</span></div>{message && <div className="alert">{message}</div>}
    {step === 1 && <section><h2>Chọn dịch vụ</h2><div className="choice-grid">{services.map((s) => <button key={s._id} className={form.serviceId===s._id?'choice selected':'choice'} onClick={() => setForm({...form, serviceId:s._id})}><b>{s.name}</b><small>{s.duration} phút - {Number(s.price || 0).toLocaleString('vi-VN')}đ</small></button>)}</div><label>Stylist</label><select value={form.staffId} onChange={(e)=>setForm({...form, staffId:e.target.value})}>{staff.map((u)=><option key={u._id || 'any'} value={u._id}>{u.fullName}</option>)}</select></section>}
    {step === 2 && <section><h2>Chọn thời gian</h2><input type="datetime-local" value={form.startTime} onChange={(e)=>setForm({...form,startTime:e.target.value})}/><p className="muted">Hệ thống backend sẽ kiểm tra slot trống và giờ làm việc.</p></section>}
    {step === 3 && <section><h2>Xác nhận</h2><p>Dịch vụ: <b>{selectedService?.name}</b></p><p>Thời gian: <b>{form.startTime}</b></p><p>Stylist: <b>{staff.find((u)=>u._id===form.staffId)?.fullName || 'Bất kỳ'}</b></p></section>}
    <div className="wizard-actions"><button className="secondary-button" disabled={step===1} onClick={()=>setStep(step-1)}>Quay lại</button>{step<3 ? <button className="submit-button" disabled={!canNext} onClick={()=>setStep(step+1)}>Tiếp tục</button> : <button className="submit-button" disabled={loading} onClick={submit}>{loading?'Đang tạo...':'Tạo lịch & gửi OTP'}</button>}</div>
  </div></main>;
};
export default BookingPage;
