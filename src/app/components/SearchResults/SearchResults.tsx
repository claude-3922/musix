/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { SongData } from "@/util/types/SongData";
import React, { ReactNode, useEffect, useRef, useState } from "react";

import { StateManager } from "@/util/types/StateManager";
import SearchItemSong, {
  playHandler,
  queueAddHandler,
} from "./SearchItem/SearchItemSong";
import useStateManager from "@/app/hooks/StateManager";
import { PlaylistMetadata } from "@/util/types/PlaylistMetadata";
import ExpandableList from "../Util/ExpandableList";
import SearchItemPlaylist from "./SearchItem/SearchItemPlaylist";
import { pSBC } from "@/util/pSBC";
import { Channel } from "youtube-sr";
import { ChannelMetadata } from "@/util/types/ChannelMetadata";
import TopResult from "./SearchItem/TopResult";
import Dropdown, { DropdownPos } from "../Util/Dropdown";
import { PAGE_STATES } from "@/util/enums/pageState";

interface SearchResultsProps {
  query: string;
  pageState: StateManager<PAGE_STATES>;
  songState: StateManager<SongData | null>;
}

interface TopResult {
  type: "video" | "playlist" | "channel";
  data: SongData | PlaylistMetadata | ChannelMetadata;
}

export default function SearchResults({
  query,
  pageState,
  songState,
}: SearchResultsProps) {
  const [topResult, setTopResult] = useState<TopResult | null>(null);
  const [songs, setSongs] = useState<SongData[] | null>(null);
  const [playlists, setPlaylists] = useState<PlaylistMetadata[] | null>(null);

  const dropdownId = useStateManager<string | null>(null);
  const dropdownPos = useStateManager<DropdownPos>({ x: 0, y: 0 });

  const playlistDropdownId = useStateManager<string | null>(null);
  const playlistDropdownPos = useStateManager<DropdownPos>({ x: 0, y: 0 });

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

  const dropdownMenuBg = `linear-gradient(to top, ${pSBC(
    0.98,
    "#ffffff",
    "#000000"
  )}, ${pSBC(0.96, "#ffffff", "#000000")}, ${pSBC(
    0.98,
    "#ffffff",
    "#000000"
  )})`;

  return (
    <div
      className="flex items-start justify-center w-[100vw] h-[83.25vh] overflow-y-scroll bg-custom_black/10"
      onClick={(e) => {
        if (dropdownId.get) {
          dropdownId.set(null);
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
          onClick={() => pageState.set(PAGE_STATES.Main)}
        >
          <img className="h-[1.5vw] w-[1.5vw]" src="/icons/home.svg" />
        </button>
        {topResult ? (
          <div className="my-[3vh]">
            <TopResult
              type={topResult.type}
              data={topResult.data}
              songState={songState}
              dropdownId={dropdownId}
              dropdownPos={dropdownPos}
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
              afterCount={songs.length - (topResult?.type === "video" ? 1 : 0)}
              afterHeight={`${
                (songs.length - (topResult?.type === "video" ? 1 : 0)) * 13
              }vh`}
              customExpandButtonProps={{
                className:
                  "text-sm w-[6vw] hover:bg-white/20 py-[0.5vh] border-2 rounded-full mx-[2vw]",
              }}
            >
              {songs
                .filter((v) =>
                  topResult?.type === "video"
                    ? v.vid.id !== (topResult.data as SongData).vid.id
                    : true
                )
                .map((r, i) => (
                  <SearchItemSong
                    key={i}
                    data={r}
                    songState={songState}
                    dropdownId={dropdownId}
                    dropdownPos={dropdownPos}
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

        <Dropdown
          className="rounded-[4px] overflow-hidden"
          id={dropdownId.get || undefined}
          pos={dropdownPos.get}
          dropdownStyle={{ background: dropdownMenuBg }}
          width={"10vw"}
          height={"9vw"}
        >
          <span
            onClick={async () => {
              await playHandler(
                songState,
                songs?.find((v) => v.vid.id === dropdownId.get) as any
              );
            }}
            className="flex items-center justify-center hover:cursor-pointer hover:bg-white/35 w-[10vw] h-[3vw] "
          >
            Play
          </span>
          <span
            onClick={async () => {
              await queueAddHandler(
                songs?.find((v) => v.vid.id === dropdownId.get) as any
              );
            }}
            className="flex items-center justify-center hover:cursor-pointer hover:bg-white/35 w-[10vw] h-[3vw] "
          >
            Add to queue
          </span>
          <div
            onMouseOver={(e) => {
              playlistDropdownId.set(`playlistDropdown_${dropdownId.get}`);
              playlistDropdownPos.set({
                x: `${(dropdownPos.get.x as number) + 100}px`,
                y: `${(dropdownPos.get.y as number) + 100}px`,
              });
            }}
            className="flex items-center justify-center hover:cursor-pointer hover:bg-white/35 w-[10vw] h-[3vw] "
          >
            Add to playlist
          </div>
        </Dropdown>

        <Dropdown
          onMouseOut={() => playlistDropdownId.set(null)}
          onClick={() => playlistDropdownId.set(null)}
          className="rounded-[4px] overflow-hidden"
          id={playlistDropdownId.get || undefined}
          pos={playlistDropdownPos.get}
          dropdownStyle={{ background: dropdownMenuBg }}
          width={"10vw"}
          height={"9vw"}
        >
          <span className="flex items-center justify-center hover:cursor-pointer hover:bg-white/35 w-[10vw] h-[3vw] ">
            {"None found."}
          </span>
          <span className="flex items-center justify-center hover:cursor-pointer hover:bg-white/35 w-[10vw] h-[3vw] ">
            {"None found."}
          </span>
          <span className="flex items-center justify-center hover:cursor-pointer hover:bg-white/35 w-[10vw] h-[3vw] ">
            {"None found."}
          </span>
        </Dropdown>

        {/* {{playlists ? (
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
        )}} */}
      </div>
    </div>
  );
}
