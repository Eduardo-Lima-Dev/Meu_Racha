export const calcularMedia = (
  valorTotal: number | undefined,
  quantidade: number | undefined
): number => {
  if (!valorTotal || !quantidade || quantidade === 0) return 0;
  const media = valorTotal / quantidade;
  return Math.round(media);
};
