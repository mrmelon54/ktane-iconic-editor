import {writable} from "svelte/store";

export const selectedModule = writable<number>(-1);

export const selectedChar = writable<string>("");

export const hoveredChar = writable<string>("");
