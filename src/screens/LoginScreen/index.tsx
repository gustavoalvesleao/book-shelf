/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line
import { jsx } from "@emotion/react";
import React from "react";
import "bootstrap/dist/css/bootstrap-reboot.css";
import "@reach/dialog/styles.css";

import { Logo } from "components/Logo";
import LoginForm, { FormData } from "components/LoginForm";
import { Button } from "components/Lib";
import { Modal, ModalContents, ModalOpenButton } from "components/Modal";

function LoginScreen() {
  const login = (formData: FormData) => {
    // eslint-disable-next-line
    console.log(formData);
  };

  const register = (formData: FormData) => {
    // eslint-disable-next-line
    console.log(formData);
  };

  return (
    <div
      css={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <Logo width="80" height="80" />
      <h1>Bookshelf</h1>
      <div
        css={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gridGap: "0.75rem",
        }}
      >
        <Modal>
          <ModalOpenButton>
            <Button>Login</Button>
          </ModalOpenButton>
          <ModalContents aria-label="Login form" title="Login">
            <LoginForm onSubmit={login} buttonText="Login" />
          </ModalContents>
        </Modal>

        <Modal>
          <ModalOpenButton>
            <Button variant="secondary">Register</Button>
          </ModalOpenButton>
          <ModalContents aria-label="Registration form" title="Register">
            <LoginForm onSubmit={register} buttonText="Register" />
          </ModalContents>
        </Modal>
      </div>
    </div>
  );
}

export default LoginScreen;
