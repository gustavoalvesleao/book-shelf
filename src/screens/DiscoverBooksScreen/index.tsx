/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line
import { jsx } from "@emotion/react";
import React from "react";
import Tooltip from "@reach/tooltip";
import { FaSearch, FaTimes } from "react-icons/fa";

import BookRow from "components/BookRow";
import { Input, BookListUL, Spinner } from "components/Lib";
import { client } from "utils/api-client";
import { useAsync } from "utils/hooks";
import * as colors from "styles/colors";

import { Data, SearchFormElements } from "./types";

function DiscoverBooksScreen() {
  const { data, error, run, isLoading, isError, isSuccess } = useAsync<Data>();
  const [query, setQuery] = React.useState<string>("");
  const [queried, setQueried] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!queried) {
      return;
    }
    run(client(`books?query=${encodeURIComponent(query)}`));
  }, [run, queried, query]);

  const handleSearchSubmit = (event: React.FormEvent<SearchFormElements>) => {
    event.preventDefault();
    const { search } = event.currentTarget.elements;
    setQuery(search.value);
    setQueried(true);
  };

  return (
    <div
      css={{ maxWidth: 800, margin: "auto", width: "90vw", padding: "40px 0" }}
    >
      <form onSubmit={handleSearchSubmit}>
        <Input
          placeholder="Search books..."
          id="search"
          css={{ width: "100%" }}
        />
        <Tooltip label="Search Books">
          <label htmlFor="search">
            <button
              type="submit"
              css={{
                border: "0",
                position: "relative",
                marginLeft: "-35px",
                background: "transparent",
              }}
            >
              {isLoading ? (
                <Spinner />
              ) : isError ? (
                <FaTimes aria-label="error" css={{ color: colors.danger }} />
              ) : (
                <FaSearch aria-label="search" />
              )}
            </button>
          </label>
        </Tooltip>
      </form>

      {isError ? (
        <div css={{ color: colors.danger }}>
          <p>There was an error:</p>
          <pre>{error && error.message}</pre>
        </div>
      ) : null}

      {isSuccess ? (
        data?.books?.length ? (
          <BookListUL css={{ marginTop: 20 }}>
            {data.books.map((book) => (
              <li key={book.id} aria-label={book.title}>
                <BookRow key={book.id} book={book} />
              </li>
            ))}
          </BookListUL>
        ) : (
          <p>No books found. Try another search.</p>
        )
      ) : null}
    </div>
  );
}

export default DiscoverBooksScreen;
