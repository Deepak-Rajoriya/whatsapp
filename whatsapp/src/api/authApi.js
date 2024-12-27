import apiClient from './apiClient';

export const login = async (email, password)=>{
    try{
        const response = await apiClient.post('/auth/login', { email, password });
        return response.data; // Usually contains a token
    }catch(error){
        throw error.response?.data?.message || 'Login failed';
    }
}