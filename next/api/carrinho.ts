import { IResponse } from "@/interfaces";
import { API, objectCatch } from "./api";
import {
  getProductsCart,
  addProductCart,
  removeProductCart,
} from "./routes/carrinho";
import { ProdutoCarrinho, ProdutoCarrinhoResponse, RespostaSimples } from "@/interfaces/ProdutoCarrinho";

export const getCart = async (): Promise<
  IResponse.Default<ProdutoCarrinho>
> => {
  try {
    const { data, status } = await API.get(getProductsCart);
    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch, data: { produtos: [], valorTotalCarrinho: 0 } };
  }
};

export const addCartProduct = async (
  produtoId: number,
  quantidade: number
): Promise<IResponse.Default<ProdutoCarrinhoResponse>> => {
  try {
    const { data, status } = await API.post(`${addProductCart}/${produtoId}`, {
      quantidade,
    });
    return { data, success: status === 201 || status === 200 };
  } catch (error) {
    return { ...(objectCatch as IResponse.Default<ProdutoCarrinhoResponse>) };
  }
};

export const deleteCartProdut = async (
  id: number
): Promise<IResponse.Default<RespostaSimples>> => {
  try {
    const { data, status } = await API.delete(`${removeProductCart}/${id}`);
    return { data, success: status === 200 };
  } catch (error) {
    return { ...(objectCatch as IResponse.Default<RespostaSimples>) };
  }
};

export const deleteCart = async (): Promise<
  IResponse.Default<RespostaSimples>
> => {
  try {
    const { data, status } = await API.delete(removeProductCart);
    return { data, success: status === 200 };
  } catch (error) {
    return { ...(objectCatch as IResponse.Default<RespostaSimples>) };
  }
};
