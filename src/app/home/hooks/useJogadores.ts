import { useState, useEffect } from "react";
import { getDatabase, ref, onValue, off } from "firebase/database";
import { Jogador } from "../types";

export function useJogadores() {
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = getDatabase();
    const jogadoresRef = ref(db, "jogadores");

    const unsubscribe = onValue(jogadoresRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const jogadoresData = Object.entries(data).map(([id, jogador]: [string, unknown]) => ({
          id,
          ...(jogador as Omit<Jogador, 'id'>)
        })) as Jogador[];
        setJogadores(jogadoresData);
      } else {
        setJogadores([]);
      }
      setLoading(false);
    });

    return () => {
      off(jogadoresRef);
    };
  }, []);

  return { jogadores, loading };
} 