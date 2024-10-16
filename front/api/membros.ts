import type { IResponse } from "../interfaces";
import { Membro, MembrosResponse } from "../interfaces/membros";
import { API, objectCatch } from "./api";
import {
  createMembroAtleticaEndpoint,
  deleteMembroAtleticaEndpoint,
  getMembroAtleticaEndpoint,
  updateMembroAtleticaEndpoint,
} from "./routes/membros";

export const getMembros = async (
  atleticaId: string
): Promise<IResponse.Default<MembrosResponse[]>> => {
  try {
    const { data, status } = await API.get(
      `${getMembroAtleticaEndpoint}/${atleticaId}`
    );
    return {
      data: Array.isArray(data) ? data : [data],
      success: status === 200,
    };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const adicionarMembro = async (
  membroData: Membro
): Promise<IResponse.Default<MembrosResponse>> => {
  try {
    const { data, status } = await API.post(
      createMembroAtleticaEndpoint,
      membroData
    );
    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const editarMembro = async (
  email: string,
  administrador: boolean
): Promise<IResponse.Default<MembrosResponse>> => {
  try {
    const { data, status } = await API.put(
      `${updateMembroAtleticaEndpoint}/${email}`,
      { administrador }
    );
    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const deletarMembro = async (
  email: string
): Promise<IResponse.Default<null>> => {
  try {
    const { status } = await API.delete(
      `${deleteMembroAtleticaEndpoint}/${email}`
    );
    return { data: null, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};
