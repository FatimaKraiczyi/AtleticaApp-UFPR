import type { IResponse } from "../interfaces";
import type { UserProps } from "../interfaces/users";
import { API, objectCatch } from './api';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from 'react-native';
import { userAuthentication as userAuthenticationEndpoint, sendEmail, validateToken } from "./routes/routes";

export const userAuthentication = async (
  email: string,
  senha: string
): Promise<IResponse.Default<UserProps>> => {
  try {
    const { data, status } = await API.post(userAuthenticationEndpoint, { email, senha });

    if (status === 200 && data && data.token) {
      if (Platform.OS === 'web') {
        sessionStorage.setItem('authToken', data.token);
      } else {
        await AsyncStorage.setItem("x-access-token", data.token);
      }
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
    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};
