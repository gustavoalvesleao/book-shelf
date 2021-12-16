import React from "react";
import { QueryClient, useQuery, useQueryClient } from "react-query";

import bookPlaceholderSvg from "assets/book-placeholder.svg";

import { client } from "./api-client";
import { Book, User } from "./types";

const loadingBook = {
  title: "Loading...",
  author: "loading...",
  coverImageUrl: bookPlaceholderSvg,
  publisher: "Loading Publishing",
  synopsis: "Loading...",
  pageCount: 0,
  id: "loading...",
};

const loadingBooks = Array.from({ length: 10 }, (_v, index) => ({
  ...loadingBook,
  id: `loading-book-${index}`,
})) as Book[];

const getBookSearchConfig = (
  query: string,
  user: User,
  queryClient: QueryClient
) => ({
  queryKey: ["bookSearch", { query }],
  queryFn: () =>
    client(`books?query=${encodeURIComponent(query)}`, {
      token: user.token,
    }).then((data) => data.books),
  onSuccess(books: Book[]) {
    for (const book of books) {
      setQueryDataForBook(queryClient, book);
    }
  },
});

function useBookSearch(query: string, user: User) {
  const queryClient = useQueryClient();

  const result = useQuery<Book[], Error>(
    getBookSearchConfig(query, user, queryClient)
  );
  return { ...result, books: result.data ?? loadingBooks };
}

function useBook(bookId: string | undefined, user: User) {
  const response = useQuery<Book, Error>(["book", { bookId }], () =>
    client(`books/${bookId}`, { token: user.token }).then((data) => data.book)
  );

  return { ...response, data: response.data ?? loadingBook };
}

function useRefetchBookSearchQuery(user: User) {
  const queryClient = useQueryClient();

  return React.useCallback(() => {
    queryClient.removeQueries("bookSearch");
    queryClient.prefetchQuery(getBookSearchConfig("", user, queryClient));
  }, [queryClient, user]);
}

function setQueryDataForBook(queryClient: QueryClient, book: Book) {
  queryClient.setQueryData(["book", { bookId: book.id }], book);
}

export {
  useBookSearch,
  useBook,
  useRefetchBookSearchQuery,
  setQueryDataForBook,
};
