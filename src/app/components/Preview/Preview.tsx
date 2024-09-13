/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { pSBC } from "@/util/pSBC";
import { SongData } from "@/util/types/SongData";
import { AnimatePresence, motion } from "framer-motion";
import React, { use, useEffect, useMemo, useRef, useState } from "react";

import { useLiveQuery } from "dexie-react-hooks";
import { queueDB } from "@/db/queueDB";

import useStateManager from "@/app/hooks/StateManager";

import { COLORS } from "@/util/enums/colors";
import OverlayIcon from "../Util/OverlayIcon";
import { PREVIEW_TAB_STATES } from "@/util/enums/previewTabState";
import Suggestions from "./Suggestions";
import { StateManager } from "@/util/types/StateManager";
import Lyrics from "./Lyrics";
import NowPlaying from "./NowPlaying";

interface PreviewProps {
  songData: SongData | null;
  audioPlayer: HTMLAudioElement | null;
  songState: StateManager<SongData | null>;
}

export default function Preview({
  songData,
  audioPlayer,
  songState,
}: PreviewProps) {
  const videoPlayerState = useStateManager<HTMLVideoElement | null>(null);
  const previewPageState = useStateManager<PREVIEW_TAB_STATES>(
    PREVIEW_TAB_STATES.NowPlaying
  );

  // const queue = useLiveQuery(() => queueDB.queue.toArray());
  // const history = useLiveQuery(() => queueDB.history.toArray());

  if (!audioPlayer || !songData) return null;

  const clickHandler = () => {
    audioPlayer.paused ? audioPlayer.play() : audioPlayer.pause();
  };

  const timeUpdateHandler = () => {
    if (!videoPlayerState.get) return;
    syncVideoToAudio(audioPlayer, videoPlayerState.get);
  };

  const buttons = [
    { label: "Now Playing", state: PREVIEW_TAB_STATES.NowPlaying },
    { label: "Suggestions", state: PREVIEW_TAB_STATES.Suggestions },
    { label: "Lyrics", state: PREVIEW_TAB_STATES.Lyrics },
    { label: "Queue", state: PREVIEW_TAB_STATES.Queue },
    { label: "History", state: PREVIEW_TAB_STATES.History },
  ];

  return (
    <div className="flex justify-center items-center gap-2 w-[90%] h-[90%] scrollbar-hide overflow-x-hidden">
      <video
        ref={(r) => videoPlayerState.set(r)}
        id="videoPlayer"
        poster={songData.thumbnail}
        src={`api/media?id=${songData.id}&vid=1`}
        onTimeUpdate={timeUpdateHandler}
        onClick={clickHandler}
        autoPlay
        className="h-full w-[45%] object-cover"
      ></video>

      <div className="flex flex-col justify-between items-center h-full w-full border-y-1 border-r-1 gap-4 grow">
        <span className="flex gap-4 justify-center items-center w-full py-1">
          {buttons.map(({ label, state }) => (
            <button
              key={label}
              onClick={() => previewPageState.set(state)}
              className="text-base rounded-full px-[0.75vw] py-[0.33vw] hover:ring hover:ring-accentColor/50 disabled:ring-0"
              style={{
                backgroundColor:
                  previewPageState.get === state ? COLORS.ACCENT : "",
                transition: "background-color 0.125s ease-in-out",
              }}
              disabled={previewPageState.get === state}
            >
              {label}
            </button>
          ))}
        </span>
        <span className="h-full w-full overflow-y-scroll overflow-x-hidden">
          {previewPageState.get === PREVIEW_TAB_STATES.NowPlaying && (
            <NowPlaying data={songData} />
          )}
          {previewPageState.get === PREVIEW_TAB_STATES.Suggestions && (
            <Suggestions
              currentSongId={songData?.id || null}
              songState={songState}
            />
          )}
          {previewPageState.get === PREVIEW_TAB_STATES.Lyrics && (
            <Lyrics
              trackName={songData.title}
              albumName={songData.album?.name || ""}
              artistName={songData.artist.name}
              duration={songData.duration}
              audioPlayer={audioPlayer}
            />
          )}
        </span>
      </div>
    </div>
  );
}

const syncVideoToAudio = (audio: HTMLAudioElement, video: HTMLVideoElement) => {
  if (Math.abs(audio.currentTime - video.currentTime) >= 0.25) {
    video.currentTime = audio.currentTime;
    console.log("Video time changed");
  }
};
