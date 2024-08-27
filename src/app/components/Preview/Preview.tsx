import { SongData } from "@/util/types/SongData";
import React, { useEffect, useRef, useState } from "react";
import PreviewLoading from "./PreviewLoading";

interface PreviewProps {
  vidEnabled: boolean;
  songData: SongData | null;
  audioPlayer: HTMLAudioElement | null;
}

export default async function Preview({
  vidEnabled,
  songData,
  audioPlayer,
}: PreviewProps) {
  const videoPlayer = useRef<HTMLVideoElement | null>(null);

  if (audioPlayer && songData) {
    const vidSrc = `/media?id=${songData.vid.id}&vid=1`;

    return (
      <div
        className={`videoContainer flex items-center justify-center mt-[2vh]`}
        style={{
          animation: "slideIn 0.06s linear",
        }}
      >
        <video
          id="videoPlayer"
          ref={videoPlayer}
          className="flex bg-black object-cover max-w-[80vw] max-h-[70vh] hover:ring rounded-xl"
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
