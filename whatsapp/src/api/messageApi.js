import apiClient from './apiClient';

// Get user by ID
export const getMessageByChatId = async (id) => {
  try {
    const response = await apiClient.get(`/messages/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addMessageByChatId = async (receiverId, chatId, content) => {
  try {
    const response = await apiClient.post(`/messages/`, {receiverId, chatId, content});
    return response.data;
  } catch (error) {
    throw error;
  }
};