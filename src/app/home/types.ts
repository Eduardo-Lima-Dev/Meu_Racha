export interface Jogador {
  id: string;
  nome: string;
  media: number;
  assistencias: number;
  excluirDaVotacao: boolean;
  gols: number;
  votos: { userId: string; vote: number }[];
}
