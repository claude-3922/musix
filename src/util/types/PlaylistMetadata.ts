export interface PlaylistMetadata {
  title: string;
  url: string;
  id: string;
  thumbnail?: string;
  owner: {
    title?: string;
    url?: string;
  };
}
