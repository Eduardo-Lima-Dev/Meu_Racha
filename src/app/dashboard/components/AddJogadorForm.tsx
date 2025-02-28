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
    <Card className="w-full max-w-md mb-8 bg-card dark:bg-gray-900 text-card-foreground dark:text-white transition-colors duration-300 border border-border dark:border-gray-700 shadow-md">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-lg font-semibold">Adicionar Novo Jogador</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Nome */}
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nome do Jogador
            </label>
            <Input
              id="nome"
              type="text"
              value={nome}
              onChange={onNomeChange}
              required
              className="w-full bg-input dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2"
            />
          </div>

          {/* Assistências */}
          <div>
            <label htmlFor="assistencias" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Assistências
            </label>
            <Input
              id="assistencias"
              type="number"
              value={assistencias}
              onChange={onAssistenciasChange}
              required
              className="w-full bg-input dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2"
            />
          </div>

          {/* Gols */}
          <div>
            <label htmlFor="gols" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Gols
            </label>
            <Input
              id="gols"
              type="number"
              value={gols}
              onChange={onGolsChange}
              required
              className="w-full bg-input dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2"
            />
          </div>

          {/* Mensagem de sucesso */}
          {mensagem && <p className="text-green-500 text-sm">{mensagem}</p>}

          {/* Botão Adicionar */}
          <Button type="submit" className="w-full bg-primary dark:bg-primary-dark text-white py-2 rounded-lg hover:bg-opacity-80 transition-colors duration-200">
            Adicionar Jogador
          </Button>

          {/* Botões auxiliares */}
          <div className="flex justify-center space-x-4 w-full max-w-md mb-4">
            <Button
              onClick={clearStars}
              className="w-full mt-4 bg-yellow-500 dark:bg-yellow-600 text-white py-2 rounded-lg hover:bg-opacity-80 transition-colors duration-200"
            >
              Limpar Estrelas
            </Button>
          </div>

          <Button
            onClick={saveUpdates}
            className="w-full bg-blue-500 dark:bg-blue-600 text-white py-2 rounded-lg hover:bg-opacity-80 transition-colors duration-200"
          >
            Atualizar Jogadores
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddJogadorForm;
