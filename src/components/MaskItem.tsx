import React, { FC } from "react";
import { Box, Flex, Link, Text } from "@chakra-ui/core";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import NextLink from "next/link";

import { MaskImage } from "./MaskImage";
import { WatchlistIcon } from "./WatchlistIcon";
import { formatPrice } from "../model";
import { getOpenSeaUrl } from "../links";
import { ViewMask } from "../../shared/types";

type Props = {
  mask: ViewMask;
};

export const MaskItem: FC<Props> = ({ mask }) => (
  <Box position="relative">
    <NextLink href="/mask/[id]" as={`/mask/${mask.id}`}>
      <a>
        <MaskImage mask={mask} fallbackProps={{ height: "180px" }} />
      </a>
    </NextLink>

    <Box position="absolute" top="2" left="2">
      <WatchlistIcon id={mask.id} />
    </Box>

    <Box mb="4">
      <Text size="sm" fontWeight="bold">
        <NextLink href="/mask/[id]" as={`/mask/${mask.id}`} passHref>
          <Link>{`Hashmask #${mask.id}`}</Link>
        </NextLink>
      </Text>

      <Box>
        <Link
          href={`https://www.thehashmasks.com/detail/${mask.id}`}
          isExternal
          color="cyan.800"
        >
          TheHashmasks
          <ExternalLinkIcon mx="2px" />
        </Link>
      </Box>
      <Box>
        <Link href={getOpenSeaUrl(mask.id)} isExternal color="cyan.800">
          OpenSea
          <ExternalLinkIcon mx="2px" />
        </Link>
      </Box>
    </Box>

    <Box>
      <Flex justify="space-between">
        <Text>Last price</Text>
        <Text fontWeight="bold">
          {typeof mask.lastPrice !== "undefined"
            ? formatPrice(mask.lastPrice)
            : "n/a"}
        </Text>
      </Flex>
      <Flex justify="space-between">
        <Text>Offered for</Text>
        <Text fontWeight="bold">
          {typeof mask.offeredPrice !== "undefined"
            ? formatPrice(mask.offeredPrice)
            : "n/a"}
        </Text>
      </Flex>
      <Flex justify="space-between">
        <Text>Rarity score</Text>
        <Text fontWeight="bold">{mask.score}</Text>
      </Flex>
    </Box>
  </Box>
);
