"use client"

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from "../../config/firebaseConfig";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useState } from "react";

const CriarContaAdmin = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const auth = getAuth(app);
  const db = getFirestore(app);
  const router = useRouter();

  const handleCriarConta = async (e: React.FormEvent) => {
    e.preventDefault();
    try {

      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const userId = userCredential.user.uid;

      const userDocRef = doc(db, "users", userId);
      await setDoc(userDocRef, {
        role: "admin", 
      });

      Cookies.set("token", await userCredential.user.getIdToken());
      Cookies.set("userId", userId);
      Cookies.set("role", "admin");
      Cookies.set("isAuthenticated", "true");

      router.push("/dashboard");

    } catch (error) {
      console.error("Erro ao criar conta:", error);
      setErro("Ocorreu um erro ao criar a conta.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleCriarConta} className="space-y-4">
        <div>
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>
        {erro && <p>{erro}</p>}
        <button type="submit">Criar Conta</button>
      </form>
    </div>
  );
};

export default CriarContaAdmin;
