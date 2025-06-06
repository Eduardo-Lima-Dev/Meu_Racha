"use client"

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from "../../config/firebaseConfig";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import ThemeToggle from "@/components/ui/themeToggle";

const CriarContaAdmin = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
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
        nome,
        email,
        role: "admin", 
      });

      Cookies.set("token", await userCredential.user.getIdToken());
      Cookies.set("userId", userId);
      Cookies.set("role", "admin");
      Cookies.set("isAuthenticated", "true");

      router.push("/");
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      setErro("Ocorreu um erro ao criar a conta.");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <button
        onClick={() => router.back()}
        className="absolute top-6 left-6 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 flex items-center gap-2"
      >
        <FaArrowLeft className="text-xl" />
        <span className="text-lg">Voltar</span>
      </button>

      <Card className="w-full max-w-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">
            Cadastro de Administrador
          </CardTitle>
        </CardHeader>
        <CardContent>
      <form onSubmit={handleCriarConta} className="space-y-4">
        <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nome
              </label>
              <Input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                E-mail
              </label>
              <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
                className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
          />
        </div>
        <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Senha
              </label>
              <div className="relative">
                <Input
            id="senha"
                  type={mostrarSenha ? "text" : "password"}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
                  className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            {erro && <p className="text-red-500 dark:text-red-400">{erro}</p>}

            <div className="text-center mt-4">
              <Button type="submit" className="bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-200">
                Criar Conta
              </Button>
        </div>
      </form>
        </CardContent>
      </Card>
      <ThemeToggle />
    </div>
  );
};

export default CriarContaAdmin;
