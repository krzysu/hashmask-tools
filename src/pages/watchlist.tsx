import React, { FC, useMemo } from "react";
import Head from "next/head";
import { Box } from "@chakra-ui/core";

import { useWatchlist } from "../hooks/useWatchlist";
import { MaskListWithSorting } from "../components/MaskListWithSorting";
import { buildMask } from "../model";

const WatchlistPage: FC = () => {
  const { watchlist } = useWatchlist();
  const watchlistMasks = useMemo(
    () => watchlist.map((id) => buildMask(id)),
    []
  );

  return (
    <>
      <Head>
        <title>{`HashmaskTools - Watchlist`}</title>
      </Head>

      <Box>
        <MaskListWithSorting heading="Watchlist" masks={watchlistMasks} />
      </Box>
    </>
  );
};

export default WatchlistPage;
