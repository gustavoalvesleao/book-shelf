/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line
import { jsx } from "@emotion/react";
import React from "react";
import { Routes, Route, Link, LinkProps, useMatch } from "react-router-dom";

import DiscoverBooksScreen from "screens/DiscoverBooks";
import NotFoundScreen from "screens/NotFound";
import BookScreen from "screens/Book";

import { User } from "utils/types";

import { Button } from "./components/Lib";

import * as mq from "./styles/media-queries";
import * as colors from "./styles/colors";

interface Props {
  user: User;
  logout: () => void;
}

function AuthenticatedApp({ user, logout }: Props) {
  return (
    <React.Fragment>
      <div
        css={{
          display: "flex",
          alignItems: "center",
          position: "absolute",
          top: "10px",
          right: "10px",
        }}
      >
        {user.username}
        <Button
          variant="secondary"
          css={{ marginLeft: "10px" }}
          onClick={logout}
        >
          Logout
        </Button>
      </div>
      <div
        css={{
          margin: "0 auto",
          padding: "4em 2em",
          maxWidth: "840px",
          width: "100%",
          display: "grid",
          gridGap: "1em",
          gridTemplateColumns: "1fr 3fr",
          [mq.small]: {
            gridTemplateColumns: "1fr",
            gridTemplateRows: "auto",
            width: "100%",
          },
        }}
      >
        <div css={{ position: "relative" }}>
          <Nav />
        </div>
        <main css={{ width: "100%" }}>
          <AppRoutes user={user} />
        </main>
      </div>
    </React.Fragment>
  );
}

function NavLink(props: Omit<LinkProps, "className" | "style">) {
  const { to } = props;
  const match = useMatch(to.toString());

  return (
    <Link
      css={[
        {
          display: "block",
          padding: "8px 15px 8px 10px",
          margin: "5px 0",
          width: "100%",
          height: "100%",
          color: colors.text,
          borderRadius: "2px",
          borderLeft: "5px solid transparent",
          ":hover": {
            color: colors.indigo,
            textDecoration: "none",
            background: colors.gray10,
          },
        },
        match
          ? {
              borderLeft: `5px solid ${colors.indigo}`,
              background: colors.gray10,
              ":hover": { background: colors.gray20 },
            }
          : null,
      ]}
      {...props}
    />
  );
}

function Nav() {
  return (
    <nav
      css={{
        position: "sticky",
        top: "4px",
        padding: "1em 1.5em",
        border: `1px solid ${colors.gray10}`,
        borderRadius: "3px",
        [mq.small]: {
          position: "static",
          top: "auto",
        },
      }}
    >
      <ul
        css={{
          listStyle: "none",
          padding: "0",
        }}
      >
        <li>
          <NavLink to="/discover">Discover</NavLink>
        </li>
      </ul>
    </nav>
  );
}

function AppRoutes({ user }: { user: User }) {
  return (
    <Routes>
      <Route path="/discover" element={<DiscoverBooksScreen user={user} />} />
      <Route path="/book/:bookId" element={<BookScreen user={user} />} />
      <Route path="*" element={<NotFoundScreen />} />
    </Routes>
  );
}

export default AuthenticatedApp;
