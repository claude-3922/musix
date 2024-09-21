/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { SongData } from "@/util/types/SongData";
import { memo, useMemo } from "react";

import { StateManager } from "@/util/types/StateManager";
import { PlaylistMetadata } from "@/util/types/PlaylistData";

import TopResult from "./Item/TopResult";
import { ArtistData } from "@/util/types/ArtistData";
import { AlbumData } from "@/util/types/AlbumData";
import { COLORS } from "@/util/enums/colors";

import Song from "./Item/Song";
import { Error } from "../Icons/Icons";
import Album from "./Item/Album";
import Playlist from "./Item/Playlist";
import useFetch, { FetchState } from "@/app/hooks/Fetch";
import Artist from "./Item/Artist";

interface SearchResultsProps {
  query: string;
  songState: StateManager<SongData | null>;
  audioPlayer: HTMLAudioElement | null;
}

interface TopResult {
  type: "SONG" | "ARTIST" | "ALBUM" | "VIDEO" | "PLAYLIST";
  data: SongData | ArtistData | AlbumData | PlaylistMetadata;
}

function SearchResults({ query, songState, audioPlayer }: SearchResultsProps) {
  const topResultUrl = useMemo(() => `api/search/top?q=${query}`, [query]);
  const songsUrl = useMemo(() => `api/search/songs?q=${query}`, [query]);
  const artistsUrl = useMemo(() => `api/search/artists?q=${query}`, [query]);
  const albumsUrl = useMemo(() => `api/search/albums?q=${query}`, [query]);
  const playlistsUrl = useMemo(
    () => `api/search/playlists?q=${query}`,
    [query]
  );
  const videosUrl = useMemo(() => `api/search/videos?q=${query}`, [query]);

  const topResult = useFetch<TopResult>(topResultUrl);
  const songs = useFetch<SongData[]>(songsUrl);
  const artists = useFetch<ArtistData[]>(artistsUrl);
  const albums = useFetch<AlbumData[]>(albumsUrl);
  const playlists = useFetch<PlaylistMetadata[]>(playlistsUrl);
  const videos = useFetch<SongData[]>(videosUrl);

  if (!query) {
    return (
      <div
        className="flex flex-col gap-2 items-center justify-center w-full h-full overflow-y-scroll overflow-x-hidden"
        style={{
          backgroundColor: COLORS.BG,
        }}
      >
        <span className="flex items-center justify-center gap-2 text-3xl tracking-tight opacity-60">
          <Error size={"36px"} /> No query
        </span>
        <span className="opacity-60 text-lg">Type something maybe?</span>
      </div>
    );
  }

  const categoryTitle = (type: string) => {
    return (
      <div className="w-full h-[7.5%] mt-[3%]">
        <span className="flex items-center justify-start w-full h-full text-2xl tracking-tight opacity-80 gap-2">
          {type}
        </span>
      </div>
    );
  };

  return (
    <div
      className="flex items-center justify-center w-full h-full overflow-y-scroll overflow-x-hidden"
      style={{
        backgroundColor: COLORS.BG,
      }}
    >
      <div className="w-[85%] h-full">
        {categoryTitle("Top Result")}
        {topResult?.pending && (
          <div className="animate-pulse h-[21%] w-full bg-white/[5%]" />
        )}
        {topResult?.error && <></>}
        {topResult?.data && (
          <TopResult
            type={topResult.data.type}
            data={topResult.data.data}
            songState={songState}
            audioPlayer={audioPlayer || null}
          />
        )}

        {categoryTitle("Songs")}
        <div className="w-full h-[55%] overflow-x-hidden pr-1 overflow-y-scroll snap-y snap-mandatory">
          {songs?.pending && (
            <div className="animate-pulse h-full w-full bg-white/[5%]" />
          )}
          {songs?.error && <></>}
          {songs?.data && (
            <div className="flex flex-col items-center gap-0 justify-start w-full h-full">
              {songs.data.map((r, i) => (
                <Song
                  key={i}
                  data={r}
                  songState={songState}
                  audioPlayer={audioPlayer || null}
                />
              ))}
            </div>
          )}
        </div>

        {categoryTitle("Albums")}
        <div className="flex items-center justify-start w-full h-[35%] pb-1 overflow-y-hidden overflow-x-scroll snap-x snap-mandatory gap-0.5">
          {albums?.pending && (
            <div className="w-full h-full animate-pulse bg-white/[5%]" />
          )}
          {albums?.error && <></>}
          {albums.data && albums.data.map((a, i) => <Album key={i} data={a} />)}
        </div>

        {categoryTitle("Artists")}
        <div className="flex items-center justify-start w-full h-[35%] pb-1 overflow-y-hidden overflow-x-scroll snap-x snap-mandatory gap-0.5">
          {artists?.pending && (
            <div className="w-full h-full animate-pulse bg-white/[5%]" />
          )}
          {artists?.error && <></>}
          {artists?.data &&
            artists.data.map((a, i) => <Artist key={i} data={a} />)}
        </div>

        {categoryTitle("Videos")}
        <div className="w-full h-[55%] overflow-x-hidden pr-1 overflow-y-scroll snap-y snap-mandatory">
          {videos?.pending && (
            <div className="animate-pulse h-full w-full bg-white/[5%]" />
          )}
          {videos?.error && <></>}
          {videos?.data && (
            <div className="flex flex-col items-center gap-0 justify-start w-full h-full">
              {videos.data.map((r, i) => (
                <Song
                  key={i}
                  data={r}
                  songState={songState}
                  audioPlayer={audioPlayer || null}
                />
              ))}
            </div>
          )}
        </div>

        {categoryTitle("Playlists")}
        <div className="w-full h-[55%] overflow-x-hidden pr-1 overflow-y-scroll snap-y snap-mandatory">
          {playlists?.pending && (
            <div className="animate-pulse h-full w-full bg-white/[5%]" />
          )}
          {playlists?.error && <></>}
          {playlists?.data && (
            <div className="flex flex-col items-center justify-start w-full h-full">
              {playlists.data.map((r, i) => (
                <Playlist key={i} data={r} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(SearchResults);
