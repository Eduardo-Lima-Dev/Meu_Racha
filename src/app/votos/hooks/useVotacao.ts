import { useEffect, useState } from "react";
import { ref, get, update } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { database } from "@/config/firebaseConfig";
import { validarVotacao } from "../utils/validarVotacao";
import { Jogador } from "@/app/dashboard/types";

const useVotacao = () => {
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [votos, setVotos] = useState<{ [key: string]: number }>({});
  const [votacaoLiberada, setVotacaoLiberada] = useState<boolean | null>(null);
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

  const [usuariosJaVotaram, setUsuariosJaVotaram] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchUsuariosJaVotaram = async () => {
      const dbRef = ref(database, "auth_votos/usuariosJaVotaram");
      try {
        const snapshot = await get(dbRef);
        setUsuariosJaVotaram(snapshot.exists() ? snapshot.val() : {});
      } catch (error) {
        console.error("Erro ao buscar usuários que já votaram:", error);
      }
    };
  
    if (votacaoLiberada) {
      fetchUsuariosJaVotaram();
    } else {
      setUsuariosJaVotaram({});
    }
  }, [votacaoLiberada]);

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
    const fetchConfiguracoes = async () => {
      const dbRef = ref(database, "auth_votos");
      try {
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          setVotacaoLiberada(data.liberado);

          if (!data.liberado) {
            await update(ref(database, "auth_votos"), { usuariosJaVotaram: {} });
          }
        }
      } catch (error) {
        console.error("Erro ao buscar configurações:", error);
        setVotacaoLiberada(false);
      }
    };
  
    fetchConfiguracoes();
  }, []);
  

  useEffect(() => {
    if (votacaoLiberada) {
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
          }
        } catch (error) {
          console.error("Erro ao buscar jogadores:", error);
        }
      };

      fetchJogadores();
    }
  }, [votacaoLiberada]);

  const handleVoteChange = (jogadorId: string, voto: number) => {
    setVotos((prevVotos) => ({
      ...prevVotos,
      [jogadorId]: voto,
    }));
  };

  const handleSubmit = async () => {
    const { isValid, message } = validarVotacao(votos, jogadores, user, usuariosJaVotaram);
  
    if (!isValid) {
      setModalConfig({
        title: "Erro",
        message,
        icon: "alert",
        visible: true,
      });
      return;
    }
  
    try {
      const updates: { [key: string]: { userId?: string; vote?: number }[] | boolean } = {};
  
      Object.keys(votos).forEach((jogadorId) => {
        const jogador = jogadores.find((j) => j.id === jogadorId);
        if (jogador) {
          const novosVotos = [
            ...(jogador.votos || []),
            { userId: user!.uid, vote: votos[jogadorId] },
          ];
          updates[`/jogadores/${jogadorId}/votos`] = novosVotos;
        }
      });
  
      updates[`/auth_votos/usuariosJaVotaram/${user!.uid}`] = true;
  
      await update(ref(database), updates);
  
      setModalConfig({
        title: "Sucesso",
        message: "Votação realizada com sucesso!",
        icon: "success",
        visible: true,
      });
    } catch (error) {
      console.error("Erro ao registrar votos:", error);
      setModalConfig({
        title: "Erro",
        message: "Erro ao registrar votos. Tente novamente.",
        icon: "alert",
        visible: true,
      });
    }
  };  

  const handleCloseModal = () => {
    setModalConfig((prev) => ({ ...prev, visible: false }));
    if (modalConfig.icon === "success") {
      router.push("/");
    }
  };

  return {
    jogadores,
    votos,
    votacaoLiberada,
    user,
    modalConfig,
    handleVoteChange,
    handleSubmit,
    handleCloseModal,
  };
};

export default useVotacao;