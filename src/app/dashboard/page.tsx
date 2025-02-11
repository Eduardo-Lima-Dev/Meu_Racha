"use client";

import { useEffect } from "react";
import useJogadores from "./hooks/useJogadores";
import Header from "./components/Header";
import ControleVotacao from "./components/ControleVotacao";
import AddJogadorForm from "./components/AddJogadorForm";
import JogadoresList from "./components/JogadoresList";
import { useRouter } from "next/navigation";

const AdminDashboard = () => {
  const router = useRouter();
  const {
    isAuthenticated,
    logout,
    votacaoLiberada,
    toggleVotacao,
    nome,
    assistencias,
    gols,
    mensagem,
    jogadores,
    editStats,
    modifiedJogadores,
    setNome,
    setAssistencias,
    setGols,
    addJogador,
    toggleEditStats,
    handleUpdateJogador,
    saveUpdates,
    clearJogadores,
    clearStars,
  } = useJogadores();

  useEffect(() => {
    if (isAuthenticated() === false) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Header onLogout={() => logout(router)} />
      <ControleVotacao votacaoLiberada={votacaoLiberada} onToggleVotacao={toggleVotacao} />
      <AddJogadorForm
        nome={nome}
        assistencias={assistencias}
        gols={gols}
        onNomeChange={(e) => setNome(e.target.value)}
        onAssistenciasChange={(e) => setAssistencias(Number(e.target.value))}
        onGolsChange={(e) => setGols(Number(e.target.value))}
        onSubmit={addJogador}
        mensagem={mensagem}
        clearJogadores={clearJogadores}
        clearStars={clearStars}
        saveUpdates={saveUpdates}
      />
      <JogadoresList
        jogadores={jogadores}
        editStats={editStats}
        modifiedJogadores={modifiedJogadores}
        onToggleStats={toggleEditStats}
        onUpdateJogador={handleUpdateJogador}
      />
    </div>
  );
};

export default AdminDashboard;