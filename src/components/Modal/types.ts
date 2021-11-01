export interface ModalState {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export interface ModalProps {
  children: React.ReactNode;
}
