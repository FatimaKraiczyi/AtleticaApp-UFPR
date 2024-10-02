import { IResponse } from "../interfaces";
import { CursoProps } from "../interfaces/cursos";
import { API, arrayCatch } from "./api";

export const getCursos = async (): Promise<IResponse.Default<CursoProps[]>> => {
  try {
    const { data, status } = await API.get("/curso/retornarCursos");
    return { data: data.cursos || [], success: status === 200 };
  } catch {
    return { ...arrayCatch };
  }
};