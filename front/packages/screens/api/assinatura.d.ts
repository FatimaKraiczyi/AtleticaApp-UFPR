import type { IResponse } from "../interfaces";
import { AssinaturaResponse, Assinatura } from "../interfaces/assinatura";
export declare const getAssinatura: () => Promise<IResponse.Default<AssinaturaResponse[]>>;
export declare const createAssinatura: (assinatura: Assinatura) => Promise<IResponse.Default<AssinaturaResponse>>;
export declare const updateAssinatura: (id: number, assinatura: Assinatura) => Promise<IResponse.Default<AssinaturaResponse>>;
export declare const deleteAssinatura: (id: number) => Promise<IResponse.Default<any>>;
export declare const getAssinaturaId: (id: number) => Promise<IResponse.Default<any>>;
