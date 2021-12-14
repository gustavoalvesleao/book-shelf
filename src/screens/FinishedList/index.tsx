import { Link } from "components/Lib";
import ListItemList from "components/ListItemList";
import { ListItem, User } from "utils/types";

function FinishedScreen({ user }: { user: User }) {
  return (
    <ListItemList
      user={user}
      filterListItems={(li: ListItem) => Boolean(li.finishDate)}
      noListItems={
        <p>
          Hey there! This is where books will go when you have finished reading
          them. Get started by heading over to{" "}
          <Link to="/discover">the Discover page</Link> to add books to your
          list.
        </p>
      }
      noFilteredListItems={
        <p>
          Looks like you have got some reading to do! Check them out in your{" "}
          <Link to="/list">reading list</Link> or{" "}
          <Link to="/discover">discover more</Link>.
        </p>
      }
    />
  );
}

export default FinishedScreen;
