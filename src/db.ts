import minMasksJson from "../db/hashmasks.min.json";
import statsJson from "../db/stats.json";
import offersJson from "../db/offers.min.json";
import similarImageJson from "../db/similarImage.json";
import collectionsJson from "../db/collections.json";

import { MinifiedMasks, StatItem, Traits } from "../shared/types";
import { Collection } from "./collections";

const _minMasksDB: unknown = minMasksJson;
export const minMasksDB = _minMasksDB as MinifiedMasks;
export const statsDB = statsJson as Record<Traits, StatItem[]>;
export const offersDB = offersJson as Record<string, number>;
export const similarImageDb = similarImageJson as Record<string, number[]>;
export const collectionsDb = collectionsJson as Record<Collection, number[]>;
