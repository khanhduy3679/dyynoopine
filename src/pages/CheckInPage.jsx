import { useState } from 'react';
import appointmentService from '../services/appointmentService';

const CheckInPage = () => {
  const [qrToken, setQrToken] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const submit = async (e) => { e.preventDefault(); setResult(null); setError(''); try { const res = await appointmentService.checkIn(qrToken.trim()); setResult(res.appointment); } catch(err){ setError(err.response?.data?.message || 'Mã QR không hợp lệ hoặc đã được sử dụng'); } };
  return <main className="placeholder-page"><h1>Quét check-in</h1><p>Nhập hoặc quét mã QR token của khách hàng.</p>{error && <div className="alert">{error}</div>}{result && <div className="alert alert-success"><b>Check-in thành công!</b><p>Khách: {result.customerName}</p><p>Dịch vụ: {result.serviceName}</p><p>Trạng thái: {result.status}</p></div>}<form onSubmit={submit}><input value={qrToken} onChange={(e)=>setQrToken(e.target.value)} placeholder="Nhập qrToken"/><button className="submit-button" disabled={!qrToken.trim()}>Check-in</button></form></main>;
};
export default CheckInPage;
