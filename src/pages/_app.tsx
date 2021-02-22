import React, { FC } from "react";
import { ChakraProvider, Container, Grid, theme } from "@chakra-ui/core";
import { AppProps } from "next/app";
import DataProvider from "../context/DataProvider";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <DataProvider>
        <Container maxW="xl">
          <Grid minH="100vh" templateRows="auto 1fr auto">
            <Navigation />
            <Component {...pageProps} />
            <Footer buildDate={pageProps.buildDate} />
          </Grid>
        </Container>
      </DataProvider>
    </ChakraProvider>
  );
};

export default MyApp;
