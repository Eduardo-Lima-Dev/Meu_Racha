"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import useJogadores from "./hooks/useJogadores";
import ControleVotacao from "./components/ControleVotacao";
import AddJogadorForm from "./components/AddJogadorForm";
import JogadoresList from "./components/JogadoresList";
import TopBar from "../home/components/TopBar";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ui/themeToggle";

const AdminDashboard = () => {
  const router = useRouter();
  const {
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
    const checkAuth = () => {
      const role = Cookies.get("role");
      const token = Cookies.get("token");

      if (!token || role !== "admin") {
        router.push("/acesso-negado");
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <TopBar title="Painel Administrativo" isAdmin={true} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex flex-col md:flex-row w-full justify-center items-center md:items-start gap-6">
          <div className="max-w-md w-full flex flex-col items-center md:items-start">
            <ControleVotacao votacaoLiberada={votacaoLiberada} onToggleVotacao={toggleVotacao} />
          </div>
          <div className="max-w-md w-full flex flex-col items-center md:items-start">
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

        <div className="w-full mt-6">
          <JogadoresList
            jogadores={jogadores}
            editStats={editStats}
            modifiedJogadores={modifiedJogadores}
            onToggleStats={toggleEditStats}
            onUpdateJogador={handleUpdateJogador}
          />
        </div>
      </div>
      <ThemeToggle />
    </div>
  );
};

export default AdminDashboard;
