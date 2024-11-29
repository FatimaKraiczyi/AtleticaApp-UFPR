import { IResponse } from "../interfaces/index";
import type { UserNovaSenha, UserProps } from "../interfaces/users";
import { API, objectCatch } from "./api";
import {
  userAuthenticationEndpoint,
  sendEmail,
  validateToken,
  resetPassword,
  createUserEndpoint,
  newPasswordResquest,
} from "./routes/auth";
import { getToken, setToken } from "./token";

export const userAuthentication = async (
  email: string,
  senha: string
): Promise<IResponse.Default<any>> => {
  try {
    const { data, status } = await API.post(userAuthenticationEndpoint, {
      email,
      senha,
    });

    if (status === 200 && data?.token) {
      const token = data.token;
      const userType = data.userType;
			const atleticaId = data.atletica;
			const usuarioId = data.usuarioId;
			const usuarioNome = data.usuarioNome;

      await setToken(token);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("userType", userType);
        sessionStorage.setItem("atletica", atleticaId.toString());
        sessionStorage.setItem("x-access-token", token);
				sessionStorage.setItem("usuarioId", usuarioId.toString());
				sessionStorage.setItem("usuarioNome", usuarioNome);
      }
    }

    return { data, success: status === 200 };
  } catch (error) {
    console.error("Erro na autenticação:", error);
    return { ...objectCatch, error };
  }
};

export const sendEmailRequest = async (
  email: string,
  nome: string
): Promise<IResponse.Default<any>> => {
  try {
    const { data, status } = await API.post(sendEmail, { email, nome });

    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const validateUserToken = async (
  token: string
): Promise<IResponse.Default<UserNovaSenha>> => {
  try {
    const { data, status } = await API.post(validateToken, { token });

    if (status === 200 && typeof window !== "undefined") {
      sessionStorage.setItem("x-access-token", token);
    }

    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const resetPasswordRequest = async (
  email: string
): Promise<IResponse.Default<any>> => {
  try {
    const { data, status } = await API.post(resetPassword, { email });

    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const newPassword = async (
  senha: string,
  repSenha: string
): Promise<IResponse.Default<any>> => {
  try {
    const { data, status } = await API.put(newPasswordResquest, {
      senha,
      repSenha,
    });
    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const createUser = async (
  user: UserProps
): Promise<IResponse.Default<UserProps>> => {
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
          "x-access-token": token,
        },
      }
    );

    return { data, success: status === 201 };
  } catch (error) {
    return { ...objectCatch };
  }
};
