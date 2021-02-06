import React, { FC } from "react";
import { Text, SimpleGrid, SimpleGridProps } from "@chakra-ui/core";
import { MaskItem } from "../components/MaskItem";
import { ViewMask } from "../../shared/types";

type Props = {
  masks: ViewMask[];
};

export const MaskList: FC<Props & SimpleGridProps> = ({ masks, ...rest }) => {
  return (
    <SimpleGrid columns={[2, 3, 4, 5]} spacing="6" {...rest}>
      {masks.length === 0 && <Text fontSize="lg">Nothing found</Text>}
      {masks?.map((mask) => (
        <MaskItem key={mask.id} mask={mask} />
      ))}
    </SimpleGrid>
  );
};
