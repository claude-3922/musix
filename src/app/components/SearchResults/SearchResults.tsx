/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { SongData } from "@/util/types/SongData";
import React, { ReactNode, useEffect, useState } from "react";

import { StateManager } from "@/util/types/StateManager";
import SearchItemSong from "./SearchItem/SearchItemSong";
import useStateManager from "@/app/hooks/StateManager";
import { PlaylistMetadata } from "@/util/types/PlaylistMetadata";
import ExpandableList from "../Util/ExpandableList";
import SearchItemPlaylist from "./SearchItem/SearchItemPlaylist";
import { pSBC } from "@/util/pSBC";
import { Channel } from "youtube-sr";
import { ChannelMetadata } from "@/util/types/ChannelMetadata";
import TopResult from "./SearchItem/TopResult";

interface SearchResultsProps {
  query: string;
  searchResultState: StateManager<boolean>;
  songState: StateManager<SongData | null>;
}

interface TopResult {
  type: "video" | "playlist" | "channel";
  data: SongData | PlaylistMetadata | ChannelMetadata;
}

export default function SearchResults({
  query,
  searchResultState,
  songState,
}: SearchResultsProps) {
  const [topResult, setTopResult] = useState<TopResult | null>(null);
  const [songs, setSongs] = useState<SongData[] | null>(null);
  const [playlists, setPlaylists] = useState<PlaylistMetadata[] | null>(null);

  const dropdownItemId = useStateManager<string | null>(null);

  useEffect(() => {
    setSongs(null);
    setPlaylists(null);

    async function init() {
      const topRes = await fetch(`/search/top`, {
        method: "POST",
        body: JSON.stringify({
          query: query,
        }),
      });
      if (topRes.status === 200) {
        const data: TopResult = await topRes.json();
        setTopResult(data);
      }

      const songRes = await fetch(`/search/songs`, {
        method: "POST",
        body: JSON.stringify({
          query: query,
          count: 10,
        }),
      });
      if (songRes.status === 200) {
        const data = await songRes.json();
        setSongs(data.data as SongData[]);
      }

      const playlistRes = await fetch(`/search/playlists`, {
        method: "POST",
        body: JSON.stringify({
          query: query,
          count: 6,
        }),
      });
      if (playlistRes.status === 200) {
        const data = await playlistRes.json();
        setPlaylists(data.data as PlaylistMetadata[]);
      }
    }
    init();
  }, [query]);

  const darkerAccent = pSBC(0.03, "#000000");
  const darkerDarkerAccent = pSBC(0.02, "#000000");
  const darkestDarkerAccent = pSBC(0.01, "#000000");

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
        {topResult ? (
          <div className="my-[3vh]">
            <TopResult
              type={topResult.type}
              data={topResult.data}
              //dropdownItemId={dropdownItemId}
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
              afterCount={songs.length}
              afterHeight={`${songs.length * 13}vh`}
              customExpandButtonProps={{
                className:
                  "text-sm w-[6vw] hover:bg-white/20 py-[0.5vh] border-2 rounded-full mx-[2vw]",
              }}
            >
              {songs.map((r, i) => (
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
              afterCount={playlists.length}
              afterHeight={`${playlists.length * 13}vh`}
              customExpandButtonProps={{
                className:
                  "text-sm w-[6vw] hover:bg-white/20 py-[0.5vh] border-2 rounded-full mx-[2vw]",
              }}
              className="overflow-y-scroll"
            >
              {playlists.map((r, i) => (
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
