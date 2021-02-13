import React, { FC, useCallback, useEffect, useState } from "react";
import Head from "next/head";
import { Box, Button, Flex, Heading, Spinner, Text } from "@chakra-ui/core";
import { MaskList } from "../components/MaskList";
import { Filters } from "../components/Filters";
import { SortByItem } from "../components/Filters/SortByItem";
import { ANY_VALUE, FilterValues, queryMasks, SortBy } from "../queries";
import { Traits, ViewMask } from "../../shared/types";

const defaultFilterValues: FilterValues = {
  character: ANY_VALUE,
  mask: ANY_VALUE,
  eyes: ANY_VALUE,
  skin: ANY_VALUE,
  item: ANY_VALUE,
};

const BrowsePage: FC = () => {
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
  const [sortBy, setSortBy] = useState<SortBy>("id");

  useEffect(() => {
    const { items, total, hasMore, lastIndex } = queryMasks({
      filterValues,
      startIndex,
      sortBy,
      isOffered,
      isLowPrice,
    });
    setMasks(items);
    setHasMore(hasMore);
    setTotal(total);
    setLastIndex(lastIndex);
    setIsLoading(false);
  }, [filterValues, isOffered, isLowPrice, sortBy, startIndex]);

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
