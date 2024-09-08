import { SongData } from "./types/SongData";

export const sortSongDurations = (songs: SongData[]) => {
  return songs.sort((a, b) => {
    const inRangeA = a.duration >= 120 && a.duration <= 360;
    const inRangeB = b.duration >= 120 && b.duration <= 360;

    if (inRangeA && !inRangeB) {
      return -1;
    }
    if (!inRangeA && inRangeB) {
      return 1;
    }
    return 0;
  });
};
