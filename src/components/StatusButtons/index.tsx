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

import { CircleButton, Spinner } from "components/Lib";
import { useAsync } from "utils/hooks";
import { Book, ListItem, User } from "utils/types";
import * as colors from "styles/colors";
import {
  useCreateListItem,
  useListItem,
  useRemoveListItem,
  useUpdateListItem,
} from "utils/list-items";

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
  const listItem = useListItem(user, book.id);

  const { mutateAsync: update } = useUpdateListItem(user);
  const { mutateAsync: remove } = useRemoveListItem(user);
  const { mutateAsync: create } = useCreateListItem(user);

  return (
    <React.Fragment>
      {listItem ? (
        listItem.finishDate ? (
          <TooltipButton
            label="Unmark as read"
            highlight={colors.yellow}
            onClick={() =>
              update({ id: listItem.id, finishDate: null } as ListItem)
            }
            icon={<FaBook />}
          />
        ) : (
          <TooltipButton
            label="Mark as read"
            highlight={colors.green}
            onClick={() =>
              update({ id: listItem.id, finishDate: Date.now() } as ListItem)
            }
            icon={<FaCheckCircle />}
          />
        )
      ) : null}
      {listItem ? (
        <TooltipButton
          label="Remove from list"
          highlight={colors.danger}
          onClick={() => remove({ id: listItem.id } as ListItem)}
          icon={<FaMinusCircle />}
        />
      ) : (
        <TooltipButton
          label="Add to list"
          highlight={colors.indigo}
          onClick={() => create({ bookId: book.id } as ListItem)}
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
  const { isLoading, isError, error, run, reset } = useAsync();

  const handleClick = () => {
    if (isError) {
      reset();
    } else {
      run(onClick());
    }
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
