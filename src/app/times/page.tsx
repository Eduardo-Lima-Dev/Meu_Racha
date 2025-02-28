"use client";

import { FaArrowLeft } from "react-icons/fa";
import { useJogadores } from "../home/hooks/useJogadores";
import DivisaoTimes from "./components/DivisaoTimes";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ui/themeToggle";

const TimesPage = () => {
  const { jogadores, loading, error } = useJogadores();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900">
        <p className="text-lg font-semibold text-gray-900 dark:text-white">Carregando jogadores...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <div className="container mx-auto p-6">
        <button
          onClick={() => router.back()}
          className="absolute top-6 left-6 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center gap-2"
        >
          <FaArrowLeft className="text-xl" />
          <span className="text-lg">Voltar</span>
        </button>

        {error && <p className="text-center text-red-500 dark:text-red-400">{error}</p>}
        {!error && <DivisaoTimes jogadores={jogadores} />}
      </div>
      <ThemeToggle />
    </div>
  );
};

export default TimesPage;
