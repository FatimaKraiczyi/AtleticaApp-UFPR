export interface Atletica {
  id: number;
  nome: string;
  descricao: string;
  imagem: string | null;
  atividades: string;
  createdAt: string;
  updatedAt: string;
}

export interface AtleticaResponse {
  atletica: Atletica[];
}
