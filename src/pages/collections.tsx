import React, { FC, useCallback, useMemo, useState } from "react";
import Head from "next/head";
import { Box, Heading, Text } from "@chakra-ui/core";
import { FilterItem } from "../components/Filters/FilterItem";
import { MaskListWithSorting } from "../components/MaskListWithSorting";
import {
  buildCollectionSelectItems,
  buildMasksFromCollection,
  Collection,
} from "../collections";
import { ViewMask } from "../../shared/types";

const DEFAULT_COLLECTION: Collection = "flowers";

const Index: FC = () => {
  const [masks, setMasks] = useState<ViewMask[]>(
    buildMasksFromCollection(DEFAULT_COLLECTION)
  );
  const [collection, setColection] = useState<Collection>(DEFAULT_COLLECTION);

  const collectionItems = useMemo(() => buildCollectionSelectItems(), []);

  const handleChange = useCallback((name) => {
    setColection(name);
    setMasks(buildMasksFromCollection(name));
  }, []);

  return (
    <>
      <Head>
        <title>{`HashmaskTools - Collections`}</title>
      </Head>

      <Box>
        <Heading mb="8">Collections</Heading>

        <Box pb="6">
          <FilterItem
            label="Collection"
            value={collection}
            onValueChange={handleChange}
            items={collectionItems}
          />
        </Box>

        <MaskListWithSorting
          headingComponent={
            <Text size="sm" fontWeight="bold">
              {`Found ${masks.length} items`}
            </Text>
          }
          masks={masks}
          defaultSortBy="id"
        />
      </Box>
    </>
  );
};

export default Index;
