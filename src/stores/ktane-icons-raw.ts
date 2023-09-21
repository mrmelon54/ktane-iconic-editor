import {get, writable} from "svelte/store";
import type {iconicDataModule} from "./iconic-data";
import {getModuleById} from "./ktane-json-raw";

export function filterInvalidIcons(x: iconicDataModule[]) {
  let validSet = get(internalRawIconsStore);
  let validLowerSet = get(internalRawIconsLowerStore);
  let files = x
    .map(x => getModuleById(x.key))
    .filter(x => x != null)
    .map(x => x.FileName || x.Name)
    .map(x => x + ".png");
  let missingFiles = files.map(x => ({name: x, found: validSet.has(x), caseIssue: validLowerSet.has(x.toLowerCase())})).filter(x => !x.found);
  return missingFiles;
}

export function loadRawIconsData() {
  return new Promise<void>((res, rej) => {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "https://ktane-icons.mrmelon54.com/Module%20Icons/valid-files.json?_=" + new Date().getTime());
    xmlHttp.onload = () => {
      let j = JSON.parse(xmlHttp.responseText) as iconsRawType;
      internalRawIconsStore.set(new Set(j));
      internalRawIconsLowerStore.set(new Set(j.map(x => x.toLowerCase())));
      res();
    };
    xmlHttp.onerror = () => {
      rej("Failed to load raw icons data");
    };
    xmlHttp.send();
  });
}

const internalRawIconsStore = writable<Set<string>>(null);
const internalRawIconsLowerStore = writable<Set<string>>(null);
