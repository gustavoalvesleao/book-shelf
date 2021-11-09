import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { buildLoginForm } from "test/test-utils";

import LoginForm from "./index";

test("submitting the form calls onSubmit with username and password", async () => {
  const handleSubmit = jest.fn().mockImplementation(() => Promise.resolve());

  render(<LoginForm onSubmit={handleSubmit} buttonText="Login" />);

  const { username, password } = buildLoginForm();

  userEvent.type(screen.getByLabelText(/username/i), username);
  userEvent.type(screen.getByLabelText(/password/i), password);
  userEvent.click(screen.getByRole("button", { name: /login/i }));
  expect(handleSubmit).toHaveBeenCalledWith({
    username,
    password,
  });
  expect(handleSubmit).toHaveBeenCalledTimes(1);
  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i));
});
