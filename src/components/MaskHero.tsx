import React, { FC } from "react";
import {
  Box,
  Heading,
  Link,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Flex,
} from "@chakra-ui/core";
import { ExternalLinkIcon } from "@chakra-ui/icons";

import { MaskImage } from "./MaskImage";
import { WatchlistButton } from "./WatchlistButton";
import { formatPrice } from "../model";
import { getOpenSeaUrl } from "../links";
import { ViewMask } from "../../shared/types";

type Props = {
  mask: ViewMask;
};

export const MaskHero: FC<Props> = ({ mask }) => (
  <>
    <Flex direction={["column", null, "row"]}>
      <MaskImage
        mask={mask}
        width={["100%", "75%", "40%"]}
        maxW="420px"
        mx="auto"
        mb={["4", null, "0"]}
        mr={["auto", "auto", "8", "16"]}
        fallbackProps={{ width: ["100%", "75%", "40%"] }}
      />

      <Box flexGrow={1}>
        <Heading mb="4">{`Hashmask #${mask.id}`}</Heading>

        <Box mb="4">
          <WatchlistButton id={mask.id} />
        </Box>

        <Box mb="8">
          <Box>
            <Link
              href={`https://www.thehashmasks.com/detail/${mask.id}`}
              isExternal
              color="cyan.800"
            >
              See on TheHashmasks
              <ExternalLinkIcon mx="2px" />
            </Link>
          </Box>
          <Box>
            <Link href={getOpenSeaUrl(mask.id)} isExternal color="cyan.800">
              See on OpenSea
              <ExternalLinkIcon mx="2px" />
            </Link>
          </Box>
        </Box>

        <StatGroup mb="8" justifyContent="flex-start" flexWrap="nowrap">
          <Stat mr={[8, null, 12]}>
            <StatLabel>Last price</StatLabel>
            <StatNumber>
              {typeof mask.lastPrice !== "undefined"
                ? formatPrice(mask.lastPrice)
                : "n/a"}
            </StatNumber>
          </Stat>
          <Stat mr={[8, null, 12]}>
            <StatLabel>Offered for</StatLabel>
            <StatNumber>
              {typeof mask.offeredPrice !== "undefined"
                ? formatPrice(mask.offeredPrice)
                : "n/a"}
            </StatNumber>
          </Stat>
          <Stat mr={[8, null, 12]}>
            <StatLabel>Rarity score</StatLabel>
            <StatNumber>{mask.score}</StatNumber>
          </Stat>
        </StatGroup>

        <StatGroup justifyContent="flex-start">
          <Stat mr={[8, null, 12]}>
            <StatLabel>Character</StatLabel>
            <StatNumber>{`${mask.character}`}</StatNumber>
          </Stat>
          <Stat mr={[8, null, 12]}>
            <StatLabel>Mask</StatLabel>
            <StatNumber>{`${mask.mask}`}</StatNumber>
          </Stat>
          <Stat mr={[8, null, 12]}>
            <StatLabel>Eyes</StatLabel>
            <StatNumber>{`${mask.eyes}`}</StatNumber>
          </Stat>
          <Stat mr={[8, null, 12]}>
            <StatLabel>Skin</StatLabel>
            <StatNumber>{`${mask.skin}`}</StatNumber>
          </Stat>
          <Stat mr={[8, null, 12]}>
            <StatLabel>Item</StatLabel>
            <StatNumber>{`${mask.item}`}</StatNumber>
          </Stat>
        </StatGroup>
      </Box>
    </Flex>
  </>
);
