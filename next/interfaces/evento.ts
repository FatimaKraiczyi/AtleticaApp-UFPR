export interface Evento {
  id?: number;
  data: string;
  hora: string;
  endereco: string;
  titulo: string;
  descricao: string;
  linkPlataformaIngressos?: string;
  qtdeVagas?: number;
  ingresso?: number;
  statusEvento?: "CANCELADO" | "EM_ANDAMENTO" | "CONCLUIDO";
  modalidade?: "FESTA" | "JOGO";
  atleticaId: number;
  atleticaName: string;
}

export interface EventoResponse {
  evento: Evento;
}