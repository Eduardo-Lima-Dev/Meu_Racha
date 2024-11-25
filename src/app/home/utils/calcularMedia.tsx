export const calcularMedia = (votos: { userId: string; vote: number }[] | undefined): number => {
  if (!votos || votos.length === 0) return 0;
  const votosValidos = votos.filter((voto) => typeof voto === "object" && voto.vote !== undefined);
  if (votosValidos.length === 0) return 0;
  const total = votosValidos.reduce((acc, voto) => acc + voto.vote, 0);
  return total / votosValidos.length;
};
