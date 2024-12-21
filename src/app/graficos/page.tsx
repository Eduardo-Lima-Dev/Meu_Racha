"use client";

import React from "react";
import GraficoEstatisticas from "./components/GraficoEstatisticas";
import FiltroJogador from "./components/FiltroJogador";
import { useJogadoresEstatisticas } from "./hooks/useJogadoresEstatisticas";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

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
    <div className="flex flex-col items-center justify-center h-screen space-y-6">
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
      <div className="flex space-x-4 mt-6">
        <Button onClick={() => router.push("/")} className="bg-blue-500 text-white">
          Ir para Home
        </Button>
        <Button onClick={() => router.push("/notas")} className="bg-green-500 text-white">
          Ir para Notas
        </Button>
      </div>
    </div>
  );
};

export default EstatisticasJogador;
