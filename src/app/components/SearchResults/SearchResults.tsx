/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { SongData } from "@/util/types/SongData";
import React, {
  MouseEvent,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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

  const songItemsContainer = useRef<HTMLDivElement | null>(null);
  const videoItemsContainer = useRef<HTMLDivElement | null>(null);

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

      const videoRes = await fetch(`/search/videos`, {
        method: "POST",
        body: JSON.stringify({
          query: query,
        }),
      });
      if (videoRes.status === 200) {
        const data: SongData[] = await videoRes.json();
        setVideos(data as SongData[]);
      }
    }
    init();
  }, [query]);

  const songCategoryItems = songs
    ? songs.filter((v) =>
        topResult?.type === "SONG"
          ? v.id !== (topResult.data as SongData).id
          : true
      )
    : null;

  const videoCategoryItems = videos
    ? videos.filter(
        (v) =>
          (topResult?.type === "VIDEO"
            ? v.id !== (topResult.data as SongData).id
            : true) &&
          v.duration !== 0 &&
          v.title
      )
    : null;

  return (
    <div
      className="flex items-start justify-center w-[100vw] h-[83.25vh] overflow-y-scroll overflow-x-hidden"
      onClick={(e) => {
        if (dropdownId.get) {
          dropdownId.set(null);
        }
      }}
      style={{
        backgroundColor: COLORS.BG,
      }}
    >
      <div className="w-[80%] h-full">
        <div className="w-full h-[7.5%] mt-[3%]">
          <span className="w-full h-full flex items-center justify-start text-2xl font-bold tracking-wide">
            Top Result
          </span>
        </div>
        {topResult ? (
          <TopResult
            type={topResult.type}
            data={topResult.data}
            songState={songState}
            dropdownId={dropdownId}
            dropdownPos={dropdownPos}
          />
        ) : (
          <div className="relative flex items-center justify-center w-full h-[20%]">
            <div className="relative animate-pulse rounded-[4px] w-full h-full bg-white/10"></div>
            <span className="absolute z-[1]">
              {loadingSpinner("5vw", "5vw")}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 justify-between w-full h-[7.5%] mt-[3%]">
          <span className="flex items-center justify-start w-full h-full text-2xl font-bold tracking-wide">
            Songs
          </span>
          <span className="flex items-center gap-2 justify-end w-full h-full">
            <button
              className="border-2 opacity-50 h-[32px] w-[32px] rounded-full rotate-[270deg] hover:scale-110 hover:bg-white/5 hover:opacity-100"
              onClick={() => {
                const container = songItemsContainer.current;
                if (!container) return;
                container.scrollBy({
                  top: -container.clientHeight,
                  behavior: "smooth",
                });
              }}
            >
              <img className="w-full h-full" src="/icons/chevron_0deg.svg" />
            </button>
            <button
              className=" border-2 opacity-50 h-[32px] w-[32px] rounded-full rotate-[90deg] hover:scale-110 hover:bg-white/5 hover:opacity-100"
              onClick={() => {
                const container = songItemsContainer.current;
                if (!container) return;
                container.scrollBy({
                  top: container.clientHeight,
                  behavior: "smooth",
                });
              }}
            >
              <img className="w-full h-full" src="/icons/chevron_0deg.svg" />
            </button>
          </span>
        </div>

        <div
          id="songItemsContainer"
          ref={songItemsContainer}
          className="w-full h-[54.25%] overflow-hidden"
        >
          {songCategoryItems ? (
            <div className="flex flex-col items-center gap-1 justify-start w-full h-[83.25vh]">
              {songCategoryItems.map((r, i) => (
                <Song
                  key={i}
                  data={r}
                  songState={songState}
                  dropdownId={dropdownId}
                  dropdownPos={dropdownPos}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 justify-start w-full h-[83.25vh]">
              {Array.from({ length: 10 }, (_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-[4px] w-full min-h-[13%] bg-white/10"
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 justify-between w-full h-[7.5%] mt-[3%]">
          <span className="flex items-center justify-start w-full h-full text-2xl font-bold tracking-wide">
            Videos
          </span>
          <span className="flex items-center gap-2 justify-end w-full h-full">
            <button
              className="border-2 opacity-50 h-[32px] w-[32px] rounded-full rotate-[270deg] hover:scale-110 hover:bg-white/5 hover:opacity-100"
              onClick={() => {
                const container = videoItemsContainer.current;
                if (!container) return;
                container.scrollBy({
                  top: -container.clientHeight,
                  behavior: "smooth",
                });
              }}
            >
              <img className="w-full h-full" src="/icons/chevron_0deg.svg" />
            </button>
            <button
              className=" border-2 opacity-50 h-[32px] w-[32px] rounded-full rotate-[90deg] hover:scale-110 hover:bg-white/5 hover:opacity-100"
              onClick={() => {
                const container = videoItemsContainer.current;
                if (!container) return;
                container.scrollBy({
                  top: container.clientHeight,
                  behavior: "smooth",
                });
              }}
            >
              <img className="w-full h-full" src="/icons/chevron_0deg.svg" />
            </button>
          </span>
        </div>

        <div
          id="videoItemsContainer"
          ref={videoItemsContainer}
          className="w-full h-[54.25%] overflow-hidden"
        >
          {videoCategoryItems ? (
            <div className="flex flex-col items-center gap-1 justify-start w-full h-[83.25vh]">
              {videoCategoryItems.map((r, i) => (
                <Song
                  key={i}
                  data={r}
                  songState={songState}
                  dropdownId={dropdownId}
                  dropdownPos={dropdownPos}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 justify-start w-full h-[83.25vh]">
              {Array.from({ length: 10 }, (_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-[4px] w-full min-h-[13%] bg-white/10"
                />
              ))}
            </div>
          )}
        </div>

        <Dropdown
          className="rounded-[4px] overflow-hidden"
          id={dropdownId.get || undefined}
          pos={dropdownPos.get}
          dropdownStyle={{ background: `${pSBC(0.4, COLORS.BG, "#000000")}` }}
          width={"10%"}
          height={"20%"}
        >
          <span
            onClick={async () => {
              await play(
                songState,
                songs?.find((s) => s.id === dropdownId.get)!
              );
            }}
            className="flex items-center justify-evenly hover:cursor-pointer hover:bg-white/10 w-full h-[33.3%] overflow-hidden whitespace-nowrap text-ellipsis"
          >
            Play
          </span>
          <span
            onClick={async () => {
              await enqueue(songs?.find((s) => s.id === dropdownId.get)!);
            }}
            className="flex items-center justify-evenly hover:cursor-pointer hover:bg-white/10 w-full h-[33.3%] overflow-hidden whitespace-nowrap text-ellipsis"
          >
            Add to queue
          </span>
          <div
            onMouseOver={function (this: any, e) {}}
            className="flex items-center justify-evenly hover:cursor-pointer hover:bg-white/10 w-full h-[33.3%] overflow-hidden whitespace-nowrap text-ellipsis"
          >
            Add to playlist
          </div>
        </Dropdown>
      </div>
    </div>
  );
}
