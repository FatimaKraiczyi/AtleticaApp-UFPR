import "../interfaces";
import "../interfaces/users";
import { API, objectCatch } from './api';
export const userAuthentication = async (email, senha) => {
    try {
        const { data, status } = await API.post('/usuario/authentication', { email, senha });
        if (status === 200) {
            sessionStorage.setItem('authToken', data.token);
        }
        return { data, success: status === 200 };
    }
    catch {
        return { ...objectCatch };
    }
};
