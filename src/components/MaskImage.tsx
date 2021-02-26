import React, { FC } from "react";
import {
  Image,
  ImageProps,
  Spinner,
  Center,
  CenterProps,
} from "@chakra-ui/core";
import { ViewMask } from "../../shared/types";

type Props = {
  mask: ViewMask;
  fallbackProps?: CenterProps;
};

export const MaskImage: FC<Props & ImageProps> = ({
  mask,
  fallbackProps,
  ...rest
}) => {
  const imgUrl =
    process.env.NODE_ENV === "development"
      ? `/assets/${mask.index}.png`
      : `https://hashmasksstore.blob.core.windows.net/hashmaskspreview/${mask.index}.png`;

  return (
    <Image
      src={imgUrl}
      alt={`Hashmask #${mask.id}`}
      fallback={
        <Center {...fallbackProps}>
          <Spinner thickness="4px" size="xl" />
        </Center>
      }
      {...rest}
    />
  );
};
