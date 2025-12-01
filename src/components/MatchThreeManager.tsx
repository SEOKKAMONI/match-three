import { useAtomValue } from "jotai";
import { ReactNode, useEffect } from "react";
import { boardAtom, grabbedAtom } from "../match-three/atoms";
import { useMatchThreeInit } from "../match-three/useMatchThreeInit";
import { useMatchThreeCascade } from "../match-three/useMatchThreeCascade";

interface MatchThreeManagerProps {
  children: ReactNode;
}

export const MatchThreeManager = ({ children }: MatchThreeManagerProps) => {
  useMatchThreeInit();
  const board = useAtomValue(boardAtom);
  const grabbed = useAtomValue(grabbedAtom);
  const cascade = useMatchThreeCascade();

  useEffect(() => {
    cascade(board, grabbed);
  }, [board, grabbed, cascade]);

  return <>{children}</>;
};
