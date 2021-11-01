import React from "react";
import { render, screen, within } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import { Modal, ModalOpenButton, ModalContents } from "./index";

describe("<Modal />", () => {
  describe("Given that I have a modal in the screen", () => {
    const label = "Modal Label";
    const title = "Modal Title";
    beforeEach(() => {
      render(
        <Modal>
          <ModalOpenButton>
            <button type="button">Open</button>
          </ModalOpenButton>
          <ModalContents aria-label={label} title={title}>
            <div>Modal Content</div>
          </ModalContents>
        </Modal>
      );
      userEvent.click(screen.getByRole("button", { name: "Open" }));
    });

    describe("When I have clicked in the Open button", () => {
      test("The modal will be opened, with the correct aria-label, title and content", () => {
        const modal = screen.getByRole("dialog");
        expect(modal).toHaveAttribute("aria-label", label);

        const inModal = within(modal);
        expect(
          inModal.getByRole("heading", { name: title })
        ).toBeInTheDocument();
        expect(inModal.getByText("Modal Content")).toBeInTheDocument();
      });
    });

    describe("When I have clicked in the x button", () => {
      beforeEach(() => {
        userEvent.click(screen.getByText(/×/i));
      });
      test("The modal will be closed", () => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });
  });
});
