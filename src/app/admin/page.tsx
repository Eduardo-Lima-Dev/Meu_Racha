"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { app } from "../../config/firebaseConfig";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import Cookies from "js-cookie";
import Link from "next/link";
import ThemeToggle from "@/components/ui/themeToggle";

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState<React.ReactNode>("");
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

        if (role !== "admin") {
          setErro(
            <>
              Você não tem acesso. Vá para{" "}
              <Link href="/login" className="text-blue-500 underline">
                Login
              </Link>.
            </>
          );
          return;
        }

        Cookies.set("role", role, { path: "/", sameSite: "strict", secure: true });
        Cookies.set("token", await userCredential.user.getIdToken(), { path: "/", sameSite: "strict", secure: true });
        Cookies.set("userId", userId, { path: "/", sameSite: "strict", secure: true });
        Cookies.set("isAuthenticated", "true", { path: "/", sameSite: "strict", secure: true });

        router.push("/dashboard"); 
      } else {
        setErro("Erro: Conta sem permissões definidas.");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      setErro("Credenciais inválidas. Por favor, tente novamente.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <button 
        onClick={() => router.back()} 
        className="absolute top-6 left-6 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center gap-2"
      >
        <FaArrowLeft className="text-xl" />
        <span className="text-lg">Voltar</span>
      </button>

      <Card className="w-full max-w-md bg-gray-100 dark:bg-gray-800 border dark:border-gray-700 shadow-lg transition-colors duration-300">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Login do Administrador</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-gray-300">E-mail</label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white border dark:border-gray-600"
              />
            </div>
            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-900 dark:text-gray-300">Senha</label>
              <div className="relative">
                <Input 
                  id="senha" 
                  type={mostrarSenha ? "text" : "password"} 
                  value={senha} 
                  onChange={(e) => setSenha(e.target.value)} 
                  required 
                  className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white border dark:border-gray-600 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-600 dark:text-gray-300"
                >
                  {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            {erro && <p className="text-red-500 dark:text-red-400">{erro}</p>}
            <div className="flex justify-center mt-4">
              <Button type="submit" className="bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-200">
                Entrar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <ThemeToggle />
    </div>
  );
};

export default AdminLogin;
