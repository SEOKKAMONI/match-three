import { useSetAtom } from "jotai";
import { useEffect, useRef } from "react";
import {
  createRandomBoard,
} from "./board";
import { boardAtom } from "./atoms";
import { delay } from "../utility";

export const useMatchThreeInit = () => {
  const setBoard = useSetAtom(boardAtom);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;

      const initBoard = async () => {
        setBoard([[]]);
        await delay(500);
        const initialBoard = createRandomBoard();
        setBoard(initialBoard);
      };

      initBoard();
    }
  }, [setBoard]);
};
