import React from "react";
import { WindowCard } from "./WindowCard";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  icon = "terminal",
  children,
  maxWidth = "max-w-xl",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1D1E24]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className={`w-full ${maxWidth} relative animate-in zoom-in-95 duration-150`}>
        <WindowCard
          title={title}
          icon={icon}
          actions={
            <button
              onClick={onClose}
              className="px-2 py-0.5 bg-[#FF4D6D] text-white border-2 border-[#1D1E24] font-headline text-[10px] uppercase font-black shadow-[1.5px_1.5px_0px_#1D1E24] hover:bg-[#FF6584]"
            >
              ESC
            </button>
          }
        >
          {children}
        </WindowCard>
      </div>
    </div>
  );
};

