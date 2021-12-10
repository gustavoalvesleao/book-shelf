import { rest } from "msw";

import { Book } from "utils/types";

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

interface BookResponse {
  author: string;
  coverImageUrl: string;
  id: string;
  pageCount: number;
  publisher: string;
  synopsis: string;
  title: string;
}

interface BooksResponse {
  books?: Array<Book>;
  message?: string;
  status?: number;
}

const delay = process.env.NODE_ENV === "test" ? 0 : 1500;
const loginURL = "https://auth-provider.jk/auth/login";
const registerURL = "https://auth-provider.jk/auth/register";
const meURL = "https://bookshelf.jk/api/me";
const booksURL = "https://bookshelf.jk/api/books";
const bookURL = "https://bookshelf.jk/api/books/:bookId";

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

  rest.get<BooksResponse>(booksURL, async (req, res, ctx) => {
    const bookName = req.url.searchParams.get("query");

    if (bookName === "dont exist") {
      return res(
        ctx.delay(delay),
        ctx.json({
          books: [],
        })
      );
    }

    if (bookName === "FAIL") {
      return res(
        ctx.delay(delay),
        ctx.json({
          message: "Request failure (for testing purposes).",
        }),
        ctx.status(500)
      );
    }
    return res(
      ctx.delay(delay),
      ctx.json({
        books: [
          {
            author: `${bookName} author test`,
            coverImageUrl: "",
            id: "123",
            pageCount: 123,
            publisher: `${bookName} publisher test`,
            synopsis: `${bookName} synopsis test`,
            title: `${bookName} title test`,
          },
        ],
      })
    );
  }),

  rest.get<BookResponse>(bookURL, async (req, res, ctx) => {
    const { bookId } = req.params;

    return res(
      ctx.delay(delay),
      ctx.json({
        book: {
          author: `${bookId} author test`,
          coverImageUrl: "",
          id: "123",
          pageCount: 123,
          publisher: `${bookId} publisher test`,
          synopsis: `${bookId} synopsis test`,
          title: `${bookId} title test`,
        },
      })
    );
  }),
];

export { handlers };
