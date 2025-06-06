import { useState } from "react";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, push, set } from "firebase/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AddCasualPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddCasualPlayerModal: React.FC<AddCasualPlayerModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [nome, setNome] = useState("");
  const [estrelas, setEstrelas] = useState("3");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;

    setLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      const db = getDatabase();
      const jogadoresRef = ref(db, "jogadores");
      const novoJogadorRef = push(jogadoresRef);
      
      // Cria um voto no mesmo formato dos outros jogadores
      const votos = [{
        userId: user.uid,
        vote: parseInt(estrelas)
      }];

      await set(novoJogadorRef, {
        nome: nome.trim(),
        estrelas: parseInt(estrelas),
        votos: votos,
        casual: true,
        media: parseInt(estrelas),
        gols: 0,
        assistencias: 0,
        createdAt: new Date().toISOString()
      });

      setNome("");
      setEstrelas("3");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erro ao adicionar jogador casual:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Jogador Casual</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Jogador</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite o nome do jogador"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estrelas">Nível do Jogador</Label>
            <select
              id="estrelas"
              value={estrelas}
              onChange={(e) => setEstrelas(e.target.value)}
              className="w-full p-2 border rounded-md bg-white dark:bg-gray-800"
              disabled={loading}
            >
              <option value="1">1 Estrela</option>
              <option value="2">2 Estrelas</option>
              <option value="3">3 Estrelas</option>
              <option value="4">4 Estrelas</option>
              <option value="5">5 Estrelas</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adicionando..." : "Adicionar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 