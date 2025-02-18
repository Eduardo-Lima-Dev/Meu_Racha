"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { app } from "../../config/firebaseConfig";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { FaArrowLeft } from "react-icons/fa";
import Cookies from "js-cookie";

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const auth = getAuth(app);
    const db = getFirestore(app);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      const userId = userCredential.user.uid;

      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const role = userDoc.data()?.role;
        console.log("User Role:", role);

        if (role === "admin") {
          Cookies.set("role", role);
          Cookies.set("token", await userCredential.user.getIdToken());
          Cookies.set("userId", userId);
          Cookies.set("isAuthenticated", "true");
          router.push("/dashboard");
        } 
      } else {
        await setDoc(userDocRef, { role: "user" });
        Cookies.set("token", await userCredential.user.getIdToken());
        Cookies.set("userId", userId);
        Cookies.set("role", "user");
        Cookies.set("isAuthenticated", "true");
        router.push("/");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      setErro("Credenciais inválidas. Por favor, tente novamente.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <button onClick={() => router.back()} className="absolute top-6 left-6 text-gray-700 hover:text-gray-900 flex items-center gap-2">
        <FaArrowLeft className="text-xl" />
        <span className="text-lg">Voltar</span>
      </button>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login do Administrador</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">E-mail</label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="senha" className="block text-sm font-medium">Senha</label>
              <Input id="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
            </div>
            {erro && <p className="text-red-500">{erro}</p>}
            <div className="flex justify-center mt-4">
              <Button type="submit">Entrar</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
