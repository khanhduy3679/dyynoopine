// Strategy Pattern: mỗi hàm là một chiến lược validate độc lập, dễ thay thế/thêm mới.
export const validateFullName = (value) => {
  const name = value.trim();
  if (!name) return 'Họ và tên là bắt buộc';
  if (name.length < 2 || name.length > 50) return 'Họ và tên phải từ 2 đến 50 ký tự';
  return '';
};

export const validateEmail = (value) => {
  if (!value.trim()) return 'Email là bắt buộc';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email không đúng định dạng';
  return '';
};

export const validatePhone = (value) => {
  if (!value.trim()) return 'Số điện thoại là bắt buộc';
  if (!/^0\d{9}$/.test(value.trim())) return 'Số điện thoại phải có 10 chữ số và bắt đầu bằng 0';
  return '';
};

export const validatePassword = (value) => {
  if (!value) return 'Mật khẩu là bắt buộc';
  if (value.length < 6) return 'Mật khẩu phải có tối thiểu 6 ký tự';
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) return 'Mật khẩu phải có ít nhất 1 chữ và 1 số';
  return '';
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return 'Xác nhận mật khẩu là bắt buộc';
  if (password !== confirmPassword) return 'Xác nhận mật khẩu phải trùng với mật khẩu';
  return '';
};
