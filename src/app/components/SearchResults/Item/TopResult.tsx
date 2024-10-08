/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { formatSongDuration } from "@/util/format";
import { PlaylistMetadata } from "@/util/types/PlaylistData";
import { SongData } from "@/util/types/SongData";
import { StateManager } from "@/util/types/StateManager";
import React, { useEffect, useState } from "react";
import OverlayIcon from "../../Util/OverlayIcon";
import { AlbumData } from "@/util/types/AlbumData";
import { ArtistData } from "@/util/types/ArtistData";
import { COLORS } from "@/util/enums/colors";
import {
  Explcit,
  LoadingSpinner,
  Minus,
  MoreVertical,
  PauseSymbol,
  PlaySymbol,
  Plus,
} from "../../Icons/Icons";
import useAuth from "@/app/hooks/Auth";

interface TopResultProps {
  type: "SONG" | "ARTIST" | "ALBUM" | "VIDEO" | "PLAYLIST";
  data: SongData | ArtistData | AlbumData | PlaylistMetadata;
  songState: StateManager<SongData | null>;
  audioPlayer: HTMLAudioElement | null;
}

export default function TopResult({
  type,
  data,
  songState,
  audioPlayer,
}: TopResultProps) {
  const [addedToQueue, setAddedToQueue] = useState(true);
  const [waiting, setWaiting] = useState(false);
  const [playerPaused, setPlayerPaused] = useState(false);
  const [isNowPlaying, setIsNowPlaying] = useState(false);

  useEffect(() => {
    if (!audioPlayer) return;

    setIsNowPlaying(songState.get?.id === data.id);

    const playHandler = () => {
      setPlayerPaused(false);
    };
    const pauseHandler = () => {
      setPlayerPaused(true);
    };

    audioPlayer.addEventListener("play", playHandler);
    audioPlayer.addEventListener("pause", pauseHandler);

    return () => {
      audioPlayer.removeEventListener("play", playHandler);
      audioPlayer.removeEventListener("pause", pauseHandler);
    };
  }, [audioPlayer, data.id, songState.get?.id]);

  let currentItemId: string | null = null;

  switch (type) {
    case "SONG":
      currentItemId = (data as SongData).id;
      break;
    case "VIDEO":
      currentItemId = (data as SongData).id;
    case "ARTIST":
      currentItemId = (data as ArtistData).id;
      break;
    case "ALBUM":
      currentItemId = (data as AlbumData).id;
      break;
    case "PLAYLIST":
      currentItemId = (data as PlaylistMetadata).id;
      break;
    default:
      break;
  }

  const handlePlay = async () => {
    // if (type === "ARTIST") return;
    // setWaiting(true);
    if (type === "SONG" || type === "VIDEO") {
      songState.set(data as SongData);
      setWaiting(false);
      return;
    }
    // const songs = await fetchSongs(type, data.id);
    // if (songs.length === 0) return setWaiting(false);
    // play(songState, songs[0]);
    // for (const song of songs.slice(1)) {
    //   enqueue(song);
    // }
    // setWaiting(false);
  };

  const handleEnqueue = async () => {
    // if (type === "ARTIST") return;
    // setWaiting(true);
    // if (type === "SONG" || type === "VIDEO") {
    //   enqueue(data as SongData);
    //   setWaiting(false);
    //   return;
    // }
    // const songs = await fetchSongs(type, data.id);
    // for (const song of songs) {
    //   enqueue(song);
    // }
    // setWaiting(false);
  };

  const handleDequeue = async () => {
    // if (type === "ARTIST") return;
    // setWaiting(true);
    // if (type === "SONG" || type === "VIDEO") {
    //   dequeue(data as SongData);
    //   setWaiting(false);
    //   return;
    // }
    // const songs = await fetchSongs(type, data.id);
    // for (const song of songs) {
    //   dequeue(song);
    // }
    // setWaiting(false);
  };

  const user = useAuth();

  return (
    <div
      className="flex justify-start items-center h-[21%] w-full bg-white/[5%]"
      onContextMenu={(e) => {}}
    >
      <OverlayIcon
        optionalYoutubeId={data.id}
        thumbnailURL={data.thumbnail}
        width={"8vw"}
        height={"8vw"}
        iconStyle={{
          overflow: "hidden",
          margin: "1%",
        }}
        onClick={async () => {
          if (!isNowPlaying) {
            await handlePlay();
          } else {
            playerPaused ? audioPlayer?.play() : audioPlayer?.pause();
          }
        }}
      >
        {waiting ? (
          <LoadingSpinner size={"50%"} fill={"#e8eaed"} opacity={0.8} />
        ) : isNowPlaying && !playerPaused ? (
          <PauseSymbol size={"50%"} fill={"#e8eaed"} opacity={0.8} />
        ) : (
          <PlaySymbol size={"50%"} fill={"#e8eaed"} opacity={0.8} />
        )}
      </OverlayIcon>

      <span className="grow max-w-[60%]">
        <span className="flex items-center justify-starttext-sm whitespace-nowrap text-ellipsis w-full h-[10%] text-sm gap-1 opacity-60">
          <p>{type}</p>
          <p>•</p>
          <p>
            {(type === "SONG" || type === "VIDEO") &&
              formatSongDuration((data as SongData).duration)}
          </p>
        </span>
        <span>
          <span className="flex justify-start items-center text-lg whitespace-nowrap text-ellipsis w-full gap-2">
            {type === "SONG" || type === "VIDEO"
              ? (data as SongData).title
              : (data as AlbumData | ArtistData | PlaylistMetadata).name}
            {type === "SONG" &&
              ((data as SongData).explicit ? (
                <Explcit size={"22px"} opacity={0.6} />
              ) : (
                <></>
              ))}
          </span>
          <h1 className="text-base whitespace-nowrap text-ellipsis w-full">
            {type === "SONG" || type === "VIDEO" || type === "ALBUM"
              ? (data as SongData | AlbumData).artist.name
              : type === "PLAYLIST" && (data as PlaylistMetadata).owner.name}
          </h1>
        </span>
      </span>

      <span className="flex justify-end items-center gap-2 min-w-[35%] max-w-[50%] h-full">
        <button
          className="text-base rounded-full px-[1vw] py-[0.5vh] hover:ring ring-accentColor/50 disabled:ring-0 whitespace-nowrap text-ellipsis overflow-hidden"
          onClick={async () => {
            if (!isNowPlaying) {
              await handlePlay();
            } else {
              playerPaused ? audioPlayer?.play() : audioPlayer?.pause();
            }
          }}
          style={{
            opacity: waiting ? 0.5 : 1,
            backgroundColor: COLORS.ACCENT,
          }}
        >
          {isNowPlaying && !playerPaused ? (
            <span className="flex items-center justify-center gap-2">
              <PauseSymbol size={"24px"} fill={"#e8eaed"} opacity={1} />
              <p>Pause</p>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <PlaySymbol size={"24px"} fill={"#e8eaed"} opacity={1} />
              <p>{!isNowPlaying ? "Play" : audioPlayer?.paused && "Resume"}</p>
            </span>
          )}
        </button>
        <button
          className="text-base rounded-full px-[1vw] py-[0.5vh] hover:ring ring-accentColor/50 disabled:ring-0  whitespace-nowrap text-ellipsis overflow-hidden"
          onClick={async () => {
            if (addedToQueue) {
              await handleDequeue();
              setAddedToQueue(false);
            } else {
              await handleEnqueue();
              setAddedToQueue(true);
            }
          }}
          disabled={waiting || !Boolean(user)}
          style={{
            opacity: waiting || !Boolean(user) ? 0.5 : 1,
            backgroundColor: COLORS.ACCENT,
          }}
        >
          {addedToQueue ? (
            <span className="flex items-center justify-center gap-2">
              <Minus size={"24px"} fill={"#e8eaed"} opacity={1} />
              <p>Remove from queue</p>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Plus size={"24px"} fill={"#e8eaed"} opacity={1} />
              <p>Add to queue</p>
            </span>
          )}
        </button>
        <span
          //type="button"
          className="w-[10%] h-[20%] flex items-center justify-center relative hover:cursor-pointer hover:scale-110"
        >
          <MoreVertical size={"30px"} opacity={0.8} />
        </span>
      </span>
    </div>
  );
}

const fetchSongs = async (
  type: "ALBUM" | "PLAYLIST",
  id: string
): Promise<SongData[]> => {
  const endpoint =
    type === "ALBUM" ? `/data/album?id=${id}` : `/data/playlist/items?id=${id}`;
  const res = await fetch(endpoint);

  if (res.status === 200) {
    const data = await res.json();
    return type === "ALBUM" ? (data.songs as SongData[]) : (data as SongData[]);
  }

  return [];
};
