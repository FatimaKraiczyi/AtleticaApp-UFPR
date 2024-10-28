import type { IResponse } from "../interfaces";
import { PlanoAssinatura } from "../interfaces/planos";

import { API, objectCatch } from "./api";
import {
  createPlano,
  getAllPlanos,
  getPlanoById,
  getAssinantesPlano,
  deletePlano,
  updatePlano,
} from "./routes/planos";

export const getAllPlanosAssinatura = async (): Promise<
  IResponse.Default<any>
> => {
  try {
    const { data, status } = await API.get(getAllPlanos);
    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const createPlanoAssinatura = async (
  plano: PlanoAssinatura
): Promise<IResponse.Default<any>> => {
  try {
    const { data, status } = await API.post(createPlano, plano);
    return { data, success: status === 201 };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const updatePlanoAssinatura = async (
  id: number,
  plano: PlanoAssinatura
): Promise<IResponse.Default<any>> => {
  try {
    const { data, status } = await API.put(`${updatePlano}/${id}`, plano);
    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const deletePlanoAssinatura = async (
  id: number
): Promise<IResponse.Default<any>> => {
  try {
    const { data, status } = await API.delete(`${deletePlano}/${id}`);
    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const getPlanoAssinaturaId = async (
  id: number
): Promise<IResponse.Default<any>> => {
  try {
    const { data, status } = await API.get(`${getPlanoById}/${id}`);
    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const getAssinantes = async (): Promise<IResponse.Default<any>> => {
  try {
    const { data, status } = await API.get(getAssinantesPlano);
    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};
