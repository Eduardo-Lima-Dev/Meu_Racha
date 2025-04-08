export interface Bet {
  id?: string;
  userId: string;
  playerId: string;
  betType: 'gols_feitos' | 'gols_sofridos';
  predictedGoals: number;
  stake: number;
  odds: number;
  status: 'pendente' | 'vencedora' | 'perdida';
  createdAt: number;
  updatedAt: number;
}
