"use client";

import { useEffect, useState } from "react";
import { ref, get, child } from "firebase/database";
import { database } from "../../config/firebaseConfig";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

interface Jogador {
  id: string;
  nome: string;
  assistencias: number;
  gols: number;
  votos: { userId: string; vote: number }[];
}

const Home = () => {
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJogadores = async () => {
      setLoading(true);
      setError("");
      const dbRef = ref(database);

      try {
        const snapshot = await get(child(dbRef, "jogadores"));
        if (snapshot.exists()) {
          const data = snapshot.val();
          const listaJogadores = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setJogadores(listaJogadores);
        } else {
          console.warn("Nenhum jogador encontrado no Firebase.");
        }
      } catch (error) {
        console.error("Erro ao buscar jogadores:", error);
        setError("Erro ao carregar jogadores. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchJogadores();
  }, []);

  const calcularMedia = (votos: { userId: string; vote: number }[] | undefined) => {
    if (!votos || votos.length === 0) return 0;
    const votosValidos = votos.filter((voto) => typeof voto === "object" && voto.vote !== undefined);
    if (votosValidos.length === 0) return 0;
    const total = votosValidos.reduce((acc, voto) => acc + voto.vote, 0);
    return total / votosValidos.length;
  };

  const renderStars = (average: number) => {
    const fullStars = Math.floor(average);
    const hasHalfStar = average - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex">
        {[...Array(fullStars)].map((_, index) => (
          <FaStar key={`full-${index}`} className="text-yellow-500" />
        ))}
        {hasHalfStar && <FaStarHalfAlt className="text-yellow-500" />}
        {[...Array(emptyStars)].map((_, index) => (
          <FaRegStar key={`empty-${index}`} className="text-yellow-500" />
        ))}
      </div>
    );
  };

  const categorias = [5, 4, 3, 2, 1];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Ranking de Jogadores</h1>
      <div className="flex justify-center space-x-4 mb-6">
        <Button asChild>
          <Link href="/votos">Ir para Votação</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/admin">Ir para Administração</Link>
        </Button>
      </div>
      {loading && <p className="text-center">Carregando jogadores...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && !error && jogadores.length === 0 && (
        <p className="text-center">Nenhum jogador encontrado no ranking.</p>
      )}
      {!loading &&
        !error &&
        categorias.map((categoria) => {
          const jogadoresFiltrados = jogadores
            .filter((jogador) => Math.round(calcularMedia(jogador.votos)) === categoria)
            .sort((a, b) => calcularMedia(b.votos) - calcularMedia(a.votos));

          return (
            <div key={categoria} className="mb-6">
              <h2 className="text-xl font-semibold mb-2 text-center">
                {categoria} Estrela{categoria > 1 && "s"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-center">
                {jogadoresFiltrados.map((jogador) => (
                  <Card key={jogador.id} className="w-full max-w-xs">
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        {jogador.nome}
                        {renderStars(calcularMedia(jogador.votos))}
                      </CardTitle>
                      <CardDescription>
                        Média de Estrelas: {calcularMedia(jogador.votos).toFixed(2)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Assistências: {jogador.assistencias}</p>
                      <p>Gols: {jogador.gols}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Home;
