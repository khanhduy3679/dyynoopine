import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { validateConfirmPassword, validateEmail, validateFullName, validatePassword, validatePhone } from '../utils/authValidators';

const validateFormSilently = (data) => !validateFullName(data.fullName) && !validateEmail(data.email) && !validatePhone(data.phone) && !validatePassword(data.password) && !validateConfirmPassword(data.password, data.confirmPassword);

const Field = ({ label, name, type, value, error, onChange, onBlur, placeholder }) => (
  <div className="form-group"><label htmlFor={name}>{label}</label><input id={name} name={name} type={type} value={value} onChange={onChange} onBlur={onBlur} placeholder={placeholder} />{error && <div className="field-error">{error}</div>}</div>
);

const PasswordField = ({ label, name, value, error, show, setShow, onChange, onBlur }) => (
  <div className="form-group"><label htmlFor={name}>{label}</label><div className="input-wrapper"><input id={name} name={name} type={show ? 'text' : 'password'} value={value} onChange={onChange} onBlur={onBlur} placeholder="Nhập mật khẩu" /><button className="password-toggle" type="button" onClick={() => setShow(!show)} aria-label="Hiện hoặc ẩn mật khẩu">{show ? <EyeOff size={20} /> : <Eye size={20} />}</button></div>{error && <div className="field-error">{error}</div>}</div>
);

const Register = () => {
  const navigate = useNavigate();
  const { register, loading, error, clearError } = useAuth();
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => clearError(), [formData.fullName, formData.email, formData.phone, formData.password, formData.confirmPassword, clearError]);

  const getError = (name, value = formData[name]) => {
    if (name === 'fullName') return validateFullName(value);
    if (name === 'email') return validateEmail(value);
    if (name === 'phone') return validatePhone(value);
    if (name === 'password') return validatePassword(value);
    return validateConfirmPassword(formData.password, value);
  };

  const validateField = (name, value) => {
    const message = getError(name, value);
    setErrors((prev) => ({ ...prev, [name]: message }));
    return !message;
  };

  const validateForm = () => {
    const nextErrors = {
      fullName: validateFullName(formData.fullName), email: validateEmail(formData.email), phone: validatePhone(formData.phone),
      password: validatePassword(formData.password), confirmPassword: validateConfirmPassword(formData.password, formData.confirmPassword)
    };
    setErrors(nextErrors);
    return Object.values(nextErrors).every((msg) => !msg);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccess('');
    if (touched[name]) validateField(name, value);
  };

  const handleBlur = (event) => {
    setTouched((prev) => ({ ...prev, [event.target.name]: true }));
    validateField(event.target.name, event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched({ fullName: true, email: true, phone: true, password: true, confirmPassword: true });
    if (!validateForm()) return;
    const result = await register(formData);
    if (result.success) {
      setSuccess(result.message || 'Đăng ký thành công. Đang chuyển sang trang đăng nhập...');
      setTimeout(() => navigate('/login'), 1200);
    }
  };

  const isValid = Object.values(formData).every(Boolean) && validateFormSilently(formData);

  return (
    <div className="auth-page">
      <section className="auth-hero"><h1>Salon Booking</h1><p>Tạo tài khoản khách hàng để đặt lịch salon tóc và theo dõi lịch hẹn dễ dàng.</p></section>
      <section className="auth-panel"><div className="auth-card"><div className="brand">Salon Booking</div><h2>Đăng ký</h2>
        {error && <div className="alert">{error}</div>}{success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSubmit} noValidate>
          <Field label="Họ và tên" name="fullName" type="text" value={formData.fullName} error={touched.fullName && errors.fullName} onChange={handleChange} onBlur={handleBlur} placeholder="Nguyễn Văn A" />
          <Field label="Email" name="email" type="email" value={formData.email} error={touched.email && errors.email} onChange={handleChange} onBlur={handleBlur} placeholder="a@example.com" />
          <Field label="Số điện thoại" name="phone" type="tel" value={formData.phone} error={touched.phone && errors.phone} onChange={handleChange} onBlur={handleBlur} placeholder="0901234567" />
          <PasswordField label="Mật khẩu" name="password" value={formData.password} error={touched.password && errors.password} show={showPassword} setShow={setShowPassword} onChange={handleChange} onBlur={handleBlur} />
          <PasswordField label="Xác nhận mật khẩu" name="confirmPassword" value={formData.confirmPassword} error={touched.confirmPassword && errors.confirmPassword} show={showConfirmPassword} setShow={setShowConfirmPassword} onChange={handleChange} onBlur={handleBlur} />
          <button className="submit-button" disabled={!isValid || loading}>{loading && <span className="spinner" />} {loading ? 'Đang xử lý...' : 'Đăng ký'}</button>
        </form><p className="auth-footer">Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
      </div></section>
    </div>
  );
};

export default Register;
