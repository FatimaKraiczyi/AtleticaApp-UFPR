export interface Curso {
  id: number;
  nome: string;
  departamento: string;
}

export interface Atletica {
  id?: number;
  nome: string;
  descricao: string;
  imagem?: string | null;
  atividades: string[];
  cursos?: Curso[];
}

export interface AtleticaResponse {
  atletica: Atletica;
  cursos: Curso[];
}
