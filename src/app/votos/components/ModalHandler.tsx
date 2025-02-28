// src/components/ModalHandler.tsx
import Modal from "../auth_votos/modal";

interface ModalHandlerProps {
  modalConfig: {
    title: string;
    message: string;
    icon: string;
    visible: boolean;
  };
  handleCloseModal: () => void;
}

const ModalHandler: React.FC<ModalHandlerProps> = ({ modalConfig, handleCloseModal }) => {
  return (
    <>
      {modalConfig.visible && (
        <Modal
          title={modalConfig.title}
          message={modalConfig.message}
          icon={modalConfig.icon}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default ModalHandler;
