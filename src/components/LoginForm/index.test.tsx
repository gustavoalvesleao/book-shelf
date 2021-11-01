import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { build, fake } from "@jackfranklin/test-data-bot";

import LoginForm, { FormData } from "./index";

const buildLoginForm = build<FormData>({
  fields: {
    username: fake((f) => f.internet.userName()),
    password: fake((f) => f.internet.password()),
  },
});

test("submitting the form calls onSubmit with username and password", () => {
  const handleSubmit = jest.fn();
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
});
