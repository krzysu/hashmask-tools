/// <reference types="./pixelmatch" />
/// <reference types="./pngjs" />

import fs from "fs";
import path from "path";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import { saveToFile } from "../shared/saveToFile";

const DB_NAME = "similar-image.json";
const dbData = require(`../../db/${DB_NAME}`);

const TOTAL_PUNKS = 10000;
const TOTAL_SIMILARITIES_TO_STORE = 50;
const ALL_PUNK_IDS = [...Array(TOTAL_PUNKS).keys()].map((i) => i.toString());

const getOtherPunkIds = (punkId: string) =>
  ALL_PUNK_IDS.filter((id) => id !== punkId);

const folderPath = path.resolve(__dirname, "../../public");

const comparePunkImages = (id1: string, id2: string) => {
  const imagePath1 = `${folderPath}/punk${id1.padStart(3, "0")}.png`;
  const imagePath2 = `${folderPath}/punk${id2.padStart(3, "0")}.png`;

  const img1 = PNG.sync.read(fs.readFileSync(imagePath1));
  const img2 = PNG.sync.read(fs.readFileSync(imagePath2));
  const { width, height } = img1;

  return pixelmatch(img1.data, img2.data, null, width, height, {
    threshold: 0.1,
  });
};

type Similarity = {
  punkIndex: string;
  distance: number;
};

const comparePunkToOthers = (
  punkId: string,
  otherPunkIds: string[]
): Similarity[] => {
  return otherPunkIds.map((id) => {
    const numDiffPixels = comparePunkImages(punkId, id);

    return {
      punkIndex: id,
      distance: numDiffPixels,
    };
  });
};

const prepareToSave = (punkIndex: string, similarityData: Similarity[]) => {
  const similarTo = similarityData
    .sort((a, b) => {
      return a.distance - b.distance;
    })
    .slice(0, TOTAL_SIMILARITIES_TO_STORE);

  return {
    [punkIndex]: {
      similarTo,
    },
  };
};

const BATCH = [9000, 10000];

const main = async () => {
  const result = ALL_PUNK_IDS.slice(...BATCH).reduce((acc, punkToCompare) => {
    console.info(`Comparing punk #${punkToCompare}`);

    const otherPunks = getOtherPunkIds(punkToCompare);
    const similarities = comparePunkToOthers(punkToCompare, otherPunks);

    return {
      ...acc,
      ...prepareToSave(punkToCompare, similarities),
    };
  }, {});

  const db = {
    ...dbData,
    ...result,
  };

  saveToFile(db, DB_NAME);
};

main();
