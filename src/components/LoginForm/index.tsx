/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line
import { jsx } from "@emotion/react";
import React from "react";

import { useAsync } from "utils/hooks";

import { Button, ErrorMessage, FormGroup, Input, Spinner } from "../Lib";

import { FormProps, LoginFormElements } from "./types";

function LoginForm({ onSubmit, buttonText }: FormProps) {
  const { isLoading, isError, error, run } = useAsync();

  const handleSubmit = (event: React.FormEvent<LoginFormElements>) => {
    event.preventDefault();
    const { username, password } = event.currentTarget.elements;

    run(
      onSubmit({
        username: username.value,
        password: password.value,
      })
    );
  };

  return (
    <form
      css={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        "> div": {
          margin: "10px auto",
          width: "100%",
          maxWidth: "300px",
        },
      }}
      onSubmit={handleSubmit}
    >
      <FormGroup>
        <label htmlFor="username">
          Username
          <Input id="username" type="text" autoComplete="off" />
        </label>
      </FormGroup>
      <FormGroup>
        <label htmlFor="password">
          Password
          <Input id="password" type="password" autoComplete="off" />
        </label>
      </FormGroup>
      <div>
        <Button type="submit">
          {buttonText}
          {isLoading ? <Spinner css={{ marginLeft: 5 }} /> : null}
        </Button>
      </div>
      {isError ? <ErrorMessage error={error} /> : null}
    </form>
  );
}

export * from "./types";
export default LoginForm;
