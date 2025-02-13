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
    <div className="w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">Jogadores</h2>
      {jogadores.map((jogador) => (
        <Card key={jogador.id} className="mb-4">
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
                  <Input
                    id={`assistencias-${jogador.id}`}
                    type="number"
                    value={modifiedJogadores[jogador.id]?.assistencias ?? jogador.assistencias}
                    onChange={(e) =>
                      onUpdateJogador(jogador.id, "assistencias", Number(e.target.value))
                    }
                  />
                </div>
                <div>
                  <label htmlFor={`gols-${jogador.id}`} className="block text-sm font-medium">
                    Gols
                  </label>
                  <Input
                    id={`gols-${jogador.id}`}
                    type="number"
                    value={modifiedJogadores[jogador.id]?.gols ?? jogador.gols}
                    onChange={(e) =>
                      onUpdateJogador(jogador.id, "gols", Number(e.target.value))
                    }
                  />
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
  );
};

export default JogadoresList;