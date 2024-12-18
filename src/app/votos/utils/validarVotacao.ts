// src/utils/validarVotacao.ts
import { Jogador } from "@/app/dashboard/types";

export const validarVotacao = (
  votos: { [key: string]: number },
  jogadores: Jogador[],
  user: { uid: string } | null
) => {
  const jogadoresHabilitados = jogadores.filter((jogador) => !jogador.excluirDaVotacao);

  if (Object.keys(votos).length !== jogadoresHabilitados.length) {
    return {
      isValid: false,
      message: "Por favor, vote em todos os jogadores antes de enviar.",
    };
  }

  for (const jogador of jogadoresHabilitados) {
    if (
      Array.isArray(jogador.votos) &&
      jogador.votos.some((voto) => voto.userId === user?.uid)
    ) {
      return {
        isValid: false,
        message: "Você já votou. Não é possível votar novamente.",
      };
    }
  }

  return { isValid: true, message: "" };
};
