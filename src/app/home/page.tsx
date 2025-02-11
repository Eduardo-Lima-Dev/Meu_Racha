"use client";

import { useJogadores } from "./hooks/useJogadores";
import Ranking from "./components/Ranking";
import TopBar from "./components/TopBar";

const Home = () => {
  const { jogadores, loading, error } = useJogadores();
  const categorias = [5, 4, 3, 2, 1];

  return (
    <div className="container mx-auto p-4">
        <TopBar title="Ranking de Jogadores" userName="Duduh" onLogout={() => console.log("Logout")} />

        {loading && <p className="text-center">Carregando jogadores...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && (
          <Ranking jogadores={jogadores} categorias={categorias} />
        )}
    </div>
  );
};

export default Home;
