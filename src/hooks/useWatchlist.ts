import { useState } from "react";
import createPersistedState from "use-persisted-state";

enum Storage {
  Watchlist = "hashmasktools_watchlist",
}

const useWatchlistState = createPersistedState(Storage.Watchlist);

export const useWatchlist = (id?: string) => {
  const [watchlist, setWatchlist] = useWatchlistState<string[]>([]);
  const [isOnWatchlist, setIsOnWatchlist] = useState<boolean>(
    id ? watchlist.includes(id) : false
  );

  const toggleWatchlist = () => {
    if (!id) {
      throw Error("Provide mask id to use toggleWatchlist");
    }

    if (!isOnWatchlist) {
      setWatchlist([...watchlist, id]);
      setIsOnWatchlist(true);
    } else {
      setWatchlist([...watchlist].filter((w) => w !== id));
      setIsOnWatchlist(false);
    }
  };

  return {
    toggleWatchlist,
    isOnWatchlist,
    watchlist,
  };
};
