import { useState, useEffect } from "react";
import { Jogador } from "../types";
import { AddCasualPlayerModal } from "./AddCasualPlayerModal";
import { getDatabase, ref, get, remove } from "firebase/database";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DivisaoTimesProps {
  jogadores: Jogador[];
}

interface JogadorData {
  id: string;
  nome: string;
  casual: boolean;
  estrelas: number;
  votos: Array<{ userId: string; vote: number }>;
  media: number;
  gols: number;
  assistencias: number;
  createdAt: string;
  excluirDaVotacao?: boolean;
}

const DivisaoTimes: React.FC<DivisaoTimesProps> = ({ jogadores }) => {
  const [selecionados, setSelecionados] = useState<Jogador[]>([]);
  const [numTimes, setNumTimes] = useState(3);
  const [jogadoresPorTime, setJogadoresPorTime] = useState(5);
  const [times, setTimes] = useState<Jogador[][]>([]);
  const [divisaoRealizada, setDivisaoRealizada] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [jogadorCasual, setJogadorCasual] = useState<Jogador | null>(null);

  const carregarJogadores = async () => {
    try {
      const db = getDatabase();
      const jogadoresRef = ref(db, "jogadores");
      const snapshot = await get(jogadoresRef);
      const data = snapshot.val();
      if (data) {
        const jogadoresData = Object.entries(data).map(([id, jogador]: [string, unknown]) => ({
          id,
          ...(jogador as Omit<JogadorData, 'id'>)
        })) as Jogador[];
        
        // Mantém os jogadores selecionados e adiciona o novo jogador casual
        setSelecionados(prev => {
          const prevIds = new Set(prev.map(j => j.id));
          const novosJogadores = jogadoresData.filter(j => !prevIds.has(j.id) && j.casual);
          const jogadoresAtualizados = [...prev, ...novosJogadores];
          return jogadoresAtualizados;
        });

        // Verifica se há jogadores casuais e mostra o diálogo de confirmação
        const jogadoresCasuais = jogadoresData.filter(j => j.casual);
        if (jogadoresCasuais.length > 0) {
          setJogadorCasual(jogadoresCasuais[0]);
          setShowConfirmDialog(true);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar jogadores:", error);
    }
  };

  useEffect(() => {
    carregarJogadores();
  }, []);

  const handleRemovePlayer = (jogador: Jogador) => {
    setSelecionados((prev) => prev.filter((j) => j.id !== jogador.id));
    setDivisaoRealizada(false);
  };

  // Ordena os jogadores alfabeticamente pelo nome
  const jogadoresOrdenados = [...jogadores].sort((a, b) =>
    a.nome.localeCompare(b.nome)
  );

  const toggleSelecionarJogador = (jogador: Jogador) => {
    setSelecionados((prev) =>
      prev.some((j) => j.id === jogador.id)
        ? prev.filter((j) => j.id !== jogador.id)
        : [...prev, jogador]
    );
  };

  const dividirTimes = () => {
    if (selecionados.length < numTimes * jogadoresPorTime) {
      alert("Número insuficiente de jogadores para essa divisão!");
      return;
    }

    setTimes([]);
    setDivisaoRealizada(false);

    const novosTimes: Jogador[][] = Array.from({ length: numTimes }, () => []);
    const jogadoresOrdenados = [...selecionados].sort(
      (a, b) => (b.media || 0) - (a.media || 0)
    );

    jogadoresOrdenados.forEach((jogador, index) => {
      const timeIndex = index % numTimes;
      novosTimes[timeIndex].push(jogador);
    });

    setTimes(novosTimes);
    setDivisaoRealizada(true);
  };

  const handleConfirmDialog = async (remover: boolean) => {
    if (remover && jogadorCasual) {
      try {
        const db = getDatabase();
        const jogadorRef = ref(db, `jogadores/${jogadorCasual.id}`);
        await remove(jogadorRef);
        setSelecionados(prev => prev.filter(j => j.id !== jogadorCasual.id));
      } catch (error) {
        console.error("Erro ao remover jogador:", error);
      }
    }
    setShowConfirmDialog(false);
    setJogadorCasual(null);
  };

  return (
    <div className="container mx-auto mt-20 p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg shadow-md transition-colors duration-300">
      <h2 className="text-2xl font-bold text-center mb-4">Divisão de Times</h2>

      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
        <label className="text-gray-700 dark:text-gray-300">
          Número de Times:
          <input
            type="number"
            min="2"
            max="5"
            value={numTimes}
            onChange={(e) => setNumTimes(Number(e.target.value))}
            className="border border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white px-2 py-1 ml-2 rounded-lg"
          />
        </label>

        <label className="text-gray-700 dark:text-gray-300">
          Jogadores por Time:
          <input
            type="number"
            min="3"
            max="7"
            value={jogadoresPorTime}
            onChange={(e) => setJogadoresPorTime(Number(e.target.value))}
            className="border border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white px-2 py-1 ml-2 rounded-lg"
          />
        </label>

        <button 
          onClick={dividirTimes} 
          className="bg-black dark:bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition-colors duration-200"
        >
          Gerar Times
        </button>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Adicionar Jogador Casual
        </button>
      </div>

      {/* Lista de jogadores */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-6">
        {jogadoresOrdenados.map((jogador) => (
          <button
            key={jogador.id}
            onClick={() => toggleSelecionarJogador(jogador)}
            className={`px-4 py-2 rounded-lg text-center transition-colors duration-200 ${
              selecionados.some((j) => j.id === jogador.id)
                ? "bg-blue-500 dark:bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {jogador.nome}
          </button>
        ))}
      </div>

      {/* Exibição dos times gerados */}
      {divisaoRealizada && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {times.map((time, index) => (
            <div key={index} className="border border-gray-300 dark:border-gray-600 p-4 rounded-lg bg-gray-100 dark:bg-gray-800 transition-colors duration-300">
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Time {index + 1}</h3>
              <ul className="text-gray-800 dark:text-gray-300">
                {time.map((jogador) => (
                  <li key={jogador.id} className="flex justify-between items-center">
                    <span>{jogador.nome}</span>
                    {jogador.casual && (
                      <button
                        onClick={() => handleRemovePlayer(jogador)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remover
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <AddCasualPlayerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={async () => {
          await carregarJogadores();
          setDivisaoRealizada(false);
        }}
      />

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Jogador Casual Encontrado</AlertDialogTitle>
            <AlertDialogDescription>
              Deseja remover o jogador casual &quot;{jogadorCasual?.nome}&quot; da lista?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => handleConfirmDialog(false)}>
              Manter
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => handleConfirmDialog(true)}>
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DivisaoTimes; 