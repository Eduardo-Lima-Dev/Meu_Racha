// bets/components/BetForm.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createBet } from '../services/betService';
import { updateUserBalance } from '../services/userService';
import { calculateOdds } from '../services/calculateOdds';
import { useJogadores } from '../../home/hooks/useJogadores';
import { Jogador } from '../../home/types';
import { Bet } from '../types/bet';

interface BetFormProps {
  userId: string;
  userBalance: number;
  onBetPlaced?: () => void;
}

const BetForm: React.FC<BetFormProps> = ({ userId, userBalance, onBetPlaced }) => {
  const { jogadores, loading, error } = useJogadores();
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");
  const selectedPlayer = jogadores.find((player: Jogador) => player.id === selectedPlayerId);
  const [betType, setBetType] = useState<'gols_feitos' | 'gols_sofridos'>('gols_feitos');
  const [predictedGoals, setPredictedGoals] = useState(0);
  const [stake, setStake] = useState(0);
  const [loadingForm, setLoadingForm] = useState(false);
  const [calculatedOdds, setCalculatedOdds] = useState(0);

  useEffect(() => {
    if (selectedPlayer) {
      const odd = calculateOdds(selectedPlayer, betType);
      setCalculatedOdds(odd);
    }
  }, [selectedPlayer, betType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (stake > userBalance) {
      alert("Saldo insuficiente para essa aposta!");
      return;
    }
    if (!selectedPlayer) {
      alert("Selecione um jogador válido para apostar!");
      return;
    }

    setLoadingForm(true);

    const newBet: Omit<Bet, "id" | "createdAt" | "updatedAt"> = {
      userId,
      playerId: selectedPlayer.id,
      betType,
      predictedGoals,
      stake,
      odds: calculatedOdds,
      status: 'pendente',
    };

    try {
      await createBet({
        ...newBet,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      await updateUserBalance(userId, -stake);
      if (onBetPlaced) onBetPlaced();
      // Limpa os campos
      setPredictedGoals(0);
      setStake(0);
    } catch (error) {
      console.error("Erro ao criar aposta:", error);
    } finally {
      setLoadingForm(false);
    }
  };

  if (loading) {
    return <p>Carregando jogadores...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Criar Aposta</h2>

      {/* Select para escolher o jogador */}
      <div className="mb-4">
        <label htmlFor="playerId" className="block text-gray-700">Selecione o Jogador</label>
        <select
          id="playerId"
          value={selectedPlayerId}
          onChange={(e) => setSelectedPlayerId(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded p-2"
          required
        >
          <option value="">Selecione um jogador</option>
          {jogadores.map((player: Jogador) => (
            <option key={player.id} value={player.id}>
              {player.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="betType" className="block text-gray-700">Tipo de Aposta</label>
        <select
          id="betType"
          value={betType}
          onChange={(e) => setBetType(e.target.value as 'gols_feitos' | 'gols_sofridos')}
          className="mt-1 block w-full border border-gray-300 rounded p-2"
        >
          <option value="gols_feitos">Gols Feitos</option>
          <option value="gols_sofridos">Gols Sofridos</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="predictedGoals" className="block text-gray-700">Previsão de Gols</label>
        <Input
          id="predictedGoals"
          type="number"
          value={predictedGoals}
          onChange={(e) => setPredictedGoals(Number(e.target.value))}
          required
          min="0"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="stake" className="block text-gray-700">
          Valor Apostado (Saldo: {userBalance} Dreher Coins)
        </label>
        <Input
          id="stake"
          type="number"
          value={stake}
          onChange={(e) => setStake(Number(e.target.value))}
          required
          min="1"
        />
      </div>

      {selectedPlayer && (
        <p className="mb-4">
          Odds calculada para esse jogador: <strong>{calculatedOdds}</strong>
        </p>
      )}

      <Button type="submit" disabled={loadingForm}>
        {loadingForm ? "Enviando..." : "Criar Aposta"}
      </Button>
    </form>
  );
};

export default BetForm;
