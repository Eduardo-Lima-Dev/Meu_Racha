"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore"; // Import Firestore
import { app } from "../../config/firebaseConfig";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [role] = useState("user"); // Default role is "user"
  const [isCadastro, setIsCadastro] = useState(false); // Alterna entre login e cadastro
  const [erro, setErro] = useState("");
  const auth = getAuth(app);
  const db = getFirestore(app); // Firestore initialization
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      router.push("/home"); // Redireciona para a página principal
    } catch {
      setErro("Credenciais inválidas. Por favor, tente novamente.");
    }
  };

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create the user
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const userId = userCredential.user.uid;

      // Save the user information in Firestore
      await setDoc(doc(db, "users", userId), {
        nome,
        email,
        role, // Set the role as "user"
      });

      router.push("/home"); // Redireciona após cadastro
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      setErro("Erro ao criar conta. Por favor, tente novamente.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
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
                    disabled // Apenas exibe o valor fixo
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
            <Button type="submit">{isCadastro ? "Cadastrar" : "Entrar"}</Button>
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
