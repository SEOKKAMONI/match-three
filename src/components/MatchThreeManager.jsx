import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { boardAtom, grabbedAtom } from "../match-three/atoms";
import { useMatchThreeInit } from "../match-three/useMatchThreeInit";
import { useMatchThreeCascade } from "../match-three/useMatchThreeCascade";

export const MatchThreeManager = ({ children }) => {
  useMatchThreeInit();
  const board = useAtomValue(boardAtom);
  const grabbed = useAtomValue(grabbedAtom);
  const cascade = useMatchThreeCascade();

  useEffect(() => {
    cascade(board, grabbed);
  }, [board, grabbed, cascade]);

  return <>{children}</>;
};