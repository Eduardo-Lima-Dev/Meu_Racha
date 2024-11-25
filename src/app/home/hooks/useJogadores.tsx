import { useState, useEffect } from "react";
import { ref, get, child } from "firebase/database";
import { database } from "../../../config/firebaseConfig";
import { Jogador } from "../types";

export const useJogadores = () => {
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

  return { jogadores, loading, error };
};
