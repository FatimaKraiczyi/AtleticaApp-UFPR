export interface UserProps {
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