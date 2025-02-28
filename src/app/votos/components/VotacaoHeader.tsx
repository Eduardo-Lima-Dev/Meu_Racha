// src/components/VotacaoHeader.tsx
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const VotacaoHeader: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex items-center mb-4">
      <Button
        variant="ghost"
        className="mr-2 text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300"
        onClick={() => router.push("/")}
      >
        <ArrowLeft className="w-5 h-5" />
      </Button>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Votação de Jogadores
      </h1>
    </div>
  );
};

export default VotacaoHeader;
