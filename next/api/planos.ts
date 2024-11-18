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
  getPlanoByAtletica,
  pagamentoAssinaturaId,
} from "./routes/planos";

export const getPlanos = async (): Promise<
  IResponse.Default<any>
> => {
  try {
    const { data, status } = await API.get(getAllPlanos);
    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const newPlano = async (
  plano: PlanoAssinatura
): Promise<IResponse.Default<any>> => {
  try {
    const { data, status } = await API.post(createPlano, plano);
    return { data, success: status === 201 };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const editPlano = async (
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

export const excluirPlano = async (
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

export const getPlanoByAtleticaId = async (
  atleticaId: string
): Promise<IResponse.Default<any>> => {
  try {
    const { data, status } = await API.get(
      `${getPlanoByAtletica}/${atleticaId}`
    );
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

export const pagamentoAssinatura = async (
  assinaturaId: number
): Promise<IResponse.Default<any>> => {
  try {
    const { data, status } = await API.post(
      `${pagamentoAssinaturaId}/${assinaturaId}`
    );
    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};
