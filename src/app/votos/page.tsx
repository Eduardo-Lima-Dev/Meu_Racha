"use client";

import { useEffect, useState } from "react";
import { ref, get, update } from "firebase/database";
import { useRouter } from "next/navigation";
import { database } from "../../config/firebaseConfig";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Modal from "./auth_votos/modal";

interface Jogador {
  id: string;
  nome: string;
  assistencias: number;
  gols: number;
  votos: number[];
}

const Votacao = () => {
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [votos, setVotos] = useState<{ [key: string]: number }>({});
  const [votacaoLiberada, setVotacaoLiberada] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchConfiguracoes = async () => {
      const dbRef = ref(database, "auth_votos/liberado");
      try {
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
          setVotacaoLiberada(snapshot.val());
        } else {
          setVotacaoLiberada(false);
        }
      } catch (error) {
        console.error("Erro ao buscar configurações:", error);
        setVotacaoLiberada(false);
      }
    };

    fetchConfiguracoes();
  }, []);

  useEffect(() => {
    if (votacaoLiberada) {
      const fetchJogadores = async () => {
        const dbRef = ref(database, "jogadores");
        try {
          const snapshot = await get(dbRef);
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
    }
  }, [votacaoLiberada]);

  const handleVoteChange = (jogadorId: string, voto: number) => {
    setVotos((prevVotos) => ({
      ...prevVotos,
      [jogadorId]: voto,
    }));
  };

  const handleSubmit = async () => {
    try {
      const updates: { [key: string]: number[] } = {};
      Object.keys(votos).forEach((jogadorId) => {
        const jogador = jogadores.find((j) => j.id === jogadorId);
        if (jogador) {
          const novosVotos = jogador.votos ? [...jogador.votos, votos[jogadorId]] : [votos[jogadorId]];
          updates[`/jogadores/${jogadorId}/votos`] = novosVotos;
        }
      });
      await update(ref(database), updates);
      alert("Votos registrados com sucesso!");
    } catch (error) {
      console.error("Erro ao registrar votos:", error);
    }
  };

  const handleCloseModal = () => {
    router.push("/");
  };

  if (votacaoLiberada === false) {
    return (
      <Modal
        title="Votação Não Liberada"
        message="A votação não está disponível no momento."
        icon="alert"
        onClose={handleCloseModal}
      />
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Votação de Jogadores</h1>
      {jogadores.map((jogador) => (
        <Card key={jogador.id} className="mb-4">
          <CardHeader>
            <CardTitle>{jogador.nome}</CardTitle>
            <CardDescription>
              Assistências: {jogador.assistencias} | Gols: {jogador.gols}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              onValueChange={(value) => handleVoteChange(jogador.id, Number(value))}
              className="flex flex-row space-x-4"
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <div key={value} className="flex items-center space-x-2">
                  <RadioGroupItem value={String(value)} id={`r${jogador.id}-${value}`} />
                  <Label htmlFor={`r${jogador.id}-${value}`}>{value} Estrela{value > 1 && 's'}</Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      ))}
      <Button onClick={handleSubmit} className="mt-4">
        Enviar Votos
      </Button>
    </div>
  );
};

export default Votacao;
