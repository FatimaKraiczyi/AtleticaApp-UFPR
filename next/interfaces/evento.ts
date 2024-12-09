export interface Evento {
	id?: number;
  data: string;
  hora: string;
  endereco: string;
  descricao: string;
  linkPlataformaIngressos?: string;
  qtdeVagas?: number;
  ingresso?: number;
  statusEvento?: "CANCELADO" | "EM_ANDAMENTO" | "CONCLUIDO";
  modalidade?: "FESTA" | "JOGO";
  atleticaId: number;
}

export interface EventoResponse {
	evento: Evento;
}