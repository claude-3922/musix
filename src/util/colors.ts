import { extractColors } from "extract-colors";
import getPixels from "get-pixels";

export async function getAccentColors(videoId: string) {
  try {
    const pixels: any = await new Promise<any>((resolve, reject) => {
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
    });

    const data = Array.from(pixels.data) as any;
    const [width, height] = pixels.shape;

    const colors = await extractColors({ data, width, height });

    let accentColors = [] as any;
    colors.forEach((color) => {
      accentColors.push(color.hex);
    });

    if (accentColors.length > 0) {
      const topColor = accentColors[0];
      return { pallete: accentColors, topC: topColor };
    }
  } catch (err) {
    console.log(err);
  }
}
