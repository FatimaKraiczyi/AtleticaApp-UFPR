import { API, objectCatch } from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { userAuthenticationEndpoint, sendEmail, validateToken, resetPassword, createUserEndpoint, newPasswordResquest, } from "./routes/routes";
import { getToken, setToken } from "./token";
export const userAuthentication = async (email, senha) => {
    try {
        const { data, status } = await API.post(userAuthenticationEndpoint, {
            email,
            senha,
        });
        if (status === 200 && data?.token) {
            const token = data.token;
            const userType = data.userType;
            await setToken(token);
            sessionStorage.setItem("userType", userType);
            if (Platform.OS === "web") {
                sessionStorage.setItem("x-access-token", token);
            }
            else {
                await AsyncStorage.setItem("x-access-token", token);
            }
        }
        return { data, success: status === 200 };
    }
    catch (error) {
        console.error("Erro na autenticação:", error);
        return { ...objectCatch, error };
    }
};
export const sendEmailRequest = async (email, nome) => {
    try {
        const { data, status } = await API.post(sendEmail, { email, nome });
        return { data, success: status === 200 };
    }
    catch (error) {
        return { ...objectCatch };
    }
};
export const validateUserToken = async (token) => {
    try {
        const { data, status } = await API.post(validateToken, { token });
        if (status === 200) {
            if (Platform.OS === "web") {
                sessionStorage.setItem("x-access-token", token);
            }
            else {
                await AsyncStorage.setItem("x-access-token", token);
            }
        }
        return { data, success: status === 200 };
    }
    catch (error) {
        return { ...objectCatch };
    }
};
export const resetPasswordRequest = async (email) => {
    try {
        const { data, status } = await API.post(resetPassword, { email });
        return { data, success: status === 200 };
    }
    catch (error) {
        return { ...objectCatch };
    }
};
export const newPassword = async (senha, repSenha) => {
    try {
        const { data, status } = await API.put(newPasswordResquest, {
            senha,
            repSenha,
        });
        return { data, success: status === 200 };
    }
    catch (error) {
        return { ...objectCatch };
    }
};
export const createUser = async (user) => {
    try {
        const token = await getToken();
        if (!token) {
            throw new Error("Token não encontrado");
        }
        const { data, status } = await API.post(createUserEndpoint, { ...user }, {
            headers: {
                "x-access-token": token,
            },
        });
        return { data, success: status === 201 };
    }
    catch (error) {
        return { ...objectCatch };
    }
};
