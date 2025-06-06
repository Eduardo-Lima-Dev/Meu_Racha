import { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { Jogador } from "../types";

export function useJogadores() {
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    carregarJogadores();
  }, []);

  const carregarJogadores = async () => {
    setLoading(true);
    try {
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, "jogadores"));
      const jogadoresData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Jogador[];

      // Inclui todos os jogadores, incluindo os casuais
      setJogadores(jogadoresData);
      setError(null);
    } catch (error) {
      console.error("Erro ao carregar jogadores:", error);
      setError("Erro ao carregar jogadores. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  return { jogadores, loading, error, carregarJogadores };
} 