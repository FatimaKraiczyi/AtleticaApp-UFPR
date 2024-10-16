export interface Assinatura {
	id?: number;
	nome: string;
	descricao: string;
	valor: string;
	duracao: string;
}
export interface AssinaturaResponse {
	planos: Assinatura[];
}