export interface Assinatura {
    id?: number;
    nome: string;
    descricao: string;
    valor: string;
    duracao: sttring;
}
export interface AssinaturaResponse {
    assinatura: Assinatura[];
}
