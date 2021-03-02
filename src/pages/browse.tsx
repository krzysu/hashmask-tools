import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Spinner,
  Text,
} from "@chakra-ui/core";
import { Traits, ViewMask } from "../../shared/types";
import { MaskList } from "../components/MaskList";
import { Filters } from "../components/Filters";
import { SortByItem } from "../components/Filters/SortByItem";
import { useDataProvider } from "../context/DataProvider";
import {
  ANY_VALUE,
  defaultFilterValues,
  FilterValues,
  queryMasks,
  SortBy,
} from "../queries";

const queryToFilterValues = ({
  character = ANY_VALUE,
  mask = ANY_VALUE,
  eyes = ANY_VALUE,
  skin = ANY_VALUE,
  item = ANY_VALUE,
}): FilterValues => {
  return {
    ...defaultFilterValues,
    character,
    mask,
    eyes,
    skin,
    item,
  };
};

const BrowsePage: FC = () => {
  const router = useRouter();
  const { openseaDB, nftxDB } = useDataProvider();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [masks, setMasks] = useState<ViewMask[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);

  const filterValues = useMemo(() => queryToFilterValues(router.query), [
    router.query,
  ]);

  const isOffered = Boolean(Number(router.query.isOffered)) || false;
  const isLowPrice = Boolean(Number(router.query.isLowPrice)) || false;
  const withSimilarImages =
    Boolean(Number(router.query.withSimilarImages)) || false;
  const isNftx = Boolean(Number(router.query.isNftx)) || false;
  const sortBy = (router.query.sort as SortBy) || "id";
  const page = Number(router.query.page as string) || 0;

  useEffect(() => {
    const { items, total, hasMore } = queryMasks({
      openseaDB,
      nftxDB,
      filterValues,
      sortBy,
      isOffered,
      isLowPrice,
      withSimilarImages,
      isNftx,
      page,
    });
    setMasks(items);
    setHasMore(hasMore);
    setTotal(total);
    setIsLoading(false);
  }, [
    openseaDB,
    nftxDB,
    filterValues,
    sortBy,
    isOffered,
    isLowPrice,
    withSimilarImages,
    isNftx,
    page,
  ]);

  const routerReplace = useCallback(
    (params: {}) => {
      router.replace({
        pathname: router.pathname,
        query: {
          ...router.query,
          ...params,
        },
      });
    },
    [router]
  );

  const nextPage = useCallback(() => {
    setIsLoading(true);
    routerReplace({
      page: Number(page) + 1,
    });
  }, [routerReplace]);

  const prevPage = useCallback(() => {
    setIsLoading(true);
    routerReplace({
      page: Number(page) - 1,
    });
  }, [routerReplace]);

  const handleFilterChange = useCallback(
    (traitName: Traits) => (traitIndex: string) => {
      routerReplace({
        [traitName]: traitIndex,
        page: 0,
      });
    },
    [routerReplace]
  );

  const handleCheckboxChange = useCallback(
    (checked: string[]) => {
      routerReplace({
        isOffered: Number(checked.includes("isOffered")),
        isLowPrice: Number(checked.includes("isLowPrice")),
        withSimilarImages: Number(checked.includes("withSimilarImages")),
        isNftx: Number(checked.includes("isNftx")),
        page: 0,
      });
    },
    [routerReplace]
  );

  const handleSortByChange = useCallback(
    (newSortBy) => {
      routerReplace({
        sort: newSortBy,
        page: 0,
      });
    },
    [routerReplace]
  );

  const clearAllFilters = useCallback(() => {
    router.replace({
      pathname: router.pathname,
    });
  }, [router]);

  const hasAnyFilters = Object.keys(router.query).length > 0;

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
  if (isNftx) {
    checkboxValue.push("isNftx");
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
          <Text size="sm">
            <Text as="span" fontWeight="bold">
              {`Found ${total} items`}
              {page > 0 && `, showing page ${page + 1}`}
            </Text>
            {hasAnyFilters && (
              <>
                {" | "}
                <Link onClick={clearAllFilters} textDecoration="underline">
                  Clear all filters
                </Link>
              </>
            )}
          </Text>
          <Box pb={["4", "0"]}>
            <SortByItem value={sortBy} onValueChange={handleSortByChange} />
          </Box>
        </Flex>
        <MaskList masks={masks} pb="12" />
        <Flex justifyContent="center">
          {page > 0 && (
            <Button onClick={prevPage} mx="3">
              Previous page
            </Button>
          )}
          {hasMore && (
            <Button onClick={nextPage} mx="3">
              Next page
            </Button>
          )}
        </Flex>
      </Box>
    </>
  );
};

export default BrowsePage;
