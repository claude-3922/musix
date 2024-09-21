/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { SongData } from "@/util/types/SongData";
import { useState, memo, useEffect } from "react";

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
  const topResult = useFetch<TopResult>(`api/search/top?q=${query}`);
  const songs = useFetch<SongData[]>(`api/search/songs?q=${query}`);
  const artists = useFetch<ArtistData[]>(`api/search/artists?q=${query}`);
  const albums = useFetch<AlbumData[]>(`api/search/albums?q=${query}`);
  const playlists = useFetch<PlaylistMetadata[]>(
    `api/search/playlists?q=${query}`
  );
  const videos = useFetch<SongData[]>(`api/search/videos?q=${query}`);

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
        {topResult?.pending && <></>}
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
          {songs?.pending && <></>}
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
        {albums?.pending && <></>}
        {albums?.error && <></>}
        {albums?.data && (
          <div className="flex items-center justify-start w-full h-[35%] pb-1 overflow-y-hidden overflow-x-scroll snap-x snap-mandatory gap-0.5">
            {albums.data.map((a, i) => (
              <Album key={i} data={a} />
            ))}
          </div>
        )}

        {categoryTitle("Artists")}
        {artists?.pending && <></>}
        {artists?.error && <></>}
        {artists?.data && (
          <div className="flex items-center justify-start w-full h-[35%] pb-1 overflow-y-hidden overflow-x-scroll snap-x snap-mandatory gap-0.5">
            {artists.data.map((a, i) => (
              <Artist key={i} data={a} />
            ))}
          </div>
        )}

        {categoryTitle("Videos")}
        {videos?.pending && <></>}
        {videos?.error && <></>}
        {videos?.data && (
          <div className="w-full h-[55%] overflow-x-hidden pr-1 overflow-y-scroll snap-y snap-mandatory">
            <div className="flex flex-col items-center justify-start w-full h-full">
              {videos.data.map((r, i) => (
                <Song
                  key={i}
                  data={r}
                  songState={songState}
                  audioPlayer={audioPlayer || null}
                />
              ))}
            </div>
          </div>
        )}

        {categoryTitle("Playlists")}
        {playlists?.pending && <></>}
        {playlists?.error && <></>}
        <div className="w-full h-[55%] overflow-x-hidden pr-1 overflow-y-scroll snap-y snap-mandatory">
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
