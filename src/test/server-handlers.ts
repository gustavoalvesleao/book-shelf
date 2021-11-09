import { rest } from "msw";

interface AuthBody {
  username: string;
  password: string;
}

interface MeBody {
  token: string;
}

interface MeResponse {
  user: {
    id: string;
    token: string;
    username: string;
  };
}

interface AuthResponse {
  id?: string;
  token?: string;
  username?: string;
  message?: string;
}

interface RegisterResponse {
  user?: {
    token: string;
    username: string;
  };
  message?: string;
}

const delay = process.env.NODE_ENV === "test" ? 0 : 1500;
const loginURL = "https://auth-provider.jk/auth/login";
const registerURL = "https://auth-provider.jk/auth/register";
const meURL = "https://bookshelf.jk/api/me";

const handlers = [
  rest.post<AuthBody, AuthResponse>(loginURL, async (req, res, ctx) => {
    if (!req.body.password) {
      return res(
        ctx.delay(delay),
        ctx.status(400),
        ctx.json({ message: "password required" })
      );
    }
    if (!req.body.username) {
      return res(
        ctx.delay(delay),
        ctx.status(400),
        ctx.json({ message: "username required" })
      );
    }
    return res(ctx.delay(delay), ctx.json({ username: req.body.username }));
  }),

  rest.post<AuthBody, RegisterResponse>(registerURL, async (req, res, ctx) => {
    if (!req.body.password) {
      return res(
        ctx.delay(delay),
        ctx.status(400),
        ctx.json({ message: "password required" })
      );
    }
    if (!req.body.username) {
      return res(
        ctx.delay(delay),
        ctx.status(400),
        ctx.json({ message: "username required" })
      );
    }
    return res(
      ctx.delay(delay),
      ctx.json({
        user: {
          username: req.body.username,
          token: "test_token",
        },
      })
    );
  }),

  rest.get<MeBody, MeResponse>(meURL, async (req, res, ctx) =>
    res(
      ctx.delay(delay),
      ctx.json({
        user: {
          id: "2087933171",
          token: req.body.token,
          username: "test",
        },
      })
    )
  ),
];

export { handlers };
