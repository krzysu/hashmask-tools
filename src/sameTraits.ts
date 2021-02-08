import { minMasksDB } from "./db";
import { MinifiedMask } from "../shared/types";

const TOTAL_MASKS = 16384;
const ALL_MASK_IDS = [...Array(TOTAL_MASKS).keys()].map((i) => i.toString());

const getOtherMaskIds = (maskId: string) =>
  ALL_MASK_IDS.filter((id) => id !== maskId);

const isEqual = (a1: ComparableMask, a2: ComparableMask) => {
  return JSON.stringify(a1) === JSON.stringify(a2);
};

type Character = number;
type MaskTrait = number;
type Eyes = number;
type Skin = number;
type Item = number;

type ComparableMask = [Character, MaskTrait, Eyes, Skin, Item];

// remove id, index and score
const keepTraitsOnly = (minMask: MinifiedMask): ComparableMask => {
  return [minMask[2], minMask[3], minMask[4], minMask[5], minMask[6]];
};

const compareMaskToOthers = (
  maskId: string,
  otherMaskIds: string[]
): string[] => {
  const maskTraits = keepTraitsOnly(minMasksDB[maskId]);

  return otherMaskIds.filter((otherMaskId) => {
    const currentMaskTraits = keepTraitsOnly(minMasksDB[otherMaskId]);

    return isEqual(maskTraits, currentMaskTraits);
  });
};

export const getSameTraitMaskIds = (id: string): string[] => {
  const otherMaskIds = getOtherMaskIds(id);
  return compareMaskToOthers(id, otherMaskIds);
};
