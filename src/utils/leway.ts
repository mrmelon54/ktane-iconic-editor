import {getPartByChar, getPartByCharWithSpace} from "~/stores/editor-data";
import type {iconicDataModule} from "~/stores/iconic-data";

export function calculateLeway(m: iconicDataModule) {
  let partSizes = Array.from({length: m.parts.length + 1}, () => 0);

  // reserve "-1" part index as unknown chars
  // reserve "0" part index as space char
  for (let i = 0; i < m.raw.length; i++) {
    partSizes[getPartByCharWithSpace(m.raw[i]) + 1]++;
  }

  let partSizesSum = partSizes.reduce((a, b) => a + b, 0);
  if (partSizesSum !== 32 * 32) {
    alert(`Invalid module raw string size\nFound ${m.parts.length} parts with a total of ${partSizesSum - partSizes[0]} / ${32 * 32} chars`);
    return;
  }
  partSizes;
}
