import { useState, useEffect } from "react";
import { auth } from "../../../config/firebaseConfig";
import { updateProfile, updateEmail, updatePassword } from "firebase/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa";

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
        await updateProfile(auth.currentUser, { displayName: value });
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 flex flex-col items-center text-center">
        <h2 className="text-xl font-semibold mb-4">Alterar {type}</h2>

        <div className="relative w-full">
          <input
            type={type === "Senha" && !showPassword ? "password" : "text"}
            className="border p-2 w-full rounded-lg text-center pr-10"
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          {type === "Senha" && (
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          )}
        </div>

        <div className="flex justify-center gap-4 w-full mt-4">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-red-400 text-white rounded-lg w-1/2"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave} 
            className="px-4 py-2 bg-black text-white rounded-lg w-1/2"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
