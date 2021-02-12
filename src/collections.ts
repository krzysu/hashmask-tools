import { ViewMask } from "../shared/types";
import { buildMask } from "./model";
import { collectionsDb } from "./db";

export type Collection =
  | "flowers"
  | "hearts"
  | "poem"
  | "tears"
  | "beethoven"
  | "halo"
  | "crown"
  | "rosetta"
  | "fibonacci"
  | "chess"
  | "orb"
  | "cards";

type Item = {
  value: Collection;
  label: string;
};

export const buildCollectionSelectItems = (): Item[] => {
  return [
    {
      value: "flowers",
      label: "Flower Eyes",
    },
    {
      value: "hearts",
      label: "Heart Eyes",
    },
    {
      value: "poem",
      label: "Chinese Poem",
    },
    {
      value: "tears",
      label: "Tear drops",
    },
    {
      value: "beethoven",
      label: "Beethoven",
    },
    {
      value: "halo",
      label: "Halo",
    },
    {
      value: "crown",
      label: "Crown",
    },
    {
      value: "rosetta",
      label: "Rosetta",
    },
    {
      value: "fibonacci",
      label: "Fibonacci",
    },
    {
      value: "chess",
      label: "Chess",
    },
    {
      value: "orb",
      label: "Orb",
    },
    {
      value: "cards",
      label: "Cards",
    },
  ];
};

const getMaskIdsFromCollection = (name: Collection) => {
  return collectionsDb[name]
    ? collectionsDb[name].map((id) => id.toString())
    : [];
};

export const buildMasksFromCollection = (name: Collection): ViewMask[] => {
  const maskIds = getMaskIdsFromCollection(name);
  return maskIds.map((id) => buildMask(id));
};
