import { saveToFile } from "./shared/saveToFile";
import { Mask, MinifiedMask, MinifiedMasks, Traits } from "../shared/types";
import statsDB from "../db/stats.json";
import scoreDB from "../db/rarityScore.json";

const maskDbData = require("../db/hashmasks.json") as Record<string, Mask>;

const DB_NAME = "hashmasks.min.json";

const allTraits = {
  character: statsDB.character.map((i) => i.name),
  mask: statsDB.mask.map((i) => i.name),
  eyes: statsDB.eyes.map((i) => i.name),
  skin: statsDB.skin.map((i) => i.name),
  item: statsDB.item.map((i) => i.name),
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
