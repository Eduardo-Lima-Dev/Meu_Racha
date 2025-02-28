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
        <FaStar key={`full-${index}`} className="text-yellow-500 dark:text-yellow-400" />
      ))}
      {hasHalfStar && <FaStarHalfAlt className="text-yellow-500 dark:text-yellow-400" />}
      {[...Array(emptyStars)].map((_, index) => (
        <FaRegStar key={`empty-${index}`} className="text-yellow-500 dark:text-yellow-400" />
      ))}
    </div>
  );
};

const JogadorCard: React.FC<{ jogador: Jogador; isTop?: boolean }> = ({ jogador, isTop = false }) => {
  const media = calcularMedia(jogador.votos);

  return (
    <Card
      key={jogador.id}
      className={`w-full max-w-xs border-2 shadow-md transition-colors duration-300
      ${isTop 
        ? "border-yellow-300 bg-yellow-100 dark:bg-yellow-900 dark:border-yellow-600 dark:text-yellow-200" 
        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"}`}
    >
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {jogador.nome}
          {renderStars(media.media)}
        </CardTitle>
        <CardDescription className="text-gray-700 dark:text-gray-300">
          Média de Estrelas: {media.media.toFixed(2)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-800 dark:text-gray-200">Gols: {jogador.gols}</p>
        <p className="text-gray-800 dark:text-gray-200">Assistências: {jogador.assistencias}</p>
      </CardContent>
    </Card>
  );
};

export default JogadorCard;
