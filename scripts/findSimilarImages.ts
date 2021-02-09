/// <reference types="./pixelmatch" />
/// <reference types="./pngjs" />

import fs from "fs";
import path from "path";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import { saveToFile } from "./shared/saveToFile";
import {
  ALL_MASK_IDS,
  getOtherMaskIds,
  revealedMaskIndex,
} from "./shared/maskUtils";
import { Similarity } from "../shared/types";

const DB_NAME = "similarImage.json";
const dbData = require(`../db/${DB_NAME}`);

const folderPath = path.resolve(__dirname, "../public/assets2");

const compareMaskImages = (id1: string, id2: string) => {
  const imagePath1 = `${folderPath}/${revealedMaskIndex(id1)}.png`;
  const imagePath2 = `${folderPath}/${revealedMaskIndex(id2)}.png`;

  try {
    const img1 = PNG.sync.read(fs.readFileSync(imagePath1));
    const img2 = PNG.sync.read(fs.readFileSync(imagePath2));

    const { width, height } = img1;
    return pixelmatch(img1.data, img2.data, null, width, height, {
      threshold: 0.1,
    });
  } catch (err) {
    console.log(err);
    return -1;
  }
};

const compareMaskToOthers = (
  maskId: string,
  otherMaskIds: string[]
): Similarity[] => {
  return otherMaskIds.map((id) => {
    const numDiffPixels = compareMaskImages(maskId, id);

    return {
      id,
      distance: numDiffPixels,
    };
  });
};

const TOTAL_SIMILARITIES_TO_STORE = 50;

const prepareToSave = (id: string, similarityData: Similarity[]) => {
  const similarTo = similarityData
    .sort((a, b) => {
      return a.distance - b.distance;
    })
    .slice(0, TOTAL_SIMILARITIES_TO_STORE);

  return {
    [id]: similarTo,
  };
};

const BATCH = [0, 1];

const main = async () => {
  const result = ALL_MASK_IDS.slice(...BATCH).reduce((acc, maskToCompare) => {
    console.info(`Comparing mask #${maskToCompare}`);

    const otherMaskIds = getOtherMaskIds(maskToCompare);
    const similarities = compareMaskToOthers(maskToCompare, otherMaskIds);

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
