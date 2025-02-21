import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Cookies from "js-cookie";

export function useAuthStatus() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setCurrentUserName(user.displayName || "Usuário");

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
