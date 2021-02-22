import { ViewMask } from "../shared/types";
import { minMasksDB } from "./db";
import { buildMask } from "./model";

const BATCH_SIZE = 20;

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

export const defaultFilterValues: FilterValues = {
  character: ANY_VALUE,
  mask: ANY_VALUE,
  eyes: ANY_VALUE,
  skin: ANY_VALUE,
  item: ANY_VALUE,
};

type QueryParams = {
  openseaDB: Record<string, number[]>;
  filterValues?: FilterValues;
  startIndex?: number;
  sortBy?: SortBy;
  isOffered?: boolean;
  isLowPrice?: boolean;
};

type QueryResponse = {
  items: ViewMask[];
  hasMore: boolean;
  total: number;
  lastIndex: number;
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

export const queryMasks = ({
  openseaDB = {},
  filterValues = defaultFilterValues,
  startIndex = 0,
  sortBy = "default",
  isOffered,
  isLowPrice,
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
    base = base.filter((id) => !!openseaDB[id] && openseaDB[id][0] > 0);
  }
  if (isLowPrice) {
    base = base.filter((id) =>
      !!openseaDB[id] ? openseaDB[id][0] > 0 && openseaDB[id][0] <= 4 : false
    );
    base = base.filter((id) => minMasksDB[id][7] <= 800);
  }

  const masks = base
    .map((id) => buildMask(id, openseaDB))
    .sort(_sort(sortBy))
    .slice(0, startIndex + BATCH_SIZE);

  return {
    items: masks,
    hasMore: base.length > masks.length,
    total: base.length,
    lastIndex: startIndex + BATCH_SIZE,
  };
};

export const sortMasks = (masks: ViewMask[], sortBy: SortBy): ViewMask[] => {
  return [...masks].sort(_sort(sortBy));
};
