import Categoria from "./Categoria";
import { Jogador } from "../types";
import JogadorCard from "./JogadorCard";

interface RankingProps {
  jogadores: Jogador[];
  categorias: number[];
  mostrarTitulosEstrelas: boolean;
}

const Ranking: React.FC<RankingProps> = ({ jogadores, categorias, mostrarTitulosEstrelas }) => {
  return (
    <div>
      {mostrarTitulosEstrelas ? (
        categorias.map((categoria) => (
          <Categoria key={categoria} categoria={categoria} jogadores={jogadores} mostrarTitulo={true} />
        ))
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-center">
          {jogadores.map((jogador) => (
            <JogadorCard key={jogador.id} jogador={jogador} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Ranking;
