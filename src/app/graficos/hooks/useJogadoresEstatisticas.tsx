import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { database } from "../../../config/firebaseConfig";
import { EstatisticasJogador } from "../types";
import { calcularMedia } from "../utils/calcularMedia";

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
            const quantidadeNotas = Object.keys(notas).length;
    
            const somatorioNotas = Object.values(notas).reduce(
              (acc: { [key: string]: number }, usuarioNotas: any) => {
                Object.keys(usuarioNotas).forEach((estatistica) => {
                  acc[estatistica] = (acc[estatistica] || 0) + usuarioNotas[estatistica];
                });
                return acc;
              },
              {}
            );
    
            return {
              id: key,
              nome: data[key].nome || "",
              fisico: calcularMedia(somatorioNotas["fisico"], quantidadeNotas),
              finalizacao: calcularMedia(somatorioNotas["finalizacao"], quantidadeNotas),
              drible: calcularMedia(somatorioNotas["drible"], quantidadeNotas),
              defesa: calcularMedia(somatorioNotas["defesa"], quantidadeNotas),
              passe: calcularMedia(somatorioNotas["passe"], quantidadeNotas),
              quantidadeNotas,
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
