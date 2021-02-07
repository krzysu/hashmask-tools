import { sameTraitDB, statsDB } from "./db";

export const allTraits = {
  character: statsDB.characterStats.map((i) => i.character),
  mask: statsDB.maskStats.map((i) => i.mask),
  eyes: statsDB.eyesStats.map((i) => i.eyes),
  skin: statsDB.skinStats.map((i) => i.skin),
  item: statsDB.itemStats.map((i) => i.item),
};

export const totalSameTraitMasks = (id: string): number =>
  sameTraitDB[id].total;
