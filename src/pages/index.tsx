import React, { FC } from "react";
import Head from "next/head";
import NextLink from "next/link";
import { Box, Heading, Link, Text } from "@chakra-ui/core";

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>{`HashmaskTools`}</title>
      </Head>

      <Box>
        <Heading mb="8">HashmaskTools</Heading>

        <Text mb="2">Work in progress</Text>
        <Text>
          Browse all hashmasks{" "}
          <NextLink href={"/browse"} passHref>
            <Link color="cyan.800">here</Link>
          </NextLink>
          .
        </Text>
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
