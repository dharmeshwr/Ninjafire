import { atom } from "jotai";

export type AudioMap = Record<string, HTMLAudioElement>;

export const audioAtom = atom<AudioMap>({});
