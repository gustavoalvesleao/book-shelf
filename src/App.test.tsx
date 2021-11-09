import React from "react";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";

import { buildLoginForm } from "test/test-utils";

import { handlers } from "./test/server-handlers";

import App from "./App";

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

describe("<App />", () => {
  describe("Given that I'm not authenticated", () => {
    const { username, password } = buildLoginForm();

    beforeEach(async () => {
      render(<App />);
      await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i));
    });

    describe("When I click in the register button", () => {
      beforeEach(() => {
        userEvent.click(screen.getByRole("button", { name: /register/i }));
      });

      test("then the register form is opened", () => {
        expect(
          screen.getByRole("heading", { name: "Register" })
        ).toBeInTheDocument();
      });

      describe("and type a username, password and submit ", () => {
        beforeEach(() => {
          userEvent.type(screen.getByLabelText(/username/i), username);
          userEvent.type(screen.getByLabelText(/password/i), password);
          userEvent.click(screen.getByRole("button", { name: /register/i }));
        });

        test(`should display login and display the user name on the screen`, async () => {
          await waitForElementToBeRemoved(() =>
            screen.getByLabelText(/loading/i)
          );

          expect(screen.getByText(username)).toBeInTheDocument();
        });
      });
    });
  });
});

describe("<App />", () => {
  describe("Given that I'm already authenticated", () => {
    beforeEach(async () => {
      window.localStorage.setItem("__auth_provider_token__", "test_token");
      render(<App />);
      await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i));
    });

    afterEach(async () => {
      window.localStorage.removeItem("__auth_provider_token__");
    });

    describe("When I click in the register button", () => {
      test(`should display the username test on the screen`, async () => {
        expect(screen.getByText("test")).toBeInTheDocument();
      });
    });
  });
});
