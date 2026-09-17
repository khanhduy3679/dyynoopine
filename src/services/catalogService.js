import apiClient from '../apiClient';

const catalogService = {
  async getServices() {
    const response = await apiClient.get('/services');
    return response.data;
  },
  async getStaff() {
    const response = await apiClient.get('/staff');
    return response.data;
  }
};

export default catalogService;
