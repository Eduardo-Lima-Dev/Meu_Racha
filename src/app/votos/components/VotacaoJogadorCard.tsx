// src/components/VotacaoJogadorCard.tsx
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Jogador } from "@/app/dashboard/types";

interface VotacaoJogadorCardProps {
  jogador: Jogador;
  handleVoteChange: (jogadorId: string, voto: number) => void;
}

const VotacaoJogadorCard: React.FC<VotacaoJogadorCardProps> = ({ jogador, handleVoteChange }) => {
  return (
    <Card key={jogador.id} className="mb-4">
      <CardHeader>
        <CardTitle>{jogador.nome}</CardTitle>
        <CardDescription>
          Assistências: {jogador.assistencias} | Gols: {jogador.gols}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          onValueChange={(value) => handleVoteChange(jogador.id, Number(value))}
          className="flex flex-row space-x-4"
        >
          {[1, 2, 3, 4, 5].map((value) => (
            <div key={value} className="flex items-center space-x-2">
              <RadioGroupItem value={String(value)} id={`r${jogador.id}-${value}`} />
              <Label htmlFor={`r${jogador.id}-${value}`}>{value} Estrela{value > 1 && "s"}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default VotacaoJogadorCard;