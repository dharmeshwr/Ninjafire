import { atom } from "jotai";

import { getMyAge } from "@/lib/utils";

const age = getMyAge();

export const globalZIndexAtom = atom(1000);
export const hoverStateAtom = atom(false);
export const ageAtom = atom(age);
