import { atom } from "jotai";
import { Status, type Board, type Index, type StatusType } from "./board";

export const boardAtom = atom<Board>([]);
export const grabbedAtom = atom<Index | null>(null);
export const statusAtom = atom<StatusType>(Status.COLLAPSING);
