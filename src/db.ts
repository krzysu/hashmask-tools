import minMasksJson from "../db/hashmasks.min.json";
import sameTraitJson from "../db/sameTrait.json";
import { MinifiedMasks } from "../shared/types";

export const minMasksDB = minMasksJson as MinifiedMasks;
export const sameTraitDB = sameTraitJson as Record<string, number[]>;
