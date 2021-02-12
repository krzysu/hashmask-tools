import fs from "fs";
import fetch from "node-fetch";
import { Mask } from "../shared/types";

const dbData = require(`../db/hashmasks.json`) as Record<string, Mask>;
const DESTINATION_FOLDER = "./public/assets/";
const URI = "https://hashmasksstore.blob.core.windows.net/hashmaskspreview/";

const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const ERRORS: string[] = [];

const downloadAsync = async (mask: Mask, callback: () => void) => {
  const filename = `${mask.index}.png`;
  const uri = `${URI}${filename}`;
  const destination = `${DESTINATION_FOLDER}${filename}`;

  try {
    const response = await fetch(uri);
    const buffer = await response.buffer();
    fs.writeFile(destination, buffer, callback);
  } catch (err) {
    console.error(err);
    ERRORS.push(mask.id || "unknown");
  }
};

const TOTAL_MASKS = 16384;
const ALL_MASK_IDS = [...Array(TOTAL_MASKS).keys()].map((i) => i.toString());

const FAILED_IDS = [];
const BATCH = [14000, TOTAL_MASKS];
const DELAY = 1000;

const main = async () => {
  await Promise.all(
    // ALL_MASK_IDS.slice(...BATCH).map(async (id, index) => {
    FAILED_IDS.map(async (id, index) => {
      const fullMask = {
        id,
        ...dbData[id],
      } as Mask;

      await sleep(DELAY * index);

      console.log(`Download started for mask #${id}`);

      await downloadAsync(fullMask, () => {
        console.log(
          `Image for mask #${id} downloaded as ${fullMask.index}.png`
        );
      });
    })
  );

  console.log(`Finished with errors for ids: ${ERRORS.join(", ")}`);
};

main();
