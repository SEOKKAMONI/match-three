import { zipWith, times, isNil, memoize, sortBy, flatten, intersection } from "lodash-es";
import { createId, distance, randomNth } from "../utility";

const MATCHING_SIZE = 3;
const BOMB_RADIUS = 1.5;

export const Status = {
  COLLAPSING: "COLLAPSING",
} as const;

export type StatusType = typeof Status[keyof typeof Status] | null;

export const Colors = {
  Red: "red",
  Blue: "blue",
  Yellow: "yellow",
  Green: "green",
  Purple: "purple",
} as const;

export type Color = typeof Colors[keyof typeof Colors];

export const COLORS = Object.values(Colors);

const createRandomColor = (): Color => {
  return randomNth(COLORS);
};

export const ItemType = {
  ColorBomb: "ColorBomb",
  RadiusBomb: "RadiusBomb",
  LineBomb: "LineBomb",
} as const;

export type ItemTypeValue = typeof ItemType[keyof typeof ItemType];

const createRandomItemType = (): ItemTypeValue | null => {
  return Math.random() <= 1 / 20 ? randomNth(Object.values(ItemType)) : null;
};

export interface Item {
  id: string;
  color: Color;
  type: ItemTypeValue | null;
}

export type Board = (Item | null)[][];
export type Index = [number, number];

export const createRandomItem = (): Item => ({
  id: createId(),
  color: createRandomColor(),
  type: createRandomItemType(),
});

export const createRandomBoard = (rowCount = 7, columnCount = 7): Board =>
  times(rowCount, () => times(columnCount, () => createRandomItem()));

const mergeColumns = (col1: (Item | null)[], col2: (Item | null)[]): (Item | null)[] =>
  zipWith(col1, col2, (item1: Item | null, item2: Item | null) =>
    isNil(item1) || isNil(item2) ? null : item1
  );

const mergeBoards = (board1: Board, board2: Board): Board =>
  zipWith(board1, board2, (col1: (Item | null)[], col2: (Item | null)[]) => mergeColumns(col1, col2));

const toColumnCount = (board: Board): number => board.length;

const toRowCount = (board: Board): number => board[0]?.length ?? 0;

const toIndexes = memoize(
  (board: Board): Index[] => {
    const colCount = toColumnCount(board);
    const rowCount = toRowCount(board);
    const result: Index[] = [];
    for (let i = 0; i < colCount; i++) {
      for (let j = 0; j < rowCount; j++) {
        result.push([i, j]);
      }
    }
    return result;
  },
  (board: Board) => `${toColumnCount(board)},${toRowCount(board)}`
);

const toIndexesWhere = (predicate: (index: Index, item: Item | null) => boolean, board: Board): Index[] =>
  toIndexes(board).filter((index: Index) => {
    const item = board[index[0]]?.[index[1]] ?? null;
    return predicate(index, item);
  });

const setIndex = (index: Index, value: Item | null, board: Board): Board => {
  const newBoard = board.map((col) => [...col]);
  if (newBoard[index[0]]) {
    newBoard[index[0]][index[1]] = value;
  }
  return newBoard;
};

const groupByAdjacentColor = (column: (Item | null)[]): (Item | null)[][] => {
  if (!column || column.length === 0) {
    return [];
  }

  const groups: (Item | null)[][] = [];
  let currentGroup: (Item | null)[] = [column[0]];

  for (let i = 1; i < column.length; i++) {
    const prevColor = column[i - 1]?.color;
    const currColor = column[i]?.color;

    if (prevColor === currColor) {
      currentGroup.push(column[i]);
    } else {
      groups.push(currentGroup);
      currentGroup = [column[i]];
    }
  }
  groups.push(currentGroup);

  return groups;
};

const clearColumnMatchings = (board: Board): Board =>
  board.map((column) => {
    const groups = groupByAdjacentColor(column);
    const processedGroups = groups.map((group) =>
      group.length >= MATCHING_SIZE ? group.map(() => null) : group
    );
    return flatten(processedGroups);
  });

const transpose = (board: Board): Board => {
  if (!board || board.length === 0 || !board[0]) {
    return [];
  }
  const rowCount = board[0].length;
  const colCount = board.length;
  const result: Board = [];

  for (let i = 0; i < rowCount; i++) {
    const row: (Item | null)[] = [];
    for (let j = 0; j < colCount; j++) {
      row.push(board[j][i]);
    }
    result.push(row);
  }

  return result;
};

const clearRowMatchings = (board: Board): Board => {
  const transposed = transpose(board);
  const cleared = clearColumnMatchings(transposed);
  return transpose(cleared);
};

const clearMatchings = (board: Board): Board =>
  mergeBoards(clearRowMatchings(board), clearColumnMatchings(board));

const toMatchingIndexes = (board: Board): Index[] =>
  toIndexesWhere((_, item) => isNil(item), clearMatchings(board));

const toRowMatchingIndexes = (board: Board): Index[] =>
  toIndexesWhere((_, item) => isNil(item), clearRowMatchings(board));

const toColumnMatchingIndexes = (board: Board): Index[] =>
  toIndexesWhere((_, item) => isNil(item), clearColumnMatchings(board));

const isRadiusBomb = (item: Item | null): boolean => item?.type === ItemType.RadiusBomb;

const toRadiusBombIndexes = (board: Board): Index[] =>
  toIndexesWhere((_, item) => isRadiusBomb(item), board);

const clearRadius = (index1: Index, board: Board): Board => {
  let result = board;
  const indexesToClear = toIndexesWhere(
    (index2) => distance(index1, index2) <= BOMB_RADIUS,
    board
  );

  for (const index of indexesToClear) {
    result = setIndex(index, null, result);
  }

  return result;
};

const clearRadiusBombs = (board: Board): Board => {
  const matchingIndexes = toMatchingIndexes(board);
  const bombIndexes = toRadiusBombIndexes(board);
  const intersected = intersection(matchingIndexes, bombIndexes);

  let result = board;
  for (const index of intersected) {
    result = clearRadius(index, result);
  }

  return result;
};

const isColorBomb = (item: Item | null): boolean => item?.type === ItemType.ColorBomb;

const toColorBombIndexes = (board: Board): Index[] =>
  toIndexesWhere((_, item) => isColorBomb(item), board);

const clearColor = (color: Color, board: Board): Board =>
  board.map((column) =>
    column.map((item) => (item?.color === color ? null : item))
  );

const clearColorBombs = (board: Board): Board => {
  const matchingIndexes = toMatchingIndexes(board);
  const bombIndexes = toColorBombIndexes(board);
  const intersected = intersection(matchingIndexes, bombIndexes);

  let result = board;
  for (const index of intersected) {
    const color = board[index[0]]?.[index[1]]?.color;
    if (color) {
      result = clearColor(color, result);
    }
  }

  return result;
};

const isLineBomb = (item: Item | null): boolean => item?.type === ItemType.LineBomb;

const toLineBombIndexes = (board: Board): Index[] =>
  toIndexesWhere((_, item) => isLineBomb(item), board);

const clearColumn = (columnIndex: number, board: Board): Board => {
  const indexesToClear = toIndexesWhere(
    (index) => index[0] === columnIndex,
    board
  );

  let result = board;
  for (const index of indexesToClear) {
    result = setIndex(index, null, result);
  }

  return result;
};

const clearColumnLineBombs = (board: Board): Board => {
  const columnMatching = toColumnMatchingIndexes(board);
  const bombIndexes = toLineBombIndexes(board);
  const intersected = intersection(columnMatching, bombIndexes);

  let result = board;
  for (const index of intersected) {
    result = clearColumn(index[0], result);
  }

  return result;
};

const clearRow = (rowIndex: number, board: Board): Board => {
  const indexesToClear = toIndexesWhere((index) => index[1] === rowIndex, board);

  let result = board;
  for (const index of indexesToClear) {
    result = setIndex(index, null, result);
  }

  return result;
};

const clearRowLineBombs = (board: Board): Board => {
  const rowMatching = toRowMatchingIndexes(board);
  const bombIndexes = toLineBombIndexes(board);
  const intersected = intersection(rowMatching, bombIndexes);

  let result = board;
  for (const index of intersected) {
    result = clearRow(index[1], result);
  }

  return result;
};

export const clear = (board: Board): Board => {
  const boards = [
    clearMatchings(board),
    clearRadiusBombs(board),
    clearColorBombs(board),
    clearColumnLineBombs(board),
    clearRowLineBombs(board),
  ];

  return boards.reduce((acc, b) => mergeBoards(acc, b), board);
};


export const collapse = (board: Board): Board =>
  board.map((column) => sortBy(column, (item) => (isNil(item) ? 0 : 1)));

export const fill = (board: Board): Board =>
  board.map((column) =>
    column.map((item) => (isNil(item) ? createRandomItem() : item))
  );


export const isStable = (board: Board): boolean => {
  const cleared = clear(board);
  return JSON.stringify(board) === JSON.stringify(cleared);
};


export const swap = (index1: Index, index2: Index, board: Board): Board => {
  const value1 = board[index1[0]]?.[index1[1]];
  const value2 = board[index2[0]]?.[index2[1]];

  let result = setIndex(index1, value2, board);
  result = setIndex(index2, value1, result);

  return result;
};

export const isAdjacent = (index1: Index, index2: Index): boolean => distance(index1, index2) === 1;
