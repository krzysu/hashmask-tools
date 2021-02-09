import React, { FC } from "react";
import { Box, Text, Link } from "@chakra-ui/core";

type Props = {
  buildDate?: string;
};

export const Footer: FC<Props> = ({ buildDate }) => {
  return (
    <Box as="footer" pt="12" pb="4">
      <Text>
        HashmaskTools - built by Kris Urbas{" "}
        <Link href="https://twitter.com/krzysu" isExternal>
          @krzysu
        </Link>{" "}
      </Text>
      {buildDate && <Text>Last update - {buildDate}</Text>}
    </Box>
  );
};
