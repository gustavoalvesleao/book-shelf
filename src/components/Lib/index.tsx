/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line
import { jsx, keyframes } from "@emotion/react";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

import { Dialog as ReachDialog } from "@reach/dialog";
import styled from "@emotion/styled/macro";
import { FaSpinner } from "react-icons/fa";

import * as colors from "styles/colors";
import * as mq from "styles/media-queries";

const spin = keyframes({
  "0%": { transform: "rotate(0deg)" },
  "100%": { transform: "rotate(360deg)" },
});

const buttonVariants = {
  primary: {
    background: colors.indigo,
    color: colors.base,
  },
  secondary: {
    background: colors.gray,
    color: colors.text,
  },
};

const Link = styled(RouterLink)({
  color: colors.indigo,
  ":hover": {
    color: colors.indigoDarken10,
    textDecoration: "underline",
  },
});

const BookListUL = styled.ul({
  listStyle: "none",
  padding: "0",
  display: "grid",
  gridTemplateRows: "repeat(auto-fill, minmax(100px, 1fr))",
  gridGap: "1em",
});

const Spinner = styled(FaSpinner)({
  animation: `${spin} 1s linear infinite`,
});

Spinner.defaultProps = { "aria-label": "loading" };

const errorMessageVariants = {
  stacked: { display: "block" },
  inline: { display: "inline-block" },
};

function ErrorMessage({
  error,
  variant = "stacked",
  ...props
}: {
  error: Error | null | undefined;
  variant?: keyof typeof errorMessageVariants;
}) {
  return (
    <div
      role="alert"
      css={[{ color: colors.danger }, errorMessageVariants[variant]]}
      {...props}
    >
      <span>There was an error: </span>
      <pre
        css={[
          { whiteSpace: "break-spaces", margin: "0", marginBottom: -5 },
          errorMessageVariants[variant],
        ]}
      >
        {error?.message}
      </pre>
    </div>
  );
}

function FullPageSpinner() {
  return (
    <div
      css={{
        fontSize: "4em",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Spinner />
    </div>
  );
}

const Button = styled.button(
  {
    padding: "10px 15px",
    border: "0",
    lineHeight: "1",
    borderRadius: "3px",
    cursor: "pointer",
  },
  ({ variant = "primary" }: { variant?: keyof typeof buttonVariants }) =>
    buttonVariants[variant]
);

const Input = styled.input({
  borderRadius: "3px",
  border: `1px solid ${colors.gray10}`,
  background: "#f1f2f7",
  padding: "8px 12px",
});

const CircleButton = styled.button({
  borderRadius: "30px",
  padding: "0",
  width: "40px",
  height: "40px",
  lineHeight: "1",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "white",
  color: "#434449",
  border: `1px solid ${colors.gray10}`,
  cursor: "pointer",
});

const Dialog = styled(ReachDialog)({
  maxWidth: "450px",
  borderRadius: "3px",
  paddingBottom: "3.5em",
  boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.2)",
  margin: "20vh auto",
  [mq.small]: {
    width: "100%",
    margin: "10vh auto",
  },
});

const FormGroup = styled.div({
  display: "flex",
  flexDirection: "column",
});

export {
  Button,
  Input,
  CircleButton,
  Dialog,
  FormGroup,
  Spinner,
  BookListUL,
  ErrorMessage,
  FullPageSpinner,
  Link,
};
