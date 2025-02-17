import { Jogador } from "../../home/types";

interface JogadorCardProps {
  jogador: Jogador;
}

const JogadorCard: React.FC<JogadorCardProps> = ({ jogador }) => {
  return (
    <div className="border rounded-lg p-4 shadow-md bg-white text-center">
      <h3 className="text-lg font-bold">{jogador.nome}</h3>
      <p className="text-gray-600">⭐ Média: {jogador.media ? jogador.media.toFixed(1) : "0.0"}</p>
      <p className="text-green-600">⚽ Gols: {jogador.gols}</p>
      <p className="text-blue-600">🎯 Assistências: {jogador.assistencias}</p>
    </div>
  );
};

export default JogadorCard;
