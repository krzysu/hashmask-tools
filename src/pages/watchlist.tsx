import React, { FC, useMemo } from "react";
import Head from "next/head";
import { Box } from "@chakra-ui/core";

import { useDataProvider } from "../context/DataProvider";
import { useWatchlist } from "../hooks/useWatchlist";
import { MaskListWithSorting } from "../components/MaskListWithSorting";

const WatchlistPage: FC = () => {
  const { buildMask } = useDataProvider();
  const { watchlist } = useWatchlist();
  const watchlistMasks = useMemo(() => watchlist.map((id) => buildMask(id)), [
    buildMask,
  ]);

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
