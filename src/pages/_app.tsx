import React, { FC } from "react";
import { ChakraProvider, Container, Grid, theme } from "@chakra-ui/core";
import { AppProps } from "next/app";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <Container maxW="xl">
        <Grid minH="100vh" templateRows="auto 1fr auto">
          <Navigation />
          <Component {...pageProps} />
          <Footer buildDate={pageProps.buildDate} />
        </Grid>
      </Container>
    </ChakraProvider>
  );
};

export default MyApp;
