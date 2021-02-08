const STARTING_INDEX = 10141;

export const revealedMaskIndex = (id: string): string => {
  return ((Number(id) + STARTING_INDEX) % 16384).toString();
};

export const indexToMaskId = (index: string): string => {
  return ((16384 - STARTING_INDEX + Number(index)) % 16384).toString();
};

export const TOTAL_MASKS = 16384;
export const ALL_MASK_IDS = [...Array(TOTAL_MASKS).keys()].map((i) =>
  i.toString()
);

export const getOtherMaskIds = (maskId: string) =>
  ALL_MASK_IDS.filter((id) => id !== maskId);
