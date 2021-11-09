import React from "react";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";

import { handlers } from "test/server-handlers";

import { buildLoginForm } from "test/test-utils";

import * as auth from "./auth-provider";

import UnauthenticatedApp from "./UnauthenticatedApp";

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

describe("<UnauthenticatedApp />", () => {
  describe("Given that I'm not Authenticated", () => {
    const { username, password } = buildLoginForm();
    const { login, register } = auth;

    beforeEach(() => {
      render(<UnauthenticatedApp login={login} register={register} />);
    });

    describe("When I click in the login button", () => {
      beforeEach(() => {
        userEvent.click(screen.getByRole("button", { name: /login/i }));
      });

      test("then the login form is opened", () => {
        expect(
          screen.getByRole("heading", { name: "Login" })
        ).toBeInTheDocument();
      });

      describe("and type only the username and submit ", () => {
        beforeEach(() => {
          userEvent.type(screen.getByLabelText(/username/i), username);
          userEvent.click(screen.getByRole("button", { name: /login/i }));
        });

        test(`should display error message password is required`, async () => {
          await waitForElementToBeRemoved(() =>
            screen.getByLabelText(/loading/i)
          );

          expect(screen.getByRole("alert").textContent).toMatchInlineSnapshot(
            `"There was an error: password required"`
          );
        });
      });

      describe("and type only the password and submit ", () => {
        beforeEach(() => {
          userEvent.type(screen.getByLabelText(/password/i), password);
          userEvent.click(screen.getByRole("button", { name: /login/i }));
        });

        test(`should display error message username is required`, async () => {
          await waitForElementToBeRemoved(() =>
            screen.getByLabelText(/loading/i)
          );

          expect(screen.getByRole("alert").textContent).toMatchInlineSnapshot(
            `"There was an error: username required"`
          );
        });
      });
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

      describe("and type only the username and submit ", () => {
        beforeEach(() => {
          userEvent.type(screen.getByLabelText(/username/i), username);
          userEvent.click(screen.getByRole("button", { name: /register/i }));
        });

        test(`should display error message password is required`, async () => {
          await waitForElementToBeRemoved(() =>
            screen.getByLabelText(/loading/i)
          );

          expect(screen.getByRole("alert").textContent).toMatchInlineSnapshot(
            `"There was an error: password required"`
          );
        });
      });

      describe("and type only the password and submit ", () => {
        beforeEach(() => {
          userEvent.type(screen.getByLabelText(/password/i), password);
          userEvent.click(screen.getByRole("button", { name: /register/i }));
        });

        test(`should display error message username is required`, async () => {
          await waitForElementToBeRemoved(() =>
            screen.getByLabelText(/loading/i)
          );

          expect(screen.getByRole("alert").textContent).toMatchInlineSnapshot(
            `"There was an error: username required"`
          );
        });
      });
    });
  });
});
