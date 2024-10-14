import { IResponse } from "../interfaces";
import { CursoProps } from "../interfaces/cursos";
export declare const getCursos: () => Promise<IResponse.Default<CursoProps[]>>;
