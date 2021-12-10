import React from "react";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import { handlers } from "../../test/server-handlers";
import { buildUser } from "../../test/test-utils";

import DiscoverBooksScreen from "./index";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
});

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

const user = buildUser();
const bookName = "Zack";

describe("<DiscoverBooksScreen />", () => {
  describe("Given that I'm in the Discover Books Screen", () => {
    beforeEach(() => {
      render(
        <Router>
          <QueryClientProvider client={queryClient}>
            <DiscoverBooksScreen user={user} />
          </QueryClientProvider>
        </Router>
      );
    });

    describe("and I enter an existing book name and click the search button", () => {
      beforeEach(async () => {
        await waitForElementToBeRemoved(() =>
          screen.getByLabelText(/loading/i)
        );
      });

      test("The book is information displayed on the screen", async () => {
        userEvent.type(
          screen.getByRole("textbox", { name: /search/i }),
          bookName
        );
        userEvent.click(screen.getByRole("button", { name: /search/i }));

        expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();

        await waitForElementToBeRemoved(() =>
          screen.getByLabelText(/loading/i)
        );

        expect(
          screen.getByRole("heading", { name: `${bookName} title test` })
        ).toBeInTheDocument();
        expect(screen.getByText(`${bookName} author test`)).toBeInTheDocument();
        expect(
          screen.getByText(`${bookName} publisher test`)
        ).toBeInTheDocument();
        expect(
          screen.getByText(`${bookName} synopsis test...`)
        ).toBeInTheDocument();
        expect(
          screen.getByRole("img", { name: `${bookName} title test book cover` })
        ).toBeInTheDocument();
      });
    });

    describe("And an error occur in the request", () => {
      test("A failure error message is displayed in the screen", async () => {
        userEvent.type(
          screen.getByRole("textbox", { name: /search/i }),
          "FAIL"
        );
        userEvent.click(screen.getByRole("button", { name: /search/i }));

        expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();

        await waitForElementToBeRemoved(() =>
          screen.getByLabelText(/loading/i)
        );

        expect(
          screen.getByRole("button", { name: /error/i })
        ).toBeInTheDocument();

        expect(screen.getByText(/there was an error:/i)).toBeInTheDocument();

        expect(screen.getByRole("alert").textContent).toMatchInlineSnapshot(
          `"There was an error: Request failure (for testing purposes)."`
        );
      });
    });

    describe("And I enter an unexisting book name and click the search button", () => {
      test("A not found message is displayed in the screen", async () => {
        userEvent.type(
          screen.getByRole("textbox", { name: /search/i }),
          "dont exist"
        );
        userEvent.click(screen.getByRole("button", { name: /search/i }));

        expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();

        await waitForElementToBeRemoved(() =>
          screen.getByLabelText(/loading/i)
        );

        expect(
          screen.queryByRole("button", { name: /error/i })
        ).not.toBeInTheDocument();

        expect(
          screen.getByText(/no books found\. try another search\./i)
        ).toBeInTheDocument();
      });
    });
  });
});
