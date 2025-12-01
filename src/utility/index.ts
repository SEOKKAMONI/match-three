import { sortBy, sumBy } from "lodash-es";
import { nanoid } from "nanoid";

export const createId = (): string => nanoid();

export const shuffle = <T>(arr: T[]): T[] => sortBy(arr, () => Math.random());

export const randomNth = <T>(arr: T[]): T => shuffle(arr)[0];

export const sqr = (x: number): number => x * x;

export const distance = (point1: number[], point2: number[]): number => {
  const differences = point1.map((value, index) => value - point2[index]);
  const squaredDifferences = differences.map(sqr);
  const sum = sumBy(squaredDifferences, (value) => value);
  return Math.sqrt(sum);
};

export const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));
