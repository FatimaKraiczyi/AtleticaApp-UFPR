export interface MembrosResponse {
  id: string;
  administrador: boolean;
  atleticaId: string;
  usuarioId: string;
  Usuario: {
    nome: string;
    email: string;
  };
}

export interface Membro {
  id: string;
  usuarioId: string;
  administrador: boolean;
  atleticaId: string;
}
