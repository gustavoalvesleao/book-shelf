/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line
import { jsx } from "@emotion/react";

import * as React from "react";
import { FaStar } from "react-icons/fa";

import { ListItem, User } from "utils/types";

import * as colors from "styles/colors";
import { useUpdateListItem } from "utils/list-items";

const visuallyHiddenCSS = {
  border: "0",
  clip: "rect(0 0 0 0)",
  height: "1px",
  margin: "-1px",
  overflow: "hidden",
  padding: "0",
  position: "absolute" as const,
  width: "1px",
};

function Rating({ listItem, user }: { listItem: ListItem; user: User }) {
  const { mutate } = useUpdateListItem<{ id: string; rating: number }>(user);

  const rootClassName = `list-item-${listItem.id}`;

  const stars = Array.from({ length: 5 }).map((_x, i) => {
    const ratingId = `rating-${listItem.id}-${i}`;
    const ratingValue = i + 1;
    return (
      // eslint-disable-next-line react/no-array-index-key
      <React.Fragment key={i}>
        <input
          name={rootClassName}
          type="radio"
          id={ratingId}
          value={ratingValue}
          checked={ratingValue === listItem.rating}
          onChange={() => {
            mutate({ id: listItem.id, rating: ratingValue });
          }}
          css={[
            visuallyHiddenCSS,
            {
              [`.${rootClassName} &:checked ~ label`]: { color: colors.gray20 },
              [`.${rootClassName} &:checked + label`]: { color: "orange" },
              [`.${rootClassName} &:hover ~ label`]: {
                color: `${colors.gray20} !important`,
              },
              [`.${rootClassName} &:hover + label`]: {
                color: "orange !important",
              },
            },
          ]}
        />
        <label
          htmlFor={ratingId}
          css={{
            cursor: "pointer",
            color: listItem.rating < 0 ? colors.gray20 : "orange",
            margin: 0,
          }}
        >
          <span css={visuallyHiddenCSS}>
            {ratingValue} {ratingValue === 1 ? "star" : "stars"}
          </span>
          <FaStar css={{ width: "16px", margin: "0 2px" }} />
        </label>
      </React.Fragment>
    );
  });
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      role="presentation"
      className={rootClassName}
      css={{
        display: "inline-flex",
        alignItems: "center",
        [`&.${rootClassName}:hover input + label`]: {
          color: "orange",
        },
      }}
    >
      <span css={{ display: "flex" }}>{stars}</span>
    </div>
  );
}

export default Rating;
