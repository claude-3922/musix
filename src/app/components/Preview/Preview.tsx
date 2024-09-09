/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { pSBC } from "@/util/pSBC";
import { SongData } from "@/util/types/SongData";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import Lyrics from "./Lyrics/Lyrics";
import { useLiveQuery } from "dexie-react-hooks";
import { queueDB } from "@/db/queueDB";
import Queue from "./Queue/Queue";
import History from "./Queue/History";
import useStateManager from "@/app/hooks/StateManager";
import Video from "./Video/Video";
import { COLORS } from "@/util/enums/colors";
import OverlayIcon from "../Util/OverlayIcon";

interface PreviewProps {
  vidEnabled: boolean;
  songData: SongData | null;
  audioPlayer: HTMLAudioElement | null;
}

export default function Preview({
  vidEnabled,
  songData,
  audioPlayer,
}: PreviewProps) {
  const videoPlayerState = useStateManager<HTMLVideoElement | null>(null);

  const queue = useLiveQuery(() => queueDB.queue.toArray());
  const history = useLiveQuery(() => queueDB.history.toArray());

  if (!audioPlayer || !songData) return null;

  const clickHandler = () => {
    audioPlayer.paused ? audioPlayer.play() : audioPlayer.pause();
  };

  const timeUpdateHandler = () => {
    if (!videoPlayerState.get) return;
    syncVideoToAudio(audioPlayer, videoPlayerState.get);
  };

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
          src={`/media?id=${songData.id}&vid=1`}
          onTimeUpdate={timeUpdateHandler}
          onClick={clickHandler}
          autoPlay
          className="h-[93.3%] w-[63.3%] object-cover rounded-l-3xl mx-[1vw]"
        ></video>
        <span className="flex flex-col justify-evenly items-center h-[93.3%] w-full bg-white/10 rounded-r-3xl">
          <span className="flex gap-4 justify-center items-center">
            <button>LYRICS</button>
            <button>QUEUE</button>
            <button>HISTORY</button>
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
