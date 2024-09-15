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
import { Music, PlaySymbol, Plus, StarFill } from "../Icons/Icons";
import { useLiveQuery } from "dexie-react-hooks";
import { queueDB } from "@/db/queueDB";

import Song from "./Item/Song";
import { enqueue, play } from "@/player/manager";
import { Chevron_0Deg, Error, LoadingSpinner, Video } from "../Icons/Icons";
import OverlayIcon from "../Util/OverlayIcon";
import Image from "next/image";

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

  const songItemsContainer = useRef<HTMLDivElement | null>(null);
  const videoItemsContainer = useRef<HTMLDivElement | null>(null);
  const albumItemsContainer = useRef<HTMLDivElement | null>(null);

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

      const albumRes = await fetch(`api/search/albums?q=${query}`);
      if (albumRes.status === 200) {
        const data: AlbumData[] = await albumRes.json();
        setAlbums(data as AlbumData[]);
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
        <span className="flex items-center justify-center gap-2 text-3xl tracking-wide opacity-60">
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
    ? videos.filter((v) =>
        topResult?.type === "VIDEO"
          ? v.id !== (topResult.data as SongData).id
          : true
      )
    : null;

  const albumCategoryItems = albums
    ? albums.filter((v) =>
        topResult?.type === "ALBUM"
          ? v.id !== (topResult.data as AlbumData).id
          : true
      )
    : null;

  return (
    <div
      className="flex items-center justify-center w-full h-full overflow-y-scroll overflow-x-hidden"
      style={{
        backgroundColor: COLORS.BG,
      }}
    >
      <div className="w-[80%] h-full">
        <div className="w-full h-[7.5%] mt-[3%]">
          <span className="flex items-center justify-start w-full h-full text-2xl tracking-wide opacity-80 gap-2">
            Top Result
          </span>
        </div>
        {topResult ? (
          <TopResult
            type={topResult.type}
            data={topResult.data}
            songState={songState}
          />
        ) : (
          <TopResultLoading />
        )}

        <ContainerPaginatorVertical
          container={songItemsContainer.current}
          title="Songs"
        />

        <div
          id="songItemsContainer"
          ref={songItemsContainer}
          className="w-full h-[55%] overflow-hidden"
        >
          {songCategoryItems ? (
            <div className="flex flex-col items-center gap-0 justify-StarFillt w-full h-full">
              {songCategoryItems.map((r, i) => (
                <Song key={i} data={r} songState={songState} />
              ))}
            </div>
          ) : (
            <SongsLoading />
          )}
        </div>

        <ContainerPaginatorHorizontal
          container={songItemsContainer.current}
          title="Albums"
        />
        <div
          id="albumItemsContainer"
          ref={albumItemsContainer}
          className="flex items-center justify-start w-full h-[25%] overflow-x-hidden"
        >
          {albumCategoryItems ? (
            albumCategoryItems.map((a, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-start w-full h-full"
              >
                <span className="flex items-center justify-center w-full h-full">
                  <Image
                    src={a.thumbnail}
                    alt={a.name}
                    width={200}
                    height={200}
                    className="object-cover"
                  />
                </span>
              </div>
            ))
          ) : (
            <div className="animate-pulse bg-white/[5%] w-full h-full"></div>
          )}
        </div>

        <ContainerPaginatorVertical
          container={videoItemsContainer.current}
          title="Videos"
        />

        <div
          id="videoItemsContainer"
          ref={videoItemsContainer}
          className="w-full h-[55%] overflow-hidden"
        >
          {videoCategoryItems ? (
            <div className="flex flex-col items-center justify-StarFillt w-full h-full">
              {videoCategoryItems.map((r, i) => (
                <Song key={i} data={r} songState={songState} />
              ))}
            </div>
          ) : (
            <SongsLoading />
          )}
        </div>
      </div>
    </div>
  );
}

const animatedGradientBgStyle = (
  <style>
    {`
    ._loadingGradientBg_
    {
        background: linear-gradient(90deg, ${COLORS.BG}, ${pSBC(
      0.025,
      "#000000"
    )});
        background-size: 200% 200%;

        -webkit-animation: _loadingGradientBg_anim_ 1s ease-in-out infinite;
        -moz-animation: _loadingGradientBg_anim_ 1s ease-in-out infinite;
        animation: _loadingGradientBg_anim_ 1s ease-in-out infinite;
    }
    @-webkit-keyframes _loadingGradientBg_anim_ {
        0%{background-position:10% 0%}
        50%{background-position:91% 100%}
        100%{background-position:10% 0%}
    }
    @-moz-keyframes _loadingGradientBg_anim_ {
        0%{background-position:10% 0%}
        50%{background-position:91% 100%}
        100%{background-position:10% 0%}
    }
    @keyframes _loadingGradientBg_anim_ { 
        0%{background-position:10% 0%}
        50%{background-position:91% 100%}
        100%{background-position:10% 0%}
    }
  `}
  </style>
);

function TopResultLoading() {
  return (
    <div className="_loadingGradientBg_ flex items-center justify-center w-full h-[20%]">
      {animatedGradientBgStyle}
    </div>
  );
}

function SongsLoading() {
  return (
    <div className="_loadingGradientBg_ w-full h-full">
      {animatedGradientBgStyle}
    </div>
  );
}

function ContainerPaginatorVertical({
  container,
  title,
}: {
  container: HTMLDivElement | null;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 justify-between w-full h-[7.5%] mt-[3%]">
      <span className="flex items-center justify-start w-full h-full text-2xl tracking-wide opacity-80 gap-2">
        {title}
      </span>
      <span className="flex items-center gap-2 justify-end w-full h-full">
        <button
          className=" opacity-50 h-[32px] w-[32px] rounded rotate-[270deg] hover:scale-110 hover:opacity-100"
          onClick={() => {
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
  );
}

function ContainerPaginatorHorizontal({
  container,
  title,
}: {
  container: HTMLDivElement | null;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 justify-between w-full h-[7.5%] mt-[3%]">
      <span className="flex items-center justify-start w-full h-full text-2xl tracking-wide opacity-80 gap-2">
        {title}
      </span>
      <span className="flex items-center gap-2 justify-end w-full h-full">
        <button
          className=" opacity-50 h-[32px] w-[32px] rounded rotate-[180deg] hover:scale-110 hover:opacity-100"
          onClick={() => {
            if (!container) return;
            container.scrollBy({
              left: -container.clientHeight,
              behavior: "smooth",
            });
          }}
        >
          <Chevron_0Deg size={"100%"} opacity={0.8} />
        </button>
        <button
          className="opacity-50 h-[32px] w-[32px] rounded hover:scale-110 hover:opacity-100"
          onClick={() => {
            if (!container) return;
            container.scrollBy({
              left: container.clientHeight,
              behavior: "smooth",
            });
          }}
        >
          <Chevron_0Deg size={"100%"} opacity={0.8} />
        </button>
      </span>
    </div>
  );
}
