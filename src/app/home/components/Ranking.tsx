import Categoria from "./Categoria";
import { Jogador } from "../types";

interface RankingProps {
  jogadores: Jogador[];
  categorias: number[];
}

const Ranking: React.FC<RankingProps> = ({ jogadores, categorias }) => {
  return (
    <div>
      {categorias.map((categoria) => (
        <Categoria key={categoria} categoria={categoria} jogadores={jogadores} />
      ))}
    </div>
  );
};

export default Ranking;
