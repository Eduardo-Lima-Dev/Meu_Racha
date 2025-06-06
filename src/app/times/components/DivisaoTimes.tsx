import { useState, useEffect } from "react";
import { Jogador } from "../../home/types";
import { AddCasualPlayerModal } from "../../home/components/AddCasualPlayerModal";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getDatabase, ref, get } from "firebase/database";

interface DivisaoTimesProps {
  jogadores: Jogador[];
}

const P1 = 0.4;
const P2 = 0.4;
const P3 = 0.2;

// Matriz de complementaridade entre habilidades
const complementaridade = {
  media: { assistencias: 0.7, gols: 0.6 },
  gols: { media: 0.6, assistencias: 0.8 },
  assistencias: { media: 0.7, gols: 0.8 },
};

const calcularPeso = (jogador: Jogador) => {
  return (
    jogador.media * P1 +
    jogador.gols * P2 +
    jogador.assistencias * P3
  );
};

const calcularComplementaridade = (jogadorA: Jogador, jogadorB: Jogador) => {
  return (
    Math.abs(jogadorA.media - jogadorB.media) * complementaridade.media.assistencias +
    Math.abs(jogadorA.gols - jogadorB.gols) * complementaridade.gols.assistencias +
    Math.abs(jogadorA.assistencias - jogadorB.assistencias) * complementaridade.assistencias.gols
  );
};

// Algoritmo Genético: Geração inicial aleatória de times
const gerarTimesIniciais = (jogadores: Jogador[], numTimes: number) => {
  const times: Jogador[][] = Array.from({ length: numTimes }, () => []);
  const shuffle = [...jogadores].sort(() => Math.random() - 0.5);

  shuffle.forEach((jogador, index) => {
    times[index % numTimes].push(jogador);
  });

  return times;
};

// Avaliação da qualidade dos times
const avaliarTimes = (times: Jogador[][]) => {
  return times.map((time) => {
    const totalPeso = time.reduce((acc, jogador) => acc + calcularPeso(jogador), 0);
    const complementaridadeTotal = time.reduce((acc, jogador, i, arr) => {
      if (i === 0) return acc;
      return acc + calcularComplementaridade(jogador, arr[i - 1]);
    }, 0);

    return {
      peso: totalPeso,
      complementaridade: complementaridadeTotal,
    };
  });
};

// Crossover (troca de jogadores entre times)
const crossover = (times: Jogador[][]) => {
  const novoTime = [...times];

  for (let i = 0; i < times.length - 1; i += 2) {
    const [time1, time2] = [times[i], times[i + 1]];
    const swapIndex = Math.floor(Math.random() * time1.length);
    
    [time1[swapIndex], time2[swapIndex]] = [time2[swapIndex], time1[swapIndex]];
  }

  return novoTime;
};

// Mutação (troca aleatória de jogadores entre times)
const mutacao = (times: Jogador[][], taxaMutacao: number) => {
  const novosTimes = [...times];

  if (Math.random() < taxaMutacao) {
    const [idx1, idx2] = [Math.floor(Math.random() * times.length), Math.floor(Math.random() * times.length)];
    const [jog1, jog2] = [novosTimes[idx1].pop(), novosTimes[idx2].pop()];
    
    if (jog1 && jog2) {
      novosTimes[idx1].push(jog2);
      novosTimes[idx2].push(jog1);
    }
  }

  return novosTimes;
};

// Função principal que otimiza a divisão dos times
const dividirTimesOtimizado = (jogadores: Jogador[], numTimes: number, maxIteracoes: number) => {
  let times = gerarTimesIniciais(jogadores, numTimes);
  let melhorTime = avaliarTimes(times);
  let melhorPontuacao = melhorTime.reduce((acc, t) => acc + t.peso, 0);

  for (let i = 0; i < maxIteracoes; i++) {
    let novosTimes = crossover(times);
    novosTimes = mutacao(novosTimes, 0.3);
    
    const novaAvaliacao = avaliarTimes(novosTimes);
    const novaPontuacao = novaAvaliacao.reduce((acc, t) => acc + t.peso, 0);

    if (novaPontuacao > melhorPontuacao) {
      melhorTime = novaAvaliacao;
      melhorPontuacao = novaPontuacao;
      times = novosTimes;
    }
  }

  return times;
};

const DivisaoTimes: React.FC<DivisaoTimesProps> = ({ jogadores }) => {
  const [selecionados, setSelecionados] = useState<Jogador[]>([]);
  const [numTimes, setNumTimes] = useState(3);
  const [jogadoresPorTime, setJogadoresPorTime] = useState(5);
  const [times, setTimes] = useState<Jogador[][]>([]);
  const [divisaoRealizada, setDivisaoRealizada] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const carregarJogadores = async () => {
    try {
      const db = getDatabase();
      const jogadoresRef = ref(db, "jogadores");
      const snapshot = await get(jogadoresRef);
      const data = snapshot.val();
      if (data) {
        const jogadoresData = Object.entries(data).map(([id, jogador]: [string, any]) => ({
          id,
          ...jogador
        })) as Jogador[];
        
        // Mantém os jogadores selecionados e adiciona o novo jogador casual
        setSelecionados(prev => {
          const prevIds = new Set(prev.map(j => j.id));
          const novosJogadores = jogadoresData.filter(j => !prevIds.has(j.id) && j.casual);
          const jogadoresAtualizados = [...prev, ...novosJogadores];
          return jogadoresAtualizados;
        });
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

    const novosTimes = dividirTimesOtimizado(selecionados, numTimes, 1000);

    setTimes(novosTimes);
    setDivisaoRealizada(true);
  };

  return (
    <div className="container mx-auto mt-20 p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg shadow-md transition-colors duration-300">
      <h2 className="text-2xl font-bold text-center mb-4">Divisão de Times (Otimizada)</h2>

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
    </div>
  );
};

export default DivisaoTimes;