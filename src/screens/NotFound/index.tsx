/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line
import { jsx } from "@emotion/react";

import { Link } from "components/Lib";

function NotFoundScreen() {
  return (
    <div
      css={{
        height: "100%",
        display: "grid",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      Sorry... nothing here. <Link to="/discover">Go Home.</Link>
    </div>
  );
}

export default NotFoundScreen;
