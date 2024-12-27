import apiClient from './apiClient';

// Get user by ID
export const getChatByParticipant = async (id) => {
    try {
        const response = await apiClient.get(`/chats/participants/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const getChatById = async (id) => {
    try {
        const response = await apiClient.get(`/chats/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const createChat = async (receiverId) => {
    try {
        const response = await apiClient.post(`/chats`, {receiverId});
        return response;
    } catch (error) {
        throw error;
    }
}