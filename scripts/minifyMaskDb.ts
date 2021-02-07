import { saveToFile } from "./shared/saveToFile";
import { Mask, MinifiedMask, MinifiedMasks, Traits } from "../shared/types";
import statDB from "../db/stats.json";
import scoreDB from "../db/rarityScore.json";

const maskDbData = require("../db/hashmasks.json") as Record<string, Mask>;

const DB_NAME = "hashmasks.min.json";

const allTraits = {
  character: statDB.characterStats.map((i) => i.character),
  mask: statDB.maskStats.map((i) => i.mask),
  eyes: statDB.eyesStats.map((i) => i.eyes),
  skin: statDB.skinStats.map((i) => i.skin),
  item: statDB.itemStats.map((i) => i.item),
};

const encode = (traitName: Traits) => (traitValue: string): number =>
  allTraits[traitName].findIndex((v: string) => v === traitValue);

const buildMask = (id: string): MinifiedMask => {
  const m = maskDbData[id];

  return [
    Number(id),
    Number(m.index),
    encode("character")(m.character),
    encode("mask")(m.mask),
    encode("eyes")(m.eyes),
    encode("skin")(m.skin),
    encode("item")(m.item),
    scoreDB.find((i) => i.id === id)?.score || 0,
  ];
};

const minifiedMasks = Object.keys(maskDbData).map((id) => buildMask(id));

const db = minifiedMasks.reduce((acc, minMask: MinifiedMask): MinifiedMasks => {
  return {
    ...acc,
    [minMask[0]]: minMask,
  };
}, {});

saveToFile(db, DB_NAME);
