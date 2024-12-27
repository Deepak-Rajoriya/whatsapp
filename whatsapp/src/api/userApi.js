import apiClient from './apiClient';

// Get user by ID
export const getUserById = async (id) => {
  try {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get user by ID
export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get(`/current-user`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get user by ID
export const createUser = async (user) => {
  try {
    const response = await apiClient.post(`/users/`, user);
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

// Get user by ID
export const getAllUsers = async () => {
  try {
    const response = await apiClient.get(`/users/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllFriendsByUser = async () => {
  try {
    const response = await apiClient.get(`/user/friends`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const updateUser = async (userDetails) => {
  try {
    const response = await apiClient.patch(`/users/`, userDetails);
    return response.data;
  } catch (error) {
    throw error;
  }
};