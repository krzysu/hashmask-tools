import { saveToFile } from "./shared/saveToFile";
import { Mask, StatItem, Traits } from "../shared/types";

const dbData = require(`../db/hashmasks.json`) as Record<string, Mask>;

const allUnique = (traitName: Traits) => () =>
  Object.values(dbData).reduce((set, mask: Mask) => {
    set.add(mask[traitName]);
    return set;
  }, new Set());

const filterBy = (traitName: Traits) => (character: string) =>
  Object.values(dbData).filter((mask) => mask[traitName] === character);

const allCount = (traitName: Traits) => (): StatItem[] => {
  const allUniqueTraits = [...allUnique(traitName)()] as string[];

  return allUniqueTraits.map((trait) => {
    const withTrait = filterBy(traitName)(trait);
    return { name: trait, count: withTrait.length };
  });
};

const character = allCount("character")();
const mask = allCount("mask")();
const eyes = allCount("eyes")();
const skin = allCount("skin")();
const item = allCount("item")();

console.log(character);
console.log(mask);
console.log(eyes);
console.log(skin);
console.log(item);

saveToFile(
  {
    character,
    mask,
    eyes,
    skin,
    item,
  },
  "stats.json"
);
