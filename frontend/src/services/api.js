import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Upload Excel file
export const uploadExcel = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(`${API_URL}/upload/excel`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// Upload Image file
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(`${API_URL}/upload/image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// Validate message template
export const validateTemplate = async (template) => {
  const response = await api.post('/messages/validate', { template });
  return response.data;
};

// Preview messages
export const previewMessages = async (template, customers, limit = 5) => {
  const response = await api.post('/messages/preview', { template, customers, limit });
  return response.data;
};

// Create campaign
export const createCampaign = async (campaignData) => {
  const response = await api.post('/campaigns', campaignData);
  return response.data;
};

// Get all campaigns
export const getAllCampaigns = async () => {
  const response = await api.get('/campaigns');
  return response.data;
};

// Get campaign by ID
export const getCampaignById = async (id) => {
  const response = await api.get(`/campaigns/${id}`);
  return response.data;
};

// Send campaign
export const sendCampaign = async (id) => {
  const response = await api.post(`/campaigns/${id}/send`);
  return response.data;
};

// Get campaign logs
export const getCampaignLogs = async (id) => {
  const response = await api.get(`/campaigns/${id}/logs`);
  return response.data;
};

// Get queue status
export const getQueueStatus = async () => {
  const response = await api.get('/campaigns/queue-status');
  return response.data;
};

// Verify WhatsApp connection
export const verifyWhatsAppConnection = async () => {
  const response = await api.get('/campaigns/verify-whatsapp');
  return response.data;
};

// Delete campaign
export const deleteCampaign = async (id) => {
  const response = await api.delete(`/campaigns/${id}`);
  return response.data;
};

export default api;

