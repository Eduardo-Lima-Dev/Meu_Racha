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
      <DialogContent className="text-center">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center space-x-2">
            {icon === "alert" && <AlertTriangle className="text-red-500" />}
            <span>{title}</span>
          </DialogTitle>
        </DialogHeader>
        <p>{message}</p>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
