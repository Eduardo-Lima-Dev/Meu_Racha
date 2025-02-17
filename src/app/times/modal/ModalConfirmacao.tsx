interface ModalConfirmacaoProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onRefazerDivisao: () => void;
}

const ModalConfirmacao: React.FC<ModalConfirmacaoProps> = ({
  isOpen,
  onConfirm,
  onRefazerDivisao,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
        <h2 className="text-lg font-semibold mb-4">Mostrar Lista?</h2>
        <p className="mb-4">Deseja visualizar os times ou refazer a divisão?</p>
        <div className="flex justify-between gap-4">
          <button
            onClick={onConfirm}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full"
          >
            Sim, mostrar
          </button>
          <button
            onClick={onRefazerDivisao}
            className="bg-red-500 text-white px-4 py-2 rounded-lg w-full"
          >
            Não, refazer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacao;
