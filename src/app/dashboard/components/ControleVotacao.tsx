// src/components/ControleVotacao.tsx
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ControleVotacaoProps {
  votacaoLiberada: boolean;
  onToggleVotacao: () => void;
}

const ControleVotacao: React.FC<ControleVotacaoProps> = ({ votacaoLiberada, onToggleVotacao }) => {
  return (
    <Card className="w-full max-w-md mb-8">
      <CardHeader>
        <CardTitle>Controle de Votação</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Status atual: {votacaoLiberada ? "Liberada" : "Bloqueada"}</p>
        <Button onClick={onToggleVotacao} className="w-full bg-blue-500 text-white">
          {votacaoLiberada ? "Bloquear Votação" : "Liberar Votação"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ControleVotacao;