import { extractColors } from "extract-colors";
import getPixels from "get-pixels";

import { NdArray } from "ndarray";

export async function getAccentColors(videoId: string) {
  try {
    const pixels: NdArray<Uint8Array> = await new Promise<NdArray<Uint8Array>>(
      (resolve, reject) => {
        getPixels(
          `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          (err, pixels) => {
            if (err) {
              reject(err);
            } else {
              resolve(pixels);
            }
          }
        );
      }
    );

    const data = Array.from(pixels.data);
    const [width, height] = pixels.shape;

    const colors = await extractColors({ data, width, height });

    let accentColors: string[] = [];
    for (let i = 0; i < colors.length; i++) {
      accentColors.push(colors[i].hex);
    }

    if (accentColors.length > 0) {
      const topColor = accentColors[0];

      return { colors: accentColors, topColor: topColor };
    }
  } catch (err) {
    console.log(err);
  }
}
