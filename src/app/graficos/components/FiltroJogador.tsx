'use client';

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FiltroJogadorProps {
  jogadores: { id: string; nome: string }[];
  jogadorSelecionado: string;
  aoSelecionarJogador: (id: string) => void;
}

const FiltroJogador: React.FC<FiltroJogadorProps> = ({ jogadores, jogadorSelecionado, aoSelecionarJogador }) => {
  return (
    <Select value={jogadorSelecionado} onValueChange={aoSelecionarJogador}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Selecione um jogador" />
      </SelectTrigger>
      <SelectContent>
        {jogadores.map((jogador) => (
          <SelectItem key={jogador.id} value={jogador.id}>
            {jogador.nome}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FiltroJogador;
