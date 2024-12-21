import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { database } from "../../../config/firebaseConfig";
import { EstatisticasJogador } from "../types";

export const useJogadoresEstatisticas = () => {
  const [jogadores, setJogadores] = useState<EstatisticasJogador[]>([]);
  const [jogadorSelecionado, setJogadorSelecionado] = useState<EstatisticasJogador | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJogadores = async () => {
      setLoading(true);
      setError("");

      try {
        const dbRef = ref(database, "jogadores");
        const snapshot = await get(dbRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const listaJogadores: EstatisticasJogador[] = Object.keys(data).map((key) => {
            const notas = data[key].notas || {};
            return {
              id: key,
              nome: data[key].nome || "",
              fisico: notas.fisico || 0,
              finalizacao: notas.finalizacao || 0,
              drible: notas.drible || 0,
              defesa: notas.defesa || 0,
              passe: notas.passe || 0,
              quantidadeNotas: Object.keys(notas).length,
            };
          });

          setJogadores(listaJogadores);

          if (listaJogadores.length > 0) {
            setJogadorSelecionado(listaJogadores[0]);
          }
        } else {
          setError("Nenhum jogador encontrado.");
        }
      } catch (error) {
        console.error("Erro ao buscar jogadores:", error);
        setError("Erro ao carregar jogadores. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchJogadores();
  }, []);

  const selecionarJogador = (id: string) => {
    const jogador = jogadores.find((j) => j.id === id) || null;
        setJogadorSelecionado(jogador);
      };
    
      return {
        jogadores,
        jogadorSelecionado,
        loading,
        error,
        selecionarJogador,
      };
    };
