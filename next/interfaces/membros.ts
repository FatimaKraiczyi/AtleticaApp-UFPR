export interface MembrosResponse {
  email?: string;
	nome?: string;
  id: string;
  administrador: boolean;
  atleticaId: string;
  usuarioId: string;
  Usuario?: {
    nome: string;
    email: string;
  };
  novoMembro?: {
    id: string;
    usuarioId: string;
    administrador: boolean;
    atleticaId: string;
		nome: string;
		email: string;
  };
}

export interface Membro {
	id: number;
  email: string;
  administrador: boolean;
  atleticaId: string;
}
