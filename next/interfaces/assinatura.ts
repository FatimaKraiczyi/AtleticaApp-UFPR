import { PlanoAssinatura } from "./planos";

export interface Assinatura {
  id: number;
  usuarioId: number;
  planoId: number;
  dataInicio: string;
  dataFim: string;
  statusAssinatura: "PAGA" | "PENDENTE" | "CANCELADA";
  PlanoAssinatura: PlanoAssinatura;
}

export interface AssinaturaProps {
  assinatura: Assinatura;
}
