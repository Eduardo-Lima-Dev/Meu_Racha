// src/components/JogadoresList.tsx
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
import { Jogador } from "../types";

interface JogadoresListProps {
  jogadores: Jogador[];
  editStats: { [key: string]: boolean };
  modifiedJogadores: { [key: string]: { excluirDaVotacao: boolean; assistencias: number; gols: number } };
  onToggleStats: (id: string) => void;
  onUpdateJogador: (id: string, key: "assistencias" | "gols" | "excluirDaVotacao", value: number | boolean) => void;
}

const JogadoresList: React.FC<JogadoresListProps> = ({
  jogadores,
  editStats,
  modifiedJogadores,
  onToggleStats,
  onUpdateJogador,
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4 text-center text-gray-900 dark:text-white">Jogadores</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-center">
        {jogadores.map((jogador) => (
          <Card
            key={jogador.id}
            className="w-full max-w-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 border border-gray-300 dark:border-gray-700 shadow-md"
          >
            <CardHeader 
              className="flex justify-between items-center cursor-pointer p-4"
              onClick={() => onToggleStats(jogador.id)}
            >
              <div className="flex items-center w-full justify-between">
                <CardTitle className="text-gray-900 dark:text-white">{jogador.nome}</CardTitle>
                <ChevronDown 
                  className={`text-gray-700 dark:text-gray-300 transition-transform duration-300 ${
                    editStats[jogador.id] ? "rotate-180" : ""
                  }`}
                />
              </div>
            </CardHeader>

            {editStats[jogador.id] && (
              <CardContent className="p-4">
                <div className="space-y-2">
                  {/* Assistências */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                      Assistências
                    </label>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-10 h-10 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateJogador(
                            jogador.id,
                            "assistencias",
                            Math.max(0, (modifiedJogadores[jogador.id]?.assistencias ?? jogador.assistencias) - 1)
                          );
                        }}
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        value={modifiedJogadores[jogador.id]?.assistencias ?? jogador.assistencias}
                        onChange={(e) => onUpdateJogador(jogador.id, "assistencias", Number(e.target.value))}
                        className="text-center bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-10 h-10 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateJogador(
                            jogador.id,
                            "assistencias",
                            Math.max(0, (modifiedJogadores[jogador.id]?.assistencias ?? jogador.assistencias) + 1)
                          );
                        }}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {/* Gols */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                      Gols
                    </label>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-10 h-10 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateJogador(
                            jogador.id,
                            "gols",
                            Math.max(0, (modifiedJogadores[jogador.id]?.gols ?? jogador.gols) - 1)
                          );
                        }}
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        value={modifiedJogadores[jogador.id]?.gols ?? jogador.gols}
                        onChange={(e) => onUpdateJogador(jogador.id, "gols", Number(e.target.value))}
                        className="text-center bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-10 h-10 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateJogador(
                            jogador.id,
                            "gols",
                            Math.max(0, (modifiedJogadores[jogador.id]?.gols ?? jogador.gols) + 1)
                          );
                        }}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {/* Excluir da votação */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`excluir-${jogador.id}`}
                      checked={modifiedJogadores[jogador.id]?.excluirDaVotacao ?? jogador.excluirDaVotacao}
                      onCheckedChange={(value) => onUpdateJogador(jogador.id, "excluirDaVotacao", value as boolean)}
                      className="border-gray-300 dark:border-gray-600"
                    />
                    <label htmlFor={`excluir-${jogador.id}`} className="text-sm font-medium text-gray-900 dark:text-gray-300">
                      Excluir da Votação
                    </label>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default JogadoresList;
