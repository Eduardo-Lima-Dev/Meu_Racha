"use client";

import { useEffect, useState } from "react";
import { ref, get, update } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { database } from "../../config/firebaseConfig";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Modal from "./auth_votos/modal";
import { ArrowLeft } from "lucide-react";

interface Jogador {
  id: string;
  nome: string;
  assistencias: number;
  gols: number;
  votos: { userId: string; vote: number }[];
  excluirDaVotacao: boolean;
}

const Votacao = () => {
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [votos, setVotos] = useState<{ [key: string]: number }>({});
  const [votacaoLiberada, setVotacaoLiberada] = useState<boolean | null>(null);
  const [user, setUser] = useState<{ uid: string } | null>(null);
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    message: string;
    icon: string;
    visible: boolean;
  }>({
    title: "",
    message: "",
    icon: "",
    visible: false,
  });
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const fetchConfiguracoes = async () => {
      const dbRef = ref(database, "auth_votos/liberado");
      try {
        const snapshot = await get(dbRef);
        setVotacaoLiberada(snapshot.exists() ? snapshot.val() : false);
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
    if (Object.keys(votos).length !== jogadores.length) {
      setModalConfig({
        title: "Erro",
        message: "Por favor, vote em todos os jogadores antes de enviar.",
        icon: "alert",
        visible: true,
      });
      return;
    }

    try {
      for (const jogador of jogadores) {
        if (Array.isArray(jogador.votos) && jogador.votos.some((voto) => voto.userId === user?.uid)) {
          setModalConfig({
            title: "Erro",
            message: "Você já votou. Não é possível votar novamente.",
            icon: "alert",
            visible: true,
          });
          return;
        }
      }

      const updates: { [key: string]: { userId: string; vote: number }[] } = {};
      Object.keys(votos).forEach((jogadorId) => {
        const jogador = jogadores.find((j) => j.id === jogadorId);
        if (jogador) {
          const novosVotos = [
            ...(jogador.votos || []),
            { userId: user!.uid, vote: votos[jogadorId] },
          ];
          updates[`/jogadores/${jogadorId}/votos`] = novosVotos;
        }
      });

      await update(ref(database), updates);

      setModalConfig({
        title: "Sucesso",
        message: "Votação realizada com sucesso!",
        icon: "success",
        visible: true,
      });
    } catch (error) {
      console.error("Erro ao registrar votos:", error);
      setModalConfig({
        title: "Erro",
        message: "Erro ao registrar votos. Tente novamente.",
        icon: "alert",
        visible: true,
      });
    }
  };

  const handleCloseModal = () => {
    setModalConfig((prev) => ({ ...prev, visible: false }));
    if (modalConfig.icon === "success") {
      router.push("/");
    }
  };

  if (votacaoLiberada === false) {
    return (
      <Modal
        title="Votação Não Liberada"
        message="A votação não está disponível no momento."
        icon="alert"
        onClose={() => router.push("/")}
      />
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-4">
        <Button 
          variant="ghost" 
          className="mr-2" 
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold">Votação de Jogadores</h1>
      </div> 
      {jogadores
      .filter((jogador) => !jogador.excluirDaVotacao) 
      .map((jogador) => (
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
                  <Label htmlFor={`r${jogador.id}-${value}`}>{value} Estrela{value > 1 && "s"}</Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      ))}
      <Button onClick={handleSubmit} className="mt-4">
        Enviar Votos
      </Button>

      {modalConfig.visible && (
        <Modal
          title={modalConfig.title}
          message={modalConfig.message}
          icon={modalConfig.icon}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Votacao;
