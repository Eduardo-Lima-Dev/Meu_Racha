"use client";

import { useEffect } from "react";
import useJogadores from "./hooks/useJogadores";
import ControleVotacao from "./components/ControleVotacao";
import AddJogadorForm from "./components/AddJogadorForm";
import JogadoresList from "./components/JogadoresList";
import TopBar from "../home/components/TopBar";
import { useRouter } from "next/navigation";

const AdminDashboard = () => {
  const router = useRouter();
  const {
    isAuthenticated,
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
    const checkAuth = async () => {
      if (!(await isAuthenticated())) {
        router.push("/admin");
      }
    };

    checkAuth();
  }, [isAuthenticated, router]);

  return (
    <div className="w-full min-h-screen flex flex-col p-4">
      <TopBar title="Painel Administrativo" isAdmin={true} />

      <div className="flex flex-col md:flex-row w-full justify-center gap-6 mt-6 px-6">
        <div className="max-w-md w-full">
          <ControleVotacao votacaoLiberada={votacaoLiberada} onToggleVotacao={toggleVotacao} />
        </div>
        <div className="max-w-md w-full">
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
        </div>
      </div>

      <div className="w-full px-6 mt-6">
        <JogadoresList
          jogadores={jogadores}
          editStats={editStats}
          modifiedJogadores={modifiedJogadores}
          onToggleStats={toggleEditStats}
          onUpdateJogador={handleUpdateJogador}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
