export interface Produto {
  id: number;
  nome: string;
  valor: number;
  quantidade: number;
	tamanhos?: string[];
  atleticaId?: number;
	atleticaNome?: string;
  imagem: string | null;
}
