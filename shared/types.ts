export type Mask = {
  id?: string;
  index: string;
  character: string;
  mask: string;
  eyes: string;
  skin: string;
  item: string;
};

export type Traits = "character" | "mask" | "eyes" | "skin" | "item";

export type ViewMask = Mask & {
  score: number;
  lastPrice?: number;
  offeredPrice?: number;
};

type Id = number;
type Index = number;
type Character = number;
type MaskTrait = number;
type Eyes = number;
type Skin = number;
type Item = number;
type Score = number;

export type MinifiedMask = [
  Id,
  Index,
  Character,
  MaskTrait,
  Eyes,
  Skin,
  Item,
  Score
];

export type MinifiedMasks = Record<string, MinifiedMask>;
