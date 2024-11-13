"use client";

import { useEffect, useState } from "react";
import { ref, get, child } from "firebase/database";
import { database } from "../../config/firebaseConfig";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Jogador {
  id: string;
  nome: string;
  assistencias: number;
  gols: number;
  votos: number[];
}

const Home = () => {
  const [jogadores, setJogadores] = useState<Jogador[]>([]);

  useEffect(() => {
    const fetchJogadores = async () => {
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
        }
      } catch (error) {
        console.error("Erro ao buscar jogadores:", error);
      }
    };

    fetchJogadores();
  }, []);

  const calcularMedia = (votos: number[] | undefined) => {
    if (!votos || votos.length === 0) return "0.00";
    const total = votos.reduce((acc, voto) => acc + voto, 0);
    return (total / votos.length).toFixed(2);
  };
  
  const categorias = [5, 4, 3, 2, 1];
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ranking de Jogadores</h1>
      <div className="flex space-x-4 mb-6">
        <Button asChild>
          <Link href="/votos">Ir para Votação</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/admin">Ir para Administração</Link>
        </Button>
      </div>
      {categorias.map((categoria) => (
        <div key={categoria} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            {categoria} Estrela{categoria > 1 && 's'}
          </h2>
          {jogadores
            .filter((jogador) => Math.round(Number(calcularMedia(jogador.votos))) === categoria)
            .map((jogador) => (
              <Card key={jogador.id} className="mb-4">
                <CardHeader>
                  <CardTitle>{jogador.nome}</CardTitle>
                  <CardDescription>Média de Estrelas: {calcularMedia(jogador.votos)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Assistências: {jogador.assistencias}</p>
                  <p>Gols: {jogador.gols}</p>
                </CardContent>
              </Card>
            ))}
        </div>
      ))}
    </div>
  );
  };
  
  export default Home;