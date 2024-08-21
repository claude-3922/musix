import React, { useEffect, useRef } from "react";

interface PreviewProps {
  vidEnabled: boolean;
  songId: string;
  thumbnail: string;
  audioPlayer: HTMLAudioElement | null;
}

export default function Preview({
  vidEnabled,
  songId,
  thumbnail,
  audioPlayer,
}: PreviewProps) {
  const videoPlayer = useRef<HTMLVideoElement | null>(null);

  const vidSrc = `/media?id=${songId}&vid=1`;

  if (audioPlayer) {
    return (
      <div
        className={`videoContainer flex items-center justify-center w-[48vw] h-[52.5vh] mt-[2vh] rounded-xl bg-custom_d_gray/50 overflow:hidden`}
      >
        <video
          id="videoPlayer"
          ref={videoPlayer}
          className="flex object-cover h-[360px] hover:ring rounded-xl"
          src={vidEnabled ? vidSrc : ""}
          poster={thumbnail}
          onTimeUpdate={() => {
            if (videoPlayer.current) {
              syncVideoToAudio(audioPlayer, videoPlayer.current);
            }
          }}
          onClick={() => {
            audioPlayer.paused ? audioPlayer.play() : audioPlayer.pause();
          }}
        />
      </div>
    );
  } else {
    console.log("Audio element doesn't exist. This really shouldn't happen");
  }
}

const syncVideoToAudio = (audio: HTMLAudioElement, video: HTMLVideoElement) => {
  if (Math.abs(audio.currentTime - video.currentTime) >= 0.25) {
    video.currentTime = audio.currentTime;
    console.log(`Video time changed`);
  }
};
