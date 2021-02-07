import minMasksJson from "../db/hashmasks.min.json";
import sameTraitJson from "../db/sameTrait.json";
import { MinifiedMasks } from "../shared/types";

const _minMasksDB: unknown = minMasksJson;
export const minMasksDB = _minMasksDB as MinifiedMasks;
export const sameTraitDB = sameTraitJson as Record<string, number[]>;
