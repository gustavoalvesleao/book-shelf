/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line
import { jsx } from "@emotion/react";
import * as React from "react";
import { useParams } from "react-router-dom";

import { User } from "utils/types";
import { useAsync } from "utils/hooks";
import { client } from "utils/api-client";
import { Book } from "components/BookRow";

import * as mq from "styles/media-queries";

import bookPlaceholderSvg from "../../assets/book-placeholder.svg";

export interface Data {
  book: Book;
}

const loadingBook = {
  title: "Loading...",
  author: "loading...",
  coverImageUrl: bookPlaceholderSvg,
  publisher: "Loading Publishing",
  synopsis: "Loading...",
  loadingBook: true,
};

function BookScreen({ user }: { user: User }) {
  const { bookId } = useParams();
  const { data, run } = useAsync<Data>();

  React.useEffect(() => {
    run(client(`books/${bookId}`, { token: user.token }));
  }, [run, bookId, user.token]);

  const { title, author, coverImageUrl, publisher, synopsis } =
    data?.book ?? loadingBook;

  return (
    <div>
      <div
        css={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gridGap: "2em",
          marginBottom: "1em",
          [mq.small]: {
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <img
          src={coverImageUrl}
          alt={`${title} book cover`}
          css={{ width: "100%", maxWidth: "14rem" }}
        />
        <div>
          <div css={{ display: "flex", position: "relative" }}>
            <div css={{ flex: 1, justifyContent: "space-between" }}>
              <h1>{title}</h1>
              <div>
                <i>{author}</i>
                <span css={{ marginRight: 6, marginLeft: 6 }}>|</span>
                <i>{publisher}</i>
              </div>
            </div>
          </div>
          <br />
          <p>{synopsis}</p>
        </div>
      </div>
    </div>
  );
}

export default BookScreen;
