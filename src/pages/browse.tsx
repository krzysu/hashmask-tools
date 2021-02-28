import React, { FC, useCallback, useEffect, useState } from "react";
import Head from "next/head";
import { Box, Button, Flex, Heading, Spinner, Text } from "@chakra-ui/core";
import { Traits, ViewMask } from "../../shared/types";
import { MaskList } from "../components/MaskList";
import { Filters } from "../components/Filters";
import { SortByItem } from "../components/Filters/SortByItem";
import { useDataProvider } from "../context/DataProvider";
import {
  defaultFilterValues,
  FilterValues,
  queryMasks,
  SortBy,
} from "../queries";

const BrowsePage: FC = () => {
  const { openseaDB } = useDataProvider();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [masks, setMasks] = useState<ViewMask[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [lastIndex, setLastIndex] = useState<number>(0);
  const [startIndex, setStartIndex] = useState<number>(0);
  const [filterValues, setFilterValues] = useState<FilterValues>(
    defaultFilterValues
  );
  const [isOffered, setIsOffered] = useState<boolean>(false);
  const [isLowPrice, setIsLowPrice] = useState<boolean>(false);
  const [withSimilarImages, setWithSimilarImages] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortBy>("id");

  useEffect(() => {
    const { items, total, hasMore, lastIndex } = queryMasks({
      openseaDB,
      filterValues,
      startIndex,
      sortBy,
      isOffered,
      isLowPrice,
      withSimilarImages,
    });
    setMasks(items);
    setHasMore(hasMore);
    setTotal(total);
    setLastIndex(lastIndex);
    setIsLoading(false);
  }, [
    openseaDB,
    filterValues,
    isOffered,
    isLowPrice,
    withSimilarImages,
    sortBy,
    startIndex,
  ]);

  // will trigger effect
  const showMore = () => setStartIndex(lastIndex);

  const handleFilterChange = useCallback(
    (traitName: Traits) => (traitIndex: string) => {
      setFilterValues({
        ...filterValues,
        [traitName]: traitIndex,
      });
      setStartIndex(0);
      setLastIndex(0);
    },
    [filterValues]
  );

  const handleCheckboxChange = useCallback((checked: string[]) => {
    checked.includes("isOffered") ? setIsOffered(true) : setIsOffered(false);
    checked.includes("isLowPrice") ? setIsLowPrice(true) : setIsLowPrice(false);
    checked.includes("withSimilarImages")
      ? setWithSimilarImages(true)
      : setWithSimilarImages(false);

    setStartIndex(0);
    setLastIndex(0);
  }, []);

  const checkboxValue = [];
  if (isOffered) {
    checkboxValue.push("isOffered");
  }
  if (isLowPrice) {
    checkboxValue.push("isLowPrice");
  }
  if (withSimilarImages) {
    checkboxValue.push("withSimilarImages");
  }

  if (isLoading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="300px">
        <Spinner thickness="4px" size="xl" />
      </Flex>
    );
  }

  return (
    <>
      <Head>
        <title>{`HashmaskTools - Browse`}</title>
      </Head>

      <Box>
        <Heading mb="8">Browse</Heading>
        <Filters
          filterValues={filterValues}
          onFilterChange={handleFilterChange}
          checkboxValue={checkboxValue}
          onCheckboxChange={handleCheckboxChange}
        />
        <Flex
          justifyContent="space-between"
          alignItems={["flex-start", "center"]}
          flexDirection={["column-reverse", "row"]}
          pb="8"
        >
          <Text size="sm" fontWeight="bold">
            {`Found ${total} items`}
          </Text>
          <Box pb={["4", "0"]}>
            <SortByItem value={sortBy} onValueChange={setSortBy} />
          </Box>
        </Flex>
        <MaskList masks={masks} pb="12" />
        {hasMore && (
          <Flex justifyContent="center">
            <Button onClick={showMore}>Show more</Button>
          </Flex>
        )}
      </Box>
    </>
  );
};

export default BrowsePage;
