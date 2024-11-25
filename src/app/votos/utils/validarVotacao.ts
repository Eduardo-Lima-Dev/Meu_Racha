// src/utils/validarVotacao.ts
interface Jogador {
  id: string;
  nome: string;
  assistencias: number;
  gols: number;
  votos: { userId: string; vote: number }[];
  excluirDaVotacao: boolean;
}

export const validarVotacao = (
  votos: { [key: string]: number },
  jogadores: Jogador[],
  user: { uid: string } | null
) => {
  if (Object.keys(votos).length !== jogadores.length) {
    return {
      isValid: false,
      message: "Por favor, vote em todos os jogadores antes de enviar.",
    };
  }

  for (const jogador of jogadores) {
    if (Array.isArray(jogador.votos) && jogador.votos.some((voto) => voto.userId === user?.uid)) {
      return {
        isValid: false,
        message: "Você já votou. Não é possível votar novamente.",
      };
    }
  }

  return { isValid: true, message: "" };
};