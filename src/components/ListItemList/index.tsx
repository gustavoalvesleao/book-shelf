/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line
import { jsx } from "@emotion/react";
import React from "react";

import BookRow from "components/BookRow";
import { BookListUL } from "components/Lib";

import { ListItem, User } from "utils/types";
import { useListItems } from "utils/list-items";

interface Props {
  user: User;
  filterListItems: (li: ListItem) => boolean;
  noListItems: React.ReactElement;
  noFilteredListItems: React.ReactElement;
}

function ListemItemList({
  user,
  filterListItems,
  noListItems,
  noFilteredListItems,
}: Props) {
  const listItems = useListItems(user);
  const filteredListItems = listItems?.filter(filterListItems);

  if (!listItems?.length) {
    return (
      <div css={{ marginTop: "1em", fontSize: "1.2em" }}>{noListItems}</div>
    );
  }
  if (!filteredListItems.length) {
    return (
      <div css={{ marginTop: "1em", fontSize: "1.2em" }}>
        {noFilteredListItems}
      </div>
    );
  }

  return (
    <BookListUL>
      {filteredListItems.map((listItem: ListItem) => (
        <li key={listItem.id}>
          <BookRow user={user} book={listItem.book} />
        </li>
      ))}
    </BookListUL>
  );
}

export default ListemItemList;
