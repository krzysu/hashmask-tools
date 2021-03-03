import React, { FC } from "react";
import {
  Box,
  Checkbox,
  CheckboxGroup,
  Flex,
  Wrap,
  WrapItem,
} from "@chakra-ui/core";
import { useDataProvider } from "../context/DataProvider";
import { allTraits, getTraitTotal } from "../stats";
import { ANY_VALUE, FilterValues } from "../queries";
import { formatPrice } from "../model";
import { FilterItem } from "./Filters/FilterItem";
import { Traits } from "../../shared/types";

const anyItem = {
  value: ANY_VALUE,
  label: "Any",
};

const buildItems = (traitName: Traits) => [
  anyItem,
  ...[...allTraits[traitName]]
    .sort((a, b) => {
      return getTraitTotal(traitName)(a) - getTraitTotal(traitName)(b);
    })
    .map((item) => {
      return {
        value: allTraits[traitName].indexOf(item).toString(),
        label: `${item} (${getTraitTotal(traitName)(item)})`,
      };
    }),
];

type Props = {
  filterValues: FilterValues;
  onFilterChange: (traitName: Traits) => (newValue: string) => void;
  checkboxValue: string[];
  onCheckboxChange: (checked: string[]) => void;
};

export const Filters: FC<Props> = ({
  filterValues,
  onFilterChange,
  checkboxValue,
  onCheckboxChange,
}) => {
  const { prices } = useDataProvider();

  return (
    <Box pb="4">
      <Flex flexDirection={["column", null, "row"]} pb="4" wrap="wrap">
        <FilterItem
          label="Character"
          items={buildItems("character")}
          value={filterValues.character}
          onValueChange={onFilterChange("character")}
          mb={["2", null]}
          mr={[null, "4"]}
        />
        <FilterItem
          label="Mask"
          items={buildItems("mask")}
          value={filterValues.mask}
          onValueChange={onFilterChange("mask")}
          mb={["2", null]}
          mr={[null, "4"]}
        />
        <FilterItem
          label="Eyes"
          items={buildItems("eyes")}
          value={filterValues.eyes}
          onValueChange={onFilterChange("eyes")}
          mb={["2", null]}
          mr={[null, "4"]}
        />
        <FilterItem
          label="Skin"
          items={buildItems("skin")}
          value={filterValues.skin}
          onValueChange={onFilterChange("skin")}
          mb={["2", null]}
          mr={[null, "4"]}
        />
        <FilterItem
          label="Item"
          items={buildItems("item")}
          value={filterValues.item}
          onValueChange={onFilterChange("item")}
          mb={["2", null]}
          mr={[null, "4"]}
        />
      </Flex>

      <CheckboxGroup onChange={onCheckboxChange} value={checkboxValue}>
        <Wrap spacing="4">
          <WrapItem>
            <Checkbox value="isOffered">Is offered for sale</Checkbox>
          </WrapItem>
          <WrapItem>
            <Checkbox value="withSimilarImages">With similar images</Checkbox>
          </WrapItem>
          <WrapItem>
            <Checkbox value="isNftx">{`In NFTX fund (MASK price: ${formatPrice(
              prices["nftx-hashmasks-index"]?.eth || 0
            )})`}</Checkbox>
          </WrapItem>
          <WrapItem>
            <Checkbox value="isLowPrice">
              Under 5Ξ price, under 800 score
            </Checkbox>
          </WrapItem>
        </Wrap>
      </CheckboxGroup>
    </Box>
  );
};
