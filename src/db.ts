import minMasksJson from "../db/hashmasks.min.json";
import statsJson from "../db/stats.json";
import offersJson from "../db/offers.min.json";

import { MinifiedMasks, StatItem, Traits } from "../shared/types";

const _minMasksDB: unknown = minMasksJson;
export const minMasksDB = _minMasksDB as MinifiedMasks;
export const statsDB = statsJson as Record<Traits, StatItem[]>;
export const offersDB = offersJson as Record<string, number>;
