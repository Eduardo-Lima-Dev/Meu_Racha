"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import BetForm from './components/BetForm';
import BetList from './components/BetList';
import { useBets } from './hooks/useBets';

export default function BetsPage() {
  const router = useRouter();
  const [user, setUser] = React.useState<null | { uid: string }>(null);
  const { bets, loading, userBalance } = useBets(user?.uid);

  React.useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Sistema de Apostas</h1>
      <BetForm userId={user.uid} userBalance={userBalance} />
      {loading ? (
        <p>Carregando apostas...</p>
      ) : (
        <BetList bets={bets} />
      )}
    </div>
  );
}
