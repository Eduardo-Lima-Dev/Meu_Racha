export interface Jogador {
  id: string;
  nome: string;
  casual: boolean;
  estrelas: number;
  votos: Array<{ userId: string; vote: number }>;
  media: number;
  gols: number;
  assistencias: number;
  createdAt: string;
  excluirDaVotacao?: boolean;
}
