export interface Curso {
  id: number;
  nome: string;
  departamento: string;
}

export interface CursoProps {
  cursos: Curso[];
}