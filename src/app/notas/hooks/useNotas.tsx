import { useEffect, useState } from "react";
import { ref, get, update } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { database } from "@/config/firebaseConfig";
import { Jogador } from "@/app/dashboard/types";

const useNotas = () => {
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [notas, setNotas] = useState<{ [key: string]: { [key: string]: number } }>({});
  const [user, setUser] = useState<{ uid: string } | null>(null);
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    message: string;
    icon: string;
    visible: boolean;
  }>({
    title: "",
    message: "",
    icon: "",
    visible: false,
  });
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const fetchJogadores = async () => {
      const dbRef = ref(database, "jogadores");
      try {
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const listaJogadores = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setJogadores(listaJogadores);

          const inicialNotas: { [key: string]: { [key: string]: number } } = {};
          listaJogadores.forEach((jogador) => {
            inicialNotas[jogador.id] = {
              fisico: 0,
              finalizacao: 0,
              drible: 0,
              defesa: 0,
              passe: 0,
            };
          });
          setNotas(inicialNotas);
        }
      } catch (error) {
        console.error("Erro ao buscar jogadores:", error);
      }
    };

    fetchJogadores();
  }, []);

  const handleNotaChange = (jogadorId: string, estatistica: string, nota: number) => {
    const notaFinal = Math.min(nota, 10);
    setNotas((prevNotas) => ({
      ...prevNotas,
      [jogadorId]: {
        ...prevNotas[jogadorId],
        [estatistica]: notaFinal,
      },
    }));
  };
  
  const handleSubmit = async () => {
    if (!user) {
      setModalConfig({
        title: "Erro",
        message: "Você precisa estar logado para salvar as notas.",
        icon: "alert",
        visible: true,
      });
      return;
    }
  
    try {
      const updates: { [key: string]: { [key: string]: number } } = {};
  
      Object.keys(notas).forEach((jogadorId) => {
        const notaAtual = notas[jogadorId];

        if (!user.uid || Object.keys(notaAtual).length === 0) return;
  
        const jogadorNotasPath = `/jogadores/${jogadorId}/notas/${user.uid}`;
        updates[jogadorNotasPath] = notaAtual; 
      });
  
      await update(ref(database), updates); 
  
      setModalConfig({
        title: "Sucesso",
        message: "Notas salvas com sucesso!",
        icon: "success",
        visible: true,
      });
    } catch (error) {
      console.error("Erro ao salvar notas:", error);
      setModalConfig({
        title: "Erro",
        message: "Erro ao salvar notas. Tente novamente.",
        icon: "alert",
        visible: true,
      });
    }
  };  

  const handleCloseModal = () => {
    setModalConfig((prev) => ({ ...prev, visible: false }));
    if (modalConfig.icon === "success") {
      router.push("/graficos");
    }
  };
  

  return {
    jogadores,
    notas,
    user,
    modalConfig,
    handleNotaChange,
    handleSubmit,
    handleCloseModal,
  };
};

export default useNotas;
