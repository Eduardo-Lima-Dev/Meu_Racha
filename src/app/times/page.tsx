"use client";

import { FaArrowLeft } from "react-icons/fa";
import { useJogadores } from "../home/hooks/useJogadores";
import DivisaoTimes from "./components/DivisaoTimes";
import { useRouter } from "next/navigation";

const TimesPage = () => {
  const { jogadores, loading, error } = useJogadores();

  const router = useRouter();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Carregando jogadores...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <button
        onClick={() => router.back()}
        className="absolute top-6 left-6 text-gray-700 hover:text-gray-900 flex items-center gap-2"
      >
        <FaArrowLeft className="text-xl" />
        <span className="text-lg">Voltar</span>
      </button>
      {error && <p className="text-center text-red-500">{error}</p>}
      {!error && <DivisaoTimes jogadores={jogadores} />}
    </div>
  );
};

export default TimesPage;
