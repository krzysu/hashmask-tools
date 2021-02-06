import { saveToFile } from "./shared/saveToFile";
import { Mask } from "../shared/types";

type MaskKey = keyof Mask;

const dbData = require(`../db/hashmasks.json`) as Record<string, Mask>;

const allUnique = (traitName: MaskKey) => () =>
  Object.values(dbData).reduce((set, mask: Mask) => {
    set.add(mask[traitName]);
    return set;
  }, new Set());

const filterBy = (traitName: MaskKey) => (character: string) =>
  Object.values(dbData).filter((mask) => mask[traitName] === character);

const allCount = (traitName: MaskKey) => () => {
  const allUniqueTraits = [...allUnique(traitName)()] as string[];

  return allUniqueTraits.map((trait) => {
    const withCharacter = filterBy(traitName)(trait);
    return { [traitName]: trait, count: withCharacter.length };
  });
};

const characterStats = allCount("character")();
const maskStats = allCount("mask")();
const eyesStats = allCount("eyes")();
const skinStats = allCount("skin")();
const itemStats = allCount("item")();

console.log(characterStats);
console.log(maskStats);
console.log(eyesStats);
console.log(skinStats);
console.log(itemStats);

saveToFile(
  {
    characterStats,
    maskStats,
    eyesStats,
    skinStats,
    itemStats,
  },
  "stats.json"
);
