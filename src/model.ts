import { allTraits } from "./stats";
import { minMasksDB, offersDB, similarImageDb } from "./db";
import { getSameTraitMaskIds } from "./sameTraits";
import { ViewMask, Traits } from "../shared/types";

const decode = (traitName: Traits) => (traitIndex: number): string =>
  allTraits[traitName][traitIndex];

export const buildMask = (id: string): ViewMask => {
  const minMask = minMasksDB[id];

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
    offeredPrice: offersDB[id],
  };
};

export const formatPrice = (price: number): string => `${price}Ξ`;

export const buildSameTraitMasks = (id: string): ViewMask[] => {
  const sameTraitMaskIds = getSameTraitMaskIds(id);
  return sameTraitMaskIds.map((sameTraitId) => buildMask(sameTraitId));
};

export const buildSimilarImageMasks = (id: string): ViewMask[] => {
  return similarImageDb[id]
    ? similarImageDb[id].map((similarity) => buildMask(similarity.id))
    : [];
};
