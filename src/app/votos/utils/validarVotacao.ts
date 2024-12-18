import { Jogador } from "@/app/dashboard/types";

export const validarVotacao = (
  votos: { [key: string]: number },
  jogadores: Jogador[],
  user: { uid: string } | null,
  usuariosJaVotaram: { [key: string]: boolean }
) => {
  if (!user) {
    return { isValid: false, message: "Usuário não autenticado." };
  }

  if (usuariosJaVotaram[user.uid]) {
    return {
      isValid: false,
      message: "Você já votou nesta rodada.",
    };
  }

  const jogadoresHabilitados = jogadores.filter(
    (jogador) => !jogador.excluirDaVotacao
  );

  if (Object.keys(votos).length !== jogadoresHabilitados.length) {
    return {
      isValid: false,
      message: "Por favor, vote em todos os jogadores antes de enviar.",
    };
  }

  return { isValid: true, message: "" };
};
