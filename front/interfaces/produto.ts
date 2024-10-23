export interface Produto {
  id?: number;
  nome: string;
  valor: number;
  quantidade: number;
  atleticaId?: number;
  imagem: string | null;
}
