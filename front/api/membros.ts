import type { IResponse } from "../interfaces";
import { Membro, MembroResponse } from "../interfaces/membros";
import { API, objectCatch } from "./api";
import { createMembroAtleticaEndpoint, deleteMembroAtleticaEndpoint, getMembroAtleticaEndpoint, updateMembroAtleticaEndpoint } from "./routes/membros";

export const getMembros = async (): Promise<
  IResponse.Default<MembroResponse>
> => {
  try {
    const { data, status } = await API.get(getMembroAtleticaEndpoint);
    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const adicionarMembro = async (
  addMembro: Membro
): Promise<IResponse.Default<MembroResponse>> => {
  try {
    const { data, status } = await API.post(createMembroAtleticaEndpoint, addMembro);
    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const editarMembro = async (
  id: string,
  atleticaMembro: Membro
): Promise<IResponse.Default<MembroResponse>> => {
  try {
    const { data, status } = await API.put(
      `${updateMembroAtleticaEndpoint}/${id}`,
      atleticaMembro
    );
    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const deletarMembro = async (
  id: string
): Promise<IResponse.Default<any>> => {
  try {
    const { data, status } = await API.delete(
      `${deleteMembroAtleticaEndpoint}/${id}`
    );
    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};
