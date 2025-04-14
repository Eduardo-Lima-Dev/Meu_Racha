"use client";

import { useState, useEffect } from "react";
import { useJogadores } from "./hooks/useJogadores";
import Ranking from "./components/Ranking";
import TopBar from "./components/TopBar";
import FiltroBusca from "./components/FiltroBusca";
import ThemeToggle from "@/components/ui/themeToggle";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { CustomSkeletonTheme } from "./components/SkeletonTheme";
import { useTheme } from "next-themes";

const Home = () => {
  const { jogadores, error, loading } = useJogadores();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("estrela");
  const categoriasPadrao = [5, 4, 3, 2, 1];
  const { setTheme } = useTheme();

  // Força o tema escuro ao carregar o componente
  useEffect(() => {
    setTheme('dark');
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-900 text-white">
        <TopBar title="Ranking de Jogadores" isAdmin={false} />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FiltroBusca onSearch={setSearchQuery} onFilterChange={setFilter} />
          
          <CustomSkeletonTheme>
            {categoriasPadrao.map((estrelas) => (
              <div key={estrelas} className="mb-8">
                <h2 className="text-2xl font-bold mb-4">
                  {estrelas} {estrelas === 1 ? 'Estrela' : 'Estrelas'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, index) => (
                    <div key={`${estrelas}-${index}`} className="w-full">
                      <Skeleton 
                        height={160} 
                        className="rounded-lg shadow-md" 
                        baseColor="#2d2d2d"
                        highlightColor="#3d3d3d"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CustomSkeletonTheme>
        </div>

        <ThemeToggle />
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

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <TopBar title="Ranking de Jogadores" isAdmin={false} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FiltroBusca onSearch={setSearchQuery} onFilterChange={setFilter} />

        {error && <p className="text-center text-red-500 dark:text-red-400">{error}</p>}
        {!error && (
          <Ranking
            jogadores={jogadoresFiltrados}
            categorias={mostrarTitulosEstrelas ? categoriasPadrao : []}
            mostrarTitulosEstrelas={mostrarTitulosEstrelas}
          />
        )}
      </div>

      <ThemeToggle />
    </div>
  );
};

export default Home;
