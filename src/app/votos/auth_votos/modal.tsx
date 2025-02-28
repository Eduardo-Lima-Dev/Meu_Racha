import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

interface ModalProps {
  title: string;
  message: string;
  icon: string;
  onClose: () => void; 
}

const Modal: React.FC<ModalProps> = ({ title, message, icon, onClose }) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 transition-colors duration-300">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center space-x-2 text-gray-900 dark:text-white">
            {icon === "alert" && <AlertTriangle className="text-red-500 dark:text-red-400" />}
            <span>{title}</span>
          </DialogTitle>
        </DialogHeader>
        <p className="text-gray-700 dark:text-gray-300">{message}</p>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
