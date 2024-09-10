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

interface PreviewProps {
  vidEnabled: boolean;
  songData: SongData | null;
  audioPlayer: HTMLAudioElement | null;
  songState: StateManager<SongData | null>;
}

export default function Preview({
  vidEnabled,
  songData,
  audioPlayer,
  songState,
}: PreviewProps) {
  const videoPlayerState = useStateManager<HTMLVideoElement | null>(null);
  const previewPageState = useStateManager<PREVIEW_TAB_STATES>(
    PREVIEW_TAB_STATES.Suggestions
  );
  const suggestionsState = useStateManager<SongData[] | null>(null);

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
    { label: "Suggestions", state: PREVIEW_TAB_STATES.Suggestions },
    { label: "Lyrics", state: PREVIEW_TAB_STATES.Lyrics },
    { label: "Queue", state: PREVIEW_TAB_STATES.Queue },
    { label: "History", state: PREVIEW_TAB_STATES.History },
  ];

  return (
    <div
      className="scrollbar-hide flex items-center justify-center w-[100vw] h-[83.25vh] overflow-y-hidden"
      style={{
        backgroundColor: COLORS.BG,
      }}
    >
      <div className="flex justify-center items-center w-[90vw] h-[40vw] rounded-l">
        <video
          ref={(r) => videoPlayerState.set(r)}
          id="videoPlayer"
          poster={songData.thumbnail}
          src={`/media?id=${songData.id}&vid=1`}
          onTimeUpdate={timeUpdateHandler}
          onClick={clickHandler}
          autoPlay
          className="h-[93.3%] w-[50%] object-cover rounded-l-3xl"
        ></video>
        <span
          className="flex flex-col justify-evenly items-center h-[93.3%] w-full rounded-r-3xl transition-[width_0.125s_ease-in-out]"
          style={{
            backgroundColor: `${pSBC(0.4, COLORS.BG, "#000000")}`,
          }}
        >
          <span className="flex gap-4 justify-center items-center">
            {buttons.map(({ label, state }) => (
              <button
                key={label}
                onClick={() => previewPageState.set(state)}
                className="text-base rounded-full px-[0.75vw] py-[0.33vw] hover:ring hover:ring-accentColor/50"
                style={{
                  backgroundColor:
                    previewPageState.get === state ? COLORS.ACCENT : "",
                  transition: "all 0.125s ease-in-out",
                }}
              >
                {label}
              </button>
            ))}
          </span>
          <span className=" h-[85%] w-[95%] rounded-br-3xl overflow-y-scroll scrollbar-hide">
            {previewPageState.get === PREVIEW_TAB_STATES.Suggestions && (
              <Suggestions
                currentSongId={songData?.id || null}
                songState={songState}
                suggestionsState={suggestionsState}
              />
            )}
            {previewPageState.get === PREVIEW_TAB_STATES.Lyrics && (
              <Lyrics
                trackName={songData.title}
                albumName={songData.album?.name || ""}
                artistName={songData.artist.name}
                duration={songData.duration}
              />
            )}
          </span>
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
