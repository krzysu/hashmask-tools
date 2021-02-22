import { allTraits } from "./stats";
import { minMasksDB } from "./db";
import { ViewMask, Traits } from "../shared/types";

const decode = (traitName: Traits) => (traitIndex: number): string =>
  allTraits[traitName][traitIndex];

export const buildMask = (
  id: string,
  openseaDB: Record<string, number[]> = {}
): ViewMask => {
  const minMask = minMasksDB[id];
  const prices = openseaDB[id] || [0, 0];

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
    lastPrice: prices[1] !== 0 ? prices[1] : undefined,
    offeredPrice: prices[0] !== 0 ? prices[0] : undefined,
  };
};

export const formatPrice = (price: number): string => `${price}Ξ`;
