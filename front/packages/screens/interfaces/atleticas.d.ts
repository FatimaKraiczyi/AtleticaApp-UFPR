export interface Atletica {
    id?: number;
    nome: string;
    descricao: string;
    imagem?: string | null;
    atividades: string;
    cursoIds?: string[];
}
export interface AtleticaResponse {
    atletica: Atletica[];
}
