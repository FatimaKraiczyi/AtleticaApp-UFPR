export interface Produto {
	id: number;
	quantidade?: number;
	nome: string;
	valor: number;
	descricao: string;
	atleticaId: number;
	atletica: {
		id: number;
		nome: string;
	};
	imagem: string;
}

export interface ProdutoCart {
  valor: number;
  nome: string;
}

export interface ProdutosCart {
  produtoId: number;
  carrinhoCompraId: number;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  produto: Produto;
}

export interface ProdutoCarrinho {
  produtos: ProdutosCart[];
  valorTotalCarrinho: number;
}

export interface ProdutoCarrinhoResponse {
  produtoCarrinho: {
    produtoId: number;
    carrinhoCompraId: number;
    quantidade: number;
    valorTotalProduto: number;
  };
  msg: string;
}

export interface RespostaSimples {
  msg: string;
}
