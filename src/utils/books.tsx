import { QueryClient, useQuery } from "react-query";

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

const getBookSearchConfig = (query: string, user: User) => ({
  queryKey: ["bookSearch", { query }],
  queryFn: () =>
    client(`books?query=${encodeURIComponent(query)}`, {
      token: user.token,
    }).then((data) => data.books),
});

function useBookSearch(query: string, user: User) {
  const result = useQuery<Book[], Error>(getBookSearchConfig(query, user));
  return { ...result, books: result.data ?? loadingBooks };
}

function useBook(bookId: string | undefined, user: User) {
  const response = useQuery<Book, Error>(["book", { bookId }], () =>
    client(`books/${bookId}`, { token: user.token }).then((data) => data.book)
  );

  return { ...response, data: response.data ?? loadingBook };
}

function refetchBookSearchQuery(user: User, queryClient: QueryClient) {
  queryClient.removeQueries("bookSearch");
  queryClient.prefetchQuery(getBookSearchConfig("", user));
}

export { useBookSearch, useBook, refetchBookSearchQuery };
