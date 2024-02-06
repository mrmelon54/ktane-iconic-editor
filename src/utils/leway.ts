import {getPartByCharWithSpace, getPartChar} from "~/stores/editor-data";
import type {iconicDataModule} from "~/stores/iconic-data";

export function calculateLeway(m: iconicDataModule) {
  let partSizes = Array.from({length: m.parts.length + 2}, () => 0);

  // reserve "-1" part index as unknown chars
  // reserve "0" part index as space char
  for (let i = 0; i < m.raw.length; i++) {
    partSizes[getPartByCharWithSpace(m.raw[i]) + 2]++;
  }

  let unknownChars = partSizes.shift();
  let spaceChars = partSizes.shift();
  let partSizesSum = partSizes.reduce((a, b) => a + b, 0);
  if (partSizesSum + spaceChars !== 32 * 32 || unknownChars > 0) {
    alert(`Invalid module raw string size\nFound ${m.parts.length} parts with a total of ${partSizesSum - partSizes[0]} / ${32 * 32} chars`);
    return;
  }

  // find pixels to change
  let pixelChars: Array<{position: number; char: string}> = [];
  for (let i = 0; i < 32 * 32; i++) {
    if (m.raw[i] != " ") continue;
    let adjNums = neighbors(i);
    let adjPixs = adjNums.map(x => m.raw[x]).filter(x => x !== " ");
    if (adjPixs.length == 0) continue;

    let maxNum = 0;
    let maxPix = null;
    for (let i = 0; i < m.parts.length; i++) {
      let c = getPartChar(i);
      let count = adjPixs.filter(x => x == c).length;
      if (count < maxNum || partSizes[i] >= 128) continue;
      else if (count == maxNum) maxPix = null;
      else {
        maxNum = count;
        maxPix = c;
      }
    }
    if (maxPix != null) pixelChars.push({position: i, char: maxPix});
  }

  // replace chars in string
  let strArr = m.raw.split("");
  for (let i = 0; i < pixelChars.length; i++) {
    strArr[pixelChars[i].position] = pixelChars[i].char;
  }

  m.raw = strArr.join("");
}

function neighbors(i: number): number[] {
  let c = i % 32;
  let n = [
    ...(c == 0 ? [] : [i - 33, i - 1, i + 31]), // left column
    // middle column
    i - 32,
    i + 32,
    ...(c == 31 ? [] : [i - 31, i + 1, i + 33]), // right column
  ];
  return n.filter(x => x >= 0 && x < 32 * 32);
}
