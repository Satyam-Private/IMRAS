import api from './api';

export const login = async (credentials) => {
    const res = await api.post('/api/auth/login', credentials);
    return res.data;
};
