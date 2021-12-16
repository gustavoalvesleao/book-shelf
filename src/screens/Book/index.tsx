/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line
import { jsx } from "@emotion/react";
import * as React from "react";
import { useParams } from "react-router-dom";
import Tooltip from "@reach/tooltip";
import { FaRegCalendarAlt } from "react-icons/fa";

import { ListItem, User } from "utils/types";
import { debounce, formatDate } from "utils/misc";
import StatusButtons from "components/StatusButtons";
import Rating from "components/Rating";
import { ErrorMessage, Link, Textarea } from "components/Lib";
import * as mq from "styles/media-queries";
import * as colors from "styles/colors";
import { useBook } from "utils/books";
import { useListItem, useUpdateListItem } from "utils/list-items";

function BookScreen({ user }: { user: User }) {
  const { bookId } = useParams();
  const { data: book, error, isError, isLoading } = useBook(bookId, user);
  const listItem = useListItem(user, book.id);

  const { title, author, coverImageUrl, publisher, synopsis } = book;

  if (isError) {
    return (
      <div>
        <ErrorMessage error={error} />
        <Link to="/discover">Go Home.</Link>
      </div>
    );
  }

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
            <div
              css={{
                right: 0,
                color: colors.gray80,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                minHeight: 100,
              }}
            >
              {isLoading ? null : <StatusButtons user={user} book={book} />}
            </div>
          </div>
          <div css={{ marginTop: 10, height: 46 }}>
            {listItem?.finishDate ? (
              <Rating user={user} listItem={listItem} />
            ) : null}
            {listItem ? <ListItemTimeframe listItem={listItem} /> : null}
          </div>
          <br />
          <p>{synopsis}</p>
        </div>
      </div>
      {!isLoading && listItem ? (
        <NotesTextarea user={user} listItem={listItem} />
      ) : null}
    </div>
  );
}

function ListItemTimeframe({ listItem }: { listItem: ListItem }) {
  const timeframeLabel = listItem.finishDate
    ? "Start and finish date"
    : "Start date";

  return (
    <Tooltip label={timeframeLabel}>
      <div aria-label={timeframeLabel} css={{ marginTop: 6 }}>
        <FaRegCalendarAlt css={{ marginTop: -2, marginRight: 5 }} />
        <span>
          {formatDate(listItem.startDate)}{" "}
          {listItem.finishDate ? `— ${formatDate(listItem.finishDate)}` : null}
        </span>
      </div>
    </Tooltip>
  );
}

function NotesTextarea({ listItem, user }: { listItem: ListItem; user: User }) {
  const { mutate, error, isError } =
    useUpdateListItem<{ id: string; notes: string }>(user);

  const [debouncedMutate] = React.useMemo(
    () => debounce(mutate, 300),
    [mutate]
  );

  const handleNotesChange = (e: string) => {
    debouncedMutate({ id: listItem.id, notes: e });
  };

  return (
    <React.Fragment>
      <div>
        <label
          htmlFor="notes"
          css={{
            display: "inline-block",
            marginRight: 10,
            marginTop: "0",
            marginBottom: "0.5rem",
            fontWeight: "bold",
          }}
        >
          Notes
        </label>
        {isError ? (
          <ErrorMessage
            error={error as Error}
            variant="inline"
            css={{ marginLeft: 6, fontSize: "0.7em" }}
          />
        ) : null}
      </div>
      <Textarea
        id="notes"
        defaultValue={listItem.notes}
        onChange={(e) => handleNotesChange(e.target.value)}
        css={{ width: "100%", minHeight: 300 }}
      />
    </React.Fragment>
  );
}

export default BookScreen;
