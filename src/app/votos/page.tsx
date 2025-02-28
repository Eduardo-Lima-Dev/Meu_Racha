"use client";

import useVotacao from "./hooks/useVotacao";
import VotacaoJogadorCard from "./components/VotacaoJogadorCard";
import ModalHandler from "./components/ModalHandler";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Jogador } from "../dashboard/types";
import ThemeToggle from "@/components/ui/themeToggle";
import { FaArrowLeft } from "react-icons/fa";

const Votacao = () => {
  const router = useRouter();
  const {
    jogadores,
    votacaoLiberada,
    user,
    modalConfig,
    handleVoteChange,
    handleSubmit,
    handleCloseModal,
  } = useVotacao();

  if (votacaoLiberada === false) {
    return (
      <ModalHandler
        modalConfig={{
          title: "Votação Não Liberada",
          message: "A votação não está disponível no momento.",
          icon: "alert",
          visible: true,
        }}
        handleCloseModal={() => router.push("/")}
      />
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      {/* Topo fixo para o botão de voltar */}
      <div className="sticky top-0 z-10 p-4">
        <button
          onClick={() => router.back()}
          className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 flex items-center gap-2"
        >
          <FaArrowLeft className="text-xl" />
          <span className="text-lg">Voltar</span>
        </button>
      </div>

      {/* Container principal */}
      <div className="container mx-auto p-6 mt-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
        {/* Título da Votação */}
        <h1 className="text-3xl font-bold text-center mb-6">Votação de Jogadores</h1>

        {/* Lista de Jogadores para Votação */}
        <div className="space-y-4">
          {jogadores
            .filter((jogador: { excluirDaVotacao: boolean }) => !jogador.excluirDaVotacao)
            .map((jogador: Jogador) => (
              <VotacaoJogadorCard
                key={jogador.id}
                jogador={jogador}
                handleVoteChange={handleVoteChange}
              />
            ))}
        </div>

        {/* Botão de Enviar Votos */}
        <div className="flex justify-center mt-6">
          <Button
            onClick={handleSubmit}
            className="bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-200"
          >
            Enviar Votos
          </Button>
        </div>
      </div>

      {/* Modal de Confirmação */}
      <ModalHandler modalConfig={modalConfig} handleCloseModal={handleCloseModal} />

      {/* Toggle de Tema */}
      <ThemeToggle />
    </div>
  );
};

export default Votacao;
