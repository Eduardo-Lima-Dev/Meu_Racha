import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, getFirestore } from "firebase/firestore";
import { app } from "../../../config/firebaseConfig";
import { Bet } from '../types/bet';

export function useBets(userId: string) {
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const db = getFirestore(app);

  useEffect(() => {
    const fetchBets = async () => {
      try {
        // Exemplo: buscar apostas somente do usuário logado
        const q = query(
          collection(db, 'bets'),
          where('userId', '==', userId)
        );
        const querySnapshot = await getDocs(q);
        const betsData = querySnapshot.docs.map(doc => {
          // Asseguramos que os dados sejam transformados conforme a interface Bet
          return {
            id: doc.id,
            ...doc.data()
          } as Bet;
        });

        setBets(betsData);
      } catch (error) {
        console.error("Erro ao buscar apostas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBets();
  }, [userId]);

  return { bets, loading };
}
