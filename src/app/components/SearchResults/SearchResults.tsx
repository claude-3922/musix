/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { SongData } from "@/util/types/SongData";
import React, { ReactNode, useEffect, useRef, useState } from "react";

import { StateManager } from "@/util/types/StateManager";

import useStateManager from "@/app/hooks/StateManager";
import { PlaylistMetadata } from "@/util/types/PlaylistData";
import ExpandableList from "../Util/ExpandableList";

import { pSBC } from "@/util/pSBC";
import { Channel } from "youtube-sr";

import TopResult from "./Item/TopResult";
import Dropdown, { DropdownPos } from "../Util/Dropdown";
import { PAGE_STATES } from "@/util/enums/pageState";
import { ArtistData } from "@/util/types/ArtistData";
import { AlbumData } from "@/util/types/AlbumData";
import { COLORS } from "@/util/enums/colors";
import { useLiveQuery } from "dexie-react-hooks";
import { queueDB } from "@/db/queueDB";
import { loadingSpinner } from "../Player/Controls";
import Song from "./Item/Song";
import { enqueue, play } from "@/player/manager";

interface SearchResultsProps {
  query: string;
  pageState: StateManager<PAGE_STATES>;
  songState: StateManager<SongData | null>;
}

interface TopResult {
  type: "SONG" | "ARTIST" | "ALBUM" | "VIDEO" | "PLAYLIST";
  data: SongData | ArtistData | AlbumData | PlaylistMetadata;
}

export default function SearchResults({
  query,
  pageState,
  songState,
}: SearchResultsProps) {
  const [topResult, setTopResult] = useState<TopResult | null>(null);
  const [songs, setSongs] = useState<SongData[] | null>(null);
  const [artists, setArtists] = useState<ArtistData[] | null>(null);
  const [albums, setAlbums] = useState<AlbumData[] | null>(null);
  const [playlists, setPlaylists] = useState<PlaylistMetadata[] | null>(null);
  const [videos, setVideos] = useState<SongData[] | null>(null);

  const dropdownId = useStateManager<string | null>(null);
  const dropdownPos = useStateManager<DropdownPos>({ x: 0, y: 0 });

  const playlistDropdownId = useStateManager<string | null>(null);
  const playlistDropdownPos = useStateManager<DropdownPos>({ x: 0, y: 0 });

  useEffect(() => {
    setTopResult(null);
    setSongs(null);
    setArtists(null);
    setAlbums(null);
    setPlaylists(null);
    setVideos(null);

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
        }),
      });
      if (songRes.status === 200) {
        const data: SongData[] = await songRes.json();
        setSongs(data as SongData[]);
      }

      // const artistRes = await fetch(`/search/artists`, {
      //   method: "POST",
      //   body: JSON.stringify({
      //     query: query,
      //   }),
      // });
      // if (artistRes.status === 200) {
      //   const data: ArtistData[] = await artistRes.json();
      //   setArtists(data as ArtistData[]);
      // }

      // const albumRes = await fetch(`/search/albums`, {
      //   method: "POST",
      //   body: JSON.stringify({
      //     query: query,
      //   }),
      // });
      // if (albumRes.status === 200) {
      //   const data: AlbumData[] = await albumRes.json();
      //   setAlbums(data as AlbumData[]);
      // }

      // const playlistRes = await fetch(`/search/playlists`, {
      //   method: "POST",
      //   body: JSON.stringify({
      //     query: query,
      //   }),
      // });
      // if (playlistRes.status === 200) {
      //   const data = await playlistRes.json();
      //   setPlaylists(data as PlaylistMetadata[]);
      // }

      // const videoRes = await fetch(`/search/videos`, {
      //   method: "POST",
      //   body: JSON.stringify({
      //     query: query,
      //   }),
      // });
      // if (videoRes.status === 200) {
      //   const data: SongData[] = await videoRes.json();
      //   setSongs(data as SongData[]);
      // }
    }
    init();
  }, [query]);

  return (
    <div
      className="flex items-start justify-center w-[100vw] h-[83.25vh] overflow-y-scroll bg-custom_black/10"
      onClick={(e) => {
        if (dropdownId.get) {
          dropdownId.set(null);
        }
      }}
      style={{
        backgroundColor: COLORS.BG,
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
          <div className="relative my-[3vh] flex items-center justify-center">
            <div className="relative animate-pulse rounded-[4px] h-[20vh] w-[80vw] bg-white/10 mx-[1vw]"></div>
            <span className="absolute z-[1]">
              {loadingSpinner("5vw", "5vw")}
            </span>
          </div>
        )}

        {songs ? (
          <div className="my-[3vh]">
            <ExpandableList
              beforeCount={3}
              beforeHeight={`${3 * 13}vh`}
              afterCount={songs.length - (topResult?.type === "SONG" ? 1 : 0)}
              afterHeight={`${
                (songs.length - (topResult?.type === "SONG" ? 1 : 0)) * 13
              }vh`}
              customExpandButtonProps={{
                className:
                  "text-sm w-[6vw] bg-white/10 hover:ring-2 ring-accentColor/50 py-[0.5vh] rounded-full mx-[1.5vw] my-[1vh]",
              }}
            >
              {songs
                .filter((v) =>
                  topResult?.type === "SONG"
                    ? v.id !== (topResult.data as SongData).id
                    : true
                )
                .map((r, i) => (
                  <Song
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
          <div>
            {Array.from({ length: 3 }, (_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-[4px] w-[80vw] h-[12vh] my-[1vh] mx-[1vw] bg-white/10"
              />
            ))}
          </div>
        )}

        <Dropdown
          className="rounded-[4px] overflow-hidden"
          id={dropdownId.get || undefined}
          pos={dropdownPos.get}
          dropdownStyle={{ background: `${pSBC(0.4, COLORS.BG, "#000000")}` }}
          width={"10vw"}
          height={"9vw"}
        >
          <span
            onClick={async () => {
              await play(
                songState,
                songs?.find((s) => s.id === dropdownId.get)!
              );
            }}
            className="flex items-center justify-evenly hover:cursor-pointer hover:bg-white/10 w-[10vw] h-[3vw] "
          >
            Play
          </span>
          <span
            onClick={async () => {
              await enqueue(songs?.find((s) => s.id === dropdownId.get)!);
            }}
            className="flex items-center justify-evenly hover:cursor-pointer hover:bg-white/10 w-[10vw] h-[3vw] "
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
            className="flex items-center justify-evenly hover:cursor-pointer hover:bg-white/10 w-[10vw] h-[3vw] "
          >
            Add to playlist
          </div>
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
