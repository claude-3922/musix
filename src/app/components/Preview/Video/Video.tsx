import { SongData } from "@/util/types/SongData";
import { StateManager } from "@/util/types/StateManager";
import React, { useEffect, useState } from "react";
import { loadingSpinner } from "../../Player/Controls";
import { pSBC } from "@/util/pSBC";

interface VideoProps {
  songData: SongData;
  audioPlayer: HTMLAudioElement;
  videoPlayer: StateManager<HTMLVideoElement | null>;
  enabled: boolean;
}

export default function Video({
  songData,
  audioPlayer,
  videoPlayer,
  enabled,
}: VideoProps) {
  const [loading, setLoading] = useState(false);

  const clickHandler = () => {
    audioPlayer.paused ? audioPlayer.play() : audioPlayer.pause();
  };

  const timeUpdateHandler = () => {
    if (!videoPlayer.get) return;
    syncVideoToAudio(audioPlayer, videoPlayer.get);
  };

  const loadingHandler = () => {
    setLoading(true);
  };

  const playHandler = () => {
    setLoading(false);
  };

  const videoContainerStyles = (video: HTMLVideoElement) => ({
    height: video.clientHeight,
    width: video.clientWidth,
  });

  return (
    <div className="relative w-[60vw] h-[36vw] rounded-[4px]">
      <video
        id="videoPlayer"
        ref={(r) => videoPlayer.set(r)}
        className="absolute z-[1] w-[60vw] h-[36vw] left-[0%] top-[0%] rounded-[4px] object-contain"
        src={`/media?id=${songData.id}&vid=1`}
        poster={songData.thumbnail}
        onTimeUpdate={timeUpdateHandler}
        onClick={clickHandler}
        onLoadStart={loadingHandler}
        onWaiting={loadingHandler}
        onCanPlay={playHandler}
        autoPlay={!audioPlayer.paused}
      />

      {loading && enabled && (
        <div
          className="flex items-center justify-center absolute z-[2] left-[0%] top-[0%] bg-black/50"
          style={videoPlayer.get ? videoContainerStyles(videoPlayer.get) : {}}
        >
          {loadingSpinner("5vw", "5vw")}
        </div>
      )}
    </div>
  );
}

const syncVideoToAudio = (audio: HTMLAudioElement, video: HTMLVideoElement) => {
  if (Math.abs(audio.currentTime - video.currentTime) >= 0.25) {
    video.currentTime = audio.currentTime;
    console.log("Video time changed");
  }
};
