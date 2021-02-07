import React, { FC } from "react";
import { Select, Text, Wrap, WrapItem, WrapProps } from "@chakra-ui/core";

type Item = {
  value: string;
  label: string;
};

type Props = {
  value: any;
  onValueChange: (newValue: any) => void;
  label: string;
  items: Item[];
};

export const FilterItem: FC<Props & WrapProps> = ({
  value,
  onValueChange,
  label,
  items,
  ...rest
}) => (
  <Wrap spacing="2" align="center" {...rest}>
    <WrapItem>
      <Text fontWeight="bold">{label}</Text>
    </WrapItem>
    <WrapItem>
      <Select onChange={(e) => onValueChange(e.target.value)} value={value}>
        {items.map((item) => (
          <option key={item.label} value={item.value}>
            {item.label}
          </option>
        ))}
      </Select>
    </WrapItem>
  </Wrap>
);
