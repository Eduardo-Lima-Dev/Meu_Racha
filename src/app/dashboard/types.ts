// src/types.ts
export interface Jogador {
  id: string;
  nome: string;
  assistencias: number;
  gols: number;
  votos: { userId: string; vote: number }[];
  excluirDaVotacao: boolean;
}