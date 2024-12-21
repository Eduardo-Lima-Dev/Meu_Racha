export const calcularMedia = (
  valor: number | undefined,
  quantidade: number | undefined
): number => {
  if (!valor || !quantidade || quantidade === 0) return 0;
  return valor / quantidade;
};
