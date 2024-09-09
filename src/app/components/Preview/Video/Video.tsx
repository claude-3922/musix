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
    <div className="flex justify-center items-center relative w-[60vw] h-[36vw] rounded-[4px] bg-black">
      <video
        id="videoPlayer"
        ref={(r) => videoPlayer.set(r)}
        className="absolute z-[1] h-[36vw] left-[20%] top-[0%] rounded-[4px] object-cover"
        src={`/media?id=${songData.id}&vid=1`}
        onTimeUpdate={timeUpdateHandler}
        onClick={clickHandler}
        onLoadStart={loadingHandler}
        onWaiting={loadingHandler}
        onCanPlay={playHandler}
        autoPlay
      />
    </div>
  );
}

const syncVideoToAudio = (audio: HTMLAudioElement, video: HTMLVideoElement) => {
  if (Math.abs(audio.currentTime - video.currentTime) >= 0.25) {
    video.currentTime = audio.currentTime;
    console.log("Video time changed");
  }
};
