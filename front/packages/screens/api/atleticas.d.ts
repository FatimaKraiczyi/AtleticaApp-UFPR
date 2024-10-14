import type { IResponse } from "../interfaces";
import { Atletica, AtleticaResponse } from "../interfaces/atleticas";
export declare const getAtletica: () => Promise<IResponse.Default<AtleticaResponse>>;
export declare const createAtletica: (atletica: Atletica) => Promise<IResponse.Default<AtleticaResponse>>;
export declare const updateAtletica: (id: number, atletica: Atletica) => Promise<IResponse.Default<AtleticaResponse>>;
export declare const deleteAtletica: (id: number) => Promise<IResponse.Default<any>>;
export declare const getAtleticaById: (id: string) => Promise<IResponse.Default<any>>;
