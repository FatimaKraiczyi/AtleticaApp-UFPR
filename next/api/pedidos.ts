import { IResponse } from "@/interfaces";
import { API, objectCatch } from "./api";
import {
  getAllPedidos,
  getPedidoById,
  pagamentoPedido,
  postPedido,
  putPedido,
} from "./routes/pedidos";
import { PedidoId } from "@/interfaces/pedido";

export const pedidoUsuario = async (): Promise<IResponse.Default<any>> => {
  try {
    const { data, status } = await API.get(getAllPedidos);
    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const visualizarPedidoId = async (
  id: number
): Promise<IResponse.Default<PedidoId>> => {
  try {
    const { data, status } = await API.get(`${getPedidoById}/${id}`);
    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch, data: {} as PedidoId };
  }
};

export const novoPedido = async (
): Promise<IResponse.Default<any>> => {
  try {
    const { data, status } = await API.post(postPedido);
    return { data, success: status === 201 };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const cancelarPedido = async (
  id: number
): Promise<IResponse.Default<any>> => {
  try {
    const { data, status } = await API.put(`${putPedido}/${id}`);
    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const pagamentoPedidoId = async (
  pedidoId: number
): Promise<IResponse.Default<any>> => {
  try {
    const { data, status } = await API.post(
      `${pagamentoPedido}/${pedidoId}`
    );
    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};
