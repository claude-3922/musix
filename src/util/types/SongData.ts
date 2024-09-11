import { AlbumMetadata } from "./AlbumData";
import { ArtistMetadata } from "./ArtistData";

export interface SongData {
  id: string;
  url: string;
  title: string;
  thumbnail: string;
  duration: number;
  artist: ArtistMetadata;
  album?: AlbumMetadata;
  moreThumbnails?: string[];
  explicit?: boolean;
}
