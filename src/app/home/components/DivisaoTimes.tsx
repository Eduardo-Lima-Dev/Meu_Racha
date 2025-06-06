import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getFirestore, collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { AddCasualPlayerModal } from "./AddCasualPlayerModal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface Jogador {
  id: string;
  nome: string;
  estrelas: number;
  votos: any[];
  casual?: boolean;
}

export function DivisaoTimes() {
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [times, setTimes] = useState<Jogador[][]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [jogadorToRemove, setJogadorToRemove] = useState<Jogador | null>(null);

  useEffect(() => {
    carregarJogadores();
  }, []);

  const carregarJogadores = async () => {
    setLoading(true);
    try {
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, "jogadores"));
      const jogadoresData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Jogador[];
      setJogadores(jogadoresData);
    } catch (error) {
      console.error("Erro ao carregar jogadores:", error);
    } finally {
      setLoading(false);
    }
  };

  const dividirTimes = () => {
    const jogadoresOrdenados = [...jogadores].sort((a, b) => b.estrelas - a.estrelas);
    const numTimes = Math.ceil(jogadoresOrdenados.length / 5);
    const novosTimes: Jogador[][] = Array(numTimes).fill(null).map(() => []);

    jogadoresOrdenados.forEach((jogador, index) => {
      const timeIndex = index % numTimes;
      novosTimes[timeIndex].push(jogador);
    });

    setTimes(novosTimes);
  };

  const handleRemovePlayer = async (jogador: Jogador) => {
    setJogadorToRemove(jogador);
    setShowConfirmDialog(true);
  };

  const confirmRemovePlayer = async () => {
    if (!jogadorToRemove) return;

    try {
      const db = getFirestore();
      await deleteDoc(doc(db, "jogadores", jogadorToRemove.id));
      await carregarJogadores();
      setTimes([]);
    } catch (error) {
      console.error("Erro ao remover jogador:", error);
    } finally {
      setShowConfirmDialog(false);
      setJogadorToRemove(null);
    }
  };

  if (loading) {
    return <div className="text-center">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Divisão de Times</h2>
        <div className="space-x-2">
          <Button onClick={() => setIsModalOpen(true)}>
            Adicionar Jogador Casual
          </Button>
          <Button onClick={dividirTimes} disabled={jogadores.length === 0}>
            Dividir Times
          </Button>
        </div>
      </div>

      {times.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {times.map((time, index) => (
            <Card key={index} className="p-4">
              <h3 className="text-lg font-semibold mb-2">Time {index + 1}</h3>
              <ul className="space-y-2">
                {time.map((jogador) => (
                  <li key={jogador.id} className="flex justify-between items-center">
                    <span>{jogador.nome} ({jogador.estrelas} ⭐)</span>
                    {jogador.casual && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemovePlayer(jogador)}
                      >
                        Remover
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          Clique em "Dividir Times" para gerar a divisão
        </div>
      )}

      <AddCasualPlayerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={carregarJogadores}
      />

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Jogador</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este jogador? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemovePlayer}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 