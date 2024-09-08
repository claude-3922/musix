import { ArtistMetadata } from "./ArtistData";
import { SongData } from "./SongData";

export interface PlaylistMetadata {
  name: string;
  id: string;
  owner: ArtistMetadata;
  thumbnail: string;
  moreThumbnails?: string[];
}

export interface PlaylistData extends PlaylistMetadata {
  songs: SongData[];
}
