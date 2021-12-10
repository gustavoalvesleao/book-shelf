/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line
import { jsx } from "@emotion/react";

import * as React from "react";
import {
  FaCheckCircle,
  FaPlusCircle,
  FaMinusCircle,
  FaBook,
  FaTimesCircle,
} from "react-icons/fa";
import Tooltip from "@reach/tooltip";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { CircleButton, Spinner } from "components/Lib";
import { useAsync } from "utils/hooks";
import { Book, ListItem, User } from "utils/types";
import { client } from "utils/api-client";
import * as colors from "styles/colors";

interface ToolTipProps {
  label: string;
  highlight: string;
  onClick: () => Promise<unknown>;
  icon: React.ReactElement;
}

interface Props {
  user: User;
  book: Book;
}

function StatusButtons({ user, book }: Props) {
  const queryClient = useQueryClient();

  const { data: listItems } = useQuery("list-items", () =>
    client("list-items", { token: user.token }).then((data) => data.listItems)
  );

  const listItem =
    listItems?.find((li: ListItem) => li.bookId === book.id) ?? null;

  const { mutateAsync: update } = useMutation(
    (updates: { id: string; finishDate: number | null }) =>
      client(`list-items/${updates.id}`, {
        method: "PUT",
        data: updates,
        token: user.token,
      }),
    { onSettled: () => queryClient.invalidateQueries("list-items") }
  );

  const { mutateAsync: remove } = useMutation(
    ({ id }: { id: string }) =>
      client(`list-items/${id}`, { method: "DELETE", token: user.token }),
    { onSettled: () => queryClient.invalidateQueries("list-items") }
  );

  const { mutateAsync: create } = useMutation(
    ({ bookId }: { bookId: string }) =>
      client("list-items", { data: { bookId }, token: user.token }),
    { onSettled: () => queryClient.invalidateQueries("list-items") }
  );

  return (
    <React.Fragment>
      {listItem ? (
        listItem.finishDate ? (
          <TooltipButton
            label="Unmark as read"
            highlight={colors.yellow}
            onClick={() => update({ id: listItem.id, finishDate: null })}
            icon={<FaBook />}
          />
        ) : (
          <TooltipButton
            label="Mark as read"
            highlight={colors.green}
            onClick={() => update({ id: listItem.id, finishDate: Date.now() })}
            icon={<FaCheckCircle />}
          />
        )
      ) : null}
      {listItem ? (
        <TooltipButton
          label="Remove from list"
          highlight={colors.danger}
          onClick={() => remove({ id: listItem.id })}
          icon={<FaMinusCircle />}
        />
      ) : (
        <TooltipButton
          label="Add to list"
          highlight={colors.indigo}
          onClick={() => create({ bookId: book.id })}
          icon={<FaPlusCircle />}
        />
      )}
    </React.Fragment>
  );
}

function TooltipButton({
  label,
  highlight,
  onClick,
  icon,
  ...rest
}: ToolTipProps) {
  const { isLoading, isError, error, run } = useAsync();

  const handleClick = () => {
    run(onClick());
  };

  return (
    <Tooltip label={isError ? error?.message : label}>
      <CircleButton
        css={{
          backgroundColor: "white",
          ":hover,:focus": {
            color: isLoading
              ? colors.gray80
              : isError
              ? colors.danger
              : highlight,
          },
        }}
        disabled={isLoading}
        onClick={handleClick}
        aria-label={isError ? error?.message : label}
        {...rest}
      >
        {isLoading ? <Spinner /> : isError ? <FaTimesCircle /> : icon}
      </CircleButton>
    </Tooltip>
  );
}

export default StatusButtons;
