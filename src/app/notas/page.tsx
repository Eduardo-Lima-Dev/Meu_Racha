"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useNotas from "./hooks/useNotas";
import ModalVotacao, { useModalVotacao } from "./modal/modalVotação";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ui/themeToggle";

const NotasJogador: React.FC = () => {
  const router = useRouter();

  const {
    jogadores,
    notas,
    handleNotaChange,
    handleSubmit,
    modalConfig,
    handleCloseModal, 
  } = useNotas();

  const [paginaAtual, setPaginaAtual] = useState(0);
  const { mostrarModal, closeModal } = useModalVotacao();

  const jogadorAtual = jogadores[paginaAtual];
  const ehUltimoJogador = paginaAtual === jogadores.length - 1;

  const handleProximo = async () => {
    if (ehUltimoJogador) {
      await handleSubmit();
    } else {
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
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        <p className="text-center text-lg font-bold">Carregando jogadores...</p>
      </div>
    );
  }  

  return (
    <>
      {mostrarModal && <ModalVotacao onClose={closeModal} />}

      {modalConfig.visible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-80 space-y-4 text-gray-900 dark:text-white">
            <h2 className="text-lg font-bold">{modalConfig.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">{modalConfig.message}</p>
            <Button onClick={handleCloseModal} className="w-full bg-blue-500 dark:bg-blue-600 text-white">
              OK
            </Button>
          </div>
        </div>
      )}

      <button 
        onClick={() => router.back()} 
        className="absolute top-6 left-6 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center gap-2"
      >
        <FaArrowLeft className="text-xl" />
        <span className="text-lg">Voltar</span>
      </button>

      <div className="flex flex-col items-center justify-center h-screen space-y-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        <h1 className="text-3xl font-bold">Notas dos Jogadores</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Cada nota deve estar entre <strong>0</strong> (mínimo) e <strong>10</strong> (máximo).
        </p>
        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg space-y-6 border border-gray-200 dark:border-gray-700">
          <div key={jogadorAtual.id} className="space-y-4">
            <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-white">
              {jogadorAtual.nome}
            </h2>
            {Object.keys(notas[jogadorAtual.id] || {}).map((estatistica) => (
              <div key={estatistica} className="flex flex-col">
                <label htmlFor={estatistica} className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
                  className="mt-1 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
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
              className="mt-4 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600"
            >
              Anterior
            </Button>
            <Button 
              onClick={handleProximo} 
              className="mt-4 bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-200"
            >
              {ehUltimoJogador ? "Concluir" : "Próximo"}
            </Button>
          </div>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Jogador {paginaAtual + 1} de {jogadores.length}
        </div>
      </div>
      <ThemeToggle />
    </>
  );
};

export default NotasJogador;
