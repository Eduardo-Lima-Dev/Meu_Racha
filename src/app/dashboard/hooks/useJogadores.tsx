// src/hooks/useJogadores.ts
import { useState, useEffect } from "react";
import { ref, push, update, onValue, remove } from "firebase/database";
import { getAuth, signOut } from "firebase/auth";
import { database, app } from "@/config/firebaseConfig";
import { Jogador } from "../types";

const useJogadores = () => {
  const [nome, setNome] = useState("");
  const [assistencias, setAssistencias] = useState(0);
  const [gols, setGols] = useState(0);
  const [mensagem, setMensagem] = useState("");
  const [votacaoLiberada, setVotacaoLiberada] = useState(false);
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [editStats, setEditStats] = useState<{ [key: string]: boolean }>({});
  const [modifiedJogadores, setModifiedJogadores] = useState<{ [key: string]: { excluirDaVotacao: boolean; assistencias: number; gols: number } }>({});

  const auth = getAuth(app);

  const isAuthenticated = () => {
    return auth.currentUser !== null;
  };

  useEffect(() => {
    const jogadoresRef = ref(database, "jogadores");
    const authRef = ref(database, "auth_votos/liberado");

    onValue(jogadoresRef, (snapshot) => {
      const data = snapshot.val();
      const jogadoresList = data
        ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
        : [];
      setJogadores(jogadoresList);
    });

    onValue(authRef, (snapshot) => {
      setVotacaoLiberada(snapshot.val());
    });
  }, []);

  const toggleVotacao = async () => {
    if (!isAuthenticated()) {
      setMensagem("Usuário não autenticado.");
      return;
    }
    try {
      const novaLiberacao = !votacaoLiberada;

      const updates: { [key: string]: boolean | object } = {
        liberado: novaLiberacao,
      };

      if (!novaLiberacao) {
        updates["usuariosJaVotaram"] = {};
      }

      await update(ref(database, "auth_votos"), updates);

      setVotacaoLiberada(novaLiberacao);

    } catch (error) {
      console.error("Erro ao atualizar status de votação:", error);
    }
  };

  const logout = async (router: { push: (path: string) => void }) => {
    try {
      await signOut(auth);
      router.push("/admin");
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    }
  };

  const addJogador = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated()) {
      setMensagem("Usuário não autenticado.");
      return;
    }
    try {
      const jogadoresRef = ref(database, "jogadores");
      await push(jogadoresRef, {
        nome,
        assistencias,
        gols,
        votos: [],
      });
      setMensagem("Jogador adicionado com sucesso!");
      setNome("");
      setAssistencias(0);
      setGols(0);
    } catch (error) {
      console.error("Erro ao adicionar jogador:", error);
      setMensagem("Erro ao adicionar jogador. Tente novamente.");
    }
  };

  const toggleEditStats = (id: string) => {
    setEditStats((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleUpdateJogador = (id: string, key: "assistencias" | "gols" | "excluirDaVotacao", value: number | boolean) => {
    setModifiedJogadores((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [key]: value,
      },
    }));
  };

  const saveUpdates = async () => {
    if (!isAuthenticated()) {
      setMensagem("Usuário não autenticado.");
      return;
    }
    try {
      const updates = Object.keys(modifiedJogadores).map(async (id) => {
        const jogadorRef = ref(database, `jogadores/${id}`);
        await update(jogadorRef, modifiedJogadores[id]);
      });
      await Promise.all(updates);
      setMensagem("Estatísticas dos jogadores atualizadas com sucesso!");
      setModifiedJogadores({});
    } catch (error) {
      console.error("Erro ao atualizar jogadores:", error);
      setMensagem("Erro ao atualizar jogadores. Tente novamente.");
    }
  };

  const clearJogadores = async () => {
    if (!isAuthenticated()) {
      setMensagem("Usuário não autenticado.");
      return;
    }
    try {
      const jogadoresRef = ref(database, "jogadores");
      await remove(jogadoresRef);
      setMensagem("Todos os jogadores foram removidos com sucesso!");
    } catch (error) {
      console.error("Erro ao remover jogadores:", error);
      setMensagem("Erro ao remover jogadores. Tente novamente.");
    }
  };

  const clearStars = async () => {
    if (!isAuthenticated()) {
      setMensagem("Usuário não autenticado.");
      return;
    }
    try {
      const updates: { [key: string]: { votos: { userId: string; vote: number }[] } } = {};
      jogadores.forEach((jogador) => {
        updates[`jogadores/${jogador.id}/votos`] = { votos: [] };
      });
      await update(ref(database), updates);
      setMensagem("Todas as estrelas foram zeradas com sucesso!");
    } catch (error) {
      console.error("Erro ao limpar estrelas:", error);
      setMensagem("Erro ao limpar estrelas. Tente novamente.");
    }
  };

  return {
    isAuthenticated,
    nome,
    assistencias,
    gols,
    mensagem,
    votacaoLiberada,
    jogadores,
    editStats,
    modifiedJogadores,
    setNome,
    setAssistencias,
    setGols,
    setMensagem,
    toggleVotacao,
    logout,
    addJogador,
    toggleEditStats,
    handleUpdateJogador,
    saveUpdates,
    clearJogadores,
    clearStars,
  };
};

export default useJogadores;