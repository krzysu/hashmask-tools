import { saveToFile } from "./shared/saveToFile";
import { Mask } from "./types";
import statDB from "../db/stats.json";

const maskDbData = require(`../db/hashmasks.json`) as Record<string, Mask>;

type Traits = "character" | "mask" | "eyes" | "skin" | "item";

const getTraitTotal = (traitName: Traits) => (traitValue: string) =>
  statDB[`${traitName}Stats`].find((item) => item[traitName] === traitValue)
    ?.count || 0;

// lower better
const calculateRarityScore = (mask: Mask): number => {
  const characterScore = getTraitTotal("character")(mask.character);
  const maskScore = getTraitTotal("mask")(mask.mask);
  const eyesScore = getTraitTotal("eyes")(mask.eyes);
  const skinScore = getTraitTotal("skin")(mask.skin);
  const itemScore = getTraitTotal("item")(mask.item);

  return Math.log(
    characterScore * maskScore * eyesScore * skinScore * itemScore
  );
};

const scores = Object.keys(maskDbData)
  .map((id) => ({
    id,
    score: calculateRarityScore(maskDbData[id]),
  }))
  .sort((a, b) => {
    return a.score - b.score;
  });

const allScores = scores.map((i) => i.score);
const min = Math.min(...allScores);
const max = Math.max(...allScores);

const normalizeBetweenTwoRanges = (
  val: number,
  minVal: number,
  maxVal: number,
  newMin: number,
  newMax: number
) => {
  return newMin + ((val - minVal) * (newMax - newMin)) / (maxVal - minVal);
};

const normalized = scores.map((i) => ({
  ...i,
  score: Math.floor(normalizeBetweenTwoRanges(i.score, min, max, 1, 1000)),
}));

saveToFile(normalized, "rarityScore.json");
