import { saveToFile } from "./shared/saveToFile";
import { Mask } from "./types";

const maskDbData = require(`../db/hashmasks.json`) as Record<string, Mask>;

const DB_NAME = "sameTrait.json";
const dbData = require(`../db/${DB_NAME}`);

const TOTAL_MASKS = 16384;
const ALL_MASK_IDS = [...Array(TOTAL_MASKS).keys()].map((i) => i.toString());

const getOtherMaskIds = (maskId: string) =>
  ALL_MASK_IDS.filter((id) => id !== maskId);

const isEqual = (obj1, obj2) => {
  let props1 = Object.getOwnPropertyNames(obj1);
  let props2 = Object.getOwnPropertyNames(obj2);

  if (props1.length != props2.length) {
    return false;
  }
  for (let i = 0; i < props1.length; i++) {
    let prop = props1[i] as keyof Mask;

    if (obj1[prop] !== obj2[prop]) {
      return false;
    }
  }

  return true;
};

const compareMaskToOthers = (
  maskId: string,
  otherMaskIds: string[]
): string[] => {
  const maskToCompare = maskDbData[maskId];
  const { id, index, ...maskTraits } = maskToCompare;

  return otherMaskIds.filter((otherMaskId) => {
    const currentMask = maskDbData[otherMaskId];
    const { id, index, ...currentMaskTraits } = currentMask;

    // compare all traits
    return isEqual(maskTraits, currentMaskTraits);
  });
};

const prepareToSave = (id: string, similarityData: string[]) => {
  return {
    [id]: similarityData.map((s: string) => Number(s)).sort(),
  };
};

const BATCH = [0, TOTAL_MASKS];

const main = () => {
  const result = ALL_MASK_IDS.slice(...BATCH).reduce((acc, maskToCompare) => {
    console.info(`Comparing mask #${maskToCompare}`);

    const otherMasks = getOtherMaskIds(maskToCompare);
    const similarities = compareMaskToOthers(maskToCompare, otherMasks);

    return {
      ...acc,
      ...prepareToSave(maskToCompare, similarities),
    };
  }, {});

  const db = {
    ...dbData,
    ...result,
  };

  saveToFile(db, DB_NAME);
};

main();
