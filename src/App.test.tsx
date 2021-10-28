import React from "react";
import { render, screen } from "@testing-library/react";

import App from "./App";

describe("<App />", () => {
  describe("Given that I'm in the Home Page", () => {
    beforeEach(() => {
      render(<App />);
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
