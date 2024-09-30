import type { IResponse } from "../interfaces";
import type { UserProps } from "../interfaces/users";
import { API, objectCatch } from './api';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from 'react-native';
import { userAuthenticationEndpoint, sendEmail, validateToken, resetPassword, password, createUserEndpoint } from "./routes/routes";
import { getToken } from "./token";

export const userAuthentication = async (
  email: string,
  senha: string
): Promise<IResponse.Default<UserProps>> => {
  try {
    const { data, status } = await API.post(userAuthenticationEndpoint, { email, senha });

    if (status === 200 && data && data.token) {
      if (Platform.OS === 'web') {
        sessionStorage.setItem('x-access-token', data.token);
      } else {
        await AsyncStorage.setItem("x-access-token", data.token);
      }
      console.log("Token armazenado:", data.token); // Adicione este log para verificar se o token foi armazenado.
    }

    return { data, success: status === 200 };

  } catch (error) {
    return { ...objectCatch };
  }
};

export const sendEmailRequest = async (
  email: string,
  nome: string
): Promise<IResponse.Default<null>> => {
  try {
    const { data, status } = await API.post(sendEmail, { email, nome });

    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const validateUserToken = async (token: string): Promise<IResponse.Default<null>> => {
  try {
    const { data, status } = await API.post(validateToken, { token });

    if (status === 200) {
      if (Platform.OS === 'web') {
        sessionStorage.setItem('x-access-token', token);
      } else {
        await AsyncStorage.setItem("x-access-token", token);
      }
    }

    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const resetPasswordRequest = async (
  email: string,
): Promise<IResponse.Default<null>> => {
  try {
    const { data, status } = await API.post(resetPassword, { email });

    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const newPasswordRequest = async (
  senha: string,
  repSenha: string,
): Promise<IResponse.Default<null>> => {
  try {
    const { data, status } = await API.put(password, { senha, repSenha });

    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const createUser = async (user: UserProps): Promise<IResponse.Default<UserProps>> => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("Token não encontrado");
    }

    const { data, status } = await API.post(
      createUserEndpoint,
      { ...user },
      {
        headers: {
          'x-access-token': token,
        },
      }
    );

    return { data, success: status === 201 };
  } catch (error) {
    return { ...objectCatch };
  }
};