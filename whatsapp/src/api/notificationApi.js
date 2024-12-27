import apiClient from './apiClient';

// Add notifications
export const addNotification = async (receiverId, type) => {
  try {
    const response = await apiClient.post(`/notifications/`, {receiverId, type});
    return response;
  } catch (error) {
    throw error;
  }
};

// Get all notifications by user
export const getAllNotificationsByUser = async () => {
  try {
    const response = await apiClient.get(`/notifications/`);
    return response;
  } catch (error) {
    throw error;
  }
};


// Update notification by ID
export const updatedNotification = async (notificationId, status) => {
    try {
      const response = await apiClient.patch(`/notifications/${notificationId}`, {status});
      return response;
    } catch (error) {
      throw error;
    }
  };