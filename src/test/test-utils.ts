/* eslint-disable import/no-extraneous-dependencies */
import { build, fake } from "@jackfranklin/test-data-bot";

import { FormData } from "../components/LoginForm";

const buildLoginForm = build<FormData>({
  fields: {
    username: fake((f) => f.internet.userName()),
    password: fake((f) => f.internet.password()),
  },
});

export { buildLoginForm };
