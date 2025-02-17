export interface Jogador {
  id: string;
  nome: string;
  media: number;
  assistencias: number;
  gols: number;
  votos: { userId: string; vote: number }[];
}
