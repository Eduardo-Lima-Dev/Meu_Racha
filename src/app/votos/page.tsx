"use client";

import useVotacao from "./hooks/useVotacao";
import VotacaoHeader from "./components/VotacaoHeader";
import VotacaoJogadorCard from "./components/VotacaoJogadorCard";
import ModalHandler from "./components/ModalHandler";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

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
    <div className="container mx-auto p-4">
      <VotacaoHeader />
      {jogadores
        .filter((jogador) => !jogador.excluirDaVotacao)
        .map((jogador) => (
          <VotacaoJogadorCard
            key={jogador.id}
            jogador={jogador}
            handleVoteChange={handleVoteChange}
          />
        ))}
      <Button onClick={handleSubmit} className="mt-4">
        Enviar Votos
      </Button>
      <ModalHandler modalConfig={modalConfig} handleCloseModal={handleCloseModal} />
    </div>
  );
};

export default Votacao;
