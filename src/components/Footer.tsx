import React, { FC } from "react";
import { Box, Text, Link } from "@chakra-ui/core";

export const Footer: FC = () => {
  return (
    <Box as="footer" pt="12" pb="8">
      <Text pb="2">
        {"HashmaskTools 2021 - built by Kris Urbas @krzysu - Find me on "}
        <Link href="https://twitter.com/krzysu" isExternal>
          Twitter
        </Link>
        {" or "}
        <Link href="https://discordapp.com/users/krzysu#6531" isExternal>
          Discord
        </Link>
      </Text>
      <Text pb="2">
        {`Do you like HashmaskTools? Consider donating to the development fund: `}
        <Link
          href={`https://etherscan.io/address/${process.env.NEXT_PUBLIC_DONATION_ADDRESS}`}
          isExternal
        >
          {process.env.NEXT_PUBLIC_DONATION_ADDRESS}
        </Link>
      </Text>
    </Box>
  );
};
