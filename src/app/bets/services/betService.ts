import { app } from "../../../config/firebaseConfig";
import { getDatabase, ref, push, set } from "firebase/database";
import { Bet } from '../types/bet';

export async function createBet(newBet: Omit<Bet, "id">): Promise<void> {
  const db = getDatabase(app);
  const betsRef = ref(db, "bets");
  const newBetRef = push(betsRef);
  const betData: Bet = {
    ...newBet,
    id: newBetRef.key ?? "",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  await set(newBetRef, betData);
}
