"use client";

import { useState, useEffect } from "react";
import { ref, push, update, onValue, remove } from "firebase/database";
import { database } from "../../config/firebaseConfig";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { ChevronDown, LogOut } from "lucide-react"; // Ícone de logout e seta
import Link from "next/link"; // Importa o Link para navegação

const AdminDashboard = () => {
  const [nome, setNome] = useState("");
  const [assistencias, setAssistencias] = useState(0);
  const [gols, setGols] = useState(0);
  const [mensagem, setMensagem] = useState("");
  const [jogadores, setJogadores] = useState<
    {
      id: string;
      nome: string;
      assistencias: number;
      gols: number;
      votos: { userId: string; vote: number }[];
    }[]
  >([]);
  const [editStats, setEditStats] = useState<{ [key: string]: boolean }>({});
  const [modifiedJogadores, setModifiedJogadores] = useState<{ [key: string]: { assistencias: number; gols: number } }>({});

  useEffect(() => {
    const jogadoresRef = ref(database, "jogadores");
    onValue(jogadoresRef, (snapshot) => {
      const data = snapshot.val();
      const jogadoresList = data
        ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
        : [];
      setJogadores(jogadoresList);
    });
  }, []);

  const handleAddJogador = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const jogadoresRef = ref(database, "jogadores");
      await push(jogadoresRef, {
        nome,
        assistencias,
        gols,
        votos: [],
      });
      setMensagem("Jogador adicionado com sucesso!");
      setNome("");
      setAssistencias(0);
      setGols(0);
    } catch (error) {
      console.error("Erro ao adicionar jogador:", error);
      setMensagem("Erro ao adicionar jogador. Tente novamente.");
    }
  };

  const handleToggleStats = (id: string) => {
    setEditStats((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleUpdateJogador = (id: string, assistencias: number, gols: number) => {
    setModifiedJogadores((prev) => ({
      ...prev,
      [id]: { assistencias, gols },
    }));
  };

  const handleSaveUpdates = async () => {
    try {
      const updates = Object.keys(modifiedJogadores).map(async (id) => {
        const jogadorRef = ref(database, `jogadores/${id}`);
        await update(jogadorRef, modifiedJogadores[id]);
      });
      await Promise.all(updates);
      setMensagem("Estatísticas dos jogadores atualizadas com sucesso!");
      setModifiedJogadores({});
    } catch (error) {
      console.error("Erro ao atualizar jogadores:", error);
      setMensagem("Erro ao atualizar jogadores. Tente novamente.");
    }
  };

  const handleClearJogadores = async () => {
    try {
      const jogadoresRef = ref(database, "jogadores");
      await remove(jogadoresRef);
      setMensagem("Todos os jogadores foram removidos com sucesso!");
    } catch (error) {
      console.error("Erro ao remover jogadores:", error);
      setMensagem("Erro ao remover jogadores. Tente novamente.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* Cabeçalho com fundo e opções de Logout e Home */}
      <header className="flex justify-between w-full max-w-md mb-4 p-4 bg-gray-800 text-white rounded-lg">
        <Link href="/" passHref>
          <Button variant="ghost" className="text-lg text-white">
            Home
          </Button>
        </Link>
        <Button variant="ghost" className="text-lg text-red-500 flex items-center" onClick={() => {/* Função de logout aqui */}}>
          <LogOut className="mr-1" /> Logout
        </Button>
      </header>

      <Card className="w-full max-w-md mb-8">
        <CardHeader>
          <CardTitle>Adicionar Novo Jogador</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddJogador} className="space-y-4">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium">
                Nome do Jogador
              </label>
              <Input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="assistencias" className="block text-sm font-medium">
                Assistências
              </label>
              <Input
                id="assistencias"
                type="number"
                value={assistencias}
                onChange={(e) => setAssistencias(Number(e.target.value))}
                required
              />
            </div>
            <div>
              <label htmlFor="gols" className="block text-sm font-medium">
                Gols
              </label>
              <Input
                id="gols"
                type="number"
                value={gols}
                onChange={(e) => setGols(Number(e.target.value))}
                required
              />
            </div>
            {mensagem && <p className="text-green-500 text-sm">{mensagem}</p>}
            <Button type="submit" className="w-full">
              Adicionar Jogador
            </Button>
          </form>
          <Button onClick={handleClearJogadores} className="w-full mt-4" variant="destructive">
            Limpar Jogadores
          </Button>
          <Button onClick={handleSaveUpdates} className="w-full mt-4 bg-blue-500 text-white">
            Atualizar Jogadores
          </Button>
        </CardContent>
      </Card>
      
      <div className="w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Jogadores</h2>
        {jogadores.map((jogador) => (
          <Card key={jogador.id} className="mb-4">
            <CardHeader className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CardTitle>{jogador.nome}</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => handleToggleStats(jogador.id)}>
                  <ChevronDown />
                </Button>
              </div>
            </CardHeader>
            {editStats[jogador.id] && (
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <label htmlFor={`assistencias-${jogador.id}`} className="block text-sm font-medium">
                      Assistências
                    </label>
                    <Input
                      id={`assistencias-${jogador.id}`}
                      type="number"
                      value={modifiedJogadores[jogador.id]?.assistencias ?? jogador.assistencias}
                      onChange={(e) =>
                        handleUpdateJogador(jogador.id, Number(e.target.value), jogador.gols)
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor={`gols-${jogador.id}`} className="block text-sm font-medium">
                      Gols
                    </label>
                    <Input
                      id={`gols-${jogador.id}`}
                      type="number"
                      value={modifiedJogadores[jogador.id]?.gols ?? jogador.gols}
                      onChange={(e) =>
                        handleUpdateJogador(jogador.id, jogador.assistencias, Number(e.target.value))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
