import { AlbumData } from "./AlbumData";
import { ArtistData } from "./ArtistData";
import { PlaylistMetadata } from "./PlaylistData";
import { SongData } from "./SongData";

export interface ITopResult {
  type: "SONG" | "ARTIST" | "ALBUM" | "VIDEO" | "PLAYLIST";
  data: SongData | ArtistData | AlbumData | PlaylistMetadata;
}

export interface ISearchResults {
  topResult: ITopResult | null;
  songs: SongData[] | null;
  artists: ArtistData[] | null;
  albums: AlbumData[] | null;
  playlists: PlaylistMetadata[] | null;
  videos: SongData[] | null;
}
