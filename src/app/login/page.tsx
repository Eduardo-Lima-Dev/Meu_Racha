"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getFirestore, getDoc } from "firebase/firestore";
import { app } from "../../config/firebaseConfig";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import ThemeToggle from "@/components/ui/themeToggle";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [nome, setNome] = useState("");
  const [role] = useState("user");
  const [isCadastro, setIsCadastro] = useState(false);
  const [erro, setErro] = useState("");
  const auth = getAuth(app);
  const db = getFirestore(app);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      const userId = userCredential.user.uid;

      // Buscar a role do usuário no Firestore
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData?.role || "user";

      const token = await userCredential.user.getIdToken();
      Cookies.set("token", token);
      Cookies.set("userId", userId);
        Cookies.set("role", role);
        Cookies.set("isAuthenticated", "true");

        // Redirecionar para a home independente da role
      router.push("/");
      } else {
        setErro("Erro: Conta sem permissões definidas.");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      setErro("Credenciais inválidas. Por favor, tente novamente.");
    }
  };

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const userId = userCredential.user.uid;

      await setDoc(doc(db, "users", userId), {
        nome,
        email,
        role,
        isAuthenticated: false,
      });

      const token = await userCredential.user.getIdToken();
      Cookies.set("token", token);
      Cookies.set("userId", userId);
      Cookies.set("isAuthenticated", "false"); 
      router.push("/votos");
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      setErro("Erro ao criar conta. Por favor, tente novamente.");
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
            {isCadastro ? "Cadastro de Usuário" : "Login de Usuário"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={isCadastro ? handleCadastro : handleLogin} className="space-y-4">
            {isCadastro && (
              <>
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
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Role (Papel do Usuário)
                  </label>
                  <Input
                    id="role"
                    type="text"
                    value={role}
                    disabled
                    className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white cursor-not-allowed border border-gray-300 dark:border-gray-600"
                  />
                </div>
              </>
            )}
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
                {isCadastro ? "Cadastrar" : "Entrar"}
              </Button>
            </div>
          </form>

          <div className="text-center mt-4">
            <Button
              variant="link"
              onClick={() => setIsCadastro(!isCadastro)}
              className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              {isCadastro ? "Já tenho uma conta" : "Não tenho conta"}
            </Button>
          </div>
        </CardContent>
      </Card>
      <ThemeToggle />
    </div>
  );
};

export default UserLogin;
