import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { validateEmail, validatePassword } from '../utils/authValidators';

const Login = () => {
  const { login, loading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => clearError(), [formData.email, formData.password, clearError]);

  const validateField = (name, value = formData[name]) => {
    const message = name === 'email' ? validateEmail(value) : validatePassword(value);
    setErrors((prev) => ({ ...prev, [name]: message }));
    return !message;
  };

  const validateForm = () => {
    const nextErrors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password)
    };
    setErrors(nextErrors);
    return !nextErrors.email && !nextErrors.password;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) validateField(name, value);
  };

  const handleBlur = (event) => {
    setTouched((prev) => ({ ...prev, [event.target.name]: true }));
    validateField(event.target.name, event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched({ email: true, password: true });
    if (validateForm()) await login(formData.email, formData.password, rememberMe);
  };

  const isValid = formData.email && formData.password && !validateEmail(formData.email) && !validatePassword(formData.password);

  return (
    <div className="auth-page">
      <section className="auth-hero"><h1>Salon Booking</h1><p>Đặt lịch salon tóc nhanh chóng, tiện lợi và chuyên nghiệp.</p></section>
      <section className="auth-panel">
        <div className="auth-card">
          <div className="brand">Salon Booking</div><h2>Đăng nhập</h2>
          {error && <div className="alert">{error}</div>}
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group"><label htmlFor="email">Email</label><input id="email" name="email" type="email" placeholder="Nhập email" value={formData.email} onChange={handleChange} onBlur={handleBlur} />{touched.email && errors.email && <div className="field-error">{errors.email}</div>}</div>
            <div className="form-group"><label htmlFor="password">Mật khẩu</label><div className="input-wrapper"><input id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Nhập mật khẩu" value={formData.password} onChange={handleChange} onBlur={handleBlur} /><button className="password-toggle" type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Hiện hoặc ẩn mật khẩu">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button></div>{touched.password && errors.password && <div className="field-error">{errors.password}</div>}</div>
            <div className="form-row"><label className="remember"><input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />Ghi nhớ đăng nhập</label><Link to="/forgot-password">Quên mật khẩu?</Link></div>
            <button className="submit-button" disabled={!isValid || loading}>{loading && <span className="spinner" />} {loading ? 'Đang xử lý...' : 'Đăng nhập'}</button>
          </form>
          <p className="auth-footer">Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></p>
        </div>
      </section>
    </div>
  );
};

export default Login;
