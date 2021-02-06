import statDB from "../db/stats.json";

export const allTraits = {
  character: statDB.characterStats.map((i) => i.character),
  mask: statDB.maskStats.map((i) => i.mask),
  eyes: statDB.eyesStats.map((i) => i.eyes),
  skin: statDB.skinStats.map((i) => i.skin),
  item: statDB.itemStats.map((i) => i.item),
};
