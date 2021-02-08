import React, { FC, useCallback, useState } from "react";
import { Flex, Heading } from "@chakra-ui/core";
import { SortByItem } from "./Filters/SortByItem";
import { MaskList } from "./MaskList";

import { SortBy, sortMasks } from "../queries";
import { ViewMask } from "../../shared/types";

type Props = {
  masks: ViewMask[];
  heading: string;
  limit?: number;
};

const sliceMaybe = (list: ViewMask[], limit?: number) =>
  limit ? list.slice(0, limit) : list;

export const MaskListWithSorting: FC<Props> = ({ masks, heading, limit }) => {
  const [renderedMasks, setRenderedMasks] = useState<ViewMask[]>(masks);
  const [sortBy, setSortBy] = useState<SortBy>("default");

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
      >
        <Heading mb={["6", "0"]}>{heading}</Heading>
        <SortByItem
          value={sortBy}
          onValueChange={handleSortChange}
          withDefault
        />
      </Flex>
      <MaskList masks={sliceMaybe(renderedMasks, limit)} />
    </>
  );
};
