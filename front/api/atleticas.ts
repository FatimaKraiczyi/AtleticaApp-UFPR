import type { IResponse } from "../interfaces";
import { Atletica, AtleticaResponse } from "../interfaces/atleticas";
import { API, objectCatch } from "./api";
import {
  getAtleticaEndpoint,
  createAtleticaEndpoint,
  updateAtleticaEndpoint,
  deleteAtleticaEndpoint,
  getAtleticaByIdEndpoint,
} from "./routes/atleticas";

export const getAtletica = async (): Promise<
  IResponse.Default<AtleticaResponse>
> => {
  try {
    const { data, status } = await API.get(getAtleticaEndpoint);
    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const createAtletica = async (
  atletica: Atletica
): Promise<IResponse.Default<AtleticaResponse>> => {
  try {
    const { data, status } = await API.post(createAtleticaEndpoint, atletica);
    return { data, success: status === 201 };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const updateAtletica = async (
  id: number,
  atletica: Atletica
): Promise<IResponse.Default<AtleticaResponse>> => {
  try {
    const { data, status } = await API.put(
      `${updateAtleticaEndpoint}/${id}`,
      atletica
    );
    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const deleteAtletica = async (
  id: number
): Promise<IResponse.Default<any>> => {
  try {
    const { data, status } = await API.delete(
      `${deleteAtleticaEndpoint}/${id}`
    );
    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const getAtleticaById = async (
  id: string
): Promise<IResponse.Default<any>> => {
  try {
    const { data, status } = await API.get(`${getAtleticaByIdEndpoint}/${id}`);
    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};
