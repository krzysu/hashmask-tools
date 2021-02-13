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
  | "voyager"
  | "cards"
  | "phoenix"
  | "mantra";

type Category = "masks" | "eyes" | "backgrounds" | "items";

const categoryMap: Record<Category, Collection[]> = {
  masks: ["halo", "crown", "tears"],
  eyes: ["flowers", "hearts"],
  backgrounds: [
    "chess",
    "cards",
    "poem",
    "beethoven",
    "rosetta",
    "fibonacci",
    "mantra",
  ],
  items: ["phoenix", "voyager"],
};

export const collectionToNameMap: Record<Collection, string> = {
  flowers: "Flower Eyes",
  hearts: "Heart Eyes",
  poem: "Chinese Poem",
  tears: "Tear drop",
  beethoven: "Beethoven",
  halo: "Halo",
  crown: "Crown",
  rosetta: "Rosetta",
  fibonacci: "Fibonacci",
  chess: "Chess piece",
  voyager: "Voyager Golden Record",
  cards: "Playing cards",
  phoenix: "Phoenix",
  mantra: "The Pavamana Mantra",
};

type SelectItem = {
  value: Collection | "";
  label: string;
};

export const buildCollectionSelectItems = (
  category: Category
): SelectItem[] => {
  const collections = categoryMap[category];
  const empty = {
    value: "",
    label: "-- Select --",
  } as SelectItem;

  return [
    empty,
    ...collections.map((collection) => ({
      value: collection,
      label: collectionToNameMap[collection],
    })),
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
