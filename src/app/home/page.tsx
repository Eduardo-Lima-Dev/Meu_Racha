"use client";

import { useJogadores } from "./hooks/useJogadores";
import Ranking from "./components/Ranking";
import TopBar from "./components/TopBar";

const Home = () => {
  const { jogadores, loading, error } = useJogadores();
  const categorias = [5, 4, 3, 2, 1];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Carregando jogadores...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <TopBar title="Ranking de Jogadores" userName="User" />

      {error && <p className="text-center text-red-500">{error}</p>}
      {!error && <Ranking jogadores={jogadores} categorias={categorias} />}
    </div>
  );
};

export default Home;
