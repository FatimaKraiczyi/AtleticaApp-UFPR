interface Jogos {
  [key: string]: any;
}

const jogoImage = {
  Futebol:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS187dgTY0u_ar_CbB0w8H8mKHtBjLzbXEEzA&s",
  Basquete:
    "https://img.freepik.com/vetores-premium/ilustracao-de-cor-do-vetor-de-basquete-na-cesta-em-fundo-transparente_183342-713.jpg",
  Vôlei:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ88EcdWC3x4Ca8ojzTs-BOa_iUy7XhEbUtQw&s",
  Handebol:
    "https://thumbs.dreamstime.com/z/grupo-de-desportistas-handebol-masculino-a%C3%A7%C3%A3o-vetor-gr%C3%A1fico-desenho-animado-jogadores-esportivos-250602739.jpg",
  Natação:
    "https://img3.stockfresh.com/files/r/rastudio/m/37/2276027_stock-photo-swimming-pool.jpg",
  Atletismo:
    "https://png.pngtree.com/png-clipart/20230805/original/pngtree-running-silhouettes-vector-illustration-street-athletics-professional-vector-png-image_9431106.png",
  default: "@/assets/dashboard/image3.png",
};

const jogosTyped: Jogos = jogoImage;

const getJogosImage = (titulo: string) => {
  if (jogosTyped.hasOwnProperty(titulo)) {
    return jogosTyped[titulo];
  }

  return jogosTyped.default;
};

export { getJogosImage };
