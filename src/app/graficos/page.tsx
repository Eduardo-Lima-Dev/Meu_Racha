"use client";

import React from "react";
import GraficoEstatisticas from "./components/GraficoEstatisticas";
import FiltroJogador from "./components/FiltroJogador";
import { useJogadoresEstatisticas } from "./hooks/useJogadoresEstatisticas";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import ThemeToggle from "@/components/ui/themeToggle";

const EstatisticasJogador: React.FC = () => {
  const {
    jogadores,
    jogadorSelecionado,
    selecionarJogador,
    loading,
    error,
  } = useJogadoresEstatisticas();

  const router = useRouter();

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        <p className="text-lg font-semibold">Carregando jogadores...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        <p className="text-lg font-semibold text-red-500 dark:text-red-400">{error}</p>
      </div>
    );

  return (
    <div className="relative flex flex-col items-center justify-center h-screen space-y-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <button
        onClick={() => router.back()}
        className="absolute top-6 left-6 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 flex items-center gap-2"
      >
        <FaArrowLeft className="text-xl" />
        <span className="text-lg">Voltar</span>
      </button>

      <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Estatísticas do Jogador</h1>
      
      <div className="w-full max-w-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-lg rounded-lg p-4">
        <FiltroJogador
          jogadores={jogadores}
          jogadorSelecionado={jogadorSelecionado?.id || ""}
          aoSelecionarJogador={(id) => selecionarJogador(id)}
        />
      </div>

      <div className="w-full max-w-4xl">
        {jogadorSelecionado && (
          <GraficoEstatisticas
            nomeJogador={jogadorSelecionado.nome}
            estatisticas={[
              jogadorSelecionado.fisico || 0,
              jogadorSelecionado.finalizacao || 0,
              jogadorSelecionado.drible || 0,
              jogadorSelecionado.defesa || 0,
              jogadorSelecionado.passe || 0,
            ]}
          />
        )}
      </div>
      <ThemeToggle />
    </div>
  );
};

export default EstatisticasJogador;
