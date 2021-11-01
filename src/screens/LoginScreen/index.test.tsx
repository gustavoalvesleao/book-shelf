import React from "react";
import { render, screen } from "@testing-library/react";

import LoginScreen from "./index";

describe("<LoginScreen />", () => {
  describe("Given that I'm in the Loggin Screen", () => {
    beforeEach(() => {
      render(<LoginScreen />);
    });

    test("The title, and Login and Register buttons are present", () => {
      const title = screen.getByRole("heading", { name: /bookshelf/i });
      const logginButton = screen.getByRole("button", { name: /login/i });
      const registerButton = screen.getByRole("button", { name: /register/i });
      expect(title).toBeInTheDocument();
      expect(logginButton).toBeInTheDocument();
      expect(registerButton).toBeInTheDocument();
    });

    test("The title, and Login and Register buttons have the correct labels", () => {
      const title = screen.getByRole("heading", { name: /bookshelf/i });
      const logginButton = screen.getByRole("button", { name: /login/i });
      const registerButton = screen.getByRole("button", { name: /register/i });
      expect(title).toHaveTextContent("Bookshelf");
      expect(logginButton).toHaveTextContent("Login");
      expect(registerButton).toHaveTextContent("Register");
    });
  });
});
