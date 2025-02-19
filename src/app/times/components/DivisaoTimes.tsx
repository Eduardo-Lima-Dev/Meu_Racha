import { useState } from "react";
import { Jogador } from "../../home/types";
import JogadorCard from "./JogadorCard";
import { calcularMedia } from "../../home/utils/calcularMedia";
import BotaoCompartilhar from "./BotaoCompartilhar";

interface DivisaoTimesProps {
  jogadores: Jogador[];
}

const P1 = 0.4;
const P2 = 0.4;
const P3 = 0.2;

const calcularPeso = (jogador: Jogador) => {
  return (
    (jogador.media * P1) +
    (jogador.gols * P2) +
    (jogador.assistencias * P3)
  );
};

const DivisaoTimes: React.FC<DivisaoTimesProps> = ({ jogadores }) => {
  const [selecionados, setSelecionados] = useState<Jogador[]>([]);
  const [numTimes, setNumTimes] = useState(3);
  const [jogadoresPorTime, setJogadoresPorTime] = useState(5);
  const [times, setTimes] = useState<Jogador[][]>([]);
  const [divisaoRealizada, setDivisaoRealizada] = useState(false);

  const jogadoresComMedia = jogadores.map((jogador) => ({
    ...jogador,
    media: calcularMedia(jogador.votos ?? []).media,
  }));

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

    const jogadoresOrdenados = [...selecionados]
      .map((jogador) => ({
        ...jogador,
        peso: calcularPeso(jogador),
      }))
      .sort((a, b) => b.peso - a.peso);

    const novosTimes: Jogador[][] = Array.from({ length: numTimes }, () => []);
    const pesosTimes = Array(numTimes).fill(0);

    jogadoresOrdenados.forEach((jogador) => {
      let menorPesoIndex = 0;
      for (let i = 1; i < numTimes; i++) {
        if (pesosTimes[i] < pesosTimes[menorPesoIndex]) {
          menorPesoIndex = i;
        }
      }
      novosTimes[menorPesoIndex].push(jogador);
      pesosTimes[menorPesoIndex] += jogador.peso;
    });

    setTimes(novosTimes);
    setDivisaoRealizada(true);
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-4">Divisão de Times</h2>

      {!divisaoRealizada && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Selecione os jogadores:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {jogadoresComMedia.map((jogador) => (
              <button
                key={jogador.id}
                className={`border rounded-lg p-2 transition-colors ${
                  selecionados.some((j) => j.id === jogador.id)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => toggleSelecionarJogador(jogador)}
              >
                {jogador.nome}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
        <label>
          Número de Times:
          <input
            type="number"
            min="2"
            max="5"
            value={numTimes}
            onChange={(e) => setNumTimes(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-2 py-1 ml-2"
          />
        </label>

        <label>
          Jogadores por Time:
          <input
            type="number"
            min="3"
            max="7"
            value={jogadoresPorTime}
            onChange={(e) => setJogadoresPorTime(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-2 py-1 ml-2"
          />
        </label>

        <button
          onClick={dividirTimes}
          className="bg-black text-white px-4 py-2 rounded-lg w-40"
        >
          Gerar Times
        </button>
      </div>

      {divisaoRealizada && (
        <>
          <div id="times-container" className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {times.map((time, index) => {
              const somaPeso = time.reduce((acc, jogador) => acc + calcularPeso(jogador), 0).toFixed(2);
              return (
                <div key={index} className="border p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-center flex justify-between">
                    Time {index + 1}
                    <span className="text-gray-600">⚖️ {somaPeso}</span>
                  </h3>
                  <div className="mt-2 space-y-2">
                    {time.map((jogador) => (
                      <JogadorCard key={jogador.id} jogador={jogador} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => {
                setDivisaoRealizada(false);
                setTimes([]);
              }}
              className="bg-red-500 text-white px-6 py-2 rounded-lg mt-4"
            >
              Refazer Divisão
            </button>
            <BotaoCompartilhar elementId="times-container" />
          </div>
        </>
      )}
    </div>
  );
};

export default DivisaoTimes;
