import apiClient from '../apiClient';

const appointmentService = {
  createAppointment(payload) {
    return apiClient.post('/appointments', payload).then((res) => res.data);
  },
  verifyOtp(id, otp) {
    return apiClient.post(`/appointments/${id}/verify-otp`, { otp }).then((res) => res.data);
  },
  resendOtp(id) {
    return apiClient.post(`/appointments/${id}/resend-otp`).then((res) => res.data);
  },
  getMyAppointments() {
    return apiClient.get('/appointments/my').then((res) => res.data);
  },
  getAppointments(params) {
    return apiClient.get('/appointments', { params }).then((res) => res.data);
  },
  checkIn(qrToken) {
    return apiClient.post('/appointments/check-in', { qrToken }).then((res) => res.data);
  },
  updateStatus(id, status) {
    return apiClient.patch(`/appointments/${id}/status`, { status }).then((res) => res.data);
  }
};

export default appointmentService;
