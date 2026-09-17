import apiClient from '../apiClient';

const getErrorMessage = (error, fallback) => {
  if (error.code === 'ECONNABORTED' || !error.response) {
    return 'Không thể kết nối máy chủ. Vui lòng kiểm tra mạng hoặc thử lại sau.';
  }
  return error.response?.data?.message || fallback;
};

const authService = {
  async register({ fullName, email, phone, password }) {
    try {
      const response = await apiClient.post('/auth/register', { fullName, email, phone, password });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Đăng ký thất bại'));
    }
  },

  async login(email, password) {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Sai email hoặc mật khẩu'));
    }
  }
};

export default authService;
