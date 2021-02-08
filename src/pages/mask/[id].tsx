import React, { FC } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Box, Flex, Heading, Spinner } from "@chakra-ui/core";

import { MaskHero } from "../../components/MaskHero";
import { MaskList } from "../../components/MaskList";
import { buildMask, buildSameTraitMasks } from "../../model";

const MaskPage: FC = () => {
  const { query } = useRouter();
  const id = (query.id || "unknown") as string;

  let mask;

  try {
    mask = buildMask(id);
  } catch (e) {}

  if (!mask) {
    return (
      <Flex justifyContent="center" alignItems="center" height="300px">
        <Spinner thickness="4px" size="xl" />
      </Flex>
    );
  }

  const sameTraitMasks = buildSameTraitMasks(id);

  return (
    <>
      <Head>
        <title>{`Hashmask #${mask.id}`}</title>
      </Head>

      <Box mb="12">
        <MaskHero mask={mask} />{" "}
      </Box>

      {sameTraitMasks.length > 0 && (
        <Box mb="12">
          <Heading mb="8">{`With the same traits (${sameTraitMasks.length})`}</Heading>
          <MaskList masks={sameTraitMasks.slice(0, 20)} />
        </Box>
      )}
    </>
  );
};

export default MaskPage;
