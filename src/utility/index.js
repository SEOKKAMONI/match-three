import { sortBy, sumBy } from "lodash-es";
import { nanoid } from "nanoid";

export const createId = () => nanoid();

export const shuffle = (arr) => sortBy(arr, () => Math.random());

export const randomNth = (arr) => shuffle(arr)[0];

export const sqr = (x) => x * x;

export const distance = (point1, point2) => {
  const differences = point1.map((value, index) => value - point2[index]);
  const squaredDifferences = differences.map(sqr);
  const sum = sumBy(squaredDifferences, (value) => value);
  return Math.sqrt(sum);
};
