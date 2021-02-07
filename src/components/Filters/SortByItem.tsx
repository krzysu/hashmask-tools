import React, { FC } from "react";
import { FilterItem } from "./FilterItem";
import { SortBy } from "../../queries";

type Item = {
  value: SortBy;
  label: string;
};

const defaultItem: Item = {
  value: "default",
  label: "Default",
};

const sortItems: Item[] = [
  {
    value: "id",
    label: "#Id",
  },
  {
    value: "score",
    label: "Rarity Score",
  },
  {
    value: "offeredPrice",
    label: "Offered Price",
  },
];

type Props = {
  value: SortBy;
  onValueChange: (newValue: SortBy) => void;
  withDefault?: boolean;
};

export const SortByItem: FC<Props> = ({
  value,
  onValueChange,
  withDefault,
}) => {
  return (
    <FilterItem
      label="Sort by"
      items={withDefault ? [defaultItem, ...sortItems] : sortItems}
      value={value}
      onValueChange={onValueChange}
    />
  );
};
