import {
  getEventoById,
  getEventByUser,
  addEvento,
  inscricaoEvento,
  deleteEvento,
  cancelarInscricao,
  getAllEventos,
  listarInscritos,
} from "./routes/evento";

import type { IResponse } from "../interfaces";
import { API, objectCatch } from "./api";
import { Evento } from "@/interfaces/evento";

export const getAllEventosAPI = async (): Promise<IResponse.Default<any>> => {
  try {
    const { data, status } = await API.get(getAllEventos);
    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const getEventoByIdAPI = async (
  id: number
): Promise<IResponse.Default<any>> => {
  try {
    const { data, status } = await API.get(`${getEventoById}/${id}`);
    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const getEventosByUserAPI = async (): Promise<IResponse.Default<any>> => {
  try {
    const { data, status } = await API.get(getEventByUser);
    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const addEventoAPI = async (
  newEvento: any
): Promise<IResponse.Default<any>> => {
  try {
    const { data, status } = await API.post(addEvento, newEvento);
    return { data, success: status === 201 };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const inscricaoEventoAPI = async (
  id: number
): Promise<IResponse.Default<any>> => {
  try {
    const { data, status } = await API.post(`${inscricaoEvento}/${id}`);
    return { data, success: status === 201 };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const deleteEventoAPI = async (
  id: number
): Promise<IResponse.Default<any>> => {
  try {
    const { data, status } = await API.delete(`${deleteEvento}/${id}`);
    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const cancelarInscricaoAPI = async (
  id: number
): Promise<IResponse.Default<any>> => {
  try {
    const { data, status } = await API.delete(`${cancelarInscricao}/${id}`);
    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const listarInscritosAPI = async (
  id: number
): Promise<IResponse.Default<any>> => {
  try {
    const { data, status } = await API.get(`${listarInscritos}/${id}`);
    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};
