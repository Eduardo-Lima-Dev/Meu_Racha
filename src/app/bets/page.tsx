"use client";

import React from 'react';
import BetForm from './components/BetForm';
import BetList from './components/BetList';
import { useBets } from './hooks/useBets';

export default function BetsPage() {
  // Para fins de exemplo, estamos usando um ID estático.
  const userId = 'usuario_exemplo';
  const { bets, loading } = useBets(userId);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Sistema de Apostas</h1>
      <BetForm userId={userId} />
      {loading ? (
        <p>Carregando apostas...</p>
      ) : (
        <BetList bets={bets} />
      )}
    </div>
  );
}
