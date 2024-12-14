import { Pedido } from "./pedido";
import { PlanoAssinatura } from "./planos";
import { Carrinho } from "./ProdutoCarrinho";

export interface UserProps {
	nome?: string;
	sobrenome?: string;
  email?: string;
  senha?: string;
  repSenha?: string;
  token?: string;
  telefone?: string;
  dataNasc?: string;
  cursoId?: number | string;
}


export interface UserNovaSenha {
  msg?: string;
  nome?: string;
  email?: string;
  acao?: "cadastro" | "recSenha";
}

export interface Assinatura {
	id: number;
	usuarioId: number;
	planoId: number;
	dataInicio: string;
	dataFim: string;
	statusAssinatura: string;
	createdAt: string;
	updatedAt: string;
	PlanoAssinatura: PlanoAssinatura;
}

export interface AuthenticatedUser {
	token: string;
	tipo: string;
	curso: string;
	assinaturas: Assinatura[];
	carrinhos: Carrinho[];
	pedidos: Pedido[];
	eventos: any[];
	atletica: number;
	atleticaNome: string;
	usuarioId: number;
	usuarioNome: string;
}