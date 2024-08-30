import { SongData } from "./types/SongData";

export const sortSongDurations = (songs: SongData[]) => {
  return songs.sort((a, b) => {
    const inRangeA = a.vid.duration >= 120 && a.vid.duration <= 360;
    const inRangeB = b.vid.duration >= 120 && b.vid.duration <= 360;

    if (inRangeA && !inRangeB) {
      return -1;
    }
    if (!inRangeA && inRangeB) {
      return 1;
    }
    return 0;
  });
};
