"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import { app } from "../../config/firebaseConfig";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
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

      const token = await userCredential.user.getIdToken();
      Cookies.set("token", token);
      Cookies.set("userId", userId);
      Cookies.set("isAuthenticated", "false"); 
      router.push("/");
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
    <div className="relative flex items-center justify-center min-h-screen">

      <Button
        onClick={() => router.push("/")}
        className="absolute top-4 left-4"
      >
        Home
      </Button>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isCadastro ? "Cadastro de Usuário" : "Login de Usuário"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={isCadastro ? handleCadastro : handleLogin} className="space-y-4">
            {isCadastro && (
              <>
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium">
                    Nome
                  </label>
                  <Input
                    id="nome"
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium">
                    Role (Papel do Usuário)
                  </label>
                  <Input
                    id="role"
                    type="text"
                    value={role}
                    disabled
                    className="bg-gray-200 cursor-not-allowed"
                  />
                </div>
              </>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                E-mail
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="senha" className="block text-sm font-medium">
                Senha
              </label>
              <Input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>
            {erro && <p className="text-red-500">{erro}</p>}

            <div className="text-center mt-4">
              <Button type="submit">{isCadastro ? "Cadastrar" : "Entrar"}</Button>
            </div>
          </form>

          <div className="text-center mt-4">
            <Button
              variant="link"
              onClick={() => setIsCadastro(!isCadastro)}
            >
              {isCadastro ? "Já tenho uma conta" : "Não tenho conta"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserLogin;
