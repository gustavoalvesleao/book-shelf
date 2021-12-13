import { useQuery } from "react-query";

import bookPlaceholderSvg from "assets/book-placeholder.svg";

import { client } from "./api-client";
import { Book, User } from "./types";

const loadingBook = {
  title: "Loading...",
  author: "loading...",
  coverImageUrl: bookPlaceholderSvg,
  publisher: "Loading Publishing",
  synopsis: "Loading...",
  loadingBook: true,
  pageCount: 0,
};

const loadingBooks = Array.from({ length: 10 }, (_v, index) => ({
  id: `loading-book-${index}`,
  ...loadingBook,
})) as Book[];

function useBookSearch(query: string, user: User) {
  const result = useQuery<Book[], Error>(["bookSearch", { query }], () =>
    client(`books?query=${encodeURIComponent(query)}`, {
      token: user.token,
    }).then((data) => data.books)
  );
  return { ...result, books: result.data ?? loadingBooks };
}

function useBook(bookId: string | undefined, user: User) {
  const { data } = useQuery(["book", { bookId }], () =>
    client(`books/${bookId}`, { token: user.token }).then((data) => data.book)
  );
  return data ?? loadingBook;
}

export { useBookSearch, useBook };
