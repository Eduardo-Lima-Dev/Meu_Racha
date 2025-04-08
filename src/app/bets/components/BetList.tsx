import React from 'react';
import { Bet } from '../types/bet';

interface BetListProps {
  bets: Bet[];
}

const BetList: React.FC<BetListProps> = ({ bets }) => {
  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Minhas Apostas</h2>
      {bets.length === 0 ? (
        <p>Nenhuma aposta encontrada.</p>
      ) : (
        <div className="space-y-4">
          {bets.map((bet) => (
            <div key={bet.id} className="p-4 bg-white rounded shadow border border-gray-200">
              <p><strong>ID do Jogador:</strong> {bet.playerId}</p>
              <p><strong>ID do Jogo:</strong> {bet.gameId}</p>
              <p><strong>Tipo:</strong> {bet.betType === 'gols_feitos' ? 'Gols Feitos' : 'Gols Sofridos'}</p>
              <p><strong>Previsão de Gols:</strong> {bet.predictedGoals}</p>
              <p><strong>Valor Apostado:</strong> {bet.stake}</p>
              <p><strong>Odds:</strong> {bet.odds}</p>
              <p><strong>Status:</strong> {bet.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BetList;
