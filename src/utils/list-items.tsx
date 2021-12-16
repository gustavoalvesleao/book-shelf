import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";

import { client } from "./api-client";
import { setQueryDataForBook } from "./books";
import { ListItem, User } from "./types";

function getDefaultMutationOptions(queryClient: QueryClient) {
  return { onSettled: () => queryClient.invalidateQueries("list-items") };
}

function useListItems(user: User) {
  const queryClient = useQueryClient();

  const { data: listItems } = useQuery({
    queryKey: "list-items",
    queryFn: () =>
      client("list-items", { token: user.token }).then(
        (data) => data.listItems
      ),
    onSuccess(listItems: ListItem[]) {
      for (const listItem of listItems) {
        setQueryDataForBook(queryClient, listItem.book);
      }
    },
  });

  return listItems ?? [];
}

function useListItem(user: User, bookId: string | undefined) {
  const listItems = useListItems(user);
  return listItems.find((li: ListItem) => li.bookId === bookId) ?? null;
}

function useUpdateListItem<T extends { id: string }>(user: User) {
  const queryClient = useQueryClient();

  return useMutation(
    (updates: T) =>
      client(`list-items/${updates.id}`, {
        method: "PUT",
        data: updates,
        token: user.token,
      }),
    getDefaultMutationOptions(queryClient)
  );
}

function useRemoveListItem(user: User) {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id }: { id: string }) =>
      client(`list-items/${id}`, { method: "DELETE", token: user.token }),
    getDefaultMutationOptions(queryClient)
  );
}

function useCreateListItem(user: User) {
  const queryClient = useQueryClient();

  return useMutation(
    ({ bookId }: { bookId: string }) =>
      client("list-items", { data: { bookId }, token: user.token }),
    getDefaultMutationOptions(queryClient)
  );
}

export {
  useListItems,
  useListItem,
  useUpdateListItem,
  useRemoveListItem,
  useCreateListItem,
};
