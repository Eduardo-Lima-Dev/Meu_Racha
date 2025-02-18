import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { calcularMedia } from "../utils/calcularMedia";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { Jogador } from "../types";

const renderStars = (average: number) => {
  const fullStars = Math.floor(average);
  const hasHalfStar = average - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex">
      {[...Array(fullStars)].map((_, index) => (
        <FaStar key={`full-${index}`} className="text-yellow-500" />
      ))}
      {hasHalfStar && <FaStarHalfAlt className="text-yellow-500" />}
      {[...Array(emptyStars)].map((_, index) => (
        <FaRegStar key={`empty-${index}`} className="text-yellow-500" />
      ))}
    </div>
  );
};

const JogadorCard: React.FC<{ jogador: Jogador }> = ({ jogador }) => {
  const media = calcularMedia(jogador.votos);

  return (
    <Card key={jogador.id} className="w-full max-w-xs">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {jogador.nome}
          {renderStars(media.media)}
        </CardTitle>
        <CardDescription>
          Média de Estrelas: {media.media.toFixed(2)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Assistências: {jogador.assistencias}</p>
        <p>Gols: {jogador.gols}</p>
      </CardContent>
    </Card>
  );
};

export default JogadorCard;
