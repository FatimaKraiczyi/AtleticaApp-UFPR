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
): Promise<IResponse.Default<any>> => {
  try {
    const { data, status } = await API.get(
      `${getMembroAtleticaEndpoint}/${atleticaId}`
    );
    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const adicionarMembro = async (
  addMembro: Membro
): Promise<IResponse.Default<any>> => {
  try {
    const { data, status } = await API.post(
      createMembroAtleticaEndpoint,
      addMembro
    );
    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const editarMembro = async (
  email: string,
  atleticaMembro: Membro
): Promise<IResponse.Default<any>> => {
  try {
    const { data, status } = await API.put(
      `${updateMembroAtleticaEndpoint}/${email}`,
      atleticaMembro
    );
    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const deletarMembro = async (
  email: string
): Promise<IResponse.Default<any>> => {
  try {
    const { data, status } = await API.delete(
      `${deleteMembroAtleticaEndpoint}/${email}`
    );
    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};
