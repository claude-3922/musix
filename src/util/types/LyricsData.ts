export interface LyricsData {
  trackName: string;
  albumName: string;
  artistName: string;
  duration: number;
  lyrics: {
    isSynced: boolean;
    plainLyrics: string;
    syncedLyrics?: string;
  };
}
