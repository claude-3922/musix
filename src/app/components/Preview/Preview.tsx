/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { pSBC } from "@/util/pSBC";
import { SongData } from "@/util/types/SongData";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import Lyrics from "./Lyrics/Lyrics";

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
  const videoPlayer = useRef<HTMLVideoElement | null>(null);

  const [activeTab, setActiveTab] = useState(1);
  const [previousTab, setPreviousTab] = useState(activeTab);

  useEffect(() => {
    setPreviousTab(activeTab);
  }, [activeTab]);

  if (audioPlayer && songData) {
    const { vid, owner, playerInfo } = songData;
    const vidSrc = `/media?id=${songData.vid.id}&vid=1`;

    const animationIntensity = 300;

    const darkerAccent = pSBC(0.9, playerInfo.topColor, "#191919");
    const darkerDarkerAccent = pSBC(0.97, playerInfo.topColor, "#191919");
    const darkestDarkerAccent = pSBC(0.99, playerInfo.topColor, "#191919");

    return (
      <div
        className="scrollbar-hide flex flex-col items-center justify-center w-[100vw] h-[83.25vh] overflow-y-hidden"
        style={{
          background: `linear-gradient(135deg, 
          ${darkestDarkerAccent} 0%, 
          ${darkerDarkerAccent} 30%, 
          ${darkerAccent} 50%, 
          ${darkerDarkerAccent} 70%, 
          ${darkestDarkerAccent} 100%)`,
        }}
      >
        <div className="flex items-center justify-center">
          <button
            onClick={() => setActiveTab(1)}
            className="flex items-center justify-center my-[2vh] mx-[0.5vw] p-[0.5vw]"
            style={{
              borderBottom: activeTab === 1 ? "solid 2px white" : "none",
            }}
          >
            <img className="w-[2vw] h-[2vw]" src="icons/playFill.svg" />
          </button>
          <button
            onClick={() => setActiveTab(2)}
            className="my-[1vh] mx-[0.5vw]"
            style={{
              borderBottom: activeTab === 2 ? "solid 2px white" : "none",
            }}
          >
            LYRICS
          </button>
          <button
            onClick={() => setActiveTab(3)}
            className="my-[1vh] mx-[0.5vw]"
            style={{
              borderBottom: activeTab === 3 ? "solid 2px white" : "none",
            }}
          >
            QUEUE
          </button>
        </div>
        {activeTab === 1 && (
          <motion.div
            key="preview"
            initial={{
              x:
                activeTab > previousTab
                  ? animationIntensity
                  : -animationIntensity,
              opacity: 0,
            }}
            animate={{ x: 0, opacity: 1 }}
            exit={{
              x:
                activeTab > previousTab
                  ? -animationIntensity
                  : animationIntensity,
              opacity: 0,
            }}
            transition={{ duration: 0.125 }}
          >
            <video
              id="videoPlayer"
              ref={videoPlayer}
              className="h-[36vw] object-cover hover:ring rounded-[4px]"
              src={vidEnabled ? vidSrc : ""}
              poster={songData.vid.thumbnail}
              onTimeUpdate={() => {
                if (videoPlayer.current) {
                  syncVideoToAudio(audioPlayer, videoPlayer.current);
                }
              }}
              onClick={() => {
                audioPlayer.paused ? audioPlayer.play() : audioPlayer.pause();
              }}
              autoPlay={audioPlayer.paused ? false : true}
            />
          </motion.div>
        )}
        {activeTab === 2 && (
          <motion.div
            key="lyrics"
            initial={{
              x:
                activeTab > previousTab
                  ? animationIntensity
                  : -animationIntensity,
              opacity: 0,
            }}
            animate={{ x: 0, opacity: 1 }}
            exit={{
              x:
                activeTab > previousTab
                  ? -animationIntensity
                  : animationIntensity,
              opacity: 0,
            }}
            transition={{ duration: 0.125 }}
          >
            <Lyrics title={`${songData.owner.title} - ${songData.vid.title}`} />
          </motion.div>
        )}
        {activeTab === 3 && (
          <motion.div
            key="queue"
            initial={{
              x:
                activeTab > previousTab
                  ? animationIntensity
                  : -animationIntensity,
              opacity: 0,
            }}
            animate={{ x: 0, opacity: 1 }}
            exit={{
              x:
                activeTab > previousTab
                  ? -animationIntensity
                  : animationIntensity,
              opacity: 0,
            }}
            transition={{ duration: 0.125 }}
          ></motion.div>
        )}
        {activeTab === 4 && (
          <motion.div
            key="history"
            initial={{
              x:
                activeTab > previousTab
                  ? animationIntensity
                  : -animationIntensity,
              opacity: 0,
            }}
            animate={{ x: 0, opacity: 1 }}
            exit={{
              x:
                activeTab > previousTab
                  ? -animationIntensity
                  : animationIntensity,
              opacity: 0,
            }}
            transition={{ duration: 0.125 }}
          ></motion.div>
        )}
      </div>
    );
  }
}

const syncVideoToAudio = (audio: HTMLAudioElement, video: HTMLVideoElement) => {
  if (Math.abs(audio.currentTime - video.currentTime) >= 0.25) {
    video.currentTime = audio.currentTime;
    console.log(`Video time changed`);
  }
};
