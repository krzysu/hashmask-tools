import minMasksJson from "../db/hashmasks.min.json";
import sameTraitJson from "../db/sameTrait.json";
import statsJson from "../db/stats.json";
import offersJson from "../db/offers.min.json";

import { MinifiedMasks, Similarity, StatItem, Traits } from "../shared/types";

const _minMasksDB: unknown = minMasksJson;
export const minMasksDB = _minMasksDB as MinifiedMasks;
export const sameTraitDB = sameTraitJson as Record<string, Similarity>;
export const statsDB = statsJson as Record<Traits, StatItem[]>;
export const offersDB = offersJson as Record<string, number>;
