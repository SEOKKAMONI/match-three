import { useSetAtom } from "jotai";
import { useCallback, useRef } from "react";
import { boardAtom, statusAtom } from "./atoms";
import { Status, type Board, type Index } from "./board";
import { delay } from "../utility";
import { clear, collapse, fill, isStable } from "./board";

export const useMatchThreeCascade = () => {
  const setBoard = useSetAtom(boardAtom);
  const setStatus = useSetAtom(statusAtom);
  const isProcessingRef = useRef(false);

  const cascadeHandler = useCallback((board: Board, grabbed: Index | null) => {
    if (!board || board.length === 0 || board[0]?.length === 0) {
      return;
    }

    if (isProcessingRef.current || grabbed !== null) {
      return;
    }

    if (!isStable(board)) {
      isProcessingRef.current = true;
      setStatus(Status.COLLAPSING);

      const cascade = async () => {
        let currentBoard = board;

        while (!isStable(currentBoard)) {
          await delay(1000 / 3);
          currentBoard = clear(currentBoard);
          setBoard(currentBoard);

          await delay(1000 / 3);
          currentBoard = collapse(currentBoard);
          setBoard(currentBoard);

          await delay(1000 / 3);
          currentBoard = fill(currentBoard);
          setBoard(currentBoard);
        }

        setStatus(null);
        isProcessingRef.current = false;
      };

      cascade();
    }
  }, [setBoard, setStatus]);

  return cascadeHandler;
};
