import {get, writable} from "svelte/store";

export function getRawModuleData(): jsonRawType {
  return get(internalRawModuleStore);
}

export function loadRawModuleData(): Promise<void> {
  return new Promise<void>((res, rej) => {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "https://ktane.mrmelon54.com/json/raw");
    xmlHttp.onload = () => {
      let j = JSON.parse(xmlHttp.responseText) as jsonRawType;
      let km = j.KtaneModules;
      km = km.filter(x => x.Type === "Regular" || x.Type === "Needy");
      km = km.filter(x => !x.TranslationOf);
      j.KtaneModules = km;
      console.log(j);
      internalRawModuleStore.set(j);
      res();
    };
    xmlHttp.onerror = () => {
      rej("Failed to load raw module data");
    };
    xmlHttp.send();
  });
}

export function getModuleById(id: string): jsonRawModule {
  let m = get(internalRawModuleStore).KtaneModules;
  for (let i = 0; i < m.length; i++) if (m[i].ModuleID == id) return m[i];
  return null;
}

const internalRawModuleStore = writable<jsonRawType>(null);

export type jsonRawType = {
  KtaneModules: Array<jsonRawModule>;
};

export interface jsonRawModule extends jsonRawMeta {
  ModuleID: string;
}

export type jsonRawMeta = {
  Name: string;
  SteamID: string;
  Symbol: string;
  FileName: string;
  Type: string;
  TranslationOf?: string;
  Published?: string;
};
