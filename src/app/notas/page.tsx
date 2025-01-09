'use client';

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import useNotas from "./hooks/useNotas";
import ModalVotacao, { useModalVotacao } from "./modal/modalVotação";

const NotasJogador: React.FC = () => {
  const {
    jogadores,
    notas,
    handleNotaChange,
    handleSubmit,
  } = useNotas();

  const [paginaAtual, setPaginaAtual] = useState(0);
  const router = useRouter();
  const { mostrarModal, closeModal } = useModalVotacao();

  const jogadorAtual = jogadores[paginaAtual];
  const ehUltimoJogador = paginaAtual === jogadores.length - 1;

  const handleProximo = () => {
    if (ehUltimoJogador) {
      handleSubmit();
    } else {
      handleSubmit();
      setPaginaAtual((prev) => prev + 1);
    }
  };

  const handleAnterior = () => {
    if (paginaAtual > 0) {
      setPaginaAtual((prev) => prev - 1);
    }
  };

  if (!jogadorAtual) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-center text-lg font-bold">Carregando jogadores...</p>
      </div>
    );
  }  

  return (
    <>
      {mostrarModal && <ModalVotacao onClose={closeModal} />}
      <div className="flex flex-col items-center justify-center h-screen space-y-6">
        <h1 className="text-3xl font-bold">Notas dos Jogadores</h1>
        <p className="text-sm text-gray-500">
          Cada nota deve estar entre <strong>0</strong> (mínimo) e <strong>10</strong> (máximo).
        </p>
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg space-y-6">
          <div key={jogadorAtual.id} className="space-y-4">
            <h2 className="text-xl font-semibold text-center">{jogadorAtual.nome}</h2>
            {Object.keys(notas[jogadorAtual.id] || {}).map((estatistica) => (
              <div key={estatistica} className="flex flex-col">
                <label htmlFor={estatistica} className="text-sm font-medium">
                  {estatistica.charAt(0).toUpperCase() + estatistica.slice(1)}
                </label>
                <Input
                  type="number"
                  id={`${jogadorAtual.id}-${estatistica}`}
                  value={notas[jogadorAtual.id]?.[estatistica] || 0}
                  onChange={(e) => {
                    const valor = Math.min(Number(e.target.value), 10);
                    handleNotaChange(jogadorAtual.id, estatistica, valor);
                  }}
                  className="mt-1"
                  min="0"
                  max="10"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between">
            <Button
              onClick={handleAnterior}
              disabled={paginaAtual === 0}
              className="mt-4"
            >
              Anterior
            </Button>
            <Button onClick={handleProximo} className="mt-4">
              {ehUltimoJogador ? "Concluir" : "Próximo"}
            </Button>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          Jogador {paginaAtual + 1} de {jogadores.length}
        </div>
        <div className="flex space-x-4 mt-6">
          <Button onClick={() => router.push("/")} className=" text-white">
            Ir para Home
          </Button>
          <Button onClick={() => router.push("/graficos")} variant="outline">
            Ir para Gráficos
          </Button>
        </div>
      </div>
    </>
  );
};

export default NotasJogador;
