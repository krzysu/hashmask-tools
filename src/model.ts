import { allTraits } from "./stats";
import { minMasksDB, sameTraitDB } from "./db";
import { ViewMask, MinifiedMask, Traits } from "../shared/types";

const decode = (traitName: Traits) => (traitIndex: number): string =>
  allTraits[traitName][traitIndex];

export const buildMask = (id: string): ViewMask => {
  const minMask = minMasksDB[id] as MinifiedMask;

  if (!minMask) {
    throw Error(`Mask with id "${id}" not found`);
  }

  return {
    id,
    index: minMask[1].toString(),
    character: decode("character")(minMask[2]),
    mask: decode("mask")(minMask[3]),
    eyes: decode("eyes")(minMask[4]),
    skin: decode("skin")(minMask[5]),
    item: decode("item")(minMask[6]),
    score: minMask[7],
    lastPrice: undefined,
    offeredPrice: undefined,
  };
};

export const formatPrice = (price: number): string => `${price}Ξ`;

export const buildSameTraitMasks = (id: string): ViewMask[] => {
  return sameTraitDB[id].map((sameTraitId) =>
    buildMask(sameTraitId.toString())
  );
};
