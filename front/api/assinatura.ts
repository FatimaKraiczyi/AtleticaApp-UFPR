import type { IResponse } from "../interfaces";
import { AssinaturaResponse, Assinatura } from "../interfaces/assinatura";
import { API, objectCatch } from "./api";
import {
    createPlanoassinatura,
    getPlanoassinatura,
    updatePlanoassinatura,
    deletePlanoassinatura,
    getPlanoassinaturaById,
} from "./routes/assinatura";

export const getAssinatura = async (): Promise<IResponse.Default<AssinaturaResponse[]>> => {
  try {
    const { data, status } = await API.get(getPlanoassinatura);
    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const createAssinatura = async (
  assinatura: Assinatura
): Promise<IResponse.Default<AssinaturaResponse>> => {
  try {
    const { data, status } = await API.post(createPlanoassinatura, assinatura);
    return { data, success: status === 201 };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const updateAssinatura = async (
  id: number,
  assinatura: Assinatura
): Promise<IResponse.Default<AssinaturaResponse>> => {
  try {
    const { data, status } = await API.put(
      `${updatePlanoassinatura}/${id}`,
     assinatura
    );
    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const deleteAssinatura = async (
  id: number
): Promise<IResponse.Default<any>> => {
  try {
    const { data, status } = await API.delete(
      `${deletePlanoassinatura}/${id}`
    );
    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const getAssinaturaId = async (
  id: number
): Promise<IResponse.Default<any>> => {
  try {
    const { data, status } = await API.get(`${getPlanoassinaturaById}/${id}`);
    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};
