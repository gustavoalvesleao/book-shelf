import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import { FormData } from "components/LoginForm";
import { FullPageSpinner } from "components/Lib";

import { client } from "utils/api-client";
import { useAsync } from "utils/hooks";
import * as colors from "styles/colors";

import { User } from "utils/types";

import * as auth from "./auth-provider";

const AuthenticatedApp = React.lazy(async () => import("./AuthenticatedApp"));
const UnauthenticatedApp = React.lazy(
  async () => import("./UnauthenticatedApp")
);

async function getUser() {
  const token = await auth.getToken();
  if (token) {
    const data = await client("me", { token });
    return data.user;
  }
  return null;
}

function App() {
  const {
    data: user,
    error,
    isLoading,
    isSuccess,
    isIdle,
    isError,
    run,
    setData,
  } = useAsync<User | null>();

  React.useEffect(() => {
    run(getUser());
  }, [run]);

  const login = (form: FormData) =>
    auth.login(form).then((newUser) => setData(newUser));
  const register = (form: FormData) =>
    auth.register(form).then((newUser) => setData(newUser));
  const logout = () => {
    auth.logout();
    setData(null);
  };

  if (isLoading || isIdle) {
    return <FullPageSpinner />;
  }

  if (isError) {
    return (
      <div
        css={{
          color: colors.danger,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p>Uh oh.. There is a problem. Try refreshing the app.</p>
        <pre>{error?.message}</pre>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <React.Suspense fallback={<FullPageSpinner />}>
        {user ? (
          <Router>
            <AuthenticatedApp user={user} logout={logout} />
          </Router>
        ) : (
          <UnauthenticatedApp login={login} register={register} />
        )}
      </React.Suspense>
    );
  }

  return <p>👾You should not be seeing this. 👾</p>;
}

export default App;
