import axios from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:8080/api';

const endpoints = {
    signup: '/auth/signup',
    login: '/auth/login',
    refreshToken: '/auth/refresh-token',
    logout: '/auth/logout',
}

const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

const apiClient = {
    get: async (endpoint: string, config = {}) => {
        const response = await axiosInstance.get(endpoint, config);
        return response.data;
    },
    post: async (endpoint: string, body: any, config = {}) => {
        const response = await axiosInstance.post(endpoint, body, config);
        return response.data;
    },
}


export const authApi = {
    signup: (data: { firstName: string; lastName: string; email: string; password: string }) => {
        return apiClient.post(endpoints.signup, data);
    },
    login:(data: { email: string; password: string }) => {
        return apiClient.post(endpoints.login, data);
    },
    refreshToken: () => {
        return apiClient.post(endpoints.refreshToken, {});
    },
    logout: () => {
        return apiClient.post(endpoints.logout, {});
    }
};