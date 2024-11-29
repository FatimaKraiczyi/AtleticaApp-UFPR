import { IResponse } from "@/interfaces";
import { API, objectCatch } from "./api";
import {
  getAllAssinaturas,
  getAssinaturaById,
  postAssinatura,
  putAssinatura,
} from "./routes/assinatura";

export const assinaturaUsuario = async (): Promise<IResponse.Default<any>> => {
  try {
    const { data, status } = await API.get(getAllAssinaturas);
    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const visualizarAssinaturaId = async (
  id: number
): Promise<IResponse.Default<any>> => {
  try {
    const { data, status } = await API.get(`${getAssinaturaById}/${id}`);
    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const novaAssinatura = async (
  id: number
): Promise<IResponse.Default<any>> => {
  try {
    const { data, status } = await API.post(`${postAssinatura}/${id}`);
    return { data, success: status === 201 };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const cancelarAssinatura = async (
  id: number
): Promise<IResponse.Default<any>> => {
  try {
    const { data, status } = await API.put(`${putAssinatura}/${id}`);
    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};
