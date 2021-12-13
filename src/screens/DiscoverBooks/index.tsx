/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line
import { jsx } from "@emotion/react";
import React from "react";
import Tooltip from "@reach/tooltip";
import { FaSearch, FaTimes } from "react-icons/fa";

import BookRow from "components/BookRow";
import { Input, BookListUL, Spinner, ErrorMessage } from "components/Lib";
import * as colors from "styles/colors";
import { useBookSearch } from "utils/books";

import { User } from "utils/types";

import { SearchFormElements } from "./types";

function DiscoverBooksScreen({ user }: { user: User }) {
  const [query, setQuery] = React.useState<string>("");
  const { books, error, isLoading, isError, isSuccess } = useBookSearch(
    query,
    user
  );

  const handleSearchSubmit = (event: React.FormEvent<SearchFormElements>) => {
    event.preventDefault();
    const { search } = event.currentTarget.elements;
    setQuery(search.value);
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

      {isError ? <ErrorMessage error={error} /> : null}

      {isSuccess ? (
        books?.length ? (
          <BookListUL css={{ marginTop: 20 }}>
            {books.map((book) => (
              <li key={book.id} aria-label={book.title}>
                <BookRow key={book.id} book={book} user={user} />
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
