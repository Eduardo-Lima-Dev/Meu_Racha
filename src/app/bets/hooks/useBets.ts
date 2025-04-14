import { useState, useEffect } from 'react';
import { ref, onValue, set, get } from 'firebase/database';
import { database } from '@/config/firebaseConfig';
import { Bet } from '../types/bet';

const SALDO_INICIAL = 100;

export function useBets(userId: string | undefined) {
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const [userBalance, setUserBalance] = useState(SALDO_INICIAL);

  useEffect(() => {
    if (!userId) return;

    // Referência para as apostas do usuário
    const betsRef = ref(database, `bets/${userId}`);
    const balanceRef = ref(database, `users/${userId}/balance`);

    // Verifica se o usuário já tem saldo definido
    const checkInitialBalance = async () => {
      const balanceSnapshot = await get(balanceRef);
      if (!balanceSnapshot.exists()) {
        // Se não existe saldo, define o saldo inicial
        await set(balanceRef, SALDO_INICIAL);
      }
    };

    checkInitialBalance();

    // Listener para mudanças nas apostas
    const unsubscribe = onValue(betsRef, (snapshot) => {
      if (snapshot.exists()) {
        const betsData = snapshot.val();
        const betsArray = Object.entries(betsData as Record<string, Bet>).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        setBets(betsArray);
      } else {
        setBets([]);
      }
      setLoading(false);
    });

    // Listener para mudanças no saldo
    const unsubscribeBalance = onValue(balanceRef, (snapshot) => {
      if (snapshot.exists()) {
        setUserBalance(snapshot.val());
      } else {
        setUserBalance(SALDO_INICIAL);
      }
    });

    return () => {
      unsubscribe();
      unsubscribeBalance();
    };
  }, [userId]);

  return { bets, loading, userBalance };
}
