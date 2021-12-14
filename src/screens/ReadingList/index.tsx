import { Link } from "components/Lib";
import ListItemList from "components/ListItemList";
import { ListItem, User } from "utils/types";

function ReadingListScreen({ user }: { user: User }) {
  return (
    <ListItemList
      user={user}
      filterListItems={(li: ListItem) => !li.finishDate}
      noListItems={
        <p>
          Hey there! Welcome to your bookshelf reading list. Get started by
          heading over to <Link to="/discover">the Discover page</Link> to add
          books to your list.
        </p>
      }
      noFilteredListItems={
        <p>
          Looks like you have finished all your books! Check them out in your{" "}
          <Link to="/finished">finished books</Link> or{" "}
          <Link to="/discover">discover more</Link>.
        </p>
      }
    />
  );
}

export default ReadingListScreen;
