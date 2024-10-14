import type { IResponse } from "../interfaces";
export declare const getMembros: (atleticaId: string) => Promise<IResponse.Default<any>>;
export declare const adicionarMembro: (membroData: any) => Promise<IResponse.Default<any>>;
export declare const editarMembro: (email: string, administrador: boolean) => Promise<IResponse.Default<any>>;
export declare const deletarMembro: (email: string) => Promise<IResponse.Default<any>>;
