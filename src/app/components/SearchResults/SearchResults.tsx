/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { SongData } from "@/util/types/SongData";
import React, { ReactNode, useEffect, useState } from "react";

import { StateManager } from "@/util/types/StateManager";
import SearchItemSong from "./SearchItem/Song";
import useStateManager from "@/app/hooks/StateManager";
import { PlaylistMetadata } from "@/util/types/PlaylistMetadata";
import ExpandableList from "../Util/ExpandableList";
import SearchItemPlaylist from "./SearchItem/Playlist";
import { pSBC } from "@/util/pSBC";

interface SearchResultsProps {
  query: string;
  searchResultState: StateManager<boolean>;
  songState: StateManager<SongData | null>;
}

interface SongSearchResult {
  topResult?: SongData | PlaylistMetadata;
  songs: SongData[];
}

interface PlaylistSearchResult {
  playlists: PlaylistMetadata[];
}

export default function SearchResults({
  query,
  searchResultState,
  songState,
}: SearchResultsProps) {
  const [songs, setSongs] = useState<SongSearchResult | null>(null);
  const [playlists, setPlaylists] = useState<PlaylistSearchResult | null>(null);

  const dropdownItemId = useStateManager<string | null>(null);

  useEffect(() => {
    setSongs(null);
    setPlaylists(null);

    async function init() {
      const songRes = await fetch(`/search/songs`, {
        method: "POST",
        body: JSON.stringify({
          query: query,
          count: 10,
        }),
      });
      if (songRes.status === 200) {
        const data: SongSearchResult = await songRes.json();
        setSongs({
          topResult: data.topResult,
          songs: data.songs,
        });
      }

      const playlistRes = await fetch(`/search/playlists`, {
        method: "POST",
        body: JSON.stringify({
          query: query,
          count: 6,
        }),
      });
      if (playlistRes.status === 200) {
        const data: PlaylistSearchResult = await playlistRes.json();
        setPlaylists({
          playlists: data.playlists,
        });
      }
    }
    init();
  }, [query]);

  const darkerAccent = pSBC(-0.5, "#191919");
  const darkerDarkerAccent = pSBC(-0.7, "#191919");
  const darkestDarkerAccent = pSBC(-0.99, "#191919");

  return (
    <div
      className="flex items-start justify-center w-[100vw] h-[83.25vh] overflow-y-scroll bg-custom_black/10"
      onClick={(e) => {
        if (dropdownItemId.get) {
          dropdownItemId.set(null);
        }
      }}
      style={{
        background: `linear-gradient(135deg, 
        ${darkestDarkerAccent} 0%, 
        ${darkerDarkerAccent} 30%, 
        ${darkerAccent} 50%, 
        ${darkerDarkerAccent} 70%, 
        ${darkestDarkerAccent} 100%)`,
      }}
    >
      <div>
        <button
          className="flex items-center justify-center rounded-full border-2 w-[3vw] h-[3vw] mx-[2vw] my-[2vh]"
          onClick={() => searchResultState.set(false)}
        >
          <img className="h-[1.5vw] w-[1.5vw]" src="/icons/home.svg" />
        </button>
        {songs ? (
          <div className="my-[3vh]">
            <h1 className="mx-[2vw] text-2xl mb-[1vh]">TOP RESULT</h1>
            <SearchItemSong
              data={songs.topResult as SongData}
              songState={songState}
              dropdownItemId={dropdownItemId}
            />
          </div>
        ) : (
          <div className="my-[1vh]">
            <h1 className="mx-[2vw] text-2xl mb-[1vh]">-</h1>
            <div className="animate-pulse rounded-[4px] w-[80vw] h-[12vh] mb-[1vh] mx-[1vw] bg-white/10" />
          </div>
        )}

        {songs ? (
          <div className="my-[1vh]">
            <h1 className="mx-[2vw] text-2xl mb-[1vh]">SONGS</h1>
            <ExpandableList
              beforeCount={3}
              beforeHeight={`${3 * 13}vh`}
              afterCount={songs.songs.length}
              afterHeight={`${songs.songs.length * 13}vh`}
              customExpandButtonProps={{
                className:
                  "text-sm w-[6vw] hover:bg-white/20 py-[0.5vh] border-2 rounded-full mx-[2vw]",
              }}
            >
              {songs.songs.map((r, i) => (
                <SearchItemSong
                  key={i}
                  data={r}
                  songState={songState}
                  dropdownItemId={dropdownItemId}
                />
              ))}
            </ExpandableList>
          </div>
        ) : (
          <div className="my-[1vh]">
            <h1 className="mx-[2vw] text-2xl mb-[1vh]">-</h1>
            {Array.from({ length: 3 }, (_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-[4px] w-[80vw] h-[12vh] mb-[1vh] mx-[1vw] bg-white/10"
              />
            ))}
          </div>
        )}

        {playlists ? (
          <div className="my-[3vh]">
            <h1 className="mx-[2vw] text-2xl mb-[1vh]">PLAYLISTS</h1>
            <ExpandableList
              beforeCount={2}
              beforeHeight={`${2 * 13}vh`}
              afterCount={playlists.playlists.length}
              afterHeight={`${playlists.playlists.length * 13}vh`}
              customExpandButtonProps={{
                className:
                  "text-sm w-[6vw] hover:bg-white/20 py-[0.5vh] border-2 rounded-full mx-[2vw]",
              }}
              className="overflow-y-scroll"
            >
              {playlists.playlists.map((r, i) => (
                <SearchItemPlaylist
                  key={i}
                  data={r}
                  songState={songState}
                  dropdownItemId={dropdownItemId}
                />
              ))}
            </ExpandableList>
          </div>
        ) : (
          <div className="my-[1vh]">
            <h1 className="mx-[2vw] text-2xl mb-[1vh]">-</h1>
            {Array.from({ length: 2 }, (_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-[4px] w-[80vw] h-[12vh] mb-[1vh] mx-[1vw] bg-white/10"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
