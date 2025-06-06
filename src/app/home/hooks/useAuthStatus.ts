import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import Cookies from "js-cookie";

export function useAuthStatus() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true);
        
        // Buscar dados do usuário no Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setCurrentUserName(userData.nome || "Usuário");
          setIsAdmin(userData.role === "admin");
        } else {
          setCurrentUserName(user.displayName || "Usuário");
        }

        const role = Cookies.get("role");
        setIsAdmin(role === "admin");
      } else {
        setIsAuthenticated(false);
        setCurrentUserName(null);
        setIsAdmin(false);

        Cookies.remove("role", { path: "/" });
        Cookies.remove("token", { path: "/" });
        Cookies.remove("userId", { path: "/" });
        Cookies.remove("isAuthenticated", { path: "/" });
      }
    });

    return () => unsubscribe();
  }, []);

  return { isAuthenticated, isAdmin, currentUserName };
}
