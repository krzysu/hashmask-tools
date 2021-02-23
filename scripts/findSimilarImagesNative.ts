import path from "path";
import { diffImages } from "native-image-diff";
import { readPngFileSync, PngImage } from "node-libpng";
import { saveToFile } from "./shared/saveToFile";
import {
  ALL_MASK_IDS,
  getOtherMaskIds,
  revealedMaskIndex,
} from "./shared/maskUtils";

type SameTraits = {
  total: number;
  ids: number[];
};

const DB_NAME = "similarImage.json";
const dbData = require(`../db/${DB_NAME}`);
const sameTraitDB = require(`../db/sameTrait.json`) as Record<
  string,
  SameTraits
>;

const folderPath = path.resolve(__dirname, "../public/assets2");

const TOTAL_SIMILARITIES_TO_STORE = 20;

const loadImageForMaskId = (id: string) => {
  const imagePath1 = `${folderPath}/${revealedMaskIndex(id)}.png`;

  try {
    return readPngFileSync(imagePath1);
  } catch (err) {
    console.log(err);
    return false;
  }
};

const compareMaskImages = (image1: PngImage, image2: PngImage) => {
  try {
    return diffImages({
      image1,
      image2,
      colorThreshold: 0.1,
      generateDiffImage: false,
    });
  } catch (err) {
    console.log(err);
    return { totalDelta: -1 };
  }
};

type Similarity = {
  id: string;
  pixels: number;
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
      return { id, pixels: 0 };
    }

    const { totalDelta } = compareMaskImages(img1, img2);

    return {
      id,
      pixels: totalDelta,
    };
  });
};

const prepareToSave = (id: string, similarityData: Similarity[]) => {
  const similarTo = similarityData
    .sort((a, b) => {
      return a.pixels - b.pixels;
    })
    .slice(0, TOTAL_SIMILARITIES_TO_STORE);

  return {
    [id]: similarTo.map((item) => Number(item.id)),
  };
};

const maskHasSimilarImages = (id: string) => !dbData[id];

const findMasksWithSameTraitLessThan = (maskCount: number) =>
  Object.keys(sameTraitDB).filter((id) => sameTraitDB[id].total < maskCount);

const main = async () => {
  // get mask ids with less than N same trait masks
  // check if not similar images found yet
  // run the script for first N
  // manualy rerun the script

  const candidatesToRunTheScript = findMasksWithSameTraitLessThan(3); // ALL_MASK_IDS.slice(0, 100);
  const maskIdsToRunScript = candidatesToRunTheScript
    .filter(maskHasSimilarImages)
    .slice(0, 1);

  console.info(`Running for masks: `, maskIdsToRunScript);

  const result = maskIdsToRunScript.reduce((acc, maskToCompare) => {
    console.info(`Comparing mask #${maskToCompare}`);
    const startTime = process.hrtime();

    const otherMaskIds = getOtherMaskIds(maskToCompare);
    const similarities = compareMaskToOthers(maskToCompare, otherMaskIds);

    const endTime = process.hrtime(startTime);
    console.info("Execution time: %ds %dms", endTime[0], endTime[1] / 1000000);

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
