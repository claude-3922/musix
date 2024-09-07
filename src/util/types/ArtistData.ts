import { AlbumData } from "./AlbumData";
import { SongData } from "./SongData";

export interface ArtistData extends ArtistMetadata {
  thumbnail: string;
  moreThumbnails?: string[];
  topSongs?: SongData[];
  topAlbums?: AlbumData[];
}

export interface ArtistMetadata {
  name: string;
  id: string;
}
