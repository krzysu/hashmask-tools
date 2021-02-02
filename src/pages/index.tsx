import React, { FC } from "react";
import Head from "next/head";
import { Box, Heading } from "@chakra-ui/core";

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>{`PunkTools`}</title>
      </Head>

      <Box>
        <Heading mb="8">PunkTools</Heading>
      </Box>
    </>
  );
};

export default Index;

export async function getStaticProps() {
  return {
    props: {
      buildDate: new Date().toUTCString(),
    },
  };
}