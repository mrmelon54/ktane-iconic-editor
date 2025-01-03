import {get, writable} from "svelte/store";
import {getModuleById} from "./ktane-json-raw";

export type iconicDataType = {
  _: string;
  modules: Array<iconicDataModule>;
};

export type iconicDataModule = {
  key: string;
  raw: string;
  parts: Array<iconicDataPart>;
  dirty: boolean;
};

export type iconicDataPart = {
  name: string;
  color: string;
};

export function isIconicDataType(arg: any): arg is iconicDataType {
  if (!arg) throw new Error("Missing arg");
  if (!arg._) throw new Error("Missing arg._");
  if (arg._ !== "Generated by KTaNE Iconic Editor. DO NOT EDIT.") throw new Error("Invalid arg._");
  if (!arg.modules) throw new Error("Missing arg.modules");
  if (!Array.isArray(arg.modules)) throw new Error("Invalid type arg.modules");
  for (let i = 0; i < arg.modules.length; i++) {
    try {
      isIconicDataModule(arg.modules[i]);
    } catch (e) {
      throw new Error("Invalid arg.modules item: " + e);
    }
  }
  if (!isUnique(arg.modules, x => x.key)) throw new Error("Non-unique key in arg.modules");
  return true;
}

function isIconicDataModule(arg: any): arg is iconicDataModule {
  if (!arg.key) throw new Error("Missing arg.key");
  if (typeof arg.key != "string") throw new Error("Invalid type arg.key");
  if (!arg.raw) throw new Error("Missing arg.raw");
  if (typeof arg.raw != "string") throw new Error("Invalid type arg.raw");
  ["░", "▒", "▓", "█", "═", "║"].forEach(element => {
    if (arg.raw.includes(element)) throw new Error("Module string contains invalid block characters from old iconic generator");
  });
  if (!arg.parts) throw new Error("Missing arg.parts");
  if (!Array.isArray(arg.parts)) throw new Error("Invalid type arg.parts");
  for (let i = 0; i < arg.parts.length; i++) {
    try {
      isIconicDataPart(arg.parts[i]);
      arg.parts[i] = {name: arg.parts[i], color: ""};
    } catch (e) {
      throw new Error("Invalid arg.parts item: " + e);
    }
  }
  if (!isUnique(arg.parts, x => x)) throw new Error("Non-unique name in arg.parts");
  return true;
}

function isIconicDataPart(arg: any): arg is iconicDataPart {
  if (!arg) throw new Error("Missing part");
  if (typeof arg != "string") throw new Error("Invalid type for part");
  return true;
}

function isUnique(x: Array<any>, f: (x: any) => any): boolean {
  return (
    x.filter((value, index, self) => {
      return self.findIndex(v => f(v) === f(value)) === index;
    }).length === x.length
  );
}

var initialIconicData = getInitialIconicData();

export const iconicData = writable<iconicDataType>(initialIconicData);

function getInitialIconicData(): iconicDataType {
  if (localStorage) {
    let a = localStorage.getItem("__iconicData");
    if (a) {
      try {
        let j = JSON.parse(a);
        j._ = "Generated by KTaNE Iconic Editor. DO NOT EDIT.";
        return j;
      } catch {}
    }
  }
  return {
    _: "Generated by KTaNE Iconic Editor. DO NOT EDIT.",
    modules: [],
  };
}

iconicData.subscribe(a => {
  // for debugging
  window.__iconicData = a;

  // save to localStorage
  if (localStorage) localStorage.setItem("__iconicData", JSON.stringify(a));
});

export const iconicUnsaved = writable<Set<string>>(new Set());

iconicUnsaved.subscribe(a => {
  if (localStorage) localStorage.setItem("__iconicUnsaved", JSON.stringify(a));
});

export function sortIconicModules(iconicData: iconicDataType): iconicDataType {
  iconicData.modules = iconicData.modules.sort((a, b) => {
    let am = getModuleById(a.key);
    let bm = getModuleById(b.key);

    // sort by name if neither module exists
    if (am == null && bm == null) return am.Name.localeCompare(bm.Name);

    // sort missing modules towards the end
    if (am == null || !am.Published) return 1;
    if (bm == null || !bm.Published) return -1;

    // sort by published order
    return new Date(am.Published).getTime() - new Date(bm.Published).getTime();
  });
  return iconicData;
}

export function exportIconicData(iconicData: iconicDataType): string {
  let a = "{\n";
  a += '    "_": "Generated by KTaNE Iconic Editor. DO NOT EDIT.",\n';
  a += '    "modules": [\n';
  let savingUndefined: number = 0;
  for (let i = 0; i < iconicData.modules.length; i++) {
    let m = iconicData.modules[i];
    let m2 = getModuleById(m.key);
    let maybeIcon = m2?.FileName || m2?.Name || m2?.ModuleID;
    if (maybeIcon == undefined) {
      savingUndefined++;
      continue;
    }
    a += "        {\n";
    a += '            "key": "' + m.key + '",\n';
    a += '            "icon": "' + maybeIcon + '",\n';
    a += '            "raw": "' + m.raw + '",\n';
    a += '            "parts": ' + JSON.stringify(m.parts.map(x => x.name)) + "\n";
    a += "        }" + (i + 1 === iconicData.modules.length ? "" : ",") + "\n";
  }
  a += "    ]\n";
  a += "}\n";
  if (savingUndefined > 0) {
    alert(`${savingUndefined} module with missing icons were detected. They will not be included in the export.`);
  }
  return a;
}

export function getUnsavedCount(): number {
  let m = get(iconicData).modules;
  let c = 0;
  for (let i = 0; i < m.length; i++) {
    if (m[i].dirty) c++;
  }
  return c;
}

export function resetIconicUnsaved() {
  iconicData.update(x => {
    x.modules.map(i => {
      i.dirty = false;
      return i;
    });
    return x;
  });
  initialIconicData = get(iconicData);
}
