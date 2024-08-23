export interface SongData {
  vid: {
    id: string;
    url: string;
    title: string;
    thumbnail: string;
    duration: number;
  };
  owner: {
    title: string;
    url: string;
    thumbnail: string;
  };
  playerInfo: {
    accentColors: string[];
    topColor: string;
  };
}
