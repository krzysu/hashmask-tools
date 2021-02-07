import { ViewMask } from "../shared/types";
import { minMasksDB, offersDB } from "./db";
import { buildMask } from "./model";

const BATCH_SIZE = 10;

export const ANY_VALUE = "any";

export type SortBy =
  | keyof Pick<ViewMask, "id" | "score" | "offeredPrice">
  | "default";

export type FilterValues = {
  character: string; // trait index (number) in minified masks DB
  mask: string;
  eyes: string;
  skin: string;
  item: string;
};

const _sort = (sortBy: SortBy) => (a: ViewMask, b: ViewMask) => {
  if (sortBy === "id") {
    return Number(a.id) - Number(b.id);
  }

  if (sortBy === "score") {
    return a.score - b.score;
  }

  if (sortBy === "offeredPrice") {
    if (a.offeredPrice && b.offeredPrice) {
      return a.offeredPrice - b.offeredPrice;
    }
    if (a.offeredPrice && !b.offeredPrice) {
      return -1;
    }
    if (!a.offeredPrice && b.offeredPrice) {
      return 1;
    }
    return 0;
  }

  return 1;
};

type QueryParams = {
  filterValues: FilterValues;
  startIndex?: number;
  sortBy?: SortBy;
  isOffered?: boolean;
};

type QueryResponse = {
  items: ViewMask[];
  hasMore: boolean;
  lastIndex: number;
};

export const queryMasks = ({
  filterValues,
  startIndex = 0,
  sortBy = "default",
  isOffered,
}: QueryParams): QueryResponse => {
  let base = Object.keys(minMasksDB);

  if (filterValues.character !== ANY_VALUE) {
    base = base.filter(
      (id) => minMasksDB[id][2] === Number(filterValues.character)
    );
  }
  if (filterValues.mask !== ANY_VALUE) {
    base = base.filter((id) => minMasksDB[id][3] === Number(filterValues.mask));
  }
  if (filterValues.eyes !== ANY_VALUE) {
    base = base.filter((id) => minMasksDB[id][4] === Number(filterValues.eyes));
  }
  if (filterValues.skin !== ANY_VALUE) {
    base = base.filter((id) => minMasksDB[id][5] === Number(filterValues.skin));
  }
  if (filterValues.item !== ANY_VALUE) {
    base = base.filter((id) => minMasksDB[id][6] === Number(filterValues.item));
  }

  if (isOffered) {
    base = base.filter((id) => !!offersDB[id]);
  }

  const masks = base
    .map((id) => buildMask(id))
    .sort(_sort(sortBy))
    .slice(0, startIndex + BATCH_SIZE);

  return {
    items: masks,
    hasMore: base.length > masks.length,
    lastIndex: startIndex + BATCH_SIZE,
  };
};

export const sortMasks = (masks: ViewMask[], sortBy: SortBy): ViewMask[] => {
  return [...masks].sort(_sort(sortBy));
};
