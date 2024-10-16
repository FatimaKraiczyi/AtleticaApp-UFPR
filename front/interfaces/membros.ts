export interface MembrosResponse {
  email?: string;
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
  };
}

export interface Membro {
  email: string;
  administrador: boolean;
  atleticaId: string;
}
