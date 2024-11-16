import { IResponse } from "@/interfaces";
import { Produto } from "@/interfaces/produto";
import { API, objectCatch } from "./api";
import { getProductsCart, addProductCart, removeProductCart } from "./routes/carrinho";

export const getCart = async (): Promise<IResponse.Default<any>> => {
  try {
    const { data, status } = await API.get(getProductsCart);
    return { data: data.produtoNome , success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};

export const addCartProduct = async (
  id: number,
  quantidade: number
): Promise<IResponse.Default<any>> => {
  try {
    const { data, status } = await API.post(
      `${addProductCart}/${id}`,
      { quantidade }
    );
    return { data, success: status === 201 };
  } catch (error) {
    return { ...objectCatch};
  }
};

export const deleteCartProdut = async (
  id: number
): Promise<IResponse.Default<any>> => {
  try {
    const { data, status } = await API.delete(`${removeProductCart}/${id}`);
    return { data, success: status === 200 };
  } catch (error) {
    return { ...objectCatch };
  }
};
