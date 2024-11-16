export interface Produto {
  id: number;
  nome: string;
  valor: number;
  quantidade: number;
	tamanhos?: string[];
  atleticaId?: number;
	vendedor?: string;
  imagem: string | null;
}
