import {writable} from "svelte/store";
import type {iconicDataPart, iconicDataType} from "./iconic-data";

export const selectedModule = writable<number>(-1);

export const selectedChar = writable<string>("");

export const hoveredChar = writable<string>("");

export const updateOnLoad = writable<boolean>(false);

export function getCurrentModuleString(iconicData: iconicDataType, selectedModule) {
  let z = iconicData.modules[selectedModule];
  if (z) return capString(z.raw, 32 * 32);
  return " ".repeat(32 * 32);
}

function capString(s: string, len: number) {
  return s.slice(0, len) + (s.length < len ? " ".repeat(len - s.length) : "");
}

export function getIconUrl(module: string) {
  return "https://ktane-icons.mrmelon54.com/Module Icons/" + module + ".png";
}

const partColors = [
  "#f2a5a5",
  "#a6e7a6",
  "#f2f2a5",
  "#f299f2",
  "#f2cc99",
  "#99f2f2",
  "#999999",
  "#cccccc",
  "#87afff",
  "#eb6f6f",
  "#71d971",
  "#ebeb6f",
  "#eb5ceb",
  "#ebae5c",
  "#5cebeb",
  "#5c5c5c",
  "#aeaeae",
  "#6c9dff",
  "#e64f4f",
  "#51d151",
  "#e6e64f",
  "#e637e6",
  "#e69c37",
  "#37e6e6",
  "#373737",
  "#eb9663",
  "#ebd468",
  "#9fe070",
  "#64e4bd",
  "#77c6f8",
  "#c57bf2",
  "#999999",
  "#7b7b7b",
  "#000000",
  "#ffffff",
  "#eb6f6f",
  "#71d971",
  "#ebeb6f",
  "#eb5ceb",
  "#ebae5c",
  "#5cebeb",
  "#5c5c5c",
  "#aeaeae",
  "#6c9dff",
  "#e64f4f",
  "#51d151",
  "#e6e64f",
  "#e637e6",
  "#e69c37",
  "#37e6e6",
  "#373737",
  "#eb9663",
  "#ebd468",
  "#9fe070",
  "#64e4bd",
  "#77c6f8",
  "#c57bf2",
  "#999999",
  "#7b7b7b",
  "#000000",
  "#ffffff",
];

export function getPartColorByChar(a: string): string {
  return getPartColor(partChars.indexOf(a));
}

export function getPartColor(n: number): string {
  if (n < 0 || n >= partColors.length) return "#ffffff";
  return partColors[n % partColors.length];
}

const partChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export function getPartChar(n: number): string {
  if (n > partChars.length) return "@";
  return partChars[n];
}

export function getNextPartCharSafe(parts: iconicDataPart[]): string {
  let n = 0;
  let c = getPartChar(n);
  while (parts.findIndex(a => a.char === c) !== -1) {
    n++;
    c = getPartChar(n);
    // way too many sections
    if (c === "@") break;
  }
  return c;
}
