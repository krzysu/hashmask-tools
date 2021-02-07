import React, { FC } from "react";
import { IconButton } from "@chakra-ui/core";
import { StarIcon } from "@chakra-ui/icons";
import { useWatchlist } from "../hooks/useWatchlist";

type Props = {
  id: string;
};

export const WatchlistIcon: FC<Props> = ({ id }) => {
  const { toggleWatchlist, isOnWatchlist } = useWatchlist(id);

  return (
    <IconButton
      aria-label={isOnWatchlist ? "Remove" : "Add to watchlist"}
      title={isOnWatchlist ? "Remove" : "Add to watchlist"}
      icon={<StarIcon />}
      size="sm"
      isRound
      colorScheme={isOnWatchlist ? "pink" : "gray"}
      onClick={toggleWatchlist}
    />
  );
};
