import React, { FC, ReactNode, useCallback, useEffect, useState } from "react";
import { Flex, Heading } from "@chakra-ui/core";
import { SortByItem } from "./Filters/SortByItem";
import { MaskList } from "./MaskList";

import { SortBy, sortMasks } from "../queries";
import { ViewMask } from "../../shared/types";

type Props = {
  masks: ViewMask[];
  heading?: string;
  headingComponent?: ReactNode;
  limit?: number;
  defaultSortBy?: SortBy;
};

const sliceMaybe = (list: ViewMask[], limit?: number) =>
  limit ? list.slice(0, limit) : list;

export const MaskListWithSorting: FC<Props> = ({
  masks,
  heading,
  headingComponent,
  limit,
  defaultSortBy = "default",
}) => {
  const [renderedMasks, setRenderedMasks] = useState<ViewMask[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>(defaultSortBy);

  useEffect(() => {
    setRenderedMasks(sortMasks(masks, defaultSortBy));
    setSortBy(defaultSortBy);
  }, [masks, defaultSortBy]);

  const handleSortChange = useCallback(
    (newSortBy) => {
      const sortedMasks = sortMasks(masks, newSortBy);
      setSortBy(newSortBy);
      setRenderedMasks(sortedMasks);
    },
    [masks]
  );

  return (
    <>
      <Flex
        pb="8"
        flexDirection={["column", "row"]}
        justifyContent="space-between"
        alignItems="center"
      >
        {heading && <Heading mb={["6", "0"]}>{heading}</Heading>}
        {headingComponent}
        <SortByItem
          value={sortBy}
          onValueChange={handleSortChange}
          withDefault={defaultSortBy === "default"}
        />
      </Flex>
      <MaskList masks={sliceMaybe(renderedMasks, limit)} />
    </>
  );
};
