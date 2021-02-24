import React, { FC, useCallback, useMemo } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Box, Flex, Heading, Text } from "@chakra-ui/core";
import { FilterItem } from "../components/Filters/FilterItem";
import { MaskListWithSorting } from "../components/MaskListWithSorting";
import { useDataProvider } from "../context/DataProvider";
import {
  buildCollectionSelectItems,
  getMaskIdsFromCollection,
  collectionToNameMap,
  Collection,
} from "../collections";

const COLLECTION_QUERY_PARAM = "c";

const Index: FC = () => {
  const router = useRouter();
  const { buildMask } = useDataProvider();

  const collection = (router.query[COLLECTION_QUERY_PARAM] || "") as Collection;
  const maskIds = getMaskIdsFromCollection(collection);
  const masks = maskIds.map((id) => buildMask(id));

  const maskSelectItems = useMemo(
    () => buildCollectionSelectItems("masks"),
    []
  );
  const eyeSelectItems = useMemo(() => buildCollectionSelectItems("eyes"), []);
  const itemSelectItems = useMemo(
    () => buildCollectionSelectItems("items"),
    []
  );
  const backgroundSelectItems = useMemo(
    () => buildCollectionSelectItems("backgrounds"),
    []
  );

  const handleChange = useCallback((name) => {
    router.replace({
      pathname: router.pathname,
      query: { [COLLECTION_QUERY_PARAM]: name },
    });
  }, []);

  return (
    <>
      <Head>
        <title>{`HashmaskTools - Collections`}</title>
      </Head>

      <Box>
        <Heading mb="8">Collections</Heading>

        <Box pb="4">
          <Flex flexDirection={["column", null, "row"]} pb="4" wrap="wrap">
            <FilterItem
              label="Mask"
              value={collection}
              onValueChange={handleChange}
              items={maskSelectItems}
              mb={["2", null]}
              mr={[null, "4"]}
            />
            <FilterItem
              label="Eyes"
              value={collection}
              onValueChange={handleChange}
              items={eyeSelectItems}
              mb={["2", null]}
              mr={[null, "4"]}
            />
            <FilterItem
              label="Item"
              value={collection}
              onValueChange={handleChange}
              items={itemSelectItems}
              mb={["2", null]}
              mr={[null, "4"]}
            />
            <FilterItem
              label="Background"
              value={collection}
              onValueChange={handleChange}
              items={backgroundSelectItems}
              mb={["2", null]}
              mr={[null, "4"]}
            />
          </Flex>
        </Box>

        <MaskListWithSorting
          headingComponent={
            <Text size="sm" fontWeight="bold">
              {collectionToNameMap[collection]
                ? `${masks.length} items in ${collectionToNameMap[collection]}`
                : "Select single collection"}
            </Text>
          }
          masks={masks}
          defaultSortBy="offeredPrice"
        />
      </Box>
    </>
  );
};

export default Index;
