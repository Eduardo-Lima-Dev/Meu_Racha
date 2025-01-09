'use client';

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const ModalVotacao = ({ onClose }: { onClose: () => void }) => {
  const [naoMostrarMais, setNaoMostrarMais] = useState(false);

  const handleNaoMostrarMaisChange = () => {
    setNaoMostrarMais(!naoMostrarMais);
  };

  const handleOkClick = () => {
    if (naoMostrarMais) {
      localStorage.setItem("naoMostrarModalVotacao", "true");
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 space-y-4">
        <h2 className="text-lg font-bold">Atenção!</h2>
        <p className="text-sm text-gray-600">
          Por favor, vote em todos os jogadores antes de prosseguir. Ao clicar em &apos;Próximo&apos;, seu voto será salvo. 
        </p>
        <p>
          Certifique-se de revisar suas escolhas com atenção!
        </p>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="naoMostrarMais"
            checked={naoMostrarMais}
            onChange={handleNaoMostrarMaisChange}
          />
          <label htmlFor="naoMostrarMais" className="text-sm text-gray-600">
            Não mostrar mais esta caixa de diálogo
          </label>
        </div>
        <Button onClick={handleOkClick} className="w-full">
          OK
        </Button>
      </div>
    </div>
  );
};

export const useModalVotacao = () => {
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    const naoMostrar = localStorage.getItem("naoMostrarModalVotacao");
    if (!naoMostrar) {
      setMostrarModal(true);
    }
  }, []);

  const closeModal = () => setMostrarModal(false);

  return { mostrarModal, closeModal };
};

export default ModalVotacao;
