"use client";

import { useState } from "react";
import { useJogadores } from "./hooks/useJogadores";
import Ranking from "./components/Ranking";
import TopBar from "./components/TopBar";
import FiltroBusca from "./components/FiltroBusca";
import ThemeToggle from "@/components/ui/themeToggle";

const Home = () => {
  const { jogadores, loading, error } = useJogadores();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("estrela");
  const categoriasPadrao = [5, 4, 3, 2, 1];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Carregando jogadores...</p>
      </div>
    );
  }

  const jogadoresFiltrados = jogadores
    .filter((jogador) =>
      jogador.nome.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (filter === "gols") return b.gols - a.gols;
      if (filter === "assistencias") return b.assistencias - a.assistencias;
      if (filter === "nome") return a.nome.localeCompare(b.nome);
      return 0;
    });

  const mostrarTitulosEstrelas = searchQuery === "" && filter === "estrela";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Carregando jogadores...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <TopBar title="Ranking de Jogadores" isAdmin={false} />

      <FiltroBusca onSearch={setSearchQuery} onFilterChange={setFilter} />

      {error && <p className="text-center text-red-500">{error}</p>}
      {!error && (
        <Ranking
          jogadores={jogadoresFiltrados}
          categorias={mostrarTitulosEstrelas ? categoriasPadrao : []} 
          mostrarTitulosEstrelas={mostrarTitulosEstrelas}
        />
      )}

      <ThemeToggle />
    </div>
  );
};

export default Home;
