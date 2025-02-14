"use client";

import React from "react";
import GraficoEstatisticas from "./components/GraficoEstatisticas";
import FiltroJogador from "./components/FiltroJogador";
import { useJogadoresEstatisticas } from "./hooks/useJogadoresEstatisticas";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

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
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Carregando jogadores...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="relative flex flex-col items-center justify-center h-screen space-y-6">
      <button
        onClick={() => router.back()}
        className="absolute top-6 left-6 text-gray-700 hover:text-gray-900 flex items-center gap-2"
      >
        <FaArrowLeft className="text-xl" />
        <span className="text-lg">Voltar</span>
      </button>

      <h1 className="text-3xl font-bold text-center">Estatísticas do Jogador</h1>
      <div className="w-full max-w-md">
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
    </div>
  );
};

export default EstatisticasJogador;
