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

import { pSBC } from "@/util/pSBC";
import { Channel } from "youtube-sr";

import TopResult from "./Item/TopResult";
import Dropdown, { DropdownPos } from "../Util/Dropdown";
import { PAGE_STATES } from "@/util/enums/pageState";
import { ArtistData } from "@/util/types/ArtistData";
import { AlbumData } from "@/util/types/AlbumData";
import { COLORS } from "@/util/enums/colors";
import { Music, StarFill } from "../Icons/Icons";
import { useLiveQuery } from "dexie-react-hooks";
import { queueDB } from "@/db/queueDB";

import Song from "./Item/Song";
import { enqueue, play } from "@/player/manager";
import { Chevron_0Deg, Error, LoadingSpinner, Video } from "../Icons/Icons";

interface SearchResultsProps {
  query: string;
  songState: StateManager<SongData | null>;
}

interface TopResult {
  type: "SONG" | "ARTIST" | "ALBUM" | "VIDEO" | "PLAYLIST";
  data: SongData | ArtistData | AlbumData | PlaylistMetadata;
}

export default function SearchResults({
  query,
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
      const topRes = await fetch(`api/search/top?q=${query}`);
      if (topRes.status === 200) {
        const data: TopResult = await topRes.json();
        setTopResult(data);
      }

      const songRes = await fetch(`api/search/songs?q=${query}`);
      if (songRes.status === 200) {
        const data: SongData[] = await songRes.json();
        setSongs(data as SongData[]);
      }

      // const artistRes = await fetch(`api/search/artists`, {
      //   method: "POST",
      //   body: JSON.stringify({
      //     query: query,
      //   }),
      // });
      // if (artistRes.status === 200) {
      //   const data: ArtistData[] = await artistRes.json();
      //   setArtists(data as ArtistData[]);
      // }

      // const albumRes = await fetch(`api/search/albums`, {
      //   method: "POST",
      //   body: JSON.stringify({
      //     query: query,
      //   }),
      // });
      // if (albumRes.status === 200) {
      //   const data: AlbumData[] = await albumRes.json();
      //   setAlbums(data as AlbumData[]);
      // }

      // const playlistRes = await fetch(`api/search/playlists`, {
      //   method: "POST",
      //   body: JSON.stringify({
      //     query: query,
      //   }),
      // });
      // if (playlistRes.status === 200) {
      //   const data = await playlistRes.json();
      //   setPlaylists(data as PlaylistMetadata[]);
      // }

      const videoRes = await fetch(`api/search/videos?q=${query}`);
      if (videoRes.status === 200) {
        const data: SongData[] = await videoRes.json();
        setVideos(data as SongData[]);
      }
    }
    init();
  }, [query]);

  if (!query) {
    return (
      <div
        className="flex flex-col gap-2 items-center justify-center w-full h-full overflow-y-scroll overflow-x-hidden"
        style={{
          backgroundColor: COLORS.BG,
        }}
      >
        <span className="flex items-center justify-center gap-2 text-3xl tracking-wide font-bold opacity-60">
          <Error size={"36px"} /> No query
        </span>
        <span className="opacity-60 text-lg">Type something maybe?</span>
      </div>
    );
  }

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
      className="flex items-center justify-center w-full h-full overflow-y-scroll overflow-x-hidden"
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
          <span className="flex items-center justify-StarFillt w-full h-full text-xl font-bold tracking-wide opacity-80 gap-2">
            <StarFill opacity={0.8} size={"24px"} />
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
            <div className="relative animate-pulse w-full h-full bg-white/[5%]"></div>
            <span className="absolute z-[1]">
              <LoadingSpinner size={"3vw"} fill={"#e8eaed"} opacity={0.8} />
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 justify-between w-full h-[7.5%] mt-[3%]">
          <span className="flex items-center justify-StarFillt w-full h-full text-xl font-bold tracking-wide opacity-80 gap-2">
            <Music opacity={0.8} size={"24px"} />
            Songs
          </span>
          <span className="flex items-center gap-2 justify-end w-full h-full">
            <button
              className=" opacity-50 h-[32px] w-[32px] rounded rotate-[270deg] hover:scale-110 hover:opacity-100"
              onClick={() => {
                const container = songItemsContainer.current;
                if (!container) return;
                container.scrollBy({
                  top: -container.clientHeight,
                  behavior: "smooth",
                });
              }}
            >
              <Chevron_0Deg size={"100%"} opacity={0.8} />
            </button>
            <button
              className="  opacity-50 h-[32px] w-[32px] rounded rotate-[90deg] hover:scale-110 hover:opacity-100"
              onClick={() => {
                const container = songItemsContainer.current;
                if (!container) return;
                container.scrollBy({
                  top: container.clientHeight,
                  behavior: "smooth",
                });
              }}
            >
              <Chevron_0Deg size={"100%"} opacity={0.8} />
            </button>
          </span>
        </div>

        <div
          id="songItemsContainer"
          ref={songItemsContainer}
          className="w-full h-[55%] overflow-hidden"
        >
          {songCategoryItems ? (
            <div className="flex flex-col items-center gap-0 justify-StarFillt w-full h-full">
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
            <div className="animate-pulse bg-white/[5%] w-full h-full"></div>
          )}
        </div>

        <div className="flex items-center gap-2 justify-between w-full h-[7.5%] mt-[3%]">
          <span className="flex items-center justify-StarFillt w-full h-full text-xl font-bold tracking-wide opacity-80 gap-2">
            <Video opacity={0.8} size={"24px"} />
            Videos
          </span>
          <span className="flex items-center gap-2 justify-end w-full h-full">
            <button
              className=" opacity-50 h-[32px] w-[32px] rounded rotate-[270deg] hover:scale-110 hover:opacity-100"
              onClick={() => {
                const container = videoItemsContainer.current;
                if (!container) return;
                container.scrollBy({
                  top: -container.clientHeight,
                  behavior: "smooth",
                });
              }}
            >
              <Chevron_0Deg size={"100%"} opacity={0.8} />
            </button>
            <button
              className="opacity-50 h-[32px] w-[32px] rounded rotate-[90deg] hover:scale-110 hover:opacity-100"
              onClick={() => {
                const container = videoItemsContainer.current;
                if (!container) return;
                container.scrollBy({
                  top: container.clientHeight,
                  behavior: "smooth",
                });
              }}
            >
              <Chevron_0Deg size={"100%"} opacity={0.8} />
            </button>
          </span>
        </div>

        <div
          id="videoItemsContainer"
          ref={videoItemsContainer}
          className="w-full h-[55%] overflow-hidden"
        >
          {videoCategoryItems ? (
            <div className="flex flex-col items-center justify-StarFillt w-full h-full">
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
            <div className="animate-pulse bg-white/[5%] w-full h-full"></div>
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
