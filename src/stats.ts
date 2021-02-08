import { Traits } from "../shared/types";
import { statsDB } from "./db";

export const allTraits = {
  character: statsDB.character.map((i) => i.name),
  mask: statsDB.mask.map((i) => i.name),
  eyes: statsDB.eyes.map((i) => i.name),
  skin: statsDB.skin.map((i) => i.name),
  item: statsDB.item.map((i) => i.name),
};

export const getTraitTotal = (traitName: Traits) => (traitValue: string) =>
  statsDB[traitName].find((item) => item.name === traitValue)?.count || 0;
