import { ArtistMetadata } from "./ArtistData";
import { SongData } from "./SongData";

export interface AlbumData extends AlbumMetadata {
  artist: ArtistMetadata;
  thumbnail: string;
  moreThumbnails?: string[];
  year: number;
  songs?: SongData[];
}

export interface AlbumMetadata {
  name: string;
  id: string;
}
