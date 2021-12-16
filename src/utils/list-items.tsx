import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";

import { ListItem, User } from "utils/types";

import { client } from "./api-client";
import { setQueryDataForBook } from "./books";

function getDefaultMutationOptions(queryClient: QueryClient) {
  return {
    onError: (_err: Error, _newItem: ListItem, recover: unknown) => {
      if (typeof recover === "function") {
        recover();
      }
    },
    onSettled: () => queryClient.invalidateQueries("list-items"),
  };
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

function useUpdateListItem(user: User) {
  const queryClient = useQueryClient();

  return useMutation<ListItem, Error, ListItem>(
    (updates) =>
      client(`list-items/${updates.id}`, {
        method: "PUT",
        data: updates,
        token: user.token,
      }),
    {
      onMutate: (newItem) => {
        const previousItems = queryClient.getQueryData("list-items");
        queryClient.setQueryData<ListItem[] | undefined>("list-items", (old) =>
          old?.map((item) =>
            item.id === newItem.id ? { ...item, ...newItem } : item
          )
        );
        return () => queryClient.setQueryData("list-items", previousItems);
      },
      ...getDefaultMutationOptions(queryClient),
    }
  );
}

function useRemoveListItem(user: User) {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id }: { id: string }) =>
      client(`list-items/${id}`, { method: "DELETE", token: user.token }),
    {
      onMutate: (removedItem) => {
        const previousItems = queryClient.getQueryData("list-items");
        queryClient.setQueryData<ListItem[] | undefined>("list-items", (old) =>
          old?.filter((item) => removedItem.id !== item.id)
        );
        return () => queryClient.setQueryData("list-items", previousItems);
      },
      ...getDefaultMutationOptions(queryClient),
    }
  );
}

function useCreateListItem(user: User) {
  const queryClient = useQueryClient();

  return useMutation(
    ({ bookId }: { bookId: string }) =>
      client("list-items", { data: { bookId }, token: user.token }),
    {
      ...getDefaultMutationOptions(queryClient),
    }
  );
}

export {
  useListItems,
  useListItem,
  useUpdateListItem,
  useRemoveListItem,
  useCreateListItem,
};
