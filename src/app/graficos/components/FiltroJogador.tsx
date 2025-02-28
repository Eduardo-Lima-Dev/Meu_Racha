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
      <SelectTrigger>
      <SelectValue placeholder="Selecione um jogador" />
      </SelectTrigger>

      <SelectContent 
        className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-600 dark:border-gray-500 shadow-md rounded-md"
      >
        {jogadores.map((jogador) => (
          <SelectItem 
            key={jogador.id} 
            value={jogador.id} 
            className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            {jogador.nome}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FiltroJogador;
