import { getDatabase } from "firebase/database";
import { app } from "../../../config/firebaseConfig";
import { ref, runTransaction } from "firebase/database";


export async function updateUserBalance(userId: string, amount: number) {
  const db = getDatabase(app);
  // amount negativo para debitar, positivo para creditar
  const userBalanceRef = ref(db, `users/${userId}/balance`);
  await runTransaction(userBalanceRef, (currentBalance) => {
    return (currentBalance || 0) + amount;
  });
}
