import React, { FC } from "react";
import { Box, Text, Link } from "@chakra-ui/core";

type Props = {
  buildDate?: string;
};

export const Footer: FC<Props> = ({ buildDate }) => {
  return (
    <Box as="footer" pt="12" pb="8">
      <Text pb="2">
        {"HashmaskTools 2021 - built by Kris Urbas "}
        <Link href="https://twitter.com/krzysu" isExternal>
          @krzysu
        </Link>
      </Text>
      {buildDate && <Text pb="2">Last update - {buildDate}</Text>}
      <Text pb="2">
        {`Do you like HashmaskTools? Consider donating to the development fund: `}
        <Link
          href={`https://etherscan.io/address/${process.env.NEXT_PUBLIC_REF_ADDRESS}`}
          isExternal
        >
          {process.env.NEXT_PUBLIC_REF_ADDRESS}
        </Link>
      </Text>
    </Box>
  );
};
