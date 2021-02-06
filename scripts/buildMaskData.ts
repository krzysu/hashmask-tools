import { saveToFile } from "./shared/saveToFile";
import { Mask } from "../shared/types";

const DB_NAME = "hashmasks.json";
const dbData = require(`../db/${DB_NAME}`);

type RawMask = {
  index: string;
  "base-characterdisplayName": string;
  maskdisplayName: string;
  eyesdisplayName: string;
  skindisplayName: string;
  itemdisplayName: string;
};

const rawMasks = require(`../db/hashmasksRaw.json`) as RawMask[];

const STARTING_INDEX = 10141;
const TOTAL_MASKS = 16384;
const ALL_MASK_IDS = [...Array(TOTAL_MASKS).keys()].map((i) => i.toString());

// gets ID from url and returns Index of Image
const revealedMaskIndex = (id: string): string => {
  return ((Number(id) + STARTING_INDEX) % 16384).toString();
};

const prepareToSave = (data: Array<Mask | undefined>) => {
  return data
    .filter((i) => !!i)
    .reduce((acc, { id, ...mask }) => {
      return {
        ...acc,
        [id]: {
          ...mask,
        },
      };
    }, {});
};

const masks: Array<Mask | undefined> = ALL_MASK_IDS.map((id) => {
  const index = revealedMaskIndex(id);
  const rawMask = rawMasks.find((mask) => mask.index === index);

  if (!rawMask) {
    return;
  }

  return {
    id,
    index: index,
    character: rawMask["base-characterdisplayName"],
    mask: rawMask.maskdisplayName.replace("Mask: ", ""),
    eyes: rawMask.eyesdisplayName.replace("Eyes: ", ""),
    skin: rawMask.skindisplayName.replace("Skin Color: ", ""),
    item: rawMask.itemdisplayName.replace("Item: ", ""),
  };
});

const newData = prepareToSave(masks);

console.log(`Saving #${Object.keys(newData).length} hashmasks`);

saveToFile(
  {
    ...dbData,
    ...newData,
  },
  DB_NAME
);
