export interface Membro {
  id: string;
  usuarioId: string;
  administrador: boolean;
  atleticaId: string;
}

export interface MembroResponse {
  novoMembro: Membro[];
}
