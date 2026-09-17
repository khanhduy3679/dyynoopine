import { useEffect, useState } from 'react';
import QRCode from 'qrcode.react';
import appointmentService from '../services/appointmentService';

const MyAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState('');
  const load = () => appointmentService.getMyAppointments().then((res) => setAppointments(res.appointments || res.data || [])).catch((err) => setMessage(err.response?.data?.message || 'Không tải được lịch hẹn'));
  useEffect(load, []);
  const cancel = async (id) => { await appointmentService.updateStatus(id, 'cancelled'); load(); };
  return <main className="booking-page"><div className="booking-card wide"><h1>Lịch hẹn của tôi</h1>{message && <div className="alert">{message}</div>}{appointments.length===0 && <p>Chưa có lịch hẹn.</p>}<div className="appointment-list">{appointments.map((a)=><article className="appointment-item" key={a._id}><div><h3>{a.serviceId?.name || a.serviceName || 'Dịch vụ salon'}</h3><p>Thời gian: {new Date(a.startTime).toLocaleString('vi-VN')}</p><p>Trạng thái: <b>{a.status}</b></p>{['pending_otp','confirmed'].includes(a.status) && <button className="secondary-button" onClick={()=>cancel(a._id)}>Hủy lịch</button>}</div>{a.status==='confirmed' && a.qrToken && <div className="qr-box"><QRCode value={a.qrToken} size={140}/><small>{a.qrToken}</small></div>}</article>)}</div></div></main>;
};
export default MyAppointmentsPage;
