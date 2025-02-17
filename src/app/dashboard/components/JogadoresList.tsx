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
      <h2 className="text-xl font-semibold mb-4 text-center">Jogadores</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-center">
        {jogadores.map((jogador) => (
          <Card key={jogador.id} className="w-full max-w-sm">
            <CardHeader className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CardTitle>{jogador.nome}</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => onToggleStats(jogador.id)}>
                  <ChevronDown />
                </Button>
              </div>
            </CardHeader>
            {editStats[jogador.id] && (
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <label htmlFor={`assistencias-${jogador.id}`} className="block text-sm font-medium">
                      Assistências
                    </label>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-10 h-10 p-0"
                        onClick={() => onUpdateJogador(jogador.id, "assistencias", Math.max(0, (modifiedJogadores[jogador.id]?.assistencias ?? jogador.assistencias) - 1))}
                        >
                        -
                      </Button>
                      <Input
                        id={`assistencias-${jogador.id}`}
                        type="number"
                        value={modifiedJogadores[jogador.id]?.assistencias ?? jogador.assistencias}
                        onChange={(e) =>
                          onUpdateJogador(jogador.id, "assistencias", Number(e.target.value))
                        }
                        className="text-center"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-10 h-10 p-0"
                        onClick={() => onUpdateJogador(jogador.id, "assistencias", Math.max(0, (modifiedJogadores[jogador.id]?.assistencias ?? jogador.assistencias) + 1))}
                        >
                        +
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor={`gols-${jogador.id}`} className="block text-sm font-medium">
                      Gols
                    </label>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-10 h-10 p-0"
                        onClick={() => onUpdateJogador(jogador.id, "gols", Math.max(0, (modifiedJogadores[jogador.id]?.gols ?? jogador.gols) - 1))}
                        >
                        -
                      </Button>
                    
                      <Input
                        id={`gols-${jogador.id}`}
                        type="number"
                        value={modifiedJogadores[jogador.id]?.gols ?? jogador.gols}
                        onChange={(e) =>
                          onUpdateJogador(jogador.id, "gols", Number(e.target.value))
                        }
                        className="text-center"
                      />

                      <Button
                        variant="outline"
                        size="icon"
                        className="w-10 h-10 p-0"
                        onClick={() => onUpdateJogador(jogador.id, "gols", Math.max(0, (modifiedJogadores[jogador.id]?.gols ?? jogador.gols) + 1))}
                        >
                        +
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`excluir-${jogador.id}`}
                      checked={modifiedJogadores[jogador.id]?.excluirDaVotacao ?? jogador.excluirDaVotacao}
                      onCheckedChange={(value) => onUpdateJogador(jogador.id, "excluirDaVotacao", value as boolean)}
                    />
                    <label htmlFor={`excluir-${jogador.id}`} className="text-sm font-medium">
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
