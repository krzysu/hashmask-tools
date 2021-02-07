import React, { FC, useMemo } from "react";
import Head from "next/head";
import { Heading } from "@chakra-ui/core";

import { useWatchlist } from "../hooks/useWatchlist";
import { MaskList } from "../components/MaskList";
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

      <Heading mb="8">Watchlist</Heading>
      <MaskList masks={watchlistMasks} />
    </>
  );
};

export default WatchlistPage;
