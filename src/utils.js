/**
 * Utility functions for Salon Booking App
 */

export const formatVND = (amount) => {
  if (typeof amount !== 'number') return amount;
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(amount);
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export const formatDateLong = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

export const today = new Date().toISOString().split('T')[0];

export const statusLabels = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  'in-progress': 'Đang thực hiện',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
  pending_otp: 'Chờ OTP',
  checked_in: 'Đã check-in',
  in_progress: 'Đang thực hiện',
  expired: 'Hết hạn',
};

export const statusColors = {
  pending: 'badge-pending',
  confirmed: 'badge-confirmed',
  'in-progress': 'badge-in-progress',
  completed: 'badge-completed',
  cancelled: 'badge-cancelled',
  pending_otp: 'badge-pending_otp',
  checked_in: 'badge-completed',
  in_progress: 'badge-in-progress',
  expired: 'badge-expired',
};

export const methodLabels = {
  cash: 'Tiền mặt',
  card: 'Thẻ',
  transfer: 'Chuyển khoản',
  momo: 'MoMo',
};

export const DAYS_VI = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

export const MONTHS_VI = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
];

export const getCalendarDays = (year, month) => {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startDay = first.getDay();
  const days = [];
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let d = 1; d <= last.getDate(); d++) days.push(d);
  return days;
};

export const timeSlots = () => {
  const slots = [];
  for (let h = 8; h < 19; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
    slots.push(`${String(h).padStart(2, '0')}:30`);
  }
  return slots;
};

export const getTodayRevenue = (appointments) => {
  const todayStr = new Date().toISOString().split('T')[0];
  return appointments
    .filter(a => a.date === todayStr && a.status !== 'cancelled')
    .reduce((s, a) => s + a.totalPrice, 0);
};
