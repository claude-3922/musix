import { SongData } from "@/util/types/SongData";
import { StateManager } from "@/util/types/StateManager";
import React, { useEffect, useState } from "react";
import { loadingSpinner } from "../../Player/Controls";

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
    <div
      className="relative my-[1vh] rounded-[4px] hover:ring"
      style={
        videoPlayer.get
          ? videoContainerStyles(videoPlayer.get)
          : {
              width: "0vw",
              height: "0vh",
            }
      }
    >
      {videoPlayer.get && (
        <video
          id="videoPlayer"
          ref={(r) => videoPlayer.set(r)}
          className="absolute w-[50vw] h-[30vw] z-[1] left-[0%] top-[0%] object-cover"
          src={enabled ? `/media?id=${songData.vid.id}&vid=1` : ""}
          poster={songData.vid.thumbnail}
          onTimeUpdate={timeUpdateHandler}
          onClick={clickHandler}
          onLoadStart={loadingHandler}
          onWaiting={loadingHandler}
          onCanPlay={playHandler}
          autoPlay={!audioPlayer.paused}
        />
      )}
      {loading && (
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
