export interface MembrosResponse {
	email: string;
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
  email: string;
  administrador: boolean;
  nomeAtletica?: string;
}
