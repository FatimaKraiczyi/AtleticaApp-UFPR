import { Produto } from "@/interfaces/ProdutoCarrinho";
import type { IResponse } from "../interfaces";
import { API, objectCatch } from "./api";
import {
  addProduto,
  deleteProduto,
  editProduto,
  getAllProdutos,
  getProdutoByAtletica,
} from "./routes/produtos";

export const getProdutos = async (): Promise<IResponse.Default<any>> => {
  try {
    const { data, status } = await API.get(getAllProdutos);
    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const getProdutoById = async (
  atleticaId: string
): Promise<IResponse.Default<any>> => {
  try {
    const { data, status } = await API.get(
      `${getProdutoByAtletica}/${atleticaId}`
    );
    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const createProduto = async (
  produto: any
): Promise<IResponse.Default<any>> => {
  try {
    const { data, status } = await API.post(addProduto, produto);
    return { data, success: status === 201 };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const updateProduto = async (
  id: number,
  produto: any
): Promise<IResponse.Default<any>> => {
  try {
    const { data, status } = await API.put(`${editProduto}/${id}`, produto);
    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const deletarProduto = async (
  id: number
): Promise<IResponse.Default<any>> => {
  try {
    const { data, status } = await API.delete(`${deleteProduto}/${id}`);
    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};
