import { ArtistMetadata } from "./ArtistData";

export interface PlaylistMetadata {
  name: string;
  id: string;
  owner: ArtistMetadata;
  thumbnail: string;
  moreThumbnails?: string[];
}
