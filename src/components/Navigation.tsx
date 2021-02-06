import React, { FC } from "react";
import { Box, Flex, Link } from "@chakra-ui/core";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import NextLink from "next/link";

type Item = {
  href: string;
  label: string;
  isExternal?: boolean;
};

const homeItem = {
  href: "/",
  label: "HashmaskTools",
};

const items = [
  {
    href: "/browse",
    label: "Browse",
  },
  {
    href: "/watchlist",
    label: "Watchlist",
  },
];

const Item: FC<{ item: Item }> = ({ item }) => (
  <Box
    py="2"
    ml={[null, null, 12]}
    _first={{
      margin: "0",
    }}
  >
    <NextLink href={item.href} passHref>
      <Link fontSize={["lg", null, null, "xl"]} isExternal={item.isExternal}>
        {item.label} {item.isExternal && <ExternalLinkIcon />}
      </Link>
    </NextLink>
  </Box>
);

export const Navigation: FC = () => {
  return (
    <Flex
      pt="8"
      pb="16"
      justifyContent="space-between"
      alignContent="center"
      flexDirection={["column", null, "row"]}
    >
      <Item item={homeItem} />

      <Flex flexDirection={["column", null, "row"]}>
        {items.map((item) => (
          <Item key={item.label} item={item} />
        ))}
      </Flex>
    </Flex>
  );
};
