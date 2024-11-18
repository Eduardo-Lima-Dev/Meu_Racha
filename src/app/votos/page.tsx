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

interface Jogador {
  id: string;
  nome: string;
  assistencias: number;
  gols: number;
  votos: { userId: string; vote: number }[];
}

const Votacao = () => {
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [votos, setVotos] = useState<{ [key: string]: number }>({});
  const [votacaoLiberada, setVotacaoLiberada] = useState<boolean | null>(null);
  const [user, setUser] = useState<{ uid: string } | null>(null); // Armazena o usuário logado
  const [modalVisible, setModalVisible] = useState(false);
  const [erro, setErro] = useState<string | null>(null); // Mensagens de erro
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/login"); // Redireciona se não autenticado
      }
    });

    return () => unsubscribe();
  }, [router]);

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
    if (Object.keys(votos).length !== jogadores.length) {
      setErro("Por favor, vote em todos os jogadores antes de enviar.");
      return;
    }
  
    try {
      // Verifica se o usuário já votou
      for (const jogador of jogadores) {
        if (jogador.votos.some((voto) => voto.userId === user?.uid)) {
          setErro("Você já votou. Não é possível votar novamente.");
          return;
        }
      }
  
      // Atualiza os votos no banco de dados
      const updates: { [key: string]: { userId: string; vote: number }[] } = {};
      Object.keys(votos).forEach((jogadorId) => {
        const jogador = jogadores.find((j) => j.id === jogadorId);
        if (jogador) {
          // Garante que todos os votos sejam objetos no formato correto
          const novosVotos = [
            ...(jogador.votos.filter((v) => typeof v === "object") || []), // Mantém apenas objetos válidos
            { userId: user!.uid, vote: votos[jogadorId] },
          ];
          updates[`/jogadores/${jogadorId}/votos`] = novosVotos;
        }
      });
  
      await update(ref(database), updates);
  
      // Exibir modal de sucesso e redirecionar para home
      setModalVisible(true);
    } catch (error) {
      console.error("Erro ao registrar votos:", error);
      setErro("Erro ao registrar votos. Tente novamente.");
    }
  };
  

  const handleCloseModal = () => {
    setModalVisible(false);
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

  if (!user) {
    return null; // Exibe nada enquanto verifica autenticação
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Votação de Jogadores</h1>
      {erro && <p className="text-red-500 mb-4">{erro}</p>}
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

      {modalVisible && (
        <Modal
          title="Votação Enviada"
          message="Obrigado por participar da votação!"
          icon="success"
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Votacao;
