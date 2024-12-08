
export interface PedidoProdutos {
	nome: string;
	valor: number;
	quantidade: number;
	atleticaId: number;
}


export interface PedidoId {
  id: number;
  status: string;
  valorTotal: number;
  data: string;
  descricao: string
  produtos: PedidoProdutos[];
}
