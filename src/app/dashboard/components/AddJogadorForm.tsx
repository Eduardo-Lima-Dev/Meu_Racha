// src/components/AddJogadorForm.tsx
import { FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface AddJogadorFormProps {
  nome: string;
  assistencias: number;
  gols: number;
  onNomeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAssistenciasChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGolsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent) => void;
  mensagem: string;
  clearJogadores: () => void;
  clearStars: () => void;
  saveUpdates: () => void;
}

const AddJogadorForm: React.FC<AddJogadorFormProps> = ({
  nome,
  assistencias,
  gols,
  onNomeChange,
  onAssistenciasChange,
  onGolsChange,
  onSubmit,
  mensagem,
  clearStars,
  saveUpdates,
}) => {
  return (
    <Card className="w-full max-w-md mb-8">
      <CardHeader>
        <CardTitle>Adicionar Novo Jogador</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium">
              Nome do Jogador
            </label>
            <Input
              id="nome"
              type="text"
              value={nome}
              onChange={onNomeChange}
              required
            />
          </div>
          <div>
            <label htmlFor="assistencias" className="block text-sm font-medium">
              Assistências
            </label>
            <Input
              id="assistencias"
              type="number"
              value={assistencias}
              onChange={onAssistenciasChange}
              required
            />
          </div>
          <div>
            <label htmlFor="gols" className="block text-sm font-medium">
              Gols
            </label>
            <Input
              id="gols"
              type="number"
              value={gols}
              onChange={onGolsChange}
              required
            />
          </div>
          {mensagem && <p className="text-green-500 text-sm">{mensagem}</p>}
          <Button type="submit" className="w-full">
            Adicionar Jogador
          </Button>
          <div className="flex justify-center space-x-4 w-full max-w-md mb-4">
            <Button onClick={clearStars} className="w-full mt-4 bg-yellow-500 text-white">
              Limpar Estrelas
            </Button>
          </div>
          <Button onClick={saveUpdates} className="w-full bg-blue-500 text-white">
            Atualizar Jogadores
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddJogadorForm;