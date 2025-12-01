import { useAtom, useAtomValue } from "jotai";
import { useCallback, useMemo } from "react";
import { isAdjacent, isStable, swap, type Index } from "./board";
import { boardAtom, grabbedAtom, statusAtom } from "./atoms";
import { Status } from "./board";

export const useMatchThree = () => {
  const board = useAtomValue(boardAtom);
  const [grabbed, setGrabbed] = useAtom(grabbedAtom);
  const status = useAtomValue(statusAtom);
  const [, setBoard] = useAtom(boardAtom);

  const columnCount = useMemo(() => board?.length ?? 0, [board]);
  const rowCount = useMemo(() => board?.[0]?.length ?? 0, [board]);

  const handleSwap = useCallback(
    (index1: Index | null, index2: Index | null) => {
      if (!index1 || !index2 || !board) {
        return;
      }

      if (isAdjacent(index1, index2)) {
        const previous = board;
        const swapped = swap(index1, index2, board);

        setBoard(swapped);

        if (isStable(swapped)) {
          setTimeout(() => {
            setBoard(previous);
          }, 1000 / 2);
        }
      }
    },
    [board, setBoard]
  );

  const grab = useCallback(
    (index: Index) => {
      if (status === Status.COLLAPSING) {
        return;
      }
      setGrabbed(index);
    },
    [status, setGrabbed]
  );

  const drop = useCallback(
    (index: Index) => {
      const index1 = grabbed;
      setGrabbed(null);

      if (index1 && status !== Status.COLLAPSING) {
        handleSwap(index1, index);
      }
    },
    [grabbed, status, setGrabbed, handleSwap]
  );

  return {
    board,
    grabbed,
    status,
    grab,
    drop,
    rowCount,
    columnCount,
  };
};
