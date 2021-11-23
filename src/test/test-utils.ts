/* eslint-disable import/no-extraneous-dependencies */
import { build, fake } from "@jackfranklin/test-data-bot";
import { render } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";

import { User } from "utils/types";

import { FormData } from "../components/LoginForm";

const buildLoginForm = build<FormData>({
  fields: {
    username: fake((f) => f.internet.userName()),
    password: fake((f) => f.internet.password()),
  },
});

const buildUser = build<User>({
  fields: {
    id: fake((f) => f.random.uuid()),
    token: fake((f) => f.random.uuid()),
    username: fake((f) => f.internet.userName()),
  },
});

const renderWithRouter = (ui: React.ReactElement, { route = "/" } = {}) => {
  window.history.pushState({}, "Test page", route);

  return render(ui, { wrapper: BrowserRouter });
};

export { buildLoginForm, buildUser, renderWithRouter };
