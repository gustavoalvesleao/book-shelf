/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line
import { jsx } from "@emotion/react";
import * as React from "react";
import VisuallyHidden from "@reach/visually-hidden";
import { DialogProps } from "@reach/dialog";

import { Dialog, CircleButton } from "../Lib";

interface ModalState {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

interface ModalProps {
  children: React.ReactNode;
}

function callAll<Args extends Array<unknown>>(
  ...fns: Array<((...args: Args) => unknown) | undefined>
) {
  return (...args: Args) => fns.forEach((fn) => fn?.(...args));
}

const ModalContext = React.createContext<ModalState | undefined>(undefined);

function Modal(props: ModalProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return <ModalContext.Provider value={{ isOpen, setIsOpen }} {...props} />;
}

function ModalDismissButton({ children }: { children: React.ReactNode }) {
  // eslint-disable-next-line
  const { setIsOpen } = React.useContext(ModalContext)!;
  if (React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: callAll(() => setIsOpen(false), children.props.onClick),
    });
  }
  return null;
}

function ModalOpenButton({ children }: { children: React.ReactNode }) {
  // eslint-disable-next-line
  const { setIsOpen } = React.useContext(ModalContext)!;
  if (React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: callAll(() => setIsOpen(true), children.props.onClick),
    });
  }
  return null;
}

function ModalContentsBase(props: DialogProps) {
  // eslint-disable-next-line
  const { isOpen, setIsOpen } = React.useContext(ModalContext)!;
  return (
    <Dialog isOpen={isOpen} onDismiss={() => setIsOpen(false)} {...props} />
  );
}

function ModalContents({
  title,
  children,
  ...props
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <ModalContentsBase {...props}>
      <div css={{ display: "flex", justifyContent: "flex-end" }}>
        <ModalDismissButton>
          <CircleButton>
            <VisuallyHidden>Close</VisuallyHidden>
            <span aria-hidden>×</span>
          </CircleButton>
        </ModalDismissButton>
      </div>
      <h3 css={{ textAlign: "center", fontSize: "2em" }}>{title}</h3>
      {children}
    </ModalContentsBase>
  );
}

export { Modal, ModalDismissButton, ModalOpenButton, ModalContents };
