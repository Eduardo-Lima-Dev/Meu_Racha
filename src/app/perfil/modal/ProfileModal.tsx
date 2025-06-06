import { useState, useEffect } from "react";
import { auth } from "../../../config/firebaseConfig";
import { updateProfile, updateEmail, updatePassword } from "firebase/auth";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface ProfileModalProps {
  type: string;
  onClose: () => void;
}

export default function ProfileModal({ type, onClose }: ProfileModalProps) {
  const [value, setValue] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (auth.currentUser) {
      if (type === "User") {
        setPlaceholder(auth.currentUser.displayName || "Nome não definido");
      } else if (type === "Email") {
        setPlaceholder(auth.currentUser.email || "Email não definido");
      } else if (type === "Senha") {
        setPlaceholder("Digite sua nova senha");
      }
    }
  }, [type]);

  const handleSave = async () => {
    if (!auth.currentUser) {
      alert("Usuário não autenticado");
      return;
    }

    try {
      if (value.trim() === "") {
        alert("Campo vazio. Nenhuma alteração foi feita.");
        return;
      }

      if (type === "User") {
        // Atualizar no Auth
        await updateProfile(auth.currentUser, { displayName: value });
        
        // Atualizar no Firestore
        const db = getFirestore();
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userDocRef, {
          nome: value
        });
        
        alert("Nome atualizado com sucesso!");
      } else if (type === "Email") {
        await updateEmail(auth.currentUser, value);
        alert("Email atualizado com sucesso!");
      } else if (type === "Senha") {
        await updatePassword(auth.currentUser, value)
          .then(() => alert("Senha alterada com sucesso!"))
          .catch((error) => {
            if (error.code === "auth/requires-recent-login") {
              alert("Você precisa fazer login novamente para alterar sua senha.");
            } else {
              alert("Erro ao atualizar senha: " + error.message);
            }
          });
      }

      onClose();
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert("Erro ao atualizar: " + error.message);
      } else {
        alert("Erro ao atualizar");
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <Card className="w-full max-w-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center">Alterar {type}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Input
              type={type === "Senha" && !showPassword ? "password" : "text"}
              placeholder={placeholder}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
            />
            {type === "Senha" && (
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 dark:text-gray-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            )}
          </div>

          <div className="flex gap-4">
            <Button
              onClick={onClose}
              className="w-full bg-red-500 hover:bg-red-600 text-white"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              Salvar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
