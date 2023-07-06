import axios from 'axios';
const baseURL = 'http://localhost:4000/auth';

export const signupRequest = async (data) => {
    try {
        const res = await axios.post(`${baseURL}/signup`, data);
        return res.data;
    } catch (error) {
        throw Error(error.response.data.error);
    }
}

export const loginRequest = async (data) => {
    try {
        const res = await axios.post(`${baseURL}/login`, data);
        localStorage.setItem('access_token', res.data.token);
        return res.data;
    } catch (error) {
        throw Error(error.response.data.error);
    }
}

export const resetPasswordRequest = async (email) => {
    try {
        const res = await axios.post(`${baseURL}/requestPasswordReset`, { email });
        return res.data;
    } catch (error) {
        throw Error(error.response.data.error);
    }
}

export const resetPasswordConfirm = async (data) => {
    try {
        const res = await axios.post(`${baseURL}/passwordReset`, data);
        return res.data;
    } catch (error) {
        throw Error(error.response.data.error);
    }
}

export const checkLoginStatus = async () => {
    try {
        const res = await axios.get(`${baseURL}/login/success`,{
             withCredentials: true
            });
        return res.data;
    } catch (error) {
        throw Error(error.response.data.error);
    }

}