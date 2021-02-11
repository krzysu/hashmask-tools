import fs from "fs";
import path from "path";
import pixelmatch from "pixelmatch";
import { PNG, PNGWithMetadata } from "pngjs";
import { saveToFile } from "./shared/saveToFile";
import {
  ALL_MASK_IDS,
  getOtherMaskIds,
  revealedMaskIndex,
} from "./shared/maskUtils";

const DB_NAME = "similarImage.json";
const dbData = require(`../db/${DB_NAME}`);

const folderPath = path.resolve(__dirname, "../public/assets2");

const loadImageForMaskId = (id: string) => {
  const imagePath1 = `${folderPath}/${revealedMaskIndex(id)}.png`;

  try {
    return PNG.sync.read(fs.readFileSync(imagePath1));
  } catch (err) {
    console.log(err);
    return false;
  }
};

const compareMaskImages = (img1: PNGWithMetadata, img2: PNGWithMetadata) => {
  try {
    const { width, height } = img1;
    return pixelmatch(img1.data, img2.data, null, width, height, {
      threshold: 0.4,
    });
  } catch (err) {
    console.log(err);
    return -1;
  }
};

type Similarity = {
  id: string;
  distance: number;
};

const compareMaskToOthers = (
  maskId: string,
  otherMaskIds: string[]
): Similarity[] => {
  const img1 = loadImageForMaskId(maskId);
  if (!img1) {
    throw "Image not found";
  }

  return otherMaskIds.map((id) => {
    const img2 = loadImageForMaskId(id);
    if (!img2) {
      return { id, distance: 0 };
    }

    const numDiffPixels = compareMaskImages(img1, img2);

    return {
      id,
      distance: numDiffPixels,
    };
  });
};

const TOTAL_SIMILARITIES_TO_STORE = 20;

const prepareToSave = (id: string, similarityData: Similarity[]) => {
  const similarTo = similarityData
    .sort((a, b) => {
      return a.distance - b.distance;
    })
    .slice(0, TOTAL_SIMILARITIES_TO_STORE);

  return {
    [id]: similarTo.map((item) => Number(item.id)),
  };
};

const BATCH = [0, 10];
const IDS = ["6718"];

const main = async () => {
  const result = ALL_MASK_IDS.slice(...BATCH).reduce((acc, maskToCompare) => {
    // const result = IDS.reduce((acc, maskToCompare) => {
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
