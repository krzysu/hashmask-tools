import React, { FC } from "react";
import { Button } from "@chakra-ui/core";
import { StarIcon } from "@chakra-ui/icons";
import { useWatchlist } from "../hooks/useWatchlist";

type Props = {
  id: string;
};

export const WatchlistButton: FC<Props> = ({ id }) => {
  const { toggleWatchlist, isOnWatchlist } = useWatchlist(id);

  return (
    <Button
      leftIcon={<StarIcon />}
      size="sm"
      colorScheme={isOnWatchlist ? "pink" : "gray"}
      onClick={toggleWatchlist}
    >
      {isOnWatchlist ? "Remove" : "Add to watchlist"}
    </Button>
  );
};
