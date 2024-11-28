import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Create axios instance
const axiosInstance = axios.create({
    baseURL: API_URL,
});

// Add interceptor to handle token refresh
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // If error is 401 and we haven't tried to refresh token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (user?.refreshToken) {
                    const response = await axios.post(`${API_URL}/token/refresh/`, {
                        refresh: user.refreshToken
                    });
                    
                    if (response.data.access) {
                        // Update token in localStorage
                        user.token = response.data.access;
                        localStorage.setItem('user', JSON.stringify(user));
                        
                        // Update the failed request with new token and retry
                        originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
                        return axios(originalRequest);
                    }
                }
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                logout();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

const login = async (username, password) => {
    try {
        const response = await axiosInstance.post('/token/', {
            username,
            password
        });
        if (response.data.access) {
            const userData = {
                username,
                token: response.data.access,
                refreshToken: response.data.refresh
            };
            localStorage.setItem('user', JSON.stringify(userData));
            return response.data;
        }
        throw new Error('No access token received');
    } catch (error) {
        console.error('Login error:', error.response || error);
        throw error;
    }
};

const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    try {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
};

// Add axios instance to service exports
const authService = {
    login,
    logout,
    getCurrentUser,
    axiosInstance,
};

export default authService;
