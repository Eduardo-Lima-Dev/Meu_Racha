export const calcularMedia = (votos: { userId: string; vote: number }[] | undefined) => {
  if (!votos || votos.length === 0) return { media: 0, categoria: 0 };

  const votosValidos = votos.filter((voto) => typeof voto === "object" && voto.vote !== undefined);
  if (votosValidos.length === 0) return { media: 0, categoria: 0 };

  const total = votosValidos.reduce((acc, voto) => acc + voto.vote, 0);
  const media = total / votosValidos.length;

  return {
    media, // Mostra a média exata
    categoria: Math.floor(media), // Arredonda para baixo para determinar a categoria
  };
};
