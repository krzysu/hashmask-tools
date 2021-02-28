import React, { FC, useCallback, useEffect, useRef, useState } from "react";
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
  const [page, setPage] = useState<number>(0);
  const [filterValues, setFilterValues] = useState<FilterValues>(
    defaultFilterValues
  );
  const [isOffered, setIsOffered] = useState<boolean>(false);
  const [isLowPrice, setIsLowPrice] = useState<boolean>(false);
  const [withSimilarImages, setWithSimilarImages] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortBy>("id");

  const scrollToRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const { items, total, hasMore } = queryMasks({
      openseaDB,
      filterValues,
      sortBy,
      isOffered,
      isLowPrice,
      withSimilarImages,
      page,
    });
    setMasks(items);
    setHasMore(hasMore);
    setTotal(total);
    setIsLoading(false);
  }, [
    openseaDB,
    filterValues,
    isOffered,
    isLowPrice,
    withSimilarImages,
    sortBy,
    page,
  ]);

  useEffect(() => {
    if (scrollToRef.current && page > 0) {
      scrollToRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [page, scrollToRef]);

  const nextPage = () => setPage(page + 1);
  const prevPage = () => setPage(page - 1);

  const handleFilterChange = useCallback(
    (traitName: Traits) => (traitIndex: string) => {
      setFilterValues({
        ...filterValues,
        [traitName]: traitIndex,
      });
      setPage(0);
    },
    [filterValues]
  );

  const handleCheckboxChange = useCallback((checked: string[]) => {
    checked.includes("isOffered") ? setIsOffered(true) : setIsOffered(false);
    checked.includes("isLowPrice") ? setIsLowPrice(true) : setIsLowPrice(false);
    checked.includes("withSimilarImages")
      ? setWithSimilarImages(true)
      : setWithSimilarImages(false);

    setPage(0);
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
          <Text size="sm" fontWeight="bold" ref={scrollToRef}>
            {`Found ${total} items`}
          </Text>
          <Box pb={["4", "0"]}>
            <SortByItem value={sortBy} onValueChange={setSortBy} />
          </Box>
        </Flex>
        <MaskList masks={masks} pb="12" />
        <Flex justifyContent="center">
          {page > 0 && (
            <Button onClick={prevPage} mr="6">
              Previous page
            </Button>
          )}
          {hasMore && <Button onClick={nextPage}>Next page</Button>}
        </Flex>
      </Box>
    </>
  );
};

export default BrowsePage;
