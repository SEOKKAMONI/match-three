import { atom } from "jotai";
import { Status } from "./board";

export const boardAtom = atom([]);
export const grabbedAtom = atom([]);
export const statusAtom = atom(Status.COLLAPSING);
