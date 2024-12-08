export interface CursoProps {
  id: number;
  nome: string;
  departamento: string;
}

export interface AtividadesProps {
  id: number;
  nome: string;
}

export interface Atletica {
  id: number | string;
  nome: string;
  descricao: string;
  imagem?: string | null;
  atividades?: AtividadesProps[];
	cursos: CursoProps[];
}

export interface AtleticaResponse {
  atletica: Atletica;
}
