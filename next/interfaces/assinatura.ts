export interface Assinatura {
  id: number;
  usuarioId: number;
  planoId: number;
  dataInicio: string;
  dataFim: string;
  statusAssinatura: string;
  planoNome: string;
	planoValor: number;
	planoDuracao: number;
	atleticaNome: string;
	planoDescricao: string[];
}

export interface AssinaturaProps {
  assinatura: Assinatura;
}
